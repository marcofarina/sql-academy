/** Carica il tabellone e le posizioni senza perdere i risultati già letti. */
import { useEffect, useState } from 'react';
import type { Theme } from '../themes/contract.ts';
import { indirizzoClassifica } from './invio.ts';
import { leggiClassifica, leggiPosizione, type Posizione, type Voce } from './servizio.ts';

const RILETTURA = 60_000;

interface Tabellone {
  voci?: Voce[];
  riprova?: number;
}

/** Legge tutte le posizioni all’ingresso e dopo un invio, poi aggiorna la vista aperta ogni minuto. */
export function useDatiClassifica(themes: Theme[], vista: string | null, gettone: string | null, versione: number) {
  const [tabelloni, setTabelloni] = useState<Record<string, Tabellone>>({});
  const [personali, setPersonali] = useState<{ gettone: string; posizioni: Record<string, Posizione> } | null>(null);

  useEffect(() => {
    if (!gettone) return;
    const controller = new AbortController();
    const fetchPosizione: typeof fetch = (url, opzioni) => fetch(url, { ...opzioni, signal: controller.signal });
    for (const tema of [null, ...themes.map((theme) => theme.manifest.id)]) {
      void leggiPosizione(fetchPosizione, indirizzoClassifica(), gettone, tema).then((esito) => {
        if (controller.signal.aborted || esito.tipo !== 'ok') return;
        setPersonali((prima) => ({
          gettone,
          posizioni: { ...(prima?.gettone === gettone ? prima.posizioni : {}), [tema ?? '']: esito.dati },
        }));
      });
    }
    return () => controller.abort();
  }, [themes, gettone, versione]);

  useEffect(() => {
    const base = indirizzoClassifica();
    let controller: AbortController;
    const chiave = vista ?? '';

    function aggiorna(anchePosizione: boolean) {
      controller?.abort();
      controller = new AbortController();
      const { signal } = controller;
      const richiesta: typeof fetch = (url, opzioni) => fetch(url, { ...opzioni, signal });
      const riprova = Date.now() + RILETTURA;
      void leggiClassifica(richiesta, base, vista, gettone !== null).then((esito) => {
        if (signal.aborted) return;
        setTabelloni((prima) => ({
          ...prima,
          [chiave]: esito.tipo === 'ok' ? { voci: esito.dati } : { voci: prima[chiave]?.voci, riprova },
        }));
      });
      if (gettone && anchePosizione) {
        void leggiPosizione(richiesta, base, gettone, vista).then((esito) => {
          if (signal.aborted || esito.tipo !== 'ok') return;
          setPersonali((prima) => ({
            gettone,
            posizioni: { ...(prima?.gettone === gettone ? prima.posizioni : {}), [chiave]: esito.dati },
          }));
        });
      }
    }

    aggiorna(false);
    const timer = setInterval(() => aggiorna(true), RILETTURA);
    return () => {
      clearInterval(timer);
      controller.abort();
    };
  }, [vista, gettone, versione]);

  return {
    tabellone: tabelloni[vista ?? ''],
    posizioni: gettone && personali?.gettone === gettone ? personali.posizioni : {},
  };
}
