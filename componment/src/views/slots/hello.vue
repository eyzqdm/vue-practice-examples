<template>
    <div>
        <input type="text" v-model="value" />
        <button @click="addFeature">添加</button>
        <button @click="submit">提交</button>
        <ul>
            <li v-for="(feature,index) in features" :key="index">{{feature}}</li>
            <li>特性总数：{{count}}</li>
        </ul>
        <el-form ref="loginForm">

        </el-form>
        <button @click="submit">提交</button>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'
import { Feature } from '@/types'
import { Form } from 'element-ui'

@Component
export default class Hello extends Vue {
   @Ref() loginForm!:Form
    features: Feature[] = [];
    value:string = ''
    addFeature (){
    // target类型EventTarget
    const feature = { id: this.features.length + 1, name: this.value }
    this.features.push(feature)
    return feature
  }
  submit (){
    // 有代码提示了
    this.loginForm.validate(isValid => {
      if (isValid) console.log('login')
    })
  }
  get count () {
    return this.features.length
  }

  async created () {
    // getFeatures().then(res => {
    //   this.features = res.data
    // })

    // const res = await this.$axios.get<Feature[]>('/api/list')

    // console.log(res)
    // [{ id: 1, name: "类型注解" }];
  }
}
</script>
<style scoped>
</style>
