<template>
  <div>
    <div class="header">
      <slot name="header"></slot>
    </div>
    <div class="body">
      <!-- 匿名插槽 -->
      <slot></slot>
    </div>
    <!-- 作用域插槽· 使用普通插槽还是作用域插槽 主要看插槽里的数据从哪来 
    这里把插槽本身的数据绑定到了插槽坑位上（注意可能绑定很多个数据），这样在
    index组件中用插槽时，该坑位就会得到一个数据对象，于是可以用对象结构的方式得到想要展示的数据
    -->
    <div class="footer">
      <slot name="footer" :fc="footerContent"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        remark: [
          '好好学习，天天向上',
          '学习永远不晚',
          '学习知识要善于思考,思考,再思考',
          '学习的敌人是自己的满足,要认真学习一点东西,必须从不自满开始',
          '构成我们学习最大障碍的是已知的东西,而不是未知的东西',
          '在今天和明天之间,有一段很长的时间;趁你还有精神的时候,学习迅速办事',
          '三人行必有我师焉；择其善者而从之，其不善者而改之'
        ]
      }
    },
    computed: {
      footerContent() {
        return this.remark[new Date().getDay() - 1] 
      }
    },
  }
</script>

<style scoped>
.header {
  background-color: rgb(252, 175, 175);
}
.body {
  display: flex;
  background-color: rgb(144, 250, 134);
  min-height: 100px;
  align-items: center;
  justify-content: center;
}
.footer {
  background-color: rgb(114, 116, 255);
}
</style>