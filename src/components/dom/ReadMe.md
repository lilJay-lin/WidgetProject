
#DOM���ò���

�ο��� https://github.com/remy/min.js.git

* �¼��󶨣� ����Node��NodeListԭ������ `on`��`trigger`,ͨ��event.data��������
* �ڵ�ѡ�� `$(el)`����NodeList
* css����: `$.css(el, props)`����/��ȡ��ʽ
* class���ò���: `addClass`��`removeClass`��`toggleClass`��`hasClass`

## �¼���

�¼���ʹ��ԭ��`dom.addEventListener`����

�¼�����ʹ��`document.createEvent('HTMLEvent')`��ʼ���¼����¼����ݴ����`event.data`���ڴ����¼��Ľڵ����ɷ��¼����¼�ȡ��ð�ݺ�Ĭ����Ϊ

## �ڵ�ѡ��

ֱ��ʹ��`document.querySelectorAll`����NodeList

## css����

* 1.������ʽ�� �ж������Ƿ���Ҫ��ǰ׺��Webkit, Moz, O, ms��,������ʵ���Բ����õ�`el.style`��
* 2.��ȡ���ԣ�ͬ���Ȼ�ȡ��ʵ���ԣ���`window.computeStyle` ���� `node.currentStyle`��ȡ��������ֵ

## class����

ʹ��`node.classList`ʵ��class�Ĳ�����֧�ֶ��class�ַ�������
