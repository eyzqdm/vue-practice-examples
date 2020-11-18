const mixin = {
  created: function () {
      this.hello()
  },
  methods: {
      hello: function () {
          console.log('hello hello')
      }
  }
}

export default mixin
