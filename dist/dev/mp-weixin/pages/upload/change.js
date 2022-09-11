"use strict";
var common_vendor = require("../../common/vendor.js");
var store_index = require("../../store/index.js");
require("../../store/modules/music.js");
require("../../store/modules/user.js");
const _sfc_main = {
  data() {
    return {
      infos: {
        type: "",
        value: ""
      },
      val: ""
    };
  },
  onLoad(data) {
    this.infos.type = data.type;
    this.infos.value = data.value;
  },
  methods: {
    change() {
      const db = wx.cloud.database({
        env: "cloud1-9gwoav2d1358e3bc"
      });
      const that = this;
      db.command;
      const user = store_index.useUser();
      if (that.infos.type === "name") {
        let reg_name = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,10}$/;
        if (!reg_name.test(this.val)) {
          wx.showModal({
            title: "\u8B66\u544A",
            content: "\u4E0D\u7B26\u5408\u8981\u6C42\uFF0C\u8BF7\u91CD\u65B0\u8F93\u5165\u957F\u5EA6\u5341\u4EE5\u4E0B\u4E2D\u82F1\u6587\u6635\u79F0\uFF01",
            showCancel: false
          });
          return;
        }
      }
      user.update(that.infos.type, that.val);
      db.collection("users").where({ account: user.account }).update({
        data: {
          [that["infos"]["type"]]: that.val
        },
        success: function(res) {
          console.log("\u66F4\u65B0\u6210\u529F\uFF01");
        }
      });
      common_vendor.index.switchTab({
        url: "/pages/upload/index"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.infos.type === "name" ? "\u4FEE\u6539\u59D3\u540D" : "\u4FEE\u6539\u4E2A\u6027\u7B7E\u540D"),
    b: $data.infos.value,
    c: $data.val,
    d: common_vendor.o(($event) => $data.val = $event.detail.value),
    e: common_vendor.o((...args) => $options.change && $options.change(...args))
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-03c7d8aa"], ["__file", "S:/final_mad/src/pages/upload/change.vue"]]);
wx.createPage(MiniProgramPage);
