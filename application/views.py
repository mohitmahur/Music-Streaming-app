from flask_security import auth_required, roles_required, current_user
from flask import current_app as app, jsonify, request, render_template, send_file
from werkzeug.security import check_password_hash, generate_password_hash
from .models import db, User, Role, Album, Playlist, Song
from flask_restful import marshal, fields
import flask_excel as excel
from celery.result import AsyncResult
from .datastore import datastore
import os
from datetime import datetime
from flask import send_from_directory
from werkzeug.utils import secure_filename
from .task import create_csv
from sqlalchemy import or_
import plotly.graph_objs as go
from application.task import send_message
# from application.task import send_monthly_report




# Index page 

@app.get('/')
def home():
    return render_template('index.html')


# Admin Page Api............................................................./////////////////////////

@app.post('/admin_login')
# @auth_required("token")
# @roles_required("admin")



@app.post('/adminlogin')
def admin_login():
    data_request=request.get_json()
    email=data_request.get("email")
    password=data_request.get("password")
    if not email and not password:
        return jsonify({'message':'Email and Password Required'}),400
    if email != "admin@email.com":
        return jsonify({'message':'Email Not Matched'}), 400
    user=datastore.get_user(email=email)

    if not user:
        return jsonify({'message':'User is Not Found'}), 404
    if not check_password_hash(user.password, password):
        return jsonify({'message':'Incorrect Password'}),401
    db.session.commit()
    return jsonify({'role': [role.name for role in user.roles]}), 200

    


@app.get('/getusers')
def get_users():
    users = User.query.filter(User.roles.any(Role.name == 'user')).all()
    return jsonify([{
        'u_id': user.u_id,
        'username': user.username,
        'email': user.email,
        'password': user.password,
        'active': user.active,
        'fs_uniquifier': user.fs_uniquifier
        # Add other fields as needed
    } for user in users])




@app.get('/getartist')
def get_artist():
    users = User.query.filter(User.roles.any(Role.name == 'artist')).all()
    return jsonify([{
        'u_id': user.u_id,
        'username': user.username,
        'email': user.email,
        'password': user.password,
        'active': user.active,
        'fs_uniquifier': user.fs_uniquifier
    } for user in users])




@app.delete('/spec_user/<int:user_id>')
def delete_user(user_id):
    user = User.query.get(user_id)
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'})
    else:
        return jsonify({'error': 'User not found'}), 404







# Blacklist user API
@app.post('/blacklist_user/<int:user_id>')
def blacklist_user(user_id):
    user = User.query.get(user_id)
    if user:
        user.active = False
        db.session.commit()
        return jsonify({'message': 'User blacklisted successfully'}), 200
    else:
        return jsonify({'message': 'User not found'}), 404

# Whitelist user API
@app.post('/whitelist_user/<int:user_id>')
def whitelist_user(user_id):
    user = User.query.get(user_id)
    if user:
        user.active = True
        db.session.commit()
        return jsonify({'message': 'User whitelisted successfully'}), 200
    else:
        return jsonify({'message': 'User not found'}), 404





    
# Delete song ...................................................................................

@app.delete('/delete_song/<int:song_id>')
# @auth_required('artist')
# @roles_required('artist')
def delete_song(song_id):
    song = Song.query.get(song_id)
    if not song:
        return jsonify({'error': 'Song not found'}), 404
    
    db.session.delete(song)
    db.session.commit()

    return jsonify({'message': 'Song deleted successfully'}), 200





# song api ...........///////////////////////////////////////..........................................




# graph/////////////////......................................................................



@app.route('/counts')
def get_counts():
    songs_count = Song.query.count()
    users_count = User.query.count()
    albums_count = Album.query.count()
    playlists_count = Playlist.query.count()

    return jsonify({
        'songs': songs_count,
        'users': users_count,
        'albums': albums_count,
        'playlists': playlists_count
    })



@app.get('/allsongs')
def songs():
    songs = Song.query.all()
    song_list = []
    for song in songs:
        song_detail = {
            'id': song.id,
            'title': song.title,
            'genre': song.genre,
            'artist_name': song.artist_name,
            'duration': song.duration,
            # 'album_name': Album.query.get(song.album_id).title,
            'lyrics': song.lyrics,
            'likes': song.likes
        }
        song_list.append(song_detail)
    return jsonify({'message': song_list}), 200




# Edit a SOng......................................................................
 
