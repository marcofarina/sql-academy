import { useEffect, useState } from 'react';
import { storageDi, useArea } from '../zaino/area.ts';
import { loadSession, saveSession, useSessionsCleared } from './sessionStorage.ts';
import { clearGuide } from '../guide/guide.ts';
import { clearSiteScheme } from '../scheme/siteScheme.ts';
import { lastExercise } from './resume.ts';
import { Icon } from '../icons/Icon.tsx';
import type { ThemeProgress } from '../progress/progress.ts';
import type { ProgressActions } from '../progress/useProgress.ts';
import { CONSEGNA_ITEM, formatRoute, SESSION_ITEM, type ThemeRoute } from '../routing/route.ts';
import { readConsegna, sameConsegna } from '../consegna/consegna.ts';
import { ConsegnaIntro } from '../consegna/ConsegnaIntro.tsx';
import { ExerciseWorkspace } from './ExerciseWorkspace.tsx';
import { plural, sortExercises } from './exercises.ts';
import { PathView } from './PathView.tsx';
import { SessionIcon } from './SessionIcon.tsx';
import { SessionView, type ActiveSession } from './SessionView.tsx';
import { baselineOf, sessionKind } from './session.ts';
import { dueExercises, nextReviewAt, startReview } from './review.ts';
import type { TrainingState } from './useTraining.ts';

interface TrainingSectionProps {
  themeId: string;
  /** `undefined`: il percorso; `SESSION_ITEM`: la sessione; `CONSEGNA_ITEM`: una consegna; altrimenti l’`id` di un esercizio. */
  item: string | undefined;
  /** Con `CONSEGNA_ITEM`: codice e titolo della consegna dall’indirizzo. */
  consegna?: ThemeRoute['consegna'];
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
  const cleared = useSessionsCleared();
  if (props.training.status !== 'ready') return <TrainingStatus training={props.training} />;
  // Un cambio d’area, un azzeramento o l’uscita dallo zaino ricominciano da quello che è salvato.
  return <ReadyTraining key={`${area}:${props.progress.epoch}:${cleared}`} {...props} training={props.training} />;
}

/** Una sessione salvata, aperta dal suo indirizzo: si riprende o si abbandona per sceglierne una nuova. */
function SavedSession({ session, onResume, onAbandon }: { session: ActiveSession; onResume(): void; onAbandon(): void }) {
  const solved = Object.values(session.records).filter((record) => record.solved).length;
  const kind = sessionKind(session);
  const text = {
    sessione: ['Hai una sessione in corso', 'Puoi riprenderla dal punto in cui l’hai lasciata, oppure abbandonarla e sceglierne una nuova.', 'Riprendi la sessione'],
    ripasso: ['Hai un ripasso in corso', 'Puoi riprenderlo dal punto in cui l’hai lasciato, oppure abbandonarlo.', 'Riprendi il ripasso'],
    consegna: ['Hai una consegna in corso', 'Puoi riprenderla dal punto in cui l’hai lasciata, oppure abbandonarla e sceglierne una nuova.', 'Riprendi la consegna'],
  }[kind];
  return (
    <div className="session-config">
      <p className="lead">
        {text[0]}: sei all’esercizio {session.index + 1} di {session.exerciseIds.length}, con{' '}
        {plural(solved, 'esercizio risolto', 'esercizi risolti')}. {text[1]}
      </p>
      <div className="toolbar">
        <button type="button" className="primary" onClick={onResume}>
          <SessionIcon />
          {text[2]}
        </button>
        <button type="button" onClick={onAbandon}>
          Abbandonala
        </button>
      </div>
    </div>
  );
}

/** L’addestramento con gli esercizi caricati: tiene la sessione in corso e la salva a ogni cambiamento. */
function ReadyTraining(props: TrainingSectionProps & { training: Extract<TrainingState, { status: 'ready' }> }) {
  const { themeId, item, consegna, training, progress, actions } = props;
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
    const ids = training.exercises.map((e) => e.id);
    const due = dueExercises(ids, progress);
    return (
      <PathView
        themeId={themeId}
        exercises={training.exercises}
        progress={progress}
        sessionStatus={sessionStatus}
        sessionKind={pending ? sessionKind(pending) : undefined}
        review={{ due: due.length, nextAt: nextReviewAt(ids, progress) }}
        last={lastExercise(sortExercises(training.exercises), progress)}
        onReset={() => { abandon(); clearGuide(); clearSiteScheme(); actions.reset(); }}
        onResume={() => {
          if (session?.finished && session.review) setSession(undefined);
          else resume();
        }}
        onReview={() => setSession(startReview(progress, due))}
        onAbandon={pending ? abandon : undefined}
      />
    );
  }

  if (item === SESSION_ITEM) {
    if (saved && !session) return <SavedSession session={saved} onResume={resume} onAbandon={abandon} />;
    // Il riepilogo di una consegna sta sul suo link e non offre «Nuova sessione»: qui se ne configura una nuova.
    const shown = session?.finished && session.consegna ? undefined : session;
    return (
      <SessionView
        themeId={themeId}
        training={training}
        progress={progress}
        actions={actions}
        session={shown}
        onSession={setSession}
      />
    );
  }

  if (item === CONSEGNA_ITEM) {
    const letta = consegna
      ? readConsegna(consegna, training.exercises.map((e) => e.id))
      : ({ ok: false, reason: 'illeggibile' } as const);
    // La consegna di questo link è già in memoria: si svolge, o se ne vede il riepilogo.
    if (letta.ok && consegna && session && sameConsegna(session.consegna, consegna)) {
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
    const start = () => {
      if (!letta.ok || !consegna) return;
      setSaved(undefined);
      setSession({
        exerciseIds: letta.ids,
        index: 0,
        records: {},
        baseline: baselineOf(progress, letta.ids),
        finished: false,
        consegna: { code: consegna.code, ...(letta.title ? { title: letta.title } : {}) },
      });
    };
    return (
      <ConsegnaIntro
        themeId={themeId}
        letta={letta}
        same={consegna !== undefined && sameConsegna(pending?.consegna, consegna)}
        exercises={training.exercises}
        pending={pending}
        onStart={start}
        onResume={resume}
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
