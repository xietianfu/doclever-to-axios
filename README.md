# doclever-to-axios

根据 doclever 导出的 json 文件生成相应的 axios 接口

[toc]

---

## 介绍

基于 [DOClever](http://www.doclever.cn/controller/index/index.html)接口管理网站所导出的`*.json`类型的接口文件,快速生成使用[axios](https://github.com/axios/axios)作为请求函数的批量接口处理工具.该工具还提供查看接口更新的功能.

## 特性

1. 自定义`json`文件获取目录
2. 自动读取所需`json`文件的最新版本
3. 自定义函数名称
4. 完整的函数注释
5. 对比新老接口文件,获取接口更新内容

## 环境要求

- `Node >=8`

## 安装

```bash
# yarn
yarn global add docLever-to-axios

# npm
npm i -g docLever-to-axios
```

## 使用

`docLever-to-axios`会根据全局配置与该项目的`docLever.js`配置文件进行相关操作. 通过`dta --help`查看该工具的简单操作

### 生成配置文件

在项目的根目录下使用`dta init`,该命令会在根目录生成配置未见`docLever.js`,如果配置文件已经存在了,会询问你是否重置配置.

在填写 name 的时候尽量填写完整,提高正则的匹配率,减少错误.

### 配置`json`文件获取目录

### 生成接口代码与接口更新

## 配置

详细的工具配置:

## 许可

MIT (c) TianFu Xie
