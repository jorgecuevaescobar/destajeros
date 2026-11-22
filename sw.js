// Abre la app al instante desde el celular y se actualiza sola en segundo plano.
const CACHE = 'asistencia-v5';
const ARCHIVOS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  const propio = u.origin === location.origin, libreria = u.hostname === 'cdn.jsdelivr.net';
  if (!propio && !libreria) return;                       // los datos de la hoja nunca se guardan
  e.respondWith(caches.open(CACHE).then(async c => {
    const guardado = await c.match(e.request, { ignoreSearch: propio });
    const red = fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => guardado);
    return libreria ? (guardado || red) : (guardado ? (e.waitUntil(red), guardado) : red);
  }));
});
