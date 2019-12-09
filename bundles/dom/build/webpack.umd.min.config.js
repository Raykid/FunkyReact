const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const { recurseDirFiles } = require("../../../utils/TraverseUtil");

const SRC_PATH = path.resolve(__dirname, "../src");
const DIST_PATH = path.resolve(__dirname, "../dist");

module.exports = {
    mode: "production",

    entry: {
        "funky-react-dom.min.umd": recurseDirFiles(SRC_PATH).filter(path=>{
            return !/d\.ts$/.test(path);
        }),
    },

    output: {
        path: DIST_PATH,
        filename: "[name].js",
    },

    resolve: {
        extensions: [".ts", ".js", ".tsx", ".jsx"],
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
        ],
    },

    plugins: [
        new CopyWebpackPlugin([{
            from: path.resolve(SRC_PATH, "**/*.scss"),
            to: DIST_PATH,
            context: "src",
        }]),
        new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false
        }),
    ],
};