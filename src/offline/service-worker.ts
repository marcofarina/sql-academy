/// <reference lib="webworker" />

/** Serve una versione completa dei soli file pubblici del portale. */
declare const build: { version: string; files: [path: string, integrity: string][] };

const worker = globalThis as unknown as ServiceWorkerGlobalScope;
const scope = worker.registration.scope;
const scopePath = new URL(scope).pathname;
const prefix = `sql-academy:offline:${encodeURIComponent(scope)}:`;
const cacheName = `${prefix}${build.version}`;
const indexUrl = new URL('index.html', scope);
const files = new Map(build.files.map(([path, integrity]) => [new URL(path, scope).href, integrity]));

worker.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    try {
      // Un file mancante o di un’altra build fa fallire l’installazione intera.
      await cache.addAll([...files].map(([url, integrity]) => new Request(url, {
        cache: 'reload', credentials: 'omit', mode: 'same-origin', redirect: 'error', integrity,
      })));
    } catch (error) {
      await caches.delete(cacheName);
      throw error;
    }
  })());
});

worker.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const oldCaches = (await caches.keys()).filter((name) => name.startsWith(prefix) && name !== cacheName);
    await Promise.all(oldCaches.map((name) => caches.delete(name)));
    await worker.clients.claim();
  })());
});

worker.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || !request.url.startsWith(scope)) return;
  const url = new URL(request.url);
  const isHome = request.mode === 'navigate'
    && (url.pathname === scopePath || url.pathname === indexUrl.pathname);
  const cachedUrl = isHome ? indexUrl.href : url.href;
  if (!files.has(cachedUrl)) return;
  event.respondWith((async () => {
    return (await caches.match(cachedUrl, { cacheName })) ?? fetch(request);
  })());
});

worker.addEventListener('message', (event) => {
  const source = event.source;
  if (event.data !== 'attiva-versione' || !source || !('id' in source)) return;
  event.waitUntil((async () => {
    const pages = await worker.clients.matchAll({ type: 'window', includeUncontrolled: true });
    if (pages.some((page) => page.id !== source.id && page.url.startsWith(scope))) {
      source.postMessage('altre-schede');
      return;
    }
    await worker.skipWaiting();
  })());
});
