import type { Lang } from "./content";

/**
 * Goal-to-Action journeys.
 * The user states a goal, the advisor asks one question at a time until it
 * understands the situation, then draws an ordered roadmap with the official
 * source for each step and keeps track of progress inside the conversation.
 */

export type JourneyId = "project" | "violation" | "legal" | "general";

export type JourneyState = {
  id: JourneyId;
  stage: "ask" | "roadmap";
  answers: Record<string, string>;
  done?: number;
};

export type JourneyReply = {
  text: string;
  sources: { title: string; url: string }[];
  followUpQuestions: string[];
  suggestedSectorId?: string;
  journey: JourneyState;
};

type Step = { ar: string; en: string; detailAr: string; detailEn: string; source?: Source };
type Source = { ar: string; en: string; url: string };
type Question = {
  key: string;
  ar: string;
  en: string;
  options: { value: string; ar: string; en: string }[];
};

const src = {
  business: { ar: "المركز السعودي للأعمال", en: "Saudi Business Center", url: "https://business.sa" },
  ejar: { ar: "إيجار", en: "Ejar", url: "https://www.ejar.sa" },
  balady: { ar: "بلدي", en: "Balady", url: "https://balady.gov.sa" },
  zatca: { ar: "هيئة الزكاة والضريبة والجمارك", en: "ZATCA", url: "https://zatca.gov.sa" },
  qiwa: { ar: "قوى", en: "Qiwa", url: "https://qiwa.sa" },
  gosi: { ar: "التأمينات الاجتماعية", en: "GOSI", url: "https://www.gosi.gov.sa" },
  absher: { ar: "أبشر", en: "Absher", url: "https://www.absher.sa" },
  najiz: { ar: "ناجز", en: "Najiz", url: "https://najiz.sa" },
  nafath: { ar: "نفاذ", en: "Nafath", url: "https://nafath.sa" },
  govsa: { ar: "المنصة الوطنية GOV.SA", en: "GOV.SA", url: "https://my.gov.sa" },
} satisfies Record<string, Source>;

const has = (q: string, words: string[]) => words.some((w) => q.includes(w));

/* ---------------- Goal detection ---------------- */

const PROJECT_WORDS = [
  "مشروع", "نشاط تجاري", "تأسيس", "أسس", "اسس", "متجر إلكتروني", "متجر الكتروني", "بزنس",
  "start a business", "open a business", "my own business", "new business", "online store",
];
const OPEN_WORDS = ["أفتح", "افتح", "بفتح", "ابدأ", "أبدأ", "ابدا", "open", "start"];
const PLACE_WORDS = ["محل", "متجر", "مقهى", "كافيه", "مطعم", "شركة", "مؤسسة", "shop", "store", "cafe", "restaurant", "company"];
const VIOLATION_WORDS = ["مخالف", "غرامة", "violation", "fine"];
const LEGAL_WORDS = [
  "ناجز", "قانوني", "قضية", "قضيه", "دعوى", "دعوي", "محكمة", "محكمه", "وكالة", "وكاله", "توثيق",
  "najiz", "legal", "lawsuit", "court case", "power of attorney",
];
const NOTICE_WORDS = ["إشعار", "اشعار", "تبليغ", "أمر تنفيذ", "امر تنفيذ", "رسالة", "notice", "summons"];
const GENERAL_RE = /(أنجز|انجز|أخلص|اخلص|complete|finish)\s*(ال)?(معامل|transaction)/;

function detectGoal(q: string): JourneyId | null {
  if (has(q, VIOLATION_WORDS)) return "violation";
  if (has(q, LEGAL_WORDS) && !has(q, NOTICE_WORDS)) return "legal";
  if (has(q, PROJECT_WORDS) || (has(q, OPEN_WORDS) && has(q, PLACE_WORDS))) return "project";
  if (GENERAL_RE.test(q) && q.split(/\s+/).length <= 5) return "general";
  return null;
}

