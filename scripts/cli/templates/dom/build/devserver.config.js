'use strict';
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const utils = require('./utils');
const merge = require('webpack-merge');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

module.exports = async () => {
    let location = await utils.intervalPort('localhost', 8080);

    const serverConfig = {
        mode: 'development',
        devtool: 'source-map',
        output: {
            publicPath: '',
        },
        devServer: {
            historyApiFallback: true,
            hot: true,
            disableHostCheck: true,
            host: "0.0.0.0",
            port: location.port,
            open: false,
            overlay: {
                warnings: false,
                errors: true,
            },
            proxy: {'/api': 'http://t1.6tiantian.com'},
            publicPath: '/',
            quiet: true,
            watchOptions: {
                poll: false,
            },
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                    messages: [`请访问: http://${ location.host }:${ location.port }`],
                },
            }),
        ],
    };
    return merge(webpackConfig, serverConfig);
};