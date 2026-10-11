export type Lang = "ar" | "en";

export type Localized = { ar: string; en: string };
export type SectorDefinition = {
  id: string;
  name: Localized;
  description: Localized;
  icon: "people" | "traffic" | "business" | "justice" | "work" | "education" | "health";
  artIndex: number;
};
export type CuratedService = {
  id: string;
  sectorId: string;
  name: Localized;
  platform: Localized;
  summary: Localized;
  when: Localized;
  url: string;
  sourceTitle: Localized;
  sourceUrl: string;
  verifiedAt: string;
  verified: "verified" | "destination-limited";
  note: Localized;
};

export const directorySectors: SectorDefinition[] = [
  { id: "public", name: { ar: "الأفراد والخدمات العامة", en: "People & public services" }, description: { ar: "استكشف خدمات الأفراد من مصادرها الرسمية.", en: "Explore public services at their official sources." }, icon: "people", artIndex: 0 },
  { id: "traffic", name: { ar: "المرور والمركبات", en: "Traffic & vehicles" }, description: { ar: "معلومات مرورية وروابط مباشرة للجهة.", en: "Traffic guidance with links to the responsible authority." }, icon: "traffic", artIndex: 1 },
  { id: "business", name: { ar: "التجارة والأعمال", en: "Business" }, description: { ar: "رحلة تأسيس أولية تراعي اختلاف النشاط والشكل النظامي.", en: "A starter route that accounts for activity and legal form." }, icon: "business", artIndex: 2 },
  { id: "work", name: { ar: "العمل والمنشآت", en: "Work & establishments" }, description: { ar: "خدمات قطاع العمل عند الحاجة لإدارة القوى العاملة.", en: "Work-sector services when workforce administration is relevant." }, icon: "work", artIndex: 2 },
  { id: "education", name: { ar: "التعليم", en: "Education" }, description: { ar: "بوابة تعليمية للطلاب وأولياء الأمور ومنسوبي التعليم.", en: "An education portal for students, guardians, and educators." }, icon: "education", artIndex: 0 },
  { id: "health", name: { ar: "الصحة", en: "Health" }, description: { ar: "تعرّف على خدمات صحتي من وزارة الصحة.", en: "Explore Sehhaty services from the Ministry of Health." }, icon: "health", artIndex: 3 },
  { id: "justice", name: { ar: "العدل والخدمات العدلية", en: "Justice" }, description: { ar: "بوابة الخدمات العدلية الرسمية؛ ليست استشارة قانونية.", en: "Official justice services; this is not legal advice." }, icon: "justice", artIndex: 3 },
];

