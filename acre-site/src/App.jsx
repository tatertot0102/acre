// ---- CONTENT IMPORT ---------------------------------------------------------
// Non-coders: edit content.json only. No JSX changes required.
import content from "./content.json";
import "./index.css";
import { useEffect, useMemo, useRef, useState } from "react";

/* ---------- Tiny helpers (no libs) ---------- */

// Reveal elements as they enter viewport
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.12 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// Parallax a ref’d element on scroll (subtle)
function useParallax(ref, factor = 0.25) {
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY * factor;
      if (ref.current) ref.current.style.transform = `translate3d(0, ${y}px, 0)`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    // initial position
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ref, factor]);
}

// Countdown to a date (ISO string)
function useCountdown(targetISO) {
  const target = useMemo(() => (targetISO ? new Date(targetISO) : null), [targetISO]);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!target) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  if (!target) return null;
  let diff = Math.max(0, target.getTime() - now);
  const d = Math.floor(diff / (1000 * 60 * 60 * 24)); diff -= d * 86400000;
  const h = Math.floor(diff / (1000 * 60 * 60)); diff -= h * 3600000;
  const m = Math.floor(diff / (1000 * 60)); diff -= m * 60000;
  const s = Math.floor(diff / 1000);
  return { d, h, m, s };
}

/* ---------- App ---------- */

export default function App() {
  const CONTENT = content;
  useReveal();

  // For animated blobs in hero
  const blobA = useRef(null);
  const blobB = useRef(null);
  useParallax(blobA, 0.15);
  useParallax(blobB, 0.1);

  // Read a Wharton deadline if provided (or set one)
  const whartonISO =
    CONTENT?.deadlines?.wharton ||
    "2025-12-01T23:59:00"; // change in content.json later
  const t = useCountdown(whartonISO);

  // Fallback ticker items if not in content
  const ticker = CONTENT?.ticker?.length
    ? CONTENT.ticker
    : [
        "Monopoly Nights",
        "Wharton Global (Sep–Dec)",
        "Guest Speaker Q&A",
        "Internship Pathways",
        "JA Titan Prep",
        "Acre Pitch Showcase"
      ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: CONTENT.ui.brand.bg, color: "white" }}>

      {/* ---------- Floating Header ---------- */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur bg-black/30 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <a href="#home" className="flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight">{CONTENT.org.name}</span>
            <span className="text-xs text-white/60">{CONTENT.org.tagline}</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#why" className="hover:text-[#8FA98B]">Why</a>
            <a href="#programs" className="hover:text-[#8FA98B]">Programs</a>
            <a href="#events" className="hover:text-[#8FA98B]">Events</a>
            <a href="#photos" className="hover:text-[#8FA98B]">Photos</a>
            <a href="#newsletter" className="hover:text-[#8FA98B]">Newsletter</a>
           
          </nav>
          <a href="#join" className="md:inline-flex hidden px-3 py-1.5 rounded-xl"
             style={{ backgroundColor: CONTENT.ui.brand.primary, color: "black" }}>
            Join
          </a>
        </div>
      </header>

      {/* ---------- Fullscreen Hero (no images) ---------- */}
      <section id="home" className="relative h-[100svh] overflow-hidden">
        {/* Animated gradient blobs */}
        <div ref={blobA}
             className="absolute -top-24 -left-24 h-[40rem] w-[40rem] rounded-full blur-3xl opacity-30"
             style={{ background: "radial-gradient(closest-side, #8FA98B, transparent 60%)" }} />
        <div ref={blobB}
             className="absolute -bottom-32 -right-24 h-[36rem] w-[36rem] rounded-full blur-3xl opacity-25"
             style={{ background: "radial-gradient(closest-side, #7cc1b3, transparent 60%)" }} />
        {/* Dark gradient to improve contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70" />

        {/* Headline */}
        <div className="relative h-full mx-auto max-w-6xl px-4 flex flex-col justify-center">
          <div className="reveal">
            <h1 className="text-5xl md:text-6xl font-black leading-tight">{CONTENT.org.heroTitle}</h1>
            <p className="mt-4 text-lg text-white/80 max-w-2xl">
              Real competitions, real projects, real connections — experiences that count
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#join" className="px-5 py-3 rounded-2xl font-semibold hover:opacity-90"
                 style={{ backgroundColor: CONTENT.ui.brand.primary, color: "black" }}>
                Join {CONTENT.org.name}
              </a>
              <a href="#why" className="px-5 py-3 rounded-2xl border border-white/20 hover:border-white/40">
                How we’re different
              </a>
            </div>
          </div>

          {/* Countdown */}
          {t && (
            <div className="mt-10 reveal">
              <div className="inline-flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="text-white/70 text-sm">Wharton Global deadline</span>
                <span className="font-mono text-lg">
                  {t.d}d:{String(t.h).padStart(2,"0")}h:{String(t.m).padStart(2,"0")}m:{String(t.s).padStart(2,"0")}s
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Scroll cue */}
        <a href="#why" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm">
          <div className="flex flex-col items-center gap-2">
           
            
          </div>
        </a>

        {/* Ticker */}
<style>{`
  @keyframes ticker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-100%); }
  }
  .ticker-track {
    display: inline-block;
    white-space: nowrap;
    will-change: transform;
    animation: ticker 30s linear infinite;
  }
`}</style>
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden border-t border-white/10 bg-black/40">
          <div className="ticker-track">
  {[...ticker, ...ticker].map((txt, i) => (
    <span key={i} className="inline-flex items-center gap-2 px-6 py-2 text-white/70">
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: CONTENT.ui.brand.primary }} />
      {txt}
    </span>
  ))}
