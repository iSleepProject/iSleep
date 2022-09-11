"use strict";
var common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      account: "",
      npassword: "",
      apassword: ""
    };
  },
  onLoad(data) {
    let h;
    wx.getSystemInfo({
      success(res) {
        h = res.windowHeight;
      }
    });
    this.height = h;
    this.account = data.account;
  },
  methods: {
    submit() {
      console.log(this.account);
      let reg_password = /^[a-zA-Z0-9\u4e00-\u9fa5$@$!%*#_~?&,.]{5,12}$/;
      if (reg_password.test(this.npassword) == false && this.npassword != "") {
        this.password = "";
        this.apassword = "";
        wx.showModal({
          title: "\u63D0\u793A",
          content: "\u5BC6\u7801\u683C\u5F0F\u9519\u8BEF\uFF0C\u8BF7\u91CD\u65B0\u8F93\u5165\uFF01",
          showCancel: false
        });
      } else if (this.npassword != this.apassword) {
        this.apassword = "";
        wx.showModal({
          title: "\u63D0\u793A",
          content: "\u4E24\u6B21\u5BC6\u7801\u4E0D\u76F8\u540C\uFF0C\u8BF7\u91CD\u65B0\u8F93\u5165\uFF01",
          showCancel: false
        });
      } else {
        let that = this;
        wx.cloud.init();
        const db = wx.cloud.database();
        db.collection("users").where({
          account: that.account.toString()
        }).update({
          data: {
            password: that.npassword
          }
        });
        wx.showModal({
          title: "\u63D0\u793A",
          content: "\u4FEE\u6539\u6210\u529F\uFF01",
          showCancel: false,
          success(res) {
            if (res.confirm) {
              common_vendor.index.navigateTo({
                url: "/pages/login/index"
              });
            }
          }
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.npassword,
    b: common_vendor.o(($event) => $data.npassword = $event.detail.value),
    c: $data.apassword,
    d: common_vendor.o(($event) => $data.apassword = $event.detail.value),
    e: common_vendor.o((...args) => $options.submit && $options.submit(...args)),
    f: _ctx.height >= 665
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2a2da32b"], ["__file", "S:/final_mad/src/pages/login/changepass.vue"]]);
wx.createPage(MiniProgramPage);
