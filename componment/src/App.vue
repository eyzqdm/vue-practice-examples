<!--
 * @Author: your name
 * @Date: 2020-11-13 10:13:44
 * @LastEditTime: 2021-03-03 19:34:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \GVuec:\Users\Administrator\Desktop\Vue源码\新建文件夹\vue-practice-examples\componment\src\App.vue
-->
<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <h3>{{num}}</h3>
    <button @click="add">add</button>
    <router-view />
  </div>
</template>
<script>
export default {
  data(){
    return{
      num:1
    }
  },
  methods:{
    add(){
      this.num++
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
