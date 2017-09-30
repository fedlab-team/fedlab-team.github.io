---
title: 煦涵说JSON
author:
   nick: 煦涵
   github_name: zuojj
date: 2017-04-30 17:00
categories: 煦涵说
tags: json
thumb: http://www.zuojj.com/wp-content/uploads/2017/05/0-1.jpeg
---
JSON(Javascript Object Notaion, javascript 对象表示法)， 是一种数据交换格式，能够在服务器端交换数据， 2001年由Douglas Crockford提出，目的是取代繁琐笨重的XML格式。

JSON 数据格式的优点：
* 与语言无关的文本数据格式
* 轻量、简单、易维护
* 是javascript编程语言的一个子集(**Standard ECMA-262 3rd Edition - December 1999**)， 符合javascript 语言语法，可以使用javascript提供的方法直接解析处理

JSON 建立在两种数据结构上：
* 键 / 值对：各种语言中可以为 字符串、对象、数组或者哈希表
* 有序列表（值）：各种语言中实现为数组、向量、列表或者序列

## JSON的基本语法：
* JSON 对象
```json
{
    "key": value
}
```
* JSON 数组
```json
[value, value, value]
```
* value 可取值
value 可以是 String(必须使用双引号包裹)、Number、Boolean、null、Object、Array, 这些形式可以嵌套，value值不能是八进制、十六进制（0xF0F）、undefined、function、日期对象，看下面示例：

合格的 JSON 格式：
```js
{ 
    "name": "煦涵", 
    "name": null, 
    "male": true, 
    "age": 23
}

{ 
    "brother": ["煦涵1", "煦涵2"]
}

{ 
    "brother": {
        "煦涵1": {
            "age": 32
        },
        "煦涵2": {
            "age": 30
        }
    }
}

[{
    "name": "煦涵”
    "age": 30
},{
    "name": "张三”
    "age": 27
}]
```
不合格的 JSON 格式：
```js
// key 必须用双引号包裹，value 如果是字符串必须用双引号包裹

{ 'name': "煦涵" } 
[1, 2, 3, 4, oxFOF] 
{ 'name': undefined } 
{ 
    'name': function() { 
        return "煦涵"
    } 
}
{ 'name': new Date() }  
```
如果value的一个String（双引号包围）内包含 `\"`、`\\`、`\/`、`\b`、`\f`、`\n`、`\r`、`\t`、`\u001f` 需要使用反斜杠
如果value的一个Number，不能使用八进制和十六进制数值
PS： value对空格没有限制要求


## JSON 对象
聊完 JSON 下面我们来聊聊 JSON 对象，javascript 在 ES5中新增了 JSON 对象，用来处理 JSON 文本数据，实现字符串与 JSON 对象间的相互转换，`JSON.stringify ( value [ , replacer [ , space ] ] )` 和 `JSON.parse ( text [ , reviver ] )`， 前者是把 JSON 对象转换为 JSON 字符串，后者的把 JSON 字符串解析为 JSON 对象，下面来详细看看这个两个方法。

### JSON.stringify ( value [ , replacer [ , space ] ] )

1. 第一个参数： Value 必须项，可以是 Object, Array, String, Boolean, Number, Null.看几个例子：

```js
JSON.stringify({
    "name": "煦涵",
    "age" : 28,
    "male" : true,
    "brother": [1, 2, 3],
    "parent": {
        "father" : {
            "name": "name"
        },
        "mother": {
            "name": "name"
        }
    },
    "other": null
})

// result
"{"name":"煦涵","age":28,"male":true,"brother":["B1","B2","B3"],"parent":{"father":{"name":"name"},"mother":{"name":"name"}},"other":null}" 
```

当待转换值不是 JSON 的基本类型时：
* 原始对象 item 值是 undefined、函数或 XML 对象，值会被过滤；
* 数组 item 是 undefined、函数或 XML 对象，值会被转成 null；
* 正则对象会被转换成空对象；
* 对象的不可遍历属性会被忽略；
* 八进制和十六进制会被转换成十进制;
* 特殊字符需要转义成反斜杠

```js
JSON.stringify({
    "name": undefined,
    "age" : function() {return 28},
    "male" : /male/g,
    "brother": [undefined, function() {return abc}, "B3", 0xFOF],
    "parent": {
        "father" : {
            "name": undefined
        },
        "mother": {
            "name": "name"
        }
    },
    "other": null
})

// result: 正则被转出了空对象，undefined, function 被忽略或者转成 null

"{"male":{},"brother":[null,null,"B3", 3855],"parent":{"father":{},"mother":{"name":"name"}},"other":null}"

/* 不可遍历属性 */
var demo = {};
Object.defineProperties(demo, {
    "name": {
        value: "煦涵",
        enumerable: false
    },
    "age": {
        value: 28,
        enumerable: true
    }
})
JSON.stringify(demo);

// enumerable: 当且仅当该属性的 enumerable 为 true 时，该属性才能够出现在对象的枚举属性中,
// result: name 属性会被过滤
"{"age":28}"

/* 特殊字符处理-01 */
JSON.stringify({
    "special01": "回车 \r，换行 \n，退格 \b，换页 \f，Tab \t",
    "special02": "双引号 \"，单引号 ', 斜杠 \/, 反斜杠 \\",
    "special03": "unicdoe字符 \u001f"
})

// result
"{"special01":"回车 \r，换行 \n，退格 \b，换页 \f，Tab \t","special02":"双引号 \"，单引号 ', 斜杠 /, 反斜杠 \\","special03":"unicdoe字符 \u001f"}"

/* 特殊字符处理-02 */
var demo = {}
demo.special01 = '回车 \r，换行 \n，退格 \b，换页 \f，Tab \t';
demo.special02 = '双引号 "，斜杠 /, 反斜杠\，end ';
demo.special03 = 'unicdoe字符 \u001f';
JSON.stringify(demo);

// result, 双引号被转义了，反斜杠被忽略了
"{"special01":"回车 \r，换行 \n，退格 \b，换页 \f，Tab \t","special02":"双引号 \"，斜杠 /, 反斜杠，end ","special03":"unicdoe字符 \u001f"}"
```

