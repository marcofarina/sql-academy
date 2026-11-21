/** Collegamento allo zaino, con lo stato del salvataggio nella barra. */
import { Icon } from '../icons/Icon.tsx';
import { formatRoute } from '../routing/route.ts';
import { statoPillola, testoStato } from './labels.ts';
import { useStatoZaino } from './sincronizza.ts';

const DISTINTIVI = {
  sincronizzato: 'circle-check',
  'in-attesa': 'cloud-arrow-up',
  'in-corso': 'cloud-arrow-up',
  offline: 'cloud-slash',
  errore: 'circle-xmark',
};

/** Colore, forma, distintivo e parola descrivono lo stato anche nei passaggi intermedi. */
export function ZainoLink({ current }: { current: boolean }) {
  const stato = useStatoZaino();
  const testo = testoStato(stato);
  const { fase, parola } = statoPillola(stato);
  const distintivo = fase === 'scollegato' ? undefined : DISTINTIVI[fase];

  return (
    <>
      <a
        className="zaino-link"
        href={formatRoute({ page: 'zaino' })}
        title={testo}
        aria-label={fase === 'scollegato' ? testo : `Zaino: ${parola}. ${testo}`}
        aria-current={current ? 'page' : undefined}
        data-zaino-fase={fase}
      >
        <span className="zaino-mark">
          <Icon name="backpack" />
          {fase !== 'scollegato' && (
            <span className="zaino-badge" aria-hidden="true">
              {distintivo && <Icon name={distintivo} />}
              {fase === 'in-corso' && <span className="zaino-spinner" />}
            </span>
          )}
        </span>
        <span className="site-control-label">Zaino</span>
        <span className="site-control-label zaino-state">{parola}</span>
      </a>
      {/* Nella pagina Zaino la scheda del collegamento annuncia già lo stato. */}
      {!current && <span className="visually-hidden" role="status">{testo}</span>}
    </>
  );
}
