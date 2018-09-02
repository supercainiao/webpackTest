const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackplugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ExtractPlugin = require('extract-text-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
//视频使用extract-text-webpack-plugin来提取CSS文件
//不过在webpack 4.x中则应该使用mini-css-extract-plugin来提取CSS到单独文件中
//https://blog.csdn.net/harsima/article/details/80819747

const config = {
    target: 'web',
    mode: 'development',
    entry: path.join(__dirname,'src/index.js'),
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname,'dist')
    },
    module: {
        rules:[
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ["style-loader","css-loader"]
            },
            // {
            //     test: /\.styl(us)?$/,
            //     use: [
            //         'style-loader',
            //         'css-loader',
            //         {
            //             loader: 'postcss-loader',
            //             options: {
            //                 sourceMap: true
            //             }
            //         },
            //         'stylus-loader'
            //     ]
            // },
            {
                test: /\.(gif|png|jpg|svg|JPG)$/,
                use: {
                    loader: "url-loader",
                    options:{
                        limit: 1024,
                        name: '[name].[ext]'
                    }
                }
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackplugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isDev ? '"development"' : '"production"'
            }
        })
    ]
}
//process.env.NODE_ENV
if(isDev) {
    config.devtool = '#cheap-module-eval-source-map'
    config.devServer = {
        port: 8080,
        host: '0.0.0.0',
        overlay: {
            errors: true,
        },
        hot:true
    }
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    )
}else {
    let extractLoader = {
        loader: MiniCssExtractPlugin.loader,
        options: {}
    }
    config.entry = {
        app: path.join(__dirname, 'src/index.js'),
        vendor:['vue']
    }
    config.output.filename = '[name].[chunkhash:8].js'
    config.module.rules.push( {
        test: /\.styl/,
        use: [
            extractLoader,
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true
                }
            },
            'stylus-loader'
        ]
        
    })
    config.optimization = {
        splitChunks: {
            chunks: 'async',// 必须三选一： "initial" | "all" | "async"(默认就是异步)
            // 大于30KB才单独分离成chunk
            minSize: 30000,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,// 最大初始化请求书，默认1
            name: true,
            cacheGroups: {//设置缓存的 chunks
                default: {
                    priority: -20,
                    reuseExistingChunk: true,
                },
                vendors: {
                    name: 'vendors',    // 要缓存的 分隔出来的 chunk 名称
                    test: /[\\/]node_modules[\\/]/, //正则规则验证 符合就提取 chunk
                    priority: -10,      // 缓存组优先级
                    chunks: "all"       // 必须三选一： "initial" | "all" | "async"(默认就是异步)
                },
                
                echarts: {
                    name: 'echarts',
                    chunks: 'all',
                    // 对echarts进行单独优化，优先级较高
                    priority: 20,
                    test: function(module){
                        var context = module.context;
                        return context && (context.indexOf('echarts') >= 0 || context.indexOf('zrender') >= 0)
                    }
                }
            }
        }
         //单独打包 runtimeChunk
         ,runtimeChunk:{name: "manifest"}
        // // 压缩代码
        // ,minimizer: [
        //     // js mini
        //     new UglifyJsPlugin({
        //       cache: true,
        //       parallel: true,
        //       sourceMap: false // set to true if you want JS source maps
        //     }),
        //     // css mini
        //     new OptimizeCSSPlugin({})
        // ]
    }
    config.plugins.push(
        // new ExtractPlugin('styles.[contentHash:8.css]'),
        new MiniCssExtractPlugin({
            //filename: "css/[name].[chunkhash:8].css"
            filename: "[name].[chunkhash:8].css"
        })
        // new webpack.optimization.splitChunks({
        //     name: 'vendor'
        // })
    )
}

module.exports = config;

//extract-text-webpack-plugin  用来打包时分离js的单独打包成静态资源文件