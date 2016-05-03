/**
 * Created by linxiaojie on 2016/4/28.
 */
import util from '../util/util';

let each = util.each;
let module = {},
    parseConfig = {baseUrl: '', package: [], shim: {}, paths: {}, map: {}},
    loadingJs = []/*等待加载完成的模块*/,
    loadedJs = [],/*已经加载的模块，不重复加载*/
    hasCircleReference = false;


/*
 * 模块定义
 * @param {String} id
 * @param {Array} deps
 * @param {Function} factory
 */
function define(id, deps, factory){
    if(!util.isString(id) && arguments.length == 2){
        factory = deps;
        deps = id;
        id = null;
    }

    id = id || getCurrentScript();
    let script = document.querySelector('script[src="' + id + '"]');
    if(script || id in parseConfig.shim){
        let mId = script && script.getAttribute('data-module') || id;
        let map = getMapSetting(mId);
        if(map){
            deps = deps.map((dep) => {
                return map[dep] || dep;
            });
        }
    }

    if(module[id]){
        console.error('multiple define module: ' + id);
    }

    if(!hasCircleReference){
        require(deps, factory, id);
    }
}

/*
* 判断是否环形依赖
*/
function checkCircleReference(start, target){
    let mod = module[start];
    if(!mod){
        return false;
    }
    let depModules = mod.deps.map((dep) =>{
        return module[dep] || null;
    });
    return depModules.some((m) => {
        if(!m){
            return false;
        }
        return m.deps.some((d) => {
            let circle = d === target;
            if(circle){
                console.error("circle reference: ", target, m.id);
            }
            return circle;
        });
    }) ? true : depModules.some((m) => {
        if(!m){
            return false;
        }
        return m.deps.some((d) => {
            return checkCircleReference(d, target);
        });
    });
}

/*
* 获取map配置
*/
function getMapSetting(id){
    let map = parseConfig.map;
    if(map[id]){
        return map[id];
    }else if(map['*']){
        return map['*'];
    }else{
        return null;
    }
}

/*
 * 获取当前模块ID
 */
function getCurrentScript(){
    let id = document.currentScript && document.currentScript.src || '';
    if(id == ''){
        let scripts = document.querySelectorAll('script');
        each(scripts, (script) => {
            if(script.className === 'module' && script.readyState == 'interactive'){
                id =  script.src;
            }
        });
    }
    return id.replace(/\.js$/, '');
}

/*
 * 加载模块
 *
 * 加载依赖是复杂的，这里换种思路：
 * 1. 有依赖就加载，无依赖或者依赖已加载则运行
 * 2. 每加载一个
 * 2.1判断是否所有依赖已加载，已加载执行
 * 2.2 执行所有模块的依赖检查，发现有正在加载的依赖已加载完，则运行并重复2.2
 *
 */
let defIdPrefix = '_AMD_';
function require(deps, factory, parentId){
    let id = parentId || defIdPrefix + Date.now(),
        dn = deps.length,
        n = 0;
    /*
     * 模块的绝对路径：
     * 1. 有package名，以package.location为根路径
     * 2. . or ..开头，以父模块为根路径
     * 3. 正常路径，以baseUrl为根路径
     *
     * 以下路径不处理：
     * 1. shim模块
     * 2. paths模块
     *
     */
    let orgDeps = deps.slice();
    deps = deps.map((dep) => {
        if(module[dep]){/*shim*/
            return dep;
        }else if(dep in parseConfig.paths){/*paths*/
            return dep;
        }
        let rel = '';
        if(parentId.startsWith(defIdPrefix)){
            rel = parseConfig.baseUrl;
        }else{
            let ps = parentId.split('/');
            ps.pop();
            rel = ps.join('/');
        }
        //console.log(dep + '  ' +rel);
        return getModuleUrl(dep, rel);
    });

    let mod = module[id] = {
        id: id,
        deps: deps,
        factory: factory,
        exports: {},
        state: 1
    };

    if(checkCircleReference(id, id)){
        hasCircleReference = true;
        return ;
    }

    each(deps, function(id, i){
        let depMod = module[id];
        if(depMod && depMod.state == 2){
            n ++;
        }else if(!(depMod && depMod.state == 1) && loadedJs.indexOf(id) == -1){
            loadJs(id, orgDeps[i]);
            loadedJs.push(id);
        }
    });

    if(n == dn){
        callbackFactory(id);
    }else{
        loadingJs.push(id);
    }
}

