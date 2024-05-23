
export default {
  template:`
  
  <div style="max-width: 800px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
    <h1 style="color: #007bff; text-align: center; margin-bottom: 20px;">Search</h1>
    <div style="display: flex; align-items: center; margin-bottom: 20px;">
      <input v-model="query" type="text" style="padding: 10px; border: 1px solid #ced4da; border-radius: 5px; margin-right: 10px; font-size: 16px;" placeholder="Search query">
      <select v-model="searchType" style="padding: 10px; border: 1px solid #ced4da; border-radius: 5px; font-size: 16px;">
        <option value="song">Song</option>
        <option value="album">Album</option>
        <option value="playlist">Playlist</option>
        <option value="genre">Genre</option>
      </select>
      <button @click="search" style="padding: 10px 20px; background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">Search</button>
    </div>
    <div v-if="searchResults.length" style="margin-top: 20px;">
      <h2 style="color: #007bff; font-size: 20px; margin-bottom: 10px;">Search Results</h2>
      <div v-for="(result, index) in searchResults" :key="index" style="background-color: #ffffff; border-radius: 5px; padding: 15px; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <div v-if="searchType === 'song'" style="margin: 5px 0;">
          <p><strong>Title:</strong> {{ result.title }}</p>
          <p><strong>Artist:</strong> {{ result.artist_name }}</p>
          <p><strong>Genre:</strong> {{ result.genre }}</p>
          <button :class="{ 'btn-primary': !isPlaying(result), 'btn-danger': isPlaying(result) }" @click="playOrStopSong(result)" class="btn" style="padding: 8px 12px; margin-top: 10px; cursor: pointer;"> {{ isPlaying(result) ? 'Stop' : 'Play' }}</button>
        </div>
        <div v-else-if="searchType === 'album'" style="margin: 5px 0;">
          <p><strong>Title:</strong> {{ result.title }}</p>
          <p><strong>Creator:</strong> {{ result.c_name }}</p>
          <p><strong>Year:</strong> {{ result.year }}</p>
        </div>
        <div v-else-if="searchType === 'playlist'" style="margin: 5px 0;">
          <p><strong>Name:</strong> {{ result.name }}</p>
        </div>
        <div v-else-if="searchType === 'genre'" style="margin: 5px 0;">
          <p><strong>Genre:</strong> {{ result.genre }}</p>
        </div>
      </div>
    </div>
  </div>`,
  data() {
    return {
      query: '',
      searchType: 'song',
      searchResults: [],
      audio: new Audio(),
      currentSong: null
    };
  },
  methods: {
    async search() {
      try {
        const response = await fetch(`/search?query=${this.query}&type=${this.searchType}`);
        if (response.ok) {
          const data = await response.json();
          this.searchResults = data;
        } else {
          console.error('Error searching:', response.statusText);
        }
      } catch (error) {
        console.error('Error searching:', error);
      }
    },
    async playOrStopSong(song) {
      if (this.currentSong === song) {
        this.stopSong();
      } else {
        await this.playSong(song);
      }
    },
    playSong(song) {
      return new Promise((resolve, reject) => {
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
            resolve();
          })
          .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            reject(error);
          });
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

