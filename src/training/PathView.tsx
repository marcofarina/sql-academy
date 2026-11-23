import { Icon } from '../icons/Icon.tsx';
import { exerciseProgress, type ThemeProgress } from '../progress/progress.ts';
import { formatRoute, SESSION_ITEM } from '../routing/route.ts';
import type { Exercise } from '../themes/contract.ts';
import { useThemeIcons } from '../themes/ThemeIconsContext.ts';
import { SessionIcon } from './SessionIcon.tsx';
import { Reward } from '../points/Reward.tsx';
import { buildPath, chapterLabel, DIFFICULTY_LABEL, plural } from './exercises.ts';
import { daysUntil } from './review.ts';
import { RESUME_LABEL } from './resume.ts';
import type { SessionKind } from './session.ts';

interface PathViewProps {
  themeId: string;
  exercises: Exercise[];
  progress: ThemeProgress;
  /** Posizione della sessione in corso, se c’è: «3 di 5». */
  sessionStatus?: string;
  /** Il tipo della sessione in corso: sessione, ripasso o consegna. */
  sessionKind?: SessionKind;
  /** Quanti esercizi sono da ripassare adesso e, se nessuno, quando arriva il prossimo. */
  review: { due: number; nextAt: number | undefined };
  /** L’ultimo esercizio su cui lo studente ha scritto, per «Riprendi da dove eri» (F16). */
  last?: Exercise;
  onReset(): void;
  onResume(): void;
  /** Avvia il ripasso degli esercizi da ripassare. */
  onReview(): void;
  onAbandon?: () => void;
}

function solvedCount(exercises: Exercise[], progress: ThemeProgress): number {
  return exercises.filter((e) => exerciseProgress(progress, e.id).solved).length;
}

/** Che cos’è il ripasso e, se non c’è nulla da ripassare, quando arriva il prossimo. */
function ReviewNote({ review }: { review: PathViewProps['review'] }) {
  const waiting =
    review.due > 0 ? ''
      : review.nextAt === undefined ? ' Per ora non hai esercizi da ripassare.'
      : ` Per ora non hai esercizi da ripassare: il prossimo torna fra ${plural(daysUntil(review.nextAt), 'giorno', 'giorni')}.`;
  return (
    <p className="hint-text">
      Il ripasso ti ripropone, con l’editor vuoto, gli esercizi che hai già risolto. Un esercizio torna un giorno dopo
      la risoluzione; ogni volta che lo risolvi senza aprire la soluzione, torna dopo un intervallo più lungo: 3, 7 e
      poi 21 giorni, superati i quali non torna più. Se apri la soluzione o lo salti, torna il giorno dopo. Il ripasso
      non dà punti e gli aiuti sono gratis.{waiting}
    </p>
  );
}

/** Il percorso: gli esercizi per capitolo del libro e difficoltà, con lo stato di ciascuno. */
export function PathView({ themeId, exercises, progress, sessionStatus, sessionKind = 'sessione', review, last, onReset, onResume, onReview, onAbandon }: PathViewProps) {
  const link = (item: string) => formatRoute({ page: 'theme', themeId, section: 'addestramento', item });
  const themeIcons = useThemeIcons();

  const reset = () => {
    if (window.confirm('Azzerare i progressi di questo tema? Esercizi risolti, punti, suggerimenti, query salvate e sessione in corso andranno persi.')) {
      onReset();
    }
  };

  if (exercises.length === 0) return <p className="placeholder">Questo tema non ha ancora esercizi.</p>;

  return (
    <div className="path">
      <div className="toolbar">
        <a className="button primary" href={link(SESSION_ITEM)} onClick={onResume}>
          <SessionIcon />
          {sessionStatus
            ? `${RESUME_LABEL[sessionKind]} (${sessionStatus})`
            : 'Nuova sessione'}
        </a>
        {onAbandon && <button type="button" onClick={onAbandon}>{sessionKind === 'ripasso' ? 'Abbandonalo' : 'Abbandonala'}</button>}
        {/* Con una sessione in corso vale quella: «Riprendi da dove eri» compare solo senza. */}
        {!sessionStatus && last && (
          <a className="button" href={link(last.id)} title={last.title}>
            <Icon name="bullseye" />
            Riprendi da dove eri
          </a>
        )}
        {!sessionStatus && (review.due > 0 ? (
          <a className="button" href={link(SESSION_ITEM)} onClick={onReview}>
            <Icon name="circle-arrow-rotate-left" />
            Ripasso ({review.due})
          </a>
        ) : (
          <button type="button" disabled>
            <Icon name="circle-arrow-rotate-left" />
            Nulla da ripassare
          </button>
        ))}
        <button type="button" onClick={reset}>
          {themeIcons.reset ? <Icon svg={themeIcons.reset} /> : <Icon name="trash-can" />}
          Azzera i progressi
        </button>
      </div>
      {!sessionStatus && <ReviewNote review={review} />}
      <p className="lead">
        {solvedCount(exercises, progress) === 1 ? 'Risolto' : 'Risolti'} {solvedCount(exercises, progress)} su{' '}
        {plural(exercises.length, 'esercizio', 'esercizi')}. Gli esercizi seguono i capitoli del{' '}
        <cite>Manuale dell’Archivista</cite> e, dentro ogni capitolo, vanno dal più facile al più difficile.
      </p>
      {buildPath(exercises).map(({ chapter, exercises: group }) => {
        const solved = solvedCount(group, progress);
        return (
          <section key={chapter} className="chapter" aria-labelledby={`chapter-${chapter}`}>
            <h2 id={`chapter-${chapter}`}>{chapterLabel(chapter)}</h2>
            <p className="chapter-progress">
              <progress max={group.length} value={solved} aria-hidden="true" />
              {solved} di {group.length} {solved === 1 ? 'risolto' : 'risolti'}
            </p>
            <ul className="exercise-list">
              {group.map((exercise) => {
                const state = exerciseProgress(progress, exercise.id);
                const done = state.solved;
                return (
                  <li key={exercise.id}>
                    <a href={link(exercise.id)}>
                      <Icon name={done ? 'circle-check' : 'circle'} title={done ? 'Risolto' : 'Da fare'} />
                      <span className="exercise-title">{exercise.title}</span>
                      <span className={`difficulty difficulty-${exercise.difficulty}`}>
                        {DIFFICULTY_LABEL[exercise.difficulty]}
                      </span>
                      <Reward exercise={exercise} state={state} />
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
