/** Saldo, ultimo movimento e annuncio dei punti nella barra del tema. */
import { useEffect, useState } from 'react';
import { Icon } from '../icons/Icon.tsx';
import { pointsLabel } from './labels.ts';

/**
 * Il saldo del tema nell’intestazione. Quando cambia, il numero si evidenzia
 * per un attimo (solo senza riduzione del movimento) accanto all’ultimo
 * movimento, e una regione `aria-live` cortese lo annuncia una volta sola.
 */
export function Balance({ balance }: { balance: number }) {
  // Il saldo precedente e l’ultimo movimento: aggiornati durante il rendering, non in un effetto.
  const [previous, setPrevious] = useState(balance);
  const [change, setChange] = useState<{ delta: number; count: number }>();
  if (balance !== previous) {
    setPrevious(balance);
    setChange({ delta: balance - previous, count: (change?.count ?? 0) + 1 });
  }

  useEffect(() => {
    if (!change) return;
    const timer = window.setTimeout(() => setChange(undefined), 2400);
    return () => window.clearTimeout(timer);
  }, [change]);

  const announcement = change
    ? `Punti: ${balance} (${change.delta > 0 ? 'più' : 'meno'} ${Math.abs(change.delta)}).`
    : '';

  return (
    <p className="balance">
      <span className="balance-value" role="img" aria-label={`Punti: ${balance}`} title={pointsLabel(balance)}>
        <Icon name="coin" />
        {/* La chiave nuova a ogni movimento fa ripartire l’evidenza. */}
        <span key={change?.count ?? 0} className={change ? 'balance-number is-changed' : 'balance-number'}>
          {balance}
        </span>
        <span className="balance-unit">punti</span>
      </span>
      {change && (
        <span key={`delta-${change.count}`} className={change.delta > 0 ? 'balance-delta is-gain' : 'balance-delta is-spend'} aria-hidden="true">
          {change.delta > 0 ? '+' : '−'}{Math.abs(change.delta)}
        </span>
      )}
      <span className="visually-hidden" aria-live="polite">
        {announcement}
      </span>
    </p>
  );
}
