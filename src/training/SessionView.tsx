import { useState, type Dispatch, type SetStateAction } from 'react';
import { Icon } from '../icons/Icon.tsx';
import { SessionIcon } from './SessionIcon.tsx';
import { useThemeIcons } from '../themes/ThemeIconsContext.ts';
import type { ThemeProgress } from '../progress/progress.ts';
import type { ProgressActions } from '../progress/useProgress.ts';
import { formatRoute } from '../routing/route.ts';
import { CHAPTERS, DIFFICULTIES, type Chapter, type Exercise } from '../themes/contract.ts';
import { chapterLabel, DIFFICULTY_LABEL, keywordsOf, plural } from './exercises.ts';
import { ExerciseWorkspace, type WorkspaceEvent } from './ExerciseWorkspace.tsx';
import {
  eligibleExercises,
  generateSession,
  SESSION_LENGTHS,
  type SessionConfig,
  type SessionLength,
} from './session.ts';
import type { TrainingState } from './useTraining.ts';

/** Ciò che lo studente ha fatto su un esercizio durante la sessione. */
export interface SessionRecord {
  attempts: number;
  hints: number;
  solutionSeen: boolean;
  solved: boolean;
}

/** Una sessione in corso o conclusa. Vive nella pagina: ricaricando, si perde (i progressi restano). */
export interface ActiveSession {
  exerciseIds: string[];
  index: number;
  records: Record<string, SessionRecord>;
  finished: boolean;
}

const EMPTY_RECORD: SessionRecord = { attempts: 0, hints: 0, solutionSeen: false, solved: false };

interface SessionViewProps {
  themeId: string;
  training: Extract<TrainingState, { status: 'ready' }>;
  progress: ThemeProgress;
  actions: ProgressActions;
  session: ActiveSession | undefined;
  onSession: Dispatch<SetStateAction<ActiveSession | undefined>>;
}

