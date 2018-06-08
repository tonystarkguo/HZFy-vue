/**
 * Created by yangmzh on 2016/11/14.
 */
var AJAX = function() {
    var get = function(url, data, success, that, error) {
        ajax(url, "GET", data, success, that, error);
    };
    var post = function(url, data, success, that, error) {
        ajax(url, "POST", data, success, that, error);
    };
    var ajax = function(url, type, data, success, that, error) {
        var ui = new UI();

        if (!data.isToken) {
            var time = parseInt(getLs('time'));
            var nowTime = new Date() / 1;
            var difference = parseInt(nowTime - time) / 1000 / 60 / 60; //小时
            if (difference > 8) {
                overdue();
                return false;
            }
        }

        var _error = error ? error : function(e) {
            if (error) {
                error(e)
            } else {
                ui.message({
                    message: '系统错误，请求失败。',
                    type: 'error'
                });
            }
        };

        if (!data.isToken) {
            var userInfo = getLs('userInfo');
            data.token = userInfo.token;
            delete data.isToken;
        }

        var jsonArr = data.jsonArr;

        if (jsonArr && data[jsonArr] != '') {
            if (jsonArr == 'resources') {
                var resources = data.resources;
                var undertakeResources = [];
                for (var i = 0; i < resources.length; i++) {
                    undertakeResources[i] = resources[i].undertakeResources;
                    delete resources[i].undertakeResources;
                }
                data.resources = JSON.stringify(resources);
                data.undertakeResources = JSON.stringify(undertakeResources);

            } else {
                data[jsonArr] = JSON.stringify(data[jsonArr]);
            }
        }

        var offLoading = data.offLoading;


        $.ajax({
            url: url,
            type: type,
            data: data,
            // dataType: 'application/json;charset=UTF-8',
            traditional: true,
            success: function(data) {
                // console.log(data.code);
                if (data.code == '1') {
                    // console.log('请求成功');
                    success(data);
                } else {
                    if (data.code == '40001' || data.code == '41001') {
                        // console.log('登录失效');
                        // console.log(data);
                        overdue();
                    } else {
                        // console.log('请求失败');
                        // console.log(data);
                        var messageTxt = errorCode(data.code);
                        ui.message({
                            message: messageTxt,
                            type: 'error'
                        });
                        if (offLoading) {
                            success(data);
                        }
                    }
                }
            },
            error: _error,
            dataType: 'json'
        });
    };
    var API_URL = "API_URL";
    var api = {
        CONFIG: '/hpApi/' + API_URL + '/proxy-api/hp-pc-api/hp/zhejiang/pc/config/getAllConfig', //字典

        CAPTCHA: '/hpApi/' + API_URL + '/proxy-api/hp-pc-api/hp/zhejiang/pc/login/captcha', //获取验证码
        LOGIN: '/hpApi/' + API_URL + '/proxy-api/hp-pc-api/hp/zhejiang/pc/login', //登录

        ORGLIST: '/hpApi/' + API_URL + '/proxy-api/hp-pc-api/hp/zhejiang/pc/consult/getBelongMeOrgList', //机构列表
        DUTYLOGIN: '/hpApi/' + API_URL + '/proxy-api/hp-pc-api/hp/zhejiang/pc/consult/validateOrgDynamicKey', //值班登录

        GETINFO: '/hpApi/' + API_URL + '/proxy-api/hp-pc-api/hp/zhejiang/pc/user/hp_info', //个人信息
        GETLAWFIRM: '/hpApi/' + API_URL + '/proxy-api/hp-pc-api/hp/zhejiang/pc/user/getLawfirm', //师所模糊查询

        MESSAGELIST: '/hpApi/' + API_URL + '/proxy-api/hp-pc-api/hp/zhejiang/pc/consult/consultList', //网上留言咨询-列表
        GETCONSULBYID: '/hpApi/' + API_URL + '/proxy-api/hp-pc-api/hp/zhejiang/pc/consult/getConsultById', // 网上留言-详情
        SIGN: '/hpApi/' + API_URL + '/proxy-api/hp-pc-api/hp/zhejiang/pc/consult/signForConsult', //签收
        CASEREASON: '/hpApi/' + API_URL + '/proxy-api/hp-pc-api/hp/zhejiang/pc/case/detail/getCaseReason', //案由查询
        CHARGEBACK: '/hpApi/' + API_URL + '/proxy-api/hp-pc-api/hp/zhejiang/pc/consult/chargeback', //退单
        SUBCONSULT: '/hpApi/' + API_URL + '/proxy-api/hp-pc-api/hp/zhejiang/pc/consult/saveOrCommitConsult', //提交回复

        OSSPOLICY: '/hpApi/' + API_URL + '/proxy-api/hp-pc-api/hp/zhejiang/pc/oss/getPolicy', //阿里云授权
        GETOSSURL: '/hpApi/' + API_URL + '/proxy-api/hp-pc-api/hp/zhejiang/pc/oss/getUrl', //获取oss文件url

        CASELIST: '/hpApi/' + API_URL + '/proxy-api/hp-pc-api/hp/zhejiang/pc/hpCaseUndertakeWeb/getCaseList', //我的案件-列表
        UNDERTAKECASERESULT: '/hpApi/' + API_URL + '/proxy-api/hp-pc-api/hp/zhejiang/pc/hpCaseUndertakeWeb/getUndertakeCaseResult', //案件承办
        CASEDETAIL: '/hpApi/' + API_URL + '/proxy-api/hp-pc-api/hp/zhejiang/pc/hpCaseUndertakeWeb/getCaseDetail', //我的案件-详情-受援人信息
        MATERIALDOCS: '/hpApi/' + API_URL + '/proxy-api/hp-pc-api/hp/zhejiang/pc/hpCaseMaterial/getMaterialDocs', //我的案件-详情-文书材料列表
        UPDATEFILESTORAGEMES: '/hpApi/' + API_URL + '/proxy-api/hp-pc-api/hp/zhejiang/pc/hpCaseMaterial/exportDoc/updatefileStorageMes', //我的案件-详情-文书材料列表-更新文书图片列表
        CASEPROGRESSLOG: '/hpApi/' + API_URL + '/proxy-api/hp-pc-api/hp/zhejiang/pc/hpCaseUndertakeWeb/getCaseProgressLog', //我的案件-详情-事项日志
        COMMITCASE: '/hpApi/' + API_URL + '/proxy-api/hp-pc-api/hp/zhejiang/pc/hpCaseUndertakeWeb/commitCase', //我的案件-详情-提交承办
        SAVECASE: '/hpApi/' + API_URL + '/proxy-api/hp-pc-api/hp/zhejiang/pc/hpCaseUndertakeWeb/saveCase', //我的案件-详情-保存承办

        ASSESMENTLIST: '/hpApi/' + API_URL + '/proxy-api/hp-pc-api/hp/zhejiang/pc/assesment/assesmentList', //质量评估-列表
        // ISEVALSTAND: '/hpApi/' + API_URL + '/proxy-api/hp-pc-api/hp/zhejiang/pc/org/isEvalStand', //待评估-获取item_type。 查询评估标准
        ISEVALSTAND: '/hpApi/' + API_URL + '/proxy-api/hp-pc-api/hp/zhejiang/pc/case/score/isHistoryEvalStand', //待评估-获取item_type。 查询评估标准
        GETEVALUATEITEMS: '/hpApi/' + API_URL + '/proxy-api/hp-pc-api/hp/zhejiang/pc/case/score/getHistoryEvaluateItems', //待评估-详情
        EVALUATEDETAIL: '/hpApi/' + API_URL + '/proxy-api/hp-pc-api/hp/zhejiang/pc/case/score/evaluateDetail', //已评估-详情
        GETPREVIEWPNG: '/hpApi/' + API_URL + '/proxy-api/hp-pc-api/hp/zhejiang/pc/case/archive/getPreviewPNG', //获取预览卷宗的图片
        COMMITCONSULT: '/hpApi/' + API_URL + '/proxy-api/hp-pc-api/hp/zhejiang/pc/case/score/commitEvaluate', //质量评估-提交评估
        UPDATEEVALUATE: '/hpApi/' + API_URL + '/proxy-api/hp-pc-api/hp/zhejiang/pc/case/score/updateEvaluate', //案件评估-提交修改
    }

    return {
        get: get,
        post: post,
        api: api
    }
};