<template>
  <view class="container">
    <view class="text-area">
      <view class="hugefont">{{ music.music_title }}</view>
      <view class="showImg">
        <image :class="{'rota': !music.is_paused}" :src="music.music_coverImgUrl"></image>
      </view>
      <view class="bottom-ctrls">
        <view class="part2">
          <image
            v-show="music.is_random_play"
            @click="randomornot(false)"
            class="ctrls-btn"
            src="../static/random.png"
          ></image>
          <image
            v-show="!music.is_random_play"
            @click="randomornot(true)"
            class="ctrls-btn"
            src="../static/order.png"
          ></image>
          <image
            v-show="music.is_repeated"
            @click="repeatornot(false)"
            class="ctrls-btn"
            src="../static/single-repeat.png"
          ></image>
          <image
            v-show="!music.is_repeated"
            @click="repeatornot(true)"
            class="ctrls-btn"
            src="../static/list-repeat.png"
          ></image>
          <image
            v-show="music.is_love"
            @click="loveornot(false)"
            class="ctrls-btn"
            src="../static/like.png"
            style="width: 36px; height: 36px;"
          ></image>
          <image
            v-show="!music.is_love"
            @click="loveornot(true)"
            class="ctrls-btn"
            src="../static/dislike.png"
            style="width: 36px; height: 36px;"
          ></image>
          <!-- 这里是抽屉开始 -->
          <view class="drawer">
            <image
            @click="showDrawer"
            class="ctrls-btn"
            src="../static/comment.png"
          ></image>
            <uni-drawer ref="showLeft" :width="320" mode="right">
              <view class="com">评论区</view>
              <image
            @click="closeDrawer"
            class="ctrls-btn"
            src="../static/close.png"
          ></image>
              <view class="boxes">
                <view v-for="(i, index) in comments" :key="index" class="box">
                  <image
                    :src="i.pic_src"
                    class="avatar"
                  ></image>
                  <text class="name">{{ i.name }}</text>
                  <view>{{ i.comment }}</view>
                </view>
              </view>
              <view class="uni-textarea">
                <input
                  placeholder="友善发言，从我做起~"
                  v-model="text"
                />
              <button @click="send_comment">发表</button>
              </view>
            </uni-drawer>
          </view>
          <!-- 这里是抽屉结束 -->
        </view>
        <view class="part1">
          <text class="num1">{{ currentTime_display }}</text>
          <slider
            @change="intervalChange"
            :value="currentTime"
            min="0"
            max="100"
            style="width: 200px"
            block-size="12"
          />
          <text class="num2">{{ duration_display }}</text>
        </view>
        <view class="part2">
          <image
            @click="previous"
            class="ctrls-btn"
            src="../static/previous.png"
          ></image>
          <image
            v-show="music.is_paused"
            @click="playornot(false)"
            class="ctrls-btn"
            src="../static/play.png"
            style="width: 45px; height: 45px;"
          ></image>
          <image
            v-show="!music.is_paused"
            @click="playornot(true)"
            class="ctrls-btn"
            src="../static/pause.png"
            style="width: 45px; height: 45px;"
          ></image>
          <image
            @click="next"
            class="ctrls-btn"
            src="../static/next.png"
          ></image>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useMusic, useUser } from "@/store";
