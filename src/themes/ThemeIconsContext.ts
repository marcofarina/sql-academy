import { createContext, useContext } from 'react';

/**
 * Le icone proprie del tema nello schema attivo, già risolte in testo SVG
 * (vedi `ThemeIcons` in `contract.ts`). Le fornisce il guscio del tema; i
 * componenti comuni le mostrano solo se presenti.
 */
export interface ActiveThemeIcons {
  emblem?: string;
  solved?: string;
  empty?: string;
  session?: string;
}

export const ThemeIconsContext = createContext<ActiveThemeIcons>({});

export function useThemeIcons(): ActiveThemeIcons {
  return useContext(ThemeIconsContext);
}
