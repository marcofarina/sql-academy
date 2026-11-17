import { useEffect, useSyncExternalStore } from 'react';
import { canonicalHash, parseRoute, type Route } from './route.ts';

function subscribe(onChange: () => void): () => void {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

const getHash = () => window.location.hash;

/** La rotta corrente, aggiornata a ogni cambio di hash; gli hash incompleti diventano canonici. */
export function useHashRoute(): Route {
  const hash = useSyncExternalStore(subscribe, getHash);

  useEffect(() => {
    const canonical = canonicalHash(hash);
    if (canonical) {
      history.replaceState(null, '', canonical);
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
  }, [hash]);

  return parseRoute(hash);
}
