export default {
  template: `
    <div>
      <h1 style="text-align: center;">All Songs</h1>
      <ul style="list-style: none; padding: 0;">
        <li v-for="song in songs" :key="song.id" style="margin-bottom: 20px; padding: 10px; border: 1px solid #ccc; border-radius: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong>{{ song.title }}</strong> - {{ song.artist_name }} ({{ song.genre }})
            </div>
            <div>
              <span style="margin-right: 10px;">{{ song.likes }} Likes</span>
              <button :class="{ 'btn-primary': !isPlaying(song), 'btn-danger': isPlaying(song) }" @click="playOrStopSong(song)" class="btn"> {{ isPlaying(song) ? 'Stop' : 'Play' }}</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  `,
  data() {
    return {
      songs: [],
      currentSong: null,
      audio: new Audio()
    };
  },

  
  created() {
    this.fetchSongs();
  },


  methods: {
    async fetchSongs() {
      try {
        const response = await fetch('/allsongs');
        if (response.ok) {
          const data = await response.json();
          this.songs = data.message;
        } else {
          throw new Error('Failed to fetch songs');
        }
      } catch (error) {
        console.error('Error:', error);
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
    }
  }
};
