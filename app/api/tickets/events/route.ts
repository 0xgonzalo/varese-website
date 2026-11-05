import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdmin } from '@/lib/ticketsServer';
import { deleteFlyer, isStoreConfigured, mutateEvents } from '@/lib/ticketsStore';
import { parseEventFields, uploadFlyer } from '@/lib/ticketsAdmin';
import type { TicketEvent } from '@/lib/tickets';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  if (!isStoreConfigured()) return NextResponse.json({ error: 'Server not configured' }, { status: 500 });

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });

  const fields = parseEventFields(form);
  if (typeof fields === 'string') return NextResponse.json({ error: fields }, { status: 400 });

  const flyer = await uploadFlyer(form);
  if (flyer && typeof flyer === 'object') return NextResponse.json(flyer, { status: 400 });

  const event: TicketEvent = { id: crypto.randomUUID(), ...fields, flyer_url: flyer };
  try {
    await mutateEvents((events) => ({ events: [...events, event], result: null }));
  } catch (err) {
    console.error('tickets create failed', err);
    await deleteFlyer(flyer);
    return NextResponse.json({ error: 'No se pudo guardar la fecha' }, { status: 500 });
  }

  revalidatePath('/tickets');
  return NextResponse.json({ event });
}
