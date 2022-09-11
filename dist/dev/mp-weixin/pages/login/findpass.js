"use strict";
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      pass: false,
      account: "",
      question: "",
      info: "",
      answer: ""
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
    check() {
      let that = this;
      wx.cloud.init();
      const db = wx.cloud.database();
      db.collection("users").where({
        account: that.account.toString()
      }).get({
        success: function(res) {
          if (res.data.length == 1) {
            that.info = res.data[0];
            that.pass = true;
            that.question = res.data[0].question;
          } else {
            wx.showModal({
              title: "\u8B66\u544A",
              content: "\u8D26\u53F7\u9519\u8BEF\uFF0C\u8BF7\u91CD\u65B0\u8F93\u5165",
              showCancel: false
            });
          }
        },
        fail: console.error
      });
    },
    submit() {
      let that = this;
      if (this.info.answer == this.answer) {
        wx.showModal({
          title: "\u63D0\u793A",
          content: "\u9A8C\u8BC1\u6210\u529F\uFF01",
          showCancel: false,
          success(res) {
            if (res.confirm) {
              common_vendor.index.navigateTo({
                url: "/pages/login/changepass?account=" + that.account
              });
            }
          }
        });
      } else {
        wx.showModal({
          title: "\u63D0\u793A",
          content: "\u9A8C\u8BC1\u5931\u8D25\uFF01",
          showCancel: false
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$data.pass
  }, !$data.pass ? {} : {}, {
    b: !$data.pass
  }, !$data.pass ? {
    c: $data.account,
    d: common_vendor.o(($event) => $data.account = $event.detail.value)
  } : {}, {
    e: !$data.pass
  }, !$data.pass ? {
    f: common_vendor.o((...args) => $options.check && $options.check(...args))
  } : {}, {
    g: $data.pass
  }, $data.pass ? {} : {}, {
    h: $data.pass
  }, $data.pass ? {
    i: common_vendor.t($data.question)
  } : {}, {
    j: $data.pass
  }, $data.pass ? {
    k: $data.answer,
    l: common_vendor.o(($event) => $data.answer = $event.detail.value)
  } : {}, {
    m: $data.pass
  }, $data.pass ? {
    n: common_vendor.o((...args) => $options.submit && $options.submit(...args))
  } : {}, {
    o: _ctx.height >= 665
  });
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-188698b4"], ["__file", "S:/final_mad/src/pages/login/findpass.vue"]]);
wx.createPage(MiniProgramPage);
