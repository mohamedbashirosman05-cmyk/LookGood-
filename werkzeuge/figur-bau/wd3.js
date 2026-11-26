/* ===== Garderobe: Bedienung ===== */
var WX=null;
var CATS=[
 {k:"tops",n:"Tops",s:["T-Shirts","Hoodies","Pullover","Longsleeves","Tanktops","Hemden"]},
 {k:"bottoms",n:"Hosen",s:["Jeans","Jogginghosen","Stoffhosen","Shorts","Röcke"]},
 {k:"shoes",n:"Schuhe",s:["Sneaker","Stiefel","Sandalen"]},
 {k:"outer",n:"Jacken",s:["Jacken","Mäntel","Winterjacken","Westen"]},
 {k:"acc",n:"Accessoires",s:["Caps","Mützen","Schals","Gürtel"]},
 {k:"socks",n:"Socken",s:["Socken"]},
 {k:"jewelry",n:"Schmuck",s:["Ketten","Armbänder","Ohrringe","Ringe"]},
 {k:"watch",n:"Uhren",s:["Uhren"]},
 {k:"glasses",n:"Brillen",s:["Brillen","Sonnenbrillen"]},
 {k:"bags",n:"Taschen",s:["Rucksäcke","Umhängetaschen","Handtaschen"]},
 {k:"under",n:"Unterwäsche",s:["Unterwäsche"]}];
