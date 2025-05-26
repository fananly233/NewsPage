import { createWebHashHistory, createRouter } from "vue-router";

const routes = [
    {
        path : '/',
        name : 'Home',
        component : () => import ('../views/HomePage.vue')
    },
    {
        path : '/login',
        name : 'Login',
        component : () => import ('../views/LoginPage.vue')
    },
    {
        path : '/login/admin',
        name : 'AdminLogin',
        component : () => import ('../views/AdminPage.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router;