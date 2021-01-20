const ph = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    mode: 'development',
    devServer:{ // 配置实时打包

        host:"127.0.0.1",// 主机域名地址 修改代码后不需要打包就可以在浏览器看到效果
        port:"11111", // 端口号
        open:true, //自动打开浏览器
        compress:true // 对网络请求进行压缩 

    },
    entry: ph.resolve('./src/index.js'), // 入口文件 绝对路径 
    output: {
        path: ph.resolve('./dist'), // 配置出口目录
        filename: "main.js" // 配置出口文件名称
    },
    plugins:[ // 编译模板 不需要再模板中手动引入js文件了
        new HtmlWebpackPlugin({
            template:ph.resolve("./public/index.html")
        })
    ],
    devtool:'source-map', // 调试时可以快速找到源码
    /* resolve:{ // 更改模块查找方式,优先查找source文件夹，再查找noddmodules
        modules:[ph.resolve(__dirname,'source'),path.resolve('node_modules')]
    } */
}