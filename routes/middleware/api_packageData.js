/**
 * Created by BST on 2016/11/16.
 */
var ApiPackageData = require('../../util/apiUtil');
var apiPackageData = new ApiPackageData();
var api_packageData = function (req, res, next) {
    apiPackageData.packageData(req);
    next();
};
module.exports = api_packageData;
