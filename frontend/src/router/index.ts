import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import AthleteView from '../views/AthleteView.vue';
import SportView from '../views/SportView.vue';
import ContinentView from '../views/ContinentView.vue';
import BackToTop from 'vue-backtotop'

Vue.use(BackToTop);
Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/athlete'
  },
  {
    path: '/athlete',
    name: 'athlete',
    component: AthleteView,
  },
  {
    path: '/sport',
    name: 'sport',
    component: SportView,
  },
  {
    path: '/continent',
    name: 'continent',
    component: ContinentView,
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  // },
];

const router = new VueRouter({
  routes,
});

export default router;
