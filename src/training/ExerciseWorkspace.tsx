import { useState, type ReactNode } from 'react';
import { describeVerdict, ExerciseError, verifyAnswer, type Verdict } from '../exercises/verify.ts';
import { Icon } from '../icons/Icon.tsx';
import { useThemeIcons } from '../themes/ThemeIconsContext.ts';
import type { ExerciseProgress } from '../progress/progress.ts';
import { ResultTable, ResultsView } from '../sandbox/ResultsView.tsx';
import { SchemaPanel } from '../sandbox/SchemaPanel.tsx';
import type { SandboxOutcome } from '../sandbox/session.ts';
import { SqlEditor } from '../sandbox/SqlEditor.tsx';
import { engine } from '../sql/browser.ts';
import type { ResultSet } from '../sql/engine.ts';
import type { Exercise } from '../themes/contract.ts';
import {
  canRevealHint,
  canRevealSolution,
  chapterLabel,
  DIFFICULTY_LABEL,
  formatQuery,
} from './exercises.ts';
import type { TrainingState } from './useTraining.ts';

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
  progress: ExerciseProgress;
  training: Extract<TrainingState, { status: 'ready' }>;
  onProgress(change: (current: ExerciseProgress) => ExerciseProgress): void;
  onEvent?(event: WorkspaceEvent): void;
  /** Comandi di navigazione sotto l’esercizio. */
  footer?: ReactNode;
}

function shown(resultSet: ResultSet): ResultSet {
  return resultSet.rows.length <= SHOWN_ROWS
    ? resultSet
    : { ...resultSet, rows: resultSet.rows.slice(0, SHOWN_ROWS), truncated: true };
}

function VerdictView({ verdict, student }: { verdict: Verdict; student: ResultSet | null }) {
  const correct = verdict.kind === 'correct';
  const timeout = verdict.kind === 'timeout';
  return (
    <div className="results">
      <div className={`notice ${correct ? 'notice-success' : timeout ? 'notice-warning' : 'notice-error'}`} role="alert">
        <Icon name={correct ? 'circle-check' : timeout ? 'triangle-exclamation' : 'circle-xmark'} />
        <div>
          <p className="notice-title">{correct ? 'Esercizio risolto' : 'Non ancora'}</p>
          <p>{describeVerdict(verdict)}</p>
        </div>
      </div>
      {student && <ResultTable resultSet={shown(student)} caption="Il tuo risultato" />}
    </div>
  );
}

/** Un esercizio: consegna, tabelle coinvolte, editor, esecuzione, verifica, suggerimenti e soluzione. */
export function ExerciseWorkspace({ exercise, progress, training, onProgress, onEvent, footer }: ExerciseWorkspaceProps) {
  const themeIcons = useThemeIcons();
  const [query, setQuery] = useState(progress.lastQuery);
  const [output, setOutput] = useState<Output>();
  const [busy, setBusy] = useState(false);

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
        const correct = verdict.kind === 'correct';
        onProgress((p) => ({ ...p, attempts: p.attempts + 1, solved: p.solved || correct }));
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
    onProgress((p) => ({ ...p, lastQuery: value }));
  };

  const revealHint = () => {
    if (!canRevealHint(exercise, progress)) return;
    onProgress((p) => ({ ...p, hintsRevealed: Math.min(p.hintsRevealed + 1, exercise.hints.length) }));
    onEvent?.({ kind: 'hint' });
  };

  const revealSolution = () => {
    if (!canRevealSolution(exercise, progress)) return;
    onProgress((p) => ({ ...p, solutionSeen: true }));
    onEvent?.({ kind: 'solution' });
  };

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
            {exercise.keywords.map((k) => (
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
          <button type="button" className="primary" onClick={verify} disabled={!canAct}>
            <Icon name="circle-check" />
            Verifica
          </button>
          <span className="shortcut">
            «Esegui» mostra il risultato, «Verifica» lo confronta con quello atteso.
          </span>
        </div>
        <div aria-live="polite">
          {busy ? (
            <p role="status">Esecuzione…</p>
          ) : output?.kind === 'run' ? (
            <ResultsView outcome={output.outcome} />
          ) : output?.kind === 'verify' ? (
            <VerdictView verdict={output.verdict} student={output.student} />
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
          <div className="toolbar">
            {canRevealHint(exercise, progress) && (
              <button type="button" onClick={revealHint}>
                <Icon name="lightbulb" />
                {progress.hintsRevealed === 0 ? 'Mostra un suggerimento' : 'Mostra il suggerimento successivo'} (
                {progress.hintsRevealed + 1} di {exercise.hints.length})
              </button>
            )}
            {!progress.solutionSeen &&
              (canRevealSolution(exercise, progress) ? (
                <button type="button" onClick={revealSolution}>
                  <Icon name="key" />
                  Mostra la soluzione
                </button>
              ) : (
                <span className="shortcut">La soluzione si apre dopo l’ultimo suggerimento o a esercizio risolto.</span>
              ))}
          </div>
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
        {footer && <nav className="toolbar exercise-nav" aria-label="Navigazione fra gli esercizi">{footer}</nav>}
      </div>
      <SchemaPanel tables={tables} />
    </div>
  );
}
