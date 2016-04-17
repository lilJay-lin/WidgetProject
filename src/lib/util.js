/**
 * Created by liljay on 2016/4/17.
 */
var toString = Object.prototype.toString;

function type(obj){
    return {
        o: toString.call(obj) == '[object Object]',
        f: toString.call(obj) == '[object Function]',
        a: toString.call(obj) == '[object Array]'
    }
}

function each(obj, iterator, context){
    var t = type(obj);
    if(t.a){
       var i = 0, l = obj.length;
        for(; i < l; i++){
            if(iterator.call(context, i, obj[i], obj)){
                break;
            }
        };
    }else if(t.o){
        var keys = obj.keys();
        for( var key in keys ){
            if(obj.hasOwnProperty(key)){
                if(iterator.call(context, key, obj[key], obj)){
                    break;
                }
            }
        }
    }
}

function extend(target, source){
    each(source, function(key, value){
        target[key] = value;
    }, target);
};

module.exports = {
    type: type,
    each: each,
    extend: extend
};