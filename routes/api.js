var express = require('express');
var router = express.Router();
var request = require('request');
var path = require('path');
var fs = require('fs');

var multer = require('multer');
var upload = multer({
    dest: './tmp',
});

var co = require('co');
var OSS = require('ali-oss');

var getDate = function() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + month + strDate;
    return currentdate;
};

var kg = 0;

router.all('/upLoad', upload.single('file'), function(req, res, next) {
    var file = req.file;
    var body = req.body;
    var policy = JSON.parse(body.policy);

    // 文件类型
    var temp = file.originalname.split('.');
    var fileType = temp[temp.length - 1];
    var lastName = '.' + fileType;

    // 构建文件名
    var fileName = './tmp/' + file.originalname;

    // 文件路径
    var filePath = file.path;

    // console.log('路径：' + filePath);
    // console.log('重命名：' + fileName);
    var clientData = {
        region: global.CONFIG.OSS_DATA.region,
        accessKeyId: policy.accessid,
        accessKeySecret: global.CONFIG.OSS_DATA.accessKeySecret,
        endPoint: policy.endPoint,
        bucket: policy.priBucketName,
    }
    // console.log(clientData);

    var client = new OSS(clientData);

    fs.rename(filePath, fileName, function(err) {
        if (err) {
            res.send({ status: '102', msg: '文件写入失败' });
        } else {
            var localFile = fileName;
            var key = fileName.split('/')[fileName.split('/').length - 1];
            var url = 'orm/' + getDate() + '/' + new Date().getTime() + '_' + key;

            // console.log('上传后的文件路径:' + localFile);
            // console.log('上传后的name:' + key);
            // console.log('要上传oss的路径:' + url);
            // console.log('===================file======================>');
            co(function*() {
                var result = yield client.put(url, localFile);
                console.log('成功：');
                var resp = {
                    fileName: key,
                    fileUrl: url,
                }
                if (body.id) {
                    resp.id = body.id
                } else {
                    resp.name = body.name
                }
                res.send(resp);
                fs.unlinkSync(localFile);
            }).catch(function(err) {
                console.log('错误：');
                console.log(err);
                res.send(err);
                fs.unlinkSync(localFile);
            });
        }
    });
});

module.exports = router;