/* ---------------- Reading answers from free text ---------------- */

function readAnswers(id: JourneyId, q: string, answers: Record<string, string>) {
  const a = { ...answers };
  if (id === "project") {
    if (!a.kind) {
      if (has(q, ["خدمات", "خدمة", "services"])) a.kind = "services";
      else if (has(q, ["محل", "مقهى", "كافيه", "مطعم", "مقر", "فعلي", "physical", "cafe", "restaurant", "shop"])) a.kind = "physical";
      else if (has(q, ["منتجات", "متجر", "products", "store"])) a.kind = "products";
      else if (has(q, ["إلكتروني", "الكتروني", "اونلاين", "أونلاين", "online", "e-commerce"])) a.kind = "online";
    } else if (a.kind === "online") {
      if (has(q, ["خدمات", "خدمة", "services"])) a.kind = "services";
      else if (has(q, ["منتجات", "متجر", "products", "store"])) a.kind = "products";
    }
    if (!a.form) {
      if (has(q, ["شريك", "شركاء", "شركة", "partner", "company"])) a.form = "company";
      else if (has(q, ["وحدي", "لوحدي", "فردية", "فردي", "alone", "sole", "myself"])) a.form = "sole";
    }
  }
  if (id === "violation" && !a.type) {
    if (has(q, ["مرور", "ساهر", "سيارة", "مركبة", "سرعة", "إشارة", "traffic", "car", "speed"])) a.type = "traffic";
    else if (has(q, ["بلدي", "بلدية", "أمانة", "امانة", "municipal"])) a.type = "municipal";
    else if (has(q, ["ما أعرف", "ما اعرف", "مدري", "لا أعرف", "don't know", "not sure", "unknown"])) a.type = "unknown";
  }
  if (id === "legal" && !a.need) {
    if (has(q, ["وكالة", "وكاله", "توثيق", "مستند", "attorney", "notar", "document"])) a.need = "poa";
    else if (has(q, ["متابعة", "متابعه", "قائمة", "قائمه", "أتابع", "اتابع", "follow", "existing"])) a.need = "follow";
    else if (has(q, ["رفع", "جديد", "جديدة", "دعوى", "دعوي", "file", "new"])) a.need = "new";
  }
  return a;
}

/* ---------------- Questions (one at a time) ---------------- */

function nextQuestion(id: JourneyId, a: Record<string, string>): Question | null {
  if (id === "project") {
    if (!a.kind || a.kind === "online") {
      if (a.kind === "online") {
        return {
          key: "kind",
          ar: "هل المشروع متجر إلكتروني تبيع فيه منتجات، أو تقدم خدمات؟",
          en: "Is the project an online store selling products, or are you offering services?",
          options: [
            { value: "products", ar: "متجر يبيع منتجات", en: "A store selling products" },
            { value: "services", ar: "أقدم خدمات", en: "I offer services" },
          ],
        };
      }
      return {
        key: "kind",
        ar: "وش نوع مشروعك؟",
        en: "What kind of project is it?",
        options: [
          { value: "products", ar: "متجر إلكتروني يبيع منتجات", en: "Online store selling products" },
          { value: "services", ar: "خدمات إلكترونية", en: "Online services" },
          { value: "physical", ar: "محل بمقر فعلي (مقهى، مطعم، محل)", en: "Physical shop (cafe, restaurant, store)" },
        ],
      };
    }
    if (!a.form) {
      return {
        key: "form",
        ar: "بتبدأ لوحدك، أو معك شركاء؟",
        en: "Are you starting alone, or with partners?",
        options: [
          { value: "sole", ar: "لوحدي", en: "Alone" },
          { value: "company", ar: "معي شركاء", en: "With partners" },
        ],
      };
    }
  }
  if (id === "violation" && !a.type) {
    return {
      key: "type",
      ar: "وش نوع المخالفة، أو الجهة اللي أصدرتها؟",
      en: "What type of violation is it, or which authority issued it?",
      options: [
        { value: "traffic", ar: "مخالفة مرورية", en: "Traffic violation" },
        { value: "municipal", ar: "مخالفة بلدية", en: "Municipal violation" },
        { value: "unknown", ar: "ما أعرف الجهة", en: "I don't know the authority" },
      ],
    };
  }
  if (id === "legal" && !a.need) {
    return {
      key: "need",
      ar: "وش تبي تسوي بالضبط؟",
      en: "What exactly do you want to do?",
      options: [
        { value: "new", ar: "رفع دعوى أو طلب جديد", en: "File a new case or request" },
        { value: "follow", ar: "متابعة قضية قائمة", en: "Follow an existing case" },
        { value: "poa", ar: "وكالة أو توثيق مستند", en: "Power of attorney or notarization" },
      ],
    };
  }
  return null;
}

