import {
  Bell,
  Building2,
  CarFront,
  Check,
  MoreHorizontal,
  Search,
  Send,
  Sparkles,
  Wallet,
  Users,
  BriefcaseBusiness,
  Scale,
  Building2 as WorkIcon,
} from "lucide-react";
import Brand from "./Brand";
import { copy, directorySectors, type Lang } from "@/lib/content";
const sectorIcons = [Users, CarFront, BriefcaseBusiness, WorkIcon];
export default function PhoneMockups({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const ar = lang === "ar";
  return (
    <div className="phones-stage">
      <div className="phone-orbit orbit-one" />
      <div className="phone-orbit orbit-two" />
      <div className="phone phone-secondary">
        <div className="phone-notch" />
        <div className="phone-status">
          <span>9:41</span>
          <span>••• ▰</span>
        </div>
        <div className="phone-screen assistant-screen">
          <Brand compact />
          <h3>{ar ? "أهلاً بك، عبدالله" : "Hello, Abdullah"}</h3>
          <p>{t.help}</p>
          <div className="phone-chat-bubble user">{t.chips[0]}</div>
          <div className="phone-chat-bubble">
            <Sparkles size={15} />
            {t.assistantAnswer}
          </div>
          <div className="phone-chat-action">
            <span>
              <Check size={12} />
              {ar ? "الانتقال إلى منصة أبشر" : "Proceed to Absher"}
            </span>
          </div>
          <span className="phone-input">
            {t.input}
            <Send size={14} />
          </span>
        </div>
      </div>
      <div className="phone phone-primary">
        <div className="phone-notch" />
        <div className="phone-status">
          <span>9:41</span>
          <span>••• ▰</span>
        </div>
        <div className="phone-screen">
          <div className="phone-header">
            <Brand compact />
            <Bell size={17} />
          </div>
          <span className="phone-greeting">{t.greeting}</span>
          <h3>{t.appGreeting}</h3>
          <div className="phone-hero-mini">
            <span>
              مُيسّر
              <br />
              <small>
                {ar ? "دليل المنصات الرسمية" : "Official Services Directory"}
              </small>
            </span>
          </div>
          <div className="phone-search">
            <Search size={11} />
            {t.appSearch}
          </div>
          <div className="phone-categories">
            {directorySectors.slice(0, 4).map((sector, i) => {
              const Icon = sectorIcons[i];
              const s = sector.name[lang];
              return (
                <span key={s}>
                  <Icon size={21} />
                  <small>{s}</small>
                </span>
              );
            })}
          </div>
          <div className="phone-request">
            <div>
              <strong>{t.requests}</strong>
              <MoreHorizontal size={12} />
            </div>
            <p>
              <CarFront size={14} />
              {t.activeRequest}
              <small>{t.processing}</small>
            </p>
            <span className="progress-track">
              <i />
            </span>
            <small>{t.progress}</small>
          </div>
          <div className="phone-bottom">
            <span>
              <Building2 size={14} />
              {t.home}
            </span>
            <span>
              <Sparkles size={14} />
              {ar ? "المساعد" : "Assistant"}
            </span>
            <span>
              <Wallet size={14} />
              {ar ? "المحفظة" : "Wallet"}
            </span>
          </div>
        </div>
      </div>
      <span className="phone-floating-label">
        <Sparkles size={16} />
        {ar ? "تجربة أذكى، في راحة يدك" : "Smarter experiences, in your hands"}
      </span>
    </div>
  );
}
