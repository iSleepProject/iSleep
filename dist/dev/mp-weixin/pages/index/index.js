"use strict";
var common_vendor = require("../../common/vendor.js");
var store_index = require("../../store/index.js");
var api_bus = require("../../api/bus.js");
require("../../store/modules/music.js");
require("../../store/modules/user.js");
const _sfc_main = {
  onLoad: function() {
  },
  setup() {
    const db = wx.cloud.database({
      env: "cloud1-9gwoav2d1358e3bc"
    });
    const user = store_index.useUser();
    const music = store_index.useMusic();
    const mild = common_vendor.ref([]);
    const classic = common_vendor.ref([]);
    const love = common_vendor.ref([]);
    const all = common_vendor.ref([]);
    const indicatorDots = common_vendor.ref(true);
    const autoplay = common_vendor.ref(true);
    const interval = common_vendor.ref(2e3);
    const duration = common_vendor.ref(500);
    const list_style = common_vendor.ref("classic");
    const enter_music_center = function(style, id) {
      if (style === "classic") {
        music.original_list = classic.value;
        music.play(id);
        common_vendor.index.switchTab({
          url: "/pages/music/index"
        });
      }
      if (style === "mild") {
        music.original_list = mild.value;
        music.play(id);
        common_vendor.index.switchTab({
          url: "/pages/music/index"
        });
      }
      if (style === "love") {
        music.original_list = love.value;
        music.play(id);
        common_vendor.index.switchTab({
          url: "/pages/music/index"
        });
      }
    };
    const show_list = function(style) {
      if (style === "love") {
        list_style.value = "love";
      } else if (style === "classic") {
        list_style.value = "classic";
      } else {
        list_style.value = "mild";
      }
    };
    api_bus.Bus.on("update_love", () => {
      let temp = [];
      all.value.forEach((item) => {
        if (user.love.some((i) => i === item.title)) {
          item.is_love = true;
          temp.push(item);
        } else {
          item.is_love = false;
        }
      });
      love.value = temp;
      db.collection("users").where({ account: user.account }).update({
        data: {
          love: user.love
        },
        success: function(res3) {
          console.log("\u4FEE\u6539\u6210\u529F\uFF01");
        }
      });
    });
    common_vendor.onMounted(() => {
      db.collection("musics").get({
        success: function(res) {
          res.data.forEach((item) => {
            if (user.love.some((i) => i === item.title)) {
              item.is_love = true;
              love.value.push(item);
            } else {
              item.is_love = false;
            }
          });
          classic.value = res.data.filter((item) => item.style === "classic").sort((a, b) => Number(a.id) - Number(b.id));
          mild.value = res.data.filter((item) => item.style === "mild").sort((a, b) => Number(a.id) - Number(b.id));
          all.value = res.data;
        }
      });
    });
    return {
      indicatorDots,
      autoplay,
      interval,
      duration,
      enter_music_center,
      show_list,
      list_style,
      love,
      classic,
      mild
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $setup.indicatorDots,
    b: $setup.autoplay,
    c: $setup.interval,
    d: $setup.duration,
    e: $setup.list_style === "love" ? 1 : "",
    f: common_vendor.o(($event) => $setup.show_list("love")),
    g: $setup.list_style === "classic" ? 1 : "",
    h: common_vendor.o(($event) => $setup.show_list("classic")),
    i: $setup.list_style === "mild" ? 1 : "",
    j: common_vendor.o(($event) => $setup.show_list("mild")),
    k: common_vendor.f($setup.love, (i, index, i0) => {
      return {
        a: common_vendor.t(i.title),
        b: common_vendor.t(i.singer),
        c: common_vendor.o(($event) => $setup.enter_music_center("love", i.id)),
        d: index
      };
    }),
    l: $setup.list_style === "love",
    m: common_vendor.f($setup.classic, (i, index, i0) => {
      return {
        a: common_vendor.t(i.title),
        b: common_vendor.t(i.singer),
        c: common_vendor.o(($event) => $setup.enter_music_center("classic", i.id)),
        d: index
      };
    }),
    n: $setup.list_style === "classic",
    o: common_vendor.f($setup.mild, (i, index, i0) => {
      return {
        a: common_vendor.t(i.title),
        b: common_vendor.t(i.singer),
        c: common_vendor.o(($event) => $setup.enter_music_center("mild", i.id)),
        d: index
      };
    }),
    p: $setup.list_style === "mild"
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1badc801"], ["__file", "S:/final_mad/src/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
