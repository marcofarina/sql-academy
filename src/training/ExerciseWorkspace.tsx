/** Spazio di lavoro di un esercizio, condiviso fra percorso e sessione. */
import { useCallback, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { describeVerdict, ExerciseError, verifyAnswer, type Verdict } from '../exercises/verify.ts';
import { Icon } from '../icons/Icon.tsx';
import { useThemeIcons } from '../themes/ThemeIconsContext.ts';
import { canRevealHint, canRevealSolution, hintOffer, solutionOffer, walletOf, type Offer } from '../points/points.ts';
import { exerciseProgress, type ThemeProgress } from '../progress/progress.ts';
import type { ProgressActions, VerificationReward } from '../progress/useProgress.ts';
import { ResultTable, ResultsView } from '../sandbox/ResultsView.tsx';
import { SchemaPanel } from '../sandbox/SchemaPanel.tsx';
import type { SandboxOutcome, TableInfo } from '../sandbox/session.ts';
import { SqlEditor } from '../sandbox/SqlEditor.tsx';
import { SqlErrorNotice } from '../sandbox/SqlErrorNotice.tsx';
import { engine } from '../sql/browser.ts';
import type { ResultSet } from '../sql/engine.ts';
import type { Exercise } from '../themes/contract.ts';
import { chapterLabel, DIFFICULTY_LABEL, formatQuery } from './exercises.ts';
import { costLabel, disabledReason } from '../points/labels.ts';
import type { TrainingState } from './useTraining.ts';
import { ExerciseNotice } from './ExerciseNotice.tsx';
import { ExerciseReport } from './ExerciseReport.tsx';

/** Righe del risultato dello studente mostrate sotto l’esito della verifica. */
const SHOWN_ROWS = 200;

type Output =
  | { kind: 'run'; outcome: SandboxOutcome }
  | { kind: 'verify'; verdict: Verdict; student: ResultSet | null }
  | { kind: 'broken'; message: string };

/** Ciò che accade nello spazio di lavoro, per chi tiene i conti di una sessione. */
export type WorkspaceEvent = { kind: 'verify'; correct: boolean } | { kind: 'hint' } | { kind: 'solution' };

interface ExerciseWorkspaceProps {
  exercise: Exercise;
  /** I progressi del tema: servono il saldo e l’aiuto gratuito, oltre allo stato dell’esercizio. */
  progress: ThemeProgress;
  training: Extract<TrainingState, { status: 'ready' }>;
  actions: ProgressActions;
  onEvent?(event: WorkspaceEvent): void;
  /** Comandi di navigazione sotto l’esercizio. */
  footer?: ReactNode;
}

function shown(resultSet: ResultSet): ResultSet {
  return resultSet.rows.length <= SHOWN_ROWS
    ? resultSet
    : { ...resultSet, rows: resultSet.rows.slice(0, SHOWN_ROWS), truncated: true };
}

function VerdictView({ verdict, student, tables }: { verdict: Verdict; student: ResultSet | null; tables: readonly TableInfo[] }) {
  if (verdict.kind === 'error') return <SqlErrorNotice message={verdict.message} tables={tables} />;

  const timeout = verdict.kind === 'timeout';
  return (
    <div className="results">
      {verdict.kind !== 'correct' && (
        <div className={`notice ${timeout ? 'notice-warning' : 'notice-error'}`} role="alert">
          <Icon name={timeout ? 'triangle-exclamation' : 'circle-xmark'} />
          <div>
            <p className="notice-title">Non ancora</p>
            <p>{describeVerdict(verdict)}</p>
          </div>
        </div>
      )}
      {student && <ResultTable resultSet={shown(student)} caption="Il tuo risultato" />}
    </div>
  );
}

/**
 * Il pulsante di un aiuto, con il prezzo scritto sopra. Se è disattivato, il
 * motivo sta in una riga visibile sotto, collegata al pulsante con `aria-describedby`.
 */
function HelpButton({ icon, label, offer, balance, onClick }: { icon: string; label: string; offer: Offer; balance: number; onClick(): void }) {
  const reasonId = useId();
  const reason = disabledReason(offer, balance);
  const free = offer.status === 'available' && offer.waiver !== null;
  return (
    <div className="help-action">
      <button type="button" onClick={onClick} disabled={reason !== undefined} aria-describedby={reason ? reasonId : undefined}>
        <Icon name={icon} />
        {label}
        <span className={free ? 'cost is-free' : 'cost'}>
          <Icon name="coin" />
          {costLabel(offer)}
        </span>
      </button>
      {reason && (
        <p className="help-reason" id={reasonId}>
          <Icon name="lock" />
          {reason}
        </p>
      )}
    </div>
  );
}

/** Un esercizio: consegna, tabelle, editor, verifica, aiuti e segnalazioni. */
export function ExerciseWorkspace({ exercise, progress: themeProgress, training, actions, onEvent, footer }: ExerciseWorkspaceProps) {
  const themeIcons = useThemeIcons();
  const progress = exerciseProgress(themeProgress, exercise.id);
  const wallet = walletOf(themeProgress);
  const [query, setQuery] = useState(progress.lastQuery);
  const [output, setOutput] = useState<Output>();
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ id: number; reward: VerificationReward }>();
  const verifyButton = useRef<HTMLButtonElement>(null);
  const mounted = useRef(false);

  useLayoutEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const closeNotice = useCallback((restoreFocus: boolean) => {
    setNotice(undefined);
    if (restoreFocus) verifyButton.current?.focus({ preventScroll: true });
  }, []);

  const canAct = !busy && query.trim() !== '';

  async function perform(action: () => Promise<Output>) {
    if (!canAct) return;
    setBusy(true);
    try {
      setOutput(await action());
    } catch (error) {
      setOutput({ kind: 'broken', message: error instanceof Error ? error.message : String(error) });
    } finally {
      setBusy(false);
    }
  }

  const run = () =>
    perform(async () => {
      await training.db.reset();
      return { kind: 'run', outcome: await training.db.run(query) };
    });

  const verify = () =>
    perform(async () => {
      try {
        const { verdict, student } = await verifyAnswer(engine, training.source, exercise.expectedQuery, query);
        // Un azzeramento o l’uscita dallo zaino possono smontare l’esercizio mentre SQLite lavora.
        if (!mounted.current) return { kind: 'verify', verdict, student };
        const correct = verdict.kind === 'correct';
        const reward = actions.recordVerification(exercise, correct);
        setNotice((current) => reward === undefined ? undefined : { id: (current?.id ?? 0) + 1, reward });
        onEvent?.({ kind: 'verify', correct });
        return { kind: 'verify', verdict, student };
      } catch (error) {
        if (error instanceof ExerciseError) {
          return { kind: 'broken', message: `L’esercizio ha un difetto e non si può verificare: ${error.message}.` };
        }
        throw error;
      }
    });

  const changeQuery = (value: string) => {
    setQuery(value);
    actions.saveQuery(exercise.id, value);
  };

  const revealHint = () => {
    if (!canRevealHint(exercise, progress, wallet)) return;
    actions.openHint(exercise);
    onEvent?.({ kind: 'hint' });
  };

  const revealSolution = () => {
    if (!canRevealSolution(exercise, progress, wallet)) return;
    actions.openSolution(exercise);
    onEvent?.({ kind: 'solution' });
  };

  const hint = hintOffer(exercise, progress, wallet);
  const solution = solutionOffer(exercise, progress, wallet);

  const tables = training.db.tables.filter((t) => exercise.tables.includes(t.name));
  const hints = exercise.hints.slice(0, progress.hintsRevealed);

  return (
    <div className="sandbox workspace">
      <div className="sandbox-main">
        <header className="exercise-header">
          <h2>{exercise.title}</h2>
          <p className="exercise-meta">
            <span>{chapterLabel(exercise.chapter)}</span>
            <span className={`difficulty difficulty-${exercise.difficulty}`}>{DIFFICULTY_LABEL[exercise.difficulty]}</span>
            {/* Le parole chiave suggeriscono la soluzione: si vedono solo a esercizio risolto. */}
            {progress.solved &&
              exercise.keywords.map((k) => (
                <code key={k} className="keyword">
                  {k}
                </code>
              ))}
            {progress.solved && (
              <span className="solved">
                <Icon name="circle-check" />
                Risolto
                {themeIcons.solved && (
                  <span className="theme-mark">
                    <Icon svg={themeIcons.solved} />
                  </span>
                )}
              </span>
            )}
          </p>
        </header>
        <p className="prompt">{exercise.prompt}</p>
        <SqlEditor
          initialValue={progress.lastQuery}
          tables={training.db.tables}
          onChange={changeQuery}
          onRun={run}
          label="La tua risposta"
        />
        <div className="toolbar">
          <button type="button" onClick={run} disabled={!canAct}>
            <Icon name="circle-play" />
            Esegui
          </button>
          <button ref={verifyButton} type="button" className="primary" onClick={verify} disabled={query.trim() === ''} aria-disabled={busy}>
            <Icon name="circle-check" />
            Verifica
          </button>
          <span className="shortcut">
            «Esegui» mostra il risultato, «Verifica» lo confronta con quello atteso.
          </span>
        </div>
        <ExerciseNotice exercise={exercise} balance={wallet.balance} notice={notice} onClose={closeNotice} />
        <div aria-live="polite">
          {busy ? (
            <p role="status">Esecuzione…</p>
          ) : output?.kind === 'run' ? (
            <ResultsView outcome={output.outcome} tables={training.db.tables} />
          ) : output?.kind === 'verify' ? (
            <VerdictView verdict={output.verdict} student={output.student} tables={training.db.tables} />
          ) : output?.kind === 'broken' ? (
            <div className="notice notice-error" role="alert">
              <Icon name="circle-xmark" />
              <p>{output.message}</p>
            </div>
          ) : null}
        </div>

        <section className="help" aria-label="Aiuti">
          {hints.length > 0 && (
            <ol className="hints">
              {hints.map((hint, index) => (
                <li key={index}>
                  <Icon name="lightbulb" />
                  <span>{hint}</span>
                </li>
              ))}
            </ol>
          )}
          {(hint.status !== 'unavailable' || solution.status !== 'unavailable') && (
            <div className="help-actions">
              {hint.status !== 'unavailable' && (
                <HelpButton
                  icon="lightbulb"
                  label={`${progress.hintsRevealed === 0 ? 'Mostra un suggerimento' : 'Mostra il suggerimento successivo'} (${progress.hintsRevealed + 1} di ${exercise.hints.length})`}
                  offer={hint}
                  balance={wallet.balance}
                  onClick={revealHint}
                />
              )}
              {solution.status !== 'unavailable' && (
                <HelpButton icon="key" label="Mostra la soluzione" offer={solution} balance={wallet.balance} onClick={revealSolution} />
              )}
            </div>
          )}
          {progress.solutionSeen && (
            <figure className="solution">
              <figcaption>
                <Icon name="key" />
                Una soluzione possibile
              </figcaption>
              <pre>
                <code>{formatQuery(exercise.expectedQuery)}</code>
              </pre>
            </figure>
          )}
        </section>
        <ExerciseReport themeId={training.source.key} exerciseId={exercise.id} query={query} />
        {footer && <nav className="toolbar exercise-nav" aria-label="Navigazione fra gli esercizi">{footer}</nav>}
      </div>
      <SchemaPanel tables={tables} />
    </div>
  );
}
