class GVue{
    constructor(options){
        this.$data = options.data
        this._template = document.querySelector(options.el);
        this._parent = this._template.parentNode; // 用于替换页面结构 临时性处理

    }
    reactive(){ // 将data响应化
      observe(this.$data, this) // 传入实例 临时性处理 便于在set中更新模板
      proxy(this,'$data')
    }
    
    mount(){ // 挂载
       
      this.render = this.createRenderFn()
      // 之后只要调用render 就会生成最新的更新后的vdom

      this.mountComponent()
    }


    createRenderFn(){ // 返回一个函数 生成虚拟dom 
     let AST = getVNode(this._template)

     // AST是带坑的模板 要一直留着他 不能在combine中直接改变他 因为传入的是引用 改的话相当于直接改模板了
     // 可以考虑用深拷贝

     return function (){  // 高阶函数
       
        // 模板与数据结合

        const vnode = combine(AST,this.$data)

        // AST被改变了 没有坑了 

        return vnode 
     }

    }

    mountComponent(){ // 
        
      this.update(this.render())
    }

    update(vnode){ // 将vdom渲染到页面

        // 进行diff 这里先做简化 直接替换模板
        let realDom = parseVnode(vnode)


        this._parent.replaceChild(realDom,document.querySelector('#root'));
        /* 通过querySelector（querySelectorAll）获取到元素之后，不论html元素再怎么改变，
        这个变量并不会随之发生改变，这个变量已经和html元素没有任何关系了。 */

    }


}

class Vnode {

    constructor(tag, attrs, value, type){
        this.tagName = tag&&tag.toLowerCase // 标签名
        this.attrs = attrs  // 标签属性
        this.value = value // 标签插值
        this.type = type // 标签类型
        this.children = []
    }

    addChildren(vnode){
        this.children.push(vnode)
    }
}

/** 代理 将某一个对象的属性访问 映射到对象的某一个属性成员上 */
function proxy(target, prop) {
  Object.keys(target[prop]).forEach((key)=> {
      Object.defineProperty(target,key,{
          enumerable: true,
          configurable: true,
          get(){
              return target[prop][key];
          },
          set(newValue){
               
              target[prop][key] = newValue
          }
      })
  })
}

function defineReactive (obj,key,value){ // 数据响应化

    const that = this

    if(typeof value === 'object' && value != null){
      
      // 传入observe的可能是数组吗？不可能
      observe(value,that)
    }

    Object.defineProperty(obj,key,{
        configurable: true, // 可配置
        enumerable: true, // 可枚举
        get(){
            console.log('读取'+key)
            return value
        },
        set(newValue){
            console.log('设置'+key+'为'+newValue)

            typeof newValue === 'object'&&observe(newValue)

            value = newValue // 目前的问题 传入的newVal是对象的话没法对该对象响应化 临时解决办法是observe一下
             
            //数据已更新 更新模板并渲染到页面
            that.mountComponent();
        }
    })

}

let Array_Methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'reverse',
    'sort',
    'splice',
  ];

function createArrayProto(Methods){ //  创建响应式数组原型 柯里化 参数是需要响应化的方法


  /* 核心原理是在数组实例的原型链上加一层，
  让数组实例访问数组方法时首先访问的是新增的原型上的改写过的方法 */

    let Array_Proto = Object.create( Array.prototype ) 

    
    Methods.forEach((method) => {
      
        Array_Proto[method] = function(){

            console.log('重写的' + method +' 方法')
            debugger
            console.log(arguments)

            for( let i = 0; i < arguments.length; i++ ) { // 对调用数组方法时出传入的数据进行响应化
               typeof arguments[ i ] === 'object'&&observe( arguments[ i ] );
            } 

            /* 更新页面方法暂时空缺 */

            return Array.prototype[method].apply(this,arguments)

        }
    })

    return function (array,vm){

        array.__proto__ = Array_Proto

        /* 对数组中的数据响应化 这样数组中的值。。 */

        array.forEach((item) => {

          observe(item,vm)
        })
    }
}