@app.put('/edit_song/<int:song_id>')
# @auth_required('token')
# @roles_required('artist')
def edit_song(song_id):
    song = Song.query.get(song_id)
    if not song:
        return jsonify({'error': 'Song not found'}), 404
    

    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    # Update song details
    song.title = data.get('title', song.title)
    song.genre = data.get('genre', song.genre)
    song.artist_name = data.get('artist_name', song.artist_name)
    song.lyrics = data.get('lyrics', song.lyrics)
    song.duration = data.get('duration', song.duration)

    db.session.commit()


    edited_song_detail = {
        'id': song.id,
        'title': song.title,
        'genre': song.genre,
        'artist_name': song.artist_name,
        'duration': song.duration,
        'lyrics': song.lyrics,
        'likes': song.likes
    }

    return jsonify({'message': edited_song_detail}), 200




# get specific song//////////////////////////////////////////////////////////////////////////////



@app.get('/song/<int:song_id>')
# @auth_required('token')
# @roles_required('user')
def get_song(song_id):
    song = Song.query.get(song_id)
    if song is None:
        return jsonify({'error': 'Song not found'}), 404
    
    
    song_detail = {
        'id': song.id,
        'title': song.title,
        'genre': song.genre,
        'artist_name': song.artist_name,
        'duration': song.duration,
        'lyrics': song.lyrics,
        'likes': song.likes
    }
    
    return jsonify({'message': song_detail}), 200



# Like A SOng......................................
@app.post('/like/<int:song_id>')
def like_song(song_id):
    song = Song.query.get(song_id)
    if song is None:
        return jsonify({'error': 'Song not found'}), 404
    
    song.likes += 1
    db.session.commit()
    
    return jsonify({'message': 'You liked the song!'}), 200



# Dislike a song.........................................
@app.post('/dislike/<int:song_id>')
def dislike_song(song_id):
    song = Song.query.get(song_id)
    if song is None:
        return jsonify({'error': 'Song not found'}), 404
    
    song.dislikes += 1
    db.session.commit()
    
    return jsonify({'message': 'You disliked the song!'}), 200




# /////////////upload song ................................................................


@app.post('/upload_song')
# @auth_required('auth_token')
# @roles_required('artist')
def upload_song():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']

    if file.filename.endswith('.mp3'):
        # Save the file to the upload folder
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))

        # Extract song metadata from request
        title = request.form.get('title')
        lyrics = request.form.get('lyrics')
        duration = request.form.get('duration')
        genre = request.form.get('genre')
        artist_name = request.form.get('artist_name')

        # Create a new Song object
        song = Song(
            title=title,
            lyrics=lyrics,
            duration=duration,
            genre=genre,
            artist_name=artist_name, 
            filename=filename
        )

        db.session.add(song)
        db.session.commit()

        return jsonify({'message': 'Song uploaded successfully'}), 200
    else:
        return jsonify({'error': 'File format not supported. Please upload an MP3 file'}), 400
    



# Play Music..................................................................



@app.get('/play_music/<int:song_id>')
def play_music(song_id):
    song = Song.query.get(song_id)
    if song and song.filename:  # Check if song and filename are not None
        return send_file(os.path.join(app.config['UPLOAD_FOLDER'], song.filename), as_attachment=False, mimetype='audio/mpeg')
    else:
        return 'Song not found'




# read.lyrics..............................................................




@app.get('/lyrics/<int:song_id>')
def get_lyrics(song_id):
    song = Song.query.get(song_id)
    if song:
        return jsonify({'lyrics': song.lyrics})
    else:
        return jsonify({'error': 'Song not found'}), 404










# General User Functions....................................................//////////////////////

@app.post('/register')
def register():
    data=request.get_json()
    email=data.get('email')
    username=data.get('username')
    password=data.get('password')
    if not email and not username and not password:
        return jsonify({'message':'Field Required'}),404
    
    if not datastore.find_user(email=email):
        datastore.create_user(email=email,username=username,password=generate_password_hash(password), roles=['user'])
        db.session.commit()
        return jsonify({'message':'User Registered Successfully'}),200
    else:
        return jsonify({'message':'User Already Registered'})
    

# Make Artist............................................../////////////////////////


