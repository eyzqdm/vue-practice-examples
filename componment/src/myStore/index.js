import Vue from 'vue'
import Vuex from './mvuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    counter: 0
  },
  getters: {
    doubleCounter (state) {
      return state.counter * 2
    }
  },
  mutations: {
    add (state) {
      state.counter++
      // this.state
    }
  },
  actions: {
    // 结构上下文
    add ({ commit }) { // action使用是会将store实例当作参数传递进去，所以能解构出来commit方法
      setTimeout(() => {
        commit('add')
      }, 1000)
    }
  },
  modules: {
  }
})
