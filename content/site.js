/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  PROFILE  —  الهوية الرقمية المركزية  /  Central digital identity
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  هذا الملف هو المصدر الوحيد للهوية في الموقع بالكامل: الاسم، الصورة،
 *  المسمى المهني، النبذة، والحسابات. كل صفحة وكل بيانات SEO و Schema.org
 *  تقرأ من هنا — لضمان تطابق الهوية في كل مكان.
 *
 *  THIS FILE IS THE SINGLE SOURCE OF TRUTH for identity across the site.
 *
 *  ──────────────────────────────────────────────────────────────────────
 *  🔤  الحقول ثنائية اللغة تُكتب هكذا:   { ar: '…', en: '…' }
 *      أما النص المفرد فيُستخدم كما هو في اللغتين.
 *
 *  ⚠️  كل قيمة بين قوسين مربعين  [ … ]  هي عنصر نائب يجب استبداله.
 *  ⚠️  كل حقل قيمته  null  يظهر كـ «—» ولا يُختلق تلقائياً أبداً.
 *      شغّل  `npm run check`  لعرض قائمة بكل ما لم يُستبدل بعد.
 *  ──────────────────────────────────────────────────────────────────────
 */

const PROFILE = {
  /* ══ 1. الاسم  /  Name ═════════════════════════════════════════════ */
  name: {
    ar: '[الاسم الكامل]', // ← استبدله باسمك بالعربية
    en: '[YOUR NAME]', // ← replace with your name in English
  },

  /* ══ 2. المسمى المهني  /  Professional title ═══════════════════════
   *  التموضع الأساسي: الذكاء الاصطناعي والتقنية.
   *  ⚠️ لا تستخدم مسميات مثل «مهندس / باحث / مستشار / مؤسس / متحدث»
   *     إلا إذا كانت جزءاً من هويتك المهنية الفعلية.
   * ═════════════════════════════════════════════════════════════════ */
  professionalTitle: {
    ar: 'مختص في الذكاء الاصطناعي والتقنية',
    en: 'AI & Technology Professional',
  },

  /* التخصص الثانوي — يظهر كسطر مساند. اجعله null لإخفائه. */
  secondaryTitle: {
    ar: 'التحول الرقمي والمعلوماتية الصحية',
    en: 'Digital Transformation & Health Informatics',
  },

  /* ══ 3. العنوان الرئيسي في الهيرو  /  Hero headline ════════════════ */
  headline: {
    ar: 'أشارك المعرفة والتجارب العملية في الذكاء الاصطناعي والتقنية.',
    en: 'I share practical knowledge and hands-on experience in AI and technology.',
  },

  /* النص المساند تحت العنوان */
  supporting: {
    ar: 'مساحة تجمع خبرتي المهنية، مقالاتي، كتابي، مشاريعي، وأدوات الذكاء الاصطناعي التي أستكشفها وأشارك تجربتي حولها.',
    en: 'One place that brings together my professional experience, articles, book, projects, and the AI tools I explore and share my experience with.',
  },

  /* ══ 4. النبذة  /  Biography ═══════════════════════════════════════ */
  shortBio: {
    ar: 'أستكشف أدوات الذكاء الاصطناعي والتقنيات الحديثة، أجرّبها بنفسي، ثم أشارك ما ينفع منها في العمل اليومي — بلغة عملية بعيدة عن التعقيد.',
    en: 'I explore AI tools and emerging technologies, test them myself, then share what actually works in day-to-day professional work — in plain, practical language.',
  },

  /* النبذة الموسّعة — تظهر في «اقرأ المزيد» وفي الملف التعريفي */
  longBio: {
    ar: [
      'اهتمامي المهني يتركز على الذكاء الاصطناعي والتقنيات الناشئة وكيفية توظيفها بشكل عملي داخل بيئة العمل. أتابع ما يظهر من أدوات، أجرّبها على مهام حقيقية، ثم أكتب ما تعلّمته منها: ما الذي وفّر وقتاً فعلياً، وما الذي بقي وعداً تسويقياً.',
      'إلى جانب ذلك، يمتد اهتمامي إلى التحول الرقمي وتحسين الإجراءات، وإلى تبسيط التقنية لمن ليست التقنية تخصصهم. أرى أن أكبر فجوة اليوم ليست في توفر الأدوات، بل في معرفة متى وكيف تُستخدم.',
      'أنشر خلاصة هذه التجارب في صورة مقالات ومحتوى مرئي قصير، هدفها واحد: أن يخرج القارئ أو المشاهد بشيء قابل للتطبيق في نفس اليوم.',
    ],
    en: [
      'My professional focus is artificial intelligence and emerging technologies — specifically, how to put them to practical use inside real working environments. I follow the tools as they appear, test them on real tasks, then write up what I learned: what genuinely saved time, and what stayed a marketing promise.',
      'Alongside that, my interests extend to digital transformation, process improvement, and making technology understandable for people whose field is not technology. The biggest gap today is not tool availability — it is knowing when and how to use them.',
      'I publish what comes out of these experiments as articles and short-form video, with a single goal: that the reader or viewer leaves with something they can apply the same day.',
    ],
  },

  /* ══ 5. الصور  /  Images ═══════════════════════════════════════════
   *  استبدل الملفات في  src/assets/img/  بنفس الأسماء — لا حاجة لتعديل الكود.
   *  الصورة الشخصية يجب أن تكون نفسها المستخدمة في TikTok و LinkedIn و X
   *  لتعزيز اتساق الهوية الرقمية.
   * ═════════════════════════════════════════════════════════════════ */
  photo: 'img/profile.png', // [YOUR PHOTO] مربعة، 800×800 على الأقل — ضع صورتك في src/assets/img/profile.png
  photoAlt: { ar: 'الصورة الشخصية', en: 'Professional portrait' },
  ogImage: 'img/og-cover.png', // 1200×630 — تظهر عند مشاركة الرابط

  /* ══ 6. التواصل  /  Contact ════════════════════════════════════════ */
  email: '[your@email.com]', // ← استبدله ببريدك المهني
  location: { ar: '[المدينة، الدولة]', en: '[City, Country]' },
  availability: {
    ar: 'مفتوح للتعاون المهني والمشاركات التقنية',
    en: 'Open to professional collaboration and speaking about technology',
  },

  /* ══ 7. الحسابات الرسمية  /  Official accounts ═════════════════════
   *  ⚠️ لا تخترع أسماء مستخدمين. اترك  url: null  لأي حساب غير موجود
   *     وسيختفي تلقائياً من الموقع ومن بيانات sameAs في Schema.org.
   *  ⚠️ استخدم نفس اسم المستخدم في كل المنصات قدر الإمكان.
   * ═════════════════════════════════════════════════════════════════ */
  social: [
    {
      id: 'tiktok',
      label: 'TikTok',
      handle: '[@username]', // ← اسم المستخدم في تيك توك
      url: null, // ← مثال: 'https://www.tiktok.com/@username'
      primary: true, // يظهر كزر رئيسي في الموقع
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      handle: '[in/username]',
      url: null, // ← مثال: 'https://www.linkedin.com/in/username'
    },
    {
      id: 'x',
      label: 'X',
      handle: '[@username]',
      url: null, // ← مثال: 'https://x.com/username'
    },
    {
      id: 'email',
      label: { ar: 'البريد الإلكتروني', en: 'Email' },
      handle: '[your@email.com]',
      url: null, // ← مثال: 'mailto:your@email.com'
    },
  ],
};

