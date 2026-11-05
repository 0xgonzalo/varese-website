'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!password) return;
    setStatus('submitting');
    try {
      const res = await fetch('/api/tickets/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || 'Error al ingresar');
      router.refresh();
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Error al ingresar');
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold italic tracking-wider text-white">VARESE</h1>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.4em] text-white/60">Tickets Admin</p>
        </div>
        <label htmlFor="admin-password" className="sr-only">Contraseña</label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          autoFocus
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setStatus('idle');
          }}
          placeholder="Contraseña"
          className="w-full border border-white/40 bg-black px-4 py-3.5 text-base text-white placeholder-white/40 focus:border-white focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={!password || status === 'submitting'}
          className="group relative mt-4 w-full cursor-pointer overflow-hidden border-2 border-white px-8 py-3.5 text-sm font-semibold tracking-widest text-white transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
        >
          <span className="relative z-10">{status === 'submitting' ? 'INGRESANDO...' : 'INGRESAR'}</span>
          <div className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
        </button>
        {status === 'error' && <p className="mt-3 text-center text-sm text-red-400">{errorMsg}</p>}
      </form>
    </main>
  );
}
