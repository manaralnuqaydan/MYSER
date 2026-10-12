"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
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

import { assistantFallback, assistantScenarios, copy, curatedServices, directorySectors, type Lang } from "@/lib/content";
import { detailedServices } from "@/lib/servicesDetailed";
import { generateLocalAgentResponse, type ChatMessage } from "@/lib/agent";
import Brand from "./Brand";
import SectorArt from "./SectorArt";
import PhoneMockups from "./PhoneMockups";
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
  const [lang, setLang] = useState<Lang>("ar");
  const t = copy[lang];
  const ar = lang === "ar";
  const reduce = useReducedMotion();
  const [menu, setMenu] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [modal, setModal] = useState<
    "services" | "meeting" | "privacy" | "terms" | "login" | "support" | null
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
    document.documentElement.lang = lang;
    document.documentElement.dir = ar ? "rtl" : "ltr";
  }, [lang, ar]);
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
    const scenario = assistantScenarios.find((item) => item.keywords.some((keyword) => v.includes(keyword)));
    const target = scenario
      ? directorySectors.findIndex((item) => item.id === scenario.sectorId)
      : null;

    timer.current = setTimeout(() => {
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
        setChatTarget(target);
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
  function switchLang() {
    if (timer.current) clearTimeout(timer.current);
    setLang(ar ? "en" : "ar");
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
            <a href="#experiences" onClick={() => setMenu(false)}>
              {t.experiences}
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
              {ar ? "تسجيل الدخول / إنشاء حساب" : "Sign in / Create account"}
            </button>
            <button className="nav-login" onClick={openSupport}>
              {ar ? "متابعة خدمة العملاء" : "Customer support"}
            </button>
          </nav>
          <div className="header-actions">
            <button
              className="language"
              onClick={switchLang}
              aria-label={ar ? "Switch to English" : "التبديل إلى العربية"}
            >
              <Globe2 size={16} />
              <span>{ar ? "English" : "العربية"}</span>
            </button>
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
                    {ar ? "متابعة خدمة العملاء" : "Customer support"}
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
              <button
                className="button button-gold"
                onClick={() => openServices()}
              >
                {t.all}
                {direction}
              </button>
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
                {t.chips.map((c) => (
                  <button key={c} onClick={() => answer(c)}>
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
              <span className="eyebrow">{t.sectorLabel}</span>
              <h2>{t.sectorTitle}</h2>
              <p>{t.sectorSub}</p>
            </div>
          </motion.div>
          <div className="sector-grid">
            {directorySectors.map((item, i) => {
              const title = item.name[lang];
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
                  <span className="sector-index">0{i + 1} / MYSER</span>
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
            <span>MYSER ECOSYSTEM</span>
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
                  <div className="step-icon">
                    <Icon size={27} strokeWidth={1.45} />
                  </div>
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
          <div className="experience-intro">
            <span className="eyebrow">
              {ar
                ? "الجيل القادم من التجارب الرقمية"
                : "The next generation of digital experiences"}
            </span>
            <h2>{ar ? "تجربة تتجاوز التوقعات." : "Beyond expectations."}</h2>
          </div>
          <motion.div className="govmeet feature-grid" {...reveal}>
            <div className="feature-copy">
              <span className="feature-brand">
                <span className="icon-square">
                  <Video size={20} />
                </span>
                GovMeet
                <span className="new-pill">{t.new}</span>
              </span>
              <h2 className="multiline">{t.govTitle}</h2>
              <p>{t.govSub}</p>
              <div className="feature-benefits">
                <span>
                  <FileText size={15} />
                  {ar ? "واجهة توضيحية" : "Concept interface"}
                </span>
                <span>
                  <Sparkles size={15} />
                  {ar ? "ملخّص توضيحي" : "Sample summary"}
                </span>
              </div>
              <button
                className="button button-green"
                onClick={() => {
                  setJoined(false);
                  setModal("meeting");
                }}
              >
                {t.govButton}
                {direction}
              </button>
            </div>
            <div className="meeting-stage">
              <span className="floating-security">
                <FileText size={14} />
                {ar ? "GovMeet · وضع تجريبي" : "GovMeet · Demo mode"}
              </span>
              <div className="meeting-window">
                <div className="meeting-bar">
                  <span className="meeting-brand">
                    <Video size={13} />
                    GovMeet
                  </span>
                  <span className="meeting-status">
                    <i />
                    {t.live}
                  </span>
                  <MoreHorizontal size={18} />
                </div>
                <div className="meeting-main">
                  <div className="meeting-person">
                    <div
                      className="advisor-photo"
                      role="img"
                      aria-label={
                        ar
                          ? "مستشار سعودي في جلسة تجريبية"
                          : "Saudi advisor in a demo meeting"
                      }
                    />
                    <span className="person-name">
                      {t.participant}
                      <span>
                        <Mic size={12} />
                      </span>
                    </span>
                    <span className="meeting-topic">{t.meetingTitle}</span>
                  </div>
                  <div className="meeting-side">
                    <div className="mini-participant">
                      <span>ع م</span>
                      <small>{t.you}</small>
                    </div>
                    <div className="meeting-summary">
                      <Sparkles size={16} />
                      <strong>{t.notes}</strong>
                      {[t.note1, t.note2, t.note3].map((n) => (
                        <p key={n}>
                          <Check size={10} />
                          {n}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="meeting-controls">
                  <span>12:48</span>
                  <div>
                    <span>
                      <Mic size={15} />
                    </span>
                    <span>
                      <Video size={15} />
                    </span>
                    <span>
                      <Users size={15} />
                    </span>
                    <button
                      className="call-button"
                      onClick={() => setModal("meeting")}
                      aria-label={t.govButton}
                    >
                      <ArrowUpRight size={15} />
                    </button>
                  </div>
                  <span>
                    <MoreHorizontal size={15} />
                  </span>
                </div>
              </div>
              <span className="meeting-stage-caption">
                {ar
                  ? "توجيه نظامي مباشر لرواد الأعمال، دون تعقيد."
                  : "Direct regulatory orientation for entrepreneurs, simplified."}
              </span>
            </div>
          </motion.div>

          <motion.div
            id="wallet"
            className="wallet-section feature-grid"
            {...reveal}
          >
            <div className="feature-copy">
              <span className="eyebrow">{t.walletLabel}</span>
              <h2 className="multiline">{t.walletTitle}</h2>
              <p>{t.walletSub}</p>
              <div className="wallet-badge">
                <span className="icon-square">
                  <Wallet size={22} />
                </span>
                <span>
                  <strong>
                    {ar
                      ? "شفافية واضحة في التكاليف"
                      : "Clear overview of fees"}
                  </strong>
                  <small>
                    {ar
                      ? "عرض استرشادي للرسوم والالتزامات الرسمية"
                      : "Illustrative guide to official fees"}
                  </small>
                </span>
              </div>
            </div>
            <div className="wallet-card">
              <div className="wallet-top">
                <div>
                  <span>{t.total}</span>
                  <strong>
                    {amounts
                      .reduce((s, a, i) => s + (paid.includes(i) ? 0 : a), 0)
                      .toLocaleString(ar ? "ar-SA" : "en-US")}{" "}
                    <small>{t.currency}</small>
                  </strong>
                </div>
                <span className="wallet-emblem">
                  <Wallet size={25} />
                </span>
              </div>
              <div className="bill-list">
                {t.bills.map((bill, i) => (
                  <div
                    className={`bill ${paid.includes(i) ? "bill-paid" : ""}`}
                    key={bill}
                  >
                    <span className="bill-icon">
                      {paid.includes(i) ? (
                        <CheckCheck size={19} />
                      ) : i === 2 ? (
                        <Building2 size={19} />
                      ) : (
                        <CarFront size={19} />
                      )}
                    </span>
                    <div>
                      <strong>{bill}</strong>
                      <small>{t.agencies[i]}</small>
                    </div>
                    <span className="bill-amount">
                      {amounts[i]} <small>{t.currency}</small>
                    </span>
                    <button
                      disabled={paid.includes(i)}
                      onClick={() => {
                        setPaid((prev) => [...prev, i]);
                        setToast(t.paymentSuccess);
                      }}
                    >
                      {paid.includes(i) ? (
                        <>
                          <Check size={13} />
                          {t.paid}
                        </>
                      ) : (
                        <>
                          {t.pay}
                          <ArrowUpLeft size={12} />
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
              <span className="wallet-disclaimer">
                <ShieldCheck size={12} />
                {t.walletDemo}
              </span>
            </div>
          </motion.div>

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
          <span className="eyebrow">MYSER / مُيسّر</span>
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
              <a href="#experiences">GovMeet</a>
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
              className={`modal ${chatOpen ? "chat-modal" : ""} ${modal === "meeting" ? "meeting-modal" : ""}`}
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
                  <span className="eyebrow">MYSER / مُيسّر</span>
                  <h2 id="dialog-title">
                    {chatOpen
                      ? t.smart
                      : modal === "services"
        ? curatedServices.find((entry) => entry.id === service)?.name[lang] || t.all
                        : modal === "meeting"
                          ? "GovMeet"
                          : modal === "support"
                            ? ar ? "متابعة خدمة العملاء" : "Customer support"
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
                          {t.chips.map((c) => (
                            <button key={c} onClick={() => answer(c)}>
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
                                <span className="chat-role-label">{ar ? "مُيسّر" : "MYSER"}</span>
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
                        {directorySectors[chatTarget]?.name[lang]}
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
                    <div className="service-search">
                      <Search size={18} />
                      <input
                        placeholder={t.serviceSearch}
                        aria-label={t.serviceSearch}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                    </div>
                    <div className="sector-filters">
                      <button
                        className={sector === null ? "selected" : ""}
                        onClick={() => setSector(null)}
                      >
                        {ar ? "الكل" : "All"}
                      </button>
                      {directorySectors.map((item, i) => (
                        <button
                          className={sector === i ? "selected" : ""}
                          key={item.id}
                          onClick={() => setSector(i)}
                        >
                          {item.name[lang]}
                        </button>
                      ))}
                    </div>
                    {sector === 2 && (
                      <BusinessRoute lang={lang} />
                    )}
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
                      <strong dir="ltr">MYS-2026-001</strong>
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
                            <span className="service-platform-badge">{entry.platform[lang]}</span>
                          </div>

                          <h3>{entry.name[lang]}</h3>
                          <p className="service-lead-summary">{entry.summary[lang]}</p>

                          {/* 10-Dimension Structured Content */}
                          <div className="service-meta-grid">
                            {detailed && (
                              <>
                                <div className="meta-card">
                                  <strong>{ar ? "لمن تناسب الخدمة؟" : "Target Audience"}</strong>
                                  <p>{detailed.targetAudience[lang]}</p>
                                </div>
                                <div className="meta-card">
                                  <strong>{ar ? "ماذا يستطيع المستخدم إنجازه؟" : "User Outcomes"}</strong>
                                  <p>{detailed.userOutcomes[lang]}</p>
                                </div>
                              </>
                            )}
                          </div>

                          <h3>{ar ? "متى قد تحتاجها؟" : "When might you need it?"}</h3>
                          <p>{entry.when[lang]}</p>

                          {detailed && (
                            <>
                              <h3>{ar ? "ما ينبغي معرفته قبل البدء (المتطلبات المسبقة)" : "Prerequisites & Preparation"}</h3>
                              <p>{detailed.prerequisites[lang]}</p>

                              <h3>{ar ? "المتطلبات والاشتراطات المؤكدة" : "Confirmed Requirements"}</h3>
                              <ul className="confirmed-requirements-list">
                                {detailed.confirmedRequirements.map((req, rIdx) => (
                                  <li key={rIdx}>
                                    <Check size={16} />
                                    <span>{req[lang]}</span>
                                  </li>
                                ))}
                              </ul>

                              <h3>{ar ? "خطوات وإجراءات المعاملة الرسمية" : "Official Procedure Steps"}</h3>
                              <ol className="procedure-steps-list">
                                {detailed.procedureSteps.map((step, sIdx) => (
                                  <li key={sIdx}>
                                    <span className="step-num">{sIdx + 1}</span>
                                    <span>{step[lang]}</span>
                                  </li>
                                ))}
                              </ol>

                              {detailed.multiPlatformChain && detailed.multiPlatformChain.length > 0 && (
                                <>
                                  <h3>{ar ? "المنصات والجهات اللازمة لإتمام الخدمة (متى تحتاج كل جهة)" : "Required Platforms & Authorities Sequence"}</h3>
                                  <div className="platform-chain-container">
                                    {detailed.multiPlatformChain.map((chain, cIdx) => (
                                      <div key={cIdx} className="platform-chain-card">
                                        <div className="platform-chain-top">
                                          <span className="chain-step-pill">{cIdx + 1}</span>
                                          <strong>{chain.name[lang]}</strong>
                                          <span className="chain-auth-tag">{chain.authority[lang]}</span>
                                        </div>
                                        <p className="chain-role-text">{chain.role[lang]}</p>
                                        <div className="chain-when-box">
                                          <small>{ar ? "متى تنتقل إليها؟" : "When needed?"}</small>
                                          <span>{chain.whenNeeded[lang]}</span>
                                        </div>
                                        <a href={chain.url} target="_blank" rel="noopener noreferrer" className="chain-link">
                                          <span>{ar ? `زيارة ${chain.name.ar}` : `Open ${chain.name.en}`}</span>
                                          <ArrowUpRight size={13} />
                                        </a>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}

                              <h3>{ar ? "شروط تختلف باختلاف الحالة" : "Conditional Rules & Variants"}</h3>
                              <div className="conditional-rules-box">
                                <p>{detailed.conditionalRules[lang]}</p>
                              </div>

                              <div className="unverified-transparency-box">
                                <strong>{ar ? "تنبيه الشفافية وعدم التأكيد التلقائي:" : "Transparency & Verification Note:"}</strong>
                                <p>{detailed.unverifiedAspects[lang]}</p>
                              </div>
                            </>
                          )}

                          <h3>{ar ? "الجهة والمنصة" : "Authority and platform"}</h3>
                          <p>{entry.platform[lang]}</p>

                          <div className="official-source-note">
                            <strong>{ar ? "ملاحظة" : "Note"}</strong>
                            <p>{entry.note[lang]}</p>
                            <small>
                              {ar ? "المصدر" : "Source"}:{" "}
                              <a href={entry.sourceUrl} target="_blank" rel="noreferrer">
                                {entry.sourceTitle[lang]}
                              </a>
                            </small>
                          </div>

                          <a
                            className="button button-green official-link"
                            href={entry.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {ar ? `الانتقال إلى ${entry.platform.ar}` : `Visit ${entry.platform.en}`}
                            <ArrowUpRight size={16} />
                          </a>

                          <p className="demo-boundary">
                            {ar
                              ? "MYSER دليل استكشافي فقط. لا تُرسل بيانات أو طلبات إلى الجهة من هذه الواجهة."
                              : "MYSER is an exploratory guide only. This interface does not send data or requests to the authority."}
                          </p>

                          <h3>{ar ? "جرّب رحلة توضيحية داخل MYSER" : "Try a sample journey in MYSER"}</h3>
                          <ul>
                            <li>
                              <Check size={16} />
                              {ar
                                ? "افتح المصدر الرسمي وراجع شروط الخدمة لحالتك"
                                : "Open the official source and check requirements for your case"}
                            </li>
                            <li>
                              <Check size={16} />
                              {ar
                                ? "أكمل أي إجراء أو إدخال بيانات داخل المنصة الرسمية فقط"
                                : "Complete any application or data entry only on the official platform"}
                            </li>
                            <li>
                              <Check size={16} />
                              {ar
                                ? "عد إلى MYSER بعد ذلك لمتابعة الدليل؛ لا توجد مزامنة فعلية"
                                : "Return to MYSER for the guide; no live synchronization is available"}
                            </li>
                          </ul>

                          <div className="service-modal-actions">
                            <button
                              className="button button-green"
                              onClick={() => setRequest(true)}
                            >
                              {t.beginDemo}
                              {direction}
                            </button>
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
                          <option value="tech">{ar ? "مشكلة تقنية في مُيسّر" : "Technical issue in MYSER"}</option>
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
                    <ShieldCheck size={18} />
                    {ar ? "الدخول عبر النفاذ الوطني الموحد (نفاذ)" : "Sign in with Nafath"}
                  </button>
                  <p className="auth-note">
                    {ar
                      ? "نموذج تجريبي: لا يتصل مُيسّر بنفاذ أو بأي جهة حكومية، ولا تُرسل البيانات المدخلة إلى أي مكان."
                      : "Demo only: MYSER is not connected to Nafath or any government system, and nothing you type is sent anywhere."}
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

function BusinessRoute({ lang }: { lang: Lang }) {
  const ar = lang === "ar";
  const [entity, setEntity] = useState("unknown");
  const [activity, setActivity] = useState("");
  return (
    <section className="business-route" aria-labelledby="business-route-title">
      <div className="business-route-heading">
        <span className="eyebrow">{ar ? "مسار استكشافي مشروط" : "CONDITIONAL STARTER ROUTE"}</span>
        <h3 id="business-route-title">{ar ? "تبدأ بفهم النشاط والشكل النظامي" : "Start by clarifying activity and legal form"}</h3>
        <p>{ar ? "هذا المسار لا يحدد أهلية منشأتك ولا يحسم المتطلبات. راجع الروابط الرسمية وتأكد من انطباق كل خطوة على حالتك." : "This route does not determine your eligibility or final requirements. Check official sources and confirm each step applies to you."}</p>
      </div>
      <label>
        <span>{ar ? "الشكل النظامي الذي تستكشفه" : "Legal form you are exploring"}</span>
        <select value={entity} onChange={(event) => setEntity(event.target.value)}>
          <option value="unknown">{ar ? "لم أحدد بعد" : "Not decided"}</option>
          <option value="sole">{ar ? "مؤسسة فردية" : "Sole proprietorship"}</option>
          <option value="company">{ar ? "شركة" : "Company"}</option>
        </select>
      </label>
      <label>
        <span>{ar ? "النشاط (اختياري، يبقى في هذه الجلسة)" : "Activity (optional, stays in this session)"}</span>
        <input value={activity} onChange={(event) => setActivity(event.target.value)} maxLength={100} placeholder={ar ? "مثال: تجارة إلكترونية" : "e.g. online retail"} />
      </label>
      <ol>
        <li><strong>{ar ? "تحقق من النشاط" : "Check the activity"}</strong><span>{activity ? (ar ? `تحقق من تصنيف «${activity}» لدى الجهة المختصة، فقد تتطلب بعض الأنشطة موافقة مسبقة.` : `Check how “${activity}” is classified; some activities may need prior approval.`) : (ar ? "حدّد النشاط أولًا؛ بعض الأنشطة قد تتطلب موافقة مسبقة من جهة مختصة." : "Identify the activity first; some activities may require prior approval.")}</span></li>
        {entity === "unknown" ? <li><strong>{ar ? "اختر المسار النظامي" : "Choose a legal route"}</strong><span>{ar ? "تختلف خدمة المؤسسة الفردية عن تأسيس الشركة. لا تبدأ بطلب قبل تحديد النوع ومراجعة مصدره الرسمي." : "Sole-proprietor registration differs from company formation. Review the relevant official source before applying."}</span></li> : entity === "sole" ? <li><strong>{ar ? "راجع قيد المؤسسة الفردية" : "Review sole-proprietor registration"}</strong><span>{ar ? "تصف وزارة التجارة خدمة قيد سجل تجاري لمؤسسة فردية؛ راجع شروطها الحالية ومدى انطباقها." : "The Ministry of Commerce describes a sole-proprietorship CR service; check current terms and applicability."}</span></li> : <li><strong>{ar ? "راجع تأسيس الشركة" : "Review company formation"}</strong><span>{ar ? "توضح وزارة التجارة مسار تأسيس شركة، مع اختلاف الإجراءات حسب النوع النظامي." : "The Ministry of Commerce outlines company formation; the procedure varies by legal type."}</span></li>}
        <li><strong>{ar ? "افحص الرخص والالتزامات عند انطباقها" : "Check applicable licenses and obligations"}</strong><span>{ar ? "تحقق من متطلبات بلدي بحسب النشاط والموقع، ومن معايير زاتكا الضريبية للمنشأة." : "Check Balady requirements for the activity and location, and ZATCA criteria for the business."}</span></li>
        <li><strong>{ar ? "انتقل لخدمات العمل عند الحاجة" : "Use work services when relevant"}</strong><span>{ar ? "قوى مرتبطة بخدمات قطاع العمل؛ ليست خطوة لازمة لكل منشأة عند التأسيس." : "Qiwa covers work-sector services; it is not a mandatory formation step for every business."}</span></li>
      </ol>
      <small>{ar ? "لا تُدخل رقم هوية أو بيانات دخول أو معلومات مالية. لا تُحفظ المدخلات بعد إغلاق الصفحة أو تحديثها." : "Do not enter identity, login, or financial details. Inputs are not retained after closing or refreshing the page."}</small>
    </section>
  );
}
