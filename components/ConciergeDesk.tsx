"use client";

import { useEffect, useRef, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronDown,
  Clock3,
  FileUp,
  MessageCircle,
  Phone,
  Plus,
  ShieldCheck,
  User,
} from "lucide-react";

import type { Lang, Localized } from "@/lib/content";

/* Facilitator desk: a demo dashboard where an assigned facilitator follows every
   request of the customer and their establishments, stage by stage.
   All names, numbers and updates are illustrative demo data. */

type Stage = 0 | 1 | 2 | 3;
type Update = { when: Localized; text: Localized };
type Request = {
  id: string;
  title: Localized;
  entity: Localized;
  stage: Stage;
  needsYou?: Localized;
  updated: Localized;
  next: Localized;
  updates: Update[];
};
type Account = {
  id: string;
  kind: "business" | "contracting" | "personal";
  name: Localized;
  sub: Localized;
  requests: Request[];
};

const L = (ar: string, en: string): Localized => ({ ar, en });

const stages: Localized[] = [
  L("استلام الطلب", "Received"),
  L("تجهيز المستندات", "Preparing documents"),
  L("قيد المراجعة لدى الجهة", "Under review by the authority"),
  L("مقبول", "Approved"),
];

const officer = {
  name: L("فهد السبيعي", "Fahad Alsubaie"),
  initials: L("ف", "F"),
  role: L("معقّبك المخصص", "Your dedicated facilitator"),
};

