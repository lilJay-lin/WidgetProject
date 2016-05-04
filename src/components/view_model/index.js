/**
 * Created by linxiaojie on 2016/5/3.
 */
//import Tue from './sub_pub';
    import Tue from './define_property';
let $ = require('jquery');
let data = {
    name: 'liljay',
    age: '27'
};
let tue = new Tue('#container', {
    data: data
});

$("#add").on('click', (e) => {
    tue.set('age', parseInt(tue.get('age')) + 1)
});