var WIC={tops:'<path d="M8 3.5 3 6.5l2 4 3-1.2V21h8V9.3l3 1.2 2-4-5-3c-.6 1.5-2.1 2.5-4 2.5s-3.4-1-4-2.5z"/>',
 bottoms:'<path d="M6.5 3h11l1 18h-4.5L12 10.5 10 21H5.5z"/><path d="M6.4 6h11.2"/>',
 shoes:'<path d="M2.5 17.5V12l4.5-1.5 2.5 2.5c2 1.3 5.5 1.5 8 2.5 2 .8 4 1.5 4 2.7v.8h-19z"/><path d="M2.5 15.5h19"/>',
 outer:'<path d="M9 3 12 6.5 15 3l4.5 2.5 2 7-3 1V21h-13v-7.5l-3-1 2-7z"/><path d="M12 6.5V21"/>',
 acc:'<path d="M4 15.5a8 8 0 0 1 16 0z"/><path d="M2.5 15.5H18l3.5 2H4z"/>',
 socks:'<path d="M9 3h6v8.5l2.8 3.6a3 3 0 0 1-4.6 3.9L8.5 14a3 3 0 0 1-.5-1.7z"/><path d="M9 6.5h6"/>',
 jewelry:'<path d="M5 3c0 6.5 3 10.5 7 10.5S19 9.5 19 3"/><circle cx="12" cy="17" r="3"/>',
 watch:'<circle cx="12" cy="12" r="5.5"/><path d="M9.5 6.8 10 2.5h4l.5 4.3M9.5 17.2 10 21.5h4l.5-4.3M12 9.5V12l1.8 1.2"/>',
 glasses:'<circle cx="6.5" cy="13.5" r="3.6"/><circle cx="17.5" cy="13.5" r="3.6"/><path d="M10.1 13.5h3.8M2.9 13.2 2 9.5M21.1 13.2 22 9.5"/>',
 bags:'<path d="M5 8.5h14l-1 12.5H6z"/><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5"/>',
 under:'<path d="M3 7h18v3c-3.5 0-6.5 3-7.3 7H10.3C9.5 13 6.5 10 3 10z"/>',
 more:'<circle cx="5.5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="18.5" cy="12" r="1.4"/>',
 hanger:'<path d="M12 7.5a2.3 2.3 0 1 0-2.3-2.3M12 7.5v1.7l8.6 5.6a1.4 1.4 0 0 1-.8 2.6H4.2a1.4 1.4 0 0 1-.8-2.6L12 9.2"/>',
 trash:'<path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13"/>',
 x:'<path d="M6 6l12 12M18 6 6 18"/>',plus:'<path d="M12 5v14M5 12h14"/>',
 rl:'<path d="M9 7H5V3"/><path d="M5.6 7A8 8 0 1 1 4 12"/>',rr:'<path d="M15 7h4V3"/><path d="M18.4 7A8 8 0 1 0 20 12"/>',
 cam:'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',img:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="1.6"/><path d="M21 16l-5-5-8 8"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c.8-4.5 4-7 8-7s7.2 2.5 8 7"/>'};
function wico(k){return'<svg viewBox="0 0 24 24" aria-hidden="true">'+WIC[k]+'</svg>'}
var SKINC=["#f6dcc8","#efc9a9","#e3b48c","#d19f76","#c08a63","#a26c45","#8a5634","#6e4127","#55311c","#3d2314"],
 HAIRC=["#151313","#2b1d15","#4a3020","#6f4a2e","#a77b4d","#d8b26e","#e9d5a1","#8c3b1f","#b9b5ae","#eeeeee","#d4567f","#3b5bd1"],
 EYEC=["#3a2316","#5b3a1e","#7d5a2c","#4f7a3a","#4f7fb3","#7c8a96","#a36b1d"],
 STY=[["bald","Glatze"],["buzz","Raspel"],["short","Kurz"],["curly","Locken kurz"],["afro","Afro"],["longcurly","Locken lang"],["long","Lang glatt"],["ponytail","Zopf"],["bun","Dutt"],["braids","Braids"],["dreads","Dreads"]],
 BRD=[["none","Kein Bart"],["stubble","Stoppeln"],["short","Kurzer Bart"],["full","Vollbart"]],
 PAL=["#111111","#ffffff","#8c8c8c","#3a3a3c","#1f2a44","#2f5fb3","#8fb8e8","#a3242f","#e0275f","#f2b8c6","#6b3fa0","#2e6b3a","#6b7a3a","#c8b08a","#7a4a2a","#e8c23a","#e8772e","#f3ead8"];
var WD={items:[],fit:ls("lg_outfit")||{},looks:ls("lg_looks")||[],av:ls("lg_avatar"),loaded:false,edit:false,draft:null,tab:"body"};
function defAv(){var f=prof.gender==="Weiblich";return{sex:f?"f":"m",height:f?168:178,build:.5,shoulders:.5,legs:.5,skin:"#c08a63",eyes:"#5b3a1e",eyeSize:.5,eyeTilt:.5,nose:.5,lips:.5,jaw:.5,brows:.5,hair:f?"long":"short",hairColor:"#2b1d15",beard:"none"}}
/* Speicher für Fotos: IndexedDB (viel Platz), sonst nur im Speicher */
var IDB=null;
function idb(){return new Promise(function(res){if(IDB)return res(IDB);try{var r=indexedDB.open("lookgood",1);r.onupgradeneeded=function(){r.result.createObjectStore("items",{keyPath:"id"})};r.onsuccess=function(){IDB=r.result;res(IDB)};r.onerror=function(){res(null)}}catch(e){res(null)}})}
function idbDo(mode,fn){return idb().then(function(db){if(!db)return null;return new Promise(function(res){try{var t=db.transaction("items",mode),st=t.objectStore("items"),q=fn(st);t.oncomplete=function(){res(q&&q.result!==undefined?q.result:true)};t.onerror=function(){res(null)}}catch(e){res(null)}})})}
function wdLoad(){if(WD.loaded)return Promise.resolve();return idbDo("readonly",function(s){return s.getAll()}).then(function(r){WD.items=(r||[]).sort(function(a,b){return a.at-b.at});WD.loaded=true})}
function slotOf(it){return it.cat==="acc"?(it.sub==="Caps"||it.sub==="Mützen"?"acc:head":"acc:"+it.sub):it.cat==="jewelry"?"jewelry:"+it.sub:it.cat}
function byId(id){for(var i=0;i<WD.items.length;i++)if(WD.items[i].id===id)return WD.items[i];return null}
function fitItems(){var o={};Object.keys(WD.fit).forEach(function(k){var it=byId(WD.fit[k]);if(it)o[k]=it});return o}
function saveFit(){ls("lg_outfit",WD.fit);wdOutfit();var v=v3();if(v)v.setOutfit(fitItems())}
/* ---- Aufbau der Seite ---- */
var wv=el("section","view hidden");wv.id="v-wardrobe";$("views").appendChild(wv);
var wfile=document.createElement("input");wfile.type="file";wfile.accept="image/*";wfile.hidden=true;
var wcam=document.createElement("input");wcam.type="file";wcam.accept="image/*";wcam.setAttribute("capture","environment");wcam.hidden=true;document.body.appendChild(wfile);document.body.appendChild(wcam);
var wPick=null;[wfile,wcam].forEach(function(i){i.onchange=function(e){var f=e.target.files[0];e.target.value="";if(f&&wPick)wPick(f)}});
function pickPhoto(title,text,cb,selfie){wPick=cb;wcam.setAttribute("capture",selfie?"user":"environment");
  menu(title,text,[{t:"Foto aufnehmen",fn:function(){wcam.click()}},{t:"Aus Galerie wählen",fn:function(){wfile.click()}}])}
function wdBuild(){wv.textContent="";
  var g=el("div","wd");var L=el("div","wcol"),Rr=el("div","wcol"),st=el("div","wstage noswipe");st.id="wStage";
  var left=["tops","bottoms","shoes","outer","acc","socks"],right=["jewelry","watch","glasses","bags","under","more"];
  [[L,left],[Rr,right]].forEach(function(x){x[1].forEach(function(k){var c=CATS.filter(function(q){return q.k===k})[0],b=el("button","wcb");b.type="button";b.dataset.k=k;
    b.innerHTML=wico(k);b.appendChild(el("span","",c?c.n:"Mehr"));b.onclick=function(){if(k==="more")wdMore();else catSheet(k)};x[0].appendChild(b)})});
  var wx=el("div","wwx hidden");wx.id="wWx";st.appendChild(wx);
  var msg=el("div","wmsg hidden");msg.id="wMsg";st.appendChild(msg);
  var tl=el("button","warr");tl.type="button";tl.innerHTML=wico("rl");tl.setAttribute("aria-label",tr("Nach links drehen"));tl.onclick=function(){var v=v3();if(v)v.turn(-Math.PI/4)};
  var tr2=el("button","warr r");tr2.type="button";tr2.innerHTML=wico("rr");tr2.setAttribute("aria-label",tr("Nach rechts drehen"));tr2.onclick=function(){var v=v3();if(v)v.turn(Math.PI/4)};
  st.appendChild(tl);st.appendChild(tr2);
  var it=el("div","wintro hidden");it.id="wIntro";it.appendChild(el("b","","Erstelle deine Figur"));it.appendChild(el("p","","Wähle Mann oder Frau, Hautton, Frisur, Haarfarbe und mehr. So sieht die Figur ungefähr aus wie du."));
  var b1=el("button","btn primary","Los geht’s");b1.type="button";b1.onclick=function(){openEditor()};it.appendChild(b1);st.appendChild(it);
  g.appendChild(L);g.appendChild(st);g.appendChild(Rr);wv.appendChild(g);
  var o=el("div","wout"),h=el("div","wouth"),hi=el("span","wh");hi.innerHTML=wico("hanger");h.appendChild(hi);var ot=el("b","");ot.id="wOT";h.appendChild(ot);
  var clr=el("button","wsm");clr.type="button";clr.innerHTML=wico("trash");clr.appendChild(el("span","","Alles löschen"));clr.onclick=function(){if(!Object.keys(WD.fit).length)return;WD.fit={};saveFit()};h.appendChild(clr);o.appendChild(h);
  var row=el("div","wrow"),ol=el("div","woutl");ol.id="wOL";row.appendChild(ol);var sv=el("button","wsave");sv.type="button";sv.innerHTML=wico("hanger");sv.appendChild(el("span","","Look speichern"));sv.onclick=saveLook;row.appendChild(sv);o.appendChild(row);wv.appendChild(o);
  wdOutfit();wdIntro()}
function wdOutfit(){var ol=$("wOL");if(!ol)return;var its=fitItems(),ks=Object.keys(its);$("wOT").textContent=tr("Dein Outfit")+" ("+ks.length+")";ol.textContent="";
  if(!ks.length)ol.appendChild(el("p","wempty","Tippe links oder rechts auf eine Kategorie und zieh etwas an."));
  ks.forEach(function(k){var it=its[k],d=el("div","wthumb"),im=document.createElement("img");im.src=it.img;im.alt=it.name||tr(it.sub);d.appendChild(im);
    var x=el("button","wx");x.type="button";x.innerHTML=wico("x");x.setAttribute("aria-label",tr("Ausziehen"));x.onclick=function(){delete WD.fit[k];saveFit()};d.appendChild(x);ol.appendChild(d)});
  document.querySelectorAll(".wcb").forEach(function(b){var k=b.dataset.k;b.classList.toggle("on",ks.some(function(s){return its[s].cat===k}))})}
function wdIntro(){var i=$("wIntro");if(i)i.classList.toggle("hidden",!!AV)}
function wdWxChip(){var c=$("wWx");if(!c)return;var studio=prof.wbg==="studio"||!WX;c.classList.toggle("hidden",studio);if(studio)return;
  var ic={sun:WX.night?"🌙":"☀️",cloud:"☁️",rain:WX.storm?"⛈️":"🌧️",snow:"❄️"}[WX.k]||"☁️";c.textContent=ic+" "+WX.city+" · "+WX.temp+"° · "+tr(WX.t)}
function wdEnvObj(){if(prof.wbg==="studio"||!WX)return{kind:"studio"};return{kind:"street",k:WX.k,night:WX.night,wind:WX.wind,fog:WX.fog,storm:WX.storm}}
function wdWeather(){wdWxChip();var v=V;if(v&&WD.envKey!==JSON.stringify(wdEnvObj())){WD.envKey=JSON.stringify(wdEnvObj());v.setEnv(wdEnvObj())}}
function wdMsg(t){var m=$("wMsg");if(!m)return;m.textContent=t?tr(t):"";m.classList.toggle("hidden",!t)}
/* ---- 3D starten, wenn der Tab sichtbar wird ---- */
var W3D=false;
function wdTab(k){var v=V;if(k!=="wardrobe"){if(v)v.stop();return}
  if(!W3D){W3D=true;wdMsg("Lädt …");wdLoad().then(function(){setTimeout(function(){
    if(!window.THREE){wdMsg("3D konnte nicht geladen werden.");return}
    var x=v3();if(!x){wdMsg("3D wird auf diesem Gerät nicht unterstützt.");return}
    $("wStage").insertBefore(x.canvas,$("wStage").firstChild);x.setEnv(wdEnvObj());WD.envKey=JSON.stringify(wdEnvObj());if(AV){x.setColors(avColors(AV));x.setAvatar(avParams(AV))}x.setOutfit(fitItems());wdOutfit();wdMsg("");if(cur==="wardrobe")x.start()},30)});return}
  if(v&&!$("wEd").classList.contains("hidden"))return;if(v)v.start()}
document.addEventListener("visibilitychange",function(){var v=V;if(!v)return;if(document.hidden)v.stop();else if(cur==="wardrobe")v.start()});
/* ---- Kategorie-Liste (Blatt von unten) ---- */
var wcat=null,wsub="Alle";
function wSheet(){panel.className="panel wsheet";sheet.classList.add("wsh");sheet.classList.remove("hidden")}
function catSheet(k,keepSub){var c=CATS.filter(function(q){return q.k===k})[0];if(!keepSub||wcat!==k){wsub="Alle";WD.edit=false}wcat=k;panel.textContent="";
  var h=el("div","wsh-h"),ic=el("span","wh");ic.innerHTML=wico(k);h.appendChild(ic);h.appendChild(el("h3","",c.n));
  var items=WD.items.filter(function(i){return i.cat===k});
  if(items.length){var ed=el("button","wsm",WD.edit?"Fertig":"Bearbeiten");ed.type="button";ed.onclick=function(){WD.edit=!WD.edit;catSheet(k,true)};h.appendChild(ed)}
  var x=el("button","wclose");x.type="button";x.innerHTML=wico("x");x.setAttribute("aria-label",tr("Schließen"));x.onclick=closeSheet;h.appendChild(x);panel.appendChild(h);
  if(c.s.length>1){var ch=el("div","wchips");["Alle"].concat(c.s).forEach(function(s){var b=el("button","",s);b.type="button";b.setAttribute("aria-pressed",String(s===wsub));b.onclick=function(){wsub=s;catSheet(k,true)};ch.appendChild(b)});panel.appendChild(ch)}
  var list=items.filter(function(i){return wsub==="Alle"||i.sub===wsub});
  if(!list.length){var e=el("div","wnone");e.innerHTML=wico(k);e.appendChild(el("b","",items.length?"Hier ist noch nichts.":"Hier ist noch alles leer."));
    e.appendChild(el("p","",items.length?"Füge ein Teil in dieser Art hinzu.":"Mach ein Foto von deinem ersten Teil. Die App schneidet es aus und erkennt die Farbe."));panel.appendChild(e)}
  else{var gr=el("div","wgrid");list.forEach(function(it){var on=WD.fit[slotOf(it)]===it.id,b=el("button","wit"+(on?" on":""));b.type="button";
      var im=document.createElement("img");im.src=it.img;im.alt=it.name||tr(it.sub);b.appendChild(im);if(it.name)b.appendChild(el("small","",it.name));
      if(on&&!WD.edit){var ck=el("span","wck","✓");b.appendChild(ck)}
      if(WD.edit){var dx=el("span","wdel");dx.innerHTML=wico("x");b.appendChild(dx)}
      b.onclick=function(){if(WD.edit){delItem(it);return}var s=slotOf(it);if(WD.fit[s]===it.id)delete WD.fit[s];else WD.fit[s]=it.id;saveFit();catSheet(k,true)};gr.appendChild(b)});panel.appendChild(gr)}
  var add=el("button","btn wadd");add.type="button";add.innerHTML=wico("plus");add.appendChild(el("span","",tr(items.length?"Weitere hinzufügen":"Erstes Teil hinzufügen")));
  add.onclick=function(){addItem(k,wsub!=="Alle"?wsub:null)};panel.appendChild(add);wSheet()}
function delItem(it){menu("Teil löschen?",(it.name||tr(it.sub))+" "+tr("wird aus deiner Garderobe entfernt."),[{t:"Löschen",fn:function(){
  idbDo("readwrite",function(s){return s.delete(it.id)});WD.items=WD.items.filter(function(x){return x.id!==it.id});Object.keys(WD.fit).forEach(function(k){if(WD.fit[k]===it.id)delete WD.fit[k]});
  WD.looks.forEach(function(l){Object.keys(l.fit).forEach(function(k){if(l.fit[k]===it.id)delete l.fit[k]})});WD.looks=WD.looks.filter(function(l){return Object.keys(l.fit).length});ls("lg_looks",WD.looks);
  saveFit();setTimeout(function(){catSheet(it.cat,true)},0)}}])}
/* ---- Foto: Hintergrund entfernen, Farbe erkennen ---- */
function loadImg(file){return new Promise(function(res,rej){var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){res(im)};im.onerror=rej;im.src=r.result};r.onerror=rej;r.readAsDataURL(file)})}
function hex(r,g,b){return"#"+[r,g,b].map(function(v){v=Math.max(0,Math.min(255,Math.round(v)));return(v<16?"0":"")+v.toString(16)}).join("")}
function cutout(im){var mx=520,s=Math.min(1,mx/Math.max(im.width,im.height)),w=Math.max(1,Math.round(im.width*s)),h=Math.max(1,Math.round(im.height*s)),c=document.createElement("canvas");c.width=w;c.height=h;
  var g=c.getContext("2d");g.drawImage(im,0,0,w,h);var D=g.getImageData(0,0,w,h),p=D.data,N=w*h,bg=new Uint8Array(N),q=new Int32Array(N),qh=0,qt=0;
  function d2(i,j){var a=i*4,b=j*4,x=p[a]-p[b],y=p[a+1]-p[b+1],z=p[a+2]-p[b+2];return x*x+y*y+z*z}
  var seed=new Int32Array(N);function push(i,s){if(bg[i])return;bg[i]=1;seed[i]=s;q[qt++]=i}
  for(var x=0;x<w;x++){push(x,x);push((h-1)*w+x,(h-1)*w+x)}for(var y=0;y<h;y++){push(y*w,y*w);push(y*w+w-1,y*w+w-1)}
  while(qh<qt){var i=q[qh++],ix=i%w,iy=(i/w)|0,nb=[ix>0?i-1:-1,ix<w-1?i+1:-1,iy>0?i-w:-1,iy<h-1?i+w:-1];
    for(var k=0;k<4;k++){var j=nb[k];if(j<0||bg[j])continue;if(d2(j,i)<500&&d2(j,seed[i])<2600)push(j,seed[i])}}
  var nbg=0;for(i=0;i<N;i++)if(bg[i])nbg++;var ok=nbg>N*.08&&nbg<N*.93,x0=w,y0=h,x1=0,y1=0;
  var hist={},cxm=w/2,cym=h/2;
  for(i=0;i<N;i++){var px=i%w,py=(i/w)|0,a=i*4;if(ok&&bg[i]){p[a+3]=0;continue}
    if(ok){var edge=(px>0&&bg[i-1])||(px<w-1&&bg[i+1])||(py>0&&bg[i-w])||(py<h-1&&bg[i+w]);if(edge)p[a+3]=150}
    if(px<x0)x0=px;if(px>x1)x1=px;if(py<y0)y0=py;if(py>y1)y1=py;
    if(!ok&&(Math.abs(px-cxm)>w*.25||Math.abs(py-cym)>h*.25))continue;
    var key=(p[a]>>4)+"_"+(p[a+1]>>4)+"_"+(p[a+2]>>4),wt=1-.6*Math.hypot((px-cxm)/w,(py-cym)/h),e2=hist[key]||(hist[key]={n:0,r:0,g:0,b:0});e2.n+=wt;e2.r+=p[a]*wt;e2.g+=p[a+1]*wt;e2.b+=p[a+2]*wt}
  g.putImageData(D,0,0);var bins=Object.keys(hist).map(function(k){var e=hist[k];return{n:e.n,c:[e.r/e.n,e.g/e.n,e.b/e.n]}}).sort(function(a,b){return b.n-a.n});
  var c1=bins[0]?bins[0].c:[128,128,128],c2=null;for(var b=1;b<bins.length&&b<40;b++){var cc=bins[b].c,dd=Math.hypot(cc[0]-c1[0],cc[1]-c1[1],cc[2]-c1[2]);if(dd>70&&bins[b].n>bins[0].n*.08){c2=cc;break}}
  if(!ok){x0=0;y0=0;x1=w-1;y1=h-1}var bw=x1-x0+1,bh=y1-y0+1,m=Math.round(Math.max(bw,bh)*.06),out=document.createElement("canvas"),sc=Math.min(1,400/Math.max(bw+2*m,bh+2*m));
  out.width=Math.round((bw+2*m)*sc);out.height=Math.round((bh+2*m)*sc);var og=out.getContext("2d");og.drawImage(c,x0,y0,bw,bh,m*sc,m*sc,bw*sc,bh*sc);
  var j=document.createElement("canvas"),js=Math.min(1,512/Math.max(w,h));j.width=w*js;j.height=h*js;var jg=j.getContext("2d");jg.fillStyle="#fff";jg.fillRect(0,0,j.width,j.height);jg.drawImage(im,0,0,j.width,j.height);
  return{img:out.toDataURL(ok?"image/png":"image/jpeg",.85),cut:ok,color:hex(c1[0],c1[1],c1[2]),color2:c2?hex(c2[0],c2[1],c2[2]):null,jpg:j.toDataURL("image/jpeg",.8)}}
