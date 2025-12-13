'use client';

import { FaSpotify, FaYoutube, FaInstagram, FaTiktok, FaTwitter } from 'react-icons/fa';
import { HiMail } from 'react-icons/hi';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative w-full bg-black border-t border-white/10">
      <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-8">
        {/* Left - Empty on desktop */}
        <div className="hidden md:block w-48" />

        {/* Center - Copyright */}
        <div className="text-white/60 text-sm tracking-wide mb-6 md:mb-0">
          {t.footer.copyright}
        </div>

        {/* Right - Social Media Icons */}
        <div className="grid grid-cols-3 md:flex gap-6 md:gap-6 text-white/60">
          <a
            href="https://open.spotify.com/artist/5DG278QHnEKfWW9zAGFeRg?si=PxwnmW0ORjaReWaljoVJqg"
            className="transition-all duration-300 hover:scale-110 hover:text-white flex justify-center"
            aria-label="Spotify"
          >
            <FaSpotify size={20} />
          </a>
          <a
            href="https://www.youtube.com/@varesemusica"
            className="transition-all duration-300 hover:scale-110 hover:text-white flex justify-center"
            aria-label="YouTube"
          >
            <FaYoutube size={20} />
          </a>
          <a
            href="https://www.instagram.com/varesemusica/"
            className="transition-all duration-300 hover:scale-110 hover:text-white flex justify-center"
            aria-label="Instagram"
          >
            <FaInstagram size={20} />
          </a>
          <a
            href="https://www.tiktok.com/@varesemusica"
            className="transition-all duration-300 hover:scale-110 hover:text-white flex justify-center"
            aria-label="TikTok"
          >
            <FaTiktok size={20} />
          </a>
          <a
            href="https://x.com/varesemusica"
            className="transition-all duration-300 hover:scale-110 hover:text-white flex justify-center"
            aria-label="Twitter"
          >
            <FaTwitter size={20} />
          </a>
          <a
            href="mailto:varesemusica@gmail.com"
            className="transition-all duration-300 hover:scale-110 hover:text-white flex justify-center"
            aria-label="Email"
          >
            <HiMail size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
