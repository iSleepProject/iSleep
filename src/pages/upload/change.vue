<template>
<view class="container">
  <view class="bigfont">{{ infos.type === "name" ? "修改姓名" : "修改个性签名" }}</view>
  <view class="cards">
    <input type="text" :placeholder="infos.value" v-model="val" maxlength="30" />
  </view>
  <button class="btn1" @click="change">确定修改</button>
</view>
</template>

<script>
import { useUser } from "@/store";
export default {
  data() {
    return {
      infos: {
        type: "",
        value: "",
      },
      val: "",
    };
  },
  onLoad(data) {
    this.infos.type = data.type;
    this.infos.value = data.value;
  },
  methods: {
    change() {
      const db = wx.cloud.database({
        env: "cloud1-9gwoav2d1358e3bc",
      });
      const that = this;
      const _ = db.command;
      const user = useUser();
      //   [user[that["infos"]["type"]]] = this.val;
      if (that.infos.type === "name") {
        let reg_name = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,10}$/;
        if (!reg_name.test(this.val)) {
          wx.showModal({
            title: "警告",
            content: "不符合要求，请重新输入长度十以下中英文昵称！",
            showCancel: false,
          });
          return;
        }
      }
      user.update(that.infos.type, that.val);
      db.collection("users")
        .where({ account: user.account })
        .update({
          data: {
            [that["infos"]["type"]]: that.val,
          },
          success: function (res) {
            console.log("更新成功！");
          },
        });

      uni.switchTab({
        url: "/pages/upload/index",
      });
    },
  },
};
</script>

<style scoped>
.container {
    height: 100vh;
    padding: 0 25px;
}
.container::after {
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
.cards {
  padding: 30px 0 10px;
  line-height: 40px;
  font-size: 16px;
  color: #ecf0f1;
  position: relative;
  border-bottom: 1px solid #ffffff22;
}
.btn1 {
  color: white;
  background-color: transparent;
  display: block;
  text-align: center;
  border: 0;
  margin: 20px auto;
  border: 2px solid #2ecc71;
  /* padding:14px 10px; */
  cursor: pointer;
  width: 120px;
  outline: none;
  border-radius: 24px;
  transition: 0.25s;
  font-size: 14px;
}
.bigfont {
  color: #ecf0f1;
  font-size: 16px;
      text-align: center;
    margin: 20px;
}
</style>
