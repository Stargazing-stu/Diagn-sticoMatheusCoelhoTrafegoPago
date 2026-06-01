import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode, type CSSProperties, Fragment } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fervor — Creative Studio" },
      { name: "description", content: "Fervor — a creative studio shaping bold visions into power for ambitious founders." },
      { property: "og:title", content: "Fervor — Creative Studio" },
      { property: "og:description", content: "Fervor — a creative studio shaping bold visions into power for ambitious founders." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  component: App,
});

const ACCENT = "#5E0ED7";
const NAV_LINKS = [
  { label: "Story", href: "#story" },
  { label: "Expertise", href: "#expertise" },
  { label: "Studios", href: "#studios" },
  { label: "Feedback", href: "#feedback" },
];

/* Icons */
const ArrowUpRight = ({ className, strokeWidth = 2 }: { className?: string; strokeWidth?: number }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);
const XIcon = ({ className, strokeWidth = 2 }: { className?: string; strokeWidth?: number }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const ArrowDown = ({ className, strokeWidth = 2 }: { className?: string; strokeWidth?: number }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </svg>
);

/* Helpers */
function useInView(threshold = 0.18) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); ob.disconnect(); } },
      { threshold }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

function FadeUp({ as: Tag = "div", delay = 0, className = "", style = {}, children }: { as?: any; delay?: number; className?: string; style?: CSSProperties; children: ReactNode }) {
  const [ref, inView] = useInView();
  return (
    <Tag ref={ref as any} className={(inView ? "anim-fadeUp " : "opacity-0 ") + className} style={{ ...style, animationDelay: delay + "s" }}>
      {children}
    </Tag>
  );
}

function ClipReveal({ lines, className = "", style = {}, stagger = 0.1, baseDelay = 0, align = "left" }: { lines: ReactNode[]; className?: string; style?: CSSProperties; stagger?: number; baseDelay?: number; align?: "left" | "right" | "center" }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref as any} style={{ textAlign: align }}>
      {lines.map((line, i) => (
        <div key={i} className="overflow-hidden">
          <span
            className={(inView ? "anim-word " : "clip-pre ") + className}
            style={{ ...style, animationDelay: baseDelay + i * stagger + "s" }}
          >
            {line}
          </span>
        </div>
      ))}
    </div>
  );
}

function CountUp({ to, duration = 1600, immediate = false, className = "", style = {} }: { to: number; duration?: number; immediate?: boolean; className?: string; style?: CSSProperties }) {
  const [ref, inView] = useInView(0.4);
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current || !(immediate || inView)) return;
    started.current = true;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, immediate, to, duration]);
  return <span ref={ref as any} className={className} style={style}>{val}</span>;
}

function ClipImage({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const [ref, inView] = useInView(0.15);
  return (
    <div ref={ref as any} className={(inView ? "anim-clip " : "clip-hidden ") + className} style={{ animationDelay: delay + "s" }}>
      {children}
    </div>
  );
}

function Logo() {
  return (
    <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0" style={{ borderColor: ACCENT }}>
      <div className="w-[10px] h-[10px] rounded-full" style={{ backgroundColor: ACCENT }} />
    </div>
  );
}

function Placeholder({ label, ratio = "4 / 3", light = false, className = "" }: { label: string; ratio?: string; light?: boolean; className?: string }) {
  return (
    <div
      className={(light ? "ph-stripes-light " : "ph-stripes ") + "relative w-full overflow-hidden flex items-center justify-center " + className}
      style={{ aspectRatio: ratio }}
    >
      <span className={"font-mono text-[10px] sm:text-xs tracking-widest uppercase " + (light ? "text-white/45" : "text-black/40")}>
        [ {label} ]
      </span>
    </div>
  );
}

function SectionLabel({ index, title, light = false }: { index: string; title: string; light?: boolean }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref as any}
      className={(inView ? "anim-fadeUp " : "opacity-0 ") + "flex items-center gap-3 text-[11px] sm:text-xs font-semibold tracking-widest uppercase " + (light ? "text-white/60" : "text-black/55")}
    >
      <span style={{ color: ACCENT }}>({index})</span>
      <span
        className="h-px origin-left transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ width: "2rem", backgroundColor: "currentColor", transform: inView ? "scaleX(1)" : "scaleX(0)", transitionDelay: "0.25s" }}
      />
      <span>{title}</span>
    </div>
  );
}

