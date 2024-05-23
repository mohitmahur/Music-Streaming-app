export default {
  template: `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; text-align: center;">
      <button @click="viewAllPlaylists" class="btn btn-primary" style="margin-top: 20px; background-color: #4CAF50; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">View All Playlists</button>
      <button @click="viewAllAlbums" class="btn btn-primary" style="margin-top: 20px; background-color: #4CAF50; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">View All Albums</button>
      <button @click="viewAllSongs" class="btn btn-primary" style="margin-top: 20px; background-color: #4CAF50; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">View All Songs</button>
      <button @click="viewAllUsers" class="btn btn-primary" style="margin-top: 20px; background-color: #4CAF50; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">All Users</button>
      
      <h2 style="margin-top: 30px; font-size: 24px; color: #333;">Counts</h2>
      
      <div v-if="counts" style="margin-top: 10px;">
        <ul style="list-style: none; padding: 0;">
        <button @click="downloadCSV" class="btn btn-primary" style="margin-top: 20px; background-color: #008CBA; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">Download CSV</button>

          <li style="margin-bottom: 10px; font-size: 18px;">{{ counts.songs }} Songs</li>
          <li style="margin-bottom: 10px; font-size: 18px;">{{ counts.users }} Users</li>
          <li style="margin-bottom: 10px; font-size: 18px;">{{ counts.albums }} Albums</li>
          <li style="margin-bottom: 10px; font-size: 18px;">{{ counts.playlists }} Playlists</li>
        </ul>
      </div>
    </div>
  `,
  data() {
    return {
      counts: null
    };
  },
  mounted() {
    this.fetchCounts();
  },
  methods: {
    async fetchCounts() {
      try {
        const response = await fetch('/counts');
        const data = await response.json();
        this.counts = data;
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    },
    viewAllPlaylists() {
      this.$router.push('/allplaylists');
    },
    viewAllAlbums() {
      this.$router.push('/allalbums');
    },
    viewAllSongs() {
      this.$router.push('/allsongs');
    },
    viewAllUsers() {
      this.$router.push('/allusers');
    },
    viewAllArtists() {
      this.$router.push('/allartists');
    },
    async downloadCSV() {
      try {
        const response = await fetch('/downloadcsv');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'albums.csv');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.alert('CSV file downloaded successfully!');
      } catch (error) {
        console.error('Error downloading CSV:', error);
      }
    }
  }
};
