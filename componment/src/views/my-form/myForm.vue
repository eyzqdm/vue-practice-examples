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
  }
}
</script>

<style>

</style>
