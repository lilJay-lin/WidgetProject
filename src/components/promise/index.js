/**
 * Created by linxiaojie on 2016/5/5.
 */
require('babel-polyfill');
import Promise from './promise';

let p1 = new Promise((resolve, reject) => {
    setTimeout(() => resolve('all check1'), 2000)
})
let p2 = new Promise((resolve, reject) => {
    setTimeout(() => reject('all check2'), 1000)
})
/*
Promise.all(['1', p1, p2]).then((value) => {
    console.log(value.toString());
}, (value) => console.log('fail: ' + value))
*/

Promise.race([p1, p2]).then((value) => {
    console.log(value.toString());
}, (value) => console.log('fail: ' + value))

/*
let p = new Promise(function(resolve,  reject){
    resolve('hello');
});

p.then((str) => {
    console.log(str);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject('resolve promise call');
        },1000)
    });
}, (err) => {
    console.log(err);
}).then((s) => {
    console.log(s);
}, (err) => {
    console.log(err);
});*/
