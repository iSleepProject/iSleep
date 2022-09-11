<template>
  <view class="container">
    <view class="top-wrap">
      <swiper
        class="swiper"
        circular
        :indicator-dots="indicatorDots"
        :autoplay="autoplay"
        :interval="interval"
        :duration="duration"
      >
        <swiper-item>
          <image
            mode="aspectFill"
            src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F017baa5e63622fa80120a8958dbfe9.jpg%402o.jpg&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1658826187&t=7d5cb34d64909b607926a4e8af022555"
          ></image>
        </swiper-item>
        <swiper-item>
          <image
            mode="aspectFill"
            src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01fb565ef15e68a801206621fa76d8.jpg%401280w_1l_2o_100sh.jpg&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1658826752&t=729e11fc47d55f39a252f00a480309bf"
          ></image>
        </swiper-item>
        <swiper-item>
          <image
            mode="aspectFill"
            src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01b927598595e4a8012156039df9d8.jpg%401280w_1l_2o_100sh.jpg&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1658826694&t=7d0ab02eb09d3c9475ae0ac606c31074"
          ></image>
        </swiper-item>
      </swiper>
    </view>
    <view class="main-wrap">
      <view class="nav">
        <text :class="{'highlight': list_style==='love'}" @click="show_list('love')">收藏</text>
        <text :class="{'highlight': list_style==='classic'}" @click="show_list('classic')">经典</text>
        <text :class="{'highlight': list_style==='mild'}" @click="show_list('mild')">温柔</text>
      </view>
      <view v-show="list_style === 'love'" class="bars-wrap">
        <view class="bar" v-for="(i, index) in love" :key="index">
          <view class="bar-text">
            <text>{{ i.title }}</text>
            <text class="detail">{{ i.singer }}</text>
          </view>
          <text
            class="play-btn"
            @click="enter_music_center('love', i.id)"
          ></text>
        </view>
      </view>
      <view v-show="list_style === 'classic'" class="bars-wrap">
        <view class="bar" v-for="(i, index) in classic" :key="index">
          <view class="bar-text">
            <text>{{ i.title }}</text>
            <text class="detail">{{ i.singer }}</text>
          </view>
          <text
            class="play-btn"
            @click="enter_music_center('classic', i.id)"
          ></text>
        </view>
      </view>
      <view v-show="list_style === 'mild'" class="bars-wrap">
        <view class="bar" v-for="(i, index) in mild" :key="index">
          <view class="bar-text">
            <text>{{ i.title }}</text>
            <text class="detail">{{ i.singer }}</text>
          </view>
          <text
            class="play-btn"
            @click="enter_music_center('mild', i.id)"
          ></text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { onMounted, ref } from "vue";