/* ---- KI-Hilfe (nur wenn der Server verbunden ist) ---- */
function aiJSON(system,img,text){if(!AI_URL)return Promise.reject(new Error("off"));var ctl=window.AbortController?new AbortController():null,tm=setTimeout(function(){if(ctl)ctl.abort()},25000);
  return fetch(AI_URL,{method:"POST",headers:{"Content-Type":"application/json"},signal:ctl?ctl.signal:undefined,body:JSON.stringify({max_tokens:300,system:system,messages:[{role:"user",content:[{type:"image",source:{type:"base64",media_type:"image/jpeg",data:img.split(",")[1]}},{type:"text",text:text}]}]})})
  .then(function(r){clearTimeout(tm);if(!r.ok)throw new Error("http");return r.json()}).then(function(d){var t=(d.content||[]).map(function(p){return p.text||""}).join(""),m=t.match(/\{[\s\S]*\}/);if(!m)throw new Error("json");return JSON.parse(m[0])})}
function isHex(c){return typeof c==="string"&&/^#[0-9a-f]{6}$/i.test(c)}
/* ---- Teil hinzufügen ---- */
function addItem(k,sub){var c=CATS.filter(function(q){return q.k===k})[0];
  pickPhoto(tr(c.n)+": "+tr("Teil hinzufügen"),"Leg das Teil flach auf einen ruhigen, hellen Untergrund und fotografiere es von vorne.",function(f){say("Foto wird vorbereitet …");
    loadImg(f).then(function(im){var r=cutout(im);itemForm(k,r,sub||c.s[0])}).catch(function(){say("Das Foto konnte nicht geöffnet werden.")})})}
function itemForm(k,r,sub){var c=CATS.filter(function(q){return q.k===k})[0],st={sub:sub,color:r.color,color2:r.color2,name:"",touched:{}};panel.textContent="";
  var h=el("div","wsh-h");h.appendChild(el("h3","","Neues Teil"));var x=el("button","wclose");x.type="button";x.innerHTML=wico("x");x.onclick=function(){catSheet(k,true)};h.appendChild(x);panel.appendChild(h);
  var pv=el("div","wprev"),im=document.createElement("img");im.src=r.img;im.alt="";pv.appendChild(im);panel.appendChild(pv);
  var ai=el("p","fine wai","");panel.appendChild(ai);
  if(!r.cut)panel.appendChild(el("p","fine","Tipp: Mit einem ruhigen, hellen Hintergrund wird das Teil sauber ausgeschnitten."));
  var subs=el("div","wchips");function paintSubs(){subs.textContent="";c.s.forEach(function(s){var b=el("button","",s);b.type="button";b.setAttribute("aria-pressed",String(s===st.sub));b.onclick=function(){st.sub=s;st.touched.sub=1;paintSubs()};subs.appendChild(b)})}
  if(c.s.length>1){panel.appendChild(el("small","wlab","Art"));paintSubs();panel.appendChild(subs)}
  panel.appendChild(el("small","wlab","Farbe"));var sw=el("div","wsw");function paintSw(){sw.textContent="";[st.color].concat(PAL.filter(function(p){return p!==st.color})).forEach(function(col,n){var b=el("button");b.type="button";b.style.background=col;b.setAttribute("aria-label",n?colName(col):tr("Erkannte Farbe"));b.setAttribute("aria-pressed",String(col===st.color));b.onclick=function(){st.color=col;st.touched.color=1;paintSw()};sw.appendChild(b)})}
  paintSw();panel.appendChild(sw);
  var nl=el("label","fl");nl.appendChild(el("small","","Name (freiwillig)"));var ni=el("input");ni.type="text";ni.maxLength=40;ni.placeholder=tr("zum Beispiel: Schwarzer Hoodie");ni.oninput=function(){st.touched.name=1};nl.appendChild(ni);panel.appendChild(nl);
  var sv=el("button","btn primary","Speichern");sv.type="button";sv.onclick=function(){
    var it={id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),cat:k,sub:st.sub,name:ni.value.trim(),color:st.color,color2:st.color2,img:r.img,at:Date.now()};
    idbDo("readwrite",function(s){return s.put(it)}).then(function(ok){if(!ok)say("Auf diesem Gerät kann gerade nichts dauerhaft gespeichert werden.")});
    WD.items.push(it);WD.fit[slotOf(it)]=it.id;saveFit();wsub="Alle";catSheet(k,true);say("Gespeichert und angezogen")};
  panel.appendChild(sv);var cn=el("button","link","Abbrechen");cn.type="button";cn.onclick=function(){catSheet(k,true)};panel.appendChild(cn);wSheet();
  if(AI_URL){ai.textContent=tr("Die KI schaut sich dein Teil an …");
    aiJSON("You label ONE clothing item photo for a wardrobe app. Reply ONLY with JSON: {\"sub\": exactly one of "+JSON.stringify(c.s)+", \"name\": short name in "+LN[li()]+" (2-4 words: colour, type, brand if clearly visible), \"color\": main colour as #rrggbb, \"color2\": second colour as #rrggbb or null}.",r.jpg,"Label this item.")
    .then(function(j){if(!panel.contains(ai))return;ai.textContent="";if(j.sub&&c.s.indexOf(j.sub)>=0&&!st.touched.sub){st.sub=j.sub;if(c.s.length>1)paintSubs()}
      if(isHex(j.color)&&!st.touched.color){st.color=j.color.toLowerCase();paintSw()}if(isHex(j.color2))st.color2=j.color2;if(j.name&&!st.touched.name&&!ni.value)ni.value=String(j.name).slice(0,40)})
    .catch(function(){if(panel.contains(ai))ai.textContent=""})}}
