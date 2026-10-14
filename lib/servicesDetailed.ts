export type Localized = { ar: string; en: string };

export type PlatformRole = {
  name: Localized;
  authority: Localized;
  role: Localized;
  whenNeeded: Localized;
  url: string;
};

export type CuratedServiceDetailed = {
  id: string;
  sectorId: string;
  name: Localized;
  platform: Localized;
  summary: Localized;
  when: Localized;
  targetAudience: Localized; // لمن تناسب؟
  userOutcomes: Localized; // ماذا يستطيع المستخدم إنجازه؟
  prerequisites: Localized; // ما يحتاج إلى معرفته قبل البدء؟
  confirmedRequirements: Localized[]; // المتطلبات المؤكدة
  procedureSteps: Localized[]; // الخطوات التي ينبغي اتباعها
  conditionalRules: Localized; // الشروط التي تختلف باختلاف حالة المستفيد
  unverifiedAspects: Localized; // ما لم يتسنَّ التحقق منه بدقة أو يتغير دوريًا
  url: string;
  sourceTitle: Localized;
  sourceUrl: string;
  verifiedAt: string;
  verified: "verified" | "destination-limited";
  note: Localized;
  requiredAuthorities?: Localized[]; // كافة الجهات الحكومية والجهات ذات العلاقة
  multiPlatformChain?: PlatformRole[]; // سلسلة المنصات الرسمية بالتفصيل
};

