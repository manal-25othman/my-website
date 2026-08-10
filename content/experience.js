/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  الخبرة المهنية  /  Professional experience
 * ═══════════════════════════════════════════════════════════════════════════
 *  ⚠️ لا تُدرج أي جهة عمل أو مسمى وظيفي أو إنجاز غير حقيقي.
 *
 *  لإضافة وظيفة: انسخ أي كائن، ضعه في أعلى المصفوفة، وعدّل الحقول.
 *  الترتيب في المصفوفة = ترتيب العرض (الأحدث أولاً).
 *
 *   organization      اسم الجهة
 *   role              المسمى الوظيفي
 *   startDate/endDate '2022-03'  ·  endDate: null تعني «حتى الآن»
 *   location          الموقع
 *   summary           سطر واحد يلخص الدور (يظهر دائماً)
 *   responsibilities  []  المسؤوليات      ┐ تظهر عند فتح البطاقة
 *   achievements      []  أبرز الإنجازات  │  (أرقام حقيقية فقط)
 *   stack             []  الأنظمة والتقنيات ┘
 *   placeholder       احذفه بعد تعبئة البيانات الحقيقية
 * ═══════════════════════════════════════════════════════════════════════════
 */

export default [
  {
    organization: { ar: '[اسم الجهة]', en: '[Organisation name]' },
    role: { ar: '[المسمى الوظيفي]', en: '[Job title]' },
    startDate: null, // مثال: '2022-03'
    endDate: null, // null = حتى الآن
    period: { ar: '[—— — حتى الآن]', en: '[—— — Present]' }, // يُستخدم إن لم تُضبط التواريخ
    current: true,
    location: { ar: '[المدينة، الدولة]', en: '[City, Country]' },
    summary: {
      ar: '[سطر واحد يصف طبيعة الدور ونطاق المسؤولية.]',
      en: '[One line describing the role and scope of responsibility.]',
    },
    responsibilities: {
      ar: ['[المسؤولية الأولى.]', '[المسؤولية الثانية.]', '[المسؤولية الثالثة.]'],
      en: ['[First responsibility.]', '[Second responsibility.]', '[Third responsibility.]'],
    },
    achievements: {
      ar: ['[الإنجاز الأول — استخدم رقماً حقيقياً قابلاً للتحقق إن أمكن.]'],
      en: ['[First achievement — use a real, verifiable number where possible.]'],
    },
    stack: ['[النظام / التقنية]'],
    placeholder: true, // ← احذف هذا السطر بعد التعبئة
  },
  {
    organization: { ar: '[اسم الجهة السابقة]', en: '[Previous organisation]' },
    role: { ar: '[المسمى الوظيفي]', en: '[Job title]' },
    startDate: null,
    endDate: null,
    period: '[—— — ——]',
    current: false,
    location: { ar: '[المدينة، الدولة]', en: '[City, Country]' },
    summary: {
      ar: '[سطر واحد يصف طبيعة الدور ونطاق المسؤولية.]',
      en: '[One line describing the role and scope of responsibility.]',
    },
    responsibilities: {
      ar: ['[المسؤولية الأولى.]', '[المسؤولية الثانية.]'],
      en: ['[First responsibility.]', '[Second responsibility.]'],
    },
    achievements: { ar: [], en: [] },
    stack: ['[النظام / التقنية]'],
    placeholder: true,
  },
];
