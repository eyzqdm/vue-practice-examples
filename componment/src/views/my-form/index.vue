<template>
  <div>
    <my-form :model = "userInfo" :rules="rules" ref="loginForm">
        <Form-item :label="'用户名'" prop="userName">
          <M-input :value="userInfo.userName" @input = "onInput" placeholder="请输入用户名"></M-input>
        </Form-item>
        <Form-item :label="'密码'" prop="password">
          <M-input :value="userInfo.password" type="password" @input = "onPasswordInput"></M-input>
        </Form-item>
         <Form-item >
           <button @click="login">登录</button>
        </Form-item>
    </my-form>
  </div>
</template>

<script>
import MInput from './myInput'
import FormItem from './myFormItem'
import myForm from './myForm'
export default {
  provide () {
    /* 为方便维护，这里将整个实例传递下去，后代组件按需注入即可 */
    return {
      form: this
    }
  },
  data () {
    return {
      userInfo: {
        userName: '小米',
        password: '123'
      },
      rules: {
        userName: [{ required: true, message: '请输入用户名称' }],
        password: [{ required: true, message: '请输入密码' }]
      }
    }
  },
  methods: {
    onInput (e) {
      this.userInfo.userName = e
    },
    onPasswordInput (e) {
      this.userInfo.password = e
    },
    login () {
    /* 进行全局校验，需要在form组件中定义validate方法 该方法会获取所有formItem实例
    并调用其自身的validate方法。同时，该方法会接受一个回调函数作为参数，该回调接受一个
    布尔值，根据布尔值判断是否可以登录。 */
      this.$refs.loginForm.validate(valid => {
      /*  const notice = this.$create(Notice, {
          title: "社会你杨哥喊你来搬砖",
          message: valid ? "请求登录!" : "校验失败!",
          duration: 2000
        });
        notice.show(); */
        if (valid) {
          alert('submit')
        } else {
          console.log('error submit!')
          return false
        }
      })
    }
  },
  components: {
    MInput,
    FormItem,
    myForm
  }
}
</script>

<style>

</style>
