'use client';

import { useState } from 'react';
import Hero from '@/components/Hero';
import Music from '@/components/Music';
import Tour from '@/components/Tour';
import LiveSet from '@/components/LiveSet';
import Footer from '@/components/Footer';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Hero mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <Music />
      <Tour />
      <LiveSet />
      <Footer />
    </div>
  );
}
