/** Sceglie il contenuto del portale e la destinazione del ritorno. */
import { ClassificaPage } from './classifica/ClassificaPage.tsx';
import { InformativaPage } from './classifica/InformativaPage.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { NotFoundPage } from './pages/NotFoundPage.tsx';
import { SiteLayout } from './pages/SiteLayout.tsx';
import { ThemePage } from './pages/ThemePage.tsx';
import { returnLink } from './routing/route.ts';
import { useHashRoute } from './routing/useHashRoute.ts';
import { ZainoPage } from './zaino/ZainoPage.tsx';
import { findTheme, themes } from './themes/registry.ts';

/** Mostra la pagina corrispondente all’indirizzo corrente. */
export function App() {
  const { route, previousHash } = useHashRoute();

  if (route.page === 'theme') {
    const theme = findTheme(route.themeId);
    if (theme) {
      return <ThemePage key={theme.manifest.id} theme={theme} section={route.section} item={route.item} />;
    }
  }
  if (route.page === 'home') {
    return <SiteLayout page="home"><HomePage themes={themes} /></SiteLayout>;
  }

  const back = returnLink(previousHash, (id) => findTheme(id)?.manifest.title);
  const page = route.page === 'theme' ? 'not-found' : route.page;
  const error = route.page === 'theme'
    ? `Il tema «${route.themeId}» non esiste.`
    : 'L’indirizzo non corrisponde a nessuna sezione del portale.';

  return (
    <SiteLayout page={page} back={back}>
      {page === 'zaino' ? <ZainoPage themes={themes} />
        : page === 'classifica' ? <ClassificaPage themes={themes} />
        : page === 'informativa' ? <InformativaPage />
        : <NotFoundPage message={error} />}
    </SiteLayout>
  );
}
