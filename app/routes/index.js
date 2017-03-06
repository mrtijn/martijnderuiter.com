import Vue from 'vue';
import vueRouter from 'vue-router';
Vue.use(vueRouter);

import indexView from '../views/index.vue';
// Vue.component('sampleElement', sampleElement);
// DEFINE CUSTOM ROUTES
const routes = [
  {path: '/', component: indexView},
  {path: '*', component: {template: '<div>Page not found </div>'}}
];

export default new vueRouter({
  mode: 'history',
  routes
})
