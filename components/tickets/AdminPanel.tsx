'use client';

import { useEffect, useRef, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { HiPencil, HiTrash, HiPlus, HiX, HiPhotograph, HiExternalLink } from 'react-icons/hi';
import { formatEventDate, todayInBuenosAires, type TicketEvent } from '@/lib/tickets';

const MAX_FLYER_SIDE = 1600;

const inputClass =
  'w-full border border-white/40 bg-black px-4 py-3 text-base text-white placeholder-white/40 focus:border-white focus:outline-none transition-colors';
const labelClass = 'mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-white/60';

// Resize big flyers in the browser so uploads stay under the function body limit
async function compressFlyer(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_FLYER_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const toBlob = (type: string) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.85));
  // Safari can't encode WebP and silently returns PNG; use JPEG there
  const webp = await toBlob('image/webp');
  if (webp?.type === 'image/webp') return webp;
  return (await toBlob('image/jpeg')) ?? file;
}

type Editing = TicketEvent | 'new' | null;

export default function AdminPanel({ events, loadError }: { events: TicketEvent[]; loadError: boolean }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Editing>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [listError, setListError] = useState('');

  const today = todayInBuenosAires();
  const upcoming = events.filter((e) => e.event_date >= today);
  const past = events.filter((e) => e.event_date < today).reverse();

  async function handleDelete(id: string) {
    setBusyId(id);
    setListError('');
    try {
      const res = await fetch(`/api/tickets/events/${id}`, { method: 'DELETE' });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'No se pudo eliminar');
      setConfirmDelete(null);
      router.refresh();
    } catch (err) {
      setListError(err instanceof Error ? err.message : 'No se pudo eliminar');
    } finally {
      setBusyId(null);
    }
  }

  async function handleLogout() {
    await fetch('/api/tickets/login', { method: 'DELETE' });
    router.refresh();
  }

  function renderRow(event: TicketEvent, isPast: boolean) {
    const { date, month, day } = formatEventDate(event.event_date);
    return (
      <li
        key={event.id}
        className={`flex items-center gap-4 border-2 border-white/20 bg-white/5 p-3 ${isPast ? 'opacity-50' : ''}`}
      >
        <div className="relative w-14 flex-shrink-0 aspect-[4/5] overflow-hidden border border-white/10 bg-white/5">
          {event.flyer_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={event.flyer_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <HiPhotograph className="absolute inset-0 m-auto text-white/30" size={20} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold tracking-widest text-white/60">
            {day} {date} {month} {event.event_date.slice(0, 4)}
            {isPast && <span className="ml-2 text-white/40">· PASADA</span>}
          </p>
          <p className="truncate font-bold uppercase tracking-wider text-white">{event.title}</p>
          <p className="truncate text-sm text-white/60">{event.venue}</p>
        </div>

        {confirmDelete === event.id ? (
          <div className="flex flex-shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => handleDelete(event.id)}
              disabled={busyId === event.id}
              className="cursor-pointer border-2 border-red-400 px-3 py-1.5 text-[11px] font-semibold tracking-widest text-red-400 transition-colors hover:bg-red-400 hover:text-black disabled:opacity-50"
            >
              {busyId === event.id ? '...' : 'ELIMINAR'}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(null)}
              aria-label="Cancelar"
              className="cursor-pointer p-1.5 text-white/60 transition-colors hover:text-white"
            >
              <HiX size={18} />
            </button>
          </div>
        ) : (
          <div className="flex flex-shrink-0 items-center gap-1">
            <a
              href={event.ticket_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir link de entradas"
              className="p-2 text-white/60 transition-colors hover:text-white"
            >
              <HiExternalLink size={18} />
            </a>
            <button
              type="button"
              onClick={() => setEditing(event)}
              aria-label={`Editar ${event.title}`}
              className="cursor-pointer p-2 text-white/60 transition-colors hover:text-white"
            >
              <HiPencil size={18} />
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(event.id)}
              aria-label={`Eliminar ${event.title}`}
              className="cursor-pointer p-2 text-white/60 transition-colors hover:text-red-400"
            >
              <HiTrash size={18} />
            </button>
          </div>
        )}
      </li>
    );
  }

  return (
    <main className="min-h-screen bg-black px-5 py-10 md:py-14">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold italic tracking-wider text-white">VARESE</h1>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.4em] text-white/60">Tickets Admin</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold tracking-widest">
            <a href="/tickets" target="_blank" className="text-white/60 transition-colors hover:text-white">
              VER PÁGINA
            </a>
            <button type="button" onClick={handleLogout} className="cursor-pointer text-white/60 transition-colors hover:text-white">
              SALIR
            </button>
          </div>
        </header>

        <button
          type="button"
          onClick={() => setEditing('new')}
          className="group relative mb-8 flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden border-2 border-white px-8 py-3.5 text-sm font-semibold tracking-widest text-white transition-all duration-300 hover:scale-[1.02]"
        >
          <HiPlus size={18} className="relative z-10" />
          <span className="relative z-10">AGREGAR FECHA</span>
          <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
        </button>

        {loadError && (
          <p className="mb-6 border border-red-400/50 px-4 py-3 text-sm text-red-400">
            No se pudieron cargar las fechas. Revisá la configuración del servidor.
          </p>
        )}
        {listError && <p className="mb-4 text-sm text-red-400">{listError}</p>}

        <section>
          <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-white/60">
            Próximas ({upcoming.length})
          </h2>
          {upcoming.length === 0 ? (
            <p className="border-2 border-white/10 px-4 py-8 text-center text-sm text-white/40">
              No hay fechas próximas
            </p>
          ) : (
            <ul className="flex flex-col gap-3">{upcoming.map((e) => renderRow(e, false))}</ul>
          )}
        </section>

        {past.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-white/60">
              Pasadas ({past.length}) · no se muestran en /tickets
            </h2>
            <ul className="flex flex-col gap-3">{past.map((e) => renderRow(e, true))}</ul>
          </section>
        )}
      </div>

      {editing && (
        <EventForm
          key={editing === 'new' ? 'new' : editing.id}
          event={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            router.refresh();
          }}
        />
      )}
    </main>
  );
}

