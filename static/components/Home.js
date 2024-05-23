import AdminHome from "./AdminHome.js";
import artist from "./artist.js";
import user from "./user.js";
import adminlogin from "./adminlogin.js";

export default {
    template: `
    <div style="background-color: #f8f9fa; padding: 20px; color: #333; font-family: Arial, sans-serif; text-align: center;">
        <h1 style="color: #ff6b6b; font-size: 36px; margin-bottom: 20px;">Welcome to Melody Mingle {{$route.query.role}}</h1>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Melody Mingle is not just another music app; it's your gateway to a symphony of sounds, a canvas for musical expression, and a community of like-minded enthusiasts. Dive into a world where every beat tells a story, where genres blend seamlessly, and where discovery knows no bounds. With Melody Mingle, the stage is yours, whether you're an artist ready to showcase your talent or a listener eager to explore new rhythms. Let your journey through melodies begin here.
        </p>
        <AdminHome v-if="UserRole=='admin'" />
        <artist v-if="UserRole=='artist'" />
        <button v-if="UserRole !== 'admin'" @click="redirectToAdminLogin">Admin Login</button>
    </div>`,
    data(){
        return{
            // UserRole: localStorage.getItem('role'),
            UserRole: 'user'
        }
    },
    methods: {
        redirectToAdminLogin() {
            this.$router.push('/adminlogin');
        }
    },
    components: {
        AdminHome,
        artist,
        user,
    }
}
