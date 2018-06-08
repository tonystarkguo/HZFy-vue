<template>
    <div class="main messageList">
        <div class="condition clearfix">
            <div class="type">
                <el-select v-model="statusValue" placeholder="咨询状态" size="small">
                    <el-option v-for="item in statusOption" :key="item.code" :value="item.code" :label="item.name">
                    </el-option>
                </el-select>
            </div>
            <div class="dateIcon">
                <el-date-picker :editable="false" size="mini" v-model="consultStartTime" type="date" placeholder="开始日期" value-format="yyyy-MM-dd">
                </el-date-picker>
                -
                <el-date-picker :editable="false" size="mini" v-model="consultEndTime" type="date" placeholder="结束日期" value-format="yyyy-MM-dd">
                </el-date-picker>
            </div>
        </div>
        <dl class="list" v-loading="loading" v-loading.fullscreen.lock="loading">
            <dt v-show="isShowTimeTitle">{{consultStartTime}} 至 {{consultEndTime}}</dt>
            <dd v-for="item in messageList" @click="goDetail(item.id)">
                <h5>{{item.consultNumber}}</h5>
                <span>咨询人：{{item.name}}</span>
                <i>{{item.createTime}}</i>
                <b>{{item.status}}</b>
            </dd>
            <dd class="more">
                <span v-if="more" @click="getMore()">点击加载更多</span>
                <span v-else-if="!loading">没有更多了</span>
            </dd>
        </dl>
    </div>
</template>
<script>
export default {
    name: 'messageList',
    data() {
        return {
            loading: true,
            isShowTimeTitle: false,
            more: false,
            userInfo: getLs('userInfo'),
            orgId: getLs('orgId'),
            pageNum: 1,
            pageSize: 10,
            messageList: [],
            statusOption: [],
            statusValue: '',
            consultStartTime: null,
            consultEndTime: null,
        }
    },
    watch: {
        statusValue: {
            deep: true,
            handler: function(val, old) {
                this.loading = true;
                this.pageNum = 1;
                this.getMessageList(true);
            }
        },
        consultStartTime: {
            deep: true,
            handler: function(val, old) {
                this.loading = true;
                this.pageNum = 1;
                this.getMessageList(true, true);
            }
        },
        consultEndTime: {
            deep: true,
            handler: function(val, old) {
                this.loading = true;
                this.pageNum = 1;
                this.getMessageList(true, true);
            }
        },
    },
    mounted() {
        this.getMessageList(false);
        this.getStatusOption();
    },
    methods: {
        goDetail: function(id) {
            this.$router.push({ path: '/message/' + id });
        },
        getStatusOption: function() {
            var statusList = getLs('config').dictData.dic_consult_status;
            statusList.unshift({
                name: "全部",
                leaf: false,
                code: null,
                sort: ""
            });
            this.statusOption = statusList;
        },
        getMore: function() {
            this.pageNum = this.pageNum + 1;
            this.loading = true;
            this.getMessageList(true, true, true);
        },
        getMessageList: function(type, isTime, more) {
            var that = this,
                _data = {
                    pageNum: that.pageNum,
                    pageSize: that.pageSize,
                    // dicConsultStatus: 'beReply',
                    dicConsultSource: 'online',
                    orgId: that.orgId
                },
                ajax = new AJAX();
            if (type && that.statusValue != '' && that.statusValue != null) {
                _data.dicConsultStatus = that.statusValue;
                if (that.consultStartTime != null && that.consultEndTime != null) {
                    _data.consultStartTime = that.consultStartTime;
                    _data.consultEndTime = that.consultEndTime;
                }
            }
            if (isTime) {
                if (that.consultStartTime != null && that.consultEndTime != null) {
                    _data.consultStartTime = that.consultStartTime;
                    _data.consultEndTime = that.consultEndTime;
                    that.isShowTimeTitle = true;
                } else {
                    that.isShowTimeTitle = false;
                    // return false;
                }
            }

            ajax.get(ajax.api.MESSAGELIST, _data, function(data) {
                // console.log(data);
                var list = that.messageList;
                var _d = data.data.list;
                for (let i = 0; i < _d.length; i++) {
                    var sign = _d[i].sign,
                        tgid = that.userInfo.tGlobalId;
                    if (sign.dicStatus == '1') {
                        _d[i].status = '待签收'
                    } else if (sign.dicStatus == '2' && _d[i].isSubmit == false && sign.signGlobalId == tgid) {
                        _d[i].status = '待回复'
                    } else if (sign.dicStatus == '2' && _d[i].isSubmit == true && sign.signGlobalId == tgid) {
                        _d[i].status = '已回复'
                    } else if (sign.dicStatus == '2' && _d[i].isSubmit == false && sign.signGlobalId != tgid) {
                        _d[i].status = '待回复'
                    } else if (sign.dicStatus == '2' && _d[i].isSubmit == true && sign.signGlobalId != tgid) {
                        _d[i].status = '已回复'
                    }
                    _d[i].createTime = sdate(_d[i].createTime);
                    // console.log(_d[i].status);
                }

                if (_d.length < that.pageSize) {
                    that.more = false;
                } else {
                    that.more = true;
                }

                list = list.concat(_d);
                if (more) {
                    that.messageList = list;
                } else {
                    that.messageList = _d;
                }
                that.loading = false;
            });
        }
    }
}
</script>
<style lang="less">
.messageList {
    .condition {
        width: 100%;
        line-height: 38px;
        border-bottom: solid 1px #c7c7cc;
        color: #8c8c8c;
        background: #fff;
        .type {
            float: left;
            margin-left: 15px;
            .el-select {
                width: 105px;
                input {
                    border: none;
                }
            }
        }
        .dateIcon {
            margin-right: 15px;
            text-align: right;
        }
        .el-date-editor {
            width: 110px;
            .el-input__inner {
                padding-right: 0;
            }
        }
    }
    .list {
        position: absolute;
        left: 0;
        right: 0;
        top: 39px;
        bottom: 0;
        overflow: auto;
        dt {
            width: 100%;
            background: #f7f7f7;
            line-height: 35px;
            color: #000;
            text-indent: 15px;
            border-bottom: solid 1px #c7c7cc;
        }
        dd {
            padding: 15px;
            position: relative;
            background: #fff;
            border-bottom: solid 1px #c7c7cc;
            line-height: 25px;
            h5 {
                font-size: 1.4rem;
                display: block;
            }
            span {
                display: block;
                font-size: 1.2rem;
            }
            i {
                font-size: 1.2rem;
                display: block;
                color: #8c8c8c;
            }
            b {
                position: absolute;
                right: 15px;
                top: 15px;
                font-size: 1.6rem;
                font-weight: normal;
            }
        }
        dd.more {
            text-align: center;
            padding: 0;
            line-height: 35px;
        }
        dd:hover {
            background: #e9e9e9;
        }
    }
}

@media screen and (max-width: 350px) {
    .messageList .condition {
        .type {
            margin-left: 10px;
        }
        .dateIcon {
            margin-right: 10px;
            text-align: right;
            .el-date-editor {
                width: 90px;
                .el-input__inner {
                    padding-right: 0;
                    padding-left: 23px;
                }
                .el-input__prefix {
                    left: 2px;
                }
            }
        }
    }
}
</style>