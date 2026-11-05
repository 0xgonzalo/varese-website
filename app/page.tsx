// import { useState } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
// import PresaveHero from '@/components/PresaveHero';
import Hero from '@/components/Hero';
import Music from '@/components/Music';
import Tour from '@/components/Tour';
import LiveSet from '@/components/LiveSet';
import Footer from '@/components/Footer';
import HomeTickets from '@/components/tickets/HomeTickets';
import { getUpcomingEvents } from '@/lib/ticketsStore';

export const revalidate = 300;

export default async function Home() {
  const events = await getUpcomingEvents();
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <LanguageProvider>
      <div className="relative w-full">
        {/* <PresaveHero mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} /> */}
        <HomeTickets events={events} />
        <Hero />
        <Music />
        <Tour />
        <LiveSet />
        <Footer />
      </div>
    </LanguageProvider>
  );
}
