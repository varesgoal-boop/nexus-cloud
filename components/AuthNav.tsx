"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthNav() {
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSignedIn(Boolean(data.session));
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session));
    });

    return () => data.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setSignedIn(false);
  }

  if (loading) {
    return <div className="h-12 w-36" />;
  }

  if (signedIn) {
    return (
      <div className="flex items-center gap-2 md:gap-4">
        <Link href="/checkout" className="hidden text-xs font-bold text-slate-300 hover:text-cyan-200 sm:block">CHECKOUT</Link>
        <button type="button" onClick={handleLogout} className="rounded-lg border border-white/15 px-3 py-2.5 text-xs font-bold hover:border-cyan-300/50 hover:text-cyan-200 md:px-4">
          LOGOUT
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 md:gap-4">
      <Link href="/login" className="px-2 text-xs font-bold text-slate-300 hover:text-white md:px-3">LOGIN</Link>
      <Link href="/register" className="rounded-lg bg-cyan-300 px-3 py-2.5 text-xs font-black text-slate-950 hover:bg-white md:px-5">GET STARTED</Link>
    </div>
  );
}
