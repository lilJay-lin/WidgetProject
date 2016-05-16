/**
 * Created by linxiaojie on 2016/4/26.
 */
/*
* native object reference
*/
let arrayProto = Array.prototype,
    objectProto = Object.prototype,
    stringProto = String.prototype;

/*
    native method
*/
let hasOwnProperty = objectProto.hasOwnProperty;
let toString = objectProto.toString;

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
            if(hasOwnProperty.call(obj, key)){
                cb(obj[key], key, obj);
            }
        }
    }
}

/*
 * 判断对象类型
 */
let _ = {};
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



/*
 * 1. 是对象
 * 2. 是普通对象： 本身无constructor属性（非function)，原型链上有!(constructor,比起原型链上有constructor instanceof 原型链上有constructor);
 *    Object普通对象（通过字面量、Object和Object.create(null)实例化）
 *    Object instanceof Object
 */
function isPlainObject(value){
    let Ctor;
    if(!isObjectLike(value) ||
        !hasOwnProperty.call(value, 'constructor') &&
        (Ctor = value.constructor, _.isFunction(Ctor) && !(Ctor instanceof Ctor))){
        return false;
    }
    let result ;
    each(value, function(v, key){
        result = key;
    });

    return result === undefined || hasOwnProperty.call(value, result);
}

function isObjectLike(value){
    return !!value && _.isObject(value);
}


/*
 *复制对象
 * @param {Boolean} deep
 *@param {Object} obj
 *@param {Object} target
 *
 */
function extend(deep, obj, target){
    if(arguments.length < 2){
        throw new Error('arguments must to be as least 2 argument');
    }

    if(arguments.length === 2){
        target = obj;
        obj = deep;
        deep = false;
    }

    if(obj === undefined){
        throw new Error('base obj arguments must to be set as an object');
    }

    if(!(isPlainObject(target) || isArray(target))){
        obj = target;
    }

    each(target, function(value, key){
        if(deep){
            if(isPlainObject(value)){
                obj[key] = extend(deep, {}, value);
            }else if(isArray(value)){
                obj[key] = extend(deep, [], value);
            }else{
                obj[key] = value;
            }
        }else {
            obj[key] = value;
        }

    });

    return obj;
}


_.each = each;
_.isArrayLike = isArrayLike;
_.proxy = proxy;
_.isPlainObject = isPlainObject;
export {_ as default};