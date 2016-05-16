# Promise

异步回调

TODO: ~~对象实例化，提供resolve,reject更新对象状态~~
TODO: ~~提供then方法保存函数，对象状态改变时调用~~
TODO: then 返回promise,可thenable
TODO: all/race

## 

then 链式：

* 1. Promise的执行过程： new Promise执行resolver块代码，代码块执行resolve or reject 方法；
    resolve触发： 修改Promise状态为fulfilled; 执行then设置的回调函数；有返回值更新_value
    reject触发： 修改Promise状态为rejected; 执行then设置的回调函数；有返回值更新_reason
* 2.then(done, fail) new 一个promise对象做链式操作,后续的then调用则是加在此promise对象上的
    new Promise是会触发1过程，resolver代码块如下：
    封装done方法，判断done执行之后是否返回promise对象，如果是，则需要把当前done/fail方法放在此promise对象的then方法里面处理；不是，直接执行resolve方法
    封装fail方法，直接执行reject方法（改变状态，执行reject方法）
* 3. 新增Promise.resolve， Promise.reject封装非promise实例为promise实例；
     Promise.all(arg)，返回新的Proimse实例，循环arg，封装为promise实例，设置变量remaining，每一个promise.resolve调用是remaining--，等于0时调用resolve处理
     只要有一个为reject,则调用reject处理；
     Promise.race和all差不多，只是调用resolve和reject的时机不一样