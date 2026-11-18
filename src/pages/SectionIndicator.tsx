import { useEffect, useLayoutEffect, useRef } from 'react';

/**
 * Indicatore della sezione attiva: un solo elemento nella lista delle sezioni,
 * che il guscio posiziona sopra la voce attiva e fa scorrere al cambio di sezione.
 * L’aspetto lo disegna la veste del tema (vedi `src/themes/contract.ts`).
 *
 * Sta dentro la lista, quindi scorre con lei quando la lista scorre in orizzontale.
 */
export function SectionIndicator({ section }: { section: string }) {
  const ref = useRef<HTMLLIElement>(null);
  const placed = useRef(false);

  // Al cambio di sezione: viaggio animato, tranne al primo disegno.
  useLayoutEffect(() => {
    place(ref.current, placed.current);
    placed.current = true;
  }, [section]);

  // Finestra ridimensionata, caratteri caricati, voci che vanno a capo: salto senza viaggio.
  useEffect(() => {
    const list = ref.current?.parentElement;
    if (!list) return;
    const observer = new ResizeObserver(() => place(ref.current, false));
    observer.observe(list);
    for (const link of list.querySelectorAll('a')) observer.observe(link);
    return () => observer.disconnect();
  }, []);

  return <li ref={ref} className="sections-indicator" aria-hidden="true" />;
}

function place(indicator: HTMLElement | null, animate: boolean) {
  const link = indicator?.parentElement?.querySelector<HTMLElement>('a[aria-current="page"]');
  if (!indicator || !link) return;
  indicator.style.transition = animate ? '' : 'none';
  indicator.style.transform = `translate(${link.offsetLeft}px, ${link.offsetTop}px)`;
  indicator.style.width = `${link.offsetWidth}px`;
  indicator.style.height = `${link.offsetHeight}px`;
}
