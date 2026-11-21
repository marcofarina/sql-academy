/** Sezioni e stato di lavoro di un tema. */
import { useEffect, useState } from 'react';
import { Icon } from '../icons/Icon.tsx';
import { SECTIONS, formatRoute, type SectionId } from '../routing/route.ts';
import { SandboxSection } from '../sandbox/SandboxSection.tsx';
import { useSandbox } from '../sandbox/useSandbox.ts';
import { SCHEMES, type Scheme, type Theme, type ThemeIcons } from '../themes/contract.ts';
import { loadScheme, saveScheme } from '../scheme/scheme.ts';
import { ThemeIconsContext } from '../themes/ThemeIconsContext.ts';
import { SectionIndicator } from './SectionIndicator.tsx';
import { SiteLayout } from './SiteLayout.tsx';
import { useProgress } from '../progress/useProgress.ts';
import { TraceSection } from '../trace/TraceSection.tsx';
import { ErSection } from '../er/ErSection.tsx';
import { LogicalSection } from '../logical/LogicalSection.tsx';
import { CatalogSection } from '../training/CatalogSection.tsx';
import { TrainingSection } from '../training/TrainingSection.tsx';
import { useTraining } from '../training/useTraining.ts';

/** Mostra le sei sezioni del tema nella veste scelta. */
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
  // Esercizi e progressi vivono anch’essi con il tema: passano da una sezione all’altra.
  const training = useTraining(theme);
  const { progress, balance, ...progressActions } = useProgress(id);
  const current = SECTIONS.find((s) => s.id === section)!;

  useEffect(() => {
    document.title = `${current.label} · ${title} · SQL Academy`;
  }, [current, title]);

  const switcher = schemes && (
    <div className="scheme-switch" role="group" aria-label="Schema di colori">
      {SCHEMES.map((s) => {
        const emblem = themeIcon(schemes[s].emblem);
        const label = s === 'chiaro' ? 'Chiaro' : 'Scuro';
        return (
          <button key={s} type="button" aria-label={label} aria-pressed={scheme === s} onClick={() => chooseScheme(s)}>
            {emblem && <Icon svg={emblem} />}
            <span className={emblem ? 'site-control-label' : 'scheme-text-fallback'}>{label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <SiteLayout page="theme" theme={{ id, title, emblem: activeIcons.emblem, balance, scheme: schemes ? scheme : undefined, switcher }}>
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
        {/*
          L’addestramento resta montato, nascosto, anche nelle altre sezioni: tiene la sessione in corso
          (`TrainingSection`), che così sopravvive ai cambi di sezione senza essere riletta dall’archivio.
          Fuori dall’addestramento l’indirizzo non ha `item`, quindi qui sotto c’è solo il percorso.
        */}
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
    </SiteLayout>
  );
}
