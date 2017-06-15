const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    context: __dirname,
    entry: [
        './scripts/client.jsx'
    ],
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js',
        publicPath: '/build/'
    },
    resolve: {
        alias: {
            'material-ui': path.resolve('./node_modules/material-ui')
        },
        extensions: ['', '.scss', '.css', '.js', '.json', '.jsx'],
        modulesDirectories: [
            'node_modules',
            path.resolve(__dirname, 'node_modules')
        ]
    },
    module: {
        loaders: [
            {
                test: /(\.js|\.jsx)$/,
                exclude: /(node_modules)/,
                loader: 'babel',
                query: {presets: ['es2015', 'stage-0', 'react']}
            },
            {
                test: /(\.scss|\.css)$/,
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass')
            }
        ]
    },
    postcss: [autoprefixer],
    sassLoader: {
        data: '@import "theme/_config.scss";',
        includePaths: [path.resolve(__dirname, '/')]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false
            },
            compress: {
                warnings: false
            }
        }),
        new ExtractTextPlugin('bundle.css', {allChunks: true}),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.bundle.js',
            minChunks: Infinity
        }),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            // 'process.env.NODE_ENV': JSON.stringify('development')
            devtool: false
        })
    ],
    devServer: {
        hot: true,
        proxy: {
            '/api/indicator': {
                target: 'https://52.32.36.132:50000',
                secure: false
            },
            '/api/data_message': {
                target: 'https://52.32.36.132:50000',
                secure: false
            },
            '/api/data_comments': {
                target: 'https://52.32.36.132:50000',
                secure: false
            },
            '/api/*': {
                target: 'https://52.32.36.132',
                secure: false
            },
            '/dhis-web-commons/*': {
                target: 'https://52.32.36.132',
                secure: false
            }
        }
    }
};
