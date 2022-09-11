"use strict";
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
var common_vendor = require("./common/vendor.js");
var store_index = require("./store/index.js");
var api_bus = require("./api/bus.js");
require("./store/modules/music.js");
require("./store/modules/user.js");
if (!Math) {
  "./pages/login/index.js";
  "./pages/login/register.js";
  "./pages/login/findpass.js";
  "./pages/login/changepass.js";
  "./pages/index/index.js";
  "./pages/music/index.js";
  "./pages/upload/index.js";
  "./pages/upload/change.js";
}
const _sfc_main = {
  onLaunch: function() {
    console.log("App Launch");
    wx.cloud.init({
      traceUser: true
    });
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  },
  onLoad: function() {
    wx.loadFontFace({
      family: "webfont",
      source: 'url("//at.alicdn.com/t/webfont_1f7b3qbimiv.eot")',
      success: function(res) {
        console.log(res.status);
      },
      fail: function(res) {
        console.log(res.status);
      },
      complete: function(res) {
        console.log(res.status);
      }
    });
  },
  setup() {
    const music = store_index.useMusic();
    let music_player = common_vendor.index.getBackgroundAudioManager();
    music_player.onPlay(() => {
      music.music_duration = music_player.duration;
    });
    music_player.onEnded(() => {
      if (music.is_repeated) {
        music_player.title = music.music_title;
        music_player.singer = music.music_singer;
        music_player.coverImgUrl = music.music_coverImgUrl;
        music_player.src = music.music_src;
      } else {
        music.next();
      }
    });
    setInterval(() => {
      if (music_player.currentTime) {
        music.music_currentTime = music_player.currentTime;
      }
    }, 1e3);
    common_vendor.watch(() => music.is_playing, (newVal) => {
      if (newVal) {
        music_player.title = music.music_title;
        music_player.singer = music.music_singer;
        music_player.coverImgUrl = music.music_coverImgUrl;
        music_player.src = music.music_src;
      }
    }, {
      immediate: true
    });
    common_vendor.watch(() => music.music_to_currentTime, (newVal) => {
      music_player.seek(Number(newVal));
    });
    api_bus.Bus.on("playornot", (status) => {
      music.is_paused = status;
      if (status) {
        music_player.pause();
      } else {
        music_player.play();
      }
    });
    api_bus.Bus.on("close", () => {
      music_player.stop();
    });
  }
};
var App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "S:/final_mad/src/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  app.use(common_vendor.createPinia());
  app.config.globalProperties.$bus = api_bus.Bus;
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
