# Korrekturen Anmeldung/Konto/Onboarding auf Basis der Tag-1-Version.
# Aufruf: python3 patch_konto.py <eingabe.html> <ausgabe.html>
import sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:120])
    s = s.replace(old, new)

def rep_lines(start, end, new):
    """Ersetzt alles ab der Zeile, die mit start beginnt, bis vor die Zeile, die mit end beginnt."""
    global s
    a = s.index('\n' + start) + 1
    assert s.count('\n' + start) == 1, start
    b = s.index('\n' + end, a) + 1
    s = s[:a] + new + s[b:]

# ---------- CSS ----------
CSS = r'''
.gopts{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.gopts button{min-height:50px;padding:0 12px;border-radius:16px;border:1.5px solid var(--line);background:var(--card);font-weight:600;cursor:pointer}
.gopts button:last-child:nth-child(odd){grid-column:1/-1}
.gopts button[aria-pressed="true"]{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
.gopts.one{grid-template-columns:1fr;margin-top:2px}
.gopts.one button{color:var(--muted)}
.gopts.one button[aria-pressed="true"]{color:var(--accent-ink)}
.datef{position:relative;min-height:52px;border-radius:16px;border:1.5px solid var(--line);background:var(--card);display:flex;align-items:center;padding-inline:16px 50px;font-size:1rem;cursor:pointer}
.datef:focus-within{outline:3px solid var(--focus);outline-offset:2px}
.datef svg{position:absolute;inset-inline-end:14px;top:50%;width:22px;height:22px;margin-top:-11px;fill:none;stroke:var(--muted);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;pointer-events:none}
#oBirthF input{position:absolute;inset:0;width:100%;height:100%;min-height:0;margin:0;padding:0;border:0;border-radius:16px;opacity:0;cursor:pointer;-webkit-appearance:none;appearance:none;background:transparent}
#opanel .fl input{min-height:52px;padding:0 16px;border-radius:16px;border:1.5px solid var(--line);background:var(--card);font-size:1rem}
.fid{display:grid;place-items:center;padding:6px 0 0}
.fid svg{width:78px;height:78px;fill:none;stroke:var(--ink);stroke-width:3;stroke-linecap:round;stroke-linejoin:round;animation:fidp 1s ease-in-out infinite}
.fid.ok svg{stroke:#2fa84f;animation:none}
@keyframes fidp{50%{transform:scale(.9);opacity:.6}}
.fidt{text-align:center;margin:0;font-weight:700}
.gacc{display:flex;align-items:center;gap:12px;width:100%;min-height:56px;padding:0 14px;border-radius:16px;border:1.5px solid var(--line);background:var(--card);cursor:pointer;font-weight:600;text-align:start;overflow:hidden}
.gacc .gi{flex:none;width:34px;height:34px;border-radius:50%;background:var(--line);display:grid;place-items:center;font-weight:800}
.gm{text-align:center;font-weight:600;margin:0;word-break:break-all}
'''
rep('\n</style>\n</head>', CSS + '</style>\n</head>')

# ---------- Onboarding-HTML: 1 Spitzname, 2 Name, 3 Geburtstag + Geschlecht ----------
rep('''    <div class="step" data-s="0"><h2>Wie heißt du?</h2><p class="sub">So spricht dich dein Stylist an.</p>
      <label>Vorname<input id="oFirst" type="text" autocomplete="given-name" maxlength="30"></label>
      <label>Nachname<input id="oLast" type="text" autocomplete="family-name" maxlength="40"></label></div>
    <div class="step hidden" data-s="1"><h2>Wann hast du Geburtstag?</h2><p class="sub">Daraus berechnen wir dein Alter.</p>
      <input id="oBirth" type="date" min="1920-01-01" aria-label="Geburtsdatum">
      <h3 style="margin-top:14px">Geschlecht</h3>
      <div class="opts" id="oGender"><button type="button" data-v="Männlich">Männlich</button><button type="button" data-v="Weiblich">Weiblich</button><button type="button" data-v="Andere">Andere</button><button type="button" data-v="Keine Angabe">Keine Angabe</button></div></div>''',
'''    <div class="step" data-s="0"><h2>Wie sollen wir dich nennen?</h2><p class="sub">So spricht dich dein Stylist an.</p>
      <label>Spitzname<input id="oNick" type="text" autocomplete="nickname" maxlength="20" placeholder="zum Beispiel Momo"></label></div>
    <div class="step hidden" data-s="1"><h2>Wie heißt du?</h2>
      <label>Vorname<input id="oFirst" type="text" autocomplete="given-name" maxlength="30"></label>
      <label>Nachname<input id="oLast" type="text" autocomplete="family-name" maxlength="40"></label></div>
    <div class="step hidden" data-s="2"><h2>Wann hast du Geburtstag?</h2>
      <div class="datef" id="oBirthF"><span id="oBirthT"></span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg><input id="oBirth" type="date" min="1920-01-01" aria-label="Geburtsdatum"></div>
      <h3 style="margin-top:14px">Geschlecht</h3>
      <div class="gopts" id="oGender"><button type="button" data-v="Männlich">Männlich</button><button type="button" data-v="Weiblich">Weiblich</button><button type="button" data-v="Trans Mann">Trans Mann</button><button type="button" data-v="Trans Frau">Trans Frau</button><button type="button" data-v="Nicht-binär">Nicht-binär</button></div>
      <div class="gopts one"><button type="button" data-v="Keine Angabe">Keine Angabe</button></div></div>''')

