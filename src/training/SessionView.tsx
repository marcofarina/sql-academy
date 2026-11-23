import { useState, type Dispatch, type SetStateAction } from 'react';
import { Icon } from '../icons/Icon.tsx';
import { SessionIcon } from './SessionIcon.tsx';
import { useThemeIcons } from '../themes/ThemeIconsContext.ts';
import { exerciseProgress, type ThemeProgress } from '../progress/progress.ts';
import { pointsLabel } from '../points/labels.ts';
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
  /** Nel ripasso, l’esito registrato nei progressi; assente se l’esercizio non è stato ripassato. */
  review?: 'riuscito' | 'fallito';
}

/** Una sessione in corso o conclusa. */
export interface ActiveSession {
  exerciseIds: string[];
  index: number;
  records: Record<string, SessionRecord>;
  /** Punti incassati e spesi su ogni esercizio all’avvio: il riepilogo conta la differenza. */
  baseline: Record<string, PointsSnapshot>;
  finished: boolean;
  /** Un ripasso (`src/training/review.ts`) invece di una sessione configurata. */
  review?: true;
}

interface PointsSnapshot {
  earned: number;
  spent: number;
}

function snapshot(progress: ThemeProgress, id: string): PointsSnapshot {
  const { pointsEarned, pointsSpent } = exerciseProgress(progress, id);
  return { earned: pointsEarned, spent: pointsSpent };
}

/** I punti guadagnati e spesi su un esercizio da quando è iniziata la sessione. */
function sessionPoints(session: ActiveSession, progress: ThemeProgress, id: string): PointsSnapshot {
  const now = snapshot(progress, id);
  const before = session.baseline[id] ?? { earned: 0, spent: 0 };
  // La differenza non scende sotto zero.
  return { earned: Math.max(0, now.earned - before.earned), spent: Math.max(0, now.spent - before.spent) };
}

