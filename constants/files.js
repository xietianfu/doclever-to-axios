const path = require("path");
const fs = require("fs-extra");
const shell = require("shelljs");

const configName = "dtaConfig.json";
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
    let configFile = fs.readJSONSync(configName);
    shell.cd(runPath);
    return configFile;
  } else {
    shell.cd(runPath);
    console.log(filePath.stderr, "112");
    return undefined;
  }

  // console.log(fs.readJSONSync(filePath));
}

function getApiFile() {
  const runPath = shell.pwd().stdout;
  const configFile = getConfig();
  let file = undefined;
  if (configFile) {
    const { downPath, name } = configFile;
    shell.cd(downPath);
    let result = shell
      .ls("-l", `./${name}*.json`)
      .reduce((preFile, curFile) =>
        preFile.birthtimeMs > curFile.birthtimeMs ? preFile : curFile
      );
    file = fs.readJSONSync(result.name);
  } else {
    console.log("err");
  }
  shell.cd(runPath);
  return file;
}

getApiFile();

module.exports = {
  configFile: getConfig(),
  apiFile: getApiFile()
};
