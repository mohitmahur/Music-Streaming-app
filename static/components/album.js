export default {
  template:
  `<div style="max-width: 500px; margin: 0 auto;">
    <h2 style="text-align: center; color: #333; font-family: Arial, sans-serif;">Create Album</h2>
    <form @submit.prevent="createAlbum" style="margin-top: 20px;">
      <div style="margin-bottom: 15px;">
        <label for="title" style="display: block; margin-bottom: 5px; font-weight: bold;">Title:</label>
        <input type="text" id="title" v-model="title" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 5px;">
      </div>
      <div style="margin-bottom: 15px;">
        <label for="c_name" style="display: block; margin-bottom: 5px; font-weight: bold;">Artist:</label>
        <input type="text" id="c_name" v-model="c_name" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 5px;">
      </div>
      <div style="margin-bottom: 15px;">
        <label for="year" style="display: block; margin-bottom: 5px; font-weight: bold;">Year:</label>
        <input type="text" id="year" v-model="year" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 5px;">
      </div>
      <div style="margin-bottom: 15px;">
        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Select Songs:</label>
        <ul style="list-style: none; padding-left: 0;">
          <li v-for="song in songs" :key="song.id" style="margin-bottom: 5px;">
            <input type="checkbox" :value="song.id" v-model="selectedSongs">
            <span style="margin-left: 5px;">{{ song.title }}</span>
          </li>
        </ul>
      </div>
      <button type="submit" style="background-color: #007bff; color: #fff; border: none; border-radius: 5px; padding: 10px 20px; cursor: pointer;">Create</button>
    </form>
  </div>`,
  data() {
    return {
      title: '',
      c_name: '',
      year: '',
      songs: [],
      selectedSongs: []
    }
  },
  
  created() {
    this.all_songs();
  },
  methods: {
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
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message);
            }
        } catch (error) {
            console.error('Error fetching songs:', error);
            this.error = 'Error fetching songs';
        }
    },

    async createAlbum() {
      const data = {
        title: this.title,
        c_name: this.c_name,
        year: this.year,
        songs: this.selectedSongs
      };
    
      try {
        const response = await fetch('/album', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
    
        if (response.ok) {
          window.alert("Album Created Successfully")
          this.$router.push({ name: 'allalbums'});
          
        }
    
        const responseData = await response.json();
        console.log(responseData.message);
      } catch (error) {
        console.error('Error creating album:', error);
      }
    }
    
  }
}
