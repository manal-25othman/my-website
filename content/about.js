/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  من أنا  /  About  —  الإحصائيات، الاهتمامات، التعليم، الشهادات، المسار
 * ═══════════════════════════════════════════════════════════════════════════
 *  ⚠️ لا تُضِف أي شهادة أو مؤهل أو رقم غير حقيقي.
 *     أي حقل قيمته null يظهر كـ «—» بدلاً من رقم مُختلَق.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/* ── شريط المصداقية أسفل الهيرو  /  Trust strip ──────────────────────
 *  value: ضع الرقم الحقيقي فقط. اتركه null ليظهر «—».
 *  auto:  'articles' | 'tools' | 'projects'  ← يُحسب تلقائياً من المحتوى
 *         (يتجاوز value عندما يكون هناك محتوى فعلي غير نموذجي)
 * ─────────────────────────────────────────────────────────────────────── */
export const stats = [
  {
    label: { ar: 'خبرة مهنية', en: 'Years of experience' },
    value: null, // ← ضع عدد السنوات
    suffix: '+',
  },
  {
    label: { ar: 'مقالات', en: 'Articles' },
    value: null,
    auto: 'articles',
  },
  {
    label: { ar: 'أدوات ذكاء اصطناعي', en: 'AI tools reviewed' },
    value: null,
    auto: 'tools',
  },
  {
    label: { ar: 'مشاريع', en: 'Projects' },
    value: null,
    auto: 'projects',
  },
];

/* ── فقرات «من أنا» ─────────────────────────────────────────────────
 *  الفقرة الأولى تظهر دائماً؛ الباقي يظهر عند الضغط على «اقرأ المزيد».
 * ─────────────────────────────────────────────────────────────────── */
export const aboutParagraphs = {
  ar: [
    'اهتمامي الأساسي هو الذكاء الاصطناعي والتقنيات الحديثة: ما الذي ظهر جديداً، وما الذي يستحق فعلاً أن يدخل في يومك المهني. لا أكتفي بقراءة صفحة الأداة — أجرّبها على مهمة حقيقية، ثم أحكم.',
    'خلفيتي العملية تمتد إلى التحول الرقمي وتحسين الإجراءات داخل المؤسسات، وهو ما أعطاني زاوية نظر مختلفة تجاه الأدوات: الأداة الجيدة ليست الأقوى تقنياً، بل التي يستطيع الفريق استخدامها فعلاً دون مقاومة.',
    'من هنا جاءت رسالة المحتوى الذي أنشره: تبسيط التقنية لمن ليست التقنية تخصصهم، وتحويل التجربة الشخصية إلى خطوات قابلة للتطبيق — سواء في مقال مكتوب أو في مقطع قصير.',
  ],
  en: [
    'My primary interest is artificial intelligence and emerging technology: what is genuinely new, and what actually deserves a place in your working day. I do not stop at the product page — I test a tool on a real task, then form a view.',
    'My practical background extends into digital transformation and process improvement inside organisations, which gave me a different lens on tools: the best tool is not the technically strongest one, but the one a team will actually use without resistance.',
    'That is where the mission behind my content comes from: making technology understandable for people whose field is not technology, and turning personal experiments into steps someone can apply — whether in a written article or a short video.',
  ],
};

/* ── رسالة المحتوى  /  Content mission ──────────────────────────────── */
export const mission = {
  ar: 'أن يخرج من يقرأ أو يشاهد محتواي بشيء واحد على الأقل يستطيع تطبيقه في نفس اليوم.',
  en: 'That anyone who reads or watches my content leaves with at least one thing they can apply the same day.',
};

/* ── الاهتمامات التقنية  /  Technology & AI interests ───────────────
 *  icon: spark | flow | pulse | chart | book | shield | chip | wand
 * ─────────────────────────────────────────────────────────────────── */
export const interests = [
  {
    icon: 'spark',
    label: { ar: 'الذكاء الاصطناعي التوليدي', en: 'Generative AI' },
    note: { ar: 'التطبيق العملي في المهام اليومية', en: 'Practical use in everyday tasks' },
  },
  {
    icon: 'wand',
    label: { ar: 'أدوات الذكاء الاصطناعي', en: 'AI tools' },
    note: { ar: 'تجربة ومقارنة ومراجعة صريحة', en: 'Testing, comparing, honest reviews' },
  },
  {
    icon: 'chip',
    label: { ar: 'التقنيات الناشئة', en: 'Emerging technologies' },
    note: { ar: 'متابعة ما يستحق الانتباه فعلاً', en: 'Tracking what genuinely matters' },
  },
  {
    icon: 'flow',
    label: { ar: 'الأتمتة والإنتاجية', en: 'Automation & productivity' },
    note: { ar: 'اختصار الخطوات المتكررة', en: 'Cutting repetitive steps' },
  },
  {
    icon: 'pulse',
    label: { ar: 'التحول الرقمي', en: 'Digital transformation' },
    note: { ar: 'من الإجراء الورقي إلى منصة تُستخدم', en: 'From paper process to a used platform' },
  },
  {
    icon: 'book',
    label: { ar: 'تبسيط التقنية', en: 'Explaining technology' },
    note: { ar: 'محتوى لغير المتخصصين', en: 'Content for non-specialists' },
  },
];

/* ── التعليم  /  Education ──────────────────────────────────────────
 *  اترك المصفوفة فارغة []  ← يختفي القسم تلقائياً.
 * ─────────────────────────────────────────────────────────────────── */
export const education = [
  {
    degree: { ar: '[الدرجة العلمية والتخصص]', en: '[Degree and field]' },
    institution: { ar: '[اسم الجامعة]', en: '[University name]' },
    period: '[——–——]',
    note: { ar: '', en: '' },
    placeholder: true, // ← احذف هذا السطر بعد تعبئة البيانات الحقيقية
  },
];

/* ── الشهادات المهنية  /  Certifications ────────────────────────────
 *  ⚠️ لا تُدرج إلا الشهادات التي تملكها فعلاً.
 * ─────────────────────────────────────────────────────────────────── */
export const certifications = [
  {
    name: { ar: '[اسم الشهادة]', en: '[Certification name]' },
    issuer: { ar: '[الجهة المانحة]', en: '[Issuing organisation]' },
    year: '[——]',
    credentialUrl: null, // رابط التحقق من الشهادة إن وُجد
    placeholder: true,
  },
];

/* ── المسار المهني  /  Journey timeline ─────────────────────────────
 *  type: 'work' | 'education' | 'milestone' | 'content'
 *  أضف عنصراً جديداً في الأعلى ليظهر أولاً.
 * ─────────────────────────────────────────────────────────────────── */
export const journey = [
  {
    year: '[——]',
    type: 'milestone',
    title: { ar: '[محطة مهنية]', en: '[Professional milestone]' },
    description: {
      ar: '[وصف مختصر للمحطة أو التحول في المسار.]',
      en: '[A short description of this milestone or turning point.]',
    },
    placeholder: true,
  },
  {
    year: '[——]',
    type: 'content',
    title: { ar: '[بداية نشر المحتوى التقني]', en: '[Started publishing technology content]' },
    description: {
      ar: '[متى ولماذا بدأت في مشاركة المحتوى.]',
      en: '[When and why you started sharing content.]',
    },
    placeholder: true,
  },
];
