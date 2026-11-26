/* ===== Flash & Chat =====
   Daten-Schicht (SO.*) liegt heute nur auf diesem Gerät, mit Test-Freunden, die automatisch antworten.
   Später ersetzt ein Server genau diese Funktionen (soSend, soFriends …); die Oberfläche bleibt gleich. */
var FC={photo:"#E0275F",video:"#7B4DFF",chat:"#1596C8"};
var DEMO=[
 {id:"u_lina",user:"lina.style",name:"Lina",av:"🦊",bg:"#ffb38a"},{id:"u_jay",user:"jay.k",name:"Jay",av:"🐼",bg:"#b9c2ff"},
 {id:"u_sami",user:"sami_",name:"Sami",av:"🐰",bg:"#9fe3cf"},{id:"u_nora",user:"nora.fit",name:"Nora",av:"🦊",bg:"#ffd27a"},
 {id:"u_elif",user:"elif.daily",name:"Elif",av:"🐼",bg:"#f3b6d2"},{id:"u_ben",user:"ben.outfits",name:"Ben",av:"🐰",bg:"#c6e59b"},
 {id:"u_maya",user:"maya.looks",name:"Maya",av:"🐰",bg:"#d7c4ff"},{id:"u_tom",user:"tom_street",name:"Tom",av:"🐼",bg:"#a9dcf5"}];
var REPLIES={u_lina:["Haha 😂","Sieht richtig gut aus!","Die Farbe steht dir","Wo bist du gerade?","Schick mehr davon"],u_jay:["Bro 🔥","Krass, wo hast du das her?","Heute wird’s kalt, nimm ’ne Jacke","Safe, sieht clean aus","Lass später treffen"],
 u_sami:["Nice!","Passt perfekt zum Wetter","Hab grad dasselbe an 😄","Top","Sieht gemütlich aus"],u_nora:["Sportlich, gefällt mir","Love it 💛","Gehst du heute trainieren?","Mega Look","Ich will das auch"],
 u_elif:["Hallo!","Süß 😍","Danke!","Wie geht’s dir?"],u_ben:["Yo!","Sauber","Gefällt mir"],u_maya:["Hey :)","Hübsch!","Gute Wahl"],u_tom:["Yo","Stark","Respekt"]};
var SO=null;
function soSave(){ls("lg_social",SO)}
function demoUser(id){return DEMO.filter(function(u){return u.id===id})[0]||null}
function uinfo(id){if(id==="me")return{id:"me",user:prof.user||"",name:prof.nick||prof.name||tr("Du"),av:null,photo:prof.photo,bg:"#eadff5"};return demoUser(id)||{id:id,user:"",name:"?",av:"🙂",bg:"#ddd"}}
var SOP=null;
function soInit(){if(SOP)return SOP;SO=ls("lg_social");if(SO&&SO.v===1){SOP=Promise.resolve();return SOP}
  SOP=soSeed();return SOP}
function soSeed(){
  SO={v:1,friends:["u_lina","u_jay","u_sami","u_nora"],reqIn:["u_elif"],reqOut:[],blocked:[],chats:{},stories:[],seen:{},myViews:{}};var now=Date.now();
  return Promise.all([demoImg("lina1","#ff7e5f","#feb47b","☕","Montagmorgen"),demoImg("jay1","#3a1c71","#d76d77","🔥","Neue Sneaker"),demoImg("lina2","#43cea2","#185a9d","🌧️","Regenjacke an"),demoImg("sami1","#f7971e","#ffd200","😎","Sonne!")]).then(function(){
    chat("u_lina").msgs.push({id:mid(),from:"u_lina",at:now-14*6e4,kind:"flash",mtype:"photo",media:"demo_lina1",timer:5,opened:null});
    chat("u_jay").msgs.push({id:mid(),from:"u_jay",at:now-62*6e4,kind:"text",text:"Bro, was ziehst du heute an?",opened:null});
    chat("u_sami").msgs.push({id:mid(),from:"me",at:now-26*36e5,kind:"flash",mtype:"photo",media:"demo_sami1",timer:5,opened:now-25*36e5});
    SO.stories.push({id:mid(),uid:"u_lina",media:"demo_lina2",mtype:"photo",at:now-3*36e5},{id:mid(),uid:"u_jay",media:"demo_jay1",mtype:"photo",at:now-5*36e5});soSave()})}
