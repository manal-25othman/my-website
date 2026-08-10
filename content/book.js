/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  كتابي  /  My book
 * ═══════════════════════════════════════════════════════════════════════════
 *  ⚠️ لا تُدرج معلومات نشر أو ISBN أو دار نشر غير حقيقية.
 *
 *   enabled: false    → يخفي قسم الكتاب وصفحته من الموقع بالكامل.
 *   published: false  → يعرض شارة «قيد الإعداد» بدل معلومات نشر غير مؤكدة،
 *                       ولا يُنتج Book schema (حتى لا تُرسل إشارة غير دقيقة).
 * ═══════════════════════════════════════════════════════════════════════════
 */

export default {
  enabled: true,
  published: false, // ← اجعلها true بعد النشر الفعلي

  title: { ar: '[عنوان الكتاب]', en: '[Book title]' },
  subtitle: { ar: '[العنوان الفرعي]', en: '[Subtitle]' },

  cover: 'img/book-cover.png', // ضع الغلاف في src/assets/img/book-cover.png (نسبة 2:3)
  coverAlt: { ar: 'غلاف الكتاب', en: 'Book cover' },

  tagline: {
    ar: '[فكرة الكتاب في سطر واحد.]',
    en: '[The idea of the book in one line.]',
  },

  description: {
    ar: [
      '[وصف الكتاب — فقرة تشرح موضوعه، والمشكلة التي يعالجها، والقيمة التي يخرج بها القارئ.]',
      '[فقرة ثانية اختيارية تشرح منهجية الكتاب أو طريقة عرضه للمحتوى.]',
    ],
    en: [
      '[Book description — a paragraph on the subject, the problem it addresses, and what the reader gains.]',
      '[An optional second paragraph on the book’s approach or structure.]',
    ],
  },

  why: {
    ar: ['[لماذا كتبت هذا الكتاب — الدافع والحاجة التي لاحظتها.]'],
    en: ['[Why I wrote this book — the motivation and the gap you noticed.]'],
  },

  topics: {
    ar: ['[المحور الأول]', '[المحور الثاني]', '[المحور الثالث]', '[المحور الرابع]'],
    en: ['[First topic]', '[Second topic]', '[Third topic]', '[Fourth topic]'],
  },

  audience: {
    ar: ['[الفئة الأولى المستهدفة]', '[الفئة الثانية]', '[الفئة الثالثة]'],
    en: ['[First target audience]', '[Second audience]', '[Third audience]'],
  },

  /* معلومات النشر — اترك أي حقل null ليظهر «—» بدل معلومة مُختلَقة */
  publication: {
    publisher: null,
    year: null,
    pages: null,
    language: { ar: 'العربية', en: 'Arabic' },
    isbn: null,
    format: null, // مثال: { ar: 'ورقي وإلكتروني', en: 'Print & digital' }
  },

  /* أزرار الشراء / التحميل — ضع url: null لإخفاء الزر */
  links: [
    { label: { ar: 'احصل على الكتاب', en: 'Get the book' }, url: null, primary: true },
    { label: { ar: 'تحميل عيّنة (PDF)', en: 'Download a sample (PDF)' }, url: null },
  ],

  placeholder: true, // ← احذف هذا السطر بعد تعبئة بيانات الكتاب الحقيقية
};
