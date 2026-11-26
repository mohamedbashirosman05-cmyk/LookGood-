# App mit dem eigenen Server verbinden (echte Konten + Datenbank).
# Läuft die App über den Server (http/https) und meldet /api/health eine Datenbank, gehen Anmeldung,
# Codes und alle Daten über den Server. Sonst (Datei, GitHub-Seite) bleibt alles wie bisher auf dem Gerät.
# Aufruf: python3 patch_server.py <eingabe.html> <ausgabe.html>
import sys
src, dst = sys.argv[1], sys.argv[2]
s = open(src, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:140])
    s = s.replace(old, new)

LAYER = r'''/* ===== Server: echte Konten + Datenbank =====
   Wird die App über den eigenen Server geöffnet und hat er eine Datenbank, liegen Konten und alle Daten dort:
   Profil, Einstellungen, Städte, Figur, Outfit, Looks, KI-Chat und Kleidung mit Fotos. Das Gerät hält nur eine Kopie
   und schickt Änderungen alle paar Sekunden an den Server. Ohne Server bleibt alles wie oben auf dem Gerät. */
var SRV=null,SYNC_OFF=false,rcode="";
function api(p,m,b){var t=ls("lg_tok"),h={"Content-Type":"application/json"};if(t)h.Authorization="Bearer "+t;
  return fetch(p,{method:m||"GET",headers:h,body:b?JSON.stringify(b):undefined}).then(function(r){return r.json().catch(function(){return{}}).then(function(j){j.status=r.status;return j})})}
function offline(){say("Keine Verbindung zum Server. Versuch es gleich noch mal.")}
function devId(){var d=ls("lg_dev");if(!d){d="d"+Date.now().toString(36)+Math.random().toString(36).slice(2,12);ls("lg_dev",d)}return d}
function aBody(a){return a.t==="apple"?{method:"apple",devId:devId()}:a.t==="google"?{method:"google",email:a.id}:a.t==="email"?{method:"email",email:a.id}:{method:"phone",phone:a.id}}
/* Gibt es für diesen Anmeldeweg schon ein Konto? (Server oder Gerät) */
function chk(a,cb){if(!SRV){var u=owner(a),p=u&&profOf(u);return cb({exists:!!u,login:p&&p.login,hasPw:!!(p&&p.pw)})}
  api("/api/auth/check","POST",aBody(a)).then(function(j){if(j.status!==200)return j.status===429?slow():offline();cb(j)}).catch(offline)}
function slow(){say("Zu viele Versuche. Warte kurz und versuch es noch mal.")}
function sig(v){return v==null?"":v.length+":"+hash(v)}
function dataNow(){var d={};DK.forEach(function(k){var v=localStorage.getItem(k);if(v!=null)d[k]=v});return d}
function itemSigs(L){var o={};(L||[]).forEach(function(it){o[it.id]=sig(JSON.stringify(it))});return o}
/* Nach dem Anmelden: Daten vom Server auf das Gerät holen und die App neu starten */
function srvIn(p,label,apply){SYNC_OFF=true;ls("lg_tok",p.token);var keep={lang:prof.lang,theme:prof.theme,langSet:prof.langSet};
  return wipe().then(function(){var d=p.data||{};Object.keys(d).forEach(function(k){try{localStorage.setItem(k,d[k])}catch(e){}});
    return idbDo("readwrite",function(st){(p.items||[]).forEach(function(it){st.put(it)});return null})}).then(function(){
    var saved=ls("lg_prof");prof=Object.assign({},DEF,saved?{}:keep,saved||{});prof.uid=p.uid;if(apply)apply();prof.login=label||prof.login;prof.pw=p.hasPw?"srv":"";prof.session=true;
    ls("lg_sync",{ver:p.ver,data:sig(JSON.stringify(dataNow())),items:itemSigs(p.items)});saveProf();location.reload()})}
function srvAuth(a,label,apply,x){var b=Object.assign(aBody(a),{mode:mode},x||{});
  return api("/api/auth","POST",b).then(function(j){
    if(j.status===200){say("Konto wird geladen …");return srvIn(j,label,apply)}
    codeReset();
    if(j.error==="exists")return hasAcc(null);
    if(j.error==="no_account")return noAcc(null);
    if(j.error==="bad_code")return codeBad();
    if(j.error==="wrong_password"){$("eerr").textContent=tr("E-Mail oder Passwort ist falsch.");return}
    if(j.error==="uses_other"){$("eerr").textContent=tr("Dieses Konto nutzt # zum Anmelden.").replace("#",tr(j.login||"Google"));return}
    if(j.error==="weak_password"){$("eerr").textContent=tr(PWMSG);return}
    if(j.status===429)return slow();
    offline()}).catch(function(){codeReset();offline()})}
function codeReset(){var g=$("cgo");g.disabled=false;g.textContent=tr("Bestätigen")}
function codeBad(){codeReset();showA("ac");$("cerr").textContent=tr("Der Code ist falsch. Versuch es noch mal.");var O=$("otp");O.classList.remove("bad");void O.offsetWidth;O.classList.add("bad");boxes().forEach(function(b){b.value=""});boxes()[0].focus()}
function codeNote(c,sms){notify(sms?"Nachrichten":"Mail",tr("# ist dein LOOK GOOD Code. Teile ihn mit niemandem.").replace("#",c))}
/* Code anfordern. Ohne E-Mail-/SMS-Dienst auf dem Server kommt der Code (Testbetrieb) als Nachricht in der App. */
function srvCode(body,sms,cb){api("/api/auth/code","POST",body).then(function(j){if(j.status===429)return slow();if(j.status!==200)return offline();
  if(j.dev){if(cb)cb(j.dev);setTimeout(function(){codeNote(j.dev,sms)},400)}}).catch(offline)}
/* Änderungen hochladen: Daten + Kleidung (nur was sich geändert hat) */
var pushing=false;
function push(){if(!SRV||SYNC_OFF||pushing||!ls("lg_tok")||!prof.session)return Promise.resolve();
  var S=ls("lg_sync")||{},d=dataNow(),ds=sig(JSON.stringify(d)),jobs=[];S.items=S.items||{};pushing=true;
  if(ds!==S.data)jobs.push(api("/api/me/data","PUT",{data:d}).then(function(j){if(j.status===200){S.ver=j.ver;S.data=ds}else if(j.status===401)lost()}));
  jobs.push(idbDo("readonly",function(st){return st.getAll()}).then(function(L){var now=itemSigs(L),seen={},js=[];
    (L||[]).forEach(function(it){seen[it.id]=1;if(now[it.id]!==S.items[it.id])js.push(api("/api/me/items/"+encodeURIComponent(it.id),"PUT",{item:it}).then(function(j){if(j.status===200)S.items[it.id]=now[it.id]}))});
    Object.keys(S.items).forEach(function(id){if(!seen[id])js.push(api("/api/me/items/"+encodeURIComponent(id),"DELETE").then(function(j){if(j.status===200)delete S.items[id]}))});
    return Promise.all(js)}));
  return Promise.all(jobs).catch(function(){}).then(function(){if(!SYNC_OFF)ls("lg_sync",S);pushing=false})}
setInterval(push,3000);
document.addEventListener("visibilitychange",function(){if(document.hidden)push()});
function lost(){SYNC_OFF=true;try{localStorage.removeItem("lg_tok")}catch(e){}prof.session=false;saveProf();location.reload()}
/* Abmelden / Konto löschen mit Server: erst alles hochladen, dann das Gerät leeren */
function srvOut(del){var go=function(){SYNC_OFF=true;var keep={lang:prof.lang,theme:prof.theme,langSet:prof.langSet};
    return wipe().then(function(){try{localStorage.removeItem("lg_tok");localStorage.removeItem("lg_sync")}catch(e){}prof=Object.assign({},DEF,keep);saveProf();setTimeout(function(){location.reload()},del?150:900)})};
  if(del)return api("/api/me","DELETE").then(function(j){if(j.status!==200&&j.status!==401)return offline();go()}).catch(offline);
  pushing=false;return push().then(function(){return api("/api/auth/logout","POST")}).catch(function(){}).then(go)}
/* Beim Start: Server da? Dann neueste Daten holen (z. B. Änderungen vom anderen Handy) */
function srvStart(){if(!/^https?:$/.test(location.protocol))return;
  fetch("/api/health").then(function(r){return r.json()}).then(function(h){if(!h||!h.db)return;SRV=h;
    if(prof.session&&!ls("lg_tok")){prof.session=false;saveProf();return location.reload()}
    if(!ls("lg_tok"))return;
    api("/api/me").then(function(p){if(p.status===401)return lost();if(p.status!==200)return;
      var S=ls("lg_sync")||{};if(p.ver>(S.ver||0)){p.token=ls("lg_tok");srvIn(p,prof.login)}})}).catch(function(){})}
srvStart();
'''