function ConfigForm({ exercises, onStart }: { exercises: Exercise[]; onStart(config: SessionConfig): void }) {
  const chapters = CHAPTERS.filter((c) => exercises.some((e) => e.chapter === c));
  const keywords = keywordsOf(exercises);
  const [config, setConfig] = useState<SessionConfig>({ length: 5, difficulty: 'bilanciata', chapters, keywords: [] });
  const available = eligibleExercises(exercises, config).length;
  const themeIcons = useThemeIcons();

  const toggle = <T,>(list: T[], item: T) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);

  return (
    <form
      className="session-config"
      onSubmit={(event) => {
        event.preventDefault();
        if (available > 0) onStart(config);
      }}
    >
      <p className="lead">
        La sessione ti propone alcuni esercizi scelti a caso, senza ripetizioni, e alla fine ti mostra un riepilogo.
        Gli esercizi che risolvi qui risultano risolti anche nel percorso.
      </p>
      <fieldset>
        <legend>Quanti esercizi</legend>
        {SESSION_LENGTHS.map((length) => (
          <label key={length}>
            <input
              type="radio"
              name="length"
              checked={config.length === length}
              onChange={() => setConfig({ ...config, length: length as SessionLength })}
            />
            {length}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Difficoltà</legend>
        {(['bilanciata', ...DIFFICULTIES] as const).map((difficulty) => (
          <label key={difficulty}>
            <input
              type="radio"
              name="difficulty"
              checked={config.difficulty === difficulty}
              onChange={() => setConfig({ ...config, difficulty })}
            />
            {difficulty === 'bilanciata' ? 'Bilanciata' : DIFFICULTY_LABEL[difficulty]}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Capitoli</legend>
        {chapters.map((chapter: Chapter) => (
          <label key={chapter}>
            <input
              type="checkbox"
              checked={config.chapters.includes(chapter)}
              onChange={() => setConfig({ ...config, chapters: toggle(config.chapters, chapter) })}
            />
            {chapterLabel(chapter)}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Parole chiave da allenare</legend>
        <p className="hint-text">Se non ne scegli nessuna, valgono tutte. Nella sessione entrano gli esercizi che ne usano almeno una.</p>
        <div className="keyword-choices">
          {keywords.map((keyword) => (
            <label key={keyword}>
              <input
                type="checkbox"
                checked={config.keywords.includes(keyword)}
                onChange={() => setConfig({ ...config, keywords: toggle(config.keywords, keyword) })}
              />
              <code>{keyword}</code>
            </label>
          ))}
        </div>
      </fieldset>
      <p role="status" className={available === 0 ? 'empty-state' : undefined}>
        {available === 0 && themeIcons.empty && <Icon svg={themeIcons.empty} />}
        {available === 0
          ? 'Nessun esercizio corrisponde a questi filtri.'
          : available < config.length
            ? `Solo ${plural(available, 'esercizio corrisponde', 'esercizi corrispondono')} a questi filtri: la sessione ne avrà ${available}.`
            : `Esercizi che corrispondono a questi filtri: ${available}.`}
      </p>
      <div className="toolbar">
        <button type="submit" className="primary" disabled={available === 0}>
          <SessionIcon />
          Avvia la sessione
        </button>
      </div>
    </form>
  );
}

function Summary({
  session,
  exercises,
  themeId,
  onNew,
}: {
  session: ActiveSession;
  exercises: Map<string, Exercise>;
  themeId: string;
  onNew(): void;
}) {
  const records = session.exerciseIds.map((id) => ({ id, ...(session.records[id] ?? EMPTY_RECORD) }));
  const solved = records.filter((r) => r.solved).length;
  const total = (key: 'attempts' | 'hints') => records.reduce((sum, r) => sum + r[key], 0);
  return (
    <div className="session-summary">
      <h2>
        <Icon name="flag" />
        Riepilogo della sessione
      </h2>
      <p className="lead">
        {solved === 1 ? 'Risolto' : 'Risolti'} {solved} su {plural(records.length, 'esercizio', 'esercizi')}, con{' '}
        {plural(total('attempts'), 'verifica', 'verifiche')} e {plural(total('hints'), 'suggerimento aperto', 'suggerimenti aperti')}.
      </p>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Esercizio</th>
              <th scope="col">Esito</th>
              <th scope="col">Verifiche</th>
              <th scope="col">Suggerimenti</th>
              <th scope="col">Soluzione</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td>
                  <a href={formatRoute({ page: 'theme', themeId, section: 'addestramento', item: r.id })}>
                    {exercises.get(r.id)?.title ?? r.id}
                  </a>
                </td>
                <td>
                  <span className="status">
                    <Icon name={r.solved ? 'circle-check' : 'circle'} />
                    {r.solved ? 'Risolto' : 'Non risolto'}
                  </span>
                </td>
                <td className="number">{r.attempts}</td>
                <td className="number">{r.hints}</td>
                <td>{r.solutionSeen ? 'vista' : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="toolbar">
        <button type="button" className="primary" onClick={onNew}>
          <SessionIcon />
          Nuova sessione
        </button>
        <a className="button" href={formatRoute({ page: 'theme', themeId, section: 'addestramento' })}>
          <Icon name="circle-arrow-left" />
          Torna al percorso
        </a>
      </div>
    </div>
  );
}

/** La sessione configurabile: configurazione, esercizi uno dopo l’altro, riepilogo. */
export function SessionView({ themeId, training, progress, actions, session, onSession }: SessionViewProps) {
  const byId = new Map(training.exercises.map((e) => [e.id, e]));

  if (!session) {
    return (
      <ConfigForm
        exercises={training.exercises}
        onStart={(config) =>
          onSession({
            exerciseIds: generateSession(training.exercises, config).map((e) => e.id),
            index: 0,
            records: {},
            finished: false,
          })
        }
      />
    );
  }
  if (session.finished) {
    return <Summary session={session} exercises={byId} themeId={themeId} onNew={() => onSession(undefined)} />;
  }

  const id = session.exerciseIds[session.index];
  const exercise = byId.get(id)!;
  const last = session.index === session.exerciseIds.length - 1;

  const record = (event: WorkspaceEvent) =>
    onSession((current) => {
      if (!current) return current;
      const before = current.records[id] ?? EMPTY_RECORD;
      const next =
        event.kind === 'verify'
          ? { ...before, attempts: before.attempts + 1, solved: before.solved || event.correct }
          : event.kind === 'hint'
            ? { ...before, hints: before.hints + 1 }
            : { ...before, solutionSeen: true };
      return { ...current, records: { ...current.records, [id]: next } };
    });
  const advance = () => onSession(last ? { ...session, finished: true } : { ...session, index: session.index + 1 });

  return (
    <div className="session">
      <p className="session-status">
        <span>
          Sessione: esercizio {session.index + 1} di {session.exerciseIds.length}
        </span>
        <button type="button" className="link-button" onClick={() => onSession({ ...session, finished: true })}>
          Interrompi e vai al riepilogo
        </button>
      </p>
      <ExerciseWorkspace
        key={id}
        exercise={exercise}
        progress={progress}
        training={training}
        actions={actions}
        onEvent={record}
        footer={
          <button type="button" className="primary" onClick={advance}>
            <Icon name={last ? 'flag' : 'circle-arrow-right'} />
            {last ? 'Vai al riepilogo' : session.records[id]?.solved ? 'Prossimo esercizio' : 'Salta e vai al prossimo'}
          </button>
        }
      />
    </div>
  );
}
