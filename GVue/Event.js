/* 事件中心 提供 on, off, emit 方法  */

class Event {
    constructor(){
      /* 事件函数对象
         每个键值对的值为数组 即触发事件是可能执行多个函数
       */
      this.eventObj = {}
    }

    /* 注册事件 */
    on(type,handler){
      
      this.eventObj[type] = handler
    }

    /** 移除事件, 
     * - 如果没有参数, 移除所有事件, 
     * - 如果只带有 事件名 参数, 就移除这个事件名下的所有事件,
     * - 如果带有 两个 参数, 那么就是表示移除某一个事件的具体处理函数
     * */ 
    off(type, handler){
     
      if ( arguments.length === 0 ) { // 没有参数移除所有的事件
        this.eventObjs = {};
      } else if ( arguments.length === 1 ) { // 只有事件的类型, 移除该事件的所有处理函数
        this.eventObjs[ type ] = null;
      } else if ( arguments.length === 2 ) { // 移除 type 事件的 handler 处理函数
        // 使用循环移除所有的 该函数 对应的 type 事件
        let _events = this.eventObjs[ type ];
        if ( !_events ) return;
        for ( let i = _events.length - 1; i >= 0; i-- ) {
          if ( _events[ i ] === handler ) {
            _events.splice( i, 1 );
          }
        }
      }

    }
  
    /* 触发事件 并传递事件函数的参数 */

    emit(type){
  
      let args = Array.prototype.slice.call( arguments, 1 ); // 获取所有参数
      /* for ( let i = 0; i < _events.length; i++ ) {
        // 如果要绑定上下文就需要使用 call 或 apply
        _events[ i ].apply( null, args );
      }
      */
      if(!this.eventObj[type]) return
      this.eventObj[type].apply(null,args)
    }
}

const eventCenter  = new Event()

eventCenter.on('say',(name) => {
  console.log(name)
})

eventCenter.emit('say','小明')

eventCenter.off('say')
eventCenter.emit('say','小宏')