function mid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
function chat(uid){return SO.chats[uid]||(SO.chats[uid]={msgs:[],clean:"never"})}
function isFriend(uid){return SO.friends.indexOf(uid)>=0}
/* Medien (Fotos, Videos, Sprachnachrichten) liegen in IndexedDB, Store "media" */
function mediaPut(id,data){return idb().then(function(db){if(!db)return false;return new Promise(function(res){try{var t=db.transaction("media","readwrite");t.objectStore("media").put({id:id,data:data});t.oncomplete=function(){res(true)};t.onerror=function(){res(false)}}catch(e){res(false)}})})}
var MCACHE={};
function mediaGet(id){if(MCACHE[id])return Promise.resolve(MCACHE[id]);return idb().then(function(db){if(!db)return null;return new Promise(function(res){try{var q=db.transaction("media").objectStore("media").get(id);q.onsuccess=function(){var d=q.result&&q.result.data;if(d){MCACHE[id]=typeof d==="string"?d:URL.createObjectURL(d)}res(MCACHE[id]||null)};q.onerror=function(){res(null)}}catch(e){res(null)}})})}
function demoImg(key,c1,c2,emo,txt){var c=document.createElement("canvas");c.width=720;c.height=1280;var g=c.getContext("2d"),gr=g.createLinearGradient(0,0,720,1280);gr.addColorStop(0,c1);gr.addColorStop(1,c2);g.fillStyle=gr;g.fillRect(0,0,720,1280);
  g.globalAlpha=.18;g.fillStyle="#fff";for(var i=0;i<14;i++){g.beginPath();g.arc(Math.random()*720,Math.random()*1280,40+Math.random()*160,0,7);g.fill()}g.globalAlpha=1;
  g.font="300px system-ui,Apple Color Emoji,Segoe UI Emoji";g.textAlign="center";g.textBaseline="middle";g.fillText(emo,360,560);
  g.fillStyle="rgba(0,0,0,.45)";g.fillRect(0,880,720,96);g.fillStyle="#fff";g.font="600 48px system-ui";g.fillText(tr(txt),360,930);
  return mediaPut("demo_"+key,c.toDataURL("image/jpeg",.82))}
/* ---- Zeit ---- */
function ago(t){var d=(Date.now()-t)/6e4;if(d<1)return tr("Gerade eben");if(d<60)return tr("vor # Min.").replace("#",Math.floor(d));if(d<24*60)return tr("vor # Std.").replace("#",Math.floor(d/60));
  var y=new Date();y.setHours(0,0,0,0);if(t>=y-864e5)return tr("Gestern");return new Date(t).toLocaleDateString(LC[li()],{day:"numeric",month:"short"})}
/* ---- Status einer Chat-Zeile (das Symbol-System) ---- */
function rowState(uid){var ms=chat(uid).msgs.filter(function(m){return!m.deleted}),last=ms[ms.length-1];
  var unFl=ms.filter(function(m){return m.from!=="me"&&m.kind==="flash"&&!m.opened}),unTx=ms.filter(function(m){return m.from!=="me"&&m.kind!=="flash"&&!m.opened});
  if(unFl.length){var v=unFl[unFl.length-1];return{icon:"sq",fill:true,col:v.mtype==="video"?FC.video:FC.photo,txt:"Neuer Flash",at:v.at,unread:true,flashes:unFl}}
  if(unTx.length){var t=unTx[unTx.length-1];return{icon:"bub",fill:true,col:FC.chat,txt:"Neuer Chat",at:t.at,unread:true}}
  if(!last)return{icon:"bub",fill:false,col:"var(--muted)",txt:"Tippe, um zu chatten",at:0};
  var col=last.kind==="flash"?(last.mtype==="video"?FC.video:FC.photo):FC.chat;
  if(last.from==="me")return{icon:"arrow",fill:!last.opened,col:col,txt:last.opened?(last.kind==="flash"?"Geöffnet":"Gelesen"):"Zugestellt",at:last.at};
  return{icon:last.kind==="flash"?"sq":"bub",fill:false,col:col,txt:last.kind==="flash"?"Angesehen":"Empfangen",at:last.at}}
function stIcon(s){var c=s.col,f=s.fill?c:"none";if(s.icon==="sq")return'<svg viewBox="0 0 16 16"><rect x="2" y="2" width="12" height="12" rx="2.5" fill="'+f+'" stroke="'+c+'" stroke-width="2"/></svg>';
  if(s.icon==="arrow")return'<svg viewBox="0 0 16 16"><path d="M2.5 2.5 14 8 2.5 13.5 5 8z" fill="'+f+'" stroke="'+c+'" stroke-width="1.8" stroke-linejoin="round"/></svg>';
  return'<svg viewBox="0 0 16 16"><path d="M2 3.5h12v8H7l-3.5 3v-3H2z" fill="'+f+'" stroke="'+c+'" stroke-width="1.8" stroke-linejoin="round"/></svg>'}
