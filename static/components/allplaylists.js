export default {
    template: `
      <div>
        <h1>All Playlists</h1>
        <div id="playlists-container" class="row">
          <div v-for="playlist in playlists" :key="playlist.id" class="col-md-4 mb-4">
            <div class="card" style="width: 18rem;">
              <div class="card-body">
                <h5 class="card-title">{{ playlist.name }}</h5>
                <button class="btn btn-primary" @click="showSongs(playlist)">Show Songs</button>
                <button class="btn btn-success" @click="editPlaylist(playlist)">Edit</button>
                <button class="btn btn-danger" @click="deletePlaylist(playlist.id)">Delete</button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="selectedPlaylist">
          <h2>{{ selectedPlaylist.name }} - Songs</h2>
          <ul>
            <li v-for="song in selectedPlaylist.songs" :key="song.id">
              {{ song.name }}
            </li>
          </ul>
        </div>
        <div v-if="error" class="text-danger">{{ error }}</div>
      </div>
    `,
    data() {
      return {
        playlists: [],
        selectedPlaylist: null,
        error: null,
        token: localStorage.getItem('token'),
      };
    },




    created() {
      this.getAllPlaylists();
    },




    methods: {
      async getAllPlaylists() {
        try {
          const response = await fetch('/allplaylists', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authentication-Token': this.token,
            }
          });
          if (response.ok) {
            const data = await response.json();
            this.playlists = data;
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message);
          }
        } catch (error) {
          console.error('Error fetching playlists:', error);
          this.error = 'Error fetching playlists';
        }

      },




      async showSongs() {
        try {
          const response = await fetch(`/allsongs`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authentication-Token': this.token,
            }
          });
          if (response.ok) {
            const playlistData = await response.json();
            this.selectedPlaylist = playlistData.message;
            this.$router.push({ name: 'allplaylistsong' });
          } else {
            const errorData = await response.json();
            throw new Error(errorData.error);
          }
        } catch (error) {
          console.error('Error fetching playlist songs:', error);
          this.error = 'Error fetching playlist songs';
        }
      },





      async editPlaylist(playlist) {
        try {
          const response = await fetch(`/spec_playlist/${playlist.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authentication-Token': this.token,
            },
            
          });
          if (response.ok) {
            const responseData = await response.json();
            this.$router.push({ name: 'editplaylist', params: { responseData }});
            

            // You can add logic here to handle successful update
          } else {
            const errorData = await response.json();
            throw new Error(errorData.error);
          }
        } catch (error) {
          console.error('Error updating playlist:', error);
          this.error = 'Error updating playlist';
        }
      },


      

      async deletePlaylist(playlistId) {
        try {
          const response = await fetch(`/deleteplaylist/${playlistId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authentication-Token': this.token,
            }
          });
          if (response.ok) {
            // Remove the deleted playlist from the UI
            this.playlists = this.playlists.filter(playlist => playlist.id !== playlistId);
            window.alert("Playlist Deleted Successfully")
            console.log('Playlist deleted successfully');
          } else {
            const errorData = await response.json();
            throw new Error(errorData.error);
          }
        } catch (error) {
          console.error('Error deleting playlist:', error);
          this.error = 'Error deleting playlist';
        }
      }
    }
  };
  