const  HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        vendor: './src/js/vendor.js',
        main: './src/js/app.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/template.html",
            minify: false
        }),
    ],
    module: {
        rules: [
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attributes: {
                            list: [
                              // All default supported tags and attributes
                              '...',
                              {
                                tag: 'section',
                                attribute: 'data-image-src',
                                type: 'src',
                              },
                              {
                                tag: 'link',
                                attribute: 'href',
                                type: 'src',
                              }
                            ],
                        }
                    }
                }
            },
            {
                test: /\.(svg|gif|png|eot|woff|woff2|jpg|ttf|ico)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192, // in bytes
                            name: '[name]_[contenthash].[ext]',
                            outputPath: 'assets'
                        }
                    }
                ]
            }
        ]
    }
}