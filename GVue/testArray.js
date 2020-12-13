const arr1 = [1,2,3]
arr1.__proto__.pushh = function(e){
 const length = this.length
 this.length++
 this[length] = e
}
arr1.pushh(8)
console.log(arr1)