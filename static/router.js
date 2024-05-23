import Home from "./components/Home.js"
import login  from "./components/login.js"
import user from "./components/user.js"
import upload from "./components/upload.js"
import register from "./components/register.js"
import artist from "./components/artist.js"
import album from "./components/album.js"
import allalbums from "./components/allalbums.js"
import allsongs from "./components/allsongs.js"
import albumedit from "./components/albumedit.js"
import songedit from "./components/songedit.js"
import playlist from "./components/playlist.js"
import allplaylists from "./components/allplaylists.js"
import editplaylist from "./components/editplaylist.js"
import allplaylistsong from "./components/allplaylistsong.js"
import search from "./components/search.js"
import AdminHome from "./components/AdminHome.js"
import allusers from "./components/allusers.js"
import allartist from "./components/allartist.js"
import adminlogin from "./components/adminlogin.js"









const routes=[
    {path:'/', component:Home, name:'Home'},
    {path: '/login', component : login , name: 'login'},
    {path: '/user', component : user , name: 'user'},
    {path: '/upload', component : upload , name: 'upload'},
    {path: '/register', component : register , name: 'register'},
    {path: '/artist', component : artist , name: 'artist'},,
    // {path: '/playlist', component: playlist, name: 'playlist' },
    {path: '/album', component: album, name: 'album' },
    {path: '/allalbums', component: allalbums, name: 'allalbums' },
    {path: '/allsongs', component: allsongs, name: 'allsongs' },
    {path: '/albumedit', component: albumedit, name: 'albumedit' },
    {path: '/songedit', component: songedit, name: 'songedit' },
    {path: '/playlist', component: playlist, name: 'playlist' },
    {path: '/allplaylists', component: allplaylists, name: 'allplaylists' },
    {path: '/editplaylist', component: editplaylist, name: 'editplaylist' },
    {path: '/allplaylistsong', component: allplaylistsong, name: 'allplaylistsong' },
    {path: '/search', component: search, name: 'search' },
    {path: '/AdminHome', component: AdminHome, name: 'AdminHome' },
    {path: '/allusers', component: allusers, name: 'allusers' },
    {path: '/allartist', component: allartist, name: 'allartist' },
    {path: '/adminlogin', component: adminlogin, name: 'adminlogin' },




]
export default new VueRouter({
    routes,
})
