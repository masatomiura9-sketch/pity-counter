const CACHE = 'pity-v5-2';            // ← 名前を変える
const ASSETS = [
  '/pity-counter/index.html',         // ← こちらも絶対パスに
  '/pity-counter/pity-manifest.webmanifest'
];
// 残りのコードはそのままでOK（404時のフォールバックは index.html を返す）

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', e=>{
  e.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request).then(r=> r || fetch(e.request).then(res=>{
      const copy = res.clone();
      caches.open(CACHE).then(c=>c.put(e.request, copy));
      return res;
    }).catch(()=>caches.match('./index.html')))
  );
});
