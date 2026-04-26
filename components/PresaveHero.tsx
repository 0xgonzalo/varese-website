'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import Navbar from './Navbar';

interface PresaveHeroProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const EVENTS = [
  { value: 1, label: '07-05 Buenos Aires' },
  { value: 2, label: '08-05 La Plata' },
  { value: 3, label: '16-05 Mar del Plata' },
] as const;

const PRESAVE_URL = 'https://orcd.co/tregua-remixes';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function PresaveHero({ mobileMenuOpen, setMobileMenuOpen }: PresaveHeroProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [event, setEvent] = useState<number | ''>('');
  const [email, setEmail] = useState('');
  const [presaveCompleted, setPresaveCompleted] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (event === '') {
      setStatus('error');
      setErrorMsg('Elegí una fecha del evento.');
      return;
    }
    setStatus('submitting');
    setErrorMsg('');
    try {
      const res = await fetch('/api/presave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          event,
          email,
          presave_completed: presaveCompleted,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error al enviar');
      setStatus('success');
      setFirstName('');
      setLastName('');
      setEvent('');
      setEmail('');
      setPresaveCompleted(false);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Error al enviar');
    }
  }

  return (
    <section id="presave" className="relative min-h-screen w-full overflow-hidden bg-black">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/form/video-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

        <div className="flex-1 px-6 md:px-12 py-8 md:py-12">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-2 md:gap-16 items-center">
            {/* Left column - Form */}
            <div className="order-2 md:order-1">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-wide text-white mb-6 md:mb-8">
                Hacé el presave y sumate a la listening party de CABA, Mar del Plata o La Plata
              </h1>

              {status === 'success' ? (
                <div className="border-2 border-white/80 p-6 text-white">
                  <p className="text-lg font-semibold mb-2">¡Listo!</p>
                  <p className="text-sm text-white/80">
                    Recibimos tu inscripción. Enviaremos los tickets por la app de Bombo los próximos días.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="firstName" className="sr-only">Nombre</label>
                    <input
                      id="firstName"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Nombre"
                      className="w-full bg-transparent border border-white/40 px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="sr-only">Apellido</label>
                    <input
                      id="lastName"
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Apellido"
                      className="w-full bg-transparent border border-white/40 px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="event" className="sr-only">¿A cuál querés venir?</label>
                    <select
                      id="event"
                      required
                      value={event}
                      onChange={(e) => setEvent(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full bg-black border border-white/40 px-4 py-3 text-white focus:outline-none focus:border-white transition-colors appearance-none cursor-pointer"
                    >
                      <option value="" disabled>¿A cuál querés venir?</option>
                      {EVENTS.map((ev) => (
                        <option key={ev.value} value={ev.value}>{ev.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      className="w-full bg-transparent border border-white/40 px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <label className="flex items-start gap-3 text-sm text-white/90 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      required
                      checked={presaveCompleted}
                      onChange={(e) => setPresaveCompleted(e.target.checked)}
                      className="mt-1 h-4 w-4 accent-white cursor-pointer"
                    />
                    <span>Completé el presave de TREGUA Remixes</span>
                  </label>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="group relative w-full overflow-hidden border-2 border-white px-8 py-3 text-sm font-semibold tracking-widest text-white transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <span className="relative z-10">
                      {status === 'submitting' ? 'ENVIANDO...' : 'ENVIAR'}
                    </span>
                    <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
                  </button>

                  {status === 'error' && (
                    <p className="text-sm text-red-400">{errorMsg}</p>
                  )}
                </form>
              )}

              <p className="mt-6 text-xs text-white/60 leading-relaxed">
                Enviaremos los tickets por la app de Bombo los próximos días. (Descargarla en App Store y Play Store). Evento +18.
              </p>
            </div>

            {/* Right column - Artwork + Presave CTA */}
            <div className="order-1 md:order-2 flex flex-col items-center text-center">
              <div className="relative w-full max-w-sm aspect-square mb-6">
                <Image
                  src="/form/tregua-remix-artwork.png"
                  alt="Tregua Remixes"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold italic tracking-wider text-white">
                TREGUA REMIXES
              </h2>
              <p className="mt-2 text-sm md:text-base text-white/80 tracking-wide">
                Eventos de presentación del álbum
              </p>

              <div className="mt-8 md:mt-10 flex flex-col items-center gap-4">
                <p className="text-sm md:text-base text-white/90">
                  Hacé el presave de TREGUA REMIXES y accedé al evento
                </p>
                <a
                  href={PRESAVE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden border-2 border-white px-10 py-3 text-sm font-semibold tracking-widest text-white transition-all duration-300 hover:scale-105 inline-block"
                >
                  <span className="relative z-10">PRESAVE</span>
                  <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
