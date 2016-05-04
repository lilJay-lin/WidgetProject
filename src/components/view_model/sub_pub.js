/**
 * Created by linxiaojie on 2016/5/4.
 */
let  $ = require('jquery');
let $o = $({});

function uuid(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

/*
 *  ��֪���ݱ仯����װԪ���ݣ��ṩ���ݸ��·���
 *  ����������ȾDOM, DOM��Ҫ�ṩһ�ֱ�ʾ������֪��Ҫ��Ⱦ���ĸ��ڵ�
 *  ���ݱ仯������DOM
 *  DOM�仯��������
 */
class Tue{
    constructor(el, opts){
        this.$el = $(el);
        this.data = opts.data || {};
        this._message = uuid() + '_data';
        this._dom = uuid() + '_dom';
        this.render();
    }
    set(key, value){
        let data = this.data;
        if(data[key] !== value && key in data){
            data[key] = value;
            $o.trigger(this._dom, [key, value]);
        }
    }
    get(key){
        return this.data[key];
    }
    render(){
        let data = this.data;
        $(document.body).on('change', (e) => {
            let $elem = $(e.target);
            let key = $elem.attr('v-model');
            let value = '';
            if($elem.is('input,textarea,select')){
                value = $elem.val();
            }else{
                value = $elem.text();
            }
            if(!!key){
                $o.trigger(this._message, [key, value])
            }
        });

        $o.on(this._message, (event, key, value) => {
            if(data[key] != value){
                this.set(key, value);
            }
        });

        $o.on(this._dom, (event, key, value) => {
            this.$el.find('[v-model="' + key + '"]').each((idx, el) => {
                let $elem = $(el);
                let key = $elem.attr('v-model');
                if($elem.is('input,textarea,select')){
                    $elem.val(data[key]);
                }else{
                    $elem.text(data[key]);
                }
            });
            console.log(this.data);
        });


        for(var key in data){
            if(data.hasOwnProperty(key)){
                $o.trigger(this._dom, [key, data[key]]);
            }
        }

    }
}


export default  Tue;