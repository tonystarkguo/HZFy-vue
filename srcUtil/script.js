var UI = function() {
    this.loading = function() {
        var _html = '<div class="loading"></div>';
        $('body').append(_html);
    }
    this.loadingHide = function() {
        setTimeout(function() {
            $('.loading').remove();
        }, 300)
    }
    this.message = function(obj) {
        var obj1 = {
            type: 'warning',
            message: '提示'
        }
        var data = $.extend(obj1, obj);
        var name = data.type + $('.' + data.type).length;
        var _html = '<div class="message ' + data.type + ' ' + name + '">' + data.message + '</div>';
        $('body').append(_html);
        var tip = $('.' + name);
        // tip.css({ 'margin-left': (tip.width() + 60) / 2 * -1 });
        tip.animate({ 'top': '15px' }, 200, function() {
            setTimeout(function() {
                tip.animate({ 'top': '-50px', 'opacity': '0' }, 300, function() {
                    tip.remove();
                });
            }, 3200);
        });
    }
}

//删除左右两端的空格
function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

function back() {
    window.history.back(-1);
};

function setLs(key, value) {
    localStorage[key] = JSON.stringify(value);
}

function getLs(key) {
    if (localStorage[key]) {
        return JSON.parse(localStorage[key]);
    } else {
        return false;
    }
}

function setCookie(key, val, time) {
    //time：分钟
    var date = new Date();
    date.setTime(date.getTime() + 1000 * 60 * time);
    document.cookie = key + '=' + val + ';expires=' + date.toGMTString();
    // console.log(document.cookie);
};

function getCookie(name) {
    var arr = document.cookie.replace(/\s+/g, "").split(";");
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        var key = arr[i].split('=')[0],
            val = arr[i].split('=')[1];
        obj[key] = val;
    }
    // console.log('------------------------')
    // console.log(obj)
    return obj[name];
};

function delCookie(name) {
    var date = new Date();
    date.setTime(date.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null) {
        document.cookie = name + "=" + cval + ";expires=" + date.toGMTString();
    }
};

function getQuery(name) {
    if (window.location.href.indexOf('?') != undefined) {
        var url = window.location.href.split('?');
        var query = url[1];
        var queryArr = [];
        if (query != undefined) {
            queryArr = query.split('&');
        }
        var queryObj = {};
        if (queryArr.length > 0) {
            for (var i = 0; i < queryArr.length; i++) {
                var pQuery = queryArr[i].split('=');
                var key = pQuery[0],
                    val = pQuery[1];
                queryObj[key] = val;
            }
            return queryObj[name];
        } else {
            return undefined;
        }
    } else {
        return undefined;
    }
};

function sdate(str) {
    var oDate = new Date(str),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth() + 1,
        oDay = oDate.getDate(),
        oHour = oDate.getHours(),
        oMin = oDate.getMinutes(),
        oSen = oDate.getSeconds(),
        oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSen); //最后拼接时间  
    return oTime;
};

//补0操作
function getzf(num) {
    if (parseInt(num) < 10) {
        num = '0' + num;
    }
    return num;
};

//登录失效
function overdue(isms) {
    var ui = new UI();
    var time = 5000;
    localStorage.removeItem('config'); //字典数据
    localStorage.removeItem('policy'); //阿里云配置参数
    localStorage.removeItem('userInfo'); //用户数据
    localStorage.removeItem('time'); //登录时间记录
    localStorage.removeItem('orgId'); //值班登录过的机构id
    delCookie('accessid'); //阿里云配置参数
    delCookie('endPoint'); //阿里云配置参数
    delCookie('priBucketName'); //阿里云配置参数

    if (isms) {
        ui.message({
            message: '登出成功',
            type: 'success'
        });
        time = 2000;
    } else {
        ui.message({
            message: '登录失效，请重新登录',
            type: 'error'
        });
    }
    setTimeout(function() {
        window.location.href = '/';
    }, time);
};

function errorCode(code) {
    var obj = {    
        "40047": "错误日期格式",
        "40046": "无权操作",
        "40045": "手机号已存在",
        "40044": "无效的code",
        "40043": "手机号不存在",
        "40042": "openid不存在",
        "40041": "案件状态已改变",
        "40040": "用户名已存在",
        "40039": "错误签名",
        "40000": "登录已过期",
        "101": "找不到数据",
        "20145": "操作失败",
        "40001": "无效的token",
        "40002": "无效的验证码",
        "40003": "错误的验证码",
        "40004": "短信发送失败",
        "40005": "同一机构同一天，一个人只能成功预约一次",
        "40007": "同一案件同一流程只能被一人接收",
        "40008": "竞价任务 已结束",
        "40009": "重复报价",
        "40010": "同一案件同一流程只能被一人签收(自己重复签收)",
        "40011": "同一案件同一流程只能被一人签收(已被他人签收)",
        "40012": "预约已满",
        "50020": "无效的验证码或手机号",
        "40014": "无效的验证码或证件号",
        "50021": "原密码错误",
        "50022": "已过截止时间",
        "40017": "已被别人接收",
        "40018": "没有评价信息",
        "40019": "重复评价",
        "40020": "无待处理数据",
        "40021": "请先完成审批卷与承办卷的编排!",
        "40033": "不合法的参数",
        "40034": "实名认证失败",
        "40035": "点员条件已过期",
        "40036": "未找到点员信息",
        "40037": "实名认证不通过",
        "40038": "账号错误",
        "40135": "错误请求",
        "40136": "禁止重复操作",
        "40140": "缺少数据",
        "41001": "缺少token参数",
        "50004": "远程ftp文件不存在",
        "50005": "此咨询已被别人签收",
        "-1001": "用户名或密码错误",
        "-1002": "用户不存在",
        "-1003": "用户未登录",
        "-1004": "账号已注册",
        "-1005": "网络异常 请稍后重试",
        "-3": "系统异常，请稍后再试",
        "-2": "系统异常，请稍后再试",
        "-1": "系统异常，请稍后再试",
        "40121": "无效参数，没有律师帐号信息",
        "40122": "没有律师基本信息",
        "40013": "无效参数，没有律师详细信息",
        "40015": "律师用户已经存在",
        "40016": "当前机构中已经存在此律师",
        "50017": "记录不存在",
        "50018": "记录已存在",
        "50019": "案件归档出错，请重试",
        "50024": "编排材料不能为空!",
        "50025": "请至少添加一个目录!",
        "50026": "本案件已被其他工作人员处理",
        "50027": "本案件已被其他工作人员处理",
        "50028": "本案件不可签收",
        "400050": "案号已存在",
        "60020": "禁止操作",
        "60021": "未指派完成，禁止操作",
        "20145": "删除操作失败",
        "50031": "工作站已存在",
        "400060": "律所已存在",
        "50032": "不能删除主承办人",
        "50033": "不能添加已有的承办人",
        "50034": "不能更换成已有的承办人",
        "50035": "请选择要删除的承办人",
    }
    return obj[code];
}