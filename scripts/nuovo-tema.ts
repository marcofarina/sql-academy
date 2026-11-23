/** Genera uno scheletro provvisorio di tema, senza sovrascrivere cartelle esistenti. */
import { mkdirSync, writeFileSync } from 'node:fs';
import { PORTAL_PAGES } from '../src/routing/route.ts';
import { THEME_ID_PATTERN } from '../src/themes/contract.ts';

const [id, ...extra] = process.argv.slice(2);
if (!id || extra.length || !THEME_ID_PATTERN.test(id)) {
  console.error('Indica un solo id: minuscole, cifre e trattini interni. Uso: npm run nuovo-tema -- <id>');
  process.exit(1);
}
if ((PORTAL_PAGES as readonly string[]).includes(id)) {
  console.error(`L’id «${id}» è riservato a una pagina del portale.`);
  process.exit(1);
}

const directory = new URL(`../themes/${id}/`, import.meta.url);
try {
  mkdirSync(directory);
} catch (error) {
  if ((error as NodeJS.ErrnoException).code === 'EEXIST') {
    console.error(`Il tema «${id}» esiste già.`);
    process.exit(1);
  }
  throw error;
}

const files: Record<string, string> = {
  'theme.ts': `/** Manifest provvisorio: sostituisci i testi e scegli il livello del mondo. */
import type { ThemeManifest } from '../../src/themes/contract.ts';

const manifest: ThemeManifest = {
  id: '${id}',
  title: '${id}',
  level: 'facile',
  description: 'Tema da costruire.',
  motto: 'Tema da costruire',
};

export default manifest;
`,
  'schema.sql': `-- Schema provvisorio: sostituiscilo con quello del mondo.
CREATE TABLE categorie (id INTEGER PRIMARY KEY, nome TEXT NOT NULL);
CREATE TABLE elementi (id INTEGER PRIMARY KEY, nome TEXT NOT NULL, categoria_id INTEGER NOT NULL REFERENCES categorie(id));
`,
  'dati.sql': `-- Dati provvisori.
INSERT INTO categorie VALUES (1, 'Prima categoria');
INSERT INTO elementi VALUES (1, 'Primo elemento', 1), (2, 'Secondo elemento', 1);
`,
  'esercizi.ts': `/** Esercizio provvisorio da sostituire. */
import type { Exercise } from '../../src/themes/contract.ts';

const exercises: Exercise[] = [{
  id: 'ex-001',
  chapter: 'una-tabella',
  difficulty: 'facile',
  keywords: ['SELECT', 'FROM'],
  title: 'Elementi',
  prompt: 'Mostra i nomi degli elementi.',
  expectedQuery: 'SELECT nome FROM elementi',
  hints: ['Cerca la colonna nome nella tabella elementi.'],
  tables: ['elementi'],
}];

export default exercises;
`,
  'er.ts': `/** Schema ER provvisorio delle due tabelle di esempio. */
import type { ErDiagram } from '../../src/themes/contract.ts';

const diagram: ErDiagram = {
  titolo: 'Schema ER provvisorio',
  entita: [
    { id: 'categoria', tabella: 'categorie', col: 0, riga: 0, attributi: [{ nome: 'id', identificatore: true }, 'nome'] },
    { id: 'elemento', tabella: 'elementi', col: 2, riga: 0, attributi: [{ nome: 'id', identificatore: true }, 'nome'] },
  ],
  associazioni: [{ id: 'contiene', col: 1, riga: 0, tra: [{ entita: 'categoria', card: '(0,N)' }, { entita: 'elemento', card: '(1,1)' }] }],
};

export default diagram;
`,
  'logico.ts': `/** Posizioni provvisorie delle tabelle. */
import type { LogicalLayout } from '../../src/themes/contract.ts';

const layout: LogicalLayout = { tabelle: { categorie: { col: 0, riga: 0 }, elementi: { col: 1, riga: 0 } } };
export default layout;
`,
  'traccia.md': '# Traccia provvisoria\n\nSostituisci questo testo con la traccia del mondo.\n',
  'stile.css': `/* Veste provvisoria: aggiungi qui le regole confinate al tema. */\n.theme[data-theme-id="${id}"] { }\n`,
  'locandina.css': `/* Locandina provvisoria: aggiungi qui le regole confinate al tema. */\n.poster[data-theme-id="${id}"] { }\n`,
};
for (const [name, contents] of Object.entries(files)) {
  writeFileSync(new URL(name, directory), contents, { flag: 'wx' });
}
console.log(`Creato themes/${id}/. Sostituisci i segnaposto seguendo la guida «Aggiungere un tema» nel README.`);
