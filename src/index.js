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

shell.config.silent = true;

program.version("1.0.0");

program
  .command("init")
  .description("生成基础配置文件")
  .action(() => {
    const { initConfig } = require("./initConfig");
    initConfig();
  });

program
  .command("setDir")
  .description("设置读取接口文件所在的目录")
  .action(path => {
    const { setDownPath } = require("./initConfig");
    setDownPath();
  });

program
  .command("start")
  .description("执行接口生成")
  .action(() => {
    if (isEmptyParam(files.dtaConfigData, "未找到相关api生成配置")) {
    } else if (
      isEmptyParam(files.apiFileData, "未找到api生成所需的json文件") &&
      isEmptyParam(paths.outPath, "api生成目录未配置") &&
      isEmptyParam(files.dtaConfigData.outName, "生成的api名称未配置")
    ) {
    } else {
      transform.build({
        api: files.apiFileData,
        outPath: paths.outPath,
        outName: files.dtaConfigData.outName,
        cutOff: files.dtaConfigData.cutOff
      });
    }
  });

program
  .command("view")
  .description("查看本次更新接口")
  .action(() => {
    const result = compare({
      benchmarkApi: fs.readJSONSync(
        path.resolve(paths.apiPath, paths.meetApiFiles[1])
      ),
      compareApi: fs.readJSONSync(
        path.resolve(paths.apiPath, paths.meetApiFiles[0])
      )
    });
    console.log(result);
    madeChangeMd({
      changeData: result,
      benchmarkName: paths.meetApiFiles[1],
      compareName: paths.meetApiFiles[0],
      outPath: paths.outPath
    });
  });

program
  .command("config <file>")
  .description("查看文件的各种配置")
  .action(file => {
    console.log({ files, paths, type, index }[file]);
  });

program.parse(process.argv);
