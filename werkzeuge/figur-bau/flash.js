/* ===== Flash-Kamera ===== */
var CAM={stream:null,face:"environment",torch:false,to:null,story:false,rec:null};
function camStop(){if(CAM.stream){CAM.stream.getTracks().forEach(function(t){t.stop()});CAM.stream=null}}
function openCam(toUid,story){CAM.to=toUid||null;CAM.story=!!story;var o=overlay("fcam");o.className="sover dark";o.textContent="";
  var v=document.createElement("video");v.id="fvid";v.setAttribute("playsinline","");v.muted=true;v.autoplay=true;o.appendChild(v);
  var fl=el("div","fflash");fl.id="fflash";o.appendChild(fl);
  var top=el("div","ctop"),x=el("button","cglass");x.type="button";x.innerHTML='<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>';x.setAttribute("aria-label",tr("Schließen"));x.onclick=closeCam;top.appendChild(x);
  if(toUid){top.appendChild(el("span","cto",tr("An")+" "+uinfo(toUid).name))}else if(story)top.appendChild(el("span","cto","Für deine Story"));
  var right=el("div","ccol"),flip=el("button","cglass");flip.type="button";flip.innerHTML='<svg viewBox="0 0 24 24"><path d="M4 7h11l-3-3M20 17H9l3 3"/></svg>';flip.setAttribute("aria-label",tr("Kamera wechseln"));flip.onclick=function(){CAM.face=CAM.face==="user"?"environment":"user";camStart()};
  var torch=el("button","cglass");torch.type="button";torch.id="ftorch";torch.innerHTML='<svg viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>';torch.setAttribute("aria-label",tr("Blitz"));torch.onclick=function(){CAM.torch=!CAM.torch;torch.classList.toggle("on",CAM.torch);applyTorch()};
  right.appendChild(flip);right.appendChild(torch);top.appendChild(right);o.appendChild(top);
  var fb=el("div","cfall hidden");fb.id="cfall";fb.appendChild(el("p","","Die Live-Kamera ist hier nicht verfügbar. Nimm ein Foto oder Video mit der Kamera deines Handys auf."));
  [["Foto aufnehmen","image/*","environment"],["Video aufnehmen","video/*","environment"]].forEach(function(a){var b=el("button","btn",a[0]);b.type="button";b.onclick=function(){var i=document.createElement("input");i.type="file";i.accept=a[1];i.setAttribute("capture",a[2]);i.onchange=function(){if(i.files[0])fromFile(i.files[0])};i.click()};fb.appendChild(b)});o.appendChild(fb);
  var bot=el("div","cbot"),gal=el("button","cglass");gal.type="button";gal.innerHTML='<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="1.6"/><path d="M21 16l-5-5-8 8"/></svg>';gal.setAttribute("aria-label",tr("Aus Galerie wählen"));
  gal.onclick=function(){pickFile("image/*,video/*",fromFile)};bot.appendChild(gal);
  var sh=el("button","shut");sh.type="button";sh.id="fshut";sh.setAttribute("aria-label",tr("Tippen: Foto. Gedrückt halten: Video."));sh.innerHTML='<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" class="sring"/><circle cx="50" cy="50" r="44" class="sprog" id="fprog"/></svg>';bot.appendChild(sh);
  var hint=el("span","chint","Tippen: Foto · Halten: Video");bot.appendChild(hint);o.appendChild(bot);shutter(sh);camStart()}
function camStart(){camStop();var v=$("fvid");if(!v)return;
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){$("cfall").classList.remove("hidden");return}
  navigator.mediaDevices.getUserMedia({video:{facingMode:CAM.face,width:{ideal:1280},height:{ideal:1920}},audio:false}).then(function(s){CAM.stream=s;v.srcObject=s;v.classList.toggle("mirror",CAM.face==="user");$("cfall").classList.add("hidden");applyTorch()})
  .catch(function(){$("cfall").classList.remove("hidden")})}
