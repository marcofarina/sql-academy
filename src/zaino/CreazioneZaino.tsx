/** Mostra e verifica il codice prima di inviarlo al servizio dello zaino. */
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Icon } from '../icons/Icon.tsx';
import { BloccoCodice } from './BloccoCodice.tsx';
import { CampiCodice } from './CampiCodice.tsx';
import { nuovoCodice, pulisciParola } from './cifra.ts';
import { CodiceGiaUsato, crea } from './sincronizza.ts';

const PAROLE_VUOTE = ['', '', '', ''];

/** I tre passi di creazione e la conferma dello zaino pronto. */
export function CreazioneZaino({ onFine, onAnnulla }: { onFine: () => void; onAnnulla: () => void }) {
  const [passo, setPasso] = useState(1);
  const [capito, setCapito] = useState(false);
  const [codice, setCodice] = useState('');
  const [parole, setParole] = useState(PAROLE_VUOTE);
  const [errata, setErrata] = useState<number | null>(null);
  const [errore, setErrore] = useState('');
  const [occupa, setOccupa] = useState(false);
  const titolo = useRef<HTMLHeadingElement>(null);

  useEffect(() => { titolo.current?.focus(); }, [passo]);

  function mostra() {
    if (!capito) return;
    if (!codice) setCodice(nuovoCodice());
    setPasso(2);
  }

  async function invia(event: FormEvent) {
    event.preventDefault();
    if (occupa) return;
    const attese = codice.split('-');
    const diversa = parole.findIndex((parola, i) => pulisciParola(parola.trim()).slice(0, 4) !== attese[i].slice(0, 4));
    setErrore('');
    setErrata(diversa < 0 ? null : diversa);
    if (diversa >= 0) return;

    setOccupa(true);
    try {
      await crea(codice);
      setCodice('');
      setParole(PAROLE_VUOTE);
      setPasso(4);
    } catch (e) {
      if (e instanceof CodiceGiaUsato) {
        setCodice(nuovoCodice());
        setParole(PAROLE_VUOTE);
        setErrore('Queste parole erano già in uso. Salva il nuovo codice qui sotto e usa quello.');
        setPasso(2);
      } else {
        setErrore('Non sono riuscito a creare lo zaino. Riprova fra un po’.');
      }
    } finally {
      setOccupa(false);
    }
  }

  return (
    <section className="zaino-scheda zaino-creazione" data-pronto={passo === 4 || undefined} aria-labelledby="zaino-passo">
      {passo < 4 && (
        <>
          <div className="zaino-segmenti" aria-hidden="true">
            {[1, 2, 3].map((n) => <span key={n} data-raggiunto={n <= passo} />)}
          </div>
          <p className="zaino-nota">Passo {passo} di 3</p>
        </>
      )}
      {passo === 4 && <div className="zaino-pronto"><Icon name="circle-check" /></div>}
      <h2 id="zaino-passo" ref={titolo} tabIndex={-1}>
        {['Prima di cominciare', 'Le tue quattro parole', 'Riscrivile qui', 'Il tuo zaino è pronto'][passo - 1]}
      </h2>
      {errore && <p className="zaino-errore" role="alert">{errore}</p>}
      {passo === 1 && (
        <>
          <p>Le quattro parole sono l’unica chiave dello zaino. Copiale nell’ordine in cui le vedi e tieni una seconda copia in un posto sicuro.</p>
          <p>Potrai rivederle su un dispositivo dove lo zaino è ancora aperto. Se perdi tutte le copie e lo zaino è chiuso ovunque, perdi l’accesso.</p>
          <label className="zaino-casella">
            <input type="checkbox" checked={capito} onChange={(event) => setCapito(event.target.checked)} />
            <span>Ho capito, salvo le parole prima di andare avanti</span>
          </label>
          <div className="toolbar">
            <button type="button" className="primary" disabled={!capito} onClick={mostra}>Mostra le parole</button>
            <button type="button" onClick={onAnnulla}>Annulla</button>
          </div>
        </>
      )}
      {passo === 2 && (
        <>
          <p>Salva le parole con il loro numero. Ti serviranno nello stesso ordine.</p>
          <BloccoCodice codice={codice} />
          <div className="toolbar">
            <button type="button" className="primary" onClick={() => { setErrore(''); setPasso(3); }}>Le ho salvate</button>
            <button type="button" onClick={() => { setErrore(''); setPasso(1); }}>Indietro</button>
            <button type="button" onClick={onAnnulla}>Annulla</button>
          </div>
        </>
      )}
      {passo === 3 && (
        <form className="zaino-modulo" onSubmit={invia}>
          <p>Prendi la tua copia e scrivi le parole in ordine. Bastano le prime quattro lettere di ciascuna.</p>
          <fieldset className="zaino-conferma" disabled={occupa}>
            <legend className="visually-hidden">Conferma il codice</legend>
            <CampiCodice parole={parole} errore={errata} onChange={(nuove) => { setParole(nuove); setErrata(null); }} />
            {errata !== null && <p id="zaino-parola-errata" className="zaino-errore" role="alert">La parola {errata + 1} non è quella giusta. Controlla la tua copia.</p>}
            <div className="toolbar">
              <button type="submit" className="primary">Crea lo zaino</button>
              <button type="button" onClick={() => { setErrore(''); setErrata(null); setPasso(2); }}>Rivedi le parole</button>
              <button type="button" onClick={onAnnulla}>Annulla</button>
            </div>
          </fieldset>
          {occupa && <p role="status">Creo lo zaino…</p>}
        </form>
      )}
      {passo === 4 && (
        <>
          <p>Lo zaino contiene i progressi che avevi in questo browser. Usa le quattro parole per ritrovarli su un altro dispositivo o nel libro.</p>
          <button type="button" className="primary" onClick={onFine}>Vai allo zaino</button>
        </>
      )}
    </section>
  );
}
