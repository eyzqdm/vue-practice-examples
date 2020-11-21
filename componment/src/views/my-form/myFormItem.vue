<template>
  <div>
      <label v-if="label">{{label}}</label>
      <slot></slot>
      <p v-if="error" style="color:red">{{error}}</p>
  </div>
</template>

<script>
// Asyc-validator
import Schema from 'async-validator'
export default {
  inject: ['form'], // 注入form实例，获取要校验的值和校验规则
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
      // console.log(this.form.rules[this.prop])
      /* 首先获取验证规则和被验证的值 */
      const rules = this.form.rules[this.prop]
      const value = this.form.userInfo[this.prop]
      /* 创建校验描述对象 需要传入到schema实例中 键：prop 值：规则 */
      const desc = {
        [this.prop]: rules
      }
      /* 创建schema实例 */
      const schema = new Schema(desc)
      /* 校验 schema的validate方法接收两个参数，一个是被校验的数据对象，一个是回调函数 */
      return schema.validate({
        [this.prop]: value
      }, errors => {
        if (errors) {
          this.error = errors[0].message
        } else {
          this.error = ''
        }
      })
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
