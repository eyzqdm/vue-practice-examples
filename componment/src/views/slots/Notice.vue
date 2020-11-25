<template>
  <div class="box" v-if="isNoticeShow">
    <h3>{{title}}</h3>
    <p class="box-content">{{message}}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    duration: {
      type: Number,
      default: 1000
    }
  },
  data () {
    return {
      isNoticeShow: false
    }
  },
  methods: {
    show () {
      this.isNoticeShow = true
      setTimeout(this.hide, this.duration)
    },
    hide () {
      this.isNoticeShow = false
      // 清除自己
      this.remove()
    }
  }
}
</script>

<style>
.box {
  position: fixed;
  width: 20%;
  top: 16px;
  left: 40%;
  text-align: center;
  pointer-events: none;
  background-color: #fff;
  border: grey 3px solid;
  box-sizing: border-box;
}
.box-content {
  width: 150px;
  margin: 10px auto;
  font-size: 14px;
  padding: 8px 16px;
  background: #fff;
  border-radius: 3px;
  margin-bottom: 8px;
}
</style>
