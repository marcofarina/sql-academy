// Contrasto WCAG delle palette approvate in docs/design/<id>.md.
// Uso: node docs/design/contrasto.mjs [neutra|star-wars-chiaro|star-wars-scuro]
// Senza argomenti misura tutte le palette. Esce con codice 1 se una coppia è sotto la soglia.

const PALETTES = {
  neutra: [
    ['testo / parete', '#172131', '#E4E7EC'],
    ['testo / parete al centro', '#172131', '#F3F5F8'],
    ['testo / parete ai bordi', '#172131', '#D3D8E0'],
    ['secondario / parete', '#46536A', '#E4E7EC'],
    ['secondario / parete ai bordi', '#46536A', '#D3D8E0'],
    ['link / parete', '#22324A', '#E4E7EC'],
    ['scheda: testo', '#172131', '#FBFBFC'],
    ['scheda: secondario', '#46536A', '#FBFBFC'],
    ['scheda: etichetta tabella', '#172131', '#EBEEF2'],
    ['pulsante primario', '#FFFFFF', '#172131'],
    ['pulsante primario, passaggio del mouse', '#FFFFFF', '#2C3B55'],
    ['bordo pulsante secondario / parete', '#6E7A8E', '#E4E7EC', 3],
    ['bordo pulsante secondario / parete ai bordi', '#6E7A8E', '#D3D8E0', 3],
    ['bordo pulsante secondario / scheda', '#6E7A8E', '#FBFBFC', 3],
    ['barra «facili» / scheda', '#3F8F67', '#FBFBFC', 3],
    ['barra «medi» / scheda', '#2A5F8A', '#FBFBFC', 3],
    ['barra «difficili» / scheda', '#22324A', '#FBFBFC', 3],
    ['locandina Star Wars: motto e crediti', '#C3CADB', '#070B1A'],
    ['locandina Star Wars: titolo', '#F2C94C', '#070B1A'],
    ['locandina «Prossimamente» 3: titolo', '#E4E7EC', '#3A4252'],
    ['locandina «Prossimamente» 3: riga', '#C3CADB', '#3A4252'],
    ['locandina «Prossimamente» 4: titolo', '#E4E7EC', '#4A4F5C'],
    ['locandina «Prossimamente» 4: riga', '#C3CADB', '#4A4F5C'],
  ],
  'star-wars-chiaro': [
    ['testo / fondo', '#1B1E22', '#E4E7EA'],
    ['testo / superficie', '#1B1E22', '#F7F8F9'],
    ['testo / superficie 2', '#1B1E22', '#EDEFF1'],
    ['secondario / fondo', '#4C535B', '#E4E7EA'],
    ['secondario / superficie', '#4C535B', '#F7F8F9'],
    ['secondario / superficie 2', '#4C535B', '#EDEFF1'],
    ['link / fondo', '#A1232A', '#E4E7EA'],
    ['link / superficie', '#A1232A', '#F7F8F9'],
    ['link, passaggio del mouse / fondo', '#6F1519', '#E4E7EA'],
    ['pulsante primario', '#FFFFFF', '#B3242B'],
    ['selettore premuto', '#E4E7EA', '#1B1E22'],
    ['editor: testo', '#ECEEF0', '#1D2126'],
    ['editor: numeri di riga', '#8E969F', '#1D2126'],
    ['editor: parole chiave', '#FF8F87', '#1D2126'],
    ['editor: numeri', '#9FD3FF', '#1D2126'],
    ['editor: punteggiatura', '#B5BCC3', '#1D2126'],
    ['NULL / superficie', '#6A3D9E', '#F7F8F9'],
    ['errore', '#8E1F18', '#F6E2DE'],
    ['avviso', '#6E4300', '#F7EBCF'],
    ['ripristino', '#1D5E37', '#E0EFE5'],
    ['icone d’accento / fondo', '#B3242B', '#E4E7EA', 3],
    ['icone d’accento / superficie', '#B3242B', '#F7F8F9', 3],
    ['bordo dei controlli / fondo', '#6E757D', '#E4E7EA', 3],
  ],
  'star-wars-scuro': [
    ['testo / fondo', '#E7E9EC', '#0E1013'],
    ['testo / superficie', '#E7E9EC', '#171A1E'],
    ['testo / superficie 2', '#E7E9EC', '#1F2328'],
    ['secondario / fondo', '#A4ABB4', '#0E1013'],
    ['secondario / superficie', '#A4ABB4', '#171A1E'],
    ['secondario / superficie 2', '#A4ABB4', '#1F2328'],
    ['link / fondo', '#FF8A8F', '#0E1013'],
    ['link, passaggio del mouse / fondo', '#FFB3B6', '#0E1013'],
    ['pulsante primario, parte alta', '#FFFFFF', '#C81B24'],
    ['pulsante primario, parte bassa', '#FFFFFF', '#9E1219'],
    ['pulsante primario, colore pieno', '#FFFFFF', '#B3161E'],
    ['selettore premuto', '#0E1013', '#E7E9EC'],
    ['editor: testo', '#E7E9EC', '#08090B'],
    ['editor: numeri di riga', '#868E98', '#08090B'],
    ['editor: parole chiave', '#FF6B71', '#08090B'],
    ['editor: numeri', '#F4C27A', '#08090B'],
    ['editor: punteggiatura', '#A9B0B9', '#08090B'],
    ['NULL / superficie', '#D3A6FF', '#171A1E'],
    ['errore', '#FFA3A3', '#2B1214'],
    ['avviso', '#FFD27A', '#262010'],
    ['ripristino', '#A8E0BE', '#12251B'],
    ['icone d’accento / fondo', '#FF4F57', '#0E1013', 3],
    ['icone d’accento / superficie', '#FF4F57', '#171A1E', 3],
    ['bordo dei controlli / fondo', '#6B737D', '#0E1013', 3],
  ],
};

function luminance(hex) {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const wanted = process.argv[2] ? [process.argv[2]] : Object.keys(PALETTES);
let failures = 0;
for (const name of wanted) {
  const pairs = PALETTES[name];
  if (!pairs) {
    console.error(`Palette sconosciuta: ${name}. Disponibili: ${Object.keys(PALETTES).join(', ')}`);
    process.exit(2);
  }
  console.log(`\n${name}`);
  for (const [label, fg, bg, min = 4.5] of pairs) {
    const r = ratio(fg, bg);
    const ok = r >= min;
    if (!ok) failures++;
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${r.toFixed(2).padStart(5)}:1 (min ${min}) ${label}: ${fg} su ${bg}`);
  }
}
process.exit(failures ? 1 : 0);
