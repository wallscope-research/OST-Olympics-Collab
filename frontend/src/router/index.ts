import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import AthleteView from '../views/AthleteView.vue';
import SportView from '../views/SportView.vue';
import ContinentView from '../views/ContinentView.vue';
import BackToTop from 'vue-backtotop'

Vue.use(BackToTop);
Vue.use(VueRouter);

const defaultAthleteURI = 'JessicaPhyllisEnnisHill';


const routes: Array<RouteConfig> = [
  {
    path: "/",
    redirect: `athlete/${defaultAthleteURI}`
  },
  {
    path: '/athlete/:athlete1',
    component: AthleteView,
    props: true,
  },
  {
    path: '/sport/:sport1',
    name: 'sport',
    component: SportView,
    props: true,
  },
  {
    path: '/continent/:continent1',

    component: ContinentView,
    props: true,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
