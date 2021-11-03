const TerserPlugin = require('terser-webpack-plugin')
module.exports = {
    publicPath: '/front',
    assetsDir: './assets',
    css: {
        loaderOptions: { // 向 CSS 相关的 loader 传递选项
            less: {
                javascriptEnabled: true
            }
        }
    },
    runtimeCompiler: true,
    productionSourceMap: false,
    devServer: {
        proxy: 'http://localhost:8000'
    },
    configureWebpack: (config)=>{
        if(process.env.NODE_ENV === 'production'){
            config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
        }
    }
}