# Schicht nach enter() einfügen, auth() verzweigt bei Server
rep('''/* Anmelden: gehört der Anmeldeweg schon zu einem Konto, wird genau dieses Konto geöffnet, sonst ein neues erstellt. */
function auth(a,label,apply){var uid=owner(a);''',
LAYER + '''/* Anmelden: gehört der Anmeldeweg schon zu einem Konto, wird genau dieses Konto geöffnet, sonst ein neues erstellt. */
function auth(a,label,apply,x){if(SRV)return srvAuth(a,label,apply,x);var uid=owner(a);''')

rep('''b.onclick=function(){closeO();var ast=astep;showAuth("signup");if(ast==="ae")openMail();go()};''',
    '''b.onclick=function(){closeO();var ast=astep;showAuth("signup");if(ast==="ae")openMail();if(go)go()};''')

# Apple
rep('''function appleSheet(){
  if(mode==="login"&&!owner(AID))return noAcc(appleSheet);
  if(mode==="signup"&&owner(AID))return hasAcc(appleSheet);
  osheet(function(P){''', '''function appleSheet(){var A=SRV?{t:"apple",id:devId()}:AID;chk(A,function(c){
  if(mode==="login"&&!c.exists)return noAcc(appleSheet);
  if(mode==="signup"&&c.exists)return hasAcc(appleSheet);
  osheet(function(P){''')
