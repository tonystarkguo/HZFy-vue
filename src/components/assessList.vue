<template>
    <div class="main assessList">
        <div class="condition clearfix">
            <el-select v-model="caseTypeValue" placeholder="案件类型" size="small">
                <el-option v-for="item in caseType" :key="item.code" :value="item.code" :label="item.name">
                </el-option>
            </el-select>
            <el-select v-model="dicStatusValue" placeholder="评估状态" size="small">
                <el-option v-for="item in dicStatus" :key="item.code" :value="item.code" :label="item.name">
                </el-option>
            </el-select>
        </div>
        <dl class="list" v-loading="loading" v-loading.fullscreen.lock="loading">
            <dd v-for="item in list" @click="goDetail(item.id,item.tOrgId,item.dicStatus)">
                <h5>{{item.caseNo}}</h5>
                <span>援助人员：{{item.expertName}}</span>
                <i>{{item.endCaseTime}}</i>
                <b>{{item.dicStatusName}}</b>
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
    name: 'assessList',
    data() {
        return {
            more: false,
            loading: true,
            pageNum: 1,
            pageSize: 10,
            caseType: [],
            caseTypeValue: '',
            dicStatus: [],
            dicStatusValue: '',
            list: [],
        }
    },
    watch: {
        caseTypeValue: {
            deep: true,
            handler: function(val, old) {
                this.pageNum = 1;
                this.getAssesmentList();
            }
        },
        dicStatusValue: {
            deep: true,
            handler: function(val, old) {
                this.pageNum = 1;
                this.getAssesmentList();
            }
        }
    },
    mounted() {
        this.getOption();
        this.getAssesmentList(true, false);
    },
    methods: {
        goDetail: function(id, orgid, dicStatus) {
            this.$router.push({ path: '/assess/' + id + '_' + orgid + '_' + dicStatus });
        },
        getOption: function() {
            var caseType = getLs('config').dictData.dic_case_type;
            caseType.unshift({
                code: 'all',
                leaf: false,
                name: "全部",
                sort: "",
            });
            var dicStatus = getLs('config').dictData.dic_dic_assessment_appoint_status_two;
            dicStatus.unshift({
                code: 'all',
                leaf: false,
                name: "全部",
                sort: "",
            });
            this.caseType = caseType;
            this.dicStatus = dicStatus;
        },
        getMore: function() {
            this.pageNum = this.pageNum + 1;
            this.getAssesmentList(true);
        },
        getAssesmentList: function(more) {
            var that = this,
                ajax = new AJAX(),
                _data = {
                    pageNum: that.pageNum,
                    pageSize: that.pageSize
                };

            var caseType = that.caseTypeValue,
                dicStatus = that.dicStatusValue;

            if (caseType != 'all' && caseType != '') {
                _data.caseType = caseType;
            }

            if (dicStatus != 'all' && dicStatus != '') {
                _data.dicStatus = dicStatus;
            }

            that.loading = true;
            ajax.get(ajax.api.ASSESMENTLIST, _data, function(data) {
                // console.log(data);
                var _d = data.data.list;
                var list = that.list;
                for (let i = 0; i < _d.length; i++) {
                    _d[i].endCaseTime = sdate(_d[i].endCaseTime);
                }

                if (_d.length < that.pageSize) {
                    that.more = false;
                } else {
                    that.more = true;
                }

                list = list.concat(_d);
                if (more) {
                    that.list = list;
                } else {
                    that.list = _d;
                }
                that.loading = false;
            })
        },
    }
}
</script>
<style lang="less">
.assessList {
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
    }
    .list {
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
</style>