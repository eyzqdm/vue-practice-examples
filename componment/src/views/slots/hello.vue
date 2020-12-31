<template>
    <div>
        <input type="text" v-model="value" />
        <button @click="addFeature">添加</button>
        <ul>
            <li v-for="(feature,index) in features" :key="index">{{feature}}</li>
            <li>特性总数：{{count}}</li>
        </ul>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Feature } from '@/types'

@Component
export default class Hello extends Vue {
    features: Feature[] = [];
    value:string = ''
    addFeature (){
    // target类型EventTarget
    const feature = { id: this.features.length + 1, name: this.value }
    this.features.push(feature)
    return feature
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
