const path = require("path");
const fs = require("fs-extra");
const shell = require("shelljs");
const { configName } = require("./type");
const { dtaConfigData } = require("./files");
/**  项目根目录 */
const appDirectory = path.join(process.mainModule.path, "..");
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

function getConfigPath(name) {
  return dtaConfigData[name];
}

function getMeetApiFiles() {
  const { downPath, name } = dtaConfigData;
}

const apiPath = getConfigPath("downPath");
const outPath = getConfigPath("outPath");
const constants = resolveApp("constants");
const src = resolveApp("src");
const runPath = shell.pwd().stdout;
const globalConfig = resolveApp("globalConfig.json");
const globalDownPath = fs.readJSONSync(resolveApp("globalConfig.json"))
  .downPath;

module.exports = {
  root: appDirectory,
  constants,
  src,
  runPath,
  globalConfig,
  globalDownPath,
  apiPath,
  outPath
};
