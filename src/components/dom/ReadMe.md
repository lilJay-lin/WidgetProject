
#DOM常用操作

参考： https://github.com/remy/min.js.git

* 事件绑定： 绑定在Node和NodeList原型链上 `on`、`trigger`,通过event.data传递数据
* 节点选择： `$(el)`返回NodeList
* css操作: `$.css(el, props)`设置/获取样式
* class常用操作: `addClass`、`removeClass`、`toggleClass`、`hasClass`

## 事件绑定

事件绑定使用原生`dom.addEventListener`方法

事件触发使用`document.createEvent('HTMLEvent')`初始化事件，事件数据存放在`event.data`，在触发事件的节点上派发事件，事件取消冒泡和默认行为

## 节点选择

直接使用`document.querySelectorAll`返回NodeList

## css操作

* 1.设置样式， 判断属性是否需要加前缀（Webkit, Moz, O, ms）,返回真实属性并设置到`el.style`上
* 2.读取属性，同样先获取真实属性，从`window.computeStyle` 或者 `node.currentStyle`获取真正属性值

## class操作

使用`node.classList`实现class的操作，支持多个class字符串设置
