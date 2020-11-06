const path = require('path');
const common = require('./webpack.common');
const {merge} = require('webpack-merge');
const { HotModuleReplacementPlugin } = require('webpack');

module.exports = merge(common, {
    mode: 'development',
    plugins: [
        new HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: path.resolve(__dirname, './dist'),
        open: true,
        compress: true,
        hot: true,
        port: 3000,
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        publicPath: ''
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader','css-loader'],
            },
        ]
    }
});