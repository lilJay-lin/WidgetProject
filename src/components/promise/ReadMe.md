# Promise

�첽�ص�

TODO: ~~����ʵ�������ṩresolve,reject���¶���״̬~~
TODO: ~~�ṩthen�������溯��������״̬�ı�ʱ����~~
TODO: then ����promise,��thenable
TODO: all/race

## 

then ��ʽ��

* 1. Promise��ִ�й��̣� new Promiseִ��resolver����룬�����ִ��resolve or reject ������
    resolve������ �޸�Promise״̬Ϊfulfilled; ִ��then���õĻص��������з���ֵ����_value
    reject������ �޸�Promise״̬Ϊrejected; ִ��then���õĻص��������з���ֵ����_reason
* 2.then(done, fail) new һ��promise��������ʽ����,������then�������Ǽ��ڴ�promise�����ϵ�
    new Promise�ǻᴥ��1���̣�resolver��������£�
    ��װdone�������ж�doneִ��֮���Ƿ񷵻�promise��������ǣ�����Ҫ�ѵ�ǰdone/fail�������ڴ�promise�����then�������洦�����ǣ�ֱ��ִ��resolve����
    ��װfail������ֱ��ִ��reject�������ı�״̬��ִ��reject������
* 3. ����Promise.resolve�� Promise.reject��װ��promiseʵ��Ϊpromiseʵ����
     Promise.all(arg)�������µ�Proimseʵ����ѭ��arg����װΪpromiseʵ�������ñ���remaining��ÿһ��promise.resolve������remaining--������0ʱ����resolve����
     ֻҪ��һ��Ϊreject,�����reject����
     Promise.race��all��ֻ࣬�ǵ���resolve��reject��ʱ����һ��