from app import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from app import login

@login.user_loader
def load_user(id):
    return User.query.get(int(id))

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    reactions = db.relationship('Reaction', backref='reaktor', lazy='dynamic')
    videos = db.relationship('Video', backref='creator', lazy='dynamic') 
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return '<User {}>'.format(self.username)

class Reaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reaction_string = db.Column(db.Text(16000000))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    video_id = db.Column(db.Integer, db.ForeignKey('video.id'))
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)

    def __repr__(self):
        return '<Reaction String: {}>'.format(self.reaction_string[:5])

class Video(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    path = db.Column(db.String(120), index=True, unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    reactions = db.relationship('Reaction', backref='react_to', lazy='dynamic')

    def __repr__(self):
        return '<Video: {}>'.format(self.path)
 