const seed: Account[] = [
  {
    id: "nokhba",
    kind: "business",
    name: L("مؤسسة نخبة الريادة للتجارة", "Nokhbat Alriyada Trading Est."),
    sub: L("مؤسسة فردية · الرياض", "Sole proprietorship · Riyadh"),
    requests: [
      {
        id: "MY-240371",
        title: L("نقل خدمات عامل إلى المنشأة", "Transfer a worker's services"),
        entity: L("وزارة الموارد البشرية · قوى", "Ministry of HR · Qiwa"),
        stage: 1,
        needsYou: L("نحتاج صورة إقامة العامل السارية", "We need a copy of the worker's valid iqama"),
        updated: L("اليوم 11:20 ص", "Today 11:20 AM"),
        next: L("ارفع المستند ونكمل عنك مباشرة", "Upload the document and we take it from there"),
        updates: [
          { when: L("اليوم 11:20 ص", "Today 11:20 AM"), text: L("راجعت المستندات، وينقصنا صورة الإقامة فقط.", "I reviewed the documents. Only the iqama copy is missing.") },
          { when: L("أمس 3:40 م", "Yesterday 3:40 PM"), text: L("استلمنا طلبك وأُسند لي لمتابعته.", "We received your request and it was assigned to me.") },
        ],
      },
      {
        id: "MY-240352",
        title: L("إصدار رخصة محل تجاري", "Issue a commercial shop licence"),
        entity: L("وزارة البلديات والإسكان · بلدي", "Ministry of Municipalities · Balady"),
        stage: 2,
        updated: L("اليوم 10:30 ص", "Today 10:30 AM"),
        next: L("بانتظار نتيجة المراجعة الفنية من الأمانة", "Waiting for the municipality's technical review"),
        updates: [
          { when: L("اليوم 10:30 ص", "Today 10:30 AM"), text: L("تواصلت مع الأمانة، والطلب في مرحلة المراجعة الفنية.", "I followed up with the municipality. The request is in technical review.") },
          { when: L("12 أكتوبر", "12 Oct"), text: L("رفعت الطلب بعد اكتمال المخطط وعقد الإيجار.", "I submitted the request once the layout and lease were complete.") },
          { when: L("10 أكتوبر", "10 Oct"), text: L("استلمنا طلبك وراجعنا المتطلبات معك.", "We received your request and went over the requirements with you.") },
        ],
      },
      {
        id: "MY-240377",
        title: L("التسجيل في ضريبة القيمة المضافة", "VAT registration"),
        entity: L("هيئة الزكاة والضريبة والجمارك", "ZATCA"),
        stage: 0,
        updated: L("اليوم 9:05 ص", "Today 9:05 AM"),
        next: L("فهد يراجع بيانات المنشأة قبل التقديم", "Fahad is checking the establishment's details before filing"),
        updates: [{ when: L("اليوم 9:05 ص", "Today 9:05 AM"), text: L("استلمنا الطلب وبدأت مراجعة بيانات المنشأة.", "Request received. I started reviewing the establishment's details.") }],
      },
      {
        id: "MY-240318",
        title: L("تجديد السجل التجاري", "Commercial registration renewal"),
        entity: L("وزارة التجارة", "Ministry of Commerce"),
        stage: 3,
        updated: L("أمس 4:12 م", "Yesterday 4:12 PM"),
        next: L("اكتمل الطلب، والسجل الجديد في ملفاتك", "Completed. The renewed registration is in your files"),
        updates: [
          { when: L("أمس 4:12 م", "Yesterday 4:12 PM"), text: L("تم قبول التجديد، وأرفقت لك نسخة السجل.", "The renewal was approved and I attached a copy for you.") },
          { when: L("8 أكتوبر", "8 Oct"), text: L("رفعت طلب التجديد قبل موعد الانتهاء بـ 20 يومًا.", "I filed the renewal 20 days before the expiry date.") },
        ],
      },
    ],
  },
  {
    id: "ofuq",
    kind: "contracting",
    name: L("شركة أفق للمقاولات", "Ofuq Contracting Co."),
    sub: L("شركة ذات مسؤولية محدودة · جدة", "LLC · Jeddah"),
    requests: [
      {
        id: "MY-240390",
        title: L("تجديد شهادة السلامة", "Safety certificate renewal"),
        entity: L("الدفاع المدني · سلامة", "Civil Defense · Salamah"),
        stage: 2,
        updated: L("اليوم 12:15 م", "Today 12:15 PM"),
        next: L("زيارة الفحص الميداني مجدولة يوم الأحد", "On-site inspection scheduled for Sunday"),
        updates: [
          { when: L("اليوم 12:15 م", "Today 12:15 PM"), text: L("تأكد موعد الفحص الميداني يوم الأحد، وسأكون على تواصل مع مدير الموقع.", "The on-site inspection is confirmed for Sunday. I'll coordinate with the site manager.") },
          { when: L("11 أكتوبر", "11 Oct"), text: L("رفعت الطلب مع مخطط الإخلاء المحدث.", "I submitted the request with the updated evacuation plan.") },
        ],
      },
      {
        id: "MY-240395",
        title: L("تصنيف المقاولين", "Contractor classification"),
        entity: L("منصة تصنيف المقاولين", "Contractor Classification Platform"),
        stage: 1,
        updated: L("أمس 1:50 م", "Yesterday 1:50 PM"),
        next: L("نجهّز القوائم المالية وسجل المشاريع", "Preparing financial statements and project history"),
        updates: [{ when: L("أمس 1:50 م", "Yesterday 1:50 PM"), text: L("استلمت القوائم المالية، وباقي سجل المشاريع.", "Financial statements received. The project history is still to come.") }],
      },
      {
        id: "MY-240301",
        title: L("شهادة الالتزام بالتوطين", "Saudization compliance certificate"),
        entity: L("وزارة الموارد البشرية · قوى", "Ministry of HR · Qiwa"),
        stage: 3,
        updated: L("6 أكتوبر", "6 Oct"),
        next: L("اكتمل الطلب", "Completed"),
        updates: [{ when: L("6 أكتوبر", "6 Oct"), text: L("صدرت الشهادة وأرفقتها لك.", "The certificate was issued and attached for you.") }],
      },
    ],
  },
  {
    id: "personal",
    kind: "personal",
    name: L("طلباتي الشخصية", "My personal requests"),
    sub: L("أفراد", "Individuals"),
    requests: [
      {
        id: "MY-240366",
        title: L("تجديد رخصة القيادة", "Driving licence renewal"),
        entity: L("وزارة الداخلية · أبشر", "Ministry of Interior · Absher"),
        stage: 3,
        updated: L("9 أكتوبر", "9 Oct"),
        next: L("اكتمل الطلب", "Completed"),
        updates: [{ when: L("9 أكتوبر", "9 Oct"), text: L("تم التجديد بعد سداد الرسوم والفحص الطبي.", "Renewed after the fee payment and medical check.") }],
      },
    ],
  },
];

const accountIcons = { business: BriefcaseBusiness, contracting: Building2, personal: User };

