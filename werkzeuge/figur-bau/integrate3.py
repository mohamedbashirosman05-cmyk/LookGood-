import sys,subprocess,base64
sp=sys.argv[1];repo='/home/user/LookGood-'
s=subprocess.run(['git','-C',repo,'show','123b4b8:look-good-app.html'],capture_output=True,text=True).stdout
def rep(a,b,cnt=1):
    global s
    assert s.count(a)==cnt,(a[:80],s.count(a));s=s.replace(a,b)
css=open(sp+'/wd.css',encoding='utf-8').read()+open(sp+'/cr.css',encoding='utf-8').read()
i=s.index('</style>');s=s[:i]+css+s[i:]
w3d=open(sp+'/w3d3.js',encoding='utf-8').read();wd=open(sp+'/wd3.js',encoding='utf-8').read()
rep('\napplyLang();\n})();\n</script>','\n'+w3d+'\n'+wd+'\napplyLang();\n})();\n</script>\n<script>/* Bausteine der 3D-Figur: MakeHuman (CC0), ausgewählt und verkleinert. */\n'+open(sp+'/lg_assets.js',encoding='utf-8').read()+'</script>\n<script>'+open(sp+'/lg3build/prefix.js',encoding='utf-8').read()+'</script>\n<script>/* three.js r160 (MIT) + ara3d 0.16 (MIT), angepasst: läuft auch als Datei geöffnet */\n'+open(sp+'/lg3build/lg3.bundle.js',encoding='utf-8').read()+'</script>')
rep('function emptyViews(){["wardrobe","friends"].forEach(','function emptyViews(){["friends"].forEach(')
rep('$("views").scrollTop=0;chatTab(k)}','$("views").scrollTop=0;chatTab(k);wdTab(k)}')
rep('var w=wmo(cur.weather_code,day);','var w=wmo(cur.weather_code,day);WX={k:w.k,night:!day,wind:cur.wind_speed_10m,temp:Math.round(cur.temperature_2m),city:c.n,t:w.t,fog:cur.weather_code===45||cur.weather_code===48,storm:cur.weather_code>=95};wdWeather();')
rep('emptyViews();paintProf();chatRefresh();','emptyViews();paintProf();chatRefresh();wdLang();')
rep('function closeSheet(){sheet.classList.add("hidden")}','function closeSheet(){sheet.classList.add("hidden");sheet.classList.remove("wsh");panel.className="panel"}')
rep('function menu(title,text,items){\n  panel.textContent="";','function menu(title,text,items){\n  panel.className="panel";sheet.classList.remove("wsh");panel.textContent="";')
rep('+(prof.loc&&c&&LW?"Weather where they are','+wdForAI()+" "+(prof.loc&&c&&LW?"Weather where they are')
rep('try{localStorage.removeItem("lg_prof");localStorage.removeItem("lg_cities")}catch(e){}location.reload()',
    'try{["lg_prof","lg_cities","lg_avatar","lg_outfit","lg_looks"].forEach(function(k){localStorage.removeItem(k)});indexedDB.deleteDatabase("lookgood")}catch(e){}setTimeout(function(){location.reload()},150)')
rep('function wdForAI(){','function wdLang(){if(!wv)return;var v=V,cv=v&&v.canvas,inS=cv&&cv.parentNode&&cv.parentNode.id==="wStage";wdBuild();if(inS)$("wStage").insertBefore(cv,$("wStage").firstChild);wdWxChip();if(!$("wEd").classList.contains("hidden")&&CR.d)crPaint()}\nfunction wdForAI(){')
for extra in sys.argv[2:]:
    exec(open(extra,encoding='utf-8').read())
open(repo+'/LookGood.html','w',encoding='utf-8').write(s)
open(repo+'/server/index.html','w',encoding='utf-8').write(s)
print('ok',len(s))
