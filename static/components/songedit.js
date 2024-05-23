export default {
  template: `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="text-align: center; margin-bottom: 20px;">Edit Song</h1>
      <form @submit.prevent="updateSong" style="margin-bottom: 20px;">
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 5px;">Title</label>
          <input type="text" v-model="formData.title" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" required>
        </div>
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 5px;">Artist</label>
          <input type="text" v-model="formData.artist_name" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" required>
        </div>
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 5px;">Genre</label>
          <input type="text" v-model="formData.genre" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" required>
        </div>
        <button type="submit" style="background-color: #007bff; color: #fff; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Update</button>
      </form>
      <div v-if="error" style="color: red; text-align: center;">{{ error }}</div>
    </div>
  `,
  data() {
    return {
      formData: {
        title: '',
        artist_name: '',
        genre: '',
      },
      error: null,
      songId: null,
    };
  },
  created() {
    // song data from route params
    const songData = this.$route.params.songData;
    if (songData && songData.message && songData.message.id) {
      this.songId = songData.message.id;
      console.log('Song ID:', this.songId);
  
    } else {
    }
  },
  methods: {
    async updateSong() {
      try {
        const response = await fetch(`/edit_song/${this.songId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.formData)
        });
        
        if (response.ok) {
          console.log('Song updated successfully');
          window.alert("Song Updated Successfully")
          // Navigate back to the song list page after updating
          this.$router.push({ name: 'artist' });
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error);
        }
      } catch (error) {
        console.error('Error updating song:', error);
        this.error = 'Error updating song';
      }
    }
  }
};
