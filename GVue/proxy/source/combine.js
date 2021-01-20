import { Vnode } from './vnode';
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
  
 export function combine(vnode,data){ // 将带坑的vnode与数据结合
  
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
  
      // diff patch  v-model等指令 批量异步更新 重写数组方法
      // watch computed
      // 双向绑定 目前已实现单向绑定

      // 为什么要避免重复收集？ 试图更新后再次触发getter 会再次触发依赖收集？ 上次收集的已经没有了？
      // 为什么dep的sub是个数组？一个组件不是只对应一个watcher吗？是因为父组件的一个值在多个子组件中使用？
      // 因为可能有多个watch选项 或$watch创建的watcher实例
  }