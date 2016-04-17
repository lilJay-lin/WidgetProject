/**
 * Created by liljay on 2016/4/17.
 */

 function Controller(){
    this.init.apply(this, arguments);
}
Controller.extend = function(fnProperties, classProperties){
    $.extend(this, classProperties);
    $.extend(this.prototype, fnProperties);
    return this;
};
Controller.prototype = {
    constructor: Controller,
    init: function(element){
        this.$el = $(element);
        this.refreshElements();
        this.delegateEvents();
    },
    eventSplitter: /^(\w+)\s*(.*)$/,
    elements: {},
    events: {},
    refreshElements: function(){
        var me = this;
        for(var elem in me.elements){
            var name = me.elements[elem];
            if(name.trim() !== '' ){
                me['$' + name ] = me.$(elem);
            }
        }
    },
    delegateEvents: function(){
        var me = this,
            events = me.events;
        for(var key in events){
            var methodName = events[key];
            var m = this[methodName];
            console.log(m);
            if(m == void 0){
                continue;
            }
            var method = $.proxy(m, me);
            var match = key.match(me.eventSplitter);
            var eventName = match[1],
                selector = match[2];
            console.log(me.$el);
            if(selector ===  ''){
                me.$el.on(eventName, method);
            }else{
                me.$el.delegate(selector, eventName, method);
            }
        }
    },
    $: function(elem){
        return this.$el.find(elem);
    }
};

module.exports = Controller;