title: 煦涵说CSS：当组件化开发遇上自定义属性级联变量
subtitle: 你是时候该使用 CSS 自定义属性级联变量了
cover: 
date: 2017-09-03 17:00
categories: 煦涵说
tags:
  - css
  - css variable
author:
    nick: 煦涵
    github_name: zuojj
wechat:
    share_cover: 
    share_title: 当组件化开发遇上自定义属性级联变量
    share_desc: 你是时候该使用 CSS 自定义属性级联变量了


---

<!-- more -->

自2015年12月W3C发布[自定义属性级联变量](https://www.w3.org/TR/css-variables/)推荐性规范已经有一段时间了，今天本文首先会对自定义属性使用做一个基本的介绍，后面将主要讲述在我们日常组件开发中CSS自定义的应用。浏览器兼容性参见[CSS Variables (Custom Properties)](http://caniuse.com/#search=custom%20proper)

## 属性定义
基本语法：--<custom-property-name>: <cutome-propery-value>，以“--”开头（为了和Sass/Less等预处理器变量进行区分），自定义属性名对大小写敏感，`--foo` 和 `--FOO` 会映射到不同的值。

```css
:root {
    --btn-color: #fff;
}

.btn {
    color: var(--btn-color);
}

```

## 使用自定义属性

基本语法：<css-property-name>: var(<custom-property-name>[,<declaration-value>]);此处括号的意思是如果<custom-property-name>没有指定值，则使用<declaration-value>值。这个扩展非常有用，比如我们做多皮肤主题时，可以使用此语法设置默认皮肤。

### CSS 自定义属性遵循 CSS 级联及继承规则
* 定义全局变量

```css
:root {
    --global-variables: 'global-value';
    --bg-color: #f0f;
}
```
* 定义组件局部变量

```css
.header {
    --bg-color: #f00;
    height: 20px;
    background-color: var(--bg-color);
}
.main {
    /* use global variable --bg-color: #f0f */
    background-color: var(--bg-color);
}
.footer {
    --bg-color: #00f;
    height: 20px;
    background-color: var(--bg-color);
}
```

### 循环依赖
* 示例一：

```css
:root {
  --a: calc(var(--b) + 20px);
  --b: calc(var(--a) - 20px);
}
/* box的 width 和 height 仍为初始值，自定义属性无效 */
.box {
    width: var(--a);
    height: var(--b);
}
```

* 示例二：
```html
<style>
    :root {
        --font-size: 40px;
    }
    .parent {
        font-size: var(--font-size);
    }
    .son {
        --son: calc(var(--font-size) * 2);
        /* font-size: 80px */
        font-size: var(--son);
    }
    .grandson {
        --font-size: calc(var(--son) * 2);
        /* font-size: 160px */
        font-size: var(--font-size);
    }
</style>
<span class="parent">
    parent 
    <span class="son">
        on 
        <span class="grandson">grandson</span>
    </span>
</span>
```

### 多皮肤主题中的应用

```html
<style>
    :root {
        --default-color: #000;
    }

    body {
        margin: 0;
        color: #fff;
    }

    .header {
        text-align: center;
        background-color: var(--default-color);
    }

    .main {
        background-color: #fff;
    }

    .footer {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        background: linear-gradient(to bottom, #ccc, var(--default-color));
    }
    select {
        width: 100px;
        height: 24px;
        font-size: 14px;
        line-height: 24px;
        color: #333;
        border: 1px solid #ccc;
        background-color: none;
    }
</style>
<header class="header">
    <select id="theme-select">
        <option value="#000" selected>Black</option>
        <option value="#f00">Red</option>
        <option value="#00f">Blue</option>
    </select>
</header>
<section class="main">
    Main
</section>
<footer class="footer">
    Footer
</footer>
<script>
    /* change theme */
    document.querySelector('#theme-select').addEventListener('change', function() {
        document.documentElement.style.setProperty("--default-color", this.value);
    }, false);
</script>
```

### 组件化开发中的应用
开发一个 Button 组件，并使用 CSS 自定义属性。
```html
<style>
    .btn-groups {
        display: flex;
        flex-wrap: wrap;
        padding: 10px 5px;
        background-color: #eee;
    }

    .btn {
        --btnColor: #5eb5ff;
        border: 1px solid var(--btnColor);
        color: var(--btnColor);
        background-color: white;
        padding: 10px 25px;
        text-decoration: none;
        font-family: "Output Sans";
        font-weight: 600;
        border-radius: 3px;
        margin: 5px;
        transition: all .3s ease;
    }

    .btn-red {
        --btnColor: #ff6969;
    }

    .btn-green {
        --btnColor: #7ae07a;
    }

    .btn-gray {
        --btnColor: #555;
    }

    .btn-purple {
        --btnColor: #ef34ef;
    }

    .btn:hover {
        color: #fff;
        background-color: var(--btnColor);
    }

    .btn:active {
        opacity: .6;
    }
</style>
<div class="btn-groups">
    <a href='javascript:void(0)' class='btn'>Submit</a>
    <a href='javascript:void(0)' class='btn btn-red'>Submit</a>
    <a href='javascript:void(0)' class='btn btn-green'>Submit</a>
    <a href='javascript:void(0)' class='btn btn-gray'>Submit</a>
    <a href='javascript:void(0)' class='btn btn-purple'>Submit</a>
</div>
```
## 浏览器检测
1.CSS @supports 检测
```css
@supports ( (--a: 0)) {
  /* supported */
}

@supports ( not (--a: 0)) {
  /* not supported */
}
```

2.javascript检测
```js
const isSupported = window.CSS &&
    window.CSS.supports && window.CSS.supports('--a', 0);

if (isSupported) {
  /* supported */
} else {
  /* not supported */
}
```
## 总结
通过上面内容，我们了解了CSS自定义属性的定义、语法、检测、应用、示例及与javascript交互，同时我们也了解到 CSS 自定义属性的优点。如果你还没有使用过 CSS 自定义属性，动手get起来吧。

感谢您的阅读

<div style="margin:5px auto;padding-top:1.2em;padding-bottom:0.6em;">
    <div style="font-size:1em; border-style: solid none none; border-top-width: 1px; border-color: rgb(17, 17, 17); color: rgb(204, 204, 204);"></div>
    <div style="margin-top: -0.7em;text-align:center;line-height:1.4;">
    <span style="padding:8px 23px;background-color:#fff;color:#000;margin-top:-1em;">EOF</span>
    </div>
</div>

<p style="font-size: 12px; color: #8e8e8e">作者[煦涵]</p>
<p style="font-size: 12px; color: #8e8e8e">2017年09月02日</p>

<div style="text-align: center; font-size: 12px; color: #8e8e8e;">
    <div>下面是「FED实验室」的微信公众号二维码，欢迎扫描关注：</div>
    <img src="https://cloud.githubusercontent.com/assets/5378965/26525703/ba3707ac-4392-11e7-8a99-db27837f9c3c.jpg" alt="关注FED实验室" title="关注FED实验室">
</div>
