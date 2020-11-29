export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  render (h) {
    // <a href="#/about">abc</a>
    // <router-link to="/about">xxx</router-link>
    // h(tag, data, children)
    console.log(this.$slots)
    /* this.$slots是什么？ 可以插槽的内容，default属性包含了所有没有在具名插槽中的节点（是个数组）
    把用户写在router-view中的内容添加在实际的a标签中。
     */
    return h('a', { attrs: { href: '#' + this.to } }, this.$slots.default)
    // return <a href={'#' + this.to}>{this.$slots.default}</a>
  }
}