export const curatedServices: CuratedService[] = [
  { id: "civil-appointments", sectorId: "public", name: { ar: "مواعيد الأحوال المدنية", en: "Civil Affairs appointments" }, platform: { ar: "أبشر", en: "Absher" }, summary: { ar: "إنشاء المواعيد أو تعديلها لخدمات الأحوال المدنية.", en: "Create or update appointments for Civil Affairs services." }, when: { ar: "عند الحاجة إلى موعد لخدمة أحوال مدنية؛ تحقق من الخدمة والموعد المتاحين في أبشر.", en: "When you need a Civil Affairs appointment; confirm the service and availability in Absher." }, url: "https://www.absher.sa/", sourceTitle: { ar: "دليل خدمات أبشر للأفراد", en: "Absher Individuals service guide" }, sourceUrl: "https://www.absher.sa/", verifiedAt: "2026-10-11", verified: "destination-limited", note: { ar: "الرابط يفتح المدخل العام؛ لم نثبت رابطًا عميقًا ثابتًا للخدمة.", en: "This opens the portal home; a stable deep link was not verified." } },
  { id: "license-renewal", sectorId: "traffic", name: { ar: "تجديد رخصة القيادة", en: "Driving license renewal" }, platform: { ar: "أبشر", en: "Absher" }, summary: { ar: "تتيح أبشر تجديد بعض أنواع رخص القيادة إلكترونيًا وفق شروط الخدمة.", en: "Absher offers online renewal for certain driving license types subject to service conditions." }, when: { ar: "إذا أردت تجديد رخصة قيادة؛ تحقق من نوع الرخصة وأهليتك والمتطلبات في أبشر.", en: "For a driving license renewal; check license type, eligibility, and requirements in Absher." }, url: "https://www.absher.sa/wps/portal/individuals/static/guide/service-contents/%21ut/p/z1/rVRdk5owFP0r7oOPTG4ICeERgQVFq6LYlRcG-bBpFV1F2_33javT1nVFnWme4OZ-nntyUIReUFQmezFPKrEqk4X8n0YsxtjmnupCF77YJjAfqDMxuhgwRV_PHTi1CQwtx_ds7JJhCCiS10ztWtjjqg8TZsPQUQecPmMVfHKKhyvHPMbfXx-CoQXMMh3a1yak72u36k9QhKJ1KjI0JXzGdE5BoTxLFI2nTEkKLVd4kcwIpgZPsvzgnZbVuvqGpumqrPKy2jZBlJnYi2yXLLaNZNOEfJtv9iLNt42d_GrMdyLL_7E2odokRSFS5cISnyz4NNifzvtj24Chr-vQUwdYQnMOjNsZUmB9bBq9Xp9wzD4F1oRWoLYIgNtXz4G5TH-MbwE4RgubAGFAoa2PJPjqM9bG6n2LrXG4qz61Blab9wh2B6EuK-tax2K-OwH9QWJwP5D1rQHDY88jvEUfJdaFQ1TP2w_xlwuK6turx6_Nbu8_ql3RIcOHHi7f7q0h6zPY-NMM5yx8d3AxNo9zuIEqM5iY6GYL8wPM7w51PLiF5FQiqV-nmqTqXuQ_UViuNkspeaO_ipAVWqZlmCugqVIRGM2kIswyRZ8ZhZ4XYMyYgTxAnVtkljIqvr--RqZUj4Nq_KrQy3X5KDZ5nq2W8aqIRVkcujqocbxeLUT6Fieb00TXuOmx6xPdpXGdW2_jsXH-hxqO8hKtl2EYLjl5E6ej_AicwCl6DtGiGZ0v417Fzaen38qihhs%21/dz/d5/L0lHSkovd0RNQVBrQUVnQSEhLzROVkUvYXI%21", sourceTitle: { ar: "أبشر: تجديد رخصة القيادة", en: "Absher: Driving license renewal" }, sourceUrl: "https://www.absher.sa/wps/portal/individuals/static/guide/service-contents/%21ut/p/z1/rVRdk5owFP0r7oOPTG4ICeERgQVFq6LYlRcG-bBpFV1F2_33javT1nVFnWme4OZ-nntyUIReUFQmezFPKrEqk4X8n0YsxtjmnupCF77YJjAfqDMxuhgwRV_PHTi1CQwtx_ds7JJhCCiS10ztWtjjqg8TZsPQUQecPmMVfHKKhyvHPMbfXx-CoQXMMh3a1yak72u36k9QhKJ1KjI0JXzGdE5BoTxLFI2nTEkKLVd4kcwIpgZPsvzgnZbVuvqGpumqrPKy2jZBlJnYi2yXLLaNZNOEfJtv9iLNt42d_GrMdyLL_7E2odokRSFS5cISnyz4NNifzvtj24Chr-vQUwdYQnMOjNsZUmB9bBq9Xp9wzD4F1oRWoLYIgNtXz4G5TH-MbwE4RgubAGFAoa2PJPjqM9bG6n2LrXG4qz61Blab9wh2B6EuK-tax2K-OwH9QWJwP5D1rQHDY88jvEUfJdaFQ1TP2w_xlwuK6turx6_Nbu8_ql3RIcOHHi7f7q0h6zPY-NMM5yx8d3AxNo9zuIEqM5iY6GYL8wPM7w51PLiF5FQiqV-nmqTqXuQ_UViuNkspeaO_ipAVWqZlmCugqVIRGM2kIswyRZ8ZhZ4XYMyYgTxAnVtkljIqvr--RqZUj4Nq_KrQy3X5KDZ5nq2W8aqIRVkcujqocbxeLUT6Fieb00TXuOmx6xPdpXGdW2_jsXH-hxqO8hKtl2EYLjl5E6ej_AicwCl6DtGiGZ0v417Fzaen38qihhs%21/dz/d5/L0lHSkovd0RNQVBrQUVnQSEhLzROVkUvYXI%21", verifiedAt: "2026-10-11", verified: "verified", note: { ar: "دليل أبشر يذكر أن التجديد يقتصر على أنواع محددة؛ راجع الشروط الحالية مباشرة.", en: "Absher's guide limits renewal to specified license types; check current conditions directly." } },
  { id: "traffic-violations", sectorId: "traffic", name: { ar: "الاستعلام عن المخالفات المرورية", en: "Traffic violation inquiry" }, platform: { ar: "أبشر", en: "Absher" }, summary: { ar: "خدمة للاستعلام عن المخالفات المرورية عبر الجهة الرسمية.", en: "Check traffic violations through the official portal." }, when: { ar: "إذا أردت الاستعلام عن مخالفة؛ لا تدخل رقم الهوية أو بيانات الدخول في MYSER.", en: "For a violation inquiry; do not enter identity or sign-in details in MYSER." }, url: "https://www.absher.sa/wps/vanityurl/ar/querytrafficviolationinquiry", sourceTitle: { ar: "أبشر: الاستعلام عن المخالفات المرورية", en: "Absher: Traffic violation inquiry" }, sourceUrl: "https://www.absher.sa/wps/vanityurl/ar/querytrafficviolationinquiry", verifiedAt: "2026-10-11", verified: "verified", note: { ar: "تختلف متطلبات الدخول والبيانات حسب الخدمة الرسمية.", en: "Sign-in and data requirements are set by the official service." } },
  { id: "sole-proprietorship-cr", sectorId: "business", name: { ar: "قيد سجل تجاري لمؤسسة فردية", en: "Register a sole proprietorship CR" }, platform: { ar: "وزارة التجارة / المركز السعودي للأعمال", en: "Ministry of Commerce / Saudi Business Center" }, summary: { ar: "خدمة قيد سجل تجاري لمؤسسة فردية؛ لا تنطبق تلقائيًا على جميع الأشكال القانونية.", en: "A Commercial Registration service for a sole proprietorship; it does not automatically apply to every legal form." }, when: { ar: "بعد تحديد النشاط والشكل القانوني. قد يتطلب النشاط موافقة مسبقة من جهة مختصة.", en: "After identifying activity and legal form. Some activities may require prior approval." }, url: "https://mc.gov.sa/ar/eservices/pages/ServiceDetails.aspx?sID=38", sourceTitle: { ar: "وزارة التجارة: قيد سجل تجاري لمؤسسة فردية", en: "Ministry of Commerce: Sole proprietorship CR" }, sourceUrl: "https://mc.gov.sa/ar/eservices/pages/ServiceDetails.aspx?sID=38", verifiedAt: "2026-10-11", verified: "verified", note: { ar: "تحقق من الأهلية والمتطلبات والرسوم الحالية في المصدر الرسمي.", en: "Confirm eligibility, requirements, and current fees at the official source." } },
  { id: "company-formation", sectorId: "business", name: { ar: "تأسيس شركة", en: "Company formation" }, platform: { ar: "وزارة التجارة / المركز السعودي للأعمال", en: "Ministry of Commerce / Saudi Business Center" }, summary: { ar: "إرشاد عام لبدء تأسيس شركة؛ يختلف المسار بحسب النوع النظامي والشركاء.", en: "General orientation for company formation; the route varies by legal type and partners." }, when: { ar: "إذا كان خيارك شركة؛ راجع النوع النظامي المناسب ومتطلباته قبل التقديم.", en: "If you are forming a company, review the applicable legal type and requirements before applying." }, url: "https://mc.gov.sa/ar/FAQ/pages/default.aspx", sourceTitle: { ar: "وزارة التجارة: إجراء تأسيس شركة", en: "Ministry of Commerce: Company formation procedure" }, sourceUrl: "https://mc.gov.sa/ar/FAQ/pages/default.aspx", verifiedAt: "2026-10-11", verified: "verified", note: { ar: "هذه الصفحة إرشاد من الأسئلة الشائعة، وليست تحققًا من أهليتك القانونية.", en: "This FAQ is general guidance, not a determination of legal eligibility." } },
  { id: "balady-license", sectorId: "business", name: { ar: "إصدار رخصة تجارية", en: "Commercial license" }, platform: { ar: "بلدي", en: "Balady" }, summary: { ar: "خدمة إصدار رخصة لممارسة نشاط تجاري وفق متطلبات النشاط والموقع.", en: "A license service for commercial activities, subject to activity and location requirements." }, when: { ar: "تحقق من انطباق الرخصة والاشتراطات على نشاطك وموقعك لدى بلدي.", en: "Check with Balady whether this license and its requirements apply to your activity and location." }, url: "https://balady.gov.sa/ar/services?id=159", sourceTitle: { ar: "بلدي: إصدار رخصة تجارية", en: "Balady: Commercial license issuance" }, sourceUrl: "https://balady.gov.sa/ar/services?id=159", verifiedAt: "2026-10-11", verified: "destination-limited", note: { ar: "أعاد رابط الخدمة التوجيه إلى فهرس الخدمات أثناء التحقق؛ راجع المسار الحالي لدى بلدي.", en: "The service URL redirected to the service index during review; confirm the current route with Balady." } },
  { id: "vat-registration", sectorId: "business", name: { ar: "التسجيل في ضريبة القيمة المضافة للمنشآت", en: "Business VAT registration" }, platform: { ar: "هيئة الزكاة والضريبة والجمارك", en: "Zakat, Tax and Customs Authority" }, summary: { ar: "تسجيل للمنشآت التي تنطبق عليها معايير التسجيل الإلزامي أو الاختياري.", en: "Registration for businesses meeting mandatory or voluntary registration criteria." }, when: { ar: "عند انطباق معايير التسجيل على منشأتك؛ تحقق من القواعد الحالية لدى الهيئة.", en: "When your business meets registration criteria; verify current rules with ZATCA." }, url: "https://zatca.gov.sa/ar/eServices/Pages/eServices-001.aspx", sourceTitle: { ar: "زاتكا: التسجيل في ضريبة القيمة المضافة للمنشآت", en: "ZATCA: Business VAT registration" }, sourceUrl: "https://zatca.gov.sa/ar/eServices/Pages/eServices-001.aspx", verifiedAt: "2026-10-11", verified: "verified", note: { ar: "لا يعني تأسيس كل منشأة أنها ملزمة بالتسجيل؛ لم نعرض حدودًا رقمية.", en: "Formation alone does not mean every business must register; no numeric thresholds are shown here." } },
  { id: "qiwa", sectorId: "work", name: { ar: "خدمات قوى لقطاع العمل", en: "Qiwa work-sector services" }, platform: { ar: "قوى — وزارة الموارد البشرية والتنمية الاجتماعية", en: "Qiwa — Ministry of Human Resources and Social Development" }, summary: { ar: "منصة لخدمات قطاع العمل؛ ليست خطوة تأسيس لازمة لكل منشأة.", en: "A work-sector services platform; not a required formation step for every business." }, when: { ar: "عند الحاجة إلى خدمات العمل وإدارة القوى العاملة.", en: "When you need work-sector or workforce services." }, url: "https://www.qiwa.sa/", sourceTitle: { ar: "وزارة الموارد البشرية: منصات الوزارة", en: "HRSD: Ministry platforms" }, sourceUrl: "https://www.hrsd.gov.sa/ministry-platforms", verifiedAt: "2026-10-11", verified: "destination-limited", note: { ar: "المصدر الوزاري يعرّف المنصة؛ تعذر فتح وجهة قوى مباشرة أثناء التحقق.", en: "The ministry source identifies the platform; its destination could not be opened directly during review." } },
  { id: "noor", sectorId: "education", name: { ar: "نظام نور", en: "Noor education system" }, platform: { ar: "وزارة التعليم", en: "Ministry of Education" }, summary: { ar: "نظام معلومات تعليمي لمتابعة خدمات الطلاب وأولياء الأمور.", en: "An education information system supporting student and guardian services." }, when: { ar: "للوصول إلى خدمات التعليم المتاحة بحسب دور المستخدم.", en: "For education services available to the relevant user role." }, url: "https://noor.moe.gov.sa/Noor/", sourceTitle: { ar: "وزارة التعليم: نظام نور", en: "Ministry of Education: Noor" }, sourceUrl: "https://www.moe.gov.sa/ar/aboutus/Portal/Application/Pages/Noor.aspx/statements/ar.html", verifiedAt: "2026-10-11", verified: "verified", note: { ar: "قد يعيد النظام التوجيه إلى صفحة تسجيل/تعريف بحسب حالته.", en: "The system may redirect to a login or landing page depending on availability." } },
  { id: "sehhaty", sectorId: "health", name: { ar: "خدمات صحتي", en: "Sehhaty services" }, platform: { ar: "وزارة الصحة", en: "Ministry of Health" }, summary: { ar: "معلومات وخدمات صحية مثل المواعيد والاستشارات وفق ما تتيحه الوزارة.", en: "Health information and services such as appointments and consultations as provided by the ministry." }, when: { ar: "لمراجعة الخدمات الصحية الرقمية المنشورة من وزارة الصحة.", en: "To explore digital health services published by the Ministry of Health." }, url: "https://www.moh.gov.sa/support/pages/sehhatyapp.aspx", sourceTitle: { ar: "وزارة الصحة: تطبيق صحتي", en: "Ministry of Health: Sehhaty" }, sourceUrl: "https://www.moh.gov.sa/support/pages/sehhatyapp.aspx", verifiedAt: "2026-10-11", verified: "verified", note: { ar: "لا تُدخل بيانات صحية في MYSER؛ انتقل إلى قناة الوزارة الرسمية.", en: "Do not enter health information in MYSER; use the ministry's official channel." } },
  { id: "najiz", sectorId: "justice", name: { ar: "منصة ناجز للخدمات العدلية", en: "Najiz justice services" }, platform: { ar: "وزارة العدل", en: "Ministry of Justice" }, summary: { ar: "بوابة الوزارة للخدمات العدلية الإلكترونية.", en: "The ministry's portal for electronic justice services." }, when: { ar: "للوصول إلى خدمة عدلية منشورة؛ استشر مختصًا عند الحاجة إلى رأي قانوني.", en: "To access a published justice service; consult a qualified professional for legal advice." }, url: "https://new.najiz.sa/", sourceTitle: { ar: "وزارة العدل: بوابة الوزارة وروابط ناجز", en: "Ministry of Justice: Ministry portal and Najiz links" }, sourceUrl: "https://www.moj.gov.sa/ar/pages/default.aspx/", verifiedAt: "2026-10-11", verified: "destination-limited", note: { ar: "موقع الوزارة يربط بناجز؛ تعذر فتح وجهة المنصة مباشرة أثناء التحقق.", en: "The ministry site links to Najiz; the platform destination could not be opened directly during review." } },
];

