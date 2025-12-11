'use client';

import { FaSpotify, FaYoutube, FaInstagram, FaTiktok, FaTwitter } from 'react-icons/fa';
import { HiMail } from 'react-icons/hi';
import Navbar from './Navbar';

interface HeroProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function Hero({ mobileMenuOpen, setMobileMenuOpen }: HeroProps) {
  return (
    <div id="home" className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image - Desktop */}
      <div
        className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg-hero.jpg')" }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Background Image - Mobile */}
      <div
        className="md:hidden absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg-hero-mobile.jpg')" }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Navbar */}
        <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

        {/* Main Content - Center Button */}
        <div className="flex flex-1 items-center justify-center">
          <a
            href="https://open.spotify.com/album/524yA9fiXxSeDBMfqgpP23?si=9lJeAXZxQGukM00Fnz40xA"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden border-2 border-white px-12 py-4 text-sm font-semibold tracking-widest text-white transition-all duration-300 hover:scale-105 inline-block"
          >
            <span className="relative z-10">ESCUCHAR TREGUA</span>
            <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
          </a>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 px-6 md:px-12 pb-12">
          {/* Left Bottom - VARESE Logo */}
          <div className="text-4xl md:text-5xl font-bold italic tracking-wider text-white">
            VARESE
          </div>

          {/* Center Bottom - Social Media Icons */}
          <div className="grid grid-cols-3 md:flex gap-6 md:gap-6 text-white/80">
            <a
              href="https://open.spotify.com/artist/5DG278QHnEKfWW9zAGFeRg?si=PxwnmW0ORjaReWaljoVJqg"
              className="transition-all duration-300 hover:scale-110 hover:text-white flex justify-center"
              aria-label="Spotify"
            >
              <FaSpotify size={24} />
            </a>
            <a
              href="https://www.youtube.com/@varesemusica"
              className="transition-all duration-300 hover:scale-110 hover:text-white flex justify-center"
              aria-label="YouTube"
            >
              <FaYoutube size={24} />
            </a>
            <a
              href="https://www.instagram.com/varesemusica/"
              className="transition-all duration-300 hover:scale-110 hover:text-white flex justify-center"
              aria-label="Instagram"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://www.tiktok.com/@varesemusica"
              className="transition-all duration-300 hover:scale-110 hover:text-white flex justify-center"
              aria-label="TikTok"
            >
              <FaTiktok size={24} />
            </a>
            <a
              href="https://x.com/varesemusica"
              className="transition-all duration-300 hover:scale-110 hover:text-white flex justify-center"
              aria-label="Twitter"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="mailto:varesemusica@gmail.com"
              className="transition-all duration-300 hover:scale-110 hover:text-white flex justify-center"
              aria-label="Email"
            >
              <HiMail size={24} />
            </a>
          </div>

          {/* Right Bottom - Empty space for balance (desktop only) */}
          <div className="hidden md:block w-48" />
        </div>
      </div>
    </div>
  );
}
