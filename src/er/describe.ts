/**
 * Descrizione testuale di un diagramma ER, per chi usa un lettore di schermo
 * e per chi lo legge su uno schermo stretto. Si scrive dalle stesse
 * dichiarazioni del disegno, quindi non può divergere da esso.
 */

import type { Attributo, DiagrammaERProps } from './types.ts';

function attributeText(attributo: Attributo): string {
  if (typeof attributo === 'string') return attributo;
  const parts = [attributo.nome];
  if (attributo.identificatore) parts.push('(identificatore)');
  if (attributo.card) parts.push(`con cardinalità ${attributo.card}`);
  if (attributo.componenti?.length) parts.push(`composto da ${attributo.componenti.join(', ')}`);
  return parts.join(' ');
}

function list(items: string[]): string {
  return items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} e ${items.at(-1)}`;
}

/** Una frase per entità, associazione e generalizzazione, nell’ordine della dichiarazione. */
export function describeDiagram(diagram: DiagrammaERProps): string[] {
  const label = new Map(diagram.entita.map((e) => [e.id, e.etichetta ?? e.id]));
  const sentences: string[] = [];

  for (const entita of diagram.entita) {
    const attributi = (entita.attributi ?? []).map(attributeText);
    let sentence = `Entità ${label.get(entita.id)}`;
    if (attributi.length > 0) sentence += `, con gli attributi ${list(attributi)}`;
    if (entita.identificatore) sentence += `; identificatore composto da ${list(entita.identificatore)}`;
    sentences.push(`${sentence}.`);
  }

  for (const associazione of diagram.associazioni ?? []) {
    const lati = associazione.tra.map((p) => `${label.get(p.entita) ?? p.entita}${p.card ? ` ${p.card}` : ''}`);
    let sentence = `Associazione ${associazione.etichetta ?? associazione.id} fra ${list(lati)}`;
    const attributi = (associazione.attributi ?? []).map(attributeText);
    if (attributi.length > 0) sentence += `, con gli attributi ${list(attributi)}`;
    sentences.push(`${sentence}.`);
  }

  for (const g of diagram.generalizzazioni ?? []) {
    const figli = g.figli.map((f) => label.get(f) ?? f);
    sentences.push(`Generalizzazione ${g.copertura}: ${label.get(g.padre) ?? g.padre} si specializza in ${list(figli)}.`);
  }

  return sentences;
}
