import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config(object):
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png',
            'jpg', 'jpeg', 'gif', 'mp4', 'mov'}
    MAX_CONTENT_LENGTH = 16 * (2**30)
    UPLOAD_DIR = 'app/static/uploads/'
    PERSONAL_API_TOKENS = {}
    GLOBAL_API_TOKENS = {}

