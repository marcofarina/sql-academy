/** Avviso comune per una versione scaricata e pronta da attivare. */
import { applyOfflineUpdate, useOfflineUpdate } from './updates.ts';

/** Lascia scegliere quando ricaricare il portale. */
export function UpdateNotice() {
  const state = useOfflineUpdate();

  return (
    <div className="site-update" data-visible={state !== 'idle'}>
      <p role="status">
        {state === 'other-tabs' ? 'Chiudi le altre schede di SQL Academy, poi riprova.'
          : state === 'applying' ? 'Aggiornamento in corso…'
          : state === 'available' ? 'È disponibile una versione nuova.'
          : null}
      </p>
      {state !== 'idle' && (
        <button type="button" onClick={applyOfflineUpdate} disabled={state === 'applying'}>Ricarica</button>
      )}
    </div>
  );
}
