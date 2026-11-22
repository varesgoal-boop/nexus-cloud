"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const [message, setMessage] = useState("Completing authentication...");

  useEffect(() => {
    const authSubscription = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && session) {
        window.location.replace("/");
      }
    });

    async function completeAuthentication() {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const oauthError =
        url.searchParams.get("error_description") ?? url.searchParams.get("error");

      if (oauthError) {
        setMessage(oauthError);
        return;
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setMessage(error.message);
          return;
        }
      }

      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setMessage(error.message);
        return;
      }

      if (data.session) {
        window.location.replace("/");
      } else {
        setMessage("Authentication could not be completed. Please try again.");
      }
    }

    void completeAuthentication();

    return () => authSubscription.data.subscription.unsubscribe();
  }, []);

  return (
    <main className="min-h-screen bg-[#080b16] px-6 py-24 text-center text-white">
      <p className="text-lg font-bold">{message}</p>
    </main>
  );
}
