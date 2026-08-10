/**
 * أدوات مساعدة لبناء HTML بأمان  /  Safe HTML building helpers
 */

/* ── تنقية المخرجات  /  Output sanitising ─────────────────────────── */
const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** يهرّب أي نص قبل إدراجه في HTML */
export function esc(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

/** يهرّب نصاً سيوضع داخل قيمة سمة */
export const attr = esc;

/** يهرّب نصاً سيوضع داخل سكربت JSON (يمنع كسر الوسم) */
export function jsonScript(data) {
  return JSON.stringify(data, null, 2)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

/* ── ثنائية اللغة  /  Bilingual value resolution ──────────────────── */

/**
 * يُرجع القيمة المناسبة للغة.
 * يقبل: نص · مصفوفة · { ar, en } · { ar: [], en: [] }
 */
export function L(value, lang = 'ar') {
  if (value === null || value === undefined) return value;
  if (typeof value === 'object' && !Array.isArray(value)) {
    if ('ar' in value || 'en' in value) {
      const picked = value[lang];
      return picked === undefined || picked === null ? (value.ar ?? value.en ?? '') : picked;
    }
  }
  return value;
}

/** هل هذه القيمة عنصر نائب لم يُستبدل بعد؟  مثال: "[الاسم الكامل]" */
export function isPlaceholderText(value) {
  const s = typeof value === 'string' ? value : '';
  return /^\s*\[.*\]\s*$/.test(s) || /\[[^\]]{2,}\]/.test(s);
}

/* ── الروابط  /  URLs ─────────────────────────────────────────────── */

let BASE = '';
export function setBasePath(base) {
  BASE = base ? '/' + String(base).replace(/^\/+|\/+$/g, '') : '';
}
export function getBasePath() {
  return BASE;
}

/** رابط داخلي مع مراعاة اللغة والمسار الأساسي.  href('articles/', 'en') → /en/articles/ */
export function href(path = '', lang = 'ar') {
  const prefix = lang === 'ar' ? '' : '/' + lang;
  const clean = String(path).replace(/^\/+/, '');
  const joined = `${BASE}${prefix}/${clean}`.replace(/\/{2,}/g, '/');
  return joined;
}

/** رابط ملف من مجلد الأصول */
export function asset(path) {
  return `${BASE}/assets/${String(path).replace(/^\/+/, '')}`.replace(/\/{2,}/g, '/');
}

/** رابط مطلق (للـ canonical و Open Graph و sitemap) */
export function absolute(siteUrl, path) {
  const root = String(siteUrl).replace(/\/+$/, '');
  return root + (path.startsWith('/') ? path : '/' + path);
}

/* ── أدوات نصية  /  Text utilities ────────────────────────────────── */

export function classNames(...parts) {
  return parts.filter(Boolean).join(' ');
}

/** يبني قائمة سمات من كائن، متجاهلاً القيم الفارغة */
export function attrs(map) {
  return Object.entries(map)
    .filter(([, v]) => v !== null && v !== undefined && v !== false && v !== '')
    .map(([k, v]) => (v === true ? k : `${k}="${attr(v)}"`))
    .join(' ');
}

/** رابط خارجي آمن  — يضيف noopener و noreferrer دائماً */
export function extLink(url, label, extra = {}) {
  return `<a href="${attr(url)}" target="_blank" rel="noopener noreferrer" ${attrs(extra)}>${label}</a>`;
}

const AR_MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];
const EN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** تنسيق تاريخ ISO بلغة الصفحة، بأرقام لاتينية لسهولة القراءة */
export function formatDate(iso, lang = 'ar') {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  const months = lang === 'ar' ? AR_MONTHS : EN_MONTHS;
  const day = d.getUTCDate();
  const month = months[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return lang === 'ar' ? `${day} ${month} ${year}` : `${month} ${day}, ${year}`;
}

/** نص بديل موحّد عندما لا توجد قيمة حقيقية — لا نخترع أرقاماً */
export const DASH = '—';

export function orDash(value) {
  if (value === null || value === undefined || value === '') return DASH;
  return value;
}

/**
 * صياغة زمن القراءة بقواعد الجمع العربية:
 * 1 → دقيقة · 2 → دقيقتان · 3–10 → دقائق · 11+ → دقيقة
 */
export function readingLabel(minutes, lang = 'ar') {
  const n = Number(minutes) || 1;
  if (lang !== 'ar') return `${n} min read`;
  if (n === 1) return 'دقيقة قراءة';
  if (n === 2) return 'دقيقتا قراءة';
  if (n <= 10) return `${n} دقائق قراءة`;
  return `${n} دقيقة قراءة`;
}

/** يحوّل نصاً إلى slug صالح للروابط */
export function slugify(text) {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\p{L}\p{N}-]+/gu, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

/** يقتطع نصاً بطول محدد دون قطع كلمة */
export function truncate(text, max = 160) {
  const s = String(text || '').trim();
  if (s.length <= max) return s;
  return s.slice(0, s.lastIndexOf(' ', max)).trim() + '…';
}
