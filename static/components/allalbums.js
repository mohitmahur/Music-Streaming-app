export default {
    template:
    `  <div>
    <h1>All Albums</h1>
    <div id="albums-container" class="row">
      <div v-for="album in albums" :key="album.id" class="col-md-4 mb-4">
        <div class="card" style="width: 18rem;">
          <div class="card-body">
            <h5 class="card-title">{{ album.title }}</h5>
            <p class="card-text">Artist: {{ album.c_name }}</p>
            <p class="card-text">Year: {{ album.year }}</p>
            <button class="btn btn-primary" @click="all_songs()">Show Songs</button>
            <button class="btn btn-success" @click="editAlbum(album)">Edit</button>
            <button class="btn btn-danger" @click="deleteAlbum(album.id)">Delete</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="selectedAlbum">
      <h2>{{ selectedAlbum.title }} - Songs</h2>
      <ul>
        <li v-for="song in selectedAlbum.songs" :key="song.id">
          {{ song.title }} - {{ song.artist }} ({{ song.genre }})
        </li>
      </ul>
    </div>
    <div v-if="error" class="text-danger">{{ error }}</div>
  </div>`,
  data() {
    return {
      albums: [],
      selectedAlbum: null,
      error: null
    };
  },


  
  created() {
    this.getAllAlbums();
  },




  methods: {
    async getAllAlbums() {
      try {
        const response = await fetch('/allalbums', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          this.albums = data;
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }
      } catch (error) {
        console.error('Error fetching albums:', error);
        this.error = 'Error fetching albums';
      }
    },




    
    async all_songs(){
        try {
            const response = await fetch('/allsongs',{
                method : 'GET',
                headers : {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const responseData = await response.json();
                console.log('Response Data:', responseData); 
                this.songs = responseData.message;
                this.$router.push({ name: 'allsongs' });
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
        } catch (error) {
            console.error('Error fetching songs:', error);
            this.error = 'Error fetching songs';
        }
    },





    async editAlbum(album) {
      try {
        const response = await fetch(`/spec_album/${album.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const albumData = await response.json();
          // Navigate to the edit page with the fetched album data
          this.$router.push({ name: 'albumedit', params: { albumData }});
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error);
        }
      } catch (error) {
        console.error('Error fetching album details:', error);
        this.error = 'Error fetching album details';
      }
    },





    async deleteAlbum(albumId) {
      try {
        const response = await fetch(`/deletealbum/${albumId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          // deleted album remove...............
          this.albums = this.albums.filter(album => album.id !== albumId);
          window.alert("Album Deleted Successfully")
          console.log('Album deleted successfully');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error);
        }
      } 
      catch (error) {
        console.error('Error deleting album:', error);
        this.error = 'Error deleting album';
      }
    }
    
  }
};

