from app import app
from flask import render_template, flash, redirect, url_for, request
from flask_login import current_user
from flask_login import login_required
from flask import request
from werkzeug.urls import url_parse
from app import db
from app.models import Video, User, Reaction
import subprocess
import os
import json
import time 

@app.route('/api/statistics/personal_reaction/<int:user_id>/<int:vid_id>/<auth_token>')
def get_reaction(user_id, vid_id, auth_token):
    try:
        authorize = app.config['API_AUTH_DIR'][user_id]
        if authorize == auth_token:
            del app.config['API_AUTH_DIR'][user_id]
            reaction = Reaction.query.filter_by(user_id=user_id, video_id=vid_id).first()
            return reaction.reaction_string
    except KeyError:
        print("PRIVATE API, SORRY!")
        return ""
    