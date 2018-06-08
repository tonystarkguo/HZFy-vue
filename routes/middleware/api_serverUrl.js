/**
 * Created by BST on 2016/11/16.
 */
var ApiServerUrl = require('../../util/apiUtil');
var apiServerUrl = new ApiServerUrl();
var api_serverUrl = function (req, res, next) {
    apiServerUrl.serverUrl(req);
    next();
};
module.exports = api_serverUrl;
