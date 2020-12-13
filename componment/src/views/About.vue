<template>
  <div class="about">
    <h1>This is an about page</h1>
    <div>{{$store.state.counter}}</div>
    <div @click="$store.commit('add')">add</div>
    <div @click="double">{{$store.getters.doubleCounter}}</div>
    <!-- <div>{{doubleCount}}</div> -->
    <router-view />
  </div>
</template>
<script>
export default {
  methods: {
    double (){
      console.log(this.$store._vm._data.$$state)
    }
  },
  computed: {
    doubleCount (){
      return (function (x){
        return x * 2
      })(this.$store.state.counter)
  }
}
}
</script>
