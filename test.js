const inquirer = require("inquirer");

const inquirerFileTreeSelection = require("inquirer-file-tree-selection-prompt");
const fuzzypath = require("inquirer-fuzzy-path");

inquirer.registerPrompt("fuzzypath", require("inquirer-fuzzy-path"));
inquirer.registerPrompt("file-tree-selection", inquirerFileTreeSelection);

async function initConfig() {
  // const result = await inquirer.prompt([
  //   {
  //     type: "input",
  //     name: "downPath",
  //     message: "需要执行的api文件的存放路径",
  //     default: files.globalFile.downPath
  //   },
  //   {
  //     type: "input",
  //     name: "name",
  //     message: "api文件名称,注意需要填写json后缀与重复下载的标号"
  //   },
  //   {
  //     type: "input",
  //     name: "axiosFile",
  //     message: "自定义后的axios配置文件"
  //   },
  //   {
  //     type: "input",
  //     name: "outName",
  //     message: "自定义的生成的api文件名称",
  //     default: "api.js"
  //   }
  // ]);
  // console.log(result, "12334");
  // return result;
  inquirer.prompt([
    {
      type: "fuzzypath",
      name: "path",
      excludePath: nodePath => nodePath.startsWith("node_modules"),
      // excludePath :: (String) -> Bool
      // excludePath to exclude some paths from the file-system scan
      excludeFilter: nodePath => nodePath == ".",
      // excludeFilter :: (String) -> Bool
      // excludeFilter to exclude some paths from the final list, e.g. '.'
      itemType: "any",
      // itemType :: 'any' | 'directory' | 'file'
      // specify the type of nodes to display
      // default value: 'any'
      // example: itemType: 'file' - hides directories from the item list
      rootPath: "app",
      // rootPath :: String
      // Root search directory
      message: "Select a target directory for your component:",
      suggestOnly: false,
      // suggestOnly :: Bool
      // Restrict prompt answer to available choices or use them as suggestions
      depthLimit: 5
      // depthLimit :: integer >= 0
      // Limit the depth of sub-folders to scan
      // Defaults to infinite depth if undefined
    }
  ]);
}

// inquirer.prompt([
//   {
//     type: "file-tree-selection",
//     name: "path"
//   }
// ]);

inquirer.prompt([
  {
    type: "fuzzypath",
    name: "path",
    excludePath: nodePath => nodePath.startsWith("node_modules"),
    // excludePath :: (String) -> Bool
    // excludePath to exclude some paths from the file-system scan
    excludeFilter: nodePath => nodePath == ".",
    // excludeFilter :: (String) -> Bool
    // excludeFilter to exclude some paths from the final list, e.g. '.'
    itemType: "any",
    // itemType :: 'any' | 'directory' | 'file'
    // specify the type of nodes to display
    // default value: 'any'
    // example: itemType: 'file' - hides directories from the item list
    rootPath: "./",
    // rootPath :: String
    // Root search directory
    message: "Select a target directory for your component:",
    suggestOnly: false,
    // suggestOnly :: Bool
    // Restrict prompt answer to available choices or use them as suggestions
    depthLimit: 5
    // depthLimit :: integer >= 0
    // Limit the depth of sub-folders to scan
    // Defaults to infinite depth if undefined
  }
]);
