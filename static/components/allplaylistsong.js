export default {
  template: `
  <div>
  <h1 class="text-center mb-4" style="font-size: 24px; color: #333;">All Songs</h1>
  <ul class="list-group">
    <li v-for="song in songs" :key="song.id" class="list-group-item" style="border: none; border-radius: 8px; background-color: #f8f9fa; margin-bottom: 10px; padding: 15px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="flex: 1;">
          <strong>{{ song.title }}</strong> - <span style="color: #007bff;">{{ song.artist_name }}</span> ({{ song.genre }})
        </div>
        <div>
          <span style="margin-right: 10px; font-weight: bold; color: #007bff;">{{ song.likes }} Likes</span>
          <button @click="playOrStopSong(song)" class="btn btn-success">{{ isPlaying(song) ? 'Stop' : 'Play' }}</button>
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
      } 
      catch (error) {
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