export type AssistantScenario = {
  id: string;
  keywords: string[];
  sectorId: string;
  response: Localized;
};

// Local keyword-based demo guidance. This is intentionally not a live AI or authority integration.
export const assistantScenarios: AssistantScenario[] = [
  { id: "business-start", keywords: ["تجار", "نشاط", "business", "commercial", "بلدي"], sectorId: "business", response: { ar: "لبدء استكشاف نشاط تجاري، ابدأ بتحديد النشاط والشكل القانوني. تختلف الخطوات والموافقات بحسب الحالة؛ راجع المصادر الرسمية ولا تعتبر كل خطوة شرطًا عامًا.", en: "To explore starting a business, first identify the activity and legal form. Steps and approvals vary; review official sources and do not treat every step as a universal requirement." } },
  { id: "license-renewal", keywords: ["رخص", "قياد", "driv", "licen"], sectorId: "traffic", response: { ar: "راجع خدمة تجديد رخصة القيادة في أبشر. تتغير الأهلية والمتطلبات حسب نوع الرخصة؛ تحقق منها لدى المصدر الرسمي قبل المتابعة.", en: "Review the driving license renewal service in Absher. Eligibility and requirements depend on license type; confirm them with the official source before proceeding." } },
  { id: "traffic-violations", keywords: ["مخالف", "violation", "fine"], sectorId: "traffic", response: { ar: "يمكنك الاستعلام عن المخالفات عبر خدمة أبشر الرسمية. لا تدخل رقم الهوية أو بيانات الدخول في MYSER؛ المثال في المحفظة تجريبي فقط.", en: "Use the official Absher service to check traffic violations. Do not enter identity or sign-in details in MYSER; the wallet example is only a demo." } },
  { id: "civil-appointment", keywords: ["موعد", "أحوال", "هوي", "إقام", "appointment", "civil", "national id", "iqama"], sectorId: "public", response: { ar: "استكشف خدمة مواعيد الأحوال المدنية من مدخل أبشر الرسمي، ثم تحقق من نوع الموعد وشروطه المتاحة هناك. لا تُدخل بيانات الهوية في MYSER.", en: "Open the official Absher portal to explore Civil Affairs appointments, then confirm the appointment type and current requirements there. Do not enter identity details in MYSER." } },
  { id: "justice", keywords: ["قض", "وكال", "عدل", "court", "legal", "attorney"], sectorId: "justice", response: { ar: "استكشف منصة ناجز للخدمات العدلية عبر الرابط الرسمي. يقتصر دور MYSER على الدليل، ولا يقدم استشارة قانونية أو معاملة.", en: "Explore justice services through the official Najiz link. MYSER is a guide only and does not provide legal advice or process transactions." } },
];

