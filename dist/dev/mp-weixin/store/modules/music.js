"use strict";
var common_vendor = require("../../common/vendor.js");
var music = common_vendor.defineStore("music", {
  state: () => {
    return {
      name: 1,
      is_playing: false,
      is_paused: false,
      is_random_play: false,
      is_repeated: false,
      is_love: false,
      music_type: "",
      music_id: "",
      music_src: "",
      music_title: "",
      music_coverImgUrl: "https://636c-cloud1-9gwoav2d1358e3bc-1312093740.tcb.qcloud.la/users_img/logo.png?sign=b806e62233162987f65bc8c4441c7daf&t=1656501899",
      music_singer: "",
      music_duration: 0,
      music_currentTime: 0,
      music_to_currentTime: 0,
      original_list: [],
      play_list: [],
      have_played_list: []
    };
  },
  actions: {
    reset() {
      this.is_playing = false;
      this.is_paused = false;
      this.music_to_currentTime = 0;
    },
    order_play_list(id = "01") {
      console.log(id);
      const id_str = "" + id;
      const middleware = JSON.parse(JSON.stringify(this.original_list));
      const index = middleware.findIndex((i) => i.id === id_str);
      if (index === 0) {
        const music2 = middleware.shift();
        return {
          _music: music2,
          middleware
        };
      } else if (index === middleware.length - 1) {
        const music2 = middleware.pop();
        return {
          _music: music2,
          middleware
        };
      } else {
        const front = middleware.slice(0, index);
        const after = middleware.slice(index + 1, middleware.length);
        return {
          _music: middleware[index],
          middleware: [...after, ...front]
        };
      }
    },
    random_play_list(id = "01") {
      if (typeof id !== "string" || typeof id !== "number") {
        throw new Error("error!");
      }
      const id_str = "" + id;
      const middleware = JSON.parse(JSON.stringify(this.original_list));
      const index = middleware.findIndex((i) => i.id === id_str);
      const [music2] = middleware.splice(index, 1);
      const output = [];
      while (middleware.length > 0) {
        const random = Math.floor(Math.random() * middleware.length);
        output.push(...middleware.splice(random, 1));
      }
      return {
        _music: music2,
        middleware: output
      };
    },
    play(id) {
      let music2 = null;
      this.reset();
      if (this.is_random_play) {
        const { _music, middleware } = this.random_play_list(id);
        this.play_list = middleware;
        music2 = _music;
      } else {
        const { _music, middleware } = this.order_play_list(id);
        this.play_list = middleware;
        music2 = _music;
      }
      this.music_id = music2.id;
      this.music_title = music2.title;
      this.music_singer = music2.singer;
      this.music_coverImgUrl = music2.pic_src || "https://636c-cloud1-9gwoav2d1358e3bc-1312093740.tcb.qcloud.la/users_img/logo.png?sign=b806e62233162987f65bc8c4441c7daf&t=1656501899";
      this.music_src = music2.src;
      this.is_love = music2.is_love;
      this.is_playing = true;
    },
    next() {
      this.is_playing = false;
      console.log(this.play_list);
      if (this.play_list.length === 0) {
        return;
      }
      this.have_played_list.push({
        id: this.music_id,
        title: this.music_title,
        singer: this.music_singer,
        src: this.music_src,
        coverImgUrl: this.music_coverImgUrl
      });
      const music2 = this.play_list.shift();
      this.music_id = music2.id;
      this.music_title = music2.title;
      this.music_singer = music2.singer;
      this.music_src = music2.src;
      this.music_coverImgUrl = music2.pic_src || "https://636c-cloud1-9gwoav2d1358e3bc-1312093740.tcb.qcloud.la/users_img/logo.png?sign=b806e62233162987f65bc8c4441c7daf&t=1656501899";
      this.is_playing = true;
    },
    previous() {
      this.is_playing = false;
      if (this.have_played_list.length === 0) {
        return;
      }
      this.play_list.unshift({
        id: this.music_id,
        title: this.music_title,
        singer: this.music_singer,
        src: this.music_src,
        coverImgUrl: this.music_coverImgUrl
      });
      const music2 = this.have_played_list.pop();
      this.music_id = music2.id;
      this.music_title = music2.title;
      this.music_singer = music2.singer;
      this.music_src = music2.src;
      this.music_coverImgUrl = music2.pic_src || "https://636c-cloud1-9gwoav2d1358e3bc-1312093740.tcb.qcloud.la/users_img/logo.png?sign=b806e62233162987f65bc8c4441c7daf&t=1656501899";
      this.is_playing = true;
    },
    to_random(status) {
      this.is_random_play = status;
      if (status) {
        let temp = [];
        while (this.play_list.length > 0) {
          const random = Math.floor(Math.random() * this.play_list.length);
          temp.push(...this.play_list.splice(random, 1));
        }
        this.play_list = temp;
      } else {
        this.play_list.sort((a, b) => Number(a.id) - Number(b.id));
      }
    }
  }
});
exports.music = music;
