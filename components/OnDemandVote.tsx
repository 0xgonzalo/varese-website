'use client';

import { useEffect, useMemo, useRef, useState, KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { FaSpotify } from 'react-icons/fa';
import { HiX, HiSearch } from 'react-icons/hi';
import { ON_DEMAND_TRACKS, MAX_TRACKS_PER_VOTE, normalize } from '@/lib/onDemandTracks';

const SPOTIFY_URL = 'https://open.spotify.com/artist/5DG278QHnEKfWW9zAGFeRg?si=PxwnmW0ORjaReWaljoVJqg';
const MAX_SUGGESTIONS = 8;

type Status = 'idle' | 'submitting' | 'error';

export default function OnDemandVote() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [showModal, setShowModal] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const limitReached = selected.length >= MAX_TRACKS_PER_VOTE;

  const suggestions = useMemo(() => {
    const q = normalize(query);
    return ON_DEMAND_TRACKS.filter(
      (t) => !selected.includes(t) && (!q || normalize(t).includes(q)),
    ).slice(0, MAX_SUGGESTIONS);
  }, [query, selected]);

  // Close dropdown on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Close modal with Escape
  useEffect(() => {
    if (!showModal) return;
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === 'Escape') setShowModal(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showModal]);

  function addTrack(track: string) {
    if (limitReached || selected.includes(track)) return;
    setSelected((prev) => [...prev, track]);
    setQuery('');
    setHighlight(0);
    setStatus('idle');
    inputRef.current?.focus();
  }

  function removeTrack(track: string) {
    setSelected((prev) => prev.filter((t) => t !== track));
  }

  function onInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (open && suggestions[highlight]) addTrack(suggestions[highlight]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  async function handleSubmit() {
    if (selected.length === 0) return;
    setStatus('submitting');
    setErrorMsg('');
    try {
      const res = await fetch('/api/on-demand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tracks: selected }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Error al enviar');
      setStatus('idle');
      setSelected([]);
      setShowModal(true);
    } catch {
      setStatus('error');
      setErrorMsg('No pudimos enviar tus votos. Probá de nuevo.');
    }
  }

  return (
    <div className="w-full max-w-xl px-6 py-10 md:py-0">
      <div className="text-center mb-8 md:mb-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold italic uppercase tracking-wider text-white">
          Varese On Demand
        </h1>
        <p className="mt-4 text-sm md:text-base tracking-wide text-white/80">
          Elegí los tracks que querés escuchar el <span className="font-semibold text-white">04.11</span>
        </p>
      </div>

      {/* Search */}
      <div ref={wrapperRef} className="relative">
        <label htmlFor="track-search" className="sr-only">Buscar track</label>
        <HiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
        <input
          ref={inputRef}
          id="track-search"
          type="text"
          role="combobox"
          aria-expanded={open && suggestions.length > 0}
          aria-controls="track-suggestions"
          aria-autocomplete="list"
          autoComplete="off"
          disabled={limitReached}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlight(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onInputKeyDown}
          placeholder={limitReached ? `Máximo ${MAX_TRACKS_PER_VOTE} tracks` : 'Buscá un track...'}
          className="w-full bg-black/40 backdrop-blur-sm border border-white/40 pl-11 pr-4 py-3.5 text-base text-white placeholder-white/50 focus:outline-none focus:border-white transition-colors disabled:opacity-50"
        />

        {open && !limitReached && (
          <ul
            id="track-suggestions"
            role="listbox"
            className="absolute left-0 right-0 top-full z-30 mt-1 max-h-72 overflow-y-auto border border-white/30 bg-black/90 backdrop-blur-md"
          >
            {suggestions.length === 0 ? (
              <li className="px-4 py-3 text-sm text-white/50">
                {query ? 'No encontramos ese track' : 'Ya agregaste todos los tracks'}
              </li>
            ) : (
              suggestions.map((track, i) => (
                <li
                  key={track}
                  role="option"
                  aria-selected={i === highlight}
                  onMouseEnter={() => setHighlight(i)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    addTrack(track);
                  }}
                  className={`cursor-pointer px-4 py-3 text-sm tracking-wide transition-colors ${
                    i === highlight ? 'bg-white/15 text-white' : 'text-white/80'
                  }`}
                >
                  {track}
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {/* Selected tracks */}
      <div className="mt-4 border border-white/20 bg-black/30 backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-white/60">
          <span>Tus tracks</span>
          <span>{selected.length}/{MAX_TRACKS_PER_VOTE}</span>
        </div>
        {selected.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-white/40">
            Todavía no agregaste ningún track
          </p>
        ) : (
          <ul className="max-h-64 overflow-y-auto">
            {selected.map((track, i) => (
              <li
                key={track}
                className="flex items-center gap-3 border-b border-white/5 px-4 py-2.5 last:border-b-0"
              >
                <span className="w-5 text-xs tabular-nums text-white/40">{String(i + 1).padStart(2, '0')}</span>
                <span className="flex-1 truncate text-sm text-white">{track}</span>
                <button
                  type="button"
                  onClick={() => removeTrack(track)}
                  aria-label={`Quitar ${track}`}
                  className="cursor-pointer p-1.5 -mr-1.5 text-white/50 transition-colors hover:text-white"
                >
                  <HiX size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={selected.length === 0 || status === 'submitting'}
        className="group relative mt-6 w-full cursor-pointer overflow-hidden border-2 border-white px-8 py-3.5 text-sm font-semibold tracking-widest text-white transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
      >
        <span className="relative z-10">{status === 'submitting' ? 'ENVIANDO...' : 'ENVIAR'}</span>
        <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
      </button>

      {status === 'error' && <p className="mt-3 text-center text-sm text-red-400">{errorMsg}</p>}

      {/* Confirmation modal */}
      {showModal && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="on-demand-modal-title"
        >
          <div
            className="relative w-full max-w-md border-2 border-white bg-black p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowModal(false)}
              aria-label="Cerrar"
              className="absolute right-3 top-3 cursor-pointer p-1.5 text-white/60 transition-colors hover:text-white"
            >
              <HiX size={20} />
            </button>
            <h2 id="on-demand-modal-title" className="text-2xl md:text-3xl font-bold italic uppercase tracking-wider text-white">
              ¡Gracias!
            </h2>
            <p className="mt-3 text-sm text-white/80">
              Recibimos tus votos. Nos vemos el 04.11.
            </p>
            <p className="mt-6 text-sm text-white/60">Mientras tanto, seguí escuchando nuestra música</p>
            <a
              href={SPOTIFY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative mt-4 inline-flex w-full items-center justify-center gap-3 overflow-hidden border-2 border-white px-8 py-3 text-sm font-semibold tracking-widest text-white transition-all duration-300 hover:scale-[1.02]"
            >
              <FaSpotify size={18} className="relative z-10" />
              <span className="relative z-10">IR A SPOTIFY</span>
              <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
            </a>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
