<template>
    <div class="main messageDetails" v-loading="loading">
        <el-carousel class="pngList" indicator-position="none" :initial-index="pngListIndex" arrow="always" height="100%" :autoplay="false" v-if="isShowPnglist">
            <div class="off" @click="hidePngList"><i class="el-icon-back"></i></div>
            <el-carousel-item v-for="item,index in detail.files" :key="index">
                <span><img :src="item.addrUrl"></span>
                <p>第{{index+1}}张，共{{detail.files.length}}张</p>
            </el-carousel-item>
        </el-carousel>
        <el-form :disabled='!isEdit'>
            <h5 class="consultNumber">{{detail.consultNumber}}</h5>
            <div class="caseReason" v-show="caseReasonShow">
                <el-input placeholder="输入关键字进行过滤" v-model="caseReasonText"></el-input>
                <div class="caseReasonSelected">
                    <div class="notCaseReason">请选择案件类别</div>
                </div>
                <el-tree class="filter-tree" :data="caseReasonList" :filter-node-method="filterNode" ref="tree" accordion @node-click="treeClick" :props="defaultProps"></el-tree>
                <p class="caseReasonSub">
                    <el-button type="primary" @click="caseReasonShow=false">返回</el-button>
                </p>
            </div>
            <dl>
                <dd><span>咨询人姓名：</span><b>{{detail.name}}</b></dd>
                <dd><span>咨询时间：</span><b>{{detail.createTime}}</b></dd>
                <dd><span>联系电话：</span><b>{{detail.mobile}}</b></dd>
                <dd><span>咨询人性别：</span><b>{{detail.dicGender}}</b><i class="more" v-if="!more" @click="moreDtail()">更多</i></dd>
                <dd v-show="more"><span>证件类型：</span><b>{{detail.dicCardType}}</b></dd>
                <dd v-show="more"><span>证件号码：</span><b>{{detail.cardCode }}</b></dd>
                <dd v-show="more"><span>出生日期：</span><b>{{detail.birthdate}}</b></dd>
                <dd v-show="more"><span>国家和地区：</span><b>{{detail.dicNationalityValue}}</b></dd>
                <dd v-show="more"><span>民族：</span><b>{{detail.dicNation}}</b></dd>
                <dd v-show="more"><span>户籍地：</span><b>{{detail.regis}}</b></dd>
                <dd v-show="more"><span>通讯地址：</span><b>{{detail.legalInstAddr}}</b></dd>
                <dd v-show="more"><span>文化程度：</span><b>{{detail.dicEduLevelValue}}</b></dd>
                <dd v-show="more"><span>咨询人类别：</span><b>{{detail.dicConsultantCategoryValue}}</b><i class="fold" @click="foldDtail()">收起</i></dd>
            </dl>
            <dl>
                <dd><span>咨询标题：</span><b>{{detail.consultTitle}}</b></dd>
                <dd><span>咨询内容：</span><b>{{detail.consultContent}}</b></dd>
            </dl>
            <p>附件</p>
            <div class="fileList">
                <ul class="clearfix">
                    <li v-for="item,index in detail.files" :key="index" @click="showPnglist(index)">
                        <span><img :src="item.addrUrl" /></span>
                        <b>{{item.name}}</b>
                    </li>
                    <li class="notFiles">没有附件</li>
                </ul>
            </div>
            <!-- 待签收 -->
            <div v-if="status=='1'">
                <el-button type="primary" @click="sign()">签收</el-button>
            </div>
            <!-- 待回复 -->
            <div v-if="status=='2'">
                <dl class="list">
                    <dt @click="reasonShow">
                        <span>案由<i class="red">*</i></span>
                        <b>选择<i class="el-icon-arrow-right"></i></b>
                    </dt>
                    <dt>
                        <span>答复意见<i class="red">*</i></span>
                        <el-input type="textarea" :rows="4" placeholder="请输入答复意见" v-model="detail.answerSuggestion"> </el-input>
                    </dt>
                    <dt>
                        <span>处理方式<i class="red">*</i></span>
                        <el-select v-model="dicTreatmentModeValue" placeholder="请选择处理方式" size="small">
                            <el-option v-for="item in dicTreatmentModeList" :key="item.code" :value="item.code" :label="item.name">
                            </el-option>
                        </el-select>
                    </dt>
                </dl>
                <p>
                    <el-button @click="chargeback()">退单</el-button>
                    <el-button type="primary" @click="subAnswer()">提交回复</el-button>
                </p>
            </div>
            <!-- 已回复 -->
            <div class="status3" v-if="status=='3'">
                <el-row>
                    <el-col :span="8"><span>案由</span></el-col>
                    <el-col :span="16">
                        <b v-for="item in detail.caseReasons">{{item.reasonName}}<i>、</i></b>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8"><span>答复意见</span></el-col>
                    <el-col :span="16">{{detail.answerSuggestion}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="8"><span>处理方式</span></el-col>
                    <el-col :span="16">{{detail.dicTreatmentModeValue}}</el-col>
                </el-row>
            </div>
        </el-form>
    </div>
</template>
<script>
export default {
    name: 'message',
    data() {
        return {
            isShowPnglist: false,
            pngListIndex: 1,
            tcUrl: '',
            more: false, //是否显示更多个人信息
            caseReasonShow: false, //显示案由选择页面
            loading: true,
            id: this.$route.params.id,
            userInfo: getLs('userInfo'),
            isEdit: false, //是否可以编辑
            status: '', //1：待签收，2：待回复，3：已回复
            detail: {},
            caseReasonText: '',
            caseReasonList: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            caseReasonArr: [],
            dicTreatmentModeValue: '',
            dicTreatmentModeList: [],
        }
    },
    watch: {
        // 查询tree
        caseReasonText(val) {
            this.$refs.tree.filter(val);
        }
    },
    mounted() {
        this.getDtail();
        this.getCaseReason();
    },
    methods: {
        //查看图片
        showPnglist(index) {
            this.pngListIndex = index;
            this.isShowPnglist = true;
        },
        //关闭图片
        hidePngList() {
            this.isShowPnglist = false;
        },
        //获取详情
        getDtail: function() {
            var that = this,
                ajax = new AJAX(),
                _data = {
                    id: that.id
                };
            ajax.get(ajax.api.GETCONSULBYID, _data, function(data) {
                // console.log(data.data.sign.signGlobalId);
                // console.log(that.userInfo.tGlobalId)

                var detailData = data.data;
                var caseGlobalId = detailData.sign.signGlobalId;
                var userGlobalId = that.userInfo.tGlobalId;


                //证件类型
                var dictData = getLs('config').dictData
                var dicCardType = dictData.dic_credentials_type;
                for (let i = 0; i < dicCardType.length; i++) {
                    var code = dicCardType[i].code;
                    if (code == detailData.dicCardType) {
                        detailData.dicCardType = dicCardType[i].name;
                        break;
                    }
                }

                //民族
                var ethnic = detailData.dicNation;
                for (let i = 0; i < dictData.dic_ethnic_group.length; i++) {
                    if (ethnic == dictData.dic_ethnic_group[i].code) {
                        detailData.dicNation = dictData.dic_ethnic_group[i].name;
                        break;
                    }
                }

                //性别
                detailData.dicGender = detailData.dicGender == '1' ? '男' : '女';

                //处理方式
                that.dicTreatmentModeList = dictData.dic_consult_treatment_mode;

                //案件状态
                var sign = detailData.sign,
                    is = detailData.isSubmit,
                    tgid = that.userInfo.tGlobalId;
                // console.log(sign.dicStatus, is, sign.signGlobalId, tgid)
                if (sign.dicStatus == '1') {
                    // _d[i].status = '待签收'
                    that.status = '1';
                } else if (sign.dicStatus == '2' && is == false && sign.signGlobalId == tgid) {
                    // _d[i].status = '待回复'
                    that.status = '2';
                } else if (sign.dicStatus == '2' && is == true && sign.signGlobalId == tgid) {
                    // _d[i].status = '已回复'
                    that.status = '3';
                } else if (sign.dicStatus == '2' && is == false && sign.signGlobalId != tgid) {
                    // _d[i].status = '待回复'
                    that.status = '2';
                } else if (sign.dicStatus == '2' && is == true && sign.signGlobalId != tgid) {
                    // _d[i].status = '已回复'
                    that.status = '3';
                }

                //时间
                detailData.createTime = sdate(detailData.createTime);

                // 判断不可编辑
                if (caseGlobalId == userGlobalId || that.status == '1') {
                    that.isEdit = true;
                } else {
                    that.isEdit = false;
                }

                that.detail = detailData;
                // console.log('123123123123');
                // console.log(detailData);

                //附件样式
                var _width = detailData.files.length * 60;
                $('.fileList ul').width(_width);
                if (detailData.files.length == 0) {
                    $('.notFiles').show();
                }

                // alert(that.status);
            });
        },
        //获取案由
        getCaseReason: function() {
            var that = this,
                ajax = new AJAX();
            ajax.get(ajax.api.CASEREASON, {}, function(data) {
                // console.log(data);
                that.caseReasonList = data.data;
                that.loading = false;
                $(document).on('click', '.caseReasonSelected span', function() {
                    $(this).remove();
                    that.getCaseReasonArr();
                    // console.log(that.caseReasonArr.length);
                    if (that.caseReasonArr.length == 0) {
                        $('.notCaseReason').show();
                    }
                });
            });
        },
        //显示案由
        reasonShow() {
            if (this.isEdit) {
                this.caseReasonShow = true;
            }
        },
        //更多
        moreDtail: function() {
            this.more = true;
        },
        //收起
        foldDtail: function() {
            this.more = false;
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        //点击tree
        treeClick(data) {
            // console.log(data);
            var that = this;
            var selectedSpan = $('.caseReasonSelected span[key="' + data.key + '"]');
            if (selectedSpan.length == 0 && data.isChild) {
                var _html = '';
                _html += '<span key="' + data.key + '">';
                _html += data.label;
                _html += '<i class="el-icon-close"></i>';
                _html += '</span>';
                $('.notCaseReason').hide();
                $('.caseReasonSelected').append(_html);
                that.getCaseReasonArr();
            }
        },
        //set案由数组
        getCaseReasonArr: function() {
            var arr = [];
            $('.caseReasonSelected span').each(function() {
                // arr.push({ id: $(this).attr('key') });
                arr.push({ reasonName: $(this).text(), id: $(this).attr('key') });
            });
            // console.log(arr);
            // this.caseReasonArr = arr;
            this.detail.caseReasons = arr;
        },
        //签收
        sign: function() {
            var that = this,
                ajax = new AJAX(),
                _data = {
                    id: that.id
                };
            ajax.post(ajax.api.SIGN, _data, function(data) {
                // console.log(data);
                that.status = '2';
            });
        },
        //退单
        chargeback: function() {
            var that = this,
                ajax = new AJAX(),
                _data = {
                    id: that.detail.sign.id,
                    tConsultId: that.id
                };
            ajax.post(ajax.api.CHARGEBACK, _data, function(data) {
                // console.log(data);
                that.status = '1';
            });
        },
        //提交回复
        subAnswer: function() {
            var that = this,
                ajax = new AJAX(),
                ui = new UI(),
                _data = {};
            _data.id = that.id;
            _data.answerSuggestion = that.detail.answerSuggestion;
            _data.caseReasons = that.detail.caseReasons;
            _data.dicTreatmentMode = that.dicTreatmentModeValue;
            _data.isSubmit = true;
            _data.jsonArr = 'caseReasons';
            // console.log(_data);
            if (_data.caseReasons.length == 0 || _data.caseReasons == null) {
                ui.message({
                    message: '请选择案由',
                    type: 'error'
                });
                return false;
            } else if (_data.answerSuggestion == null || _data.answerSuggestion == '') {
                ui.message({
                    message: '请输入答复意见',
                    type: 'error'
                });
                return false;
            } else if (_data.dicTreatmentMode == '' || _data.dicTreatmentMode == null) {
                ui.message({
                    message: '请选择处理方式',
                    type: 'error'
                });
                return false;
            }
            // _data.caseReasons = JSON.stringify(_data.caseReasons);
            console.log(_data);
            // that.status = '3';
            ajax.post(ajax.api.SUBCONSULT, _data, function(data) {
                // console.log(data);
                that.getDtail();
                // that.status = '3';
                // console.log(that.detail.caseReasons)
            });
        },
    }
}
</script>
<style lang="less">
.messageDetails {
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
        button {
            width: 36px;
            margin: 0;
        }
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
    .tc {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 9999;
        background: #000;
        text-align: center;
        img {
            width: 100%;
        }
        button {
            margin: 15px 0;
        }
    }
    .consultNumber {
        text-align: center;
        line-height: 40px;
        font-size: 1.6rem
    }
    .caseReason {
        position: fixed;
        left: 0;
        top: 0;
        background: #f7f7f7;
        bottom: 0;
        right: 0;
        z-index: 1;
        .el-input input {
            border: none;
            border-bottom: solid 1px #EBEEF5;
            border-radius: 0;
        }
        .el-tree {
            line-height: 35px;
            position: absolute;
            top: 240px;
            left: 0;
            bottom: 50px;
            overflow: auto;
            right: 0;
            border-top: solid 1px #EBEEF5;
            border-bottom: solid 1px #EBEEF5;
            .el-tree-node__content {
                height: 35px;
            }
        }
        .caseReasonSub {
            position: absolute;
            bottom: 0;
            left: 0;
            button {
                width: 100%;
                margin-bottom: 5px;
                margin-left: 0;
            }
        }
        .caseReasonSelected {
            width: 100%;
            position: absolute;
            top: 40px;
            height: 200px;
            left: 0;
            overflow: auto;
            .notCaseReason {
                text-align: center;
                line-height: 50px;
                color: #C0C4CC;
                font-size: 1.6rem;
            }
            span {
                display: inline-block;
                line-height: 30px;
                border-radius: 15px;
                background: #409eff;
                color: #fff;
                padding: 0 8px 0 10px;
                margin: 8px 0 0 8px;
                i {
                    margin-left: 5px;
                }
            }
        }
    }
    dl {
        width: 100%;
        background: #fff;
        margin-bottom: 10px;
        border-bottom: solid 1px #c7c7cc;
        border-top: solid 1px #c7c7cc;
        padding: 10px 0;
        dd {
            width: 95%;
            margin-right: 5%;
            position: relative;
            line-height: 30px;
            span {
                color: #8c8c8c;
                display: inline-block;
                width: 35%;
                text-align: right;
                vertical-align: top;
            }
            b {
                display: inline-block;
                font-weight: normal;
                width: 65%;
            }
            .more,
            .fold {
                position: absolute;
                right: 0;
                color: #007aff;
            }
            .fold {
                bottom: -10px;
            }
        }
    }
    dl.list {
        padding: 0;
        dt {
            width: 90%;
            margin: 0 5%;
            position: relative;
            line-height: 45px;
            font-size: 1.4rem;
            border-bottom: solid 1px #c7c7cc;
            text-indent: 4px;
            .red {
                font-weight: bold;
            }
            b {
                float: right;
                display: inline-block;
                color: #8c8c8c;
                i {
                    font-size: 2rem;
                    position: relative;
                    top: 2px;
                }
            }
        }
        dt:last-child {
            border: none;
        }
        .el-select {
            width: 200px;
            float: right;
            input {
                border: none;
                text-align: right;
                padding-right: 38px;
            }
        }
        .el-textarea {
            margin-bottom: 15px;
        }
    }
    p {
        padding: 0 5%;
        line-height: 30px;
        color: #8c8c8c;
        width: 90%;
        button {
            width: 40%;
            margin: 0 5% 10px 5%;
        }
    }
    button {
        width: 90%;
        margin: 0 5% 10px 5%;
    }
    .fileList {
        overflow: auto;
        ul {
            background: #fff;
            border-top: solid 1px #c7c7cc;
            border-bottom: solid 1px #c7c7cc;
            padding: 10px 0;
            display: inline-block;
            margin-bottom: 10px;
            min-width: 100%;
            li {
                float: left;
                width: 60px;
                text-align: center;
                margin: 0 5px;
                span {
                    width: 100%;
                    display: inline-block;
                    img {
                        width: 60%;
                        height: 50px;
                    }
                }
                b {
                    color: #007aff;
                    display: inline-block;
                    width: 100%;
                    font-size: 1.2rem;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
            .notFiles {
                display: block;
                float: left;
                text-align: center;
                width: 100%;
                margin: 0;
                display: none;
            }
        }
    }
    .status3 {
        width: 100%;
        background: #fff;
        border-top: solid 1px #c7c7cc;
        padding: 10px 0;
        .el-row {
            padding: 0 5%;
            border-bottom: 1px solid #ebeef5;
            line-height: 40px;
        }
        .el-row:last-child {
            border: none;
        }
        span {
            color: #8c8c8c;
        }
        b:last-child i {
            display: none;
        }
        .el-col-16 {
            word-break: break-all;
        }
    }
}
</style>