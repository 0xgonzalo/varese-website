'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import TicketCard from '@/components/tickets/TicketCard';
import type { TicketEvent } from '@/lib/tickets';

export default function HomeTickets({ events }: { events: TicketEvent[] }) {
  const { language } = useLanguage();
  if (events.length === 0) return null;

  return (
    <section id="tickets" className="relative flex w-full items-center overflow-hidden bg-black md:min-h-screen">
      {/* Background (same as /tickets) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg-tour.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/75" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-lg px-5 py-12 md:max-w-6xl md:px-8 md:py-16">
        <h2 className="mb-6 text-3xl md:mb-10 md:text-5xl font-bold italic tracking-wider text-white">TICKETS</h2>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {events.map((event) => (
            <li key={event.id}>
              <TicketCard event={event} cta={language === 'es' ? 'ENTRADAS' : 'TICKETS'} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