function colName(h){var N=[["#111111","Schwarz","black"],["#ffffff","Weiß","white"],["#8c8c8c","Grau","grey"],["#3a3a3c","Dunkelgrau","dark grey"],["#1f2a44","Navy","navy"],["#2f5fb3","Blau","blue"],["#8fb8e8","Hellblau","light blue"],["#a3242f","Rot","red"],["#7a1f2b","Weinrot","burgundy"],["#e0275f","Pink","pink"],["#f2b8c6","Rosa","light pink"],["#6b3fa0","Lila","purple"],["#2e6b3a","Grün","green"],["#6b7a3a","Oliv","olive"],["#c8b08a","Beige","beige"],["#7a4a2a","Braun","brown"],["#e8c23a","Gelb","yellow"],["#e8772e","Orange","orange"],["#f3ead8","Creme","cream"]];
  var c=parseInt(h.slice(1),16),r=c>>16,g=c>>8&255,b=c&255,best=null,bd=1e9;N.forEach(function(n){var d=parseInt(n[0].slice(1),16),dr=r-(d>>16),dg=g-(d>>8&255),db=b-(d&255),dd=dr*dr*.3+dg*dg*.59+db*db*.11;if(dd<bd){bd=dd;best=n}});return arguments[1]?best[2]:tr(best[1])}
