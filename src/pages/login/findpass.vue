<template>
    <view class="container">
        <form class="box">
            <view v-if="!pass" class="bigfont">找回密码</view>
            <input v-if="!pass" type="text" name="useraccount" placeholder="请输入你的账号" v-model="account" />
            <button v-if="!pass" @click="check" class="btn1">提交</button>
            <view class="bigfont" v-if="pass">密保问题:</view>
            <view class="bigfont" v-if="pass">{{ question }}</view>
            <input v-if="pass" type="text" name="answer" placeholder="请输入密保答案" v-model="answer" />
            <button v-if="pass" @click="submit" class="btn1">验证</button>
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
            pass: false,
            account: "",
            question: "",
            info: "",
            answer: ""
        }
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
        check() {
            let that = this
            wx.cloud.init();
            const db = wx.cloud.database();
            db.collection("users")
                .where({
                    account: that.account.toString()
                })
                .get({
                    success: function (res) {
                        if (res.data.length == 1) {
                            that.info = res.data[0]
                            that.pass = true
                            that.question = res.data[0].question
                        } else {
                            wx.showModal({
                                title: '警告',
                                content: '账号错误，请重新输入',
                                showCancel: false
                            })
                        }
                    },
                    fail: console.error,
                });
        },
        submit() {
            let that = this
            if (this.info.answer == this.answer) {
                wx.showModal({
                    title: '提示',
                    content: '验证成功！',
                    showCancel: false,
                    success(res) {
                        if (res.confirm) {
                            uni.navigateTo({
                                url: "/pages/login/changepass?account=" + that.account,
                            });
                        }
                    }
                });
            } else {
                wx.showModal({
                    title: '提示',
                    content: '验证失败！',
                    showCancel: false,
                });
            }
        }
    }
}
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