function hi() {
    console.log('hi, I am:', this)
  }
  // hi()
  
  function wrapMethod() {
    hi()
  }
  
  // wrapMethod()
  
  class Controller {
    method() {
      // hi()
      // this.hi()
      let method = this.hi
      method = method.bind(this)
      method()
    }
    hi() {
      console.log('hi, I am:', this)
    }
  }
  
  new Controller().method()