/* ---- Looks ---- */
function saveLook(){var its=fitItems();if(!Object.keys(its).length){say("Zieh zuerst etwas an.");return}
  WD.looks.unshift({id:Date.now().toString(36),at:Date.now(),fit:Object.assign({},WD.fit)});WD.looks=WD.looks.slice(0,40);ls("lg_looks",WD.looks);say("Look gespeichert")}
function looksSheet(){panel.textContent="";var h=el("div","wsh-h");h.appendChild(el("h3","","Meine Looks"));var x=el("button","wclose");x.type="button";x.innerHTML=wico("x");x.onclick=closeSheet;h.appendChild(x);panel.appendChild(h);
  if(!WD.looks.length){var e=el("div","wnone");e.innerHTML=wico("hanger");e.appendChild(el("b","","Noch keine Looks"));e.appendChild(el("p","","Stell ein Outfit zusammen und tippe auf „Look speichern“."));panel.appendChild(e)}
  WD.looks.forEach(function(l){var row=el("div","wlook"),th=el("button","wlth");th.type="button";Object.keys(l.fit).forEach(function(k){var it=byId(l.fit[k]);if(it){var im=document.createElement("img");im.src=it.img;im.alt="";th.appendChild(im)}});
    th.appendChild(el("small","",new Date(l.at).toLocaleDateString(LC[li()],{day:"numeric",month:"short"})));th.onclick=function(){WD.fit=Object.assign({},l.fit);saveFit();closeSheet();say("Look angezogen")};row.appendChild(th);
    var d=el("button","wclose");d.type="button";d.innerHTML=wico("trash");d.setAttribute("aria-label",tr("Löschen"));d.onclick=function(){WD.looks=WD.looks.filter(function(z){return z!==l});ls("lg_looks",WD.looks);looksSheet()};row.appendChild(d);panel.appendChild(row)});wSheet()}
