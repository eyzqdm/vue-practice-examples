<template>
  <div class="home">
    <button @click="showA">组件一</button>
    <button @click="showB">组件二</button>
    <child-a v-if="isAshow"></child-a>
    <child-b v-if="isBshow"></child-b>
  </div>
</template>

<script>
// @ is an alias to /src
import childA from '../views/vue-bus/child1'
import childB from '../views/vue-bus/child2'
export default {
  name: 'Home',
  data () {
    return {
      isAshow: false,
      isBshow: false
    }
  },
  methods: {
    showA () {
      this.isAshow = true
      this.isBshow = false
    },
    showB () {
      this.isBshow = true
      this.isAshow = false
    }
  },
  components: {
    childA,
    childB
  }
}
</script>
