import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';
import './zaino/sezione.ts';
import { avviaZaino } from './zaino/sincronizza.ts';
import './styles.css';

// Lo zaino di Python Doesn’t Byte (F15): `VITE_ZAINO_URL` sostituisce il servizio;
// in sviluppo il Worker locale di `npx wrangler dev` nel repo del libro.
avviaZaino(import.meta.env.VITE_ZAINO_URL ?? (import.meta.env.DEV ? 'http://localhost:8787' : 'https://zaino.rainbowbits.cloud'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