function wdMore(){menu("Mehr","",[].concat(AV?[{t:"Figur bearbeiten",fn:function(){openEditor()}}]:[{t:"Figur erstellen",fn:function(){openEditor()}}],[{t:tr("Meine Looks")+" ("+WD.looks.length+")",fn:looksSheet},
  {t:prof.wbg==="studio"?"Hintergrund: Straße mit Wetter":"Hintergrund: Studio",fn:function(){prof.wbg=prof.wbg==="studio"?"":"studio";saveProf();wdWeather()}}]))}
var wed=el("div","wed hidden");wed.id="wEd";wed.setAttribute("role","dialog");$("app").appendChild(wed);
/* ---- Figur gestalten: Schritt für Schritt (Plan des Inhabers) ---- */
var TONES=[["dunkelbraun","Dunkelbraun",[1,0,0],"#6e4a38","","#4a3326"],["braun","Braun",[.6,.1,.3],"#a07a60","","#7d5a44"],["olive","Olive",[.1,.35,.55],"#cfae8a","","#b48e68"],["hell","Hell",[0,0,1],"#ffffff","","#e9c9b0"],["ginger","Ginger",[0,0,1],"#ffe6dc","2","#f1cdb8"]];
var HTYPES=[["1","Glatt",[["1A","Sehr glatt"],["1B","Glatt"],["1C","Glatt, kräftiger"]]],["2","Wellig",[["2A","Leicht wellig"],["2B","Wellig"],["2C","Stark wellig"]]],
  ["3","Lockig",[["3A","Locken"],["3B","Engere Locken"],["3C","Sehr enge Locken"]]],["4","Kraus",[["4A","Eng gekräuselt"],["4B","Zickzack-Struktur"],["4C","Sehr eng gekräuselt"]]]];
/* id, Name, passt zu Haartyp-Gruppen, Reihenfolge Mann / Frau */
var HSTY=[["none","Glatze","1234",0,99],["buzz","Buzz Cut","1234",1,11],["short02","Kurz klassisch","12",2,10],["short03","French Crop","12",3,9],["short04","Slick Back","12",4,13],["short01","Kurz voluminös","234",5,12],
  ["afro01","Afro","34",6,6],["cornrows","Cornrows","34",7,8],["box_braids","Box Braids","34",8,7],["mohawk","Iro mit Spikes","1234",9,14],["long01","Lang glatt","12",10,1],
  ["ponytail01","Pferdeschwanz","123",11,4],["bob01","Bob","12",12,2],["bob02","Long Bob mit Seitenscheitel","12",13,3],["braid01","Geflochtener Zopf","123",14,5]];
var BEARDS=[["none","Kein Bart"],["stubble","Dreitagebart"],["mustache","Schnurrbart"],["mustache_stubble","Schnurrbart mit Stoppeln"],["goatee","Ziegenbart"],["short_beard","Kurzer Vollbart"],["full_beard","Vollbart"]];
var HCOL=[["#121010","Tiefschwarz"],["#161a26","Blauschwarz"],["#3b2a20","Dunkelbraun"],["#5e4130","Mittelbraun"],["#8a6446","Hellbraun"],["#6e6157","Aschbraun"],["#9c7d55","Dunkelblond"],["#d4ac6a","Goldblond"],
  ["#e8d0a0","Hellblond"],["#efe6d2","Platinblond"],["#b8592e","Kupfer"],["#c8693a","Ginger"],["#7e3a25","Auburn"],["#8e1f2c","Kirschrot"],["#a9a9ad","Silbergrau"],["#efefef","Weiß"]];
var EYES=[["darkbrown","Dunkelbraun","#3b2416"],["brown","Braun","#5b3a1e"],["brownlight","Hellbraun","#8a6236"],["blackbrown","Schwarzbraun","#24160e"],["green","Grün","#4f7a3a"],["bluegreen","Blaugrün","#3f7f78"],
  ["blue","Blau","#4f7fb3"],["deepblue","Tiefblau","#2f4f8f"],["lightblue","Hellblau","#8fb4d8"],["ice","Eisblau","#b8d4e0"],["grey","Grau","#7c8a96"]];
var CSTEPS=["sex","tone","htype","hair","hcol","beard","details"];
var AV=ls("lg_avatar2");
function curAv(){return AV}
function toneOf(a){return TONES.filter(function(t){return t[0]===a.tone})[0]||TONES[3]}
function shift(hex,k){var c=new THREE.Color(hex),h={};c.getHSL(h);h.l=Math.max(.05,Math.min(.97,h.l+k*.14));c.setHSL(h.h,h.s,h.l);return"#"+c.getHexString()}
function avParams(a){var f=a.sex==="f",t=toneOf(a),hc=a.hairColor||"#3b2a20";
  return{gender:f?0:1,age:.5,muscle:.5,weight:.5,height:.5,proportions:.5,african:t[2][0],asian:t[2][1],caucasian:t[2][2],skin:"young_caucasian_"+(f?"female":"male")+t[4],skinTint:a.toneAdj?shift(t[3],a.toneAdj):t[3],
    eyes:a.eyes||"brown",eyebrows:a.brows||"eyebrow001",eyelashes:a.lashes||(f?"eyelashes02":"eyelashes01"),hair:a.hair||"none",hairTint:hc,hairColor:hc,facialHair:f?"none":(a.beard||"none"),beardColor:a.beardColor||hc,
    outfit:"none",top:f?"tank_top":"none",jacket:"none",bottom:"resort_shorts",shoes:"none",hat:"none",detail:"medium",expression:"neutral",tattoos:[],earrings:"none",accessories:[]}}
function avColors(a){var hc=a.hairColor||"#3b2a20";return{hair:hc,beard:a.beardColor||hc,brow:a.browColor||shift(hc,-.15)}}
var CR={step:0,d:null,busy:false,wasNew:false};
function crBuild(){var v=v3();if(!v)return;CR.busy=true;crStatus();v.setColors(avColors(CR.d));v.setAvatar(avParams(CR.d),function(ok){CR.busy=false;crStatus();if(!ok)say("Die Figur konnte nicht gebaut werden.")})}
function crStatus(){var s=$("crBusy");if(s)s.classList.toggle("hidden",!CR.busy)}
function crSet(k,val,rebuild){CR.d[k]=val;if(rebuild!==false)crBuild();else{var v=V;if(v)v.setColors(avColors(CR.d))}crPaint()}
function openEditor(){CR.wasNew=!AV;CR.d=Object.assign({sex:null,tone:null,toneAdj:0,htype:null,hair:"none",hairColor:"#3b2a20",beard:"none",eyes:"brown",brows:"eyebrow001",lashes:null},AV||{});CR.step=AV?1:0;closeSheet();wed.classList.remove("hidden");
  var go=function(){var v=v3();if(!v){wed.classList.add("hidden");say("3D wird auf diesem Gerät nicht unterstützt.");return}crPaint();if(CR.d.sex)crBuild();else v.clearAvatar();v.start();setTimeout(v.resize,30)};
  if(!W3D){W3D=true;wdLoad().then(function(){var v=v3();if(v){v.setEnv({kind:"studio"});WD.envKey="";v.setOutfit(fitItems())}wdMsg("");go()})}else{var v=V;if(v){v.setEnv({kind:"studio"});WD.envKey=""}go()}}
