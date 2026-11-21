import type { ActiveSession, SessionRecord } from './SessionView.tsx';

const key = (themeId: string) => `sql-academy:${themeId}:sessione`;
const object = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const count = (value: unknown): value is number => Number.isSafeInteger(value) && (value as number) >= 0;

export function serializeSession(session: ActiveSession, epoch: number): string {
  return JSON.stringify({ version: 1, epoch, session });
}

export function parseSession(text: string | null, epoch: number, exerciseIds: string[]): ActiveSession | undefined {
  try {
    const data: unknown = JSON.parse(text ?? 'null');
    if (!object(data) || data.version !== 1 || data.epoch !== epoch || !object(data.session)) return undefined;
    const s = data.session;
    if (!Array.isArray(s.exerciseIds) || s.exerciseIds.length === 0 ||
        !s.exerciseIds.every((id) => typeof id === 'string' && exerciseIds.includes(id)) ||
        new Set(s.exerciseIds).size !== s.exerciseIds.length || !count(s.index) || s.index >= s.exerciseIds.length ||
        s.finished !== false || !object(s.records) || !object(s.baseline)) return undefined;
    const ids = s.exerciseIds as string[];
    if (Object.keys(s.records).some((id) => !ids.includes(id)) || Object.keys(s.baseline).length !== ids.length) return undefined;
    for (const id of ids) {
      const baseline = s.baseline[id];
      if (!object(baseline) || !count(baseline.earned) || !count(baseline.spent)) return undefined;
      const record: unknown = s.records[id];
      if (record !== undefined && (!object(record) || !count(record.attempts) || !count(record.hints) ||
          typeof record.solved !== 'boolean' || typeof record.solutionSeen !== 'boolean')) return undefined;
    }
    return { exerciseIds: ids, index: s.index, records: s.records as Record<string, SessionRecord>, baseline: s.baseline as ActiveSession['baseline'], finished: false };
  } catch {
    return undefined;
  }
}

export function loadSession(storage: Storage | null, themeId: string, epoch: number, ids: string[]): ActiveSession | undefined {
  try {
    const text = storage?.getItem(key(themeId)) ?? null;
    const session = parseSession(text, epoch, ids);
    if (text !== null && !session) storage?.removeItem(key(themeId));
    return session;
  } catch { return undefined; }
}

export function saveSession(storage: Storage | null, themeId: string, epoch: number, session?: ActiveSession): void {
  try {
    if (!session || session.finished) storage?.removeItem(key(themeId));
    else storage?.setItem(key(themeId), serializeSession(session, epoch));
  } catch { /* La sessione resta disponibile in memoria. */ }
}
