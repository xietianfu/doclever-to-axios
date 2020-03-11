const path = require("path");
const fs = require("fs-extra");
const shell = require("shelljs");
/**  项目根目录 */
const appDirectory = path.join(process.mainModule.path, "..");
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  root: appDirectory,
  constants: resolveApp("constants"),
  src: resolveApp("src"),
  runPath: shell.pwd().stdout,
  globalConfig: resolveApp("globalConfig.json")
};
