import Dep from './dep';
/* 依赖收集与派发更新的数据结构 */
// 总体是一个weakMap 键名是目标兑现 键值是一个map结构
// 该map结构的键名是目标对象的每一个属性key,键值是set结构，存储了该属性变化时应该触发的所有回调
// 将回调放入栈中的作用等同于v2 中将watcher放入全局栈中 目的是为了依赖收集时可以在全局访问到当前渲染watcher（v3中的回调）

// 手写proxy观察者 watchEffect

function isObj (obj){

    return typeof obj === 'object'

}

export function observe (obj){

    console.log(obj)
 
    if (!isObj(obj)) {
        return obj
      }

    return new Proxy(obj,{
     
        get(target,key,receiver){

            console.log(key)

            const res = Reflect.get(target,key,receiver) // proxy中的每个方法都与reflect中的同名方法对应

            //  依赖收集 v2中这里是将dep和watcher相互关联
            track(target,key)

            // 深层响应化
            return isObj(obj)? observe(res):res
        },
        set(target,key,val,receiver){
            console.log('set', key)

            const res = Reflect.set(target, key, val,receiver)
            // 派发更新
            trigger(target, key)
            return res
        },
        deleteProperty(target, key) {
            console.log('delete', key)
            const res = Reflect.deleteProperty(target, key)
            trigger(target, key)
            return res
        }
    })
}
// 全局cb栈

const cbStack = []

/* 存储依赖关系数据结构 由于需要用对象作为键名，因此使用WeakMap 结构。
它的整体结构是，以需要响应化的对象作为键名，键值是一个map结构。
该map结构以每个对象的属性名为键名，键值为set结构。存储了该属性变化时需要触发的所有回调
 */
const targetMap = new WeakMap() 

// v2中为组件添加watcher时,watcher会进行首次渲染，触发get，进而触发依赖收集。
// 因此这里要将观察者的回调首先执行一次，且在执行时要将该回调添加到全局栈中，以便依赖收集时能在全局访问到该回调。

export function effect(fn) {
    
    cbStack.push(fn)
    // 触发依赖收集
    fn()
    cbStack.pop()
}

function track (target,key){

    const effect = cbStack[cbStack.length - 1] // 获取当前回调
    if (effect) {
        // 建立target，key和effect之间映射关系
        let depMap = targetMap.get(target)
        // 初始化时不存在创建一个
        if (!depMap) { // 全局的WeakMap没有当前目标对象的键名
          depMap = new Map() // 很明白
          targetMap.set(target, depMap)
        }
    
        // 获取key对象的set
        let deps = depMap.get(key) // 这个deps相当于v2 dep对象中deps属性,是一个数组,存储了所有观察自己的watcher
        // 而这里的结构是set
        if (!deps) { // 很明白
          deps = new Set()
          depMap.set(key, deps)
        }
    
        deps.add(effect) // map的添加方法 给当前set加一个回调函
      }
}
function trigger (target,key){

  // 根据target和key获取对应的set
  // 并循环执行他们
  const depMap = targetMap.get(target)
  if (!depMap) {
    return
  }
  const deps = depMap.get(key)
  console.log(deps)
  deps.forEach(dep => dep())

}

/* const foo = reactive({
    name:'xiaom',
    wife:{
        name:'xiaoh'
    }
})

effect(() => {
    console.log(foo.name)
})

effect(() => {
    console.log(foo.wife.name)
}) */