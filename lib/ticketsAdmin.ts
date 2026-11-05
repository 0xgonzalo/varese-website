import { putFlyer } from '@/lib/ticketsStore';

const MAX_FLYER_BYTES = 4 * 1024 * 1024;
const FLYER_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export interface EventFields {
  title: string;
  event_date: string;
  venue: string;
  ticket_url: string;
}

export function parseEventFields(form: FormData): EventFields | string {
  const str = (k: string) => String(form.get(k) ?? '').trim();
  const fields = {
    title: str('title'),
    event_date: str('event_date'),
    venue: str('venue'),
    ticket_url: str('ticket_url'),
  };

  if (!fields.title || fields.title.length > 200) return 'Título inválido';
  if (!fields.venue || fields.venue.length > 200) return 'Venue inválido';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fields.event_date) || isNaN(Date.parse(fields.event_date))) {
    return 'Fecha inválida';
  }
  try {
    const u = new URL(fields.ticket_url);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') throw new Error();
  } catch {
    return 'Link de entradas inválido';
  }
  return fields;
}

// Returns the public URL, null when no file was sent, or an error
export async function uploadFlyer(form: FormData): Promise<string | null | { error: string }> {
  const file = form.get('flyer');
  if (!(file instanceof File) || file.size === 0) return null;

  const ext = FLYER_TYPES[file.type];
  if (!ext) return { error: 'El flyer tiene que ser JPG, PNG o WEBP' };
  if (file.size > MAX_FLYER_BYTES) return { error: 'El flyer pesa más de 4MB' };

  try {
    return await putFlyer(file, ext);
  } catch (err) {
    console.error('flyer upload failed', err);
    return { error: 'No se pudo subir el flyer' };
  }
}
