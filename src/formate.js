const fs = require("fs");
const path = require("path");
const { innerTypeList, mustType } = require("../constants/type");

function madeChangeMd({
  changeData,
  outPath,
  cutOff,
  benchmarkName,
  compareName
}) {
  let doc = fs.createWriteStream(path.resolve(outPath, "change.md"), {
    encoding: "utf8"
  });

  doc.write("# 接口变更对比 \n");
  doc.write(`> 基准版本: ${benchmarkName}.\n`);
  doc.write(`> 对比版本:${compareName}. \n`);
  doc.write(`--- \n[toc] \n --- \n`);

  doc.write("## 新增的接口 \n");

  changeData.add.map(item => {
    // 写入三级标题
    doc.write(`\n ### ${item.name} \n`);
    buildTable(item);
  });

  doc.write("## 删除的接口 \n");

  changeData.delet.map(item => {
    // 写入三级标题
    doc.write(`\n ### ${item.name} \n`);
    buildTable(item);
  });

  doc.write("## 变更的接口 \n");
  changeData.change.map(item => {
    doc.write(`\n ### ${item.benchmark.name} \n`);

    doc.write(`\n **参考接口**: \n`);
    buildTable(item.benchmark);
    doc.write(`\n **对比接口**: \n`);
    buildTable(item.benchmark);
  });

  function buildTable(params) {
    const { param, name, method, url, remark } = params;
    const { queryParam, outParam } = param[0];

    doc.write(`\n **接口名称：** ${name} \n`);
    remark && doc.write(`\n **接口说明：** ${remark} \n`);
    doc.write(`\n **请求方式：** ${method} \n`);
    doc.write(`\n **接口名：** ${url} \n`);

    doc.write(`\n **请求参数：** \n`);

    getReq(param[0], method);

    doc.write(`\n **响应数据：** \n`);

    doc.write(`| 参数名称 | 参数类型 | 参数说明 | \n`);
    doc.write(`| :------| :------| :------| \n`);
    getRes(outParam);
  }

  function getRes(params, parent = "") {
    if (Array.isArray(params)) {
      params.forEach(item => {
        let name = "";
        if (item.data) {
          let newParent = "";
          switch (item.type) {
            case 0:
            case 1:
            case 2:
              newParent = !!parent ? `${parent}.${item.name}` : `${item.name}`;
              break;
            case 3:
              newParent = !!parent
                ? `${parent}.${item.name}[]`
                : `${item.name}[]`;
              break;
            case 4:
              if (item.name === null) {
                newParent = parent;
                break;
              } else {
                newParent = !!parent
                  ? `${parent}.${item.name}`
                  : `${item.name}`;
              }
              break;
            default:
              break;
          }
          if (item.name === null) {
            name = parent;
          } else {
            name = !!parent ? `${parent}.${item.name}` : `${item.name}`;
            doc.write(
              `| ${name} | ${innerTypeList[item.type]}  | ${item.remark} | \n`
            );
          }
          return getRes(item.data, newParent);
        }

        if (item.name === null) {
          name = parent;
        } else {
          name = !!parent ? `${parent}.${item.name}` : `${item.name}`;
        }
        return doc.write(
          `|  ${name} |  ${innerTypeList[item.type]}  | ${item.remark} | \n`
        );
      });
    }
  }

  function getReq(params, method) {
    switch (method.toUpperCase()) {
      case "GET":
        getGETReq(params);
        break;
      case "POST":
        getPOSTReq(params);
      default:
        break;
    }
  }

  function getGETReq(params) {
    const { queryParam } = params;

    if (queryParam.length > 0) {
      doc.write(`| 参数名称 | 是否必传 | 参数说明 | \n`);
      doc.write(`| :------| :------| :------| \n`);
      console.log(queryParam);
      queryParam.forEach(item => {
        doc.write(
          `| ${item.name} | ${mustType[item.must]} | ${item.remark} | \n`
        );
      });
    }
  }

  function getPOSTReq(params) {
    const { queryParam, bodyInfo } = params;
    const { rawJSON } = bodyInfo;

    doc.write(`| 参数名称 | 是否必传 | 参数说明 | \n`);
    doc.write(`| :------| :------| :------| \n`);

    if (queryParam.length > 0) {
      queryParam.forEach(item => {
        doc.write(
          `| ${item.name} | ${mustType[item.must]} | ${item.remark} | \n`
        );
      });
    }

    getRawJSON(rawJSON);
  }

  function getRawJSON(params) {
    if (Array.isArray(params)) {
      params.forEach(item => {
        doc.write(
          `| ${item.name} |  ${mustType[item.must]} | ${item.remark} | \n`
        );
      });
    }
  }
}

module.exports = {
  madeChangeMd
};
