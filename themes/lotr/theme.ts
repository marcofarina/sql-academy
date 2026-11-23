import type { ThemeManifest } from '../../src/themes/contract.ts';

const manifest: ThemeManifest = {
  id: 'lotr',
  title: 'Il Signore degli Anelli',
  level: 'intermedio',
  description: 'Popoli, personaggi, battaglie e viaggi della Terra di Mezzo alla fine della Terza Era.',
  motto: 'Una query per trovarli, una query per contarli, una query per ghermirli e con un JOIN incatenarli.',
  icons: { sections: { sandbox: 'one-ring' }, session: 'hobbit-backpack', reset: 'volcano' },
  schemes: {
    chiaro: { emblem: 'wizard-staff', empty: 'hobbit-door' },
    scuro: { emblem: 'eye-of-sauron', empty: 'durin-door' },
  },
};

export default manifest;
