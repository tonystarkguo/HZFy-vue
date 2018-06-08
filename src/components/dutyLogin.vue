<template>
    <div class="main dutyLogin" v-loading="loading" v-loading.fullscreen.lock="loading">
        <!--  -->
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
            <el-form-item prop="orgValue">
                <el-select v-model="ruleForm.orgValue" placeholder="请选择值班机构">
                    <el-option v-for="item in ruleForm.orgList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="keys">
                <el-input v-model="ruleForm.keys" placeholder="请输入动态密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="login('ruleForm')">值班登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    name: 'dutyLogin',
    data() {
        return {
            ruleForm: {
                orgList: [],
                orgValue: '',
                keys: '',
            },
            rules: {
                orgValue: [
                    { required: true, message: '请选择值班机构', trigger: 'change' }
                ],
                keys: [
                    { required: true, message: '请输入动态密码', trigger: 'blur' },
                ],
            },
            loading: false, //true,
        }
    },
    mounted() {
        this.getOrgList();
    },
    methods: {
        getOrgList: function() {
            var that = this,
                ajax = new AJAX();
            ajax.get(ajax.api.ORGLIST, {}, function(data) {
                // console.log(data);
                that.ruleForm.orgList = data.data;
                that.loading = false;
            });
        },
        login(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var that = this,
                        ajax = new AJAX(),
                        _data = {
                            orgId: that.ruleForm.orgValue,
                            dynamicKey: that.ruleForm.keys
                        };
                    // that.dutyLogin = true;
                    ajax.get(ajax.api.DUTYLOGIN, _data, function(data) {
                        // console.log(data);
                        setLs('orgId', that.ruleForm.orgValue);
                        // that.dutyLogin = false;
                        that.$router.push('/index');
                    });
                } else {
                    // console.log('error submit!!');
                    return false;
                }
            });

        }
    }
}
</script>
<style lang="less">
.dutyLogin {
    background: #fff;
    padding-top: 15px;
    .el-form {
        width: 90%;
        margin: 0 5%;
        .el-form-item__content {
            width: 100%;
            background: #fff;
            .el-select {
                width: 100%;
            }
            button {
                width: 100%;
            }
        }
    }
}
</style>