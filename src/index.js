#!/usr/bin/env node

const program = require("commander");
const shell = require("shelljs");

shell.config.silent = true;

program.version("1.0.0");

program
  .command("init")
  .description("生成基础配置文件")
  .action(() => {
    const { initConfig } = require("./initConfig");

    console.log('"初始化文件"');
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
    const transform = require("./transform");
    // buildApi();
  });

program
  .command("view")
  .description("查看本次更新接口")
  .action(() => {
    console.log("view");
  });

program
  .command("config <file>")
  .description("查看文件的各种配置")
  .action(file => {
    const files = require("../constants/files");
    const paths = require("../constants/paths");
    const type = require("../constants/type");
    const index = require("../constants/index");
    console.log({ files, paths, type, index }[file]);
  });

program.parse(process.argv);
