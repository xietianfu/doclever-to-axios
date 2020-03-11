const path = require("path");
const fs = require("fs-extra");
const shell = require("shelljs");
/**  项目根目录 */
const appDirectory = path.join(process.mainModule.path, "..");
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

function getConfig() {
  const runPath = shell.pwd().stdout;
  // console.log(shell.ls("dtaConfig.json").stdout);
  let filePath = shell.ls(configName);
  while (filePath.stderr && shell.pwd().stdout !== "/") {
    shell.cd("..");
    console.log(shell.pwd().stdout, "now", shell.pwd().stdout === "/");
    filePath = shell.find(configName);
  }

  if (!filePath.stderr) {
    let dtaConfigData = fs.readJSONSync(configName);
    shell.cd(runPath);
    return dtaConfigData;
  } else {
    shell.cd(runPath);
    console.log(filePath.stderr);
    return undefined;
  }

  // console.log(fs.readJSONSync(filePath));
}

module.exports = {
  root: appDirectory,
  constants: resolveApp("constants"),
  src: resolveApp("src"),
  runPath: shell.pwd().stdout
};
