/**
 * L’invio dei punti alla classifica (F17).
 *
 * Quando cambiano i progressi o l’adesione, il controllore aspetta
 * `RITARDO` e invia i progressi di tutti i temi, se sono diversi dall’ultimo
 * invio riuscito: scrivere una query non cambia nulla di ciò che si invia,
 * quindi non parte nessuna richiesta a ogni tasto. Gli errori non bloccano il
 * lavoro: senza rete o con il servizio fermo si riprova con attese crescenti;
 * con 429 dopo `Retry-After`. Con 422 il servizio respinge tutto l’invio per
 * colpa di un tema (il motivo comincia con il suo `id`): quel tema resta fuori
 * finché i suoi progressi non cambiano, e gli altri si inviano subito.
 * Il caso noto è quello di F16: due aiuti gratuiti nello stesso tema, usati su
 * due dispositivi prima di sincronizzarli.
 *
 * Si partecipa solo con lo zaino aperto: `partecipa` lo controlla, e
 * l’adesione sparisce da questo browser con «Esci dallo zaino».
 */
import { useSyncExternalStore } from 'react';
import { readProgress, storedThemeIds, subscribeProgress } from '../progress/store.ts';
import { canonico } from '../zaino/sezioni.ts';
import { codiceZaino } from '../zaino/sincronizza.ts';
import { cambiaAdesione, iscrivitiAdesione, leggiAdesione, nuovoGettone } from './adesione.ts';
import { cancellaPunteggio, inviaPunteggio, progressiDaInviare, type Fetch, type ProgressiInviati } from './servizio.ts';

export const RITARDO = 5000;
export const ATTESE = [30_000, 60_000, 120_000, 300_000, 900_000];

/**
 * - `spenta`: questo browser non partecipa;
 * - `invio`: una richiesta è in corso o sta per partire;
 * - `aggiornata`: il servizio ha i progressi di adesso;
 * - `in-attesa`: il servizio ha chiesto di aspettare (429); `riprova` dice quando;
 * - `respinta`: il servizio ha respinto i progressi (422) senza dire di quale tema; `motivo` dice perché;
 * - `irraggiungibile`: rete o servizio fermi; `riprova` dice quando.
 */
export type FaseClassifica = 'spenta' | 'invio' | 'aggiornata' | 'in-attesa' | 'respinta' | 'irraggiungibile';

export interface StatoClassifica {
  fase: FaseClassifica;
  /** Il nome assegnato dal servizio, noto dopo il primo invio riuscito. */
  nome: string | null;
  motivo: string | null;
  /** I temi lasciati fuori perché il servizio li ha respinti, con il motivo. */
  respinti: Record<string, string>;
  /** Millisecondi dal 1970 del prossimo tentativo. */
  riprova: number | null;
  /** Cresce a ogni invio riuscito: la pagina rilegge la classifica. */
  versione: number;
}

export type EsitoScelta = 'ok' | 'senza-zaino' | 'irraggiungibile' | 'respinta';

export interface Dipendenze {
  base: string;
  fetch: Fetch;
  /** I temi che il servizio conosce: gli altri non si inviano. */
  temi: string[];
  /** Lo zaino è aperto in questo browser. */
  zainoAperto: () => boolean;
  ora?: () => number;
}

const SPENTA: StatoClassifica = { fase: 'spenta', nome: null, motivo: null, respinti: {}, riprova: null, versione: 0 };

/** Il tema di un motivo del servizio («star-wars/ex-001: …», «lotr: …»), se è fra quelli dati. */
export function temaDelMotivo(motivo: string, temi: string[]): string | null {
  const id = motivo.match(/^([a-z0-9-]+)[/:]/)?.[1];
  return id && temi.includes(id) ? id : null;
}

export function attesaDopo(tentativi: number): number {
  return ATTESE[Math.min(tentativi, ATTESE.length) - 1] ?? ATTESE[0];
}