export default function ConciergeDesk({ lang, onToast, onNew }: { lang: Lang; onToast: (text: string) => void; onNew: () => void }) {
  const ar = lang === "ar";
  const [accounts, setAccounts] = useState(seed);
  const [active, setActive] = useState(seed[0].id);
  const [open, setOpen] = useState<string | null>(seed[0].requests[0].id);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const account = accounts.find((item) => item.id === active) ?? accounts[0];
  const all = accounts.flatMap((item) => item.requests);
  const activeCount = all.filter((r) => r.stage < 3).length;
  const doneCount = all.filter((r) => r.stage === 3).length;
  const yoursCount = all.filter((r) => r.needsYou).length;
  const counts = [0, 1, 2, 3].map((s) => account.requests.filter((r) => r.stage === s).length);
  const now = L("الآن", "Just now");

  function patch(accountId: string, requestId: string, change: (r: Request) => Request) {
    setAccounts((prev) =>
      prev.map((a) => (a.id !== accountId ? a : { ...a, requests: a.requests.map((r) => (r.id === requestId ? change(r) : r)) })),
    );
  }

  // Demo of the live journey: the document arrives, the facilitator files it, the authority approves.
  function upload(accountId: string, req: Request) {
    patch(accountId, req.id, (r) => ({
      ...r,
      stage: 2,
      needsYou: undefined,
      updated: now,
      next: L("فهد رفع الطلب للجهة، وننتظر الرد", "Fahad filed it with the authority. Waiting for a response"),
      updates: [{ when: now, text: L("استلمت المستند ورفعت الطلب للجهة.", "Document received. I filed the request with the authority.") }, ...r.updates],
    }));
    onToast(ar ? "تم استلام المستند · عرض تجريبي" : "Document received · Demo");
    timers.current.push(
      setTimeout(() => {
        patch(accountId, req.id, (r) => ({
          ...r,
          stage: 3,
          updated: now,
          next: L("اكتمل الطلب", "Completed"),
          updates: [{ when: now, text: L("تم قبول الطلب، وأرفقت لك الإشعار.", "The request was approved and I attached the notice.") }, ...r.updates],
        }));
        onToast(ar ? `تحديث: تم قبول «${req.title.ar}»` : `Update: “${req.title.en}” was approved`);
      }, 3500),
    );
  }

  return (
    <div className="desk">
      <p className="desk-demo">
        {ar
          ? "عرض تجريبي ببيانات افتراضية، غير مرتبط بأي جهة حكومية. الأسماء والطلبات للتوضيح فقط."
          : "Demo with sample data, not connected to any government entity. Names and requests are illustrative."}
      </p>

      <section className="desk-officer" aria-label={officer.role[lang]}>
        <span className="desk-avatar" aria-hidden="true">{officer.initials[lang]}</span>
        <div className="desk-officer-text">
          <small>{officer.role[lang]}</small>
          <strong>{officer.name[lang]}</strong>
          <span className="desk-online">{ar ? "متاح الآن · يتابع طلباتك أول بأول" : "Available now · Following your requests step by step"}</span>
        </div>
        <div className="desk-officer-actions">
          <button type="button" onClick={() => onToast(ar ? "الاتصال بالمعقّب سيتوفر قريبًا · عرض تجريبي" : "Calling your facilitator is coming soon · Demo")}>
            <Phone size={16} />
            {ar ? "اتصال" : "Call"}
          </button>
          <button type="button" onClick={() => onToast(ar ? "المحادثة مع المعقّب ستتوفر قريبًا · عرض تجريبي" : "Chat with your facilitator is coming soon · Demo")}>
            <MessageCircle size={16} />
            {ar ? "محادثة" : "Chat"}
          </button>
        </div>
      </section>

      <div className="desk-stats">
        <div>
          <strong>{activeCount}</strong>
          <span>{ar ? "طلبات قيد المتابعة" : "Requests in progress"}</span>
        </div>
        <div>
          <strong>{doneCount}</strong>
          <span>{ar ? "طلبات مكتملة" : "Completed requests"}</span>
        </div>
        <div className={yoursCount ? "attention" : ""}>
          <strong>{yoursCount}</strong>
          <span>{ar ? "تحتاج إجراء منك" : "Need your action"}</span>
        </div>
        <div>
          <strong>{ar ? "0 ر.س" : "SAR 0"}</strong>
          <span>{ar ? "غرامات عليك" : "Fines on you"}</span>
        </div>
      </div>

      <div className="desk-guarantee">
        <ShieldCheck size={22} />
        <p>
          <strong>{ar ? "ضمان الغرامات" : "Fines guarantee"}</strong>
          {ar
            ? "نتابع مواعيدك وإجراءاتك أول بأول، وأي غرامة تأخير تترتب على طلب تحت متابعتنا نتكفّل بها عنك وفق شروط الخدمة."
            : "We track your deadlines and procedures step by step. Any late fine on a request we are handling is on us, under the service terms."}
        </p>
      </div>

      <div className="desk-accounts" role="tablist" aria-label={ar ? "المنشآت" : "Establishments"}>
        {accounts.map((item) => {
          const Icon = accountIcons[item.kind];
          const pending = item.requests.filter((r) => r.stage < 3).length;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={item.id === active}
              className={item.id === active ? "active" : ""}
              onClick={() => {
                setActive(item.id);
                setOpen(item.requests[0]?.id ?? null);
              }}
            >
              <Icon size={18} />
              <span>
                <strong>{item.name[lang]}</strong>
                <small>{item.sub[lang]}</small>
              </span>
              {pending > 0 && <em>{pending}</em>}
            </button>
          );
        })}
      </div>

      <div className="desk-section-head">
        <h3>{ar ? "رحلة طلباتك" : "Your requests"}</h3>
        <button type="button" className="desk-new" onClick={onNew}>
          <Plus size={16} />
          {ar ? "طلب جديد" : "New request"}
        </button>
      </div>

      <ul className="desk-requests">
        {account.requests.map((req) => {
          const expanded = open === req.id;
          const status = req.needsYou
            ? { cls: "you", label: ar ? "بانتظارك" : "Waiting for you" }
            : req.stage === 3
              ? { cls: "done", label: ar ? "مقبول" : "Approved" }
              : req.stage === 2
                ? { cls: "review", label: ar ? "قيد المراجعة" : "Under review" }
                : { cls: "work", label: ar ? "قيد التنفيذ" : "In progress" };
          return (
            <li key={req.id} className={`desk-request ${status.cls}`}>
              <button type="button" className="desk-request-head" aria-expanded={expanded} onClick={() => setOpen(expanded ? null : req.id)}>
                <span className="desk-request-title">
                  <strong>{req.title[lang]}</strong>
                  <small>
                    {req.entity[lang]} · <span dir="ltr">{req.id}</span>
                  </small>
                </span>
                <span className={`desk-status ${status.cls}`}>{status.label}</span>
                <ChevronDown size={18} className="desk-chevron" />
              </button>
              <div className="desk-progress" aria-hidden="true">
                {stages.map((_, i) => (
                  <span key={i} className={i <= req.stage ? "on" : ""} />
                ))}
              </div>
              <p className="desk-next">
                <Clock3 size={14} />
                {req.next[lang]}
                <span>· {req.updated[lang]}</span>
              </p>
              {expanded && (
                <div className="desk-detail">
                  <ol className="desk-stages">
                    {stages.map((label, i) => (
                      <li key={i} className={i < req.stage || req.stage === 3 ? "done" : i === req.stage ? "current" : ""}>
                        <span className="desk-dot">{i < req.stage || req.stage === 3 ? <Check size={13} /> : i + 1}</span>
                        {label[lang]}
                      </li>
                    ))}
                  </ol>
                  {req.needsYou && (
                    <div className="desk-action">
                      <p>{req.needsYou[lang]}</p>
                      <button type="button" onClick={() => upload(account.id, req)}>
                        <FileUp size={16} />
                        {ar ? "رفع المستند" : "Upload document"}
                      </button>
                    </div>
                  )}
                  <h4>{ar ? "تحديثات المعقّب" : "Facilitator updates"}</h4>
                  <ul className="desk-updates">
                    {req.updates.map((u, i) => (
                      <li key={i}>
                        <span className="desk-avatar small" aria-hidden="true">{officer.initials[lang]}</span>
                        <p>
                          {u.text[lang]}
                          <small>{u.when[lang]}</small>
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <h3 className="desk-analysis-title">{ar ? "تحليل عمليات المنشأة" : "Establishment overview"}</h3>
      <div className="desk-analysis">
        <div className="desk-bars">
          {stages.map((label, i) => (
            <div key={i} className="desk-bar">
              <span>{label[lang]}</span>
              <div>
                <i style={{ width: `${account.requests.length ? (counts[i] / account.requests.length) * 100 : 0}%` }} />
              </div>
              <b>{counts[i]}</b>
            </div>
          ))}
        </div>
        <div className="desk-metrics">
          <div>
            <strong>{ar ? "4.2 أيام" : "4.2 days"}</strong>
            <span>{ar ? "متوسط إنجاز الطلب" : "Average completion time"}</span>
          </div>
          <div>
            <strong>92%</strong>
            <span>{ar ? "طلبات قُبلت من أول تقديم" : "Approved on first submission"}</span>
          </div>
          <div>
            <strong>{ar ? "خلال ساعتين" : "Within 2 hours"}</strong>
            <span>{ar ? "متوسط رد المعقّب" : "Average facilitator reply"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
