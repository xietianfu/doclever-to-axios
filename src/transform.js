const JSON5 = require("json5");
const fs = require("fs-extra");
const { writeCell } = require("../constants/mackFun");
const paths = require("../constants/paths");

console.log(paths, 123);

let apiObj = fs.readJSONSync(paths.jsonPath);

function getApiData(obj) {
  return obj.data;
}

function removeRecycleBin(apiData) {
  return apiData.filter(item => item.name !== "#回收站");
}

const apiData = removeRecycleBin(getApiData(apiObj));

module.exports = {
  apiData,
  buildApi: () => writeCell(apiData)
};
