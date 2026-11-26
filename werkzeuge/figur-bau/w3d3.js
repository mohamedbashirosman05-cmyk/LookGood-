/* ===== Garderobe: 3D-Figur, Kleidung, Straße mit Wetter (three.js) ===== */
var V=null;
function v3(){if(V!==null)return V;try{V=mk3D()}catch(e){console.error(e);V=false}return V}
function mk3D(){
var T=THREE;
var cv=document.createElement("canvas");cv.className="wcv";
var R=new T.WebGLRenderer({canvas:cv,antialias:true,powerPreference:"high-performance"});
R.setPixelRatio(Math.min(window.devicePixelRatio||1,2));R.outputColorSpace=T.SRGBColorSpace;R.useLegacyLights=true;R.toneMapping=T.ACESFilmicToneMapping;R.toneMappingExposure=.95;
R.shadowMap.enabled=true;R.shadowMap.type=T.PCFSoftShadowMap;
var S=new T.Scene(),C=new T.PerspectiveCamera(26,.5,.05,200);
var fig=new T.Group(),bodyG=new T.Group(),clothG=new T.Group();fig.add(bodyG);fig.add(clothG);S.add(fig);
var env=new T.Group();S.add(env);
var hemi=new T.HemisphereLight(0xffffff,0x444444,1),key=new T.DirectionalLight(0xffffff,2),rim=new T.DirectionalLight(0xffffff,.8),fill=new T.DirectionalLight(0xffffff,.4),lamp=new T.PointLight(0xffc477,0,7,1.6);
key.position.set(-2.2,4.5,3.2);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-1.2;key.shadow.camera.right=1.2;key.shadow.camera.top=2.2;key.shadow.camera.bottom=-.4;key.shadow.camera.near=1;key.shadow.camera.far=12;key.shadow.bias=-.0006;key.shadow.normalBias=.02;
rim.position.set(2.5,3,-3);fill.position.set(2.5,1.2,3);lamp.position.set(1.4,2.6,.6);
S.add(hemi,key,rim,fill,lamp);
var LF={},A0=null,t0=performance.now(),last=t0,run=false,raf=0,ang=0,vel=0,tgt=null,lag=0,lagV=0,drag=null,camMode="body",camT=null,camP=null,wx={kind:"studio"},WP=null,flash=0;
/* ---------- Helfer ---------- */
var TX={};
function canvasTex(key,w,h,draw,rep){if(TX[key])return TX[key];var c=document.createElement("canvas");c.width=w;c.height=h;draw(c.getContext("2d"),w,h);var t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;if(rep)t.repeat.set(rep[0],rep[1]);t.anisotropy=4;TX[key]=t;return t}
function noise(g,w,h,a,b){var d=g.getImageData(0,0,w,h),p=d.data;for(var i=0;i<p.length;i+=4){var v=a+Math.random()*(b-a);p[i]=p[i]*v;p[i+1]=p[i+1]*v;p[i+2]=p[i+2]*v}g.putImageData(d,0,0)}
function fab(kind){return canvasTex("f_"+kind,256,256,function(g,w,h){
  g.fillStyle="#fff";g.fillRect(0,0,w,h);
  if(kind==="denim"){g.strokeStyle="rgba(0,0,0,.13)";g.lineWidth=1.2;for(var i=-h;i<w;i+=4){g.beginPath();g.moveTo(i,0);g.lineTo(i+h,h);g.stroke()}noise(g,w,h,.86,1)}
  else if(kind==="knit"){g.strokeStyle="rgba(0,0,0,.10)";for(var y=0;y<h;y+=3){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke()}noise(g,w,h,.9,1)}
  else if(kind==="puffer"){noise(g,w,h,.93,1)}
  else if(kind==="leather"){noise(g,w,h,.95,1)}
  else noise(g,w,h,.92,1)},[3,3])}
function mat(col,o){o=o||{};var m=new T.MeshStandardMaterial({color:new T.Color(col),roughness:o.r!=null?o.r:.88,metalness:o.m||0});
  if(o.map){m.map=o.map}if(o.side)m.side=o.side;if(o.op!=null){m.transparent=true;m.opacity=o.op;m.depthWrite=o.op>.7}if(o.em){m.emissive=new T.Color(o.em);m.emissiveIntensity=o.ei||1}return m}
function msh(g,m,par,noShadow){var x=new T.Mesh(g,m);x.castShadow=!noShadow;x.receiveShadow=true;(par||clothG).add(x);return x}
function cr(tab,y){var n=tab.length;if(y<=tab[0][0])return tab[0][1];if(y>=tab[n-1][0])return tab[n-1][1];
  for(var i=1;i<n;i++)if(y<=tab[i][0]){var p0=tab[Math.max(i-2,0)],p1=tab[i-1],p2=tab[i],p3=tab[Math.min(i+1,n-1)],t=(y-p1[0])/(p2[0]-p1[0]),
    m1=(p2[1]-p0[1])/((p2[0]-p0[0])||1)*(p2[0]-p1[0]),m2=(p3[1]-p1[1])/((p3[0]-p1[0])||1)*(p2[0]-p1[0]),t2=t*t,t3=t2*t;
    return(2*t3-3*t2+1)*p1[1]+(t3-2*t2+t)*m1+(-2*t3+3*t2)*p2[1]+(t3-t2)*m2}return tab[n-1][1]}
function ss(a,b,x){var t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)}
function grid(nu,nv,fn,closed,flip){var P=[],U=[],I=[],i,j;
  for(j=0;j<=nv;j++)for(i=0;i<=nu;i++){var p=fn(i/nu,j/nv);P.push(p[0],p[1],p[2]);U.push(i/nu,j/nv)}
  for(j=0;j<nv;j++)for(i=0;i<nu;i++){var a=j*(nu+1)+i,b=a+1,c=a+nu+1,d=c+1;if(flip)I.push(a,c,b,b,c,d);else I.push(a,b,c,b,d,c)}
  var g=new T.BufferGeometry();g.setAttribute("position",new T.Float32BufferAttribute(P,3));g.setAttribute("uv",new T.Float32BufferAttribute(U,2));g.setIndex(I);g.computeVertexNormals();
  if(closed){var N=g.attributes.normal;for(j=0;j<=nv;j++){var a0=j*(nu+1),a1=a0+nu,x=N.getX(a0)+N.getX(a1),y=N.getY(a0)+N.getY(a1),z=N.getZ(a0)+N.getZ(a1),l=Math.hypot(x,y,z)||1;N.setXYZ(a0,x/l,y/l,z/l);N.setXYZ(a1,x/l,y/l,z/l)}}
  return g}
