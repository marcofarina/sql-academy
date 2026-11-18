import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { Icon } from '../icons/Icon.tsx';
import { formatRoute } from '../routing/route.ts';
import { CHAPTERS, DIFFICULTIES, type Theme } from '../themes/contract.ts';
import { plural } from '../training/exercises.ts';
import {
  clamp,
  credits,
  deckPlacement,
  MIN_POSTERS,
  POSTER_HEIGHT,
  POSTER_WIDTH,
  scatter,
  transformOf,
  type Placement,
} from './homeLayout.ts';

const BOOK_URL = 'https://python.rainbowbits.cloud';
/** Ritardo fra una locandina e la successiva nel lancio, in secondi. */
const LAUNCH_STAGGER = 0.11;
const LAUNCH_DURATION = 0.85;
/** Il cambio di faccia avviene a metà del giro: prima la faccia nuova non può ricevere il fuoco. */
const FLIP_HALF_MS = 450;
const DRAG_THRESHOLD = 5;
const SWIPE_THRESHOLD = 80;

const DECK_QUERY = '(max-width: 40rem)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const DIFFICULTY_PLURAL = { facile: 'facili', medio: 'medi', difficile: 'difficili' } as const;
const DIFFICULTY_CLASS = { facile: 'easy', medio: 'medium', difficile: 'hard' } as const;
/** Nomi brevi dei capitoli, per la scheda (i titoli del libro sono in `CHAPTER_INFO`). */
const CHAPTER_SHORT = {
  'una-tabella': 'una tabella',
  join: 'join',
  aggregazioni: 'aggregazioni',
  'sottoquery-viste': 'sottoquery e viste',
} as const;

/** Una locandina: un tema o un posto «Prossimamente». */
type Poster = { kind: 'theme'; theme: Theme } | { kind: 'soon'; number: number };

/**
 * Porta il fuoco su `target` quando la sua faccia è visibile: il cambio di
 * faccia è una transizione CSS, che può finire dopo il tempo previsto.
 */
function focusWhenVisible(target: HTMLElement | null | undefined, face: HTMLElement | null | undefined) {
  if (!target) return;
  target.focus();
  if (document.activeElement === target || !face) return;
  const onEnd = (event: TransitionEvent) => {
    if (event.target !== face || event.propertyName !== 'visibility') return;
    face.removeEventListener('transitionend', onEnd);
    target.focus();
  };
  face.addEventListener('transitionend', onEnd);
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);
    list.addEventListener('change', update);
    return () => list.removeEventListener('change', update);
  }, [query]);
  return matches;
}

interface OpenGeometry {
  placement: Placement;
  width: number;
  height: number;
}

interface Drag {
  index: number;
  pointerId: number;
  startX: number;
  startY: number;
  /** Posizione della locandina all’inizio del trascinamento. */
  origin: Placement;
  moved: boolean;
}

