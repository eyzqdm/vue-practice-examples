const obj1 = {
    name:'xiaom'
}
function defReactive (obj,key,val){

    observe(val)

    Object.defineProperty(obj,key,{
        get(){
            return val
        },
        set(newVal){
            if (newVal !== val) {
                observe(newVal)
                console.log('set ' + key + ':' + newVal);
                val = newVal
                // 更新函数
                update()
              }
        }
    })
}

function update(){
}

function observe (obj){
    if (typeof obj !== 'object' || obj == null) {
        // 希望传入的是obj
        return
      }
    Object.keys(obj).forEach((key) => {
        defReactive(obj,key,obj[key])
    })
}

observe(obj1) // 遍历对象 对每个属性做相应化处理
defReactive(obj1,'age',18) // 新增一个相应化属性
obj1.name = 'xiaoh'
obj1.age = 20