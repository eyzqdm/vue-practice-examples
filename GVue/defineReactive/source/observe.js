import Dep from "./dep";

let Array_Methods = [
  "push",
  "pop",
  "shift",
  "unshift",
  "reverse",
  "sort",
  "splice",
];

export function observe(obj) {
  // 将对象响应化（数组，对象）

  /*
    data:{
      name:'123', 
      普通变量响应化后，被改变会被监听到
      obj:{ name:'123'},
      对象obj，进入defineReactive后首先会被observe一下，把他自己的属性响应化。
      即obj.xxx改变时会被监听到。此时obj本身还没被响应化，即data.obj被整体赋值时并不会
      被监听到。data.obj.xxx = yyy 会被监听。data.obj = {} 不会被监听。
      不着急，此时defineReactive代码继续向下执行 data.obj就变成响应式了
      arr:[]
      数组arr ,其每个属性会被响应化，即通过arr的各种方法（push）时会被监听。
      但数组本身被整体赋值则不会被监听，reactiveArray方法没有做这件事
    } 
     */

  Object.keys(obj).forEach((key) => {
    /* 对象和数组的响应化处理方式不同 */
    let value = obj[key];
    if (Array.isArray(value)) {
      reactiveArray(value);
    }
    // 这样数组本身也是响应式了 整体修改数组也会被监听
    defineReactive(obj, key, value); // call一下 函数中的this就是Vue实例了
  });
}

// 每次调用reactiveArray 传入数组 会将该数组响应化
const reactiveArray = createArrayProto(Array_Methods);

function defineReactive(obj, key, value) {
  // 数据响应化

  if (typeof value === "object" && value != null) {
    // 传入observe的可能是数组吗？不可能
    observe(value);
  }

  console.log("创建" + value + "的dep");
  let dep = new Dep(); // 为每个属性创建一个Dep

  Object.defineProperty(obj, key, {
    configurable: true, // 可配置
    enumerable: true, // 可枚举
    get() {
      dep.depend(); // 依赖收集
      return value;
    },
    set(newValue) {
      //console.log('设置'+key+'为'+newValue)

      typeof newValue === "object" && observe(newValue);

      value = newValue; // 目前的问题 传入的newVal是对象的话没法对该对象响应化 临时解决办法是observe一下

      //数据已更新 更新模板并渲染到页面
      //console.log('派发更新')
      dep.notify();
    },
  });
}

function createArrayProto(Methods) {
  //  创建响应式数组原型 柯里化 参数是需要响应化的数组方法

  /* 核心原理是在数组实例的原型链上加一层，
  让数组实例访问数组方法时首先访问的是新增的原型上的改写过的方法 */

  let Array_Proto = Object.create(Array.prototype);

  Methods.forEach((method) => {
    Array_Proto[method] = function () {
      console.log("重写的" + method + " 方法");

      for (let i = 0; i < arguments.length; i++) {
        // 对调用数组方法时出传入的数据进行响应化
        typeof arguments[i] === "object" && observe(arguments[i]);
      }

      /* 更新页面方法暂时空缺 */

      return Array.prototype[method].apply(this, arguments);
    };
  });

  return function (array) {
    array.__proto__ = Array_Proto;

    /* 对数组中的数据响应化 这样数组中的值。。 */

    array.forEach((item) => {
      observe(item);
    });
  };
}
