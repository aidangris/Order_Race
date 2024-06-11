import * as Vue from 'vue';
import { createRouter, createWebHistory } from "vue-router";
import Game from "../components/Game.vue";
import Profile from "../components/Profile.vue";
import Register from "../components/Register.vue";
import Login from "../components/Login.vue";
import BoardUser from "../components/BoardUser.vue";

//Vue.use(VueRouter);

const routes = [{
        path: "/",
        name: "Game",
        component: Game,
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
    },
    {
        path: "/register",
        name: "Register",
        component: Register,
    },
    {
        path: "/profile",
        name: "Profile",
        component: Profile,
    },
    {
        path: "/user",
        name: "User",
        component: BoardUser,
    },
    /*{
            path: "/about",
            name: "About",
            component: () =>
                //import ( /* webpackChunkName: "about" 
        "../views/About.vue"),
    },*/
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const publicPages = ['/', '/login', '/register', '/profile'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = localStorage.getItem('user');

    // trying to access a restricted page + not logged in
    // redirect to login page
    if (authRequired && !loggedIn) {
        next('/login');
    } else {
        next();
    }
});

export default router;