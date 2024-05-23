from celery import shared_task
import flask_excel as excel
import threading
from flask import jsonify
from smtplib import SMTP
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from jinja2 import Template

from .models import Album, Song, User, Playlist, Role


SMTP_HOST = 'localhost'
SMTP_PORT = 1025
SENDER_EMAIL = 'mohitmahur8973@gmail.com'
SENDER_PASSWORD = ''




# Celery Task to download CSV File ................................................................


@shared_task(ignore_result=False)
def create_csv():
    albums = Album.query.with_entities(Album.title, Album.c_name, Album.year).all()
    if not albums:
        return jsonify({"message": "No albums found"}), 404

    csv_response = excel.make_response_from_query_sets(albums, ['title', 'c_name', 'year'], "csv" )
    file_name= "albums.csv"

    with open(file_name, 'wb') as f:
        f.write(csv_response.data)
    
    return csv_response




# Sending email.................................................................................................


@shared_task(ignore_result=True)
def daily_reminder():
    return "message"

def daily_reminder(to, subject):
    users=User.query.filter(User.roles.any(Role.name=="user")).all()
    for user in users:
        with open("test.html", 'r') as f:
            template=Template(f.read)
        send_message(user.email, subject, template.render(email=user.email))

    return "OK"



def send_message(to, subject, body_content):
    msg=MIMEMultipart()
    msg["To"]=to
    msg["Subject"]=subject
    msg["From"]=SENDER_EMAIL
    msg.attach(MIMEText(body_content, 'html'))

    client = SMTP(host= SMTP_HOST, port= SMTP_PORT)
    client.send_message(msg=msg)
    client.quit()







# Mailhog..............................................................................


# def send_monthly_report(user):
#     with open('reminder.html', 'r') as f:
#         template = Template(f.read())
#         songs = Song.query.filter_by(creator_name=user.username).all()
#         albums = Album.query.filter_by(creator_name=user.username).all()
#         total_songs = len(songs)
#         total_albums = len(albums)


#         send_email(
#             user.email,
#             'Monthly Report',
#             template.render(
#                 email=user.email,
#                 songs=songs,
#                 total_songs=total_songs,
#                 total_albums=total_albums,
#             )
#         )


# @shared_task(ignore_result=True)
# def monthly_reminder():
#     artists = User.query.filter(User.roles.any(Role.name == 'artist')).all()
#     for artist in artists:
#         send_monthly_report(artist)
#     return "Monthly Reports Sent"


# @shared_task(ignore_result=True)
# def daily_reminder():
#     # Functionality for daily reminder
#     pass



