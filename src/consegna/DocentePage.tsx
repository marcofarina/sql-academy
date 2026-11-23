/**
 * La pagina `#/docente` (F14 del piano `portale-v2`): il docente sceglie un
 * tema e alcuni esercizi, dà un titolo e copia il link della consegna. La
 * pagina non salva nulla: la consegna vive solo nel link.
 */
import { useEffect, useState } from 'react';
import { Icon } from '../icons/Icon.tsx';
import { CONSEGNA_ITEM, formatRoute } from '../routing/route.ts';
import { CHAPTERS, DIFFICULTIES, type Chapter, type Difficulty, type Exercise, type Theme } from '../themes/contract.ts';
import {
  CHAPTER_INFO,
  chapterLabel,
  DIFFICULTY_LABEL,
  filterCatalog,
  keywordsOf,
  plural,
  sortExercises,
  type CatalogFilters,
} from '../training/exercises.ts';
import { cleanTitle, CONSEGNA_MAX, encodeConsegna, TITOLO_MAX } from './consegna.ts';

/** Gli esercizi caricati per un tema: `undefined` se il caricamento è fallito. */
type Caricati = { themeId: string; exercises: Exercise[] | undefined };

const EXTRACTION_SIZES = [3, 5, 10] as const;

/** Mescola una copia di `items`. */
function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** L’indirizzo completo della consegna, da incollare dove lo leggono gli studenti. */
function consegnaUrl(themeId: string, ids: string[], title: string): string {
  const clean = cleanTitle(title);
  const hash = formatRoute({
    page: 'theme',
    themeId,
    section: 'addestramento',
    item: CONSEGNA_ITEM,
    consegna: { code: encodeConsegna(ids), ...(clean ? { title: clean } : {}) },
  });
  return `${window.location.origin}${window.location.pathname}${hash}`;
}

