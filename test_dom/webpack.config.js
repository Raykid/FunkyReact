const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


const SRC_PATH = path.resolve(__dirname, '');
const DIST_PATH = path.resolve(__dirname, '');

exports.default = {
    entry: {
        'app': `${SRC_PATH}/src/index.tsx`,
    },

    output: {
        path: DIST_PATH,
        filename: 'index.js',
    },

    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.jsx'],
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            compilerOptions: {
                                declaration: false
                            }
                        }
                    }
                ],
            },
            {
                test: /\.html?$/,
                loader: 'html-loader',
                options: {
                    attrs: ['img:src', 'link:href'],
                    removeComments: true
                }
            },
            {
                test: /\.s?css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: [
                                require('autoprefixer')(),
                                require('cssnano')(),
                            ],
                        }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    name: 'assets/[name]-[hash:10].[ext]',
                    limit: 81920,
                },
            }
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html',
            inject: true
        }),
    ],

    devtool: 'inline-source-map',

}
