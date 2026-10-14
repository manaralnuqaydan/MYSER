"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Phone,
  Headset,
  Info,
  LogIn,
  ArrowUpLeft,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  AudioLines,
  BriefcaseBusiness,
  GraduationCap,
  HeartPulse,
  Building2,
  CarFront,
  Check,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  FileCheck2,
  FileText,
  Globe2,
  Leaf,
  Menu,
  Mic,
  MicOff,
  MoreHorizontal,
  Play,
  Scale,
  Search,
  Send,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  Video,
  VideoOff,
  Wallet,
  X,
} from "lucide-react";

import { assistantFallback, assistantScenarios, copy, curatedServices, directorySectors, type Lang, type Localized } from "@/lib/content";
import { detailedServices } from "@/lib/servicesDetailed";
import { generateLocalAgentResponse, type ChatMessage } from "@/lib/agent";
import { runJourney } from "@/lib/journeys";
import { contentLang, isNative, langDir, languages, uiCopy, type UiCopy, type UiLang } from "@/lib/i18n";
import Brand from "./Brand";
import SectorArt from "./SectorArt";
import PhoneMockups from "./PhoneMockups";
import ConciergeDesk from "./ConciergeDesk";
// Renders **bold** segments inside assistant text as <strong>, so raw asterisks never show in the chat.
function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.length > 4 && part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      part
    ),
  );
}

// Splits a reply into blocks; consecutive numbered steps (even if separated by blank lines) become one block.
function splitBlocks(text: string): string[] {
  const isStep = (t: string) => /^\d+\.\s/.test(t.trim());
  // A heading line directly followed by numbered lines is split into heading + steps.
  const parts = text
    .split("\n\n")
    .map((raw) => raw.trim())
    .filter(Boolean)
    .flatMap((t) => {
      const lines = t.split("\n");
      return lines.length > 1 && !isStep(lines[0]) && lines.slice(1).every(isStep)
        ? [lines[0], lines.slice(1).join("\n")]
        : [t];
    });
  return parts.reduce<string[]>((acc, t) => {
    const last = acc[acc.length - 1];
    if (last !== undefined && isStep(t) && last.split("\n").every(isStep)) {
      acc[acc.length - 1] = `${last}\n${t}`;
    } else {
      acc.push(t);
    }
    return acc;
  }, []);
}

const sectorIcons = {
  people: Users,
  traffic: CarFront,
  business: BriefcaseBusiness,
  justice: Scale,
  work: Building2,
  education: GraduationCap,
  health: HeartPulse,
};
const stepIcons = [
  Smartphone,
  AudioLines,
  Search,
  FileText,
  FileCheck2,
  ShieldCheck,
];
const amounts = [200, 150, 500];

