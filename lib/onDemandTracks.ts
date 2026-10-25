// Tracks available for the "Varese On Demand" vote (04.11).
// The API only accepts titles from this list.
export const ON_DEMAND_TRACKS: string[] = [
  // Estamos Despiertos (EP, 2018)
  'Llegando al Cielo',
  'La Noche',
  'La Salida',
  'La Marea',
  // Desaparecer
  'Desaparecer',
  'Luces del Bosque',
  'Sábanas y Mambos',
  'Fiebre',
  'Sol de Noche',
  'Flores de Marzo',
  // Singles (antes de 2023)
  'Va a Terminar',
  'Ruido',
  'Dormido',
  'Desorden',
  'Derrumbe',
  'Naufragio',
  'Testigo',
  // UNO (2023)
  'Ficción',
  'Fuera de Lugar',
  'Ciclos',
  'UNO',
  'Víctima del Éxtasis',
  'KRAUT!',
  'Paranoia',
  'Desencuentro',
  'Veneno',
  // TREGUA (2025)
  'Marcas',
  'Dejar Todo',
  'VIP',
  'Esto queda entre nosotros',
  'Melatonina',
  'Vértigo',
  'Control',
  'Caer',
  'Sí o Sí',
  // A La Deriva (2025)
  'A la Deriva',
  'No es Buenos Aires',
];

export const MAX_TRACKS_PER_VOTE = 10;

export function normalize(text: string) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}
