/** Registra il worker e segue gli aggiornamenti finché la scheda è aperta. */
import { useSyncExternalStore } from 'react';

type UpdateState = 'idle' | 'available' | 'applying' | 'other-tabs';

let registration: ServiceWorkerRegistration | undefined;
let target: ServiceWorker | null = null;
let state: UpdateState = 'idle';
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function publish(next: UpdateState) {
  if (next === state) return;
  state = next;
  for (const listener of listeners) listener();
}

function refresh() {
  if (target && target.state !== 'redundant') return;
  target = null;
  if (!registration?.waiting || registration.waiting.state !== 'installed' || !navigator.serviceWorker.controller) {
    publish('idle');
  } else if (state !== 'other-tabs') {
    publish('available');
  }
}

/** Segue l’avviso della versione in attesa e lo stato della ricarica. */
export function useOfflineUpdate(): UpdateState {
  return useSyncExternalStore(subscribe, () => state);
}

/** Chiede al worker in attesa di prendere il controllo di questa scheda. */
export function applyOfflineUpdate(): void {
  const waiting = registration?.waiting;
  if (target || waiting?.state !== 'installed') return;
  target = waiting;
  target.addEventListener('statechange', refresh);
  publish('applying');
  target.postMessage('attiva-versione');
}

/** Avvia gli aggiornamenti sul sito costruito, con HTTPS o su localhost. */
export function startOfflineUpdates(): void {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
  const workers = navigator.serviceWorker;
  workers.addEventListener('controllerchange', () => {
    if (target) window.location.reload();
    else refresh();
  });
  workers.addEventListener('message', (event) => {
    if (!target || event.source !== target || event.data !== 'altre-schede') return;
    target.removeEventListener('statechange', refresh);
    target = null;
    publish('other-tabs');
  });

  const url = new URL(`${import.meta.env.BASE_URL}service-worker.js`, document.baseURI);
  void workers.register(url, { updateViaCache: 'none' }).then((reg) => {
    registration = reg;
    const observeInstall = () => reg.installing?.addEventListener('statechange', refresh);
    reg.addEventListener('updatefound', observeInstall);
    observeInstall();
    refresh();

    const check = () => {
      if (navigator.onLine && !document.hidden && !reg.installing) {
        void reg.update().catch(() => undefined);
      }
    };
    window.addEventListener('focus', check);
    window.addEventListener('online', check);
    window.setInterval(check, 15 * 60 * 1000);
    check();
  }).catch(() => undefined); // Il sito resta disponibile in rete anche se la registrazione fallisce.
}
