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
 vm.obj.name = '三蛋'
 vm.arr[3] = '5'
},1000)