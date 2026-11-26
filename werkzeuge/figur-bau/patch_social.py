import os
SP=os.path.dirname(os.path.abspath(__file__)) if '__file__' in globals() else sp
i=s.index('</style>');s=s[:i]+open(sp+'/social.css',encoding='utf-8').read()+s[i:]
rep('\napplyLang();\n})();\n</script>','\n'+open(sp+'/social.js',encoding='utf-8').read()+'\n'+open(sp+'/flash.js',encoding='utf-8').read()+'\napplyLang();\n})();\n</script>')
# Leiste: Home · Garderobe · Flash · Chat · AI
a=s.index('<button class="tab" id="t-friends"');b=s.index('</nav>',a)
s=s[:a]+'''<button class="tab flash" id="t-flash" type="button" aria-label="Flash"><span class="fb"><svg viewBox="0 0 24 24"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg></span><span>Flash</span></button>
    <button class="tab" id="t-friends" role="tab" type="button"><svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8"/></svg>Chat</button>
    <button class="tab" id="t-chat" role="tab" type="button"><svg viewBox="0 0 24 24"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/></svg>AI</button>
  '''+s[b:]
rep('function emptyViews(){["friends"].forEach(','function emptyViews(){[].forEach(')
rep('$("views").scrollTop=0;chatTab(k);wdTab(k)}','$("views").scrollTop=0;chatTab(k);wdTab(k);socTab(k)}')
# Registrierung: neuer Schritt Benutzername + Spitzname
rep('<div class="step hidden" data-s="1"><h2>Wann hast du Geburtstag?</h2>','''<div class="step hidden" data-s="1"><h2>Wie finden dich Freunde?</h2><p class="sub">Dein Benutzername ist einzigartig. Deinen Spitznamen sehen deine Freunde im Chat.</p>
      <label>Benutzername<span class="oatfield"><b>@</b><input id="oUser" type="text" autocomplete="username" autocapitalize="none" spellcheck="false" maxlength="20" aria-label="Benutzername"></span></label>
      <label>Spitzname (freiwillig)<input id="oNick" type="text" maxlength="24" placeholder="zum Beispiel Momo"></label></div>
    <div class="step hidden" data-s="2"><h2>Wann hast du Geburtstag?</h2>''')
rep('$("pbar").style.width=(i+1)*50+"%";$("oerr").textContent="";$("onext").textContent=tr(i===1?"Los geht’s":"Weiter");\n  if(i===1)$("oBirth").max=new Date().toISOString().slice(0,10)}',
    '$("pbar").style.width=Math.round((i+1)/3*100)+"%";$("oerr").textContent="";$("onext").textContent=tr(i===2?"Los geht’s":"Weiter");\n  if(i===1&&!$("oUser").value&&prof.name){$("oUser").placeholder=(prof.name.toLowerCase().normalize("NFD").replace(/[^a-z]/g,"")||"mo")+".style"}\n  if(i===2)$("oBirth").max=new Date().toISOString().slice(0,10)}')
rep('prof.name=f;prof.last=l;return true}','prof.name=f;prof.last=l;return true}\n  if(i===1){var u=$("oUser").value.trim().toLowerCase().replace(/^@/,""),e=userOk(u);if(e)return oerr(e);prof.user=u;prof.nick=$("oNick").value.trim().slice(0,24);return true}')
rep('if(step<1)showStep(1);else{','if(step<2)showStep(step+1);else{')
# Speicher: IndexedDB Version 2 mit "items" und "media"
rep('var r=indexedDB.open("lookgood",1);r.onupgradeneeded=function(){r.result.createObjectStore("items",{keyPath:"id"})};','var r=indexedDB.open("lookgood",2);r.onupgradeneeded=function(){var d=r.result;if(!d.objectStoreNames.contains("items"))d.createObjectStore("items",{keyPath:"id"});if(!d.objectStoreNames.contains("media"))d.createObjectStore("media",{keyPath:"id"})};')
# Garderobe: Outfit an Freunde schicken
rep('[{t:tr("Meine Looks")+" ("+WD.looks.length+")",fn:looksSheet},','[{t:"Outfit an Freunde schicken",fn:function(){soInit().then(function(){shareOutfitTo()})}},{t:tr("Meine Looks")+" ("+WD.looks.length+")",fn:looksSheet},')
rep('["lg_prof","lg_cities","lg_avatar","lg_outfit","lg_looks"]','["lg_prof","lg_cities","lg_avatar","lg_avatar2","lg_outfit","lg_looks","lg_social"]')
