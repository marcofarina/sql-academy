/** Podio, lista e riga personale del tabellone. */
import { useState } from 'react';
import type { Posizione, Voce } from './servizio.ts';

const COLORI = ['#22324a', '#2a5f8a', '#2e6b4c', '#6a3d9e', '#8e1f18', '#6e4300'];

function Iniziali({ nome }: { nome: string }) {
  const parole = nome.split(' ');
  const lettere = parole.slice(0, 2).map((p) => p.charAt(0)).join('');
  const somma = [...nome].reduce((s, c) => s + c.charCodeAt(0), 0);
  return <span className="classifica-iniziali" aria-hidden="true" style={{ backgroundColor: COLORI[somma % COLORI.length] }}>{lettere}</span>;
}

function EtichettaTu() {
  return <span className="classifica-tu">tu</span>;
}

function Podio({ primi, nome, vuota }: { primi: Voce[]; nome?: string; vuota: boolean }) {
  return (
    <ol className="classifica-podio" aria-label="Podio">
      {[1, 2, 3].map((posto) => {
        const voce = primi.find((v) => v.rank === posto);
        const tu = voce !== undefined && voce.name === nome;
        return (
          <li key={posto} data-posto={posto} aria-current={tu ? 'true' : undefined}>
            <div className="classifica-podio-nome">
              {voce ? (
                <>
                  <Iniziali nome={voce.name} />
                  <strong>{voce.name}{tu && <> <EtichettaTu /></>}</strong>
                  <span className="classifica-podio-punti">{voce.points} <small>punti</small></span>
                </>
              ) : <span className={vuota ? 'classifica-podio-libero' : 'visually-hidden'}>
                {vuota && posto === 1 ? 'Il primo posto è libero' : 'Posto libero'}
              </span>}
            </div>
            <div className="classifica-gradino" data-libero={!voce || undefined}>{(voce || vuota) && posto}</div>
          </li>
        );
      })}
    </ol>
  );
}

type Riga = Voce & { me?: boolean };

function Tabella({ voci, nome, massimo, didascalia }: { voci: Riga[]; nome?: string; massimo: number; didascalia: string }) {
  return (
    <table className="classifica-tabella">
      <caption className="visually-hidden">{didascalia}</caption>
      <thead className="visually-hidden">
        <tr>
          <th scope="col">Posizione</th>
          <th scope="col">Nome</th>
          <th scope="col">Punti</th>
        </tr>
      </thead>
      <tbody>
        {voci.map((v) => {
          const tu = v.me ?? v.name === nome;
          return (
            <tr key={v.rank} aria-current={tu ? 'true' : undefined}>
              <td className="classifica-tabella-posto">{v.rank}º</td>
              <th scope="row">
                <div className="classifica-riga-nome">
                  <Iniziali nome={v.name} />
                  <span>{v.name}{tu && <> <EtichettaTu /></>}</span>
                </div>
              </th>
              <td>
                <div className="classifica-riga-punti">
                  <span className="classifica-binario" aria-hidden="true">
                    <span style={{ width: `${massimo > 0 ? Math.min(100, v.points / massimo * 100) : 0}%` }} />
                  </span>
                  <span>{v.points}</span>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/** Mostra il podio e la lista fino alla soglia del dispositivo, con i vicini se la tua riga è fuori. */
export function Tabellone({ voci, mio, compatto, vuota }: {
  voci?: Voce[];
  mio?: Posizione;
  compatto: boolean;
  vuota: boolean;
}) {
  const [espansa, setEspansa] = useState(false);
  const massimo = voci?.[0]?.points ?? 0;
  const limite = espansa ? 50 : (compatto ? 10 : Math.max(20, mio?.rank && mio.rank <= 50 ? mio.rank : 0));
  const lista = voci?.filter((v) => v.rank > 3 && v.rank <= limite);
  const nome = mio?.rank ? mio.name : undefined;
  const compari = voci?.some((v) => v.rank <= limite && v.name === nome);
  return (
    <>
      <Podio primi={voci?.filter((v) => v.rank <= 3) ?? []} nome={nome} vuota={vuota} />
      {lista && lista.length > 0 && <Tabella voci={lista} nome={nome} massimo={massimo} didascalia="Classifica dal quarto posto" />}
      {!espansa && voci?.some((v) => v.rank > limite) && (
        <button type="button" className="classifica-espandi" onClick={() => setEspansa(true)}>Mostra fino al 50º</button>
      )}
      {voci?.length && mio?.rank && !compari && mio.neighbors.length ? (
        <section className="classifica-vicini" aria-labelledby="classifica-intorno">
          <h2 id="classifica-intorno">Intorno a te</h2>
          <Tabella voci={mio.neighbors} massimo={massimo} didascalia="La tua posizione e quelle vicine" />
        </section>
      ) : null}
    </>
  );
}
