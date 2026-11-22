"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const plans = [
  { name: "Nexus Workshop", usd: 20 },
  { name: "Nexus Core", usd: 49.99 },
  { name: "Nexus Pro", usd: 70 },
];

export default function CheckoutPage() {
  const [plan, setPlan] = useState(plans[1]);
  const [payment, setPayment] = useState<{ id: string; address: string; amountLtc: number; usd: number } | null>(null);
  const [status, setStatus] = useState("waiting");
  const [loading, setLoading] = useState(false);

  async function createPayment() {
    setLoading(true);
    const response = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: plan.name, usd: plan.usd }),
    });
    const data = await response.json();

    if (response.ok) {
      setPayment(data);
      setStatus("waiting");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!payment) return;

    const check = async () => {
      const response = await fetch(`/api/payments?id=${encodeURIComponent(payment.id)}`, { cache: "no-store" });
      if (response.ok) {
        const data = await response.json();
        setStatus(data.status);
      }
    };

    void check();
    const interval = window.setInterval(check, 15000);
    return () => window.clearInterval(interval);
  }, [payment]);

  return (
    <main className="relative min-h-screen overflow-hidden px-5 py-8 text-white md:px-8 md:py-10">
      <div className="nexus-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-2xl">
        <Link href="/" className="nexus-display text-lg font-black md:text-xl"><span className="text-cyan-300">NEXUS</span> CLOUD</Link>

        <section className="nexus-panel nexus-glow mt-10 rounded-lg p-6 md:p-8">
          <p className="nexus-display text-xs font-bold text-cyan-300">BLOCKCHAIN / LTC-ONLY</p>
          <h1 className="mt-3 text-3xl font-black">Litecoin checkout</h1>
          <p className="mt-2 text-gray-400">Pay only with Litecoin (LTC). Payments require one confirmation.</p>

          <label className="mt-7 block text-sm font-bold" htmlFor="plan">
            Subscription
            <select id="plan" value={plan.name} onChange={(event) => setPlan(plans.find((item) => item.name === event.target.value) ?? plans[1])} className="mt-2 w-full rounded-xl border border-white/10 bg-[#111522] px-4 py-3 text-white">
              {plans.map((item) => <option key={item.name} value={item.name}>{item.name} - ${item.usd.toFixed(2)}</option>)}
            </select>
          </label>

          {!payment ? (
            <button type="button" onClick={createPayment} disabled={loading} className="nexus-glow mt-6 w-full rounded-lg bg-cyan-300 px-5 py-4 font-black text-slate-950 hover:bg-white disabled:opacity-60">
              {loading ? "Preparing invoice..." : "Create LTC payment"}
            </button>
          ) : (
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-blue-500/40 bg-blue-500/10 p-5">
                <p className="text-sm text-gray-300">Send exactly</p>
                <p className="mt-1 text-3xl font-black">{payment.amountLtc.toFixed(8)} LTC</p>
              </div>

              <div>
                <p className="text-sm font-bold">Business LTC address</p>
                <code className="mt-2 block break-all rounded-xl bg-black/30 px-4 py-3 text-sm">LfXQXcjD5NcpiePvkKhiQ7dVfqExnSEmiu</code>
              </div>

              <button type="button" onClick={() => navigator.clipboard.writeText("LfXQXcjD5NcpiePvkKhiQ7dVfqExnSEmiu")} className="w-full rounded-xl border border-white/15 px-5 py-3 font-bold hover:border-white/30">
                Copy address
              </button>

              <p className={`rounded-lg px-4 py-3 text-sm ${status === "paid" ? "bg-green-500/10 text-green-300" : "bg-white/5 text-gray-300"}`}>
                {status === "paid" ? "Payment confirmed. Subscription activation is complete." : status === "detected" ? "Payment detected. Waiting for confirmation..." : "Waiting for the blockchain payment..."}
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
