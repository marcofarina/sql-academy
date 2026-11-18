import type { ThemeManifest } from '../../src/themes/contract.ts';

const manifest: ThemeManifest = {
  id: 'star-wars',
  title: 'Star Wars',
  description: 'Pianeti, personaggi e fazioni di una galassia lontana lontana.',
  motto: 'Una galassia lontana lontana, in sette tabelle.',
  icons: { solved: 'lightsabers-crossed', reset: 'battle-station-damaged' },
  schemes: {
    chiaro: { emblem: 'rebel-alliance', empty: 'x-wing', session: 'x-wing' },
    scuro: { emblem: 'galactic-empire', empty: 'battle-station', session: 'tie-fighter' },
  },
};

export default manifest;
