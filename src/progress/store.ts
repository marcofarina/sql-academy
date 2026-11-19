/**
 * L’archivio dei progressi di tutti i temi, condiviso fra l’interfaccia e lo
 * zaino (F15). Ogni lettura passa dall’area dello zaino (`src/zaino/area.ts`):
 * `localStorage` di solito, `sessionStorage` quando lo zaino è aperto con «Non
 * è il mio computer». Senza archivio (finestra privata, dati del sito bloccati)
 * i progressi vivono in memoria finché la pagina resta aperta.
 *
 * Due tipi di avviso:
 *
 * - `subscribeProgress`: qualunque cambiamento, per ridisegnare l’interfaccia
 *   (anche quelli arrivati dallo zaino o da un’altra scheda);
 * - `subscribeLocalChanges`: solo le modifiche fatte in questa pagina, per far
 *   partire la sincronizzazione dello zaino.
 */
import { storageDi, suCambioArea } from '../zaino/area.ts';
import { emptyProgress, parseProgress, progressKey, serializeProgress, type ThemeProgress } from './progress.ts';

const KEY_PATTERN = /^sql-academy:([a-z0-9]+(?:-[a-z0-9]+)*):v2$/;

const listeners = new Set<() => void>();
const localListeners = new Set<() => void>();
/** L’ultima lettura di ogni tema: lo stesso testo dà lo stesso oggetto, come vuole `useSyncExternalStore`. */
const cache = new Map<string, { text: string | null; progress: ThemeProgress }>();
/** I progressi quando l’archivio non c’è o rifiuta la scrittura. */
const memory = new Map<string, ThemeProgress>();
let watching = false;

function notify(local: boolean): void {
  for (const listener of listeners) listener();
  if (local) for (const listener of localListeners) listener();
}

function storedText(themeId: string): string | null | undefined {
  try {
    const storage = storageDi();
    return storage ? storage.getItem(progressKey(themeId)) : undefined;
  } catch {
    return undefined;
  }
}

/** I progressi di un tema nell’area corrente. */
export function readProgress(themeId: string): ThemeProgress {
  const remembered = memory.get(themeId);
  if (remembered) return remembered;
  const text = storedText(themeId);
  if (text === undefined) return emptyProgress();
  const cached = cache.get(themeId);
  if (cached && cached.text === text) return cached.progress;
  const progress = parseProgress(text);
  cache.set(themeId, { text, progress });
  return progress;
}

function write(themeId: string, progress: ThemeProgress): void {
  try {
    const storage = storageDi();
    if (!storage) throw new Error('archivio assente');
    storage.setItem(progressKey(themeId), serializeProgress(progress));
    memory.delete(themeId);
  } catch {
    memory.set(themeId, progress);
  }
}

/** Una modifica fatta dallo studente in questa pagina. */
export function updateProgress(themeId: string, change: (progress: ThemeProgress) => ThemeProgress): void {
  const current = readProgress(themeId);
  const next = change(current);
  if (next === current) return;
  write(themeId, next);
  notify(true);
}

/** Progressi arrivati dallo zaino: si scrivono senza far ripartire la sincronizzazione. */
export function replaceProgress(themeId: string, progress: ThemeProgress): void {
  write(themeId, progress);
  notify(false);
}

/** I temi che hanno progressi nell’area corrente (anche temi che questa versione del portale non conosce). */
export function storedThemeIds(): string[] {
  const ids = new Set(memory.keys());
  try {
    const storage = storageDi();
    for (let i = 0; storage && i < storage.length; i += 1) {
      const match = storage.key(i)?.match(KEY_PATTERN);
      if (match) ids.add(match[1]);
    }
  } catch {
    // Archivio non raggiungibile: restano i progressi in memoria.
  }
  return [...ids].sort();
}

/** Toglie dall’area corrente i progressi di tutti i temi («Esci dallo zaino»). */
export function clearAllProgress(): void {
  const ids = storedThemeIds();
  memory.clear();
  try {
    const storage = storageDi();
    for (const id of ids) storage?.removeItem(progressKey(id));
  } catch {
    // Archivio non raggiungibile: non c’è nulla da togliere.
  }
  notify(false);
}

function watch(): void {
  if (watching || typeof window === 'undefined') return;
  watching = true;
  // Un’altra scheda ha cambiato i progressi; un cambio d’area li sostituisce tutti.
  window.addEventListener('storage', (event) => {
    if (event.key === null || KEY_PATTERN.test(event.key)) notify(false);
  });
  suCambioArea(
    () => undefined,
    () => {
      memory.clear();
      notify(false);
    },
  );
}

export function subscribeProgress(listener: () => void): () => void {
  watch();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function subscribeLocalChanges(listener: () => void): () => void {
  localListeners.add(listener);
  return () => localListeners.delete(listener);
}
