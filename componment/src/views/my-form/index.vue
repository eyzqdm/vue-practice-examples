<template>
  <div>
    <my-form :model = "userInfo" :rules="rules">
        <Form-item :label="'用户名'" prop="username">
          <M-input :value="userInfo.userName" @input = "onInput" placeholder="请输入用户名"></M-input>
        </Form-item>
        <Form-item :label="'密码'" prop="password">
          <M-input :value="userInfo.password" type="password" @input = "onInput"></M-input>
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
        username: [{ required: true, message: '请输入用户名称' }],
        password: [{ required: true, message: '请输入密码' }]
      }
    }
  },
  methods: {
    onInput (e) {
      this.userInfo.userName = e
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
