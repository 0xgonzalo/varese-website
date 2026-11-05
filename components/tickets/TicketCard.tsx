import Image from 'next/image';
import { HiArrowRight } from 'react-icons/hi';
import { formatEventDate, type TicketEvent } from '@/lib/tickets';

// 'row': flyer beside the text (/tickets). 'grid': stacked on mobile so two fit side by side,
// row from md up (home banner).
export default function TicketCard({
  event,
  layout = 'row',
  cta = 'ENTRADAS',
}: {
  event: TicketEvent;
  layout?: 'row' | 'grid';
  cta?: string;
}) {
  const { date, month, day } = formatEventDate(event.event_date);
  const grid = layout === 'grid';

  return (
    <a
      href={event.ticket_url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex h-full border-2 border-white/20 bg-gradient-to-b from-white/5 to-black/40 p-3 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-white/60 ${
        grid ? 'flex-col gap-3 md:flex-row md:items-stretch md:gap-4' : 'items-stretch gap-4'
      }`}
    >
      <div
        className={`relative flex-shrink-0 self-start aspect-[4/5] overflow-hidden border border-white/10 bg-white/5 ${
          grid ? 'w-full md:w-28' : 'w-24 md:w-28'
        }`}
      >
        {event.flyer_url ? (
          <Image
            src={event.flyer_url}
            alt={`Flyer ${event.title}`}
            fill
            sizes={grid ? '(min-width: 768px) 112px, 50vw' : '112px'}
            className="object-cover"
          />
        ) : (
          <span className="absolute inset-0 m-auto flex items-center justify-center text-sm font-bold italic tracking-wider text-white/40">
            VARESE
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between md:py-1">
        <div>
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className={`font-bold italic leading-none text-white ${grid ? 'text-2xl md:text-4xl' : 'text-3xl md:text-4xl'}`}>
              {date}
            </span>
            <span className={`font-bold text-white ${grid ? 'text-sm md:text-lg' : 'text-base md:text-lg'}`}>{month}</span>
            <span className="text-xs text-white/60">{day}</span>
          </div>
          <h3
            className={`mt-2 font-bold uppercase leading-tight tracking-wider text-white break-words ${
              grid ? 'text-xs md:text-lg' : 'text-base md:text-lg'
            }`}
          >
            {event.title}
          </h3>
          <p className={`mt-1 uppercase tracking-wide text-white/60 break-words ${grid ? 'text-[10px] md:text-sm' : 'text-xs md:text-sm'}`}>
            {event.venue}
          </p>
        </div>
        <span
          className={`mt-3 inline-flex items-center justify-center gap-2 border-2 border-white font-semibold tracking-widest text-white transition-colors duration-300 group-hover:bg-white group-hover:text-black ${
            grid ? 'w-full px-2 py-1.5 text-[10px] md:w-auto md:self-start md:px-4 md:text-xs' : 'self-start px-4 py-1.5 text-[11px] md:text-xs'
          }`}
        >
          {cta}
          <HiArrowRight size={14} className="flex-shrink-0" />
        </span>
      </div>
    </a>
  );
}
