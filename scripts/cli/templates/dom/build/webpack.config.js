const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


const SRC_PATH = path.resolve(__dirname, '..');
const DIST_PATH = path.resolve(__dirname, '../dist');

module.exports = {
    mode: 'production',

    entry: {
        'index': `${SRC_PATH}/src/index.tsx`,
    },

    output: {
        path: DIST_PATH,
        filename: '[name].[hash:10].js',
        chunkFilename: 'bundle-[name].[chunkhash:10].js',
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
                test: /\.less$/,
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
                        loader: 'less-loader'
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
        new CleanWebpackPlugin(),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html',
            inject: true
        }),
    ],
}
