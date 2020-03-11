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
    console.log(filePath.stderr);
    return undefined;
  }
}

function getApiFile() {
  const runPath = shell.pwd().stdout;

  let file = undefined;
  if (configFile) {
    const { downPath, name } = configFile;
    shell.cd(downPath);
    let results = shell.ls("-l", `./${name}*[(]?[0-9]*[)].json`);
    console.log(results);
    if (!results.stderr) {
      const detialFile = results.reduce((preFile, curFile) =>
        preFile.birthtimeMs > curFile.birthtimeMs ? preFile : curFile
      );
      file = fs.readJSONSync(path.resolve(downPath, detialFile.name));
    } else {
      console.log(results.stderr);
    }
  } else {
    console.log("err");
  }
  shell.cd(runPath);
  return file;
}

const configFile = getConfig();
const apiFile = getApiFile();

module.exports = {
  configFile,
  apiFile
};
