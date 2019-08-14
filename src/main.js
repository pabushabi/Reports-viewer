import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import Vuetify from 'vuetify'
import axios from 'axios'

Vue.config.productionTip = false;
// Vue.prototype.$http = axios;
// const accessToken = localStorage.getItem('token');

// if (accessToken) Vue.prototype.$http.defaults.headers.authorization = accessToken;

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app');
