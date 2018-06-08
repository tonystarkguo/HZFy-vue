<template>
    <div class="main userInfo">
        <div class="edit" v-if="edit">
            <el-form :model="userInfo" :rules="rules" ref="userInfo" label-width="100px" class="userInfoForm" size="small">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="userInfo.name" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="dicGender">
                    <el-radio-group v-model="userInfo.dicGender">
                        <el-radio label="1">男</el-radio>
                        <el-radio label="2">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="工作单位" prop="workUnit">
                    <el-input v-model="userInfo.workUnit" clearable placeholder="请输入工作单位" class="workUnit"></el-input>
                    <ul class="workUnitList"></ul>
                </el-form-item>
                <el-form-item label="证件类型" prop="dicCardType">
                    <el-input v-model="dicCardTypeTxt" placeholder="证件类型" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="证件号码" prop="cardCode">
                    <el-input v-model="userInfo.cardCode" placeholder="请输入证件号码" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="mobile">
                    <el-input v-model="userInfo.mobile" placeholder="请输入手机号码"></el-input>
                </el-form-item>
                <el-form-item label="资格证号" prop="qualcode">
                    <el-input v-model="userInfo.qualcode" placeholder="请输入资格证号"></el-input>
                </el-form-item>
                <el-form-item label="执业证号" prop="lawyerCard">
                    <el-input v-model="userInfo.lawyerCard" placeholder="请输入执业证号"></el-input>
                </el-form-item>
                <el-form-item label="法律援助人员类型" prop="dicLawyerType" class="ta">
                    <el-select v-model="userInfo.dicLawyerType" placeholder="请选择">
                        <el-option v-for="item in dicLawyerTypeList" :key="item.code" :label="item.name" :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="获得荣誉" prop="gloryMemo" class="ta">
                    <el-input type="textarea" :rows="4" placeholder="请输入获得荣誉" v-model="userInfo.gloryMemo"></el-input>
                </el-form-item>
                <el-form-item label="是否获得行政获纪律处分" prop="punishmentDetail" class="ta">
                    <el-input type="textarea" :rows="4" placeholder="请输入是否获得行政获纪律处分" v-model="userInfo.punishmentDetail"></el-input>
                </el-form-item>
                <el-form-item class="btn">
                    <el-button type="primary" @click="submit('userInfo')">保存</el-button>
                </el-form-item>
                <el-form-item class="btn">
                    <el-button @click="cancel('userInfo')">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="list" v-else>
            <div class="header">
                <div class="img"><img :src="userInfo.headPic" /></div>
                <div class="name">{{userInfo.name}}</div>
                <div class="company">{{userInfo.workUnit}}</div>
            </div>
            <div class="infoList">
                <el-row>
                    <el-col :span="10">性别</el-col>
                    <el-col :span="14">{{userInfo.dicGenderName}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">证件类型</el-col>
                    <el-col :span="14">{{dicCardTypeTxt}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">证件号码</el-col>
                    <el-col :span="14">{{userInfo.cardCode}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">手机号码</el-col>
                    <el-col :span="14">{{userInfo.mobile}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">资格证号</el-col>
                    <el-col :span="14">{{userInfo.qualcode}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">执业证号</el-col>
                    <el-col :span="14">{{userInfo.lawyerCard}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">法律援助人员类型</el-col>
                    <el-col :span="14">{{userInfo.dicLawyerTypeName}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">获得荣誉</el-col>
                    <el-col :span="14">{{userInfo.gloryMemo}}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">是否获得行政获纪律处分</el-col>
                    <el-col :span="14">{{userInfo.punishmentDetail}}</el-col>
                </el-row>
            </div>
            <p>
                <el-button @click="editInfo('userInfo')" type="primary">编辑</el-button>
            </p>
        </div>
    </div>
</template>
<script>
export default {
    name: 'userInfo',
    data() {
        return {
            edit: false,
            userInfo: {
                name: '姓名', //姓名
                dicGender: '性别', //性别
                workUnit: '工作单位', //工作单位
                dicCardType: '证件类型', //证件类型
                cardCode: '证件号码', //证件号码
                mobile: '手机号码', //手机号码
                qualcode: '资格证号', //资格证号
                lawyerCard: '执业证号', //执业证号
                dicLawyerType: '法律援助人员类型', //法律援助人员类型
                gloryMemo: '获得荣誉', //获得荣誉
                punishmentDetail: '是否获得行政获纪律处分' //是否获得行政获纪律处分
            },
            WorkUnitList: [], //工作单位列表
            selectedWorkUnit: {}, //选中的律所
            ifShow: true, //判断是否为点击li
            dicCardTypeTxt: '', //证件类型显示文字
            dicLawyerTypeList: [],
            rules: {
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                dicGender: [
                    { required: true, message: '请选择性别', trigger: 'change' }
                ],
                dicCardType: [
                    { required: true, message: '请选择选择证件类型', trigger: 'change' }
                ],
                cardCode: [
                    { required: true, message: '请输入证件号码', trigger: 'blur' }
                ],
                lawyerCard: [
                    { required: true, message: '请输入执业证号', trigger: 'blur' }
                ],
                dicLawyerType: [
                    { required: true, message: '请选择法律援助人员类型', trigger: 'change' }
                ],
            }
        }
    },
    mounted() {
        this.getInfo();
        var that = this;
    },
    methods: {
        getInfo: function() {
            var _data = {};
            var ajax = new AJAX();
            var that = this;
            ajax.get(ajax.api.GETINFO, _data, function(data) {
                // console.log(data);
                var resData = data.data;
                that.userInfo = resData;
                // console.log(that.userInfo);
                that.selectedWorkUnit.lawfirmId = data.data.lawfirmId;
                that.selectedWorkUnit.workUnit = data.data.workUnit;
                that.getOption();
                // console.log(that.dicLawyerTypeList)
                // for(let i=0;i<that.dicLawyerTypeList){
                //     if(that.userInfo. == that.dicLawyerTypeList[i].code){

                //     }
                // }
            });
        },
        getWorkUnitList: function() {
            var ajax = new AJAX();
            var that = this;
            var _val = $('.workUnit .el-input__inner').val();
            that.userInfo.WorkUnit = _val;
            var _data = {
                name: _val,
                pageNum: 1,
                pageSize: 20
            };
            // console.log(_val);
            ajax.get(ajax.api.GETLAWFIRM, _data, function(data) {
                // console.log(data);
                var _list = data.data.list
                var _html = '';
                if (_list.length == 0) {
                    _html += '<li dataId="null">';
                    _html += '暂无数据';
                    _html += '</li>';
                } else {
                    for (let i = 0; i < _list.length; i++) {
                        _html += '<li dataId="' + _list[i].id + '">';
                        _html += _list[i].name;
                        _html += '</li>';
                    }
                }
                $('.workUnitList').html(_html);
                if (that.ifShow) {
                    $('.workUnitList').show();
                } else {
                    that.ifShow = true;
                }
            });
        },
        getOption: function() {
            var that = this;
            var dicCardType = getLs('config').dictData.dic_credentials_type;
            var dicLawyerType = getLs('config').dictData.dic_lawyer_type;
            that.dicLawyerTypeList = dicLawyerType;
            for (let i = 0; i < dicCardType.length; i++) {
                var code = dicCardType[i].code;
                if (code == that.userInfo.dicCardType) {
                    that.dicCardTypeTxt = dicCardType[i].name;
                    break;
                }
            }
        },
        editInfo: function() {
            var that = this;
            var ajax = new AJAX();
            this.edit = true;
            $(document).on('click', '.workUnitList li', function() {
                that.ifShow = false;
                var name = $(this).text(),
                    id = $(this).attr('dataid');
                if (id != 'null') {
                    that.selectedWorkUnit = {
                        lawfirmId: id,
                        workUnit: name
                    };
                    $('.workUnitList').hide();
                }
                var workUnit = that.selectedWorkUnit.workUnit;
                that.userInfo.workUnit = workUnit;
                $('.workUnitList').hide();
            });
            $(document).bind('input propertychange', '.workUnit input', function() {
                that.getWorkUnitList();
            });
        },
        submit: function(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var ajax = new AJAX();
                    var that = this;
                    var userInfo = that.userInfo;
                    var _data = {
                        name: userInfo.name,
                        dicGender: userInfo.dicGender,
                        dicCardType: userInfo.dicCardType,
                        cardCode: userInfo.cardCode,
                        gloryMemo: userInfo.gloryMemo,
                        dicLawyerType: userInfo.dicLawyerType,
                        lawfirmId: userInfo.lawfirmId,
                        qualcode: userInfo.qualcode,
                        mobile: userInfo.mobile,
                        lawyerCard: userInfo.lawyerCard,
                        punishmentDetail: userInfo.punishmentDetail
                    };
                    ajax.post(ajax.api.GETINFO, _data, function(data) {
                        // console.log(data);
                        that.edit = false;
                    });
                } else {
                    // console.log('error submit!!');
                    return false;
                }
            });
        },
        cancel(formName) {
            this.$refs[formName].resetFields();
            this.edit = false;
        },
    }
}
</script>
<style lang="less">
.userInfo {
    .list {
        width: 100%;
        .header {
            width: 100%;
            height: 200px;
            background: url(../images/userInfo_bg.jpg) no-repeat;
            background-size: 100% 100%;
            text-align: center;
            .img {
                background: #fff;
                border-radius: 35px;
                width: 70px;
                height: 70px;
                overflow: hidden;
                display: inline-block;
                margin: 10% 0 3% 0;
                img {
                    width: 100%;
                    height: 100%;
                    display: inline-block;
                }
            }
            .name {
                color: #fff;
                font-size: 1.6rem;
            }
            .company {
                color: #bbb;
                margin-top: 7px;
            }
        }
        .infoList {
            width: 90%;
            background: #fff;
            padding: 0 5%;
            border-bottom: solid 1px #ebeef5;
            .el-row {
                padding: 5px 10px;
                line-height: 30px;
                border-bottom: solid 1px #ebeef5;
                .el-col-10 {
                    text-align: right;
                    padding-right: 15px;
                }
            }
            .el-row:last-child {
                border: none;
            }
        }
        p {
            padding: 10px 0;
            button {
                width: 90%;
                margin: 0 5%;
            }
        }
    }
    .edit {
        width: 100%;
        .workUnitList {
            display: none;
            padding: 6px 0;
            margin: 0;
            box-sizing: border-box;
            overflow: scroll;
            border: 1px solid #e4e7ed;
            border-radius: 4px;
            background-color: #fff;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
            box-sizing: border-box;
            position: absolute;
            width: 100%;
            top: 40px;
            z-index: 1;
            max-height: 220px;
            li {
                font-size: 14px;
                padding: 0 20px;
                position: relative;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                color: #606266;
                height: 34px;
                line-height: 34px;
                box-sizing: border-box;
                cursor: pointer;
            }
        }
        .userInfoForm {
            padding: 15px 0;
            background: #fff;
            .el-form-item {
                margin-bottom: 15px;
                padding: 5px 0;
                .el-form-item__content {
                    margin-right: 8%;
                    .el-select {
                        width: 100%;
                    }
                }
            }
            .el-form-item.ta {
                label {
                    width: 90%!important;
                    text-align: left;
                    margin: 0 8%;
                }
                .el-form-item__content {
                    margin: 0 8%!important;
                }
            }
            .btn {
                border: none;
                .el-form-item__content {
                    margin: 0 8%!important;
                    button {
                        width: 100%;
                        height: 40px;
                        font-size: 1.4rem;
                    }
                }
            }
        }
    }
}
</style>