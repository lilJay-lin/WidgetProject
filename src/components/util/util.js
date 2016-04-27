/**
 * Created by linxiaojie on 2016/4/26.
 */

function property(key){
    return function(obj){
        return obj == null ? obj : obj[key];
    }
}

/*
* 是否是数组
*/
const MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
let getLength = property('length');
function isArrayLike(obj){
    let length = getLength(obj);
    return typeof  length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
}

/*
 * 函数代理
 */
function proxy(iteratee, context){
    return function(){
        iteratee.apply(context, slice.call(arguments));
    }
}

function each(obj, iteratee, context){
    var cb = context == void 0 ? iteratee : proxy(iteratee, context);
    if(isArrayLike(obj)){
        let i , len;
        for(i = 0, len = obj.length; i < len; i++){
            cb(obj[i], i, obj);
        }
    }else{
        let keys = Object.keys(obj),key , i, len;
        for(i = 0, len = keys.length; i < len; i++){
            key = keys[i];
            if(obj.hasOwnProperty(key)){
                cb(obj[key], key, obj);
            }
        }
    }
}

/*
 * 判断对象类型
 */
let _ = {};
let toString = Object.prototype.toString;
function typeOf(type){
    return function(obj){
        if(obj == null){
            obj = String(obj);
        }
        return toString.call(obj) === type
    }
};
each(['Array', 'Object', 'Function', 'Null', 'String'], function(type){
    _['is' + type] = typeOf('[object ' + type + ']');
});

_.each = each;
_.isArrayLike = isArrayLike;
_.proxy = proxy;

export {_ as default};