export const assistantFallback: Localized = {
  ar: "أهلاً بك. أستطيع إرشادك في الخدمات الموجودة في الدليل، مثل المرور والأعمال والأحوال المدنية. اكتب احتياجك لأقترح القطاع المناسب. هذا مساعد تجريبي بإجابات محددة مسبقًا.",
  en: "Welcome. I can guide you through topics in this directory, including traffic, business, and public services. Describe what you need and I will suggest a relevant sector. This demo uses predefined responses.",
};

export const copy = {
  ar: {
    home: "الرئيسية",
    services: "الخدمات",
    experiences: "التجارب الرقمية",
    assistant: "مساعد مُيسّرة الإرشادي",
    about: "عن مُيسّرة",
    start: "ابدأ الآن",
    explore: "استكشف المنصة",
    eyebrow: "دليلك الميسّر للخدمات والمنصات الرسمية",
    headline1: "استكشف خدماتك الرقمية،",
    headline2: "بخطوات أوضح ومصادر موثوقة.",
    sub: "منصة إرشادية سعودية مستقلة تساعدك على فهم الإجراءات والوصول المباشر إلى المنصات والخدمات الحكومية الرسمية.",
    demo: "منتج استرشادي سعودي · مستقل",
    welcome: "مرحباً بك في مُيسّرة",
    help: "ما المعاملة أو الخدمة التي ترغب في الوصول إليها؟",
    input: "اكتب ما تبحث عنه (مثال: تجديد رخصة، سجل تجاري)...",
    smart: "المساعد الإرشادي",
    online: "توجيه تفاعلي فوري لمصادر الخدمات",
    suggested: "جرّب أن تسأل",
    chips: [
      "أريد تجديد رخصة القيادة",
      "كيف أبدأ نشاط تجاري؟",
      "أريد الاستعلام عن مخالفة",
      "أريد حجز موعد في الأحوال المدنية",
    ],
    statLabels: [
      "خدمة رسمية موثقة",
      "قطاعات في الدليل",
      "لغتان متاحتان",
      "دليل استرشادي مستقل",
    ],
    one: "مستقل",
    scroll: "استعرض القطاعات",
    journeyLabel: "تسلسل الخدمة",
    journeyTitle: "من تحديد الاحتياج، إلى المنصة الرسمية.",
    journeySub: "خطوات مدروسة توضح لك المتطلبات والمسار النظامي قبل الانتقال إلى بوابة الجهة المعنية.",
    sectorLabel: "القطاعات المتاحة",
    sectorTitle: "اختر القطاع للوصول إلى خدماته ومنصاته.",
    sectorSub: "معلومات موثقة وروابط مباشرة للمنصات الرسمية، دون إدخال بيانات حساسة داخل مُيسّرة.",
    all: "استعراض جميع الخدمات",
    govTitle: "حضور الجلسات القضائية\nوالتوجيه العدلي عن بُعد.",
    govSub:
      "تصوّر استرشادي لمحاكاة إجراءات الحضور والترافع الإلكتروني في الجلسات القضائية عبر منصة ناجز. هذه الواجهة محاكاة توضيحية وليست جلسة حقيقية أو اتصالاً بوزارة العدل.",
    govButton: "استكشف تصور GovMeet",
    new: "محاكاة توضيحية",
    meetingTitle: "الجلسة القضائية الإلكترونية (محاكاة)",
    participant: "ناظر القضية / الدائرة القضائية",
    you: "المدعي / المدعى عليه (أنت)",
    live: "جلسة توضيحية مباشرة",
    notes: "تعليمات حضور الجلسة وبيانات القضية",
    note1: "التحقق من بيانات الدعوى ورقم القضية في ناجز",
    note2: "التحقق من الرخصة البلدية أو المستندات الثبوتية ذات الصلة بالدعوى",
    note3: "الالتزام بآداب المرافعة الرقمية وضوابط وزارة العدل الرسمية",
    walletLabel: "الرسوم والمدفوعات",
    walletTitle: "استعراض شامل لرسوم الخدمات\nوالالتزامات المالية.",
    walletSub: "نموذج تصوري يجمع فواتير الرسوم الحكومية ومتابعتها في مكان واحد لتسهيل التخطيط المالي.",
    total: "إجمالي الرسوم الموضحة",
    currency: "ر.س",
    pay: "دفع تجريبي",
    paid: "تم الدفع",
    walletDemo: "بيانات توضيحية تجريبية · لا تتم أي عمليات مالية فعلية",
    appLabel: "تجربة الجوال",
    appTitle: "خدماتك في متناول يدك،\nأينما كنت.",
    appSub:
      "تصوّر لتطبيق جوال يجمع بين استكشاف الخدمات وتنبيهات الإجراءات وتوجيهات المساعد الإرشادي.",
    soon: "قريباً على",
    appNotice: "تصوّر رقمي مستقبلي — التطبيق غير متاح للتحميل حالياً",
    greeting: "مرحباً، عبدالله",
    appGreeting: "ما الخدمة التي تحتاجها اليوم؟",
    appSearch: "ابحث في دليل الخدمات...",
    requests: "المعاملات الإرشادية",
    notifications: "التنبيهات",
    activeRequest: "طلب تجريبي: تجديد رخصة القيادة",
    processing: "بانتظار الإجراء",
    progress: "متابعة توضيحية · غير متصلة بأنظمة الجهة",
    assistantAnswer:
      "يمكنك تجديد رخصة القيادة إلكترونياً عبر منصة أبشر الرسمية بعد استيفاء الفحص الطبي وسداد الرسوم المعتمدة.",
    ctaTitle: "ابدأ من احتياجك الفعلي،\nوانتقل مباشرة للمصدر الرسمي.",
    ctaSub: "استعرض القطاعات الخدمية واختر الخدمة المناسبة لمعرفة اشتراطاتها ورابطها المباشر.",
    footer: "منتج استرشادي سعودي يربط المستفيدين بالخدمات والمنصات الحكومية الرسمية.",
    independent:
      "منصة توجيهية مستقلة غير تابعة لأي جهة حكومية. تهدف إلى تيسير المعرفة والربط بالمصادر الرسمية المعتمدة.",
    rights: "© 2026 مُيسّرة. جميع الحقوق محفوظة.",
    privacy: "الخصوصية",
    terms: "الشروط والأحكام",
    close: "إغلاق",
    serviceSearch: "ابحث بالخدمة، المنصة، أو الجهة...",
    details: "تفاصيل الخدمة",
    requirements: "الاشتراطات والمتطلبات",
    beginDemo: "بدء الطلب التجريبي",
    sent: "تم إنشاء طلبك التجريبي",
    requestHint: "يمكنك متابعة حالته هنا. لم يُرسل إلى أي جهة حكومية.",
    requestNumber: "رقم الطلب",
    back: "العودة إلى الدليل",
    secure: "تجربة إرشادية موثوقة ومصممة لك",
    voice: "الكتابة متاحة حالياً؛ الإدخال الصوتي ضمن التصوّر.",
    joined: "تم الانضمام إلى الجلسة التجريبية",
    join: "انضم للجلسة",
    leave: "مغادرة",
    paymentSuccess: "تم تسجيل الدفع التجريبي بنجاح",
    paymentAlready: "تم سداد كافة الرسوم المعروضة",
    policyText:
      "هذا نموذج عرض مستقل. تبقى تفاعلاتك ضمن جلسة المتصفح، ولا تُرسل البيانات إلى جهات حكومية أو مزوّدي دفع. لا تدخل معلومات شخصية أو بيانات مالية حقيقية.",
    termsText:
      "مُيسّرة في هذه النسخة تصور واجهة مستقل لاستكشاف الخدمات الرقمية. بيانات الخدمات والرسوم والطلبات والاجتماعات أمثلة توضيحية، ولا تنفذ هذه التجربة طلبًا رسميًا أو معاملة مالية.",
    stepTitles: [
      "تحديد نوع الاحتياج",
      "استشارة المساعد الإرشادي",
      "استعراض دليل المتطلبات",
      "التحقق من الأهلية والشروط",
      "الانتقال للمنصة الحكومية",
      "الرجوع للدليل عند الحاجة",
    ],
    stepDescriptions: [
      "اختر القطاع أو اكتب الخدمة التي تبحث عنها بوضوح.",
      "احصل على توجيه فوري للمنصة الرسمية المعنية بالمعاملة.",
      "اطّلع على متطلبات الخدمة والروابط المباشرة المعتمدة.",
      "تأكد من استيفاء الشروط الخاصة بحالتك قبل بدء التنفيذ.",
      "أكمل إجراءاتك الرسمية بأمان تام داخل بوابة الجهة الحكومية.",
      "ارجع إلى الدليل في أي وقت لاستكشاف خدمات وقطاعات أخرى.",
    ],
    bills: ["تجديد رخصة القيادة", "مخالفة مرورية", "إصدار سجل تجاري"],
    agencies: [
      "الإدارة العامة للمرور",
      "الإدارة العامة للمرور",
      "وزارة التجارة",
    ],
  },
  en: {
    home: "Home",
    services: "Services",
    experiences: "Digital experiences",
    assistant: "Myser guided assistant",
    about: "About",
    start: "Get started",
    explore: "Explore Myser",
    eyebrow: "A simpler life. A smarter future.",
    headline1: "Explore digital services.",
    headline2: "With greater clarity.",
    sub: "An independent Saudi concept for exploring digital services and understanding their steps through one clear, bilingual experience.",
    demo: "Saudi vision · Independent concept",
    welcome: "Welcome to Myser",
    help: "How can I make your day easier?",
    input: "Tell us what you need...",
    smart: "Myser guided assistant",
    online: "A guided demo in your preferred language",
    suggested: "Try asking",
    chips: [
      "Renew my driving license",
      "How do I start a business?",
      "Check a traffic violation",
      "Book a Civil Affairs appointment",
    ],
    statLabels: [
      "Official links in this guide",
      "Sectors in the guide",
      "Languages available",
      "No government connection",
    ],
    one: "Independent",
    scroll: "Discover the possibilities",
    journeyLabel: "Your journey",
    journeyTitle: "From your need to the right official source.",
    journeySub: "An exploratory guide to where you might start and when to use the official service.",
    sectorLabel: "A world of services",
    sectorTitle: "Explore a focused service guide.",
    sectorSub: "Official sources and starter guidance; MYSER does not submit transactions.",
    all: "Explore services",
    govTitle: "Virtual judicial sessions\nand court guidance.",
    govSub:
      "A conceptual guide simulating remote courtroom proceedings and attendance via the official Najiz portal. This is an illustrative simulation, not a live court session or connection to the Ministry of Justice.",
    govButton: "View the GovMeet concept",
    new: "Court simulation",
    meetingTitle: "Virtual judicial hearing (Simulation)",
    participant: "Judicial panel / Judge",
    you: "Litigant / Representative (You)",
    live: "Demo court preview",
    notes: "Session instructions & case data",
    note1: "Verify case number and claim records in Najiz",
    note2: "Check supporting municipal license or case evidence",
    note3: "Adhere to digital court etiquette and Ministry of Justice rules",
    walletLabel: "Clarity in every transaction",
    walletTitle: "A wallet concept.\nNot connected to an authority.",
    walletSub:
      "A concept for viewing fees and bills together. The amounts shown are illustrative examples.",
    total: "Illustrative fees shown",
    currency: "SAR",
    pay: "Demo pay",
    paid: "Paid",
    walletDemo: "Demo data · No real financial transactions",
    appLabel: "Myser, wherever you are",
    appTitle: "Life moves.\nMyser moves with you.",
    appSub:
      "A phone interface concept for exploring services, viewing a demo request, and finding guidance.",
    soon: "Coming soon to",
    appNotice: "Concept app — not currently available to download",
    greeting: "Good morning, Abdullah",
    appGreeting: "How can we simplify your day?",
    appSearch: "Find a service...",
    requests: "My requests",
    notifications: "Notifications",
    activeRequest: "Demo request: driving license",
    processing: "Under review",
    progress: "Illustrative status · not connected",
    assistantAnswer:
      "Review the driving license renewal service in Absher. Eligibility and requirements depend on license type, so confirm them with the official source.",
    ctaTitle: "A clearer service route.\nStart with what you need.",
    ctaSub: "Explore a demo guide that points you to official service sources.",
    footer: "An independent Saudi concept for exploring digital services with clarity.",
    independent:
      "An independent concept, unaffiliated with any government entity. Services and figures are for demonstration only.",
    rights: "© 2026 Myser. All rights reserved.",
    privacy: "Privacy",
    terms: "Terms",
    close: "Close",
    serviceSearch: "Find the service you need",
    details: "Service details",
    requirements: "Requirements",
    beginDemo: "Start demo request",
    sent: "Your demo request has been created",
    requestHint:
      "Track its status here. Nothing was submitted to a government entity.",
    requestNumber: "Request number",
    back: "Back to services",
    secure: "A guided experience, designed for you",
    voice: "Text input is available; voice input is part of the concept.",
    joined: "You joined the demo session",
    join: "Join session",
    leave: "Leave",
    paymentSuccess: "Demo payment recorded successfully",
    paymentAlready: "All your payments are complete",
    policyText:
      "This is an independent demonstration. Interactions remain in your browser session and are not sent to government entities or payment providers. Do not enter real personal or financial information.",
    termsText:
      "This version of Myser is an independent interface concept for exploring digital services. Service, fee, request, and meeting details are illustrative; the demo does not submit official requests or make financial transactions.",
    stepTitles: [
      "Start with your need",
      "Ask the guided assistant",
      "Review the service guide",
      "Check whether it applies",
      "Continue at the official authority",
      "Return to this guide if useful",
    ],
    stepDescriptions: [
      "Describe what you are looking for.",
      "A local guided demo, not a connected AI service.",
      "Review the links and sources in the guide.",
      "Requirements vary with your situation and activity.",
      "Complete the process on the authority's official site.",
      "No live government status sync is available here.",
    ],
    bills: [
      "Driving license renewal",
      "Traffic violation",
      "Commercial Registration",
    ],
    agencies: [
      "General Department of Traffic",
      "General Department of Traffic",
      "Ministry of Commerce",
    ],
  },
};
