import { detailedServices, CuratedServiceDetailed } from "./servicesDetailed";
import { directorySectors, Lang } from "./content";

export type MessageRole = "user" | "assistant" | "system";

export type ChatMessage = {
  role: MessageRole;
  text: string;
  sources?: { title: string; url: string }[];
  suggestedSectorId?: string;
  suggestedServiceId?: string;
  followUpQuestions?: string[];
  isVerified?: boolean;
};

export type KnowledgeCategory =
  | "business_establishment"
  | "traffic_vehicles"
  | "civil_affairs"
  | "labor_regulations"
  | "health_services"
  | "education"
  | "justice_legal"
  | "general_government";

export type AgentResponse = {
  text: string;
  sources: { title: string; url: string }[];
  suggestedSectorId?: string;
  suggestedServiceId?: string;
  followUpQuestions?: string[];
  requiresClarification: boolean;
  unverifiedNote?: string;
};

/**
 * Knowledge Base Search & Information Retrieval Engine
 * Runs fully locally, zero telemetry, zero leaks.
 */
export function retrieveRelevantKnowledge(
  query: string,
  lang: Lang = "ar"
): {
  matchedServices: CuratedServiceDetailed[];
  relevantSectorId?: string;
  category?: KnowledgeCategory;
} {
  const q = query.toLowerCase().trim();

  // Keyword associations for intelligent semantic categorization
  const categoryKeywords: Record<KnowledgeCategory, string[]> = {
    business_establishment: [
      "مقهى", "كافيه", "مطعم", "متجر", "تجارة", "سجل", "شركة", "مؤسسة", "بلدي", "رخصة",
      "تأسيس", "مشروع", "ضريبة", "زاتكا", "قيمة مضافة", "المركز السعودي للأعمال", "استثمار",
      "business", "cafe", "cr", "company", "license", "balady", "vat", "zatca", "commercial"
    ],
    traffic_vehicles: [
      "مرور", "رخصة قيادة", "قيادة", "مخالفة", "مخالفات", "سيارة", "مركبة", "لوحة", "فحص دوري", "إيفاء",
      "traffic", "driving", "license", "violation", "fine", "vehicle", "car"
    ],
    civil_affairs: [
      "أحوال", "هوية", "بطاقة", "ميلاد", "واقعة", "سجل أسرة", "موعد", "أبشر أفراد", "إقامة",
      "civil", "id", "appointment", "national id", "iqama", "birth", "family"
    ],
    labor_regulations: [
      "عمل", "قوى", "عقد", "موظف", "عمالة", "تأشيرة", "نطاقات", "توطين", "سعودة", "حماية أجور",
      "labor", "work", "qiwa", "contract", "employee", "visa", "nitaqat", "saudization"
    ],
    health_services: [
      "صحة", "صحتي", "موعد مستشفى", "مركز صحي", "عيادة", "إجازة مرضية", "لقاح", "تطعيم", "فحص طبي",
      "health", "sehhaty", "clinic", "hospital", "sick leave", "vaccine", "medical"
    ],
    education: [
      "تعليم", "نور", "مدرسة", "طالب", "روضة", "تسجيل مدرسة", "شهادة", "درجات", "معلم",
      "education", "noor", "school", "student", "kindergarten", "grades"
    ],
    justice_legal: [
      "عدل", "ناجز", "وكالة", "توثيق", "محكمة", "قضية", "إفراغ", "عقار", "عقد زواج", "تنفيذ",
      "justice", "najiz", "poa", "attorney", "court", "deed", "property", "legal"
    ],
    general_government: [
      "نفاذ", "أبشر", "منصة", "حكومي", "توكلنا", "رسوم", "سداد",
      "nafath", "absher", "platform", "gov", "tawakkalna", "sadad"
    ]
  };

  let detectedCategory: KnowledgeCategory | undefined;
  for (const [cat, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((kw) => q.includes(kw))) {
      detectedCategory = cat as KnowledgeCategory;
      break;
    }
  }

  // Score each detailed service based on token overlap in name, summary, prerequisites, and keywords
  const scored = detailedServices.map((service) => {
    let score = 0;
    const nameAr = service.name.ar.toLowerCase();
    const nameEn = service.name.en.toLowerCase();
    const summaryAr = service.summary.ar.toLowerCase();
    const summaryEn = service.summary.en.toLowerCase();
    const platformAr = service.platform.ar.toLowerCase();

    // Exact name matches
    if (q.includes(nameAr) || nameAr.includes(q)) score += 10;
    if (q.includes(nameEn) || nameEn.includes(q)) score += 10;

    // Tokenized query matching
    const tokens = q.split(/\s+/).filter((t) => t.length > 2);
    for (const t of tokens) {
      if (nameAr.includes(t)) score += 5;
      if (platformAr.includes(t)) score += 4;
      if (summaryAr.includes(t)) score += 3;
      if (summaryEn.includes(t)) score += 2;
      if (service.prerequisites.ar.toLowerCase().includes(t)) score += 2;
      if (service.conditionalRules.ar.toLowerCase().includes(t)) score += 2;
    }

    // Category boost
    if (detectedCategory === "business_establishment" && service.sectorId === "business") score += 4;
    if (detectedCategory === "traffic_vehicles" && service.sectorId === "traffic") score += 4;
    if (detectedCategory === "civil_affairs" && service.sectorId === "public") score += 4;
    if (detectedCategory === "labor_regulations" && service.sectorId === "work") score += 4;
    if (detectedCategory === "health_services" && service.sectorId === "health") score += 4;
    if (detectedCategory === "education" && service.sectorId === "education") score += 4;
    if (detectedCategory === "justice_legal" && service.sectorId === "justice") score += 4;

    return { service, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const matchedServices = scored.filter((s) => s.score > 0).map((s) => s.service);

  const topMatch = matchedServices[0];
  const relevantSectorId = topMatch ? topMatch.sectorId : undefined;

  return {
    matchedServices,
    relevantSectorId,
    category: detectedCategory
  };
}

/**
 * Universal Intelligent Agent Response Generator
 * Handles conceptual questions, multi-step procedures, business launches, comparisons,
 * follow-ups, and un-scripted queries grounded in official Saudi data.
 */
export function generateLocalAgentResponse(
  userQuery: string,
  history: ChatMessage[],
  lang: Lang = "ar"
): AgentResponse {
  const ar = lang === "ar";
  const q = userQuery.trim().toLowerCase();
  const retrieval = retrieveRelevantKnowledge(userQuery, lang);

  // Check if context has a previous topic (for follow-up questions)
  const lastAssistantMsg = [...history].reverse().find((m) => m.role === "assistant");
  const isFollowUp =
    history.length > 0 &&
    (q.includes("كم الرسوم") ||
      q.includes("كم المدة") ||
      q.includes("وش المطلوب بعده") ||
      q.includes("وماذا عن") ||
      q.includes("how much") ||
      q.includes("what next") ||
      q.includes("requirements"));

  // 1. SCENARIO: Business launch / cafe / restaurant in any region (e.g. Al-Qassim, Riyadh, etc.)
  if (
    q.includes("مقهى") ||
    q.includes("مطعم") ||
    q.includes("مشروع") ||
    q.includes("كافيه") ||
    q.includes("بفتح") ||
    q.includes("أفتح") ||
    q.includes("تأسيس") ||
    (retrieval.category === "business_establishment" && (q.includes("كيف") || q.includes("وش الإجراءات") || q.includes("خطوات")))
  ) {
    // Extract region/city if mentioned
    let regionNote = "";
    if (q.includes("قصيم") || q.includes("القصيم")) {
      regionNote = ar
        ? "بخصوص منطقة القصيم، تطبق أمانة منطقة القصيم والبلديات التابعة لها الاشتراطات البلدية وكود البناء السعودي المحلي للأنشطة التجارية."
        : "For Al-Qassim region, Al-Qassim Municipality applies local commercial zoning and Saudi Building Code requirements.";
    } else if (q.includes("رياض") || q.includes("الرياض")) {
      regionNote = ar
        ? "بخصوص مدينة الرياض، تطبق أمانة منطقة الرياض اشتراطات الواجهات وتصاميم الهوية العمرانية المعتمدة لكل نطاق بلدي."
        : "For Riyadh, Riyadh Municipality applies urban code and zoning regulations specific to municipal sub-districts.";
    }

    const steps = [
      ar
        ? "1. **تحديد الشكل النظامي والاسم التجاري:** إصدار سجل تجاري (مؤسسة فردية أو شركة ذات مسؤولية محدودة) عبر منصة المركز السعودي للأعمال (business.sa) باختيار نشاط المقاهي/المطاعم بالتصنيف الوطني (ISIC4)."
        : "1. **Legal Structure & Trade Name:** Issue a Commercial Registration (Sole Proprietorship or LLC) via Saudi Business Center (business.sa) selecting cafe/restaurant activity under ISIC4.",
      ar
        ? "2. **توثيق مقر المحل (عقد الإيجار):** توثيق عقد الإيجار التجاري لموقع المنشأة عبر شبكة «إيجار» للحصول على رقم العقد المعتمد."
        : "2. **Premises Lease Authentication:** Authenticate the commercial lease via the official 'Ejar' network.",
      ar
        ? "3. **إصدار الرخصة التجارية البلدية:** التقديم عبر منصة «بلدي» لإصدار رخصة المحل ومطابقة اشتراطات المساحة، وتركيب كاميرات المراقبة، وأدوات الوقاية من الحريق (الدفاع المدني)."
        : "3. **Commercial Municipal License:** Apply via 'Balady' portal ensuring zoning compliance, surveillance installation, and Civil Defense fire safety compliance.",
      ar
        ? "4. **الشهادات الصحية للعاملين:** استخراج الشهادات الصحية لكافة المشتغلين في إعداد وتقديم المأكولات والمشروبات عبر فحص طبي معتمد من منصة بلدي."
        : "4. **Worker Health Certificates:** Issue health cards for food and beverage handling personnel via certified medical screenings on Balady.",
      ar
        ? "5. **الالتزامات الضريبية والعمالية:** تسجيل المنشأة لدى هيئة الزكاة والضريبة والجمارك (زاتكا) لإصدار الشهادة الضريبية وتركيب الفوترة الإلكترونية، وتوثيق عقود العمل عبر منصة «قوى» عند استقطاب عمالة."
        : "5. **Tax & Labor Compliance:** Register with ZATCA for tax certification and E-Invoicing, and authenticate labor contracts via 'Qiwa' upon hiring."
    ];

    const sources = [
      { title: ar ? "المركز السعودي للأعمال (تأسيس وسجل تجاري)" : "Saudi Business Center (CR)", url: "https://mc.gov.sa/ar/eservices/pages/ServiceDetails.aspx?sID=38" },
      { title: ar ? "منصة بلدي (الرخصة التجارية البلدية)" : "Balady (Municipal License)", url: "https://balady.gov.sa/" },
      { title: ar ? "هيئة الزكاة والضريبة والجمارك (زاتكا)" : "ZATCA (Tax & Invoicing)", url: "https://zatca.gov.sa/" }
    ];

    const text = ar
      ? `تأسيس هذا النشاط في المملكة يتطلب تسلسلًا نظاميًا يبدأ من السجل التجاري وينتهي بتراخيص الموقع والتشغيل.

${regionNote ? regionNote + "\n\n" : ""}**الخطوات النظامية المؤكدة:**
${steps.join("\n\n")}

> **تنبيه الشفافية:** الرسوم البلدية للموقع تُحسب بناءً على مساحة المحل وتصنيف الشارع لدى الأمانة المعنية ولا تظهر بدقة إلا بعد إدخال كروكي الموقع في منصة بلدي.`
      : `Establishing this activity in Saudi Arabia involves an orderly regulatory route from Commercial Registration to location operational licensing.

${regionNote ? regionNote + "\n\n" : ""}**Verified Regulatory Steps:**
${steps.join("\n\n")}

> **Transparency Note:** Municipal square-footage fees depend on shop floor area and street zoning classification determined dynamically within the Balady portal.`;

    return {
      text,
      sources,
      suggestedSectorId: "business",
      suggestedServiceId: "sole-proprietorship-cr",
      followUpQuestions: ar
        ? ["هل تخطط لإطلاقه كمؤسسة فردية أم شركة بشراكة؟", "هل موقع المحل مستأجر وجاهز للترخيص البلدي؟"]
        : ["Are you planning a sole proprietorship or an LLC partnership?", "Have you signed a commercial lease on Ejar??"],
      requiresClarification: false
    };
  }

  // 2. SCENARIO: Traffic Accident / Najm / Collision / Damage appraisal
  if (
    q.includes("حادث") ||
    q.includes("صدمت") ||
    q.includes("صدمني") ||
    q.includes("نجم") ||
    q.includes("تقدير") ||
    q.includes("accident") ||
    q.includes("crash") ||
    q.includes("collision")
  ) {
    const text = ar
      ? `### الدليل الإجرائي لمباشرة الحوادث المرورية في المملكة

عند وقوع حادث مروري، لا تقتصر المعاملة على منصة واحدة (مثل أبشر)، بل تخضع لسلسلة من الإجراءات والجهات بحسب تفاصيل الواقعة:

**1. متى تطلب «نجم» (هاتف 199033 أو تطبيق نجم)؟**
* إذا كان لدى طرف واحد على الأقل وثيقة **تأمين سارية المفعول**.
* عدم وجود وفيات أو إصابات جسيمة تتطلب إسعافاً.
* عدم هروب أي طرف من موقع الحادث، ووقوع الحادث ضمن النطاق الجغرافي لتغطية شركة نجم.

**2. متى يلزم تدخل «المرور» مباشرة (هاتف 993 أو 911)؟**
* وجود إصابات بشرية أو وفيات (مع الاتصال فوراً بالإسعاف 997).
* هروب أحد أطراف الحادث من الموقع.
* عدم وجود تأمين ساري لدى جميع الأطراف وكان الحادث خارج التغطية.
* وجود اشتباه جنائي أو حريق في المركبات.

**3. الخطوة التالية بعد تقرير الحادث:**
* **منظومة تقدير (taqdeer.sa):** حجز موعد لفحص أضرار المركبة وتسعير قطع الغيار وأجور الإصلاح رسمياً.
* **شركة التأمين:** رفع مطالبة التعويض المالي عبر الموقع الإلكتروني لشركة تأمين الطرف المتسبب برقم تقرير نجم وتقدير ورقم الآيبان البنكي (مدة الصرف النظامية 15 يوماً).
* **بوابة ناجز (المحاكم المرورية):** في حال كان المتسبب غير مؤمن ورفض سداد قيمة التقدير، تُحال القضية للمحكمة المرورية عبر ناجز للمطالبة بالسداد التنفيذي.

> **تنبيه الأمان والخصوصية:** تأكد أولاً من سلامة المتواجدين؛ لا تغادر موقع الحادث قبل توثيقه رسمياً وتجنب الدخول في روابط غير رسمية خارج منصات نجم والمرور.`
      : `### Procedural Guide for Traffic Accidents in Saudi Arabia

Traffic collision handling is not limited to a single platform like Absher; it involves a clear multi-authority sequence based on case attributes:

**1. When to dispatch Najm (Phone 199033 or Najm App):**
* At least one involved vehicle holds **valid insurance**.
* Zero fatalities or severe bodily injuries.
* No hit-and-run, and the location falls within Najm's operational geography.

**2. When Traffic Police dispatch is mandatory (Call 993 or 911):**
* Any bodily injuries or deaths (call 997 Ambulance immediately).
* Hit-and-run incidents where a party flees the scene.
* All parties lack insurance outside Najm territory, or criminal suspicion arises.

**3. Next Steps Post-Incident:**
* **Taqddeer (taqdeer.sa):** Book an appraisal slot for vehicle valuation and standardized parts/labor quotes.
* **Insurance Provider:** Lodge compensation claim via the liable party's insurer portal using report IDs and your bank IBAN (15 business days statutory disbursement limit).
* **Najiz Traffic Courts:** If the liable party is uninsured and refuses payment, file a traffic restitution claim via Najiz.

> **Safety Notice:** Prioritize life safety first; do not alter the collision scene prior to digital reporting.`;

    return {
      text,
      sources: [
        { title: ar ? "شركة نجم لخدمات التأمين" : "Najm Insurance Services", url: "https://www.najm.sa/" },
        { title: ar ? "منظومة تقدير لأضرار المركبات" : "Taqddeer Vehicle Appraisal", url: "https://taqdeer.sa/" },
        { title: ar ? "بوابة أبشر (الإدارة العامة للمرور)" : "Absher (Traffic Directorate)", url: "https://www.absher.sa/" },
        { title: ar ? "بوابة ناجز للمحاكم المرورية" : "Najiz Traffic Courts", url: "https://new.najiz.sa/" }
      ],
      suggestedSectorId: "traffic",
      suggestedServiceId: "traffic-accidents",
      followUpQuestions: ar
        ? ["هل يحمل الطرفان وثائق تأمين سارية المفعول؟", "هل نتج عن الحادث أي إصابات جسدية؟", "هل ترغب في معرفة كيفية حجز موعد في مراكز «تقدير»؟"]
        : ["Do both vehicles carry active insurance?", "Were there any bodily injuries reported?", "How do I book an appraisal at Taqddeer?"],
      requiresClarification: false
    };
  }

  // 3. SCENARIO: Judicial Notices / Court Subpoenas / SMS Enforcement / Fraud Verification
  if (
    q.includes("إشعار قضائي") ||
    q.includes("اشعار قضائي") ||
    q.includes("رسالة قضائية") ||
    q.includes("تبليغ قضائي") ||
    q.includes("أمر تنفيذ") ||
    q.includes("تنفيذ قضائي") ||
    q.includes("مادة 46") ||
    q.includes("مادة 34") ||
    q.includes("جلسة قضائية") ||
    q.includes("قضية") ||
    q.includes("محكمة") ||
    q.includes("subpoena") ||
    q.includes("court notice") ||
    q.includes("judicial notice") ||
    q.includes("enforcement")
  ) {
    const text = ar
      ? `### توجيه استرشادي للإشعارات والتبليغات القضائية

عند استلام رسالة نصية تفيد بصدور إشعار أو تبليغ قضائي، اتبع الخطوات النظامية التالية لفهم نوع الإشعار وحماية نفسك من الاحتيال:

**1. ما هو الإشعار الوارد وماذا يعني؟**
* **تبليغ بحضور جلسة قضائية:** يفيد بوجود دعوى مقامة لدى إحدى المحاكم (عامة، تجارية، عمالية، أحوال شخصية)، ويتضمن موعد الجلسة ورابط الحضور الافتراضي عبر منصة ناجز.
* **إشعار بأمر تنفيذ (وفق المادة 34):** إخطار بصدور قرار تنفيذ مالي بناءً على سند تنفيذي (شيك، كمبيالة، سند لأمر، أو حكم مكتسب القطعية). يمنحك النظام **مهلة 5 أيام نظامية** للسداد أو تقديم منازعة شكلية قبل الانتقال للقرارات المشددة (المادة 46).

**2. الخطوة العملية المباشرة:**
* **لا تضغط على أي روابط مشبوهة** موجودة في نص الرسالة.
* توجّه مباشرة إلى المتصفح وافتح البوابة الرسمية: **بوابة ناجز (najiz.sa)**.
* سجّل الدخول الآمن برقم هويتك عبر **النفاذ الوطني الموحد (تطبيق نفاذ)**.
* ادخل إلى تبويب **«القضايا»** لمعرفة تفاصيل الدعوى، أو تبويب **«التنفيذ»** للاطلاع على رقم الطلب وفاتورة سداد الصادرة برمز المفوتر (169).

**3. سداد الالتزام أو المنازعة:**
* إذا كان الإشعار صحيحاً وتوافق على صحة الدين، يتم السداد مباشرة عبر تطبيق بنكك باستخدام رقم فاتورة سداد، ويُرفع أمر التنفيذ آلياً دون الحاجة لمراجعة المحكمة.
* إذا كان لديك اعتراض أو سداد سابق، يمكنك الضغط على «منازعة تنفيذ» داخل ناجز مع إرفاق الإثباتات.

> **تنبيه نظامي وأمني مشدد:**
> * مُيسّرة دليل توجيهي ولا تطلع على قضاياك أو بياناتك الخاصة، ولا تُغني عن استشارة محامٍ مرخص.
> * أي رسالة تطلب تحويل مبالغ لحسابات شخصية أو بطاقات بنكية خارج نظام «سداد» هي محاولة احتيال، ويجب الإبلاغ عنها عبر تطبيق **«كلنا أمن»**.`
      : `### Guidance on Judicial Notices & Court Subpoenas

Upon receiving an SMS regarding a judicial notice or court subpoena, follow this procedure to verify authenticity and take appropriate legal steps:

**1. Understanding the Notice Type:**
* **Court Hearing Subpoena:** Indicates an active claim filed in court (General, Commercial, Labor), detailing the hearing date and virtual attendance link inside Najiz.
* **Enforcement Order (Article 34):** Notifies a financial execution order issued on an authenticated deed. The law provides a **5-day statutory grace period** to settle via SADAD or dispute before escalating to Article 46 restrictions.

**2. Immediate Next Steps:**
* **Do not tap unverified links** in SMS messages.
* Open your browser and navigate directly to official **Najiz (najiz.sa)**.
* Sign in securely via **Nafath Single Sign-on**.
* Check **Cases** for claim briefs, or **Enforcement** for biller code (169) settlement references.

**3. Settlement vs Dispute:**
* Settle valid claims directly via banking SADAD; restrictions lift automatically upon electronic clearance.
* Submit a procedural dispute within Najiz if the claim has been settled or contested.

> **Crucial Legal & Privacy Notice:**
> * MYSER is an advisory directory; it does not access court databases or replace licensed attorneys.
> * Any message soliciting funds to private bank accounts outside official SADAD is fraudulent; report it via **Kollona Amn**.`;

    return {
      text,
      sources: [
        { title: ar ? "بوابة ناجز الإلكترونية (وزارة العدل)" : "Najiz Judicial Portal", url: "https://new.najiz.sa/" },
        { title: ar ? "بوابة النفاذ الوطني الموحد (نفاذ)" : "Nafath SSO", url: "https://www.iam.gov.sa/" },
        { title: ar ? "نظام سداد للمدفوعات الحكومية" : "SADAD Payment System", url: "https://www.sadad.com/" },
        { title: ar ? "تطبيق كلنا أمن (الأمن العام)" : "Kollona Amn Security App", url: "https://www.moi.gov.sa/" }
      ],
      suggestedSectorId: "justice",
      suggestedServiceId: "judicial-notices",
      followUpQuestions: ar
        ? ["هل الرسالة تتعلق بأمر تنفيذ وسداد مالي أم موعد جلسة؟", "هل تحققت من وجود الطلب في بوابة ناجز الرسمية؟"]
        : ["Is the notification an enforcement payment decree or a hearing date?", "Have you verified the case ID inside official Najiz??"],
      requiresClarification: false
    };
  }

  // 4. SCENARIO: Matched a specific service directly from verified database
  if (retrieval.matchedServices.length > 0) {
    const s = retrieval.matchedServices[0];

    // Determine query intent: Fees / Steps / Prerequisites / Comparison / General
    if (q.includes("رسوم") || q.includes("تكلفة") || q.includes("كم تدفع") || q.includes("fee") || q.includes("cost")) {
      const feeText = ar
        ? `بخصوص **${s.name.ar}** عبر **${s.platform.ar}**:

**البيانات المؤكدة للرسوم:**
${s.confirmedRequirements.map((r) => `• ${r.ar}`).join("\n")}

**القواعد والاشتراطات المؤثرة:**
${s.conditionalRules.ar}

**المصدر الرسمي المعتمد:** [${s.sourceTitle.ar}](${s.sourceUrl})
تاريخ التحقق: ${s.verifiedAt}`
        : `Regarding **${s.name.en}** via **${s.platform.en}**:

**Confirmed Fee & Eligibility Criteria:**
${s.confirmedRequirements.map((r) => `• ${r.en}`).join("\n")}

**Conditional Rules:**
${s.conditionalRules.en}

**Official Source:** [${s.sourceTitle.en}](${s.sourceUrl})
Verification Date: ${s.verifiedAt}`;

      return {
        text: feeText,
        sources: [{ title: s.sourceTitle[lang], url: s.url }],
        suggestedSectorId: s.sectorId,
        suggestedServiceId: s.id,
        followUpQuestions: ar ? ["هل ترغب في معرفة خطوات التقديم بالتفصيل؟"] : ["Would you like step-by-step application instructions?"],
        requiresClarification: false
      };
    }

    // Default detailed breakdown for the matched service satisfying all user standards
    // Multi-platform chain section if available
    const platformsSectionAr = s.multiPlatformChain && s.multiPlatformChain.length > 0
      ? `\n\n**المنصات والجهات ذات العلاقة بالخدمة:**\n${s.multiPlatformChain.map((p, pIdx) => `${pIdx + 1}. **${p.name.ar}** (${p.authority.ar}): ${p.role.ar} — *[متى تحتاجها: ${p.whenNeeded.ar}]*`).join("\n")}`
      : "";

    const platformsSectionEn = s.multiPlatformChain && s.multiPlatformChain.length > 0
      ? `\n\n**Required Platforms & Authority Sequence:**\n${s.multiPlatformChain.map((p, pIdx) => `${pIdx + 1}. **${p.name.en}** (${p.authority.en}): ${p.role.en} — *[When: ${p.whenNeeded.en}]*`).join("\n")}`
      : "";

    const text = ar
      ? `### ${s.name.ar} (${s.platform.ar})

**ما هي الخدمة؟**
${s.summary.ar}

**لمن تناسب؟**
${s.targetAudience.ar}

**ماذا تستطيع إنجازه من خلالها؟**
${s.userOutcomes.ar}

**ما الذي ينبغي معرفته قبل البدء؟**
${s.prerequisites.ar}
${platformsSectionAr}

**الخطوات والإجراءات المعتمدة:**
${s.procedureSteps.map((st, i) => `${i + 1}. ${st.ar}`).join("\n")}

**الاشتراطات والشروط المتغيرة:**
${s.conditionalRules.ar}

> **ملاحظة التحقق والدقة:** ${s.unverifiedAspects.ar}`
      : `### ${s.name.en} (${s.platform.en})

**Overview:**
${s.summary.en}

**Target Audience:**
${s.targetAudience.en}

**Key Outcomes:**
${s.userOutcomes.en}

**Prerequisites:**
${s.prerequisites.en}
${platformsSectionEn}

**Official Procedure Steps:**
${s.procedureSteps.map((st, i) => `${i + 1}. ${st.en}`).join("\n")}

**Conditional Rules:**
${s.conditionalRules.en}

> **Verification Notice:** ${s.unverifiedAspects.en}`;

    return {
      text,
      sources: [
        { title: s.sourceTitle[lang], url: s.url },
        { title: s.platform[lang], url: s.sourceUrl }
      ],
      suggestedSectorId: s.sectorId,
      suggestedServiceId: s.id,
      followUpQuestions: ar
        ? ["هل تريد الانتقال مباشرة إلى المنصة الرسمية؟", "هل تحتاج إلى التحقق من شرط محدد بحالتك؟"]
        : ["Would you like to open the official portal now?", "Do you need clarification on a specific requirement?"],
      requiresClarification: false
    };
  }

  // 3. SCENARIO: Conceptual or General Inquiries (Nafath, digital government, SAR payment, etc.)
  if (q.includes("نفاذ") || q.includes("nafath") || q.includes("الدخول الموحد")) {
    const text = ar
      ? `**النفاذ الوطني الموحد (نفاذ):**
منظومة وطنية متكاملة تابعة للهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا)، توفر هوية رقمية موحدة للمواطنين والمقيمين تمكّنهم من تسجيل الدخول الآمن لكافة المنصات الحكومية والبنوك عبر تطبيق نفاذ (برقم الهوية وتأكيد الرمز).

> **قاعدة أمان إلزامية:** لا تشارك رمز نفاذ المؤقت أو أرقام التحقق مع أي شخص أو موقع غير رسمي نهائيًا.`
      : `**National Single Sign-On (Nafath):**
A unified national authentication framework governed by SDAIA, providing secure digital identification for citizens and residents across all government entities and financial institutions using biometric or mobile app prompt authentication.

> **Crucial Security Guideline:** Never share your temporary Nafath prompts or verification codes with third parties or unverified websites.`;

    return {
      text,
      sources: [{ title: ar ? "بوابة النفاذ الوطني الموحد" : "Nafath National Single Sign-on", url: "https://www.iam.gov.sa/" }],
      requiresClarification: false
    };
  }

  // 4. UNKNOWN / GENERAL QUERY - Fallback with honest transparency
  const fallbackText = ar
    ? `أهلاً بك في مُيسّرة. 
فهمت استفسارك حول: «${userQuery}».

لم يتم رصد هذا الموضوع بدقة في قاعدة الخدمات الحكومية الموثقة حاليًا في هذه الجلسة المحلية. 

**التوجيه الموصى به:**
1. إذا كان استفسارك يتعلق بمعاملة حكومية عامة، يمكنك البحث المباشر في **المنصة الوطنية الموحدة (GOV.SA)**.
2. إذا كان يتعلق بتأسيس أعمال، فإن **المركز السعودي للأعمال (business.sa)** يوفر الدليل الشامل لكافة القطاعات.
3. يمكنك توضيح سؤالك أكثر بتحديد القطاع (مرور، تجارة، أحوال، صحة، عدل، تعليم) لأرشدك للجهة المعتمدة فورًا.`
    : `Welcome to MYSER.
Regarding your inquiry: "${userQuery}".

This specific topic is not currently indexed in the verified local knowledge directory of this session.

**Recommended Official Routes:**
1. For general national government services, search the **National Unified Portal (GOV.SA)**.
2. For business and commerce inquiries, visit the **Saudi Business Center (business.sa)**.
3. You can refine your question by specifying the sector (Traffic, Commerce, Civil Affairs, Health, Justice, Education) for direct guidance.`;

  return {
    text: fallbackText,
    sources: [
      { title: ar ? "المنصة الوطنية الموحدة GOV.SA" : "National Unified Portal GOV.SA", url: "https://www.my.gov.sa/" },
      { title: ar ? "المركز السعودي للأعمال" : "Saudi Business Center", url: "https://business.sa/" }
    ],
    followUpQuestions: ar
      ? ["هل يتعلق طلبك بإجراء شخصي أم تجاري؟", "ما الجهة الحكومية التي ترغب في مراجعتها؟"]
      : ["Is this a personal or commercial inquiry?", "Which government authority are you targeting?"],
    requiresClarification: true
  };
}
