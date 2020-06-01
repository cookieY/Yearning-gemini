// const CompressionPlugin = require("compression-webpack-plugin")
module.exports = {
    // assetsDir: './assets',
    css: {
        loaderOptions: { // 向 CSS 相关的 loader 传递选项
            less: {
                javascriptEnabled: true
            }
        }
    },
    runtimeCompiler: true,
    // chainWebpack: config => {
    //     config.module.rule('images')
    //         .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
    //         .use('image-webpack-loader')
    //         .loader('image-webpack-loader')
    //         .options({bypassOnDebug: true});
    //     config.plugin('compressionPlugin')
    //         .use(new CompressionPlugin({
    //             test: /\.js$|\.html$|.\css/, // 匹配文件名
    //             threshold: 10240, // 对超过10k的数据压缩
    //             deleteOriginalAssets: false // 不删除源文件
    //         }))
    // },
    devServer: {
        // 设置主机地址
        host: "127.0.0.1",
        // 设置默认端口
        port: 8080,
        // 设置代理
        proxy: {
            "/": {
                // 目标 API 地址
                target: "http://127.0.0.1:8000",
                // 将主机标头的原点更改为目标URL
                changeOrigin: false
            }
        }
    }

};
