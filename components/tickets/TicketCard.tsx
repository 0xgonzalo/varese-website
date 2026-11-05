import Image from 'next/image';
import { HiArrowRight } from 'react-icons/hi';
import { formatEventDate, type TicketEvent } from '@/lib/tickets';

export default function TicketCard({ event, cta = 'ENTRADAS' }: { event: TicketEvent; cta?: string }) {
  const { date, month, day } = formatEventDate(event.event_date);

  return (
    <a
      href={event.ticket_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full items-stretch gap-4 border-2 border-white/20 bg-gradient-to-b from-white/5 to-black/40 p-3 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-white/60"
    >
      <div className="relative w-24 md:w-28 flex-shrink-0 self-start aspect-[4/5] overflow-hidden border border-white/10 bg-white/5">
        {event.flyer_url ? (
          <Image src={event.flyer_url} alt={`Flyer ${event.title}`} fill sizes="112px" className="object-cover" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold italic tracking-wider text-white/40">
            VARESE
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl md:text-4xl font-bold italic leading-none text-white">{date}</span>
            <span className="text-base md:text-lg font-bold text-white">{month}</span>
            <span className="text-xs text-white/60">{day}</span>
          </div>
          <h3 className="mt-2 text-base md:text-lg font-bold uppercase leading-tight tracking-wider text-white break-words">
            {event.title}
          </h3>
          <p className="mt-1 text-xs md:text-sm uppercase tracking-wide text-white/60 break-words">{event.venue}</p>
        </div>
        <span className="mt-3 inline-flex items-center gap-2 self-start border-2 border-white px-4 py-1.5 text-[11px] md:text-xs font-semibold tracking-widest text-white transition-colors duration-300 group-hover:bg-white group-hover:text-black">
          {cta}
          <HiArrowRight size={14} />
        </span>
      </div>
    </a>
  );
}
