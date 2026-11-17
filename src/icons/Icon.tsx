import { commonIcons, prepareSvg } from './registry.ts';

interface IconProps {
  /** Nome di un’icona comune (file in `src/assets/icons/`, senza estensione). */
  name?: string;
  /** In alternativa a `name`, il testo di un SVG: per le icone di un tema. */
  svg?: string;
  /** Testo alternativo. Senza, l’icona è decorativa e nascosta alle tecnologie assistive. */
  title?: string;
}

/** Un’icona RB inserita nel testo: alta 1em, del colore del testo. */
export function Icon({ name, svg, title }: IconProps) {
  const source = svg ?? (name ? commonIcons[name] : undefined);
  if (!source) throw new Error(`Icona sconosciuta: ${name ?? '(nessun nome)'}`);
  return <span className="icon-box" dangerouslySetInnerHTML={{ __html: prepareSvg(source, title) }} />;
}
