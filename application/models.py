from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
import jwt
from datetime import datetime, timedelta

db = SQLAlchemy()




class User(db.Model, UserMixin):
    u_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=False)
    email=db.Column(db.String, unique=True)
    password=db.Column(db.String(255))
    active = db.Column(db.Boolean)
    fs_uniquifier=db.Column(db.String(255), unique=True)
    roles = db.relationship('Role', secondary='roles_users',
                         backref=db.backref('users', lazy='dynamic'))






class Role(db.Model):
    id = db.Column(db.Integer(), primary_key= True)
    name = db.Column(db.String(80), unique= True)
    description = db.Column(db.String)



class RolesUsers(db.Model, RoleMixin):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.u_id'))
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))



class Song(db.Model):
    __tablename__ = 'song'
    id = db.Column(db.Integer, primary_key=True)
    title=db.Column(db.String(40), nullable=False)
    album_id=db.Column(db.Integer, db.ForeignKey('album.id'))
    lyrics=db.Column(db.String, nullable=False)
    duration=db.Column(db.Integer, nullable=False)
    genre=db.Column(db.String(80), nullable=False)
    artist_name=db.Column(db.String, nullable=False)
    filename=db.Column(db.String, nullable=True)
    likes=db.Column(db.Integer, default=0)
    dislikes=db.Column(db.Integer, default=0)








class Album(db.Model):
    __tablename__='album'
    id=db.Column(db.Integer, primary_key=True)
    title=db.Column(db.String, unique=True ,nullable=False)
    c_name=db.Column(db.String, nullable=False)
    year=db.Column(db.Date, nullable=True)
    songs=db.relationship('Song', backref='album', lazy=True )





# Many-to-Many relation between playlist and song.......................


playlist_song_table = db.Table('playlist_song', 
    db.Column('playlist_id', db.Integer, db.ForeignKey('playlist.id'), primary_key=True),
    db.Column('song_id', db.Integer, db.ForeignKey('song.id'), primary_key=True)                          
)


class Playlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            
        }
    # user_id = db.Column(db.Integer, db.ForeignKey('user.u_id'), nullable=False)
    # songs = db.relationship('Song', secondary=playlist_song_table, backref='playlists', lazy=True, primaryjoin=(id == playlist_song_table.c.playlist_id))



