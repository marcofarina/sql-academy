/** Un contrassegno del mondo nei colori definiti dalla sua locandina. */

/** Mostra il fondo e l’anello del mondo accanto al suo nome. */
export function MondoPallino({ id }: { id: string }) {
  return <span className="poster mondo-pallino" data-theme-id={id} aria-hidden="true" />;
}
