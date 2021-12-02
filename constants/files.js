const path = require("path");
const fs = require("fs-extra");
const shell = require("shelljs");
const { configName } = require("./type");
const { isBasePath } = require("../utils");

shell.config.silent = true;

/**  项目根目录 */
const appDirectory = path.join(__dirname, "..");
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

/**
 * 获取项目的配置文件
 * @returns {object | undefined}
 */
function getConfig() {
  const runPath = shell.pwd().stdout;
  let filePath = shell.ls(configName);
  while (filePath.stderr && !isBasePath(shell.pwd().stdout)) {
    shell.cd("..");
    filePath = shell.find(configName);
  }

  if (!filePath.stderr) {
    let apiConfig = fs.readJSONSync(configName);
    shell.cd(runPath);
    return apiConfig;
  } else {
    shell.cd(runPath);
    return undefined;
  }
}

/**
 * 获取接口文件
 * @returns {Object}
 */
function getApiFileData() {
  const runPath = shell.pwd().stdout;

  let file = undefined;
  if (apiConfig) {
    const { downPath, name } = apiConfig;
    shell.cd(downPath);
    let results = shell.ls("-l", `./${name}*.json`);
    if (!results.stderr) {
      const detialFile = results.reduce((preFile, curFile) =>
        preFile.birthtimeMs > curFile.birthtimeMs ? preFile : curFile,
      );
      // note: 如果获取的api文件为空这里会报错,需要添加throws: false
      file = fs.readJSONSync(path.resolve(downPath, detialFile.name), {
        throws: false,
      });
    } else {
      // console.log(results.stderr);
    }
  } else {
    // console.log("err");
  }
  shell.cd(runPath);
  // console.log(file);
  return file;
}

const apiConfig = getConfig();
const apiFileData = getApiFileData();

module.exports = {
  apiConfig,
  apiFileData,
  // note: 一旦出现某个模块被"循环加载"，就只输出已经执行的部分，还未执行的部分不会输出。所以获取不能使用`paths.root+....`
  globalConfigData: fs.readJSONSync(resolveApp("globalConfig.json")),
};
