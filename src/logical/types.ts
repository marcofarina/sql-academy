/**
 * Il contenuto di `themes/<id>/logico.ts`, esportato come `default`: dove
 * stanno le tabelle nel diagramma del modello logico. Colonne, tipi e chiavi
 * non si scrivono qui: si leggono dal database del tema.
 *
 * Le tabelle stanno su una griglia: `col` e `riga` partono da 0, una tabella
 * per cella. Le linee delle chiavi esterne corrono negli spazi fra le colonne
 * e fra le righe della griglia, quindi non attraversano mai un riquadro.
 * `npm run check:themes` controlla che ogni tabella del database compaia una
 * volta sola e che le linee non si sovrappongano.
 */
export interface LogicalLayout {
  tabelle: Record<string, { col: number; riga: number }>;
}
