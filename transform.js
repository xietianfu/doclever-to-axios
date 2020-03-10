console.log(process.mainModule.path);

const path = require("path");

const workPath = process.mainModule.path;

/** @format */
const fs = require("fs");
// const crypto = require("crypto");
//
// const md5 = "66E4D169BFEFAC981D380271D56C842D";

// const file = file.resolve(__dirname, "工商理财企业推荐系统移动端.json");
// 此处为接口地址
const file = "test.json";
// var file = './接口测试.json';

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

/**
 * 字符串驼峰化
 * @param {string} str 传入字符串
 */
function camelize(str) {
  return str.replace(/[-_\s]+(.)?/g, function(match, c) {
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

/* 文件签名部分 */
// const md5sum = crypto.createHash("md5");
// var stream = fs.createReadStream(file, { encoding: "utf8" });
// stream.on("data", function(chunk) {
//   md5sum.update(chunk);
// });
// stream.on("end", function() {
//   const str = md5sum.digest("hex").toUpperCase();
//   console.log("文件:" + file + ",MD5签名为:" + str);
// });

fs.readFile(file, "utf8", (err, data) => {
  // 取得api接口数据
  const apiData = JSON.parse(data).data;
  // 删除回收站
  apiData.filter(item => item.name !== "#回收站");

  let out = fs.createWriteStream(path.resolve(workPath, "api.js"), {
    encoding: "utf8"
  });
  // // 定义api接口
  out.write("// 引入模块 \n import { axios } from './index'; \n");
  out.write(`// 参数类型 \n const typeList= ${JSON.stringify(innerTypeList)}`);
  out.write("// 定义api接口 \n");
  out.write("export const apiFetch = {}; \n \n");

  /**
   * 写入Api
   * @param {object} api
   * @author xietf
   */
  function writeApi(api) {
    // 写入api接口部分
    const { name, remark, url, method, param } = api;
    let newName = url.split("/");
    // 去掉api字段，并处理开头没有写/
    if (!newName.shift()) {
      newName.shift();
    }
    // 函数名
    const funName = newName.join("-");
    // todo: 完成注释部分
    // 请求参数
    let query = [];
    // 响应参数
    let response = param[0].outParam;
    // 请求参数类型验证
    let funStr;
    switch (method) {
      case "GET":
      case "DELETE":
        query = param[0].queryParam;
        funStr = `return axios.${method.toLowerCase()}(\'${url}\',{params});`;
        break;
      case "POST":
      case "PUT":
        const rawJSON = param[0].bodyInfo.rawJSON;
        query = rawJSON ? rawJSON : [];
        funStr = `return axios.${method.toLowerCase()}(\'${url}\',params);`;
      default:
        break;
    }
    // 过滤为空字段
    query = query.filter(item => item.name !== "");
    // 构建请求参数注释
    const annotation = getQueryNoteList(query);
    // 写入函数注释
    out.write(
      "\n/** \n" +
        `* ${method}--${name}\n` +
        "* @param {Object} params -请求对象 \n" +
        annotation +
        "*/\n"
    );
    // 写入函数;
    out.write(
      `apiFetch.${camelize(
        `${method.toLowerCase()}_${funName}`
      )} = (params={}) => {\n ${funStr} \n}; \n`
    );
  }

  function writeTitle(apiData = []) {
    apiData.forEach(item => {
      // 有url说明对象时一个接口，不是一个文件夹层级
      if (item.url) {
        writeApi(item);
      } else {
        // 写入页面标题部分
        out.write(`/* ${item.name} */ \n`);
        /* 继续向下处理 */
        if (item.data) {
          writeTitle(item.data);
        }
      }
    });
  }

  writeTitle(apiData);
});

/**
 * 递归生成参数注释
 * @param {array} params 请求数组
 * @param {*} name 参数名称
 * @param {*} result 结果字符串
 */
function getQueryNoteList(params, name = "params", result = "") {
  let data = "";
  if (getDataType(params) === "Array" && params.length > 0) {
    data = params.reduce((pre, val, index) => {
      let result = "";
      let childName = name;
      // 处理jsdoc字类型
      if (val.data) {
        if (typeList[val.type] === "Object[]") {
          childName = `${name}.${val.name}[]`;
          result = `* @param {${typeList[val.type]}} ${childName} - ${
            val.remark
          } \n`;
        } else if (val.name) {
          childName = `${name}.${val.name}`;
          result = `* @param {${typeList[val.type]}} ${childName} - ${
            val.remark
          } \n`;
        }
        result = result + getQueryNoteList(val.data, `${childName}`);
        return pre + result;
      }
      return (
        pre +
        `* @param {${typeList[val.type] || "String"}} ${name}.${val.name} - ${
          val.remark
        }\n`
      );
    }, "");
  }
  return data;
}
