from flask import Flask
from flask_security import SQLAlchemyUserDatastore, Security
from application.models import db, User, Role
from config import DevelopmentConfig
from application.resources import api
from application.datastore import datastore
from application.worker import celery_init_app
from celery import Celery, Task
import flask_excel as excel
from celery.schedules import crontab
from application.task import daily_reminder
from application.instance import cache




def celery_init_app(app):
    celery_app = Celery(app.name)
    celery_app.config_from_object("celeryconfig")
    return celery_app


def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    excel.init_excel(app)
    app.config['UPLOAD_FOLDER'] = 'static/audio'
    cache.init_app(app)
    db.init_app(app)
    api.init_app(app)
    app.security=Security(datastore)
    with app.app_context():
        import application.views

    return app



app=create_app()
celery_app=celery_init_app(app)

celery_app.on_after_configure.connect
def send_email(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=14, minute=48, day_of_week=6),
        daily_reminder.s("mohit@email", "Dailt Test"),
    )





if __name__== '__main__':
    app.run(debug=True)
