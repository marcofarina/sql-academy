/**
 * La sessione di esercizi in corso, salvata nel browser per tema (F06 del
 * piano `portale-v2`), nella chiave `sql-academy:<tema>:sessione` dell’area
 * corrente (`src/zaino/area.ts`). È separata dai progressi: il loro formato
 * non cambia e lo zaino, che raccoglie solo le chiavi `:v2`, non la porta su
 * altri dispositivi.
 *
 *   { "version": 1, "epoch": 0, "session": { "exerciseIds": […], "index": 2, … } }
 *
 * Un ripasso (F12) è una sessione con `"review": true`, e i suoi record hanno
 * l’esito `review`; una consegna del docente (F14) è una sessione con
 * `"consegna": { "code": "1.3.17", "title": "…" }`. Le sessioni salvate prima
 * restano valide.
 *
 * Una sessione di un’altra epoca dei progressi, con esercizi che il tema non
 * ha più o comunque illeggibile si scarta senza errori.
 */
import { useSyncExternalStore } from 'react';
import { decodeConsegna, TITOLO_MAX } from '../consegna/consegna.ts';
import type { ActiveSession, SessionRecord } from './SessionView.tsx';

const SESSION_VERSION = 1;
const KEY_PATTERN = /^sql-academy:[a-z0-9]+(?:-[a-z0-9]+)*:sessione$/;

const key = (themeId: string) => `sql-academy:${themeId}:sessione`;
const object = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const count = (value: unknown): value is number => Number.isSafeInteger(value) && (value as number) >= 0;

/** Il campo `consegna` di una sessione salvata: assente, oppure codice leggibile e titolo facoltativo. */
function consegnaOf(value: unknown): ActiveSession['consegna'] | null | undefined {
  if (value === undefined) return undefined;
  if (!object(value) || typeof value.code !== 'string' || !decodeConsegna(value.code)) return null;
  if (value.title === undefined) return { code: value.code };
  if (typeof value.title !== 'string' || value.title.length > TITOLO_MAX) return null;
  return { code: value.code, title: value.title };
}

/** Testo da salvare per la sessione, legata all’epoca dei progressi in cui è nata. */
export function serializeSession(session: ActiveSession, epoch: number): string {
  return JSON.stringify({ version: SESSION_VERSION, epoch, session });
}

/**
 * Legge una sessione salvata. `undefined` se manca, se è illeggibile, se è
 * finita, se è di un’altra epoca o se usa esercizi che non sono in `exerciseIds`.
 */
export function parseSession(text: string | null, epoch: number, exerciseIds: string[]): ActiveSession | undefined {
  try {
    const data: unknown = JSON.parse(text ?? 'null');
    if (!object(data) || data.version !== SESSION_VERSION || data.epoch !== epoch || !object(data.session)) {
      return undefined;
    }
    const s = data.session;
    const consegna = consegnaOf(s.consegna);
    if (
      consegna === null ||
      (consegna !== undefined && s.review !== undefined) ||
      !Array.isArray(s.exerciseIds) ||
      s.exerciseIds.length === 0 ||
      !s.exerciseIds.every((id) => typeof id === 'string' && exerciseIds.includes(id)) ||
      new Set(s.exerciseIds).size !== s.exerciseIds.length ||
      !count(s.index) ||
      s.index >= s.exerciseIds.length ||
      s.finished !== false ||
      !object(s.records) ||
      !object(s.baseline) ||
      (s.review !== undefined && s.review !== true)
    ) {
      return undefined;
    }
    const ids = s.exerciseIds as string[];
    if (Object.keys(s.records).some((id) => !ids.includes(id)) || Object.keys(s.baseline).length !== ids.length) {
      return undefined;
    }
    for (const id of ids) {
      const baseline = s.baseline[id];
      if (!object(baseline) || !count(baseline.earned) || !count(baseline.spent)) return undefined;
      const record: unknown = s.records[id];
      if (
        record !== undefined &&
        (!object(record) ||
          !count(record.attempts) ||
          !count(record.hints) ||
          typeof record.solved !== 'boolean' ||
          typeof record.solutionSeen !== 'boolean' ||
          (record.review !== undefined && record.review !== 'riuscito' && record.review !== 'fallito'))
      ) {
        return undefined;
      }
    }
    return {
      exerciseIds: ids,
      index: s.index,
      records: s.records as Record<string, SessionRecord>,
      baseline: s.baseline as ActiveSession['baseline'],
      finished: false,
      ...(s.review === true ? { review: true as const } : {}),
      ...(consegna ? { consegna } : {}),
    };
  } catch {
    return undefined;
  }
}

/** Legge la sessione salvata del tema; una sessione da scartare si cancella. */
export function loadSession(
  storage: Storage | null,
  themeId: string,
  epoch: number,
  ids: string[],
): ActiveSession | undefined {
  try {
    const text = storage?.getItem(key(themeId)) ?? null;
    const session = parseSession(text, epoch, ids);
    if (text !== null && !session) storage?.removeItem(key(themeId));
    return session;
  } catch {
    return undefined;
  }
}

/** Salva la sessione del tema; senza sessione, o con una sessione finita, la cancella. */
export function saveSession(storage: Storage | null, themeId: string, epoch: number, session?: ActiveSession): void {
  try {
    if (!session || session.finished) storage?.removeItem(key(themeId));
    else storage?.setItem(key(themeId), serializeSession(session, epoch));
  } catch {
    // Archivio non raggiungibile: la sessione resta in memoria finché il tema è aperto.
  }
}

let cleared = 0;
const listeners = new Set<() => void>();

/**
 * Cancella le sessioni di tutti i temi da `storage` e avvisa chi ne tiene una
 * in memoria («Esci dallo zaino»: i progressi spariscono, le sessioni con loro).
 */
export function clearAllSessions(storage: Storage | null): void {
  try {
    const keys: string[] = [];
    for (let i = 0; storage && i < storage.length; i += 1) {
      const name = storage.key(i);
      if (name && KEY_PATTERN.test(name)) keys.push(name);
    }
    for (const name of keys) storage?.removeItem(name);
  } catch {
    // Archivio non raggiungibile: non c’è nulla da togliere.
  }
  cleared += 1;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Quante volte le sessioni sono state cancellate in questa pagina: cambia a ogni `clearAllSessions`. */
export function useSessionsCleared(): number {
  return useSyncExternalStore(subscribe, () => cleared, () => 0);
}
