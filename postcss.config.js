module.exports = {
    plugins: {
        //设置postcss需要用到的插件
        'autoprefixer': {
            broswers: ['last 5 versions']
        }
    }
}

/*
postcss配置文件，引用autoprefixer模块，
autoprefixer设置参数，broswer兼容哪些浏览器
*/