/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  مشاريعي  /  Projects
 * ═══════════════════════════════════════════════════════════════════════════
 *  ⚠️ لا تُدرج مشروعاً أو نتيجة أو رقماً غير حقيقي.
 *
 *   name     اسم المشروع        ·  slug   معرّف الرابط
 *   year     السنة              ·  role   دورك في المشروع
 *   summary  وصف البطاقة        ·  problem / solution
 *   stack    []  التقنيات       ·  results  []  النتائج (أرقام حقيقية فقط)
 *   image    ملف داخل src/assets/img/projects/ — أو null
 *   url      رابط المشروع — أو null
 * ═══════════════════════════════════════════════════════════════════════════
 */

export default [
  {
    name: { ar: '[اسم المشروع]', en: '[Project name]' },
    slug: 'project-one',
    year: '[——]',
    role: { ar: '[دوري في المشروع]', en: '[My role]' },
    summary: {
      ar: '[وصف مختصر للمشروع في سطر أو سطرين.]',
      en: '[A short description of the project in one or two lines.]',
    },
    problem: {
      ar: '[المشكلة التي كان المشروع يعالجها.]',
      en: '[The problem the project addressed.]',
    },
    solution: {
      ar: '[الحل الذي نُفّذ وكيف تم تنفيذه.]',
      en: '[The solution delivered and how it was implemented.]',
    },
    stack: ['[التقنية الأولى]', '[التقنية الثانية]'],
    results: {
      ar: ['[النتيجة الأولى — رقم حقيقي إن وُجد.]'],
      en: ['[First outcome — a real number where one exists.]'],
    },
    image: null,
    url: null,
    placeholder: true, // ← احذف بعد التعبئة
  },
  {
    name: { ar: '[اسم المشروع]', en: '[Project name]' },
    slug: 'project-two',
    year: '[——]',
    role: { ar: '[دوري في المشروع]', en: '[My role]' },
    summary: {
      ar: '[وصف مختصر للمشروع في سطر أو سطرين.]',
      en: '[A short description of the project in one or two lines.]',
    },
    problem: { ar: '[المشكلة.]', en: '[The problem.]' },
    solution: { ar: '[الحل.]', en: '[The solution.]' },
    stack: ['[التقنية الأولى]'],
    results: { ar: [], en: [] },
    image: null,
    url: null,
    placeholder: true,
  },
];
