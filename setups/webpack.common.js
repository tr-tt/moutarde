const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

module.exports = 
{
    entry:
    {
        index:
        [
            path.resolve('sources', 'frontend', 'pages', 'index', 'index.js')
        ],
        signin:
        [
            path.resolve('sources', 'frontend', 'pages', 'signin', 'signin.js')
        ],
        signup:
        [
            path.resolve('sources', 'frontend', 'pages', 'signup', 'signup.js')
        ],
        board:
        [
            path.resolve('sources', 'frontend', 'pages', 'board', 'board.js')
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
            filename: 'signin.html',
            template: path.resolve('sources', 'frontend', 'pages', 'signin', 'signin.html'),
            chunks: ['signin']
        }),

        new htmlWebpackPlugin(
        {
            filename: 'signup.html',
            template: path.resolve('sources', 'frontend', 'pages', 'signup', 'signup.html'),
            chunks: ['signup']
        }),

        new htmlWebpackPlugin(
        {
            filename: 'board.html',
            template: path.resolve('sources', 'frontend', 'pages', 'board', 'board.html'),
            chunks: ['board']
        }),
    ],

    module:
    {
        rules:
        [
            {
                test: /\.(jpe?g|png|svg|ttf)$/i,
                type: 'asset/resource'
            }
        ]
    },
}