export function creaControllore(d: Dipendenze) {
  const ora = d.ora ?? Date.now;
  const ascoltatori = new Set<() => void>();
  let stato = SPENTA;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let inCorso: Promise<void> | null = null;
  let ancora = false;
  let tentativi = 0;
  /** Il gettone e il corpo dell’ultimo invio riuscito, o respinto: si rimanda solo un corpo diverso. */
  let ultimo: { gettone: string; corpo: string } | null = null;
  /** Il gettone che questo controllore ha visto per ultimo: se un altro dispositivo lo sostituisce, il vecchio esce. */
  let visto: string | null = null;
  /** Temi respinti dal servizio, con i progressi che aveva respinto: fuori finché non cambiano. */
  const esclusi = new Map<string, { corpo: string; motivo: string }>();
  const smetti: (() => void)[] = [];

  function cambia(cambi: Partial<StatoClassifica>): void {
    const nuovo = { ...stato, ...cambi };
    if (canonico(nuovo) === canonico(stato)) return;
    stato = nuovo;
    for (const f of ascoltatori) f();
  }

  function corpo(): Record<string, ProgressiInviati> {
    const noti = new Set(d.temi);
    const temi: Record<string, ProgressiInviati> = {};
    for (const id of storedThemeIds()) {
      if (!noti.has(id)) continue;
      const progressi = progressiDaInviare(readProgress(id));
      const escluso = esclusi.get(id);
      if (escluso && escluso.corpo === canonico(progressi)) continue;
      esclusi.delete(id);
      temi[id] = progressi;
    }
    return temi;
  }

  const respinti = () => Object.fromEntries([...esclusi].map(([id, e]) => [id, e.motivo]));

  function programma(ms: number): void {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      void ciclo();
    }, ms);
  }

  async function passo(): Promise<void> {
    const { gettone } = leggiAdesione();
    if (visto && gettone && visto !== gettone) {
      // Un altro dispositivo ha scelto un gettone diverso e lo zaino l’ha portato qui:
      // il vecchio esce dalla classifica, se si può. Altrimenti lo cancella il servizio fra 18 mesi.
      void cancellaPunteggio(d.fetch, d.base, visto);
    }
    visto = gettone;
    if (!gettone) {
      ultimo = null;
      esclusi.clear();
      tentativi = 0;
      cambia({ ...SPENTA, versione: stato.versione });
      return;
    }
    const temi = corpo();
    const testo = canonico(temi);
    if (ultimo?.gettone === gettone && ultimo.corpo === testo) {
      cambia({ respinti: respinti() });
      return;
    }
    cambia({ fase: 'invio', riprova: null });
    const esito = await inviaPunteggio(d.fetch, d.base, gettone, temi);
    if (leggiAdesione().gettone !== gettone) return; // scelta cambiata durante l’invio: ci pensa il prossimo ciclo
    switch (esito.tipo) {
      case 'ok':
        tentativi = 0;
        ultimo = { gettone, corpo: testo };
        cambia({ fase: 'aggiornata', nome: esito.dati.name, motivo: null, respinti: respinti(), riprova: null, versione: stato.versione + 1 });
        return;
      case 'respinta': {
        tentativi = 0;
        const tema = temaDelMotivo(esito.motivo, Object.keys(temi));
        if (tema) {
          esclusi.set(tema, { corpo: canonico(temi[tema]), motivo: esito.motivo });
          ancora = true; // gli altri temi partono subito
          return;
        }
        ultimo = { gettone, corpo: testo };
        cambia({ fase: 'respinta', motivo: esito.motivo, riprova: null });
        return;
      }
      case 'attendi': {
        const ms = esito.secondi * 1000;
        cambia({ fase: 'in-attesa', riprova: ora() + ms });
        programma(ms);
        return;
      }
      default: {
        // `sconosciuto` non dovrebbe capitare (PUT iscrive sempre): si tratta come un guasto.
        tentativi += 1;
        const ms = attesaDopo(tentativi);
        cambia({ fase: 'irraggiungibile', riprova: ora() + ms });
        programma(ms);
      }
    }
  }

  /** Un ciclo alla volta; se ne arriva un altro durante, si ripete alla fine. */
  function ciclo(): Promise<void> {
    if (inCorso) {
      ancora = true;
      return inCorso;
    }
    inCorso = (async () => {
      do {
        ancora = false;
        await passo();
      } while (ancora);
    })().finally(() => {
      inCorso = null;
    });
    return inCorso;
  }

  function suCambio(): void {
    // Un tentativo già programmato per 429 o guasto resta: non si anticipa.
    if (stato.fase === 'in-attesa' || stato.fase === 'irraggiungibile') return;
    programma(RITARDO);
  }

  return {
    avvia(): void {
      smetti.push(subscribeProgress(suCambio), iscrivitiAdesione(() => programma(0)));
      void ciclo();
    },
    ferma(): void {
      smetti.splice(0).forEach((f) => f());
      if (timer) clearTimeout(timer);
      timer = null;
    },
    leggi: () => stato,
    iscriviti(f: () => void): () => void {
      ascoltatori.add(f);
      return () => ascoltatori.delete(f);
    },
    /** Attende la fine dell’invio in corso o programmato adesso (per i test). */
    async adesso(): Promise<void> {
      if (timer) clearTimeout(timer);
      timer = null;
      await ciclo();
    },
    /** Entra in classifica: iscrizione senza punti, poi i progressi al ciclo successivo. */
    async partecipa(): Promise<EsitoScelta> {
      if (!d.zainoAperto()) return 'senza-zaino';
      if (leggiAdesione().gettone) return 'ok';
      const gettone = nuovoGettone();
      // L’iscrizione senza temi non supera mai la crescita ammessa: chi ha già molti
      // punti entra subito con un nome e li vede arrivare negli invii successivi.
      const esito = await inviaPunteggio(d.fetch, d.base, gettone, {});
      if (esito.tipo !== 'ok') return esito.tipo === 'respinta' ? 'respinta' : 'irraggiungibile';
      visto = gettone;
      cambiaAdesione(gettone, ora());
      cambia({ fase: 'invio', nome: esito.dati.name, motivo: null, riprova: null });
      return 'ok';
    },
    /** Esce dalla classifica: prima il servizio cancella la riga, poi cambia la scelta. */
    async smetti(): Promise<EsitoScelta> {
      const { gettone } = leggiAdesione();
      if (!gettone) return 'ok';
      const esito = await cancellaPunteggio(d.fetch, d.base, gettone);
      if (esito.tipo === 'irraggiungibile') return 'irraggiungibile';
      visto = null;
      cambiaAdesione(null, ora());
      return 'ok';
    },
  };
}

