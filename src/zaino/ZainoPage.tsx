import { useEffect, useState, type FormEvent } from 'react';
import { Icon } from '../icons/Icon.tsx';
import { pointsLabel } from '../points/labels.ts';
import { formatRoute } from '../routing/route.ts';
import { balanceOf } from '../progress/progress.ts';
import { useThemeProgress } from '../progress/useProgress.ts';
import type { Theme } from '../themes/contract.ts';
import { useArea } from './area.ts';
import { formattaCodice } from './cifra.ts';
import { TESTI_APRI, ZAINO_DEL_LIBRO, testoStato } from './labels.ts';
import { apri, crea, esci, useCodiceZaino, useStatoZaino } from './sincronizza.ts';

type Messaggio = { tipo: 'ok' | 'errore'; testo: string } | null;

async function copia(testo: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(testo);
    return true;
  } catch {
    return false;
  }
}

/** Il codice (le parole, o un codice di prima a gruppi di quattro), con «Copia il codice». */
function BloccoCodice({ codice }: { codice: string }) {
  const [copiato, setCopiato] = useState<boolean | null>(null);
  return (
    <div className="zaino-codice-blocco">
      <p className="zaino-codice" translate="no" data-zaino-codice="">
        {formattaCodice(codice)}
      </p>
      <div className="toolbar">
        <button type="button" onClick={async () => setCopiato(await copia(formattaCodice(codice)))}>
          <Icon name="copy" />
          Copia il codice
        </button>
        <span role="status">
          {copiato === true && 'Codice copiato.'}
          {copiato === false && 'Non sono riuscito a copiare: selezionalo a mano.'}
        </span>
      </div>
    </div>
  );
}

function Apri() {
  const [scritto, setScritto] = useState('');
  const [temporaneo, setTemporaneo] = useState(false);
  const [occupato, setOccupato] = useState(false);
  const [messaggio, setMessaggio] = useState<Messaggio>(null);

  const invia = async (event: FormEvent) => {
    event.preventDefault();
    setOccupato(true);
    setMessaggio(null);
    try {
      const esito = await apri(scritto, { temporaneo });
      if (esito !== 'aperto') setMessaggio({ tipo: 'errore', testo: TESTI_APRI[esito] });
    } finally {
      setOccupato(false);
    }
  };

  return (
    <section className="zaino-scheda" aria-labelledby="zaino-apri">
      <h2 id="zaino-apri">Apri il tuo zaino</h2>
      <p>
        Hai già uno zaino, creato qui o nel libro? Scrivi le quattro parole del suo codice: di ogni parola bastano le prime quattro lettere,
        maiuscole e accenti non contano.
      </p>
      <form className="zaino-modulo" onSubmit={invia}>
        <label htmlFor="zaino-input">Codice dello zaino</label>
        <input
          id="zaino-input"
          type="text"
          className="zaino-input"
          value={scritto}
          onChange={(event) => setScritto(event.target.value)}
          placeholder="parola parola parola parola"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          translate="no"
        />
        <label className="zaino-casella">
          <input type="checkbox" checked={temporaneo} onChange={(event) => setTemporaneo(event.target.checked)} />
          <span>
            Non è il mio computer
            <span className="zaino-nota">
              Lo zaino resta aperto solo in questa scheda e sparisce quando la chiudi. I progressi già salvati in questo browser non si toccano.
            </span>
          </span>
        </label>
        <div className="toolbar">
          <button type="submit" className="primary" disabled={occupato || scritto.trim() === ''}>
            <Icon name="backpack" />
            {occupato ? 'Apro lo zaino…' : 'Apri lo zaino'}
          </button>
        </div>
      </form>
      <p role="status" className={messaggio?.tipo === 'errore' ? 'zaino-errore' : undefined}>
        {messaggio?.testo ?? ''}
      </p>
    </section>
  );
}

function Crea({ onCreato }: { onCreato: (codice: string) => void }) {
  const [occupato, setOccupato] = useState(false);
  const [errore, setErrore] = useState(false);

  const clic = async () => {
    setOccupato(true);
    setErrore(false);
    try {
      onCreato(await crea());
    } catch {
      setErrore(true);
    } finally {
      setOccupato(false);
    }
  };

  return (
    <section className="zaino-scheda" aria-labelledby="zaino-crea">
      <h2 id="zaino-crea">Crea uno zaino</h2>
      <p>
        Il sito sceglie a caso un codice di quattro parole, per esempio <span translate="no">volpe-faro-miele-trono</span>, e ci mette dentro i
        progressi che hai già in questo browser. Sugli altri dispositivi, e nel libro, apri lo zaino con quel codice.
      </p>
      <p className="zaino-avvertenza">
        Il codice non si può recuperare. Se lo perdi su tutti i dispositivi, lo zaino è perso: nemmeno chi gestisce il sito può aprirlo.
      </p>
      <div className="toolbar">
        <button type="button" onClick={clic} disabled={occupato}>
          <Icon name="backpack" />
          {occupato ? 'Creo lo zaino…' : 'Crea lo zaino'}
        </button>
      </div>
      <p role="status" className="zaino-errore">
        {errore ? 'Non sono riuscito a creare lo zaino. Riprova fra un po’.' : ''}
      </p>
    </section>
  );
}

function RigaTema({ theme }: { theme: Theme }) {
  const progress = useThemeProgress(theme.manifest.id);
  const risolti = Object.values(progress.exercises).filter((e) => e.solved).length;
  return (
    <li>
      {theme.manifest.title}: {risolti} {risolti === 1 ? 'esercizio risolto' : 'esercizi risolti'}, {pointsLabel(balanceOf(progress))}
    </li>
  );
}