# ---------- Übersetzungen ----------
TR = {
"Wie sollen wir dich nennen?":"What should we call you?|Comment doit-on t'appeler ?|¿Cómo te llamamos?|Como te devemos chamar?|بماذا نناديك؟|हम आपको किस नाम से बुलाएँ?|我们该怎么称呼你？",
"Spitzname":"Nickname|Surnom|Apodo|Alcunha|اللقب|उपनाम|昵称",
"zum Beispiel Momo":"for example Momo|par exemple Momo|por ejemplo Momo|por exemplo Momo|مثلاً Momo|जैसे Momo|例如 Momo",
"Gib deinen Spitznamen ein.":"Enter your nickname.|Saisis ton surnom.|Escribe tu apodo.|Escreve a tua alcunha.|أدخل لقبك.|अपना उपनाम लिखें।|请输入你的昵称。",
"Nicht-binär":"Non-binary|Non binaire|No binario|Não binário|غير ثنائي|नॉन-बाइनरी|非二元",
"Trans Mann":"Trans man|Homme trans|Hombre trans|Homem trans|رجل عابر|ट्रांस पुरुष|跨性别男性",
"Trans Frau":"Trans woman|Femme trans|Mujer trans|Mulher trans|امرأة عابرة|ट्रांस महिला|跨性别女性",
"Mit Face ID fortfahren":"Continue with Face ID|Continuer avec Face ID|Continuar con Face ID|Continuar com Face ID|المتابعة باستخدام Face ID|Face ID से जारी रखें|使用面容 ID 继续",
"Mit Passwort fortfahren":"Continue with password|Continuer avec le mot de passe|Continuar con contraseña|Continuar com palavra-passe|المتابعة بكلمة المرور|पासवर्ड से जारी रखें|使用密码继续",
"Apple-ID-Passwort":"Apple ID password|Mot de passe de l'identifiant Apple|Contraseña del ID de Apple|Palavra-passe do ID Apple|كلمة سر Apple ID|Apple ID पासवर्ड|Apple ID 密码",
"Konto auswählen":"Choose an account|Choisir un compte|Elige una cuenta|Escolhe uma conta|اختر حساباً|खाता चुनें|选择账号",
"weiter zu Look Good":"to continue to Look Good|pour continuer vers Look Good|para continuar a Look Good|para continuar para Look Good|للمتابعة إلى Look Good|Look Good पर जारी रखने के लिए|以继续使用 Look Good",
"Anderes Konto verwenden":"Use another account|Utiliser un autre compte|Usar otra cuenta|Usar outra conta|استخدام حساب آخر|दूसरा खाता इस्तेमाल करें|使用其他账号",
"Du hast schon ein Konto":"You already have an account|Tu as déjà un compte|Ya tienes una cuenta|Já tens uma conta|لديك حساب بالفعل|आपका खाता पहले से है|你已经有账号了",
"Damit wurde schon ein Konto erstellt. Pro Apple-ID, E-Mail-Adresse und Telefonnummer gibt es nur ein Konto.":"An account was already created with this. There is only one account per Apple ID, email address and phone number.|Un compte a déjà été créé avec cet identifiant. Il n'existe qu'un seul compte par identifiant Apple, adresse e-mail et numéro de téléphone.|Ya se creó una cuenta con esto. Solo hay una cuenta por ID de Apple, correo electrónico y número de teléfono.|Já foi criada uma conta com isto. Só existe uma conta por ID Apple, endereço de e-mail e número de telefone.|تم إنشاء حساب بهذا من قبل. يوجد حساب واحد فقط لكل Apple ID وبريد إلكتروني ورقم هاتف.|इससे पहले ही एक खाता बनाया जा चुका है। हर Apple ID, ईमेल पते और फ़ोन नंबर पर सिर्फ़ एक खाता होता है।|已经用它创建过账号。每个 Apple ID、邮箱地址和手机号只能有一个账号。",
"Dieses Konto nutzt # zum Anmelden.":"This account signs in with #.|Ce compte se connecte avec #.|Esta cuenta inicia sesión con #.|Esta conta inicia sessão com #.|هذا الحساب يسجّل الدخول عبر #.|यह खाता # से साइन इन करता है।|此账号使用 # 登录。",
"Diese E-Mail gehört schon zu einem anderen Konto.":"This email already belongs to another account.|Cette adresse e-mail appartient déjà à un autre compte.|Este correo ya pertenece a otra cuenta.|Este e-mail já pertence a outra conta.|هذا البريد الإلكتروني مرتبط بحساب آخر.|यह ईमेल पहले से किसी दूसरे खाते का है।|该邮箱已属于另一个账号。",
"Konto wird geladen …":"Loading account …|Chargement du compte …|Cargando cuenta …|A carregar conta …|جارٍ تحميل الحساب …|खाता लोड हो रहा है …|正在加载账号 …",
"Passwort festlegen":"Set password|Définir un mot de passe|Crear contraseña|Definir palavra-passe|تعيين كلمة المرور|पासवर्ड सेट करें|设置密码",
"Das aktuelle Passwort ist falsch.":"The current password is wrong.|Le mot de passe actuel est incorrect.|La contraseña actual es incorrecta.|A palavra-passe atual está errada.|كلمة المرور الحالية غير صحيحة.|मौजूदा पासवर्ड गलत है।|当前密码不正确。",
"Freunde und Nachrichten":"Friends and messages|Amis et messages|Amigos y mensajes|Amigos e mensagens|الأصدقاء والرسائل|दोस्त और संदेश|好友和消息",
"Hier findest du bald deine Freunde.":"Your friends will be here soon.|Tes amis seront bientôt ici.|Pronto encontrarás aquí a tus amigos.|Em breve vais encontrar aqui os teus amigos.|ستجد أصدقاءك هنا قريباً.|जल्द ही यहाँ आपके दोस्त होंगे।|你的好友很快会出现在这里。",
"Abgemeldet. Deine Daten bleiben gespeichert.":"Logged out. Your data stays saved.|Déconnecté. Tes données restent enregistrées.|Sesión cerrada. Tus datos siguen guardados.|Sessão terminada. Os teus dados ficam guardados.|تم تسجيل الخروج. بياناتك تبقى محفوظة.|लॉग आउट हो गया। आपका डेटा सेव रहता है।|已退出登录。你的数据会保留。",
}
for k, v in TR.items():
    assert len(v.split('|')) == 7, k
    assert ('\n"%s":' % k) not in s, k
