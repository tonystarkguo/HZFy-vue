import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'style';

import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import routes from './routes'
import App from './App.vue'
// import VueAwesomeSwiper from 'vue-awesome-swiper'
// Vue.use(VueAwesomeSwiper);
Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(ElementUI);

const router = new VueRouter(routes);

// Vue.config.debug = true; //开启错误提示
Vue.config.productionTip = false;

window.onload = function() {
    new Vue({
        el: '#app',
        router,
        render: h => h(App)
    });
}