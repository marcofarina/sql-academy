/** Classifica generale e dei mondi, con partecipazione facoltativa. */
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Icon } from '../icons/Icon.tsx';
import { usePortalCompatto } from '../pages/usePortalCompatto.ts';
import { pointsLabel } from '../points/labels.ts';
import { formatRoute } from '../routing/route.ts';
import type { Theme } from '../themes/contract.ts';
import { useCodiceZaino, useStatoZaino } from '../zaino/sincronizza.ts';
import { iscrivitiAdesione, leggiAdesione, NESSUNA_ADESIONE } from './adesione.ts';
import { partecipa, smettiDiPartecipare, useStatoClassifica } from './invio.ts';
import { TESTI_SCELTA, testoRifiuto, testoStato } from './labels.ts';
import { ElencoClassifiche, PannelloClassifiche } from './SelettoreClassifica.tsx';
import type { Posizione } from './servizio.ts';
import { Tabellone } from './Tabellone.tsx';
import { useDatiClassifica } from './useDatiClassifica.ts';
import './classificaPage.css';

const ARTICOLI: Record<string, string> = {
  'Il ': 'del ', 'Lo ': 'dello ', 'La ': 'della ', 'I ': 'dei ', 'Gli ': 'degli ', 'Le ': 'delle ', 'L’': 'dell’', "L'": 'dell’',
};

function titoloDi(mondo?: Theme) {
  if (!mondo) return 'Classifica generale';
  const nome = mondo.manifest.title;
  const articolo = Object.keys(ARTICOLI).find((inizio) => nome.startsWith(inizio));
  return articolo ? `Classifica ${ARTICOLI[articolo]}${nome.slice(articolo.length)}` : `Classifica di ${nome}`;
}

function orario(ms: number) {
  return new Date(ms).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
}

function PosizionePersonale({ mio }: { mio: Posizione }) {
  const sopra = mio.neighbors.find((v) => v.rank === (mio.rank ?? 0) - 1);
  // A parità di punti precede chi li ha raggiunti prima.
  const mancano = sopra ? Math.max(1, sopra.points - mio.points + 1) : 0;
  return (
    <section className="classifica-posizione" aria-label="La tua posizione">
      <strong className="classifica-posizione-numero">{mio.rank}º</strong>
      <div>
        <div className="classifica-posizione-desktop">
          <strong>{mio.name} · tu</strong>
          <span>{pointsLabel(mio.points)}</span>
        </div>
        <strong className="classifica-posizione-mobile">Tu · {pointsLabel(mio.points)}</strong>
        <span className="classifica-posizione-mobile">{sopra ? `${pointsLabel(mancano)} per salire al ${sopra.rank}º` : mio.rank === 1 ? 'Sei in testa.' : ''}</span>
      </div>
      <p className="classifica-scalata">{sopra ? <>Ti {mancano === 1 ? 'manca' : 'mancano'} <strong>{pointsLabel(mancano)}</strong> per superare {sopra.name}.</> : mio.rank === 1 ? 'Sei in testa.' : null}</p>
    </section>
  );
}

