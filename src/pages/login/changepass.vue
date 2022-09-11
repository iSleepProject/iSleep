<template>
    <view class="container">
        <form class="box">
            <view class="bigfont">修改密码</view>
            <input type="text" name="newpassword" placeholder="请输入新的密码" v-model="npassword" />
            <input type="text" name="apassword" placeholder="请确认密码" v-model="apassword" />
            <button @click="submit" class="btn1">提交</button>
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
            account: "",
            npassword: "",
            apassword: "",
        }
    },
    onLoad(data) {
        let h;
        wx.getSystemInfo({
            success(res) {
                // console.log(res.windowHeight);
                h = res.windowHeight;
            },
        });
        this.height = h;
        this.account = data.account

    },
    methods: {
        submit() {
            console.log(this.account)
            //判断密码是否只包含字母、数字或特殊字符，且长度为5-12
            let reg_password = /^[a-zA-Z0-9\u4e00-\u9fa5$@$!%*#_~?&,.]{5,12}$/;
            if (reg_password.test(this.npassword) == false && this.npassword != "") {
                this.password = ""
                this.apassword = ""
                wx.showModal({
                    title: '提示',
                    content: '密码格式错误，请重新输入！',
                    showCancel: false,
                });
            }
            //判断密码是否相同
            else if (this.npassword != this.apassword) {
                this.apassword = ""
                wx.showModal({
                    title: '提示',
                    content: '两次密码不相同，请重新输入！',
                    showCancel: false,
                });
            }
            else {
                let that = this
                wx.cloud.init();
                const db = wx.cloud.database();
                db.collection("users")
                    .where({
                        account: that.account.toString()
                    })
                    .update({
                        data: {
                            password: that.npassword
                        }
                    })
                wx.showModal({
                    title: '提示',
                    content: '修改成功！',
                    showCancel: false,
                    success(res) {
                        if (res.confirm) {
                            uni.navigateTo({
                                url: "/pages/login/index",
                            });
                        }
                    }
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