/**
 * 接入新二开 打包
 */

const fs = require("fs-extra");
const path = require("path");
const consola = require("consola");
const globby = require("globby");

const ENTRY_TEMPLY = `// @ts-ignore
!window._babelPolyfill && require('babel-polyfill')
require('currentscript')
import init from "@/$name"
window.__ECIS_PLUGINS = window.__ECIS_PLUGINS || []
window.__ECIS_PLUGINS.push({init, meta: $meta})`;
const ecisBuildConfig = require('./webpack.config');
const { default: merge } = require("webpack-merge");
const { webpack } = require("webpack");
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
var HtmlWebpackTagsPlugin = require("html-webpack-tags-plugin");
const FileManagerWebpackPlugin = require("filemanager-webpack-plugin");
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers');
const inquirer = require("inquirer");
const argv = yargs(hideBin(process.argv)).argv
const isDevelopment = argv.mode && argv.mode === 'dev'
const isBuildCaExt = !isDevelopment && !!argv.ca
console.log(`【isDevelopment is ${isDevelopment}】`)
console.log(`isBuildCaExt is ${isBuildCaExt}】`)

const cwd = path.join(__dirname, "../src");

// 生成entry
function createEntry(meta, ...paths) {
  let entryFile = path.join(__dirname, "./entry", ...paths, "index.ts");
  if (fs.existsSync(entryFile)) {
    fs.unlinkSync(entryFile);
  }

  // 生成文件
  // 判断entry文件夹是否存在
  const filePath = path.parse(entryFile);
  fs.ensureDirSync(filePath.dir);
  fs.writeFileSync(
    entryFile,
    ENTRY_TEMPLY.replace("$name", paths.join("/")).replace("$meta", meta),
    "utf-8"
  );
  return entryFile; // ['babel-polyfill', entryFile]
}

function CamelName (words) {
    return words.reduce((pre, cur) => {
      return pre + (cur && (cur.slice(0, 1).toUpperCase() + cur.slice(1).toLowerCase()))
    }, '')
}

// 执行文件打包
async function buildOnePlugin(paths) { 
  let entry = {}
  const pluginPath = path.join(cwd, ...paths)
  const buildPath = path.resolve(__dirname, `../build`)
  const metaStr = fs.readFileSync(path.join(__dirname, '../meta.json'), 'utf-8')
  entry[`plugin`] = createEntry(metaStr, ...paths)
  const plugins = [
    new CopyWebpackPlugin({
      patterns: [{
        from: path.join(pluginPath, '../meta.json'),
        to: buildPath,
      }]
    })
  ]
  if (isBuildCaExt) {
    plugins.push(new FileManagerWebpackPlugin({
      events: {
        onEnd: {
          // delete: [
          //   buildPath
          // ],
          archive: [
            {
              source: buildPath,
              destination: path.resolve(__dirname, `../dist/plugin.ca`),
              format: 'zip'
            },
          ],
        },
      },
    }))
  }

  const webEntry = path.join(pluginPath, './web/index.tsx')
  const hasWebPage = fs.existsSync(webEntry)
  if (hasWebPage) {
    entry['web'] = webEntry
    plugins.push(
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        filename: `index.html`,
        template: "./template.html",
        publicPath: "auto",
        chunks: ["web"]
      }),
      new HtmlWebpackTagsPlugin({
        tags: [
          `../../../../../../../assets/runtime/common/web/index-1.0.0.js`,
        ],
        append: false,
      }),
    );
  }
  const config = merge(ecisBuildConfig, {
    entry,
    output: {
      path: path.join(buildPath, 'pack')
    },
    plugins: plugins
  })
  return new Promise((resolve, reject) => {
    const callback = (err, stats) => {
      if (err) {
        consola.error(err);
        reject();
      }
      // consola.success(`【${basePath}】成功！`);
      // 此处打印一些错误日志
      consola.info(
        stats?.toString({
          chunks: false,
          colors: true,
        })
      );
      resolve();
    }
    if (isDevelopment) {
      webpack(config).watch({}, callback);
    } else {
      webpack(config, callback)
    }
  })
}



// 执行
(async function main() {
  buildOnePlugin([])
})()