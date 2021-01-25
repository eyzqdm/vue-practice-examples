function add (a,b){
  
    return a+b
}

describe('add',() => {

    it('测试加法',() => {
      
        expect(add(1,2)).toBe(3)
        expect(add(1,-1)).toBe(0)
    })
})