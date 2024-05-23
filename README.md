**Music Streaming App**


Welcome to the Music Streaming App! This README file will guide you through the setup and usage of the application. 
The app is built using Vue.js for the frontend, with HTML and CSS for the structure and styling. It includes functionalities to play songs, 
read lyrics, and perform all CRUD (Create, Read, Update, Delete) operations. Additionally, the app utilizes Celery Beat for scheduling tasks.

Table of Contents
Features
Prerequisites
Installation
Running the App
Project Structure
Usage
Scheduled Tasks
Contributing
License
Features


Play Songs: Stream and play your favorite songs.
Read Lyrics: View lyrics for the currently playing song.
CRUD Operations: Add, view, update, and delete songs.
Scheduled Tasks: Use Celery Beat to schedule and run periodic tasks.
Prerequisites
Make sure you have the following installed on your machine:

Node.js (v12 or higher)
npm or yarn
Python (v3.6 or higher)
Redis (for Celery)
Vue CLI (for Vue.js development)
Installation

1. Clone the repository:
2. Install frontend dependencies:
3. Install backend dependencies:


   *Running the App*
   
1. Start Redis server (required for Celery):redis-server

2. Start Celery worker and Celery Beat:cd backend
        celery -A your_celery_app worker --loglevel=info
        celery -A your_celery_app beat --loglevel=info



3. Access the application:
      Open your browser and go to http://localhost:8080

   **Usage**
   
Play Songs: Navigate to the song list and click on the play button next to a song.
Read Lyrics: Click on a song to view its details and lyrics.
CRUD Operations: Use the interface to add, edit, or delete songs from the library.
Scheduled Tasks
The app uses Celery Beat to schedule tasks. Tasks are defined in the tasks.py file in the backend. You can customize these tasks or add new ones as needed.


