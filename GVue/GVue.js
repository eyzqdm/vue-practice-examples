class Watcher { // 观察者

  /**
   * 
   * @param {Object} vm 组件实例
   * @param {String|Function} expOrfn 如果是渲染 watcher, 传入的就是渲染函数, 如果是 计算 watcher(计算属性) 传入的就是路径表达式
   */
  constructor(vm, expOrfn){
     
    this.vm = vm;
    this.getter = expOrfn;
    this.deps = []; // 依赖项 也就是被观察者 组件的每个属性都对应一个dep对象

    this.get(); // 首次执行渲染 组件创建时会new一个属于自己的watcher 组件渲染逻辑都在watcher中 因此newWatcher的同时 组件也就渲染了
  }
  /** 计算, 触发 getter */
  get() {
    pushTarget( this ); // 这两个方法是全局的 用于将当前的渲染watcher挂载/踢出全局
    // get方法执行时 说明当前组件正在渲染中,因此在getter前将当前组件的渲染watcher
    // 挂到全局。这样此watcher在全局范围内就可访问到。由于组件渲染时必然会访问组件的每个属性，因为必然触发属性的getter。
    // 因此可以在getter中进行依赖收集

    console.log('执行了渲染')
    this.getter.call( this.vm ); // 绑定上下文
    
    // 渲染完成，将watcher踢出全局
    popTarget();
  }
  run() {
    this.get(); 
    // 在真正的 vue 中是调用 queueWatcher, 来触发 nextTick 进行异步的执行
  }
  /** 对外公开的函数, 用于在 属性发生变化时触发的接口 */
  update() {
    this.run(); 
  }

  /** 清空依赖队列 */
  cleanupDep() {

  }

  /* 依赖收集，即watcher要观察的所有属性都通过该方法添加。
  该方法在dep.depend方法中调用。因为调用depend方法时是在属性的getter中。此时watcher时挂载在全局的
  即dep.target上。dep.depend方法用于watcher与dep的相互关联。即
  一个属性可能有多个观察者观察他，一个观察者也可能要观察多个属性。
   */
  addDep( dep ) {
    this.deps.push( dep );
  }

}

class Dep { // 依赖 每个属性对应一个Dep对象

  constructor(){

    this.subs = [] // 存储所有观察自己的watcher

  }
  /** 添加一个 watcher */
  addSub( sub ) {
    this.subs.push( sub );
  }

  /** 移除一个watcher */
  removeSub( sub ) {
    for ( let i = this.subs.length - 1; i >= 0 ; i-- ) {
      if ( sub === this.subs[ i ] ) {
        this.subs.splice( i, 1 );
      }
    }
  }
  /** 将当前 Dep 与当前的 watcher 相互关联
   * Dep添加到Watcher的deps中
   * Watcher添加到Dep的subs中
  */
  depend() {
    
    if ( Dep.target ) {
      
      this.addSub( Dep.target ); 

      Dep.target.addDep( this ); 

    }
  }
  /** 派发更新 通知自己的所有观察者更新 */
  notify() {
    // 在真实的 Vue 中是依次触发 this.subs 中的 watcher 的 update 方法
  
   this.subs.forEach( watcher => {

      watcher.update()

     });  
   }
}

/*由于页面中可能存在父子组件或多级嵌套组件。而同一时间的全局watcher只能有一个
因此需要一个全局的watcher容器来存储watcher。使用栈结构。这里用数组模拟。
 */
Dep.target = null; // 全局watcher

let targetStack = []; //全局watcher栈 

/** 将当前操作的 watcher 存储到 全局 watcher 中, 参数 target 就是当前 watcher */
function pushTarget( target ) {
  /* 先将当前的全局watcher入栈保存起来,再将全局watcher替换成传入的watcher。
  等 */
  targetStack.unshift( Dep.target ); 
  Dep.target = target;
}

/** 等当前全局的渲染watcher的getter执行结束，将其剔除全局，再将之前入栈保存起来的watcher（假设为父watcher）取出来。
 * 这两个过程都是在父watcher的渲染过程中的。父组件渲染过程中碰到了子组件，触发子组件的渲染watcher。子watcher挂载
 * 到全局，父watcher入栈。等子watcher渲染完成，父watcher出栈，再一次挂载到全局。并继续执行父watcher的getter。
 */
function popTarget() {
  Dep.target = targetStack.shift(); // 踢到最后就是 undefined
}

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
      const mount = function (){
        
        this.update(this.render())
      }
    
      console.log('创建watcher')
      new Watcher (this,mount) //相当于这里调用了 mount
        //每个组件都是自治的 都有自己的mount 组件创建时会有一个专属于自己的watcher
      
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


    if(typeof value === 'object' && value != null){
      
      // 传入observe的可能是数组吗？不可能
      observe(value)
    }

    console.log('创建'+value+'的dep')
    let dep = new Dep(); // 为每个属性创建一个Dep

    Object.defineProperty(obj,key,{
        configurable: true, // 可配置
        enumerable: true, // 可枚举
        get(){
            console.log('读取'+key)
            console.log('依赖收集')
            dep.depend(); // 依赖收集
            return value
        },
        set(newValue){
            console.log('设置'+key+'为'+newValue)

            typeof newValue === 'object'&&observe(newValue)

            value = newValue // 目前的问题 传入的newVal是对象的话没法对该对象响应化 临时解决办法是observe一下
             
            //数据已更新 更新模板并渲染到页面
            console.log('派发更新')
            dep.notify();
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

function createArrayProto(Methods){ //  创建响应式数组原型 柯里化 参数是需要响应化的数组方法


  /* 核心原理是在数组实例的原型链上加一层，
  让数组实例访问数组方法时首先访问的是新增的原型上的改写过的方法 */

    let Array_Proto = Object.create( Array.prototype ) 

    
    Methods.forEach((method) => {
      
        Array_Proto[method] = function(){

            console.log('重写的' + method +' 方法')
            
            for( let i = 0; i < arguments.length; i++ ) { // 对调用数组方法时出传入的数据进行响应化
               typeof arguments[ i ] === 'object'&&observe( arguments[ i ] );
            } 

            /* 更新页面方法暂时空缺 */

            return Array.prototype[method].apply(this,arguments)

        }
    })

    return function (array){

        array.__proto__ = Array_Proto

        /* 对数组中的数据响应化 这样数组中的值。。 */

        array.forEach((item) => {

          observe(item)
        })
    }
}

// 每次调用reactiveArray 传入数组 会将该数组响应化
const reactiveArray = createArrayProto(Array_Methods)


function observe(obj){  // 将对象响应化（数组，对象）

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
           
            reactiveArray(value) 
        }
        // 完美 这样数组本身也是响应式了 整体修改数组也会被监听
            defineReactive(obj,key,value) // call一下 函数中的this就是Vue实例了

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


      let _vnode = null; // 必须新建一个vnode而不是直接更改传入的vnode,
      // 因为传入的是引用类型 在函数里改等于把原来的对象（AST）也改了 那就相当于模板被改了

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

    // 数组更新方法 铁蛋
    // 对象增减数据怎么办 参考村长 $set?
    // 铁蛋 村长
    // diff patch  v-model等指令 批量异步更新 重写数组方法
    // watch computed
    // 双向绑定 目前已实现单向绑定
    // 组件化怎么实现的
    // router
    // vuex
}