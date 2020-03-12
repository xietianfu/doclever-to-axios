const path = require("path");
const fs = require("fs-extra");
const shell = require("shelljs");
const paths = require("./paths");
const { configName } = require("./type");

shell.config.silent = true;

function getConfig() {
  const runPath = shell.pwd().stdout;
  // console.log(shell.ls("dtaConfig.json").stdout);
  let filePath = shell.ls(configName);
  while (filePath.stderr && shell.pwd().stdout !== "/") {
    shell.cd("..");
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
}

function getApiFile() {
  const runPath = shell.pwd().stdout;

  let file = undefined;
  if (dtaConfigData) {
    const { downPath, name } = dtaConfigData;
    shell.cd(downPath);
    let results = shell.ls("-l", `./${name}*.json`);
    if (!results.stderr) {
      const detialFile = results.reduce((preFile, curFile) =>
        preFile.birthtimeMs > curFile.birthtimeMs ? preFile : curFile
      );
      file = fs.readJSONSync(path.resolve(downPath, detialFile.name));
    } else {
      // console.log(results.stderr);
    }
  } else {
    console.log("err");
  }
  shell.cd(runPath);
  return file;
}

const dtaConfigData = getConfig();
const apiFile = getApiFile();
const globalConfigData = () => {
  const globalConfig = path.join(paths.root, "globalConfig.json");
  console.log(globalConfig, "123");
  return globalConfigData;
};

module.exports = {
  dtaConfigData,
  apiFile,
  globalConfigData
};
