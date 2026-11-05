import type { Metadata } from 'next';
import Link from 'next/link';
import { FaSpotify, FaYoutube, FaInstagram, FaTiktok } from 'react-icons/fa';
import { getUpcomingEvents } from '@/lib/ticketsStore';
import TicketCard from '@/components/tickets/TicketCard';

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
            {events.map((event) => (
              <li key={event.id}>
                <TicketCard event={event} />
              </li>
            ))}
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
