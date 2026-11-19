/**
 * Testi dell’interfaccia dello zaino (F15), ripresi dalla pagina `/zaino` del
 * libro e adattati ai progressi del portale. Funzioni pure.
 */
import type { EsitoApri, StatoZaino } from './sincronizza.ts';

/** La pagina dello zaino nel libro: lì si cancella lo zaino e si cambia il codice. */
export const ZAINO_DEL_LIBRO = 'https://python.rainbowbits.cloud/zaino';

export const TESTI_APRI: Record<Exclude<EsitoApri, 'aperto'>, string> = {
  'non-supportato': 'Questo browser non sa aprire lo zaino: serve una connessione https.',
  'gia-collegato': 'Questo browser ha già uno zaino aperto.',
  'codice-non-valido':
    'Il codice non è scritto bene: sono quattro parole, separate da spazi o trattini, e di ogni parola bastano le prime quattro lettere. I codici degli zaini più vecchi sono invece 20 caratteri, fra lettere e numeri.',
  inesistente: 'Non trovo nessuno zaino con questo codice. Controlla di averlo scritto giusto.',
  offline: 'Non riesco a raggiungere il servizio: controlla la rete.',
  servizio: 'Il servizio dello zaino non risponde. Riprova fra un po’.',
  illeggibile: 'Lo zaino c’è, ma questo codice non lo apre.',
  aggiorna: 'Questo zaino l’ha scritto una versione più recente del sito: ricarica la pagina e riprova.',
};

function ora(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
}

/** Lo stato dello zaino in una frase; null se lo zaino non è collegato. */
export function testoStato(s: StatoZaino): string | null {
  if (s.fase === 'scollegato') return null;
  if (s.fase === 'in-corso') return 'Sincronizzo lo zaino…';
  if (s.fase === 'offline') return 'Sei senza rete: i progressi restano qui e partono nello zaino appena torna.';
  if (s.fase === 'errore') {
    switch (s.motivo) {
      case 'pieno':
        return 'Lo zaino è pieno. Fai spazio dal libro: scarica il quaderno e cancella le annotazioni che non ti servono più.';
      case 'cancellato':
        return 'Questo zaino non esiste più sul servizio. Esci dallo zaino, oppure creane uno nuovo.';
      case 'aggiorna':
        return 'Lo zaino l’ha scritto una versione più recente del sito: ricarica la pagina.';
      case 'illeggibile':
        return 'Il codice non apre questo zaino. Esci dallo zaino e riprova con il codice giusto.';
      default:
        return 'Il servizio dello zaino non risponde: riprovo tra poco. I progressi restano qui.';
    }
  }
  const quando = ora(s.ultima);
  const base = quando ? `Zaino sincronizzato alle ${quando}.` : 'Zaino collegato.';
  return s.inSospeso ? `${base} Alcune modifiche partono fra poco.` : base;
}

/** Lo zaino ha bisogno di attenzione: senza rete o in errore. */
export function haProblemi(s: StatoZaino): boolean {
  return s.fase === 'offline' || s.fase === 'errore';
}
