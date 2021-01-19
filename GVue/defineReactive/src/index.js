import GVue from '../source/GVue'

var vm = new GVue({
    el: '#app',
    data:{
        name:'小明',
        age:18,
        gender:'难',
        arr:[1,2,3],
        obj:{
          name:'二蛋'
        }
    }
})

setTimeout(() => {
  vm.name = '123'
  vm.name = '456'
},1000)