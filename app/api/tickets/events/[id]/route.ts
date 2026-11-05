import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdmin } from '@/lib/ticketsServer';
import { deleteFlyer, isStoreConfigured, mutateEvents } from '@/lib/ticketsStore';
import { parseEventFields, uploadFlyer } from '@/lib/ticketsAdmin';
import type { TicketEvent } from '@/lib/tickets';

export const runtime = 'nodejs';

type Ctx = { params: Promise<{ id: string }> };

const notFound = () => NextResponse.json({ error: 'No encontrado' }, { status: 404 });

export async function PATCH(req: Request, { params }: Ctx) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  if (!isStoreConfigured()) return NextResponse.json({ error: 'Server not configured' }, { status: 500 });

  const { id } = await params;
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });

  const fields = parseEventFields(form);
  if (typeof fields === 'string') return NextResponse.json({ error: fields }, { status: 400 });

  const flyer = await uploadFlyer(form);
  if (flyer && typeof flyer === 'object') return NextResponse.json(flyer, { status: 400 });
  const removeFlyer = form.get('remove_flyer') === '1';

  let result: { event: TicketEvent; oldFlyer: string | null } | null;
  try {
    result = await mutateEvents((events) => {
      const current = events.find((e) => e.id === id);
      if (!current) return { events, result: null };
      const event: TicketEvent = {
        ...current,
        ...fields,
        flyer_url: flyer ?? (removeFlyer ? null : current.flyer_url),
      };
      return { events: events.map((e) => (e.id === id ? event : e)), result: { event, oldFlyer: current.flyer_url } };
    });
  } catch (err) {
    console.error('tickets update failed', err);
    await deleteFlyer(flyer);
    return NextResponse.json({ error: 'No se pudo guardar la fecha' }, { status: 500 });
  }

  if (!result) {
    await deleteFlyer(flyer);
    return notFound();
  }
  if (result.oldFlyer !== result.event.flyer_url) await deleteFlyer(result.oldFlyer);

  revalidatePath('/tickets');
  return NextResponse.json({ event: result.event });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  if (!isStoreConfigured()) return NextResponse.json({ error: 'Server not configured' }, { status: 500 });

  const { id } = await params;

  let removed: TicketEvent | null;
  try {
    removed = await mutateEvents((events) => ({
      events: events.filter((e) => e.id !== id),
      result: events.find((e) => e.id === id) ?? null,
    }));
  } catch (err) {
    console.error('tickets delete failed', err);
    return NextResponse.json({ error: 'No se pudo eliminar la fecha' }, { status: 500 });
  }

  if (!removed) return notFound();
  await deleteFlyer(removed.flyer_url);

  revalidatePath('/tickets');
  return NextResponse.json({ ok: true });
}
