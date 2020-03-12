const path = require("path");
const fs = require("fs-extra");
const shell = require("shelljs");
const { configName } = require("./type");
const files = require("./files");
// console.log(dtaConfigData);
/**  项目根目录 */
const appDirectory = path.join(process.mainModule.path, "..");
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

function getConfigPath() {
  const runPath = shell.pwd().stdout;
  let filePath = shell.ls(configName);
  while (filePath.stderr && shell.pwd().stdout !== "/") {
    shell.cd("..");
    filePath = shell.find(configName);
  }
  if (!filePath.stderr) {
    shell.cd(runPath);
    return filePath;
  } else {
    shell.cd(runPath);
    return undefined;
  }
}

// const apiPath = () => {
//   if (dtaConfigData) {
//     return dtaConfigData;
//   } else {
//     return undefined;
//   }
// };

// console.log(apiPath);

module.exports = {
  root: appDirectory,
  constants: resolveApp("constants"),
  src: resolveApp("src"),
  runPath: shell.pwd().stdout,
  globalConfig: resolveApp("globalConfig.json")
  // apiPath
};
