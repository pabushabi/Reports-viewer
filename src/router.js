import Vue from 'vue'
import Router from 'vue-router'
import login from "@/components/login";
import home from "@/components/home";
import apptable from "@/components/apptable";
import admin from "@/components/admin";

Vue.use(Router);

export default new Router({
    // mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: home
        },
        {
            path: '/login',
            name: 'login',
            component: login
        },
        {
            path: '/admin',
            name: 'adminpage',
            component: admin
        }
    ]
})
