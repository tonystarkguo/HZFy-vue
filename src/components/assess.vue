<template>
    <div class="main assess" v-loading="loading" v-loading.fullscreen.lock="loading">
        <el-carousel class="pngList" indicator-position="none" arrow="always" height="100%" :autoplay="false" v-show="isShowPnglist">
            <div class="off" @click="hidePngList"><i class="el-icon-back"></i></div>
            <el-carousel-item v-for="item,index in pngList" :key="index">
                <span><img :src="item.addrUrl"></span>
                <p>第{{index+1}}张，共{{pngList.length}}张</p>
            </el-carousel-item>
        </el-carousel>
        <div class="score">
            <span v-if="scoreType=='2'">质量评估得分：{{jsScore}}{{jsScore=='请打分'?'':'分'}}</span>
            <span v-else>质量评估得分：{{jsScore}}</span>
            <a @click="showPnglist()"><i class="el-icon-document"></i>查看案卷</a>
        </div>
        <dl class="list">
            <dd v-for="item in itemList">
                <h5>{{item.projectName}} （{{item.projectFraction}}分）</h5>
                <span>评估标准：{{item.projectStandard}}</span>
                <!-- item.projectScore -->
                <el-select :disabled="!isEdit" @change="score()" v-model="item.projectScore" placeholder="请选择" size="small">
                    <el-option v-for="list in item.projectFractionList" :label="list.label" :value="list.value">
                    </el-option>
                </el-select>
            </dd>
            <dd>
                <h5>案件质量评价</h5>
                <textarea v-model="caseComment" :disabled="!isEdit"></textarea>
            </dd>
        </dl>
        <p>
            <el-button type="primary" @click="subAssess()" v-show="status=='1'">提交评估</el-button>
            <el-button type="primary" @click="editAssess()" v-show="status=='2'&&isEdit">修改评估</el-button>
        </p>
    </div>
