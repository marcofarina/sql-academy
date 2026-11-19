import { useState } from 'react';
import { Icon } from '../icons/Icon.tsx';
import { useThemeIcons } from '../themes/ThemeIconsContext.ts';
import { exerciseProgress, type ThemeProgress } from '../progress/progress.ts';
import { formatRoute } from '../routing/route.ts';
import { CHAPTERS, DIFFICULTIES, type Chapter, type Difficulty } from '../themes/contract.ts';
import {
  CHAPTER_INFO,
  chapterLabel,
  DIFFICULTY_LABEL,
  filterCatalog,
  keywordsOf,
  plural,
  tablesOf,
  type CatalogFilters,
} from './exercises.ts';
import { TrainingStatus } from './TrainingSection.tsx';
import { Reward } from '../points/Reward.tsx';
import type { TrainingState } from './useTraining.ts';

interface CatalogSectionProps {
  themeId: string;
  training: TrainingState;
  progress: ThemeProgress;
}

/** «Tutte le query»: l’elenco completo degli esercizi del tema, con ricerca e filtri. */
export function CatalogSection({ themeId, training, progress }: CatalogSectionProps) {
  const [filters, setFilters] = useState<CatalogFilters>({ text: '' });
  const themeIcons = useThemeIcons();
  if (training.status !== 'ready') return <TrainingStatus training={training} />;

  const { exercises } = training;
  const found = filterCatalog(exercises, filters);
  const chapters = CHAPTERS.filter((c) => exercises.some((e) => e.chapter === c));
  const set = (change: Partial<CatalogFilters>) => setFilters({ ...filters, ...change });
  const optional = (value: string) => (value === '' ? undefined : value);

  return (
    <div className="catalog">
      <form className="catalog-filters" role="search" onSubmit={(event) => event.preventDefault()}>
        <label className="search">
          <Icon name="magnifying-glass" />
          <span className="visually-hidden">Cerca negli esercizi</span>
          <input
            type="search"
            placeholder="Cerca nel titolo o nella consegna"
            value={filters.text}
            onChange={(event) => set({ text: event.target.value })}
          />
        </label>
        <label>
          Capitolo
          <select
            value={filters.chapter ?? ''}
            onChange={(event) => set({ chapter: optional(event.target.value) as Chapter | undefined })}
          >
            <option value="">Tutti</option>
            {chapters.map((c) => (
              <option key={c} value={c}>
                {chapterLabel(c)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Difficoltà
          <select
            value={filters.difficulty ?? ''}
            onChange={(event) => set({ difficulty: optional(event.target.value) as Difficulty | undefined })}
          >
            <option value="">Tutte</option>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {DIFFICULTY_LABEL[d]}
              </option>
            ))}
          </select>
        </label>
        <label>
          Parola chiave
          <select value={filters.keyword ?? ''} onChange={(event) => set({ keyword: optional(event.target.value) })}>
            <option value="">Tutte</option>
            {keywordsOf(exercises).map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </label>
        <label>
          Tabella
          <select value={filters.table ?? ''} onChange={(event) => set({ table: optional(event.target.value) })}>
            <option value="">Tutte</option>
            {tablesOf(exercises).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </form>
      <p role="status">
        {found.length === exercises.length
          ? `${plural(exercises.length, 'esercizio', 'esercizi')}.`
          : `${plural(found.length, 'esercizio', 'esercizi')} su ${exercises.length}.`}
      </p>
      {found.length === 0 && (
        <p className="empty-state">
          {themeIcons.empty && <Icon svg={themeIcons.empty} />}
          Nessun esercizio corrisponde alla ricerca: prova a togliere un filtro.
        </p>
      )}
      {found.length > 0 && (
        <div className="table-scroll">
          <table className="catalog-table">
            <thead>
              <tr>
                <th scope="col">Esercizio</th>
                <th scope="col">Capitolo</th>
                <th scope="col">Difficoltà</th>
                <th scope="col">Premio</th>
                <th scope="col">Parole chiave</th>
              </tr>
            </thead>
            <tbody>
              {found.map((exercise) => {
                const state = exerciseProgress(progress, exercise.id);
                const done = state.solved;
                return (
                  <tr key={exercise.id}>
                    <td>
                      <a
                        className="status"
                        href={formatRoute({ page: 'theme', themeId, section: 'addestramento', item: exercise.id })}
                      >
                        <Icon name={done ? 'circle-check' : 'circle'} title={done ? 'Risolto' : 'Da fare'} />
                        {exercise.title}
                      </a>
                    </td>
                    <td title={chapterLabel(exercise.chapter)}>{CHAPTER_INFO[exercise.chapter].number}</td>
                    <td>
                      <span className={`difficulty difficulty-${exercise.difficulty}`}>
                        {DIFFICULTY_LABEL[exercise.difficulty]}
                      </span>
                    </td>
                    <td>
                      <Reward exercise={exercise} state={state} />
                    </td>
                    <td>
                      {/* Le parole chiave suggeriscono la soluzione: si vedono solo a esercizio risolto. */}
                      {done ? (
                        exercise.keywords.map((k) => (
                          <code key={k} className="keyword">
                            {k}
                          </code>
                        ))
                      ) : (
                        <span className="keywords-hidden">dopo la soluzione</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