function unreadCount(){return SO?SO.friends.filter(function(u){return rowState(u).unread}).length+SO.reqIn.length:0}
function badge(){var t=$("t-friends");if(!t)return;var b=t.querySelector(".tbadge");var n=unreadCount();if(!b){b=el("span","tbadge");t.appendChild(b)}b.textContent=n>9?"9+":String(n);b.classList.toggle("hidden",!n)}
/* ---- Avatare ---- */
function avEl(id,sz,ring){var u=uinfo(id),d=el("span","sav"+(ring?" ring "+ring:""));d.style.setProperty("--s",(sz||48)+"px");var i=el("span","savi");
  if(u.photo){i.style.backgroundImage="url("+u.photo+")";i.classList.add("ph")}else if(u.av){i.textContent=u.av;i.style.background=u.bg}else{i.textContent=(u.name||"?").charAt(0).toUpperCase();i.style.background=u.bg}
  d.appendChild(i);return d}
/* ---- Benachrichtigung oben (wie eine echte Push-Nachricht) ---- */
var NBT=null;
function notify2(uid,text,col,fn){var n=$("nbar");if(!n){n=el("div","nbar");n.id="nbar";document.body.appendChild(n)}n.textContent="";n.appendChild(avEl(uid,34));var t=el("div","nbt");t.appendChild(el("b","",uinfo(uid).name));var p=el("span","",text);p.style.color=col||"";t.appendChild(p);n.appendChild(t);
  n.onclick=function(){n.classList.remove("show");if(fn)fn()};requestAnimationFrame(function(){n.classList.add("show")});clearTimeout(NBT);NBT=setTimeout(function(){n.classList.remove("show")},4200)}
/* ---- Test-Freunde reagieren (bis der Server da ist) ---- */
function bot(uid,what){if(!demoUser(uid)||SO.blocked.indexOf(uid)>=0||!isFriend(uid))return;var c={get msgs(){return chat(uid).msgs}};
  setTimeout(function(){c.msgs.forEach(function(m){if(m.from==="me"&&!m.opened)m.opened=Date.now()});soSave();refresh()},2500+Math.random()*2500);
  if(what==="flash"&&Math.random()<.45){setTimeout(function(){var k="r"+mid();demoImg(k,["#ff9a9e","#a18cd1","#84fab0","#f6d365"][Math.floor(Math.random()*4)],["#fad0c4","#fbc2eb","#8fd3f4","#fda085"][Math.floor(Math.random()*4)],["😂","🔥","😎","👀","💯"][Math.floor(Math.random()*5)],"Zurück!").then(function(){
    c.msgs.push({id:mid(),from:uid,at:Date.now(),kind:"flash",mtype:"photo",media:"demo_"+k,timer:5,opened:null});soSave();incoming(uid,"hat dir einen Flash geschickt",FC.photo)})},7000+Math.random()*4000);return}
  setTimeout(function(){TYP[uid]=true;refresh()},4500);
  setTimeout(function(){TYP[uid]=false;var pool=REPLIES[uid]||["👍"],txt=what==="outfit"?["Passt richtig gut!","Nimm lieber die helleren Schuhe","Perfekt für heute"][Math.floor(Math.random()*3)]:pool[Math.floor(Math.random()*pool.length)];
    c.msgs.push({id:mid(),from:uid,at:Date.now(),kind:"text",text:txt,opened:null});soSave();incoming(uid,"hat dir geschrieben",FC.chat)},7000+Math.random()*3000)}
var TYP={},OPEN=null;
function incoming(uid,what,col){if(OPEN===uid){chat(uid).msgs.forEach(function(m){if(m.from!=="me"&&m.kind!=="flash")m.opened=m.opened||Date.now()});soSave();chPaint();return}
  notify2(uid,tr(what),col,function(){showTab("friends");var s=rowState(uid);if(s.flashes)viewFlashes(uid);else openChat(uid)});refresh()}
