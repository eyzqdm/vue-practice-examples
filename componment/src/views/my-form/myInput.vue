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
    }
  }
}
</script>

<style>

</style>
