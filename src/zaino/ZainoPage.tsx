/** Apertura, creazione e gestione dello zaino dalla pagina del portale. */
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from 'react';
import { Icon } from '../icons/Icon.tsx';
import { usePortalCompatto } from '../pages/usePortalCompatto.ts';
import { pointsLabel } from '../points/labels.ts';
import { balanceOf, type ThemeProgress } from '../progress/progress.ts';
import { readProgress, subscribeProgress } from '../progress/store.ts';
import { useThemeProgress } from '../progress/useProgress.ts';
import { formatRoute } from '../routing/route.ts';
import type { Theme } from '../themes/contract.ts';
import { MondoPallino } from '../themes/MondoPallino.tsx';
import { useArea } from './area.ts';
import { BloccoCodice } from './BloccoCodice.tsx';
import { CampiCodice } from './CampiCodice.tsx';
import { CreazioneZaino } from './CreazioneZaino.tsx';
import { TESTI_APRI, ZAINO_DEL_LIBRO, statoPillola, testoStato } from './labels.ts';
import { ZainoMark } from './ZainoMark.tsx';
import { apri, esci, useCodiceZaino, useStatoZaino } from './sincronizza.ts';
import './zainoPage.css';

function Apri() {
  const [parole, setParole] = useState(['', '', '', '']);
  const [vecchio, setVecchio] = useState(false);
  const [scritto, setScritto] = useState('');
  const [temporaneo, setTemporaneo] = useState(false);
  const [occupato, setOccupato] = useState(false);
  const [errore, setErrore] = useState('');
  const modulo = useRef<HTMLFormElement>(null);
  const pronto = vecchio ? scritto.trim() !== '' : parole.every((p) => p.trim());

  async function invia(event: FormEvent) {
    event.preventDefault();
    if (occupato || !pronto) return;
    setOccupato(true);
    setErrore('');
    try {
      const esito = await apri(vecchio ? scritto : parole.map((p) => p.trim()).join('-'), { temporaneo });
      if (esito !== 'aperto') {
        const controllaOrdine = !vecchio && (esito === 'inesistente' || esito === 'illeggibile');
        setErrore(controllaOrdine ? 'Non trovo uno zaino con queste parole. Controlla come le hai scritte e in che ordine.' : TESTI_APRI[esito]);
      }
    } finally {
      setOccupato(false);
    }
  }

  return (
    <section className="zaino-scheda" aria-labelledby="zaino-apri">
      <h2 id="zaino-apri">Apri il tuo zaino</h2>
      {vecchio
        ? <p>Scrivi il codice di 20 caratteri del tuo zaino.</p>
        : <p>Scrivi una parola per casella, <strong>nell’ordine del codice</strong>. Bastano le prime quattro lettere. Puoi anche incollare il codice intero in una casella.</p>}
      <form ref={modulo} className="zaino-modulo" onSubmit={invia}>
        <fieldset className="zaino-conferma" disabled={occupato}>
          <legend className="visually-hidden">Apri lo zaino con il tuo codice</legend>
          {vecchio ? (
            <div className="zaino-vecchio">
              <label htmlFor="zaino-input">Codice dello zaino</label>
              <input id="zaino-input" className="zaino-input" value={scritto} onChange={(event) => setScritto(event.target.value)}
                autoComplete="off" autoCapitalize="none" spellCheck={false} translate="no" />
            </div>
          ) : <CampiCodice parole={parole} onChange={setParole} />}
          <button className="zaino-cambia-codice" type="button" onClick={() => {
            setVecchio(!vecchio);
            setErrore('');
            // Dopo lo scambio, riporta il fuoco sul primo campo del nuovo modulo.
            requestAnimationFrame(() => modulo.current?.querySelector('input')?.focus());
          }}>
            {vecchio ? 'Usa il codice di quattro parole' : 'Hai un codice di 20 caratteri? Usa una casella sola'}
          </button>
          {errore && <p className="zaino-errore" role="alert">{errore}</p>}
          <label className="zaino-casella">
            <input type="checkbox" checked={temporaneo} onChange={(event) => setTemporaneo(event.target.checked)} />
            <span>
              Non è il mio computer
              <span className="zaino-nota">Lo zaino resta aperto solo in questa scheda. I progressi già salvati nel browser restano a chi usa questo computer.</span>
            </span>
          </label>
          <div className="toolbar">
            <button type="submit" className="primary" disabled={!pronto}>
              <Icon name="backpack" />{occupato ? 'Apro lo zaino…' : 'Apri lo zaino'}
            </button>
          </div>
        </fieldset>
      </form>
    </section>
  );
}

