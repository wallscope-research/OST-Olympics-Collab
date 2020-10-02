import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

/* FontAwesome */
import '@/utils/imports/font-awesome';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueSimpleAlert from "vue-simple-alert";

Vue.use(VueSimpleAlert);
Vue.component('icon', FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');




