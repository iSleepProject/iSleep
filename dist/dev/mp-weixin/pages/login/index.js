"use strict";
var common_vendor = require("../../common/vendor.js");
var store_index = require("../../store/index.js");
require("../../store/modules/music.js");
require("../../store/modules/user.js");
const _sfc_main = {
  data() {
    return {
      height: 700,
      account: "",
      password: ""
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
    const db = wx.cloud.database({
      env: "cloud1-9gwoav2d1358e3bc"
    });
    const user = store_index.useUser();
    let token = wx.getStorageSync("token");
    console.log("mytoken", token);
    db.collection("users").where({
      token
    }).get({
      success: function(res) {
        if (res.data.length == 1) {
          const data = res.data[0];
          user.name = data.name;
          user.account = data.account;
          user.desc = data.desc;
          user.pic_src = data.pic_src;
          user.fileId = data.fileId;
          user.love = data.love;
          console.log(1111);
          common_vendor.index.switchTab({
            url: "/pages/index/index"
          });
          console.log(2222);
        }
      }
    });
  },
  onShow: function() {
  },
  methods: {
    formSubmit: function(e) {
      const db = wx.cloud.database({
        env: "cloud1-9gwoav2d1358e3bc"
      });
      const user = store_index.useUser();
      const that = this;
      db.collection("users").where({
        account: that.account.toString(),
        password: that.password.toString()
      }).get({
        success: function(res) {
          if (res.data.length == 1) {
            wx.getRandomValues({
              length: 12,
              success: (response) => {
                const token = wx.arrayBufferToBase64(response.randomValues);
                const data = res.data[0];
                user.name = data.name;
                user.account = data.account;
                user.desc = data.desc;
                user.pic_src = data.pic_src;
                user.fileId = data.fileId;
                user.love = data.love;
                user.token = token;
                wx.setStorageSync("token", token);
                db.collection("users").where({ account: data.account }).update({
                  data: {
                    token
                  },
                  success: function(res2) {
                    console.log("token\u66F4\u65B0\u6210\u529F\uFF01");
                    common_vendor.index.switchTab({
                      url: "/pages/index/index"
                    });
                  }
                });
              }
            });
          } else {
            wx.showModal({
              title: "\u8B66\u544A",
              content: "\u8D26\u53F7\u6216\u5BC6\u7801\u9519\u8BEF\uFF0C\u8BF7\u91CD\u65B0\u8F93\u5165",
              showCancel: false
            });
            that.password = "";
          }
        }
      });
    },
    register() {
      common_vendor.index.navigateTo({
        url: "/pages/login/register"
      });
    },
    findpass() {
      common_vendor.index.navigateTo({
        url: "/pages/login/findpass"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.account,
    b: common_vendor.o(($event) => $data.account = $event.detail.value),
    c: $data.password,
    d: common_vendor.o(($event) => $data.password = $event.detail.value),
    e: common_vendor.o((...args) => $options.formSubmit && $options.formSubmit(...args)),
    f: common_vendor.o((...args) => $options.register && $options.register(...args)),
    g: common_vendor.o((...args) => $options.findpass && $options.findpass(...args)),
    h: $data.height >= 665
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-247e7dd8"], ["__file", "S:/final_mad/src/pages/login/index.vue"]]);
wx.createPage(MiniProgramPage);
