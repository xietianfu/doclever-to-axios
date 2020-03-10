#!/usr/bin/env node

const program = require("commander");
const { buildApi } = require("./transform");

program.version("1.0.0");

program
  .command("init")
  .description("生成基础配置文件")
  .action(() => {
    console.log('"初始化文件"');
  });

program
  .command("setDir <path>")
  .description("设置读取接口文件所在的目录,不填写为当前目录")
  .action(path => {
    console.log(`设置地址为${path}`);
  });

program
  .command("start")
  .description("执行接口生成")
  .action(() => {
    console.log("begin");
    buildApi();
  });

program
  .command("view")
  .description("查看本次更新接口")
  .action(() => {
    console.log("view");
  });

program.parse(process.argv);
