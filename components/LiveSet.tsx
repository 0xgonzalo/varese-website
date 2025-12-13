'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function LiveSet() {
  const { t } = useLanguage();

  return (
    <div id="liveset" className="relative w-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg-liveset.jpg')" }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 md:px-8 py-12 md:py-20">
        <h2 className="mb-6 text-4xl md:text-5xl font-bold tracking-wider text-white">
          {t.liveSet.title}
        </h2>

        <p className="mb-12 max-w-4xl text-center text-base md:text-lg tracking-wide text-white/80 px-4">
          {t.liveSet.description}
        </p>

        <div className="w-full max-w-4xl px-4">
          <div className="rounded-lg bg-black/30 p-3 md:p-4 backdrop-blur-sm">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src="https://www.youtube.com/embed/M3p_0qp1LXs"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
