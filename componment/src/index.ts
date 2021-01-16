/* 装饰器可以给所装饰的对象进行扩展 装饰器是一个函数 */
// 类装饰器  类装饰器表达式会在运行时当作函数被调用，类的构造函数作为其唯一的参数。
// 实现一个给指定类扩展打印日志的装饰器
function log (target:Function) {
    // 接受的参数是构造函数 因此可以在其原型上进行扩展
   // console.log(target)
    target.prototype.log = function (){
        console.log(this.bar)
    }
    console.log(target)
   // console.log(target.prototype)
   // target.prototype.log()
}
@log
class Foo{
    bar = 'bar'
}
const foo = new Foo()

console.log(foo)
// foo.log()