/* ══════════════════════════════════════════════════════════════════════
 *  إعدادات الموقع  /  Site configuration
 * ══════════════════════════════════════════════════════════════════════ */
const SITE = {
  profile: PROFILE,

  /* أصل الموقع فقط (بدون المسار الفرعي) — يُستخدم في canonical و sitemap و OG.
   * مثال لدومين خاص:            'https://yourdomain.com'
   * مثال لـ GitHub Pages:       'https://username.github.io'  + basePath أدناه
   * يمكن تجاوزه وقت البناء عبر:  SITE_URL=https://example.com npm run build */
  url: 'https://example.com', // ← ضع دومينك النهائي

  /* مسار فرعي إن كان الموقع داخل مجلد (GitHub Pages مثلاً: '/my-website')
   * يمكن تجاوزه عبر:  BASE_PATH=/my-website npm run build */
  basePath: '',

  /* اللغات — الأولى هي الافتراضية (جذر الموقع) والثانية تحت /en/ */
  languages: [
    { code: 'ar', label: 'العربية', dir: 'rtl', locale: 'ar_SA', prefix: '' },
    { code: 'en', label: 'English', dir: 'ltr', locale: 'en_US', prefix: 'en' },
  ],

  /* ── SEO ─────────────────────────────────────────────────────────── */
  seo: {
    /* عنوان الصفحة الرئيسية — إن تُرك null يُبنى تلقائياً:
     * «الاسم | الذكاء الاصطناعي والتقنية» */
    homeTitle: null,
    description: {
      ar: 'الموقع الرسمي — مختص في الذكاء الاصطناعي والتقنية. مقالات وتجارب عملية وأدوات ذكاء اصطناعي ومحتوى تقني، إضافة إلى الخبرة المهنية والمشاريع والكتاب.',
      en: 'Official website — AI & technology professional. Articles, hands-on experiments, an AI tools directory, technology content, professional experience, projects and a book.',
    },
    keywords: {
      ar: [
        'الذكاء الاصطناعي',
        'أدوات الذكاء الاصطناعي',
        'الذكاء الاصطناعي التوليدي',
        'التقنية',
        'التحول الرقمي',
        'الإنتاجية',
        'المعلوماتية الصحية',
      ],
      en: [
        'Artificial Intelligence',
        'AI Tools',
        'Generative AI',
        'Technology',
        'Digital Transformation',
        'Productivity',
        'Health Informatics',
      ],
    },
    /* كود التحقق من Google Search Console (المحتوى فقط، بدون وسم meta) */
    googleSiteVerification: null,
  },

  /* ── التحليلات  /  Analytics ──────────────────────────────────────
   *  ⚠️ لا تُضمَّن أي سكربتات ما لم تضع المعرّفات هنا.
   *  يمكن ضبطها وقت البناء عبر متغيرات البيئة:
   *    GA_ID=G-XXXX  TIKTOK_PIXEL_ID=XXXX  npm run build
   *  الأحداث المُتتبَّعة تلقائياً عند التفعيل:
   *    page_view · article_view · tool_click · tiktok_click ·
   *    social_click · contact_submit
   * ────────────────────────────────────────────────────────────────── */
  analytics: {
    googleAnalyticsId: null, // 'G-XXXXXXXXXX'
    tiktokPixelId: null, // '…'
    respectDoNotTrack: true, // يحترم إعداد Do-Not-Track في المتصفح
  },

  /* ── نموذج التواصل  /  Contact form ───────────────────────────────
   *  الموقع ثابت (static) — لا يوجد خادم يستقبل الرسائل.
   *   mode: 'mailto'    يفتح بريد الزائر مع تعبئة الرسالة (يعمل فوراً)
   *   mode: 'endpoint'  يرسل إلى خدمة خارجية (Formspree / Web3Forms …)
   *  الحماية من السبام: حقل مخفي (honeypot) + فحص زمن التعبئة +
   *  تحقق من صحة المدخلات وتنقيتها قبل الإرسال.
   * ────────────────────────────────────────────────────────────────── */
  contactForm: {
    mode: 'mailto',
    endpoint: null, // 'https://formspree.io/f/xxxxxxx'
  },

  copyrightStartYear: 2026,
};

export { PROFILE };
export default SITE;