/* ---------------- Roadmaps ---------------- */

function roadmap(id: JourneyId, a: Record<string, string>): { titleAr: string; titleEn: string; steps: Step[]; noteAr: string; noteEn: string } {
  if (id === "project") {
    const company = a.form === "company";
    const steps: Step[] = [
      {
        ar: "تحقق من النشاط والشكل النظامي", en: "Confirm the activity and legal form",
        detailAr: company ? "اختر نوع الشركة ونشاطها بالتصنيف الرسمي، واتفقوا على حصص الشركاء." : "اختر نشاطك بالتصنيف الرسمي وتأكد أن المؤسسة الفردية تناسبه.",
        detailEn: company ? "Choose the company type and its official activity code, and agree on partner shares." : "Choose your official activity code and confirm a sole proprietorship fits it.",
        source: src.business,
      },
      {
        ar: company ? "أصدر عقد التأسيس والسجل التجاري" : "أصدر السجل التجاري", en: company ? "Issue the articles of association and CR" : "Issue the Commercial Registration",
        detailAr: company ? "يُعد عقد التأسيس ويُصدر السجل للشركة إلكترونيًا." : "يُصدر السجل للمؤسسة إلكترونيًا بعد الدخول بنفاذ.",
        detailEn: company ? "Draft the articles of association and issue the company CR online." : "Issue the sole proprietorship CR online after signing in with Nafath.",
        source: src.business,
      },
    ];
    if (a.kind === "physical") {
      steps.push(
        {
          ar: "وثّق عقد إيجار المقر", en: "Register the premises lease",
          detailAr: "وثّق العقد التجاري للمحل للحصول على رقم عقد معتمد.", detailEn: "Register the commercial lease to get an approved contract number.",
          source: src.ejar,
        },
        {
          ar: "استخرج رخصة النشاط البلدية", en: "Get the municipal activity license",
          detailAr: "قدّم على الرخصة، وتحقق هناك إن كان نشاطك يحتاج شهادة سلامة أو اشتراطات إضافية.", detailEn: "Apply for the license and check there whether your activity needs a safety certificate or extra conditions.",
          source: src.balady,
        }
      );
    } else if (a.kind === "products") {
      steps.push({
        ar: "وثّق متجرك الإلكتروني", en: "Register your online store",
        detailAr: "احصل على شهادة توثيق المتجر ليظهر للعملاء أنه موثوق.", detailEn: "Get the online store certificate so customers can trust it.",
        source: src.business,
      });
    } else {
      steps.push({
        ar: "تحقق من ترخيص الخدمة", en: "Check whether the service needs a license",
        detailAr: "بعض الخدمات المهنية تحتاج ترخيصًا من جهة مختصة؛ تأكد من ذلك قبل البدء.", detailEn: "Some professional services need a license from a specific authority; confirm before you start.",
        source: src.business,
      });
    }
    steps.push(
      {
        ar: "سجّل في الزكاة والضريبة إذا انطبق عليك", en: "Register with ZATCA if it applies",
        detailAr: "تحقق من حد التسجيل في ضريبة القيمة المضافة ومتطلبات الفوترة الإلكترونية.", detailEn: "Check the VAT registration threshold and e-invoicing requirements.",
        source: src.zatca,
      },
      {
        ar: "إذا بتوظف: سجّل منشأتك في قوى والتأمينات", en: "If hiring: register with Qiwa and GOSI",
        detailAr: "توثيق العقود وتسجيل الموظفين يكون عند التوظيف فقط.", detailEn: "Contract registration and employee enrollment apply only when you hire.",
        source: src.qiwa,
      }
    );
    return {
      titleAr: "رحلتك: تأسيس مشروعك", titleEn: "Your journey: starting your project",
      steps,
      noteAr: "هذا مسار استرشادي، وقد تختلف المتطلبات حسب النشاط والمدينة. لا تعتبر أي خطوة إلزامية قبل التحقق منها من مصدرها الرسمي.",
      noteEn: "This is an illustrative path; requirements vary by activity and city. Treat no step as mandatory until you verify it with its official source.",
    };
  }

  if (id === "violation") {
    if (a.type === "municipal") {
      return {
        titleAr: "رحلتك: فهم مخالفة بلدية", titleEn: "Your journey: understanding a municipal violation",
        steps: [
          { ar: "تأكد من المخالفة من المصدر الرسمي", en: "Confirm the violation at the official source", detailAr: "استعلم عنها من حسابك في بلدي، لا من رابط وصلك برسالة.", detailEn: "Look it up in your Balady account, not from a link sent by message.", source: src.balady },
          { ar: "راجع تفاصيلها", en: "Review its details", detailAr: "الرقم والتاريخ والسبب والمبلغ كما تظهر في بلدي.", detailEn: "Number, date, reason and amount as shown in Balady." },
          { ar: "اختر الإجراء المتاح لك", en: "Choose the option available to you", detailAr: "السداد، أو الاعتراض إذا ظهر لك خيار الاعتراض ضمن مدته.", detailEn: "Pay, or object if an objection option appears within its period.", source: src.balady },
          { ar: "تابع الحالة", en: "Track the status", detailAr: "تابع نتيجة الاعتراض أو تأكيد السداد في بلدي.", detailEn: "Track the objection result or payment confirmation in Balady." },
        ],
        noteAr: "معبر لا يؤكد وجود مخالفة ولا أحقيتك في الاعتراض؛ القرار للجهة المصدرة.",
        noteEn: "MAABAR does not confirm that a violation exists or that you are eligible to object; the issuing authority decides.",
      };
    }
    if (a.type === "unknown") {
      return {
        titleAr: "رحلتك: معرفة مصدر المخالفة", titleEn: "Your journey: finding who issued the violation",
        steps: [
          { ar: "حدد مصدر الإشعار", en: "Identify the source of the notice", detailAr: "انظر لاسم المرسل في الرسالة أو للجهة المكتوبة في الورقة.", detailEn: "Check the sender name on the message or the authority printed on the paper." },
          { ar: "إذا كانت مرورية", en: "If it is a traffic violation", detailAr: "استعلم عنها في أبشر.", detailEn: "Look it up in Absher.", source: src.absher },
          { ar: "إذا كانت بلدية", en: "If it is a municipal violation", detailAr: "استعلم عنها في بلدي.", detailEn: "Look it up in Balady.", source: src.balady },
          { ar: "إذا ما زلت لا تعرف الجهة", en: "If you still don't know the authority", detailAr: "ابحث عن الجهة في المنصة الوطنية وتواصل معها من قنواتها الرسمية.", detailEn: "Find the authority on the national portal and contact it through its official channels.", source: src.govsa },
        ],
        noteAr: "لا تضغط روابط أو تدفع عبر رسائل غير رسمية. معبر لا يؤكد وجود مخالفة؛ المصدر الرسمي هو المرجع.",
        noteEn: "Do not click links or pay through unofficial messages. MAABAR does not confirm a violation exists; the official source is the reference.",
      };
    }
    return {
      titleAr: "رحلتك: فهم مخالفة مرورية", titleEn: "Your journey: understanding a traffic violation",
      steps: [
        { ar: "تأكد من المخالفة من المصدر الرسمي", en: "Confirm the violation at the official source", detailAr: "استعلم عنها من خدمات المرور في أبشر، لا من رابط وصلك برسالة.", detailEn: "Look it up under traffic services in Absher, not from a link sent by message.", source: src.absher },
        { ar: "راجع تفاصيلها", en: "Review its details", detailAr: "الرقم والتاريخ والموقع والمبلغ كما تظهر في أبشر.", detailEn: "Number, date, location and amount as shown in Absher." },
        { ar: "اختر الإجراء المتاح لك", en: "Choose the option available to you", detailAr: "السداد عبر سداد من تطبيق بنكك، أو الاعتراض من أبشر إذا ظهر لك خيار الاعتراض ضمن مدته.", detailEn: "Pay through SADAD in your bank app, or object in Absher if an objection option appears within its period.", source: src.absher },
        { ar: "تابع الحالة", en: "Track the status", detailAr: "تابع نتيجة الاعتراض أو تأكيد السداد في أبشر.", detailEn: "Track the objection result or payment confirmation in Absher." },
      ],
      noteAr: "معبر لا يؤكد وجود مخالفة ولا أحقيتك في الاعتراض؛ القرار للجهة المصدرة.",
      noteEn: "MAABAR does not confirm that a violation exists or that you are eligible to object; the issuing authority decides.",
    };
  }

  // legal
  const login: Step = { ar: "سجّل دخولك في ناجز عبر نفاذ", en: "Sign in to Najiz with Nafath", detailAr: "الدخول يكون بحسابك الشخصي من الموقع أو التطبيق الرسمي.", detailEn: "Sign in with your own account on the official site or app.", source: src.najiz };
  const legalNote = {
    noteAr: "معبر يشرح الخطوات بلغة بسيطة، ولا يقدم استشارة قانونية ولا يتوقع نتيجة، ولا ينفذ أي طلب نيابة عنك. إذا كان موضوعك معقدًا فاستشر محاميًا مرخصًا.",
    noteEn: "MAABAR explains the steps in plain language; it gives no legal advice, predicts no outcome, and submits nothing on your behalf. For complex matters, consult a licensed lawyer.",
  };
  if (a.need === "follow") {
    return {
      titleAr: "رحلتك: متابعة قضية قائمة", titleEn: "Your journey: following an existing case",
      steps: [
        login,
        { ar: "افتح قضاياك", en: "Open your cases", detailAr: "ادخل قسم القضايا في حسابك وابحث برقم القضية.", detailEn: "Go to the cases section of your account and search by case number.", source: src.najiz },
        { ar: "راجع المستجدات", en: "Review updates", detailAr: "المواعيد والجلسات والتبليغات كما تظهر في ناجز.", detailEn: "Dates, hearings and notifications as shown in Najiz." },
        { ar: "تابع الإشعارات الرسمية", en: "Watch official notifications", detailAr: "فعّل الإشعارات وتجاهل أي رابط غير رسمي.", detailEn: "Turn on notifications and ignore any unofficial link." },
      ],
      ...legalNote,
    };
  }
  if (a.need === "poa") {
    return {
      titleAr: "رحلتك: وكالة أو توثيق مستند", titleEn: "Your journey: power of attorney or notarization",
      steps: [
        login,
        { ar: "اختر الخدمة المناسبة", en: "Choose the right service", detailAr: "إصدار وكالة، أو خدمة التوثيق المناسبة لمستندك.", detailEn: "Issue a power of attorney, or the notarization service that fits your document.", source: src.najiz },
        { ar: "جهّز البيانات", en: "Prepare the details", detailAr: "بيانات الوكيل وحدود الصلاحيات أو بيانات المستند.", detailEn: "The agent's details and the scope of powers, or the document details." },
        { ar: "أكمل الطلب وتحقق منه", en: "Complete and verify", detailAr: "بعد الإصدار تحقق من الوكالة أو المستند في ناجز.", detailEn: "After issuance, verify the POA or document in Najiz.", source: src.najiz },
      ],
      ...legalNote,
    };
  }
  return {
    titleAr: "رحلتك: رفع دعوى أو طلب جديد", titleEn: "Your journey: filing a new case or request",
    steps: [
      login,
      { ar: "اختر نوع الطلب", en: "Choose the request type", detailAr: "من الخدمات القضائية اختر صحيفة الدعوى أو الطلب الذي يناسب موضوعك.", detailEn: "From judicial services, choose the claim or request that fits your matter.", source: src.najiz },
      { ar: "جهّز المعلومات والمستندات", en: "Prepare information and documents", detailAr: "بيانات الطرف الآخر، ووصف مختصر وواضح لطلبك، والمستندات الداعمة.", detailEn: "The other party's details, a short clear description, and supporting documents." },
      { ar: "تابع الطلب", en: "Track the request", detailAr: "تابع حالة الطلب ومواعيد الجلسات في ناجز.", detailEn: "Track the request status and hearing dates in Najiz.", source: src.najiz },
    ],
    ...legalNote,
  };
}

