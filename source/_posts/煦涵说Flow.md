---
title: 煦涵说Flow
author:
   nick: 煦涵
   github_name: zuojj
date: 2017-05-20 17:00
categories: 煦涵说
tags: flow
thumb: http://www.zuojj.com/wp-content/uploads/2017/05/flow.png
---


[Flow](https://flow.org)是Facebook出品的一个JavaScript代码的静态类型检查工具，它做了很多处理，使您的代码更快，更智能，更自信，更好的适应性。现在已经在前端比较流行的React 、Vue 等框架中得到使用。今天煦涵就和大家一起来学习Flow以及在实际项目中的使用。

## Flow 安装
这里我们选择使用 `yarn`，当前你也可以使用 `npm`, 如果你对 `yarn`不是很了解，建议你阅读 **煦涵说Yarn**。首先我们先初始化一个 `flow` 项目，安装完编译器，然后再安装 `flow` 。
```
mkdir flow-project
cd flow-project
yarn init

yarn add --dev babel-cli babel-preset-flow babel-preset-es2015
```
项目根目录下创建 `.babelrc` 文件，并增加如下内容：
```js
{
    "presets": ["flow", "es2015"]
}
```

安装 Flow:
```
yarn add --dev flow-bin
```

运行 flow：
需要在根目录下新建一个 `.flowconfig` 文件，不然会报找不到该文件错误。
```
yarn run flow
```
```
yarn run v0.16.1
$ "/flow-proj/node_modules/.bin/flow" 
Launching Flow server for /flow-proj
Spawned flow server (pid=17242)
Logs will go to /private/tmp/flow/zSvue-workspacezSflow-proj.log
No errors!
✨  Done in 2.48s.
```

## Flow 使用
我们先在根目录下新建src目录，并新建一个index.js文件。同时在 `package.json` 文件中增加下面scripts内容，以方便我们后期的命令行编译。
index.js
```js
// @flow
[1,2,3,4].map((item:number, index) => {
    return item * item;
});
```
package.json
```js
"scripts": {
    "build": "yarn run flow && babel src -d lib"
}
```
运行 `yarn run build`， 没有报错， 会在生成lib文件目录，index.js的 flow type 注释会被 remove 掉，同时进行了箭头函数到ES5的转换。
如果我修改上面index.js的代码：
```js
// @flow
['1',2,3,4].map((item:number, index) => {
    return item * item;
});
```
运行 `yarn run build`，会报如下类型检测错误：
```
yarn run v0.16.1
$ "/flow-proj/node_modules/.bin/flow" 
src/index.js:3
  3: ['1',2,3,4].map((item:number, index) => {
      ^^^ string. This type is incompatible with the expected param type of
  3: ['1',2,3,4].map((item:number, index) => {
                           ^^^^^^ number


Found 1 error
error Command failed with exit code 2.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

更多类型坚持实例不再一一列举，官网有很多介绍type的例子。

## Flow 配置文件
上面提到没有配置文件，会报错，`.flowconfig` 文件由以下5个部分组成：
* [include] --包含的文件或者目录
* [ignore]  --忽略的文件或者目录，支持正则匹配
* [libs]    --第三方库支持，项目根目录下的flow-typed目录作为库目录
* [options] --默认键值对配置，某些选项可以使用命令行方式重载
* [version] --期望使用的Flow版本

## 流行编辑器插件支持
* Visual Studio Code: Flow-Language-Support 
* Sublime Text:Flow 和 SublimeLinter-flow
更多请参考：https://flow.org/en/docs/editors/

感谢您的阅读

<div style="margin:5px auto;padding-top:1.2em;padding-bottom:0.6em;">
    <div style="font-size:1em; border-style: solid none none; border-top-width: 1px; border-color: rgb(17, 17, 17); color: rgb(204, 204, 204);"></div>
    <div style="margin-top: -0.7em;text-align:center;line-height:1.4;">
    <span style="padding:8px 23px;background-color:#fff;color:#000;margin-top:-1em;">EOF</span>
    </div>
</div>
