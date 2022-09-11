<script>
import { watch, computed, ref, onMounted } from "vue";
import { useMusic, useUser } from "./store";
import Bus from "./api/bus";
export default {
  onLaunch: function () {
    console.log("App Launch");
    wx.cloud.init({
      // env: "wxa182ecd79d0a8dbf",
      traceUser: true,
    });
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
  onLoad: function () {
    wx.loadFontFace({
      family: "webfont",
      source: 'url("//at.alicdn.com/t/webfont_1f7b3qbimiv.eot")',
      success: function (res) {
        console.log(res.status); //  loaded
      },
      fail: function (res) {
        console.log(res.status); //  error
      },
      complete: function (res) {
        console.log(res.status);
      },
    });
  },
  setup() {
    const music = useMusic();
    let timer = null;
    let music_player = uni.getBackgroundAudioManager();
    music_player.onPlay(() => {
      music.music_duration = music_player.duration;
    });
    music_player.onEnded(() => {
      if (music.is_repeated) {
        music_player.title = music.music_title; //必要
        music_player.singer = music.music_singer; //非必要
        music_player.coverImgUrl = music.music_coverImgUrl; //非必要
        music_player.src = music.music_src; //必要
      } else {
        music.next();
      }
    });

    timer = setInterval(() => {
      if (music_player.currentTime) {
        music.music_currentTime = music_player.currentTime;
      }
    }, 1000);
    watch(
      () => music.is_playing,
      (newVal) => {
        if (newVal) {
          music_player.title = music.music_title;
          music_player.singer = music.music_singer;
          music_player.coverImgUrl = music.music_coverImgUrl;
          music_player.src = music.music_src;
        }
      },
      {
        immediate: true,
      }
    );
    watch(
      () => music.music_to_currentTime,
      (newVal) => {
        music_player.seek(Number(newVal));
      }
    );
    Bus.on("playornot", (status) => {
      music.is_paused = status;
      if (status) {
        music_player.pause();
      } else {
        music_player.play();
      }
    });
    Bus.on("close", () => {
      music_player.stop();
    });
  },
};
</script>

<style>
/*每个页面公共css */
page {
  background: linear-gradient(#9cbbda00 0%, #00000000 50%, #000000ff 100%),
    url("https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201711%2F24%2F20171124171116_vLUhu.thumb.400_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1658890789&t=ebd5085de80fbc16f089f5c70a2bb4fa");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
.container {
  font-family: "webfont" !important;
  font-size: 14px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}
</style>
