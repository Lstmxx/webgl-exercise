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
        name: 'BasicExample1',
        path: 'basic-example1',
        component: () => import('../views/three.js/basic/example1.vue'),
      },
      {
        name: 'BasicExample2',
        path: 'basic-example2',
        component: () => import('../views/three.js/basic/example2.vue'),
      },
      {
        name: 'BasicExample3',
        path: 'basic-example3',
        component: () => import('../views/three.js/basic/example3.vue'),
      },
      {
        name: 'ControlsExample1',
        path: 'controls-example1',
        component: () => import('../views/three.js/controls/example1.vue'),
      },
      {
        name: 'MaterialExample1',
        path: 'material-example1',
        component: () => import('../views/three.js/material/example1.vue'),
      },
      {
        name: 'GeometryExample1',
        path: 'geometry-example1',
        component: () => import('../views/three.js/geometry/example1.vue'),
      },
    ],
  },
  {
    path: '/visualization-learn',
    name: 'VisualizationLearn',
    component: () => import('../views/visualization-learn/index.vue'),
    children: [
      {
        name: 'VisualizationLearn01',
        path: '01',
        component: () => import('../views/visualization-learn/01/index.vue'),
      },
      {
        name: 'VisualizationLearn02',
        path: '02',
        component: () => import('../views/visualization-learn/02/index.vue'),
      },
      {
        name: 'VisualizationLearn03',
        path: '03',
        component: () => import('../views/visualization-learn/03/index.vue'),
      },
      {
        name: 'VisualizationLearn04',
        path: '04',
        component: () => import('../views/visualization-learn/04/index.vue'),
      },
      {
        name: 'VisualizationLearn05',
        path: '05',
        component: () => import('../views/visualization-learn/05/index.vue'),
      },
      {
        name: 'VisualizationLearn06',
        path: '06',
        component: () => import('../views/visualization-learn/06/index.vue'),
      },
      {
        name: 'VisualizationLearn07',
        path: '07',
        component: () => import('../views/visualization-learn/07/index.vue'),
      },
      {
        name: 'VisualizationLearn08',
        path: '08',
        component: () => import('../views/visualization-learn/08/index.vue'),
      },
      {
        name: 'VisualizationLearn09',
        path: '09',
        component: () => import('../views/visualization-learn/09/index.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
