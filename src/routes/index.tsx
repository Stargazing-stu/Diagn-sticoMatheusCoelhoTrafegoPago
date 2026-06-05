import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode, type CSSProperties, Fragment } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Matheus Coelho — Consórcio Imobiliário" },
      { name: "description", content: "Proposta de Growth com Meta Ads para Matheus Coelho Consórcio — Curitiba, PR." },
      { property: "og:title", content: "Matheus Coelho — Consórcio Imobiliário" },
      { property: "og:description", content: "Proposta de Growth com Meta Ads para Matheus Coelho Consórcio — Curitiba, PR." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  component: App,
});

const ACCENT = "#1A56DB";
const NAV_LINKS = [
  { label: "Diagnóstico", href: "#diagnostico" },
  { label: "Plano", href: "#plano" },
  { label: "Criativos", href: "#criativos" },
  { label: "Cronograma", href: "#cronograma" },
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
      <span className="text-[9px] font-bold tracking-tight" style={{ color: ACCENT }}>MC</span>
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
            <span className="text-sm font-semibold tracking-widest uppercase">Matheus Coelho</span>
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
            href="#contato"
            className="anim-fadeDown hidden md:flex items-center gap-1.5 text-sm font-semibold tracking-widest uppercase hover:opacity-70 transition-opacity"
            style={{ color: ACCENT, animationDelay: "0.5s" }}
          >
            Vamos Conversar
            <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
          </a>
        </div>
      </nav>

      {menuOpen && (
        <div className="anim-overlay fixed inset-0 z-50 bg-white flex flex-col px-5 sm:px-8 pt-4 pb-8 text-black">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo />
              <span className="text-sm font-semibold tracking-widest uppercase">Matheus Coelho</span>
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
            href="#contato"
            onClick={() => setMenuOpen(false)}
            className="mt-auto flex items-center gap-2 text-xl font-semibold uppercase tracking-wide"
            style={{ color: ACCENT }}
          >
            Vamos Conversar
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
    <section id="top" className="relative w-full overflow-hidden" style={{ minHeight: "clamp(700px, 100vh, 1000px)", background: "linear-gradient(135deg, #0a0a1a 0%, #000 100%)" }}>
      <div className="relative z-10 flex flex-col text-white pt-20 md:pt-24" style={{ minHeight: "clamp(700px, 100vh, 1000px)" }}>
        <div className="flex-1 flex items-center justify-end px-5 sm:px-8 md:px-12 py-8 md:py-0">
          <div className="flex flex-row items-start gap-5 sm:gap-8 md:gap-10">
            {[{ v: "130", l: "MILHÕES EM\nCRÉDITO" }, { v: "3", l: "CAMPANHAS\nPLANEJADAS" }, { v: "4", l: "SEMANAS DE\nEXECUÇÃO" }].map((s, idx) => (
              <div key={s.v} className="anim-fadeUp text-right" style={{ animationDelay: (idx + 2) * 0.12 + "s" }}>
                <div className="font-semibold leading-none text-white" style={{ fontSize: "clamp(1.5rem, 5vw, 3.5rem)" }}>
                  <span style={{ color: ACCENT, fontSize: "0.5em" }}>+</span>
                  <CountUp to={Number(s.v)} immediate className="text-white" />
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm font-semibold tracking-widest uppercase text-white/60 whitespace-pre-line leading-tight mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6 md:gap-12 px-5 sm:px-8 md:px-12 pb-8 md:pb-12">
          <div className="flex flex-row items-center justify-between gap-4">
            <p className="anim-fadeUp text-[10px] sm:text-xs md:text-sm font-semibold tracking-widest uppercase max-w-[130px] sm:max-w-[160px] md:max-w-xs text-white/70" style={{ animationDelay: "0.6s" }}>
              Sem Juros.<br />Sem Enrolação.<br />Com Estratégia.
            </p>
            <a href="#diagnostico" className="anim-fadeUp flex items-center gap-1 font-semibold uppercase tracking-wide whitespace-nowrap text-base sm:text-xl md:text-2xl hover:opacity-70 transition-opacity" style={{ color: ACCENT, animationDelay: "0.72s" }}>
              Ver Proposta
              <ArrowUpRight className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px]" strokeWidth={2.5} />
            </a>
          </div>

          <div className="flex flex-row items-end justify-between gap-3 sm:gap-4">
            <div className="anim-fadeUp w-[120px] sm:w-[180px] md:w-[280px] shrink-0" style={{ animationDelay: "0.84s" }}>
              <p className="text-[9px] sm:text-xs md:text-sm font-semibold tracking-widest uppercase text-white/50">
                Especialista em Consórcio Imobiliário em Curitiba, PR
              </p>
            </div>
            <div className="text-right">
              {["Especialista", "em Consórcio", "Imobiliário"].map((word, idx) => (
                <div key={word} className="overflow-hidden">
                  <span className="anim-word font-semibold uppercase text-white" style={{ fontSize: "clamp(2rem, 9vw, 9rem)", lineHeight: 0.88, animationDelay: 0.4 + idx * 0.14 + "s" }}>{word}</span>
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
  const items = ["Consórcio Imobiliário", "Meta Ads", "Geração de Leads", "Tráfego Pago", "Instagram Growth", "Curitiba, PR", "Sem Juros"];
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

/* DiagnosticoPositivos */
function DiagnosticoPositivos() {
  const pontos = [
    { n: "01", t: "Autoridade e Prova Social", d: "Bio comunica \"+R$130M em crédito\" e \"sem juros abusivos\" — diferencial forte e credibilidade imediata." },
    { n: "02", t: "Conteúdo Educativo", d: "Posts como \"Pouca gente sabe disso\" e \"Um dos piores erros\" performam bem como criativos de anúncio." },
    { n: "03", t: "Prova de Resultado Pessoal", d: "R$3M em vendas em 1 mês, Top 3 Regional, Top 10 Nacional e premiações geram autoridade para anúncios." },
    { n: "04", t: "Presença em Eventos", d: "Feiras, corridas e lançamentos (Eurogarden Maringá, Parque Barigui) reforçam confiança e presença de mercado." },
    { n: "05", t: "Username Descritivo", d: "@matheuscoelho.consorcio funciona como SEO orgânico dentro do Instagram." },
  ];
  return (
    <section id="diagnostico" className="px-5 sm:px-8 md:px-12 py-24 md:py-40 max-w-[1600px] mx-auto">
      <SectionLabel index="01" title="Diagnóstico — Pontos Positivos" />
      <div className="mt-12 md:mt-20 border-t border-black/15">
        {pontos.map((s, i) => (
          <FadeUp key={s.n} delay={i * 0.06} className="group border-b border-black/15">
            <div className="grid grid-cols-12 items-center gap-4 py-7 md:py-10 transition-colors">
              <span className="col-span-2 md:col-span-1 text-xs sm:text-sm font-semibold tracking-widest" style={{ color: "#16a34a" }}>{s.n}</span>
              <span className="col-span-8 md:col-span-5 font-semibold uppercase tracking-wide" style={{ fontSize: "clamp(1rem, 2.5vw, 1.75rem)", lineHeight: 1.1 }}>{s.t}</span>
              <span className="hidden md:block md:col-span-5 text-xs lg:text-sm font-semibold tracking-widest uppercase text-black/55 text-right">{s.d}</span>
              <span className="col-span-2 md:col-span-1 flex justify-end">
                <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-black/20" strokeWidth={2} />
              </span>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

/* ProblemasIdentificados */
function ProblemasIdentificados() {
  const problemas = [
    { n: "01", t: "Volume Crítico de Posts", d: "Apenas 13 posts — insuficiente para construir audiência qualificada. Algoritmo precisa de consistência." },
    { n: "02", t: "Ausência de CTA", d: "Nenhum post direciona o usuário para ação: \"manda mensagem\", \"clique no link\", \"me chama no WhatsApp\"." },
    { n: "03", t: "Sem Link na Bio", d: "Nenhum link de captura (WhatsApp, Linktree, landing page) — perda crítica de conversão com tráfego pago." },
    { n: "04", t: "Engajamento Baixo", d: "758 seguidores com baixa ativação pelo algoritmo — curtidas e comentários escassos nos posts." },
    { n: "05", t: "Linha Editorial Indefinida", d: "Posts pessoais, educativos e premiações se misturam sem cadência ou identidade visual consistente." },
    { n: "06", t: "Thumbnails Sem Padrão", d: "Capas dos Reels sem identidade visual uniforme — prejudica a percepção de profissionalismo do feed." },
  ];
  return (
    <section id="problemas" className="px-5 sm:px-8 md:px-12 py-24 md:py-40 max-w-[1600px] mx-auto">
      <SectionLabel index="02" title="Problemas Identificados" />
      <div className="mt-12 md:mt-20 border-t border-black/15">
        {problemas.map((s, i) => (
          <FadeUp key={s.n} delay={i * 0.06} className="group border-b border-black/15">
            <div className="grid grid-cols-12 items-center gap-4 py-7 md:py-10 transition-colors">
              <span className="col-span-2 md:col-span-1 text-xs sm:text-sm font-semibold tracking-widest" style={{ color: "#dc2626" }}>{s.n}</span>
              <span className="col-span-8 md:col-span-5 font-semibold uppercase tracking-wide" style={{ fontSize: "clamp(1rem, 2.5vw, 1.75rem)", lineHeight: 1.1 }}>{s.t}</span>
              <span className="hidden md:block md:col-span-5 text-xs lg:text-sm font-semibold tracking-widest uppercase text-black/55 text-right">{s.d}</span>
              <span className="col-span-2 md:col-span-1 flex justify-end">
                <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-black/20" strokeWidth={2} />
              </span>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

/* PlanoDeGrowth */
function PlanoDeGrowth() {
  const fases = [
    {
      n: "01",
      t: "Fase 1 — Estrutura",
      tag: "Semana 1 · Pré-Lançamento",
      items: ["Link na bio (wa.me direto ou landing page)", "Bio reescrita com hierarquia clara", "Instalação do Pixel Meta", "2-3 Reels educativos antes de ligar o tráfego"],
    },
    {
      n: "02",
      t: "Fase 2 — Campanhas",
      tag: "Semana 2 · Ativação",
      items: ["Campanha 1: Topo de Funil — Alcance/Visualização (público frio)", "Campanha 2: Meio de Funil — Leads/WhatsApp + Lookalike 1-3%", "Campanha 3: Fundo de Funil — Retargeting 75%+ visualizações"],
    },
    {
      n: "03",
      t: "Fase 3 — Escala",
      tag: "Semanas 3–4 · Otimização",
      items: ["Analisar CPL por criativo", "Pausar criativos com custo alto", "Escalar criativo vencedor", "Consolidar aprendizados para o mês 2"],
    },
  ];
  return (
    <section id="plano" className="px-5 sm:px-8 md:px-12 py-24 md:py-40 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <SectionLabel index="03" title="Plano de Growth — Meta Ads" />
        <FadeUp delay={0.1}>
          <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-black/55 sm:text-right max-w-xs">Estrutura completa de campanhas para geração de leads qualificados.</p>
        </FadeUp>
      </div>

      <div className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-14 md:gap-y-20">
        {fases.map((f, i) => (
          <FadeUp key={f.n} delay={i * 0.1} className="group cursor-default">
            <div className="border border-black/10 p-6 md:p-8 h-full flex flex-col gap-5">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-semibold tracking-widest" style={{ color: ACCENT }}>{f.n}</span>
                <span className="text-[10px] font-semibold tracking-widest uppercase text-black/40">{f.tag}</span>
              </div>
              <span className="font-semibold uppercase tracking-wide" style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", lineHeight: 1.1 }}>{f.t}</span>
              <ul className="flex flex-col gap-2 mt-auto">
                {f.items.map((it, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs sm:text-sm font-semibold tracking-widest uppercase text-black/60">
                    <span style={{ color: ACCENT }} className="shrink-0 mt-0.5">—</span>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

/* StatsBand */
function StatsBand() {
  const stats = [
    { v: "130", l: "MILHÕES EM CRÉDITO ADMINISTRADO" },
    { v: "758", l: "SEGUIDORES NO INSTAGRAM" },
    { v: "13", l: "POSTS PUBLICADOS ATÉ HOJE" },
    { v: "3", l: "EMPRESAS REPRESENTADAS" },
  ];
  return (
    <section className="bg-black text-white">
      <div className="px-5 sm:px-8 md:px-12 py-20 md:py-32 max-w-[1600px] mx-auto">
        {/* StatsBand é interstitial — sem SectionLabel visível */}
        <div className="mt-12 md:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
          {stats.map((s, i) => (
            <FadeUp key={s.l} delay={i * 0.08} className="border-l border-white/20 pl-5 md:pl-8">
              <div className="font-semibold leading-none text-white" style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}>
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

/* CriativosRecomendados */
function CriativosRecomendados() {
  const criativos = [
    {
      letra: "A",
      t: "Dor + Solução",
      formato: "Reel 9:16 · 15-30s · Público Frio",
      roteiro: "Você sabe quanto está pagando de juros no financiamento? O consórcio pode quitar isso e ainda te dar crédito para um novo imóvel, sem pagar um centavo de juros.",
    },
    {
      letra: "B",
      t: "Prova Social",
      formato: "Carrossel ou Imagem · Público Morno",
      roteiro: "R$3 Milhões em vendas em 1 mês — posso te ajudar a conquistar o seu imóvel também. Print de resultado + badge de premiação.",
    },
    {
      letra: "C",
      t: "Educativo com CTA",
      formato: "Reel com Legenda · Retargeting",
      roteiro: "Baseado nos vídeos existentes: Pouca gente sabe disso — adicionar CTA explícito: Quer simular? Link na bio ou me chama no WhatsApp.",
    },
  ];
  return (
    <section id="criativos" className="px-5 sm:px-8 md:px-12 py-24 md:py-40 max-w-[1500px] mx-auto">
      <SectionLabel index="04" title="Criativos Recomendados" />
      <div className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {criativos.map((c, i) => (
          <FadeUp key={c.letra} delay={i * 0.1}>
            <div className="border border-black/10 p-6 md:p-8 flex flex-col gap-4 h-full">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: ACCENT }}>{c.letra}</span>
                <span className="text-xs font-semibold tracking-widest uppercase text-black/50">{c.formato}</span>
              </div>
              <span className="font-semibold uppercase tracking-wide" style={{ fontSize: "clamp(1.1rem, 2vw, 1.4rem)", lineHeight: 1.1 }}>{c.t}</span>
              <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-black/60 leading-relaxed mt-auto">{c.roteiro}</p>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

/* Cronograma */
function Cronograma() {
  const semanas = [
    { n: "01", t: "Semana 1", items: ["Ajustar bio com hierarquia clara", "Criar link WhatsApp / landing page", "Instalar Pixel Meta", "Produzir 2 novos Reels educativos"] },
    { n: "02", t: "Semana 2", items: ["Subir Campanha 2 (Leads) com 3 criativos", "Teste A/B — todo budget na campanha de leads", "Monitorar CPL e ajustar audiências"] },
    { n: "03", t: "Semana 3", items: ["Analisar resultados da Semana 2", "Pausar criativos com CPL alto", "Escalar criativo vencedor", "Ativar Campanha 1 (Topo de Funil)"] },
    { n: "04", t: "Semana 4", items: ["Ativar Campanha 3 (Retargeting)", "Consolidar aprendizados", "Planejar estratégia do Mês 2"] },
  ];
  return (
    <section id="cronograma" className="px-5 sm:px-8 md:px-12 py-24 md:py-40 max-w-[1600px] mx-auto">
      <SectionLabel index="05" title="Cronograma de Execução" />
      <div className="mt-12 md:mt-20 border-t border-black/15">
        {semanas.map((s, i) => (
          <FadeUp key={s.n} delay={i * 0.07} className="border-b border-black/15">
            <div className="grid grid-cols-12 items-start gap-4 py-7 md:py-10">
              <span className="col-span-2 md:col-span-1 text-xs sm:text-sm font-semibold tracking-widest" style={{ color: ACCENT }}>{s.n}</span>
              <span className="col-span-10 md:col-span-2 font-semibold uppercase tracking-wide" style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)", lineHeight: 1 }}>{s.t}</span>
              <div className="col-span-12 md:col-span-9 flex flex-wrap gap-2 md:gap-3">
                {s.items.map((it, j) => (
                  <span key={j} className="inline-flex items-center px-3 py-1.5 border border-black/15 text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-black/60">
                    {it}
                  </span>
                ))}
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

/* CTA */
function CTA() {
  return (
    <section id="contato" className="px-5 sm:px-8 md:px-12 pt-10 pb-24 md:pb-40 max-w-[1600px] mx-auto">
      <div className="border-t border-black/15 pt-16 md:pt-28">
        <FadeUp className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-black/55">(Vamos Começar)</FadeUp>
        <div className="mt-8 md:mt-12">
          <ClipReveal
            lines={["Pronto Para", "Crescer?"]}
            className="font-semibold uppercase text-black"
            style={{ fontSize: "clamp(2.5rem, 12vw, 12rem)", lineHeight: 0.86 }}
            stagger={0.12}
          />
        </div>
        <FadeUp delay={0.08} className="mt-6 md:mt-8 max-w-xl">
          <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-black/55 leading-relaxed">
            Vamos ativar sua presença e gerar leads qualificados para o seu consórcio. Proposta válida para início imediato — Junho 2026.
          </p>
        </FadeUp>
        <div className="mt-12 md:mt-16">
          <FadeUp delay={0.1}>
            <a href="https://wa.me/55XXXXXXXXXXX" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-semibold uppercase tracking-wide hover:opacity-70 transition-opacity" style={{ color: ACCENT, fontSize: "clamp(1.25rem, 3vw, 2.25rem)" }}>
              <ArrowUpRight className="w-[72px] h-[72px] md:w-24 md:h-24" strokeWidth={2} />
            </a>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

/* Footer */
function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="px-5 sm:px-8 md:px-12 pt-20 md:pt-28 pb-10 max-w-[1600px] mx-auto">
        <div className="mt-0">
          <ClipReveal
            lines={[<Fragment key="wm">Consórcio<span style={{ color: ACCENT }}>.</span></Fragment>]}
            className="font-semibold uppercase leading-none text-white/95 select-none"
            style={{ fontSize: "clamp(4rem, 18vw, 18rem)", letterSpacing: "-0.02em" }}
          />
        </div>

        <FadeUp as="div" className="mt-10 pt-8 border-t border-white/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-[11px] font-semibold tracking-widest uppercase text-white/50">
          <span>Matheus Coelho Consórcio — Curitiba, PR</span>
          <a href="#top" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
            Voltar ao Topo
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
      <DiagnosticoPositivos />
      <ProblemasIdentificados />
      <StatsBand />
      <PlanoDeGrowth />
      <CriativosRecomendados />
      <Cronograma />
      <CTA />
      <Footer />
    </div>
  );
}