function shade(hex,f){var c=new T.Color(hex);c.multiplyScalar(f);return"#"+c.getHexString()}
function mix(a,b,t){return"#"+new T.Color(a).lerp(new T.Color(b),t).getHexString()}
function lum(hex){var c=new T.Color(hex);return .2126*c.r+.7152*c.g+.0722*c.b}
/* ---------- Realistische Figur (MakeHuman, CC0) – wird mit ara3d live gebaut ----------
   Bausteine kommen aus window.LG_ASSETS (https://lg.assets/…), also auch ohne Internet. */
var K={},headG=null,lids=[],DYN=[],GH=0,MIX=null,HERO=null,BUILD=0,COL={},HU={lag:{value:0},t:{value:0},wind:{value:0}};
function sway(t){HU.lag.value=lag;HU.t.value=t;HU.wind.value=wx.kind==="street"?Math.min(1.3,(wx.wind||0)/35):.15}
var HAIRM=/^(hair|buzz cut|cornrows|box braids|punk mohawk|mohawk|spikes)/i;
/* Haare bewegen sich: je weiter unten am Kopf, desto mehr (lange Haare schwingen, kurze kaum). */
function hairMat(m,top){var tp=top.toFixed(3);m.onBeforeCompile=function(sh){sh.uniforms.uLag=HU.lag;sh.uniforms.uT=HU.t;sh.uniforms.uWind=HU.wind;
  sh.vertexShader="uniform float uLag;uniform float uT;uniform float uWind;\n"+sh.vertexShader.replace("#include <begin_vertex>","#include <begin_vertex>\n"
  +"float lgw=clamp(("+tp+"-0.11-position.y)/0.36,0.0,1.0);lgw*=lgw;float lgr=max(length(position.xz),0.0001);vec2 lgt=vec2(position.z,-position.x)/lgr;"
  +"transformed.xz+=lgt*(-uLag*0.04*lgw)+position.xz/lgr*abs(uLag)*0.016*lgw;"
  +"transformed.x+=uWind*0.018*lgw*(0.55+0.45*sin(uT*2.6+position.y*9.0));transformed.z+=uWind*0.008*lgw*sin(uT*1.9+position.x*7.0);")};
  m.customProgramCacheKey=function(){return"lghair"+tp};m.needsUpdate=true}
