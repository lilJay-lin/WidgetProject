# AMD

TODO: ~~����ģ�飬�첽����ģ��~~

TODO: ~~֧��config����baseurl��package~~

TODO: ~~shim��paths��֧��~~

TODO: ~~map��汾֧��~~

TODO: ~~���������ж�~~

�ο���http://www.cnblogs.com/dojo-lzz/p/5138108.html

## ����ģ�飬�첽����ģ��

Ҫ�㣺 ģ��load�ɹ�ʱ������ȫģ���������

* 1.`denfine(deps, factory)`����ģ���ģ������������ί�и�`require(deps, factory, parentId)`
* 2.���ģ�����������Ѽ��أ�������ģ�飻������δ���أ���ִ���������أ�����Ϊ���ڼ��ص�ģ��
* 3.ģ��Զ�̼��سɹ�(js���д�1��ʼ�����ж��������ȫ�����أ������ǹ�������е�ģ�飬��ִ��ģ�飻����ȫģ����
* 4.ģ���飬�ж��������ȫ�����أ������ǹ�������е�ģ�飬��ִ��ģ�鲢����ģ����أ�4��

## ֧��config����baseUrl��package

baseUrl��·����package��·��

* 1.���巽��getRouter(base, target)������ָ��base·����ȡtarget�ļ�·�����������������targetΪ��Ե�ǰ·������һ��·��������·��
* 2.��ʼ�����õ�·����parseConfig��baseUrlתΪgetRouter(getCurrentScript(), baseUrl);package���õ�·��תΪgetRouter(baseUrrl, package.location);
* 3.ת��ģ���deps�����ļ�·�����и�����rel=��·�����޸�����rel=baseUrl;getModuleUrl(dep, rel);
* 4.getModuleUrl(dep,rel)���� �ж�dep�Ƿ����package���������з���·��getRouter(dep(ȥ��������, package.location);dep�Ƿ�'.'/'..'��ͷ��getRouter(dep, rel);�����������getRouter(parseConfig.baseUrl, moduleId);

## shim��paths

shim�Ѳ�֧��ģ���ȫ�ֱ��������飬��װΪģ�鵼��;paths �Զ���ģ��ļ���·��


* 1.��shimģ��ִ��define��װ��init() == undefineʱ����exports��ΪĬ��ֵ
* 2.define��Ҫ����id����
* 3.require���������ж���shimģ�飬����·������
* 4.paths֧�֣����������ģ����pathsģ�飬�滻���ص�ַΪpaths���õ�ַ��ģ��ID�����paths���õ�һ�£���һ�»�ƥ�䲻����

## map��汾֧��

����Aģ������jquery1.0,Bģ������jquery2.0,map���������������������ͬ�汾ģ�������

* 1.map����ʹ�õ���ԭʼ��ģ��id,������Ҫ��define��ʱ���Ȱ�ԭʼID�����������ɱ�����Ϊscript��ǩ����
* 2.ת��ģ��·��ʱ�жϣ� map���������ͨ���'*',���ͨ������õ�����ģ����ָ���汾ת��; ���������map��ģ�飬��ָ��ģ�����汾ת��

## ���������ж�

A������������������Ƿ�����ģ��A������ǣ���Ϊ����������

* 1.�ж��Ƿ�������������������ֹ����