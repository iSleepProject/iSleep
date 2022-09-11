<template>
  <view class="container">
    <form class="box">
      <view class="logo_wrapper">
        <image class="logo" src="../../static/logo.png"></image>
      </view>
      <view class="bigfont">你的夜晚 有我陪伴</view>
      <input
        type="text"
        name="useraccount"
        placeholder="账号"
        v-model="account"
      />
      <input
        type="password"
        name="userpsw"
        placeholder="密码"
        v-model="password"
      />
      <button form-type="submit" class="btn1" @click="formSubmit">登录</button>
      <view class="link smallfont" @click="register">点我注册</view>
      <view class="link smallfont" @click="findpass">找回密码</view>
    </form>
    <view class="end-img" v-show="height >= 665">
      <image mode="aspectFit" src="../../static/pic1.png"></image>
    </view>
  </view>
</template>

<script>
import { useUser } from "@/store";
export default {
  data() {
    return {
      height: 700,
      account: "",
      password: "",
    };
  },
  onLoad() {
    let h;
    wx.getSystemInfo({
      success(res) {
        h = res.windowHeight;
      },
    });
    this.height = h;

    const db = wx.cloud.database({
      env: "cloud1-9gwoav2d1358e3bc",
    });
    const user = useUser();
    let token = wx.getStorageSync("token");
    console.log("mytoken", token);
    db.collection("users")
      .where({
        token,
      })
      .get({
        success: function (res) {
          if (res.data.length == 1) {
            const data = res.data[0];
            user.name = data.name;
            user.account = data.account;
            user.desc = data.desc;
            user.pic_src = data.pic_src;
            user.fileId = data.fileId;
            user.love = data.love;
            console.log(1111);
            uni.switchTab({
              url: "/pages/index/index",
            });
            console.log(2222);
          }
        },
      });
  },
  onShow: function () {},
  methods: {
    formSubmit: function (e) {
      const db = wx.cloud.database({
        env: "cloud1-9gwoav2d1358e3bc",
      });
      const user = useUser();
      const that = this;
      db.collection("users")
        .where({
          account: that.account.toString(),
          password: that.password.toString(),
        })
        .get({
          success: function (res) {
            if (res.data.length == 1) {
              wx.getRandomValues({
                length: 12, // 生成 12 个字节长度的随机数,
                success: (response) => {
                  const token = wx.arrayBufferToBase64(response.randomValues); // 转换为 base64 字符串后打印
                  const data = res.data[0];
                  user.name = data.name;
                  user.account = data.account;
                  user.desc = data.desc;
                  user.pic_src = data.pic_src;
                  user.fileId = data.fileId;
                  user.love = data.love;
                  user.token = token;
                  wx.setStorageSync("token", token);
                  db.collection("users")
                    .where({ account: data.account })
                    .update({
                      data: {
                        token,
                      },
                      success: function (res) {
                        console.log("token更新成功！");
                        uni.switchTab({
                          url: "/pages/index/index",
                        });
                      },
                    });
                },
              });
            } else {
              wx.showModal({
                title: "警告",
                content: "账号或密码错误，请重新输入",
                showCancel: false,
              });
              that.password = "";
            }
          },
        });
    },
    register() {
      uni.navigateTo({
        url: "/pages/login/register",
      });
    },
    findpass() {
      uni.navigateTo({
        url: "/pages/login/findpass",
      });
    },
  },
};
</script>

<style scoped>
.container {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  font-family: sans-serif;
  background-color: #34495e;
}
.logo_wrapper {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin: 20px auto;
  position: relative;
}
.logo {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.box {
  width: 100vw;
  padding: 10px;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
  background-color: #34495e;
  text-align: center;
}
.box input[type="text"],
.box input[type="password"] {
  background: none;
  display: block;
  text-align: center;
  margin: 20px auto;
  border: 1px solid #2980b9;
  padding: 10px;
  width: 200px;
  outline: none;
  color: white;
  border-radius: 55px;
  transition: 0.5s;
}
.box input[type="text"]:focus,
.box input[type="password"]:focus {
  width: 280px;
  border-color: #3498db;
}
.btn1 {
  color: white;
  background: none;
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
.btn1:hover {
  background-color: #2ecc71;
}
.bigfont {
  color: #ecf0f1;
  font-size: 16px;
}
.smallfont {
  font-size: 12px;
}
.link {
  color: #37afff;
}
.end-img {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  position: absolute;
}
</style>
