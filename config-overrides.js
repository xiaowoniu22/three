/* config-overrides.js */

const webpack = require("webpack");
const HtmlPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
module.exports = function override(config, env) {
    // 参数中的 config 就是默认的 webpack config

    // 对 config 进行任意修改
    config.mode = 'development';
    // 一定要把新的 config 返回
    return {
        ...config,
        plugins: [
            ...config.plugins,
            new HtmlPlugin({
                template: "index.html",
            }),
            new CopyWebpackPlugin({
                patterns: [
                    { from: "node_modules/cesium/Build/Cesium/Workers", to: "Workers" },
                    // { from: "node_modules/cesium/Build/Cesium/ThirdParty", to: "ThirdParty" },
                    // { from: "node_modules/cesium/Build/Cesium/Assets", to: "Assets" },
                    // { from: "node_modules/cesium/Build/Cesium/Widgets", to: "Widgets" },
                ],
            }),
            new webpack.DefinePlugin({
                CESIUM_BASE_URL: JSON.stringify(""),
            }),
        ]
    };
}