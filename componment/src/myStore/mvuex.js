// 保存构造函数引用，避免import
let Vue

class Store {
  constructor (options) {
    // this.$options = options;
    this._mutations = options.mutations
    this._actions = options.actions
    this._getters = options.getters
    // 响应化处理state
    // this.state = new Vue({
    //   data: options.state
    // })
    const computed = {}
    this.getters = {}
    const store = this // 保存this
    Object.keys(this._getters).forEach(key => {
       const fn = store._getters[key]
       /* 借助Vue的计算属性实现getters 由于Vue计算属性无需传参，而getters需传入state
       因此使用高阶函数.这样computed的每一项返回的都是一个函数。此函数的行为就是用户出传入的
       getters，参数是state。computed会返回该函数的执行结果 */
       computed[key] = function (){
         return fn(store.state) // 又一次高阶函数
       }
       // 为getters定义只读属性
      Object.defineProperty(store.getters, key, {
        get: () => store.computed[key]
      })
    })
    this._vm = new Vue({
      data: {
        // 加两个$，Vue不做代理。 访问时直接this.state访问。它和this._vm._data.$$state是等价的
        $$state: options.state
      }
    })
    this.computed = new Vue({
      computed
    })

    // 绑定commit、dispatch的上下文问store实例
    this.commit = this.commit.bind(this)
    this.dispatch = this.dispatch.bind(this)
  }

  // 存取器， store.state
  get state () {
    console.log(this._vm)
    return this._vm._data.$$state
  }

  set state (v) {
    console.error('你造吗？你这样不好！')
  }

  // store.commit('add', 1)
  // type: mutation的类型
  // payload：载荷，是参数
  commit (type, payload) {
    const entry = this._mutations[type]
    if (entry) {
      entry(this.state, payload)
    }
  }

  dispatch (type, payload) {
    const entry = this._actions[type]
    if (entry) {
      entry(this, payload) // 这里执行的就是action中对应的方法，需要将store实例传进去
    }
  }
}

function install (_Vue) {
  Vue = _Vue

  Vue.mixin({
    beforeCreate () {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}
// Vuex
export default {
  Store,
  install
}
