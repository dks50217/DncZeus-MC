// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import installPlugin from '@/plugin'
import 'iview/dist/styles/iview.css'

import './index.less'
import '@/assets/icons/iconfont.css'
import TreeTable from 'tree-table-vue'

import { initRouter } from '@/libs/router-util'


// 實際打包時應該不引入mock
/* eslint-disable */
// if (process.env.NODE_ENV !== 'production') require('@/mock')

import hasPermission from '@/directive/hasPermission.js';
Vue.use(hasPermission);

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(TreeTable)
/**
 * @description 註冊admin內建外掛
 */
installPlugin(Vue)
/**
 * @description 生產環境關掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全域性註冊應用配置
 */
Vue.prototype.$config = config
/**
 * 註冊指令
 */
importDirective(Vue)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  created(){

  },
  mounted() {
    var target = this;
    //initRouter(target);
    // 呼叫方法，動態產生路由
    setTimeout(function(){
      //initRouter(target);
    },1500);
  },
  render: h => h(App)
})
