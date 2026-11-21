/** Piè di pagina comune: contenitore montato da `SiteLayout` su tutte le pagine. */
import { FooterContenuti } from './contenuti.tsx';

/** Mostra il piè di pagina in fondo alla pagina; il contenuto è in `contenuti.tsx`. */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>
        <FooterContenuti />
      </p>
    </footer>
  );
}
