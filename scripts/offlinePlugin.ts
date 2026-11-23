/** Emette il service worker e l’elenco verificabile dei file della build. */
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';
import type { Plugin } from 'vite';

const WORKER = 'service-worker.js';

function filePaths(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) {
      return filePaths(join(dir, entry.name)).map((path) => `${entry.name}/${path}`);
    }
    return entry.isFile() ? [entry.name] : [];
  });
}

/** Inserisce nel worker le impronte dei file, compresi quelli copiati da `public/`. */
export function offlinePlugin(): Plugin {
  return {
    name: 'sql-academy-offline',
    apply: 'build',
    writeBundle: {
      order: 'post',
      handler({ dir }) {
        if (!dir || this.environment.name !== 'client') return;
        const source = readFileSync(new URL('../src/offline/service-worker.ts', import.meta.url), 'utf8');
        const script = ts.transpileModule(source, {
          compilerOptions: { module: ts.ModuleKind.None, target: ts.ScriptTarget.ES2022 },
        }).outputText;
        const files = filePaths(dir).filter((path) => path !== WORKER).sort().map((path) => {
          const integrity = createHash('sha256').update(readFileSync(join(dir, path))).digest('base64');
          return [`./${path.split('/').map(encodeURIComponent).join('/')}`, `sha256-${integrity}`];
        });
        const version = createHash('sha256').update(JSON.stringify(files)).update(script).digest('hex');
        writeFileSync(join(dir, WORKER), `const build = ${JSON.stringify({ version, files })};\n${script}`);
      },
    },
  };
}
