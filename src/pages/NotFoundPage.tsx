import { Icon } from '../icons/Icon.tsx';

/** Pagina per un indirizzo che non corrisponde a nessun tema o sezione. */
export function NotFoundPage({ message }: { message: string }) {
  return (
    <main className="page">
      <h1>Pagina non trovata</h1>
      <p>{message}</p>
      <p>
        <a className="back-link" href="#/">
          <Icon name="circle-arrow-left" />
          Torna all’elenco dei temi
        </a>
      </p>
    </main>
  );
}
