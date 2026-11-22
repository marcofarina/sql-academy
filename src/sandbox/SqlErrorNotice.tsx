/** Riquadro degli errori SQL, condiviso da sandbox e addestramento. */

import { Icon } from '../icons/Icon.tsx';
import { explainSqlError } from './explainSqlError.ts';
import type { TableInfo } from './session.ts';

/** Mostra la spiegazione, l’indizio e il messaggio originale di SQLite. */
export function SqlErrorNotice({ message, tables }: { message: string; tables: readonly TableInfo[] }) {
  const { text, hint } = explainSqlError(message, tables);
  return (
    <div className="notice notice-error sql-error" role="alert">
      <Icon name="circle-xmark" />
      <div>
        <p className="notice-title">{text}</p>
        <p>{hint}</p>
        <pre>{message}</pre>
      </div>
    </div>
  );
}