function eachMat(f){if(!HERO)return;HERO.scene.traverse(function(o){if(o.isMesh)(Array.isArray(o.material)?o.material:[o.material]).forEach(function(m){f(m,o)})})}
function applyColors(){eachMat(function(m){var n=m.name||"";
  if(COL.hair&&HAIRM.test(n))m.color.set(COL.hair);
  if(COL.beard&&/^beard|mustache|goatee|stubble/i.test(n))m.color.set(COL.beard);
  if(COL.brow&&/^eyebrows/i.test(n))m.color.set(COL.brow)})}
function buildHero(p,cb){var my=++BUILD;
  setTimeout(function(){if(my!==BUILD)return;
    LG3.createCharacter(p,{assetsUrl:"https://lg.assets/",animations:["idle"]}).then(function(h){
      if(my!==BUILD){h.dispose();return}
      if(HERO){bodyG.remove(HERO.scene);HERO.dispose()}HERO=h;GH=h.height;bodyG.add(h.scene);
      h.scene.traverse(function(o){if(!o.isMesh)return;o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;(Array.isArray(o.material)?o.material:[o.material]).forEach(function(m){
        if(HAIRM.test(m.name||""))hairMat(m,h.height);
        if(m.transparent&&!/eyes|cornea/i.test(m.name||"")){m.alphaTest=Math.max(m.alphaTest||0,.35);m.transparent=false;m.depthWrite=true;m.side=T.DoubleSide;m.needsUpdate=true}})});
      MIX=new T.AnimationMixer(h.scene);var cl=h.clip("idle");if(cl)MIX.clipAction(cl).play();
      applyColors();frameCam(true);if(cb)cb(true)}).catch(function(e){console.error(e);if(my===BUILD&&cb)cb(false,e)})},60)}
function buildClothes(){}

/* ---------- Umgebung: Straße oder Studio ---------- */
var ENV={};
function facade(seed,night,fl){return canvasTex("fac"+seed+(night?"n":""),256,64*fl,function(g,w,h){var R1=function(){seed=(seed*9301+49297)%233280;return seed/233280};
  var cols=["#d9cbb4","#c8a98a","#b5674f","#e5e0d6","#9fa7ad","#cdb7a0","#efe7d8","#a35d4a","#d7d2c3"],c=cols[Math.floor(R1()*cols.length)];g.fillStyle=c;g.fillRect(0,0,w,h);noise(g,w,h,.92,1);
  var cw=4,rh=fl,mx=w/cw,my=h/rh;for(var y=0;y<rh-1;y++)for(var x=0;x<cw;x++){var lit=night&&R1()<.45;g.fillStyle=lit?(R1()<.5?"#ffd58a":"#ffe7b8"):(night?"#1a2233":"#5d6a78");g.fillRect(x*mx+mx*.22,y*my+my*.22,mx*.56,my*.6);g.fillStyle="rgba(255,255,255,.35)";g.fillRect(x*mx+mx*.2,y*my+my*.8,mx*.6,3)}
  g.fillStyle=night?"#ffcf86":"#3b4652";g.fillRect(w*.08,h-my*.95,w*.5,my*.8);g.fillStyle="#2c2622";g.fillRect(w*.68,h-my*.95,w*.2,my*.95);
  g.fillStyle="rgba(0,0,0,.25)";g.fillRect(0,h-my,w,4)})}
