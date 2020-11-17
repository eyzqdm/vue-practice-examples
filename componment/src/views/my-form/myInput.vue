<template>
  <div>
    <!-- 组件设计要遵循高内聚，低耦合 高耦合低内聚的代码容易牵一发而动全身，代码复用性极差
    这里input只实现输入数据双向绑定功能，而校验和label交给其父级 formItem。而接收数据和校验规则
    则再交给其父组件Form -->
      <input :value="value" :type="type" @input="onInput" v-bind="$attrs">
    <!-- v-bind="$attrs"展开$attrs这里获取传入的placeholder -->
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    }
  },
  methods: {
    onInput (e) {
      this.$emit('input', e.target.value)
      /* 输入完成 触发校验 而校验在父组件formItem中完成
      因此要通知父组件 这里注意 不能直接用this.$emit
      因为插与被插的关系不是普通的父子关系。父组件不能通过@监听子组件的自定义事件
      因此让父级触发，父级监听 */
      this.$parent.$emit('validate')
    }
  }
}
</script>

<style>

</style>
