class GVue{
    constructor(options){
        this.$data = options.data
        this._template = document.querySelector(options.el);
        this._parent = this._template.parentNode; // 用于替换页面结构 临时性处理

    }
    reactive(){ // 将data响应化
      reactify(this.$data, this) // 传入实例 临时性处理 便于在set中更新模板
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





function defineReactive (obj,key,value){ // 数据响应化

    const that = this

    if(typeof value === 'object' && value != null){

        reactify(value)
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

            value = newValue
             
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

function createArrayProto(Methods){ //  创建响应式数组原型 柯里化

    let Array_Proto = Object.create( Array.prototype )

    
    Methods.forEach((method) => {
      
        Array_Proto[method] = function(){

            console.log('重写的' + method +' 方法')

            arguments.forEach((item) => {  // 数组数据响应化
               
                reactify(item)
            })

            return Array.prototype[method].apply(this,arguments)

        }
    })

    return function (array,vm){

        array.__proto__ = Array_Proto

        array.forEach((item) => {

            reactify(item,vm)
        })
    }
}

// 每次调用reactiveArray 传入数组 会将该数组响应化
const reactiveArray = createArrayProto(Array_Methods)


function reactify(obj,vm){  // 将对象响应化（数组，对象）

    Object.keys(obj).forEach((key) => {
       
        /* 对象和数组的响应化处理方式不同 */
        let value = obj[key]
        if(Array.isArray(value)){
           
            reactiveArray(value,vm) 
        }
        else{
            defineReactive.call(vm,obj,key,value) // call一下 函数中的this就是GVue实例了
        }

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

let rkuohao = /\{\{(.+?)\}\}/g; // 获取插值的正则
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
        _value = _value.replace( rkuohao, function ( _, g ) {
          return getValueByPath( data, g.trim() ); // 除了 get 读取器
        } );

        _vnode = new Vnode( _tag, _attrs, _value, _type )

      } else if ( _type === 1 ) { // 元素节点
        _vnode = new Vnode( _tag, _attrs, _value, _type );
        _children.forEach( _subvnode => _vnode.addChildren( combine( _subvnode, data ) ) );
      }

      return _vnode;
}