ins = ''.join('"%s":"%s",\n' % (k, v) for k, v in TR.items())
rep('\nvar D={\n', '\nvar D={\n' + ins)

# ---------- Start: angemeldet, aber Fragen noch nicht fertig -> Fragen ----------
rep('function finish(){if(done)return;done=true;if(prof.session&&prof.done)goHome();else welcome.classList.remove("hidden");',
    'function finish(){if(done)return;done=true;if(prof.session&&prof.done)goHome();else if(prof.session&&prof.uid){paintProf();startOnb()}else welcome.classList.remove("hidden");')

# ---------- Konten ----------
rep_lines('function pwh(x){', 'function osheet(build){', r'''function pwh(x){return"h"+hash("lg|"+x)}
/* ===== Konten =====
   Pro Apple-ID, Google-/E-Mail-Adresse und Telefonnummer gibt es genau ein Konto (Liste lg_ids: Anmeldeweg -> Konto).
   Prototyp ohne Server: alle Konten liegen auf diesem Gerät. Beim Abmelden und beim Kontowechsel wird das Konto
   komplett gesichert (Profil, Einstellungen, Städte, Figur, Outfit, Looks, KI-Chat, Kleidung mit Fotos) und beim
   Anmelden genau so wiederhergestellt. Mit dem Server wandert genau das in die Datenbank. */
var DK=["lg_prof","lg_cities","lg_avatar","lg_outfit","lg_looks","lg_aichat"];
function idk(a){return a.t==="phone"?"tel:"+a.id:a.t==="apple"?"apple:"+a.id:"mail:"+String(a.id).toLowerCase()}
function IDS(){return ls("lg_ids")||{}}
function owner(a){return IDS()[idk(a)]||null}
function regId(k,uid){var m=IDS();m[k]=uid;ls("lg_ids",m)}
function unregId(k){var m=IDS();delete m[k];ls("lg_ids",m)}
function unregUid(uid){var m=IDS();Object.keys(m).forEach(function(k){if(m[k]===uid)delete m[k]});ls("lg_ids",m)}
function newUid(){return"u"+Date.now().toString(36)+Math.random().toString(36).slice(2,8)}
function profOf(uid){if(uid&&uid===prof.uid)return prof;try{return JSON.parse(ls("lg_a_"+uid).data.lg_prof)}catch(e){return null}}
function vdb(){return new Promise(function(res){try{var r=indexedDB.open("lookgood_vault",1);r.onupgradeneeded=function(){r.result.createObjectStore("v")};r.onsuccess=function(){res(r.result)};r.onerror=function(){res(null)}}catch(e){res(null)}})}
function vDo(m,fn){return vdb().then(function(db){if(!db)return null;return new Promise(function(res){try{var t=db.transaction("v",m),q=fn(t.objectStore("v"));t.oncomplete=function(){db.close();res(q&&q.result!==undefined?q.result:true)};t.onerror=t.onabort=function(){db.close();res(null)}}catch(e){res(null)}})})}
function stash(){if(!prof.uid)return Promise.resolve();var uid=prof.uid,d={};saveProf();
  DK.forEach(function(k){var v=localStorage.getItem(k);if(v!=null)d[k]=v});
  try{localStorage.setItem("lg_a_"+uid,JSON.stringify({data:d,at:Date.now()}))}catch(e){}
  return idbDo("readonly",function(st){return st.getAll()}).then(function(items){return vDo("readwrite",function(st){return st.put(items||[],uid)})})}
function wipe(){DK.forEach(function(k){try{localStorage.removeItem(k)}catch(e){}});return idbDo("readwrite",function(st){return st.clear()})}
function unstash(uid){var r=ls("lg_a_"+uid)||{};return wipe().then(function(){var d=r.data||{};Object.keys(d).forEach(function(k){try{localStorage.setItem(k,d[k])}catch(e){}});
  return vDo("readonly",function(st){return st.get(uid)})}).then(function(items){return idbDo("readwrite",function(st){(items||[]).forEach(function(it){st.put(it)});return null})})}
function dropAcc(uid){unregUid(uid);try{localStorage.removeItem("lg_a_"+uid)}catch(e){}return vDo("readwrite",function(st){return st.delete(uid)})}
function enter(){clearInterval(cTimer);login.classList.add("hidden");closeO();if(prof.done){goHome();say("Willkommen zurück")}else startOnb()}
/* Anmelden: gehört der Anmeldeweg schon zu einem Konto, wird genau dieses Konto geöffnet, sonst ein neues erstellt. */
function auth(a,label,apply){var uid=owner(a);
  if(!uid)return create(a,label,apply);
  if(uid===prof.uid){if(apply)apply();prof.login=label;prof.session=true;saveProf();paintProf();return enter()}
  say("Konto wird geladen …");
  stash().then(function(){return unstash(uid)}).then(function(){prof=Object.assign({},DEF,ls("lg_prof")||{});if(apply)apply();prof.login=label;prof.session=true;saveProf();location.reload()})}
function create(a,label,apply){
  var mk=function(){prof=Object.assign({},DEF,{lang:prof.lang,theme:prof.theme});prof.uid=newUid();prof.acc={t:a.t,id:a.id};if(a.pw)prof.pw=a.pw;
    regId(idk(a),prof.uid);if(apply)apply();if(prof.email)regId("mail:"+prof.email.toLowerCase(),prof.uid);prof.login=label;prof.session=true;saveProf()};
  if(!prof.uid){mk();paintProf();return enter()}
  say("Konto wird geladen …");
  (prof.done?stash():dropAcc(prof.uid)).then(wipe).then(function(){mk();location.reload()})}
''')

