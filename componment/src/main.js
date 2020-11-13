import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

/* 手动实现一个bus */

class MyBus {
  constructor () {
    this.callbacks = {} // 存储所有自定义事件的回调函数
  }

  $emit (name, args) { // 触发事件，参数为事件名和参数
    this.callbacks[name] = args
  }

  $onabort (name, callback) { // 监听事件，参数为事件名和回调
    callback(this.callbacks[name])
  }
}
Vue.protoType.myBus = new MyBus()
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