rep('''var ok=function(){closeO();auth(AID,"Apple")};''', '''var ok=function(){closeO();auth(A,"Apple")};''')
rep('''    P.appendChild(pw);P.appendChild(er);P.appendChild(b);P.appendChild(pwb)})}''',
    '''    P.appendChild(pw);P.appendChild(er);P.appendChild(b);P.appendChild(pwb)})})}''')
# Google
rep('''function gGo(m){var a={t:"google",id:m};
  if(mode==="login"&&!owner(a))return noAcc(function(){gConsent(m)});
  if(mode==="signup"&&owner(a))return hasAcc(function(){gConsent(m)});
  gConsent(m)}''', '''function gGo(m){var a={t:"google",id:m};chk(a,function(c){
  if(mode==="login"&&!c.exists)return noAcc(function(){gConsent(m)});
  if(mode==="signup"&&c.exists)return hasAcc(function(){gConsent(m)});
  gConsent(m)})}''')
# Telefon
rep('''  if(mode==="login"&&!owner(a)){noAcc(submitPhone);return false}
  if(mode==="signup"&&owner(a)){hasAcc(submitPhone);return false}
  sendCode({sms:true,to:cc+" "+d,ok:function(){auth(a,"Telefonnummer",function(){prof.phone=d;prof.cc=cc})}});return true}''',
    '''  chk(a,function(c){
  if(mode==="login"&&!c.exists)return noAcc(submitPhone);
  if(mode==="signup"&&c.exists)return hasAcc(submitPhone);
  sendCode({sms:true,to:cc+" "+d,a:aBody(a),ok:function(v){auth(a,"Telefonnummer",function(){prof.phone=d;prof.cc=cc},{code:v})}})});return true}''')
