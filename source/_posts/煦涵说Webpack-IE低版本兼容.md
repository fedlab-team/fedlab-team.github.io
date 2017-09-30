---
title: 煦涵说Webpack-IE低版本兼容
author:
   nick: 煦涵
   github_name: zuojj
date: 2017-05-28 17:00
categories: 煦涵说
tags: webpack
thumb: http://www.zuojj.com/wp-content/uploads/2017/05/webpack1.jpg
---

[Webpack](https://webpack.js.org/)，Webpack 是一个前端资源加载/打包工具，现在版本已经 release 到 v2.6.1，今天的文章不支持介绍Webpack的API及使用，而是对最近项目开发中使用Webpack打包时处理IE低版本(IE8及以下)浏览器兼容问题做一次总结。

![图片描述][1]

PC端项目前端基础技术选型jQuery + ES6 + EJS + Babel + Webpack：
* jQuery：提供选择器和ajax接口兼容支持；
* ES6：跟进前端趋势，方便向后兼容；
* EJS：提供前端模板引擎支持；
* Babel：提供 ES6 转码支持；
* Webpack: 提高前端资源加载/打包；

项目开发过程都在 Chrome 浏览器中，一切都OK，没有任何问题，当在IE9以下浏览器中调试发现好多坑，现总结如下，以后新手参考。

## Case One: `default` 、 `class`、`catch` ES3中保留字问题
报错信息：
```
SCRIPT1048: 缺少标识符
```
对应代码：
```js
e.n = function (t) {
    var n = t && t.__esModule ? function () {
        return t.default
    } : function () {
        return t
    };
    return e.d(n, "a", n), n
}
```
网上查找资料，webpack有一款loader插件[es3ify-loader](https://www.npmjs.com/package/es3ify-loader)来处理ES3的兼容问题，修改webpack配置，问题解决，添加规则如下：
```js
module: {
    rules: [{
            test: /.js$/,
            enforce: 'post', // post-loader处理
            loader: 'es3ify-loader'
        }
    ]
}
```
这个loader是干啥用的捏，就是把这些保留字给你加上引号，使用字符串的形式引用，请看实例：
```js
// 编译前
function(t) { return t.default; }

// 编译后
function(t) { return t["default"]; }
```

## Case Two: uglify-js产生问题
重新构建，在IE低版本浏览器预览，使用 `webpack.optimize.UglifyJsPlugin` 压缩时，又报上面同样的错误了，重新采用 beauty:true, build 发现引号被压缩掉了，究其原因，研究了下uglify-js默认配置，发现了 `compress.properties` 属性，增加build options如下，问题解决：
```js
new webpack.optimize.UglifyJsPlugin({
    compress: {
        properties: false,
        warnings: false
    },
    output: {
        beautify: true
    },
    sourceMap: false
})
```

## Case Three: uglify-js问题
重新构建，在IE低版本浏览器预览，使用 `webpack.optimize.UglifyJsPlugin` 压缩时，又报上面同样的错误了，报错代码：
```js
{
    catch: function (t) {
        return this.then(null, t)
    }
}
```
继续查找uglify-js配置，发现 `output.quote_keys`，修改build options，问题解决：
```js
new webpack.optimize.UglifyJsPlugin({
    compress: {
        properties: false,
        warnings: false
    },
    output: {
        beautify: true,
        quote_keys: true
    },
    sourceMap: false
}),
```
编译后：
```js
{
    "catch": function(t) {
        return this.then(null, t);
    }
}
```
## Case Four: uglify-js问题
重新构建，在IE低版本浏览器预览，报错信息如下：
```html
SCRIPT3126: 无法设置未定义或 null 引用的属性
```
继续分析压缩后代码，发现还是uglify-js问题，其mangle 配置属性 `mangle.screw_ie8` 默认为 true， 什么意思捏，意思就是把支持IE8的代码clear掉，screw you => 去你的，修改压缩配置项，重新编译，问题解决：
```js
new webpack.optimize.UglifyJsPlugin({
    compress: {
        properties: false,
        warnings: false
    },
    output: {
        beautify: true,
        quote_keys: true
    },
    mangle: {
        screw_ie8: false
    },
    sourceMap: false
})
```
## Case Five: ES5的API兼容报错
在 webpack 的 entry 入口文件top引入 `es5-shim` 问题解决
```js
require('es5-shim');
require('es5-shim/es5-sham');
```
## Case Six: Console.log 问题
在 webpack 的 entry 入口文件top引入 `console-polyfill` 问题解决
```js
require('console-polyfill');
```

## Case Seven: Promise 兼容
在 webpack 的 entry 入口文件top引入 `es6-promise` 问题解决
```js
require('es6-promise');
```

## Case Eight: Object.defineProperty 问题
这个case 应该说是最难搞的一个case了，耗时也比较长，关键点在于使用 `es5-shim`/`es5-sham`也有问题，查看你官网发现在低版本浏览器也会有问题，官网描述如下：
> ⚠️ Object.defineProperty
> In the worst of circumstances, IE 8 provides a version of this method that only works on DOM objects. This sham will not be installed. The given version of defineProperty will throw an exception if used on non-DOM objects.
> In slightly better circumstances, this method will silently fail to set "writable", "enumerable", and "configurable" properties.
> Providing a getter or setter with "get" or "set" on a descriptor will silently fail on engines that lack "defineGetter" and "defineSetter", which include all versions of IE.
https://github.com/es-shims/es5-shim/issues#issue/5

那这个Object.defineProperty 是如何产生的呢，这个是babel编译后产生的，当我们在代码使用 `import` `export` ES6 Module时出现的，那你可能最直接的想法就是我不用ES6 Module了，改用Commonjs规范，OK，修改后编译，确实解决了问题，但是查看代码里还是有一段代码的，如下：
```js
e.d = function(t, n, r) {
    e.o(t, n) || Object.defineProperty(t, n, {
        "configurable": !1,
        "enumerable": !0,
        "get": r
    });
}, e.n = function(t) {
    var n = t && t.__esModule ? function() {
        return t["default"];
    } : function() {
        return t;
    };
    return e.d(n, "a", n), n;
}, e.o = function(t, e) {
    return Object.prototype.hasOwnProperty.call(t, e);
}
```
看代码已经做了容错判断。

## Case Nine: Object.defineProperty 问题
重新构建，加入 `json3` 处理 JSON 对象兼容时，代码在此处抛出了异常：
```js
var hasGetter = 'get' in descriptor;
var hasSetter = 'set' in descriptor;
if (!supportsAccessors && (hasGetter || hasSetter)) {
    throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
}
```
分析supportsAccessors代码逻辑：
```js
var supportsAccessors = owns(prototypeOfObject, '__defineGetter__');
```
通过断点调试，supportsAccessors值为false且hasGetter或者hasSetter时抛出了异常，也就是说当前js引擎不支持访问器属性，却在属性描述符中设置了get，set,那么就会抛出异常。查看 [defineGetter](“defineGetter”的兼容情况是只兼容IE11) 的兼容情况，只兼容IE11，虽然IE9、IE10同样不支持defineGetter,不过他们直接支持Object.defineProperty方法和get语法，无需sham，所以代码并不会走到异常这里。但是IE8以下就扯淡了。解决这种情况只能修改源代码了。

至此，Webpack打包时，IE低版本浏览器(IE8及以下)遇到的兼容问题就总结这里，如果你有新的问题，欢迎留言。

感谢您的阅读