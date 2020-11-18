<template>
  <div>
      <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    model: { // 数据对象
      type: Object,
      required: true
    },
    rules: { // 校验规则
      type: Object
    }
  },
  methods: {
    validate (cb) {
      /* 首先获取所有拥有prop属性的子元素实例，button不需要校验所以没有prop */
      const children = this.$children.filter(item => item.prop)
      /* 子元素调用自身的validate，这里需要注意，全局校验需要等待所有子元素自身校验完毕才会继续判断
      是否可以走下一步，但有些校验可能是异步的，比如通过ajax校验，这时有可能没等到异步校验完毕，全局校验
      就已经走出判断，这是不合理的。这里注意到，schema.validate方法返回的是一个promise对象。因此我们可以
      在formItem的validate中将其return出去，之后在这里通过promise.all进行统一处理 */
      const tasks = children.map(item => item.validate())
      /* 此时的tasks是一个由promise实例组成的数组,all方法 只有作为参数的几个promise实例状态都变为fulfilled时，
      它才会变为fulfilled，并将他们的返回值成一个数组传递给自己的回调函数。
      当Promise状态变为fulfilled，说明校验成功，此时就可以执行全局校验的cb，并传入true。反之亦然 */
      Promise.all(tasks).then(() => cb(true))
                        .catch(() => cb(false))
    }
  }
}
</script>

<style>

</style>