</template>
<script>
export default {
    name: 'assess',
    data() {
        return {
            loading: true,
            caseId: this.$route.params.id.split('_')[0],
            tOrgId: this.$route.params.id.split('_')[1],
            status: this.$route.params.id.split('_')[2], //1待评估  2已评估
            appointId: '',
            isEdit: false, //是否可编辑
            itemList: [], //表单list
            pngList: [], //案卷图片
            isShowPnglist: false, //显示案卷图片
            caseComment: '', //案件质量评价
            scoreType: '', //1: 5分制 2: 百分制
            jsScore: '请打分', //得分
        }
    },
    mounted() {
        this.getPreviewPNG(); //获取案卷图片
        this.action(); //判断状态，获取不同的详情（已评估、未评估）
    },
    methods: {
        //获取案卷图片
        getPreviewPNG() {
            var that = this,
                ajax = new AJAX(),
                status = that.status,
                _data = {
                    tCaseId: that.caseId,
                    tOrgId: that.tOrgId
                };
            ajax.get(ajax.api.GETPREVIEWPNG, _data, function(data) {
                // console.log(data);
                that.pngList = data.data;
            });
        },
        //查看案卷
        showPnglist() {
            this.isShowPnglist = true;
        },
        //关闭案卷
        hidePngList() {
            this.isShowPnglist = false;
        },
        //计算得分
        score() {
            var that = this;
            var scoreList = [];
            var scoreNum = 0;
            // var scoreType = that.itemList[0].dicEvaluationMethod;
            // console.log(that.itemList);
            if (that.scoreType == '2') {
                //百分制
                for (let i = 0; i < that.itemList.length; i++) {
                    scoreList[i] = that.itemList[i].projectScore;
                }

                for (let i = 0; i < scoreList.length; i++) {
                    if (scoreList[i]) {
                        scoreNum += scoreList[i];
                    }
                }
            } else {
                // scoreNum = '合格';
                // console.log(that.itemList.length)
                for (let i = 0; i < that.itemList.length; i++) {
                    // console.log(111);
                    // console.log('----------' + that.itemList[i].projectName + '--------')
                    if (that.itemList[i].projectName == '总评估得分') {
                        // console.log(that.itemList[i]);
                        // var fs = ;
                        var fs = '请打分',
                            score = Number(that.itemList[i].projectScore);
                        if (score == 1 || score == 2) {
                            fs = '不合格';
                        } else if (score == 3) {
                            fs = '合格';
                        } else if (score == 4) {
                            fs = '良好';
                        } else if (score == 5) {
                            fs = '优秀';
                        }
                        scoreNum = fs;
                        break;
                    }
                }
            }
            // console.log(scoreNum);
            that.jsScore = scoreNum;
        },
        //是否已设置评估标准,true > getDetail()时传item_type
        action() {
            var that = this,
                ajax = new AJAX(),
                status = that.status;

            if (status == '1') {
                //待评估
                // console.log('待评估')
                that.isEdit = true;
                var _data = {
                    tOrgId: that.tOrgId,
                    caseId: that.caseId
                };
                //获取item_type字段   1、5分制   2、百分制
                ajax.get(ajax.api.ISEVALSTAND, _data, function(data) {
                    var resData = data.data;
                    // console.log(resData.isEvalStand);
                    //获取待评估详情
                    if (resData.isEvalStand) {
                        that.scoreType = resData.dicEvaluationMethod;
                        that.getDetail();
                    } else {
                        var ui = new UI();
                        ui.message({
                            message: '尚未设置评估标准',
                            type: 'error'
                        });
                        setTimeout(function() {
                            that.$router.push('/assessList');
                        }, 1000);
                    }
                });
            } else {
                //已评估
                //获取已评估详情
                that.getEvaluateDetail();
            }

        },
        //获取待评估详情
        getDetail() {
            // console.log('待评估')
            var that = this,
                ajax = new AJAX(),
                _data = {
                    tOrgId: that.tOrgId,
                    caseId: that.caseId,
                    item_type: that.scoreType
                };
            ajax.get(ajax.api.GETEVALUATEITEMS, _data, function(data) {
                // console.log(data);
                var resData = data.data;
                if (resData.length == 0) {
                    that.loading = false;
                    return false;
                }
                that.scoreType = resData[0].dicEvaluationMethod;
                for (let i = 0; i < resData.length; i++) {
                    var list = [];
                    resData[i].projectFractionList = [];
                    if (that.scoreType == '2' || resData[i].projectName == '总评估得分') {
                        for (let f = 1; f <= resData[i].projectFraction; f++) {
                            list.push({
                                value: f,
                                label: f + '分'
                            })
                        }
                    } else {
                        list = [{
                            value: 1,
                            label: '1分'
                        }, {
                            value: 2,
                            label: '2分'
                        }, {
                            value: 3,
                            label: '3分'
                        }, {
                            value: 4,
                            label: 'C'
                        }, {
                            value: 5,
                            label: 'N/A'
                        }];
                    }
                    resData[i].projectFractionList = list;
                }
                // console.log('=======================================');
                // console.log(resData);
                that.itemList = resData;
                that.loading = false;
            });
        },
        //获取已评估详情
        getEvaluateDetail() {
            // console.log('已评估')
            var that = this,
                ajax = new AJAX(),
                _data = {
                    case_id: that.caseId,
                    tOrgId: that.tOrgId
                };
            ajax.get(ajax.api.EVALUATEDETAIL, _data, function(data) {
                // console.log(data);
                var resData = data.data;

                for (let i = 0; i < resData.scoreList.length; i++) {
                    var list = [];
                    resData.scoreList[i].projectFractionList = [];
                    //评估标准 1、5分，2、百分
                    that.scoreType = resData.scoreList[0].dicEvaluationMethod;
                    for (let f = 1; f <= resData.scoreList[i].projectFraction; f++) {
                        // console.log(resData);
                        if (that.scoreType == '2' || resData.scoreList[i].projectName == '总评估得分') {
                            list.push({
                                value: f,
                                label: f + '分'
                            })
                        } else {
                            list = [{
                                value: 1,
                                label: '1分'
                            }, {
                                value: 2,
                                label: '2分'
                            }, {
                                value: 3,
                                label: '3分'
                            }, {
                                value: 4,
                                label: 'C'
                            }, {
                                value: 5,
                                label: 'N/A'
                            }];
                        }
                    }
                    resData.scoreList[i].projectFractionList = list;
                }
                that.itemList = resData.scoreList;
                that.caseComment = resData.appointList[0].evaluationQuality;
                that.appointId = resData.appointList[0].id;
                if (resData.evalutionState == '4') {
                    // console.log('已复评');
                    that.isEdit = false;
                } else {
                    that.isEdit = true;
                    // console.log('未复评');
                }
                that.loading = false;
                that.score();
            });
        },
        //提交评估
        subAssess() {
            var that = this,
                ajax = new AJAX(),
                _data = {
                    caseId: that.caseId,
                    orgId: that.tOrgId,
                    caseComment: that.caseComment,
                    scoreList: that.itemList,
                    jsonArr: 'scoreList'
                };
            var scoreList = that.itemList;
            for (let i = 0; i < scoreList.length; i++) {
                delete scoreList[i].projectFractionList;
            }

            _data.scoreList = scoreList;
            ajax.post(ajax.api.COMMITCONSULT, _data, function(data) {
                that.$router.push('/assessList');
            });
        },
        //修改评估
        editAssess() {
            var that = this,
                ajax = new AJAX(),
                _data = {
                    caseId: that.caseId,
                    orgId: that.tOrgId,
                    caseComment: that.caseComment,
                    scoreList: that.itemList,
                    appointId: that.appointId,
                    jsonArr: 'scoreList'
                };
            var scoreList = that.itemList;
            for (let i = 0; i < scoreList.length; i++) {
                delete scoreList[i].projectFractionList;
            }
            ajax.post(ajax.api.UPDATEEVALUATE, _data, function(data) {
                var ui = new UI();
                ui.message({
                    message: data.message,
                    type: 'success'
                });
                that.$router.push('/assessList');
            });
        }
    }
}
</script>
<style lang="less">
.assess {
    .pngList {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: #000;
        z-index: 2;
        height: 100%;
        width: 100%;
        .off {
            position: absolute;
            top: 5px;
            left: 10px;
            color: #fff;
            z-index: 3;
            font-size: 3rem;
            text-shadow: 1px 1px 2px #000;
        }
        .el-carousel__item {
            text-align: center;
            display: table;
            span {
                display: table-cell;
                vertical-align: middle;
                img {
                    display: inline-block;
                }
            }
            p {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                background: #000;
                line-height: 30px;
                color: #ccc;
                font-size: 1.4rem;
            }
        }
    }
    >p {
        background: #fff;
        button {
            width: 94%;
            margin: 10px 3%;
        }
    }
    .score {
        width: 90%;
        margin: 0 5%;
        line-height: 40px;
        font-size: 1.5rem;
        a {
            float: right;
            i {
                margin-right: 5px;
                font-size: 1.6rem;
            }
        }
    }
    .list {
        background: #fff;
        width: 100%;
        border-top: solid 1px #c7c7cc;
        dd {
            width: 90%;
            padding: 10px 5%;
            border-bottom: solid 1px #c7c7cc;
            position: relative;
            h5 {
                font-size: 1.6rem;
                display: block;
                line-height: 33px;
                margin-right: 100px;
            }
            >span {
                font-size: 1.4rem;
                color: #8c8c8c;
                display: inline-block;
                width: 100%;
                margin-top: 15px;
            }
            .el-select {
                position: absolute;
                width: 100px;
                top: 10px;
                right: 5%;
            }
            textarea {
                width: 98%;
                height: 180px;
                border: solid 1px #c7c7cc;
                border-radius: 5px;
                margin-top: 7px;
                line-height: 22px;
            }
        }
    }
}
</style>