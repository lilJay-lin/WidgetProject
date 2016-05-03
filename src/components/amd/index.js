/**
 * Created by linxiaojie on 2016/4/28.
 */

import {config, define, require} from './amd';

window.define = define;
window.require = require;

config({
   baseUrl: './amd',
   package: [
      {
         name: 'dist',
         location: '../../dist'
      }
   ],
   shim: {
      'some/module': {
         deps: ['b', 'path'],
         exports: 'some.module', /*Ĭ��ֵ*/
         init: function(a, path){
            console.log('some/module is loaded');
            console.log('some/module deps path:' + path.loaded);
            return {
               loaded: true
            }
         }
      }
   },
   paths: {
      path: "file:///D:/github/WidgetProject/build/path"
   },
   map: {
       '*':{
           'path': 'path1.0'
       }
   }
});
/*define(['a'], function(){
   console.log('i am index');
});*/