function refresh(){badge();if(cur==="friends")inbox();if(OPEN)chPaint()}
/* ===== Inbox (Tab "Chat") ===== */
var SV=$("v-friends");if(!SV){SV=el("section","view hidden");SV.id="v-friends";$("views").appendChild(SV)}SV.classList.add("social");
function inbox(){if(!SO)return;SV.textContent="";
  var h=el("div","shead");h.appendChild(el("h2","","Chat"));var bf=el("button","sicon");bf.type="button";bf.innerHTML='<svg viewBox="0 0 24 24"><circle cx="10" cy="8" r="4"/><path d="M3 21c.6-4 3.3-6.5 7-6.5s6.4 2.5 7 6.5M19 8v6M16 11h6"/></svg>';bf.setAttribute("aria-label",tr("Freunde finden"));bf.onclick=friendsScreen;
  var reqN=SO.reqIn.length;if(reqN){var bd=el("span","dot",String(reqN));bf.appendChild(bd)}h.appendChild(bf);SV.appendChild(h);
  if(!prof.user){var c=el("div","scard");c.appendChild(el("b","","Wähle deinen Benutzernamen"));c.appendChild(el("p","","Damit dich Freunde finden und dir Flashes schicken können."));var b=el("button","btn primary","Benutzername wählen");b.type="button";b.onclick=userSheet;c.appendChild(b);SV.appendChild(c)}
  /* Storys */
  var row=el("div","srow noswipe"),mine=SO.stories.filter(function(s){return s.uid==="me"&&live(s)});
  var me=el("button","stb");me.type="button";var mav=avEl("me",62,mine.length?"seen":"");if(!mine.length){var pl=el("span","splus","+");mav.appendChild(pl)}me.appendChild(mav);me.appendChild(el("small","","Meine Story"));
  me.onclick=function(){if(mine.length)viewStories(["me"],0);else openCam(null,true)};row.appendChild(me);
  storyUsers().forEach(function(uid,ix,arr){var seen=SO.stories.filter(function(s){return s.uid===uid&&live(s)}).every(function(s){return SO.seen[s.id]});var b=el("button","stb");b.type="button";b.appendChild(avEl(uid,62,seen?"seen":"new"));b.appendChild(el("small","",uinfo(uid).name));b.onclick=function(){viewStories(arr,ix)};row.appendChild(b)});
  SV.appendChild(row);
  if(reqN){SO.reqIn.forEach(function(uid){var r=el("div","sreq");r.appendChild(avEl(uid,40));var t=el("div","sti");t.appendChild(el("b","",uinfo(uid).name));t.appendChild(el("small","","möchte mit dir befreundet sein"));r.appendChild(t);
    var a=el("button","sbtn on","Annehmen");a.type="button";a.onclick=function(){acceptReq(uid)};var d=el("button","sbtn","Ablehnen");d.type="button";d.onclick=function(){SO.reqIn=SO.reqIn.filter(function(x){return x!==uid});soSave();refresh()};r.appendChild(a);r.appendChild(d);SV.appendChild(r)})}
  var list=el("div","slist"),fr=SO.friends.slice().sort(function(a,b){return(rowState(b).at||0)-(rowState(a).at||0)});
  if(!fr.length){var e=el("div","wnone");e.appendChild(el("b","","Noch keine Freunde"));e.appendChild(el("p","","Suche oben rechts nach Benutzernamen und schick eine Anfrage."));list.appendChild(e)}
  fr.forEach(function(uid){var s=rowState(uid),r=el("div","srowi"+(s.unread?" un":"")),main=el("button","smain");main.type="button";main.appendChild(avEl(uid,50));var t=el("div","sti");
    var nm=el("b","",uinfo(uid).name);if(demoUser(uid)){nm.appendChild(el("span","stest","Test"))}t.appendChild(nm);
    var st=el("small","sstat");var ic=el("span","sic");ic.innerHTML=stIcon(s);st.appendChild(ic);var lb=el("span","",TYP[uid]?"schreibt gerade …":s.txt);lb.style.color=s.unread?s.col:"";if(s.unread)lb.style.fontWeight="800";st.appendChild(lb);
    if(s.at){st.appendChild(document.createTextNode(" · "+ago(s.at)))}t.appendChild(st);main.appendChild(t);
    main.onclick=function(){if(s.flashes)viewFlashes(uid);else openChat(uid)};r.appendChild(main);
    var cb=el("button","sicon sm");cb.type="button";cb.innerHTML='<svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z"/></svg>';cb.setAttribute("aria-label",tr("Chat öffnen"));cb.onclick=function(){openChat(uid)};r.appendChild(cb);
    list.appendChild(r)});SV.appendChild(list);
  var note=el("p","fine snote","Test-Modus: Lina, Jay, Sami und die anderen sind Test-Freunde und antworten automatisch. Echte Freunde kommen, sobald der Server verbunden ist.");SV.appendChild(note);badge()}