# E-Mail
rep('''  if(mode==="signup"){
    if(owner(a)){E.textContent="";hasAcc(null);return}
    if(!pwStrong(pw)){E.textContent=tr(PWMSG);return}
    E.textContent="";sendCode({sms:false,to:m,ok:function(){auth(a,"E-Mail",function(){prof.email=m})}});return}
  if(!pw){E.textContent=tr("Gib dein Passwort ein.");return}''',
    '''  if(mode==="signup"){
    if(!pwStrong(pw)){E.textContent=tr(PWMSG);return}
    return chk(a,function(c){if(c.exists){E.textContent="";return hasAcc(null)}
      E.textContent="";sendCode({sms:false,to:m,a:aBody(a),ok:function(v){auth(a,"E-Mail",function(){prof.email=m},{password:pw,code:v})}})})}
  if(!pw){E.textContent=tr("Gib dein Passwort ein.");return}
  if(SRV){E.textContent="";return auth(a,"E-Mail",function(){if(!prof.email)prof.email=m},{password:pw})}''')
rep('''  if(!owner(a)){noAcc(openMail);return}
  sendCode({sms:false,to:m,ok:function(){$("npw").value="";rules("npw","nrules");$("perr").textContent="";showA("ap")}})};''',
    '''  chk(a,function(c){if(!c.exists)return noAcc(openMail);
  sendCode({sms:false,to:m,a:aBody(a),ok:function(v){rcode=v;codeReset();$("npw").value="";rules("npw","nrules");$("perr").textContent="";showA("ap")}})})};''')
rep('''function setPw(){var v=$("npw").value;if(!pwStrong(v)){$("perr").textContent=tr(PWMSG);return}''',
    '''function setPw(){var v=$("npw").value;if(!pwStrong(v)){$("perr").textContent=tr(PWMSG);return}
  if(SRV)return api("/api/auth/reset","POST",{email:mailIn(),code:rcode,password:v}).then(function(j){if(j.status===200){say("Passwort gespeichert");return srvIn(j,"E-Mail")}
    if(j.error==="bad_code")return codeBad();if(j.status===429)return slow();offline()}).catch(offline);''')
# Code
rep('''function sendCode(ctx){cCtx=ctx;code=String(Math.floor(100000+Math.random()*900000));''',
    '''function sendCode(ctx){cCtx=ctx;code=SRV?"":String(Math.floor(100000+Math.random()*900000));if(SRV)srvCode(ctx.a,ctx.sms,function(c){code=c});''')
rep('''  setTimeout(function(){notify(ctx.sms?"Nachrichten":"Mail",tr("# ist dein LOOK GOOD Code. Teile ihn mit niemandem.").replace("#",code))},1400);''',
    '''  if(!SRV)setTimeout(function(){codeNote(code,ctx.sms)},1400);''')
rep('''  if(v!==code){$("cerr").textContent''', '''  if(!SRV&&v!==code){$("cerr").textContent''')
rep('''hideSms();setTimeout(function(){cCtx.ok()},700)}''', '''hideSms();setTimeout(function(){cCtx.ok(v)},SRV?0:700)}''')

# Profil: E-Mail, Passwort, Passwort vergessen
rep('''  var e=v.e.toLowerCase();if(!mailOk(e))return"Gib eine gültige E-Mail-Adresse ein.";''',
    '''  var e=v.e.toLowerCase();if(!mailOk(e))return"Gib eine gültige E-Mail-Adresse ein.";
  if(SRV){srvCode({method:"email",email:e},false);setTimeout(function(){form("Code eingeben",[{id:"c",label:"6-stelliger Code"}],"Bestätigen",function(w){
    api("/api/me/email","POST",{email:e,code:w.c}).then(function(j){if(j.status===200){prof.email=e;saveProf();paintProf();return say("E-Mail gespeichert")}
      say(j.error==="exists"?"Diese E-Mail gehört schon zu einem anderen Konto.":j.error==="bad_code"?"Der Code ist falsch. Versuch es noch mal.":"Keine Verbindung zum Server. Versuch es gleich noch mal.")}).catch(offline);return""},tr("Wir haben dir einen 6-stelligen Code an # geschickt.").replace("#",e))},0);return""}''')
