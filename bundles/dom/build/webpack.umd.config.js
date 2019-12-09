const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const minConfig = require("./webpack.umd.min.config");

module.exports = {
    ...minConfig,

    mode: "development",
    devtool: "inline-source-map",

    entry: {
        "funky-react-dom.umd": minConfig.entry["funky-react-dom.min.umd"],
    },

    plugins: [
        ...minConfig.plugins,
        new CleanWebpackPlugin(),
    ],
};