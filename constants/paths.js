const path = require("path");
const fs = require("fs");
const shell = require("shelljs");

/**  项目根目录 */
const appDirectory = fs.realpathSync(path.join(process.mainModule.path, ".."));
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  root: appDirectory,
  constants: resolveApp("constants"),
  src: resolveApp("src"),
  jsonPath: resolveApp("test.json"),
  runPath: fs.realpathSync(process.cwd())
};
