import { useEffect } from 'react';
import { Icon } from '../icons/Icon.tsx';
import { formatRoute } from '../routing/route.ts';

/** La privacy policy del libro: titolare, zaino, trasferimento dei dati tecnici. */
const PRIVACY_DEL_LIBRO = 'https://python.rainbowbits.cloud/legale/privacy-policy';

/** La pagina `#/informativa`: quali dati salva il portale, dove, per quanto tempo (F17). */
export function InformativaPage() {
  useEffect(() => {
    document.title = 'I tuoi dati · SQL Academy';
  }, []);

  return (
    <main className="page informativa-page">
      <a className="back-link" href="#/">
        <Icon name="circle-arrow-left" />
        Tutti i temi
      </a>
      <h1>
        <Icon name="shield-check" />I tuoi dati
      </h1>
      <p className="lead">
        SQL Academy non ti chiede nome, email né account. Questa pagina spiega quali dati salva il sito, dove li conserva, per quanto tempo e
        come toglierli.
      </p>

      <section className="zaino-scheda" aria-labelledby="dati-browser">
        <h2 id="dati-browser">Nel tuo browser</h2>
        <p>
          Ogni browser riserva a ciascun sito un piccolo archivio sul tuo dispositivo, chiamato <i lang="en">localStorage</i>: il sito lo
          usa per scrivere e leggere i dati che restano anche quando chiudi la pagina. In questo archivio SQL Academy salva i progressi di
          ogni tema: esercizi
          risolti, tentativi, suggerimenti e soluzioni aperti, punti guadagnati e spesi, l’ultima query scritta in ogni esercizio. Salva
          anche lo schema di colori scelto per ogni tema. Questi dati lasciano il dispositivo solo se usi lo zaino, descritto nella sezione
          successiva.
        </p>
        <p>
          Restano finché non azzeri i progressi di un tema, non esci dallo zaino o non cancelli i dati del sito dalle impostazioni del browser.
        </p>
      </section>

      <section className="zaino-scheda" aria-labelledby="dati-zaino">
        <h2 id="dati-zaino">Nello zaino</h2>
        <p>
          Lo <a href={formatRoute({ page: 'zaino' })}>zaino</a> è una copia dei tuoi progressi salvata su un servizio in rete, cioè un
          programma che funziona su un server e conserva i dati che riceve. Ti permette di ritrovare i progressi su un altro computer, per esempio
          a casa dopo una lezione in laboratorio. Lo zaino si apre con un codice di quattro parole,
          senza account. È lo stesso zaino del libro <cite>Python Doesn’t Byte</cite>, e usarlo è una tua scelta.
        </p>
        <p>
          Prima di mandare i progressi al servizio, il browser li cifra con il codice, cioè li trasforma in una sequenza di byte che si
          riporta in chiaro solo con quel codice: il servizio conserva il contenuto cifrato e non può leggerlo. Senza il codice non lo legge nessuno, nemmeno chi gestisce il sito. Se partecipi alla classifica, nello zaino c’è anche
          il codice con cui la classifica ti riconosce.
        </p>
        <p>
          Lo zaino resta finché non lo cancelli dalla pagina dello zaino nel libro; il servizio cancella da sé gli zaini non usati da 18 mesi.
          I dettagli sono nella <a href={PRIVACY_DEL_LIBRO}>
            <i lang="en">privacy policy</i> del libro
          </a>
          , la pagina che descrive come il libro tratta i dati.
        </p>
      </section>

      <section className="zaino-scheda" aria-labelledby="dati-classifica">
        <h2 id="dati-classifica">Nella classifica</h2>
        <p>
          La <a href={formatRoute({ page: 'classifica' })}>classifica</a> è una pagina pubblica che mette in ordine gli studenti per i punti
          guadagnati negli esercizi, in generale e tema per tema. In classifica compare solo chi sceglie di partecipare, attivando l’interruttore
          «Partecipa alla classifica»: finché non lo attivi, non compari. Per attivarlo serve lo zaino.
        </p>
        <p>
          Per riconoscerti senza sapere chi sei, il servizio della classifica usa un <i lang="en">token</i>: un codice casuale di 43 caratteri
          che il tuo browser crea quando entri in classifica e manda insieme a ogni aggiornamento dei punti. Se attivi «Partecipa alla
          classifica»:
        </p>
        <ul>
          <li>il servizio conserva solo un’impronta del token, cioè un valore calcolato dal token da cui non si può risalire al token stesso;</li>
          <li>
            al servizio arriva solo ciò che serve a calcolare i punti: per ogni esercizio, se l’hai risolto, quanti suggerimenti hai aperto, se
            hai visto la soluzione prima di risolverlo e quanti punti hai speso. Le query che scrivi restano a te;
          </li>
          <li>
            il servizio ti assegna un nome scelto a caso, per esempio «Lontra Tenace 42», che non si può cambiare, e conserva il nome, i punti
            di ogni tema e le date dell’iscrizione e dell’ultimo invio.
          </li>
        </ul>
        <p>
          Nome e punti sono <strong>pubblici</strong>: li vede chiunque apra la classifica. Dal nome nessuno può risalire a te, a meno che non
          sia tu a dirlo.
        </p>
        <p>
          Quando disattivi l’interruttore, il servizio cancella subito nome e punti. Se per 18 mesi non arrivano punti nuovi, li cancella da sé.
          «Esci dallo zaino» toglie il token solo da quel browser: nello zaino il token resta, e riaprendo lo zaino ritrovi lo stesso nome.
        </p>
      </section>

      <section className="zaino-scheda" aria-labelledby="dati-servizi">
        <h2 id="dati-servizi">Dove sono i servizi</h2>
        <p>
          I servizi dello zaino e della classifica sono ospitati da Cloudflare, un’azienda che offre server in affitto in tutto il mondo
          (i prodotti Workers e D1). Nessuno dei due
          servizi conserva registri delle richieste. Cloudflare usa l’indirizzo IP, il numero che identifica la tua connessione in rete, per
          consegnare le richieste; i due servizi lo usano solo per limitare quante richieste arrivano in un minuto e non lo salvano. Cloudflare
          è una società statunitense: come avviene il trasferimento dei dati tecnici lo spiega la{' '}
          <a href={PRIVACY_DEL_LIBRO}>privacy policy del libro</a>.
        </p>
        <p>
          Per domande o richieste sui tuoi dati scrivi a <a href="mailto:privacy@rainbowbits.cloud">privacy@rainbowbits.cloud</a>.
        </p>
      </section>
    </main>
  );
}