/** Pagina iniziale: le locandine dei temi lanciate su un tavolo; a 375 px, un mazzo. */
export function HomePage({ themes }: { themes: Theme[] }) {
  const posters: Poster[] = [
    ...themes.map((theme): Poster => ({ kind: 'theme', theme })),
    ...Array.from(
      { length: Math.max(0, MIN_POSTERS - themes.length) },
      (_, i): Poster => ({ kind: 'soon', number: themes.length + i + 1 }),
    ),
  ];
  const count = posters.length;

  const isDeck = useMediaQuery(DECK_QUERY);
  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);

  const tableRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const [scattered, setScattered] = useState<Placement[] | null>(null);
  /** Ordine di sovrapposizione: l’ultimo è in cima. */
  const [stack, setStack] = useState(() => posters.map((_, i) => i));
  /** All’apertura le locandine partono dal fondo, fuori dalla pagina. */
  const [offscreen, setOffscreen] = useState(() => !window.matchMedia(REDUCED_MOTION_QUERY).matches);
  const [staggered, setStaggered] = useState(false);
  const [deckTop, setDeckTop] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const [openGeometry, setOpenGeometry] = useState<OpenGeometry | null>(null);
  const [drag, setDrag] = useState<{ index: number; x: number; y: number } | null>(null);
  const dragRef = useRef<Drag | null>(null);
  /** Un trascinamento appena finito non deve aprire la scheda con il clic che lo chiude. */
  const suppressClick = useRef(false);
  const openButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const dialogs = useRef<(HTMLDivElement | null)[]>([]);
  const timers = useRef<number[]>([]);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  useLayoutEffect(() => {
    const element = tableRef.current;
    if (!element) return;
    const measure = () => setSize({ width: element.clientWidth, height: element.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  /** Lancio: posizioni nuove, con le locandine che arrivano una dopo l’altra. */
  const launch = useCallback(() => {
    if (!size) return;
    setScattered(scatter(count, size.width));
    if (reducedMotion) return;
    setStaggered(true);
    later(() => setStaggered(false), (LAUNCH_DURATION + LAUNCH_STAGGER * count) * 1000);
  }, [count, size, reducedMotion, later]);

  // Primo lancio, appena il tavolo ha una misura.
  const launched = useRef(false);
  useEffect(() => {
    if (!size || launched.current) return;
    launched.current = true;
    launch();
    // Due fotogrammi: il primo disegna le locandine fuori pagina, il secondo avvia la transizione.
    requestAnimationFrame(() => requestAnimationFrame(() => setOffscreen(false)));
  }, [size, launch]);

  const placementOf = (index: number): Placement => {
    const width = size?.width ?? 0;
    const height = size?.height ?? 0;
    let base: Placement;
    if (isDeck) {
      const depth = (index - deckTop + count) % count;
      base = deckPlacement(depth, width);
    } else {
      const p = scattered?.[index] ?? { x: 0, y: 0, rotate: 0, scale: 1 };
      base = { ...p, x: clamp(p.x, 0, Math.max(0, width - POSTER_WIDTH)) };
    }
    if (offscreen) return { ...base, y: height + 80 };
    return base;
  };

  /** Dimensioni e posizione della scheda aperta: al centro della finestra. */
  const openPlacement = (): OpenGeometry => {
    const width = isDeck ? Math.min(343, window.innerWidth - 32) : 420;
    const height = Math.min(isDeck ? 660 : 630, window.innerHeight - 32);
    const rect = tableRef.current?.getBoundingClientRect() ?? { left: 0, top: 0 };
    return {
      width,
      height,
      placement: {
        x: (window.innerWidth - width) / 2 - rect.left,
        y: (window.innerHeight - height) / 2 - rect.top,
        rotate: 0,
        scale: 1,
      },
    };
  };

  const raise = (index: number) => setStack((s) => [...s.filter((i) => i !== index), index]);

  const openCard = (index: number) => {
    setOpenGeometry(openPlacement());
    setOpen(index);
    later(() => {
      const dialog = dialogs.current[index];
      focusWhenVisible(dialog?.querySelector<HTMLElement>('.card-actions > *'), dialog);
    }, reducedMotion ? 0 : FLIP_HALF_MS);
  };

  const closeCard = useCallback(() => {
    if (open === null) return;
    const index = open;
    setOpen(null);
    later(() => openButtons.current[index]?.focus(), reducedMotion ? 0 : FLIP_HALF_MS);
  }, [open, later, reducedMotion]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') closeCard();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, closeCard]);

  const reshuffle = () => {
    setOpen(null);
    launch();
  };

  const turnDeck = (step: number) => setDeckTop((top) => (top + step + count) % count);

  // Trascinamento: parte dopo 5 px; sul mazzo è solo orizzontale e sfoglia.
  const onPointerDown = (index: number, event: PointerEvent<HTMLButtonElement>) => {
    if (open !== null || event.button !== 0) return;
    dragRef.current = {
      index,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origin: placementOf(index),
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const current = dragRef.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const dx = event.clientX - current.startX;
    const dy = event.clientY - current.startY;
    if (!current.moved) {
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
      current.moved = true;
      if (!isDeck) raise(current.index);
    }
    if (isDeck) {
      setDrag({ index: current.index, x: current.origin.x + dx, y: current.origin.y });
    } else {
      const width = size?.width ?? 0;
      const height = size?.height ?? 0;
      setDrag({
        index: current.index,
        x: clamp(current.origin.x + dx, 0, Math.max(0, width - POSTER_WIDTH)),
        y: clamp(current.origin.y + dy, 0, Math.max(0, height - POSTER_HEIGHT)),
      });
    }
  };

  const onPointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    const current = dragRef.current;
    if (!current || current.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (!current.moved) return; // Il clic che segue apre la scheda.
    suppressClick.current = true;
    if (isDeck) {
      const dx = event.clientX - current.startX;
      if (Math.abs(dx) > SWIPE_THRESHOLD) turnDeck(dx < 0 ? 1 : -1);
    } else if (drag) {
      const { index, x, y } = drag;
      setScattered((s) => s && s.map((p, i) => (i === index ? { ...p, x, y } : p)));
    }
    setDrag(null);
  };

  const onPosterClick = (index: number) => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    openCard(index);
  };

  /** Il fuoco resta nella scheda aperta. */
  const trapFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return;
    const focusable = [...event.currentTarget.querySelectorAll<HTMLElement>('a[href], button')];
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const zIndexOf = (index: number) => (isDeck ? count - ((index - deckTop + count) % count) : stack.indexOf(index) + 1);

  return (
    <main className={isDeck ? 'home is-deck' : 'home'}>
      <header className="home-header">
        <div>
          <p className="home-brand">SQL Academy</p>
          <h1 className="home-title">Scegli il film, interroga il database.</h1>
        </div>
        <div className="home-aside">
          {isDeck ? (
            <p>Sfoglia le locandine, toccane una per aprire la sua scheda.</p>
          ) : (
            <>
              <p>Le locandine sono sul tavolo: spostale per scoprirle, cliccane una per aprire la sua scheda.</p>
              <button type="button" onClick={reshuffle}>
                <Icon name="dice" /> Rimescola
              </button>
            </>
          )}
        </div>
      </header>

      <div className="table-area" ref={tableRef}>
        {posters.map((poster, index) => {
          const isOpen = open === index;
          const isDragging = drag?.index === index;
          const isTop = !isDeck || index === deckTop;
          const geometry = isOpen ? openGeometry : null;
          let placement = geometry?.placement ?? placementOf(index);
          if (isDragging && drag) {
            placement = isDeck
              ? { ...placement, x: drag.x, rotate: (drag.x - placement.x) / 20 }
              : { x: drag.x, y: drag.y, rotate: placement.rotate * 0.4, scale: 1.05 };
          }
          const themeId = poster.kind === 'theme' ? poster.theme.manifest.id : undefined;
          const title = poster.kind === 'theme' ? poster.theme.manifest.title : `Tema ${poster.number}`;
          const classes = ['poster', isOpen && 'is-open', isDragging && 'is-dragging'].filter(Boolean).join(' ');
          const delay = staggered && !isOpen ? `${index * LAUNCH_STAGGER}s` : undefined;

          return (
            <div
              key={themeId ?? `soon-${poster.kind === 'soon' ? poster.number : index}`}
              className={classes}
              data-theme-id={themeId}
              style={{
                transform: transformOf(placement),
                transitionDelay: delay,
                width: geometry?.width,
                height: geometry?.height,
                zIndex: isOpen ? undefined : zIndexOf(index),
              }}
            >
              <div className="poster-inner">
                <div className={poster.kind === 'soon' ? `poster-face poster-front poster-soon${index % 2 ? ' is-b' : ''}` : 'poster-face poster-front'}>
                  <PosterFront poster={poster} />
                </div>
                <div
                  className="poster-face poster-back"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={`card-title-${index}`}
                  ref={(el) => {
                    dialogs.current[index] = el;
                  }}
                  onKeyDown={trapFocus}
                >
                  <PosterCard poster={poster} titleId={`card-title-${index}`} onClose={closeCard} />
                </div>
              </div>
              <button
                type="button"
                className="poster-open-button"
                ref={(el) => {
                  openButtons.current[index] = el;
                }}
                aria-label={`Apri la scheda di ${title}`}
                tabIndex={isTop ? undefined : -1}
                aria-hidden={isTop ? undefined : true}
                onPointerDown={(e) => onPointerDown(index, e)}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onClick={() => onPosterClick(index)}
              />
            </div>
          );
        })}

        {isDeck && (
          <div className="deck-controls" style={{ top: POSTER_HEIGHT + 40 }}>
            <button type="button" aria-label="Locandina precedente" onClick={() => turnDeck(-1)}>
              <Icon name="circle-arrow-left" />
            </button>
            <span className="deck-count" aria-live="polite">
              {deckTop + 1} di {count}
            </span>
            <button type="button" aria-label="Locandina successiva" onClick={() => turnDeck(1)}>
              <Icon name="circle-arrow-right" />
            </button>
          </div>
        )}
      </div>

      <div className={open === null ? 'home-veil' : 'home-veil is-visible'} onClick={closeCard} aria-hidden="true" />

      <p className="home-footer">
        Le query girano nel tuo browser con SQLite. Gli esercizi accompagnano <a href={BOOK_URL}>Python Doesn’t Byte</a>.
      </p>
    </main>
  );
}

function PosterFront({ poster }: { poster: Poster }) {
  if (poster.kind === 'soon') {
    return (
      <>
        <h2 className="poster-front-title">Prossi&shy;mamente</h2>
        <p className="poster-credits">Tema {poster.number}, da scegliere</p>
      </>
    );
  }
  const { manifest, stats } = poster.theme;
  return (
    <>
      <p className="poster-motto">{manifest.motto}</p>
      <h2 className="poster-front-title">{manifest.title}</h2>
      {stats && <p className="poster-credits">{credits(stats)}</p>}
    </>
  );
}

function PosterCard({ poster, titleId, onClose }: { poster: Poster; titleId: string; onClose: () => void }) {
  const back = (
    <button type="button" onClick={onClose}>
      Rimetti sul tavolo
    </button>
  );

  if (poster.kind === 'soon') {
    return (
      <>
        <div className="card-band" />
        <div className="card-body">
          <h2 className="card-title" id={titleId}>
            Tema {poster.number}
          </h2>
          <p className="card-description">Un altro mondo da interrogare, ancora da scegliere.</p>
          <div className="card-actions">{back}</div>
        </div>
      </>
    );
  }

  const { manifest, stats } = poster.theme;
  const ready = stats !== undefined && stats.exercises > 0;
  const rows = stats?.tables.reduce((sum, t) => sum + t.rows, 0) ?? 0;

  return (
    <>
      <div className="card-band" />
      <div className="card-body">
        <h2 className="card-title" id={titleId}>
          {manifest.title}
        </h2>
        <p className="card-description">{manifest.description}</p>
        {ready && stats ? (
          <>
            <section className="card-section" aria-label="Database">
              <p>
                <strong>{plural(stats.tables.length, 'tabella', 'tabelle')}</strong>, {plural(rows, 'riga', 'righe')}
              </p>
              <ul className="card-chips">
                {stats.tables.map((t) => (
                  <li key={t.name}>{t.name}</li>
                ))}
              </ul>
            </section>
            <section className="card-section" aria-label="Esercizi">
              <p>
                <strong>{plural(stats.exercises, 'esercizio', 'esercizi')}</strong> per difficoltà
              </p>
              <div className="difficulty-bar" aria-hidden="true">
                {DIFFICULTIES.filter((d) => stats.byDifficulty[d] > 0).map((d) => (
                  <span key={d} className={DIFFICULTY_CLASS[d]} style={{ flexGrow: stats.byDifficulty[d] }} />
                ))}
              </div>
              <p className="card-muted">
                {DIFFICULTIES.map((d) => `${stats.byDifficulty[d]} ${DIFFICULTY_PLURAL[d]}`).join(' · ')}
              </p>
              <ul className="card-chapters">
                {CHAPTERS.filter((c) => stats.byChapter[c] > 0).map((c) => (
                  <li key={c}>
                    {CHAPTER_SHORT[c]} <strong>{stats.byChapter[c]}</strong>
                  </li>
                ))}
              </ul>
            </section>
          </>
        ) : (
          <p className="card-muted">Tema in preparazione: database ed esercizi arrivano presto.</p>
        )}
        <div className="card-actions">
          {ready && (
            <a className="button primary" href={formatRoute({ page: 'theme', themeId: manifest.id, section: 'sandbox' })}>
              Entra <Icon name="circle-arrow-right" />
            </a>
          )}
          {back}
        </div>
      </div>
    </>
  );
}
