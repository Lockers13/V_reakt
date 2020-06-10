from imutils import face_utils
import argparse
import imutils
import time
import dlib
import cv2
import numpy as np
import sys
import json
import os
import subprocess
from app import app, db, email
from app.models import User, Reaction, Video

def send_email_resp(args, success=True):
    video = Video.query.filter_by(path=args["video_watched"]).first()
    if success:
        text = None
        html = "Your reaktion was processed successfully...!<br><br><a href='http://localhost:5000/reactions/" + \
            str(video.id) + "'>Click here to view your personal Reaktion graph!</a>"
    else:
        text = "There was an unexpected error processing your video, please try again."
        html=None
    email.send_email("Virtual Reaktion!", app.config['MAIL_USERNAME'],
               [args["email"]], text, html)
               

def update_db(db, args, reaction_json):
    user = User.query.filter_by(username=args["user"]).first()
    video = Video.query.filter_by(path=args["video_watched"]).first()
    reaction = Reaction.query.filter_by(user_id=user.id, video_id=video.id).first()
    
    if reaction is None:
        db.session.add(Reaction(reaction_string=reaction_json, user_id=user.id, video_id=video.id))
    else:
        reaction.reaction_string = reaction_json
    
    db.session.commit()


def checkdir_makeifnot(dir_file):
    try:
        os.makedirs(dir_file)
    except FileExistsError:
        pass

    
def process_list(smile_degree, fps):
    smile_degree = np.array([round(x*100,2) for x in smile_degree])
    mean = np.mean(smile_degree)

    min_smile = np.min(smile_degree)

    smile_degree -= (min_smile)
    smile_degree += 10
    max_smile = np.max(smile_degree)
    smile_degree *= 100/max_smile
    smile_degree = (np.round(np.convolve(smile_degree, np.ones((5,))/5, mode="same"), 2))
    
    smile_degree = list(smile_degree)
    time_coords = [round(frame/fps, 2) for frame in range(len(smile_degree))]
    return time_coords, smile_degree

def parse_clargs():
    ap = argparse.ArgumentParser() 
    ap.add_argument("-vr", "--video_rec", type=str, required=True,
                help="path to recorded video file")
    ap.add_argument("-vw", "--video_watched", type=str, required=True,
                help="path to watched video file")
    ap.add_argument("-e", "--email", type=str, required=True,
                help="user email address")
    ap.add_argument("-u", "--user", type=str, required=True,
                help="username")
    return vars(ap.parse_args())

def process_video(cap, detector, predictor):
    
    def get_dblc_norm(shape):
        dblc = shape[54][0] - shape[48][0]
        db_ears = shape[16][0] - shape[0][0]
        dblc_norm = dblc/db_ears
        return dblc_norm

    undetected = 0
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    fps_div = fps//2
    smile_degree = []
    frame_count = 1
    ret, frame = cap.read()
    frame = imutils.resize(frame, width=400)
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    rects = detector(gray, 0)

    while not rects:
        ret, frame = cap.read()
        frame_count += 1
        frame = imutils.resize(frame, width=400)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        rects = detector(gray, 0)
        undetected += 1
        if undetected > 50:
            with app.app_context():
                send_email_resp(args, success=False)
            print("Oops, error during processing!")
            sys.exit(1)
        
            
        
    for rect in rects:
        shape = predictor(gray, rect)
        shape = face_utils.shape_to_np(shape)
        dblc_norm = get_dblc_norm(shape)
        smile_degree.append(dblc_norm)

    while True:
        try:
            ret, frame = cap.read()
            frame_count += 1
            if ret == 0: 
                break
            if frame_count % (fps_div*2) == 0 or frame_count % fps_div == 0:
                frame = imutils.resize(frame, width=400)
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

                rects = detector(gray, 0)
                if not rects:
                    undetected += 1
                    smile_degree.append(dblc_norm)
                else:
                    for rect in rects:
                        shape = predictor(gray, rect)
                        shape = face_utils.shape_to_np(shape)
                        dblc_norm = get_dblc_norm(shape)
                        smile_degree.append(dblc_norm)
            else:
                smile_degree.append(dblc_norm)
            if undetected > 50:
                with app.appcontext():
                    send_email_resp(args, success=False)
                print("Oops, error during processing!")
                sys.exit(1)
        except:
            with app.appcontext():
                send_email_resp(args, success=False)
            print("Oops, error during processing!")
            sys.exit(1)

    cap.release()
    return smile_degree, fps


args = parse_clargs()

shape_predictor = "shape_predictor_68_face_landmarks.dat" # path to dlib shape predictor

detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(shape_predictor)


video2process = app.config["UPLOAD_DIR"] + "temp_" + os.path.basename(args["video_rec"]) # make a temp output file for ffmpeg processing

# The following subprocess call involves necessary ffmpeg processing to allow cv2 to read video file.
# For some reason, cv2.videocapture does not work with mp4 downloaded with codecs h264 from google chrome
subprocess.run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "warning", "-i", app.config['UPLOAD_DIR'] + args["video_rec"], "-c", "copy", video2process], cwd=os.getcwd()) 

cap = cv2.VideoCapture(video2process)

smile_degree, fps = process_video(cap, detector, predictor)

time_coords, smile_degree = process_list(smile_degree, fps)

reaction_json = json.dumps(list(zip(time_coords, smile_degree)))

os.remove(video2process)
os.remove(app.config['UPLOAD_DIR'] + args["video_rec"])

try:
    update_db(db, args, reaction_json)
except Exception as e:
    print("Error interacting with database")
    print("Error message =", str(e))

with app.app_context():
    send_email_resp(args)

print("DONE!")