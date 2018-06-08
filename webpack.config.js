var path = require('path');
var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, 'src/main.js'),
    output: {
        path: path.resolve(__dirname, 'views'), //编译完成后输出文件路径
        filename: 'js/[name].bundle.js' //编译完成后的文件名称，可带路径js/ 如果没有js文件夹自动创建js文件夹
    },
    //解析
    resolve: {
        // 自动解析确定的扩展。默认值为：extensions: [".js", ".json"] 
        // 能够使用户在引入模块时不带扩展：import File from '../path/to/file'
        extensions: [" ", ".js", ".json", ".vue"],
        /*
         * 引用vue.js的时候可以直接以Vue代替vue/dist/vue.js,例：
         * alias: { index: 'src/app/index.js' }
         * 定义好解析后，使用：
         * import Index from 'index'
         * 等同于
         * import Index from '../index.js'
         * 可以加上 $ 精准匹配，例：
         * -----定义解析----
         * alias: { index$: 'src/app/index.js' }
         * -----引用文件----
         * import Index from 'index'  > 成功，index.js被解析后和导入
         * import Index from 'index/index.js'  > 错误，src/app/index.js/index.js 是无效的
         * 如下:
         * 'Vue': 'vue/dist/vue.js'
         * 指向 ./node_modules/vue/dist/vue.js
         */
        alias: {
            'vue': 'vue/dist/vue.js',
            'style': path.resolve(__dirname, 'src/css/style.less')
        },
    },
    module: {
        loaders: [{
            test: /\.vue$/,
            loader: 'vue-loader'
        }, {
            test: /\.js$/,
            loader: 'babel-loader?presets=env',
            exclude: /node_modules/
        }, {
            test: /\.less$/,
            //loader: ExtractTextPlugin.extract(['css-loader', 'postcss-loader', 'less-loader']) 
            loader: 'style-loader!css-loader!postcss-loader!less-loader'
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader!postcss-loader'
        }, {
            test: /\.(png|jpg|gif|svg)$/i,
            loaders: [
                'url-loader?limit=50&name=images/[name].[ext]',
                //'image-webpack-loader?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
            ]
            //loader: 'url-loader?limit=50&name=images/[name].[ext]!image-webpack-loader?bypassOnDebug'
        }, {
            test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
            loader: 'file-loader'
        }],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, 'src/index.html'),
            inject: 'head',
            minify: { //压缩HTML文件
                removeComments: true, //移除HTML中的注释
                collapseWhitespace: false //删除空白符与换行符
            }
        })
    ]
}