/** La pagina della classifica mostra il podio, la posizione e le azioni di adesione. */
export function ClassificaPage({ themes, mondo }: { themes: Theme[]; mondo?: Theme }) {
  const vista = mondo?.manifest.id ?? null;
  const zaino = useStatoZaino();
  const codice = useCodiceZaino();
  const { gettone } = useSyncExternalStore(iscrivitiAdesione, leggiAdesione, () => NESSUNA_ADESIONE);
  const stato = useStatoClassifica();
  const { tabellone, posizioni } = useDatiClassifica(themes, vista, gettone, stato.versione);
  const compatto = usePortalCompatto();
  const [occupato, setOccupato] = useState(false);
  const [errore, setErrore] = useState('');
  const titolo = useRef<HTMLHeadingElement>(null);
  const titoloVista = titoloDi(mondo);
  const mio = posizioni[vista ?? ''];
  const vuota = tabellone?.voci?.length === 0;
  const esercizi = formatRoute(vista ? { page: 'theme', themeId: vista, section: 'addestramento' } : { page: 'home' });

  useEffect(() => {
    document.title = `${titoloVista} · SQL Academy`;
  }, [titoloVista]);

  async function scegli(attiva: boolean) {
    if (!attiva && !window.confirm('Uscire dalla classifica? Il tuo nome e i tuoi punti spariscono dalla classifica. Se rientri, avrai un nome nuovo.')) {
      return;
    }
    setOccupato(true);
    setErrore('');
    try {
      const esito = attiva ? await partecipa() : await smettiDiPartecipare();
      if (esito !== 'ok') setErrore(TESTI_SCELTA[esito]);
      else titolo.current?.focus();
    } finally {
      setOccupato(false);
    }
  }

  const linkEsercizi = <a href={esercizi} className="button primary">Vai agli esercizi</a>;
  return (
    <main className="page classifica-page" data-barra-posizione={compatto && Boolean(mio?.rank) || undefined}>
      <header className="classifica-testata">
        <h1 tabIndex={-1} ref={titolo}>{compatto && !mondo ? 'Classifica' : titoloVista}</h1>
        <p className="lead">{mondo ? 'Qui contano i punti guadagnati negli esercizi di questo mondo.' : 'La classifica generale somma i punti di tutti i mondi. Chi partecipa compare con un nome scelto a caso.'}</p>
      </header>
      {compatto && <PannelloClassifiche themes={themes} mondo={mondo} posizioni={posizioni} />}
      <div className="classifica-elenco">
        {tabellone?.riprova && (
          <div className="classifica-avviso" role="status">
            <Icon name="triangle-exclamation" />
            <div>
              <strong>La classifica non risponde</strong>
              <p>Riprovo alle {orario(tabellone.riprova)}. Esercizi, punti e zaino funzionano lo stesso.</p>
            </div>
          </div>
        )}
        {!gettone ? (
          <section className="classifica-invito" data-senza-zaino={!codice || undefined} aria-labelledby="classifica-invito">
            <Icon name={codice ? 'id-badge' : 'backpack'} />
            <div>
              <h2 id="classifica-invito">{codice ? 'Vuoi entrare in classifica?' : 'Per partecipare serve lo zaino'}</h2>
              <p>{codice
                ? 'In classifica compari con un nome scelto a caso e con i punti dei tuoi esercizi.'
                : zaino.supportato ? 'Lo zaino conserva il codice con cui ritrovi il tuo nome in classifica su ogni dispositivo.' : 'Apri lo zaino da un browser che supporta la cifratura su HTTPS.'}</p>
            </div>
            {codice
              ? <button type="button" className="primary" disabled={occupato} onClick={() => void scegli(true)}>{occupato ? 'Iscrizione in corso…' : 'Partecipa'}</button>
              : zaino.supportato && <a className="button" href={formatRoute({ page: 'zaino' })}>Apri lo zaino</a>}
          </section>
        ) : mio?.rank ? <PosizionePersonale mio={mio} /> : mio && (
          <section className="classifica-senza-punti">
            <h2>Non hai ancora punti in questa classifica</h2>
            {!vuota && <a href={esercizi} className="button">Vai agli esercizi</a>}
          </section>
        )}
        {!tabellone && <p role="status">Carico la classifica…</p>}
        {tabellone && <Tabellone key={vista ?? 'generale'} voci={tabellone.voci} mio={mio} compatto={compatto} vuota={vuota} />}
        {vuota && (
          <div className="classifica-vuota">
            <p>{mondo ? 'Nessuno ha ancora punti in questo mondo.' : 'Nessuno ha ancora punti nella classifica generale.'} Risolvi un esercizio per salire sul podio.</p>
            {linkEsercizi}
          </div>
        )}
      </div>
      <aside className="classifica-lato">
        {!compatto && <ElencoClassifiche themes={themes} mondo={mondo} posizioni={posizioni} />}
        {(gettone || errore) && (
          <section className="zaino-scheda classifica-adesione" aria-labelledby="classifica-adesione">
            <h2 id="classifica-adesione" className="visually-hidden">La tua partecipazione</h2>
            {gettone && (
              <>
                {stato.nome && <p>Partecipi come <strong data-classifica-nome="">{stato.nome}</strong>.</p>}
                <p role="status" className="zaino-nota" data-classifica-fase={stato.fase}>{testoStato(stato)}</p>
                {Object.entries(stato.respinti).map(([tema, motivo]) => (
                  <p key={tema} className="zaino-avvertenza">{testoRifiuto(motivo, themes.find((t) => t.manifest.id === tema)?.manifest.title ?? tema)}</p>
                ))}
                <button type="button" disabled={occupato} onClick={() => void scegli(false)}>{occupato ? 'Uscita in corso…' : 'Esci dalla classifica'}</button>
              </>
            )}
            {errore && <p role="alert" className="zaino-errore">{errore}</p>}
          </section>
        )}
        <p className="zaino-nota">
          La classifica è facoltativa e non incide sui voti. L’<a href={formatRoute({ page: 'informativa' })}>informativa</a> spiega quali dati vede chi la apre.
        </p>
      </aside>
    </main>
  );
}
