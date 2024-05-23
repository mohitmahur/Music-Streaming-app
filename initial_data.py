from main import app
from application.models import db, Role, Song, Album, Playlist
from application.datastore import datastore
from werkzeug.security import generate_password_hash

with app.app_context():
    db.create_all()
    datastore.find_or_create_role(name="admin" , description="The User is Admin" )
    datastore.find_or_create_role(name="artist" , description="The User is artist" )
    datastore.find_or_create_role(name="user" , description="The User is user" )
    db.session.commit()


    if not datastore.find_user(email="admin@email.com"):
        datastore.create_user(email="admin@email.com", username="admin", password=generate_password_hash("admin")
                              , roles=["admin"])    
        
    if not datastore.find_user(email="user@email.com"):
        datastore.create_user(email="user@email.com", username="user", password=generate_password_hash("user")
                              , roles=["user"])  
          
    if not datastore.find_user(email="artist@email.com"):
        datastore.create_user(email="artist@email.com", username="artist", password=generate_password_hash("artist")
                              , roles=["artist"])    
    db.session.commit()

    




