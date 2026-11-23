/**
 * La schermata che apre il link di una consegna (F14 del piano `portale-v2`):
 * gli esercizi assegnati, l’avviso per quelli che il tema non ha, la sessione
 * già in corso nel tema e il pulsante per cominciare.
 */
import { Icon } from '../icons/Icon.tsx';
import { formatRoute, SESSION_ITEM } from '../routing/route.ts';
import type { Exercise } from '../themes/contract.ts';
import { DIFFICULTY_LABEL, plural } from '../training/exercises.ts';
import { SessionIcon } from '../training/SessionIcon.tsx';
import { sessionKind, type SessionKind } from '../training/session.ts';
import type { ActiveSession } from '../training/SessionView.tsx';
import type { ConsegnaLetta } from './consegna.ts';

interface ConsegnaIntroProps {
  themeId: string;
  letta: ConsegnaLetta;
  /** Il codice del link, per riconoscere la stessa consegna già cominciata. */
  code: string | undefined;
  exercises: Exercise[];
  /** La sessione in corso nel tema, se c’è: salvata o in memoria. */
  pending: ActiveSession | undefined;
  onStart(): void;
  onResume(): void;
}

/** Come si nomina la sessione in corso: articolo indeterminativo, pronome, ritorno. */
const IN_CORSO: Record<SessionKind, { una: string; la: string; torna: string }> = {
  sessione: { una: 'una sessione', la: 'la', torna: 'Torna alla sessione' },
  ripasso: { una: 'un ripasso', la: 'lo', torna: 'Torna al ripasso' },
  consegna: { una: 'un’altra consegna', la: 'la', torna: 'Torna all’altra consegna' },
};

/** Il link non si legge, o non ha esercizi di questo tema. */
function ConsegnaNonValida({ reason, themeId }: { reason: 'illeggibile' | 'vuota'; themeId: string }) {
  return (
    <div className="notice notice-error" role="alert">
      <Icon name="circle-xmark" />
      <div>
        <p className="notice-title">
          {reason === 'illeggibile' ? 'Il link della consegna non si legge' : 'Questa consegna non ha esercizi di questo tema'}
        </p>
        <p>
          {reason === 'illeggibile'
            ? 'Forse è stato copiato a metà o modificato. Chiedi di nuovo il link a chi te l’ha dato.'
            : 'Gli esercizi indicati nel link non esistono qui: forse il link è stato creato per un altro tema. Chiedi di nuovo il link a chi te l’ha dato.'}{' '}
          <a href={formatRoute({ page: 'theme', themeId, section: 'addestramento' })}>Torna al percorso</a>.
        </p>
      </div>
    </div>
  );
}

/** La consegna del link, prima di cominciarla. */
export function ConsegnaIntro({ themeId, letta, code, exercises, pending, onStart, onResume }: ConsegnaIntroProps) {
  if (!letta.ok) return <ConsegnaNonValida reason={letta.reason} themeId={themeId} />;

  const byId = new Map(exercises.map((e) => [e.id, e]));
  const same = pending?.consegna?.code === code;
  const other = pending && !same ? IN_CORSO[sessionKind(pending)] : undefined;
  const sessionLink = formatRoute({ page: 'theme', themeId, section: 'addestramento', item: SESSION_ITEM });

  return (
    <div className="session-config consegna-intro">
      <h2>
        <Icon name="link" />
        {letta.title ?? 'Consegna'}
      </h2>
      <p className="lead">
        Questa consegna contiene {plural(letta.ids.length, 'esercizio', 'esercizi')} da svolgere in quest’ordine. I punti sono
        quelli di sempre: un esercizio che hai già risolto non ne dà altri. Alla fine trovi un riepilogo con la data e l’ora,
        da mostrare al docente se te lo chiede.
      </p>
      {letta.missing > 0 && (
        <div className="notice notice-warning" role="status">
          <Icon name="triangle-exclamation" />
          <p>
            {letta.missing === 1
              ? 'Un esercizio indicato nel link non esiste in questo tema ed è stato tolto dalla consegna.'
              : `${letta.missing} esercizi indicati nel link non esistono in questo tema e sono stati tolti dalla consegna.`}{' '}
            Se ti sembra strano, avvisa il docente.
          </p>
        </div>
      )}
      <ol className="consegna-list">
        {letta.ids.map((id) => {
          const exercise = byId.get(id)!;
          return (
            <li key={id}>
              <span className="exercise-title">{exercise.title}</span>
              <span className={`difficulty difficulty-${exercise.difficulty}`}>{DIFFICULTY_LABEL[exercise.difficulty]}</span>
            </li>
          );
        })}
      </ol>
      {same && pending && (
        <p>
          Hai già cominciato questa consegna: sei all’esercizio {pending.index + 1} di {pending.exerciseIds.length}.
        </p>
      )}
      {other && pending && (
        <div className="notice notice-warning" role="status">
          <Icon name="triangle-exclamation" />
          <p>
            In questo tema hai {other.una} in corso, all’esercizio {pending.index + 1} di {pending.exerciseIds.length}. Se
            cominci la consegna, {other.la} abbandoni; gli esercizi che hai già risolto restano risolti.
          </p>
        </div>
      )}
      <div className="toolbar">
        {same ? (
          <button type="button" className="primary" onClick={onResume}>
            <SessionIcon />
            Riprendi la consegna
          </button>
        ) : (
          <button type="button" className="primary" onClick={onStart}>
            <SessionIcon />
            Comincia la consegna
          </button>
        )}
        {other && (
          <a className="button" href={sessionLink} onClick={onResume}>
            <Icon name="circle-arrow-left" />
            {other.torna}
          </a>
        )}
      </div>
    </div>
  );
}
