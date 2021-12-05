#!/usr/bin/env node

const program = require("commander");
const shell = require("shelljs");
const files = require("../constants/files");
const paths = require("../constants/paths");
const type = require("../constants/type");
const index = require("../constants/index");
const transform = require("./transform");
const chalk = require("chalk");
const { isEmptyParam } = require("./verifyConfig");
const { compare } = require("../src/compare");
const fs = require("fs-extra");
const path = require("path");
const { madeChangeMd } = require("./formate");
const { initConfig, setDownPath, setBenchmark } = require("./initConfig");
const { buildApi } = require("./buildApi");
const { buildApiNameSpace } = require("./nameSpace");

shell.config.silent = true;

program.version("1.0.4");

// program
//   .command("init")
//   .description("生成基础配置文件")
//   .action(() => {
//     initConfig();
//   });

// program
//   .command("setDir")
//   .description("设置读取接口文件所在的目录")
//   .action(path => {
//     setDownPath();
//   });

// program
//   .command("setBen")
//   .description("为新下载的接口设置一个参考文件,用以获取接口变化")
//   .action(path => {
//     if (!isEmptyParam(files.apiConfig, "未找到相关api生成配置")) {
//       setBenchmark().then(res => console.log(chalk.green("参考文件设置成功")));
//     }
//   });

// program
//   .command("start")
//   .description("执行接口生成")
//   .action(() => {
//     if (isEmptyParam(files.apiConfig, "未找到相关api生成配置")) {
//     } else if (
//       isEmptyParam(files.apiFileData, "未找到api生成所需的json文件") &&
//       isEmptyParam(paths.outPath, "api生成目录未配置") &&
//       isEmptyParam(files.apiConfig.outName, "生成的api名称未配置")
//     ) {
//     } else {
//       transform.build({
//         api: files.apiFileData,
//         outPath: paths.outPath,
//         outName: files.apiConfig.outName,
//         axiosPath: files.apiConfig.axiosFile,
//         cutOff: files.apiConfig.cutOff,
//       });
//       console.log(chalk.green("接口函数生成成功"));
//     }
//   });
program
  .command("start")
  .description("执行DOCLever到umi操作的全套流程")
  .action((path) => {});

program
  .command("api")
  .description("执行DOCLever到umi项目的api")
  .action((path) => {
    // console.log(files);
    buildApi();
  });

program
  .command("ns")
  .description("执行DOCLever生成nameSpace")
  .action((path) => {
    buildApiNameSpace();
  });

// program
//   .command("view")
//   .description("查看本次更新接口")
//   .action(() => {
//     const result = compare({
//       benchmarkApi: fs.readJSONSync(
//         path.resolve(paths.apiPath, files.apiConfig.benchmark),
//       ),
//       compareApi: fs.readJSONSync(
//         path.resolve(paths.apiPath, paths.meetApiFiles[0]),
//       ),
//     });
//     madeChangeMd({
//       changeData: result,
//       benchmarkName: paths.meetApiFiles[1],
//       compareName: paths.meetApiFiles[0],
//       outPath: paths.outPath,
//     });
//     console.log(chalk.green("接口变更文档生成成功"));
//   });

program
  .command("config <file>")
  .description("查看文件的各种配置")
  .action((file) => {
    console.log({ files, paths, type, index }[file]);
  });

program.parse(process.argv);
