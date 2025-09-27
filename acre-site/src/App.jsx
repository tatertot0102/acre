// src/App.jsx
// flo (Financial Literacy Opportunities) — Smooth, performant animations
// Monochrome + indigo, CSS Scroll-Linked Animations (no laggy JS observers).
// Tailwind utility classes assumed; works with plain CSS too.

import React, { useEffect, useRef, useState } from "react";
import "./index.css";

/* --------------------------- Global Progress Bar --------------------------- */
function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const ratio = max > 0 ? h.scrollTop / max : 0;
      setP(ratio);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-transparent"
    >
      <div
        className="h-full origin-left bg-indigo-600"
        style={{ transform: `scaleX(${p})`, transition: "transform .08s linear", willChange: "transform" }}
      />
    </div>
  );
}

/* --------------------------- Inline global styles -------------------------- */
const GlobalStyles = () => (
  <style>{`
    html { scroll-behavior: smooth; }
    /* Base quality-of-life */
    .band { border-top: 1px solid rgba(0,0,0,.06); }
    .grid-bg {
      background-image:
        radial-gradient(transparent 1px, transparent 1px),
        radial-gradient(transparent 1px, transparent 1px),
        linear-gradient(to bottom, rgba(99,102,241,.06), rgba(0,0,0,0));
      background-size: 24px 24px, 24px 24px, 100% 100%;
      background-position: 0 0, 12px 12px, 0 0;
      background-color: white;
      mask-image: radial-gradient(120% 60% at 50% 30%, black 60%, transparent 100%);
      will-change: transform;
    }
    /* Marquee */
    @keyframes marquee { from { transform: translate3d(0,0,0); } to { transform: translate3d(-50%,0,0); } }
    .marquee-track { display:inline-block; white-space:nowrap; animation: marquee 26s linear infinite; will-change: transform; }

    /* Subtle blob float (CSS only, low-cost) */
    @keyframes floaty { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(0,-8px,0) scale(1.02); } }
    .floaty { animation: floaty 10s ease-in-out infinite; will-change: transform; }

    /* === Scroll-Linked Animations (no JS) === */
    /* Fallback: elements visible by default if not supported */
    .sd-up, .sd-fade, .sd-scale, .sd-line { opacity: 1; transform: none; }

    /* Progressive enhancement for browsers supporting View Timelines */
    @supports (animation-timeline: view()) {
      @keyframes sdFadeUp { from { opacity: 0; transform: translate3d(0,18px,0); } to { opacity: 1; transform: translate3d(0,0,0); } }
      @keyframes sdFade { from { opacity: 0; } to { opacity: 1; } }
      @keyframes sdScale { from { opacity: 0; transform: scale(.98); } to { opacity: 1; transform: scale(1); } }
      @keyframes sdLine { from { transform: scaleX(0); } to { transform: scaleX(1); } }

      .sd-up {
        opacity: 0;
        animation: sdFadeUp linear both;
        animation-timeline: view();
        animation-range: entry 5% cover 30%;
        will-change: transform, opacity;
        backface-visibility: hidden;
      }
      .sd-fade {
        opacity: 0;
        animation: sdFade linear both;
        animation-timeline: view();
        animation-range: entry 5% cover 30%;
        will-change: opacity;
      }
      .sd-scale {
        opacity: 0;
        animation: sdScale linear both;
        animation-timeline: view();
        animation-range: entry 15% cover 35%;
        will-change: transform, opacity;
      }
      .sd-line {
        transform-origin: left;
        animation: sdLine linear both;
        animation-timeline: view();
        animation-range: entry 0% cover 25%;
        will-change: transform;
      }
    }

    /* Card hover (GPU-friendly) */
    .tilt { transition: transform .24s ease, box-shadow .24s ease; transform: translateZ(0); will-change: transform, box-shadow; }
    .tilt:hover { transform: translate3d(0,-4px,0) scale(1.02); box-shadow: 0 10px 30px -10px rgba(0,0,0,.15); }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      .marquee-track, .floaty { animation: none !important; }
      .sd-up, .sd-fade, .sd-scale, .sd-line { animation: none !important; opacity: 1 !important; transform: none !important; }
      .tilt, .tilt:hover { transition: none !important; transform: none !important; box-shadow: none !important; }
    }
  `}</style>
);

