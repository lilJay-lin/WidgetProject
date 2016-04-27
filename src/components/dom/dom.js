/**
 * Created by linxiaojie on 2016/4/26.
 */
import _ from '../util/util';
let each = _.each;
let isArrayLike = _.isArrayLike;
/*
* TODO: document.querySelectorAll 使用代理函数，执行会报错
* 节点选择器
* @param {string} selector
* @return {NodeList | Element }
*/
let $ = function(selector){
    /*let r = document.querySelectorAll(selector),
        length = r.length;
    return length == 1 ? r[0] : r;*/
    return document.querySelectorAll(selector);
};

/*
 * class操作
 * addClass removeClass 返回节点本身
 * toggleClass hasClass 返回boolean
 */
let addClass = 'addClass',
    removeClass = 'removeClass',
    toggleClass = 'toggleClass',
    hasClass = 'hasClass';
const ClASSES_SPLIT = /(\S+)(?:\s+)?/gi;
function classOperation(oper){
    return function(el, classes){
        if(classes == void 0) return this;
        if(el.nodeType !== 1) throw new Error('argument el must be a element');
        classes = String(classes);
        let v = null, res ;
        while((v = ClASSES_SPLIT.exec(classes))){
            res = el.classList[oper](v[1]);
        }
        return res == undefined ? this : res;
    }
}
function classOperationDone(classOperation){
    return function(els, classes){
        if(arguments.length < 2) throw new Error('arguments must not be least than 2');
        els = isArrayLike(els) ? els : [els];
        let res ;
        each(els, function(el){
            res = classOperation(el, classes);
        });
        return res == undefined ? this : res;
    }
}
$[addClass] = classOperationDone(classOperation('add'));
$[removeClass] = classOperationDone(classOperation('remove'));
$[toggleClass] = classOperationDone(classOperation('toggle'));
$[hasClass] = classOperationDone(classOperation('contains'));

/*
* 事件操作
*/
let dummy = document.createElement('i'),
    trigger = 'trigger'
$.on = function (els, type, fn){
    if(els == void 0) return this;
    if(typeof els == 'string'){
        fn = typeof type == 'function' ? type : function f(){};
        type = els;
        els = [dummy];
    }else{
        els = isArrayLike(els) ? els : [els];
    }
    each(els, function(el){
        el.addEventListener(type, fn, false);
    });
    return this;
};
$[trigger] = function(els, type, data){
    if(els == void 0) return this;
    if(typeof els == 'string'){
        type = els;
        els = [dummy];
    }else{
        els = isArrayLike(els) ? els : [els];
    }
    each(els, function(el){
        let event = document.createEvent('HTMLEvents');
        event.initEvent(type, true, true);
        event.data = data || {};
        event.eventName = type;
        /*target 只有getter*/
        //event.target = this;
        el.dispatchEvent(event);
    });
    return this;
};

/*
 * 样式操作
 */
function cssStyle(el){
    if(window.getComputedStyle){
        return el.ownerDocument.defaultView.getComputedStyle(el, null);
    }else{
        return el.currentStyle;
    }
}
let cssPrefixes = ['Webkit', 'moz', 'o', 'ms'];
function cssProperty(prop, style){
    if(style[prop] != undefined) return prop;
    let className = prop.substr(0, 1).toUpperCase() + prop.substr(1);
    let original = prop;
    each(cssPrefixes, function(prefix){
        prop = prefix + className;
        if(style[prop] != undefined) {
            original = prop;
        }
    });
    return original;
}
$.css = function(el, props){
    if(el && el.nodeType != 1){
        throw new Error('el must be element')
    }
    if(arguments.length < 2){
        throw new Error('arguments must not be least than 2')
    }
    let style = el.style;
    if(typeof props == 'string'){
        return cssStyle(el)[props];
    }else{
        each(props, function(value, prop){
            prop = cssProperty(prop, style);
            style[prop] = value;
        });
    }
    return this;
};

export {$ as default}  ;