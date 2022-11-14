const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = 
{
    entry:
    {
        index:
        [
            path.resolve('sources', 'frontend', 'pages', 'index', 'index.js')
        ],
        services:
        [
            path.resolve('sources', 'frontend', 'pages', 'services', 'services.js')
        ]
    },

    output:
    {
        filename: '[name]/bundle.js',
        path: path.resolve('_build'),
        publicPath: '/',
    },

    target: 'web',

    plugins:
    [           
        new CleanWebpackPlugin(),

        new htmlWebpackPlugin(
        {
            filename: 'index.html',
            template: path.resolve('sources', 'frontend', 'pages', 'index', 'index.html'),
            chunks: ['index']
        }),

        new htmlWebpackPlugin(
        {
            filename: 'services.html',
            template: path.resolve('sources', 'frontend', 'pages', 'services', 'services.html'),
            chunks: ['services']
        }),
    ],

    module:
    {
        rules:
        [
            {
                test: /\.(jpe?g|png|svg)$/,
                type: 'asset/resource'
            }
        ]
    },
}