rep_lines('function noAcc(go){', '/* Telefonnummer + SMS-Code */', r'''function noAcc(go){osheet(function(P){P.appendChild(el("h3","","Kein Konto gefunden"));P.appendChild(el("p","fine","Mit diesen Daten gibt es noch kein Konto. Möchtest du eins erstellen?"));
  var b=el("button","btn primary","Konto erstellen");b.type="button";b.onclick=function(){closeO();var ast=astep;showAuth("signup");if(ast==="ae")openMail();go()};P.appendChild(b)})}
function hasAcc(go){osheet(function(P){P.appendChild(el("h3","","Du hast schon ein Konto"));P.appendChild(el("p","fine","Damit wurde schon ein Konto erstellt. Pro Apple-ID, E-Mail-Adresse und Telefonnummer gibt es nur ein Konto."));
  var b=el("button","btn primary","Anmelden");b.type="button";b.onclick=function(){closeO();var ast=astep;showAuth("login");if(ast==="ae")openMail();if(go)go()};P.appendChild(b)})}
/* Apple / Google: Systemfenster wie auf dem Handy */
var FID='<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M6 20v-8a6 6 0 0 1 6-6h8M44 6h8a6 6 0 0 1 6 6v8M58 44v8a6 6 0 0 1-6 6h-8M20 58h-8a6 6 0 0 1-6-6v-8M22 23v6M42 23v6M33 23v13h-3M23 43c5 5 13 5 18 0"/></svg>',
    FOK='<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="26"/><path d="M20 33l8 8 16-17"/></svg>';
function sysHead(P,p,title,text){var box=el("div","sysbox"),lg=el("div","lg");
  if(p==="Apple"){lg.innerHTML=document.querySelector(".btn.apple svg").outerHTML;lg.style.background="#000";lg.style.color="#fff";lg.firstChild.style.cssText="width:34px;height:34px;fill:#fff;stroke:none"}
  else{lg.innerHTML='<span class="g" style="font-size:2.2rem">G</span>';lg.style.background="#fff";lg.style.border="1.5px solid var(--line)"}
  box.appendChild(lg);box.appendChild(el("h3","",title));if(text)box.appendChild(el("p","fine",text));P.appendChild(box)}
function provider(p){if(p==="Google")gPick();else appleSheet()}
/* Apple: die Apple-ID dieses Geräts, bestätigt mit Face ID oder Passwort */
var AID={t:"apple",id:"device"};
function appleSheet(){
  if(mode==="login"&&!owner(AID))return noAcc(appleSheet);
  if(mode==="signup"&&owner(AID))return hasAcc(appleSheet);
  osheet(function(P){sysHead(P,"Apple",ts(mode==="signup","Mit Apple registrieren","Mit Apple anmelden"),"„Look Good“ möchte deine Apple-ID zum Anmelden verwenden.");
    var f=el("div","fid hidden"),ft=el("p","fidt hidden");f.innerHTML=FID;P.appendChild(f);P.appendChild(ft);
    var pw=el("label","fl hidden"),inp=el("input");inp.type="password";inp.autocomplete="current-password";pw.appendChild(el("small","","Apple-ID-Passwort"));pw.appendChild(inp);
    var er=el("p","err"),b=el("button","btn apple","Mit Face ID fortfahren"),pwb=el("button","link","Mit Passwort fortfahren");b.type=pwb.type="button";
    var ok=function(){closeO();auth(AID,"Apple")};
    b.onclick=function(){
      if(!pw.classList.contains("hidden")){if(!inp.value){er.textContent=tr("Gib dein Passwort ein.");return}b.disabled=true;b.textContent="";b.appendChild(el("span","spin"));setTimeout(ok,800);return}
      b.classList.add("hidden");pwb.classList.add("hidden");f.classList.remove("hidden");ft.classList.remove("hidden");ft.textContent="Face ID";
      setTimeout(function(){f.classList.add("ok");f.innerHTML=FOK;ft.textContent=tr("Fertig");setTimeout(ok,700)},1500)};
    pwb.onclick=function(){pw.classList.remove("hidden");pwb.classList.add("hidden");b.textContent=tr(mode==="signup"?"Weiter":"Anmelden");setTimeout(function(){inp.focus()},50)};
    inp.addEventListener("keydown",function(e){if(e.key==="Enter")b.click()});
    P.appendChild(pw);P.appendChild(er);P.appendChild(b);P.appendChild(pwb)})}
/* Google: Konto auswählen (jede Google-Adresse = genau ein Konto) */
function gList(){return ls("lg_gacc")||[]}
function gPick(){osheet(function(P){sysHead(P,"Google","Konto auswählen","weiter zu Look Good");
  var L=gList();L.forEach(function(m){var r=el("button","gacc");r.type="button";r.appendChild(el("span","gi",m.charAt(0).toUpperCase()));var t=el("span");t.textContent=m;r.appendChild(t);r.onclick=function(){gGo(m)};P.appendChild(r)});
  var l=el("label","fl"),i=el("input");l.appendChild(el("small","",L.length?"Anderes Konto verwenden":"E-Mail-Adresse"));i.type="email";i.inputMode="email";i.autocomplete="email";i.placeholder="name@gmail.com";l.appendChild(i);P.appendChild(l);
  var er=el("p","err"),b=el("button","btn primary","Weiter");b.type="button";P.appendChild(er);
  b.onclick=function(){var m=i.value.trim().toLowerCase();if(!mailOk(m)){er.textContent=tr("Gib eine gültige E-Mail-Adresse ein.");return}gGo(m)};
  i.addEventListener("keydown",function(e){if(e.key==="Enter")b.click()});P.appendChild(b)})}
function gGo(m){var a={t:"google",id:m};
  if(mode==="login"&&!owner(a))return noAcc(function(){gConsent(m)});
  if(mode==="signup"&&owner(a))return hasAcc(function(){gConsent(m)});
  gConsent(m)}
function gConsent(m){var a={t:"google",id:m};
  osheet(function(P){sysHead(P,"Google",ts(mode==="signup","Mit Google registrieren","Mit Google anmelden"),"Google teilt deinen Namen, deine E-Mail-Adresse und dein Profilbild mit Look Good.");
    var g=el("p","gm");g.textContent=m;P.appendChild(g);
    var b=el("button","btn primary","Fortfahren");b.type="button";
    b.onclick=function(){b.disabled=true;b.textContent="";b.appendChild(el("span","spin"));
      setTimeout(function(){var L=gList().filter(function(x){return x!==m});L.unshift(m);ls("lg_gacc",L.slice(0,5));closeO();auth(a,"Google",function(){if(!prof.email)prof.email=m})},900)};
    P.appendChild(b)})}
document.querySelectorAll("[data-go]").forEach(function(b){b.onclick=function(){provider(b.dataset.go)}});
''')