export default function Homepage() {
  const [uiLang, setUiLang] = useState<UiLang>("ar");
  const lang: Lang = contentLang(uiLang);
  const t = uiCopy(uiLang);
  const ar = lang === "ar";
  const sectorName = (item: { id: string; name: Localized } | undefined) =>
    item ? t.sectors[item.id] ?? item.name[lang] : undefined;
  const [langMenu, setLangMenu] = useState(false);
  const conciergeSoon = () => setToast(t.conciergeSoon);
  function openDesk() {
    setModal("desk");
    setAccountMenu(false);
    setMenu(false);
    setChatOpen(false);
  }
  const reduce = useReducedMotion();
  const [menu, setMenu] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [modal, setModal] = useState<
    "services" | "meeting" | "privacy" | "terms" | "login" | "support" | "desk" | null
  >(null);
  const [authView, setAuthView] = useState<"signin" | "signup">("signin");
  const [accountMenu, setAccountMenu] = useState(false);
  const [supportView, setSupportView] = useState<"track" | "new">("track");
  const [sector, setSector] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [service, setService] = useState<string | null>(null);
  const [request, setRequest] = useState(false);
  const [paid, setPaid] = useState<number[]>([]);
  const [toast, setToast] = useState("");
  const [joined, setJoined] = useState(false);
  const [mic, setMic] = useState(true);
  const [camera, setCamera] = useState(true);
  const [chatTarget, setChatTarget] = useState<number | null>(null);
  const chatEnd = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    document.documentElement.lang = uiLang;
    document.documentElement.dir = langDir(uiLang);
  }, [uiLang]);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(id);
  }, [toast]);
  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, typing]);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  useEffect(() => {
    if (!modal && !chatOpen) return;
    previousFocus.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    const id = setTimeout(
      () =>
        dialogRef.current?.querySelector<HTMLElement>("button, input")?.focus(),
      50,
    );
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setModal(null);
        setChatOpen(false);
      }
      if (e.key === "Tab") {
        const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(
          "button:not([disabled]),input,a[href]",
        );
        if (!nodes?.length) return;
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(id);
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      previousFocus.current?.focus();
    };
  }, [modal, chatOpen]);
  const direction = ar ? <ArrowLeft size={17} /> : <ArrowRight size={17} />;
  function openServices(index: number | null = null) {
    setSector(index);
    setService(null);
    setRequest(false);
    setQuery("");
    setModal("services");
    setMenu(false);
    setChatOpen(false);
  }
  useEffect(() => {
    if (!accountMenu) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent && e.key !== "Escape") return;
      if (e instanceof MouseEvent && (e.target as HTMLElement).closest(".account-wrap")) return;
      setAccountMenu(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [accountMenu]);
  useEffect(() => {
    if (!langMenu) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent && e.key !== "Escape") return;
      if (e instanceof MouseEvent && (e.target as HTMLElement).closest(".language-wrap")) return;
      setLangMenu(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [langMenu]);
  function openSupport() {
    setSupportView("track");
    setModal("support");
    setAccountMenu(false);
    setMenu(false);
    setChatOpen(false);
  }
  function openLogin() {
    setAccountMenu(false);
    setAuthView("signin");
    setModal("login");
    setMenu(false);
    setChatOpen(false);
  }
  function answer(value: string) {
    if (!value.trim() || typing) return;
    const trimmed = value.trim();
    setInput("");
    setChatOpen(true);
    setModal(null);
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setTyping(true);

    const v = trimmed.toLowerCase();
    // Goal-to-action journeys come first: one question at a time, then an ordered roadmap
    const journeyRes = runJourney(trimmed, messages, lang);
    const scenario = journeyRes ? undefined : assistantScenarios.find((item) => item.keywords.some((keyword) => v.includes(keyword)));
    const target = scenario
      ? directorySectors.findIndex((item) => item.id === scenario.sectorId)
      : null;

    timer.current = setTimeout(() => {
      if (journeyRes) {
        const idx = journeyRes.suggestedSectorId
          ? directorySectors.findIndex((item) => item.id === journeyRes.suggestedSectorId)
          : -1;
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: journeyRes.text,
            sources: journeyRes.sources,
            suggestedSectorId: journeyRes.suggestedSectorId,
            followUpQuestions: journeyRes.followUpQuestions,
            journey: journeyRes.journey,
            isVerified: true,
          },
        ]);
        setChatTarget(idx !== -1 ? idx : null);
        setTyping(false);
        return;
      }
      // If direct predefined scenario matches, preserve exact response to guarantee tests and consistency
      if (scenario) {
        const result = scenario.response[lang];
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: result,
            suggestedSectorId: scenario.sectorId,
            isVerified: true,
          },
        ]);
        setChatTarget(target !== null && target !== -1 ? target : null);
      } else {
        // Run deep local knowledge agent reasoning
        const agentRes = generateLocalAgentResponse(trimmed, messages, lang);
        const resolvedSectorIdx = agentRes.suggestedSectorId
          ? directorySectors.findIndex((item) => item.id === agentRes.suggestedSectorId)
          : null;
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: agentRes.text,
            sources: agentRes.sources,
            suggestedSectorId: agentRes.suggestedSectorId,
            suggestedServiceId: agentRes.suggestedServiceId,
            followUpQuestions: agentRes.followUpQuestions,
            isVerified: true,
          },
        ]);
        setChatTarget(resolvedSectorIdx !== -1 ? resolvedSectorIdx : null);
      }
      setTyping(false);
    }, 700);
  }
  function switchLang(code: UiLang) {
    setLangMenu(false);
    if (code === uiLang) return;
    if (timer.current) clearTimeout(timer.current);
    setUiLang(code);
    setMessages([]);
    setInput("");
    setTyping(false);
    setChatTarget(null);
    setService(null);
    setRequest(false);
    setQuery("");
    setToast("");
  }
  const reveal = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.12 },
    transition: { duration: reduce ? 0 : 0.65 },
  };
  return (
    <main id="home">
      <a className="skip-link" href="#main-content">
        {ar ? "انتقل إلى المحتوى" : "Skip to content"}
      </a>
      <section className="hero">
        <div
          className="hero-skyline"
          role="img"
          aria-label={
            ar
              ? "مشهد سعودي يجمع برج المملكة والأعلام السعودية عند الغروب"
              : "A cinematic Saudi composition featuring Kingdom Centre and Saudi flags at sunset"
          }
        />
        <div className="hero-shade" />
        <div className="hero-grain" />
        <header className="header container">
          <Brand light />
          <nav
            className={menu ? "nav open" : "nav"}
            aria-label={ar ? "التنقل الرئيسي" : "Main navigation"}
          >
            <a href="#home" className="active" onClick={() => setMenu(false)}>
              {t.home}
            </a>
            <a href="#services" onClick={() => setMenu(false)}>
              {t.services}
            </a>
            <a
              href="#desk"
              onClick={(e) => {
                e.preventDefault();
                openDesk();
              }}
            >
              {t.desk}
            </a>
            <button
              onClick={() => {
                setChatOpen(true);
                setMenu(false);
              }}
            >
              {t.assistant}
            </button>
            <a href="#about" onClick={() => setMenu(false)}>
              {t.about}
            </a>
            <button className="nav-login" onClick={openLogin}>
              {t.signIn}
            </button>
            <button className="nav-login" onClick={openSupport}>
              {t.support}
            </button>
          </nav>
          <div className="header-actions">
            <div className="language-wrap">
              <button
                className="language"
                onClick={() => setLangMenu(!langMenu)}
                aria-expanded={langMenu}
                aria-haspopup="menu"
                aria-label={t.language}
              >
                <Globe2 size={16} />
                <span>{languages.find((item) => item.code === uiLang)?.name}</span>
                <ChevronDown size={14} />
              </button>
              {langMenu && (
                <div className="language-menu" role="menu" aria-label={t.language}>
                  <div className="language-list">
                    {languages.map((item) => (
                      <button
                        key={item.code}
                        role="menuitemradio"
                        aria-checked={item.code === uiLang}
                        className={item.code === uiLang ? "selected" : ""}
                        lang={item.code}
                        onClick={() => switchLang(item.code)}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                  {!isNative(uiLang) && <small>{t.contentFallback}</small>}
                </div>
              )}
            </div>
            <div className="account-wrap">
              <button
                className="account-button"
                onClick={() => setAccountMenu(!accountMenu)}
                aria-expanded={accountMenu}
                aria-haspopup="menu"
                aria-label={ar ? "قائمة الحساب" : "Account menu"}
              >
                {accountMenu ? <X size={22} /> : <Menu size={22} />}
              </button>
              {accountMenu && (
                <div className="account-menu" role="menu">
                  <button role="menuitem" onClick={openLogin}>
                    <LogIn size={18} />
                    {ar ? "تسجيل الدخول" : "Sign in"}
                  </button>
                  <button role="menuitem" onClick={openSupport}>
                    <Headset size={18} />
                    {ar ? "خدمة العملاء" : "Customer service"}
                  </button>
                  <a role="menuitem" href="#about" onClick={() => setAccountMenu(false)}>
                    <Info size={18} />
                    {ar ? "من نحن" : "About us"}
                  </a>
                </div>
              )}
            </div>
            <button
              className="menu-button"
              onClick={() => setMenu(!menu)}
              aria-expanded={menu}
              aria-label={ar ? "فتح القائمة" : "Toggle menu"}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </header>
        <div id="main-content" className="hero-body container">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.9 }}
          >
            <h1>
              {t.headline1}
              <br />
              <span>{t.headline2}</span>
            </h1>
            <p className="hero-sub">{t.sub}</p>
            <div className="hero-buttons">
              <a className="button button-gold" href="#services">
                {t.all}
                {direction}
              </a>
              <a className="button button-outline" href="#journey">
                <span className="play-circle">
                  <Play size={11} fill="currentColor" />
                </span>
                {t.explore}
              </a>
            </div>
            <button
              className="assistant-mobile-launch"
              onClick={() => {
                setChatOpen(true);
                setMenu(false);
              }}
            >
              <Sparkles size={17} />
              {ar ? "اسأل المساعد الإرشادي" : "Ask the guided assistant"}
              {direction}
            </button>
          </motion.div>
          <motion.div
            className="hero-assistant"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduce ? 0 : 0.35, duration: reduce ? 0 : 1 }}
          >
            <div className="assistant-top">
              <span className="ai-icon">
                <Sparkles size={19} />
              </span>
              <span>
                <strong>{t.smart}</strong>
                <small>
                  <i />
                  {t.online}
                </small>
              </span>
              <span className="assistant-orbit">
                <Leaf size={24} />
              </span>
            </div>
            <div className="assistant-content">
              <span className="assistant-greeting">
                {t.welcome}
                <span className="tiny-star">✦</span>
              </span>
              <h2>{t.help}</h2>
              <div className="request-chips">
                {t.chips.map((c, i) => (
                  <button key={c} onClick={() => answer(isNative(uiLang) ? c : copy.en.chips[i])}>
                    {c}
                    <ArrowUpLeft size={12} />
                  </button>
                ))}
              </div>
            </div>
            <form
              className="assistant-input"
              onSubmit={(e) => {
                e.preventDefault();
                answer(input);
              }}
            >
              <button
                type="button"
                className="mic-button"
                aria-label={
                  ar ? "الإدخال الصوتي التجريبي" : "Voice input concept"
                }
                onClick={() => setToast(t.voice)}
              >
                <Mic size={17} />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.input}
                aria-label={t.input}
                maxLength={500}
              />
              <button
                className="send-button"
                type="submit"
                aria-label={ar ? "إرسال" : "Send"}
                disabled={!input.trim() || typing}
              >
                <Send size={16} />
              </button>
            </form>
            <span className="assistant-caption">
              <Sparkles size={12} />
              {ar
                ? "مساعد تجريبي · إرشادات أولية بلغتك"
                : "Demo assistant · Starter guidance in your language"}
            </span>
          </motion.div>
        </div>
        <div className="hero-bottom container">
          <span className="hero-signature">
            {ar
              ? "لمستقبل أسهل،\nفي وطن أكبر."
              : "A simpler tomorrow.\nA greater possibility."}
            <small>A SIMPLER TOMORROW, IN A GREATER SAUDI</small>
          </span>
        </div>
        <div className="hero-curve" />
      </section>

      <section id="services" className="services">
        <div className="container">
          <motion.div className="section-heading heading-row" {...reveal}>
            <div>
              <h2 className="eyebrow">{t.sectorLabel}</h2>
            </div>
          </motion.div>
          <div className="sector-grid">
            {directorySectors.map((item, i) => {
              const title = sectorName(item) ?? item.name[lang];
              const Icon = sectorIcons[item.icon];
              const sectorCurated = curatedServices.filter((entry) => entry.sectorId === item.id);
              const sectorDetailed = detailedServices.filter((entry) => entry.sectorId === item.id);
              const totalAuthorities = Array.from(
                new Set(
                  sectorDetailed.flatMap((s) => (s.requiredAuthorities || []).map((a) => a[lang]))
                )
              );
              return (
                <motion.button
                  className="sector-card"
                  key={title}
                  onClick={() => openServices(i)}
                  {...reveal}
                  transition={{
                    delay: reduce ? 0 : i * 0.07,
                    duration: reduce ? 0 : 0.6,
                  }}
                >
                  <SectorArt index={item.artIndex} />
                  <div className="sector-overlay" />
                  <span className="sector-index">0{i + 1} / MAABAR</span>
                  <span className="sector-icon">
                    <Icon size={25} strokeWidth={1.3} />
                  </span>
                  <div className="sector-content">
                    <div className="sector-badges-bar">
                      <span className="sector-count-badge">
                        {sectorCurated.length} {ar ? "خدمات موثقة" : "services"}
                      </span>
                      {totalAuthorities.length > 0 && (
                        <span className="sector-auth-count-badge">
                          {totalAuthorities.length} {ar ? "جهات رسمية" : "authorities"}
                        </span>
                      )}
                    </div>
                    <h3>{title}</h3>
                    <p>{item.description[lang]}</p>
                    <div className="sector-tags">
                      {sectorCurated.slice(0, 3).map((entry) => (
                        <span key={entry.id}>{entry.name[lang]}</span>
                      ))}
                    </div>
                    <span className="sector-link">
                      {ar ? "استكشف القطاع" : "Explore sector"}
                      <span>
                        {ar ? (
                          <ArrowUpLeft size={18} />
                        ) : (
                          <ArrowUpRight size={18} />
                        )}
                      </span>
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
          <div className="services-footnote">
            <span>
              <span className="little-dot" />
              {ar
                ? "مصادر رسمية. دليل استكشافي واحد."
                : "Official sources. One exploratory guide."}
            </span>
            <span>MAABAR ECOSYSTEM</span>
          </div>
        </div>
      </section>

      <section id="journey" className="journey section-light">
        <div className="contour" />
        <div className="container">
          <motion.div className="section-heading centered" {...reveal}>
            <span className="eyebrow">{t.journeyLabel}</span>
            <h2>{t.journeyTitle}</h2>
            <p>{t.journeySub}</p>
          </motion.div>
          <div className="journey-grid">
            {t.stepTitles.map((title, i) => {
              const Icon = stepIcons[i];
              return (
                <motion.article
                  className="step-card"
                  key={title}
                  {...reveal}
                  transition={{
                    duration: reduce ? 0 : 0.55,
                    delay: reduce ? 0 : i * 0.06,
                  }}
                >
                  <span className="step-number">0{i + 1}</span>
                  {i === 1 ? (
                    <button
                      type="button"
                      className="step-icon step-call"
                      aria-label={ar ? "اتصل بمستشار" : "Call an advisor"}
                      onClick={() =>
                        setToast(
                          ar
                            ? "الاتصال بمستشار سيتوفر قريبًا · هذا عرض تجريبي"
                            : "Calling an advisor is coming soon · This is a demo"
                        )
                      }
                    >
                      <Phone size={22} strokeWidth={1.8} />
                    </button>
                  ) : (
                    <div className="step-icon">
                      <Icon size={27} strokeWidth={1.45} />
                    </div>
                  )}
                  <h3>{title}</h3>
                  <p>{t.stepDescriptions[i]}</p>
                  {i < 5 && <ChevronLeft className="step-arrow" size={16} />}
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="experiences" className="experiences section-light">
        <div className="container">
          <motion.div id="app" className="app-section feature-grid" {...reveal}>
            <div className="feature-copy">
              <span className="eyebrow">{t.appLabel}</span>
              <h2 className="multiline">{t.appTitle}</h2>
              <p>{t.appSub}</p>
              <div className="store-buttons">
                <button onClick={() => setToast(t.appNotice)}>
                  <svg
                    viewBox="0 0 24 24"
                    width="24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M17.1 12.3c0-2 1.6-3 1.7-3.1-1-1.5-2.5-1.7-3-1.7-1.3-.1-2.5.8-3.1.8-.6 0-1.5-.8-2.6-.8-1.4 0-2.8.9-3.5 2.1-1.5 2.6-.4 6.4 1 8.5.7 1 1.5 2.1 2.6 2 1-.1 1.5-.7 2.8-.7s1.7.7 2.8.7c1.2 0 1.9-1 2.6-2 .8-1.1 1.1-2.2 1.1-2.3-.1 0-2.4-.9-2.4-3.5ZM15 6.2c.6-.8 1.1-1.9 1-3-.9 0-2 .6-2.7 1.4-.6.7-1.2 1.9-1.1 3 .9.1 2.1-.6 2.8-1.4Z" />
                  </svg>
                  <span>
                    <small>{t.soon}</small>
                    <strong>App Store</strong>
                  </span>
                </button>
                <button onClick={() => setToast(t.appNotice)}>
                  <Play size={23} fill="#c3d5b2" />
                  <span>
                    <small>{t.soon}</small>
                    <strong>Google Play</strong>
                  </span>
                </button>
              </div>
              <span className="app-disclaimer">{t.appNotice}</span>
            </div>
            <PhoneMockups lang={lang} />
          </motion.div>
        </div>
      </section>

      <section className="closing-banner">
        <div className="closing-pattern" />
        <div className="container">
          <span className="eyebrow">MAABAR / مَعبر</span>
          <h2 className="multiline">{t.ctaTitle}</h2>
          <p>{t.ctaSub}</p>
          <button className="button button-gold" onClick={() => openServices()}>
            {t.start}
            {direction}
          </button>
          <span className="closing-mark">
            <Leaf />
          </span>
        </div>
      </section>
      <footer id="about">
        <div className="container">
          <div className="footer-main">
            <div>
              <Brand />
              <p>{t.footer}</p>
            </div>
            <div className="footer-links">
              <a href="#services">{t.services}</a>
              <button onClick={() => setChatOpen(true)}>{t.assistant}</button>
            </div>
            <span className="footer-saudi">
              <span>صُنع برؤية سعودية</span>
              <small>IMAGINED IN SAUDI ARABIA</small>
            </span>
          </div>
          <div className="footer-bottom">
            <span>{t.rights}</span>
            <p>{t.independent}</p>
            <div>
              <button onClick={() => setModal("privacy")}>{t.privacy}</button>
              <button onClick={() => setModal("terms")}>{t.terms}</button>
            </div>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="toast"
            role="status"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Check size={17} />
            {toast}
            <button onClick={() => setToast("")} aria-label={t.close}>
              <X size={15} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {(modal || chatOpen) && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setModal(null);
              setChatOpen(false);
            }}
          >
            <motion.div
              className={`modal ${chatOpen ? "chat-modal" : ""} ${modal === "meeting" ? "meeting-modal" : ""} ${modal === "desk" ? "desk-modal" : ""}`}
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="dialog-title"
              initial={{ opacity: 0, y: 25, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-heading">
                <div>
                  {modal !== "desk" && <span className="eyebrow">MAABAR / مَعبر</span>}
                  <h2 id="dialog-title">
                    {chatOpen
                      ? t.smart
                      : modal === "services"
        ? curatedServices.find((entry) => entry.id === service)?.name[lang] ||
          (sector !== null ? sectorName(directorySectors[sector]) : undefined) ||
          t.all
                        : modal === "meeting"
                          ? "GovMeet"
                          : modal === "support"
                            ? ar ? "خدمة العملاء" : "Customer service"
                          : modal === "desk"
                            ? <Brand link={false} />
                          : modal === "login"
                            ? authView === "signin"
                              ? ar ? "تسجيل الدخول" : "Sign in"
                              : ar ? "إنشاء حساب جديد" : "Create a new account"
                            : modal === "privacy"
                              ? t.privacy
                              : t.terms}
                  </h2>
                </div>
                <button
                  className="modal-close"
                  onClick={() => {
                    setModal(null);
                    setChatOpen(false);
                  }}
                  aria-label={t.close}
                >
                  <X size={21} />
                </button>
              </div>
              {chatOpen && (
                <>
                  <div className="chat-messages" aria-live="polite">
                    {messages.length === 0 ? (
                      <div className="chat-empty">
                        <span className="chat-big-icon">
                          <Sparkles size={30} />
                        </span>
                        <h3>{t.welcome}</h3>
                        <p>{t.help}</p>
                        <div className="chat-suggestions">
                          {t.chips.map((c, i) => (
                            <button key={c} onClick={() => answer(isNative(uiLang) ? c : copy.en.chips[i])}>
                              {c}
                              {direction}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      messages.map((m, i) => (
                        <div key={i} className={`chat-row ${m.role}`}>
                          {m.role === "assistant" && (
                            <span className="chat-avatar" aria-hidden="true">
                              <Sparkles size={16} />
                            </span>
                          )}
                          <div className="chat-col">
                            {m.role === "assistant" && (
                              <div className="chat-msg-header">
                                <span className="chat-role-label">{ar ? "مَعبر" : "MAABAR"}</span>
                                <span className="chat-verified">
                                  <ShieldCheck size={13} />
                                  {ar ? "إرشاد موثق" : "Verified guide"}
                                </span>
                              </div>
                            )}
                            <div className={`chat-message ${m.role}`}>
                              <div className="chat-msg-body">
                                {splitBlocks(m.text).map((paragraph, pIdx) => {
                                  const trimmedP = paragraph.trim();
                                  if (!trimmedP) return null;
                                  if (trimmedP.startsWith("### ")) {
                                    return (
                                      <h4 key={pIdx} className="assistant-msg-title">
                                        {renderInline(trimmedP.replace("### ", ""))}
                                      </h4>
                                    );
                                  }
                                  // A paragraph that is only a bold line acts as a section heading
                                  if (/^\*\*[^*]+\*\*$/.test(trimmedP)) {
                                    return (
                                      <h4 key={pIdx} className="assistant-msg-title">
                                        {renderInline(trimmedP)}
                                      </h4>
                                    );
                                  }
                                  if (trimmedP.startsWith("> ")) {
                                    return (
                                      <div key={pIdx} className="assistant-msg-callout">
                                        <ShieldCheck size={16} className="callout-icon" />
                                        <span>{renderInline(trimmedP.replace(/^>\s*/, ""))}</span>
                                      </div>
                                    );
                                  }
                                  const lines = trimmedP.split("\n");
                                  const isOrderedList = lines.every((l) => /^\d+\.\s/.test(l.trim()));
                                  const isUnorderedList = lines.every((l) => /^[*•-]\s/.test(l.trim()));
                                  if (isOrderedList) {
                                    return (
                                      <ol key={pIdx} className="assistant-msg-steps">
                                        {lines.map((l, lIdx) => (
                                          <li key={lIdx}>
                                            <span className="step-pill">{l.trim().match(/^\d+/)?.[0] ?? lIdx + 1}</span>
                                            <span>{renderInline(l.trim().replace(/^\d+\.\s*/, ""))}</span>
                                          </li>
                                        ))}
                                      </ol>
                                    );
                                  }
                                  if (lines.length > 1 && isUnorderedList) {
                                    return (
                                      <ul key={pIdx} className="assistant-msg-bullets">
                                        {lines.map((l, lIdx) => (
                                          <li key={lIdx}>
                                            <Check size={14} className="bullet-icon" />
                                            <span>{renderInline(l.trim().replace(/^[*•-]\s*/, ""))}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    );
                                  }
                                  return <p key={pIdx}>{renderInline(trimmedP)}</p>;
                                })}
                              </div>
                              {m.sources && m.sources.length > 0 && (
                                <div className="chat-msg-sources">
                                  <small>{ar ? "المصادر الرسمية الموثقة" : "Verified official sources"}</small>
                                  <div className="sources-list">
                                    {m.sources.map((src, sIdx) => (
                                      <a
                                        key={sIdx}
                                        href={src.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="source-tag"
                                      >
                                        <span>{src.title}</span>
                                        <ArrowUpRight size={12} />
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            {m.followUpQuestions && m.followUpQuestions.length > 0 && (
                              <div className="chat-msg-followups">
                                <small>{ar ? "استفسارات مقترحة" : "Suggested follow-ups"}</small>
                                <div className="followup-chips">
                                  {m.followUpQuestions.map((fq, fIdx) => (
                                    <button
                                      key={fIdx}
                                      type="button"
                                      className="followup-chip"
                                      onClick={() => answer(fq)}
                                    >
                                      <span>{fq}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                    {typing && (
                      <div className="chat-row assistant">
                        <span className="chat-avatar" aria-hidden="true">
                          <Sparkles size={16} />
                        </span>
                        <div
                          className="typing-dots"
                          role="status"
                          aria-label={ar ? "جاري الرد" : "Replying"}
                        >
                          <i />
                          <i />
                          <i />
                        </div>
                      </div>
                    )}
                    {chatTarget !== null && !typing && (
                      <button
                        className="button button-green chat-next"
                        onClick={() => openServices(chatTarget)}
                      >
                        {sectorName(directorySectors[chatTarget])}
                        {direction}
                      </button>
                    )}
                    <div ref={chatEnd} />
                  </div>
                  <form
                    className="chat-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      answer(input);
                    }}
                  >
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={t.input}
                      aria-label={t.input}
                      maxLength={500}
                    />
                    <button
                      className="send-button"
                      disabled={!input.trim() || typing}
                      aria-label={ar ? "إرسال" : "Send"}
                    >
                      <Send size={17} />
                    </button>
                  </form>
                  <small className="dialog-disclaimer">
                    {ar
                      ? "عرض تجريبي بإجابات إرشادية، وليس اتصالاً بالجهات الرسمية."
                      : "A guided demonstration, with no connection to official services."}
                  </small>
                </>
              )}
              {modal === "services" &&
                (!service ? (
                  <>
                    {directorySectors[sector ?? -1]?.id === "business" ? (
                      <BusinessRoute
                        lang={lang}
                        t={t}
                        onConcierge={openDesk}
                      />
                    ) : (
                      <>
                    <div className="service-search">
                      <Search size={18} />
                      <input
                        placeholder={t.serviceSearch}
                        aria-label={t.serviceSearch}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                    </div>
                    <div className="service-results">
                      {curatedServices
                        .filter((entry) => sector === null || directorySectors[sector]?.id === entry.sectorId)
                        .filter((entry) => `${entry.name[lang]} ${entry.platform[lang]} ${directorySectors.find((item) => item.id === entry.sectorId)?.name[lang]}`.toLowerCase().includes(query.toLowerCase()))
                        .map((entry) => {
                          const sectorIndex = directorySectors.findIndex((item) => item.id === entry.sectorId);
                          const Icon = sectorIcons[directorySectors[sectorIndex]?.icon ?? "business"];
                          return (
                            <button key={entry.id} onClick={() => { setService(entry.id); setRequest(false); }}>
                              <span><Icon size={19} /></span>
                              <div><strong>{entry.name[lang]}</strong><small>{directorySectors[sectorIndex]?.name[lang]} · {entry.platform[lang]}</small></div>
                              {direction}
                            </button>
                          );
                        })}
                      {directorySectors[sector ?? -1]?.id === "justice" && (
                        <button
                          onClick={() => {
                            setJoined(false);
                            setModal("meeting");
                          }}
                        >
                          <span><Video size={19} /></span>
                          <div>
                            <strong>{ar ? "جلسة مرئية تجريبية (GovMeet)" : "Demo video session (GovMeet)"}</strong>
                            <small>{directorySectors[sector ?? -1]?.name[lang]} · {ar ? "تجربة توضيحية" : "Concept demo"}</small>
                          </div>
                          {direction}
                        </button>
                      )}
                      {curatedServices.filter((entry) => sector === null || directorySectors[sector]?.id === entry.sectorId).filter((entry) => `${entry.name[lang]} ${entry.platform[lang]} ${directorySectors.find((item) => item.id === entry.sectorId)?.name[lang]}`.toLowerCase().includes(query.toLowerCase())).length === 0 && (
                        <div className="no-results">
                          <Search size={25} />
                          <p>
                            {ar
                              ? "لم نجد خدمة مطابقة. جرّب كلمة أخرى."
                              : "No matching services. Try another search."}
                          </p>
                        </div>
                      )}
                    </div>
                    {directorySectors[sector ?? -1]?.id === "work" && (
                      <ConciergeCard t={t} onRequest={openDesk} />
                    )}
                      </>
                    )}
                  </>
                ) : request ? (
                  <div className="request-success">
                    <span>
                      <CheckCheck size={34} />
                    </span>
                    <h3>{t.sent}</h3>
                    <p>{t.requestHint}</p>
                    <div>
                      <small>{t.requestNumber}</small>
                      <strong dir="ltr">MAB-2026-001</strong>
                      <span className="status-pill">{t.processing}</span>
                    </div>
                    <button
                      className="button button-green"
                      onClick={() => {
                        setService(null);
                        setRequest(false);
                      }}
                    >
                      {t.back}
                      {direction}
                    </button>
                  </div>
                ) : (
                  <div className="service-detail">
                    {(() => {
                      const entry = curatedServices.find((item) => item.id === service);
                      const detailed = detailedServices.find((item) => item.id === service);
                      if (!entry) return <p>{ar ? "تعذر العثور على الخدمة." : "Service not found."}</p>;
                      return (
                        <>
                          <div className="service-detail-header">
                            <span className="status-pill">
                              {entry.verified === "verified"
                                ? (ar ? `مصدر رسمي مراجع · ${entry.verifiedAt}` : `Official source reviewed · ${entry.verifiedAt}`)
                                : (ar ? "المصدر مراجع؛ الوجهة تحتاج تحققًا مباشرًا" : "Source reviewed; destination needs direct verification")}
                            </span>
                          </div>

                          <p className="service-lead-summary">{entry.summary[lang]}</p>
                          {detailed && (
                            <dl className="service-brief">
                              <div>
                                <dt>{ar ? "لمن الخدمة" : "Who it's for"}</dt>
                                <dd>{detailed.targetAudience[lang]}</dd>
                              </div>
                              <div>
                                <dt>{ar ? "ماذا تنجز" : "What you can do"}</dt>
                                <dd>{detailed.userOutcomes[lang]}</dd>
                              </div>
                              <div>
                                <dt>{ar ? "قبل أن تبدأ" : "Before you start"}</dt>
                                <dd>{detailed.prerequisites[lang]}</dd>
                              </div>
                            </dl>
                          )}

                          {detailed?.multiPlatformChain && detailed.multiPlatformChain.length > 0 && (
                            <>
                              <h4 className="service-steps-title">{ar ? "خطوات الخدمة" : "Steps"}</h4>
                              <ol className="service-steps">
                                {detailed.multiPlatformChain.map((step, i) => (
                                  <li key={step.url + i}>
                                    <span className="service-step-num">{i + 1}</span>
                                    <PlatformLogo url={step.url} name={step.name[lang]} />
                                    <div className="service-step-text">
                                      <strong>{step.name[lang]}</strong>
                                      <p>{step.role[lang]}</p>
                                    </div>
                                    <a href={step.url} target="_blank" rel="noopener noreferrer" aria-label={ar ? `فتح ${step.name.ar}` : `Open ${step.name.en}`}>
                                      <ArrowUpRight size={16} />
                                    </a>
                                  </li>
                                ))}
                              </ol>
                            </>
                          )}
                          <a
                            className="button button-green official-link"
                            href={entry.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {ar ? `الانتقال إلى ${entry.platform.ar}` : `Visit ${entry.platform.en}`}
                            <ArrowUpRight size={16} />
                          </a>

                          <div className="service-modal-actions">
                            <button
                              className="text-button"
                              onClick={() => setService(null)}
                            >
                              {t.back}
                            </button>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                ))}
              {modal === "meeting" && (
                <div className="meeting-demo">
                  <div
                    className={`demo-preview ${!camera ? "camera-off" : ""}`}
                  >
                    {camera ? (
                      <div className="demo-avatar">
                        <Users size={52} />
                      </div>
                    ) : (
                      <VideoOff size={45} />
                    )}
                    <h3>{t.meetingTitle}</h3>
                    <p>{joined ? t.joined : t.live}</p>
                    <span className="status-pill">
                      {ar
                        ? "لا يتم استخدام الكاميرا أو الميكروفون فعلياً"
                        : "No actual camera or microphone access"}
                    </span>
                  </div>
                  <div className="demo-controls">
                    <button
                      onClick={() => setMic(!mic)}
                      aria-pressed={mic}
                      aria-label={
                        ar
                          ? "تبديل الميكروفون التجريبي"
                          : "Toggle demo microphone"
                      }
                    >
                      {mic ? <Mic /> : <MicOff />}
                    </button>
                    <button
                      onClick={() => setCamera(!camera)}
                      aria-pressed={camera}
                      aria-label={
                        ar ? "تبديل الكاميرا التجريبية" : "Toggle demo camera"
                      }
                    >
                      {camera ? <Video /> : <VideoOff />}
                    </button>
                    <button
                      className={`button ${joined ? "button-leave" : "button-green"}`}
                      onClick={() => setJoined(!joined)}
                    >
                      {joined ? t.leave : t.join}
                      {joined ? <X size={16} /> : <Video size={16} />}
                    </button>
                  </div>
                  {joined && (
                    <div className="demo-notes">
                      <h3>
                        <Sparkles size={17} />
                        {t.notes}
                      </h3>
                      {[t.note1, t.note2, t.note3].map((n) => (
                        <p key={n}>
                          <Check size={15} />
                          {n}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {modal === "desk" && <ConciergeDesk lang={lang} onToast={setToast} onNew={conciergeSoon} />}
              {modal === "support" && (
                <form
                  className="auth-panel"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setModal(null);
                    setToast(
                      ar
                        ? "هذه نسخة تجريبية: لم يُرسل أي طلب أو بيانات."
                        : "Demo only: no request or data was sent.",
                    );
                  }}
                >
                  <div className="support-tabs" role="tablist">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={supportView === "track"}
                      className={supportView === "track" ? "active" : ""}
                      onClick={() => setSupportView("track")}
                    >
                      {ar ? "متابعة طلب" : "Track a request"}
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={supportView === "new"}
                      className={supportView === "new" ? "active" : ""}
                      onClick={() => setSupportView("new")}
                    >
                      {ar ? "طلب دعم جديد" : "New request"}
                    </button>
                  </div>
                  {supportView === "track" ? (
                    <label>
                      <span>{ar ? "رقم الطلب" : "Request number"}</span>
                      <input required autoComplete="off" maxLength={20} dir="ltr" placeholder="MY-000000" />
                    </label>
                  ) : (
                    <>
                      <label>
                        <span>{ar ? "نوع الاستفسار" : "Topic"}</span>
                        <select defaultValue="guide">
                          <option value="guide">{ar ? "استفسار عن خدمة في الدليل" : "Question about a listed service"}</option>
                          <option value="tech">{ar ? "مشكلة تقنية في مَعبر" : "Technical issue in MAABAR"}</option>
                          <option value="feedback">{ar ? "اقتراح أو ملاحظة" : "Suggestion or feedback"}</option>
                        </select>
                      </label>
                      <label>
                        <span>{ar ? "تفاصيل الطلب" : "Details"}</span>
                        <textarea required rows={4} maxLength={500} />
                      </label>
                    </>
                  )}
                  <button type="submit" className="button button-green auth-submit">
                    {supportView === "track"
                      ? ar ? "عرض حالة الطلب" : "Check status"
                      : ar ? "إرسال الطلب" : "Submit request"}
                  </button>
                  <p className="auth-note">
                    {ar
                      ? "نموذج تجريبي: لا تُرسل الطلبات إلى أي جهة. لا تكتب بيانات شخصية أو أرقام هوية."
                      : "Demo only: requests are not sent anywhere. Do not enter personal or ID details."}
                  </p>
                </form>
              )}
              {modal === "login" && (
                <form
                  className="auth-panel"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setModal(null);
                    setToast(
                      ar
                        ? "هذه نسخة تجريبية: لم تُرسل أو تُحفظ أي بيانات."
                        : "Demo only: no data was sent or stored.",
                    );
                  }}
                >
                  {authView === "signup" && (
                    <label>
                      <span>{ar ? "الاسم الكامل" : "Full name"}</span>
                      <input required autoComplete="off" maxLength={80} />
                    </label>
                  )}
                  <label>
                    <span>{ar ? "البريد الإلكتروني أو رقم الجوال" : "Email or mobile number"}</span>
                    <input required autoComplete="off" maxLength={80} dir="ltr" />
                  </label>
                  <label>
                    <span>{ar ? "كلمة المرور" : "Password"}</span>
                    <input required type="password" autoComplete="off" maxLength={64} dir="ltr" />
                  </label>
                  <button type="submit" className="button button-green auth-submit">
                    {authView === "signin"
                      ? ar ? "تسجيل الدخول" : "Sign in"
                      : ar ? "إنشاء الحساب" : "Create account"}
                  </button>
                  <div className="auth-divider">
                    <span>{ar ? "أو" : "or"}</span>
                  </div>
                  <button
                    type="button"
                    className="button button-outline auth-alt"
                    onClick={() => setAuthView(authView === "signin" ? "signup" : "signin")}
                  >
                    {authView === "signin"
                      ? ar ? "إنشاء حساب جديد" : "Create a new account"
                      : ar ? "لديك حساب؟ تسجيل الدخول" : "Have an account? Sign in"}
                  </button>
                  <button
                    type="button"
                    className="button auth-nafath"
                    onClick={() => {
                      setModal(null);
                      setToast(
                        ar
                          ? "الدخول عبر نفاذ غير مفعّل في النسخة التجريبية."
                          : "Nafath sign-in is not active in this demo.",
                      );
                    }}
                  >
                    {process.env.NEXT_PUBLIC_HIDE_OFFICIAL_LOGOS === "1" ? (
                      <ShieldCheck size={18} />
                    ) : (
                      <img className="nafath-logo" src="nafath-logo.png" alt="" width={56} height={22} />
                    )}
                    {ar ? "الدخول عبر النفاذ الوطني الموحد (نفاذ)" : "Sign in with Nafath"}
                  </button>
                  <p className="auth-note">
                    {ar
                      ? "نموذج تجريبي: لا يتصل مَعبر بنفاذ أو بأي جهة حكومية، ولا تُرسل البيانات المدخلة إلى أي مكان."
                      : "Demo only: MAABAR is not connected to Nafath or any government system, and nothing you type is sent anywhere."}
                  </p>
                </form>
              )}
              {(modal === "privacy" || modal === "terms") && (
                <div className="policy-content">
                  <ShieldCheck size={35} />
                  <p>{modal === "privacy" ? t.policyText : t.termsText}</p>
                  <p>{t.independent}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

const localLogos: Record<string, string> = {
  "www.absher.sa": "platforms/absher.png",
  "business.absher.sa": "platforms/absher.png",
  "www.iam.gov.sa": "nafath-logo.png",
  "splonline.com.sa": "platforms/spl.png",
  "business.sa": "platforms/sbc.png",
  "zatca.gov.sa": "platforms/zatca.png",
  "qiwa.sa": "platforms/qiwa.png",
  "www.qiwa.sa": "platforms/qiwa.png",
};

// Short platform names shown when no logo image is available
const platformShortNames: Record<string, Localized> = {
  "business.sa": { ar: "الأعمال", en: "SBC" },
  "mc.gov.sa": { ar: "التجارة", en: "MC" },
  "zatca.gov.sa": { ar: "هيئة الزكاة", en: "ZATCA" },
  "qiwa.sa": { ar: "قوى", en: "Qiwa" },
  "www.qiwa.sa": { ar: "قوى", en: "Qiwa" },
  "balady.gov.sa": { ar: "بلدي", en: "Balady" },
  "www.ejar.sa": { ar: "إيجار", en: "Ejar" },
  "new.najiz.sa": { ar: "ناجز", en: "Najiz" },
  "www.sadad.com": { ar: "سداد", en: "SADAD" },
  "www.sehhaty.sa": { ar: "صحتي", en: "Sehhaty" },
  "www.najm.sa": { ar: "نجم", en: "Najm" },
  "www.moh.gov.sa": { ar: "الصحة", en: "MOH" },
  "tawakkalna.sdaia.gov.sa": { ar: "توكلنا", en: "Tawakkalna" },
  "noor.moe.gov.sa": { ar: "نور", en: "Noor" },
  "efaa.sa": { ar: "إيفاء", en: "Efaa" },
  "www.moi.gov.sa": { ar: "الداخلية", en: "MOI" },
  "www.gosi.gov.sa": { ar: "التأمينات", en: "GOSI" },
  "wasfaty.sa": { ar: "وصفتي", en: "Wasfaty" },
  "taqdeer.sa": { ar: "تقدير", en: "Taqdeer" },
  "srem.moj.gov.sa": { ar: "العقار", en: "SREM" },
  "salamah.998.gov.sa": { ar: "سلامة", en: "Salamah" },
  "mudad.com.sa": { ar: "مدد", en: "Mudad" },
};

function PlatformLogo({ url, name }: { url: string; name: string }) {
  const host = (() => {
    try {
      return new URL(url).host;
    } catch {
      return "";
    }
  })();
  const sources = [localLogos[host], host && `https://${host}/favicon.ico`].filter(Boolean) as string[];
  const [index, setIndex] = useState(0);
  if (index >= sources.length) {
    const short = platformShortNames[host];
    const ar = /[\u0600-\u06FF]/.test(name);
    return (
      <span className="platform-logo platform-logo-fallback" aria-hidden="true">
        {short ? short[ar ? "ar" : "en"] : name.replace(/^(منصة|نظام|منظومة|بوابة)\s+/, "").split(/\s+/)[0]}
      </span>
    );
  }
  return (
    <span className="platform-logo">
      <img src={sources[index]} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setIndex(index + 1)} />
    </span>
  );
}

type RouteKind = "online" | "physical" | "services";
type RouteForm = "sole" | "company";
type RouteStep = { name: Localized; detail: Localized; url: string; platform: string };

function businessSteps(kind: RouteKind, form: RouteForm): RouteStep[] {
  const steps: RouteStep[] = [
    form === "sole"
      ? { name: { ar: "أصدر السجل التجاري", en: "Issue your Commercial Registration" }, detail: { ar: "سجل مؤسسة فردية من المركز السعودي للأعمال بعد الدخول بنفاذ.", en: "Register a sole proprietorship at the Saudi Business Center after signing in with Nafath." }, url: "https://business.sa", platform: "مركز الأعمال" }
      : { name: { ar: "أسس الشركة وأصدر السجل", en: "Form the company and issue its CR" }, detail: { ar: "اتفقوا على عقد التأسيس وأصدروا سجل الشركة من المركز السعودي للأعمال.", en: "Agree on the articles of association and issue the company CR at the Saudi Business Center." }, url: "https://business.sa", platform: "مركز الأعمال" },
  ];
  if (kind === "physical") {
    steps.push(
      { name: { ar: "وثّق عقد إيجار المحل", en: "Register the shop lease" }, detail: { ar: "وثّق العقد التجاري لمقرك في إيجار.", en: "Register the commercial lease for your premises in Ejar." }, url: "https://www.ejar.sa", platform: "إيجار" },
      { name: { ar: "استخرج الرخصة البلدية", en: "Get the municipal license" }, detail: { ar: "قدّم على رخصة النشاط من بلدي، وتحقق هناك من أي اشتراطات إضافية.", en: "Apply for the activity license in Balady and check any extra conditions there." }, url: "https://balady.gov.sa", platform: "بلدي" }
    );
  } else if (kind === "online") {
    steps.push({ name: { ar: "وثّق متجرك الإلكتروني", en: "Register your online store" }, detail: { ar: "احصل على شهادة توثيق المتجر من المركز السعودي للأعمال.", en: "Get the online store certificate from the Saudi Business Center." }, url: "https://business.sa", platform: "مركز الأعمال" });
  } else {
    steps.push({ name: { ar: "تحقق من ترخيص خدمتك", en: "Check whether your service needs a license" }, detail: { ar: "بعض الخدمات المهنية تحتاج ترخيصًا من جهة مختصة قبل البدء.", en: "Some professional services need a license from a specific authority first." }, url: "https://business.sa", platform: "مركز الأعمال" });
  }
  steps.push(
    { name: { ar: "سجّل في الضريبة إذا انطبقت عليك", en: "Register for tax if it applies" }, detail: { ar: "تحقق من حد التسجيل في ضريبة القيمة المضافة لدى هيئة الزكاة والضريبة والجمارك.", en: "Check the VAT registration threshold with ZATCA." }, url: "https://zatca.gov.sa", platform: "زاتكا" },
    { name: { ar: "إذا بتوظف: سجّل في قوى", en: "If you hire: register in Qiwa" }, detail: { ar: "هذي الخطوة عند التوظيف فقط.", en: "Only needed when you hire employees." }, url: "https://qiwa.sa", platform: "قوى" }
  );
  return steps;
}

function ConciergeCard({ t, onRequest }: { t: UiCopy; onRequest: () => void }) {
  return (
    <div className="route-concierge">
      <span className="route-concierge-icon" aria-hidden="true">
        <Headset size={22} strokeWidth={1.8} />
      </span>
      <div className="route-concierge-text">
        <strong>{t.conciergeTitle}</strong>
        <p>{t.conciergeText}</p>
      </div>
      <button type="button" onClick={onRequest}>
        {t.conciergeButton}
      </button>
    </div>
  );
}

function BusinessRoute({ lang, t, onConcierge }: { lang: Lang; t: UiCopy; onConcierge: () => void }) {
  const ar = lang === "ar";
  const [kind, setKind] = useState<RouteKind>("online");
  const [form, setForm] = useState<RouteForm>("sole");
  const kinds: { id: RouteKind; label: Localized }[] = [
    { id: "online", label: { ar: "متجر إلكتروني", en: "Online store" } },
    { id: "physical", label: { ar: "محل بمقر", en: "Physical shop" } },
    { id: "services", label: { ar: "خدمات", en: "Services" } },
  ];
  const forms: { id: RouteForm; label: Localized }[] = [
    { id: "sole", label: { ar: "لوحدي", en: "On my own" } },
    { id: "company", label: { ar: "مع شركاء", en: "With partners" } },
  ];
  const steps = businessSteps(kind, form);
  return (
    <section className="business-route" aria-labelledby="business-route-title">
      <div className="business-route-heading">
        <span className="eyebrow">{ar ? "ابدأ مشروعك" : "START YOUR PROJECT"}</span>
        <h3 id="business-route-title">{ar ? "اختر مشروعك، ونرتب لك الخطوات" : "Pick your project and we'll order the steps"}</h3>
      </div>
      <div className="route-question">
        <span>{ar ? "وش نوع مشروعك؟" : "What kind of project?"}</span>
        <div className="route-choices" role="group">
          {kinds.map((item) => (
            <button key={item.id} type="button" className={kind === item.id ? "selected" : ""} aria-pressed={kind === item.id} onClick={() => setKind(item.id)}>
              {item.label[lang]}
            </button>
          ))}
        </div>
      </div>
      <div className="route-question">
        <span>{ar ? "بتبدأ لوحدك أو مع شركاء؟" : "Alone or with partners?"}</span>
        <div className="route-choices" role="group">
          {forms.map((item) => (
            <button key={item.id} type="button" className={form === item.id ? "selected" : ""} aria-pressed={form === item.id} onClick={() => setForm(item.id)}>
              {item.label[lang]}
            </button>
          ))}
        </div>
      </div>
      <ol className="service-steps">
        {steps.map((step, i) => (
          <li key={step.name.en}>
            <span className="service-step-num">{i + 1}</span>
            <PlatformLogo url={step.url} name={step.platform} />
            <div className="service-step-text">
              <strong>{step.name[lang]}</strong>
              <p>{step.detail[lang]}</p>
            </div>
            <a href={step.url} target="_blank" rel="noopener noreferrer" aria-label={ar ? `فتح ${step.name.ar}` : `Open ${step.name.en}`}>
              <ArrowUpRight size={16} />
            </a>
          </li>
        ))}
      </ol>
      <small>{ar ? "خطوات استرشادية؛ تأكد من المتطلبات في المنصة الرسمية قبل التقديم." : "A guide only; confirm requirements on the official platform before applying."}</small>
      <ConciergeCard t={t} onRequest={onConcierge} />
    </section>
  );
}