import { useMusic, useUser } from "@/store";
import Bus from "@/api/bus";
export default {
  onLoad: function () {},
  setup() {
    const db = wx.cloud.database({
      env: "cloud1-9gwoav2d1358e3bc",
    });
    const user = useUser();
    const music = useMusic();
    const mild = ref([]);
    const classic = ref([]);
    const love = ref([]);
    const all = ref([]);
    const indicatorDots = ref(true);
    const autoplay = ref(true);
    const interval = ref(2000);
    const duration = ref(500);
    const list_style = ref("classic");
    const enter_music_center = function (style, id) {
      if (style === "classic") {
        music.original_list = classic.value;
        music.play(id);
        uni.switchTab({
          url: "/pages/music/index",
        });
      }
      if (style === "mild") {
        music.original_list = mild.value;
        music.play(id);
        uni.switchTab({
          url: "/pages/music/index",
        });
      }
      if (style === "love") {
        music.original_list = love.value;
        music.play(id);
        uni.switchTab({
          url: "/pages/music/index",
        });
      }
    };
    const show_list = function (style) {
      if (style === "love") {
        list_style.value = "love";
      } else if (style === "classic") {
        list_style.value = "classic";
      } else {
        list_style.value = "mild";
      }
    };

    Bus.on("update_love", () => {
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
      db.collection("users")
        .where({ account: user.account })
        .update({
          data: {
            love: user.love,
          },
          success: function (res3) {
            console.log("修改成功！");
          },
        });
    });

    onMounted(() => {
      db.collection("musics").get({
        success: function (res) {
          res.data.forEach((item) => {
            if (user.love.some((i) => i === item.title)) {
              item.is_love = true;
              love.value.push(item);
            } else {
              item.is_love = false;
            }
          });
          classic.value = res.data
            .filter((item) => item.style === "classic")
            .sort((a, b) => Number(a.id) - Number(b.id));
          mild.value = res.data
            .filter((item) => item.style === "mild")
            .sort((a, b) => Number(a.id) - Number(b.id));
          all.value = res.data;
        },
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
      mild,
    };
  },
};
</script>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
}
.container::after {
  content: '';
  filter: blur(5px);
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
.top-wrap,
.main-wrap {
  width: 100%;
  color: #ecf0f1;
}
.swiper {
  height: 300rpx;
}
image {
  width: 100%;
  height: 300rpx;
}
.nav {
  text-align: center;
  display: flex;
  justify-content: space-evenly;
  border-bottom: 1px solid lightgrey;
  width: 70%;
  margin: auto;
  line-height: 28px;
  padding-top: 3px;
}
.nav text {
  font-size: 14px;
}
.bars-wrap {
  margin: 10px;
  height: 500px;
  overflow: scroll;
}
.bar {
  margin: 8px 0;
  width: auto;
  height: 70px;
  font-size: 18px;
  color: #fff;
  padding-left: 20px;
  position: relative;
  border-radius: 10px;
}
.bar .detail {
  font-size: 14px;
}
.bar .bar-text {
  display: flex;
  flex-direction: column;
  line-height: 35px;
}
.bar .play-btn {
  position: absolute;
  right: 5%;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: url("../../static/play.png");
  background-size: cover;
}
.bar:nth-child(5n+1) {
  background: linear-gradient(
      to right,
      #7da3ea00 0%,
      #7da3ea66 30%,
      #7da3eacc 60%
    ),
    url("https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fcms-bucket.ws.126.net%2F2019%2F05%2F05%2Fc37c09a7244a47308e3f1e7ffe43eed1.jpeg&refer=http%3A%2F%2Fcms-bucket.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1658881207&t=cefeea8fbe0c8c33f3b4ce74a532d0b7");
  background-position: left center;
  background-repeat: no-repeat;
}
.bar:nth-child(5n+2) {
  background: linear-gradient(
      to right,
      #99ee7d00 0%,
      #99ee7d66 30%,
      #99ee7dcc 60%
    ),
    url("https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F711%2F031214121416%2F140312121416-12-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1658882130&t=f2252a5c0f77dfc4260b54e854586130");
  background-position: left center;
  background-repeat: no-repeat;
}
.bar:nth-child(5n+3) {
  background: linear-gradient(
      to right,
      #a3e7ff00 0%,
      #a3e7ff66 30%,
      #a3e7ffcc 60%
    ),
    url("https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic%2Fe4%2F9d%2Fbe%2Fe49dbe44bec09568b96addd1f4eaed9a.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1658882740&t=1898cf202cb7125602e6d74c4f50634e");
  background-position: left center;
  background-repeat: no-repeat;
}
.bar:nth-child(5n+4) {
  background: linear-gradient(
      to right,
      #fffcaa00 0%,
      #fffcaa66 30%,
      #fffcaacc 60%
    ),
    url("https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.cc0.cn%2Fpixabay%2F2019101114370920674.jpg%21cc0.cn.jpg&refer=http%3A%2F%2Fimg.cc0.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1658883225&t=ec69e37b3fa34c6283dce17f94ec28c6");
  background-position: left center;
  background-repeat: no-repeat;
}
.bar:nth-child(5n+5) {
  background: linear-gradient(
      to right,
      #f1c68a00 0%,
      #f1c68a66 30%,
      #f1c68acc 60%
    ),
    url("https://img2.baidu.com/it/u=583941821,1735063448&fm=253&fmt=auto&app=138&f=JPEG?w=888&h=500");
  background-position: left center;
  background-repeat: no-repeat;
}
.highlight {
  color: rgb(255, 255, 153);
}
</style>
