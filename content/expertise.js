/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  التخصصات  /  Expertise
 * ═══════════════════════════════════════════════════════════════════════════
 *  المجموعة الأولى هي التخصص الأساسي وتُعرض بحجم أكبر (feature: true).
 *  احذف أي مجموعة لا تمثل هويتك المهنية الفعلية — خصوصاً المجموعة
 *  الصحية إن لم تكن جزءاً من عملك.
 *
 *  icon: spark | chip | flow | pulse | share | shield
 * ═══════════════════════════════════════════════════════════════════════════
 */

export default [
  {
    id: 'artificial-intelligence',
    icon: 'spark',
    feature: true, // ← التخصص الأساسي
    title: { ar: 'الذكاء الاصطناعي', en: 'Artificial Intelligence' },
    intro: {
      ar: 'المجال الأساسي: استكشاف الأدوات وتقييمها وتوظيفها عملياً.',
      en: 'The core domain: exploring, evaluating and practically applying the tools.',
    },
    items: [
      { ar: 'الذكاء الاصطناعي التوليدي', en: 'Generative AI' },
      { ar: 'أدوات الذكاء الاصطناعي', en: 'AI tools' },
      { ar: 'الإنتاجية بالذكاء الاصطناعي', en: 'AI productivity' },
      { ar: 'الأتمتة بالذكاء الاصطناعي', en: 'AI automation' },
      { ar: 'المساعدات الذكية', en: 'AI assistants' },
      { ar: 'إنتاج المحتوى بالذكاء الاصطناعي', en: 'AI content creation' },
      { ar: 'أدوات البحث بالذكاء الاصطناعي', en: 'AI research tools' },
    ],
  },
  {
    id: 'technology',
    icon: 'chip',
    title: { ar: 'التقنية', en: 'Technology' },
    intro: {
      ar: 'متابعة ما هو جديد، وتبسيطه لمن يحتاج استخدامه.',
      en: 'Following what is new, and making it usable for the people who need it.',
    },
    items: [
      { ar: 'التقنيات الناشئة', en: 'Emerging technologies' },
      { ar: 'التحول الرقمي', en: 'Digital transformation' },
      { ar: 'المنصات التقنية', en: 'Technology platforms' },
      { ar: 'الإنتاجية الرقمية', en: 'Digital productivity' },
      { ar: 'التعليم التقني', en: 'Technology education' },
    ],
  },
  {
    id: 'professional-technology',
    icon: 'pulse',
    /* ⚠️ احذف هذه المجموعة بالكامل إن لم تكن المعلوماتية الصحية
     *    جزءاً من ملفك المهني الفعلي. */
    title: { ar: 'التقنية في القطاع المهني', en: 'Applied professional technology' },
    intro: {
      ar: 'الجانب المؤسسي: الأنظمة والإجراءات والبيانات.',
      en: 'The organisational side: systems, processes and data.',
    },
    items: [
      { ar: 'تقنيات الرعاية الصحية', en: 'Healthcare technology' },
      { ar: 'المعلوماتية الصحية', en: 'Health informatics' },
      { ar: 'نظم المعلومات', en: 'Information systems' },
      { ar: 'الصحة الرقمية', en: 'Digital health' },
    ],
  },
  {
    id: 'knowledge',
    icon: 'share',
    title: { ar: 'المحتوى ونقل المعرفة', en: 'Content & knowledge sharing' },
    intro: {
      ar: 'تحويل التجربة الشخصية إلى معرفة قابلة للتطبيق.',
      en: 'Turning hands-on experience into knowledge people can apply.',
    },
    items: [
      { ar: 'المحتوى التقني', en: 'Technical content' },
      { ar: 'المحتوى التعليمي', en: 'Educational content' },
      { ar: 'مراجعات الأدوات', en: 'Tool reviews' },
      { ar: 'المحتوى القصير', en: 'Short-form video' },
    ],
  },
];
