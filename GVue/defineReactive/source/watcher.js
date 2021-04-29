import { pushTarget, popTarget } from "./dep";
import { nextTick } from "./nextTick";

let id = 0; // watcher标识
let hash = {}; // 存储watcher队列的标识
/* 只要侦听到数据变化,将开启一个队列,并缓冲在同一事件循环中发生的所有数据变更。
批量更新时如果同一个watcher被多次触发，只会被推入到队列中一次。 */
let watcherQueue = [];
export default class Watcher {
  // 观察者

  /**
   *
   * @param {Object} vm 组件实例
   * @param {String|Function} expOrfn 如果是渲染 watcher, 传入的就是渲染函数, 如果是 计算 watcher(计算属性) 传入的就是路径表达式
   */
  constructor(vm, expOrfn) {
    this.vm = vm;
    this.getter = expOrfn;
    this.deps = []; // 依赖项 也就是被观察者 组件的每个属性都对应一个dep对象
    this.depsId = new Set(); // 依赖项id,使用set结构
    this.id = id++;
    this.get(); // 首次执行渲染 组件创建时会new一个属于自己的watcher 组件渲染逻辑都在watcher中 因此newWatcher的同时 组件也就渲染了
  }
  /** 计算, 触发 getter */
  get() {
    pushTarget(this); // 这两个方法是全局的 用于将当前的渲染watcher挂载/踢出全局
    // get方法执行时 说明当前组件正在渲染中,因此在getter前将当前组件的渲染watcher
    // 挂到全局。这样此watcher在全局范围内就可访问到。由于组件渲染时必然会访问组件的每个属性，因为必然触发属性的getter。
    // 因此可以在getter中进行依赖收集

    console.log("执行了渲染");
    this.getter.call(this.vm); // 绑定上下文

    // 渲染完成，将watcher踢出全局
    popTarget();
  }
  run() {
    this.get();
    // 在真正的 vue 中是调用 queueWatcher, 来触发 nextTick 进行异步的执行
  }
  /** 对外公开的函数, 用于在 属性发生变化时触发的接口 */
  update() {
    queueWatcher(this);
  }

  /** 清空依赖队列 */
  cleanupDep() {}

  /* 依赖收集，即watcher要观察的所有属性都通过该方法添加。
    该方法在dep.depend方法中调用。因为调用depend方法时是在属性的getter中。此时watcher时挂载在全局的
    即dep.target上。dep.depend方法用于watcher与dep的相互关联。即
    一个属性可能有多个观察者观察他，一个观察者也可能要观察多个属性。
     */
  addDep(dep) {
    let id = dep.id;

    if (!this.depsId.has(id)) {
      // 避免重复收集
      this.depsId.add(id);
      // 让watcher记住当前的dep
      this.deps.push(dep);
      dep.addSub(this);
    }
  }
}

function flusQueue() {
  watcherQueue.forEach((watcher) => watcher.run()); // 批量更新 更新完毕清空队列
  hash = {};
  watcherQueue = [];
}

function queueWatcher(watcher) {
  let id = watcher.id;
  if (!hash[id]) {
    // 取不到值是undefined和null都是false
    hash[id] = true;
    watcherQueue.push(watcher);
  }
  console.log(hash);
  // 异步等待所有同步方法执行完毕 调用该方法 异步任务在同步任务后再执行
  nextTick(flusQueue);
}
