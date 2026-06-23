# x-dc 마크업(_page.html) → React JSX 변환기
import re, html
from html.parser import HTMLParser

VOID = {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
EVENT_MAP = {'onclick':'onClick','oninput':'onInput','onchange':'onChange','onkeydown':'onKeyDown',
             'onkeyup':'onKeyUp','onsubmit':'onSubmit','onfocus':'onFocus','onblur':'onBlur',
             'onmousedown':'onMouseDown','onpointerdown':'onPointerDown','ontouchstart':'onTouchStart'}
ATTR_MAP = {'class':'className','for':'htmlFor','tabindex':'tabIndex','maxlength':'maxLength',
            'autocomplete':'autoComplete','readonly':'readOnly','colspan':'colSpan','rowspan':'rowSpan',
            'srcset':'srcSet','novalidate':'noValidate','contenteditable':'contentEditable'}

DYN = re.compile(r'^\{\{\s*(.+?)\s*\}\}$')        # 통째 동적값
INLINE = re.compile(r'\{\{\s*(.+?)\s*\}\}')        # 텍스트 내 바인딩

def conv_attr(k, v):
    kl = k.lower()
    if kl == 'hint-placeholder-val':
        return None
    if kl == 'style':
        m = DYN.match(v)
        if m: return f'style={{css({pybind(m.group(1))})}}'
        return 'style={css(' + ts(v) + ')}'
    if kl in EVENT_MAP:
        m = DYN.match(v)
        if m: return f'{EVENT_MAP[kl]}={{{pybind(m.group(1))}}}'
        return None
    rk = ATTR_MAP.get(kl, kl)
    m = DYN.match(v)
    if m: return f'{rk}={{{pybind(m.group(1))}}}'
    return f'{rk}={tjsx(v)}'

LOOPVARS=[]
def pybind(expr):
    expr = expr.strip()
    first = expr.split('.')[0].split('[')[0]
    if first in LOOPVARS: return expr
    # {{ goPlanner }} -> v.goPlanner ; {{ true }} -> true
    expr = expr.strip()
    if expr in ('true','false','null'): return expr
    if re.match(r'^[a-zA-Z_$][\w$]*$', expr): return 'v.'+expr
    return 'v.'+expr  # 단순 식별자만 등장(검증됨)

def ts(s):  # 문자열 → JS 리터럴. 내부 {{x}} 보간 있으면 백틱 템플릿.
    if INLINE.search(s):
        body = INLINE.sub(lambda m: '${'+pybind(m.group(1))+'}', s)
        body = body.replace('`','\\`').replace('\n',' ')
        return '`'+body+'`'
    return '"' + s.replace('\\','\\\\').replace('"','\\"').replace('\n',' ') + '"'

def tjsx(s):  # 정적 속성값
    return '"' + s.replace('"','&quot;') + '"'

class C(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.out=[]
        self.scif=[]  # sc-if 스택
    def handle_starttag(self, tag, attrs):
        self._start(tag, attrs, self_close=False)
    def handle_startendtag(self, tag, attrs):
        self._start(tag, attrs, self_close=True)
    def _start(self, tag, attrs, self_close):
        if tag=='sc-if':
            d=dict(attrs)
            val=d.get('value','')
            m=DYN.match(val) if val else None
            key=pybind(m.group(1)) if m else 'true'
            self.out.append(f'{{{key} ? (<>')
            self.scif.append(True)
            return
        if tag=='sc-for':
            d=dict(attrs)
            lm=DYN.match(d.get('list',''))
            lst=pybind(lm.group(1)) if lm else '[]'
            asv=d.get('as','item')
            LOOPVARS.append(asv)
            self.out.append(f'{{({lst}||[]).map(({asv}, $i) => (<Fragment key={{$i}}>')
            return
        parts=[]
        for k,v in attrs:
            if v is None: v=''
            a=conv_attr(k,v)
            if a: parts.append(a)
        attrstr=(' '+' '.join(parts)) if parts else ''
        if tag in VOID or self_close:
            self.out.append(f'<{tag}{attrstr} />')
        else:
            self.out.append(f'<{tag}{attrstr}>')
    def handle_endtag(self, tag):
        if tag=='sc-if':
            if self.scif:
                self.scif.pop()
                self.out.append('</>) : null}')
            return
        if tag=='sc-for':
            if LOOPVARS: LOOPVARS.pop()
            self.out.append('</Fragment>))}')
            return
        if tag in VOID: return
        self.out.append(f'</{tag}>')
    def handle_data(self, data):
        if not data.strip() and '\n' in data:
            self.out.append(data); return
        # 텍스트 바인딩 {{x}} -> {v.x}
        def rep(m): return '{'+pybind(m.group(1))+'}'
        txt=INLINE.sub(rep, data)
        self.out.append(txt)
    def handle_entityref(self, name):
        self.out.append(f'&{name};')
    def handle_charref(self, name):
        self.out.append(f'&#{name};')
    def handle_comment(self, data):
        pass  # 주석 제거

# 입력: </style> 이후 ~ </x-dc> 이전의 div 마크업
t=open('_page.html').read()
i=t.rfind('</style>')
mk=t[i+8:]
mk=mk.split('</x-dc>')[0]
mk=mk.replace('</helmet>','').strip()

p=C(); p.feed(mk); p.close()
jsx=''.join(p.out)
open('_screens_raw.txt','w').write(jsx)
print('변환 완료. JSX 길이:',len(jsx))
print('sc-if 잔류 스택:',len(p.scif))
# 검증: 변환 안 된 흔적
for bad in ['{{','sc-if','onclick=','class=','style="']:
    print(f'  잔류 {bad!r}: {jsx.count(bad)}')
print('--- 앞 900자 ---')
print(jsx[:900])

# === App.tsx 생성 ===
WWW='/Users/jangminseok/Project/cloud.adapdog/www/src'
app = '''// @ts-nocheck
// 통합 프로토타입(발자국 앱 (통합).html)에서 자동 변환된 화면 마크업.
// 디자인은 인라인 스타일 그대로 보존. 상태/핸들러는 useApp(), CSS 문자열은 css()로 처리.
import { Fragment } from 'react';\nimport { css } from './lib/css';
import { useApp } from './useApp';

export default function App() {
  const v = useApp();
  return (
''' + jsx.rstrip() + '''
  );
}
'''
import os
os.makedirs(WWW, exist_ok=True)
open(os.path.join(WWW,'App.tsx'),'w').write(app)
print('www/src/App.tsx 생성:',len(app),'자')
