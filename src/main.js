import Vue from 'vue';
import App from './App.vue';
// app service
import { processAuth, isUserLoggedIn } from './services.js';
// router
import VueRouter from 'vue-router';
Vue.use(VueRouter);

// routes
import SpotifyLogin from './components/SpotifyLogin.vue';
import GameView from './components/GameView.vue';

const routes = [
  { path: '/login', component: SpotifyLogin },
  { path: '/game', component: GameView }
];

const router = new VueRouter({ routes });
router.beforeEach((to, from, next) => {
  // intercept Spotify client auth callback
  if (to.path.startsWith('/access_token')) {
    // build auth callback params object
    const authCallbackParamStr = to.path.slice(1);
    const authCallbackParams = authCallbackParamStr.split('&')
      .reduce((params, paramStr) => {
        const [key, value] = paramStr.split('=');
        params[key] = value;
        return params;
      }, {});
    // handle auth on services.js
    processAuth(authCallbackParams);
    // redirect to game page if logged in, otherwise go to login page
    if (isUserLoggedIn()) next({ path: '/game', replace: true });
    else next({ path: '/login', replace: true });
  } else { next(); }
});

new Vue({
  router: router,
  render: h => h(App)
}).$mount('#app')
