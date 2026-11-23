/**
 * Contenuti del piè di pagina comune (provvisori).
 * Il testo e i link definitivi arrivano da una sessione aperta in ~/Developer/github/,
 * che rende coerenti i piè di pagina dei mini-siti di Marco: si sostituisce solo questo file.
 */
import { formatRoute } from '../routing/route.ts';

const BOOK_URL = 'https://python.rainbowbits.cloud';

/** Il contenuto del piè di pagina: l’impaginazione sta in `SiteFooter.tsx`. */
export function FooterContenuti() {
  return (
    <>
      Le query girano nel tuo browser con SQLite. Gli esercizi accompagnano il{' '}
      <a href={BOOK_URL}>
        <cite>Manuale dell’Archivista</cite>
      </a>{' '}
      di <cite>Python Doesn’t Byte</cite>. I mondi dei temi appartengono ai loro autori: SQL Academy ne usa nomi e ambientazioni e non è
      affiliato ai titolari delle opere. <a href={formatRoute({ page: 'informativa' })}>I tuoi dati</a> ·{' '}
      <a href={formatRoute({ page: 'docente' })}>Per i docenti</a>
    </>
  );
}
