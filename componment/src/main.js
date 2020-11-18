import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import create from './utils/create'

Vue.config.productionTip = false
Vue.prototype.$create = create

/* 手动实现一个bus */

class MyBus {
  constructor () {
    this.callbacks = {} // 存储所有自定义事件的回调函数
  }

  $emit (name, args) { // 触发事件，参数为事件名和参数
    console.log(name)
    this.callbacks[name] = args
  }

  $on (name, callback) { // 监听事件，参数为事件名和回调
    callback(this.callbacks[name])
  }
}
Vue.prototype.$bus = new MyBus() // 重新挂载
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
