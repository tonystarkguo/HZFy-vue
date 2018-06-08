var request = require('request');

function ApiUtil() {}


ApiUtil.prototype.packageData = function(req) {
    // console.log('***********************************')
    // req.headers['content-type'] = 'application/json;charset=UTF-8';
    // var packageData = global.CONFIG.DATA;
    // for (var key in packageData) {
    // if (req.method == 'GET') {
    //     if (!req.query.notKey) {
    //         delete req.query.notKey;
    //         if (req.url.indexOf('?') == -1) {
    //             req.url += '?' + key + '=' + req.query[key];
    //         } else {
    //             req.url += '&' + key + '=' + req.query[key];
    //         }
    //     }
    // } else {
    //     req.body[key] = packageData[key];
    // }
    // }
    // if (req.method == 'POST') {
    //     for (var key in packageData) {
    //         req.body[key] = packageData[key];
    //     }
    // }
    // var data = req.query;
    // console.log('----------组装后的参数------------');
    // console.log(data);
};

ApiUtil.prototype.serverUrl = function(req) {
    // console.log('-----------------------');
    // console.log('req.url:' + req.url);
    // console.log('req.query:' + JSON.stringify(req.query));
    // console.log('req.body:' + JSON.stringify(req.body));
    // console.log('req.method:' + JSON.stringify(req.method));
    // console.log('-----------------------');
    req.dataCont = {};
    var method = req.method;
    var url = req.url.split("/");

    if (method == "GET") {
        req.dataCont.data = { data: req.query };
    } else {
        req.dataCont.data = { data: req.body };
    }

    req.dataCont.method = method;

    var _url = global.CONFIG[url[1]];
    // console.log(global.CONFIG);
    for (var i = 2; i < url.length; i++) {
        _url += '/' + url[i];
    }
    req.dataCont.api = _url;
};



ApiUtil.prototype.request = function(req, resHandler) {
    /*
     * data：post参数
     * query：get参数
     * method：请求方式
     * api：请求地址
     */

    var url = req.dataCont.api;
    if (url.indexOf('notKey') != -1) {
        url = url.substring(0, url.indexOf('notKey') - 1);
    }
    if (req.dataCont.method == 'POST') {
        // console.log('post : ' + url);
        // var options = req.dataCont.data;
        // request.post(url, resHandler).form(options.data);

        var _data = req.dataCont.data.data;

        if (_data.jsonArr) {
            if (_data.jsonArr == 'resources') {
                var undertakeResources = JSON.parse(_data.undertakeResources),
                    resources = JSON.parse(_data.resources);
                for(var i=0;i<resources.length;i++){
                    resources[i].undertakeResources = undertakeResources[i];
                }
                _data.resources = resources;
                delete _data.undertakeResources;
            } else {
                _data[_data.jsonArr] = JSON.parse(_data[_data.jsonArr]);
            }
            delete _data.jsonArr;
        }
        // console.log('--------------------处理后--------------------------');
        // console.log(_data)

        var token = req.dataCont.data.data.token;
        var options = {
            url: url,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json;charset=UTF-8",
                "token": token
            },
            // body: req.dataCont.data.data
            body: _data
        }
        delete _data.token;
        delete _data.offLoading;
        // console.log("----------------------------[ 请求数据 ] : ----------------------------\n" + JSON.stringify(_data));
        // console.log('-------------resources---------------------');
        // console.log(_data.resources[0].undertakeResources[1]);
        request(options, resHandler);
    } else {
        // console.log('get : ' + url);
        request.get(url, resHandler);
    }
};

module.exports = ApiUtil;