const REVIEW_OUTCOME = { riuscito: 'Riuscito', fallito: 'Non riuscito', assente: 'Non ripassato' };

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
  progress,
  exercises,
  themeId,
  onNew,
}: {
  session: ActiveSession;
  progress: ThemeProgress;
  exercises: Map<string, Exercise>;
  themeId: string;
  onNew(): void;
}) {
  const records = session.exerciseIds.map((id) => ({
    id,
    ...(session.records[id] ?? EMPTY_RECORD),
    ...sessionPoints(session, progress, id),
  }));
  const solved = records.filter((r) => r.solved).length;
  const remembered = records.filter((r) => r.review === 'riuscito').length;
  const total = (key: 'attempts' | 'hints' | 'earned' | 'spent') => records.reduce((sum, r) => sum + r[key], 0);
  const review = session.review === true;
  return (
    <div className="session-summary">
      <h2>
        <Icon name="flag" />
        {review ? 'Riepilogo del ripasso' : 'Riepilogo della sessione'}
      </h2>
      <p className="lead">
        {review
          ? `${remembered === 1 ? 'Riuscito' : 'Riusciti'} ${remembered} su ${plural(records.length, 'ripasso', 'ripassi')}`
          : `${solved === 1 ? 'Risolto' : 'Risolti'} ${solved} su ${plural(records.length, 'esercizio', 'esercizi')}`}
        , con {plural(total('attempts'), 'verifica', 'verifiche')} e{' '}
        {plural(total('hints'), 'suggerimento aperto', 'suggerimenti aperti')}.
        {review && ' Gli esercizi riusciti torneranno più avanti, gli altri fra un giorno.'}
      </p>
      {!review && <p className="session-points">
        <span className="points-gain">
          <Icon name="circle-plus" />
          {pointsLabel(total('earned'))} {total('earned') === 1 ? 'guadagnato' : 'guadagnati'}
        </span>
        <span className="points-spend">
          <Icon name="circle-minus" />
          {pointsLabel(total('spent'))} {total('spent') === 1 ? 'speso' : 'spesi'}
        </span>
      </p>}
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Esercizio</th>
              <th scope="col">Esito</th>
              <th scope="col">Verifiche</th>
              <th scope="col">Suggerimenti</th>
              <th scope="col">Soluzione</th>
              {!review && <th scope="col">Punti guadagnati</th>}
              {!review && <th scope="col">Punti spesi</th>}
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
                    <Icon name={(review ? r.review === 'riuscito' : r.solved) ? 'circle-check' : 'circle'} />
                    {review ? REVIEW_OUTCOME[r.review ?? 'assente'] : r.solved ? 'Risolto' : 'Non risolto'}
                  </span>
                </td>
                <td className="number">{r.attempts}</td>
                <td className="number">{r.hints}</td>
                <td>{r.solutionSeen ? 'vista' : '—'}</td>
                {!review && <td className="number">{r.earned}</td>}
                {!review && <td className="number">{r.spent}</td>}
              </tr>
            ))}
          </tbody>
          {!review && <tfoot>
            <tr>
              <th scope="row" colSpan={5}>
                Totale
              </th>
              <td className="number">{total('earned')}</td>
              <td className="number">{total('spent')}</td>
            </tr>
          </tfoot>}
        </table>
      </div>
      <div className="toolbar">
        {!review && (
          <button type="button" className="primary" onClick={onNew}>
            <SessionIcon />
            Nuova sessione
          </button>
        )}
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
        onStart={(config) => {
          const exerciseIds = generateSession(training.exercises, config).map((e) => e.id);
          onSession({
            exerciseIds,
            index: 0,
            records: {},
            baseline: Object.fromEntries(exerciseIds.map((id) => [id, snapshot(progress, id)])),
            finished: false,
          });
        }}
      />
    );
  }
  if (session.finished) {
    return (
      <Summary session={session} progress={progress} exercises={byId} themeId={themeId} onNew={() => onSession(undefined)} />
    );
  }

  const id = session.exerciseIds[session.index];
  const exercise = byId.get(id)!;
  const last = session.index === session.exerciseIds.length - 1;

  const review = session.review === true;
  const current = session.records[id] ?? EMPTY_RECORD;
  // Nel ripasso l’esito si registra una volta sola: alla risposta corretta, alla soluzione aperta o al salto.
  const pending = review && current.review === undefined;
  const conclude = (success: boolean): SessionRecord['review'] => {
    actions.recordReview(id, success);
    return success ? 'riuscito' : 'fallito';
  };

  const record = (event: WorkspaceEvent) => {
    const outcome =
      pending && event.kind === 'verify' && event.correct ? conclude(true)
        : pending && event.kind === 'solution' ? conclude(false)
        : undefined;
    onSession((now) => {
      if (!now) return now;
      const before = now.records[id] ?? EMPTY_RECORD;
      const next: SessionRecord =
        event.kind === 'verify'
          ? { ...before, attempts: before.attempts + 1, solved: before.solved || event.correct }
          : event.kind === 'hint'
            ? { ...before, hints: before.hints + 1 }
            : { ...before, solutionSeen: true };
      if (outcome && next.review === undefined) next.review = outcome;
      return { ...now, records: { ...now.records, [id]: next } };
    });
  };
  const advance = () => {
    const skipped = pending ? { [id]: { ...current, review: conclude(false) } } : {};
    const records = { ...session.records, ...skipped };
    onSession(last ? { ...session, records, finished: true } : { ...session, records, index: session.index + 1 });
  };

  return (
    <div className="session">
      <p className="session-status">
        <span>
          {review ? 'Ripasso' : 'Sessione'}: esercizio {session.index + 1} di {session.exerciseIds.length}
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
        review={review}
        footer={
          <button type="button" className="primary" onClick={advance}>
            <Icon name={last ? 'flag' : 'circle-arrow-right'} />
            {pending
              ? last ? 'Salta e vai al riepilogo' : 'Salta e vai al prossimo'
              : last ? 'Vai al riepilogo' : current.solved ? 'Prossimo esercizio' : 'Salta e vai al prossimo'}
          </button>
        }
      />
    </div>
  );
}
