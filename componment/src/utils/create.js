/* 创建组件实例 传入组件模板和参数 返回组件实例 */
import Vue from 'vue'
import Notice from '../views/slots/Notice'
function create (Component, props) {
    /* 首先要有组件的构造函数 1 Vue.extend() 2 render
    这里先用render实现 那就要new一个vue实例出来 */
    const vm = new Vue({
    // h是createElement, 返回VNode，是虚拟dom
    // 需要挂载才能变成真实dom
    render: h => h(Component, { props })
    }).$mount() // 这里不指定宿主元素，因为直接指定body的话会将已有的内容替换掉。
    /* 通过dom操作追加元素  $el可以获取真实dom */
    document.body.appendChild(vm.$el)
    /* 获取组件实例 */
    const comp = vm.$children[0]
    /* 添加销毁组件的方法 */
    comp.remove = function () {
        document.body.removeChild(vm.$el)
        vm.$destroy()
    }

    return comp
}
export default {
    /* install方法实现的需求是 在使用组件时不需要再传入组件模板，只需传入参数。
    这里用到函数的柯里化。 */
    install (Vue) {
      Vue.prototype.$notice = function (options) {
        return create(Notice, options)
      }
    }
  }
