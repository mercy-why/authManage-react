module.exports = {
  presets: [
    ["@babel/preset-env"],
    [
      "@babel/preset-react",
      {
        runtime: "automatic",
      },
    ],
  ],
  plugins: [
    ['react-refresh/babel'],
    [
      "@babel/plugin-transform-runtime",
      {
        regenerator: true,
      },
    ],
    [
      "import",
      {
        libraryName: "antd",
        libraryDirectory: "es",
        style: true, // `style: true` 会加载 less 文件
      },
    ],
    ["@babel/plugin-syntax-dynamic-import"],
  ],
};
