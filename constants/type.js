const typeList = {
  0: "String",
  1: "Number",
  2: "Boolean",
  3: "Object[]",
  4: "Object",
  5: "Mixed"
};

const innerTypeList = {
  0: "String",
  1: "Number",
  2: "Boolean",
  3: "Array",
  4: "Object",
  5: "Mixed"
};

// 请求参数是否必传
const mustType = {
  1: "Y",
  0: "N"
};

const configName = "dtaConfig.json";

module.exports = {
  typeList,
  configName,
  innerTypeList,
  mustType
};
