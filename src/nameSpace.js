const fs = require("fs");
const { typeList, innerTypeList } = require("../constants/type");
const path = require("path");
const _ = require("lodash");
const fsExtra = require("fs-extra");
const files = require("../constants/files");
const { configLocation } = require("../constants/paths");

let queryPath = undefined;

/**
 * 字符串驼峰化
 * @param {string} str 传入字符串
 */
function camelize(str) {
  return str.replace(/[-_/\s]+(.)?/g, function (match, c) {
    return c ? c.toUpperCase() : "";
  });
}

/**
 * 获取参数类型
 * @param {mix} param 待确定类型参数
 */
function getDataType(param) {
  const type = Object.prototype.toString.call(param);
  const regx = /\w+ (\w+)/g;
  return regx.exec(type)[1];
}

function flatten(arr = []) {
  let _arr = [];
  arr.forEach((item) => {
    if (item.url) {
      _arr.push(item);
    } else {
      if (item.data) {
        const resArr = flatten(item.data);
        _arr = [..._arr, ...resArr];
      }
    }
  });
  return _arr;
}

function deconstructionRawJSON(rawJSON = [], outArr = []) {
  let _arr = [];

  rawJSON.forEach((item) => {
    if (item.data) {
      const children =
        innerTypeList[item.type] === "Array"
          ? item.data[0]
            ? item.data[0].data
            : []
          : item.data;
      const obj = {
        name: item.name,
        children,
      };

      const getArr = deconstructionRawJSON(children, _arr);
      _arr.push(obj);
      _arr = [..._arr, ...getArr];
    }
  });
  return _arr;
}

function writeRawJsonInterfaceParams(cell, out, suffix = "Params") {
  if (innerTypeList[cell.type] === "Array") {
    out.write(
      `${cell.name}?: Array<${cell.name}${suffix}> ;/\/\ ${cell.remark} \n`,
    );
  } else if (innerTypeList[cell.type] === "Object") {
    out.write(`${cell.name}?: ${cell.name}${suffix} ;/\/\ ${cell.remark} \n`);
  } else if (innerTypeList[cell.type] === "Mixed") {
    out.write(`${cell.name}?: any ;/\/\ ${cell.remark} \n`);
  } else {
    out.write(
      `${cell.name}?: ${innerTypeList[cell.type]}; /\/\ ${cell.remark} \n`,
    );
  }
}

function writeQuery(param, type, out) {
  const { queryParam, bodyInfo } = param;

  const { rawJSON } = bodyInfo || {};
  if (!_.isEmpty(queryParam)) {
    out.write(`export interface queryParam { \n`);
    queryParam.forEach((item) => {
      if (queryPath) {
        if (queryPath.all[item.name]) {
          return out.write(
            `${item.name}?: ${queryPath.all[item.name]} ; /\/\ ${
              item.remark
            }\n`,
          );
        }
      }
      return out.write(`${item.name}?: string ; /\/\ ${item.remark}\n`);
    });
    out.write(`};\n`);
    out.write(`\n`);
  }
  if (!_.isEmpty(rawJSON)) {
    let arr = deconstructionRawJSON(rawJSON);
    arr = arr.reverse();
    arr.forEach((item) => {
      out.write(`export interface ${item.name}Params {\n`);
      if (item.children) {
        item.children.forEach((cell) => {
          writeRawJsonInterfaceParams(cell, out);
        });
      }
      out.write(`};\n`);
      out.write(`\n`);
    });
    out.write(`export interface rawJSON { \n`);
    rawJSON.forEach((cell) => {
      writeRawJsonInterfaceParams(cell, out);
    });
    out.write(`};\n`);
    out.write(`\n`);
  }
}

function wirteRes(param, out) {
  const { outParam } = param;
  //   console.log(outParam);
  let data = outParam.find((item) => item.name === "data");
  if (data) {
    const arr = deconstructionRawJSON(data.data);
    // console.log(arr);
    arr.forEach((item) => {
      out.write(`export interface ${item.name}OutParams {\n`);

      if (item.children) {
        item.children.forEach((cell) => {
          writeRawJsonInterfaceParams(cell, out, "OutParams");
        });
      }
      out.write(`};\n`);
      out.write(`\n`);
    });
    out.write(`export interface outParam { \n`);
    data.data.forEach((cell) => {
      writeRawJsonInterfaceParams(cell, out, "OutParams");
    });
    out.write(`};\n`);
    out.write(`\n`);
  }
}

function buildApiNameSpace() {
  const { apiConfig, apiFileData } = files;

  const outPath = path.join(configLocation, apiConfig.exportNameSpaceFileName);
  const outName = apiConfig.exportNameSpaceFilePath;
  const cutOff = apiConfig.cutOff;
  // 自定义查询参数的数据类型
  // try {
  //   queryPath = fsExtra.readJSONSync(
  //     path.resolve(process.cwd(), "queryMap.json"),
  //   );
  // } catch (error) {
  //   console.error("未识别到queryMap.json文件,供get请求参数设置默认参数类型");
  // }
  // 取得api接口数据
  let apiData = apiFileData.data;
  // 删除回收站
  apiData = apiData.filter((item) => item.name !== "#回收站");

  let out = fs.createWriteStream(path.resolve(outPath, outName), {
    encoding: "utf8",
  });
  apiData = flatten(apiData);

  apiData.forEach((item) => {
    const { url } = item;
    let cutUrl = url;
    // console.log(url);

    if (cutOff) {
      const _cutOff = cutOff[cutOff.length - 1] === "/" ? cutOff : cutOff + "/";
      cutUrl = cutUrl.replace(_cutOff, "");
    }
    out.write(`\n`);
    out.write(`// ${item.name}--${item.url} \n`);
    let funName = camelize(cutUrl);
    funName = funName.replace(/{(\w+)?}/g, "$$$1");
    out.write(`export namespace ${item.method}${funName} { \n`);
    writeQuery(item.param[0], item.method, out);
    wirteRes(item.param[0], out);
    out.write(`}\n`);
  });

  console.log(`${outName}已在${outPath}生成.`);
}

module.exports = {
  buildApiNameSpace,
};