/* ------------------------------- SVG shapes -------------------------------- */
const GridSVG = () => (
  <svg className="absolute inset-0 h-full w-full text-gray-200/60" aria-hidden style={{ pointerEvents: "none" }}>
    <defs>
      <pattern id="gridp" width="32" height="32" patternUnits="userSpaceOnUse">
        <path d="M32 0H0V32" fill="none" stroke="currentColor" strokeWidth=".5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#gridp)" />
  </svg>
);
const BlobSVG = ({ className = "", color = "#6366f1", opacity = 0.12 }) => (
  <svg className={className} viewBox="0 0 200 200" aria-hidden style={{ pointerEvents: "none" }} shapeRendering="geometricPrecision">
    <path
      fill={color}
      opacity={opacity}
      d="M47.6,-63.5C61.7,-55.8,74.8,-44.1,80.9,-29.4C87,-14.7,86.2,3,79.3,17.4C72.3,31.8,59.2,42.8,45.2,54.6C31.2,66.4,15.6,78.9,-0.8,79.9C-17.1,81,-34.2,70.6,-47.6,57.3C-61,44.1,-70.7,28,-72.6,10.8C-74.5,-6.5,-68.6,-24.7,-56.6,-34.3C-44.5,-43.9,-26.3,-44.9,-10.5,-51.5C5.3,-58.1,21.7,-70.2,36.7,-70.4C51.6,-70.6,65.2,-59.1,47.6,-63.5Z"
      transform="translate(100 100)"
    />
  </svg>
);

/* -------------------------------- Header ---------------------------------- */
function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all ${
        scrolled ? "bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm" : "bg-white/70 backdrop-blur"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 py-3 flex items-center justify-between">
        <a href="#home" className="flex items-baseline gap-2 group">
          <span className="text-2xl font-black tracking-tight group-hover:text-indigo-600 transition">flo</span>
          <span className="text-xs text-gray-700">Financial Literacy Opportunities</span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#mission" className="hover:text-indigo-600">About</a>
          <a href="#programs" className="hover:text-indigo-600">Programs</a>
          <a href="#featured" className="hover:text-indigo-600">Featured</a>
          <a href="#events" className="hover:text-indigo-600">Events</a>
          <a href="#join" className="hover:text-indigo-600">Join</a>
        </nav>
        <a href="#join" className="hidden md:inline-flex px-4 py-2 rounded-lg bg-black text-white font-semibold hover:bg-indigo-700 transition">
          Join flo
        </a>
      </div>
    </header>
  );
}