function live(s){return Date.now()-s.at<864e5}
function storyUsers(){return SO.friends.filter(function(u){return SO.stories.some(function(s){return s.uid===u&&live(s)})}).sort(function(a,b){var sa=SO.stories.filter(function(s){return s.uid===a&&live(s)}).every(function(s){return SO.seen[s.id]}),sb=SO.stories.filter(function(s){return s.uid===b&&live(s)}).every(function(s){return SO.seen[s.id]});return sa-sb})}
function acceptReq(uid){SO.reqIn=SO.reqIn.filter(function(x){return x!==uid});if(!isFriend(uid))SO.friends.push(uid);soSave();say("Ihr seid jetzt befreundet");refresh()}
/* ---- Benutzername wählen ---- */
var TAKEN=DEMO.map(function(u){return u.user});
function userOk(v){if(!/^[a-z][a-z0-9._]{2,19}$/.test(v))return"3 bis 20 Zeichen: kleine Buchstaben, Zahlen, Punkt oder Unterstrich. Beginnt mit einem Buchstaben.";if(TAKEN.indexOf(v)>=0)return"Dieser Benutzername ist schon vergeben.";return""}
function userSheet(){form("Benutzername",[{id:"u",label:"Benutzername",val:prof.user,ph:"zum Beispiel mo.style"},{id:"n",label:"Spitzname (freiwillig)",val:prof.nick,ph:"zum Beispiel Momo"}],"Speichern",function(v){var u=v.u.toLowerCase().replace(/^@/,"");var e=userOk(u);if(e)return e;prof.user=u;prof.nick=v.n.slice(0,24);saveProf();paintProf();refresh();say("Gespeichert");return""})}
/* ===== Freunde finden / verwalten ===== */
function friendsScreen(){var o=overlay("sfr");o.textContent="";var top=el("div","otop");top.appendChild(backBtn(function(){o.remove()}));top.appendChild(el("b","","Freunde"));o.appendChild(top);
  var q=el("input","sinput");q.type="search";q.placeholder=tr("Benutzername suchen");q.setAttribute("aria-label",tr("Benutzername suchen"));o.appendChild(q);var res=el("div","slist");o.appendChild(res);
  function paint(){res.textContent="";var v=q.value.trim().toLowerCase().replace(/^@/,"");
    if(v){var hits=DEMO.filter(function(u){return SO.blocked.indexOf(u.id)<0&&(u.user.indexOf(v)>=0||u.name.toLowerCase().indexOf(v)>=0)});
      if(!hits.length)res.appendChild(el("p","fine","Niemand mit diesem Namen gefunden."));hits.forEach(function(u){res.appendChild(personRow(u.id,paint))})}
    else{if(SO.reqIn.length){res.appendChild(el("small","wlab","Anfragen"));SO.reqIn.forEach(function(id){res.appendChild(personRow(id,paint))})}
      res.appendChild(el("small","wlab","Meine Freunde"));SO.friends.forEach(function(id){res.appendChild(personRow(id,paint))});
      var sug=DEMO.filter(function(u){return!isFriend(u.id)&&SO.reqIn.indexOf(u.id)<0&&SO.blocked.indexOf(u.id)<0});if(sug.length){res.appendChild(el("small","wlab","Vorschläge"));sug.forEach(function(u){res.appendChild(personRow(u.id,paint))})}
      if(SO.blocked.length){res.appendChild(el("small","wlab","Blockiert"));SO.blocked.forEach(function(id){res.appendChild(personRow(id,paint))})}}}
  q.oninput=paint;paint()}
function personRow(id,re){var u=uinfo(id),r=el("div","srowi"),t=el("div","sti");r.appendChild(avEl(id,44));var nm=el("b","",u.name);if(demoUser(id))nm.appendChild(el("span","stest","Test"));t.appendChild(nm);t.appendChild(el("small","","@"+u.user));r.appendChild(t);
  var b;function btn(txt,on,fn){b=el("button","sbtn"+(on?" on":""),txt);b.type="button";b.onclick=fn;r.appendChild(b)}
  if(SO.blocked.indexOf(id)>=0)btn("Freigeben",false,function(){SO.blocked=SO.blocked.filter(function(x){return x!==id});soSave();re()});
  else if(isFriend(id)){btn("Befreundet",false,function(){menu(u.name,"",[{t:"Chat öffnen",fn:function(){$("sfr")&&$("sfr").remove();showTab("friends");openChat(id)}},{t:"Freund entfernen",fn:function(){SO.friends=SO.friends.filter(function(x){return x!==id});soSave();re();refresh()}},{t:"Blockieren",fn:function(){SO.friends=SO.friends.filter(function(x){return x!==id});SO.blocked.push(id);soSave();re();refresh()}}])})}
  else if(SO.reqIn.indexOf(id)>=0)btn("Annehmen",true,function(){acceptReq(id);re()});
  else if(SO.reqOut.indexOf(id)>=0)btn("Anfrage gesendet",false,function(){});
  else btn("Hinzufügen",true,function(){SO.reqOut.push(id);soSave();re();setTimeout(function(){SO.reqOut=SO.reqOut.filter(function(x){return x!==id});if(!isFriend(id))SO.friends.push(id);soSave();notify2(id,tr("hat deine Anfrage angenommen"),FC.chat,function(){openChat(id)});refresh();if($("sfr"))re()},4000)});
  return r}
