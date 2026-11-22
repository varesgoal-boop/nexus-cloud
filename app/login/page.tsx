"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        window.location.replace("/");
      }
    });
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    window.location.replace("/");
  }

  async function handleDiscord() {
    setError("");
    setLoading(true);

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (oauthError) {
      setLoading(false);
      setError(oauthError.message);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-5 py-8 text-white md:px-8 md:py-10">
      <div className="nexus-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-md">
        <Link href="/" className="nexus-display text-lg font-black md:text-xl"><span className="text-cyan-300">NEXUS</span> CLOUD</Link>

        <section className="nexus-panel nexus-glow mt-10 rounded-lg p-6 md:p-8">
          <p className="nexus-display text-xs font-bold text-cyan-300">SECURE ACCESS / LOGIN</p>
          <h1 className="mt-3 text-3xl font-black">Welcome back</h1>
          <p className="mt-2 text-gray-400">Sign in to your Nexus Cloud account.</p>

          <button
            type="button"
            onClick={handleDiscord}
            disabled={loading}
            className="mt-7 w-full rounded-lg border border-[#5865F2]/70 bg-[#5865F2]/12 px-5 py-4 font-bold hover:border-[#5865F2] hover:bg-[#5865F2]/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Continue with Discord
          </button>

          <div className="my-6 flex items-center gap-4 text-sm text-gray-500">
            <div className="h-px flex-1 bg-white/10" />
            <span>or with email</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <label className="block text-sm font-bold" htmlFor="email">
              Email
              <input id="email" name="email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-cyan-300/70" />
            </label>

            <label className="block text-sm font-bold" htmlFor="password">
              Password
              <input id="password" name="password" type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-cyan-300/70" />
            </label>

            {error && <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}

            <button type="submit" disabled={loading} className="nexus-glow w-full rounded-lg bg-cyan-300 px-5 py-4 font-black text-slate-950 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            New to Nexus Cloud? <Link href="/register" className="font-bold text-blue-400 hover:text-blue-300">Create account</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
