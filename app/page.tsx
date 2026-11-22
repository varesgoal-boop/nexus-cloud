import Link from "next/link";
import AuthNav from "@/components/AuthNav";

const plans = [
  {
    name: "Nexus Workshop",
    price: "$20",
    description: "For everyday computing and lighter gaming.",
    specs: ["256GB Storage", "Entry-level Ryzen CPU", "Basic Cloud PC"],
  },
  {
    name: "Nexus Core",
    price: "$49.99",
    description: "Powerful gaming for most players.",
    specs: ["RTX 4060", "Ryzen 5 5600X", "512GB Storage"],
    popular: true,
  },
  {
    name: "Nexus Pro",
    price: "$70",
    description: "Premium performance without compromise.",
    specs: ["RTX 5070", "Ryzen 9 9950X3D", "512GB Storage"],
  },
];

export default function Home() {
  return (
    <main className="nexus-site relative min-h-screen overflow-hidden text-white">
      <div className="nexus-grid pointer-events-none absolute inset-0 opacity-70" />

      <nav className="site-nav relative z-30 mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 md:px-10">
        <Link href="/" className="brand-mark" aria-label="Nexus Cloud home">
          <span className="brand-sigil" aria-hidden="true"><span /></span>
          <span><strong>NEXUS</strong> CLOUD</span>
        </Link>
        <AuthNav />
      </nav>

      <section className="hero-shell relative z-10 mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="hero-backdrop" />
        <div className="hero-grid" />
        <div className="hero-index"><span>NX / 2046</span><i /></div>

        <div className="hero-copy">
          <div className="status-line">
            <span className="status-pulse" />
            CLOUD SYSTEM ONLINE
            <span className="status-code">// 32.14.08</span>
          </div>

          <h1>
            PLAY WITHOUT
            <br />
            <span className="text-cyan-300">HARDWARE.</span>
          </h1>

          <p className="hero-description">
            Stream elite gaming hardware from the cloud. No installs, no upgrades, no limits.
          </p>

          <div className="hero-actions">
            <Link href="/register" className="primary-action">
              START YOUR SESSION
            </Link>
            <Link href="#plans" className="secondary-action">
              VIEW MACHINES
            </Link>
          </div>

          <div className="hero-specs">
            <div><span>UPTIME</span><strong>99.9%</strong><small>SYNC</small></div>
            <div><span>LATENCY</span><strong>&lt;20ms</strong><small>LIVE</small></div>
            <div><span>STREAM</span><strong>4K</strong><small>HFR</small></div>
          </div>
        </div>
      </section>

      <section id="plans" className="machines-section relative z-10 mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="section-heading">
          <div>
            <p>01 / SELECT NODE</p>
            <h2>Choose your machine.</h2>
          </div>
          <div className="network-readout">
            <span>NETWORK STATUS</span>
            <strong><b>3</b> NODES AVAILABLE</strong>
          </div>
        </div>

        <div className="plan-grid">
          {plans.map((plan, index) => (
            <article key={plan.name} className={`machine-card ${plan.popular ? "machine-featured" : ""}`}>
              <div className="card-topline">
                <span>NODE 0{index + 1} / {plan.popular ? <b>PRIORITY</b> : "STANDARD"}</span>
                <i>● READY</i>
              </div>

              <div className="machine-visual">
                <span className="machine-number">0{index + 1}</span>
                <div className="machine-chassis">
                  <i /><i /><i />
                  <span />
                </div>
              </div>

              <div className="machine-info">
                <h3>{plan.name}</h3>
                <p>{plan.description}</p>
                <div className="machine-price"><strong>{plan.price}</strong><span>/ MONTH</span></div>

                <ul>
                  {plan.specs.map((spec) => <li key={spec}><span />{spec}</li>)}
                  <li><span />Up to 8-hour sessions</li>
                  <li><span />Cloud gaming access</li>
                </ul>

                <Link href="/checkout" className="deploy-action">
                  <span>DEPLOY NODE</span><b>↗</b>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <span>NEXUS CLOUD SYSTEMS / © 2026</span>
        <div><i /> ALL SYSTEMS OPERATIONAL</div>
      </footer>
    </main>
  );
}
