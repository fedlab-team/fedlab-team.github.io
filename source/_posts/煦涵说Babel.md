---
title: 煦涵说Babel
author: 煦涵
thumb: http://www.zuojj.com/wp-content/uploads/2017/06/babel.jpg
---
[Babel](http://babeljs.io/)，下一代javascript编译器，当前版本 `v2.4.0` ，它可以处理ES6的所有新语法，并内置了React JSX扩展及Flow类型注解支持，如果对Flow不是很了解可以查看FED实验室微信公众号文章[煦涵说Flow](https://segmentfault.com/a/1190000009639356)。

Babel与JavaScript技术委员会（TC39）始终保持着高度一致，能够在ECMAScript新特性标准化之前为开发者提供现实可用的转码编译实现，以在ECMAScript规范最后定稿前获得来自世界各地开发者更多的反馈，从而间接推动了javascript的发展以及开发者在项目中尝试使用新技术。因此建议大家开始使用 Babel。

## Babel 配置文件 `.babelrc`
学习和使用Babel的**第一步**，配置 `.babelrc` 文件，该文件存放到项目根目录下，用来设置 Babel 的转码规则和插件。基本格式如下：
```js
{
  "presets": [],
  "plugins": []
}
```

[presets](https://babeljs.io/docs/plugins/#presets)的规则集如下：

```bash
# replaces es2015, es2016, es2017, latest
$ yarn add babel-preset-env --dev

# es2015
$ yarn add babel-preset-es2015 --dev

# es2016
$ yarn add babel-preset-es2016 --dev

# es2017 
$ yarn add babel-preset-es2017 --dev

# react
$ yarn add babel-preset-react --dev

# flow
$ yarn add babel-preset-flow --dev

# The TC39 categorizes proposals into the following stages:
# 
# Stage 0 - Strawman: just an idea, possible Babel plugin.
# Stage 1 - Proposal: this is worth working on.
# Stage 2 - Draft: initial spec.
# Stage 3 - Candidate: complete spec and initial browser implementations.
# Stage 4 - Finished: will be added to the next yearly release.
# For more information, be sure to check out the current TC39 proposals and its process document.
# 
# The TC39 stage process is also explained in detail across a few posts by Yehuda Katz (@wycatz) over at thefeedbackloop.xyz: # Stage 0 and 1, Stage 2, Stage 3, and Stage 4 coming soon.

$ yarn add babel-preset-stage-x --dev
```
[plugins](https://babeljs.io/docs/plugins/#transform-plugins)插件集合很多。

新建一个配置文件 `.babelrc`，并增加如下代码，以供我们下面调试使用:
```bash
# 新建配置文件.babelrc，并添加如下内容
# {
#   "presets": ["es2015"],
#   "plugins": []
# }
$ touch .babelrc
# 安装 babel-preset-es2015
$ yarn add babel-preset-es2015 --dev
```

## 安装和使用 Babel

> ps: 本文将使用Yarn来安装依赖相关npm包，如果不了解Yarn的欢迎阅读公众号专栏[煦涵说Yarn](https://segmentfault.com/a/1190000009626901)。

### 命令行方式运行 babel-cli
`babel-cli` 的 CLI 是一种在命令行下使用 Babel 编译文件的简单方法。

#### 全局安装
```bash
# 全局安装
$ yarn global add babel-cli
```

新建一个source.js文件，内容如下：
```js
var arr = [1, 2, 3, 4];

arr = arr.map((item, index) => {
    return item * index;
});

console.log(arr);
```
```bash
# 输出结果到控制台
$ babel source.js

# 输出结果到文件
$ babel source.js --out-file dist.js
or 
$ babel source.js -o dist.js

# 输出结果到目录
$ babel /src --out-dir /dist
or 
$ babel /src -d /dist
```

#### 项目内安装(局部安装)

```bash
# 初始化一个项目package.json
$ mkdir first-babel-proj
$ cd first-babel-proj
$ yarn init 
$ yarn add babel-cli --dev
```
修改package.json，添加如下文本
```diff
{
  "name": "babel-proj",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "devDependencies": {
    "babel-cli": "^6.24.1"
  },
+  "scripts": {
+   "build": "babel src -d dist"
+  }
}
```
运行
```
$ yarn run build
```

### require方式运行 babel-register
> ps: 这种方法并不适合正式产品环境使用。 在部署到生成环境之前预先编译会更好。 不过用在构建脚本或是其他本地运行的脚本中是非常合适的。

```
$ yarn add babel-register --dev
```
新建compile.js文件
```js
require('babel-register');
require('./src/source.js');
```
运行
```bash
node compile.js
```
运行结果
```bash
$ [0, 2, 6, 12]
```

### 编程方式运行 babel-core
```bash
$ yarn add babel-core --dev

```
字符串形式的 JavaScript 代码可以直接使用 `babel.transform` 来编译。

```js
babel.transform("code();", options);
// => { code, map, ast }
```

如果是文件的话，可以使用异步 api：

```js
babel.transformFile("filename.js", options, function(err, result) {
  result; // => { code, map, ast }
});
```

或者是同步 api：

```js
babel.transformFileSync("filename.js", options);
// => { code, map, ast }
```

要是已经有一个 Babel AST（抽象语法树）了就可以直接从 AST 进行转换。

```js
babel.transformFromAst(ast, code, options);
// => { code, map, ast }
```

更多选项 [options](https://babeljs.io/docs/usage/api/#options).

## Babel 与 Webpack
使用 [babel-loader](https://github.com/babel/babel-loader) 插件
```bash
$ yarn add bable-loader --dev
```
webpack.config.js 配置文件增加如下规则：
```js
{
    test: /\.js$/,
    loader: 'babel-loader'
}
```

## Babel 低版本浏览器兼容
可参考: 
* [煦涵说webpack-IE低版本兼容指南](https://segmentfault.com/a/1190000009613296)，或者FED实验室公众号文章
* [React - IE低版本兼容](https://github.com/xcatliu/react-ie8)
