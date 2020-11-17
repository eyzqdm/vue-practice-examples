<template>
  <div>
    <my-form>
        <Form-item :label="'用户名'">
          <M-input :value="userInfo.userName" @input = "onInput" placeholder="请输入用户名"></M-input>
        </Form-item>
        <Form-item :label="'密码'">
          <M-input :value="userInfo.userName" type="password" @input = "onInput"></M-input>
        </Form-item>
    </my-form>
    {{userName}}
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
      }
    }
  },
  methods: {
    onInput (e) {
      this.userName = e
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
