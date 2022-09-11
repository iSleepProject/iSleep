<template>
  <view class="container">
    <form class="box">
      <view class="bigfont">和失眠说再见啦</view>
      <input
        type="text"
        name="useraccount"
        placeholder="账号"
        v-model="account"
      />
      <input type="text" name="username" placeholder="昵称" v-model="name" />
      <input
        type="password"
        name="userpsw"
        placeholder="密码"
        v-model="password"
      />
      <input
        type="password"
        name="userpsw2"
        placeholder="确认密码"
        v-model="apassword"
      />
      <input
        type="text"
        name="keyquestion"
        placeholder="密保问题"
        v-model="question"
      />
      <input
        type="text"
        name="keyanswer"
        placeholder="密保答案"
        v-model="answer"
      />
      <button @click="submit" class="btn1">注册</button>
    </form>
    <view class="end-img" v-show="height >= 665">
      <image mode="aspectFit" src="../../static/pic2.png"></image>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      height: 700,
      account: "",
      name: "",
      password: "",
      apassword: "",
      question: "",
      answer: "",
      pass1: true,
      pass2: true,
      pass3: true,
      pass4: true,
      pass5: true,
      pass6: true,
    };
  },
  onLoad() {
    let h;
    wx.getSystemInfo({
      success(res) {
        // console.log(res.windowHeight);
        h = res.windowHeight;
      },
    });
    this.height = h;
  },
  methods: {
    submit() {
      //判断账号是否符合邮箱格式
      let reg_account =
        /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if (reg_account.test(this.account)) {
        this.pass1 = true;
      } else {
        this.account = "";
        this.pass1 = false;
      }
      //判断昵称是否只包含字母、数字及汉字，且长度为1-10
      let reg_name = /^[a-zA-Z0-9\u4e00-\u9fa5]{1,10}$/;
      if (reg_name.test(this.name)) {
        this.pass2 = true;
      } else {
        this.name = "";
        this.pass2 = false;
      }
      //判断密码是否只包含字母、数字或特殊字符，且长度为5-12
      let reg_password = /^[a-zA-Z0-9\u4e00-\u9fa5$@$!%*#_~?&,.]{5,12}$/;
      if (reg_password.test(this.password)) {
        this.pass3 = true;
      } else {
        this.password = "";
        this.pass3 = false;
      }
      //判断密码是否相同
      if (this.pass3 == true && this.password == this.apassword) {
        this.pass4 = true;
      } else {
        this.apassword = "";
        this.pass4 = false;
      }
      //判断密保问题是否为非空
      if (this.question != "") {
        this.pass5 = true;
      } else {
        this.pass5 = false;
      }
      //判断密保答案是否为非空
      if (this.answer != "") {
        this.pass6 = true;
      } else {
        this.pass6 = false;
      }
      if (
        this.pass1 == false ||
        this.pass2 == false ||
        this.pass3 == false ||
        this.pass4 == false ||
        this.pass5 == false ||
        this.pass6 == false
      ) {
        let msg = "";
        if (this.pass1 == false) {
          msg = msg + "[账号]";
        }
        if (this.pass2 == false) {
          msg = msg + "[昵称]";
        }
        if (this.pass3 == false) {
          msg = msg + "[密码]";
        }
        if (this.pass3 == true && this.pass4 == false) {
          msg = msg + "[确认密码]";
        }
        if (this.pass5 == false) {
          msg = msg + "[密保问题]";
        }
        if (this.pass6 == false) {
          msg = msg + "[密保答案]";
        }
        wx.showModal({
          title: "警告",
          content: msg + "不符合要求，请重新输入！",
          showCancel: false,
        });
      } else {
        let that = this;
        wx.cloud.init();
        const db = wx.cloud.database();
        db.collection("users")
          .where({
            account: that.account.toString(),
          })
          .get({
            success: function (res) {
              if (res.data.length == 1) {
                wx.showModal({
                  title: "警告",
                  content: "该用户名已存在",
                  showCancel: false,
                });
                that.account = "";
              } else {
                console.log(that.account);
                db.collection("users").add({
                  data: {
                    account: that.account.toString(),
                    name: that.name.toString(),
                    password: that.password.toString(),
                    question: that.question.toString(),
                    answer: that.answer.toString(),
                    desc: "和失眠说再见",
                    fileId:
                      "cloud://cloud1-9gwoav2d1358e3bc.636c-cloud1-9gwoav2d1358e3bc-1312093740/users_img/logo.png",
                    love: [],
                    pic_src:
                      "https://636c-cloud1-9gwoav2d1358e3bc-1312093740.tcb.qcloud.la/users_img/logo.png?sign=b806e62233162987f65bc8c4441c7daf&t=1656501899",
                    token: "xxxx",
                  },
                });
                wx.showModal({
                  title: "提示",
                  content: "注册成功！",
                  showCancel: false,
                  success(res) {
                    if (res.confirm) {
                      uni.navigateTo({
                        url: "/pages/login/index",
                      });
                    }
                  },
                });
              }
            },
            fail: console.error,
          });
      }
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

.box {
  width: 100vw;
  padding: 5px;
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
  border-bottom: 1px solid #2980b9;
  padding: 10px;
  width: 200px;
  outline: none;
  color: white;
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

.end-img image {
  height: 175px;
}
</style>