function EventForm({
  event,
  onClose,
  onSaved,
}: {
  event: TicketEvent | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(event?.title ?? '');
  const [eventDate, setEventDate] = useState(event?.event_date ?? '');
  const [venue, setVenue] = useState(event?.venue ?? '');
  const [ticketUrl, setTicketUrl] = useState(event?.ticket_url ?? '');
  const [flyerFile, setFlyerFile] = useState<File | null>(null);
  const [flyerPreview, setFlyerPreview] = useState<string | null>(event?.flyer_url ?? null);
  const [removeFlyer, setRemoveFlyer] = useState(false);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Revoke object URLs created for local previews
  useEffect(() => {
    return () => {
      if (flyerPreview?.startsWith('blob:')) URL.revokeObjectURL(flyerPreview);
    };
  }, [flyerPreview]);

  function pickFlyer(file: File | undefined) {
    if (!file) return;
    setFlyerFile(file);
    setFlyerPreview(URL.createObjectURL(file));
    setRemoveFlyer(false);
  }

  function clearFlyer() {
    setFlyerFile(null);
    setFlyerPreview(null);
    setRemoveFlyer(true);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    try {
      const form = new FormData();
      form.set('title', title);
      form.set('event_date', eventDate);
      form.set('venue', venue);
      form.set('ticket_url', ticketUrl);
      if (flyerFile) {
        const blob = await compressFlyer(flyerFile).catch(() => flyerFile);
        form.set('flyer', blob, `flyer.${blob.type.split('/')[1]}`);
      }
      if (removeFlyer && !flyerFile) form.set('remove_flyer', '1');

      const res = await fetch(event ? `/api/tickets/events/${event.id}` : '/api/tickets/events', {
        method: event ? 'PATCH' : 'POST',
        body: form,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'No se pudo guardar');
      onSaved();
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'No se pudo guardar');
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 px-4 py-8 backdrop-blur-sm md:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-form-title"
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg border-2 border-white bg-black p-6 md:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-3 top-3 cursor-pointer p-1.5 text-white/60 transition-colors hover:text-white"
        >
          <HiX size={20} />
        </button>
        <h2 id="event-form-title" className="mb-6 text-2xl font-bold italic uppercase tracking-wider text-white">
          {event ? 'Editar fecha' : 'Nueva fecha'}
        </h2>

        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="ev-title" className={labelClass}>Título</label>
            <input
              id="ev-title"
              required
              maxLength={200}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Varese 360º"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ev-date" className={labelClass}>Fecha</label>
              <input
                id="ev-date"
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className={`${inputClass} [color-scheme:dark]`}
              />
            </div>
            <div>
              <label htmlFor="ev-venue" className={labelClass}>Venue</label>
              <input
                id="ev-venue"
                required
                maxLength={200}
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="U House, Buenos Aires"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label htmlFor="ev-url" className={labelClass}>Link de entradas</label>
            <input
              id="ev-url"
              type="url"
              required
              value={ticketUrl}
              onChange={(e) => setTicketUrl(e.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </div>

          <div>
            <span className={labelClass}>Flyer</span>
            <div className="flex items-center gap-4">
              <div className="relative w-20 flex-shrink-0 aspect-[4/5] overflow-hidden border border-white/20 bg-white/5">
                {flyerPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={flyerPreview} alt="Preview del flyer" className="h-full w-full object-cover" />
                ) : (
                  <HiPhotograph className="absolute inset-0 m-auto text-white/30" size={24} />
                )}
              </div>
              <div className="flex flex-col items-start gap-2">
                <input
                  ref={fileRef}
                  id="ev-flyer"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => pickFlyer(e.target.files?.[0])}
                  className="sr-only"
                />
                <label
                  htmlFor="ev-flyer"
                  className="cursor-pointer border border-white/40 px-4 py-2 text-[11px] font-semibold tracking-widest text-white transition-colors hover:border-white"
                >
                  {flyerPreview ? 'CAMBIAR FLYER' : 'SUBIR FLYER'}
                </label>
                {flyerPreview && (
                  <button
                    type="button"
                    onClick={clearFlyer}
                    className="cursor-pointer text-[11px] font-semibold tracking-widest text-white/50 transition-colors hover:text-red-400"
                  >
                    QUITAR
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="group relative mt-8 w-full cursor-pointer overflow-hidden border-2 border-white px-8 py-3.5 text-sm font-semibold tracking-widest text-white transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
        >
          <span className="relative z-10">{status === 'submitting' ? 'GUARDANDO...' : 'GUARDAR'}</span>
          <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
        </button>
        {status === 'error' && <p className="mt-3 text-center text-sm text-red-400">{errorMsg}</p>}
      </form>
    </div>
  );
}
