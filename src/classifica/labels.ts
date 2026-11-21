/**
 * Testi dell’interfaccia della classifica (F17). Funzioni pure.
 */
import type { EsitoScelta, StatoClassifica } from './invio.ts';

function ora(ms: number | null): string {
  if (ms === null) return '';
  return new Date(ms).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
}

/** Il motivo di un rifiuto del servizio, detto allo studente. */
export function testoRifiuto(motivo: string, titolo: string): string {
  if (motivo.includes('più di un aiuto gratuito')) {
    return `${titolo}: risultano due aiuti gratuiti, forse usati su due dispositivi prima che lo zaino li unisse. Per riportare il tema in classifica azzeralo dal percorso dell’addestramento.`;
  }
  if (motivo.includes('esercizio sconosciuto')) {
    return `${titolo}: i tuoi progressi contengono un esercizio che la classifica non conosce ancora. Riprovo quando cambiano.`;
  }
  return `${titolo}: la classifica non accetta questi progressi (${motivo}). Riprovo quando cambiano.`;
}

/** Lo stato dell’invio in una frase; null se non si partecipa. */
export function testoStato(s: StatoClassifica): string | null {
  switch (s.fase) {
    case 'spenta':
      return null;
    case 'invio':
      return 'Invio i tuoi punti alla classifica…';
    case 'aggiornata':
      return s.ultima === null ? 'La classifica è aggiornata con i tuoi punti.' : `Classifica aggiornata alle ${ora(s.ultima)}.`;
    case 'in-attesa':
      return `La classifica accetta i punti nuovi un po’ alla volta: i tuoi arrivano alle ${ora(s.riprova)}.`;
    case 'respinta':
      return `La classifica non accetta i tuoi progressi (${s.motivo ?? 'motivo sconosciuto'}). Riprovo quando cambiano.`;
    case 'irraggiungibile':
      return `La classifica non risponde: riprovo alle ${ora(s.riprova)}. Esercizi, punti e zaino funzionano lo stesso.`;
  }
}

export const TESTI_SCELTA: Record<Exclude<EsitoScelta, 'ok'>, string> = {
  'senza-zaino': 'Per partecipare devi prima aprire lo zaino.',
  irraggiungibile: 'Non riesco a raggiungere la classifica. Riprova fra un po’.',
  respinta: 'La classifica non accetta l’iscrizione. Riprova fra un po’.',
  attendi: 'La classifica ha ricevuto troppe richieste. Riprova fra un po’.',
};

