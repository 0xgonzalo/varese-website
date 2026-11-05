import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FaSpotify, FaYoutube, FaInstagram, FaTiktok } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi';
import { formatEventDate, todayInBuenosAires, type TicketEvent } from '@/lib/tickets';
import { isStoreConfigured, readEvents } from '@/lib/ticketsStore';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Tickets',
  description: 'Próximas fechas de Varese. Conseguí tus entradas.',
  alternates: { canonical: '/tickets' },
  openGraph: {
    title: 'Varese | Tickets',
    description: 'Próximas fechas de Varese. Conseguí tus entradas.',
    url: 'https://varesemusica.com/tickets',
    images: [{ url: '/og/og-image.jpg', width: 1200, height: 1200, alt: 'Varese' }],
  },
};

const SOCIALS = [
  { href: 'https://open.spotify.com/artist/5DG278QHnEKfWW9zAGFeRg', label: 'Spotify', Icon: FaSpotify },
  { href: 'https://www.youtube.com/@varesemusica', label: 'YouTube', Icon: FaYoutube },
  { href: 'https://www.instagram.com/varesemusica/', label: 'Instagram', Icon: FaInstagram },
  { href: 'https://www.tiktok.com/@varesemusica', label: 'TikTok', Icon: FaTiktok },
];

async function getUpcomingEvents(): Promise<TicketEvent[]> {
  if (!isStoreConfigured()) return [];
  const today = todayInBuenosAires();
  const events = await readEvents();
  return events.filter((e) => e.event_date >= today).sort((a, b) => a.event_date.localeCompare(b.event_date));
}

export default async function TicketsPage() {
  const events = await getUpcomingEvents();

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg-tour.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/75" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-lg flex-col px-5 py-12 md:py-16">
        {/* Header */}
        <header className="mb-10 text-center">
          <Link href="/" className="inline-block text-5xl md:text-6xl font-bold italic tracking-wider text-white">
            VARESE
          </Link>
          <p className="mt-3 text-xs md:text-sm font-semibold uppercase tracking-[0.4em] text-white/60">
            Tickets
          </p>
        </header>

        {/* Dates */}
        {events.length === 0 ? (
          <div className="border-2 border-white/20 bg-black/40 px-6 py-10 text-center backdrop-blur-sm">
            <p className="text-sm font-semibold uppercase tracking-widest text-white/70">
              No hay fechas anunciadas
            </p>
            <p className="mt-2 text-sm text-white/40">Volvé pronto.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {events.map((event) => {
              const { date, month, day } = formatEventDate(event.event_date);
              return (
                <li key={event.id}>
                  <a
                    href={event.ticket_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-stretch gap-4 border-2 border-white/20 bg-gradient-to-b from-white/5 to-black/40 p-3 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-white/60"
                  >
                    {event.flyer_url ? (
                      <div className="relative w-24 md:w-28 flex-shrink-0 self-start aspect-[4/5] overflow-hidden bg-white/5">
                        <Image
                          src={event.flyer_url}
                          alt={`Flyer ${event.title}`}
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex w-24 md:w-28 flex-shrink-0 self-start aspect-[4/5] items-center justify-center border border-white/10 bg-white/5">
                        <span className="text-sm font-bold italic tracking-wider text-white/40">VARESE</span>
                      </div>
                    )}

                    <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl md:text-4xl font-bold italic leading-none text-white">{date}</span>
                          <span className="text-base md:text-lg font-bold text-white">{month}</span>
                          <span className="text-xs text-white/60">{day}</span>
                        </div>
                        <h2 className="mt-2 text-base md:text-lg font-bold uppercase leading-tight tracking-wider text-white break-words">
                          {event.title}
                        </h2>
                        <p className="mt-1 text-xs md:text-sm uppercase tracking-wide text-white/60 break-words">
                          {event.venue}
                        </p>
                      </div>
                      <span className="mt-3 inline-flex items-center gap-2 self-start border-2 border-white px-4 py-1.5 text-[11px] md:text-xs font-semibold tracking-widest text-white transition-colors duration-300 group-hover:bg-white group-hover:text-black">
                        ENTRADAS
                        <HiArrowRight size={14} />
                      </span>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        )}

        {/* Footer */}
        <footer className="mt-auto pt-12 flex flex-col items-center gap-6">
          <div className="flex gap-6 text-white/70">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="transition-all duration-300 hover:scale-110 hover:text-white"
              >
                <Icon size={22} />
              </a>
            ))}
          </div>
          <Link href="/" className="text-xs tracking-widest text-white/40 transition-colors hover:text-white">
            VARESEMUSICA.COM
          </Link>
        </footer>
      </div>
    </main>
  );
}
