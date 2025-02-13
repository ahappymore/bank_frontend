import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import userhomePage from '../views/userhomePage.vue';
import operatorhomePage from '../views/operatorhomePage.vue';
import superoperatorhomePage from '../views/superoperatorhomePage.vue';

const routes = [
    { path: '/', redirect: '/login' }, // 默认跳转到登录页
    { path: '/login', name: 'Login', component: LoginPage }, // 登录页
    { path: '/userhome', name: 'userhome', component: userhomePage }, // 登录页
    { path: '/operatorhome', name: 'operatorhome', component: operatorhomePage }, // 登录页
    { path: '/superoperatorhome', name: 'superoperatorhome', component: superoperatorhomePage },// 登录页
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;


