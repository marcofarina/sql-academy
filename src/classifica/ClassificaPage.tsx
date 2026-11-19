import { useEffect, useState, useSyncExternalStore } from 'react';
import { Icon } from '../icons/Icon.tsx';
import { pointsLabel } from '../points/labels.ts';
import { formatRoute } from '../routing/route.ts';
import type { Theme } from '../themes/contract.ts';
import { useCodiceZaino, useStatoZaino } from '../zaino/sincronizza.ts';
import { iscrivitiAdesione, leggiAdesione, NESSUNA_ADESIONE } from './adesione.ts';
import { indirizzoClassifica, partecipa, smettiDiPartecipare, useStatoClassifica } from './invio.ts';
import { TESTI_SCELTA, testoRifiuto, testoStato } from './labels.ts';
import { leggiClassifica, leggiPosizione, type Posizione, type Voce } from './servizio.ts';

/** Ogni quanto la pagina aperta rilegge la classifica: il servizio la tiene in cache per un minuto. */
const RILETTURA = 60_000;

function useAdesione() {
  return useSyncExternalStore(iscrivitiAdesione, leggiAdesione, () => NESSUNA_ADESIONE);
}

const fetchDelBrowser: typeof fetch = (...a) => fetch(...a);

function Partecipazione({ themes }: { themes: Theme[] }) {
  const zaino = useStatoZaino();
  const codice = useCodiceZaino();
  const { gettone } = useAdesione();
  const stato = useStatoClassifica();
  const [occupato, setOccupato] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const partecipi = gettone !== null;
  const titoloDi = (id: string) => themes.find((t) => t.manifest.id === id)?.manifest.title ?? id;

  const scegli = async (attiva: boolean) => {
    if (
      !attiva &&
      !window.confirm('Uscire dalla classifica? Il tuo nome e i tuoi punti spariscono dalla classifica. Se rientri, avrai un nome nuovo.')
    ) {
      return;
    }
    setOccupato(true);
    setErrore(null);
    const esito = attiva ? await partecipa() : await smettiDiPartecipare();
    if (esito !== 'ok') setErrore(TESTI_SCELTA[esito]);
    setOccupato(false);
  };

  return (
    <section className="zaino-scheda classifica-adesione" aria-labelledby="classifica-adesione">
      <h2 id="classifica-adesione">
        <Icon name="id-badge" />
        La tua partecipazione
      </h2>
      <label className="classifica-interruttore">
        <input
          type="checkbox"
          role="switch"
          checked={partecipi}
          disabled={occupato || (!partecipi && !codice)}
          onChange={(event) => void scegli(event.target.checked)}
          aria-describedby="classifica-spiega"
        />
        <span>Partecipa alla classifica</span>
      </label>
      {!codice ? (
        <p id="classifica-spiega">
          Per partecipare serve lo zaino, la copia in rete dei tuoi progressi che si apre con un codice
          {zaino.supportato ? '' : ' (questo browser però non sa aprirlo)'}: il tuo nome in classifica viaggia nello zaino, così resta lo stesso
          su ogni dispositivo.{' '}
          {zaino.supportato && <a href={formatRoute({ page: 'zaino' })}>Apri o crea lo zaino</a>}
        </p>
      ) : partecipi ? (
        <>
          <p id="classifica-spiega" className="classifica-nome">
            Il tuo nome in classifica: <strong data-classifica-nome="">{stato.nome ?? '…'}</strong>
          </p>
          <p role="status" className="zaino-nota" data-classifica-fase={stato.fase}>
            {testoStato(stato)}
          </p>
          {Object.entries(stato.respinti).map(([tema, motivo]) => (
            <p key={tema} className="zaino-avvertenza">
              {testoRifiuto(motivo, titoloDi(tema))}
            </p>
          ))}
        </>
      ) : (
        <p id="classifica-spiega">
          Se partecipi, il sito ti assegna un nome scelto a caso e invia alla classifica i tuoi punti di ogni tema. Puoi uscire quando vuoi:
          nome e punti spariscono dalla classifica.
        </p>
      )}
      <p role="alert" className="zaino-errore">
        {errore ?? ''}
      </p>
    </section>
  );
}

type Dati = { stato: 'carico' } | { stato: 'errore' } | { stato: 'pronta'; voci: Voce[]; posizione: Posizione | null };

