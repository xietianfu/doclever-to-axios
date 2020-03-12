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

const getApiPath = () => {
  if (dtaConfigData) {
    return dtaConfigData.downPath;
  } else {
    return undefined;
  }
};

module.exports = {
  root: appDirectory,
  constants: resolveApp("constants"),
  src: resolveApp("src"),
  runPath: shell.pwd().stdout,
  globalConfig: resolveApp("globalConfig.json"),
  globalDownPath: fs.readJSONSync(resolveApp("globalConfig.json")).downPath,
  apiPath: getConfigPath("downPath"),
  outPath: getConfigPath("outPath")
};
