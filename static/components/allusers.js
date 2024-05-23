export default {
  template:
  `<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
    <h1 style="color: #333;">Users</h1>
    <ul style="list-style-type: none; padding: 0;">
      <li v-for="user in users" :key="user.u_id" style="border-bottom: 1px solid #ccc; padding: 10px 0;">
        <span style="font-weight: bold;">Name: {{ user.username }}</span> - <span>Email ID: {{ user.email }}</span>
        <button @click="deleteUser(user.u_id)" style="margin-left: 10px; padding: 5px 10px; background-color: #ff6347; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Delete</button>
        <button @click="Blacklist(user.u_id)" v-if="!user.blacklisted" style="margin-left: 10px; padding: 5px 10px; background-color: #333; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Blacklist</button>
        <button @click="Whitelist(user.u_id)" style="margin-left: 10px; padding: 5px 10px; background-color: #3cb371; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Whitelist</button>
        <button @click="sendUserMessage(user.email)" style="margin-left: 10px; padding: 5px 10px; background-color: #ff6347; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Send Reminder</button>

        </li>
    </ul>
  </div>`,
  data() {
    return {
      users: []
    };
    
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    fetchUsers() {
      fetch('/getusers')
        .then(response => response.json())
        .then(data => {
          this.users = data;
        })
        .catch(error => {
          console.error('Error fetching users:', error);
        });
    },



    deleteUser(userId) {
      fetch(`/spec_user/${userId}`, {
        method: 'DELETE'
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to delete user');
          }
        })
        .then(data => {
          console.log(data.message);
          this.fetchUsers(); // Refresh the user list
          window.alert(data.message);
        })
        .catch(error => {
          console.error('Error deleting user:', error);
        });
    },





    Blacklist(userId) {
      fetch(`/blacklist_user/${userId}`, {
        method: 'POST'
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to blacklist user');
          }
        })
        .then(data => {
          console.log(data.message);
          this.fetchUsers(); 
          window.alert(data.message);
        })
        .catch(error => {
          console.error('Error blacklisting user:', error);
        });
    },



    Whitelist(userId) {
      fetch(`/whitelist_user/${userId}`, {
        method: 'POST'
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to whitelist user');
          }
        })
        .then(data => {
          console.log(data.message);
          this.fetchUsers(); 
          window.alert(data.message);
        })
        .catch(error => {
          console.error('Error whitelisting user:', error);
        });
    },



    sendUserMessage(email) {
      const messageData = {
        to: email,
        subject: 'You Have Visited Our Website Please Visited Again',
        body_content: 'Visited Again And Enjoy Seamless Experice of Listening Message'
      };


  
      fetch('/send_message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to send message');
        }
      })
      .then(data => {
        console.log(data.message);
        window.alert(data.message);
      })
      .catch(error => {
        console.error('Error sending message:', error);
      });
    }
  }
};
