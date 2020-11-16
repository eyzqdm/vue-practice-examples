<template>
  <div>
    我是组件一
    <button @click="add">+9</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    add () {
      this.$bus.$emit('add', 9)
    }
  }
}
</script>

<style>

</style>