const PREP: Record<Exclude<JourneyId, "general">, { ar: string[]; en: string[] }> = {
  project: {
    ar: ["- هويتك الوطنية وحساب نفاذ فعّال", "- النشاط الذي تريد ممارسته بدقة", "- الاسم التجاري المقترح (أكثر من خيار)", "- بيانات الشركاء وحصصهم إن وجدوا", "- عنوان المقر أو عقد الإيجار للمحل الفعلي", "- حساب بنكي للمنشأة بعد إصدار السجل"],
    en: ["- National ID and an active Nafath account", "- The exact activity you plan to run", "- Proposed trade names (more than one)", "- Partner details and shares, if any", "- Premises address or lease for a physical shop", "- A business bank account after the CR is issued"],
  },
  violation: {
    ar: ["- حساب فعّال في المنصة الرسمية (أبشر أو بلدي)", "- رقم المخالفة أو بيانات الإشعار الرسمي", "- أي صور أو مستندات تدعم اعتراضك إن قررت الاعتراض"],
    en: ["- An active account on the official platform (Absher or Balady)", "- The violation number or official notice details", "- Any photos or documents supporting an objection, if you decide to object"],
  },
  legal: {
    ar: ["- حساب نفاذ فعّال", "- رقم القضية أو الطلب إن وجد", "- بيانات الطرف الآخر أو الوكيل", "- المستندات المتعلقة بموضوعك مرتبة"],
    en: ["- An active Nafath account", "- Case or request number, if any", "- The other party's or agent's details", "- The documents related to your matter, organized"],
  },
};

