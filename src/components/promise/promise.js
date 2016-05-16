/**
 * Created by linxiaojie on 2016/5/5.
 */
import Util from '../util/util';

class Promise {
    constructor(resolver){
        if(!Util.isFunction(resolver)){
            throw new Error('must pass a function as the firsst argument');
        }
        if(!(this instanceof Promise)){
            return new Promise(resolver);
        }
        let me = this;
        me._state = 'pending';
        me._done = [];
        me._fail = [];
        me._value = null;
        me._reason = null;
        resolver(me.resolve.bind(this), me.reject.bind(this));
    }
    resolve(value){
        var me = this;
        if(me._state !== 'pending'){
            return ;
        }
        me._state  = 'fulfilled';
        me._value = value;
        for(let i = 0, l = me._done.length; i < l; i++){
            me._value = me._done[i].apply(null , [value]);
        }
    }
    reject(reason){
        var me = this;
        if(me._state !== 'pending'){
            return ;
        }
        me._state = 'rejected';
        me._reason = reason;
        for(let i = 0, l = me._fail.length; i < l; i++){
            me._reason = me._fail[i].apply(null , [reason]);
        }
    }
    then(done, fail){
        let promise = this;
        /*后续的then存在当前包装的new promise里*/
        return new Promise((resolve, reject) => {
            function callback(value){
                let rel = Util.isFunction(done) && done(value) || value;
                /*如果返回promise,则依据promise的结果来处理我们包装的promise结果*/
                if(Promise.isThenable(rel)){
                    rel.then((value) => {
                        resolve(value);
                    }, (reason) =>{
                        reject(reason);
                    })
                }else{
                    resolve(value);
                }
            }

            function errCallback(reason){
                reason = Util.isFunction(fail) && fail(reason) || reason;
                reject(reason);
            }

            var state = promise._state;
            if(state == 'pending'){
                promise._done.push(callback);
                promise._fail.push(errCallback);
            }else if(state == 'fulfilled'){
                callback(promise._value)
            }else if(state == 'rejected'){
                errCallback(promise.reason);
            }
        });
    }
}
Promise.isThenable = (obj) =>{
    return obj && typeof obj['then'] == 'function';
};

Promise.resolve = (value) => {
    if(!(value instanceof Promise)){
        return new Promise((resolve, reject) => {
            resolve(value)
        })
    }
    return value;
}
Promise.reject = (value) => {
    if(!(value instanceof Promise)){
        return new Promise((resolve, reject) => {
            reject(value)
        })
    }
    return value;
}

Promise.all = (arg) => {
    arg = [].slice.call(arg);
    let remaining = arg.length;
    let res = [];
    return new Promise((resolve, reject) => {
        for(let v of arg.values()){
            let p = v;
            if(!(v instanceof Promise)){
                p = Promise.resolve(v)
            }
            p.then((value) => {
                res.push(value);
                if(--remaining === 0){
                    resolve(res);
                }
            }, (value) => {
                reject(value);
            })
        }
    })

}
Promise.race= (arg) => {
    arg = [].slice.call(arg);
    let over = 0;
    return new Promise((resolve, reject) => {
        for(let v of arg.values()){
            if(over) return;
            let p = v;
            if(!(v instanceof Promise)){
                p = Promise.resolve(v)
            }
            p.then((value) => {
                resolve(value);
            }, (value) => {
                reject(value);
            })
        }
    })
}
export default Promise;