/* Nav */
function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={"fixed top-0 inset-x-0 z-40 transition-colors duration-300 " +
          (scrolled ? "bg-white/90 backdrop-blur-md border-b border-black/10" : "bg-transparent")}
      >
        <div className="flex items-center justify-between px-5 sm:px-8 md:px-12 py-4 md:py-5">
          <a href="#top" className="anim-fadeDown flex items-center gap-3" style={{ animationDelay: "0s" }}>
            <Logo />
            <span className="text-sm font-semibold tracking-widest uppercase">Fervor</span>
          </a>

          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {NAV_LINKS.map((link, idx) => (
              <a
                key={link.label}
                href={link.href}
                className="anim-fadeDown text-sm font-semibold tracking-widest uppercase text-black hover:opacity-50 transition-opacity"
                style={{ animationDelay: (idx + 1) * 0.1 + "s" }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="anim-fadeDown md:hidden w-9 h-9 rounded-full bg-black flex flex-col items-center justify-center gap-1 shrink-0"
            style={{ animationDelay: "0.5s" }}
          >
            <span className="w-4 h-0.5 bg-white" />
            <span className="w-4 h-0.5 bg-white" />
            <span className="w-4 h-0.5 bg-white" />
          </button>

          <a
            href="#contact"
            className="anim-fadeDown hidden md:flex items-center gap-1.5 text-sm font-semibold tracking-widest uppercase hover:opacity-70 transition-opacity"
            style={{ color: ACCENT, animationDelay: "0.5s" }}
          >
            Work With Us
            <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
          </a>
        </div>
      </nav>

      {menuOpen && (
        <div className="anim-overlay fixed inset-0 z-50 bg-white flex flex-col px-5 sm:px-8 pt-4 pb-8 text-black">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo />
              <span className="text-sm font-semibold tracking-widest uppercase">Fervor</span>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="w-9 h-9 rounded-full bg-black flex items-center justify-center"
            >
              <XIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
            </button>
          </div>

          <div className="flex flex-col gap-8 mt-16">
            {NAV_LINKS.map((link, idx) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="anim-link text-3xl font-semibold tracking-widest uppercase"
                style={{ animationDelay: 0.1 + idx * 0.07 + "s" }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="mt-auto flex items-center gap-2 text-xl font-semibold uppercase tracking-wide"
            style={{ color: ACCENT }}
          >
            Work With Us
            <ArrowUpRight className="w-6 h-6" strokeWidth={2.5} />
          </a>
        </div>
      )}
    </>
  );
}

/* Hero */
function Hero() {
  return (
    <section id="top" className="relative w-full overflow-hidden" style={{ minHeight: "clamp(700px, 100vh, 1000px)" }}>
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay loop muted playsInline preload="auto"
        width={1920}
        height={1080}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260517_222138_3e3205be-3364-417b-a64a-bfe087acbec4.mp4"
      />

      <div className="relative z-10 flex flex-col text-black pt-20 md:pt-24" style={{ minHeight: "clamp(700px, 100vh, 1000px)" }}>
        <div className="flex-1 flex items-center justify-end px-5 sm:px-8 md:px-12 py-8 md:py-0">
          <div className="flex flex-row items-start gap-5 sm:gap-8 md:gap-10">
            {[{ v: "300", l: "CRAFTED\nBRANDS" }, { v: "200", l: "DIGITAL\nPRODUCTS" }, { v: "100", l: "VENTURES\nFUNDED" }].map((s, idx) => (
              <div key={s.v} className="anim-fadeUp text-right" style={{ animationDelay: (idx + 2) * 0.12 + "s" }}>
                <div className="font-semibold leading-none" style={{ fontSize: "clamp(1.5rem, 5vw, 3.5rem)" }}>
                  <span style={{ color: ACCENT, fontSize: "0.5em" }}>+</span>
                  <CountUp to={Number(s.v)} immediate className="text-black" />
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm font-semibold tracking-widest uppercase text-black whitespace-pre-line leading-tight mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6 md:gap-12 px-5 sm:px-8 md:px-12 pb-8 md:pb-12">
          <div className="flex flex-row items-center justify-between gap-4">
            <p className="anim-fadeUp text-[10px] sm:text-xs md:text-sm font-semibold tracking-widest uppercase max-w-[130px] sm:max-w-[160px] md:max-w-xs" style={{ animationDelay: "0.6s" }}>
              Shaping Bold<br />Visions Into Power<br />For Your Tribe
            </p>
            <a href="#contact" className="anim-fadeUp flex items-center gap-1 font-semibold uppercase tracking-wide whitespace-nowrap text-base sm:text-xl md:text-2xl hover:opacity-70 transition-opacity" style={{ color: ACCENT, animationDelay: "0.72s" }}>
              Work With Us
              <ArrowUpRight className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px]" strokeWidth={2.5} />
            </a>
          </div>

          <div className="flex flex-row items-end justify-between gap-3 sm:gap-4">
            <div className="anim-fadeUp w-[120px] sm:w-[180px] md:w-[280px] shrink-0" style={{ animationDelay: "0.84s" }}>
              <p className="text-[9px] sm:text-xs md:text-sm font-semibold tracking-widest uppercase text-left md:text-right">
                Creative Studios Built Around Elevating Your Vision Into Striking Reality
              </p>
            </div>
            <div className="text-right">
              {["Fearless", "Vision", "Delivered"].map((word, idx) => (
                <div key={word} className="overflow-hidden">
                  <span className="anim-word font-semibold uppercase text-black" style={{ fontSize: "clamp(2rem, 9vw, 9rem)", lineHeight: 0.88, animationDelay: 0.4 + idx * 0.14 + "s" }}>{word}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Marquee */
function Marquee() {
  const items = ["Brand Identity", "Digital Products", "Motion & Film", "Strategy", "Art Direction", "Web Development"];
  const Run = () => (
    <div className="flex items-center shrink-0">
      {items.map((it) => (
        <div key={it} className="flex items-center shrink-0">
          <span className="px-6 md:px-10 text-sm md:text-base font-semibold tracking-widest uppercase whitespace-nowrap">{it}</span>
          <span className="w-2 h-2 rotate-45 shrink-0" style={{ backgroundColor: ACCENT }} />
        </div>
      ))}
    </div>
  );
  return (
    <div className="border-y border-black/10 py-5 overflow-hidden bg-white">
      <div className="marquee-track">
        <Run />
        <Run />
      </div>
    </div>
  );
}

/* Story */
function Story() {
  return (
    <section id="story" className="px-5 sm:px-8 md:px-12 py-24 md:py-40 max-w-[1600px] mx-auto">
      <SectionLabel index="01" title="Story" />
      <div className="mt-10 md:mt-16">
        <ClipReveal
          lines={["We are a creative", "studio for founders", "who refuse to blend in."]}
          className="font-semibold uppercase text-black"
          style={{ fontSize: "clamp(1.75rem, 6vw, 5.5rem)", lineHeight: 0.95 }}
          stagger={0.12}
        />
      </div>
      <div className="mt-12 md:mt-20 flex flex-col md:flex-row md:justify-end gap-8">
        <FadeUp className="md:max-w-md" delay={0.1}>
          <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase leading-relaxed text-black/70">
            Founded on a single belief — that the boldest ideas deserve the sharpest craft. We partner with ambitious teams to turn raw vision into brands, products and films the world cannot ignore.
          </p>
          <a href="#expertise" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold tracking-widest uppercase hover:opacity-70 transition-opacity" style={{ color: ACCENT }}>
            See What We Do
            <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
          </a>
        </FadeUp>
      </div>
    </section>
  );
}

/* Expertise */
function Expertise() {
  const services = [
    { n: "01", t: "Brand Identity", d: "Logos, systems, guidelines — and the rules worth breaking." },
    { n: "02", t: "Digital Product", d: "Apps and platforms designed end to end." },
    { n: "03", t: "Motion & Film", d: "Title sequences, launch films, social motion." },
    { n: "04", t: "Strategy", d: "Positioning, naming and the narrative beneath it all." },
    { n: "05", t: "Web Development", d: "Editorial sites and high-craft front-ends." },
  ];
  return (
    <section id="expertise" className="px-5 sm:px-8 md:px-12 py-24 md:py-40 max-w-[1600px] mx-auto">
      <SectionLabel index="02" title="Expertise" />
      <div className="mt-12 md:mt-20 border-t border-black/15">
        {services.map((s, i) => (
          <FadeUp key={s.n} delay={i * 0.06} className="group border-b border-black/15">
            <div className="grid grid-cols-12 items-center gap-4 py-7 md:py-10 transition-colors">
              <span className="col-span-2 md:col-span-1 text-xs sm:text-sm font-semibold tracking-widest" style={{ color: ACCENT }}>{s.n}</span>
              <span className="col-span-8 md:col-span-5 font-semibold uppercase tracking-wide transition-transform duration-300 group-hover:translate-x-2" style={{ fontSize: "clamp(1.25rem, 3.5vw, 2.75rem)", lineHeight: 1 }}>{s.t}</span>
              <span className="hidden md:block md:col-span-5 text-xs lg:text-sm font-semibold tracking-widest uppercase text-black/55 text-right">{s.d}</span>
              <span className="col-span-2 md:col-span-1 flex justify-end">
                <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 transition-all duration-300 text-black/30 group-hover:text-black group-hover:rotate-0 -rotate-45" strokeWidth={2} />
              </span>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

/* Work */
function Work() {
  const projects = [
    { name: "Helios", cat: "Brand Identity", year: "2025", file: "helios-brand", ratio: "4 / 3" },
    { name: "Northwind", cat: "Digital Product", year: "2025", file: "northwind-app", ratio: "4 / 3" },
    { name: "Vanta", cat: "Motion & Film", year: "2024", file: "vanta-film", ratio: "4 / 3" },
    { name: "Meridian", cat: "Web Development", year: "2024", file: "meridian-web", ratio: "4 / 3" },
  ];
  return (
    <section id="studios" className="px-5 sm:px-8 md:px-12 py-24 md:py-40 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <SectionLabel index="03" title="Selected Work" />
        <FadeUp delay={0.1}>
          <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-black/55 sm:text-right max-w-xs">A glimpse of recent collaborations across brand, product and film.</p>
        </FadeUp>
      </div>

      <div className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-14 md:gap-y-20">
        {projects.map((p, i) => (
          <FadeUp key={p.name} delay={(i % 2) * 0.1} className="group cursor-pointer">
            <a href="#contact" className="block">
              <div className="overflow-hidden">
                <ClipImage delay={(i % 2) * 0.1}>
                  <div className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
                    <Placeholder label={p.file + ".jpg"} ratio={p.ratio} />
                  </div>
                </ClipImage>
              </div>
              <div className="mt-5 flex items-start justify-between gap-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-semibold uppercase tracking-wide" style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)" }}>{p.name}</span>
                  <span className="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-black/50">{p.cat}</span>
                </div>
                <span className="text-xs sm:text-sm font-semibold tracking-widest" style={{ color: ACCENT }}>{p.year}</span>
              </div>
            </a>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

/* StatsBand */
function StatsBand() {
  const stats = [
    { v: "300", l: "CRAFTED BRANDS" },
    { v: "200", l: "DIGITAL PRODUCTS" },
    { v: "100", l: "VENTURES FUNDED" },
    { v: "15", l: "YEARS OF CRAFT" },
  ];
  return (
    <section className="bg-black text-white">
      <div className="px-5 sm:px-8 md:px-12 py-20 md:py-32 max-w-[1600px] mx-auto">
        <SectionLabel index="04" title="By The Numbers" light />
        <div className="mt-12 md:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
          {stats.map((s, i) => (
            <FadeUp key={s.l} delay={i * 0.08} className="border-l border-white/20 pl-5 md:pl-8">
              <div className="font-semibold leading-none" style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}>
                <span style={{ color: ACCENT, fontSize: "0.5em" }}>+</span>
                <CountUp to={Number(s.v)} />
              </div>
              <div className="mt-3 text-[10px] sm:text-xs md:text-sm font-semibold tracking-widest uppercase text-white/60">{s.l}</div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Feedback */
function Feedback() {
  return (
    <section id="feedback" className="px-5 sm:px-8 md:px-12 py-24 md:py-40 max-w-[1500px] mx-auto">
      <SectionLabel index="05" title="Feedback" />
      <div className="mt-10 md:mt-16 flex gap-4 md:gap-8">
        <span className="font-semibold leading-none shrink-0" style={{ color: ACCENT, fontSize: "clamp(3rem, 9vw, 9rem)", lineHeight: 0.7 }}>“</span>
        <ClipReveal
          lines={["They turned our", "vision into something", "the whole industry", "now tries to copy."]}
          className="font-semibold uppercase text-black"
          style={{ fontSize: "clamp(1.5rem, 5vw, 4.5rem)", lineHeight: 1 }}
          stagger={0.1}
        />
      </div>
      <FadeUp className="mt-10 md:mt-14 md:pl-20 flex items-center gap-4" delay={0.1}>
        <div className="w-12 h-12 rounded-full ph-stripes shrink-0" />
        <div>
          <div className="text-sm font-semibold tracking-widest uppercase">Dana Reyes</div>
          <div className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-black/50">Founder — Northwind</div>
        </div>
      </FadeUp>
    </section>
  );
}

/* CTA */
function CTA() {
  return (
    <section id="contact" className="px-5 sm:px-8 md:px-12 pt-10 pb-24 md:pb-40 max-w-[1600px] mx-auto">
      <div className="border-t border-black/15 pt-16 md:pt-28">
        <FadeUp className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-black/55">(Let's Work)</FadeUp>
        <div className="mt-8 md:mt-12">
          <ClipReveal
            lines={["Let's Build", "Something", "Fearless"]}
            className="font-semibold uppercase text-black"
            style={{ fontSize: "clamp(2.5rem, 12vw, 12rem)", lineHeight: 0.86 }}
            stagger={0.12}
          />
        </div>
        <div className="mt-12 md:mt-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
          <FadeUp delay={0.1}>
            <a href="mailto:hello@fervor.studio" className="flex items-center gap-2 font-semibold uppercase tracking-wide hover:opacity-70 transition-opacity" style={{ color: ACCENT, fontSize: "clamp(1.25rem, 3vw, 2.25rem)" }}>
              hello@fervor.studio
              <ArrowUpRight className="w-6 h-6 md:w-8 md:h-8" strokeWidth={2.5} />
            </a>
          </FadeUp>
          <FadeUp delay={0.18} className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-black/55 sm:text-right max-w-xs">
            Currently booking projects for Q3 — Q4 2026. Tell us what you're building.
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

/* Footer */
function Footer() {
  const cols = [
    { h: "Menu", items: ["Story", "Expertise", "Studios", "Feedback"] },
    { h: "Social", items: ["Instagram", "LinkedIn", "Behance", "Twitter / X"] },
    { h: "Studio", items: ["Brooklyn, NY", "Lisbon, PT", "+1 (212) 555 0148", "hello@fervor.studio"] },
  ];
  return (
    <footer className="bg-black text-white">
      <div className="px-5 sm:px-8 md:px-12 pt-20 md:pt-28 pb-10 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
          <FadeUp className="col-span-2 md:col-span-1 flex items-start">
            <div className="flex items-center gap-3">
              <Logo />
              <span className="text-base font-semibold tracking-widest uppercase">Fervor</span>
            </div>
          </FadeUp>
          {cols.map((c, i) => (
            <FadeUp key={c.h} delay={0.08 + i * 0.08}>
              <div className="text-[11px] font-semibold tracking-widest uppercase text-white/40">{c.h}</div>
              <ul className="mt-5 flex flex-col gap-3">
                {c.items.map((it) => (
                  <li key={it}>
                    <a href="#" className="text-xs sm:text-sm font-semibold tracking-widest uppercase hover:opacity-60 transition-opacity">{it}</a>
                  </li>
                ))}
              </ul>
            </FadeUp>
          ))}
        </div>

        <div className="mt-20 md:mt-28">
          <ClipReveal
            lines={[<Fragment key="wm">Fervor<span style={{ color: ACCENT }}>.</span></Fragment>]}
            className="font-semibold uppercase leading-none text-white/95 select-none"
            style={{ fontSize: "clamp(3.5rem, 18vw, 18rem)", letterSpacing: "-0.02em" }}
          />
        </div>

        <FadeUp as="div" className="mt-10 pt-8 border-t border-white/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-[11px] font-semibold tracking-widest uppercase text-white/50">
          <span>© 2026 Fervor Studio</span>
          <span className="hidden sm:inline">Fearless Vision Delivered</span>
          <a href="#top" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
            Back To Top
            <ArrowDown className="w-3.5 h-3.5 rotate-180" strokeWidth={2.5} />
          </a>
        </FadeUp>
      </div>
    </footer>
  );
}

function App() {
  return (
    <div className="relative w-full">
      <Nav />
      <Hero />
      <Marquee />
      <Story />
      <Expertise />
      <Work />
      <StatsBand />
      <Feedback />
      <CTA />
      <Footer />
    </div>
  );
}
