<template>
    <div class="main index">
        <div class="user clearfix" @click="go('/userInfo')">
            <div class="img"><img :src="userInfo.headPic" /></div>
            <div class="name">{{userInfo.name}}</div>
        </div>
        <dl class="list">
            <dd @click="goMessage()">
                <i><img src="images/indexIcon1.png" /></i>
                <div class="text">
                    <h5>法律咨询</h5>
                    <span>7X24小时服务</span>
                </div>
            </dd>
            <dd @click="go('/myCaseList')">
                <i><img src="images/indexIcon2.png" /></i>
                <div class="text">
                    <h5>我的案件</h5>
                    <span>案件信息全掌握</span>
                </div>
            </dd>
            <dd @click="go('/assessList')" v-if="userInfo.expert">
                <i><img src="images/indexIcon3.png" /></i>
                <div class="text">
                    <h5>我的评估</h5>
                    <span>专家律师服务</span>
                </div>
            </dd>
        </dl>
    </div>
</template>
<script>
export default {
    name: 'index',
    data() {
        return {
            loadConfig: getLs('config') && getLs('policy'), //是否更新config
            config: false,
            policy: false,
            userInfo: getLs('userInfo') ? getLs('userInfo') : false,
        }
    },
    mounted() {
        if (!this.loadConfig || !this.userInfo) {
            this.getConfig();
        }
    },
    methods: {
        go: function(url) {
            this.$router.push({ path: url });
        },
        goMessage: function() {
            var url = '/dutyLogin',
                orgId = getLs('orgId');
            if (orgId) {
                url = '/messageList';
            }
            this.$router.push({ path: url });
        },
        getConfig: function() {
            var that = this,
                ajax = new AJAX();

            var loading = this.$loading({
                lock: true,
                text: '正在装载配置参数，请稍候...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });

            // //获取字典
            ajax.get(ajax.api.CONFIG, { isToken: true }, function(data) {
                // console.log(data);
                setLs('config', data.data);
                // console.log(getLs('config'));
                that.config = true;
                if (that.policy) {
                    loading.close();
                }
            });

            //阿里云授权
            ajax.get(ajax.api.OSSPOLICY, {}, function(data) {
                // console.log(data);
                var policy = data.data;
                setLs('policy', policy);
                setCookie('accessid', policy.accessid, 60 * 8);
                setCookie('endPoint', policy.endPoint, 60 * 8);
                setCookie('priBucketName', policy.priBucketName, 60 * 8);
                that.policy = true;
                if (that.config) {
                    loading.close();
                }
            });
        },
        // duty: function() {
        //     var _data = {},
        //         ajax = new AJAX();
        //     ajax.get(ajax.api.DUTY, _data, function(data) {
        //         console.log(data);
        //     });
        // }
    }
}
</script>
<style lang="less">
.index {
    .user {
        width: 100%;
        background: #fff;
        padding: 15px 0;
        box-shadow: 0px 2px 2px #b3b3b3;
        .img {
            float: left;
            width: 70px;
            height: 70px;
            margin: 0 20px;
            img {
                width: 70px;
                height: 70px;
                border-radius: 45px;
            }
        }
        .name {
            line-height: 70px;
            float: left;
            font-size: 2rem;
            color: #000;
        }
    }
    .list {
        width: 100%;
        dd {
            width: 90%;
            margin: 0 5%;
            height: 110px;
            background: #fff;
            box-shadow: 0px 2px 5px #bcbcbc;
            margin-top: 30px;
            i {
                display: inline-block;
                margin: 20px;
                float: left;
                img {
                    width: 64px;
                    height: 61px;
                }
            }
            .text {
                float: left;
                margin-top: 20px;
                color: #000;
                h5 {
                    font-size: 2.0rem;
                    line-height: 40px;
                }
                span {
                    color: #666;
                    font-size: 1.5rem;
                }
            }
        }
        dd:nth-child(even) {
            i {
                float: right;
            }
            .text {
                margin-left: 20px;
            }
        }
    }
}
</style>