"use strict";
var common_vendor = require("../../common/vendor.js");
var user = common_vendor.defineStore("user", {
  state() {
    return {
      account: "",
      name: "",
      token: "",
      desc: "",
      pic_src: "",
      fileId: "",
      love: []
    };
  },
  actions: {
    update(type, val) {
      if (type === "name") {
        this.name = val;
      }
      if (type === "desc") {
        this.desc = val;
      }
    }
  }
});
exports.user = user;
