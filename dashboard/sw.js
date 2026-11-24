const C='cierre-dash-v1';
self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim());});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url); const key=u.origin+u.pathname+(u.searchParams.get('f')?('?f='+u.searchParams.get('f')):'');
  e.respondWith(fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(key,cp));}return r;}).catch(()=>caches.open(C).then(c=>c.match(key))));
});
