// Generates characters in a headless browser. All requests to https://gen.local/ are answered from local files.
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const SP=__dirname,SITE=path.join(SP,'gensite'),ASSETS=path.join(SP,'ara/x/package/assets');
const jobs=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const ctx=await b.newContext({viewport:{width:600,height:1000}});const used=new Set();
await ctx.route('https://gen.local/**',r=>{const u=new URL(r.request().url());let f=u.pathname.startsWith('/assets/')?path.join(ASSETS,u.pathname.slice(8)):path.join(SITE,u.pathname==='/'?'index.html':u.pathname);
  if(u.pathname.startsWith('/assets/'))used.add(u.pathname.slice(8));
  if(!fs.existsSync(f))return r.fulfill({status:404,body:'nf'});const ext=path.extname(f),ct={'.html':'text/html','.js':'text/javascript','.json':'application/json','.png':'image/png','.jpg':'image/jpeg'}[ext]||'application/octet-stream';
  r.fulfill({status:200,body:fs.readFileSync(f),headers:{'content-type':ct,'access-control-allow-origin':'*'}})});
const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('https://gen.local/');
for(const j of jobs){try{const info=await p.evaluate(x=>build(x),j.params);console.log(j.name,JSON.stringify(info));
  for(const [i,a] of (j.angles||[0]).entries()){await p.evaluate(([a,c])=>view(a,c),[a,!!j.close]);await p.screenshot({path:path.join(SP,'gen_'+j.name+'_'+i+'.png')})}
  if(j.mats)console.log('MATS',JSON.stringify(await p.evaluate(()=>mats())));
  if(j.save)fs.writeFileSync(path.join(SP,'gen_'+j.name+'.glb'),Buffer.from(await p.evaluate(()=>glb64()),'base64'));
 }catch(e){console.log(j.name,'ERR',e.message.slice(0,400))}}
console.log('assets used:',JSON.stringify([...used]));console.log('errors',errs.slice(0,6));await b.close()})();