rep('''  if(mode==="login"&&!known(a)){noAcc(submitPhone);return false}
  sendCode(''', '''  if(mode==="login"&&!owner(a)){noAcc(submitPhone);return false}
  if(mode==="signup"&&owner(a)){hasAcc(submitPhone);return false}
  sendCode(''')

rep('''    if(known(a)){E.textContent=tr("Diese E-Mail ist schon registriert. Melde dich an.");return}''',
    '''    if(owner(a)){E.textContent="";hasAcc(null);return}''')
rep('''  if(!known(a)){E.textContent="";noAcc(submitMail);return}
  if(prof.acc.pw!==a.pw){E.textContent=tr("E-Mail oder Passwort ist falsch.");return}''',
'''  var uid=owner(a);if(!uid){E.textContent="";noAcc(submitMail);return}
  var p=profOf(uid);
  if(!p||!p.pw){E.textContent=tr("Dieses Konto nutzt # zum Anmelden.").replace("#",tr(p&&p.login||"Google"));return}
  if(p.pw!==a.pw){E.textContent=tr("E-Mail oder Passwort ist falsch.");return}''')
rep('''  if(!known(a)){noAcc(openMail);return}''', '''  if(!owner(a)){noAcc(openMail);return}''')
rep('''  var m=mailIn();auth({t:"email",id:m,pw:pwh(v)},"E-Mail",function(){prof.email=m});say("Passwort gespeichert")}''',
    '''  var m=mailIn(),h=pwh(v);auth({t:"email",id:m},"E-Mail",function(){if(!prof.email)prof.email=m;prof.pw=h});say("Passwort gespeichert")}''')
