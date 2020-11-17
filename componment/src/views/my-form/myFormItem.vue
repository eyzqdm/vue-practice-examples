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
    },
    prop: {
      type: String
    }
  },
  data () {
    return {
      error: ''
    }
  },
  methods: {
    validate () {
      console.log(this.form.rules[this.prop])
    }
  },
  mounted () {
    this.$on('validate', () => {
      this.validate()
    })
  }
}
</script>

<style>

</style>
