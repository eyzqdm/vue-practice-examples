import Link from './krouter-link'
import View from './krouter-view'
let Vue
class myRouter{
    constructor (options){
        this.$options = options
        /* 当执行到这一步时，显然已经加载过插件了。Vue使用use方法加载插件时会将整个vue实例传递进去。
        install方法中也将Vue进行了保存。因此这里可以直接用Vue的方法。
        Vue.util.defineReactive  定义一个对象的响应属性 三个参数分别为  obj: 目标对象，key: 目标对象属性；value: 属性值

        当一个属性被设置成响应式属性后，当他发生变化时，所有依赖他的节点都会重新渲染。
         */
        // Vue.util.defineReactive(this, 'current', '/')
        this.current = window.location.hash.slice(1) || '/' // 给初值
        /* match方法可以递归遍历路由表，获得匹配关系数组 */
        Vue.util.defineReactive(this, 'matched', [])
        this.match()

        window.addEventListener('hashchange', this.onHashChange.bind(this))
        window.addEventListener('load', this.onHashChange.bind(this))

        // 创建一个路由映射表，不然每次监听路由变化时，都要循环一次routes列表，性能浪费。
       /*  this.routeMap = {}
        options.routes.forEach(route => {
        this.routeMap[route.path] = route
        }) */
    }
    onHashChange () {
        this.current = window.location.hash.slice(1)
        this.matched = []
        this.match()
      }
    match (routes){
       routes = routes || this.$options.routes
       for (const route of routes){
         if (route.path === '/' && this.current === '/') // 严格匹配
         {
           this.matched.push(route)
           return
         }
         else if (route.path !== '/' && this.current.includes(route.path))
         {
           this.matched.push(route)
           if (route.children)
           {
             this.match(route.children)
           }
           return
         }
       }
    }
}
myRouter.install = function (_Vue){
    Vue = _Vue
    /* 这里的问题是如何挂载到Vue根实例上。这里注意到main.js中创建Vue根实例时挂在了一个router 选项。
    也即是说只有Vue根实例才有这个选项，因此只要在Vue根实例加载时将router实例挂载到Vue原型上即可。
    那如何知道当前的实例是不是根实例呢。可以用到全局混入。因为它会影响每个单独创建的 Vue 实例 (包括第三方组件)。
    可以混入一个beforeCreate生命周期，在其中判断当前实例有没有router这个选项。有的话则挂载router。
     */
    Vue.mixin({
        beforeCreate () {
            // 确保根实例的时候才执行，因为只有根实例才有router这个选项。同理vuex也是这么写
            if (this.$options.router) {
              Vue.prototype.$router = this.$options.router
            }
          }
    })
    /* 实现两个全局组件router-link和router-view
    这里不能使用template，因为template最终是要被编译为html标签的。而此时是纯运行时环境，
    没有编译器。因此要使用render函数
    */
  Vue.component('router-link', Link)
  Vue.component('router-view', View)
}
export default myRouter