assert 'known(' not in s.split('function el(')[1].split('</script>')[0]

# ---------- Profil: Spitzname, neue Geschlechter, Übernahme alter Konten ----------
rep('var DEF={name:"",last:"",user:"",', 'var DEF={name:"",last:"",nick:"",user:"",')
rep('''if(prof.theme)document.documentElement.setAttribute("data-theme",prof.theme);''',
'''if(prof.acc&&!prof.uid){prof.uid=newUid();if(prof.acc.pw&&!prof.pw)prof.pw=prof.acc.pw;regId(idk(prof.acc),prof.uid);if(prof.email)regId("mail:"+prof.email.toLowerCase(),prof.uid);saveProf()}
var GEN=["Männlich","Weiblich","Trans Mann","Trans Frau","Nicht-binär"];
function fem(){return prof.gender==="Weiblich"||prof.gender==="Trans Frau"}
if(prof.theme)document.documentElement.setAttribute("data-theme",prof.theme);''')
rep('''    {id:"name",label:"Vorname",val:prof.name,ac:"given-name"},''',
    '''    {id:"nick",label:"Spitzname",val:prof.nick,ac:"nickname",ph:"zum Beispiel Momo"},
    {id:"name",label:"Vorname",val:prof.name,ac:"given-name"},''')
rep('''    {id:"gender",label:"Geschlecht",opts:["Männlich","Weiblich","Andere","Keine Angabe"],val:prof.gender}],''',
    '''    {id:"gender",label:"Geschlecht",opts:GEN.concat("Keine Angabe"),val:prof.gender}],''')