function closeEditor(save){var v=V;if(save){AV=Object.assign({},CR.d);ls("lg_avatar2",AV)}CR.d=null;wed.classList.add("hidden");
  if(v){var st=$("wStage");st.insertBefore(v.canvas,st.firstChild);v.cam("body");v.setEnv(wdEnvObj());WD.envKey=JSON.stringify(wdEnvObj());
    if(AV){v.setColors(avColors(AV));if(!save)v.setAvatar(avParams(AV))}else v.clearAvatar();
    if(cur==="wardrobe"){v.start();setTimeout(v.resize,30)}else v.stop()}wdIntro();if(save)say("Deine Figur ist gespeichert")}
function crSteps(){return CSTEPS.filter(function(s){return s!=="beard"||!CR.d||CR.d.sex!=="f"})}
function crPaint(){var d=CR.d,steps=crSteps(),k=steps[CR.step]||steps[0];wed.textContent="";
  var top=el("div","wedtop"),bk=el("button","back");bk.type="button";bk.innerHTML='<svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>';bk.setAttribute("aria-label",tr("Zurück"));
  bk.onclick=function(){if(CR.step>0){CR.step--;crPaint()}else closeEditor(false)};top.appendChild(bk);top.appendChild(el("b","","Deine Figur"));
  var pc=el("small","crpos",(CR.step+1)+" / "+steps.length);top.appendChild(pc);wed.appendChild(top);
  var dots=el("div","crdots");steps.forEach(function(s,i){var x=el("i",i<=CR.step?"on":"");dots.appendChild(x)});wed.appendChild(dots);
  var stg=el("div","wedstage noswipe");stg.id="wEdStage";var v=V;if(v&&v.canvas)stg.appendChild(v.canvas);
  var busy=el("div","crbusy hidden");busy.id="crBusy";busy.appendChild(el("span","spin"));busy.appendChild(el("span","","Figur wird gebaut …"));stg.appendChild(busy);
  if(!d.sex){var hint=el("div","crhint","Wähle zuerst Mann oder Frau.");stg.appendChild(hint)}
  var tl=el("button","warr");tl.type="button";tl.innerHTML=wico("rl");tl.setAttribute("aria-label",tr("Nach links drehen"));tl.onclick=function(){var x=v3();if(x)x.turn(-Math.PI/4)};
  var tr3=el("button","warr r");tr3.type="button";tr3.innerHTML=wico("rr");tr3.setAttribute("aria-label",tr("Nach rechts drehen"));tr3.onclick=function(){var x=v3();if(x)x.turn(Math.PI/4)};stg.appendChild(tl);stg.appendChild(tr3);wed.appendChild(stg);
  if(v)v.cam(k==="sex"?"body":"face");
  var B=el("div","wedbody");wed.appendChild(B);
  var T1={sex:"Mann oder Frau?",tone:"Gesicht und Hautton",htype:"Dein Haartyp",hair:"Frisur",hcol:"Haarfarbe",beard:"Bart",details:"Augen und Details"}[k];
  B.appendChild(el("h3","crh",T1));
  function card(lab,on,fn,sw){var b=el("button","crcard"+(on?" on":""));b.type="button";if(sw){var s=el("span","crsw");s.style.background=sw;b.appendChild(s)}b.appendChild(el("span","",lab));b.onclick=fn;return b}
  if(k==="sex"){var g=el("div","crgrid two");[["m","Mann"],["f","Frau"]].forEach(function(o){g.appendChild(card(o[1],d.sex===o[0],function(){var first=!d.sex;d.sex=o[0];if(d.sex==="f")d.beard="none";crBuild();if(first){CR.step=1}crPaint()}))});B.appendChild(g)}
  if(k==="tone"){B.appendChild(el("p","crp","Alle starten ohne Haare und ohne Bart. Das kommt in den nächsten Schritten."));var g2=el("div","crgrid");TONES.forEach(function(t){g2.appendChild(card(t[1],d.tone===t[0],function(){d.tone=t[0];d.toneAdj=0;crBuild();crPaint()},t[5]))});B.appendChild(g2);
    if(d.tone){var w=el("div","wsl"),hd=el("div","wslh");hd.appendChild(el("small","wlab","Hautton feiner einstellen"));w.appendChild(hd);var r=document.createElement("input");r.type="range";r.min=-1;r.max=1;r.step=.05;r.value=d.toneAdj||0;r.setAttribute("aria-label",tr("Hautton feiner einstellen"));
      r.onchange=function(){d.toneAdj=+r.value;crBuild()};w.appendChild(r);var en=el("div","wends");en.appendChild(el("span","","Dunkler"));en.appendChild(el("span","","Heller"));w.appendChild(en);B.appendChild(w)}}
  if(k==="htype"){B.appendChild(el("p","crp","Damit zeigen wir dir zuerst die Frisuren, die zu deinem Haar passen."));HTYPES.forEach(function(gr){B.appendChild(el("small","wlab",gr[1]));var g3=el("div","crgrid three");
    gr[2].forEach(function(s){var b=card(s[0]+" · "+tr(s[1]),d.htype===s[0],function(){d.htype=s[0];crPaint()});g3.appendChild(b)});B.appendChild(g3)})}
  if(k==="hair"){var grp=(d.htype||"1")[0],fit=[],rest=[];HSTY.slice().sort(function(a,b){return d.sex==="f"?a[4]-b[4]:a[3]-b[3]}).forEach(function(h){(h[2].indexOf(grp)>=0||h[0]==="none"?fit:rest).push(h)});
    var g4=el("div","crgrid");fit.forEach(function(h){g4.appendChild(card(h[1],d.hair===h[0],function(){d.hair=h[0];crBuild();crPaint()}))});B.appendChild(g4);
    if(rest.length){B.appendChild(el("small","wlab","Weitere Frisuren"));var g5=el("div","crgrid");rest.forEach(function(h){g5.appendChild(card(h[1],d.hair===h[0],function(){d.hair=h[0];crBuild();crPaint()}))});B.appendChild(g5)}
    B.appendChild(el("p","fine","Mehr Frisuren können wir später dazukaufen."))}
  if(k==="hcol"){B.appendChild(el("p","crp","Fahre mit dem Finger über das Farbfeld. Die Haare ändern sich sofort."));B.appendChild(colorField(d.hairColor,function(c,end){d.hairColor=c;var x=V;if(x)x.setColors(avColors(d));if(end)crPaint()}));
    var g6=el("div","wsw wbig");HCOL.forEach(function(c){var b=el("button");b.type="button";b.style.background=c[0];b.title=tr(c[1]);b.setAttribute("aria-label",tr(c[1]));b.setAttribute("aria-pressed",String(d.hairColor===c[0]));b.onclick=function(){d.hairColor=c[0];var x=V;if(x)x.setColors(avColors(d));crPaint()};g6.appendChild(b)});B.appendChild(g6)}
  if(k==="beard"){var g7=el("div","crgrid");BEARDS.forEach(function(b){g7.appendChild(card(b[1],(d.beard||"none")===b[0],function(){d.beard=b[0];crBuild();crPaint()}))});B.appendChild(g7);
    if(d.beard&&d.beard!=="none"){B.appendChild(el("small","wlab","Bartfarbe"));var g8=el("div","wsw wbig");[[null,"Wie die Haare"]].concat(HCOL).forEach(function(c){var b=el("button");b.type="button";b.style.background=c[0]||d.hairColor;if(!c[0])b.classList.add("same");b.setAttribute("aria-label",tr(c[1]));b.setAttribute("aria-pressed",String((d.beardColor||null)===c[0]));b.onclick=function(){d.beardColor=c[0];var x=V;if(x)x.setColors(avColors(d));crPaint()};g8.appendChild(b)});B.appendChild(g8)}}
  if(k==="details"){B.appendChild(el("small","wlab","Augenfarbe"));var g9=el("div","crgrid");EYES.forEach(function(e){g9.appendChild(card(e[1],d.eyes===e[0],function(){d.eyes=e[0];crBuild();crPaint()},e[2]))});B.appendChild(g9);
    B.appendChild(el("small","wlab","Augenbrauen: Form"));var ga=el("div","crgrid six");for(var i=1;i<=12;i++)(function(i){var id="eyebrow"+(i<10?"00":"0")+i;ga.appendChild(card(String(i),(d.brows||"eyebrow001")===id,function(){d.brows=id;crBuild();crPaint()}))})(i);B.appendChild(ga);
    B.appendChild(el("small","wlab","Augenbrauen: Farbe"));var gb=el("div","wsw wbig");[[null,"Passend zu den Haaren"]].concat(HCOL).forEach(function(c){var b=el("button");b.type="button";b.style.background=c[0]||shift(d.hairColor,-.15);if(!c[0])b.classList.add("same");b.setAttribute("aria-label",tr(c[1]));b.setAttribute("aria-pressed",String((d.browColor||null)===c[0]));b.onclick=function(){d.browColor=c[0];var x=V;if(x)x.setColors(avColors(d));crPaint()};gb.appendChild(b)});B.appendChild(gb);
    B.appendChild(el("small","wlab","Wimpern"));var gc=el("div","crgrid four");[["eyelashes01","Natürlich"],["eyelashes02","Etwas länger"],["eyelashes03","Lang"],["eyelashes04","Sehr lang"]].forEach(function(l){gc.appendChild(card(l[1],(d.lashes||(d.sex==="f"?"eyelashes02":"eyelashes01"))===l[0],function(){d.lashes=l[0];crBuild();crPaint()}))});B.appendChild(gc)}
  var ft=el("div","wedfoot crfoot");var last=CR.step===steps.length-1;
  if(CR.step>0){var pb=el("button","btn","Zurück");pb.type="button";pb.onclick=function(){CR.step--;crPaint()};ft.appendChild(pb)}
  var nb=el("button","btn primary",last?"Figur speichern":"Weiter");nb.type="button";nb.disabled=!d.sex||(k==="tone"&&!d.tone);
  nb.onclick=function(){if(last){closeEditor(true);return}if(k==="htype"&&!d.htype)d.htype="1B";CR.step++;crPaint()};ft.appendChild(nb);wed.appendChild(ft);crStatus()}
