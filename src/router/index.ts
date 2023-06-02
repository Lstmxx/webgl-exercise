import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/core/layout/index.vue'),
  },
  {
    path: '/threeJs',
    name: 'threeJs',
    component: () => import('@/core/layout/index.vue'),
    children: [
      {
        name: 'BasicExample1',
        path: 'basic-example1',
        component: () => import('../modules/three-js/basic/example1.vue'),
      },
      {
        name: 'BasicExample2',
        path: 'basic-example2',
        component: () => import('../modules/three-js/basic/example2.vue'),
      },
      {
        name: 'BasicExample3',
        path: 'basic-example3',
        component: () => import('../modules/three-js/basic/example3.vue'),
      },
      {
        name: 'BasicExample4',
        path: 'basic-example4',
        component: () => import('../modules/three-js/basic/example4.vue'),
      },
      {
        name: 'BasicExample5',
        path: 'basic-example5',
        component: () => import('../modules/three-js/basic/example5.vue'),
      },
      {
        name: 'BufferGeometry',
        path: 'buffer-geometry',
        component: () => import('../modules/three-js/basic/buffer-geometry.vue'),
      },
    ],
  },
  {
    path: '/visualization-learn',
    name: 'VisualizationLearn',
    component: () => import('@/core/layout/index.vue'),
    children: [
      {
        name: 'VisualizationLearn01',
        path: '01',
        component: () => import('../modules/visualization-learn/01/index.vue'),
      },
      {
        name: 'VisualizationLearn02',
        path: '02',
        component: () => import('../modules/visualization-learn/02/index.vue'),
      },
      {
        name: 'VisualizationLearn03',
        path: '03',
        component: () => import('../modules/visualization-learn/03/index.vue'),
      },
      {
        name: 'VisualizationLearn04',
        path: '04',
        component: () => import('../modules/visualization-learn/04/index.vue'),
      },
      {
        name: 'VisualizationLearn05',
        path: '05',
        component: () => import('../modules/visualization-learn/05/index.vue'),
      },
      {
        name: 'VisualizationLearn06',
        path: '06',
        component: () => import('../modules/visualization-learn/06/index.vue'),
      },
      {
        name: 'VisualizationLearn07',
        path: '07',
        component: () => import('../modules/visualization-learn/07/index.vue'),
      },
      {
        name: 'VisualizationLearn08',
        path: '08',
        component: () => import('../modules/visualization-learn/08/index.vue'),
      },
      {
        name: 'VisualizationLearn09',
        path: '09',
        component: () => import('../modules/visualization-learn/09/index.vue'),
      },
      {
        name: 'VisualizationLearn11',
        path: '11',
        component: () => import('../modules/visualization-learn/11/index.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
