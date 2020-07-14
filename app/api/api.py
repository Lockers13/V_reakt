from app import app
from flask import render_template, flash, redirect, url_for, request
from flask_login import current_user
from flask_login import login_required
from flask import request
from werkzeug.urls import url_parse
from app import db
from app.models import Video, User, Reaction
import os
import json
import time 

@app.route('/api/statistics/personal_reaction/<int:user_id>/<int:vid_id>/<auth_token>')
def get_reaction(user_id, vid_id, auth_token):
    try:
        authorize = app.config['PERSONAL_API_TOKENS'][user_id]
        if authorize == auth_token:
            del app.config['PERSONAL_API_TOKENS'][user_id]
            reaction = Reaction.query.filter_by(user_id=user_id, video_id=vid_id).first()
            return reaction.reaction_string
    except KeyError:
        print("PRIVATE API, SORRY!")
        
    return ""

@app.route('/api/statistics/global_reactions/<int:vid_id>/<int:user_id>/<auth_token>')
def view_reactions(vid_id, user_id, auth_token):
    try:
        authorize = app.config['GLOBAL_API_TOKENS'][user_id] 
        if authorize == auth_token:
            del app.config['GLOBAL_API_TOKENS'][user_id]
            reactions = Reaction.query.filter_by(video_id=vid_id).limit(5).all()
            reaction_data = []
            for reaction in reactions:
                reaction_data.append(reaction.reaction_string)
            return json.dumps(reaction_data)
    except KeyError:
        print("PRIVATE API, SORRY!")

    return ""

@app.route("/api/emoji_graph", methods=["GET", "POST"])
def graph_upload():
    if request.method == 'POST':
        data = request.get_json()
        if data is not None:
            return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 
    elif request.method == 'GET':
        return "hey"


