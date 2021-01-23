import Watcher from './watcher';
import { observe } from './observe'
import { combine } from './combine';
import { proxy } from './../utils/proxy';
import { getVNode,parseVnode } from './vnode';
  
export default class GVue{
      constructor(options){
          this.$el = options.el
          this.$data = options.data
          this._template = document.querySelector(options.el);
          this._parent = this._template.parentNode; // 用于替换页面结构 临时性处理
          this.reactive()
          this.mount()
  
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
  
  
          this._parent.replaceChild(realDom,document.querySelector(`${this.$el}`));

          // 宏任务里的dom操作会导致浏览器刷新 微任务里不会
          /* 通过querySelector（querySelectorAll）获取到元素之后，不论html元素再怎么改变，
          这个变量并不会随之发生改变，这个变量已经和html元素没有任何关系了。 */
      }  
  }