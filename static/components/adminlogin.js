export default {
    template: `
      <div style="max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px; background-color: #f9f9f9;">
        <h2 style="text-align: center; margin-bottom: 20px;">Admin Login</h2>
        <form @submit.prevent="login">
          <div style="margin-bottom: 15px;">
            <label for="email" style="font-weight: bold;">Email:</label>
            <input type="text" id="email" v-model="email" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 3px;">
          </div>
          <div style="margin-bottom: 15px;">
            <label for="password" style="font-weight: bold;">Password:</label>
            <input type="password" id="password" v-model="password" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 3px;">
          </div>
          <button type="submit" style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 3px; cursor: pointer;">Login</button>
        </form>
        <p style="margin-top: 20px; text-align: center; color: red;">{{ message }}</p>
      </div>
    `,
    data() {
      return {
        email: '',
        password: '',
        message: ''
      }
    },
    methods: {
      async login() {
        const data = {
          email: this.email,
          password: this.password
        };
        
        
        try {
          const response = await fetch('/user_login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
          
          const responseData = await response.json();
          
          if (response.ok) {
            // store token in local storag
            localStorage.setItem('auth_token', responseData.auth_token);
            localStorage.setItem('roles', JSON.stringify(responseData.role));
            
            this.$router.push('/AdminHome');
          } else {
            this.message = responseData.message;
          }
        } catch (error) {
          console.error('Error logging in:', error);
        }
      }
    }
  }
  