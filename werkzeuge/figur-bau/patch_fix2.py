# Korrekturen 27.11.: Englisch als Startsprache, kein Beispiel beim Spitznamen,
# Geschlechter wie in großen Apps (Männlich, Weiblich, Nicht-binär, Eigene Angabe + Keine Angabe),
# Einstellung "Chat mit Mo oder Sarah" entfernt.
# Aufruf: python3 patch_fix2.py <eingabe.html> <ausgabe.html>
import sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:120])
    s = s.replace(old, new)

# 1) Englisch als Startsprache (auch für bisherige Nutzer, solange sie nie selbst eine Sprache gewählt haben)
rep('lang:"Deutsch",done:false};', 'lang:"English",done:false};')
rep('var prof=Object.assign({},DEF,ls("lg_prof")||{});',
    'var prof=Object.assign({},DEF,ls("lg_prof")||{});\nif(!prof.langSet)prof.lang="English";')
rep('go:function(){choose("Sprache","lang",LN,function(){applyLang()})}',
    'go:function(){choose("Sprache","lang",LN,function(){prof.langSet=true;saveProf();applyLang()})}')
rep('prof=Object.assign({},DEF,{lang:prof.lang,theme:prof.theme});prof.uid=newUid();',
    'prof=Object.assign({},DEF,{lang:prof.lang,theme:prof.theme,langSet:prof.langSet});prof.uid=newUid();')

# 2) Spitzname ohne "zum Beispiel"
rep(' maxlength="20" placeholder="zum Beispiel Momo">', ' maxlength="20">')
rep(',ac:"nickname",ph:"zum Beispiel Momo"}', ',ac:"nickname"}')

rep(',ph:"zum Beispiel mia.styles"}', '}')
# 3) Geschlecht
rep('''<div class="gopts" id="oGender"><button type="button" data-v="Männlich">Männlich</button><button type="button" data-v="Weiblich">Weiblich</button><button type="button" data-v="Trans Mann">Trans Mann</button><button type="button" data-v="Trans Frau">Trans Frau</button><button type="button" data-v="Nicht-binär">Nicht-binär</button></div>''',
    '''<div class="gopts" id="oGender"><button type="button" data-v="Männlich">Männlich</button><button type="button" data-v="Weiblich">Weiblich</button><button type="button" data-v="Nicht-binär">Nicht-binär</button><button type="button" data-v="Eigene Angabe">Eigene Angabe</button></div>
      <input id="oGC" class="hidden" type="text" maxlength="30" aria-label="Dein Geschlecht" placeholder="Dein Geschlecht">''')
rep('var GEN=["Männlich","Weiblich","Trans Mann","Trans Frau","Nicht-binär"];',
    'var GEN=["Männlich","Weiblich","Nicht-binär","Eigene Angabe"];')
rep('''document.querySelectorAll("#onb [data-v]").forEach(function(b){b.onclick=function(){ob.gender=b.dataset.v;document.querySelectorAll("#onb [data-v]").forEach(function(x){x.setAttribute("aria-pressed",String(x===b))})}});''',
    '''document.querySelectorAll("#onb [data-v]").forEach(function(b){b.onclick=function(){ob.gender=b.dataset.v;document.querySelectorAll("#onb [data-v]").forEach(function(x){x.setAttribute("aria-pressed",String(x===b))});
  var c=b.dataset.v==="Eigene Angabe";$("oGC").classList.toggle("hidden",!c);if(c)setTimeout(function(){$("oGC").focus()},30)}});''')
rep('''  if(!ob.gender)return oerr("Bitte wähle eine Option.");prof.birth=b;prof.gender=ob.gender;return true}''',
    '''  if(!ob.gender)return oerr("Bitte wähle eine Option.");var gc=$("oGC").value.trim();if(ob.gender==="Eigene Angabe"&&!gc)return oerr("Beschreibe dein Geschlecht.");
  prof.birth=b;prof.gender=ob.gender;prof.gcustom=ob.gender==="Eigene Angabe"?gc:"";return true}''')
# Profil bearbeiten: Feld für die eigene Angabe erscheint nur, wenn "Eigene Angabe" gewählt ist
rep('''        b.onclick=function(){vals[f.id]=o;Array.prototype.forEach.call(g.children,function(x){x.setAttribute("aria-pressed",String(x===b))})};g.appendChild(b)});
      w.appendChild(g)}''',
    '''        b.onclick=function(){vals[f.id]=o;Array.prototype.forEach.call(g.children,function(x){x.setAttribute("aria-pressed",String(x===b))});if(oi)oi.classList.toggle("hidden",o!==f.other.opt)};g.appendChild(b)});
      w.appendChild(g);var oi=null;
      if(f.other){oi=el("input");oi.type="text";oi.maxLength=30;oi.value=f.other.val||"";oi.setAttribute("aria-label",tr(f.other.label));oi.placeholder=tr(f.other.label);oi.classList.toggle("hidden",vals[f.id]!==f.other.opt);ins[f.other.id]=oi;w.appendChild(oi)}}''')
rep('''{id:"gender",label:"Geschlecht",opts:GEN.concat("Keine Angabe"),val:prof.gender}],''',
    '''{id:"gender",label:"Geschlecht",opts:GEN.concat("Keine Angabe"),val:prof.gender,other:{id:"gc",opt:"Eigene Angabe",label:"Dein Geschlecht",val:prof.gcustom}}],''')
rep('''    if(!v.gender)return"Bitte wähle eine Option.";''',
    '''    if(!v.gender)return"Bitte wähle eine Option.";if(v.gender==="Eigene Angabe"&&!v.gc)return"Beschreibe dein Geschlecht.";prof.gcustom=v.gender==="Eigene Angabe"?v.gc:"";''')
rep('''({"Männlich":"male","Weiblich":"female","Trans Mann":"trans man","Trans Frau":"trans woman","Nicht-binär":"non-binary","Andere":"other"}[prof.gender]||prof.gender)''',
    '''(prof.gender==="Eigene Angabe"?(prof.gcustom||"custom"):({"Männlich":"male","Weiblich":"female","Trans Mann":"trans man","Trans Frau":"trans woman","Nicht-binär":"non-binary","Andere":"other"}[prof.gender]||prof.gender))''')
# Formular-Eingaben im Profil sehen aus wie die anderen Felder
rep('#opanel .fl input{', '#panel .fl input[type=text]:not(.hidden),#opanel .fl input{')

# 4) "Chat mit Mo oder Sarah" aus den Einstellungen entfernen
rep('{i:"chat",t:"Chat mit Mo oder Sarah",s:"Persönliche Stilberatung",seg:"ai",o:["Mo","Sarah"]},', '')

TR = {
"Eigene Angabe":"Custom|Personnalisé|Personalizado|Personalizado|مخصص|अपना विवरण|自定义",
"Dein Geschlecht":"Your gender|Ton genre|Tu género|O teu género|جنسك|आपका जेंडर|你的性别",
"Beschreibe dein Geschlecht.":"Describe your gender.|Décris ton genre.|Describe tu género.|Descreve o teu género.|صِف جنسك.|अपना जेंडर लिखें।|请描述你的性别。",
}
for k, v in TR.items():
    assert len(v.split('|')) == 7 and ('\n"%s":' % k) not in s, k
rep('\nvar D={\n', '\nvar D={\n' + ''.join('"%s":"%s",\n' % kv for kv in TR.items()))
open(dst, 'w', encoding='utf-8').write(s)
print('ok')
