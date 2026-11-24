/** Impaginazione comune del portale, con la barra nella veste della pagina. */
import type { ReactNode } from 'react';
import { SiteFooter } from '../footer/SiteFooter.tsx';
import { Icon } from '../icons/Icon.tsx';
import { UpdateNotice } from '../offline/UpdateNotice.tsx';
import { Balance } from '../points/Balance.tsx';
import { formatRoute, type Route } from '../routing/route.ts';
import { GUIDE_ID } from '../guide/ThemeGuide.tsx';
import { SchemeSwitch } from '../scheme/SchemeSwitch.tsx';
import { chooseSiteScheme, useSiteScheme } from '../scheme/siteScheme.ts';
import type { Scheme } from '../themes/contract.ts';
import { ZainoLink } from '../zaino/ZainoLink.tsx';

type LayoutPage =
  | {
      page: 'theme';
      theme: { id: string; title: string; emblem?: string; balance: number; scheme?: Scheme; switcher?: ReactNode };
      /** La guida del tema (F16): se è aperta e come riaprirla. */
      guide: { open: boolean; onOpen(): void };
    }
  | { page: 'home' }
  | { page: Exclude<Route['page'], 'home' | 'theme'>; back: { href: string; label: string } };

/** Mostra la navigazione del sito sopra il contenuto della pagina. */
export function SiteLayout(props: LayoutPage & { children: ReactNode }) {
  const { page, children } = props;
  const theme = page === 'theme' ? props.theme : undefined;
  const siteScheme = useSiteScheme();

  return (
    <div className={theme ? 'site-layout theme' : 'site-layout'} data-theme-id={theme?.id} data-scheme={theme ? theme.scheme : siteScheme}>
      <header className={`site-bar site-bar--${page === 'home' ? 'home' : page === 'theme' ? 'theme' : 'portal'}`}>
        <a className="site-brand" href={formatRoute({ page: 'home' })}>SQL Academy</a>
        {theme && (
          <p className="site-identity theme-name">
            {theme.emblem && <Icon svg={theme.emblem} />}
            <span className="theme-name-text">{theme.title}</span>
          </p>
        )}
        {page !== 'home' && page !== 'theme' && (
          <a className="site-identity site-back" href={props.back.href}>
            <Icon name="circle-arrow-left" />
            {props.back.label}
          </a>
        )}
        {theme && <Balance balance={theme.balance} />}
        {page === 'theme' && (
          <button
            type="button"
            className="site-guide"
            aria-controls={GUIDE_ID}
            aria-expanded={props.guide.open}
            aria-label="Guida"
            onClick={props.guide.onOpen}
          >
            <Icon name="circle-question" />
            <span className="site-control-label">Guida</span>
          </button>
        )}
        <ZainoLink current={page === 'zaino'} />
        <a
          className="site-ranking"
          href={formatRoute({ page: 'classifica' })}
          aria-current={page === 'classifica' ? 'page' : undefined}
          aria-label="Classifica"
        >
          <Icon name="trophy" />
          <span className="site-control-label">Classifica</span>
        </a>
        {theme ? theme.switcher : (
          <SchemeSwitch scheme={siteScheme} onChoose={chooseSiteScheme} icons={{ chiaro: { name: 'sun' }, scuro: { name: 'moon' } }} />
        )}
      </header>
      <UpdateNotice />
      {children}
      <SiteFooter />
    </div>
  );
}
