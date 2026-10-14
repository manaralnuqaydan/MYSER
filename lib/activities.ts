import type { Lang } from "./content";

/**
 * Activity helper.
 * The user describes the project in their own words and the advisor suggests
 * the closest business activity, with what opening it takes and the documents
 * to prepare. Suggestions are illustrative; the official activity guide on the
 * Saudi Business Center decides the final classification.
 */

export type RouteKind = "online" | "physical" | "services";

type Text = { ar: string; en: string };
type Source = { ar: string; en: string; url: string };

export type Activity = {
  id: string;
  kind: RouteKind;
  label: Text;
  name: Text;
  words: string[];
  extraSteps?: (Text & { source?: Source })[];
  extraDocs?: Text[];
};

const src = {
  business: { ar: "المركز السعودي للأعمال", en: "Saudi Business Center", url: "https://business.sa" },
  balady: { ar: "بلدي", en: "Balady", url: "https://balady.gov.sa" },
  ejar: { ar: "إيجار", en: "Ejar", url: "https://www.ejar.sa" },
  zatca: { ar: "هيئة الزكاة والضريبة والجمارك", en: "ZATCA", url: "https://zatca.gov.sa" },
  qiwa: { ar: "قوى", en: "Qiwa", url: "https://qiwa.sa" },
  gcam: { ar: "الهيئة العامة لتنظيم الإعلام", en: "General Authority for Media Regulation", url: "https://gcam.gov.sa" },
} satisfies Record<string, Source>;

const premises = [
  { ar: "وثّق عقد إيجار المقر في إيجار", en: "Register the premises lease in Ejar", source: src.ejar },
  { ar: "استخرج رخصة النشاط البلدية وتحقق من الاشتراطات", en: "Get the municipal activity license and check its conditions", source: src.balady },
];

export const ACTIVITIES: Activity[] = [
  {
    id: "marketing", kind: "services",
    label: { ar: "تسويق وإعلان", en: "Marketing and ads" },
    name: { ar: "خدمات التسويق والإعلان", en: "Marketing and advertising services" },
    words: ["تسويق", "تسويقية", "تسويقي", "إعلان", "اعلان", "إعلانات", "اعلانات", "دعاية", "سوشيال", "مؤثر", "marketing", "advertis", "social media"],
    extraSteps: [
      { ar: "تحقق إن كان نشاطك الإعلاني، مثل الإعلان عبر المنصات، يحتاج ترخيصًا إعلاميًا", en: "Check whether your advertising, such as ads on social platforms, needs a media license", source: src.gcam },
    ],
    extraDocs: [
      { ar: "ملف تعريفي بالخدمات (إدارة حسابات، حملات، تصميم، محتوى)", en: "A services profile (account management, campaigns, design, content)" },
      { ar: "نموذج عقد خدمة مع العملاء يوضح النطاق والأسعار", en: "A client service contract template covering scope and pricing" },
    ],
  },
  {
    id: "design", kind: "services",
    label: { ar: "تصميم وجرافيك", en: "Design" },
    name: { ar: "خدمات التصميم الجرافيكي", en: "Graphic design services" },
    words: ["تصميم", "جرافيك", "شعارات", "هوية بصرية", "design", "graphic", "logo"],
  },
  {
    id: "software", kind: "services",
    label: { ar: "برمجة وتقنية", en: "Software and tech" },
    name: { ar: "تطوير البرمجيات والتطبيقات", en: "Software and app development" },
    words: ["برمجة", "برمجيات", "تطبيق", "تطبيقات", "مواقع", "تقنية", "software", "app", "website", "programming"],
  },
  {
    id: "consulting", kind: "services",
    label: { ar: "استشارات", en: "Consulting" },
    name: { ar: "الاستشارات الإدارية", en: "Management consulting" },
    words: ["استشارات", "استشارة", "استشاري", "consult"],
  },
  {
    id: "clothing", kind: "online",
    label: { ar: "ملابس وأزياء", en: "Clothing" },
    name: { ar: "بيع الملابس والأزياء بالتجزئة", en: "Retail sale of clothing and fashion" },
    words: ["ملابس", "عبايات", "عباية", "أزياء", "ازياء", "فساتين", "clothes", "clothing", "fashion", "abaya"],
  },
  {
    id: "perfume", kind: "online",
    label: { ar: "عطور وتجميل", en: "Perfume and beauty" },
    name: { ar: "بيع العطور ومستحضرات التجميل بالتجزئة", en: "Retail sale of perfume and cosmetics" },
    words: ["عطور", "عطر", "بخور", "مكياج", "مستحضرات", "perfume", "cosmetic", "makeup"],
  },
  {
    id: "electronics", kind: "online",
    label: { ar: "إلكترونيات", en: "Electronics" },
    name: { ar: "بيع الأجهزة الإلكترونية والجوالات بالتجزئة", en: "Retail sale of electronics and phones" },
    words: ["إلكترونيات", "الكترونيات", "جوالات", "جوال", "اكسسوارات", "electronics", "phones", "gadgets"],
  },
  {
    id: "cafe", kind: "physical",
    label: { ar: "مقهى أو مطعم", en: "Cafe or restaurant" },
    name: { ar: "تقديم المشروبات والوجبات (مقهى أو مطعم)", en: "Serving drinks and meals (cafe or restaurant)" },
    words: ["مقهى", "كافيه", "كوفي", "قهوة", "مطعم", "مطاعم", "cafe", "coffee", "restaurant"],
    extraSteps: [{ ar: "تحقق من الاشتراطات الصحية لمحلات الأغذية قبل التشغيل", en: "Check the health requirements for food outlets before opening", source: src.balady }],
    extraDocs: [{ ar: "مخطط المحل وتجهيزاته", en: "The shop layout and fit-out plan" }],
  },
  {
    id: "grocery", kind: "physical",
    label: { ar: "بقالة", en: "Grocery" },
    name: { ar: "بيع المواد الغذائية بالتجزئة (بقالة)", en: "Retail sale of food items (grocery)" },
    words: ["بقالة", "بقاله", "تموينات", "سوبرماركت", "grocery", "supermarket"],
  },
  {
    id: "salon", kind: "physical",
    label: { ar: "صالون", en: "Salon" },
    name: { ar: "صالونات الحلاقة والتجميل", en: "Barber and beauty salons" },
    words: ["صالون", "حلاقة", "حلاق", "مشغل", "salon", "barber"],
  },
];