/* ---------------- Rendering ---------------- */

function stepLine(n: number, s: Step, ar: boolean) {
  const where = s.source ? (ar ? ` (عبر ${s.source.ar})` : ` (via ${s.source.en})`) : "";
  return `${n}. **${ar ? s.ar : s.en}:** ${ar ? s.detailAr : s.detailEn}${where}`;
}

function sourcesOf(steps: Step[], ar: boolean) {
  const seen = new Set<string>();
  const out: { title: string; url: string }[] = [];
  for (const s of steps) {
    if (s.source && !seen.has(s.source.url)) {
      seen.add(s.source.url);
      out.push({ title: ar ? s.source.ar : s.source.en, url: s.source.url });
    }
  }
  return out;
}

const SECTOR: Record<JourneyId, string | undefined> = {
  project: "business",
  violation: "traffic",
  legal: "justice",
  general: undefined,
};

function doneChip(n: number, ar: boolean) {
  return ar ? `أنجزت الخطوة ${n}` : `I finished step ${n}`;
}
const PREP_CHIP = { ar: "وش أجهز قبل البدء؟", en: "What should I prepare?" };
const NEW_CHIP = { ar: "أبي أنجز شي ثاني", en: "I want to do something else" };

function ask(id: JourneyId, a: Record<string, string>, question: Question, ar: boolean, intro: boolean): JourneyReply {
  const lead = intro
    ? ar
      ? "تمام، بساعدك ترتب رحلتك خطوة بخطوة. أحتاج أفهم وضعك أولًا:"
      : "Great, I'll help you map your journey step by step. First, a quick question:"
    : "";
  return {
    text: [lead, `**${ar ? question.ar : question.en}**`].filter(Boolean).join("\n\n"),
    sources: [],
    followUpQuestions: question.options.map((o) => (ar ? o.ar : o.en)),
    suggestedSectorId: SECTOR[id],
    journey: { id, stage: "ask", answers: a },
  };
}

