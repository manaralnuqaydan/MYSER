"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpLeft,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  AudioLines,
  BriefcaseBusiness,
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

import { copy, type Lang } from "@/lib/content";
import Brand from "./Brand";
import SectorArt from "./SectorArt";
import PhoneMockups from "./PhoneMockups";
type Message = { role: "user" | "assistant"; text: string };
const sectorIcons = [Users, CarFront, BriefcaseBusiness, Scale];
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [modal, setModal] = useState<
    "services" | "meeting" | "privacy" | "terms" | null
  >(null);
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
  function answer(value: string) {
    if (!value.trim() || typing) return;
    setInput("");
    setChatOpen(true);
    setModal(null);
    setMessages((prev) => [...prev, { role: "user", text: value.trim() }]);
    setTyping(true);
    const v = value.toLowerCase();
    let result = "",
      target: number | null = null;
    if (/تجار|نشاط|business|commercial|municipal|بلدي/.test(v)) {
      target = 2;
      result = ar
        ? "لبدء نشاط تجاري، حدّد نوع النشاط وشكله القانوني، ثم راجع متطلبات السجل التجاري والرخصة البلدية والرقم الضريبي حسب نشاطك. إليك خدمات التجارة والأعمال للاطلاع على رحلة تجريبية."
        : "To start a business, choose your activity and legal structure, then review the Commercial Registration, Municipal License, and Tax Identification Number (TIN) requirements for your activity. Explore a demo business journey below.";
    } else if (/رخص|قياد|driv|licen/.test(v)) {
      target = 1;
      result = ar
        ? "لتجديد رخصة القيادة، راجع صلاحية الفحص الطبي ومتطلبات سداد الرسوم والمخالفات إن وجدت. يمكنك تجربة رحلة تجديد الرخصة هنا. المتطلبات النهائية تُراجع عبر الجهة الرسمية."
        : "To renew your driving license, review medical examination validity and applicable fees or violations. Try the renewal journey here. Confirm final requirements with the official authority.";
    } else if (/مخالف|violation|fine/.test(v)) {
      target = 1;
      result = ar
        ? "يمكنك الاستعلام عن المخالفات عبر الخدمات الرسمية للمرور. في هذا العرض، توجد مخالفة تجريبية بقيمة 150 ريال في المحفظة الموحدة. افتح خدمات المرور لبدء تجربة استعلام."
        : "Official traffic services let you check violations. This demo includes a SAR 150 sample violation in your unified wallet. Explore traffic services for a demo inquiry.";
    } else if (
      /موعد|أحوال|هوي|إقام|appointment|civil|national id|iqama/.test(v)
    ) {
      target = 0;
      result = ar
        ? "لحجز موعد في الأحوال المدنية، حدّد نوع الخدمة والمدينة والوقت المناسب، وجهّز الهوية الوطنية أو الإقامة وفق متطلبات الخدمة. يمكنك استكشاف خدمات الأفراد هنا."
        : "For a Civil Affairs appointment, choose your service, city, and available time. Prepare your National ID or Iqama according to the service requirements. Explore public services below.";
    } else if (/قض|وكال|عدل|court|legal|attorney/.test(v)) {
      target = 3;
      result = ar
        ? "سأساعدك في فهم الخدمات العدلية: القضايا والوكالات والتوثيق والجلسات. اختر الخدمة لعرض متطلباتها التجريبية، وراجع الجهة الرسمية للتفاصيل المعتمدة."
        : "I can guide you through cases, powers of attorney, notarization, and hearings. Choose a service to view demo requirements; refer to the official authority for authoritative details.";
    } else
      result = ar
        ? "أهلاً بك! أستطيع إرشادك في تجديد رخصة القيادة، بدء نشاط تجاري، الاستعلام عن مخالفة، أو حجز موعد في الأحوال المدنية. ما الخدمة التي تحتاجها؟ هذا مساعد تجريبي بإجابات إرشادية."
        : "Welcome! I can guide you through driving license renewal, starting a business, checking traffic violations, or booking a Civil Affairs appointment. Which service do you need? This is a guided demo assistant.";
    timer.current = setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", text: result }]);
      setChatTarget(target);
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
              ? "مشهد سعودي يجمع برج المملكة وبرج مياه بريدة والأعلام السعودية عند الغروب"
              : "A cinematic Saudi composition featuring Kingdom Centre, Buraidah Water Tower, and Saudi flags at sunset"
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
            <button
              className="button button-gold header-cta"
              onClick={() => openServices()}
            >
              {t.start}
              {direction}
            </button>
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
            <div className="eyebrow hero-eyebrow">
              <span className="little-line" />
              MYSER <span className="eyebrow-divider">/</span> {t.eyebrow}
            </div>
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
                {t.start}
                {direction}
              </button>
              <a className="button button-outline" href="#journey">
                <span className="play-circle">
                  <Play size={11} fill="currentColor" />
                </span>
                {t.explore}
              </a>
            </div>
            <div className="hero-trust">
              <span className="trust-icon">
                <ShieldCheck size={18} />
              </span>
              {t.demo}
              <span className="trust-dot" />
              {ar ? "مصمّمة حول الإنسان" : "Designed around people"}
            </div>
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
              <ShieldCheck size={12} />
              {ar
                ? "مساعد تجريبي · إرشاد ذكي بلغتك"
                : "Demo assistant · Smart guidance in your language"}
            </span>
          </motion.div>
        </div>
        <div className="hero-bottom container">
          <div className="hero-stats">
            {["200+", "40+", "1M+", t.one].map((v, i) => (
              <div className="stat" key={i}>
                <strong dir={i < 3 ? "ltr" : undefined}>{v}</strong>
                <span>{t.statLabels[i]}</span>
              </div>
            ))}
          </div>
          <a href="#journey" className="scroll-link">
            <span>{t.scroll}</span>
            <span className="scroll-circle">
              <ChevronDown size={17} />
            </span>
          </a>
          <span className="hero-signature">
            {ar
              ? "لمستقبل أسهل،\nفي وطن أكبر."
              : "A simpler tomorrow.\nA greater possibility."}
            <small>A SIMPLER TOMORROW, IN A GREATER SAUDI</small>
          </span>
        </div>
        <div className="hero-curve" />
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

      <section id="services" className="services">
        <div className="container">
          <motion.div className="section-heading heading-row" {...reveal}>
            <div>
              <span className="eyebrow">{t.sectorLabel}</span>
              <h2>{t.sectorTitle}</h2>
              <p>{t.sectorSub}</p>
            </div>
            <button
              className="button button-outline"
              onClick={() => openServices()}
            >
              {t.all}
              {direction}
            </button>
          </motion.div>
          <div className="sector-grid">
            {t.sectors.map((title, i) => {
              const Icon = sectorIcons[i];
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
                  <SectorArt index={i} />
                  <div className="sector-overlay" />
                  <span className="sector-index">0{i + 1} / MYSER</span>
                  <span className="sector-icon">
                    <Icon size={25} strokeWidth={1.3} />
                  </span>
                  <div className="sector-content">
                    <h3>{title}</h3>
                    <p>{t.sectorDescriptions[i]}</p>
                    <div className="sector-tags">
                      {t.sectorTags[i].slice(0, 3).map((tag) => (
                        <span key={tag}>{tag}</span>
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
                ? "خدمات مترابطة. تجربة واحدة."
                : "Connected services. One experience."}
            </span>
            <span>MYSER ECOSYSTEM</span>
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
                GovMeet <em>AI</em>
                <span className="new-pill">{t.new}</span>
              </span>
              <h2 className="multiline">{t.govTitle}</h2>
              <p>{t.govSub}</p>
              <div className="feature-benefits">
                <span>
                  <ShieldCheck size={15} />
                  {ar ? "خصوصية في التصميم" : "Privacy by design"}
                </span>
                <span>
                  <Sparkles size={15} />
                  {ar ? "ملخّص ذكي للجلسة" : "Intelligent summaries"}
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
                <ShieldCheck size={14} />
                {ar ? "GovMeet · وضع تجريبي" : "GovMeet · Demo mode"}
              </span>
              <div className="meeting-window">
                <div className="meeting-bar">
                  <span className="meeting-brand">
                    <Video size={13} />
                    GovMeet <b>AI</b>
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
                    <ShieldCheck size={15} />
                  </span>
                </div>
              </div>
              <span className="meeting-stage-caption">
                {ar
                  ? "حضورك يصنع الفرق، أينما كنت."
                  : "Your presence matters, wherever you are."}
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
                      ? "مدفوعاتك، تحت السيطرة"
                      : "Your payments, in perspective"}
                  </strong>
                  <small>
                    {ar
                      ? "تنظيم ذكي للرسوم والالتزامات"
                      : "A clear view of fees and obligations"}
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
          <span className="eyebrow">MYSER / مُيسّرة</span>
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
              <a href="#experiences">GovMeet AI</a>
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
                  <span className="eyebrow">MYSER / مُيسّرة</span>
                  <h2 id="dialog-title">
                    {chatOpen
                      ? t.smart
                      : modal === "services"
                        ? service || t.all
                        : modal === "meeting"
                          ? "GovMeet AI"
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
                        <div key={i} className={`chat-message ${m.role}`}>
                          {m.role === "assistant" && <Sparkles size={15} />}
                          <p>{m.text}</p>
                        </div>
                      ))
                    )}
                    {typing && (
                      <div
                        className="typing-dots"
                        aria-label={ar ? "جاري الرد" : "Replying"}
                      >
                        <i />
                        <i />
                        <i />
                      </div>
                    )}
                    {chatTarget !== null && !typing && (
                      <button
                        className="button button-green chat-next"
                        onClick={() => openServices(chatTarget)}
                      >
                        {t.sectors[chatTarget]}
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
                      {t.sectors.map((s, i) => (
                        <button
                          className={sector === i ? "selected" : ""}
                          key={s}
                          onClick={() => setSector(i)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <div className="service-results">
                      {t.sectorTags.flatMap((tags, i) =>
                        sector === null || sector === i
                          ? tags
                              .filter((tag) =>
                                tag.toLowerCase().includes(query.toLowerCase()),
                              )
                              .map((tag) => {
                                const Icon = sectorIcons[i];
                                return (
                                  <button
                                    key={tag}
                                    onClick={() => {
                                      setService(tag);
                                      setRequest(false);
                                    }}
                                  >
                                    <span>
                                      <Icon size={19} />
                                    </span>
                                    <div>
                                      <strong>{tag}</strong>
                                      <small>{t.sectors[i]}</small>
                                    </div>
                                    {direction}
                                  </button>
                                );
                              })
                          : [],
                      )}
                      {!t.sectorTags.some(
                        (tags, i) =>
                          (sector === null || sector === i) &&
                          tags.some((tag) =>
                            tag.toLowerCase().includes(query.toLowerCase()),
                          ),
                      ) && (
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
                    <span className="status-pill">
                      {ar ? "خدمة تجريبية" : "Demo service"}
                    </span>
                    <p>
                      {ar
                        ? "رحلة مبسّطة لاستكشاف الخدمة وفهم متطلباتها. هذا نموذج عرض؛ لا يجمع بياناتك ولا يرسل طلبات رسمية."
                        : "A simplified journey to explore this service and understand its requirements. This demo does not collect your details or submit official requests."}
                    </p>
                    <h3>{t.requirements}</h3>
                    <ul>
                      <li>
                        <Check size={16} />
                        {ar
                          ? "الهوية الوطنية أو الإقامة حسب نوع الخدمة"
                          : "National ID or Iqama, as applicable"}
                      </li>
                      <li>
                        <Check size={16} />
                        {ar
                          ? "بيانات الطلب والمستندات المطلوبة لدى الجهة"
                          : "Application details and authority-required documents"}
                      </li>
                      <li>
                        <Check size={16} />
                        {ar
                          ? "مراجعة الشروط والرسوم لدى الجهة الرسمية"
                          : "Review conditions and fees with the official authority"}
                      </li>
                    </ul>
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
              {(modal === "privacy" || modal === "terms") && (
                <div className="policy-content">
                  <ShieldCheck size={35} />
                  <p>{t.policyText}</p>
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
