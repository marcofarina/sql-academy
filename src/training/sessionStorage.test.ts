import { expect, test } from 'vitest';
import type { ActiveSession } from './SessionView.tsx';
import { clearAllSessions, loadSession, parseSession, saveSession, serializeSession } from './sessionStorage.ts';

const session: ActiveSession = {
  exerciseIds: ['a', 'b'], index: 1,
  records: { a: { attempts: 2, hints: 1, solutionSeen: false, solved: true } },
  baseline: { a: { earned: 0, spent: 0 }, b: { earned: 10, spent: 2 } }, finished: false,
};
const ids = ['a', 'b', 'c'];

test('conserva posizione, risultati e punti iniziali', () => {
  expect(parseSession(serializeSession(session, 3), 3, ids)).toEqual(session);
});

test('scarta versione sconosciuta, epoca diversa, esercizio rimosso e sessione finita', () => {
  expect(parseSession(JSON.stringify({ version: 2, epoch: 3, session }), 3, ids)).toBeUndefined();
  expect(parseSession(serializeSession(session, 3), 4, ids)).toBeUndefined();
  expect(parseSession(serializeSession(session, 3), 3, ['a'])).toBeUndefined();
  expect(parseSession(serializeSession({ ...session, finished: true }, 3), 3, ids)).toBeUndefined();
});

test('scarta dati corrotti e indici non validi', () => {
  expect(parseSession('{', 3, ids)).toBeUndefined();
  expect(parseSession(serializeSession({ ...session, index: 2 }, 3), 3, ids)).toBeUndefined();
  expect(parseSession(serializeSession({ ...session, baseline: {} }, 3), 3, ids)).toBeUndefined();
});

test('isola i temi e cancella sessioni concluse o abbandonate', () => {
  const data = new Map<string, string>();
  const storage = { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => data.set(k, v), removeItem: (k: string) => data.delete(k) } as unknown as Storage;
  saveSession(storage, 'star-wars', 3, session);
  expect(loadSession(storage, 'lotr', 3, ids)).toBeUndefined();
  expect(loadSession(storage, 'star-wars', 3, ids)).toEqual(session);
  saveSession(storage, 'star-wars', 3, { ...session, finished: true });
  expect(loadSession(storage, 'star-wars', 3, ids)).toBeUndefined();
  saveSession(storage, 'star-wars', 3, session);
  saveSession(storage, 'star-wars', 3);
  expect(data.size).toBe(0);
});

test('l’uscita dallo zaino cancella le sessioni di tutti i temi e nient’altro', () => {
  const data = new Map<string, string>([['sql-academy:star-wars:v2', '{}'], ['sql-academy:zaino', '{}']]);
  const storage = {
    get length() { return data.size; },
    key: (i: number) => [...data.keys()][i] ?? null,
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => data.set(k, v),
    removeItem: (k: string) => data.delete(k),
  } as unknown as Storage;
  saveSession(storage, 'star-wars', 0, session);
  saveSession(storage, 'lotr', 0, session);
  clearAllSessions(storage);
  expect([...data.keys()].sort()).toEqual(['sql-academy:star-wars:v2', 'sql-academy:zaino']);
});