function showRoadmap(id: JourneyId, a: Record<string, string>, ar: boolean): JourneyReply {
  const map = roadmap(id, a);
  const text = [
    `### ${ar ? map.titleAr : map.titleEn}`,
    ar ? "هذي خريطة خطواتك بالترتيب، ومع كل خطوة الجهة الرسمية اللي تنفذها فيها:" : "Here are your steps in order, each with the official authority where you complete it:",
    map.steps.map((s, i) => stepLine(i + 1, s, ar)).join("\n"),
    `> ${ar ? map.noteAr : map.noteEn}`,
    ar ? "إذا رجعت بعد ما تنجز خطوة، علّمها هنا وأعطيك اللي بعدها." : "When you come back after finishing a step, mark it here and I'll give you the next one.",
  ].join("\n\n");
  return {
    text,
    sources: sourcesOf(map.steps, ar),
    followUpQuestions: [doneChip(1, ar), ar ? PREP_CHIP.ar : PREP_CHIP.en],
    suggestedSectorId: SECTOR[id],
    journey: { id, stage: "roadmap", answers: a, done: 0 },
  };
}

function showProgress(state: JourneyState, done: number, ar: boolean): JourneyReply {
  const map = roadmap(state.id, state.answers);
  const total = map.steps.length;
  const d = Math.min(Math.max(done, 1), total);
  const doneSteps = map.steps.slice(0, d).map((s) => (ar ? s.ar : s.en));
  // A single line is not rendered as a list, so mark it by hand
  const finished = doneSteps.length > 1 ? doneSteps.map((t) => `- ${t}`).join("\n") : `✓ ${doneSteps[0]}`;
  const parts = [`### ${ar ? `تقدّمك: ${d} من ${total}` : `Your progress: ${d} of ${total}`}`, finished];
  const chips: string[] = [];
  if (d < total) {
    const next = map.steps[d];
    parts.push(`**${ar ? "خطوتك التالية" : "Your next step"}**`, stepLine(d + 1, next, ar));
    const rest = map.steps.slice(d + 1);
    if (rest.length) {
      parts.push(ar ? `وبعدها: ${rest.map((s) => s.ar).join("، ثم ")}.` : `After that: ${rest.map((s) => s.en).join(", then ")}.`);
    }
    chips.push(doneChip(d + 1, ar), ar ? PREP_CHIP.ar : PREP_CHIP.en);
  } else {
    parts.push(
      ar
        ? "أنجزت كل خطوات رحلتك. تابع أي تحديثات أو إشعارات من الجهات الرسمية مباشرة."
        : "You've completed every step of your journey. Follow any updates or notifications directly from the official authorities."
    );
    chips.push(ar ? NEW_CHIP.ar : NEW_CHIP.en);
  }
  parts.push(`> ${ar ? map.noteAr : map.noteEn}`);
  return {
    text: parts.join("\n\n"),
    sources: sourcesOf(d < total ? [map.steps[d]] : map.steps, ar),
    followUpQuestions: chips,
    suggestedSectorId: SECTOR[state.id],
    journey: { ...state, stage: "roadmap", done: d },
  };
}