function buildStreet(){var E=new T.Group();
  var swalk=canvasTex("sw",256,256,function(g,w,h){g.fillStyle="#b9b6b0";g.fillRect(0,0,w,h);noise(g,w,h,.85,1);g.strokeStyle="rgba(60,55,50,.45)";g.lineWidth=2;for(var i=0;i<=w;i+=64){g.beginPath();g.moveTo(i,0);g.lineTo(i,h);g.stroke();g.beginPath();g.moveTo(0,i);g.lineTo(w,i);g.stroke()}},[10,4]);
  var asph=canvasTex("as",256,256,function(g,w,h){g.fillStyle="#4a4b4f";g.fillRect(0,0,w,h);noise(g,w,h,.75,1)},[14,4]);
  var gm=new T.MeshStandardMaterial({map:swalk,roughness:.9}),am=new T.MeshStandardMaterial({map:asph,roughness:.85});
  var sw=new T.Mesh(new T.PlaneGeometry(30,5),gm);sw.rotation.x=-Math.PI/2;sw.position.set(0,0,.6);sw.receiveShadow=true;E.add(sw);
  var curb=new T.Mesh(new T.BoxGeometry(30,.14,.25),new T.MeshStandardMaterial({color:"#a9a6a0",roughness:.9}));curb.position.set(0,-.05,-1.85);E.add(curb);
  var st=new T.Mesh(new T.PlaneGeometry(30,9),am);st.rotation.x=-Math.PI/2;st.position.set(0,-.12,-6.4);E.add(st);
  for(var i=-6;i<=6;i++){var ln=new T.Mesh(new T.PlaneGeometry(1.4,.12),new T.MeshStandardMaterial({color:"#d8d6cf",roughness:.8}));ln.rotation.x=-Math.PI/2;ln.position.set(i*3,-.115,-6.2);E.add(ln)}
  var sw2=new T.Mesh(new T.PlaneGeometry(30,2.2),gm);sw2.rotation.x=-Math.PI/2;sw2.position.set(0,0,-12);E.add(sw2);
  ENV.bld=[];var x=-9;var k=1;while(x<9){var bw=2.4+((k*37)%10)/6,fl=5+((k*53)%5),bh=fl*1.5,b=new T.Mesh(new T.BoxGeometry(bw,bh,3),new T.MeshStandardMaterial({map:facade(k*7919,false,fl),roughness:.85,emissiveMap:facade(k*7919,true,fl),emissive:new T.Color(0),emissiveIntensity:0}));b.position.set(x+bw/2,bh/2,-14.6);E.add(b);ENV.bld.push(b);x+=bw+.05;k++}
  ENV.lamps=[];[-1.9,2.1].forEach(function(lx){var p=new T.Mesh(new T.CylinderGeometry(.035,.05,3.6,10),new T.MeshStandardMaterial({color:"#2f3235",roughness:.5,metalness:.6}));p.position.set(lx,1.8,-1.55);E.add(p);
    var h=new T.Mesh(new T.SphereGeometry(.16,16,12),new T.MeshStandardMaterial({color:"#fff3d6",emissive:new T.Color("#ffcc77"),emissiveIntensity:0}));h.position.set(lx,3.6,-1.55);E.add(h);ENV.lamps.push(h)});
  ENV.sw=sw;ENV.sw2=sw2;ENV.st=st;ENV.gm=gm;ENV.am=am;return E}
function buildStudio(){var E=new T.Group(),wm=new T.MeshStandardMaterial({color:"#2a2a30",roughness:.95}),fm=new T.MeshStandardMaterial({color:"#1e1e23",roughness:.35,metalness:.2});
  var fl=new T.Mesh(new T.PlaneGeometry(8,8),fm);fl.rotation.x=-Math.PI/2;fl.receiveShadow=true;E.add(fl);
  var bk=new T.Mesh(new T.PlaneGeometry(8,6),wm);bk.position.set(0,3,-1.6);E.add(bk);
  [-1,1].forEach(function(sd){var w=new T.Mesh(new T.PlaneGeometry(4,6),wm);w.position.set(1.6*sd,3,.4);w.rotation.y=-Math.PI/2*sd;E.add(w);
    var l=new T.Mesh(new T.CircleGeometry(.09,20),new T.MeshBasicMaterial({color:"#fffaf0"}));l.position.set(.55*sd,2.45,-.6);l.rotation.x=Math.PI/2;E.add(l)});
  var ce=new T.Mesh(new T.PlaneGeometry(8,8),wm);ce.position.y=2.46;ce.rotation.x=Math.PI/2;E.add(ce);return E}
