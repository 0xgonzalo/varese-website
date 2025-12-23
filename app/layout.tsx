import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Varese | Electronic Music Artist & Producer",
    template: "%s | Varese",
  },
  description:
    "Varese is an electronic music artist and producer. Explore music, tour dates, live sets, and more. Listen on Spotify, YouTube Music, and all streaming platforms.",
  keywords: [
    "Varese",
    "Varese music",
    "Varese electronic",
    "Varese artist",
    "Varese producer",
    "electronic music",
    "electronic artist",
    "music producer",
    "DJ",
    "live set",
    "tour dates",
  ],
  authors: [{ name: "Varese" }],
  creator: "Varese",
  publisher: "Varese",
  metadataBase: new URL("https://varesemusica.com"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "es-ES": "/es",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "es_ES",
    url: "https://varesemusica.com",
    siteName: "Varese",
    title: "Varese | Electronic Music Artist & Producer",
    description:
      "Varese is an electronic music artist and producer. Explore music, tour dates, live sets, and more.",
    images: [
      {
        url: "/bg-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Varese - Electronic Music Artist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Varese | Electronic Music Artist & Producer",
    description:
      "Varese is an electronic music artist and producer. Explore music, tour dates, live sets, and more.",
    site: "@varesemusica",
    creator: "@varesemusica",
    images: ["/bg-hero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

// JSON-LD Structured Data for Google Knowledge Panel
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MusicGroup",
      "@id": "https://varesemusica.com/#musicgroup",
      name: "Varese",
      alternateName: ["Varese Music", "Varese Musica"],
      description:
        "Varese is an electronic music artist and producer known for creating immersive soundscapes and energetic live performances.",
      image: {
        "@type": "ImageObject",
        url: "https://varesemusica.com/bg-hero.jpg",
        width: 1200,
        height: 630,
      },
      url: "https://varesemusica.com",
      genre: ["Electronic", "Electronic Music", "Dance", "EDM"],
      sameAs: [
        "https://instagram.com/varesemusica",
        "https://open.spotify.com/artist/5DG278QHnEKfWW9zAGFeRg",
        "https://music.youtube.com/channel/UCOYbwdFnA1RxidPfEwcqUlA",
        "https://twitter.com/varesemusica",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://varesemusica.com/#website",
      url: "https://varesemusica.com",
      name: "Varese",
      description: "Official website of Varese - Electronic Music Artist",
      publisher: {
        "@id": "https://varesemusica.com/#musicgroup",
      },
      inLanguage: ["en", "es"],
    },
    {
      "@type": "WebPage",
      "@id": "https://varesemusica.com/#webpage",
      url: "https://varesemusica.com",
      name: "Varese | Electronic Music Artist & Producer",
      isPartOf: {
        "@id": "https://varesemusica.com/#website",
      },
      about: {
        "@id": "https://varesemusica.com/#musicgroup",
      },
      description:
        "Explore Varese's music, tour dates, live sets, and more. Listen on Spotify, YouTube Music, and all streaming platforms.",
      inLanguage: ["en", "es"],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
