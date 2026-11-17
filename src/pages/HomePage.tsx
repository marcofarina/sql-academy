import { formatRoute } from '../routing/route.ts';
import type { Theme } from '../themes/contract.ts';

/** Elenco dei temi. */
export function HomePage({ themes }: { themes: Theme[] }) {
  return (
    <main className="page">
      <h1>SQL Academy</h1>
      <p className="lead">Scegli un tema: ogni tema ha il suo database da interrogare e i suoi esercizi.</p>
      <ul className="theme-list">
        {themes.map(({ manifest }) => (
          <li key={manifest.id}>
            <a href={formatRoute({ page: 'theme', themeId: manifest.id, section: 'sandbox' })}>
              <span className="theme-title">{manifest.title}</span>
              <span className="theme-description">{manifest.description}</span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