// 每次调用reactiveArray 传入数组 会将该数组响应化
const reactiveArray = createArrayProto(Array_Methods)


function observe(obj,vm){  // 将对象响应化（数组，对象）

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
  把这个响应化过程好好捋一遍
   */

    Object.keys(obj).forEach((key) => {
       
        /* 对象和数组的响应化处理方式不同 */
        let value = obj[key]
        if(Array.isArray(value)){
           
            reactiveArray(value,vm) 
        }
        // 完美 这样数组本身也是响应式了 整体修改数组也会被监听
            defineReactive.call(vm,obj,key,value) // call一下 函数中的this就是Vue实例了

    })
}

function getVNode(node){ // 将模板转换为带坑的vnode（带插值表达式）

    const nodeType = node.nodeType
    let _vnode = null
    if(nodeType === 1) // 元素节点 没有nodeValue属性
    {
      let _attrs = {}
      let attrs = node.attributes;
      /* node.attributes.forEach((attr) => {
        _attrs[attr.nodeName] = attr.nodeValue
      }) */
      for ( let i = 0; i < attrs.length; i++ ) { // attrs[ i ] 属性节点 ( nodeType == 2 )
        _attrs[ attrs[ i ].nodeName ] = attrs[ i ].nodeValue;
      }
      _vnode = new Vnode(node.nodeName,_attrs,undefined,nodeType)

      // 子元素

      node.childNodes.forEach((child) => {
          
        _vnode.addChildren( getVNode(child) )

      })
    }
    else if(nodeType === 3) // 文本节点
    {
        _vnode = new Vnode(undefined, undefined, node.nodeValue, nodeType)
        return _vnode
    }


    return _vnode
}

function parseVnode(vnode){ // 虚拟dom转换为真实dom
  let type = vnode.type
  let _node = null
  if(type === 1 ){ 
      _node = document.createElement(vnode.tagtagName)
      Object.keys(vnode.attrs).forEach((attr) => {
          _node.setAttribute(attr,vnode.attrs[attr])
      })
     // 子元素
      vnode.children.forEach((subVnode) => {
        
        _node.appendChild(parseVnode(subVnode))

      })
  }
  else if(type === 3){
   
    return document.createTextNode(vnode.value) // 文本节点的其他属性?
  }

  return _node
}

let brackets = /\{\{(.+?)\}\}/g; // 获取插值的正则
function getValueByPath(obj,path){

    let paths = path.split('.');
    let res = obj;
    let prop // 存储临时路径
    while ( prop = paths.shift()) {
        res = res[prop];
    }

    return res
}

function combine(vnode,data){ // 将带坑的vnode与数据结合

      let _type = vnode.type;
      let _attrs = vnode.attrs;
      let _value = vnode.value;
      let _tag = vnode.tagName;
      let _children = vnode.children;


      let _vnode = null;

      if ( _type === 3 ) { // 文本节点 

        // 对文本处理
        _value = _value.replace( brackets, function ( _, g ) {
          return getValueByPath( data, g.trim() ); // 除了 get 读取器
        } );

        _vnode = new Vnode( _tag, _attrs, _value, _type )

      } else if ( _type === 1 ) { // 元素节点
        _vnode = new Vnode( _tag, _attrs, _value, _type );
        _children.forEach( _subvnode => _vnode.addChildren( combine( _subvnode, data ) ) );
      }

      return _vnode;


      // 这里的数组响应化只是数组的数据响应化了 数组本身没有响应化 但是对象和对象的数据都是响应化的
      // 即不论是对象的数据变化 还是直接给对象整体赋值 都可以响应式的更新页面 因为对象有object.defineProty,而数组没有

    // 数值数组怎么办  vue2里好像也没法解决 是用vue.set设置的？
    // 数组整体赋值怎么办  已解决
    // 对象增减数据怎么办 参考村长 $set?
    // 后期加入diff v-model等指令 要逐步完善
  
}