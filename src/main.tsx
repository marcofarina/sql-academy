import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';
import { avviaClassifica } from './classifica/invio.ts';
import { startOfflineUpdates } from './offline/updates.ts';
import { startSiteScheme } from './scheme/siteScheme.ts';
import { themes } from './themes/registry.ts';
import './zaino/sezione.ts';
import { avviaZaino } from './zaino/sincronizza.ts';
import './styles.css';

// Lo zaino di Python Doesn’t Byte (F15): `VITE_ZAINO_URL` sostituisce il servizio;
// in sviluppo il Worker locale di `npx wrangler dev` nel repo del libro.
avviaZaino(import.meta.env.VITE_ZAINO_URL ?? (import.meta.env.DEV ? 'http://localhost:8787' : 'https://zaino.rainbowbits.cloud'));

// La classifica (F17): `VITE_CLASSIFICA_URL` sostituisce il servizio; in sviluppo
// `npx wrangler dev --port 8788` in `servizi/classifica`, perché la 8787 è dello zaino.
avviaClassifica(
  import.meta.env.VITE_CLASSIFICA_URL ?? (import.meta.env.DEV ? 'http://localhost:8788' : 'https://sql-classifica.rainbowbits.cloud'),
  themes.map((theme) => theme.manifest.id),
);

startOfflineUpdates();

// Schema delle pagine fuori dai temi: va applicato prima del primo disegno.
startSiteScheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
