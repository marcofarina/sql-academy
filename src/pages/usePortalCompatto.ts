/** La disposizione compatta delle pagine Zaino e Classifica. */
import { useSyncExternalStore } from 'react';

const MEDIA = '(max-width: 48rem)';

function iscriviti(notifica: () => void) {
  const media = matchMedia(MEDIA);
  media.addEventListener('change', notifica);
  return () => media.removeEventListener('change', notifica);
}

/** Segue lo stesso punto di adattamento dei fogli di stile delle due pagine. */
export function usePortalCompatto() {
  return useSyncExternalStore(iscriviti, () => matchMedia(MEDIA).matches, () => false);
}