/** Che cosa c’è nello zaino per ogni tema: esercizi risolti e saldo. */
function Contenuto({ themes }: { themes: Theme[] }) {
  return (
    <section className="zaino-scheda" aria-labelledby="zaino-dentro">
      <h2 id="zaino-dentro">Che cosa c’è nello zaino</h2>
      <ul data-zaino-contenuto="">
        {themes.map((theme) => (
          <RigaTema key={theme.manifest.id} theme={theme} />
        ))}
      </ul>
      <p className="zaino-nota">
        Nello zaino ci sono anche le note del libro, se ne hai, e, se partecipi alla
        <a href={formatRoute({ page: 'classifica' })}>classifica</a>, il codice con cui la classifica ti riconosce.
      </p>
    </section>
  );
}

function Collegato({ codice, codiceNuovo, themes }: { codice: string; codiceNuovo: string | null; themes: Theme[] }) {
  const stato = useStatoZaino();
  const temporanea = useArea() === 'session';
  const [mostra, setMostra] = useState(false);
  const [occupato, setOccupato] = useState(false);

  const faiEsci = async () => {
    const domanda = temporanea
      ? 'Uscire dallo zaino? I progressi di questa scheda spariscono da questo computer; nello zaino restano.'
      : 'Uscire dallo zaino? Codice e progressi spariscono da questo browser; nello zaino restano.';
    if (!window.confirm(domanda)) return;
    setOccupato(true);
    await esci();
    setOccupato(false);
  };

  return (
    <>
      {codiceNuovo && (
        <section className="zaino-scheda" aria-labelledby="zaino-nuovo">
          <h2 id="zaino-nuovo">Il codice del tuo zaino</h2>
          <p>
            Imparalo a memoria, scrivilo sul diario o mandalo a te stesso: ti serve per aprire lo zaino su un altro dispositivo e nel libro.
          </p>
          <BloccoCodice codice={codiceNuovo} />
        </section>
      )}

      <section className="zaino-scheda" aria-labelledby="zaino-stato">
        <h2 id="zaino-stato">{temporanea ? 'Zaino aperto in questa scheda' : 'Zaino collegato'}</h2>
        {temporanea && (
          <p>Computer non tuo: il codice non è salvato in questo browser e i progressi spariscono con la scheda. Per riaprire lo zaino ti serve il codice.</p>
        )}
        <p role="status" className="zaino-stato" data-zaino-stato={stato.fase} data-zaino-motivo={stato.motivo ?? undefined}>
          <Icon name={stato.fase === 'sincronizzato' && !stato.inSospeso ? 'circle-check' : stato.fase === 'errore' || stato.fase === 'offline' ? 'triangle-exclamation' : 'cloud-arrow-up'} />
          {testoStato(stato)}
        </p>
      </section>

      <Contenuto themes={themes} />

      {!temporanea && !codiceNuovo && (
        <section className="zaino-scheda" aria-labelledby="zaino-mostra">
          <h2 id="zaino-mostra">Il codice</h2>
          <p>Ti serve per aprire lo zaino su un altro dispositivo. Mostralo solo quando nessuno guarda lo schermo.</p>
          <div className="toolbar">
            <button type="button" aria-expanded={mostra} onClick={() => setMostra((m) => !m)}>
              <Icon name="key" />
              {mostra ? 'Nascondi il codice' : 'Mostra il codice'}
            </button>
          </div>
          {mostra && <BloccoCodice codice={codice} />}
        </section>
      )}

      <section className="zaino-scheda" aria-labelledby="zaino-esci">
        <h2 id="zaino-esci">Esci dallo zaino</h2>
        <p>
          Toglie da questo browser il codice e i progressi; nello zaino restano. Fallo sempre prima di lasciare un computer che non è tuo.
        </p>
        <div className="toolbar">
          <button type="button" onClick={faiEsci} disabled={occupato}>
            <Icon name="right-from-bracket" />
            Esci dallo zaino
          </button>
        </div>
        <p className="zaino-nota">
          Per cancellare lo zaino o cambiarne il codice usa la <a href={ZAINO_DEL_LIBRO}>pagina dello zaino nel libro</a>, con lo stesso codice.
        </p>
      </section>
    </>
  );
}

/** La pagina `#/zaino`: crea, apre, mostra lo stato dello zaino, ne esce. */
export function ZainoPage({ themes }: { themes: Theme[] }) {
  const stato = useStatoZaino();
  const codice = useCodiceZaino();
  // Il codice appena creato resta in vista finché non si lascia la pagina.
  const [codiceNuovo, setCodiceNuovo] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Zaino · SQL Academy';
  }, []);

  return (
    <main className="page zaino-page">
      <h1>
        <Icon name="backpack" />
        Zaino
      </h1>
      <p className="lead">
        Lo zaino porta i tuoi progressi da un dispositivo all’altro: esercizi risolti, punti, suggerimenti aperti e l’ultima query di ogni
        esercizio. È lo stesso zaino del libro <cite>Python Doesn’t Byte</cite>, e lo apri con lo stesso codice. Il contenuto è cifrato nel
        tuo browser: senza il codice nessuno può leggerlo. Che cosa contiene e dove si trova lo spiega l’
        <a href={formatRoute({ page: 'informativa' })}>informativa</a>.
      </p>
      {!stato.supportato ? (
        <p className="notice notice-warning">
          <Icon name="triangle-exclamation" />
          {TESTI_APRI['non-supportato']}
        </p>
      ) : codice ? (
        <Collegato codice={codice} codiceNuovo={codiceNuovo === codice ? codiceNuovo : null} themes={themes} />
      ) : (
        <div className="zaino-scelte">
          <Apri />
          <Crea onCreato={setCodiceNuovo} />
        </div>
      )}
    </main>
  );
}