function applyTorch(){var t=CAM.stream&&CAM.stream.getVideoTracks()[0];if(!t||CAM.face==="user")return;try{var c=t.getCapabilities&&t.getCapabilities();if(c&&c.torch)t.applyConstraints({advanced:[{torch:CAM.torch}]})}catch(e){}}
function closeCam(){camStop();var o=$("fcam");if(o)o.remove()}
function shutter(b){var hold=null,start=0,rec=null,chunks=[],tick=null;
  b.addEventListener("pointerdown",function(e){e.preventDefault();start=Date.now();hold=setTimeout(function(){hold=null;startVideo()},350)});
  function end(){if(hold){clearTimeout(hold);hold=null;takePhoto()}else if(rec&&rec.state==="recording")rec.stop()}
  b.addEventListener("pointerup",end);b.addEventListener("pointercancel",end);
  function startVideo(){if(!CAM.stream||!window.MediaRecorder){say("Video wird hier nicht unterstützt. Tippe für ein Foto.");return}
    var go=function(stream){chunks=[];try{rec=new MediaRecorder(stream)}catch(e){say("Video wird hier nicht unterstützt. Tippe für ein Foto.");return}rec.ondataavailable=function(ev){if(ev.data.size)chunks.push(ev.data)};
      rec.onstop=function(){clearInterval(tick);b.classList.remove("rec");$("fprog").style.strokeDashoffset="";stream.getAudioTracks().forEach(function(t){t.stop()});var bl=new Blob(chunks,{type:rec.mimeType||"video/webm"});rec=null;if(bl.size)openEditor2({type:"video",blob:bl,mirror:CAM.face==="user"})};
      rec.start();b.classList.add("rec");var t0=Date.now();tick=setInterval(function(){var p=Math.min(1,(Date.now()-t0)/10000);$("fprog").style.strokeDashoffset=String(277*(1-p));if(p>=1&&rec&&rec.state==="recording")rec.stop()},80)};
    navigator.mediaDevices.getUserMedia({audio:true}).then(function(a){var s=new MediaStream(CAM.stream.getVideoTracks().concat(a.getAudioTracks()));go(s)}).catch(function(){go(new MediaStream(CAM.stream.getVideoTracks()))})}}
function takePhoto(){var v=$("fvid");if(!CAM.stream||!v||!v.videoWidth){return}var fl=$("fflash");
  var shoot=function(){var c=document.createElement("canvas"),w=v.videoWidth,h=v.videoHeight;c.width=w;c.height=h;var g=c.getContext("2d");if(CAM.face==="user"){g.translate(w,0);g.scale(-1,1)}g.drawImage(v,0,0,w,h);
    openEditor2({type:"photo",url:c.toDataURL("image/jpeg",.9)})};
  if(CAM.torch&&CAM.face==="user"){fl.classList.add("on");setTimeout(function(){shoot();fl.classList.remove("on")},180)}else{fl.classList.add("blink");setTimeout(function(){fl.classList.remove("blink")},200);shoot()}}