2. 第二个参数：replacer可选项，可以是 array or function
* 当replacer 是数组时，对第一个参数 value进行过滤，key 不在数组里的不会输出，这里需要注意的是，当第一个参数为Object时才有效，如果为Array，无效，看下面例子：
* 当replacer 是函数时，递归遍历所有的键，可以对对象进行format and replace 等操作

```js
/* replacer 为数组 */
JSON.stringify({
    "0": "安徽省",
    "1": "蚌埠市",
    "2": "固镇县"
}, [0,1])
// result:
"{"0":"安徽省","1":"蚌埠市"}"

JSON.stringify([
    "安徽省",
    "蚌埠市",
    "固镇县"
], [0,1])

// result
"["安徽省","蚌埠市","固镇县"]"


/* replacer 为函数 */
JSON.stringify({
    "0": "安徽省",
    "1": "蚌埠市",
    "2": "固镇县"
}, function(key, value) {
    // key: '', value: {0: "安徽省", 1: "蚌埠市", 2: "固镇县"}
    console.log(key, value);
    return value[0] + value[1] + value[2];
})
// result
""安徽省蚌埠市固镇县""
```

3. 第三个参数：space 可选项，用于增加format字符的可读性，可取值 Number, String, 但长度不超过10个字符
```js
JSON.stringify({"name": "煦涵", "age": 28, "male": true, "other": null}, '', 4)

// result 
"{
    "name": "煦涵",
    "age": 28,
    "male": true,
    "other": null
}"

JSON.stringify({"level1": {"level2": {"level3": {"name": "煦涵"} } } }, '', '|---')

// result: 展示属性结构很直观
"{
|---"level1": {
|---|---"level2": {
|---|---|---"level3": {
|---|---|---|---"name": "煦涵"
|---|---|---}
|---|---}
|---}
}"
```
4. 特殊情况
还记得上面的几种情况吧，当对象不是原始对象时，处理方式有所不同，比如正则表达式时，会返回空对象，日期对象时返回日期字符串;参看文档是，JSON.stringify发现参数对象有toJSON方法，就直接使用这个方法的返回值作为参数，而忽略原对象的其他参数。

```js
JSON.stringify({
    "name": "煦涵",
    "age": 28,
    "toJSON": function() {
        return this.name + '年龄是' + this.age + '岁'
    }
})
// result:
""煦涵年龄是28岁""

/* 日期对象Date原型上包含toJSON 方法，`Date.prototype.toJSON ( key )` */
var date = new Date();
date.toJSON();
JSON.stringify(date);

/* RegExp 对象 JSON.stringify 默认会把正则转换成空对象，我们可以使用toJSON, 把正则表达式转换成字符串 */
RegExp.prototype.toJSON = RegExp.prototype.toString;
JSON.stringify(/abc/g)
// result
""/abc/g""
```


### JSON.parse ( text [ , reviver ] )
JSON.parse为 JSON.stringify的逆运算，转换时 text 必须符合JSON的语法格式， 不然会报错，reviver 参数 和 JSON.stringify 的参数 replacer类似， 但是遍历顺序和replacer相反。
```js
JSON.parse('{"name":"煦涵","age":28,"male":true,"brother":["B1","B2","B3"],"parent":{"father":{"name":"name"},"mother":{"name":"name"}},"other":null}' )

/* result:
{
    "name": "煦涵",
    "age" : 28,
    "male" : true,
    "brother": ["B1", "B2", "B3"],
    "parent": {
        "father" : {
            "name": "name"
        },
        "mother": {
            "name": "name"
        }
    },
    "other": null
}
*/

JSON.parse('{"level1": {"level2": {"name": "煦涵"} } }', function(key, value) {
    // level2 Object {name: "煦涵"}
    // level1 Object {level2: Object}
    // Object {level1: Object}
    console.log(key, value);
    return value;
})

// result
{"level1":{"level2":{"name":"煦涵"}}}
```

## 参考文档：
[http://www.ecma-international.org/ecma-262/5.1/#sec-15.12](http://www.ecma-international.org/ecma-262/5.1/#sec-15.12)
[https://github.com/douglascrockford/JSON-js/blob/master/json2.js](https://github.com/douglascrockford/JSON-js/blob/master/json2.js)
[http://www.json.org/](http://www.json.org/)