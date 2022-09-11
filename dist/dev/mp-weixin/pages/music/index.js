"use strict";
var common_vendor = require("../../common/vendor.js");
var store_index = require("../../store/index.js");
var api_bus = require("../../api/bus.js");
require("../../store/modules/music.js");
require("../../store/modules/user.js");
const uniDrawer = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-drawer/uni-drawer.js";
const _sfc_main = {
  components: { uniDrawer },
  data() {
    return {
      title: "Hello"
    };
  },
  onLoad() {
  },
  onShow: function() {
  },
  methods: {
    showDrawer() {
      this.$refs["showLeft"].open();
    },
    closeDrawer() {
      this.$refs["showLeft"].close();
    }
  },
  setup() {
    const db = wx.cloud.database({
      env: "cloud1-9gwoav2d1358e3bc"
    });
    const music = store_index.useMusic();
    const user = store_index.useUser();
    const comments = common_vendor.ref([]);
    const currentTime = common_vendor.ref(0);
    const text = common_vendor.ref("");
    let timer = null;
    let formater = function(num) {
      if (num < 10)
        return "0" + num.toString();
      return num.toString();
    };
    const currentTime_display = common_vendor.computed$1(() => {
      let temp = parseInt(music.music_currentTime);
      let minute = Math.floor(temp / 60);
      let second = temp - minute * 60;
      return `${formater(minute)}:${formater(second)}`;
    });
    const duration_display = common_vendor.computed$1(() => {
      let temp = parseInt(music.music_duration);
      let minute = Math.floor(temp / 60);
      let second = temp - minute * 60;
      return `${formater(minute)}:${formater(second)}`;
    });
    common_vendor.watch(() => music.music_currentTime, (newValue) => {
      currentTime.value = newValue / music.music_duration * 100;
    });
    const intervalChange = function(e) {
      let num = e.detail.value;
      music.music_to_currentTime = num * (music.music_duration / 100);
    };
    const playornot = function(status) {
      api_bus.Bus.emit("playornot", status);
    };
    const randomornot = function(status) {
      music.to_random(status);
    };
    const repeatornot = function(status) {
      music.is_repeated = status;
    };
    const throttle1 = function() {
      return function(status) {
        if (timer)
          return;
        music.is_love = status;
        if (!status) {
          let index = user.love.findIndex((i) => i === music.music_title);
          user.love.splice(index, 1);
        } else {
          if (user.love.some((i) => i === music.music_title))
            return;
          user.love.push(music.music_title);
        }
        timer = setTimeout(() => {
          clearTimeout(timer);
          timer = null;
        }, 5e3);
        api_bus.Bus.emit("update_love");
      };
    };
    const fn1 = throttle1();
    const loveornot = function(status) {
      fn1(status);
    };
    const next = function() {
      music.next();
    };
    const previous = function() {
      music.previous();
    };
    common_vendor.watch(() => music.music_title, (newVal) => {
      db.collection("comments").where({ song_title: newVal }).get({
        success: function(res) {
          comments.value = res.data;
        }
      });
    }, {
      immediate: true
    });
    const throttle2 = function() {
      return function() {
        if (timer)
          return;
        timer = setTimeout(() => {
          clearTimeout(timer);
          timer = null;
        }, 5e3);
        db.collection("comments").add({
          data: {
            name: user.name,
            pic_src: user.pic_src,
            song_title: music.music_title,
            comment: text.value
          }
        }).then((res) => {
          text.value = "";
          db.collection("comments").where({ song_title: music.music_title }).get({
            success: function(res2) {
              comments.value = res2.data;
            }
          });
        }).catch(console.error);
      };
    };
    const fn2 = throttle2();
    const send_comment = function() {
      if (text.value) {
        fn2();
      }
    };
    return {
      currentTime_display,
      duration_display,
      currentTime,
      music,
      comments,
      text,
      intervalChange,
      playornot,
      next,
      previous,
      randomornot,
      repeatornot,
      loveornot,
      send_comment
    };
  }
};
if (!Array) {
  const _easycom_uni_drawer2 = common_vendor.resolveComponent("uni-drawer");
  _easycom_uni_drawer2();
}
const _easycom_uni_drawer = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-drawer/uni-drawer.js";
if (!Math) {
  _easycom_uni_drawer();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($setup.music.music_title),
    b: !$setup.music.is_paused ? 1 : "",
    c: $setup.music.music_coverImgUrl,
    d: $setup.music.is_random_play,
    e: common_vendor.o(($event) => $setup.randomornot(false)),
    f: !$setup.music.is_random_play,
    g: common_vendor.o(($event) => $setup.randomornot(true)),
    h: $setup.music.is_repeated,
    i: common_vendor.o(($event) => $setup.repeatornot(false)),
    j: !$setup.music.is_repeated,
    k: common_vendor.o(($event) => $setup.repeatornot(true)),
    l: $setup.music.is_love,
    m: common_vendor.o(($event) => $setup.loveornot(false)),
    n: !$setup.music.is_love,
    o: common_vendor.o(($event) => $setup.loveornot(true)),
    p: common_vendor.o((...args) => $options.showDrawer && $options.showDrawer(...args)),
    q: common_vendor.o((...args) => $options.closeDrawer && $options.closeDrawer(...args)),
    r: common_vendor.f($setup.comments, (i, index, i0) => {
      return {
        a: i.pic_src,
        b: common_vendor.t(i.name),
        c: common_vendor.t(i.comment),
        d: index
      };
    }),
    s: $setup.text,
    t: common_vendor.o(($event) => $setup.text = $event.detail.value),
    v: common_vendor.o((...args) => $setup.send_comment && $setup.send_comment(...args)),
    w: common_vendor.sr("showLeft", "71f95f70-0"),
    x: common_vendor.p({
      width: 320,
      mode: "right"
    }),
    y: common_vendor.t($setup.currentTime_display),
    z: common_vendor.o((...args) => $setup.intervalChange && $setup.intervalChange(...args)),
    A: $setup.currentTime,
    B: common_vendor.t($setup.duration_display),
    C: common_vendor.o((...args) => $setup.previous && $setup.previous(...args)),
    D: $setup.music.is_paused,
    E: common_vendor.o(($event) => $setup.playornot(false)),
    F: !$setup.music.is_paused,
    G: common_vendor.o(($event) => $setup.playornot(true)),
    H: common_vendor.o((...args) => $setup.next && $setup.next(...args))
  };
}
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "S:/final_mad/src/pages/music/index.vue"]]);
wx.createPage(MiniProgramPage);
