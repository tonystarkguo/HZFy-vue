/**
 * Created by BST on 2016/11/16.
 */
var ApiServerRequest = require('../../util/apiUtil');
var apiServerRequest = new ApiServerRequest();
var api_callback = function(req, res, next) {
    var responseHandler = function(error, response, body) {
        // console.log("----------------------------[ 接口响应 ] : ----------------------------\n" + JSON.stringify(body));
        res.send(body);
    };
    apiServerRequest.request(req, responseHandler);
};
module.exports = api_callback;