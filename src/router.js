import Vue from 'vue'
import Router from 'vue-router'
import login from "@/components/login";
import main from "@/components/main";

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'main',
            component: main
        },
        {
            path: '/login',
            name: 'login',
            component: login
        }
    ]
})
