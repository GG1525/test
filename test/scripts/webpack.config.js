const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { VueLoaderPlugin } = require('vue-loader')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
// , new MiniCssExtractPlugin()
const CopyWebpackPlugin = require('copy-webpack-plugin')
const FileManagerWebpackPlugin = require("filemanager-webpack-plugin");
const BuildOriginTagsPlugin = require("./buildOriginTagsPlugin");


module.exports = {
  // entry: null
  output: {
    // path: path.resolve(__dirname, '../build/pack'),
    filename: '[name].js',
    environment: { arrowFunction: false },
    publicPath: 'auto'
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      '@': path.resolve('src'),
    }
  },
  externals: {
    vue: "Vue",
  },
  mode: "production",
  // devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude: /(node_modules|bower_components|libs)/,
        use: [{
          loader: 'vue-loader',
        }],
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /(node_modules|bower_components|libs)/,
        use: ["babel-loader"],
      },
      // module css/less
      {
        test:  /\.module\.(css|less)$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[local]-[hash:5]",
              },
            },
          },
          path.join(__dirname, "css-check-loader.js"),
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env'
                  ],
                ],
              }
            }
          },
          'less-loader'
        ],
      },
      // css/less
      {
        test: /^((?!\.module).)*\.(css|less)$/,
        exclude: /(node_modules|bower_components)/,
        use: [{
          loader: "style-loader",
          options: {
            attributes: {
              type: "text/css",
              f: "plugin"
            },
            // insert: function insertAtTop(element) {
              //   var parent = document.querySelector("head");
              //   // parent.appendChild(element);
              //   var lastInsertedElement =
              //     window._lastElementInsertedByStyleLoader;

              //   if (!lastInsertedElement) {
              //     parent.insertBefore(element, parent.lastChild);
              //   } else if (lastInsertedElement.nextSibling) {
              //     parent.insertBefore(element, lastInsertedElement.nextSibling);
              //   } else {
              //     parent.appendChild(element);
              //   }

              //   window._lastElementInsertedByStyleLoader = element;
              // },
          }
        }, 
        'css-loader', 
        path.join(__dirname, "css-check-loader.js"),
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                'postcss-preset-env'
              ],
            }
          }
        }, 'less-loader']
      },
      // 3rdlib css: ant-design
      {
        test: /\.less$/,
        exclude: /src/,
        include: /node_modules[\\/]antd/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
            },
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                // 这里更改antd主题配置： 详见配置在： https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
                modifyVars: {
                  'primary-color': '#417FF9',
                },
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2|webp|ico)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 1024, // 低于1k都base64
            name: "[name].[contenthash:6].[ext]",
            outputPath: 'images'
          }
        }]
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          ie8: true,
          ecma: 5
        }
      }),
    ],
  },
  plugins: [
    new CleanWebpackPlugin(), 
    new VueLoaderPlugin(), 
    new BuildOriginTagsPlugin(),
  ]
};
