import Vue from 'vue';
import Dev from '@/serve-dev.vue';
import VSimpleMagnifier from '@/entry';

Vue.use(VSimpleMagnifier);
Vue.config.productionTip = false;

new Vue({
  render: (h) => h(Dev),
}).$mount('#app');
