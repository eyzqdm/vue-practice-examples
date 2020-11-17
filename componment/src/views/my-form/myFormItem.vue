<template>
  <div>
      <label v-if="label">{{label}}</label>
      <slot></slot>
      <p v-if="error">{{error}}</p>
  </div>
</template>

<script>
export default {
  inject: ['form'],
  props: {
    label: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      error: ''
    }
  }
}
</script>

<style>

</style>
