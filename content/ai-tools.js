/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  دليل أدوات الذكاء الاصطناعي  /  AI tools directory
 * ═══════════════════════════════════════════════════════════════════════════
 *  ⚠️ لا تُدرج تقييماً أو مراجعة لأداة لم تجرّبها بنفسك.
 *     أي أداة عليها  placeholder: true  تظهر بشارة «نموذج» ولا تُفهرَس
 *     في محركات البحث حتى تستبدلها بمحتواك.
 *
 *  كل أداة تحصل على صفحة مستقلة:  /ai-tools/<slug>/
 *
 *   name          اسم الأداة (نص واحد — لا يُترجم عادةً)
 *   slug          معرّف الرابط (إنجليزي، بدون مسافات)  ← لا تغيّره بعد النشر
 *   category      يجب أن يطابق أحد ids في categories بالأسفل
 *   logo          اسم ملف داخل src/assets/img/tools/ — أو null (يُعرض الحرف الأول)
 *   summary       وصف مختصر يظهر على البطاقة
 *   whatItDoes    شرح أطول لصفحة الأداة
 *   rating        تقييمك من 5 (يقبل الكسور: 4.5) — أو null إن لم تُقيَّم بعد
 *   bestFor       أفضل حالة استخدام
 *   pricing       نص حر: مجاني · مجاني مع خطة مدفوعة · مدفوع · تجربة مجانية
 *   review        تجربتك بكلماتك أنت
 *   pros / cons   []  ما يميزها / حدودها
 *   whoFor        لمن تُناسب
 *   url           الموقع الرسمي
 *   articleSlugs  []  slugs مقالات مرتبطة من content/articles
 *   tiktokUrl     رابط مقطع TikTok شرحت فيه الأداة — أو null
 *   featured      true لعرضها في «أبرز المحتوى» بالصفحة الرئيسية
 * ═══════════════════════════════════════════════════════════════════════════
 */

export const categories = [
  { id: 'all', label: { ar: 'الكل', en: 'All' } },
  { id: 'assistants', label: { ar: 'مساعدات ذكية', en: 'AI assistants' } },
  { id: 'writing', label: { ar: 'كتابة', en: 'Writing' } },
  { id: 'design', label: { ar: 'تصميم', en: 'Design' } },
  { id: 'image', label: { ar: 'توليد الصور', en: 'Image generation' } },
  { id: 'video', label: { ar: 'فيديو', en: 'Video' } },
  { id: 'audio', label: { ar: 'صوت', en: 'Audio' } },
  { id: 'research', label: { ar: 'بحث', en: 'Research' } },
  { id: 'productivity', label: { ar: 'إنتاجية', en: 'Productivity' } },
  { id: 'automation', label: { ar: 'أتمتة', en: 'Automation' } },
  { id: 'coding', label: { ar: 'برمجة', en: 'Coding' } },
  { id: 'presentations', label: { ar: 'عروض تقديمية', en: 'Presentations' } },
  { id: 'education', label: { ar: 'تعليم', en: 'Education' } },
  { id: 'business', label: { ar: 'أعمال', en: 'Business' } },
];

export const tools = [
  {
    name: '[اسم الأداة]',
    slug: 'tool-one',
    category: 'assistants',
    logo: null,
    featured: true,
    summary: {
      ar: '[وصف مختصر لما تفعله الأداة في سطر واحد.]',
      en: '[A one-line description of what the tool does.]',
    },
    whatItDoes: {
      ar: '[شرح أوسع: ما الذي تقدمه الأداة، وكيف تعمل، وما الذي يميز طريقتها.]',
      en: '[A fuller explanation: what the tool offers, how it works, what makes its approach distinct.]',
    },
    rating: null, // ← تقييمك الشخصي من 5 بعد التجربة
    bestFor: { ar: '[أفضل استخدام لها.]', en: '[Its best use case.]' },
    pricing: { ar: '[نموذج التسعير]', en: '[Pricing model]' },
    review: {
      ar: '[اكتب هنا تجربتك الفعلية مع الأداة — ما نفع وما لم ينفع.]',
      en: '[Write your actual experience with the tool here — what worked and what did not.]',
    },
    pros: { ar: ['[ميزة أولى]', '[ميزة ثانية]'], en: ['[First advantage]', '[Second advantage]'] },
    cons: { ar: ['[حد أول]'], en: ['[First limitation]'] },
    whoFor: { ar: '[لمن تُناسب هذه الأداة.]', en: '[Who this tool suits.]' },
    url: null, // ← الموقع الرسمي
    articleSlugs: [],
    tiktokUrl: null,
    placeholder: true, // ← احذف بعد التعبئة
  },
  {
    name: '[اسم الأداة]',
    slug: 'tool-two',
    category: 'writing',
    logo: null,
    featured: true,
    summary: {
      ar: '[وصف مختصر لما تفعله الأداة في سطر واحد.]',
      en: '[A one-line description of what the tool does.]',
    },
    whatItDoes: {
      ar: '[شرح أوسع لما تقدمه الأداة.]',
      en: '[A fuller explanation of what the tool offers.]',
    },
    rating: null,
    bestFor: { ar: '[أفضل استخدام لها.]', en: '[Its best use case.]' },
    pricing: { ar: '[نموذج التسعير]', en: '[Pricing model]' },
    review: {
      ar: '[اكتب هنا تجربتك الفعلية مع الأداة.]',
      en: '[Write your actual experience with the tool here.]',
    },
    pros: { ar: ['[ميزة أولى]'], en: ['[First advantage]'] },
    cons: { ar: ['[حد أول]'], en: ['[First limitation]'] },
    whoFor: { ar: '[لمن تُناسب هذه الأداة.]', en: '[Who this tool suits.]' },
    url: null,
    articleSlugs: [],
    tiktokUrl: null,
    placeholder: true,
  },
  {
    name: '[اسم الأداة]',
    slug: 'tool-three',
    category: 'productivity',
    logo: null,
    featured: false,
    summary: {
      ar: '[وصف مختصر لما تفعله الأداة في سطر واحد.]',
      en: '[A one-line description of what the tool does.]',
    },
    whatItDoes: {
      ar: '[شرح أوسع لما تقدمه الأداة.]',
      en: '[A fuller explanation of what the tool offers.]',
    },
    rating: null,
    bestFor: { ar: '[أفضل استخدام لها.]', en: '[Its best use case.]' },
    pricing: { ar: '[نموذج التسعير]', en: '[Pricing model]' },
    review: {
      ar: '[اكتب هنا تجربتك الفعلية مع الأداة.]',
      en: '[Write your actual experience with the tool here.]',
    },
    pros: { ar: [], en: [] },
    cons: { ar: [], en: [] },
    whoFor: { ar: '[لمن تُناسب هذه الأداة.]', en: '[Who this tool suits.]' },
    url: null,
    articleSlugs: [],
    tiktokUrl: null,
    placeholder: true,
  },
];

export default { categories, tools };
