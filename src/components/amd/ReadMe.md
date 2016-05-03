# AMD

TODO: ~定义模块，异步加载模块~
TODO: ~支持config配置baseurl和package~
TODO: ~shim与paths的支持~
TODO: ~map多版本支持~
TODO: ~环行依赖判断~

参考：http://www.cnblogs.com/dojo-lzz/p/5138108.html

## 定义模块，异步加载模块

要点： 模块load成功时，运行全模块依赖检查

* 1.`denfine(deps, factory)`定义模块和模块依赖，处理委托给`require(deps, factory, parentId)`
* 2.如果模块所有依赖已加载，则运行模块；有依赖未加载，则执行依赖加载，挂起为正在加载的模块
* 3.模块远程加载成功(js运行从1开始），判断如果依赖全部加载，并且是挂起加载中的模块，则执行模块；运行全模块检查
* 4.模块检查，判断如果依赖全部加载，并且是挂起加载中的模块，则执行模块并运行模块加载（4）

## 支持config配置baseUrl和package

baseUrl根路径，package包路径

* 1.定义方法getRouter(base, target)，根据指定base路径获取target文件路径，分三种情况处理：target为相对当前路径；上一层路径；绝对路径
* 2.初始化配置的路径表parseConfig：baseUrl转为getRouter(getCurrentScript(), baseUrl);package配置的路径转为getRouter(baseUrrl, package.location);
* 3.转换模块的deps依赖文件路径：有父依赖rel=父路径，无父依赖rel=baseUrl;getModuleUrl(dep, rel);
* 4.getModuleUrl(dep,rel)处理： 判断dep是否包含package包名，如有返回路径getRouter(dep(去掉包名）, package.location);dep是否'.'/'..'开头，getRouter(dep, rel);其他情况返回getRouter(parseConfig.baseUrl, moduleId);

## shim与paths

shim把不支持模块的全局变量或代码块，封装为模块导出;paths 自定义模块的加载路径


* 1.对shim模块执行define包装，init() == undefine时返回exports作为默认值
* 2.define需要增加id配置
* 3.require加载依赖判断是shim模块，不做路径处理
* 4.paths支持，如果依赖的模块是paths模块，替换加载地址为paths配置地址：模块ID必须和paths配置的一致，不一致会匹配不到。

## map多版本支持

比如A模块依赖jquery1.0,B模块依赖jquery2.0,map就是用来解决这种依赖不同版本模块的问题

* 1.map配置使用的是原始的模块id,所以需要再define的时候先把原始ID保存起来，可保存作为script标签属性
* 2.转换模块路径时判断： map如果配置了通配符'*',这对通配符配置的所有模块做指定版本转换; 如果是配置map的模块，对指定模块做版本转换

## 环形依赖判断

A的所有依赖项的依赖是否依赖模块A，如果是，则为环形依赖。

* 1. 判断是否环形依赖，环形依赖终止加载