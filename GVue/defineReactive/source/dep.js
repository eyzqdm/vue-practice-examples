export default class Dep { // 依赖 每个属性对应一个Dep对象
  
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
  export function pushTarget( target ) {
    /* 先将当前的全局watcher入栈保存起来,再将全局watcher替换成传入的watcher。
    等 */
    targetStack.unshift( Dep.target ); 
    Dep.target = target;
  }
  
  /** 等当前全局的渲染watcher的getter执行结束，将其剔除全局，再将之前入栈保存起来的watcher（假设为父watcher）取出来。
   * 这两个过程都是在父watcher的渲染过程中的。父组件渲染过程中碰到了子组件，触发子组件的渲染watcher。子watcher挂载
   * 到全局，父watcher入栈。等子watcher渲染完成，父watcher出栈，再一次挂载到全局。并继续执行父watcher的getter。
   */
  export function popTarget() {
    Dep.target = targetStack.shift(); // 踢到最后就是 undefined
  }