import { copy, type Lang } from "./content";
import am from "./i18n/am.json";
import bn from "./i18n/bn.json";
import de from "./i18n/de.json";
import es from "./i18n/es.json";
import fa from "./i18n/fa.json";
import fr from "./i18n/fr.json";
import hi from "./i18n/hi.json";
import id from "./i18n/id.json";
import it from "./i18n/it.json";
import ja from "./i18n/ja.json";
import ko from "./i18n/ko.json";
import ml from "./i18n/ml.json";
import ms from "./i18n/ms.json";
import ne from "./i18n/ne.json";
import ps from "./i18n/ps.json";
import pt from "./i18n/pt.json";
import ru from "./i18n/ru.json";
import si from "./i18n/si.json";
import so from "./i18n/so.json";
import sw from "./i18n/sw.json";
import ta from "./i18n/ta.json";
import tl from "./i18n/tl.json";
import tr from "./i18n/tr.json";
import ur from "./i18n/ur.json";
import zh from "./i18n/zh.json";

/* Interface languages. Arabic and English are complete; the others translate the
   interface, while detailed service guidance and assistant answers fall back to English. */
export const languages = [
  { code: "ar", name: "العربية", dir: "rtl" },
  { code: "en", name: "English", dir: "ltr" },
  { code: "ur", name: "اردو", dir: "rtl" },
  { code: "hi", name: "हिन्दी", dir: "ltr" },
  { code: "bn", name: "বাংলা", dir: "ltr" },
  { code: "tl", name: "Filipino", dir: "ltr" },
  { code: "id", name: "Bahasa Indonesia", dir: "ltr" },
  { code: "ms", name: "Bahasa Melayu", dir: "ltr" },
  { code: "tr", name: "Türkçe", dir: "ltr" },
  { code: "fa", name: "فارسی", dir: "rtl" },
  { code: "fr", name: "Français", dir: "ltr" },
  { code: "es", name: "Español", dir: "ltr" },
  { code: "pt", name: "Português", dir: "ltr" },
  { code: "de", name: "Deutsch", dir: "ltr" },
  { code: "it", name: "Italiano", dir: "ltr" },
  { code: "ru", name: "Русский", dir: "ltr" },
  { code: "zh", name: "中文", dir: "ltr" },
  { code: "ja", name: "日本語", dir: "ltr" },
  { code: "ko", name: "한국어", dir: "ltr" },
  { code: "sw", name: "Kiswahili", dir: "ltr" },
  { code: "am", name: "አማርኛ", dir: "ltr" },
  { code: "so", name: "Soomaali", dir: "ltr" },
  { code: "ne", name: "नेपाली", dir: "ltr" },
  { code: "ta", name: "தமிழ்", dir: "ltr" },
  { code: "ml", name: "മലയാളം", dir: "ltr" },
  { code: "si", name: "සිංහල", dir: "ltr" },
  { code: "ps", name: "پښتو", dir: "rtl" },
] as const;

export type UiLang = (typeof languages)[number]["code"];

type Extra = {
  signIn: string;
  support: string;
  language: string;
  contentFallback: string;
  conciergeTitle: string;
  conciergeText: string;
  conciergeButton: string;
  conciergeSoon: string;
  desk: string;
  deskTitle: string;
  sectors: Record<string, string>;
};

const extra: Record<Lang, Extra> = {
  ar: {
    signIn: "تسجيل الدخول / إنشاء حساب",
    support: "خدمة العملاء",
    language: "اللغة",
    contentFallback: "",
    conciergeTitle: "معقّب لمرحلة تجارتك",
    conciergeText: "مختص يرافقك في جميع مراحل منشأتك، من التأسيس والتراخيص إلى متابعة الإجراءات مع الجهات حتى اكتمالها.",
    conciergeButton: "اطلب معقّبًا",
    conciergeSoon: "خدمة المعقّب ستتوفر قريبًا · هذا عرض تجريبي",
    desk: "المعقّب",
    deskTitle: "مكتب المعقّب",
    sectors: {},
  },
  en: {
    signIn: "Sign in / Create account",
    support: "Customer service",
    language: "Language",
    contentFallback: "",
    conciergeTitle: "A facilitator for every stage of your business",
    conciergeText:
      "A specialist who supports you through every stage of your business, from formation and licensing to following up with authorities until each step is complete.",
    conciergeButton: "Request a facilitator",
    conciergeSoon: "The facilitator service is coming soon · This is a demo",
    desk: "Facilitator",
    deskTitle: "Facilitator desk",
    sectors: {},
  },
};

export type UiCopy = (typeof copy)["en"] & Extra;

const translations: Record<Exclude<UiLang, Lang>, Partial<UiCopy>> = {
  am, bn, de, es, fa, fr, hi, id, it, ja, ko, ml, ms, ne, ps, pt, ru, si, so, sw, ta, tl, tr, ur, zh,
};

/** Nav label for the facilitator desk in each translated language. */
const deskLabels: Record<Exclude<UiLang, Lang>, string> = {
  ur: "سہولت کار",
  hi: "सहायक",
  bn: "সহায়তাকারী",
  tl: "Tagapag-asikaso",
  id: "Pendamping",
  ms: "Pengurus Urusan",
  tr: "İşlem Takipçisi",
  fa: "کارگزار",
  fr: "Facilitateur",
  es: "Gestor",
  pt: "Despachante",
  de: "Behördenservice",
  it: "Facilitatore",
  ru: "Помощник",
  zh: "代办专员",
  ja: "手続き代行",
  ko: "대행 전문가",
  sw: "Mwezeshaji",
  am: "አስፈጻሚ",
  so: "Fududiye",
  ne: "सहजकर्ता",
  ta: "உதவியாளர்",
  ml: "സഹായി",
  si: "සහායක",
  ps: "مرستندوی",
};

/** The language detailed content (services, journeys, assistant) is shown in. */
export function contentLang(code: UiLang): Lang {
  return code === "ar" ? "ar" : "en";
}

export function isNative(code: UiLang): code is Lang {
  return code === "ar" || code === "en";
}

export function uiCopy(code: UiLang): UiCopy {
  if (isNative(code)) return { ...copy[code], ...extra[code] } as UiCopy;
  return { ...copy.en, ...extra.en, ...translations[code], desk: deskLabels[code] } as UiCopy;
}

export function langDir(code: UiLang): "rtl" | "ltr" {
  return languages.find((item) => item.code === code)?.dir ?? "ltr";
}
