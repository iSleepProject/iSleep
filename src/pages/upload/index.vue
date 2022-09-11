<template>
  <view class="container">
    <view class="cards" @click.self="click_block">
      头像
      <image
        class="infos"
        :src="infos.pic_src"
        @click.stop="show_picture"
      ></image>
    </view>
    <view class="cards">
      账号
      <text class="infos">{{ infos.account }}</text>
    </view>
    <view class="cards" @click="change('name')">
      昵称
      <text class="infos">{{ infos.name }}</text>
    </view>
    <view class="cards" @click="change('desc')">
      个人签名
      <text class="infos">{{ infos.desc }}</text>
    </view>
    <button class="btn1" @click="logout">退出登录</button>
  </view>
</template>

<script>
import { reactive, watch } from "vue";
import { useUser } from "@/store";
import Bus from "@/api/bus";
export default {
  setup() {
    const db = wx.cloud.database({
      env: "cloud1-9gwoav2d1358e3bc",
    });
    const user = useUser();
    const infos = reactive({
      name: "",
      account: "",
      desc: "",
      pic_src: "",
    });
    const change = function (type) {
      uni.navigateTo({
        url: `/pages/upload/change?type=${type}&value=${infos[type]}`,
        fail: (err) => console.log(err),
      });
    };
    const logout = function () {
      wx.showModal({
        title: "提示",
        content: "确定要登出账号",
        success(res) {
          if (res.confirm) {
            Bus.emit("close");
            wx.removeStorageSync("token");
            uni.navigateTo({
              url: `/pages/login/index`,
              fail: (err) => console.log(err),
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        },
      });
    };
    const show_picture = function () {
      db.collection("users")
        .get({
          account: user.account,
        })
        .then((res) => {
          let index = res.data.findIndex((i) => user.account === i.account);
          const { fileId } = res.data[index];
          wx.cloud
            .getTempFileURL({
              fileList: [
               {
                fileID: fileId,
                  maxAge: 60 * 60,
                },
              ],
            })
            .then((res2) => {
              const { tempFileURL } = res2.fileList[0];
              wx.previewImage({
                current: tempFileURL,
                urls: [tempFileURL],
              });
            });
          });
    };
    const click_block = function () {
      let data = new Date().getTime() + "";
      wx.chooseMedia({
        // 选择上传的图片
        count: 1,
        mediaType: ["image"],
        sourceType: ["album", "camera"],
        sizeType: ["compressed"],
        maxDuration: 30,
        camera: "back",
        success(res) {
          console.log(2, res.tempFiles[0].size); // 这里可以添加一个大小限制
          wx.cloud
            .uploadFile({
              // 上传图片
              cloudPath: `users_img/${user.account + data}`,
              filePath: res.tempFiles[0].tempFilePath, // 文件路径
            })
            .then((res) => {
              let previous_fileId = user.fileId; // 保存上一张图片的fileid 用于后面删除
              wx.cloud
                .getTempFileURL({
                  fileList: [
                    {
                      fileID: res.fileID,
                      maxAge: 60 * 60,
                    },
                  ],
                })
                .then((res2) => {
                  // 获取新图片的路径并刷新页面头像
                  const { tempFileURL } = res2.fileList[0];
                  infos.pic_src = "";
                  user.pic_src = "";
                  user.pic_src = tempFileURL;
                  user.fileId = res.fileID; // 更新pinia数据
                  db.collection("users") // 更改数据库头像路径以及fileId
                    .where({ account: user.account })
                    .update({
                      data: {
                        pic_src: tempFileURL,
                        fileId: res.fileID,
                      },
                      success: function (res3) {
                        if (
                          // 判断旧的头像是否为默认头像
                          previous_fileId !==
                          "cloud://cloud1-9gwoav2d1358e3bc.636c-cloud1-9gwoav2d1358e3bc-1312093740/users_img/logo.png"
                        ) {
                          wx.cloud // 删除存储中旧头像数据
                            .deleteFile({
                              fileList: [previous_fileId],
                            })
                            .then((res4) => {
                              console.log("res4", res4.fileList);
                            })
                            .catch((error) => {
                              // handle error
                            });
                        }
                      },
                    });
                });
            })
            .catch((error) => {
              // handle error
              console.log(error.message);
            });
        },
      });
    };
    watch(
      () => user.name,
      (newVal) => {
        infos.name = newVal;
      },
      {
        immediate: true,
      }
    );
    watch(
      () => user.desc,
      (newVal) => {
        infos.desc = newVal;
      },
      {
        immediate: true,
      }
    );
    watch(
      () => user.account,
      (newVal) => {
        infos.account = newVal;
      },
      {
        immediate: true,
      }
    );
    watch(
      () => user.pic_src,
      (newVal) => {
        console.log("pic", newVal);
        infos.pic_src = newVal;
      },
      {
        immediate: true,
      }
    );
    return {
      change,
      infos,
      logout,
      click_block,
      show_picture,
    };
  },
};
</script>

<style scoped>
.container {
  height: 100vh;
  padding: 0 25px;
}
.container::after {
  content: "";
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
  padding: 30px 0;
  line-height: 40px;
  font-size: 16px;
  color: #ecf0f1;
  position: relative;
  border-bottom: 1px solid #ffffff22;
}
.infos {
  position: absolute;
  right: 5%;
  top: 50%;
  transform: translateY(-50%);
  width: 220px;
  text-align: right;
  line-height: 20px;
}
image.infos {
  max-width: 60px;
  max-height: 60px;
  border-radius: 50%;
  border: 2px solid #ecf0f1;
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
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
