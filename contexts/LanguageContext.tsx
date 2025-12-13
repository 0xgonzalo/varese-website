'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'es' | 'en';

interface Translations {
  nav: {
    home: string;
    music: string;
    tour: string;
    liveSet: string;
    store: string;
  };
  hero: {
    listenButton: string;
  };
  music: {
    title: string;
  };
  tour: {
    title: string;
    buyTickets: string;
  };
  liveSet: {
    title: string;
    description: string;
  };
  footer: {
    copyright: string;
  };
}

const translations: Record<Language, Translations> = {
  es: {
    nav: {
      home: 'HOME',
      music: 'MUSICA',
      tour: 'TOUR',
      liveSet: 'LIVE SET',
      store: 'TIENDA',
    },
    hero: {
      listenButton: 'ESCUCHAR TREGUA',
    },
    music: {
      title: 'MÚSICA',
    },
    tour: {
      title: 'TOUR',
      buyTickets: 'COMPRAR ENTRADAS',
    },
    liveSet: {
      title: 'LIVE SET',
      description: 'Live Set de nuestro show grabado en Niceto Club en Buenos Aires durante 2025',
    },
    footer: {
      copyright: 'VARESE 2025',
    },
  },
  en: {
    nav: {
      home: 'HOME',
      music: 'MUSIC',
      tour: 'TOUR',
      liveSet: 'LIVE SET',
      store: 'STORE',
    },
    hero: {
      listenButton: 'LISTEN TO TREGUA',
    },
    music: {
      title: 'MUSIC',
    },
    tour: {
      title: 'TOUR',
      buyTickets: 'BUY TICKETS',
    },
    liveSet: {
      title: 'LIVE SET',
      description: 'Live Set from our show recorded at Niceto Club in Buenos Aires during 2025',
    },
    footer: {
      copyright: 'VARESE 2025',
    },
  },
};

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('es');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'es' ? 'en' : 'es'));
  };

  const value = {
    language,
    toggleLanguage,
    t: translations[language],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