function Effetti() {
  const compatto = usePortalCompatto();
  const voci = (
    <dl>
      <dt>Apri lo zaino</dt>
      <dd>I progressi di questo browser si uniscono a quelli dello zaino.</dd>
      <dt>Crea lo zaino</dt>
      <dd>I progressi di questo browser entrano nello zaino nuovo.</dd>
      <dt>Non è il mio computer</dt>
      <dd>Quando chiudi la scheda, i progressi dello zaino spariscono da qui e restano nello zaino.</dd>
      <dt>Esci dallo zaino</dt>
      <dd>Codice e progressi spariscono da questo browser. Nello zaino restano.</dd>
    </dl>
  );
  return compatto ? (
    <details className="zaino-scheda zaino-effetti">
      <summary>Che cosa succede ai tuoi progressi</summary>
      {voci}
    </details>
  ) : (
    <section className="zaino-scheda zaino-effetti" aria-labelledby="zaino-effetti">
      <h2 id="zaino-effetti">Che cosa succede ai tuoi progressi</h2>
      {voci}
    </section>
  );
}

function haProgressi(progress: ThemeProgress) {
  return Object.keys(progress.exercises).length > 0 || progress.freeHintUsed;
}

function Contenuto({ themes }: { themes: Theme[] }) {
  const mondi = useSyncExternalStore(subscribeProgress, () => themes.filter((t) => haProgressi(readProgress(t.manifest.id))).length, () => 0);
  return (
    <section className="zaino-scheda" aria-labelledby="zaino-dentro">
      <h2 id="zaino-dentro">Che cosa c’è nello zaino</h2>
      {mondi > 0 && (
        <ul className="zaino-mondi" data-zaino-contenuto="">
          {themes.map((theme) => <RigaTema key={theme.manifest.id} theme={theme} />)}
        </ul>
      )}
      {mondi < themes.length && <p className="zaino-nota">
        {mondi === 0 ? 'Non hai ancora progressi in nessun mondo.' : 'Negli altri mondi non hai ancora progressi.'}
      </p>}
      <p className="zaino-nota">
        Per ogni esercizio lo zaino conserva i suggerimenti aperti e l’ultima query. Contiene anche le eventuali note del libro e il codice con cui il servizio ti riconosce in classifica.
      </p>
    </section>
  );
}

function RigaTema({ theme }: { theme: Theme }) {
  const progress = useThemeProgress(theme.manifest.id);
  if (!haProgressi(progress)) return null;
  const risolti = Object.values(progress.exercises).filter((e) => e.solved).length;
  const totale = theme.stats?.exercises;
  return (
    <li>
      <MondoPallino id={theme.manifest.id} />
      <strong>{theme.manifest.title}</strong>
      <div className="zaino-mondo-progresso">
        {totale ? `${risolti} ${risolti === 1 ? 'esercizio' : 'esercizi'} su ${totale}` : `${risolti} ${risolti === 1 ? 'esercizio risolto' : 'esercizi risolti'}`}
        {totale ? <progress aria-label={`Esercizi risolti in ${theme.manifest.title}`} value={risolti} max={totale} /> : null}
      </div>
      <strong className="zaino-punti">{pointsLabel(balanceOf(progress))}</strong>
    </li>
  );
}

