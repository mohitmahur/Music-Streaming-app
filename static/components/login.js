export default {
    template: `
    
    <div class="d-flex justify-content-center align-items-center" style="height: 100vh; background-color:grey;">
        <div class="mb-3" style="background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
        <div class="text-danger">*{{error}}</div>
            <label for="user-email" class="form-label" style="color: black; font-size: 18px; font-weight: bold;">Email address</label>
            <input type="email" class="form-control" id="user-email" placeholder="name@example.com" style="border: 2px solid #FF5733; border-radius: 5px; padding: 10px; background-color: #fff; margin-bottom: 10px;"
            v-model="detail.email">
            <label for="user-password" class="form-label" style="color: black; font-size: 18px; font-weight: bold;">Password</label>
            <input type="password" class="form-control" id="user-password" style="border: 2px solid #FF5733; border-radius: 5px; padding: 10px; background-color: #fff; margin-bottom: 10px;"
            v-model="detail.password">
            <label for="username" class="form-label" style="color: black; font-size: 18px; font-weight: bold;">Username</label>
            <input type="text" class="form-control" id="username" style="border: 2px solid #FF5733; border-radius: 5px; padding: 10px; background-color: #fff; margin-bottom: 10px;"
            v-model="detail.username">
            <button  @click="login" style="background-color: #4285F4; color: #fff; border: none; padding: 10px 20px; border-radius: 5px; font-size: 16px;">Submit</button>
        </div>
        
    </div>
    `,
    data(){
        return{
            detail:{
                "email":null,
                "password":null,
                "username":null,
            },
            error:null,
        }
    },
    methods:{
        async login(){
            const response = await fetch('/user_login',{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
                    
                },
                body:JSON.stringify(this.detail)
            })
            const data = await response.json()

            
            if(response.ok){
                localStorage.setItem('auth_token', data.auth_token);
                localStorage.setItem('roles', JSON.stringify(data.role));
            
                // localStorage.setItem('auth_token', data.token)
                // localStorage.setItem('role', data.role)


                if (data.role.includes('user')) {
                    this.$router.push('/user')
                }
                
                if (data.role.includes('artist')) {
                    this.$router.push('/artist')
                }


                if (data.role.includes('admin')) {
                    this.$router.push('/AdminHome')
                }
                
            }else{
                this.error=data.message
            }
        },
    },
}
