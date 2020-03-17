# doclever-to-axios

根据 doclever 导出的 json 文件生成相应的 axios 接口

[toc]

---

## 介绍

基于 [DOClever](http://www.doclever.cn/controller/index/index.html)接口管理网站所导出的`*.json`类型的接口文件,快速生成使用[axios](https://github.com/axios/axios)作为请求函数的批量接口处理工具.该工具还提供查看接口更新的功能.

## 特性

1. 自定义`json`文件获取目录
2. 自动读取所需`json`文件的最新版本
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

`docLever-to-axios`会根据全局配置与该项目的`docLever.js`配置文件进行相关操作. 通过`dta --help || dta -h`查看该工具的简单操作

### 配置api文件下载地址

由于接口都需要下载到本地,然后才能执行一系列操作.通过`dta setDir`添加读取接口文件所在的目录,如果`dta init`生成的`dtaConfig.json`所添加的`downPath`与此不同,将以`downPath`为准.

### 生成配置文件

在项目的根目录下使用`dta init`,该命令会在根目录生成配置文件`docLever.js`,如果配置文件已经存在,在`init`完成后将被覆盖.

初始化配置文件需要注意的点:

1. 建议将生成的配置文件添加到`.gitigonre`中,因为不同人项目的存放位置不同,绝对路径也不同,就会造成寻址失败.
2. 在填写 name 的时候尽量填写完整,提高正则的匹配率.使用`dta config paths`,其中`meetApiFiles`为匹配的文件名称.
3. 执行的第三步强制要求需要选择一个自定义后的`axios`配置文件,如果不需要自定义,还是建议新建一个配置文件,然后使用`export default axios`导出配置.
4. 生成的配置文件也可以在项目目录下面自定义,修改后,建议使用`dta config files`与`dta config paths`查看配置是否正确,各种地址与文件是否为你想到的.

### 查看文件变更

查看文件变更需要先`dta ben`,选择其中一个文件作为参考文件,该参考文件会与最新下载的接口文件做对比,然后执行`dta view`,会在原有配置的`outPath`路径下生成一个`change.md`的文档.

建议: 查看该md文档建议使用`Typora`编辑器查看,因为其有目录方便寻找.

## 许可

MIT (c) TianFu Xie
