const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackBar = require("webpackbar");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const theme = require("./theme");
const paths = require("./paths");
const ctx = {
  isEnvDevelopment: process.env.NODE_ENV === "development",
  isEnvProduction: process.env.NODE_ENV === "production",
};
const webpack = require("webpack");

const { isEnvDevelopment, isEnvProduction } = ctx;

const getCssLoaders = () => {
  const cssLoaders = [
    // 开发模式使用style-loader，生产模式MiniCssExtractPlugin.loader
    isEnvDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
    {
      loader: "css-loader",
      options: {
        sourceMap: isEnvDevelopment,
        modules: {
          localIdentName: "[local]--[hash:base64:5]",
          auto: true,
          exportLocalsConvention: "dashesOnly",
        },
        importLoaders: 1,
        esModule: false,
      },
    },
  ];

  // 加css前缀的loader配置
  const postcssLoader = {
    loader: "postcss-loader",
    options: {
      postcssOptions: {
        plugins: [
          isEnvProduction && [
            "postcss-preset-env",
            {
              autoprefixer: {
                grid: true,
              },
            },
          ],
        ],
      },
    },
  };

  // 生产模式时，才需要加css前缀
  isEnvProduction && cssLoaders.push(postcssLoader);

  return cssLoaders;
};

const getAntdLessLoaders = () => [
  isEnvDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
  {
    loader: "css-loader",
    options: {
      sourceMap: isEnvDevelopment,
    },
  },
  {
    loader: "less-loader",
    options: {
      sourceMap: isEnvDevelopment,
      lessOptions: {
        // antd 自定义主题
        modifyVars: theme,
        javascriptEnabled: true,
      },
    },
  },
];
module.exports = {
  // 入口
  entry: {
    index: "./src/index.js",
  },
  // 输出
  output: {
    // 仅在生产环境添加 hash
    filename: isEnvProduction
      ? "[name].[contenthash].bundle.js"
      : "[name].bundle.js",
    path: paths.appDist,
    // 编译前清除目录
    clean: true,
    // publicPath: ctx.isEnvProduction ? 'https://xxx.com' : '', 关闭该 CDN 配置，因为示例项目，无 CDN 服务。
  },
  resolve: {
    alias: {
      "@": paths.appSrc,
    },
    extensions: [".jsx", ".js"],
    modules: ["node_modules", paths.appSrc],
  },
  plugins: [
    // 生成html，自动引入所有bundle
    new HtmlWebpackPlugin({
      title: "demo",
      template: paths.appHtml,
    }),
    // 进度条
    new WebpackBar(),
    new webpack.DefinePlugin({
      BASE_URL: isEnvDevelopment ? JSON.stringify("/api") : JSON.stringify("/api"),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(bmp|svg|gif|jpe?g|png)$/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024,
          },
        },
        generator: {
          filename: "img/[name].[hash:4][ext]",
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "font/[name].[hash:3][ext]",
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: getCssLoaders(),
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          ...getCssLoaders(),
          {
            loader: "less-loader",
            options: {
              sourceMap: isEnvDevelopment,
            },
          },
        ],
      },
      {
        test: /\.less$/,
        exclude: paths.appSrc,
        use: getAntdLessLoaders(),
      },
      {
        test: /\.(jsx?)$/,
        include: paths.appSrc,
        loader: "babel-loader",
        options: {
          cacheDirectory: true,
        }, // 缓存公共文件
      },
    ],
  },
  cache: {
    type: "filesystem", // 使用文件缓存
  },
};
