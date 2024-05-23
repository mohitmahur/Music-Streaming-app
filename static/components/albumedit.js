export default {
  template: `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="text-align: center; margin-bottom: 20px;">Edit Album</h1>
      <form @submit.prevent="updateAlbum" style="margin-bottom: 20px;">
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 5px;">Title</label>
          <input type="text" v-model="formData.title" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" required>
        </div>
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 5px;">Artist</label>
          <input type="text" v-model="formData.c_name" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;" required>
        </div>
        <div style="margin-bottom: 20px;">
          <label style="display: block; margin-bottom: 5px;">Year</label>
          <input type="text" v-model="formData.year" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
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
        c_name: '',
        year: ''
      },
      error: null
    };
  },
  created() {
    // album data from route params
    this.formData = this.$route.params.albumData;
  },
  methods: {
    async updateAlbum() {
      try {
        const response = await fetch(`/editalbum/${this.formData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.formData)
        });
        if (response.ok) {
          console.log('Album updated successfully');
          window.alert("Album updated successfully");
          this.$router.push({ name: 'allalbums' });
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error);
        }
      } catch (error) {
        console.error('Error updating album:', error);
        this.error = 'Error updating album';
      }
    }
  }
};
