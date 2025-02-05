
const git = require('simple-git')
const path = require('path')


module.exports = class BuildOriginTagsPlugin {
  constructor() { }
  async apply(compiler) {
    try {
      const gitUrl = path.join(__dirname, '../../')
      const sim = git(gitUrl);
      const gitInfo = await sim.status()
      const entry = compiler.options.entry;
      compiler.hooks.emit.tap('myPlu', (compilation) => {
        Object.keys(entry).forEach((item) => {
          compilation.updateAsset(`${item}.js`, (file) => {
            if (Object.prototype.toString.call(file._value) === '[object String]') {
              const param = [`  lastBuildTime: ${getTime()}`, `  buildBranch: ${gitInfo.current}`]
              file._value = `/*\n${param.join('\n')}\n*/ \n${file._value}`
            }
            return file;
          })
        })
      });
    } catch (error) {
    }
  }
}

function getTime() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1
    }-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
}