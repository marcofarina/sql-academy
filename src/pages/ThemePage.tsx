import { useEffect, useState } from 'react';
import { Icon } from '../icons/Icon.tsx';
import { SECTIONS, formatRoute, type SectionId } from '../routing/route.ts';
import { SandboxSection } from '../sandbox/SandboxSection.tsx';
import { useSandbox } from '../sandbox/useSandbox.ts';
import { SCHEMES, type Scheme, type Theme, type ThemeIcons } from '../themes/contract.ts';
import { loadScheme, saveScheme } from '../scheme/scheme.ts';
import { ThemeIconsContext } from '../themes/ThemeIconsContext.ts';
import { SectionIndicator } from './SectionIndicator.tsx';
import { useProgress } from '../progress/useProgress.ts';
import { Balance } from '../points/Balance.tsx';
import { ClassificaLink } from '../classifica/ClassificaLink.tsx';
import { ZainoLink } from '../zaino/ZainoLink.tsx';
import { TraceSection } from '../trace/TraceSection.tsx';
import { ErSection } from '../er/ErSection.tsx';
import { LogicalSection } from '../logical/LogicalSection.tsx';
import { CatalogSection } from '../training/CatalogSection.tsx';
import { TrainingSection } from '../training/TrainingSection.tsx';
import { useTraining } from '../training/useTraining.ts';

/** Guscio delle pagine di un tema: intestazione, le sei sezioni, il contenuto della sezione scelta. */
export function ThemePage({ theme, section, item }: { theme: Theme; section: SectionId; item?: string }) {
  const { id, title, schemes } = theme.manifest;
  const [scheme, setScheme] = useState<Scheme>(() => loadScheme(id));
  const chooseScheme = (next: Scheme) => {
    setScheme(next);
    saveScheme(id, next);
  };
  // Le icone del tema valide ora: quelle comuni, sostituite da quelle dello schema.
  const icons: ThemeIcons = { ...theme.manifest.icons, ...(schemes ? schemes[scheme] : {}) };
  const themeIcon = (name?: string) => (name ? theme.icons[name] : undefined);
  const activeIcons = { emblem: themeIcon(icons.emblem), solved: themeIcon(icons.solved), empty: themeIcon(icons.empty), session: themeIcon(icons.session), reset: themeIcon(icons.reset) };
  // Icona di una sezione: quella del tema, se la dichiara, altrimenti quella comune.
  const sectionIcon = (s: (typeof SECTIONS)[number]) => {
    const svg = themeIcon(icons.sections?.[s.id]);
    return svg ? <Icon svg={svg} /> : <Icon name={s.icon} />;
  };
  // La sandbox vive con il tema, non con la sezione: cambiando sezione query e database restano.
  const sandbox = useSandbox(theme);
  const [query, setQuery] = useState('');
  // Esercizi, progressi e sessione vivono anch’essi con il tema: passano da una sezione all’altra.
  const training = useTraining(theme);
  const { progress, balance, ...progressActions } = useProgress(id);
  const current = SECTIONS.find((s) => s.id === section)!;

  useEffect(() => {
    document.title = `${current.label} · ${title} · SQL Academy`;
  }, [current, title]);

  return (
    <div className="theme" data-theme-id={id} data-scheme={schemes ? scheme : undefined}>
      <header className="theme-header">
        <a className="back-link" href="#/">
          <Icon name="circle-arrow-left" />
          Tutti i temi
        </a>
        <div className="theme-identity">
          <p className="theme-name">
            {activeIcons.emblem && <Icon svg={activeIcons.emblem} />}
            {title}
          </p>
          <Balance balance={balance} />
          <ZainoLink />
          <ClassificaLink />
          {schemes && (
            <div className="scheme-switch" role="group" aria-label="Schema di colori">
              {SCHEMES.map((s) => (
                <button key={s} type="button" aria-pressed={scheme === s} onClick={() => chooseScheme(s)}>
                  {themeIcon(schemes[s].emblem) && <Icon svg={themeIcon(schemes[s].emblem)} />}
                  {s === 'chiaro' ? 'Chiaro' : 'Scuro'}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>
      <nav className="sections" aria-label="Sezioni del tema">
        <ul>
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={formatRoute({ page: 'theme', themeId: id, section: s.id })}
                aria-current={s.id === section ? 'page' : undefined}
              >
                {sectionIcon(s)}
                {s.label}
              </a>
            </li>
          ))}
          <SectionIndicator section={section} />
        </ul>
      </nav>
      <ThemeIconsContext value={activeIcons}>
      <main className="page">
        {/* La traccia usa come titolo quello del suo testo. */}
        {section !== 'traccia' && (
          <h1>
            {sectionIcon(current)}
            {current.label}
          </h1>
        )}
        <div hidden={section !== 'addestramento'}>
          <TrainingSection
            themeId={id}
            item={item}
            training={training}
            progress={progress}
            actions={progressActions}
          />
        </div>
        {section === 'sandbox' ? (
          <SandboxSection controller={sandbox} query={query} onQueryChange={setQuery} />
        ) : section === 'addestramento' ? null : section === 'query' ? (
          <CatalogSection themeId={id} training={training} progress={progress} />
        ) : section === 'traccia' ? (
          <TraceSection theme={theme} icon={sectionIcon(current)} />
        ) : section === 'er' ? (
          <ErSection theme={theme} />
        ) : section === 'logico' ? (
          <LogicalSection theme={theme} controller={sandbox} />
        ) : (
          <p className="placeholder">Questa sezione è in preparazione.</p>
        )}
      </main>
      </ThemeIconsContext>
    </div>
  );
}