import Bus from "@/api/bus";
import uniDrawer from "@dcloudio/uni-ui/lib/uni-drawer/uni-drawer.vue";
export default {
  components: { uniDrawer },
  data() {
    return {
      title: "Hello",
    };
  },
  onLoad() {},
  onShow: function () {},
  methods: {
    showDrawer() {
      this.$refs["showLeft"].open();
    },
    closeDrawer() {
      this.$refs["showLeft"].close();
    },
  },
  setup() {
    const db = wx.cloud.database({
      env: "cloud1-9gwoav2d1358e3bc",
    });
    const music = useMusic();
    const user = useUser();
    const comments = ref([]);
    const currentTime = ref(0);
    const text = ref("");
    let timer = null;
    let formater = function(num) {
      if (num < 10) return "0" + num.toString();
      return num.toString();
    }
    const currentTime_display = computed(() => {
      let temp = parseInt(music.music_currentTime);
      let minute = Math.floor(temp / 60);
      let second = temp - minute * 60;
      return `${formater(minute)}:${formater(second)}`;
    });
    const duration_display = computed(() => {
      let temp = parseInt(music.music_duration);
      let minute = Math.floor(temp / 60);
      let second = temp - minute * 60;
      return `${formater(minute)}:${formater(second)}`;
    });
    watch(
      () => music.music_currentTime,
      (newValue) => {
        currentTime.value = (newValue / music.music_duration) * 100;
      }
    );
    const intervalChange = function (e) {
      let num = e.detail.value;
      music.music_to_currentTime = num * (music.music_duration / 100);
    };
    const playornot = function (status) {
      Bus.emit("playornot", status);
    };
    const randomornot = function (status) {
      music.to_random(status);
    };
    const repeatornot = function (status) {
      music.is_repeated = status;
    };

    const throttle1 = function () {
      return function (status) {
        if (timer) return;
        music.is_love = status;
        if (!status) {
          let index = user.love.findIndex((i) => i === music.music_title);
          user.love.splice(index, 1);
        } else {
          if (user.love.some((i) => i === music.music_title)) return;
          user.love.push(music.music_title);
        }
        timer = setTimeout(() => {
          clearTimeout(timer);
          timer = null;
        }, 5000);
        Bus.emit("update_love");
      };
    };
    const fn1 = throttle1();
    const loveornot = function (status) {
      fn1(status);
    };
    const next = function () {
      music.next();
    };
    const previous = function () {
      music.previous();
    };

    watch(
      () => music.music_title,
      (newVal) => {
        db.collection("comments")
          .where({ song_title: newVal })
          .get({
            success: function (res) {
              comments.value = res.data;
            },
          });
      },
      {
        immediate: true,
      }
    );
    const throttle2 = function () {
      return function () {
        if (timer) return;
        timer = setTimeout(() => {
          clearTimeout(timer);
          timer = null;
        }, 5000);
        db.collection("comments")
          .add({
            data: {
              name: user.name,
              pic_src: user.pic_src,
              song_title: music.music_title,
              comment: text.value,
            },
          })
          .then((res) => {
            text.value = "";
            db.collection("comments")
              .where({ song_title: music.music_title })
              .get({
                success: function (res) {
                  comments.value = res.data;
                },
              });
          })
          .catch(console.error);
      };
    };
    const fn2 = throttle2();
    const send_comment = function () {
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
      send_comment,
    };
  },
};
</script>

<style>
.showImg {
  width: 175px;
  height: 175px;
  border-radius: 50%;
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 2px #fff, 0 0 3px #fff, 0 0 5px #fff,
              0 0 8px #fff, 0 0 10px #fff, 0 0 15px #fff;
}
.showImg image {
  width: 175px;
  height: 175px;
  border-radius: 50%;
}
.text-area {
  text-align: center;
  height: 100vh;
}
.text-area::after {
  content: '';
  filter: blur(10px);
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(#9cbbda00 0%, #00000000 50%, #000000ff 100%),
    url("https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201711%2F24%2F20171124171116_vLUhu.thumb.400_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1658890789&t=ebd5085de80fbc16f089f5c70a2bb4fa");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  z-index: -1;
}
.hugefont {
  color: #ecf0f1;
  font-size: 22px;
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
}
.bottom-ctrls {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  padding: 20px;
  width: 100%;
}
.bottom-ctrls text {
  color: #ecf0f1;
  font-size: 16px;
}
.bottom-ctrls slider {
  margin: 0 auto;
}
.part1 {
  display: flex;
  margin: 0 auto;
  width: 90%;
  align-items: center;
}
.part2 {
    display: flex;
    justify-content: space-evenly;
    margin: 20px;
    align-items: center;
}
.ctrls-btn {
  width: 30px;
  height: 30px;
}

uni-drawer,
uni-drawer text.name {
  color: #34495e;
}

.avatar {
  width: 40px; height: 40px; border-radius: 50%; 
  border: 2px solid #ecf0f1;grid-row-start: span 2;
}
.boxes {
    height: 145px;
    overflow: scroll;
}
.box {
  display: grid;
  grid-template-columns: 50px 1fr;
  text-align: left;
  margin-bottom: 5px;
  margin-left: 5px;
}
.uni-textarea {
  display: flex;
      align-items: center;
      position: absolute;
      bottom: 0;
}
.uni-textarea input {
    width: 200px;
    height: 30px;
    border: 1.5px solid #ccc;
    margin: 10px 2px;
    border-radius: 5px;
    padding: 0 10px;
    line-height: 30px;
    text-align: left;
}
.uni-textarea button {
  width: 70px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    background: #2ecc71;
    color: #fff;
    display: inline-block;
    margin: 0;
}
uni-drawer .ctrls-btn {
    position: absolute;
    top: 5px;
    right: 25px;
    width: 20px;
    height: 20px;
}
.com {
  text-align: center;
  font-size: 18px;
}
.rota {
  animation: rota 60s infinite;
}
@keyframes rota {
  from {
    transform: rotate(0deg);
    
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