function overlay(id){var o=$(id);if(!o){o=el("div","sover");o.id=id;$("app").appendChild(o)}return o}
function backBtn(fn){var b=el("button","back");b.type="button";b.innerHTML='<svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>';b.setAttribute("aria-label",tr("Zurück"));b.onclick=fn;return b}
/* ===== 1-zu-1-Chat ===== */
function openChat(uid){OPEN=uid;var c=chat(uid);c.msgs.forEach(function(m){if(m.from!=="me"&&m.kind!=="flash"&&!m.opened)m.opened=Date.now()});soSave();chPaint(true);badge()}
function closeChat(){var uid=OPEN;OPEN=null;var o=$("schat");if(o)o.remove();if(uid){var c=chat(uid);if(c.clean==="read"){c.msgs=c.msgs.filter(function(m){return m.saved||!m.opened||m.kind==="flash"&&!m.opened})}soSave()}refresh()}
function chPaint(first){var uid=OPEN;if(!uid)return;var o=overlay("schat"),c=chat(uid),u=uinfo(uid),keep=$("cmsg")?$("cmsg").value:"",sc=$("clist")?$("clist").scrollTop:0,atEnd=!$("clist")||$("clist").scrollHeight-$("clist").scrollTop-$("clist").clientHeight<60;o.textContent="";
  var top=el("div","otop");top.appendChild(backBtn(closeChat));top.appendChild(avEl(uid,38));var tt=el("div","sti");var nm=el("b","",u.name);if(demoUser(uid))nm.appendChild(el("span","stest","Test"));tt.appendChild(nm);tt.appendChild(el("small",TYP[uid]?"typing":"",TYP[uid]?"schreibt gerade …":"@"+u.user));top.appendChild(tt);
  var mb=el("button","sicon");mb.type="button";mb.innerHTML='<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>';mb.setAttribute("aria-label",tr("Mehr"));
  mb.onclick=function(){menu(u.name,tr(c.clean==="read"?"Nachrichten werden nach dem Lesen gelöscht (außer gespeicherte).":"Nachrichten bleiben im Chat."),[{t:c.clean==="read"?"Nachrichten behalten":"Nach dem Lesen löschen",fn:function(){c.clean=c.clean==="read"?"never":"read";soSave();say(c.clean==="read"?"Nachrichten werden nach dem Lesen gelöscht":"Nachrichten bleiben im Chat")}},{t:"Freund entfernen",fn:function(){SO.friends=SO.friends.filter(function(x){return x!==uid});soSave();closeChat()}}])};top.appendChild(mb);o.appendChild(top);
  var L=el("div","clist");L.id="clist";var lastDay="";
  c.msgs.filter(function(m){return!m.deleted}).forEach(function(m){var day=new Date(m.at).toDateString();if(day!==lastDay){lastDay=day;L.appendChild(el("div","cday",dayLabel(m.at)))}L.appendChild(msgEl(uid,m))});
  if(TYP[uid]){var ty=el("div","cm them typing");ty.innerHTML="<i></i><i></i><i></i>";L.appendChild(ty)}
  if(!c.msgs.length)L.appendChild(el("p","fine cempty","Sag Hallo oder schick einen Flash!"));o.appendChild(L);
  var bar=el("div","cbar2"),cam=el("button","cround cam");cam.type="button";cam.innerHTML='<svg viewBox="0 0 24 24"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>';cam.setAttribute("aria-label",tr("Flash senden"));cam.onclick=function(){openCam(uid)};bar.appendChild(cam);
  var inp=el("input","cin2");inp.id="cmsg";inp.type="text";inp.placeholder=tr("Nachricht senden");inp.setAttribute("aria-label",tr("Nachricht senden"));inp.value=keep;bar.appendChild(inp);
  var plus=el("button","cround");plus.type="button";plus.innerHTML='<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>';plus.setAttribute("aria-label",tr("Mehr senden"));
  plus.onclick=function(){menu("Senden","",[{t:"Foto aus der Galerie",fn:function(){pickFile("image/*",function(f){compress(f,1280).then(function(d){var id="m"+mid();mediaPut(id,d).then(function(){sendTo([uid],{kind:"image",media:id})})})})}},{t:"Outfit teilen",fn:function(){shareOutfitTo(uid)}}])};bar.appendChild(plus);
  var mic=el("button","cround mic");mic.type="button";mic.innerHTML='<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>';mic.setAttribute("aria-label",tr("Sprachnachricht: gedrückt halten"));voiceBtn(mic,uid);bar.appendChild(mic);
  var send=el("button","cround send");send.type="button";send.innerHTML='<svg viewBox="0 0 24 24"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg>';send.setAttribute("aria-label",tr("Senden"));
  function upd(){var has=!!inp.value.trim();send.classList.toggle("hidden",!has);mic.classList.toggle("hidden",has)}upd();inp.oninput=upd;
  function go(){var t=inp.value.trim();if(!t)return;inp.value="";upd();sendTo([uid],{kind:"text",text:t})}send.onclick=go;inp.onkeydown=function(e){if(e.key==="Enter"){e.preventDefault();go()}};bar.appendChild(send);o.appendChild(bar);
  L.scrollTop=first||atEnd?L.scrollHeight:sc;if(first)setTimeout(function(){L.scrollTop=L.scrollHeight},40)}
