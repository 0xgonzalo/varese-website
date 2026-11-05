'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import TicketCard from '@/components/tickets/TicketCard';
import type { TicketEvent } from '@/lib/tickets';

export default function HomeTickets({ events }: { events: TicketEvent[] }) {
  const { language } = useLanguage();
  if (events.length === 0) return null;

  return (
    <section id="tickets" className="relative w-full bg-black px-3 py-8 md:px-8 md:py-12">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-5 flex items-baseline justify-between gap-4 md:mb-8">
          <h2 className="text-2xl md:text-4xl font-bold italic tracking-wider text-white">TICKETS</h2>
          <Link href="/tickets" className="text-[11px] md:text-xs font-semibold tracking-widest text-white/60 transition-colors hover:text-white">
            VER TODAS
          </Link>
        </div>
        <ul className="grid grid-cols-2 gap-3 md:gap-4">
          {events.map((event) => (
            <li key={event.id}>
              <TicketCard event={event} layout="grid" cta={language === 'es' ? 'ENTRADAS' : 'TICKETS'} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
