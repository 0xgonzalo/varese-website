'use client';

import { HiMenu, HiX } from 'react-icons/hi';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavbarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function Navbar({ mobileMenuOpen, setMobileMenuOpen }: NavbarProps) {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <nav className="relative px-4 md:px-8 py-6 md:py-8">
      {/* Language Toggle - Desktop */}
      <div className="hidden md:block absolute left-8 top-8">
        <button
          onClick={toggleLanguage}
          className="cursor-pointer text-white/80 hover:text-white text-sm font-medium tracking-widest transition-colors"
        >
          {language === 'es' ? 'EN' : 'ES'}
        </button>
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex items-center justify-center gap-12 text-sm font-medium tracking-widest text-white/90">
        <li>
          <a href="#home" className="cursor-pointer transition-colors hover:text-white">
            {t.nav.home}
          </a>
        </li>
        <li>
          <a href="#musica" className="cursor-pointer transition-colors hover:text-white">
            {t.nav.music}
          </a>
        </li>
        <li>
          <a href="#tour" className="cursor-pointer transition-colors hover:text-white">
            {t.nav.tour}
          </a>
        </li>
        <li>
          <a href="#liveset" className="cursor-pointer transition-colors hover:text-white">
            {t.nav.liveSet}
          </a>
        </li>
        <li className="cursor-pointer transition-colors hover:text-white">
          {t.nav.store}
        </li>
      </ul>

      {/* Mobile Menu Button & Language Toggle */}
      <div className="md:hidden flex justify-between items-center">
        {/* Language Toggle - Mobile */}
        <button
          onClick={toggleLanguage}
          className="cursor-pointer text-white/80 hover:text-white text-sm font-medium tracking-widest transition-colors"
        >
          {language === 'es' ? 'EN' : 'ES'}
        </button>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white transition-colors hover:text-white/70 z-50 relative"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <HiX size={32} /> : <HiMenu size={32} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-0 bg-black/98 backdrop-blur-md z-40 flex items-center justify-center">
          <ul className="flex flex-col items-center gap-10 text-base font-medium tracking-widest text-white/90">
            <li>
              <a
                href="#home"
                onClick={() => setMobileMenuOpen(false)}
                className="cursor-pointer transition-colors hover:text-white"
              >
                {t.nav.home}
              </a>
            </li>
            <li>
              <a
                href="#musica"
                onClick={() => setMobileMenuOpen(false)}
                className="cursor-pointer transition-colors hover:text-white"
              >
                {t.nav.music}
              </a>
            </li>
            <li>
              <a
                href="#tour"
                onClick={() => setMobileMenuOpen(false)}
                className="cursor-pointer transition-colors hover:text-white"
              >
                {t.nav.tour}
              </a>
            </li>
            <li>
              <a
                href="#liveset"
                onClick={() => setMobileMenuOpen(false)}
                className="cursor-pointer transition-colors hover:text-white"
              >
                {t.nav.liveSet}
              </a>
            </li>
            <li className="cursor-pointer transition-colors hover:text-white">
              {t.nav.store}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
