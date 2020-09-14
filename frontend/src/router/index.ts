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
    beforeEnter: async (to, from, next) => {
      const name = await fetchRandomAthlete()
      next(`/athlete/${name}`)
    }
  },
  {
    path: '/athlete/:athleteID',
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

async function fetchRandomAthlete(){
  const uris = [
    "http://wallscope.co.uk/resource/olympics/athlete/UsainStLeoBolt",
    "http://wallscope.co.uk/resource/olympics/athlete/JessicaPhyllisEnnisHill",
    "http://wallscope.co.uk/resource/olympics/athlete/VanessadeSousaFernandes"
  ];
  const uri = uris[Math.floor(Math.random() * uris.length)]
  return uri.split("/").pop()
}

export default router;