@app.post('/convert_to_artist')
# @auth_required('token')
# @roles_required('user')
def convert_to_artist():
    try:
        user = current_user
        artist_role = Role.query.filter_by(name='artist').first()
        if not artist_role:
            return jsonify({'message': 'Artist role not found'}), 404

        user.roles.append(artist_role)
        db.session.commit()

        return jsonify({'message': 'User converted to artist successfully', 'roles': [role.name for role in user.roles]}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500



# User Login............................................................................................

@app.post('/user_login')
def user_login():
    data=request.get_json()
    email=data.get('email')
    username=data.get('username')
    password=data.get('password')
    

    if not email and not username and not password:
        return jsonify({'message':'Field Required'}),404
    
    user=datastore.find_user(email=email)

    if not user:
        return jsonify({'message':'User not Found'}),404
    if not check_password_hash(user.password,password):
        return jsonify({'message':'Password Incorrect'}),401
    
    if user.active == False:
        return jsonify({'message': 'Your account have been blacklisted.'}), 401
    
    
    user.active = True
    db.session.commit()
    role_names = [role.name for role in user.roles]
    # return jsonify({'message':'success'})
    return jsonify({ 'role': role_names}), 200









@app.post('/count/<int:song_id>')
@auth_required('token')
@roles_required('user')
def count(song_id):
    song=Song.query.get(song_id)
    if not song :
        return jsonify ({'message':'Song Not Found'}),404
    song.count+=1
    return jsonify({'message':'song flag successfully'}),200






# playlist function..............................................................//////................


@app.post('/create_playlist')
# @auth_required('token')
# @roles_required('user')
def create_playlist():
    data = request.get_json()
    name = data.get('name')
    if not name:
        return jsonify({'error': 'Name is required'}), 400
    
    playlist = Playlist(name=name)
    db.session.add(playlist)
    db.session.commit()
    return jsonify({'message': 'Playlist created successfully', 'id': playlist.id}), 201




@app.get('/allplaylists')
# @roles_required('user')
# @auth_required('token')
def get_playlists():
    playlists = Playlist.query.all()
    playlist_list = []
    for playlist in playlists:
        playlist_list.append({
            'id': playlist.id,
            'name': playlist.name
        })
    return jsonify(playlist_list)



@app.get('/spec_playlist/<int:id>')
# @roles_required('user')
# @auth_required('token')

def get_playlist(id):
    playlist = Playlist.query.get(id)
    if not playlist:
        return jsonify({'error': 'Playlist not found'}), 404
    playlist_data = {
        'id': playlist.id,
        'name': playlist.name
    }
    return jsonify(playlist_data)



# Delete A Playlist.................................................................................

@app.delete('/deleteplaylist/<int:id>',)
# @auth_required('token')
# @roles_required('user')
def delete_playlist(id):
    playlist = Playlist.query.get(id)
    if not playlist:
        return jsonify({'error': 'Playlist not found'}), 404
    db.session.delete(playlist)
    db.session.commit()
    return jsonify({'message': 'Playlist deleted successfully'})




# Edit A Playlist.......................................................................................

@app.put('/playlistedit/<int:id>')
# @auth_required('token')
# @roles_required('user')
def edit_playlist(id):
    playlist = Playlist.query.get(id)
    if not playlist:
        return jsonify({'error': 'Playlist not found'}), 404
    data = request.json
    playlist.name = data.get('name', playlist.name)
    db.session.commit()
    return jsonify({'message': 'Playlist updated successfully'})





    

# artist function..................................////////////////////////...........................

@app.post('/artist_register')
@auth_required('token')
@roles_required('user')
def artist_register():
    user=current_user
    datastore.add_role_to_user(user,'artist')
    return jsonify({'message':'Artist Successfully Register','role':[role.name for role in user.roles]}),200






# album api's/////////////............................................../////////////////////////////

@app.post('/album')
# @auth_required('token')
# @roles_required('artist')
def create_album():
    data = request.get_json()
    # year=data['year']
    year = datetime.strptime(data['year'], '%Y').date()
    new_album = Album(title=data['title'], c_name=data['c_name'], year=year)
    db.session.add(new_album)
    db.session.commit()
    return jsonify({'message': 'Album created successfully'}), 201




@app.get('/allalbums')
# @auth_required('token')
# @roles_required('artist')
def get_albums():
    albums = Album.query.all()
    album_list = []
    for album in albums:
        album_list.append({
            'id': album.id,
            'title': album.title,
            'c_name': album.c_name,
            'year': album.year.isoformat() if album.year else None
        })
    return jsonify(album_list)




# specif album..................................

@app.get('/spec_album/<int:id>')
# @auth_required('token')
# @roles_required('artist')
def get_album(id):
    album = Album.query.get(id)
    if not album:
        return jsonify({'error': 'Album not found'}), 404
    album_data = {
        'id': album.id,
        'title': album.title,
        'c_name': album.c_name,
        'year': album.year.isoformat() if album.year else None
    }
    return jsonify(album_data)




@app.put('/editalbum/<int:id>')
# @auth_required('token')
# @roles_required('artist')
def edit_album(id):
    album = Album.query.get(id)
    if not album:
        return jsonify({'error': 'Album not found'}), 404
    data = request.json
    album.title = data.get('title', album.title)
    album.c_name = data.get('c_name', album.c_name)
    
    # Convert 'year' string to a Python date object
    if 'year' in data:
        try:
            album.year = datetime.strptime(data['year'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Invalid year format'}), 400

    db.session.commit()
    return jsonify({'message': 'Album updated successfully'})





@app.delete('/deletealbum/<int:id>')
# @auth_required('token')
# @roles_required('artist')
def delete_album(id):
    album = Album.query.get(id)
    if not album:
        return jsonify({'error': 'Album not found'}), 404
    db.session.delete(album)
    db.session.commit()
    return jsonify({'message': 'Album deleted successfully'})








# csv file downloading ................................................/////

@app.get('/downloadcsv')
def create_csv():
    albums = Album.query.with_entities(Album.title, Album.c_name, Album.year).all()
    if not albums:
        return jsonify({"message": "No albums found"}), 404

    csv_response = excel.make_response_from_query_sets(albums, ['title', 'c_name', 'year'], "csv")
    file_name = "albums.csv"

    with open(file_name, 'wb') as f:
        f.write(csv_response.data)
    
    return send_file(file_name, as_attachment=True)



@app.get('/getcsv/<task_id>')
def get_csv(task_id):
    res = AsyncResult(task_id)
    if res.ready():
        return jsonify({"Message":"Task COmpleted"})
        # filename = res.result
        # print(filename)
        # return send_file(filename, as_attachment=True)
    else:
        return jsonify({'message': 'Task pending'}), 404
    




#search_ fucntion............................. /////////.......................................




@app.get('/search')
def search():
    query = request.args.get('query', '')
    search_type = request.args.get('type', 'song')

    if search_type == 'song':
        songs = Song.query.filter(or_(Song.title.ilike(f'%{query}%'),
                                      Song.artist_name.ilike(f'%{query}%'),
                                      Song.genre.ilike(f'%{query}%'))).all()
        result = [{'id': song.id, 'title': song.title, 'artist_name': song.artist_name, 'genre': song.genre} for song in songs]
    elif search_type == 'album':
        albums = Album.query.filter(Album.title.ilike(f'%{query}%')).all()
        result = [{'id': album.id, 'title': album.title, 'c_name': album.c_name, 'year': album.year} for album in albums]
    elif search_type == 'playlist':
        playlists = Playlist.query.filter(Playlist.name.ilike(f'%{query}%')).all()
        result = [{'id': playlist.id, 'name': playlist.name} for playlist in playlists]
    elif search_type == 'genre':
        songs = Song.query.filter(Song.genre.ilike(f'%{query}%')).all()
        genres = list(set([song.genre for song in songs]))
        result = [{'genre': genre} for genre in genres]
    else:
        return jsonify({'message': 'Invalid search type'}), 400

    return jsonify(result)



# @app.post('/sendmonthlyreports')
# def send_monthly_reports():
#     try:
#         # Assuming the request body contains a list of user IDs
#         user_ids = request.json.get('users', [])
        
#         for user_id in user_ids:
#             # Fetch the user object from the database
#             user = User.query.get(user_id)
#             if user:
#                 # Send monthly report for the user
#                 send_monthly_report(user)
        
#         return jsonify({'message': 'Monthly reports sent successfully'}), 200
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500
    




# reminder.....................................................



@app.post('/send_message')
def send_message_route():
    data = request.json
    to = data.get('to')
    subject = data.get('subject')
    body_content = data.get('body_content')

    if not all([to, subject, body_content]):
        return jsonify({'error': 'Missing required fields'}), 400

    send_message(to, subject, body_content)

    return jsonify({'message': 'Message sent successfully'}), 200





@app.route('/counts')
def counts():
    song_count = Song.query.count()
    album_count = Album.query.count()
    user_count = User.query.count()
    playlist_count = Playlist.query.count()
    
    return jsonify({
        'song_count': song_count,
        'album_count': album_count,
        'user_count': user_count,
        'playlist_count': playlist_count
    })