"use strict";
class Bus {
  constructor() {
    this.list = {};
  }
  emit(name, ...args) {
    let eventName = this.list[name];
    eventName.forEach((item) => {
      item.apply(this, args);
    });
  }
  on(name, callback) {
    let fn = this.list[name] || [];
    fn.push(callback);
    this.list[name] = fn;
  }
  off(name, callback) {
    if (this.list[name]) {
      for (let i = 0; i < this.list[name].length; i++) {
        if (this.list[name][i] === callback) {
          this.list[name].splice(i, 1);
          break;
        }
      }
    }
  }
}
var Bus$1 = new Bus();
exports.Bus = Bus$1;
