const { merge } = require("webpack-merge");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const common = require("./webpack.common");
const proxy = require('./proxy');

const config = merge(common, {
  // 模式
  mode: "development",
  // 开发工具，开启 source map，编译调试
  devtool: "eval-cheap-module-source-map",
  // 开发模式，自动更新改动
  devServer: {
    port: 8080,
    compress: true, // gzip压缩
    open: true, // 自动打开默认浏览器
    hot: 'only', // 启用服务热替换配置
    client: {
      logging: "warn", // warn以上的信息，才会打印
      overlay: true, // 当出现编译错误或警告时，在浏览器中显示全屏覆盖
    },
    proxy
  },
  plugins: [
    new ReactRefreshWebpackPlugin(),
  ],
});

module.exports = config;
