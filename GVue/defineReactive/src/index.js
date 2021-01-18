import GVue from '../source/GVue'

let vm = new GVue({
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

setTimeout(()=>{
  vm.age++
  vm.obj.name = '狗子'
  vm.arr[2] = 4
},1000)