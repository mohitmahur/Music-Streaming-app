export default {
  template: `
  <div style="padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
    <h2 style="color: #333; font-size: 24px;">Create Playlist</h2>
    <form @submit.prevent="createPlaylist" style="margin-top: 20px;">
      <div style="margin-bottom: 20px;">
        <label for="name" style="font-weight: bold;">Name:</label>
        <input type="text" id="name" v-model="name" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ccc; border-radius: 3px;">
      </div>
      <div style="margin-bottom: 20px;">
        <label style="font-weight: bold;">Select Songs:</label>
        <ul style="list-style: none; padding-left: 0;">
          <li v-for="song in songs" :key="song.id" style="margin-top: 5px;">
            <input type="checkbox" :value="song.id" v-model="selectedSongs" style="margin-right: 5px;">
            <span style="font-size: 16px;">{{ song.title }}</span>
          </li>
        </ul>
      </div>
      <button type="submit" style="background-color: #007bff; color: #fff; border: none; padding: 10px 20px; border-radius: 3px; cursor: pointer;">Create</button>
    </form>
  </div>`,
  data() {
    return {
      name: '',
      songs: [],
      selectedSongs: []
    };
  },
  created() {
    this.fetchAllSongs();
  },
  methods: {
    async fetchAllSongs() {
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
          throw new Error(errorData.error);
        }
      } catch (error) {
        console.error('Error fetching songs:', error);
        // Handle error
      }
    },

    async createPlaylist() {
      const data = {
        name: this.name,
        songs: this.selectedSongs
      };
    
      try {
        const response = await fetch('/create_playlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
    
        if (response.ok) {
          window.alert("You Have created A playlist")
          this.$router.push({ name: 'allplaylists'});
        }
    
        const responseData = await response.json();
        console.log(responseData.message);
      } catch (error) {
        console.error('Error creating playlist:', error);
        // Handle error
      }
    }
  }
};