function skyTex(a,b){return canvasTex("sky"+a+b,4,256,function(g,w,h){var gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,a);gr.addColorStop(1,b);g.fillStyle=gr;g.fillRect(0,0,w,h)})}
function particles(kind){if(WP){S.remove(WP.o);WP.o.geometry.dispose();WP=null}if(kind!=="snow"&&kind!=="rain")return;
  var n=kind==="snow"?1600:900,P=new Float32Array(n*(kind==="snow"?3:6)),sp=new Float32Array(n);
  for(var i=0;i<n;i++){var x=(Math.random()-.5)*7,y=Math.random()*5,z=-4+Math.random()*6.5;sp[i]=kind==="snow"?.35+Math.random()*.4:6+Math.random()*3;
    if(kind==="snow"){P[i*3]=x;P[i*3+1]=y;P[i*3+2]=z}else{P[i*6]=x;P[i*6+1]=y;P[i*6+2]=z;P[i*6+3]=x;P[i*6+4]=y-.2;P[i*6+5]=z}}
  var g=new T.BufferGeometry();g.setAttribute("position",new T.BufferAttribute(P,3));var o;
  if(kind==="snow"){var tx=canvasTex("flake",32,32,function(c,w,h){var gr=c.createRadialGradient(16,16,0,16,16,16);gr.addColorStop(0,"rgba(255,255,255,1)");gr.addColorStop(.5,"rgba(255,255,255,.7)");gr.addColorStop(1,"rgba(255,255,255,0)");c.fillStyle=gr;c.fillRect(0,0,w,h)});
    o=new T.Points(g,new T.PointsMaterial({size:.045,map:tx,transparent:true,depthWrite:false,color:0xffffff}))}
  else o=new T.LineSegments(g,new T.LineBasicMaterial({color:0xaebbd0,transparent:true,opacity:.55}));
  o.frustumCulled=false;S.add(o);WP={o:o,sp:sp,n:n,kind:kind}}
function stepParticles(t,dt){if(!WP)return;var a=WP.o.geometry.attributes.position.array,w=Math.min(1.5,(wx.wind||0)/25);
  for(var i=0;i<WP.n;i++){if(WP.kind==="snow"){var j=i*3;a[j+1]-=WP.sp[i]*dt;a[j]+=(Math.sin(t*.9+i)*.25+w*.6)*dt;if(a[j+1]<0){a[j+1]=5;a[j]=(Math.random()-.5)*7}if(a[j]>3.5)a[j]-=7}
    else{var k=i*6,dy=WP.sp[i]*dt,dx=w*1.5*dt;a[k+1]-=dy;a[k]+=dx;if(a[k+1]<-.1){a[k+1]=4+Math.random();a[k]=(Math.random()-.5)*7}if(a[k]>3.5)a[k]-=7;a[k+3]=a[k]-w*.06;a[k+4]=a[k+1]-.22;a[k+5]=a[k+2]}}
  WP.o.geometry.attributes.position.needsUpdate=true}
function setEnv(w){wx=w||{kind:"studio"};env.clear();S.fog=null;
  if(wx.kind==="studio"){env.add(buildStudio());S.background=new T.Color("#141418");hemi.color.set("#ffffff");hemi.groundColor.set("#222228");hemi.intensity=.55;key.intensity=2.4;key.color.set("#fff7ec");rim.intensity=1.2;fill.intensity=.35;lamp.intensity=0;particles("none");return}
  env.add(buildStreet());var k=wx.k,n=wx.night,snow=k==="snow",rain=k==="rain",cloud=k==="cloud",fog=wx.fog;
  var sky=n?["#0a1430","#22335a"]:snow?["#aeb9c6","#dfe6ee"]:rain?["#5e6875","#98a3b0"]:cloud||fog?["#93a1b2","#d3dae2"]:["#3f8fe6","#bfe0ff"];
  S.background=skyTex(sky[0],sky[1]);S.fog=new T.FogExp2(new T.Color(sky[1]),fog?.11:snow?.06:rain?.055:n?.04:.03);
  hemi.color.set(n?"#5a6a9a":snow?"#e8eef6":"#cfe0ff");hemi.groundColor.set(n?"#151515":snow?"#bcc4cc":"#6c645a");hemi.intensity=n?.5:snow?1.05:rain?.75:cloud?.95:.9;
  key.color.set(n?"#9fb4ff":k==="sun"?"#fff1da":"#ffffff");key.intensity=n?.45:k==="sun"?2.6:snow?1.1:rain?.7:1.1;rim.intensity=n?.4:.9;fill.intensity=n?.35:.45;
  lamp.intensity=n?2.8:0;ENV.lamps.forEach(function(l){l.material.emissiveIntensity=n?2.2:0});ENV.bld.forEach(function(b){b.material.emissive.set(n?"#ffffff":"#000000");b.material.emissiveIntensity=n?.9:0});
  var wet=rain;[ENV.gm,ENV.am].forEach(function(m){m.roughness=wet?.28:.88;m.metalness=wet?.25:0;m.color.set(wet?"#8a8a8e":snow?"#ffffff":"#ffffff")});
  if(snow){var sn=canvasTex("snowg",256,256,function(g,w,h){g.fillStyle="#f3f6fa";g.fillRect(0,0,w,h);noise(g,w,h,.88,1)},[10,4]);ENV.gm.map=sn;ENV.am.map=sn;ENV.gm.needsUpdate=ENV.am.needsUpdate=true}
  particles(snow?"snow":rain?"rain":"none")}
