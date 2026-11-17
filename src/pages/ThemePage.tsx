import { useEffect, useState } from 'react';
import { Icon } from '../icons/Icon.tsx';
import { SECTIONS, formatRoute, type SectionId } from '../routing/route.ts';
import { SandboxSection } from '../sandbox/SandboxSection.tsx';
import { useSandbox } from '../sandbox/useSandbox.ts';
import type { Theme } from '../themes/contract.ts';

/** Guscio delle pagine di un tema: intestazione, le sei sezioni, il contenuto della sezione scelta. */
export function ThemePage({ theme, section }: { theme: Theme; section: SectionId }) {
  const { id, title } = theme.manifest;
  // La sandbox vive con il tema, non con la sezione: cambiando sezione query e database restano.
  const sandbox = useSandbox(theme);
  const [query, setQuery] = useState('');
  const current = SECTIONS.find((s) => s.id === section)!;

  useEffect(() => {
    document.title = `${current.label} · ${title} · SQL Academy`;
  }, [current, title]);

  return (
    <div className="theme" data-theme-id={id}>
      <header className="theme-header">
        <a className="back-link" href="#/">
          <Icon name="circle-arrow-left" />
          Tutti i temi
        </a>
        <p className="theme-name">{title}</p>
      </header>
      <nav className="sections" aria-label="Sezioni del tema">
        <ul>
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={formatRoute({ page: 'theme', themeId: id, section: s.id })}
                aria-current={s.id === section ? 'page' : undefined}
              >
                <Icon name={s.icon} />
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <main className="page">
        <h1>
          <Icon name={current.icon} />
          {current.label}
        </h1>
        {section === 'sandbox' ? (
          <SandboxSection controller={sandbox} query={query} onQueryChange={setQuery} />
        ) : (
          <p className="placeholder">Questa sezione è in preparazione.</p>
        )}
      </main>
    </div>
  );
}
