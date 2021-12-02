import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/webgl',
    name: 'WebGl',
    component: () => import('../views/webgl/example.vue'),
  },
  {
    path: '/threeJs',
    name: 'threeJs',
    component: () => import('../views/three.js/index.vue'),
    children: [
      {
        name: 'example1',
        path: 'example1',
        component: () => import('../views/three.js/example1.vue'),
      },
      {
        name: 'example2',
        path: 'example2',
        component: () => import('../views/three.js/example2.vue'),
      },
      {
        name: 'example3',
        path: 'example3',
        component: () => import('../views/three.js/example3.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
