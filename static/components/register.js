export default {
  template:
  `<div style="display: flex; justify-content: center; margin-top: 50px;">
    <div style="width: 400px;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
        <h2 style="text-align: center; margin-bottom: 20px;">Register</h2>
        <form @submit.prevent="registerUser">
          <div style="margin-bottom: 15px;">
            <label for="email" style="font-weight: bold;">Email</label>
            <input type="email" v-model="email" class="form-control" id="email" placeholder="Enter email" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc;">
          </div>
          <div style="margin-bottom: 15px;">
            <label for="username" style="font-weight: bold;">Username</label>
            <input type="text" v-model="username" class="form-control" id="username" placeholder="Enter username" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc;">
          </div>
          <div style="margin-bottom: 15px;">
            <label for="password" style="font-weight: bold;">Password</label>
            <input type="password" v-model="password" class="form-control" id="password" placeholder="Enter password" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc;">
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%; padding: 10px; border-radius: 5px; border: none; background-color: #007bff; color: #fff; cursor: pointer;">Register</button>
        </form>
      </div>
    </div>
  </div>`,
  data() {
    return {
      email: '',
      username: '',
      password: ''
    };
  },
  methods: {
    async registerUser() {
      try {
        const response = await fetch('/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.email,
            username: this.username,
            password: this.password
          })
        });
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('auth_token', data.token)
          localStorage.setItem('role', data.role)
          alert(data.message);
          this.$router.push({path:'/login'})
        } else {
          alert(data.message);
        }

        
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
      }
    }
  }
};
