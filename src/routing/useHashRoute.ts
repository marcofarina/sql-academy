/** La pagina corrente e la sua provenienza nella navigazione della scheda. */
import { useEffect, useState, useSyncExternalStore } from 'react';
import { canonicalHash, parseRoute, type Route } from './route.ts';

function subscribe(onChange: () => void): () => void {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
}

const getHash = () => window.location.hash;

/** Segue la rotta e ricorda l’indirizzo precedente fino alla prossima ricarica. */
export function useHashRoute(): { route: Route; previousHash: string | null } {
  const hash = useSyncExternalStore(subscribe, getHash);
  const canonical = canonicalHash(hash);
  const address = canonical ?? (hash || '#/');
  const [navigation, setNavigation] = useState<{ address: string; previousHash: string | null }>(
    () => ({ address, previousHash: null }),
  );
  const route = parseRoute(address);
  const stessaClassifica = route.page === 'classifica' && parseRoute(navigation.address).page === 'classifica';
  const previousHash = navigation.address === address || stessaClassifica ? navigation.previousHash : navigation.address;
  // Correggere l’hash di questa stessa pagina non conta come una visita.
  if (navigation.address !== address) setNavigation({ address, previousHash });

  useEffect(() => {
    if (canonical) {
      history.replaceState(null, '', canonical);
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
  }, [canonical]);

  return { route, previousHash };
}
