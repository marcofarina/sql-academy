import { Icon } from '../icons/Icon.tsx';
import { formatRoute } from '../routing/route.ts';
import { haProblemi, testoStato } from './labels.ts';
import { useStatoZaino } from './sincronizza.ts';

/** Il collegamento alla pagina dello zaino, con un segnale quando lo zaino ha bisogno di attenzione. */
export function ZainoLink() {
  const stato = useStatoZaino();
  const testo = testoStato(stato) ?? 'Zaino non collegato.';
  const problema = haProblemi(stato);
  return (
    <a className={problema ? 'zaino-link has-problem' : 'zaino-link'} href={formatRoute({ page: 'zaino' })} title={testo} data-zaino-fase={stato.fase}>
      <Icon name="backpack" />
      Zaino
      {problema && <Icon name="triangle-exclamation" />}
      <span className="visually-hidden">: {testo}</span>
    </a>
  );
}