export const detailedServices: CuratedServiceDetailed[] = [
  {
    id: "civil-appointments",
    sectorId: "civil",
    name: { ar: "مواعيد الأحوال المدنية", en: "Civil Affairs appointments" },
    platform: { ar: "أبشر أفراد", en: "Absher Individuals" },
    summary: {
      ar: "حجز موعد مسبق لمراجعة فروع الأحوال المدنية لإجراء المعاملات التي تتطلب حضورًا شخصيًا كإصدار الهوية الوطنية أو تجديدها أو تسجيل الواقعات.",
      en: "Booking advance appointments to visit Civil Affairs offices for transactions requiring in-person attendance, such as National ID issuance or civil registry events."
    },
    when: {
      ar: "عند الرغبة في إنجاز معاملة أحوال مدنية لا تتوفر بالكامل إلكترونيًا (مثل إصدار أول هوية لمن بلغ 15 عامًا أو تسليم مستندات معينة).",
      en: "When you need a Civil Affairs transaction not fully available online (e.g. first-time ID issuance for 15-year-olds or submitting specific documents)."
    },
    targetAudience: {
      ar: "المواطنون السعوديون والمقيمون المسجلون ولديهم حساب مفعل في منصة أبشر.",
      en: "Saudi citizens and registered residents holding an activated Absher account."
    },
    userOutcomes: {
      ar: "اختيار الفرع الأقرب، حجز التاريخ والوقت المناسبين، طباعة تذكرة الموعد، وتعديل الموعد أو إلغاؤه إلكترونيًا.",
      en: "Selecting the nearest branch, choosing a convenient date and time, printing the appointment slip, and modifying or canceling bookings online."
    },
    prerequisites: {
      ar: "معرفة متطلبات المعاملة المحددة مسبقًا وتجهيز الوثائق الأصلية والصور الشخصية المطلوبة وفق اشتراطات الأحوال.",
      en: "Checking specific transaction requirements beforehand and preparing original documents and compliant photographs."
    },
    confirmedRequirements: [
      { ar: "حساب مفعل في منصة أبشر (أفراد).", en: "Active account on Absher (Individuals)." },
      { ar: "تحديد الخدمة والمنطقة والفرع بدقة قبل تأكيد الحجز.", en: "Selecting service, region, and branch accurately prior to confirmation." },
      { ar: "إحضار الوثائق الأصلية الداعمة بحسب الخدمة (شهادة ميلاد، سجل أسرة، أو هوية سابقة).", en: "Bringing original supporting documents depending on the service." }
    ],
    procedureSteps: [
      { ar: "تسجيل الدخول في منصة أبشر أفراد.", en: "Log in to Absher Individuals platform." },
      { ar: "الانتقال إلى قائمة «مواعيد» ثم اختيار «الأحوال المدنية».", en: "Navigate to 'Appointments' and select 'Civil Affairs'." },
      { ar: "اختيار الخدمة المطلوبة، وتحديد المنطقة والفرع، ثم اختيار التاريخ والوقت.", en: "Select the service, determine region and branch, then choose date and time slot." },
      { ar: "تأكيد الموعد والاحتفاظ بتذكرة الحجز (ورقيًا أو رقميًا) لإبرازها عند الزيارة.", en: "Confirm the booking and retain the ticket (digital or printed) to present upon arrival." }
    ],
    conditionalRules: {
      ar: "تختلف المتطلبات والشروط بحسب المعاملة (إصدار جديد، تجديد، بدل تالف/فاقد، أو تسجيل واقعة مدنية)، كما تخضع أوقات الفروع للجدول المتاح لكل مكتب.",
      en: "Requirements vary according to transaction type (new issue, renewal, replacement for lost/damaged ID), and office hours depend on regional scheduling."
    },
    unverifiedAspects: {
      ar: "مواعيد الإتاحة الفورية قد تختلف من فرع لآخر في المدن الكبرى بحسب كثافة المراجعين ولا يمكن رصدها آليًا خارج بوابة أبشر.",
      en: "Immediate appointment availability varies across branches and metropolitan areas and cannot be automated outside Absher."
    },
    url: "https://www.absher.sa/",
    sourceTitle: { ar: "دليل خدمات أبشر للأفراد - قطاع الأحوال المدنية", en: "Absher Individuals Service Guide - Civil Affairs" },
    sourceUrl: "https://www.absher.sa/",
    verifiedAt: "2026-10-11",
    verified: "destination-limited",
    note: {
      ar: "الرابط يفتح بوابة أبشر الموحدة؛ يتم الدخول لخدمة المواعيد من خلال حساب المستفيد.",
      en: "The URL opens the unified Absher portal; access the appointment service through user authentication."
    },
    requiredAuthorities: [
      { ar: "وزارة الداخلية (وكالة الأحوال المدنية)", en: "Ministry of Interior (Civil Affairs Agency)" },
      { ar: "الهيئة السعودية للبيانات والذكاء الاصطناعي (نفاذ)", en: "SDAIA (Nafath SSO)" },
      { ar: "مؤسسة البريد السعودي (سبل)", en: "Saudi Post (SPL)" }
    ],
    multiPlatformChain: [
      {
        name: { ar: "منصة أبشر أفراد", en: "Absher Individuals" },
        authority: { ar: "وكالة الأحوال المدنية / وزارة الداخلية", en: "Civil Affairs / Ministry of Interior" },
        role: { ar: "حجز وتأكيد الموعد المسبق، وتحديد الفرع والخدمة، وإصدار تذكرة الحجز.", en: "Booking advance appointments, selecting branch/service, and issuing confirmation slip." },
        whenNeeded: { ar: "الخطوة الأساسية الأولى لحجز الموعد أو تجديد الهوية الوطنية إلكترونياً.", en: "Primary required step for appointment reservation or digital ID renewal." },
        url: "https://www.absher.sa/"
      },
      {
        name: { ar: "النفاذ الوطني الموحد (نفاذ)", en: "Nafath SSO" },
        authority: { ar: "سدايا (SDAIA)", en: "SDAIA" },
        role: { ar: "تسجيل الدخول والتحقق البيومتري من الهوية دون الحاجة لكلمة مرور.", en: "Biometric authentication and secure single sign-on without manual passwords." },
        whenNeeded: { ar: "لتوثيق الدخول إلى منصة أبشر ومراجعة بيانات السجل المدني.", en: "For authenticating access to Absher and verifying civil status profile." },
        url: "https://www.iam.gov.sa/"
      },
      {
        name: { ar: "البريد السعودي (سبل)", en: "Saudi Post (SPL)" },
        authority: { ar: "مؤسسة البريد السعودي", en: "Saudi Post" },
        role: { ar: "توصيل بطاقة الهوية الوطنية أو سجل الأسرة المجدد إلى العنوان الوطني للمستفيد.", en: "Delivering renewed National ID or Family Register to the registered National Address." },
        whenNeeded: { ar: "عند تجديد الهوية إلكترونياً أو طلب إيصال الوثائق الرسمية للمنزل دون مراجعة الفرع.", en: "When renewing ID online and opting for postal home delivery instead of branch pickup." },
        url: "https://splonline.com.sa/"
      }
    ]
  },
  {
    id: "license-renewal",
    sectorId: "traffic",
    name: { ar: "تجديد رخصة القيادة", en: "Driving license renewal" },
    platform: { ar: "أبشر أفراد", en: "Absher Individuals" },
    summary: {
      ar: "خدمة إلكترونية فورية تتيح لقائدي المركبات تجديد رخصة القيادة (خاصة أو دراجة نارية) وطلب إيصالها عبر البريد السعودي سبل.",
      en: "Instant electronic service enabling drivers to renew their driving license (private or motorcycle) with home delivery via Saudi Post SPL."
    },
    when: {
      ar: "عند اقتراب انتهاء صلاحية رخصة القيادة (خلال 180 يوماً قبل الانتهاء) أو بعد انتهائها.",
      en: "When the driving license is close to expiring (within 180 days prior to expiry) or after it has expired."
    },
    targetAudience: {
      ar: "المواطنون والمقيمون الحاصلون على رخصة قيادة سعودية مسجلة ونافذة الفحص الطبي.",
      en: "Saudi citizens and residents holding an active Saudi driving license with a valid medical examination."
    },
    userOutcomes: {
      ar: "تجديد صلاحية الرخصة لمدة 2 أو 5 أو 10 سنوات، وسداد الرسوم المقررة، وتحديث البيانات في تطبيق توكلنا ورخصة القيادة الرقمية فورًا.",
      en: "Renewing license validity for 2, 5, or 10 years, settling traffic dues, and updating digital license records in Tawakkalna instantly."
    },
    prerequisites: {
      ar: "إجراء الفحص الطبي في مركز معتمد ومربوط إلكترونيًا بمنصة إفادة، وسداد المخالفات المرورية المسجلة إن وجدت.",
      en: "Completing medical screening at an approved center linked to Efada, and clearing any outstanding traffic violations."
    },
    confirmedRequirements: [
      { ar: "سداد رسوم تجديد الرخصة (بحسب المدة: سنتان 80 ريال، 5 سنوات 200 ريال، 10 سنوات 400 ريال).", en: "Payment of renewal fees (SAR 80 for 2 yrs, SAR 200 for 5 yrs, SAR 400 for 10 yrs)." },
      { ar: "سداد المخالفات المرورية المترتبة على السجل المدني.", en: "Settling any registered traffic violations." },
      { ar: "اجتياز الفحص الطبي بنجاح في مركز صحي معتمد مربوط بـ «إفادة».", en: "Passing medical examination at an accredited facility linked with Efada." },
      { ar: "أن تكون المدة المتبقية في الرخصة أقل من 180 يومًا.", en: "Remaining validity must be less than 180 days." }
    ],
    procedureSteps: [
      { ar: "إجراء الفحص الطبي المعتمد والتأكد من وصول النتيجة إلى نظام المرور.", en: "Undergo medical exam and ensure electronic result transmission to Traffic Directorate." },
      { ar: "سداد رسوم التجديد عبر خدمة سداد في الحساب البنكي.", en: "Pay renewal fee via SADAD on banking portal." },
      { ar: "تسجيل الدخول في أبشر أفراد، واختيار «خدماتي» $\\leftarrow$ «المرور» $\\leftarrow$ «تجديد رخصة القيادة».", en: "Log in to Absher, navigate to My Services $\\rightarrow$ Traffic $\\rightarrow$ Renew Driving License." },
      { ar: "اختيار مدة التجديد المطلوبة وتأكيد العنوان الوطني لإيصال الوثيقة.", en: "Select desired renewal period and confirm National Address for postal delivery." }
    ],
    conditionalRules: {
      ar: "تطبق غرامة تأخير قدرها 100 ريال عن كل سنة بعد مضي 60 يومًا من تاريخ انتهاء صلاحية الرخصة دون تجديد.",
      en: "A late penalty of SAR 100 per year applies if renewal is delayed beyond 60 days from expiration date."
    },
    unverifiedAspects: {
      ar: "شروط الرخص المهنية ورخص قيادة المعدات الثقيلة تخضع لاشتراطات فحص وتدريب إضافية تختلف عن الرخص الخصوصية.",
      en: "Heavy equipment and commercial transport licenses are governed by specialized professional screening different from private licenses."
    },
    url: "https://www.absher.sa/",
    sourceTitle: { ar: "دليل أبشر: تجديد رخصة القيادة إلكترونيًا", en: "Absher Guide: Online Driving License Renewal" },
    sourceUrl: "https://www.absher.sa/",
    verifiedAt: "2026-10-11",
    verified: "verified",
    note: {
      ar: "الرخصة الرقمية متاحة فوراً في تطبيقي «أبشر أفراد» و«توكلنا» دون انتظار استلام البطاقة المطبوعة.",
      en: "The digital driving license is instantly available in Absher Individuals and Tawakkalna without waiting for postal delivery."
    },
    requiredAuthorities: [
      { ar: "وزارة الداخلية (الإدارة العامة للمرور)", en: "Ministry of Interior (General Directorate of Traffic)" },
      { ar: "وزارة الصحة (المراكز الطبية المعتمدة / منصة إفادة)", en: "Ministry of Health (Accredited Clinics / Efada)" },
      { ar: "البنك المركزي السعودي (نظام سداد للمدفوعات)", en: "Saudi Central Bank (SADAD Payment System)" },
      { ar: "الهيئة السعودية للبيانات والذكاء الاصطناعي (توكلنا)", en: "SDAIA (Tawakkalna App)" },
      { ar: "مؤسسة البريد السعودي (سبل)", en: "Saudi Post (SPL)" }
    ],
    multiPlatformChain: [
      {
        name: { ar: "منصة إفادة / المراكز الطبية", en: "Efada / Health Clinics" },
        authority: { ar: "وزارة الصحة", en: "Ministry of Health" },
        role: { ar: "إجراء الفحص الطبي لرخصة القيادة وربطه إلكترونيًا فورًا بأنظمة المرور.", en: "Medical exam completion and electronic dispatch to traffic systems." },
        whenNeeded: { ar: "قبل التجديد؛ الفحص شرط إلزامي لقبول الطلب في أبشر.", en: "Pre-renewal mandatory medical clearance requirement." },
        url: "https://www.moh.gov.sa/"
      },
      {
        name: { ar: "نظام سداد للمدفوعات", en: "SADAD Payment System" },
        authority: { ar: "البنوك السعودية المعتمدة", en: "Saudi Commercial Banks" },
        role: { ar: "سداد رسوم رخصة القيادة والمخالفات المسجلة عبر تطبيق بنكك.", en: "Settling renewal fees and any outstanding traffic fines." },
        whenNeeded: { ar: "قبل إرسال الطلب في أبشر؛ لا يُعالج التجديد دون سداد مسبق.", en: "Prior to Absher application; payments must clear first." },
        url: "https://www.sadad.com/"
      },
      {
        name: { ar: "منصة أبشر (أفراد)", en: "Absher Individuals" },
        authority: { ar: "الإدارة العامة للمرور", en: "Traffic Directorate" },
        role: { ar: "تقديم طلب التجديد الإلكتروني، واختيار المدة، وتحديد عنوان التوصيل.", en: "Submitting electronic renewal, tenure selection, delivery address." },
        whenNeeded: { ar: "المنصة الرئيسية لإتمام عملية التجديد واعتمادها رسمياً.", en: "The primary portal for concluding the legal renewal." },
        url: "https://www.absher.sa/"
      },
      {
        name: { ar: "منظومة توكلنا", en: "Tawakkalna" },
        authority: { ar: "سدايا (SDAIA)", en: "SDAIA" },
        role: { ar: "استعراض الهوية والرخصة الرقمية فور التجديد دون انتظار البطاقة البلاستيكية.", en: "Instant access to digital driving license without waiting for physical card." },
        whenNeeded: { ar: "لإثبات رخصة القيادة رقمياً لدى رجال الأمن فور التجديد.", en: "For instant official digital driving credential presentation." },
        url: "https://tawakkalna.sdaia.gov.sa/"
      },
      {
        name: { ar: "البريد السعودي (سبل)", en: "Saudi Post (SPL)" },
        authority: { ar: "مؤسسة البريد السعودي", en: "Saudi Post Authority" },
        role: { ar: "طباعة وشحن وثيقة رخصة القيادة إلى عنوانك الوطني المسجل.", en: "Printing and physical license delivery to your registered National Address." },
        whenNeeded: { ar: "في حال رغبت باستلام بطاقة الرخصة البلاستيكية مطبوعة.", en: "Optional if physical plastic card delivery is requested." },
        url: "https://splonline.com.sa/"
      }
    ]
  },
  {
    id: "traffic-violations",
    sectorId: "traffic",
    name: { ar: "الاستعلام عن المخالفات المرورية والاعتراض عليها", en: "Traffic violation inquiry & dispute" },
    platform: { ar: "منصة إيفاء / أبشر", en: "Efaa / Absher" },
    summary: {
      ar: "خدمة تمكّن الأفراد والمنشآت من الاستعلام عن تفاصيل المخالفات المرورية المسجلة وموقع وتوقيت رصدها وتقديم الاعتراض النظامي خلال المدة المحددة.",
      en: "Enables individuals and businesses to inquire about traffic violation records, capture location/time, and submit formal disputes within legal timeframes."
    },
    when: {
      ar: "عند ورود إشعار بمخالفة مرورية، أو الرغبة في التأكد من خلو السجل قبل إتمام أي معاملة حكومية.",
      en: "Upon receiving a violation notification, or checking record clearance prior to official transactions."
    },
    targetAudience: {
      ar: "مالكو المركبات وسائقوها من مواطنين ومقيمين وزوار ومنشآت تجارية.",
      en: "Vehicle owners and drivers including citizens, residents, visitors, and commercial entities."
    },
    userOutcomes: {
      ar: "استعراض رقم المخالفة وتفاصيل الرصد وموقعها وصورتها إن توفرت، وسدادها أو تقديم اعتراض إلكتروني في حال وجود خطأ في الرصد.",
      en: "Viewing violation ID, capture photo/details, making electronic payments, or lodging disputes for erroneous citations."
    },
    prerequisites: {
      ar: "رقم الهوية الوطنية أو رقم الإقامة ورقم لوحة المركبة أو رقم المخالفة.",
      en: "National ID / Iqama number, vehicle plate number, or violation reference number."
    },
    confirmedRequirements: [
      { ar: "أن يُقدَّم الاعتراض خلال 30 يومًا من تاريخ تسجيل المخالفة.", en: "Dispute must be filed within 30 days of citation recording date." },
      { ar: "ألا يكون قد تم سداد المخالفة قبل تقديم الاعتراض.", en: "Violation must not have already been paid prior to disputing." },
      { ar: "الحد الأقصى للاعتراضات المرفوضة آليًا لا يتجاوز 5 اعتراضات لكل سنة هجرية.", en: "Maximum limit of 5 rejected disputes per Hijri year before restriction." }
    ],
    procedureSteps: [
      { ar: "الدخول لمنصة إيفاء الوطنية للمخالفات أو أبشر أفراد.", en: "Access the National Violations Platform (Efaa) or Absher Individuals." },
      { ar: "اختيار الاستعلام برقم الهوية أو المخالفة للاطلاع على بيان المخالفات.", en: "Inquire by ID or violation number to review citation details." },
      { ar: "في حال الرغبة بالاعتراض، الدخول عبر النفاذ الوطني واختيار «الاعتراض على مخالفة».", en: "If disputing, log in via Nafath and select 'Dispute Traffic Violation'." },
      { ar: "إرفاق المبررات وإرسال الطلب للمراجعة من قبل اللجان المختصة في المرور.", en: "Attach reasoning/evidence and submit request to Traffic Review Committee." }
    ],
    conditionalRules: {
      ar: "تخفيض سداد المخالفات بنسبة معينة يخضع لقرارات العفو والتخفيض الملكية المعلنة وفترات سريانها المحددة نظامًا.",
      en: "Violation payment reductions depend on official royal amnesty directives and their specified statutory application periods."
    },
    unverifiedAspects: {
      ar: "سرعة البت في الاعتراض تخضع لحجم المراجعات لدى لجان الفصل التابعة للإدارة العامة للمرور في المنطقة.",
      en: "Dispute decision processing times vary depending on case volume at regional traffic adjudication committees."
    },
    url: "https://efaa.sa/",
    sourceTitle: { ar: "المنصة الوطنية للمخالفات (إيفاء) / أبشر", en: "National Violations Platform (Efaa) / Absher" },
    sourceUrl: "https://efaa.sa/",
    verifiedAt: "2026-10-11",
    verified: "verified",
    note: {
      ar: "لا تدخل أي أرقام بطاقات بنكية أو بيانات دخول نفاذ خارج البوابة الحكومية الموثوقة.",
      en: "Never enter payment card details or Nafath credentials outside certified governmental portals."
    },
    requiredAuthorities: [
      { ar: "مركز المعلومات الوطني (منصة إيفاء الوطنية)", en: "National Information Center (Efaa Platform)" },
      { ar: "وزارة الداخلية (الإدارة العامة للمرور)", en: "Ministry of Interior (Traffic Directorate)" },
      { ar: "البنك المركزي السعودي (نظام سداد للمدفوعات الحكومية)", en: "Saudi Central Bank (SADAD Payment)" },
      { ar: "الهيئة السعودية للبيانات والذكاء الاصطناعي (نفاذ)", en: "SDAIA (Nafath SSO)" }
    ],
    multiPlatformChain: [
      {
        name: { ar: "المنصة الوطنية للمخالفات (إيفاء)", en: "National Violations Platform (Efaa)" },
        authority: { ar: "مركز المعلومات الوطني / سدايا", en: "National Information Center / SDAIA" },
        role: { ar: "الاستعلام الشامل عن كافة المخالفات المسجلة من مختلف الجهات وسدادها الموحد.", en: "Comprehensive inquiry and payment of violations across all governmental entities." },
        whenNeeded: { ar: "للبحث السريع برقم الهوية أو المخالفة ومعرفة المخالفات الحكومية الشاملة.", en: "For immediate violation search by National ID or violation reference." },
        url: "https://efaa.sa/"
      },
      {
        name: { ar: "منصة أبشر أفراد", en: "Absher Individuals" },
        authority: { ar: "الإدارة العامة للمرور", en: "Traffic Directorate" },
        role: { ar: "عرض تفاصيل وموقع وصورة المخالفة المرورية، وتقديم الاعتراض النظامي خلال 30 يوماً.", en: "Viewing violation capture image/location and submitting legal dispute within 30 days." },
        whenNeeded: { ar: "عند الرغبة في الاعتراض على صحة المخالفة أو استعراض موقع الكاميرا.", en: "When contesting violation validity or examining camera capture details." },
        url: "https://www.absher.sa/"
      },
      {
        name: { ar: "نظام سداد / التطبيق البنكي", en: "SADAD / Online Banking" },
        authority: { ar: "البنوك السعودية المعتمدة", en: "Saudi Commercial Banks" },
        role: { ar: "سداد قيمة المخالفات برقم الهوية أو رقم المخالفة مع الاستفادة من مبادرات التخفيض المعتمدة.", en: "Settling fines via SADAD biller with automated deduction of any active amnesty discounts." },
        whenNeeded: { ar: "لتسديد الغرامة وتفادي ترتب غرامات تأخير أو إيقاف إجراءات المرور.", en: "To settle dues and prevent late charges or transaction holds." },
        url: "https://www.sadad.com/"
      }
    ]
  },
  {
    id: "traffic-accidents",
    sectorId: "traffic",
    name: { ar: "مباشرة الحوادث المرورية وتقدير الأضرار", en: "Traffic accident response & damage appraisal" },
    platform: { ar: "نجم / الإدارة العامة للمرور / تقدير", en: "Najm / General Traffic Dept / Taqddeer" },
    summary: {
      ar: "منظومة متكاملة لمباشرة الحوادث المرورية؛ تحدد متى يُطلب نجم ومتى يلزم تدخل المرور، مع مسار تقدير الأضرار ومطالبات التأمين.",
      en: "Comprehensive ecosystem for vehicle accident reporting; distinguishes Najm versus Traffic jurisdiction, damage appraisal, and claims."
    },
    when: {
      ar: "فور وقوع حادث مروري؛ لمعرفة الجهة الميدانية الواجب إبلاغها، وكيفية استخراج تقرير الحادث والتقدير والمطالبة التأمينية.",
      en: "Immediately upon a traffic accident; determining the responding authority, obtaining report, appraisal, and insurer compensation."
    },
    targetAudience: {
      ar: "قائدو المركبات، أصحاب وثائق التأمين، والمتضررون من الحوادث المرورية في كافة مناطق المملكة.",
      en: "Drivers, insured vehicle owners, and involved parties in vehicle collisions across Saudi Arabia."
    },
    userOutcomes: {
      ar: "تحديد الجهة المسؤولة فورًا، مباشرة الحادث وتوثيقه، الحصول على تقرير تحديد نسبة المسؤولية، حجز موعد تقدير أضرار المركبة، ومتابعة التعويض.",
      en: "Direct authority identification, collision documentation, liability assessment report, Taqddeer appraisal booking, and insurance compensation tracking."
    },
    prerequisites: {
      ar: "معرفة شروط مباشرة «نجم» (وجود تأمين ساري، عدم وجود وفيات أو إصابات جسيمة، عدم هروب الطرف الآخر، ووقوع الحادث في نطاق تغطية نجم).",
      en: "Checking Najm coverage rules (active insurance for at least one party, no fatalities/severe injuries, no hit-and-run, within Najm geography)."
    },
    confirmedRequirements: [
      { ar: "إذا وجد تأمين ساري + عدم وجود إصابات أو وفيات + عدم هروب: مباشرة الحادث عبر شركة «نجم» (هاتف 199033 أو تطبيق نجم).", en: "If valid insurance + zero injuries/deaths + no hit-and-run: report directly to Najm (199033 or app)." },
      { ar: "في حال وجود إصابات جسيمة، أو وفيات، أو هروب، أو طرف بدون تأمين خارج نطاق نجم، أو جناية: يجب إبلاغ «المرور» مباشرة (هاتف 993 أو 911).", en: "In cases of bodily injuries, fatalities, hit-and-run, or uncovered geography: dispatch Traffic Police (993 or 911) directly." },
      { ar: "بعد صدور تقرير الحادث، التوجه لمنظومة «تقدير» (taqdeer.sa) لتقييم أضرار المركبة إلكترونيًا.", en: "Post-report, access 'Taqddeer' (taqdeer.sa) for standardized vehicle damage valuation." },
      { ar: "رفع المطالبة التأمينية إلكترونيًا لشركة التأمين المعنية بموجب تقرير نجم وتقرير تقدير ورقم الآيبان البنكي.", en: "Submit compensation claim electronically to the liable insurer with accident slip, Taqddeer report, and IBAN." }
    ],
    procedureSteps: [
      { ar: "التحقق من سلامة الأطراف والاتصال بـ (997) للإسعاف عند أي إصابة.", en: "Ensure personal safety and call 997 (Ambulance) if any injuries exist." },
      { ar: "تحديد جهة المباشرة: فتح تطبيق نجم أو الاتصال بـ 199033 (إن انطبقت الشروط)، أو الاتصال بمرور الميدان 993/911.", en: "Determine authority: open Najm app / 199033 if conditions met, or call Moroor 993/911." },
      { ar: "استلام إشعار تقرير الحادث ونسبة الإدانة إلكترونيًا عبر رسالة نصية.", en: "Receive electronic accident report and liability percentage notification via SMS." },
      { ar: "حجز موعد في أحد مراكز منظومة «تقدير» لتقييم الأضرار وإصدار تسعيرة القطاعات والإصلاح.", en: "Book appointment at a Taqddeer center for damage valuation and repair quote issuance." },
      { ar: "تقديم المطالبة لشركة تأمين الطرف المتسبب عبر بوابتها الإلكترونية وإيداع مبلغ التعويض في حسابك البنكي.", en: "Lodge electronic claim to the responsible party's insurer for bank account compensation settlement." }
    ],
    conditionalRules: {
      ar: "إذا كان الطرف المتسبب لا يحمل وثيقة تأمين سارية، يتم تحويل أوراق الحادث من نجم إلى شعبة السير بمرور المنطقة لإلزام المتسبب بالسداد أو إحالته للمحكمة المرورية عبر ناجز.",
      en: "If the liable party lacks valid insurance, case files route to Traffic Dept to enforce restitution or refer to Traffic Court via Najiz."
    },
    unverifiedAspects: {
      ar: "مهلة صرف التعويض التأميني ملزمة نظامًا بـ 15 يومًا من استكمال المستندات وفق لوائح هيئة التأمين، وتختلف فترات الفحص بورش الإصلاح حسب المنطقة.",
      en: "Insurance payout deadline is mandated at 15 business days upon full submission under Insurance Authority rules."
    },
    url: "https://www.najm.sa/",
    sourceTitle: { ar: "شركة نجم لخدمات التأمين / منظومة تقدير", en: "Najm Insurance Services / Taqddeer System" },
    sourceUrl: "https://www.najm.sa/",
    verifiedAt: "2026-10-11",
    verified: "verified",
    note: {
      ar: "مَعبر دليل استرشادي؛ لا يحل محل الاتصال الفوري بالطوارئ (911 / 993 / 199033) عند وقوع الحادث.",
      en: "MAABAR is an advisory directory; always call emergency lines (911 / 993 / 199033) immediately at accident scenes."
    },
    requiredAuthorities: [
      { ar: "شركة نجم لخدمات التأمين", en: "Najm Insurance Services" },
      { ar: "وزارة الداخلية (الإدارة العامة للمرور)", en: "Ministry of Interior (Traffic Directorate)" },
      { ar: "الهيئة السعودية للمقيمين المعتمدين (منظومة تقدير)", en: "Saudi Authority for Accredited Valuers (Taqddeer)" },
      { ar: "هيئة التأمين / شركات التأمين المعتمدة", en: "Insurance Authority / Licensed Insurers" },
      { ar: "وزارة العدل (المحاكم المرورية عبر ناجز عند الخلاف)", en: "Ministry of Justice (Traffic Courts via Najiz for disputes)" }
    ],
    multiPlatformChain: [
      {
        name: { ar: "شركة نجم لخدمات التأمين", en: "Najm Insurance Services" },
        authority: { ar: "شركة نجم / هيئة التأمين", en: "Najm / Insurance Authority" },
        role: { ar: "مباشرة الحادث ميدانياً، تصوير الواقعة، وإصدار تقرير الحادث الإلكتروني ونسب المسؤولية.", en: "On-site accident dispatch, scene photography, and digital liability report issuance." },
        whenNeeded: { ar: "عند وجود تأمين ساري لطرف واحد على الأقل، وعدم وجود وفيات أو إصابات جسيمة أو هروب، وداخل التغطية.", en: "When valid insurance exists, no fatalities/severe injuries, and inside coverage zone." },
        url: "https://www.najm.sa/"
      },
      {
        name: { ar: "الإدارة العامة للمرور (993 / 911)", en: "Traffic Directorate (993 / 911)" },
        authority: { ar: "وزارة الداخلية", en: "Ministry of Interior" },
        role: { ar: "مباشرة الحوادث التي تشمل إصابات جسيمة أو وفيات أو هروب طرف أو عدم وجود تأمين خارج نطاق نجم.", en: "Responding to accidents involving bodily harm, fatalities, hit-and-run, or uninsured parties outside Najm." },
        whenNeeded: { ar: "إلزامية فوراً في الحالات الجنائية والإصابات وخلافات الميدان وعدم شمولية نجم.", en: "Mandatory immediately for criminal, injury, or non-Najm qualified collisions." },
        url: "https://www.absher.sa/"
      },
      {
        name: { ar: "منظومة تقدير (Taqddeer)", en: "Taqddeer Ecosystem" },
        authority: { ar: "الهيئة السعودية للمقيمين المعتمدين (تقييم)", en: "Taqeem (Accredited Valuers Authority)" },
        role: { ar: "فحص أضرار المركبة، تسعير قطع الغيار وأجور اليد، وإرسال التقرير المالي المعتمد لشركات التأمين.", en: "Inspecting vehicle damage, pricing parts/labor, and binding digital valuation report." },
        whenNeeded: { ar: "بعد صدور تقرير نجم أو المرور، لتقييم قيمة التعويض المالي قبل مراجعة شركة التأمين.", en: "Post accident report, for financial valuation before lodging insurance claims." },
        url: "https://taqdeer.sa/"
      },
      {
        name: { ar: "بوابة شركة التأمين الإلكترونية", en: "Insurer Electronic Claims Portal" },
        authority: { ar: "شركات التأمين المرخصة من هيئة التأمين", en: "Licensed Motor Insurers" },
        role: { ar: "استقبال مطالبة التعويض برقم تقرير نجم وتقدير، وتحويل المبلغ للآيبان البنكي للمتضرر.", en: "Receiving indemnity claim using report IDs and disbursing funds to recipient IBAN." },
        whenNeeded: { ar: "الخطوة النهائية للحصول على التعويض المالي للأضرار.", en: "Final recovery phase for damage reimbursement." },
        url: "https://www.ia.gov.sa/"
      },
      {
        name: { ar: "بوابة ناجز (المحاكم المرورية)", en: "Najiz Traffic Litigation" },
        authority: { ar: "وزارة العدل", en: "Ministry of Justice" },
        role: { ar: "رفع دعوى مرورية للمطالبة بالتعويض وإلزام المتسبب غير المؤمن أو الممتنع عن السداد.", en: "Filing traffic lawsuit against uninsured or delinquent motorists refusing restitution." },
        whenNeeded: { ar: "عند رفض المتسبب السداد أو تعذر التحصيل المالي عبر المرور.", en: "In cases of dispute, lack of insurance coverage, or non-compliance." },
        url: "https://new.najiz.sa/"
      }
    ]
  },
  {
    id: "sole-proprietorship-cr",
    sectorId: "business",
    name: { ar: "إصدار سجل تجاري لمؤسسة فردية", en: "Issue Sole Proprietorship Commercial Registration (CR)" },
    platform: { ar: "المركز السعودي للأعمال / وزارة التجارة", en: "Saudi Business Center / Ministry of Commerce" },
    summary: {
      ar: "خدمة إلكترونية فورية تمكّن رواد الأعمال من تأسيس وإصدار سجل تجاري لمؤسسة فردية وبدء ممارسة الأعمال في المملكة خلال 180 ثانية.",
      en: "Instant digital service allowing entrepreneurs to form and issue a sole proprietorship CR within 180 seconds to commence commerce."
    },
    when: {
      ar: "عند الرغبة في تأسيس نشاط تجاري يملكه فرد واحد برأس مال فردي ودون شركاء.",
      en: "When establishing a commercial enterprise owned by a single individual without partners."
    },
    targetAudience: {
      ar: "المواطنون السعوديون البالغون 18 عامًا فأكثر غير الخاضعين للمنع من مزاولة التجارة (مثل موظفي القطاع الحكومي).",
      en: "Saudi citizens aged 18+ who are not barred from commercial enterprise (such as public sector employees)."
    },
    userOutcomes: {
      ar: "إصدار رقم السجل التجاري الموحد، العضوية التلقائية في الغرفة التجارية، وفتح ملفات المنشأة تلقائيًا في الزكاة والتأمينات والعمل.",
      en: "Issuance of unified CR number, automatic Chamber of Commerce membership, and automated establishment file opening with ZATCA, GOSI, and HRSD."
    },
    prerequisites: {
      ar: "تحديد الاسم التجاري، واختيار الأنشطة الاقتصادية بدقة وفق التصنيف الوطني للأنشطة (ISIC4)، والتأكد من عدم وجود اشتراطات ترخيص مسبقة.",
      en: "Determining trade name, selecting activities compliant with National ISIC4 classification, and verifying any prior licensing needs."
    },
    confirmedRequirements: [
      { ar: "ألا يقل عمر المتقدم عن 18 عامًا.", en: "Applicant must be at least 18 years of age." },
      { ar: "ألا يكون موظفًا حكوميًا في القطاع العام.", en: "Applicant must not be a public sector civil servant." },
      { ar: "سداد الرسوم المقررة: 200 ريال للسنة للسجل الرئيسي + رسوم الغرفة التجارية بحسب الدرجة.", en: "Statutory fees: SAR 200/year for primary CR + Chamber membership fee according to category." }
    ],
    procedureSteps: [
      { ar: "تسجيل الدخول في بوابة المركز السعودي للأعمال (business.sa) عبر النفاذ الوطني.", en: "Log in to Saudi Business Center (business.sa) via Nafath." },
      { ar: "اختيار «إصدار سجل تجاري» وتحديد الاسم التجاري (شخصي أو مقترح).", en: "Select 'Issue Commercial Registration' and choose trade name." },
      { ar: "تحديد الأنشطة الاقتصادية وفق دليل الأنشطة وبيانات العنوان ورأس المال.", en: "Select economic activities from ISIC4 guide, address data, and capital." },
      { ar: "سداد الفاتورة الموحدة عبر نظام سداد، ليتم إصدار السجل والشهادات إلكترونيًا فورًا.", en: "Pay the unified invoice via SADAD to receive instant CR issuance electronically." }
    ],
    conditionalRules: {
      ar: "بعض الأنشطة (كالمجالات الطبية، الأمنية، التعليمية، أو الاستشارات المتخصصة) تتطلب ترخيصًا أو موافقة مسبقة من الجهة المشرفة قبل إصدار السجل أو تفعيله.",
      en: "Certain regulated activities (medical, security, educational, professional consultancy) mandate prior approval/licensing before CR activation."
    },
    unverifiedAspects: {
      ar: "رسوم الغرفة التجارية تختلف بحسب تصنيف النشاط والمدينة وتُدمج آليًا في الفاتورة الموحدة.",
      en: "Chamber fees vary based on enterprise activity classification and municipality, consolidated automatically into SADAD."
    },
    url: "https://mc.gov.sa/ar/eservices/pages/ServiceDetails.aspx?sID=38",
    sourceTitle: { ar: "وزارة التجارة: خدمة قيد سجل تجاري لمؤسسة فردية", en: "Ministry of Commerce: Sole Proprietorship CR Registration" },
    sourceUrl: "https://mc.gov.sa/ar/eservices/pages/ServiceDetails.aspx?sID=38",
    verifiedAt: "2026-10-11",
    verified: "verified",
    note: {
      ar: "أصبح إصدار السجل يتم مباشرة عبر منصة المركز السعودي للأعمال الموحدة مع فتح الملفات الحكومية ذات العلاقة.",
      en: "CR issuance is now executed via the unified Saudi Business Center portal with automated inter-governmental file creation."
    },
    requiredAuthorities: [
      { ar: "المركز السعودي للأعمال / وزارة التجارة", en: "Saudi Business Center / Ministry of Commerce" },
      { ar: "وزارة الشؤون البلدية والقروية والإسكان (بلدي / إيجار)", en: "MOMRAH (Balady / Ejar Network)" },
      { ar: "هيئة الزكاة والضريبة والجمارك", en: "Zakat, Tax and Customs Authority (ZATCA)" },
      { ar: "المؤسسة العامة للتأمينات الاجتماعية (GOSI)", en: "General Organization for Social Insurance (GOSI)" },
      { ar: "وزارة الموارد البشرية والتنمية الاجتماعية (قوى)", en: "Ministry of Human Resources (Qiwa)" }
    ],
    multiPlatformChain: [
      {
        name: { ar: "المركز السعودي للأعمال (business.sa)", en: "Saudi Business Center" },
        authority: { ar: "وزارة التجارة والجهات الشريكة", en: "Ministry of Commerce & Partners" },
        role: { ar: "المنصة المركزية لإصدار السجل التجاري وحجز الاسم وفتح الملفات الحكومية المشتركة تلقائياً.", en: "Central gateway for issuing Commercial Registration, reserving trade names, and activating unified entity files." },
        whenNeeded: { ar: "الخطوة الأولى الإلزامية لتأسيس المنشأة وإكسابها الشخصية القانونية.", en: "Mandatory first phase establishing the enterprise's legal status." },
        url: "https://business.sa/"
      },
      {
        name: { ar: "شبكة إيجار (Ejar)", en: "Ejar Network" },
        authority: { ar: "الهيئة العامة للعقار / الإسكان", en: "Real Estate General Authority / MOMRAH" },
        role: { ar: "توثيق عقد الإيجار التجاري لمقر المحل أو المكتب برقم عقد موحد ومعتمد نظاماً.", en: "Authenticating commercial lease for the business premises under verified digital deed." },
        whenNeeded: { ar: "شرط إلزامي قبل إصدار الرخصة التجارية البلدية للمحلات والمكاتب المستأجرة.", en: "Mandatory prerequisite prior to commercial municipal license issuance." },
        url: "https://www.ejar.sa/"
      },
      {
        name: { ar: "منصة بلدي (Balady)", en: "Balady Portal" },
        authority: { ar: "أمانات وبلديات المناطق", en: "Municipal Secretariats & Sub-municipalities" },
        role: { ar: "إصدار الرخصة التجارية البلدية لمزاولة النشاط ومطابقة الموقع لكود البناء والدفاع المدني.", en: "Issuing commercial municipal activity license, building code, and civil defense safety." },
        whenNeeded: { ar: "قبل فتح المحل أو المكتب واستقبال الجمهور وممارسة النشاط الميداني.", en: "Prior to physical storefront launch, customer reception, and operations." },
        url: "https://balady.gov.sa/"
      },
      {
        name: { ar: "هيئة الزكاة والضريبة والجمارك", en: "ZATCA Portal" },
        authority: { ar: "هيئة الزكاة والضريبة والجمارك", en: "Zakat, Tax & Customs Authority" },
        role: { ar: "تفعيل الشهادة الضريبية والزكوية وإعداد منظومة الفوترة الإلكترونية (فاتورة).", en: "Activating Zakat certificate and integrating E-Invoicing (Fatoora)." },
        whenNeeded: { ar: "فور إصدار السجل للالتزام السنوي وتركيب الفوترة قبل أول عملية بيع.", en: "Upon CR issuance for statutory compliance and point-of-sale invoicing." },
        url: "https://zatca.gov.sa/"
      },
      {
        name: { ar: "منصة قوى (Qiwa)", en: "Qiwa Portal" },
        authority: { ar: "وزارة الموارد البشرية", en: "Ministry of Human Resources" },
        role: { ar: "توثيق عقود العمل وإدارة ملف المنشأة وإصدار تصاريح وتأشيرات العمل عند توظيف عمالة.", en: "Authenticating employment contracts, quotas, and issuing work visas upon recruitment." },
        whenNeeded: { ar: "عند الحاجة لتوظيف عاملين أو نقل كفالات؛ ليست إلزامية للمنشأة الفردية دون عمالة.", en: "When hiring personnel; not immediately mandatory for zero-employee sole owners." },
        url: "https://www.qiwa.sa/"
      }
    ]
  },
  {
    id: "company-formation",
    sectorId: "business",
    name: { ar: "تأسيس شركة (شركة الشخص الواحد / ذات مسؤولية محدودة)", en: "Company Formation (Single Member / LLC)" },
    platform: { ar: "المركز السعودي للأعمال / وزارة التجارة", en: "Saudi Business Center / Ministry of Commerce" },
    summary: {
      ar: "تأسيس كيان تجاري ذي شخصية اعتبارية مستقلة وذمة مالية منفصلة عن الملاك، وفق نظام الشركات السعودي الجديد.",
      en: "Establishing a corporate legal entity with independent legal status and limited financial liability under the new Saudi Companies Law."
    },
    when: {
      ar: "عند وجود شركاء، أو الرغبة في فصل الذمة المالية للمالك عن الكيان التجاري، أو استهداف مشاريع واستثمارات واسعة النطاق.",
      en: "When forming with partners, seeking limited personal liability, or planning large-scale commercial investments."
    },
    targetAudience: {
      ar: "المستثمرون السعوديون والخليجيون والأجانب (عبر تراخيص وزارة الاستثمار MISA).",
      en: "Saudi, GCC, and foreign investors (in conjunction with MISA investment licensing)."
    },
    userOutcomes: {
      ar: "إصدار عقد التأسيس الموثق إلكترونيًا، السجل التجاري للشركة، وتحديد صلاحيات المديرين ومجلس الإدارة.",
      en: "Issuing electronically authenticated Articles of Association, company CR, and formal manager authority mandate."
    },
    prerequisites: {
      ar: "تحديد الشكل النظامي (شركة ذات مسؤولية محدودة، مساهمة مبسطة، تضامنية)، وتوزيع الحصص، واختيار المدير التنفيذي وتجهيز الاسم المقترح.",
      en: "Choosing corporate form (LLC, Simple Joint Stock, Partnership), share distribution, managing director, and verified trade name."
    },
    confirmedRequirements: [
      { ar: "توثيق عقد التأسيس إلكترونيًا من جميع الشركاء عبر منصة النفاذ الوطني.", en: "Electronic Articles of Association ratification by all partners via Nafath." },
      { ar: "تحديد ممثل الشركة أو المدير ذي الصلاحية وتحديد نطاق مسؤولياته.", en: "Appointing authorized legal manager and specifying managerial powers." },
      { ar: "سداد رسوم النشر وعقد التأسيس ورسوم السجل التجاري.", en: "Payment of publication, charter, and corporate registration fees." }
    ],
    procedureSteps: [
      { ar: "الدخول لمنصة المركز السعودي للأعمال واختيار «تأسيس شركة».", en: "Access Saudi Business Center portal and select 'Incorporate Company'." },
      { ar: "تحديد الكيان القانوني وإدخال بيانات الشركاء ونسب الملكية ورأس المال.", en: "Select corporate legal structure, input partner info, share percentages, and capital." },
      { ar: "صياغة واعتماد بنود عقد التأسيس وإرسال طلب المصادقة للشركاء.", en: "Draft and adopt Articles of Association terms, issuing signature prompts to partners." },
      { ar: "سداد الفاتورة الموحدة لاستلام السجل التجاري وعقد التأسيس المعتمد.", en: "Pay consolidated invoice to receive company CR and authenticated Articles." }
    ],
    conditionalRules: {
      ar: "تختلف متطلبات رأس المال واللوائح الحاكمة بحسب الشكل النظامي؛ مثلاً الشركة المساهمة المبسطة تتميز بمرونة استثنائية في الإدارة وحرية إصدار فئات الأسهم.",
      en: "Capital prerequisites vary by form; Simplified Joint Stock Companies offer tailored governance flexibility and multi-class shares."
    },
    unverifiedAspects: {
      ar: "شروط المساهمين الأجانب تخضع لمتطلبات ترخيص الاستثمار الأجنبي وتراخيص المقر الإقليمي وفق معايير MISA.",
      en: "Foreign shareholder requirements depend on foreign investment license conditions and regional HQ policies set by MISA."
    },
    url: "https://mc.gov.sa/ar/FAQ/pages/default.aspx",
    sourceTitle: { ar: "وزارة التجارة: الدليل التوجيهي لتأسيس الشركات", en: "Ministry of Commerce: Company Incorporation Guide" },
    sourceUrl: "https://mc.gov.sa/ar/FAQ/pages/default.aspx",
    verifiedAt: "2026-10-11",
    verified: "verified",
    note: {
      ar: "نظام الشركات الجديد يتيح تأسيس شركة مساهمة مبسطة وشركة الشخص الواحد دون تعقيدات سابقة.",
      en: "The new Companies Law enables single-member LLCs and Simplified Joint Stock Companies with enhanced structural agility."
    },
    requiredAuthorities: [
      { ar: "المركز السعودي للأعمال / وزارة التجارة", en: "Saudi Business Center / Ministry of Commerce" },
      { ar: "وزارة العدل (توثيق عقود التأسيس)", en: "Ministry of Justice (Articles Notarization)" },
      { ar: "هيئة الزكاة والضريبة والجمارك", en: "Zakat, Tax & Customs Authority (ZATCA)" },
      { ar: "المؤسسة العامة للتأمينات الاجتماعية (GOSI)", en: "Social Insurance (GOSI)" },
      { ar: "وزارة الموارد البشرية والتنمية الاجتماعية (قوى)", en: "Ministry of Human Resources (Qiwa)" }
    ],
    multiPlatformChain: [
      {
        name: { ar: "المركز السعودي للأعمال (business.sa)", en: "Saudi Business Center" },
        authority: { ar: "وزارة التجارة", en: "Ministry of Commerce" },
        role: { ar: "حجز الاسم التجاري، واختيار الكيان النظامي، وصياغة وتوثيق عقد التأسيس وسداد رسوم النشر والسجل.", en: "Name reservation, corporate entity structure selection, Articles drafting, and unified fees payment." },
        whenNeeded: { ar: "المنصة الأساسية لإتمام التأسيس القانوني الكامل وإصدار السجل التجاري للشركة.", en: "Core platform for full legal incorporation and corporate registration issuance." },
        url: "https://business.sa/"
      },
      {
        name: { ar: "النفاذ الوطني الموحد (نفاذ)", en: "Nafath SSO" },
        authority: { ar: "سدايا (SDAIA)", en: "SDAIA" },
        role: { ar: "المصادقة الرقمية والتوقيع الإلكتروني الإلزامي لجميع الشركاء والمؤسسين على عقد التأسيس.", en: "Digital signature and statutory consent by all founding partners on corporate charter." },
        whenNeeded: { ar: "أثناء مرحلة اعتماد عقد التأسيس؛ يتطلب دخول كل شريك للموافقة.", en: "During Articles ratification; every partner must independently authenticate." },
        url: "https://www.iam.gov.sa/"
      },
      {
        name: { ar: "هيئة الزكاة والضريبة والجمارك", en: "ZATCA Portal" },
        authority: { ar: "هيئة الزكاة والضريبة والجمارك", en: "Zakat, Tax & Customs Authority" },
        role: { ar: "استكمال التسجيل الضريبي الزكوي للشركة وإعداد الرقم الضريبي للفوترة الإلكترونية.", en: "Corporate tax profile activation and e-invoicing credential setup." },
        whenNeeded: { ar: "مباشرة بعد صدور سجل الشركة وقبل بدء أي معاملات مالية أو فواتير.", en: "Directly after CR issuance prior to conducting commercial sales transactions." },
        url: "https://zatca.gov.sa/"
      },
      {
        name: { ar: "منصة قوى (Qiwa)", en: "Qiwa Portal" },
        authority: { ar: "وزارة الموارد البشرية", en: "Ministry of Human Resources" },
        role: { ar: "تفعيل ملف الشركة العمالي، استخراج التأشيرات الفورية التأسيسية، وتوثيق عقود الإدارة والموظفين.", en: "Activating corporate labor file, foundational work visa allocation, and staff contract authentication." },
        whenNeeded: { ar: "عند بدء تعيين الكوادر الوظيفية ونقل الخدمات وإصدار إقامات العمل.", en: "When hiring personnel, transferring sponsorships, and issuing work residencies." },
        url: "https://www.qiwa.sa/"
      }
    ]
  },
  {
    id: "balady-license",
    sectorId: "business",
    name: { ar: "إصدار الرخصة التجارية البلدية للمحلات والمكاتب", en: "Commercial Municipal License Issuance" },
    platform: { ar: "منصة بلدي / وزارة البلديات والإسكان", en: "Balady / Ministry of Municipalities and Housing" },
    summary: {
      ar: "خدمة إصدار رخصة ممارسة النشاط التجاري لمقر المنشأة الميداني (محل، معرض، مكتب) متضمنة اشتراطات الموقع والسلامة والدفاع المدني.",
      en: "Service granting commercial permit for physical facility premises (shop, showroom, office), including zoning, health, and civil defense compliance."
    },
    when: {
      ar: "بعد صدور السجل التجاري وقبل فتح المحل أو بدء استقبال العملاء في مقر المنشأة الفعلي.",
      en: "After obtaining the Commercial Register and prior to opening physical premises to public customers."
    },
    targetAudience: {
      ar: "أصحاب المنشآت والأنشطة التجارية التي تتطلب مقرًا فيزيائيًا داخل النطاق العمراني والبلدي.",
      en: "Business owners operating activities requiring physical premises within urban and municipal boundaries."
    },
    userOutcomes: {
      ar: "الحصول على رخصة البلدية الفورية، تصريح اللوحة التجارية، وتفادي المخالفات البلدية المترتبة على مزاولة النشاط دون ترخيص.",
      en: "Obtaining instant municipal operational permit, storefront signage permit, and eliminating municipal non-compliance fines."
    },
    prerequisites: {
      ar: "سجل تجاري ساري، عقد إيجار موثق عبر منصة «إيجار» أو صك ملكية، ورقم العنوان الوطني للموقع.",
      en: "Active CR, lease contract authenticated via Ejar platform or title deed, and National Address of premises."
    },
    confirmedRequirements: [
      { ar: "عقد إيجار تجاري إلكتروني موثق في شبكة «إيجار».", en: "Electronic commercial lease registered in 'Ejar' network." },
      { ar: "تطابق النشاط التجاري في السجل مع النشاط المسموح به في الموقع البلدي.", en: "Conformity of CR activity with authorized municipal zoning." },
      { ar: "استيفاء اشتراطات السلامة والوقاية من الحريق (شهادة أدوات السلامة أو موافقة الدفاع المدني).", en: "Safety tools compliance certificate or Civil Defense approval." }
    ],
    procedureSteps: [
      { ar: "الدخول لمنصة بلدي واختيار «خدمات الرخص التجارية» $\\leftarrow$ «إصدار رخصة تجارية».", en: "Access Balady, select Commercial Licensing $\\rightarrow$ Issue Commercial License." },
      { ar: "اختيار السجل التجاري وإدخال رقم عقد إيجار المنشأة الإلكتروني.", en: "Select CR and input verified Ejar commercial lease reference." },
      { ar: "تحديد نوع النشاط والاشتراطات البلدية ومواصفات اللوحة الخارجية.", en: "Confirm activity parameters, municipal code, and exterior storefront sign specs." },
      { ar: "سداد الرسوم البلدية الموحدة لتصدر الرخصة وتُطبع إلكترونيًا.", en: "Pay unified municipal invoice to instantly generate and print official license." }
    ],
    conditionalRules: {
      ar: "الأنشطة الغذائية والصحية (مطاعم، مقاهي، صالونات) تتطلب شهادات صحية للعاملين وتركيب كاميرات مراقبة متوافقة مع اشتراطات كود البناء السعودي.",
      en: "Food and health venues (cafes, restaurants, salons) mandate worker health certs, surveillance cameras, and Saudi Building Code adherence."
    },
    unverifiedAspects: {
      ar: "رسوم البلدية تحسب بمعادلة مساحة المحل ونوع النشاط وتصنيف الشارع الجغرافي لدى الأمانة المعنية.",
      en: "Municipal fees are calculated dynamically based on square footage, activity tier, and street classification by local municipality."
    },
    url: "https://balady.gov.sa/",
    sourceTitle: { ar: "منصة بلدي: بوابة خدمات الرخص التجارية", en: "Balady Portal: Commercial Licensing Services" },
    sourceUrl: "https://balady.gov.sa/ar/services?id=159",
    verifiedAt: "2026-10-11",
    verified: "destination-limited",
    note: {
      ar: "الرخص الفورية تصدر للأنشطة غير الخطرة مباشرة، بينما تخضع الأنشطة ذات الاشتراطات التخصصية لزيارة رقابية لاحقة.",
      en: "Instant permits issue immediately for non-hazardous activities; specialized activities undergo post-issuance municipal inspection."
    },
    requiredAuthorities: [
      { ar: "وزارة البلديات والإسكان (منصة بلدي)", en: "Ministry of Municipalities and Housing (Balady)" },
      { ar: "المديرية العامة للدفاع المدني (سلامة)", en: "General Directorate of Civil Defense (Salamah)" },
      { ar: "الهيئة العامة للعقار (شبكة إيجار)", en: "Real Estate General Authority (Ejar)" },
      { ar: "المركز السعودي للأعمال (business.sa)", en: "Saudi Business Center" }
    ],
    multiPlatformChain: [
      {
        name: { ar: "شبكة إيجار (Ejar)", en: "Ejar Network" },
        authority: { ar: "الهيئة العامة للعقار", en: "Real Estate General Authority" },
        role: { ar: "توثيق العقد الإيجاري التجاري للمحل أو المكتب؛ استرجاع رقم العقد إلكترونياً دون أوراق.", en: "Authenticating commercial tenancy deed; digital contract sync without paperwork." },
        whenNeeded: { ar: "المتطلب المسبق الأول قبل التقديم على رخصة بلدي في العقارات المستأجرة.", en: "First prerequisite before applying for Balady license on leased commercial properties." },
        url: "https://www.ejar.sa/"
      },
      {
        name: { ar: "منصة سلامة (الدفاع المدني)", en: "Salamah (Civil Defense)" },
        authority: { ar: "المديرية العامة للدفاع المدني", en: "General Directorate of Civil Defense" },
        role: { ar: "إصدار ترخيص أو شهادة أدوات السلامة والوقاية من الحريق وتركيب طفايات الإنذار.", en: "Issuing fire safety tools compliance certificate and alarm verification." },
        whenNeeded: { ar: "إلزامية لكافة المحلات التجارية والمعارض لضمان أمان الموقع.", en: "Mandatory for all storefronts and facilities to ensure site compliance." },
        url: "https://salamah.998.gov.sa/"
      },
      {
        name: { ar: "منصة بلدي الموحدة", en: "Balady Portal" },
        authority: { ar: "وزارة البلديات والإسكان والأمانات", en: "Ministry of Municipalities and Housing" },
        role: { ar: "إصدار الرخصة التجارية الفورية، ترخيص اللوحة الإعلانية، واعتماد الموقع في كود البناء.", en: "Instant commercial license issuance, exterior sign permit, and building code compliance." },
        whenNeeded: { ar: "المحطة الرئيسية للحصول على رخصة المحل وبدء التشغيل النظامي.", en: "Primary hub for receiving official premises license and commencing operations." },
        url: "https://balady.gov.sa/"
      }
    ]
  },
  {
    id: "vat-registration",
    sectorId: "business",
    name: { ar: "التسجيل في ضريبة القيمة المضافة للمنشآت", en: "VAT Registration for Businesses" },
    platform: { ar: "هيئة الزكاة والضريبة والجمارك", en: "ZATCA" },
    summary: {
      ar: "تسجيل المنشأة في نظام ضريبة القيمة المضافة وإصدار الشهادة الضريبية للبدء في تحصيل وإقرار ضريبة الـ 15% المقررة نظامًا.",
      en: "Registering the enterprise in the VAT system, issuing VAT certificate to collect and file statutory 15% value-added tax."
    },
    when: {
      ar: "إلزاميًا عند تجاوز التوريدات السنوية 375,000 ريال، أو اختياريًا عند تجاوز التوريدات أو النفقات 187,500 ريال.",
      en: "Mandatory if annual taxable supplies exceed SAR 375,000; voluntary if annual supplies or expenses exceed SAR 187,500."
    },
    targetAudience: {
      ar: "المنشآت الفردية والشركات التي تزاول نشاطًا اقتصاديًا في المملكة وتخضع لضوابط اللائحة التنفيذية لضريبة القيمة المضافة.",
      en: "Sole establishments and companies conducting economic business in KSA subject to VAT executive regulations."
    },
    userOutcomes: {
      ar: "الحصول على الرقم الضريبي المكون من 15 رقمًا، وشهادة التسجيل الضريبية لإبرازها في المقر والمتجر الإلكتروني، والربط بالفوترة الإلكترونية.",
      en: "Obtaining 15-digit Tax Identification Number (TIN), official VAT certificate for display, and onboarding with E-invoicing (Fatoora)."
    },
    prerequisites: {
      ar: "سجل تجاري نشط، حساب بنكي تجاري للمنشأة، وتقديرات مالية للتوريدات أو فواتير المبيعات الفعلية.",
      en: "Active CR, corporate bank account, and sales revenue estimates or invoices."
    },
    confirmedRequirements: [
      { ar: "التسجيل الإلزامي: وصول المبيعات السنوية الخاضعة للضريبة إلى 375,000 ريال.", en: "Mandatory threshold: Annual taxable sales reaching SAR 375,000." },
      { ar: "التسجيل الاختياري: تجاوز المبيعات أو المصروفات حاجز 187,500 ريال سنويًا.", en: "Voluntary threshold: Annual supplies or expenses surpassing SAR 187,500." },
      { ar: "الالتزام بتطبيق منظومة الفوترة الإلكترونية (فاتورة) فور تفعيل الرقم الضريبي.", en: "Mandatory integration with E-Invoicing (Fatoora) platform upon registration." }
    ],
    procedureSteps: [
      { ar: "تسجيل الدخول في بوابة هيئة الزكاة والضريبة والجمارك (zatca.gov.sa) عبر حساب المنشأة.", en: "Log in to ZATCA portal (zatca.gov.sa) under the enterprise account." },
      { ar: "الانتقال إلى «الخدمات الضريبية» $\\leftarrow$ «التسجيل في ضريبة القيمة المضافة».", en: "Navigate to Tax Services $\\rightarrow$ Register for Value Added Tax." },
      { ar: "تعبئة البيانات المالية ومصادر الإيرادات وإرفاق الإثباتات المحاسبية.", en: "Fill financial income disclosures and attach accounting verification documents." },
      { ar: "استلام شهادة التسجيل بالرقم الضريبي فور دراسة واعتماد الطلب.", en: "Receive authenticated VAT registration certificate upon application review." }
    ],
    conditionalRules: {
      ar: "المنشآت حديثة التأسيس التي لم تبلغ الحد الإلزامي غير ملزمة بالتسجيل في ضريبة القيمة المضافة وتكتفي بتقديم إقرار الزكاة الشرعي السنوي.",
      en: "Startups below the mandatory revenue threshold are exempt from VAT registration, filing standard annual Zakat declarations only."
    },
    unverifiedAspects: {
      ar: "مراحل الربط والتكامل مع منصة الفوترة الإلكترونية (المرحلة الثانية) تحددها الهيئة في مجموعات إلزامية بحسب حجم الإيرادات.",
      en: "Phase 2 E-Invoicing integration waves are staggered periodically by ZATCA according to enterprise revenue brackets."
    },
    url: "https://zatca.gov.sa/",
    sourceTitle: { ar: "هيئة الزكاة والضريبة والجمارك: دليل التسجيل في ضريبة القيمة المضافة للمنشآت", en: "ZATCA: Guide to VAT Registration for Enterprises" },
    sourceUrl: "https://zatca.gov.sa/ar/eServices/Pages/eServices-001.aspx",
    verifiedAt: "2026-10-11",
    verified: "verified",
    note: {
      ar: "عدم التسجيل بعد بلوغ الحد الإلزامي يعرّض المنشأة لغرامات مالية نظامية، لذا يجب تتبع المبيعات دوريًا.",
      en: "Failing to register after crossing the mandatory threshold incurs statutory penalties; monitor revenue regularly."
    },
    requiredAuthorities: [
      { ar: "هيئة الزكاة والضريبة والجمارك", en: "Zakat, Tax and Customs Authority (ZATCA)" },
      { ar: "البنك المركزي السعودي (نظام سداد)", en: "Saudi Central Bank (SADAD)" },
      { ar: "المركز السعودي للأعمال", en: "Saudi Business Center" }
    ],
    multiPlatformChain: [
      {
        name: { ar: "البوابة الإلكترونية لهيئة الزكاة والضريبة والجمارك", en: "ZATCA Online Portal" },
        authority: { ar: "هيئة الزكاة والضريبة والجمارك", en: "Zakat, Tax & Customs Authority" },
        role: { ar: "تقديم طلب التسجيل الضريبي، رفع المستندات المالية، وإصدار شهادة ضريبة القيمة المضافة والرقم الضريبي.", en: "Tax registration submission, financial disclosure upload, VAT certificate and TIN issuance." },
        whenNeeded: { ar: "عند بلوغ حد المبيعات الإلزامي (375 ألف ريال) أو الاختياري (187.5 ألف ريال).", en: "Upon reaching mandatory (SAR 375k) or voluntary (SAR 187.5k) revenue thresholds." },
        url: "https://zatca.gov.sa/"
      },
      {
        name: { ar: "منظومة الفوترة الإلكترونية (فاتورة)", en: "E-Invoicing Platform (Fatoora)" },
        authority: { ar: "هيئة الزكاة والضريبة والجمارك", en: "ZATCA" },
        role: { ar: "ربط أجهزة نقاط البيع وبرامج المحاسبة بالمنظومة لإصدار فواتير ضريبية مشفرة بـ QR Code.", en: "Integrating POS devices and accounting software for encrypted QR code tax invoices." },
        whenNeeded: { ar: "إلزامية لكافة المنشآت المسجلة في ضريبة القيمة المضافة لإصدار الفواتير القانونية.", en: "Mandatory for all VAT-registered entities issuing legal commercial invoices." },
        url: "https://zatca.gov.sa/ar/E-Invoicing/Pages/default.aspx"
      },
      {
        name: { ar: "نظام سداد للمدفوعات", en: "SADAD Payment" },
        authority: { ar: "البنوك السعودية المعتمدة", en: "Commercial Banks" },
        role: { ar: "سداد الإقرارات الضريبية الدورية (شهرية أو ربع سنوية) برمز المفوتر 020.", en: "Settling periodic VAT return invoices using ZATCA SADAD biller (020)." },
        whenNeeded: { ar: "عند تقديم الإقرار الضريبي وسداد المستحقات الضريبية لتفادي غرامات التأخير.", en: "Upon filing VAT return and remitting collected tax to avoid late penalties." },
        url: "https://www.sadad.com/"
      }
    ]
  },
  {
    id: "qiwa",
    sectorId: "work",
    name: { ar: "منصة قوى وإدارة عقود وتأشيرات العمل", en: "Qiwa Platform: Labor Contracts & Visas" },
    platform: { ar: "قوى / وزارة الموارد البشرية والتنمية الاجتماعية", en: "Qiwa / Ministry of Human Resources" },
    summary: {
      ar: "المنصة المركزية الشاملة لإدارة المنشأة العمالية في المملكة، تشمل توثيق عقود العمل، نقل الخدمات، التأشيرات الفورية، وإدارة نطاقات.",
      en: "Unified portal managing workforce administration, including employment contract authentication, staff transfers, visas, and Nitaqat."
    },
    when: {
      ar: "عند تعيين أول موظف (سعودي أو وافد)، أو الرغبة في إصدار تأشيرات عمل وتوثيق العقود إلكترونيًا.",
      en: "When hiring your first employee (Saudi or expat), issuing work visas, or electronically binding labor contracts."
    },
    targetAudience: {
      ar: "أصحاب المنشآت والشركات ومسؤولو الموارد البشرية والموظفون في القطاع الخاص.",
      en: "Business founders, corporate HR executives, and private sector employees."
    },
    userOutcomes: {
      ar: "توثيق العقود لضمان حقوق الطرفين، إدارة تصاريح العمل، نقل الخدمات، متابعة الامتثال لبرنامج حماية الأجور، وتفادي الإيقافات.",
      en: "Authenticating contracts protecting both parties, issuing work permits, monitoring Wage Protection Program compliance, and avoiding halts."
    },
    prerequisites: {
      ar: "سجل تجاري نشط، فتح ملف منشأة في وزارة الموارد البشرية، وحساب بنكي مرتبط بحماية الأجور.",
      en: "Active CR, establishment file opened with Ministry of Human Resources, and payroll bank link for Wage Protection."
    },
    confirmedRequirements: [
      { ar: "توثيق 100% من عقود العاملين إلكترونيًا عبر المنصة وفق نظام العمل.", en: "Mandatory 100% electronic contract authentication for all personnel." },
      { ar: "الالتزام بنسب التوطين المحددة في برنامج «نطاقات» للمنشأة.", en: "Compliance with specific Saudization quotas under Nitaqat framework." },
      { ar: "الاشتراك السنوي في باقة خدمات قوى للمنشآت.", en: "Annual subscription to Qiwa corporate services tier." }
    ],
    procedureSteps: [
      { ar: "تسجيل الدخول في منصة قوى (qiwa.sa) بواسطة النفاذ الوطني لحساب مالك المنشأة.", en: "Log in to Qiwa (qiwa.sa) using the owner's Nafath national credentials." },
      { ar: "تحديد المنشأة وتفعيل الاشتراك السنوي في خدمات قوى.", en: "Select enterprise and activate Qiwa corporate subscription tier." },
      { ar: "الانتقال إلى «خدمة توثيق العقود» وإدخال بيانات الأجر والشروط وإرسالها للموظف للمصادقة.", en: "Access Contract Authentication, input compensation details, and submit for employee digital signature." },
      { ar: "إصدار وتجديد رخص العمل والتأشيرات عبر لوحة تحكم المنشأة.", en: "Issue and renew work permits and labor visas via the administrative dashboard." }
    ],
    conditionalRules: {
      ar: "المنشأة ذات المالك الفردي دون عمالة لا تتطلب اشتراكًا مفعلًا في خدمات قوى المتقدمة حتى بدء استقطاب موظفين.",
      en: "Sole establishments with zero employees do not require active premium Qiwa subscriptions until staff recruitment begins."
    },
    unverifiedAspects: {
      ar: "رسوم الاشتراك السنوي في قوى تعتمد على عدد العمالة بالمنشأة وتُحدث دوريًا عبر المنصة.",
      en: "Annual Qiwa corporate subscription pricing scales according to workforce head count and is updated on the portal."
    },
    url: "https://www.qiwa.sa/",
    sourceTitle: { ar: "وزارة الموارد البشرية: خدمات منصة قوى", en: "Ministry of Human Resources: Qiwa Platform" },
    sourceUrl: "https://www.hrsd.gov.sa/ministry-platforms",
    verifiedAt: "2026-10-11",
    verified: "destination-limited",
    note: {
      ar: "توثيق العقود في قوى ملزم قانونًا لحماية المنشأة والعامل وإثبات الأجور المتفق عليها.",
      en: "Contract authentication on Qiwa is legally binding to safeguard both employer and employee and prove agreed wages."
    },
    requiredAuthorities: [
      { ar: "وزارة الموارد البشرية والتنمية الاجتماعية (منصة قوى)", en: "Ministry of Human Resources (Qiwa)" },
      { ar: "المؤسسة العامة للتأمينات الاجتماعية (GOSI)", en: "General Organization for Social Insurance (GOSI)" },
      { ar: "منصة مُدد (برنامج حماية الأجور)", en: "Mudad (Wage Protection System)" },
      { ar: "وزارة الداخلية (أبشر أعمال)", en: "Ministry of Interior (Absher Business)" }
    ],
    multiPlatformChain: [
      {
        name: { ar: "منصة قوى (Qiwa)", en: "Qiwa Portal" },
        authority: { ar: "وزارة الموارد البشرية والتنمية الاجتماعية", en: "Ministry of Human Resources" },
        role: { ar: "توثيق عقود العمل، إصدار وتجديد رخص العمل، إدارة التأشيرات المهنية الفورية ونقل الخدمات.", en: "Authenticating contracts, issuing work permits, managing instant professional visas, and job transfers." },
        whenNeeded: { ar: "المنصة الأساسية لإدارة العلاقة التعاقدية والتأشيرات والامتثال لنطاقات.", en: "Core platform for managing contractual workforce, visas, and Nitaqat compliance." },
        url: "https://www.qiwa.sa/"
      },
      {
        name: { ar: "المؤسسة العامة للتأمينات الاجتماعية (GOSI)", en: "Social Insurance (GOSI)" },
        authority: { ar: "التأمينات الاجتماعية", en: "GOSI" },
        role: { ar: "تسجيل الموظفين واحتساب مدد الاشتراك ونسب الاستقطاع وإدارة منافع ساند وإصابات العمل.", en: "Employee contribution registration, Saned unemployment scheme, and workplace injury coverage." },
        whenNeeded: { ar: "ربط فوري إلزامي لجميع الموظفين المسجلين في قوى لاكتمال التسجيل النظامي.", en: "Immediate automated integration for all staff onboarded in Qiwa." },
        url: "https://www.gosi.gov.sa/"
      },
      {
        name: { ar: "منصة مُدد (Mudad)", en: "Mudad Platform" },
        authority: { ar: "وزارة الموارد البشرية والبنك المركزي", en: "Ministry of Human Resources & SAMA" },
        role: { ar: "متابعة نظام حماية الأجور، وتأكيد تحويل الرواتب شهرياً لحسابات العاملين البنكية وتفادي الإيقاف.", en: "Wage Protection compliance, monthly payroll disbursement tracking, and fine prevention." },
        whenNeeded: { ar: "شهرياً عند صرف مسيرات رواتب المنشأة لإثبات الالتزام المالي.", en: "Monthly upon payroll processing to verify financial statutory compliance." },
        url: "https://mudad.com.sa/"
      },
      {
        name: { ar: "أبشر أعمال (Absher Business)", en: "Absher Business" },
        authority: { ar: "المديرية العامة للجوازات", en: "General Directorate of Passports" },
        role: { ar: "إصدار وتجديد الإقامات النظامية للعمالة الوافدة وطباعة بطاقات هوية مقيم.", en: "Issuing and renewing resident IDs (Iqama) and printing physical cards." },
        whenNeeded: { ar: "بعد سداد المقابل المالي ورخصة العمل في قوى لإصدار هوية مقيم الفعلية.", en: "After clearing work permits in Qiwa to issue valid residential Iqama." },
        url: "https://business.absher.sa/"
      }
    ]
  },
  {
    id: "noor",
    sectorId: "education",
    name: { ar: "نظام نور للخدمات التعليمية والطلاب", en: "Noor Educational System" },
    platform: { ar: "وزارة التعليم", en: "Ministry of Education" },
    summary: {
      ar: "النظام الشامل لإدارة المسار التعليمي لطلاب المدارس في المملكة؛ يشمل تسجيل المستجدين، استعراض الشهادات، والنقل المدرسي.",
      en: "Comprehensive platform managing educational trajectories of school students, including registration, grade reports, and school transfers."
    },
    when: {
      ar: "عند تسجيل الطلاب المستجدين في رياض الأطفال والصف الأول، أو متابعة النتائج الدراسية الدورية، أو طلب النقل بين المدارس.",
      en: "When registering new students in kindergarten or Grade 1, reviewing academic report cards, or submitting school transfer requests."
    },
    targetAudience: {
      ar: "أولياء الأمور، الطلاب والطالبات، والمعلمون وقادة المدارس في التعليم العام والأهلي والدولي.",
      en: "Parents, students, educators, and school administrators across public, private, and international schools."
    },
    userOutcomes: {
      ar: "تسجيل الأبناء إلكترونيًا، استخراج وطباعة إشعارات الدرجات والشهادات الرقمية، ومتابعة الحضور والغياب.",
      en: "Registering children online, retrieving and printing academic transcripts, and monitoring student attendance records."
    },
    prerequisites: {
      ar: "حساب ولي الأمر في نظام نور أو الدخول المباشر عبر النفاذ الوطني، وشهادة فحص اللياقة المدرسية للطلاب المستجدين.",
      en: "Guardian account on Noor or single sign-on via Nafath, along with school fitness medical clearance for new entrants."
    },
    confirmedRequirements: [
      { ar: "بلوغ السن النظامي للقبول في الروضة أو الصف الأول الابتدائي وفق التواريخ المحددة سنويًا من الوزارة.", en: "Reaching statutory admission age for kindergarten or Grade 1 based on annual MOE age brackets." },
      { ar: "إتمام الفحص الطبي المدرسي في المراكز الصحية الأولية (عبر تطبيق صحتي).", en: "Completing student medical screening at primary health centers (via Sehhaty)." },
      { ar: "توثيق إقامة سارية أو سجل أسرة للتحقق من صلة القرابة لولي الأمر.", en: "Valid Iqama or Family Record verifying parental guardianship relationship." }
    ],
    procedureSteps: [
      { ar: "الدخول لبوابة نظام نور (noor.moe.gov.sa) عبر النفاذ الوطني الموحد.", en: "Access Noor portal (noor.moe.gov.sa) using unified Nafath credentials." },
      { ar: "اختيار «تسجيل الأبناء» في فترات التسجيل الرسمية المعلنة.", en: "Choose 'Register Dependents' during official registration windows." },
      { ar: "تحديد المدرسة المفضلة وإرفاق المستندات المتبقية وفق نظام التوزيع الجغرافي.", en: "Select preferred school and attach required documents based on catchment zones." },
      { ar: "متابعة حالة قبول الطلب من قبل إدارة المدرسة واعتماده.", en: "Track admission status and final school approval electronically." }
    ],
    conditionalRules: {
      ar: "تسجيل الطلاب غير السعوديين يخضع لنسب القبول والاشتراطات الخاصة المعتمدة سنويًا من وزارة التعليم.",
      en: "Non-Saudi student admissions are subject to annual regulatory quota caps and residency criteria issued by the MOE."
    },
    unverifiedAspects: {
      ar: "فترات ومواعيد فتح التسجيل للعام الدراسي الجديد تُعلن سنويًا في تعاميم رسمية قبل بدء الفصل الدراسي.",
      en: "New school year registration launch dates are published annually in ministerial circulars prior to term start."
    },
    url: "https://noor.moe.gov.sa/Noor/",
    sourceTitle: { ar: "وزارة التعليم: نظام نور التعليمي", en: "Ministry of Education: Noor Education System" },
    sourceUrl: "https://www.moe.gov.sa/",
    verifiedAt: "2026-10-11",
    verified: "verified",
    note: {
      ar: "يمكن لولي الأمر استعراض نتائج أبنائه الدراسية فور اعتمادها من المدرسة دون الحاجة لزيارة مقر المدرسة.",
      en: "Guardians can view academic report cards directly upon school approval without visiting school premises."
    },
    requiredAuthorities: [
      { ar: "وزارة التعليم (نظام نور / المنصة الوطنية للتعليم)", en: "Ministry of Education (Noor System)" },
      { ar: "وزارة الصحة (فحص اللياقة المدرسية عبر صحتي)", en: "Ministry of Health (School Fitness Screening via Sehhaty)" },
      { ar: "الهيئة السعودية للبيانات والذكاء الاصطناعي (نفاذ)", en: "SDAIA (Nafath SSO)" }
    ],
    multiPlatformChain: [
      {
        name: { ar: "النفاذ الوطني الموحد (نفاذ)", en: "Nafath SSO" },
        authority: { ar: "سدايا (SDAIA)", en: "SDAIA" },
        role: { ar: "الدخول الموحد لولي الأمر والتحقق من صلة القرابة برقم الهوية وسجل الأسرة.", en: "Single sign-on validating guardian identity and family relationship via civil records." },
        whenNeeded: { ar: "تسجيل الدخول الآمن لنظام نور دون الحاجة لاسم مستخدم وكلمة مرور مدرسية.", en: "Secure login to Noor without needing traditional school credentials." },
        url: "https://www.iam.gov.sa/"
      },
      {
        name: { ar: "منصة وتطبيق صحتي (Sehhaty)", en: "Sehhaty Health Platform" },
        authority: { ar: "وزارة الصحة", en: "Ministry of Health" },
        role: { ar: "حجز موعد فحص اللياقة المدرسية للطلاب المستجدين وربط النتيجة إلكترونياً بنظام نور.", en: "Booking school fitness exam for entrants and transmitting digital health clearance to Noor." },
        whenNeeded: { ar: "شرط أساسي مسبق لإتمام تسجيل طلاب رياض الأطفال والصف الأول الابتدائي.", en: "Mandatory prerequisite prior to concluding admission for kindergarten and Grade 1." },
        url: "https://www.sehhaty.sa/"
      },
      {
        name: { ar: "نظام نور المركزي (Noor)", en: "Noor Central System" },
        authority: { ar: "وزارة التعليم", en: "Ministry of Education" },
        role: { ar: "تقديم طلب التسجيل، اختيار المدرسة المفضلة، متابعة القبول، واستخراج إشعارات الدرجات والشهادات.", en: "Submitting admission, school selection, approval tracking, and retrieving grade transcripts." },
        whenNeeded: { ar: "المنصة الرئيسية للعملية التعليمية ومتابعة الطلاب طوال العام الدراسي.", en: "Core platform for admissions, attendance, and educational records throughout the school year." },
        url: "https://noor.moe.gov.sa/Noor/"
      }
    ]
  },
  {
    id: "sehhaty",
    sectorId: "health",
    name: { ar: "تطبيق ومنصة صحتي للخدمات الصحية الموحدة", en: "Sehhaty Platform: Unified Healthcare Services" },
    platform: { ar: "وزارة الصحة", en: "Ministry of Health" },
    summary: {
      ar: "المنصة الوطنية الموحدة للرعاية الصحية في المملكة؛ تقدم حجز المواعيد في المراكز الصحية، الاستشارات الطبية الفورية، والملف الصحي.",
      en: "The unified national digital healthcare platform providing primary care appointments, teleconsultations, and electronic health records."
    },
    when: {
      ar: "عند الحاجة لحجز موعد في مركز الرعاية الأولية، الحصول على استشارة طبية عن بُعد، متابعة التطعيمات، أو فحص اللياقة المدرسية.",
      en: "When booking primary clinic appointments, requesting teleconsultations, tracking vaccinations, or completing school health exams."
    },
    targetAudience: {
      ar: "كافة المواطنين والمقيمين والزوار في المملكة العربية السعودية.",
      en: "All citizens, residents, and visitors residing across Saudi Arabia."
    },
    userOutcomes: {
      ar: "إدارة المواعيد الصحية، استعراض الإجازات المرضية المعتمدة، استعراض الوصفات الطبية وصرفها عبر «وصفتي»، وتتبع الفحوصات واللقاحات.",
      en: "Managing clinic visits, accessing certified sick leaves, filling prescriptions via 'Wasfaty', and reviewing lab results/vaccines."
    },
    prerequisites: {
      ar: "هوية وطنية أو إقامة سارية المفعول، ورقم جوال مسجل في نظام أبشر.",
      en: "Valid National ID / Iqama and mobile phone number registered in Absher."
    },
    confirmedRequirements: [
      { ar: "حساب شخصي مفعل وموثق برقم الهوية عبر النفاذ الوطني.", en: "Verified personal account linked to National ID via Nafath." },
      { ar: "المواعيد الأولية مجانية بالكامل لجميع المواطنين في مراكز الرعاية الصحية التابعة للوزارة.", en: "Primary healthcare appointments are completely free for all citizens in MOH health centers." }
    ],
    procedureSteps: [
      { ar: "تحميل تطبيق صحتي أو الدخول للبوابة الرقمية لوزارة الصحة.", en: "Download Sehhaty app or access the Ministry of Health portal." },
      { ar: "تسجيل الدخول برقم الهوية وكلمة المرور أو عبر النفاذ الوطني.", en: "Log in with ID number or via single sign-on Nafath." },
      { ar: "اختيار «المواعيد» $\\leftarrow$ «حجز موعد جديد»، وتحديد المركز الصحي والعيادة المناسبة.", en: "Select Appointments $\\rightarrow$ Book New Appointment, choosing center and specialty clinic." },
      { ar: "تأكيد الموعد واستعراض تذكرة الحضور أو رابط العيادة الافتراضية.", en: "Confirm booking and retrieve ticket or virtual teleconsultation link." }
    ],
    conditionalRules: {
      ar: "المواعيد في المستشفيات التخصصية والمدن الطبية تتطلب إحالة طبية سارية من طبيب المركز الصحي الأولي ولا يمكن حجزها مباشرة.",
      en: "Tertiary and specialized hospital visits require an active physician referral from primary care and cannot be booked directly."
    },
    unverifiedAspects: {
      ar: "شروط التغطية الصحية والتأمين لغير السعوديين في القطاع الخاص تخضع لشبكة مجلس الضمان الصحي (CHI).",
      en: "Private health insurance coverage rules for expatriates are governed by Council of Health Insurance (CHI) network regulations."
    },
    url: "https://www.moh.gov.sa/support/pages/sehhatyapp.aspx",
    sourceTitle: { ar: "وزارة الصحة: دليل خدمات تطبيق صحتي", en: "Ministry of Health: Sehhaty App Guide" },
    sourceUrl: "https://www.moh.gov.sa/support/pages/sehhatyapp.aspx",
    verifiedAt: "2026-10-11",
    verified: "verified",
    note: {
      ar: "لا تدخل بيانات صحية سرية أو أعراضًا طارئة داخل مَعبر؛ الحالات الطارئة تطلب الاتصال المباشر بالرقم 997 أو 937.",
      en: "Do not enter medical data into MAABAR; for emergency situations, call 997 (Ambulance) or 937 (Health Help Center) directly."
    },
    requiredAuthorities: [
      { ar: "وزارة الصحة (تطبيق ومنصة صحتي)", en: "Ministry of Health (Sehhaty Platform)" },
      { ar: "الشركة الوطنية للشراء الموحد (خدمة وصفتي)", en: "NUPCO (Wasfaty E-Prescription)" },
      { ar: "مجلس الضمان الصحي (CHI)", en: "Council of Health Insurance (CHI)" },
      { ar: "الهيئة السعودية للبيانات والذكاء الاصطناعي (توكلنا)", en: "SDAIA (Tawakkalna App)" }
    ],
    multiPlatformChain: [
      {
        name: { ar: "تطبيق ومنصة صحتي (Sehhaty)", en: "Sehhaty App & Platform" },
        authority: { ar: "وزارة الصحة", en: "Ministry of Health" },
        role: { ar: "حجز مواعيد مراكز الرعاية الأولية، الاستشارات الطبية الفورية، وتتبع اللقاحات والإجازات المرضية.", en: "Primary care bookings, urgent teleconsultations, vaccine tracking, and sick leave certificates." },
        whenNeeded: { ar: "المنصة الرئيسية لإدارة المواعيد الطبية والملف الصحي الشامل للأسرة.", en: "Primary healthcare portal managing visits and complete family health records." },
        url: "https://www.sehhaty.sa/"
      },
      {
        name: { ar: "منظومة وصفتي (Wasfaty)", en: "Wasfaty Digital Prescriptions" },
        authority: { ar: "وزارة الصحة / نوبكو (NUPCO)", en: "Ministry of Health / NUPCO" },
        role: { ar: "استلام الوصفة الطبية الإلكترونية وصرف الدواء مجاناً من أقرب صيدلية مجتمعية معتمدة.", en: "Receiving e-prescriptions and dispensing medication free from nearest community pharmacy." },
        whenNeeded: { ar: "بعد انتهاء الكشف الطبي في المركز الصحي أو العيادة الافتراضية.", en: "Post-consultation at primary clinic or virtual hospital." },
        url: "https://wasfaty.sa/"
      },
      {
        name: { ar: "منظومة توكلنا (Tawakkalna)", en: "Tawakkalna Services" },
        authority: { ar: "سدايا (SDAIA)", en: "SDAIA" },
        role: { ar: "استعراض بطاقة التأمين الطبي، تقارير الإجازات المرضية المعتمدة، وسجل التطعيمات.", en: "Displaying health insurance card, certified medical leaves, and vaccination passport." },
        whenNeeded: { ar: "لإبراز الوثائق الصحية الرسمية وإثبات الإجازة المرضية لجهة العمل.", en: "For official presentation of health status and sick leave verification to employers." },
        url: "https://tawakkalna.sdaia.gov.sa/"
      }
    ]
  },
  {
    id: "najiz",
    sectorId: "justice",
    name: { ar: "بوابة ناجز للخدمات والتوثيق والوكالات العدلية", en: "Najiz Portal: Judicial & Notary Services" },
    platform: { ar: "وزارة العدل", en: "Ministry of Justice" },
    summary: {
      ar: "البوابة الإلكترونية الموحدة لوزارة العدل، تتيح إنجاز كافة الخدمات القضائية والتوثيقية مثل إصدار الوكالات، إفراغ العقارات، وعقود الزواج.",
      en: "The unified judicial portal by Ministry of Justice, allowing execution of notarial services such as Power of Attorney, property transfer, and claims."
    },
    when: {
      ar: "عند الرغبة في إصدار وكالة شرعية، توثيق إفراغ عقاري، تقديم دعوى قضائية، أو التحقق من صحة وثيقة عدلية.",
      en: "When issuing a Power of Attorney (PoA), transferring real estate deeds, filing court claims, or verifying judicial documents."
    },
    targetAudience: {
      ar: "الأفراد والمحامون والشركات والمستثمرون الراغبون في توثيق التصرفات القانونية وإدارة القضايا.",
      en: "Individuals, attorneys, corporations, and investors seeking notarization and case management."
    },
    userOutcomes: {
      ar: "إصدار وكالة إلكترونية فورية سارية المفعول، إفراغ صكوك العقارات رقميًا، متابعة الجلسات القضائية عن بُعد، والتنفيذ القضائي للأسناد.",
      en: "Issuing instant legal PoA, digital property deed conveyancing, remote virtual court sessions, and debt enforcement."
    },
    prerequisites: {
      ar: "حساب موثق في النفاذ الوطني، وأهلية نظامية كاملة للموكل أو صاحب التصرف الشرعي.",
      en: "Authenticated account on Nafath, and full legal contractual capacity for the principal."
    },
    confirmedRequirements: [
      { ar: "توثيق الهوية عبر النفاذ الوطني الموحد.", en: "Identity validation via single sign-on Nafath." },
      { ar: "أن يكون الموكل أو صاحب التصرف سليم الأهلية المعتبرة شرعًا ونظامًا.", en: "Principal must possess full legal and mental capacity under Islamic law." },
      { ar: "توثيق العقود العقارية يتطلب صك ملكية إلكتروني مسجل في البورصة العقارية.", en: "Real estate conveyancing requires digital deed registered on Real Estate Exchange." }
    ],
    procedureSteps: [
      { ar: "الدخول لبوابة ناجز (najiz.sa) واختيار الدخول عبر النفاذ الوطني.", en: "Access Najiz portal (najiz.sa) and sign in via Nafath." },
      { ar: "اختيار بوابة الأفراد أو الأعمال، ثم التوجه إلى قسم «الوكالات والإقرارات» أو «العقارات».", en: "Select Individuals or Business, heading to 'Powers of Attorney' or 'Real Estate'." },
      { ar: "تحديد نوع الخدمة وإدخال بيانات الأطراف والبنود المطلوبة بدقة.", en: "Select service type and input counterpart details and authorization clauses." },
      { ar: "اعتماد الوثيقة إلكترونيًا واستلام رقم التوثيق والباركود الرسمي الفوري.", en: "Approve document electronically to receive instant verification code and official barcode." }
    ],
    conditionalRules: {
      ar: "الوكالات التي تتضمن صلاحيات مشددة (كالبيع والإفراغ العقاري والقبض المالي) تخضع لضوابط تحقق إضافية ومدة صلاحية محددة.",
      en: "Powers of Attorney conferring critical powers (property liquidation, financial collection) undergo extra verification and duration limits."
    },
    unverifiedAspects: {
      ar: "جلسات التقاضي وتقديم المذكرات تخضع لمدد نظام المرافعات الشرعية ونظام الإثبات في المملكة.",
      en: "Court litigation sessions and pleading submission deadlines strictly follow the Law of Civil Procedure and Law of Evidence."
    },
    url: "https://new.najiz.sa/",
    sourceTitle: { ar: "وزارة العدل: بوابة ناجز للخدمات العدلية", en: "Ministry of Justice: Najiz Judicial Portal" },
    sourceUrl: "https://www.moj.gov.sa/",
    verifiedAt: "2026-10-11",
    verified: "destination-limited",
    note: {
      ar: "محتوى مَعبر في القطاع العدلي إرشادي وتوجيهي للمنصة الرسمية ولا يُعد استشارة قانونية مهنية.",
      en: "MAABAR's justice directory content is orientational and does not constitute formal legal counsel."
    },
    requiredAuthorities: [
      { ar: "وزارة العدل (المحاكم العامة والتجارية والعمالية)", en: "Ministry of Justice (General, Commercial, and Labor Courts)" },
      { ar: "الهيئة السعودية للبيانات والذكاء الاصطناعي (نفاذ)", en: "SDAIA (Nafath Single Sign-on)" },
      { ar: "الهيئة العامة للعقار (البورصة العقارية)", en: "Real Estate General Authority (Real Estate Exchange)" }
    ],
    multiPlatformChain: [
      {
        name: { ar: "النفاذ الوطني الموحد (نفاذ)", en: "Nafath SSO" },
        authority: { ar: "سدايا (SDAIA)", en: "SDAIA" },
        role: { ar: "التحقق البيومتري من هوية الموكل أو المترافع وإصدار إذن النفاذ للأنظمة العدلية.", en: "Biometric and identity verification granting secure gateway to judicial systems." },
        whenNeeded: { ar: "خطوة أمان إلزامية للدخول لخدمات ناجز والبورصة العقارية.", en: "Mandatory security prerequisite for logging into judicial portals." },
        url: "https://www.iam.gov.sa/"
      },
      {
        name: { ar: "بوابة ناجز (najiz.sa)", en: "Najiz Portal" },
        authority: { ar: "وزارة العدل", en: "Ministry of Justice" },
        role: { ar: "إصدار الوكالات، حضور الجلسات القضائية الافتراضية، وتقديم صحائف الدعوى والمذكرات.", en: "Issuing powers of attorney, virtual court hearings, and statement of claims." },
        whenNeeded: { ar: "البوابة الرئيسية لجميع الخدمات القضائية والتوثيقية الرسمية.", en: "The primary portal for all official judicial and notarial services." },
        url: "https://new.najiz.sa/"
      },
      {
        name: { ar: "البورصة العقارية", en: "Real Estate Exchange" },
        authority: { ar: "وزارة العدل / الهيئة العامة للعقار", en: "Ministry of Justice / REGA" },
        role: { ar: "إفراغ العقارات ونقل الملكية إلكترونياً دون الحاجة لكتابة العدل الورقية.", en: "Electronic property conveyancing and title transfers without in-person notaries." },
        whenNeeded: { ar: "عند إجراء صفقات بيع أو شراء أو رهن صكوك عقارية رقمية.", en: "When conducting digital real estate conveyance, purchase, or mortgage." },
        url: "https://srem.moj.gov.sa/"
      }
    ]
  },
  {
    id: "judicial-notices",
    sectorId: "justice",
    name: { ar: "الاستعلام عن الإخطارات والتبليغات القضائية", en: "Judicial notices & court subpoena inquiry" },
    platform: { ar: "بوابة ناجز / وزارة العدل", en: "Najiz Portal / Ministry of Justice" },
    summary: {
      ar: "خدمة إلكترونية للتحقق من صحة الرسائل النصية والإشعارات القضائية الواردة من المحاكم أو دوائر التنفيذ، ومعرفة رقم وتفاصيل القضية.",
      en: "Electronic service to verify authenticity of SMS court notices or execution orders and check corresponding lawsuit records."
    },
    when: {
      ar: "عند استلام رسالة نصية (SMS) تفيد بصدور إشعار قضائي، تبليغ حضور جلسة، أو أمر تنفيذ مالي/سند لأمر.",
      en: "Upon receiving an SMS notice regarding a court hearing, judicial subpoena, or financial enforcement decree."
    },
    targetAudience: {
      ar: "المواطنون والمقيمون وممثلو المنشآت المستلمون لإشعارات قضائية أو أطراف الدعاوى والتنفيذ.",
      en: "Citizens, residents, and corporate representatives receiving judicial subpoenas or parties in litigation/enforcement."
    },
    userOutcomes: {
      ar: "التأكد من رسمية الإشعار وحمايتك من رسائل الاحتيال، معرفة اسم المحكمة والدائرة، الاطلاع على لائحة الدعوى وموعد الجلسة، أو سداد المطالبة التنفيذية.",
      en: "Validating notice authenticity against fraud, identifying court and chamber, reviewing claim sheet and hearing time, or settling enforcement dues."
    },
    prerequisites: {
      ar: "الدخول عبر النفاذ الوطني الموحد لصاحب الهوية المستلمة للرسالة، وعدم مشاركة أي رمز تحقق مع أي جهة.",
      en: "Single sign-on via Nafath for the recipient ID; never disclose verification OTPs to anyone."
    },
    confirmedRequirements: [
      { ar: "الدخول لبوابة ناجز الرسمية (najiz.sa) والتحقق عبر مسار «التبليغات القضائية» أو «طلبات التنفيذ».", en: "Log in to official Najiz (najiz.sa) and verify via Judicial Subpoenas or Enforcement Orders." },
      { ar: "إذا كان الإشعار «أمر تنفيذ (المادة 34 أو 46)»: لديك مهلة نظامية قدرها 5 أيام للسداد عبر فاتورة سداد المعتمدة أو طلب الإمهال/المنازعة.", en: "If notice is an Enforcement Decree (Art 34/46): 5-day statutory window to pay via official SADAD bill or dispute." },
      { ar: "إذا كان الإشعار «تبليغ بحضور جلسة»: يجب الاطلاع على رابط الجلسة المرئية وتاريخها المعتمد داخل بوابة ناجز.", en: "If notice is a Court Hearing Subpoena: check the remote session link and scheduled date inside Najiz." }
    ],
    procedureSteps: [
      { ar: "فتح المتصفح والتوجه مباشرة لرابط ناجز الرسمي (najiz.sa) دون الضغط على روابط مجهولة في الرسائل النصية.", en: "Open browser and navigate directly to official Najiz (najiz.sa); do not tap unverified SMS links." },
      { ar: "تسجيل الدخول الآمن برقم الهوية وتطبيق نفاذ.", en: "Secure login using National ID and Nafath app approval." },
      { ar: "الانتقال إلى قائمة «القضايا» $\\leftarrow$ «التبليغات القضائية» أو قائمة «التنفيذ».", en: "Go to Cases $\\rightarrow$ Judicial Subpoenas or Enforcement tab." },
      { ar: "استعراض رقم القرار القضائي، بيانات المدعي، وموضوع الطلب، ومتابعة الإجراء النظامي المطلوب.", en: "Review decree number, plaintiff details, claim subject, and submit required procedural response." }
    ],
    conditionalRules: {
      ar: "الإشعار القضائي غير الموثق برقم طلب رسمي في منصة ناجز يُعتبر رسالة احتيالية ويجب الإبلاغ عنه عبر تطبيق «كلنا أمن».",
      en: "Any judicial SMS not validated by an authentic reference inside Najiz is fraudulent and must be reported via Kollona Amn."
    },
    unverifiedAspects: {
      ar: "الآثار المترتبة على قرارات المادة (46) من نظام التنفيذ كإيقاف الخدمات تتبع الضوابط المحدثة الصادرة بالأوامر الملكية الأخيرة.",
      en: "Statutory consequences under Enforcement Law Art 46 (account freeze) adhere to newly updated royal decrees on service suspension."
    },
    url: "https://new.najiz.sa/",
    sourceTitle: { ar: "بوابة ناجز: التبليغات القضائية والتنفيذ", en: "Najiz Portal: Judicial Notices & Enforcement" },
    sourceUrl: "https://www.moj.gov.sa/",
    verifiedAt: "2026-10-11",
    verified: "verified",
    note: {
      ar: "مَعبر يشرح الإجراء العام؛ لا يطلع على أي قضية ولا يطلب أرقام هويات أو صكوك ولا يقدم رأياً قانونياً فاصلاً.",
      en: "MAABAR explains general procedure only; it cannot access cases, never requests IDs, and does not provide legal opinions."
    },
    requiredAuthorities: [
      { ar: "وزارة العدل (محاكم التنفيذ والمحاكم العامة)", en: "Ministry of Justice (Enforcement & General Courts)" },
      { ar: "الهيئة السعودية للبيانات والذكاء الاصطناعي (نفاذ)", en: "SDAIA (Nafath)" },
      { ar: "البنك المركزي السعودي (سداد / أوامر الحجز والتنفيذ)", en: "Saudi Central Bank (SADAD / Enforcement Actions)" },
      { ar: "الأمن العام (تطبيق كلنا أمن للبلاغات الاحتيالية)", en: "Public Security (Kollona Amn app for scam reporting)" }
    ],
    multiPlatformChain: [
      {
        name: { ar: "النفاذ الوطني الموحد (نفاذ)", en: "Nafath SSO" },
        authority: { ar: "سدايا (SDAIA)", en: "SDAIA" },
        role: { ar: "تسجيل الدخول الآمن للتحقق من هوية صاحب البلاغ دون إدخال بيانات سرية في روابط خارجية.", en: "Secure credentials authorization ensuring safety from phishing links." },
        whenNeeded: { ar: "الخطوة الإلزامية الأولى لدخول البوابة والتأكد من صحة التبليغ.", en: "Mandatory initial step before accessing subpoena details." },
        url: "https://www.iam.gov.sa/"
      },
      {
        name: { ar: "بوابة ناجز (najiz.sa)", en: "Najiz Portal" },
        authority: { ar: "وزارة العدل", en: "Ministry of Justice" },
        role: { ar: "استعراض السند التنفيذي أو قرار 34/46، الاطلاع على رقم الفاتورة أو تقديم منازعة تنفيذية.", en: "Reviewing enforcement deed, article 34/46 decree, SADAD billing ID, or dispute." },
        whenNeeded: { ar: "المنصة الرسمية الوحيدة المعتمدة للتعامل مع الإخطارات القضائية.", en: "The sole official platform for responding to judicial subpoenas." },
        url: "https://new.najiz.sa/"
      },
      {
        name: { ar: "نظام سداد للمدفوعات الحكومية", en: "SADAD Payment" },
        authority: { ar: "البنك المركزي السعودي والبنوك المحلية", en: "Saudi Central Bank & Commercial Banks" },
        role: { ar: "سداد قيمة المطالبة التنفيذية برقم الفاتورة الصادر من محكمة التنفيذ (رمز 169).", en: "Direct settlement of court claims via Ministry of Justice SADAD biller (169)." },
        whenNeeded: { ar: "في حال كان الإشعار سنداً مالياً مطلوباً سداده لإنهاء إجراءات التنفيذ فوراً.", en: "When resolving monetary enforcement decrees to automatically lift restrictions." },
        url: "https://www.sadad.com/"
      },
      {
        name: { ar: "تطبيق كلنا أمن", en: "Kollona Amn App" },
        authority: { ar: "وزارة الداخلية (الأمن العام)", en: "Ministry of Interior (Public Security)" },
        role: { ar: "الإبلاغ عن رسائل الاحتيال والروابط المشبوهة التي تنتحل اسم وزارة العدل أو ناجز.", en: "Filing electronic reports for phishing SMS messages falsely impersonating MOJ." },
        whenNeeded: { ar: "عند ورود رسالة نصية تطلب تحويل أموال أو فتح روابط غير تابعة لنطاق (gov.sa/najiz.sa).", en: "Whenever an unverified SMS solicits money or directs to non-governmental domains." },
        url: "https://www.moi.gov.sa/"
      }
    ]
  }
];
