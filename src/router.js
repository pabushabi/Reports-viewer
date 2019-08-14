import Vue from 'vue'
import Router from 'vue-router'
import login from "@/components/login";
import home from "@/components/home";
import admin from "@/components/admin";
import pageNotFound from "@/components/pageNotFound";

Vue.use(Router);

const router = new Router({
    // mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: home,
            meta: {
                requiredAuth: true
            }
        },
        {
            path: '/login',
            name: 'login',
            component: login,
            meta: {
                noauth: true
            }
        },
        {
            path: '/admin',
            name: 'adminpage',
            component: admin,
            meta: {
                requiredAuth: true,
                admin: true
            }
        },
        {
            path: '*',
            name: 'PageNotFound',
            component: pageNotFound
        }
    ]
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiredAuth))
        if (localStorage.getItem('token') === null)
            next({
                path: '/login',
                params: {nextUrl: to.fullPath}
            });
        else next();
    else next();
    if (to.matched.some(record => record.meta.admin)) {
        if (localStorage.getItem('admin') !== "true") {
            next({
                path: '/',
                params: {nextUrl: to.fullPath}
            });
        } else next();
    } else next();
    if (to.matched.some(record => record.meta.noauth)) {
        if (localStorage.getItem('token') !== null) {
            next({
                path: '/',
                params: {nextUrl: to.fullPath}
            });
        } else next();
    } else next();

});

export default router;
