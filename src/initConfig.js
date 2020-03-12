const inquirer = require("inquirer");
const fs = require("fs-extra");
const paths = require("../constants/paths");
const files = require("../constants/files");
const shell = require("shelljs");
const path = require("path");

inquirer.registerPrompt("fuzzypath", require("inquirer-fuzzy-path"));

const reg = /(node_modules|.git)/;

async function initConfig() {
  const result = await inquirer.prompt([
    {
      type: "input",
      name: "downPath",
      message: "需要执行的api文件的存放路径",
      default: files.globalConfigData.downPath
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

// async function setDownPath() {
//   let globalConfigData = { ...files.globalConfigData };

//   const result = await inquirer.prompt({
//     type: "input",
//     name: "downPath",
//     message: "设置全局的下载地址: ",
//     validate: function(input) {
//       // Declare function as asynchronous, and save the done callback
//       var done = this.async();

//       // Do async stuff
//       if (!input.trim()) {
//         // Pass the return value in the done callback
//         done("全局地址不建议设置为空");
//         return;
//       }
//       // Pass the return value in the done callback
//       done(null, true);
//     }
//   });
//   globalConfigData.downPath = result;
//   fs.writeJSON(paths.globalConfig, result, { spaces: "\n" });
//   return result;
// }

module.exports = {
  initConfig
  // setDownPath
};
