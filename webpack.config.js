/**
 * Created by liljay on 2016/4/13.
 */
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ROOT_PATH = path.resolve(__dirname);
var BUILD_PATH = path.resolve(ROOT_PATH, 'build');
var APP_PATH = path.resolve(ROOT_PATH, 'src');
var APP_COMPONENT = path.resolve(ROOT_PATH, 'src/components');
var NODE_MODULES =  path.resolve(ROOT_PATH, '/node_modules');

module.exports = {
    devtool: 'eval-source-map',
    resolve: {
        root: [ APP_PATH, NODE_MODULES],
        alias: {},
        extensions: ['', '.js', 'jsx', '.css', '.scss', '.ejs', '.png', '.jpg']
    },
    entry: {
        'activity': path.resolve(APP_COMPONENT, 'activity')
    },
    output: {
        path: BUILD_PATH,
        filename: '[name].[hash].js',
        chunkFilename:  '[chunkhash:8].chunk.min.js'
    },
    jshint: {
        "esnext": true
    },
    module: {
        preLoaders:[
            {
                test: /\.jsx?$/,
                include: APP_PATH,
                loaders: ['jshint-loader']
            }
        ],
        loaders: [
            {
                test: /\.(css|less)$/,
                loaders: ['style', 'css', 'less']
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    //'image-webpack?{bypassOnDebug: true, progressive:true, optimizationLevel: 3, pngquant:{quality: "65-80"}}',
                    'url?limit=10000&name=img/[hash:8].[name].[ext]',
                ]
            },
            {
                test: /\.jsx?$/,
                loader: 'babel',
                include:  APP_PATH,
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,
        proxy: {
            '/api/*': {
                target: 'http://localhost:5000',
                secure: false
            }
        }
    },
    plugins:[
        new webpack.optimize.UglifyJsPlugin({minimize: true}),
/*        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),*/
/*        new CommonsChunkPlugin({
            name: 'vendors', // 将公共模块提取，生成名为`vendors`的chunk
            chunks: chunks,
            minChunks: chunks.length // 提取所有entry共同依赖的模块
        })*/
/*        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            inject: 'body',
            chunks: ['model2', 'vendors']
        })*/
//provide $, jQuery and window.jQuery to every script
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            inject: 'body',
            chunks: ['activity']
        })
    ]
};