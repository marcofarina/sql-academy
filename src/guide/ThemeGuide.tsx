/** La guida breve al primo ingresso in un tema (F16 del piano `portale-v2`). */
import { useEffect, useRef } from 'react';
import { Icon } from '../icons/Icon.tsx';

export const GUIDE_ID = 'guida-tema';

/**
 * Riquadro chiudibile in cima alla pagina del tema. Con `focus` prende il
 * fuoco appena compare: succede quando lo studente lo riapre dalla barra.
 */
export function ThemeGuide({ focus, onClose }: { focus: boolean; onClose(): void }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (focus) ref.current?.focus();
  }, [focus]);

  return (
    <section id={GUIDE_ID} className="notice theme-guide" aria-labelledby="guida-tema-titolo" tabIndex={-1} ref={ref}>
      <Icon name="circle-question" />
      <div>
        <h2 className="notice-title" id="guida-tema-titolo">
          Come si usa questo mondo
        </h2>
        <p>
          In alto trovi sei sezioni. Nella «Sandbox» esegui qualunque query sul database del mondo;
          nell’«Addestramento» risolvi esercizi che il sito verifica e che danno punti; «Tutte le query» elenca gli
          esercizi in un’unica pagina. «Traccia», «Schema ER» e «Modello logico» descrivono il database: la traccia è il testo
          da cui nasce, gli altri due ne mostrano entità e tabelle.
        </p>
        <p>
          Le query si scrivono nell’editor e si eseguono con «Esegui» oppure con <kbd>Ctrl</kbd>+<kbd>Invio</kbd> (
          <kbd>Cmd</kbd>+<kbd>Invio</kbd> su Mac). Questa guida si riapre dal pulsante «Guida» nella barra in alto.
        </p>
        <div className="toolbar">
          <button type="button" onClick={onClose}>
            Ho capito
          </button>
        </div>
      </div>
    </section>
  );
}
