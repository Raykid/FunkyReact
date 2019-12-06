const path = require("path");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const { recurseDirFiles } = require("../../utils/TraverseUtil");

const SRC_PATH = path.resolve(__dirname, "../src");
const DIST_PATH = path.resolve(__dirname, "../dist");

module.exports = {
    mode: "production",

    entry: {
        "funky-react-core.min.umd": recurseDirFiles(SRC_PATH).filter(path=>{
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
                        loader: "ts-loader",
                        options: {
                            compilerOptions: {
                                declaration: false,
                            }
                        }
                    }
                ],
            },
        ],
    },

    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false
        }),
    ],
};