export type Controllore = ReturnType<typeof creaControllore>;

/* ------------------------------------------------- istanza del portale */

let controllore: Controllore | null = null;
let base = '';

const STATO_SERVER = SPENTA;

/** Avvia l’invio in questa scheda: una volta sola, da `src/main.tsx`, dopo lo zaino. */
export function avviaClassifica(url: string, temi: string[]): void {
  if (controllore || typeof window === 'undefined') return;
  base = url.replace(/\/$/, '');
  controllore = creaControllore({ base, fetch: (...a) => fetch(...a), temi, zainoAperto: () => codiceZaino() !== null });
  controllore.avvia();
}

export function indirizzoClassifica(): string {
  return base;
}

export function partecipa(): Promise<EsitoScelta> {
  return controllore ? controllore.partecipa() : Promise.resolve('irraggiungibile');
}

export function smettiDiPartecipare(): Promise<EsitoScelta> {
  return controllore ? controllore.smetti() : Promise.resolve('irraggiungibile');
}

const iscrivitiStato = (f: () => void) => controllore?.iscriviti(f) ?? (() => undefined);
const leggiStato = () => controllore?.leggi() ?? STATO_SERVER;

export function useStatoClassifica(): StatoClassifica {
  return useSyncExternalStore(iscrivitiStato, leggiStato, () => STATO_SERVER);
}
