<template>
    <div class="main login">
        <div class="logo"><img src="images/logo.png" /></div>
        <div class="loginForm">
            <p>
                <input type="input" placeholder="请输入手机号" v-model="mobile" /><span><i class="close" @click="empty()"></i></span></p>
            <p>
                <input type="number" placeholder="请输入验证码" v-model="captchaValue" /><span class="getCode" @click="getCode()">获取验证码</span></p>
            <p>
                <el-button type="primary" :loading="btnLoading" @click="sub()">登录</el-button>
            </p>
        </div>
    </div>
</template>
<script>
export default {
    name: 'login',
    data() {
        return {
            mobile: '',
            captchaValue: '',
            dicLoginAccountType: '3',
            ifGetCode: true,
            phoneReg: new RegExp('^[1][3|4|5|7|8][0-9]{9}$'),
            btnLoading: false
        }
    },
    mounted() {
        // config,policy,userInfo都存在，并且上次登录时间到现在小于8小时，直接跳转index
        var that = this;
        if (getLs('config') && getLs('policy') && getLs('userInfo')) {
            var time = parseInt(getLs('time'));
            var nowTime = new Date() / 1;
            var difference = parseInt(nowTime - time) / 1000 / 60 / 60; //小时
            if (difference < 8) {
                that.$router.push('/index');
            }
        }
    },
    methods: {
        empty() {
            this.mobile = '';
        },
        getCode: function() {
            var ajax = new AJAX();
            var that = this;
            var ui = new UI();
            var _data = {
                mobile: that.mobile,
                isToken: true
            }
            var phone = that.mobile;
            if (phone == '') {
                ui.message({
                    message: '请输入手机号',
                    type: 'error'
                })
            } else if (!that.phoneReg.test(phone)) {
                ui.message({
                    message: '手机号格式错误',
                    type: 'error'
                })
            } else if (!that.ifGetCode) {
                return false;
            } else {
                that.ifGetCode = false;
                $('.getCode').html('正在获取...');
                ajax.get(ajax.api.CAPTCHA, _data, function(data) {
                    // console.log(data);
                    var time = 60;
                    $('.getCode').html(time + ' s').css('color', '#a1a1a1');
                    var timekeeping = setInterval(function() {
                        if (time > 0) {
                            time -= 1;
                            $('.getCode').html(time + ' s');
                        } else {
                            that.ifGetCode = true;
                            clearInterval(timekeeping);
                            $('.getCode').html('发送验证码').css('color', '#1852fb');
                        }
                    }, 1000);
                });
            }
        },
        sub: function() {
            var ajax = new AJAX();
            var that = this;
            var ui = new UI();
            var _data = {
                mobile: that.mobile,
                captchaValue: that.captchaValue,
                dicLoginAccountType: that.dicLoginAccountType,
                isToken: true,
                offLoading: true
            }
            if (that.mobile == '') {
                ui.message({
                    message: '请输入手机号',
                    type: 'error'
                })
            } else if (!that.phoneReg.test(that.mobile)) {
                ui.message({
                    message: '手机号格式错误',
                    type: 'error'
                })
            } else if (that.captchaValue == '') {
                ui.message({
                    message: '请输入验证码',
                    type: 'error'
                })
            } else {
                that.btnLoading = true;
                ajax.post(ajax.api.LOGIN, _data, function(data) {
                    // console.log(data);
                    if (data.code == '1') {
                        var date = new Date() / 1; // 存入毫秒
                        setLs('userInfo', data.data);
                        setLs('time', date);
                        that.$router.push('/index');
                    } else {
                        that.btnLoading = false;
                    }
                });
            }
        }
    }
}
</script>
<style lang="less">
.login {
    background: #f7f7f7;
    .logo {
        width: 100%;
        height: auto;
        text-align: center;
        padding: 23% 0;
        img {
            width: 20%;
        }
    }
    .loginForm {
        width: 92%;
        margin: 0 4%;
        p {
            width: 100%;
            input {
                width: 100%;
                border: none;
                border-bottom: solid 1px #d2d2d2;
                height: 45px;
                line-height: 45px;
                background: none;
                margin-bottom: 15px;
                text-indent: 10px;
                color: #0f0f0f;
            }
            >span {
                position: absolute;
                right: 10px;
                line-height: 45px;
                color: #108ee9;
                .close {
                    margin-top: 13px;
                }
            }
            button {
                width: 100%;
                margin-top: 30px;
            }
        }
    }
}
</style>