function dayLabel(t){var d=new Date(t),n=new Date();if(d.toDateString()===n.toDateString())return tr("Heute");n.setDate(n.getDate()-1);if(d.toDateString()===n.toDateString())return tr("Gestern");return d.toLocaleDateString(LC[li()],{weekday:"long",day:"numeric",month:"long"})}
function msgEl(uid,m){var mine=m.from==="me",w=el("div","cm "+(mine?"me":"them")+(m.saved?" saved":"")),tm=new Date(m.at).toLocaleTimeString(LC[li()],{hour:"2-digit",minute:"2-digit"});
  if(m.kind==="text")w.appendChild(document.createTextNode(m.text));
  else if(m.kind==="flash"){w.classList.add("fl");var col=m.mtype==="video"?FC.video:FC.photo,s={icon:mine?"arrow":"sq",fill:!m.opened,col:col},ic=el("span","sic");ic.innerHTML=stIcon(s);w.appendChild(ic);
    w.appendChild(el("span","",mine?(m.opened?"Flash geöffnet":"Flash zugestellt"):(m.opened?(m.saved?"Gespeicherter Flash · tippen":"Flash angesehen"):"Neuer Flash · zum Ansehen tippen")));w.style.setProperty("--fc",col);
    if(!mine&&(!m.opened||m.saved))w.onclick=function(){viewFlashes(uid,m.id)}}
  else if(m.kind==="image"){w.classList.add("img");var im=document.createElement("img");im.alt="";mediaGet(m.media).then(function(u){if(u)im.src=u});w.appendChild(im);im.onclick=function(){viewSingle(m)}}
  else if(m.kind==="outfit"){w.classList.add("ofit");w.appendChild(el("b","",m.title||"Mein Outfit"));var g=el("div","ofg");(m.items||[]).forEach(function(x){var i=document.createElement("img");i.src=x.img;i.alt="";g.appendChild(i)});w.appendChild(g);if(m.wx)w.appendChild(el("small","",m.wx));w.appendChild(el("p","",m.text||"Passt das?"))}
  else if(m.kind==="voice"){w.classList.add("voice");var pb=el("button","vplay");pb.type="button";pb.innerHTML='<svg viewBox="0 0 24 24"><path d="M7 4l13 8-13 8z"/></svg>';var bars=el("span","vbars");for(var i=0;i<18;i++){var b=el("i");b.style.height=(30+Math.abs(Math.sin(i*1.7+m.at%7))*70)+"%";bars.appendChild(b)}
    w.appendChild(pb);w.appendChild(bars);w.appendChild(el("small","",(m.dur||1)+" s"));pb.onclick=function(){mediaGet(m.media).then(function(u){if(u){var a=new Audio(u);a.play()}})}}
  else if(m.kind==="reply"){w.classList.add("reply");var q=el("div","quote");if(m.thumb){var ti=document.createElement("img");mediaGet(m.thumb).then(function(u){if(u)ti.src=u});q.appendChild(ti)}q.appendChild(el("small","",mine?"Antwort auf eine Story":"Antwort auf deine Story"));w.appendChild(q);w.appendChild(document.createTextNode(m.text))}
  var meta=el("small","cmeta",tm+(m.saved?" · "+tr("Gespeichert"):"")+(mine&&m.kind!=="flash"?" · "+tr(m.opened?"Gelesen":"Zugestellt"):""));w.appendChild(meta);
  longPress(w,function(){var it=[{t:m.saved?"Nicht mehr speichern":"Im Chat speichern",fn:function(){m.saved=!m.saved;soSave();chPaint()}}];if(m.kind==="text")it.push({t:"Kopieren",fn:function(){try{navigator.clipboard.writeText(m.text);say("Kopiert")}catch(e){}}});
    if(mine)it.push({t:"Löschen",fn:function(){m.deleted=true;soSave();chPaint()}});menu("Nachricht","",it)});return w}
