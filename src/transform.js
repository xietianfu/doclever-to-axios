const JSON5 = require("json5");
const fs = require("fs-extra");

let apiObj = fs.readJSONSync("../天虎云商大数据.json");

function getApiData(obj) {
  return obj.data;
}

function removeRecycleBin(apiData) {
  return apiData.filter(item => item.name !== "#回收站");
}

const apiData = removeRecycleBin(getApiData(apiObj));

module.exports = {
  apiData
};
