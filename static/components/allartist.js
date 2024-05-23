export default {
  template:
  `<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
    <h1 style="color: #333;">Artists</h1>
    <ul style="list-style-type: none; padding: 0;">
      <li v-for="artist in artists" :key="artist.u_id" style="border-bottom: 1px solid #ccc; padding: 10px 0;">
        <span style="font-weight: bold;">{{ artist.username }}</span> - <span>{{ artist.email }}</span>
        <button @click="deleteArtist(artist.u_id)" style="margin-left: 10px; padding: 5px 10px; background-color: #ff6347; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Delete</button>
        <button @click="Blacklist(artist.u_id)" v-if="!artist.blacklisted" style="margin-left: 10px; padding: 5px 10px; background-color: #333; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Blacklist</button>
        <button @click="Whitelist(artist.u_id)" style="margin-left: 10px; padding: 5px 10px; background-color: #3cb371; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Whitelist</button>
      </li>
    </ul>
  </div>`,
  data() {
    return {
      artists: []
    };
  },
  mounted() {
    this.fetchArtists();
  },
  methods: {
    fetchArtists() {
      fetch('/getartist')
        .then(response => response.json())
        .then(data => {
          this.artists = data;
        })
        .catch(error => {
          console.error('Error fetching artists:', error);
        });
    },



    deleteArtist(artistId) {
      fetch(`/spec_artist/${artistId}`, {
        method: 'DELETE'
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to delete artist');
          }
        })
        .then(data => {
          console.log(data.message);
          this.fetchArtists(); // Refresh the artist list
          window.alert(data.message);
        })
        .catch(error => {
          console.error('Error deleting artist:', error);
        });
    },
    Blacklist(artistId) {
      fetch(`/blacklist_artist/${artistId}`, {
        method: 'POST'
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to blacklist artist');
          }
        })
        .then(data => {
          console.log(data.message);
          this.fetchArtists(); 
          window.alert(data.message);
        })
        .catch(error => {
          console.error('Error blacklisting artist:', error);
        });
    },


    
    Whitelist(artistId) {
      fetch(`/whitelist_artist/${artistId}`, {
        method: 'POST'
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to whitelist artist');
          }
        })
        .then(data => {
          console.log(data.message);
          this.fetchArtists(); 
          window.alert(data.message);
        })
        .catch(error => {
          console.error('Error whitelisting artist:', error);
        });
    }
  }
};
