import Myform from '@/views/my-form/index.vue'

describe('Myform.vue',() => {
    it('要求设置created钩子',() => {

        expect(typeof Myform.created).toBe('function');
    })

    it('要求userName初始值是 小米', () => {
        expect(typeof Myform.data).toBe('function')

        expect(Myform.data().userInfo.userName).toBe('小米')
        })
})

