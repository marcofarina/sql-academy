import { ClassificaPage } from './classifica/ClassificaPage.tsx';
import { InformativaPage } from './classifica/InformativaPage.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { NotFoundPage } from './pages/NotFoundPage.tsx';
import { ThemePage } from './pages/ThemePage.tsx';
import { useHashRoute } from './routing/useHashRoute.ts';
import { ZainoPage } from './zaino/ZainoPage.tsx';
import { findTheme, themes } from './themes/registry.ts';

export function App() {
  const route = useHashRoute();

  if (route.page === 'home') return <HomePage themes={themes} />;
  if (route.page === 'zaino') return <ZainoPage themes={themes} />;
  if (route.page === 'classifica') return <ClassificaPage themes={themes} />;
  if (route.page === 'informativa') return <InformativaPage />;
  if (route.page === 'not-found') {
    return <NotFoundPage message="L’indirizzo non corrisponde a nessuna sezione del portale." />;
  }
  const theme = findTheme(route.themeId);
  if (!theme) return <NotFoundPage message={`Il tema «${route.themeId}» non esiste.`} />;
  return <ThemePage key={theme.manifest.id} theme={theme} section={route.section} item={route.item} />;
}
