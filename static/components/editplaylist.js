export default {
  template: `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="text-align: center; margin-bottom: 20px;">Edit Playlist</h1>
      <form @submit.prevent="updatePlaylist" style="margin-bottom: 20px;">
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 5px;">Name</label>
          <input type="text" v-model="formData.name" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" required>
        </div>
        <button type="submit" style="background-color: #007bff; color: #fff; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Update</button>
      </form>
      <div v-if="error" style="color: red; text-align: center;">{{ error }}</div>
    </div>
  `,
  data() {
    return {
      formData: {
        name: ''
      },
      error: null
    };
  },
  created() {


    //playlist data from route params
    this.formData = this.$route.params.responseData;
  },


  methods: {
    async updatePlaylist() {
      try {
        const response = await fetch(`/playlistedit/${this.formData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.formData)


        });



        if (response.ok) {
          console.log('Playlist updated successfully');
          window.alert("You Have Edit Playlist")
          this.$router.push({ name: 'allplaylists' });
        } 
        else {
          const errorData = await response.json();
          throw new Error(errorData.error);
        }
      } 
      
      catch (error) {
        console.error('Error updating playlist:', error);
        this.error = 'Error updating playlist';
      }
    }
  }
};