function fromFile(f){if(/^video\//.test(f.type))openEditor2({type:"video",blob:f});else compress(f,1440).then(function(d){openEditor2({type:"photo",url:d})})}
/* ===== Bearbeiten: Text-Balken, Emojis, Zeichnen, Filter, Timer ===== */
var FILT=[["Normal",""],["Warm","sepia(.25) saturate(1.25) brightness(1.04)"],["Kühl","hue-rotate(-12deg) saturate(.9) brightness(1.05) contrast(1.05)"],["S/W","grayscale(1) contrast(1.1)"],["Vintage","sepia(.45) contrast(.95) brightness(1.05) saturate(.85)"],["Lebendig","saturate(1.6) contrast(1.08)"],["Abend","brightness(.85) contrast(1.15) saturate(1.1) hue-rotate(-8deg)"]];
var TIMERS=[3,5,10,0];
var ED=null;
function openEditor2(src){camStop();var o=overlay("fedit");o.className="sover dark";o.textContent="";ED={src:src,filter:0,timer:5,draw:false,color:"#ffffff",strokes:[],texts:[],stickers:[]};
  var st=el("div","estage");st.id="estage";o.appendChild(st);var med;
  if(src.type==="photo"){med=document.createElement("img");med.src=src.url}else{med=document.createElement("video");med.src=URL.createObjectURL(src.blob);med.loop=true;med.autoplay=true;med.setAttribute("playsinline","");med.muted=false;if(src.mirror)med.classList.add("mirror");med.play().catch(function(){med.muted=true;med.play().catch(function(){})})}
  med.className+=" emed";med.id="emed";st.appendChild(med);
  var cv=document.createElement("canvas");cv.className="edraw";cv.id="edraw";st.appendChild(cv);var lay=el("div","elay");lay.id="elay";st.appendChild(lay);
  setTimeout(function(){var r=st.getBoundingClientRect();cv.width=r.width*2;cv.height=r.height*2;redraw()},30);drawing(cv);
  var top=el("div","ctop"),x=el("button","cglass");x.type="button";x.innerHTML='<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>';x.setAttribute("aria-label",tr("Verwerfen"));x.onclick=function(){o.remove();openCam(CAM.to,CAM.story)};top.appendChild(x);
  var tools=el("div","ccol tools");function tool(svg,lab,fn){var b=el("button","cglass");b.type="button";b.innerHTML=svg;b.setAttribute("aria-label",tr(lab));b.onclick=function(){fn(b)};tools.appendChild(b);return b}
  tool('<svg viewBox="0 0 24 24"><path d="M5 5h14M12 5v14"/></svg>',"Text",function(){addText()});
  tool('<svg viewBox="0 0 24 24"><path d="M3 21l3-1 12-12-2-2L4 18zM14 6l2 2"/></svg>',"Zeichnen",function(b){ED.draw=!ED.draw;b.classList.toggle("on",ED.draw);$("epal").classList.toggle("hidden",!ED.draw)});
  tool('<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 14c1 1.5 2.3 2 4 2s3-.5 4-2"/><circle cx="9" cy="10" r=".8"/><circle cx="15" cy="10" r=".8"/></svg>',"Emoji",emojiSheet);
  var tb=tool('<svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9 2h6"/></svg>',"Timer",function(b){var i=(TIMERS.indexOf(ED.timer)+1)%TIMERS.length;ED.timer=TIMERS[i];tl.textContent=ED.timer?ED.timer+"s":"∞"});var tl=el("span","tlab","5s");tb.appendChild(tl);
  tool('<svg viewBox="0 0 24 24"><path d="M9 14l-4 4M15 4l5 5-9 9-5-5z"/></svg>',"Rückgängig",function(){if(ED.strokes.length){ED.strokes.pop();redraw()}});top.appendChild(tools);o.appendChild(top);
  var pal=el("div","epal hidden");pal.id="epal";["#ffffff","#111111","#E0275F","#7B4DFF","#1596C8","#2ecc71","#f1c40f","#ff7a00"].forEach(function(c){var b=el("button");b.type="button";b.style.background=c;b.setAttribute("aria-label",c);b.onclick=function(){ED.color=c;Array.prototype.forEach.call(pal.children,function(x){x.classList.toggle("on",x===b)})};if(c==="#ffffff")b.classList.add("on");pal.appendChild(b)});o.appendChild(pal);
  var fr=el("div","efil noswipe");FILT.forEach(function(f,i){var b=el("button","",f[0]);b.type="button";b.setAttribute("aria-pressed",String(i===0));b.onclick=function(){ED.filter=i;med.style.filter=f[1];Array.prototype.forEach.call(fr.children,function(x,j){x.setAttribute("aria-pressed",String(j===i))})};fr.appendChild(b)});o.appendChild(fr);
  var trash=el("div","etrash hidden");trash.id="etrash";trash.innerHTML='<svg viewBox="0 0 24 24"><path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/></svg>';o.appendChild(trash);
  var bot=el("div","ebot");var sto=el("button","cpill");sto.type="button";sto.appendChild(el("span","","Meine Story"));sto.onclick=function(){edFinish(function(f){postStory(f);edDone()})};
  var snd=el("button","cpill main");snd.type="button";snd.appendChild(el("span","",CAM.to?tr("An")+" "+uinfo(CAM.to).name:tr("Senden an")));snd.innerHTML+='<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  snd.onclick=function(){edFinish(function(f){if(CAM.to){sendFlash([CAM.to],f);edDone()}else sendScreen(f)})};bot.appendChild(sto);bot.appendChild(snd);o.appendChild(bot)}
function edDone(){["fedit","fsend","fcam"].forEach(function(i){var x=$(i);if(x)x.remove()});camStop();if(OPEN)chPaint();else{showTab("friends")}}
function drawing(cv){var cur2=null;cv.addEventListener("pointerdown",function(e){if(!ED.draw)return;var r=cv.getBoundingClientRect();cur2={c:ED.color,p:[[(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height]]};ED.strokes.push(cur2);try{cv.setPointerCapture(e.pointerId)}catch(_){}});
  cv.addEventListener("pointermove",function(e){if(!cur2)return;var r=cv.getBoundingClientRect();cur2.p.push([(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height]);redraw()});cv.addEventListener("pointerup",function(){cur2=null});cv.style.pointerEvents="auto"}
function redraw(){var cv=$("edraw");if(!cv)return;var g=cv.getContext("2d");g.clearRect(0,0,cv.width,cv.height);g.lineCap=g.lineJoin="round";g.lineWidth=cv.width*.012;
  ED.strokes.forEach(function(s){g.strokeStyle=s.c;g.beginPath();s.p.forEach(function(p,i){var x=p[0]*cv.width,y=p[1]*cv.height;if(i)g.lineTo(x,y);else g.moveTo(x,y)});g.stroke()})}
/* Text-Balken wie bekannt aus Foto-Apps: quer über das Bild, nach oben/unten schiebbar; nochmal tippen wechselt den Stil */
function addText(){var t={y:.62,style:0,size:1,txt:""};ED.texts.push(t);var b=el("div","etext s0");b.contentEditable="true";b.setAttribute("aria-label",tr("Text"));b.spellcheck=false;$("elay").appendChild(b);t.el=b;b.focus();
  b.oninput=function(){t.txt=b.innerText};b.onblur=function(){if(!b.innerText.trim()){b.remove();ED.texts=ED.texts.filter(function(x){return x!==t})}};
  var y0=0,p0=0,moved=false;b.addEventListener("pointerdown",function(e){if(document.activeElement===b)return;y0=e.clientY;p0=t.y;moved=false;try{b.setPointerCapture(e.pointerId)}catch(_){}b.dataset.drag="1";$("etrash").classList.remove("hidden")});
  b.addEventListener("pointermove",function(e){if(b.dataset.drag!=="1")return;var r=$("estage").getBoundingClientRect(),dy=(e.clientY-y0)/r.height;if(Math.abs(dy)>.01)moved=true;t.y=Math.max(.05,Math.min(.92,p0+dy));b.style.top=t.y*100+"%";$("etrash").classList.toggle("hot",t.y>.86)});
  b.addEventListener("pointerup",function(){if(b.dataset.drag!=="1")return;b.dataset.drag="";$("etrash").classList.add("hidden");if(t.y>.86){b.remove();ED.texts=ED.texts.filter(function(x){return x!==t});return}if(!moved){t.style=(t.style+1)%3;b.className="etext s"+t.style}});
  b.style.top=t.y*100+"%"}
var EMOJIS="😀 😂 😍 🥰 😎 🤩 😜 🤔 😴 😭 😡 🥶 🥵 👀 🔥 ✨ 💯 ❤️ 💜 💙 👍 👏 🙌 🙏 💪 👑 🎉 🌧️ ☀️ ❄️ ⛅ 🌈 👕 👖 👟 🧢 🧥 👗 👜 🕶️ ⌚ 💍".split(" ");
function emojiSheet(){menuGrid(EMOJIS,function(e){addSticker(e)})}
function menuGrid(list,cb){panel.className="panel";panel.textContent="";panel.appendChild(el("h3","","Emoji"));var g=el("div","egrid");list.forEach(function(e){var b=el("button");b.type="button";b.textContent=e;b.onclick=function(){closeSheet();cb(e)};g.appendChild(b)});panel.appendChild(g);
  var c=el("button","link","Schließen");c.type="button";c.onclick=closeSheet;panel.appendChild(c);sheet.classList.remove("hidden")}
function addSticker(e){var s={x:.5,y:.4,k:1,e:e};ED.stickers.push(s);var d=el("div","estk");d.textContent=e;$("elay").appendChild(d);s.el=d;place();
  function place(){d.style.left=s.x*100+"%";d.style.top=s.y*100+"%";d.style.transform="translate(-50%,-50%) scale("+s.k+")"}
  var pts={},start=null;d.addEventListener("pointerdown",function(ev){pts[ev.pointerId]=[ev.clientX,ev.clientY];try{d.setPointerCapture(ev.pointerId)}catch(_){}start={x:s.x,y:s.y,k:s.k,p:JSON.parse(JSON.stringify(pts))};$("etrash").classList.remove("hidden")});
  d.addEventListener("pointermove",function(ev){if(!pts[ev.pointerId])return;pts[ev.pointerId]=[ev.clientX,ev.clientY];var ids=Object.keys(pts),r=$("estage").getBoundingClientRect();
    if(ids.length===1&&start.p[ids[0]]){s.x=Math.max(0,Math.min(1,start.x+(pts[ids[0]][0]-start.p[ids[0]][0])/r.width));s.y=Math.max(0,Math.min(1,start.y+(pts[ids[0]][1]-start.p[ids[0]][1])/r.height))}
    else if(ids.length>=2&&start.p[ids[0]]&&start.p[ids[1]]){var d0=Math.hypot(start.p[ids[0]][0]-start.p[ids[1]][0],start.p[ids[0]][1]-start.p[ids[1]][1]),d1=Math.hypot(pts[ids[0]][0]-pts[ids[1]][0],pts[ids[0]][1]-pts[ids[1]][1]);s.k=Math.max(.4,Math.min(4,start.k*d1/(d0||1)))}
    $("etrash").classList.toggle("hot",s.y>.86);place()});
  function up(ev){delete pts[ev.pointerId];start={x:s.x,y:s.y,k:s.k,p:JSON.parse(JSON.stringify(pts))};if(!Object.keys(pts).length){$("etrash").classList.add("hidden");if(s.y>.86){d.remove();ED.stickers=ED.stickers.filter(function(x){return x!==s})}}}
  d.addEventListener("pointerup",up);d.addEventListener("pointercancel",up);
  d.addEventListener("wheel",function(ev){ev.preventDefault();s.k=Math.max(.4,Math.min(4,s.k*(ev.deltaY<0?1.1:.9)));place()},{passive:false})}
/* Alles zu einem Bild zusammensetzen (Foto) bzw. Ebene über dem Video */
function overlayCanvas(W,H){var c=document.createElement("canvas");c.width=W;c.height=H;var g=c.getContext("2d"),st=$("estage").getBoundingClientRect(),k=W/st.width;
  var dc=$("edraw");if(dc)g.drawImage(dc,0,0,W,H);
  ED.stickers.forEach(function(s){g.font=Math.round(56*s.k*k)+"px system-ui,Apple Color Emoji,Segoe UI Emoji";g.textAlign="center";g.textBaseline="middle";g.fillText(s.e,s.x*W,s.y*H)});
  ED.texts.forEach(function(t){if(!t.txt||!t.txt.trim())return;var y=t.y*H,fs=Math.round((t.style===0?22:34)*k);g.font=(t.style===0?"600 ":"800 ")+fs+"px system-ui";g.textAlign="center";g.textBaseline="middle";
    var lines=t.txt.trim().split("\n");if(t.style===0){g.fillStyle="rgba(0,0,0,.55)";g.fillRect(0,y-fs*.95,W,fs*(1.2*lines.length+.7))}
    lines.forEach(function(l,i){var yy=y+i*fs*1.2;if(t.style===2){var w=g.measureText(l).width;g.fillStyle="#E0275F";g.fillRect(W/2-w/2-fs*.4,yy-fs*.7,w+fs*.8,fs*1.4);g.fillStyle="#fff"}else{g.fillStyle="#fff";if(t.style===1){g.lineWidth=fs*.12;g.strokeStyle="rgba(0,0,0,.45)";g.strokeText(l,W/2,yy)}}g.fillText(l,W/2,yy)})});return c}
function edFinish(cb){var src=ED.src,st=$("estage").getBoundingClientRect(),W=1080,H=Math.round(W*st.height/st.width);
  if(src.type==="photo"){var im=new Image();im.onload=function(){var c=document.createElement("canvas");c.width=W;c.height=H;var g=c.getContext("2d");g.fillStyle="#000";g.fillRect(0,0,W,H);
      var s=Math.max(W/im.width,H/im.height),w=im.width*s,h=im.height*s;g.filter=FILT[ED.filter][1]||"none";g.drawImage(im,(W-w)/2,(H-h)/2,w,h);g.filter="none";g.drawImage(overlayCanvas(W,H),0,0);
      var url=c.toDataURL("image/jpeg",.84),id="f"+mid();mediaPut(id,url).then(function(){cb({media:id,mtype:"photo",timer:ED.timer})})};im.src=src.url;return}
  var ov=overlayCanvas(540,Math.round(540*st.height/st.width)).toDataURL("image/png"),id="f"+mid(),oid="o"+mid();
  Promise.all([mediaPut(id,src.blob),mediaPut(oid,ov)]).then(function(){cb({media:id,mtype:"video",overlay:oid,filter:ED.filter,mirror:!!src.mirror,timer:ED.timer})})}
function sendFlash(uids,f){sendTo(uids,Object.assign({kind:"flash"},f));say(uids.length>1?tr("An # Freunde gesendet").replace("#",uids.length):tr("Gesendet"))}
function postStory(f){SO.stories.push(Object.assign({id:mid(),uid:"me",at:Date.now()},f));soSave();say("Zu deiner Story hinzugefügt");
  SO.friends.filter(demoUser).forEach(function(u,i){setTimeout(function(){var s=SO.stories.filter(function(x){return x.uid==="me"}).pop();if(!s)return;SO.myViews[s.id]=SO.myViews[s.id]||[];if(SO.myViews[s.id].indexOf(u)<0)SO.myViews[s.id].push(u);soSave()},3000+i*2500)})}
function sendScreen(f){var o=overlay("fsend");o.className="sover";o.textContent="";var sel={},story=false;
  var top=el("div","otop");top.appendChild(backBtn(function(){o.remove()}));top.appendChild(el("b","","Senden an"));o.appendChild(top);
  var L=el("div","slist");var srow=el("label","spick");srow.appendChild(avEl("me",44,"seen"));var tt=el("div","sti");tt.appendChild(el("b","","Meine Story"));tt.appendChild(el("small","","24 Stunden für alle deine Freunde"));srow.appendChild(tt);
  var sc=document.createElement("input");sc.type="checkbox";sc.onchange=function(){story=sc.checked;upd()};srow.appendChild(sc);L.appendChild(srow);L.appendChild(el("small","wlab","Freunde"));
  SO.friends.forEach(function(id){var r=el("label","spick");r.appendChild(avEl(id,44));var t=el("div","sti");t.appendChild(el("b","",uinfo(id).name));t.appendChild(el("small","","@"+uinfo(id).user));r.appendChild(t);var c=document.createElement("input");c.type="checkbox";c.onchange=function(){if(c.checked)sel[id]=1;else delete sel[id];upd()};r.appendChild(c);L.appendChild(r)});
  o.appendChild(L);var bar=el("div","sendbar");var lab=el("span","");bar.appendChild(lab);var b=el("button","cpill main");b.type="button";b.innerHTML='<svg viewBox="0 0 24 24"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg>';b.disabled=true;
  b.onclick=function(){var ids=Object.keys(sel);if(ids.length)sendFlash(ids,f);if(story)postStory(f);edDone()};bar.appendChild(b);o.appendChild(bar);
  function upd(){var n=Object.keys(sel).map(function(i){return uinfo(i).name});if(story)n.unshift(tr("Meine Story"));lab.textContent=n.join(", ");b.disabled=!n.length;bar.classList.toggle("on",!!n.length)}upd()}
/* ===== Ansehen: Flashes und Storys (Fortschritt oben, tippen = weiter/zurück, halten = Pause) ===== */
function viewFlashes(uid,onlyId){var ms=chat(uid).msgs.filter(function(m){return m.kind==="flash"&&m.from!=="me"&&(onlyId?m.id===onlyId:!m.opened)});if(!ms.length){openChat(uid);return}
  player(ms.map(function(m){return{uid:uid,src:m,at:m.at,dur:m.timer}}),function(item){item.src.opened=item.src.opened||Date.now();soSave()},function(){refresh();if(!onlyId)openChat(uid)},uid)}
function viewStories(uids,start){var items=[];uids.slice(start).forEach(function(u){SO.stories.filter(function(s){return s.uid===u&&live(s)}).sort(function(a,b){return a.at-b.at}).forEach(function(s){items.push({uid:u,src:s,at:s.at,dur:5,story:true})})});
  player(items,function(it){SO.seen[it.src.id]=1;soSave()},refresh)}
function viewSingle(m){player([{uid:m.from,src:{media:m.media,mtype:"photo"},at:m.at,dur:0,single:true}],function(){},function(){})}
function player(items,onSeen,onEnd,replyUid){if(!items.length)return;var o=overlay("fview");o.className="sover dark fview";o.textContent="";var i=0,t0=0,el0=0,paused=false,raf=0,curDur=5;
  var bars=el("div","vbars2");items.forEach(function(){var b=el("i");b.appendChild(el("b"));bars.appendChild(b)});o.appendChild(bars);
  var head=el("div","vhead");o.appendChild(head);var stage=el("div","vstage");o.appendChild(stage);
  var x=el("button","cglass vx");x.type="button";x.innerHTML='<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>';x.setAttribute("aria-label",tr("Schließen"));x.onclick=function(e){e.stopPropagation();close()};o.appendChild(x);
  var foot=el("div","vfoot");o.appendChild(foot);
  function close(){cancelAnimationFrame(raf);var v=stage.querySelector("video");if(v)v.pause();o.remove();if(onEnd)onEnd()}
  function show(k){i=k;if(i>=items.length){close();return}if(i<0)i=0;var it=items[i];onSeen(it);stage.textContent="";head.textContent="";foot.textContent="";
    head.appendChild(avEl(it.uid,34));var hn=el("div","sti");hn.appendChild(el("b","",it.uid==="me"?tr("Meine Story"):uinfo(it.uid).name));hn.appendChild(el("small","",ago(it.at)));head.appendChild(hn);
    Array.prototype.forEach.call(bars.children,function(b,j){b.firstChild.style.width=j<i?"100%":"0%"});
    var s=it.src;mediaGet(s.media).then(function(url){if(!url){stage.appendChild(el("p","fine","Nicht mehr verfügbar."));return}
      if(s.mtype==="video"){var v=document.createElement("video");v.src=url;v.setAttribute("playsinline","");v.autoplay=true;v.style.filter=(FILT[s.filter||0]||FILT[0])[1];if(s.mirror)v.classList.add("mirror");stage.appendChild(v);v.play().catch(function(){v.muted=true;v.play()});
        if(s.overlay)mediaGet(s.overlay).then(function(ou){if(ou){var im=document.createElement("img");im.src=ou;im.className="vov";stage.appendChild(im)}});
        v.onloadedmetadata=function(){curDur=it.dur===0?0:(v.duration&&isFinite(v.duration)?v.duration:it.dur||5);t0=performance.now();el0=0};v.loop=it.dur===0}
      else{var im2=document.createElement("img");im2.src=url;stage.appendChild(im2);curDur=it.dur||0;t0=performance.now();el0=0}});
    if(it.story&&it.uid!=="me"){var inp=el("input","vreply");inp.placeholder=tr("Antworten …");inp.setAttribute("aria-label",tr("Antworten …"));inp.onfocus=function(){paused=true};inp.onblur=function(){paused=false;t0=performance.now()-el0*1000};
      inp.onkeydown=function(e){if(e.key==="Enter"&&inp.value.trim()){sendTo([it.uid],{kind:"reply",text:inp.value.trim(),thumb:s.media});inp.value="";say("Antwort gesendet");inp.blur()}};foot.appendChild(inp)}
    if(it.uid==="me"){var vs=(SO.myViews[s.id]||[]).map(function(u){return uinfo(u).name});foot.appendChild(el("small","vviews",vs.length?tr("Angesehen von")+" "+vs.join(", "):tr("Noch niemand hat sie angesehen")))}
    if(!it.story&&!it.single&&replyUid){var cbtn=el("button","cpill");cbtn.type="button";cbtn.appendChild(el("span","","Antworten im Chat"));cbtn.onclick=function(e){e.stopPropagation();close()};foot.appendChild(cbtn)}
    if(it.src&&it.src.from&&!it.story&&!it.single){var sv2=el("button","cpill");sv2.type="button";sv2.appendChild(el("span","",it.src.saved?"Gespeichert":"Im Chat speichern"));sv2.onclick=function(e){e.stopPropagation();it.src.saved=true;soSave();sv2.firstChild.textContent=tr("Gespeichert")};foot.appendChild(sv2)}
    t0=performance.now();el0=0;curDur=it.dur||0}
  function loop(now){raf=requestAnimationFrame(loop);if(paused){return}el0=(now-t0)/1000;if(curDur>0){var p=Math.min(1,el0/curDur);var b=bars.children[i];if(b)b.firstChild.style.width=p*100+"%";if(p>=1)show(i+1)}else{var b2=bars.children[i];if(b2)b2.firstChild.style.width="100%"}}
  var hold=null,downX=0,downY=0,held=false;
  stage.addEventListener("pointerdown",function(e){downX=e.clientX;downY=e.clientY;held=false;hold=setTimeout(function(){held=true;paused=true;var v=stage.querySelector("video");if(v)v.pause()},260)});
  stage.addEventListener("pointerup",function(e){clearTimeout(hold);if(held){paused=false;t0=performance.now()-el0*1000;var v=stage.querySelector("video");if(v)v.play();return}
    if(e.clientY-downY>90){close();return}var w=window.innerWidth;if(e.clientX<w*.3)show(i-1);else show(i+1)});
  show(0);raf=requestAnimationFrame(loop)}
