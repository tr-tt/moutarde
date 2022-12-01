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
        posts:
        [
            path.resolve('sources', 'frontend', 'pages', 'posts', 'posts.js')
        ],
        users_edit:
        [
            path.resolve('sources', 'frontend', 'pages', 'users_edit', 'users_edit.js')
        ],
        password_forgot:
        [
            path.resolve('sources', 'frontend', 'pages', 'password_forgot', 'password_forgot.js')
        ],
        password_reset:
        [
            path.resolve('sources', 'frontend', 'pages', 'password_reset', 'password_reset.js')
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
            filename: 'posts.html',
            template: path.resolve('sources', 'frontend', 'pages', 'posts', 'posts.html'),
            chunks: ['posts']
        }),

        new htmlWebpackPlugin(
        {
            filename: 'users_edit.html',
            template: path.resolve('sources', 'frontend', 'pages', 'users_edit', 'users_edit.html'),
            chunks: ['users_edit']
        }),

        new htmlWebpackPlugin(
        {
            filename: 'password_forgot.html',
            template: path.resolve('sources', 'frontend', 'pages', 'password_forgot', 'password_forgot.html'),
            chunks: ['password_forgot']
        }),
    
        new htmlWebpackPlugin(
        {
            filename: 'password_reset.html',
            template: path.resolve('sources', 'frontend', 'pages', 'password_reset', 'password_reset.html'),
            chunks: ['password_reset']
        })
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