function longPress(elm,fn){var t=null;elm.addEventListener("pointerdown",function(){t=setTimeout(function(){t=null;fn()},520)});["pointerup","pointerleave","pointercancel"].forEach(function(e){elm.addEventListener(e,function(){if(t){clearTimeout(t);t=null}})});elm.addEventListener("contextmenu",function(e){e.preventDefault();fn()})}
function sendTo(uids,msg){var now=Date.now();uids.forEach(function(uid){var m=Object.assign({id:mid(),from:"me",at:now,opened:null},msg);chat(uid).msgs.push(m);bot(uid,msg.kind)});soSave();refresh()}
function shareOutfitTo(uid){var its=fitItems(),ks=Object.keys(its);if(!ks.length){say("Zieh dir in der Garderobe zuerst etwas an.");return}
  var items=ks.map(function(k){return{img:its[k].img,sub:its[k].sub}}),wxs=WX?(WX.city+" · "+WX.temp+"° · "+tr(WX.t)):"";
  var go=function(us){sendTo(us,{kind:"outfit",title:"Mein Outfit für heute",items:items,wx:wxs,text:"Passt das?"});say("Outfit geschickt")};
  if(uid)go([uid]);else pickFriends(go)}
function pickFriends(cb){menu("An wen?","",SO.friends.map(function(id){return{t:uinfo(id).name,fn:function(){cb([id])}}}))}
/* ---- Sprachnachricht: Mikrofon gedrückt halten ---- */
function voiceBtn(b,uid){var rec=null,chunks=[],t0=0,stream=null;
  b.addEventListener("pointerdown",function(e){e.preventDefault();if(!navigator.mediaDevices||!window.MediaRecorder){say("Sprachnachrichten werden hier nicht unterstützt.");return}
    navigator.mediaDevices.getUserMedia({audio:true}).then(function(s){stream=s;chunks=[];rec=new MediaRecorder(s);rec.ondataavailable=function(ev){if(ev.data.size)chunks.push(ev.data)};
      rec.onstop=function(){s.getTracks().forEach(function(x){x.stop()});var d=Math.max(1,Math.round((Date.now()-t0)/1000));if(Date.now()-t0<600)return;var bl=new Blob(chunks,{type:rec.mimeType||"audio/webm"}),id="v"+mid();mediaPut(id,bl).then(function(){sendTo([uid],{kind:"voice",media:id,dur:d})})};
      t0=Date.now();rec.start();b.classList.add("rec")}).catch(function(){say("Kein Zugriff auf das Mikrofon.")})});
  ["pointerup","pointerleave","pointercancel"].forEach(function(ev){b.addEventListener(ev,function(){b.classList.remove("rec");if(rec&&rec.state==="recording")rec.stop();rec=null})})}
function pickFile(acc,cb){var i=document.createElement("input");i.type="file";i.accept=acc;i.onchange=function(){if(i.files[0])cb(i.files[0])};i.click()}
function compress(file,max){return new Promise(function(res,rej){var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){var s=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);c.getContext("2d").drawImage(im,0,0,c.width,c.height);res(c.toDataURL("image/jpeg",.84))};im.onerror=rej;im.src=r.result};r.onerror=rej;r.readAsDataURL(file)})}

/* ---- Verbindung zur App ---- */
function socTab(k){if(k==="friends")soInit().then(inbox)}
$("t-flash").onclick=function(){soInit().then(function(){openCam(null)})};
soInit().then(function(){badge();if(!SO.pinged){SO.pinged=1;soSave();setTimeout(function(){demoImg("nora1","#f7797d","#FBD786","🏋️","Nach dem Training").then(function(){chat("u_nora").msgs.push({id:mid(),from:"u_nora",at:Date.now(),kind:"flash",mtype:"photo",media:"demo_nora1",timer:10,opened:null});soSave();incoming("u_nora","hat dir einen Flash geschickt",FC.photo)})},25000)}});
setInterval(function(){if(cur==="friends"&&!OPEN&&SO)inbox()},60000);
