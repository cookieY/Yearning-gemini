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

};