const COMPANY_WORDS = ["شركة", "شركه", "شريك", "شركاء", "company", "partner"];
const TRIGGER_WORDS = ["أحدد نشاط", "احدد نشاط", "حدد نشاط", "حدّد نشاط", "نشاطي", "رمز النشاط", "دليل الأنشطة", "my activity", "which activity", "business activity"];

const has = (q: string, words: string[]) => words.some((w) => q.includes(w));

export function matchActivity(q: string): Activity | undefined {
  const text = q.toLowerCase();
  return ACTIVITIES.find((a) => has(text, a.words));
}

export function isActivityAsk(q: string) {
  return has(q.toLowerCase(), TRIGGER_WORDS);
}

export type ActivityReply = {
  text: string;
  sources: { title: string; url: string }[];
  followUpQuestions: string[];
  suggestedSectorId: string;
  asking: boolean;
};

const EXAMPLES: Text[] = [
  { ar: "أبي أفتح شركة تسويق مع شركاء", en: "I want to open a marketing company with partners" },
  { ar: "أبيع عبايات أونلاين", en: "I sell abayas online" },
  { ar: "أبي أفتح كافيه", en: "I want to open a cafe" },
];

export function askActivity(ar: boolean, missed = false): ActivityReply {
  return {
    text: [
      missed
        ? ar
          ? "ما قدرت أحدد النشاط من الوصف. وضّح لي أكثر وش بتبيع أو بتقدّم."
          : "I couldn't tell the activity from that description. Tell me a bit more about what you'll sell or offer."
        : ar
          ? "تمام، بساعدك تحدد نشاطك التجاري."
          : "Sure, I'll help you pin down your business activity.",
      ar ? "**وش راح تبيع أو تقدّم؟**" : "**What will you sell or offer?**",
      ar
        ? "اكتب وصف بسيط لمشروعك، وأقترح لك النشاط الأقرب ومتطلبات فتحه والمستندات."
        : "Write a short description of your project and I'll suggest the closest activity, what it takes to open, and the documents.",
    ].join("\n\n"),
    sources: [],
    followUpQuestions: EXAMPLES.map((e) => (ar ? e.ar : e.en)),
    suggestedSectorId: "business",
    // Ask again only once, so an unrelated question afterwards reaches the regular advisor
    asking: !missed,
  };
}