/** La pagina per i docenti: scelta del tema e degli esercizi, titolo, link da copiare. */
export function DocentePage({ themes }: { themes: Theme[] }) {
  const [themeId, setThemeId] = useState(themes[0]?.manifest.id ?? '');
  const [caricati, setCaricati] = useState<Caricati>();
  const [selected, setSelected] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [filters, setFilters] = useState<CatalogFilters>({ text: '' });
  const [size, setSize] = useState<number>(5);
  const [copia, setCopia] = useState<{ link: string; ok: boolean }>();

  useEffect(() => {
    document.title = 'Per i docenti · SQL Academy';
  }, []);

  useEffect(() => {
    const theme = themes.find((t) => t.manifest.id === themeId);
    if (!theme) return;
    let cancelled = false;
    theme
      .loadExercises()
      .then((exercises) => !cancelled && setCaricati({ themeId, exercises }))
      .catch(() => !cancelled && setCaricati({ themeId, exercises: undefined }));
    return () => {
      cancelled = true;
    };
  }, [themes, themeId]);

  const chooseTheme = (id: string) => {
    setThemeId(id);
    setSelected([]);
    setFilters({ text: '' });
  };

  const esercizi =
    caricati?.themeId !== themeId ? { status: 'loading' as const }
      : caricati.exercises ? { status: 'ready' as const, exercises: caricati.exercises }
      : { status: 'failed' as const };
  const exercises = esercizi.status === 'ready' ? esercizi.exercises : [];
  const byId = new Map(exercises.map((e) => [e.id, e]));
  const found = filterCatalog(exercises, filters);
  const full = selected.length >= CONSEGNA_MAX;
  const free = found.filter((e) => !selected.includes(e.id));
  const link = selected.length > 0 ? consegnaUrl(themeId, selected, title) : undefined;

  const toggle = (id: string) =>
    setSelected((now) => (now.includes(id) ? now.filter((x) => x !== id) : now.length < CONSEGNA_MAX ? [...now, id] : now));
  const extract = () =>
    setSelected((now) => [...now, ...shuffle(free.map((e) => e.id)).slice(0, Math.max(0, CONSEGNA_MAX - now.length)).slice(0, size)]);
  const sort = () => setSelected((now) => sortExercises(now.map((id) => byId.get(id)!)).map((e) => e.id));
  const copy = () => {
    if (!link) return;
    navigator.clipboard.writeText(link).then(
      () => setCopia({ link, ok: true }),
      () => {
        (document.getElementById('consegna-link') as HTMLInputElement | null)?.select();
        setCopia({ link, ok: false });
      },
    );
  };

  const set = (change: Partial<CatalogFilters>) => setFilters({ ...filters, ...change });
  const optional = (value: string) => (value === '' ? undefined : value);
  const chapters = CHAPTERS.filter((c) => exercises.some((e) => e.chapter === c));

  return (
    <main className="page docente-page">
      <h1>
        <Icon name="link" />
        Crea una consegna
      </h1>
      <p className="lead">
        Scegli un tema e alcuni esercizi: ottieni un link da condividere con la classe, per esempio in Classroom o nel registro
        elettronico. Chi lo apre trova gli stessi esercizi nello stesso ordine e li svolge con i punti di sempre. Il sito non
        raccoglie i risultati: alla fine ogni studente vede un riepilogo con data e ora, che può mostrarti a schermo.
      </p>

      <section className="zaino-scheda" aria-labelledby="consegna-tema">
        <h2 id="consegna-tema">Tema e titolo</h2>
        <div className="catalog-filters">
          <label>
            Tema
            <select value={themeId} onChange={(event) => chooseTheme(event.target.value)}>
              {themes.map((t) => (
                <option key={t.manifest.id} value={t.manifest.id}>
                  {t.manifest.title}
                </option>
              ))}
            </select>
          </label>
          <label className="docente-title">
            Titolo, facoltativo
            <input
              type="text"
              maxLength={TITOLO_MAX}
              placeholder="Per esempio: Join, compito per giovedì"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>
        </div>
        <p className="hint-text">Cambiando tema, gli esercizi scelti si tolgono: ogni consegna è di un tema solo.</p>
      </section>

      <section className="zaino-scheda" aria-labelledby="consegna-scelti">
        <h2 id="consegna-scelti">
          Esercizi scelti: {selected.length} di {CONSEGNA_MAX} al massimo
        </h2>
        {selected.length === 0 ? (
          <p>Non hai ancora scelto esercizi: aggiungili dall’elenco del tema, più sotto.</p>
        ) : (
          <>
            <ol className="consegna-list">
              {selected.map((id) => {
                const exercise = byId.get(id);
                return (
                  <li key={id}>
                    <span className="exercise-title">{exercise?.title ?? id}</span>
                    {exercise && (
                      <span className={`difficulty difficulty-${exercise.difficulty}`}>{DIFFICULTY_LABEL[exercise.difficulty]}</span>
                    )}
                    <button type="button" className="link-button" onClick={() => toggle(id)}>
                      Togli
                    </button>
                  </li>
                );
              })}
            </ol>
            <div className="toolbar">
              <button type="button" onClick={sort}>
                Ordina per capitolo e difficoltà
              </button>
              <button type="button" onClick={() => setSelected([])}>
                <Icon name="trash-can" />
                Togli tutti
              </button>
            </div>
          </>
        )}
      </section>

      <section className="zaino-scheda" aria-labelledby="consegna-link-titolo">
        <h2 id="consegna-link-titolo">Link della consegna</h2>
        {link ? (
          <>
            <input id="consegna-link" className="docente-link" type="text" readOnly value={link} onFocus={(e) => e.target.select()} />
            <div className="toolbar">
              <button type="button" className="primary" onClick={copy}>
                <Icon name="copy" />
                Copia il link
              </button>
              <a className="button" href={link} target="_blank" rel="noopener">
                <Icon name="circle-arrow-right" />
                Provalo in una scheda nuova
              </a>
              <span role="status">{/* Ogni modifica cambia il link: la conferma vale solo per quello copiato. */}
                {copia?.link !== link
                  ? ''
                  : copia.ok
                    ? 'Link copiato.'
                    : 'Il browser non ha permesso la copia: il link è selezionato, copialo con la tastiera.'}</span>
            </div>
          </>
        ) : (
          <p>Il link compare quando scegli almeno un esercizio.</p>
        )}
      </section>

      <section aria-labelledby="consegna-catalogo">
        <h2 id="consegna-catalogo">Esercizi del tema</h2>
        {esercizi.status === 'loading' && <p role="status">Caricamento degli esercizi…</p>}
        {esercizi.status === 'failed' && (
          <div className="notice notice-error" role="alert">
            <Icon name="circle-xmark" />
            <p>Gli esercizi di questo tema non si sono caricati. Ricarica la pagina e riprova.</p>
          </div>
        )}
        {esercizi.status === 'ready' && (
          <>
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
            </form>
            <div className="toolbar">
              <label className="docente-size">
                Quanti
                <select value={size} onChange={(event) => setSize(Number(event.target.value))}>
                  {EXTRACTION_SIZES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <button type="button" onClick={extract} disabled={full || free.length === 0}>
                <Icon name="dice" />
                Estrai a caso fra questi
              </button>
              <span role="status">
                {found.length === exercises.length
                  ? `${plural(exercises.length, 'esercizio', 'esercizi')}.`
                  : `${plural(found.length, 'esercizio', 'esercizi')} su ${exercises.length}.`}
                {full && ' Hai raggiunto il massimo della consegna.'}
              </span>
            </div>
            {found.length === 0 ? (
              <p className="empty-state">Nessun esercizio corrisponde alla ricerca: prova a togliere un filtro.</p>
            ) : (
              <div className="table-scroll">
                <table className="catalog-table">
                  <thead>
                    <tr>
                      <th scope="col">Nella consegna</th>
                      <th scope="col">Esercizio</th>
                      <th scope="col">Capitolo</th>
                      <th scope="col">Difficoltà</th>
                    </tr>
                  </thead>
                  <tbody>
                    {found.map((exercise) => {
                      const checked = selected.includes(exercise.id);
                      return (
                        <tr key={exercise.id}>
                          <td>
                            <input
                              type="checkbox"
                              aria-label={`Aggiungi «${exercise.title}»`}
                              checked={checked}
                              disabled={!checked && full}
                              onChange={() => toggle(exercise.id)}
                            />
                          </td>
                          <td>
                            {exercise.title}
                            <span className="docente-prompt">{exercise.prompt}</span>
                          </td>
                          <td title={chapterLabel(exercise.chapter)}>{CHAPTER_INFO[exercise.chapter].number}</td>
                          <td>
                            <span className={`difficulty difficulty-${exercise.difficulty}`}>
                              {DIFFICULTY_LABEL[exercise.difficulty]}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
