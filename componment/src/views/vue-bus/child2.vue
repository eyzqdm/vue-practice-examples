<template>
  <div>
    我是组件二
    <span>{{num}}</span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      num: 0
    }
  },
  mounted () {
    this.$bus.$on('add', (e) => {
      this.add(e)
    })
  },
  methods: {
    add (e) {
      this.num += e
    }
  }
}
</script>

<style>

</style>