export function describeActivity(activity: Activity, q: string, ar: boolean): ActivityReply {
  const text = q.toLowerCase();
  const company = has(text, COMPANY_WORDS);
  const online = activity.kind === "online";
  const physical = activity.kind === "physical";
  const L = (t: Text) => (ar ? t.ar : t.en);

  const steps: (Text & { source?: Source })[] = [
    company
      ? { ar: "أسّس الشركة (مثل ذات مسؤولية محدودة) واتفقوا على عقد التأسيس وحصص الشركاء", en: "Form the company (such as an LLC) and agree on the articles and partner shares", source: src.business }
      : { ar: "سجّل مؤسسة فردية بعد الدخول بنفاذ", en: "Register a sole proprietorship after signing in with Nafath", source: src.business },
    { ar: `اختر نشاط «${activity.name.ar}» من دليل الأنشطة عند إصدار السجل`, en: `Choose "${activity.name.en}" from the activity guide when issuing the CR`, source: src.business },
    ...(physical ? premises : []),
    ...(online ? [{ ar: "وثّق متجرك الإلكتروني", en: "Register your online store", source: src.business }] : []),
    ...(activity.extraSteps ?? []),
    { ar: "سجّل في ضريبة القيمة المضافة إذا تجاوزت إيراداتك حد التسجيل", en: "Register for VAT if your revenue passes the threshold", source: src.zatca },
    { ar: "عند التوظيف: سجّل المنشأة في قوى", en: "When you hire: register the business in Qiwa", source: src.qiwa },
  ];

  const docs: Text[] = [
    { ar: "الهوية الوطنية (أو الإقامة للمستثمر) وحساب نفاذ فعّال", en: "National ID (or residency for investors) and an active Nafath account" },
    { ar: "اسم تجاري مقترح (أكثر من خيار)", en: "Proposed trade names (more than one)" },
    ...(company
      ? [
          { ar: "بيانات الشركاء وهوياتهم وحصة كل شريك", en: "Partner details, IDs and each partner's share" },
          { ar: "رأس المال المتفق عليه", en: "The agreed capital" },
        ]
      : []),
    { ar: "العنوان الوطني للمنشأة", en: "The business's national address" },
    ...(physical ? [{ ar: "عقد إيجار المحل الموثّق", en: "The registered shop lease" }] : []),
    ...(activity.extraDocs ?? []),
    { ar: "حساب بنكي للمنشأة بعد إصدار السجل", en: "A business bank account after the CR is issued" },
  ];

  const seen = new Set<string>();
  const sources = steps
    .filter((s) => s.source && !seen.has(s.source.url) && seen.add(s.source.url))
    .map((s) => ({ title: L(s.source!), url: s.source!.url }));

  const form = company ? (ar ? "كشركة مع شركاء" : "a company with partners") : ar ? "كمؤسسة فردية" : "a sole proprietorship";
  const startChip =
    activity.kind === "physical"
      ? { ar: `أبي أفتح محل ${company ? "مع شركاء" : "لوحدي"}`, en: `I want to open a shop ${company ? "with partners" : "alone"}` }
      : activity.kind === "online"
        ? { ar: `أبي أفتح متجر منتجات ${company ? "مع شركاء" : "لوحدي"}`, en: `I want to open a products store ${company ? "with partners" : "alone"}` }
        : { ar: `أبي أفتح مشروع خدمات ${company ? "مع شركاء" : "لوحدي"}`, en: `I want to start a services project ${company ? "with partners" : "alone"}` };

  return {
    text: [
      `### ${ar ? "النشاط المقترح لك" : "Suggested activity"}`,
      `**${L(activity.name)}**`,
      ar ? `فهمت إن مشروعك ${L(activity.label)}، وبتبدأه ${form}.` : `I understood your project is ${L(activity.label).toLowerCase()}, started as ${form}.`,
      `**${ar ? "متطلبات فتح المشروع" : "What opening it takes"}**`,
      steps.map((s, i) => `${i + 1}. ${L(s)}${s.source ? (ar ? ` (عبر ${s.source.ar})` : ` (via ${s.source.en})`) : ""}`).join("\n"),
      `**${ar ? "المستندات اللي تجهزها" : "Documents to prepare"}**`,
      docs.map((d) => `- ${L(d)}`).join("\n"),
      `> ${
        ar
          ? "الاقتراح استرشادي؛ التصنيف النهائي ورمز النشاط والمتطلبات تحددها المنصات الرسمية عند التقديم."
          : "This is a guide only; the official platforms set the final classification, activity code and requirements when you apply."
      }`,
    ].join("\n\n"),
    sources,
    followUpQuestions: [L(startChip), ar ? "أبي أحدد نشاط ثاني" : "Help me with another activity"],
    suggestedSectorId: "business",
    asking: false,
  };
}

export function runActivity(q: string, asking: boolean, lang: Lang): ActivityReply | null {
  const ar = lang === "ar";
  const activity = matchActivity(q);
  if (activity) return describeActivity(activity, q, ar);
  if (isActivityAsk(q)) return askActivity(ar);
  if (asking) return askActivity(ar, true);
  return null;
}