function showPrep(state: JourneyState, ar: boolean): JourneyReply {
  const id = state.id as Exclude<JourneyId, "general">;
  const next = (state.done ?? 0) + 1;
  const total = roadmap(state.id, state.answers).steps.length;
  return {
    text: [
      `**${ar ? "جهّز هذي قبل ما تبدأ" : "Have these ready before you start"}**`,
      (ar ? PREP[id].ar : PREP[id].en).join("\n"),
      `> ${ar ? "القائمة استرشادية؛ المطلوب النهائي تحدده الجهة الرسمية عند التقديم." : "This list is a guide; the official authority sets the final requirements when you apply."}`,
    ].join("\n\n"),
    sources: [],
    followUpQuestions: next <= total ? [doneChip(next, ar)] : [ar ? NEW_CHIP.ar : NEW_CHIP.en],
    suggestedSectorId: SECTOR[state.id],
    journey: state,
  };
}

function askGeneral(ar: boolean): JourneyReply {
  return {
    text: [
      ar ? "**وش تبي تنجز؟**" : "**What do you want to get done?**",
      ar
        ? "اكتب هدفك بكلامك، مثل «أبي أفتح محل» أو «وصلتني مخالفة»، وأنا أرتب لك الخطوات والجهات الرسمية."
        : "Describe your goal in your own words, like \"I want to open a shop\" or \"I got a fine\", and I'll map the steps and official authorities.",
    ].join("\n\n"),
    sources: [],
    followUpQuestions: ar
      ? ["أبي أفتح مشروع", "عندي موضوع قانوني", "أبي أفهم مخالفة"]
      : ["I want to start a project", "I have a legal matter", "I want to understand a violation"],
    journey: { id: "general", stage: "ask", answers: {} },
  };
}

