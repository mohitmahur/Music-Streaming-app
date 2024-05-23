import router from "./router.js";
import navbar from "./components/navbar.js";
import logout from "./components/logout.js";

new Vue({
    el:'#app',
    template:`<div>
    <navbar v-if="$route.name === 'Home'" />
    <logout v-if="$route.name !== 'Home'" />
    <router-view/>
    </div>`,
    router, 
    components:{
        navbar,
        logout
    }  
})
