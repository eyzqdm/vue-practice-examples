export default {
  /* render函数用来生成虚拟dom，接收一个createElement函数（一般叫他h函数），并返回该函数的执行结果。
   h函数接受三个参数，分别是参数一（一个标签名或组件选项对象）参数二（与模板中属性对应的数据对象）参数三（子节点） */

   /* 1.为什么使用render？而不是写Template。
      2.嵌套路由
     */

    /*
    嵌套路由
    标记当前router-view的深度。
      */
  render (h) {
    // 获取path对应的component
    /* this.$vnode.data.routerView = true
    let depth = 0
    let parent = this.$parent
    while (parent)
    {
      const vnodeData = parent.$vnode && parent.$vnode.data
      if (vnodeData)
      {
        if (vnodeData.routerView){
          depth++
        }
      }
      parent = parent.$parent
    }
    const { routeMap, current } = this.$router
    console.log(this.$router, current) */
    // const component = routeMap[current].component || null
    let component = null
    const length = this.$router.matched.length
    console.log(this.$router.matched)
    const route = this.$router.matched[length - 1]
    if (route)
    {
      component = route.component
    }
    return h(component)
  }
}
