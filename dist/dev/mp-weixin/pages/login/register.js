"use strict";
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      height: 700,
      account: "",
      name: "",
      password: "",
      apassword: "",
      question: "",
      answer: "",
      pass1: true,
      pass2: true,
      pass3: true,
      pass4: true,
      pass5: true,
      pass6: true
    };
  },
  onLoad() {
    let h;
    wx.getSystemInfo({
      success(res) {
        h = res.windowHeight;
      }
    });
    this.height = h;
  },
  methods: {
    submit() {
      let reg_account = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (reg_account.test(this.account)) {
        this.pass1 = true;
      } else {
        this.account = "";
        this.pass1 = false;
      }
      let reg_name = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,10}$/;
      if (reg_name.test(this.name)) {
        this.pass2 = true;
      } else {
        this.name = "";
        this.pass2 = false;
      }
      let reg_password = /^[a-zA-Z0-9\u4e00-\u9fa5$@$!%*#_~?&,.]{5,12}$/;
      if (reg_password.test(this.password)) {
        this.pass3 = true;
      } else {
        this.password = "";
        this.pass3 = false;
      }
      if (this.pass3 == true && this.password == this.apassword) {
        this.pass4 = true;
      } else {
        this.apassword = "";
        this.pass4 = false;
      }
      if (this.question != "") {
        this.pass5 = true;
      } else {
        this.pass5 = false;
      }
      if (this.answer != "") {
        this.pass6 = true;
      } else {
        this.pass6 = false;
      }
      if (this.pass1 == false || this.pass2 == false || this.pass3 == false || this.pass4 == false || this.pass5 == false || this.pass6 == false) {
        let msg = "";
        if (this.pass1 == false) {
          msg = msg + "[\u8D26\u53F7]";
        }
        if (this.pass2 == false) {
          msg = msg + "[\u6635\u79F0]";
        }
        if (this.pass3 == false) {
          msg = msg + "[\u5BC6\u7801]";
        }
        if (this.pass3 == true && this.pass4 == false) {
          msg = msg + "[\u786E\u8BA4\u5BC6\u7801]";
        }
        if (this.pass5 == false) {
          msg = msg + "[\u5BC6\u4FDD\u95EE\u9898]";
        }
        if (this.pass6 == false) {
          msg = msg + "[\u5BC6\u4FDD\u7B54\u6848]";
        }
        wx.showModal({
          title: "\u8B66\u544A",
          content: msg + "\u4E0D\u7B26\u5408\u8981\u6C42\uFF0C\u8BF7\u91CD\u65B0\u8F93\u5165\uFF01",
          showCancel: false
        });
      } else {
        let that = this;
        wx.cloud.init();
        const db = wx.cloud.database();
        db.collection("users").where({
          account: that.account.toString()
        }).get({
          success: function(res) {
            if (res.data.length == 1) {
              wx.showModal({
                title: "\u8B66\u544A",
                content: "\u8BE5\u7528\u6237\u540D\u5DF2\u5B58\u5728",
                showCancel: false
              });
              that.account = "";
            } else {
              console.log(that.account);
              db.collection("users").add({
                data: {
                  account: that.account.toString(),
                  name: that.name.toString(),
                  password: that.password.toString(),
                  question: that.question.toString(),
                  answer: that.answer.toString(),
                  desc: "\u548C\u5931\u7720\u8BF4\u518D\u89C1",
                  fileId: "cloud://cloud1-9gwoav2d1358e3bc.636c-cloud1-9gwoav2d1358e3bc-1312093740/users_img/logo.png",
                  love: [],
                  pic_src: "https://636c-cloud1-9gwoav2d1358e3bc-1312093740.tcb.qcloud.la/users_img/logo.png?sign=b806e62233162987f65bc8c4441c7daf&t=1656501899",
                  token: "xxxx"
                }
              });
              wx.showModal({
                title: "\u63D0\u793A",
                content: "\u6CE8\u518C\u6210\u529F\uFF01",
                showCancel: false,
                success(res2) {
                  if (res2.confirm) {
                    common_vendor.index.navigateTo({
                      url: "/pages/login/index"
                    });
                  }
                }
              });
            }
          },
          fail: console.error
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.account,
    b: common_vendor.o(($event) => $data.account = $event.detail.value),
    c: $data.name,
    d: common_vendor.o(($event) => $data.name = $event.detail.value),
    e: $data.password,
    f: common_vendor.o(($event) => $data.password = $event.detail.value),
    g: $data.apassword,
    h: common_vendor.o(($event) => $data.apassword = $event.detail.value),
    i: $data.question,
    j: common_vendor.o(($event) => $data.question = $event.detail.value),
    k: $data.answer,
    l: common_vendor.o(($event) => $data.answer = $event.detail.value),
    m: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    n: $data.height >= 665
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-65639d8d"], ["__file", "S:/final_mad/src/pages/login/register.vue"]]);
wx.createPage(MiniProgramPage);
