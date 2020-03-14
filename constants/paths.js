const path = require("path");
const fs = require("fs-extra");
const shell = require("shelljs");
const { configName } = require("./type");
const { dtaConfigData } = require("./files");
/**  项目根目录 */
const appDirectory = path.join(process.mainModule.path, "..");
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

function getConfigPath(name) {
  if (dtaConfigData) {
    return dtaConfigData[name];
  } else {
    return undefined;
  }
}

/**
 * @returns {Array}  按创建时间由近到远排列
 */
function getMeetApiFiles() {
  const runPath = shell.pwd().stdout;
  let apiFiles = [];
  if (dtaConfigData) {
    const { downPath, name } = dtaConfigData;
    shell.cd(downPath);
    let results = shell.ls("-l", `./${name}*.json`);
    if (!results.stderr) {
      // note: 排序直接在results上排序无法生效,提示stderr,原因未知,待确认
      apiFiles = results.map(item => ({
        name: item.name,
        birthtimeMs: item.birthtimeMs
      }));
      apiFiles.sort((a, b) => {
        if (a.birthtimeMs > b.birthtimeMs) {
          return -1;
        } else {
          return 1;
        }
      });
      apiFiles = apiFiles.map(item => item.name);
    }
  }

  shell.cd(runPath);
  return apiFiles;
}

const apiPath = getConfigPath("downPath");
const outPath = getConfigPath("outPath");
const constants = resolveApp("constants");
const src = resolveApp("src");
const runPath = shell.pwd().stdout;
const globalConfig = resolveApp("globalConfig.json");
const globalDownPath = fs.readJSONSync(globalConfig).downPath;
const meetApiFiles = getMeetApiFiles();

module.exports = {
  root: appDirectory,
  constants,
  src,
  runPath,
  globalConfig,
  globalDownPath,
  apiPath,
  outPath,
  meetApiFiles
};