rep('''    if(!v.name)return"Gib deinen Vornamen ein.";''', '''    if(!v.nick)return"Gib deinen Spitznamen ein.";
    if(!v.name)return"Gib deinen Vornamen ein.";''')
rep('''    prof.name=v.name;prof.last=v.last;''', '''    prof.nick=v.nick.slice(0,20);prof.name=v.name;prof.last=v.last;''')
# E-Mail im Profil: auch hier nur eine E-Mail pro Konto
rep('''  if(!mailOk(v.e))return"Gib eine gültige E-Mail-Adresse ein.";prof.email=v.e;saveProf();paintProf();say("E-Mail gespeichert");return""})}''',
'''  var e=v.e.toLowerCase();if(!mailOk(e))return"Gib eine gültige E-Mail-Adresse ein.";
  var o=IDS()["mail:"+e];if(o&&o!==prof.uid)return"Diese E-Mail gehört schon zu einem anderen Konto.";
  var old=(prof.email||"").toLowerCase(),keep=prof.acc&&prof.acc.t==="google"&&String(prof.acc.id).toLowerCase()===old;
  if(old&&old!==e&&!keep)unregId("mail:"+old);if(prof.acc&&prof.acc.t==="email")prof.acc.id=e;
  if(prof.uid)regId("mail:"+e,prof.uid);prof.email=e;saveProf();paintProf();say("E-Mail gespeichert");return""})}''')
# Passwort ändern wird jetzt wirklich gespeichert
rep_lines('function pwSheet(){', 'function forgotSheet(){', r'''function pwSheet(){var has=!!prof.pw,f=[];
  if(has)f.push({id:"o",label:"Aktuelles Passwort",type:"password",ac:"current-password"});
  f.push({id:"n",label:"Neues Passwort",type:"password",ac:"new-password"},{id:"r",label:"Neues Passwort wiederholen",type:"password",ac:"new-password"});
  form(has?"Passwort ändern":"Passwort festlegen",f,has?"Ändern":"Speichern",function(v){
  if(has){if(!v.o)return"Gib dein aktuelles Passwort ein.";if(pwh(v.o)!==prof.pw)return"Das aktuelle Passwort ist falsch."}
  if(!pwStrong(v.n))return PWMSG;if(v.n!==v.r)return"Die Passwörter stimmen nicht überein.";
  prof.pw=pwh(v.n);saveProf();say("Passwort gespeichert");return""})}
''')
rep('''{t:"Passwort ändern",fn:pwSheet}''', '''{t:prof.pw?"Passwort ändern":"Passwort festlegen",fn:pwSheet}''')
rep('''t:"Freunde und Snaps"''', '''t:"Freunde und Nachrichten"''')
rep('''friends:["Freunde","Hier findest du bald deine Freunde und Snaps."]''', '''friends:["Freunde","Hier findest du bald deine Freunde."]''')
# Anzeige: Spitzname zuerst
rep('''  var ini=prof.name?prof.name.charAt(0).toUpperCase():tr("Du");''',
    '''  var nm=prof.nick||prof.name,ini=nm?nm.charAt(0).toUpperCase():tr("Du");''')
rep('''$("pname").textContent=prof.name||tr("Dein Name");''',
    '''$("pname").textContent=prof.nick||prof.name||tr("Dein Name");''')
# Abmelden: Konto bleibt komplett gespeichert
rep('''$("pout").onclick=function(){prof.session=false;saveProf();''',
    '''$("pout").onclick=function(){prof.session=false;saveProf();stash();say("Abgemeldet. Deine Daten bleiben gespeichert.");$("pw").value="";''')
# Konto löschen: Konto, Anmeldewege und Sicherung entfernen
rep('''fn:function(){try{["lg_prof","lg_cities","lg_avatar","lg_outfit","lg_looks"].forEach(function(k){localStorage.removeItem(k)});indexedDB.deleteDatabase("lookgood")}catch(e){}setTimeout(function(){location.reload()},150)}''',
    '''fn:function(){var u=prof.uid,m=(prof.email||"").toLowerCase();ls("lg_gacc",gList().filter(function(x){return x!==m}));
  (u?dropAcc(u):Promise.resolve()).then(wipe).then(function(){try{localStorage.removeItem("lg_prof")}catch(e){}setTimeout(function(){location.reload()},150)})}''')

