export default {
  template:
  `<div style="max-width: 600px; margin: 0 auto;">
    <h1 style="text-align: center; color: #333;">Upload Song</h1>
    <form @submit.prevent="uploadSong" style="background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
      <div class="form-group">
        <label style="color: #333;">Title</label>
        <input type="text" v-model="formData.title" class="form-control" required style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;">
      </div>
      <div class="form-group">
        <label style="color: #333;">Artist</label>
        <input type="text" v-model="formData.artist_name" class="form-control" required style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;">
      </div>
      <div class="form-group">
        <label style="color: #333;">Genre</label>
        <input type="text" v-model="formData.genre" class="form-control" required style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;">
      </div>
      <div class="form-group">
        <label style="color: #333;">Lyrics</label>
        <textarea v-model="formData.lyrics" class="form-control" required style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;"></textarea>
      </div>
      <div class="form-group">
        <label style="color: #333;">Duration (in seconds)</label>
        <input type="number" v-model="formData.duration" class="form-control" required style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;">
      </div>
      <div class="form-group">
        <label style="color: #333;">Upload MP3 File</label>
        <input type="file"  @change="handleFileUpload" accept=".mp3" class="form-control-file" required style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 5px;">
      </div>
      <button type="submit" class="btn btn-primary" style="display: block; width: 100%; padding: 10px; background-color: #007bff; border: none; border-radius: 5px; color: #fff; cursor: pointer;">Upload</button>
    </form>
    <div v-if="error" class="text-danger" style="text-align: center; color: red; margin-top: 20px;">{{ error }}</div>
  </div>`,
  data() {
    return {
      formData: {
        title: '',
        artist_name: '',
        genre: '',
        lyrics: '',
        duration: 0,
        file: null
      },
      error: null
    };
  },
  methods: {
    handleFileUpload(event) {
      this.formData.file = event.target.files[0];
    },
    async uploadSong() {
      try {
        const formData = new FormData();
        formData.append('file', this.formData.file);
        formData.append('title', this.formData.title);
        formData.append('artist_name', this.formData.artist_name);
        formData.append('genre', this.formData.genre);
        formData.append('lyrics', this.formData.lyrics);
        formData.append('duration', this.formData.duration);

        const response = await fetch('/upload_song', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          window.alert("You Uploaded A New Song")
          console.log('Song uploaded successfully');
          this.$router.push({ name: 'artist' });
  
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error);
        }
      } catch (error) {
        console.error('Error uploading song:', error);
        this.error = 'Error uploading song';
      }
    }
  }
};
