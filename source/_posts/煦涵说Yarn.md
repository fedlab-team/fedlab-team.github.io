---
title: 煦涵说Yarn
author:
   nick: 煦涵
   github_name: zuojj
date: 2017-05-13 17:00
categories: 煦涵说
tags: yarn
thumb: http://www.zuojj.com/wp-content/uploads/2017/05/0.jpeg
---

[Yarn](https://yarnpkg.com)是一个新的Javascript包管理器，它由Facebook, Google, Exponent and Tilde开发者共同开发完成。Yarn 不是 NPM 的fork版本，而是它的重新设计，Yarn 定位为"快速、可靠、安全的依赖管理工具"，它的目标是解决团队开发中使用 NPM 遇到的问题。

随着 Yarn 的诞生，越来越多的开发者转向了 Yarn，那么 NPM 在开发中有哪些问题，Yarn 是如何解决的呢？
NPM 一些潜在的问题:
* 嵌套依赖 (npm 3.0版本已修复)
* 串行安装
* 单一个 package 来源（npmjs.com）
* 需要网络来安装软件包（尽管我们可以创建一个临时缓存）
* 允许程序包在安装时运行代码（不利于安全性）
* 不确定的包状态（不能确定项目的所有副本使用相同的包版本）

Yarn 解决方案:
* 单依赖包结构: 可以使用单一版本的依赖包，安装更快速，占用磁盘空间更少
* 并行安装: 并行下载依赖包，减少下载时间
* 多个包来源: Yarn 读取和安装 npmjs.com 和 Bower安装包，如果有个渠道down掉了，可以从另一个渠道下载包并安装
* 自动重试: 单个网络请求失败不会导致安装失败，请求在失败后会重试，这解决了由于临时网络问题而产生的构建异常
* 兼容 NPM: 从 NPM 切换到 Yarn 不需要做特殊兼容处理
* yarn.lock: 用来管理 javascript 包，这个对于开发团队来说可能是最有用的功能了。 在package.json中，依赖的包版本可以被指定为一个范围，也可以不带版本号。这个可能会导致一种问题，团队内不同开发人员使用不同版本的软件包。我们都知道，复现环境的能力与完全相关的依赖关系对于高校的调试和新团队人员的融入至关重要。从包管理器（Bundler）中借鉴，Yarn 创建了 yarn.lock文件，用来记录项目使用每个包的确切版本。当将此文件提交至 SVN、GIT 等代码维护工具，可以保证项目的所有开发人员共享一套依赖包的版本号。

## Yarn 的安装
```bash
brew install yarn

/* Yarn 团队不推荐 */
npm install -g yarn 
```
不同平台安装方式各异，具体参见[install](https://yarnpkg.com/zh-Hans/docs/install)

## NPM CLI vs Yarn CLI

* 初始化项目
```bash
npm  init
yarn init
```
* 从 package.json 安装依赖
```bash
npm install
yarn
```
* 安装指定包到依赖或者开发依赖
```
npm install --save [package]
yarn add [package]

npm install --save-dev [package]
yarn add [package] [--dev/-D]
```
* 安装包到全局
```bash
npm install --global [package]
yarn global add [package]
```
* 安装指定版本的包
```bash
npm install [package]@[version]
yarn add [package]@[version]
```
* 重新下载所有包
```bash
npm reubild
yarn install --force
```
* 卸载包
```bash
npm uninstall [package]

npm uninstall --save [package]
yarn remove [package]

npm uninstall --save-dev [package]

```
* 升级包
```bash
rm -rf node_modules && npm install
yarn upgrade
```
## 总结
相比 NPM，Yarn解决了不确定依赖、网络问题、并行下载等问题。然而 NPM 是自己成功的牺牲品，随着越来越多的开发者转移使用 Yarn或者其他依赖平台，NPM 服务器可以更有效的使用。总之两个包管理器都很优秀，这种相互的关系，驱使着各自彼此往更优秀的方向前进，以惠及更多的开发者。
