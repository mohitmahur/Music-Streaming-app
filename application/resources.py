from flask_restful import Api , Resource, reqparse, marshal_with, fields
from .models import Song, db, Album
from flask_security import auth_required, roles_required
# from .instance import cache


api=Api(prefix='/api')




# ManagingSongApi


parser_song = reqparse.RequestParser()
parser_song.add_argument('title', type=str, help='Title Should be in String format' , required=True)
parser_song.add_argument('lyrics', type=str, help='Lyrics Should be in String format' , required=True)
parser_song.add_argument('genre', type=str, help='Genre Should be in String format', required=True)
parser_song.add_argument('artist_name', type=str, help='Artist_Name Should be in String format' , required=True)
parser_song.add_argument('filename', type=str, help='Filename Should be in String format', required=True)
parser_song.add_argument('duration', type=int, help='Duration Should be in Integer format', required=True)


song_fields={
    'id' : fields.Integer,
    'title': fields.String,
    'lyrics': fields.String,
    'genre': fields.String,
    'artist_name': fields.String,
    'filename': fields.String,
    'duration': fields.Integer
}

class song(Resource):
    @marshal_with(song_fields)
    @auth_required()
    # @cache.cache(timeout=50)
    def get(self):
        all_song=Song.query.all()
        if len(all_song)>0:
            return "Not Any Song"
        return all_song
    
    @auth_required()
    def post(self):
        args = parser_song.parse_args()
        song_resource=Song(**args)
        db.session.add(song_resource)
        db.session.commit()
        return {'message' : 'Song Successfully Uploades'}
api.add_resource(song, '/song')



# AlbumnManagingApi

parser_album = reqparse.RequestParser()
parser_album.add_argument('title', type=str, help='Title Should be in String format' , required=True)
parser_album.add_argument('c_name', type=str, help='Creator Should be in String format' , required=True)
parser_album.add_argument('year', type=int, help='year Should be in Integer format' , required=True)


album_fields={
    'id' : fields.Integer,
    'title': fields.String,
    'c_name': fields.String,
    'year' : fields.Integer
}

class album(Resource):
    @marshal_with(album_fields)
    @auth_required()
    def get(self):
        all_album=Album.query.all()
        return all_album
    

    @auth_required()
    def post(self):
        args = parser_album.parse_args()
        album_resource=Album(**args)
        db.session.add(album_resource)
        db.session.commit()
        return {'message' : 'Album Successfully Created'}
    
api.add_resource(album, '/album')