/*
 * 获取模块路径
 * 1. 有package名，以package.location为根路径
 * 2. . or ..开头，以父模块为根路径
 * 3. 正常路径，以baseUrl为根路径
 */
function getModuleUrl(moduleId, rel){
    let mts = moduleId.split('/');
    let m = mts[0];
    let location = ((name) => {
        let location = '';
        each(parseConfig.package, (pkg) =>{
            if(name === pkg.name){
                location = pkg.location;
            }
        })
        return location;
    })(m);
    if(location){
        //console.log(location);
        mts.shift();
        return getRouter(location, mts.join('/'));
    }else if(m === '.' || m === '..'){
        return getRouter(rel, moduleId);
    }else{
        return getRouter(parseConfig.baseUrl, moduleId);
    }
}

/*
 * javascript加载
 * @param {String} id
 * @param {String} oId 原始ID
 */
function loadJs(id, oId){
    let head = document.querySelector('head');
    let script = document.createElement('script');
    script.setAttribute('data-module', oId);
    id = parseConfig.paths[id] || id;
    script.type = 'text/javascript';
    script.src = id + '.js';
    script.onload = function(){
        if(hasCircleReference){
            return;
        }
        let mod = module[id];
        if(mod && isReady(mod) && loadingJs.indexOf(id) > -1){
            callbackFactory(id);
        }
        checkDeps();
    };
    head.appendChild(script);
}

/*
 * 检测模块是否加载完成，已完成执行回调
 */
function callbackFactory(id){
    let mod = module[id],
        idx = loadingJs.indexOf(id);
    let args = [];
    let deps = mod.deps;
    each(deps, (id) => {
        args.push(module[id].exports);
    });
    mod.exports = mod.factory.apply(mod.exports, args);
    mod.state = 2;
    idx > -1 && loadingJs.splice(idx, 1);
}

/*
 * 检测模块所有依赖已加载
 */

function isReady(mod){
    let readyState = (() => {
        let deps = mod.deps;
        let res = true;
        each(deps, (id) => {
            if(!(module[id] && module[id].state == 2)){
                res = false;
            }
        });
        return res;
    })();

    return readyState;
}

/*
 * 检查所有模块
 */
function checkDeps(){
    each(module, (mod, id) => {
        if(mod && isReady(mod) && loadingJs.indexOf(id) > -1){
            callbackFactory(id);
            checkDeps();
        }
    });
}


/*
 * 获取路径
 */
function getRouter(base, target){
    let bs = base.replace(/\/$/, '').split('/');
    let tars = target.replace(/\/$/, '').split('/');
    let c ;
    while(isDefined((c = tars[0]))){
        if(c == '.'){
            return bs.join('/') + '/' + tars.slice(1).join('/');
        }else if(c == '..'){
            bs.pop();
            tars.shift();
        }else{
            return bs.join('/') + '/' + tars.join('/');
        }
    }
}

function isDefined(s){
    return s !== null && s !== undefined;
}

/*
 * 解析config配置
 */

function config(cfg){
    let baseUrl  = cfg.baseUrl ;
    if(baseUrl){
        let curUrl = getCurrentScript();
        let curs = curUrl.split('/');
        curs.pop();
        curUrl = curs.join('/');
        baseUrl = parseConfig.baseUrl = getRouter(curUrl, baseUrl);
    }
    let packages = cfg.package || [];
    each(packages, (pkg) => {
        parseConfig.package.push({
            name: pkg.name,
            location: getRouter(baseUrl, pkg.location)
        })
    });


    parseConfig.paths = cfg.paths || {};
    parseConfig.map = cfg.map || {};
    let shim = parseConfig.shim = cfg.shim || {};
    if(shim){
        each(shim, (obj, id) => {
           define(id, obj.deps, function(){
               let value = obj.init.apply(this, arguments);
               return value == undefined ? obj.exports : value;
           });
        });
    }
    //console.log(parseConfig);
}

export {config, define, require};