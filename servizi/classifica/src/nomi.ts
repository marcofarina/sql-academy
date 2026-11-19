/**
 * Nomi della classifica: «Animale Aggettivo Numero», per esempio «Lontra
 * Tenace 42». Gli aggettivi finiscono tutti in -e, così valgono per animali
 * maschili e femminili senza accordo. Liste neutre rispetto ai temi (il nome
 * vale in tutta la classifica) e controllate a mano: niente animali usati come
 * insulto o in gergo, niente aggettivi sull’aspetto, niente numeri in codice.
 *
 * 39 animali × 31 aggettivi × 86 numeri = 103.974 nomi. L’unicità la garantisce
 * il vincolo `UNIQUE` di `partecipanti.nome`.
 *
 * Cambiare le liste non cambia i nomi già assegnati.
 */

export const ANIMALI = [
  'Airone', 'Allodola', 'Ape', 'Camoscio', 'Canguro', 'Capriolo', 'Castoro',
  'Cigno', 'Colibrì', 'Delfino', 'Ermellino', 'Falco', 'Fenicottero',
  'Formica', 'Gabbiano', 'Gazzella', 'Ghepardo', 'Giaguaro', 'Giraffa',
  'Koala', 'Lemure', 'Leone', 'Lepre', 'Lince', 'Lontra', 'Lupo', 'Panda',
  'Pettirosso', 'Picchio', 'Pinguino', 'Puma', 'Riccio', 'Rondine',
  'Scoiattolo', 'Stambecco', 'Tasso', 'Tigre', 'Usignolo', 'Zebra',
] as const;

export const AGGETTIVI = [
  'Abile', 'Agile', 'Audace', 'Brillante', 'Celeste', 'Cortese', 'Costante',
  'Elegante', 'Fedele', 'Felice', 'Forte', 'Geniale', 'Gentile', 'Leale',
  'Lucente', 'Mite', 'Nobile', 'Paziente', 'Perspicace', 'Pimpante',
  'Prudente', 'Sagace', 'Sapiente', 'Scattante', 'Solare', 'Splendente',
  'Tenace', 'Valente', 'Veloce', 'Vigile', 'Vivace',
] as const;

/** Numeri esclusi: 14, 18 e 88 sono codici neonazisti, 69 un doppio senso. */
const ESCLUSI = new Set([14, 18, 69, 88]);

export const NUMERI: readonly number[] = Array.from({ length: 90 }, (_, i) => i + 10).filter(
  (n) => !ESCLUSI.has(n),
);

function aCaso<T>(lista: readonly T[]): T {
  const [x] = crypto.getRandomValues(new Uint32Array(1));
  // Il resto introduce una distorsione di circa una parte su 40 milioni: trascurabile.
  return lista[x % lista.length];
}

export function nomeACaso(): string {
  return `${aCaso(ANIMALI)} ${aCaso(AGGETTIVI)} ${aCaso(NUMERI)}`;
}
