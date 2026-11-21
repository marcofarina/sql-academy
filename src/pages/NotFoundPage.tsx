/** Risposta a un indirizzo che il portale non riconosce. */
import { useEffect } from 'react';

/** Pagina per un indirizzo che non corrisponde a nessun tema o sezione. */
export function NotFoundPage({ message }: { message: string }) {
  useEffect(() => {
    document.title = 'Pagina non trovata · SQL Academy';
  }, []);

  return (
    <main className="page">
      <h1>Pagina non trovata</h1>
      <p>{message}</p>
    </main>
  );
}
