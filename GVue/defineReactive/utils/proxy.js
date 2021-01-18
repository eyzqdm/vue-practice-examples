 /** 代理 将某一个对象的属性访问 映射到对象的某一个属性成员上 */
export function proxy(target, prop) {
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