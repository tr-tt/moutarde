const path = require('path')
const {merge} = require('webpack-merge')
const webpack = require('webpack')

const commonConfiguration = require('./webpack.common.js')

module.exports = merge(
    commonConfiguration,
    {
        mode: 'development',

        entry:
        {
            index:
            [
                path.resolve('sources', 'frontend', 'scripts', 'header.js')
            ],
            signin:
            [
                path.resolve('sources', 'frontend', 'scripts', 'header.js')
            ],
            signup:
            [
                path.resolve('sources', 'frontend', 'scripts', 'header.js')
            ],
            posts:
            [
                path.resolve('sources', 'frontend', 'scripts', 'header.js')
            ],
            posts_new:
            [
                path.resolve('sources', 'frontend', 'scripts', 'header.js')
            ],
            posts_edit:
            [
                path.resolve('sources', 'frontend', 'scripts', 'header.js')
            ],
            users_edit:
            [
                path.resolve('sources', 'frontend', 'scripts', 'header.js')
            ],
            password_forgot:
            [
                path.resolve('sources', 'frontend', 'scripts', 'header.js')
            ],
            password_reset:
            [
                path.resolve('sources', 'frontend', 'scripts', 'header.js')
            ],
            contact:
            [
                path.resolve('sources', 'frontend', 'scripts', 'header.js')
            ],
            chart:
            [
                path.resolve('sources', 'frontend', 'scripts', 'header.js')
            ]
        },

        devtool: 'inline-source-map',

        plugins:
        [           
            new webpack.HotModuleReplacementPlugin()
        ],

        module:
        {
            rules:
            [
                {
                    test: /\.css$/,
                    use:
                    [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options:
                            {
                                sourceMap: true,
                                modules: false,
                                url: false
                            },
                        }
                    ],
                }
            ]
        }
    }
)