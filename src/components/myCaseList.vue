<template>
    <div class="main myCaseList" v-loading="loading" v-loading.fullscreen.lock="loading">
        <div class="condition">
            <el-select v-model="condition.caseTypeValue" placeholder="案件类型" size="small">
                <el-option v-for="item in caseType" :key="item.code" :value="item.code" :label="item.name">
                </el-option>
            </el-select>
            <el-select v-model="condition.caseStatusValue" placeholder="案件状态" size="small">
                <el-option v-for="item in caseStatus" :key="item.code" :value="item.code" :label="item.name">
                </el-option>
            </el-select>
            <!-- <span>案件状态 <i class="el-icon-caret-bottom"></i></span> -->
        </div>
        <dl class="list">
            <dd v-for="item in caseList" @click="goDetail(item.caseId + '_' + item.isChange)">
                <h5>{{item.caseNum}}</h5>
                <span>咨询人：{{item.rpName}}</span>
                <i>{{item.createDate}}</i>
                <b>{{item.caseStatus}}</b>
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
    name: 'myCaseList',
    data() {
        return {
            loading: true,
            more: false,
            pageNum: 1,
            pageSize: 10,
            caseList: [],
            caseType: [],
            caseStatus: [],
            condition: {
                caseTypeValue: '',
                caseStatusValue: ''
            }
        }
    },
    watch: {
        condition: {
            deep: true,
            handler: function(val, old) {
                this.loading = true;
                this.pageNum = 1;
                this.getCaseList(true);
            }
        }
    },
    mounted() {
        this.getCondition();
        this.getCaseList();
    },
    methods: {
        goDetail: function(id) {
            this.$router.push({ path: '/myCase/' + id });
        },
        getCondition: function() {
            var caseType = getLs('config').dictData.dic_case_type,
                caseStatus = [{
                    code: 'all',
                    name: "全部",
                }, {
                    code: '14,15',
                    name: "承办中",
                    sort: ""
                }, {
                    code: '16',
                    name: "待结案审核",
                }, {
                    code: '17',
                    name: "需补充结案材料",
                }, {
                    code: '18,19,20,0',
                    name: "结案审核完成",
                }],
                cs = [{
                    code: 'all',
                    leaf: false,
                    name: "全部",
                    sort: ""
                }];
            caseType.unshift({
                code: 'all',
                leaf: false,
                name: "全部",
                sort: "",
            });
            this.caseType = caseType;
            this.caseStatus = caseStatus;
        },
        getMore: function() {
            this.pageNum = this.pageNum + 1;
            this.loading = true;
            this.getCaseList(true, true);
        },
        getCaseList: function(type, more) {
            var that = this,
                _data = {
                    pageNum: that.pageNum,
                    pageSize: that.pageSize
                },
                ajax = new AJAX();
            if (type) {
                var caseType = that.condition.caseTypeValue,
                    caseStatus = that.condition.caseStatusValue;
                if (caseType != 'all' && caseType != '') {
                    _data.caseType = caseType;
                }

                if (caseStatus != 'all' && caseStatus != '') {
                    _data.caseStatus = caseStatus;
                }
            }

            // console.log(_data);
            ajax.get(ajax.api.CASELIST, _data, function(data) {
                // console.log(data);
                var _d = data.data.list;
                var list = that.caseList;
                for (let i = 0; i < _d.length; i++) {
                    _d[i].createDate = sdate(_d[i].createDate);
                }

                if (_d.length < that.pageSize) {
                    that.more = false;
                } else {
                    that.more = true;
                }

                list = list.concat(_d);
                if (more) {
                    that.caseList = list;
                } else {
                    that.caseList = _d;
                }
                that.loading = false;
            });
        }
    }
}
</script>
<style lang="less">
.myCaseList {
    .condition {
        width: 100%;
        line-height: 38px;
        line-height: 38px;
        border-bottom: solid 1px #c7c7cc;
        color: #8c8c8c;
        background: #fff;
        .el-select {
            width: 105px;
            input {
                border: none;
            }
        }
        .el-select:last-child {
            width: 155px;
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
        dd:hover {
            background: #e9e9e9;
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
</style>