function start(id: JourneyId, q: string, ar: boolean, intro: boolean): JourneyReply {
  if (id === "general") return askGeneral(ar);
  const a = readAnswers(id, q, {});
  const question = nextQuestion(id, a);
  return question ? ask(id, a, question, ar, intro) : showRoadmap(id, a, ar);
}

/* ---------------- Entry point ---------------- */

export function runJourney(
  userQuery: string,
  history: { role: string; journey?: JourneyState }[],
  lang: Lang = "ar"
): JourneyReply | null {
  const ar = lang === "ar";
  const q = userQuery.trim().toLowerCase();
  const last = [...history].reverse().find((m) => m.role === "assistant");
  const state = last?.journey;

  if (state && state.id !== "general") {
    if (state.stage === "roadmap") {
      const doneMatch = q.match(/(أنجزت|انجزت|خلصت|سويت|finished|done)[^\d]*(\d+)/);
      if (doneMatch) return showProgress(state, Number(doneMatch[2]), ar);
      if (has(q, ["أنجزت", "انجزت", "خلصت", "finished", "done"]) && !detectGoal(q)) {
        return showProgress(state, (state.done ?? 0) + 1, ar);
      }
      if (has(q, ["أجهز", "اجهز", "المستندات", "المطلوب", "prepare", "documents"])) return showPrep(state, ar);
      if (has(q, ["شي ثاني", "شيء ثاني", "رحلة جديدة", "something else"])) return askGeneral(ar);
    } else {
      const a = readAnswers(state.id, q, state.answers);
      if (JSON.stringify(a) !== JSON.stringify(state.answers)) {
        const question = nextQuestion(state.id, a);
        return question ? ask(state.id, a, question, ar, false) : showRoadmap(state.id, a, ar);
      }
    }
  }

  const goal = detectGoal(q);
  if (goal) return start(goal, q, ar, state?.id !== "general");
  // Anything else goes to the regular advisor.
  return null;
}