rep('''  if(has){if(!v.o)return"Gib dein aktuelles Passwort ein.";if(pwh(v.o)!==prof.pw)return"Das aktuelle Passwort ist falsch."}
  if(!pwStrong(v.n))return PWMSG;if(v.n!==v.r)return"Die Passwörter stimmen nicht überein.";''',
    '''  if(has){if(!v.o)return"Gib dein aktuelles Passwort ein.";if(!SRV&&pwh(v.o)!==prof.pw)return"Das aktuelle Passwort ist falsch."}
  if(!pwStrong(v.n))return PWMSG;if(v.n!==v.r)return"Die Passwörter stimmen nicht überein.";
  if(SRV){api("/api/me/password","PUT",{old:v.o||"",password:v.n}).then(function(j){if(j.status===200){prof.pw="srv";saveProf();return say("Passwort gespeichert")}
    say(j.error==="wrong_password"?"Das aktuelle Passwort ist falsch.":"Keine Verbindung zum Server. Versuch es gleich noch mal.")}).catch(offline);return""}''')
rep('''"Code senden",function(v){
  if(!mailOk(v.e))return"Gib eine gültige E-Mail-Adresse ein.";''',
    '''"Code senden",function(v){
  if(!mailOk(v.e))return"Gib eine gültige E-Mail-Adresse ein.";
  if(SRV){var fe=v.e.toLowerCase();srvCode({method:"email",email:fe},false);setTimeout(function(){form("Code eingeben",[{id:"c",label:"6-stelliger Code"},{id:"n",label:"Neues Passwort",type:"password",ac:"new-password"}],"Passwort setzen",function(w){
    if(!/^\\d{6}$/.test(w.c))return"Der Code hat 6 Ziffern.";if(!pwStrong(w.n))return PWMSG;
    api("/api/auth/reset","POST",{email:fe,code:w.c,password:w.n}).then(function(j){if(j.status===200){say("Passwort gespeichert");return srvIn(j,prof.login)}
      say(j.error==="bad_code"?"Der Code ist falsch. Versuch es noch mal.":j.error==="no_account"?"Kein Konto gefunden":"Keine Verbindung zum Server. Versuch es gleich noch mal.")}).catch(offline);return""})},0);return""}''')
# Abmelden / löschen
rep('''$("pout").onclick=function(){prof.session=false;''',
    '''$("pout").onclick=function(){if(SRV){say("Abgemeldet. Deine Daten bleiben gespeichert.");$("profile").classList.add("hidden");return srvOut()}prof.session=false;''')
rep('''{t:"Endgültig löschen",fn:function(){var u=prof.uid''', '''{t:"Endgültig löschen",fn:function(){if(SRV)return srvOut(true);var u=prof.uid''')

TR = {
"Keine Verbindung zum Server. Versuch es gleich noch mal.":"No connection to the server. Please try again in a moment.|Pas de connexion au serveur. Réessaie dans un instant.|Sin conexión con el servidor. Inténtalo de nuevo en un momento.|Sem ligação ao servidor. Tenta de novo daqui a pouco.|لا يوجد اتصال بالخادم. حاول مرة أخرى بعد قليل.|सर्वर से कनेक्शन नहीं है। थोड़ी देर में फिर कोशिश करें।|无法连接服务器，请稍后再试。",
"Zu viele Versuche. Warte kurz und versuch es noch mal.":"Too many attempts. Wait a moment and try again.|Trop de tentatives. Attends un peu et réessaie.|Demasiados intentos. Espera un momento y vuelve a intentarlo.|Demasiadas tentativas. Espera um pouco e tenta de novo.|محاولات كثيرة. انتظر قليلاً وحاول مرة أخرى.|बहुत ज़्यादा कोशिशें। थोड़ा रुककर फिर कोशिश करें।|尝试次数过多，请稍等后再试。",
}
for k, v in TR.items():
    assert len(v.split('|')) == 7 and ('\n"%s":' % k) not in s, k
rep('\nvar D={\n', '\nvar D={\n' + ''.join('"%s":"%s",\n' % kv for kv in TR.items()))
open(dst, 'w', encoding='utf-8').write(s)
print('ok')
