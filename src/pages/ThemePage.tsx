/** Sezioni e stato di lavoro di un tema. */
import { useEffect, useState } from 'react';
import { Icon } from '../icons/Icon.tsx';
import { SECTIONS, formatRoute, type SectionId, type ThemeRoute } from '../routing/route.ts';
import { SandboxSection } from '../sandbox/SandboxSection.tsx';
import { useSandbox } from '../sandbox/useSandbox.ts';
import { SCHEMES, type Scheme, type Theme, type ThemeIcons } from '../themes/contract.ts';
import { loadScheme, saveScheme } from '../scheme/scheme.ts';
import { SchemeSwitch, type SchemeIcon } from '../scheme/SchemeSwitch.tsx';
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
import { guideSeen, markGuideSeen } from '../guide/guide.ts';
import { GUIDE_ID, ThemeGuide } from '../guide/ThemeGuide.tsx';

/** Mostra le sei sezioni del tema nella veste scelta. */
export function ThemePage({ theme, section, item, consegna }: { theme: Theme; section: SectionId; item?: string; consegna?: ThemeRoute['consegna'] }) {
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
  // La guida compare da sola al primo ingresso; dopo si riapre dal pulsante «Guida» della barra.
  const [guide, setGuide] = useState<'chiusa' | 'aperta' | 'riaperta'>(() => (guideSeen() ? 'chiusa' : 'aperta'));
  const openGuide = () => {
    if (guide === 'chiusa') setGuide('riaperta');
    else document.getElementById(GUIDE_ID)?.focus();
  };
  const closeGuide = () => {
    markGuideSeen();
    setGuide('chiusa');
    document.querySelector<HTMLElement>(`[aria-controls="${GUIDE_ID}"]`)?.focus();
  };

  useEffect(() => {
    document.title = `${current.label} · ${title} · SQL Academy`;
  }, [current, title]);

  const schemeIcons: Partial<Record<Scheme, SchemeIcon>> = {};
  for (const s of SCHEMES) {
    const svg = schemes && themeIcon(schemes[s].emblem);
    if (svg) schemeIcons[s] = { svg };
  }
  const switcher = schemes && <SchemeSwitch scheme={scheme} onChoose={chooseScheme} icons={schemeIcons} />;

  return (
    <SiteLayout
      page="theme"
      theme={{ id, title, emblem: activeIcons.emblem, balance, scheme: schemes ? scheme : undefined, switcher }}
      guide={{ open: guide !== 'chiusa', onOpen: openGuide }}
    >
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
        {guide !== 'chiusa' && <ThemeGuide focus={guide === 'riaperta'} onClose={closeGuide} />}
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
            consegna={consegna}
            training={training}
            progress={progress}
            actions={progressActions}
          />
        </div>
        {section === 'sandbox' ? (
          <SandboxSection theme={theme} controller={sandbox} query={query} onQueryChange={setQuery} />
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