/* --------------------------------- Hero ----------------------------------- */
function Hero() {
  const ticker = [
    "Monopoly & Asset Management",
    "Wharton Global Prep",
    "Guest Speaker Q&A",
    "Internship Pathways",
    "JA Titan",
    "flo Pitch Showcase",
  ];
  return (
    <section id="home" className="relative pt-28 grid-bg">
      <GridSVG />
      <BlobSVG className="absolute -top-20 -left-16 w-[28rem] floaty" />
      <BlobSVG className="absolute bottom-0 right-0 w-[26rem] floaty" opacity={0.08} />

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-24 text-center">
        <h1 className="sd-up text-5xl md:text-7xl font-extrabold tracking-tight">
          Financial Literacy <span className="text-indigo-600">Opportunities</span>
        </h1>
        <p className="sd-up mt-5 text-lg text-gray-700 max-w-3xl mx-auto">
          Empowering students nationwide with real-world financial skills, competitions, and career access.
        </p>
        <div className="sd-up mt-8 flex flex-wrap gap-4 justify-center">
          <a href="#join" className="px-6 py-3 rounded-xl bg-black text-white font-semibold hover:bg-indigo-700 transition">
            Join flo
          </a>
          <a href="#programs" className="px-6 py-3 rounded-xl border border-black text-black hover:bg-black hover:text-white transition">
            Explore Programs
          </a>
        </div>

        {/* Partners / trust strip */}
        <div className="sd-fade mt-14 text-xs uppercase tracking-widest text-gray-500">Trusted by</div>
        <div className="sd-up mt-3 flex flex-wrap items-center justify-center gap-8 text-gray-500">
          <span className="font-semibold">Brooklyn Tech</span>
          <span className="font-semibold">BYCIG</span>
          <span className="font-semibold">JA</span>
          <span className="font-semibold">CEE</span>
          <span className="font-semibold">FutureMe</span>
        </div>
      </div>

      {/* Ticker */}
      <div className="band bg-white">
        <div className="overflow-hidden py-2">
          <div className="marquee-track">
            {[...ticker, ...ticker].map((t, i) => (
              <span key={i} className="inline-flex items-center gap-2 px-6 text-gray-700 text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Mission --------------------------------- */
function Mission() {
  const steps = [
    { k: "Learn", d: "Master money, markets, and risk with clean, practical workshops." },
    { k: "Practice", d: "Apply skills through stock pitches, portfolios, and simulations." },
    { k: "Access", d: "Open doors to mentors, internships, and career pathways." },
  ];
  return (
    <section id="mission" className="relative bg-white band">
      <div className="mx-auto max-w-7xl px-5 py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="sd-up text-4xl md:text-5xl font-bold">
            Our <span className="text-indigo-600">Mission</span>
          </h2>
          <div className="sd-line mt-2 h-0.5 bg-indigo-600 w-32" />
          <p className="sd-up mt-4 text-lg text-gray-700">
            To empower high school students with financial literacy, hands-on competition experience,
            and access to real career opportunities in finance, business, and real estate.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="sd-scale rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-center">
              <div className="text-4xl font-extrabold text-black">500+</div>
              <div className="mt-1 text-gray-700 text-sm">Members</div>
            </div>
            <div className="sd-scale rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-center">
              <div className="text-4xl font-extrabold text-black">20+</div>
              <div className="mt-1 text-gray-700 text-sm">Schools</div>
            </div>
            <div className="sd-scale rounded-xl border border-gray-200 bg-white p-6 shadow-sm text-center">
              <div className="text-4xl font-extrabold text-black">10+</div>
              <div className="mt-1 text-gray-700 text-sm">Competitions</div>
            </div>
          </div>
        </div>

        <div className="relative">
          <BlobSVG className="absolute -top-16 -right-10 w-80" opacity={0.08} />
          <ol className="relative space-y-6">
            <span className="absolute left-3 top-0 bottom-0 w-px bg-gray-300" />
            {steps.map((s, idx) => (
              <li key={idx} className="sd-up relative pl-10">
                <span className="absolute left-0 top-2 h-3 w-3 rounded-full bg-indigo-600" />
                <div className="font-semibold">{s.k}</div>
                <div className="text-gray-700 text-sm">{s.d}</div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Programs -------------------------------- */
function Programs() {
  const cards = [
    {
      title: "Financial Literacy & Skills",
      body: "Fundamentals of stocks, real estate, and asset management.",
      icon: "💡",
    },
    {
      title: "Competitions & Prep",
      body: "Wharton Global, JA Titan, and Shark Tank–style challenges.",
      icon: "🏆",
    },
    {
      title: "Guest Speakers & Networking",
      body: "Exclusive sessions with young professionals, alumni, and founders.",
      icon: "🎙️",
    },
    {
      title: "Career Opportunities",
      body: "Internships via BYCIG, JA, FutureMe, CEE, and more.",
      icon: "🚀",
    },
    {
      title: "Community & Expansion",
      body: "Student-run chapters that scale nationwide.",
      icon: "🌐",
    },
  ];
  return (
    <section id="programs" className="relative bg-gray-50 band overflow-hidden">
      <BlobSVG className="absolute -left-16 top-1/3 w-96" opacity={0.08} />
      <div className="mx-auto max-w-7xl px-5 py-24">
        <h2 className="sd-up text-4xl md:text-5xl font-bold text-center mb-10">
          What We <span className="text-indigo-600">Offer</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <div key={i} className="sd-up tilt rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md">
              <div className="text-3xl">{c.icon}</div>
              <div className="mt-3 font-semibold text-lg">{c.title}</div>
              <div className="mt-1 text-sm text-gray-700">{c.body}</div>
            </div>
          ))}
        </div>

        <div className="sd-fade mt-10 rounded-xl border border-indigo-200/60 bg-white p-5 flex flex-wrap items-center justify-center gap-4">
          <span className="text-sm text-gray-700">Resume-ready projects · Stock pitches · Portfolios · Startup proposals · Mentorship</span>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Featured -------------------------------- */
function Featured() {
  return (
    <section id="featured" className="relative bg-white band overflow-hidden">
      <GridSVG />
      <div className="mx-auto max-w-7xl px-5 py-24 text-center">
        <h3 className="sd-up text-3xl md:text-4xl font-bold">Monopoly & Asset Management Club</h3>
        <p className="sd-up mt-3 text-gray-700">
          Flagship program at Brooklyn Technical High School — expanding nationwide.
        </p>
        <a
          href="#join"
          className="sd-up mt-8 inline-flex px-6 py-3 rounded-xl bg-black text-white font-semibold hover:bg-indigo-700 transition"
        >
          Start a Chapter
        </a>

        {/* Marquee badges */}
        <div className="sd-fade mt-12 overflow-hidden">
          <div className="marquee-track">
            {["Strategy", "Teamwork", "Pitching", "Negotiation", "Valuation", "Risk"].map((b, i) => (
              <span key={i} className="mx-4 inline-flex items-center gap-2 text-sm text-gray-700">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" /> {b}
              </span>
            ))}
            {["Strategy", "Teamwork", "Pitching", "Negotiation", "Valuation", "Risk"].map((b, i) => (
              <span key={`x${i}`} className="mx-4 inline-flex items-center gap-2 text-sm text-gray-700">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" /> {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Events --------------------------------- */
function Events() {
  const events = [
    { date: "Sep 15", title: "Monopoly Night jerkoff", meta: "Fun & strategy night" },
    { date: "Oct 10", title: "Wharton Global Prep", meta: "Sharpen analysis & pitch" },
    { date: "Nov 05", title: "Finance Pro Guest Q&A", meta: "Networking & insights" },
  ];
  return (
    <section id="events" className="relative bg-gray-50 band">
      <div className="mx-auto max-w-7xl px-5 py-24">
        <h2 className="sd-up text-4xl md:text-5xl font-bold text-center mb-10">
          Upcoming <span className="text-indigo-600">Events</span>
        </h2>

        <div className="relative max-w-4xl mx-auto">
          <span className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gray-300" />
          <ul className="space-y-8">
            {events.map((e, i) => (
              <li key={i} className={`sd-up grid sm:grid-cols-2 gap-6 items-stretch ${i % 2 ? "sm:text-left" : "sm:text-right"}`}>
                {i % 2 === 0 ? (
                  <>
                    <div className="sm:pr-10 order-1 sm:order-1">
                      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="flex items-baseline gap-3">
                          <div className="text-2xl font-extrabold text-indigo-600 leading-none">{e.date}</div>
                        </div>
                        <div className="mt-2 font-semibold text-lg">{e.title}</div>
                        <div className="text-gray-700 text-sm mt-1">{e.meta}</div>
                        <a
                          href="#join"
                          className="mt-4 inline-flex px-4 py-2 rounded-lg border border-black text-black hover:bg-black hover:text-white transition text-sm font-semibold"
                        >
                          RSVP
                        </a>
                      </div>
                    </div>
                    <div className="relative order-2 sm:order-2">
                      <span className="hidden sm:block absolute left-1/2 -translate-x-1/2 top-3 h-3 w-3 bg-indigo-600 rounded-full" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="relative order-2 sm:order-1">
                      <span className="hidden sm:block absolute left-1/2 -translate-x-1/2 top-3 h-3 w-3 bg-indigo-600 rounded-full" />
                    </div>
                    <div className="sm:pl-10 order-1 sm:order-2">
                      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="flex items-baseline gap-3">
                          <div className="text-2xl font-extrabold text-indigo-600 leading-none">{e.date}</div>
                        </div>
                        <div className="mt-2 font-semibold text-lg">{e.title}</div>
                        <div className="text-gray-700 text-sm mt-1">{e.meta}</div>
                        <a
                          href="#join"
                          className="mt-4 inline-flex px-4 py-2 rounded-lg border border-black text-black hover:bg-black hover:text-white transition text-sm font-semibold"
                        >
                          RSVP
                        </a>
                      </div>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------- Join --------------------------------- */
function Join() {
  const items = [
    "Workshops on financial literacy and skills",
    "Competition preparation and support",
    "Mentorship from professionals and alumni",
    "Pathways to internships and careers",
  ];
  return (
    <section id="join" className="relative bg-black text-white band">
      <BlobSVG className="absolute -top-24 right-0 w-96" color="#818cf8" opacity={0.18} />
      <div className="mx-auto max-w-6xl px-5 py-24 text-center">
        <h2 className="sd-up text-4xl md:text-5xl font-bold">
          Join <span className="text-indigo-300">flo</span> Today
        </h2>
        <p className="sd-fade mt-3 text-gray-300 max-w-2xl mx-auto">
          Workshops, mentorship, competitions, and clear pathways into real careers.
        </p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
          {items.map((it, i) => (
            <div key={i} className="sd-up rounded-xl border border-white/20 bg-white/5 p-4">
              <span className="mr-2 text-indigo-300">✔</span>{it}
            </div>
          ))}
        </div>
        <div className="sd-up mt-8 flex flex-wrap gap-4 justify-center">
          <a href="mailto:hello@example.org" className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-indigo-200 transition">
            Email Us
          </a>
          <a href="#featured" className="px-6 py-3 rounded-xl border border-white text-white hover:bg-white hover:text-black transition font-semibold">
            Start a Chapter
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- Footer -------------------------------- */
function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-5 py-8 text-sm text-gray-600 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>© {new Date().getFullYear()} flo. All rights reserved.</div>
        <div className="flex items-center gap-6">
          <a className="hover:text-indigo-600" href="#" rel="noreferrer">Instagram</a>
          <a className="hover:text-indigo-600" href="#" rel="noreferrer">Discord</a>
          <a className="hover:text-indigo-600" href="#" rel="noreferrer">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}

/* ----------------------------------- App ---------------------------------- */
export default function App() {
  return (
    <div className="min-h-screen bg-white text-black">
      <GlobalStyles />
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <Mission />
        <Programs />
        <Featured />
        <Events />
        <Join />
      </main>
      <Footer />
    </div>
  );
}
