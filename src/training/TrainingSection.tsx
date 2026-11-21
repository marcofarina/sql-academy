import { useEffect, useState } from 'react';
import { storageDi, useArea } from '../zaino/area.ts';
import { loadSession, saveSession } from './sessionStorage.ts';
import { Icon } from '../icons/Icon.tsx';
import type { ThemeProgress } from '../progress/progress.ts';
import type { ProgressActions } from '../progress/useProgress.ts';
import { formatRoute, SESSION_ITEM } from '../routing/route.ts';
import { ExerciseWorkspace } from './ExerciseWorkspace.tsx';
import { sortExercises } from './exercises.ts';
import { PathView } from './PathView.tsx';
import { SessionView, type ActiveSession } from './SessionView.tsx';
import type { TrainingState } from './useTraining.ts';

interface TrainingSectionProps {
  themeId: string;
  /** `undefined`: il percorso; `SESSION_ITEM`: la sessione; altrimenti l’`id` di un esercizio. */
  item: string | undefined;
  training: TrainingState;
  progress: ThemeProgress;
  actions: ProgressActions;
}

/** Messaggio di caricamento o di errore, comune ad addestramento e catalogo. */
export function TrainingStatus({ training }: { training: Exclude<TrainingState, { status: 'ready' }> }) {
  if (training.status === 'loading') return <p role="status">Preparazione degli esercizi…</p>;
  return (
    <div className="notice notice-error" role="alert">
      <Icon name="circle-xmark" />
      <div>
        <p className="notice-title">Gli esercizi non si sono caricati</p>
        <pre>{training.message}</pre>
      </div>
    </div>
  );
}

/** L’addestramento: percorso, esercizio singolo o sessione, secondo l’indirizzo. */
export function TrainingSection(props: TrainingSectionProps) {
  const area = useArea();
  if (props.training.status !== 'ready') return <TrainingStatus training={props.training} />;
  return <ReadyTraining key={`${area}:${props.progress.epoch}`} {...props} training={props.training} />;
}

function ReadyTraining(props: TrainingSectionProps & { training: Extract<TrainingState, { status: 'ready' }> }) {
  const { themeId, item, training, progress, actions } = props;
  const [saved, setSaved] = useState(() => loadSession(storageDi(), themeId, progress.epoch, training.exercises.map((e) => e.id)));
  const [session, setSession] = useState<ActiveSession>();
  useEffect(() => {
    if (session) saveSession(storageDi(), themeId, progress.epoch, session);
  }, [session, themeId, progress.epoch]);
  const abandon = () => { saveSession(storageDi(), themeId, progress.epoch); setSaved(undefined); setSession(undefined); };
  const pending = session && !session.finished ? session : saved;
  const resume = () => { if (saved) { setSession(saved); setSaved(undefined); } }; 

  const link = (target?: string) => formatRoute({ page: 'theme', themeId, section: 'addestramento', item: target });

  if (item === undefined) {
    const sessionStatus =
      pending ? `${pending.index + 1} di ${pending.exerciseIds.length}` : undefined;
    return (
      <PathView
        themeId={themeId}
        exercises={training.exercises}
        progress={progress}
        sessionStatus={sessionStatus}
        onReset={() => { abandon(); actions.reset(); }}
        onResume={resume}
        onAbandon={pending ? abandon : undefined}
      />
    );
  }

  if (item === SESSION_ITEM) {
    if (saved && !session) return (
      <div className="toolbar">
        <button type="button" className="primary" onClick={resume}>Riprendi la sessione ({saved.index + 1} di {saved.exerciseIds.length})</button>
        <button type="button" onClick={abandon}>Abbandonala</button>
      </div>
    );
    return (
      <SessionView
        themeId={themeId}
        training={training}
        progress={progress}
        actions={actions}
        session={session}
        onSession={setSession}
      />
    );
  }

  const ordered = sortExercises(training.exercises);
  const index = ordered.findIndex((e) => e.id === item);
  if (index < 0) {
    return (
      <div className="notice notice-error" role="alert">
        <Icon name="circle-xmark" />
        <div>
          <p className="notice-title">Esercizio non trovato</p>
          <p>
            Questo tema non ha un esercizio «{item}». <a href={link()}>Torna al percorso</a>.
          </p>
        </div>
      </div>
    );
  }
  const exercise = ordered[index];
  const next = ordered[index + 1];

  return (
    <ExerciseWorkspace
      key={exercise.id}
      exercise={exercise}
      progress={progress}
      training={training}
      actions={actions}
      footer={
        <>
          <a className="button" href={link()}>
            <Icon name="circle-arrow-left" />
            Torna al percorso
          </a>
          {next && (
            <a className="button" href={link(next.id)}>
              <Icon name="circle-arrow-right" />
              Prossimo nel percorso
            </a>
          )}
        </>
      }
    />
  );
}
