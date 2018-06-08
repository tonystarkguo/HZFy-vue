var express = require('express');
var path = require('path');
var app = express();

var argv = process.argv[2] || 'dev';
global.CONFIG = require(path.join(__dirname, 'config/config.' + argv + '.js'));
console.log('当前环境:' + global.CONFIG.ENV);
console.log('http://localhost:' + global.CONFIG.PORT);

// 路由
var routes = require('./routes/index');
// 接口
var api = require('./routes/api');
var api_serverUrl = require('./routes/middleware/api_serverUrl');
var api_packageData = require('./routes/middleware/api_packageData');
var api_callback = require('./routes/middleware/api_callback');

// body-parser是和node接口交互时，接收前端传来的参数
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));

// 加载一个模版引擎
var ejs = require('ejs');

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('.html', ejs.__express);

//指定引用文件目录
app.use(express.static(path.join(__dirname, 'views')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//指定路由文件
app.use('/', routes);
app.use('/h5/api', api);
app.use('/hpApi', api_packageData);
app.use('/hpApi', api_serverUrl);
app.use('/hpApi', api_callback);

var port = global.CONFIG.PORT || 3000;
app.listen(port);