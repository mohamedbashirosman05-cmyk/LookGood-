/* Damit die Figur ohne Internet gebaut wird: Anfragen an https://lg.assets/ kommen aus window.LG_ASSETS. */
(function(){var B="https://lg.assets/";
function serve(A,u){var k=u.slice(B.length),b=A[k];if(b==null)return Promise.resolve(new Response("nf",{status:404}));var s=atob(b),a=new Uint8Array(s.length);for(var i=0;i<s.length;i++)a[i]=s.charCodeAt(i);
  return Promise.resolve(new Response(a,{status:200,headers:{"content-type":/\.json$/.test(k)?"application/json":/\.png$/.test(k)?"image/png":/\.jpg$/.test(k)?"image/jpeg":"application/octet-stream"}}))}
var F=window.fetch.bind(window);window.fetch=function(u,o){var s=String(u&&u.url||u);if(s.indexOf(B)===0)return serve(window.LG_ASSETS||{},s);return F(u,o)};
window.LG_WORKER_PREFIX="const __LGA="+JSON.stringify(window.LG_ASSETS||{})+";const __B="+JSON.stringify(B)+";const __F=self.fetch.bind(self);"
 +"self.fetch=function(u,o){const s=String(u&&u.url||u);if(s.indexOf(__B)===0){const k=s.slice(__B.length),b=__LGA[k];if(b==null)return Promise.resolve(new Response('nf',{status:404}));const t=atob(b),a=new Uint8Array(t.length);for(let i=0;i<t.length;i++)a[i]=t.charCodeAt(i);return Promise.resolve(new Response(a,{status:200,headers:{'content-type':/\\.json$/.test(k)?'application/json':/\\.png$/.test(k)?'image/png':/\\.jpg$/.test(k)?'image/jpeg':'application/octet-stream'}}))}return __F(u,o)};\n";
})();
