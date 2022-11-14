const path = require('path')
const { merge } = require('webpack-merge')
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
            services:
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
                            options: {sourceMap: true},
                        }
                    ],
                }
            ]
        }
    }
)