/* Großes Farbfeld: links→rechts Farbton, oben→unten hell→dunkel, unten ein Graustreifen. */
function colorField(val,cb){var w=el("div","cfield"),c=document.createElement("canvas"),dot=el("span","cdot");c.width=600;c.height=260;w.appendChild(c);w.appendChild(dot);
  var g=c.getContext("2d"),H=200,G=60;for(var x=0;x<600;x+=2){for(var y=0;y<H;y+=2){g.fillStyle="hsl("+(x/600*360)+",62%,"+(90-y/H*84)+"%)";g.fillRect(x,y,2,2)}}
  for(x=0;x<600;x+=2){g.fillStyle="hsl(0,0%,"+(4+x/600*92)+"%)";g.fillRect(x,H,2,G)}
  function pick(e,end){var r=c.getBoundingClientRect(),px=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),py=Math.max(0,Math.min(.999,(e.clientY-r.top)/r.height)),cy=py*260,col;
    if(cy<H)col=new THREE.Color().setHSL(px,.62,(90-cy/H*84)/100);else col=new THREE.Color().setHSL(0,0,(4+px*92)/100);
    dot.style.left=px*100+"%";dot.style.top=py*100+"%";var hex="#"+col.getHexString();dot.style.background=hex;cb(hex,end)}
  var on=false;c.addEventListener("pointerdown",function(e){on=true;try{c.setPointerCapture(e.pointerId)}catch(_){}pick(e)});c.addEventListener("pointermove",function(e){if(on)pick(e)});
  c.addEventListener("pointerup",function(e){if(on){on=false;pick(e,true)}});c.addEventListener("pointercancel",function(){on=false});
  dot.style.left="50%";dot.style.top="50%";dot.style.background=val||"#3b2a20";return w}

/* Für die KI im Chat: was liegt im Schrank, was ist gerade angezogen */
function wdForAI(){if(!WD.items.length)return"";var its=WD.items.slice(-60).map(function(i){return i.sub+" "+colName(i.color,1)+(i.name?" ('"+i.name+"')":"")}),on=fitItems(),w=Object.keys(on).map(function(k){var i=on[k];return i.sub+" "+colName(i.color,1)});
  return " Their wardrobe in the app: "+its.join("; ")+"."+(w.length?" Currently put together in the app: "+w.join(", ")+".":"")+" When you suggest outfits, prefer pieces from their wardrobe and name them."}
wdBuild();wdLoad().then(function(){wdOutfit()});