/* ---------- Kamera, Drehen, Schleife ---------- */
function frameCam(instant){var w=cv.clientWidth||300,h=cv.clientHeight||500,asp=w/h,s=A0?A0.height/176:1;C.aspect=asp;C.updateProjectionMatrix();var f=Math.tan(C.fov*Math.PI/360),ty,dist;
  if(camMode==="face"){ty=(GH?GH*.93:1.62*s)+.01;dist=Math.max(.36/f,.24/(f*asp))*.55}
  else{var Hh=GH||1.78*s;ty=Hh*.5-.02;dist=Math.max(Hh*1.1/2/f,.95/2/(f*asp))}
  camT={p:new T.Vector3(0,ty+(camMode==="face"?0:.08),dist+.2),l:new T.Vector3(0,ty,0)};if(instant||!camP){camP={p:camT.p.clone(),l:camT.l.clone()}}}
function resize(){var w=cv.clientWidth,h=cv.clientHeight;if(!w||!h)return;R.setSize(w,h,false);frameCam(true)}
var ro=window.ResizeObserver?new ResizeObserver(resize):null;if(ro)ro.observe(cv);
cv.addEventListener("pointerdown",function(e){drag={x:e.clientX,t:performance.now(),moved:0};tgt=null;try{cv.setPointerCapture(e.pointerId)}catch(_){}});
cv.addEventListener("pointermove",function(e){if(!drag)return;var dx=e.clientX-drag.x,now=performance.now(),dt=Math.max(1,now-drag.t)/1000;drag.x=e.clientX;drag.t=now;drag.moved+=Math.abs(dx);var da=dx*.011;ang+=da;vel=vel*.5+(da/dt)*.5});
function up(){if(!drag)return;drag=null;vel=Math.max(-9,Math.min(9,vel))}
cv.addEventListener("pointerup",up);cv.addEventListener("pointercancel",up);
function tick(now){if(!run)return;raf=requestAnimationFrame(tick);var dt=Math.min(.05,(now-last)/1000),t=(now-t0)/1000;last=now;
  if(!drag){if(tgt!=null){var d=tgt-ang,acc=d*38-vel*11;vel+=acc*dt;if(Math.abs(d)<.002&&Math.abs(vel)<.01){ang=tgt;vel=0;tgt=null}}else vel*=Math.pow(.12,dt);ang+=vel*dt}
  fig.rotation.y=ang;lagV+=((vel-lag)*55-lagV*7)*dt;lag+=lagV*dt;
  fig.position.y=.0015*Math.sin(t*1.7);fig.rotation.z=.006*Math.sin(t*.7);if(headG){headG.rotation.y=.07*Math.sin(t*.37);headG.rotation.x=.02*Math.sin(t*.5)}
  var bl=(t%4.2)<.14?Math.sin((t%4.2)/.14*Math.PI):0;if(MIX)MIX.update(dt);if(HERO)HERO.update(dt);
  sway(t,dt);stepParticles(t,dt);
  if(wx.kind==="street"&&wx.storm){if(Math.random()<.004)flash=1;flash*=Math.pow(.02,dt);hemi.intensity=.75+flash*2.5}
  if(camT&&camP){var k=1-Math.pow(.0015,dt);camP.p.lerp(camT.p,k);camP.l.lerp(camT.l,k);C.position.copy(camP.p);C.lookAt(camP.l)}
  R.render(S,C)}
return{canvas:cv,
  setAvatar:function(p,cb){A0={height:176};buildHero(p,cb)},
  setColors:function(c){COL=Object.assign(COL,c||{});applyColors()},
  clearAvatar:function(){BUILD++;if(HERO){bodyG.remove(HERO.scene);HERO.dispose();HERO=null}GH=0},
  setOutfit:function(fit){LF=fit||{}},
  setEnv:setEnv,
  turn:function(d){tgt=(tgt!=null?tgt:ang)+d},
  cam:function(m){camMode=m;frameCam()},
  start:function(){if(run)return;run=true;last=performance.now();resize();raf=requestAnimationFrame(tick)},
  stop:function(){run=false;cancelAnimationFrame(raf)},
  resize:resize,
  dbg:function(){return{ang:ang,vel:vel,lag:lag,lagV:lagV}},
  snap:function(){R.render(S,C);return cv.toDataURL("image/jpeg",.8)}}}
