export default {
    template: `
    <div style="background-color: #f8f9fa; padding: 20px;">
        <h1 style="color: #007bff;">Welcome Artist</h1>
        <div id="songs-container">
            <div class="text-danger">{{ error }}</div>
            <div v-for="song in songs" :key="song.id" class="song" style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; background-color: #ffffff;">
                <div>Title: {{ song.title }}</div>
                <div>Artist: {{ song.artist_name }}</div>
                <div>Genre: {{ song.genre }}</div>
                <div class="buttons">
                    <button :class="{ 'btn-primary': !isPlaying(song), 'btn-danger': isPlaying(song) }" @click="playOrStopSong(song)" class="btn"> {{ isPlaying(song) ? 'Stop' : 'Play' }}</button> <!-- Dynamic play/stop button -->
                    <button @click="likeSong(song.id)" class="btn btn-success">Like</button>
                    <button @click="dislikeSong(song.id)" class="btn btn-danger">Dislike</button>
                    <button @click="editSong(song.id)" class="btn btn-warning">Edit</button>
                    <button @click="deleteSong(song.id)" class="btn btn-secondary">Delete</button>
                    <button @click="readLyrics(song.id)" class="btn btn-primary">Read Lyrics</button>
              
                </div>
            </div>
        </div>
        <div class="alert" v-if="alertMessage" style="background-color: #cce5ff; color: #004085; border-color: #b8daff; padding: 10px; margin-top: 10px;">
            {{ alertMessage }}
        </div>
        <button @click="createPlaylist" class="btn btn-primary" style="margin-top: 20px;">Create Playlist</button>
        <button @click="viewAllPlaylists" class="btn btn-primary" style="margin-top: 20px;">View All Playlists</button>
  
        <button @click="createAlbum" class="btn btn-primary" style="margin-top: 20px;">Create Album</button>
        <button @click="viewAllAlbums" class="btn btn-primary" style="margin-top: 20px;">View All Albums</button>
        <button @click="search" class="btn btn-primary" style="margin-top: 20px; background-color: #ff6600; color: #fff; border: none; border-radius: 5px; padding: 10px 20px; font-size: 16px; cursor: pointer; transition: background-color 0.3s ease;">Search</button>
        <button @click="upload" class="btn btn-primary" style="margin-top: 20px; background-color: #ff6600; color: #fff; border: none; border-radius: 2px; padding: 20px 20px; font-size: 16px; cursor: pointer; transition: background-color 0.3s ease;">Upload</button>

    </div>
    `,


    data() {
        return {
            songs: [],
            error: null,
            audio: new Audio(),
            currentSong: null,
            alertMessage: null,
        };
    },



    created() {
        this.all_songs();
    },



    methods: {
        async all_songs() {
            try {
                const response = await fetch('/allsongs', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const responseData = await response.json();
                    console.log('Response Data:', responseData);
                    this.songs = responseData.message;
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message);
                }
            } catch (error) {
                console.error('Error fetching songs:', error);
                this.error = 'Error fetching songs';
            }
        },




        playOrStopSong(song) {
            if (this.currentSong === song) {
                this.stopSong();
            } else {
                this.playSong(song);
            }
        },



        playSong(song) {
            const songUrl = `/play_music/${song.id}`;

            fetch(songUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.blob();
                })
                .then(blob => {
                    this.audio.src = URL.createObjectURL(blob);
                    this.audio.play();
                    this.currentSong = song;
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
        },




        stopSong() {
            if (this.audio) {
                this.audio.pause();
                this.audio.currentTime = 0;
                this.currentSong = null;
            }
        },




        isPlaying(song) {
            return this.currentSong === song;
        },




        async likeSong(songId) {
            try {
                // Set alert message
                this.alertMessage = 'You liked the song!';
                const response = await fetch(`/like/${songId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });



                if (response.ok) {
                    const responseData = await response.json();
                    console.log(responseData.message);
                    const song = this.songs.find(song => song.id === songId);
                    window.alert("You Like Song")
                    song.likes++;
                }
                 else {
                    const errorData = await response.json();
                    throw new Error(errorData.message);
                }



            } catch (error) {
                console.error('Error liking the song:', error);
                this.error = 'Error liking the song';
            }
        },



        async dislikeSong(songId) {
            try {
    
                this.alertMessage = 'You disliked the song!';
                const response = await fetch(`/dislike/${songId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const responseData = await response.json();
                    console.log(responseData.message);
                    const song = this.songs.find(song => song.id === songId);
                    window.alert("You Dislike Song")
                    song.dislikes++;
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message);
                }
            } catch (error) {
                console.error('Error disliking the song:', error);
                this.error = 'Error disliking the song';
            }
        },

        async editSong(songId) {
            try {
                const response = await fetch(`/song/${songId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });


                if (response.ok) {
                    const song_data = await response.json();
                    const songData = song_data;
                    console.log(songData)
                    // Navigate to the edit page with the fetched song data
                    this.$router.push({ name: 'songedit', params: { songData: songData } });
                } else {
                    // Handle non-200 status codes
                    const errorData = await response.json();
                    throw new Error(errorData.error);
                }
            } catch (error) {
                console.error('Error fetching song details:', error);
                this.error = 'Error fetching song details';
            }
        },





        async deleteSong(songId) {
            try {
                const response = await fetch(`/delete_song/${songId}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    console.log('Song deleted successfully');
                    this.songs = this.songs.filter(song => song.id !== songId);
                    window.alert("you have Deleted the Song")
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error);
                }
            } catch (error) {
                console.error('Error deleting song:', error);
            }
        },



        async readLyrics(songId) {
            try {
                const response = await fetch(`/lyrics/${songId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });



                if (response.ok) {
                    const responseData = await response.json();
                    const songData = responseData;
                    console.log('Lyrics:', responseData.lyrics);
                    // this.$router.push({ name: 'lyrics', params: { songData:songData } });

                    alert(responseData.lyrics);
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message);
                }
            } 
            
            catch (error) {
                console.error('Error fetching lyrics:', error);
                this.error = 'Error fetching lyrics';
            }
        },



        createPlaylist() {
            this.$router.push('/playlist');
        },


        createAlbum() {
            this.$router.push('/album');
        },

        
        viewAllPlaylists() {
            this.$router.push('/allplaylists');
        },
        
        viewAllAlbums() {
            this.$router.push('/allalbums');
        },
        search() {
            this.$router.push('/search');
        },
        upload() {
            this.$router.push('/upload');
        }
  
    }
};