function Collegato({ codice, themes }: { codice: string; themes: Theme[] }) {
  const temporanea = useArea() === 'session';
  const [mostra, setMostra] = useState(false);
  const [occupato, setOccupato] = useState(false);

  async function faiEsci() {
    const domanda = temporanea
      ? 'Uscire dallo zaino? I progressi di questa scheda spariscono da questo computer. Nello zaino restano.'
      : 'Uscire dallo zaino? Codice e progressi spariscono da questo browser. Nello zaino restano.';
    if (!window.confirm(domanda)) return;
    setOccupato(true);
    try {
      await esci();
    } finally {
      setOccupato(false);
    }
  }

  const pulsanteEsci = (
    <button type="button" onClick={faiEsci} disabled={occupato}>
      <Icon name="right-from-bracket" />{occupato ? 'Esco dallo zaino…' : 'Esci dallo zaino'}
    </button>
  );
  const linkLibro = (
    <p className="zaino-nota">
      Per cancellare lo zaino o cambiarne il codice, apri la <a href={ZAINO_DEL_LIBRO}>pagina dello zaino nel libro</a>.
    </p>
  );

  return (
    <>
      {temporanea && <aside className="zaino-temporaneo">
        <div>
          <strong>Aperto solo in questa scheda</strong>
          <p>Il codice non è salvato su questo computer. I progressi spariscono da qui quando chiudi la scheda. Esci dallo zaino prima di andare via.</p>
        </div>
        {pulsanteEsci}
      </aside>}
      <div className="zaino-scelte zaino-collegato">
        <Contenuto themes={themes} />
        <div>
          {!temporanea && (
            <>
              <section className="zaino-scheda" aria-labelledby="zaino-mostra">
                <h2 id="zaino-mostra">Il codice</h2>
                <p>Ti serve per aprire lo zaino su un altro dispositivo. Mostralo solo quando nessuno guarda lo schermo.</p>
                <button type="button" aria-expanded={mostra} onClick={() => setMostra((m) => !m)}>
                  <Icon name="key" />{mostra ? 'Nascondi il codice' : 'Mostra il codice'}
                </button>
                {mostra && <BloccoCodice codice={codice} />}
              </section>
              <section className="zaino-scheda" aria-labelledby="zaino-esci">
                <h2 id="zaino-esci">Esci dallo zaino</h2>
                <p>Codice e progressi spariscono da questo browser. Nello zaino restano.</p>
                {pulsanteEsci}
                {linkLibro}
              </section>
            </>
          )}
          {temporanea && linkLibro}
        </div>
      </div>
    </>
  );
}

/** La pagina #/zaino, con i moduli di accesso e il riepilogo dei progressi. */
export function ZainoPage({ themes }: { themes: Theme[] }) {
  const stato = useStatoZaino();
  const codice = useCodiceZaino();
  const temporanea = useArea() === 'session';
  const [creazione, setCreazione] = useState(false);
  const titolo = useRef<HTMLHeadingElement>(null);
  const entra = useRef<HTMLButtonElement>(null);
  const { fase } = statoPillola(stato);

  useEffect(() => {
    document.title = 'Zaino · SQL Academy';
  }, []);

  return (
    <main className="page zaino-page">
      <div className="zaino-testata">
        <h1 ref={titolo} tabIndex={-1}>Zaino</h1>
        {codice && !creazione && !temporanea && (
          <p role="status" className="zaino-stato" data-zaino-fase={fase} data-zaino-stato={stato.fase} data-zaino-motivo={stato.motivo ?? undefined}>
            {fase === 'sincronizzato' ? <Icon name="circle-check" /> : <ZainoMark fase={fase} />}{testoStato(stato)}
          </p>
        )}
      </div>
      {!stato.supportato ? (
        <p className="notice notice-warning"><Icon name="triangle-exclamation" />{TESTI_APRI['non-supportato']}</p>
      ) : creazione ? (
        <CreazioneZaino
          onFine={() => { setCreazione(false); titolo.current?.focus(); }}
          onAnnulla={() => {
            setCreazione(false);
            requestAnimationFrame(() => (entra.current ?? titolo.current)?.focus());
          }}
        />
      ) : codice ? (
        <Collegato key={codice} codice={codice} themes={themes} />
      ) : (
        <>
          <p className="lead">Lo zaino è una copia dei tuoi progressi. Puoi aprirlo su altri dispositivi e nel libro <cite>Python Doesn’t Byte</cite>.</p>
          <div className="zaino-scelte">
            <Apri />
            <section className="zaino-scheda zaino-invito" aria-labelledby="zaino-crea">
              <h2 id="zaino-crea">Non hai ancora uno zaino?</h2>
              <p>Crea uno zaino per i progressi che hai già in questo browser. Ti servirà una copia delle quattro parole del codice.</p>
              <button type="button" ref={entra} onClick={() => setCreazione(true)}>Crea uno zaino</button>
            </section>
          </div>
          <Effetti />
        </>
      )}
      {!creazione && <p className="zaino-nota zaino-informativa">
        Il browser cifra il contenuto dello zaino con il tuo codice. Nell’<a href={formatRoute({ page: 'informativa' })}>informativa</a> trovi che cosa salva il sito e dove lo conserva.
      </p>}
    </main>
  );
}
