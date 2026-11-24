/** Selettore dello schema di colori nella barra: «Chiaro» e «Scuro». */
import { Icon } from '../icons/Icon.tsx';
import { SCHEMES, type Scheme } from '../themes/contract.ts';

/** L’icona di uno schema: comune (`name`) o di un tema (`svg`). */
export type SchemeIcon = { name: string } | { svg: string };

const LABELS: Record<Scheme, string> = { chiaro: 'Chiaro', scuro: 'Scuro' };

/** Mostra i due schemi come pulsanti; senza icone le etichette restano visibili. */
export function SchemeSwitch({ scheme, onChoose, icons }: { scheme: Scheme; onChoose(next: Scheme): void; icons: Partial<Record<Scheme, SchemeIcon>> }) {
  return (
    <div className="scheme-switch" role="group" aria-label="Schema di colori">
      {SCHEMES.map((s) => {
        const icon = icons[s];
        return (
          <button key={s} type="button" aria-label={LABELS[s]} aria-pressed={scheme === s} onClick={() => onChoose(s)}>
            {icon && <Icon {...icon} />}
            <span className={icon ? 'site-control-label' : 'scheme-text-fallback'}>{LABELS[s]}</span>
          </button>
        );
      })}
    </div>
  );
}