# ---------- Onboarding-Logik ----------
rep('''  $("pbar").style.width=(i+1)*50+"%";$("oerr").textContent="";$("onext").textContent=tr(i===1?"Los geht’s":"Weiter");
  if(i===1)$("oBirth").max=new Date().toISOString().slice(0,10)}
document.querySelectorAll("#oGender button").forEach(function(b){b.onclick=function(){ob.gender=b.dataset.v;document.querySelectorAll("#oGender button").forEach(function(x){x.setAttribute("aria-pressed",String(x===b))})}});''',
'''  $("pbar").style.width=Math.round((i+1)/3*100)+"%";$("oerr").textContent="";$("onext").textContent=tr(i===2?"Los geht’s":"Weiter");
  if(i===2){$("oBirth").max=new Date().toISOString().slice(0,10);paintBirth()}}
document.querySelectorAll("#onb [data-v]").forEach(function(b){b.onclick=function(){ob.gender=b.dataset.v;document.querySelectorAll("#onb [data-v]").forEach(function(x){x.setAttribute("aria-pressed",String(x===b))})}});
/* Geburtstag: Feld ist leer, bis ein Datum gewählt ist; Tippen öffnet die Datumsauswahl */
function paintBirth(){var v=$("oBirth").value;$("oBirthT").textContent=v?new Date(v+"T12:00:00").toLocaleDateString(LC[li()],{day:"numeric",month:"long",year:"numeric"}):""}
["input","change"].forEach(function(t){$("oBirth").addEventListener(t,paintBirth)});
$("oBirth").addEventListener("click",function(){var i=$("oBirth");if(matchMedia("(pointer:fine)").matches&&i.showPicker)try{i.showPicker()}catch(e){}});''')
rep('''  if(i===0){var f=$("oFirst").value.trim(),l=$("oLast").value.trim();''',
    '''  if(i===0){var n=$("oNick").value.trim();if(!n)return oerr("Gib deinen Spitznamen ein.");prof.nick=n;return true}
  if(i===1){var f=$("oFirst").value.trim(),l=$("oLast").value.trim();''')
rep('''function nextStep(){if(!valid(step))return;saveProf();if(step<1)showStep(1);''',
    '''function nextStep(){if(!valid(step))return;saveProf();if(step<2)showStep(step+1);''')
rep('''function startOnb(){onb.classList.remove("hidden");showStep(0)}''',
    '''function startOnb(){onb.classList.remove("hidden");$("oNick").value=prof.nick||"";$("oFirst").value=prof.name||"";$("oLast").value=prof.last||"";showStep(0)}''')
rep('''var SKIP={eTitle:1,''', '''var SKIP={oBirthT:1,eTitle:1,''')

# ---------- KI: Spitzname, Geschlecht, Chat bleibt gespeichert ----------
rep('''+"Person: "+(prof.name||"unknown")+''', '''+"Person: "+(prof.name||"unknown")+(prof.nick?" (likes to be called "+prof.nick+")":"")+''')
rep('''({"Männlich":"male","Weiblich":"female","Andere":"other"}[prof.gender]||prof.gender)''',
    '''({"Männlich":"male","Weiblich":"female","Trans Mann":"trans man","Trans Frau":"trans woman","Nicht-binär":"non-binary","Andere":"other"}[prof.gender]||prof.gender)''')
rep('''var msgs=$("msgs"),cin=$("cin"),H=[],pend=null,busy=false;''',
    '''var msgs=$("msgs"),cin=$("cin"),H=ls("lg_aichat")||[],pend=null,busy=false;
function saveChat(){ls("lg_aichat",H.slice(-60).map(function(m){return{role:m.role,content:m.content.filter(function(p){return p.type==="text"})}}))}''')
rep('''if(!H.length){msgs.textContent="";bub("ai",tr(GREET).replace("#",aiName()))}}''',
    '''if(!H.length||!msgs.firstChild){msgs.textContent="";bub("ai",tr(GREET).replace("#",aiName()));
  H.forEach(function(m){var t=m.content.map(function(p){return p.text||""}).join("");bub(m.role==="user"?"me":"ai",t==="(photo)"?"📷":t)})}}''')
rep('''H.push({role:"assistant",content:[{type:"text",text:a}]});bub("ai",a)})''',
    '''H.push({role:"assistant",content:[{type:"text",text:a}]});saveChat();bub("ai",a)})''')

# ---------- Figur: Trans Frau = Frauenfigur ----------
rep('''function defAv(){var f=prof.gender==="Weiblich";''', '''function defAv(){var f=fem();''')
rep('''var f=prof.fig?prof.fig==="f":prof.gender==="Weiblich";''', '''var f=prof.fig?prof.fig==="f":fem();''')

open(dst, 'w', encoding='utf-8').write(s)
print('ok', len(s))
