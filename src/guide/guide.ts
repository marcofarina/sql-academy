/**
 * Memoria «guida già vista» (F16 del piano `portale-v2`): un segno per tutto il
 * sito, `sql-academy:guida` = `1`, nell’area corrente dello zaino
 * (`src/zaino/area.ts`). Non va nello zaino. Lo cancellano «Azzera i
 * progressi» di qualunque tema ed «Esci dallo zaino» (decisione «Dati nel
 * browser» del piano): dopo, la guida ricompare al primo ingresso in un tema.
 */
import { storageDi } from '../zaino/area.ts';

export const GUIDE_KEY = 'sql-academy:guida';

/** true se lo studente ha già chiuso la guida su questo dispositivo. */
export function guideSeen(storage: Storage | null = storageDi()): boolean {
  try {
    return storage?.getItem(GUIDE_KEY) === '1';
  } catch {
    return false;
  }
}

/** Ricorda che la guida è stata chiusa. */
export function markGuideSeen(storage: Storage | null = storageDi()): void {
  try {
    storage?.setItem(GUIDE_KEY, '1');
  } catch {
    // Archivio non raggiungibile: la guida ricomparirà al prossimo ingresso.
  }
}

/** Dimentica la guida già vista: ricompare al prossimo ingresso in un tema. */
export function clearGuide(storage: Storage | null = storageDi()): void {
  try {
    storage?.removeItem(GUIDE_KEY);
  } catch {
    // Archivio non raggiungibile: non c’è nulla da togliere.
  }
}
