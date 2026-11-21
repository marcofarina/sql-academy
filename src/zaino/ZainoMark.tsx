/** Icona dello zaino e distintivo, condivisi fra la barra e la notifica. */
import { Icon } from '../icons/Icon.tsx';
import type { statoPillola } from './labels.ts';

const DISTINTIVI = {
  sincronizzato: 'circle-check',
  'in-attesa': 'cloud-arrow-up',
  'in-corso': 'cloud-arrow-up',
  offline: 'cloud-slash',
  errore: 'circle-xmark',
};

/** Mostra il distintivo della fase e l’indicatore del salvataggio in corso. */
export function ZainoMark({ fase }: { fase: ReturnType<typeof statoPillola>['fase'] }) {
  return (
    <span className="zaino-mark">
      <Icon name="backpack" />
      {fase !== 'scollegato' && (
        <span className="zaino-badge" aria-hidden="true">
          <Icon name={DISTINTIVI[fase]} />
          {fase === 'in-corso' && <span className="zaino-spinner" />}
        </span>
      )}
    </span>
  );
}
