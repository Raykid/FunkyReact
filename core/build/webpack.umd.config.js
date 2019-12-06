const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const minConfig = require("./webpack.umd.min.config");

module.exports = {
    ...minConfig,

    mode: "development",
    devtool: "inline-source-map",

    entry: {
        "funky-react-core.umd": minConfig.entry["funky-react-core.min.umd"],
    },

    plugins: [
        ...minConfig.plugins,
        new CleanWebpackPlugin(),
    ],
};