</div>
        </div>
      </section>

      {/* ---------- Why ---------- */}
      <section id="why" className="mx-auto max-w-6xl px-4 py-16 md:py-20 reveal">
        <h2 className="text-2xl md:text-3xl font-bold">What Makes {CONTENT.org.name} Different</h2>
        <p className="mt-2 text-white/70">
          We run Monopoly strategy sessions, prep <em>and</em> compete in Wharton Global and JA Titan,
          and host speaker nights where members get direct access to young professionals and alumni.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CONTENT.why.map((c, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5 reveal">
              <h3 className="font-semibold text-lg">{c.title}</h3>
              <p className="mt-1 text-white/70 text-sm">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Programs ---------- */}
      <section id="programs" className="mx-auto max-w-6xl px-4 py-16 md:py-20 reveal">
        <h2 className="text-2xl md:text-3xl font-bold">Prep, Compete, and Build</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CONTENT.programs.map((p, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-5 reveal">
              <h3 className="font-semibold">{p.name}</h3>
              <p className="mt-1 text-white/70 text-sm">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Events ---------- */}
      <section id="events" className="mx-auto max-w-6xl px-4 py-16 md:py-20 reveal">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Upcoming Milestones</h2>
            <p className="mt-2 text-white/70">
              September–October: poster campaign + incentives. Mid-October: first meeting with financial literacy slides and Monopoly play.
              Sep–Dec: Wharton Global prep and participation. Year-round: guest speakers and internship opportunities.
            </p>
          </div>
          <a href="#join" className="hidden md:inline-flex px-4 py-2 rounded-xl border border-white/20 hover:border-white/40">Get notified</a>
        </div>
        <div className="mt-6 grid gap-4">
          {CONTENT.events.map((e, i) => (
            <div key={i} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 reveal">
              <div className="w-20 text-center">
                <div className="text-xl font-black">{e.date.split(" ")[0]}</div>
                <div className="text-[10px] uppercase tracking-wider text-white/60">{e.date.split(" ")[1] || ""}</div>
              </div>
              <div className="flex-1">
                <div className="font-semibold">{e.title}</div>
                <div className="text-white/70 text-sm">{e.meta}</div>
              </div>
              <a href="#join" className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-sm">RSVP</a>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Photos (optional) ---------- */}
      {Array.isArray(CONTENT.photos) && CONTENT.photos.length > 0 && (
        <section id="photos" className="mx-auto max-w-6xl px-4 py-16 reveal">
          <h2 className="text-2xl md:text-3xl font-bold">Club in Action</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {CONTENT.photos.map((p, i) => (
              <img key={i} src={p.url} alt={p.alt || "club photo"} className="rounded-2xl border border-white/10" />
            ))}
          </div>
        </section>
      )}

      {/* ---------- Newsletter ---------- */}
      <section id="newsletter" className="mx-auto max-w-6xl px-4 py-16 md:py-20 reveal">
        <div className="rounded-3xl border border-white/10 p-6 md:p-10 bg-gradient-to-br from-[#101213] to-[#0b0c0d]">
          <h2 className="text-2xl md:text-3xl font-bold">The Acre Report Newsletter</h2>
          <p className="mt-2 text-white/70 max-w-2xl">{CONTENT.newsletter.blurb}</p>

          {CONTENT.newsletter.form.enabled ? (
            <form className="mt-6 flex flex-col sm:flex-row gap-3" action={CONTENT.newsletter.form.url} method="POST">
              <input type="email" name="email" required placeholder="you@example.org"
                     className="w-full sm:flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#8FA98B]"/>
              <button className="px-5 py-3 rounded-xl font-semibold hover:opacity-90"
                      style={{ backgroundColor: CONTENT.ui.brand.primary, color: "black" }}>
                Subscribe
              </button>
            </form>
          ) : (
            <div className="mt-6 text-sm text-white/70">Connect a form later in content.json → newsletter.form</div>
          )}
        </div>
      </section>

      {/* ---------- Join ---------- */}
      <section id="join" className="mx-auto max-w-6xl px-4 py-16 md:py-24 reveal">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Join {CONTENT.org.name} Today</h2>
            <p className="mt-2 text-white/70">
              Expect financial literacy slides tied to real competitions, Monopoly strategy sessions, Wharton Global prep & participation,
              Shark Tank–style pitches, and pipelines to internships and collabs.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center gap-3"><span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CONTENT.ui.brand.primary }} /> Speaker nights with real Q&amp;A</div>
              <div className="flex items-center gap-3"><span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CONTENT.ui.brand.primary }} /> Competition prep that actually helps</div>
              <div className="flex items-center gap-3"><span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CONTENT.ui.brand.primary }} /> Project artifacts you can use in apps</div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`mailto:${CONTENT.org.contactEmail}`} className="px-5 py-3 rounded-2xl bg-white text-black font-semibold hover:opacity-90">Email us</a>
              <a href="#newsletter" className="px-5 py-3 rounded-2xl border border-white/20 hover:border-white/40">Get the Report</a>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li><a className="hover:underline" href="#why">Why {CONTENT.org.name}</a></li>
              <li><a className="hover:underline" href="#programs">Programs</a></li>
              <li><a className="hover:underline" href="#events">Upcoming Events</a></li>
              <li><a className="hover:underline" href="#newsletter">Acre Report</a></li>
            </ul>
            
          </div>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white/60">© {new Date().getFullYear()} {CONTENT.org.name}. All rights reserved.</div>
          <div className="flex items-center gap-4 text-white/60">
            <a href={CONTENT.org.socials.instagram} className="hover:text-white">Instagram</a>
            <a href={CONTENT.org.socials.discord} className="hover:text-white">Discord</a>
            <a href={CONTENT.org.socials.linkedin} className="hover:text-white">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}