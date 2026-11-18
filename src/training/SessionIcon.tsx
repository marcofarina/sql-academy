import { Icon } from '../icons/Icon.tsx';
import { useThemeIcons } from '../themes/ThemeIconsContext.ts';

/** Icona dei pulsanti che avviano una sessione: quella del tema, se la dichiara, altrimenti `rocket`. */
export function SessionIcon() {
  const { session } = useThemeIcons();
  return session ? <Icon svg={session} /> : <Icon name="rocket" />;
}