function Tabella({ voci, didascalia }: { voci: (Voce & { me?: boolean })[]; didascalia: string }) {
  return (
    <div className="table-scroll">
      <table className="classifica-tabella">
        <caption className="visually-hidden">{didascalia}</caption>
        <thead>
          <tr>
            <th scope="col">Posizione</th>
            <th scope="col">Nome</th>
            <th scope="col">Punti</th>
          </tr>
        </thead>
        <tbody>
          {voci.map((v) => (
            <tr key={v.rank} className={v.me ? 'is-me' : undefined} aria-current={v.me ? 'true' : undefined}>
              <td className="number">{v.rank}</td>
              <td>
                {v.name}
                {v.me && <span className="classifica-tu"> (tu)</span>}
              </td>
              <td className="number">{pointsLabel(v.points)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Classifiche({ themes }: { themes: Theme[] }) {
  const { gettone } = useAdesione();
  const { versione } = useStatoClassifica();
  const [vista, setVista] = useState<string | null>(null);
  const [dati, setDati] = useState<Dati>({ stato: 'carico' });
  const [giro, setGiro] = useState(0);
  const titolo = vista ? (themes.find((t) => t.manifest.id === vista)?.manifest.title ?? vista) : 'Generale';

  useEffect(() => {
    const id = setInterval(() => setGiro((g) => g + 1), RILETTURA);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let attiva = true;
    const base = indirizzoClassifica();
    void (async () => {
      const [voci, posizione] = await Promise.all([
        leggiClassifica(fetchDelBrowser, base, vista, gettone !== null),
        gettone ? leggiPosizione(fetchDelBrowser, base, gettone, vista) : Promise.resolve(null),
      ]);
      if (!attiva) return;
      if (voci.tipo !== 'ok') {
        setDati({ stato: 'errore' });
        return;
      }
      setDati({ stato: 'pronta', voci: voci.dati, posizione: posizione?.tipo === 'ok' ? posizione.dati : null });
    })();
    return () => {
      attiva = false;
    };
  }, [vista, gettone, versione, giro]);

  const mio = dati.stato === 'pronta' ? dati.posizione : null;
  const voci = dati.stato === 'pronta' ? dati.voci.map((v) => ({ ...v, me: mio !== null && v.name === mio.name })) : [];
  const fuoriDaiPrimi = mio !== null && mio.rank !== null && !voci.some((v) => v.me);

  return (
    <section className="classifica-elenco" aria-labelledby="classifica-titolo">
      <div className="view-switch" role="group" aria-label="Quale classifica">
        <button type="button" aria-pressed={vista === null} onClick={() => setVista(null)}>
          Generale
        </button>
        {themes.map((t) => (
          <button key={t.manifest.id} type="button" aria-pressed={vista === t.manifest.id} onClick={() => setVista(t.manifest.id)}>
            {t.manifest.title}
          </button>
        ))}
      </div>
      <h2 id="classifica-titolo">{vista ? `Classifica di ${titolo}` : 'Classifica generale'}</h2>
      {vista === null && <p className="zaino-nota">La classifica generale somma i punti di tutti i temi.</p>}

      {dati.stato === 'carico' && <p role="status">Carico la classifica…</p>}
      {dati.stato === 'errore' && (
        <p className="notice notice-warning" role="status">
          <Icon name="triangle-exclamation" />
          La classifica non risponde in questo momento. Esercizi, punti e zaino funzionano lo stesso.
        </p>
      )}
      {dati.stato === 'pronta' && (
        <>
          {mio && mio.rank === null && <p className="zaino-nota">Non hai ancora punti in questa classifica.</p>}
          {voci.length === 0 ? (
            <p>Nessuno ha ancora punti in questa classifica.</p>
          ) : (
            <Tabella voci={voci} didascalia={`${voci.length === 1 ? 'La prima posizione' : `Le prime ${voci.length} posizioni`} della classifica ${vista ? `di ${titolo}` : 'generale'}`} />
          )}
          {fuoriDaiPrimi && (
            <>
              <h3>La tua posizione</h3>
              <Tabella voci={mio.neighbors} didascalia="La tua posizione, con le due posizioni sopra e le due sotto" />
            </>
          )}
        </>
      )}
    </section>
  );
}

/** La pagina `#/classifica`: partecipazione, classifica generale e per tema. */
export function ClassificaPage({ themes }: { themes: Theme[] }) {
  useEffect(() => {
    document.title = 'Classifica · SQL Academy';
  }, []);

  return (
    <main className="page classifica-page">
      <a className="back-link" href="#/">
        <Icon name="circle-arrow-left" />
        Tutti i temi
      </a>
      <h1>
        <Icon name="trophy" />
        Classifica
      </h1>
      <p className="lead">
        In classifica compaiono solo gli studenti che scelgono di partecipare, ognuno con un nome assegnato a caso dal sito e con i punti
        guadagnati negli esercizi. La pagina mostra i primi 50.
      </p>
      <Partecipazione themes={themes} />
      <Classifiche themes={themes} />
      <p className="zaino-nota classifica-limiti">
        La classifica è un gioco, non un voto. Quali dati salva il sito e dove li conserva lo spiega l’<a href={formatRoute({ page: 'informativa' })}>informativa</a>.
      </p>
    </main>
  );
}
