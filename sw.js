const C='hu-trip-20261102114750',F=['./','index.html','style.css','data.js','app.js','manifest.webmanifest','icon.svg','mapdata.js','vendor/leaflet.js','vendor/leaflet.css','icon-192.png','favicon-32.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);
if(u.hostname==='tile.openstreetmap.org'){e.respondWith(caches.open('hu-tiles').then(async c=>{const m=await c.match(e.request.url);if(m)return m;try{const r=await fetch(e.request.url,{mode:'cors'});if(r.ok)c.put(e.request.url,r.clone());return r}catch(x){return new Response('',{status:504})}}));return}
if(u.origin!==location.origin)return;
e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request,{ignoreSearch:true})))});
