import { Icon } from '../icons/Icon.tsx';
import { exerciseProgress, type ThemeProgress } from '../progress/progress.ts';
import { formatRoute, SESSION_ITEM } from '../routing/route.ts';
import type { Exercise } from '../themes/contract.ts';
import { useThemeIcons } from '../themes/ThemeIconsContext.ts';
import { SessionIcon } from './SessionIcon.tsx';
import { Reward } from '../points/Reward.tsx';
import { buildPath, chapterLabel, DIFFICULTY_LABEL, plural } from './exercises.ts';

interface PathViewProps {
  themeId: string;
  exercises: Exercise[];
  progress: ThemeProgress;
  /** Posizione della sessione in corso, se c’è: «3 di 5». */
  sessionStatus?: string;
  onReset(): void;
}

function solvedCount(exercises: Exercise[], progress: ThemeProgress): number {
  return exercises.filter((e) => exerciseProgress(progress, e.id).solved).length;
}

/** Il percorso: gli esercizi per capitolo del libro e difficoltà, con lo stato di ciascuno. */
export function PathView({ themeId, exercises, progress, sessionStatus, onReset }: PathViewProps) {
  const link = (item: string) => formatRoute({ page: 'theme', themeId, section: 'addestramento', item });
  const themeIcons = useThemeIcons();

  const reset = () => {
    if (window.confirm('Azzerare i progressi di questo tema? Esercizi risolti, punti, suggerimenti e query salvate andranno persi.')) {
      onReset();
    }
  };

  if (exercises.length === 0) return <p className="placeholder">Questo tema non ha ancora esercizi.</p>;

  return (
    <div className="path">
      <div className="toolbar">
        <a className="button primary" href={link(SESSION_ITEM)}>
          <SessionIcon />
          {sessionStatus ? `Riprendi la sessione (${sessionStatus})` : 'Nuova sessione'}
        </a>
        <button type="button" onClick={reset}>
          {themeIcons.reset ? <Icon svg={themeIcons.reset} /> : <Icon name="trash-can" />}
          Azzera i progressi
        </button>
      </div>
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
