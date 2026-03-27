/** 主入口js */
import Vue from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import './config/axios-config';
import permission from './utils/permission';
import './styles/index.scss';
import EleAdmin from 'ele-admin';
import DialogDirective from 'ele-admin/packages/dialog-directive';
import AppDialog from './components/AppDialog.vue';
import VueClipboard from 'vue-clipboard2';
import i18n from './lang';
import VueLazyload from 'vue-lazyload'
import '@google/model-viewer';

Vue.config.productionTip = false;
Vue.config.ignoredElements = (Vue.config.ignoredElements || []).concat(['model-viewer']);
Vue.use(EleAdmin, {
  i18n: (key, value) => i18n.t(key, value)
});
Vue.use(permission);
Vue.use(DialogDirective);
Vue.use(VueClipboard);
Vue.component('AppDialog', AppDialog);

// 懒加载配置
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: require('./assets/404.jpg'),
  loading: require('./assets/loading.svg'),
  attempt: 1,
  listenEvents: ['scroll']
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  beforeCreate() {
    Vue.prototype.$bus = this
  }
}).$mount('#app');
