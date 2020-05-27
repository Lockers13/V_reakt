from app import app
from flask import render_template, flash, redirect, url_for, request
from app.forms import LoginForm
from flask_login import current_user, login_user, logout_user
from app.models import User
from flask_login import login_required
from flask import request
from werkzeug.urls import url_parse
from app import db
from app.forms import RegistrationForm, LoginForm
from app.models import Video, User, Reaction
import subprocess
import os
from werkzeug.utils import secure_filename
import json
import time
import secrets



def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config["ALLOWED_EXTENSIONS"]

@app.route("/")
@app.route("/index")
@login_required
def index():
    videos = Video.query.all()
    return render_template('index.html', videos=videos)


@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('record_vid'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('login'))
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('index')
        return redirect(next_page)
    return render_template('login.html', title='Sign In', form=form)

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)

@app.route("/record", methods=['GET', 'POST'])
def record_vid():
    if request.method == 'GET':
        video_id = request.args.get('vid', type=int)
    if request.method == 'POST':
        uid = User.query.filter_by(username=request.form["user"]).first().id
        vid_id = Video.query.filter_by(path=request.form["vid"]).first().id
        # check if the post request has the file part
        if not request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            UPLOAD = "uploaded_recs/user_{0}/vid_{1}/".format(uid, vid_id)
            try:
                os.makedirs(os.path.join(app.config['UPLOAD_DIR'], UPLOAD))
            except:
                pass
            file.save(os.path.join(app.config['UPLOAD_DIR'], UPLOAD, str(filename)))
            subprocess.Popen([
                "python", os.path.join(os.getcwd(), "analyze_reaction.py"),
                 "-vr", os.path.join(UPLOAD, str(filename)),
                  "-vw", str(request.form["vid"]),
                 "-e", str(request.form["email"]),
                 "-u", str(request.form["user"])
                 ])
            return redirect(url_for('index'))
            #return 'Upload Successful - You will be notified by email once your video has been processed.'
    return render_template("reaction_rec.html", title="Home Page", video=Video.query.filter_by(id=video_id).first())

@app.route('/reactions/<int:vid_id>')
@login_required
def react(vid_id):
    reaction = Reaction.query.filter_by(user_id=current_user.id, video_id=vid_id).first()
    if reaction is not None:
        reaction_list = json.loads(reaction.reaction_string)
        video = Video.query.filter_by(id=vid_id).first()
        token = secrets.token_urlsafe(16)
        app.config['API_AUTH_DIR'][current_user.id] = token
        return render_template('chart_view.html', video=video, ip=request.host_url, token=token)
    videos = Video.query.all()
    return render_template('index.html', videos=videos)


@app.route('/reaction_stats')
@login_required
def reaction_stats():
    if request.method == 'GET':
        video_id = request.args.get('vid', type=int)
        print("HELLO, video_id =", video_id)
        if video_id is None:
            print("HELLO")
            videos = Video.query.filter_by(user_id=current_user.id).all()
            return render_template('reaction_stats.html', videos=videos)
        else:
            video = Video.query.filter_by(id=video_id).first()
            if video.reactions is not None:
                return render_template('stats_view.html', video=video)
            else:
                return 'NO REACTIONS BITCH!'

    return redirect(url_for('index'))







