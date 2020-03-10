/**
 * 获取参数类型
 * @param {mix} param 待确定类型参数
 */
function getDataType(param) {
  const type = Object.prototype.toString.call(param);
  const regx = /\w+ (\w+)/g;
  return regx.exec(type)[1];
}

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

/**
 * 创建jsdoc风格的注释
 * @param {string} method 请求方法
 * @param {string} name api名称
 * @param {string} query 注释字段
 * @returns {string}
 */
function creatAnnotation(method, name, query) {
  const queryStructure = getQueryNoteList(
    query.filter(item => item.name !== "")
  );
  return `
    /**
     * ${method}--${name}
     * @param {Object} params -请求对象
     ${queryStructure}
     */
  `;
}

/**
 * 创建函数aixos函数主体部分
 * @param {string} method 请求方法
 * @param {string} url 请求的api地址
 * @returns {string}
 */
function creatContentFun(method, url) {
  switch (method) {
    case "GET":
    case "DELETE":
      return `return axios.${method.toLowerCase()}(\'${url}\',{params});`;
    case "POST":
    case "PUT":
      return `return axios.${method.toLowerCase()}(\'${url}\',params);`;
    default:
      break;
  }
}

/**
 * 创建函数aixos函数主体部分
 * @param {string} method 请求方法
 * @param {param} url 请求的api地址
 * @returns {array}
 */
function getQuery(method, param) {
  switch (method) {
    case "GET":
    case "DELETE":
      return param[0].queryParam;
    case "POST":
    case "PUT":
      const rawJSON = param[0].bodyInfo.rawJSON;
      return rawJSON ? rawJSON : [];
    default:
      break;
  }
}

/**
 * 生成接口
 * @param {object} api 接口数据
 */
function writeApi(api) {
  // 写入api接口部分
  const { name, remark, url, method, param } = api;
  console.log(api);
  let newName = url.split("/");
}

function writeCell(apiData = []) {
  // apiData.forEach(item => {
  //   // 有url说明对象时一个接口，不是一个文件夹层级
  //   if (item.url) {
  //     writeApi(item);
  //   } else {
  //     // 写入页面标题部分
  //     // out.write(`/* ${item.name} */ \n`);
  //     /* 继续向下处理 */
  //     if (item.data) {
  //       writeCell(item.data);
  //     }
  //   }
  // });
  // console.log(apiData);
}

module.exports = {
  writeCell
};
