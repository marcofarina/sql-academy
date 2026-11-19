import { Icon } from '../icons/Icon.tsx';
import { formatRoute } from '../routing/route.ts';

/** Il collegamento alla pagina della classifica, nelle intestazioni. */
export function ClassificaLink() {
  return (
    <a className="zaino-link classifica-link" href={formatRoute({ page: 'classifica' })}>
      <Icon name="trophy" />
      Classifica
    </a>
  );
}
