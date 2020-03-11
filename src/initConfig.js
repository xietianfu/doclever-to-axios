const inquirer = require("inquirer");
const fs = require("fs-extra");
const paths = require("../constants/paths");
const files = require("../constants/files");
const shell = require("shelljs");
const path = require("path");

const inquirerFileTreeSelection = require("inquirer-file-tree-selection-prompt");

inquirer.registerPrompt("fuzzypath", require("inquirer-fuzzy-path"));
inquirer.registerPrompt("file-tree-selection", inquirerFileTreeSelection);

const reg = /(node_modules|.git)/;

async function initConfig() {
  const result = await inquirer.prompt([
    {
      type: "input",
      name: "downPath",
      message: "需要执行的api文件的存放路径",
      default: files.globalFile.downPath
    },
    {
      type: "input",
      name: "name",
      message: "api文件名称,注意需要填写json后缀与重复下载的标号"
    },
    {
      type: "fuzzypath",
      name: "axiosFile",
      excludePath: nodePath => nodePath.startsWith("./"),
      excludeFilter: nodePath =>
        /(node_modules|\.git|.md$|.json$|.lock$)/.test(nodePath),
      itemType: "file",
      rootPath: paths.runPath,
      message: "自定义后的axios配置文件:",
      suggestOnly: false,
      depthLimit: 10
    },
    {
      type: "fuzzypath",
      name: "outPath",
      excludePath: nodePath => nodePath.startsWith("./"),
      excludeFilter: nodePath => reg.test(nodePath),
      itemType: "directory",
      rootPath: paths.runPath,
      message: "选择api文件需要生成的目录:",
      suggestOnly: false,
      depthLimit: 10
    },
    {
      type: "input",
      name: "outName",
      message: "自定义的生成的api文件名称",
      default: "api.js"
    }
  ]);
  fs.writeJSON(path.join(paths.runPath, "dtaConfig.json"), result, {
    spaces: "\n"
  });
  return result;
}

module.exports = {
  initConfig
};
