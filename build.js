#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  مُولّد الموقع الثابت  /  Static site generator
 * ═══════════════════════════════════════════════════════════════════════════
 *  بلا أي اعتماديات خارجية. يقرأ من  content/  ويكتب موقعاً جاهزاً في  dist/
 *
 *    npm run build     بناء الموقع
 *    npm run dev       بناء + خادم محلي على http://localhost:4321
 *    npm run check     تقرير العناصر النائبة فقط (بدون بناء)
 *
 *  متغيرات البيئة:
 *    SITE_URL=https://example.com   يتجاوز الدومين في content/site.js
 *    BASE_PATH=/my-website          مسار فرعي (GitHub Pages)
 *    GA_ID=G-XXXX                   معرّف Google Analytics
 *    TIKTOK_PIXEL_ID=XXXX           معرّف TikTok Pixel
 * ═══════════════════════════════════════════════════════════════════════════
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import UI from './content/ui.js';

import { setBasePath, href, asset, absolute, L, esc, slugify, formatDate, isPlaceholderText } from './src/lib/html.js';
import { parseFrontmatter, renderMarkdown, readingTime, plainExcerpt } from './src/lib/markdown.js';
import { ogCover, appIcon, photoPlaceholder } from './src/lib/png.js';
import { layout } from './src/templates/layout.js';
import * as P from './src/templates/pages.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));

/* ── تحميل المحتوى  /  Load content ──────────────────────────────────
 *  المحتوى مخزَّن بصيغة JSON لتتمكن لوحة التحكم من قراءته وتعديله.
 *  الشرح والإرشادات موجودة في content/README.md وفي حقول لوحة التحكم.
 * ─────────────────────────────────────────────────────────────────── */
const readJson = (name) =>
  JSON.parse(fs.readFileSync(path.join(ROOT, 'content', name), 'utf8'));

const SITE = readJson('site.json');
const ABOUT = readJson('about.json');
const EXPERIENCE = readJson('experience.json');
const EXPERTISE = readJson('expertise.json');
const PROJECTS = readJson('projects.json');
const PUBLICATIONS = readJson('publications.json');
const TIKTOK = readJson('tiktok.json');
const LEGAL = readJson('legal.json');
const TAXONOMY = readJson('taxonomy.json');
const DIST = path.join(ROOT, 'dist');
const CHECK_ONLY = process.argv.includes('--check-only');

/* ── قيم افتراضية دفاعية  /  Defensive defaults ─────────────────────
 *  لوحة التحكم تحذف أي حقل قيمته null عند الحفظ. نعيد المفاتيح الناقصة
 *  هنا حتى لا يتأثر البناء أبدًا بحفظة من اللوحة.
 * ─────────────────────────────────────────────────────────────────── */
{
  const d = (obj, key, val) => {
    if (obj && obj[key] === undefined) obj[key] = val;
  };
  d(SITE, 'url', 'https://example.com');
  d(SITE, 'basePath', '');
  d(SITE, 'copyrightStartYear', new Date().getFullYear());
  d(SITE, 'seo', {});
  d(SITE.seo, 'homeTitle', null);
  d(SITE.seo, 'description', '');
  d(SITE.seo, 'keywords', []);
  d(SITE.seo, 'googleSiteVerification', null);
  d(SITE, 'analytics', {});
  d(SITE.analytics, 'googleAnalyticsId', null);
  d(SITE.analytics, 'tiktokPixelId', null);
  d(SITE.analytics, 'respectDoNotTrack', true);
  d(SITE, 'contactForm', {});
  d(SITE.contactForm, 'mode', 'mailto');
  d(SITE.contactForm, 'endpoint', null);
  d(SITE, 'languages', [{ code: 'ar', label: 'العربية', dir: 'rtl', locale: 'ar_SA' }]);
  d(SITE, 'profile', {});
  d(SITE.profile, 'cvUrl', null);
  d(SITE.profile, 'social', []);
  for (const acc of SITE.profile.social) d(acc, 'url', null);
}

const trimSlashes = (s) => String(s || '').replace(/^\/+|\/+$/g, '');
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* ── إعدادات من البيئة ────────────────────────────────────────────── */
if (process.env.SITE_URL) SITE.url = process.env.SITE_URL.replace(/\/+$/, '');
if (process.env.BASE_PATH !== undefined) SITE.basePath = process.env.BASE_PATH;
if (process.env.GA_ID) SITE.analytics.googleAnalyticsId = process.env.GA_ID;
if (process.env.TIKTOK_PIXEL_ID) SITE.analytics.tiktokPixelId = process.env.TIKTOK_PIXEL_ID;

/* ── Vercel: اشتقاق الدومين تلقائياً ───────────────────────────────────
 *  على Vercel يُخدَم الموقع من الجذر، فلا مسار فرعي. ونفضّل دومين
 *  الإنتاج على رابط النشر المؤقت حتى لا تتغيّر canonical مع كل نشر.
 *  ضبط SITE_URL يدوياً يتجاوز هذا كله (لازم عند استخدام دومين خاص).
 * ─────────────────────────────────────────────────────────────────── */
if (process.env.VERCEL && !process.env.SITE_URL) {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (host) SITE.url = `https://${host.replace(/^https?:\/\//, '').replace(/\/+$/, '')}`;
  if (process.env.BASE_PATH === undefined) SITE.basePath = '';
}

/* `url` يجب أن يكون أصل الموقع فقط (origin) لأن basePath يُضاف للروابط لاحقاً.
 * لو وُضع الرابط كاملاً (مثل https://user.github.io/repo مع basePath=/repo)
 * نحذف التكرار حتى لا تتضاعف المسارات في canonical و sitemap. */
{
  const base = String(SITE.basePath || '').replace(/^\/+|\/+$/g, '');
  if (base) {
    SITE.url = SITE.url.replace(/\/+$/, '').replace(new RegExp(`/${escapeRe(base)}$`), '');
  }
}
setBasePath(SITE.basePath);

const LANGS = SITE.languages.map((l) => l.code);

/* هل رفع المستخدم صوره الحقيقية؟ إن لم يفعل تُولَّد صور افتراضية
 * وتُعلَّم بوضوح كعناصر نائبة بدل أن تبدو نهائية. */
const hasAsset = (rel) => rel && fs.existsSync(path.join(ROOT, 'src', 'assets', rel));
SITE.profile.photoIsPlaceholder = !hasAsset(SITE.profile.photo);

/* ═══════════════════════════════════════════════════════════════════
 *  المقالات  /  Articles
 * ═══════════════════════════════════════════════════════════════════
 *  كل مقال ملف Markdown في  content/articles/<lang>/<slug>.md
 *  اسم الملف هو الـ slug، والاسم نفسه في لغتين يعني أنهما ترجمتان.
 *  الملفات التي تبدأ بـ _ قوالب، والمسوّدات (draft) لا تدخل البناء.
 * ═══════════════════════════════════════════════════════════════════ */
const PER_PAGE = 10;

function loadArticles(lang) {
  const dir = path.join(ROOT, 'content', 'articles', lang);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .map((file) => {
      const where = `content/articles/${lang}/${file}`;
      const slug = file.replace(/\.md$/, '');
      const { data, body } = parseFrontmatter(fs.readFileSync(path.join(dir, file), 'utf8'));

      /* الفشل المبكر خير من إشارة SEO خاطئة تُنشر بصمت */
      if (!data.title) throw new Error(`[${where}] ينقصه title`);
      if (!data.date) throw new Error(`[${where}] ينقصه date — التاريخ يحدّد الترتيب و lastmod`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(String(data.date)))
        throw new Error(`[${where}] صيغة date يجب أن تكون YYYY-MM-DD`);
      if (data.cover && !data.coverAlt)
        throw new Error(`[${where}] صورة بلا نص بديل — coverAlt مطلوب للوصولية`);
      if (data.category && !TAXONOMY.categories.some((c) => c.slug === data.category))
        throw new Error(`[${where}] تصنيف غير معروف: "${data.category}" — راجع content/taxonomy.json`);
      if (/^#\s/m.test(body))
        throw new Error(`[${where}] استخدم ## بدل # — العنوان الرئيسي يأتي من title`);

      const { html, toc, words } = renderMarkdown(body);

      return {
        ...data,
        slug,
        lang,
        html,
        toc,
        words,
        tags: Array.isArray(data.tags) ? data.tags.filter(Boolean) : [],
        readMinutes: readingTime(words),
        description: data.description || plainExcerpt(body, 158),
      };
    })
    .filter((a) => a.draft !== true)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

const ARTICLES = Object.fromEntries(LANGS.map((l) => [l, loadArticles(l)]));

/** اللغات التي يتوفر فيها هذا المقال فعلاً — تغذّي hreflang ومبدّل اللغة */
const langsForSlug = (slug) => LANGS.filter((l) => ARTICLES[l].some((a) => a.slug === slug));

/**
 * الوسوم المستخدمة فعلاً في لغة ما، مع slug لكل وسم.
 * لا نستخدم encodeURIComponent في المسار: اسم المجلد على القرص سيصير
 * حرفياً «%D9%86…» بينما يفكّ الخادم ترميز الرابط إلى النص العربي،
 * فلا يتطابقان. slugify يُبقي الحروف كما هي ويستبدل المسافات بشرطات.
 */
function tagsFor(lang) {
  const map = new Map();
  for (const a of ARTICLES[lang]) {
    for (const tag of a.tags) {
      const slug = slugify(tag);
      if (slug && !map.has(slug)) map.set(slug, tag);
    }
  }
  return [...map.entries()].map(([slug, tag]) => ({ slug, tag }));
}

/* ═══════════════════════════════════════════════════════════════════
 *  تجهيز البيانات لكل لغة  /  Per-language data bundle
 * ═══════════════════════════════════════════════════════════════════ */
function tiktokVideoId(url) {
  const m = /\/video\/(\d{6,})/.exec(String(url || ''));
  return m ? m[1] : null;
}

function buildData(lang) {
  const real = (arr) => arr.filter((x) => !x.placeholder).length;
  const computed = {
    projects: real(PROJECTS) || null,
  };

  return {
    site: SITE,
    ui: UI,
    lang,
    about: ABOUT,
    experience: EXPERIENCE,
    expertise: EXPERTISE,
    projects: PROJECTS,
    publications: PUBLICATIONS,
    tiktok: TIKTOK,
    legal: LEGAL,
    articles: ARTICLES[lang],
    /* مقالات كل اللغات — تحتاجها صفحات الفهرس والتصنيف والوسم لتحديد
       اللغات التي توجد فيها فعلاً، ويحتاجها مبدّل اللغة ليعرف إلى أين
       يعود حين لا تكون هذه الصفحة مترجمة. */
    articlesByLang: ARTICLES,
    articleCounts: Object.fromEntries(LANGS.map((l) => [l, ARTICLES[l].length])),
    taxonomy: TAXONOMY,
    langsForSlug,
    computed,
    formatDate,
  };
}

/* ═══════════════════════════════════════════════════════════════════
 *  توليد الصفحات  /  Page collection
 * ═══════════════════════════════════════════════════════════════════ */
function pagesFor(d) {
  const list = [
    P.homePage(d),
    P.projectsPage(d),
    P.aboutPage(d),
    P.experiencePage(d),
    P.expertisePage(d),
    P.contentPage(d),
    P.mediaKitPage(d),
    P.contactPage(d),
    P.legalPage(d, LEGAL.privacy, 'privacy/', 'privacy'),
    P.legalPage(d, LEGAL.terms, 'terms/', 'terms'),
    P.notFoundPage(d),
  ];

  for (const pr of d.projects) list.push(P.projectPage(d, pr));

  /* ── المقالات ──────────────────────────────────────────────────────
   *  لا تُولَّد أي صفحة مقالات قبل وجود مقال واحد منشور على الأقل،
   *  حتى لا يظهر في الموقع قسم فارغ يوحي بأنه غير مكتمل.
   * ───────────────────────────────────────────────────────────────── */
  if (!d.articles.length) return list;

  const pageCount = Math.max(1, Math.ceil(d.articles.length / PER_PAGE));
  for (let n = 1; n <= pageCount; n++) {
    list.push(
      P.articlesPage(d, {
        items: d.articles.slice((n - 1) * PER_PAGE, n * PER_PAGE),
        pageNum: n,
        pageCount,
      })
    );
  }

  for (const a of d.articles) list.push(P.articlePage(d, a));

  /* التصنيفات — تُفهرَس فقط عند بلوغ ثلاثة مقالات، وإلا عُدّت صفحة ضعيفة */
  for (const cat of d.taxonomy.categories) {
    const items = d.articles.filter((a) => a.category === cat.slug);
    if (items.length) list.push(P.categoryPage(d, cat, items));
  }

  /* الوسوم — noindex دائمًا: تكرارها مع التصنيفات يولّد صفحات متشابهة */
  for (const { slug, tag } of tagsFor(d.lang)) {
    list.push(P.tagPage(d, { slug, tag }, d.articles.filter((a) => a.tags.includes(tag))));
  }

  return list;
}

/* ═══════════════════════════════════════════════════════════════════
 *  أدوات الملفات  /  File helpers
 * ═══════════════════════════════════════════════════════════════════ */
function write(relPath, contents) {
  const full = path.join(DIST, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, contents);
}

function copyDir(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dst = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(src, dst);
    else fs.copyFileSync(src, dst);
  }
}

/* ═══════════════════════════════════════════════════════════════════
 *  تقرير العناصر النائبة  /  Placeholder report
 * ═══════════════════════════════════════════════════════════════════ */
function placeholderReport() {
  const found = [];
  const seen = new WeakSet();

  const walk = (node, trail) => {
    if (node === null || node === undefined) return;
    if (typeof node === 'string') {
      if (isPlaceholderText(node)) found.push({ where: trail, value: node });
      return;
    }
    if (typeof node !== 'object' || seen.has(node)) return;
    seen.add(node);
    if (Array.isArray(node)) {
      node.forEach((v, i) => walk(v, `${trail}[${i}]`));
      return;
    }
    for (const [k, v] of Object.entries(node)) {
      if (k === 'placeholder' && v === true) found.push({ where: trail, value: '(placeholder: true)' });
      walk(v, trail ? `${trail}.${k}` : k);
    }
  };

  walk(SITE.profile, 'site.profile');
  walk(ABOUT, 'about');
  walk(EXPERIENCE, 'experience');
  walk(EXPERTISE, 'expertise');
  walk(PROJECTS, 'projects');
  walk(PUBLICATIONS, 'publications');
  walk(TIKTOK, 'tiktok');
  return found;
}

/* ═══════════════════════════════════════════════════════════════════
 *  البناء  /  Build
 * ═══════════════════════════════════════════════════════════════════ */
function build() {
  const started = Date.now();

  const report = placeholderReport();

  if (CHECK_ONLY) {
    printReport(report);
    return;
  }

  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  const urls = [];
  let count = 0;

  for (const lang of LANGS) {
    const d = buildData(lang);
    for (const page of pagesFor(d)) {
      const html = layout({ ...d, ...page });
      /* مسار الملف داخل dist مستقل عن basePath — الأخير يؤثر على الروابط فقط */
      const langDir = lang === LANGS[0] ? '' : lang;
      const outPath = page.isFile
        ? path.join(langDir, page.path)
        : path.join(langDir, page.path, 'index.html');

      write(outPath, html);
      count++;

      if (!page.noindex && !page.isFile && !page.excludeFromSitemap) {
        /* اللغات التي توجد فيها هذه الصفحة فعلاً — لا نعلن بديلاً يرجع 404 */
        const avail = page.availableLangs || LANGS;
        urls.push({
          loc: absolute(SITE.url, href(page.path, lang)),
          lastmod: page.lastmod || null,
          alternates: LANGS.filter((l) => avail.includes(l)).map((l) => ({
            lang: l,
            loc: absolute(SITE.url, href(page.path, l)),
          })),
        });
      }
    }
  }

  /* ── الأصول  /  Assets ── */
  copyDir(path.join(ROOT, 'src', 'assets'), path.join(DIST, 'assets'));

  /* ── صور افتراضية تُولَّد إن لم تُرفع صور حقيقية ── */
  const imgDir = path.join(DIST, 'assets', 'img');
  fs.mkdirSync(imgDir, { recursive: true });
  if (!hasAsset(SITE.profile.ogImage)) {
    fs.writeFileSync(path.join(imgDir, path.basename(SITE.profile.ogImage)), ogCover());
  }
  if (!fs.existsSync(path.join(imgDir, 'apple-touch-icon.png'))) {
    fs.writeFileSync(path.join(imgDir, 'apple-touch-icon.png'), appIcon());
  }
  if (!fs.existsSync(path.join(imgDir, 'favicon.svg'))) {
    fs.writeFileSync(path.join(imgDir, 'favicon.svg'), faviconSvg());
  }
  if (SITE.profile.photoIsPlaceholder) {
    fs.writeFileSync(path.join(imgDir, path.basename(SITE.profile.photo)), photoPlaceholder());
  }

  /* ── sitemap · robots · manifest · feeds ── */
  write('sitemap.xml', sitemap(urls));
  write('robots.txt', robots());
  for (const lang of LANGS) {
    if (ARTICLES[lang].length) {
      write(lang === LANGS[0] ? 'feed.xml' : path.join(lang, 'feed.xml'), feed(lang));
    }
  }
  write('assets/site.webmanifest', manifest());
  write('.nojekyll', ''); // يمنع GitHub Pages من تجاهل الملفات التي تبدأ بـ _

  printReport(report);
  console.log(`\n✅  ${count} ${'صفحة'} — ${((Date.now() - started) / 1000).toFixed(2)}s → dist/`);
  const counts = LANGS.map((l) => `${l}: ${ARTICLES[l].length}`).join(' · ');
  console.log(`    📝  المقالات — ${counts}`);
  if (!LANGS.some((l) => ARTICLES[l].length)) {
    console.log('        لا مقالات بعد. أضف ملف .md في content/articles/ar/ ليظهر القسم.');
  }
  console.log(`    ${SITE.url}${SITE.basePath || ''}`);
}


/* ── sitemap ──────────────────────────────────────────────────────────
 *  <lastmod> يُكتب فقط حين نعرف تاريخاً حقيقياً (المقالات). ختمُ تاريخ
 *  اليوم على كل الروابط في كل نشر يجعل جوجل يتجاهل الإشارة كلياً.
 *  <priority> محذوف — جوجل لا يستخدمه منذ 2017.
 * ─────────────────────────────────────────────────────────────────── */
function sitemap(urls) {
  const body = urls
    .map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
${u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>\n` : ''}\
${u.alternates.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${a.loc}"/>`).join('\n')}
  </url>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`;
}

function robots() {
  /* صفحات الوسوم تكرّر التصنيفات ولا تستحق ميزانية زحف على موقع بهذا الحجم */
  const disallow = LANGS.map((l) => `Disallow: ${href('articles/tag/', l)}`).join('\n');
  return `User-agent: *
Allow: /
${disallow}

Sitemap: ${absolute(SITE.url, (SITE.basePath ? '/' + trimSlashes(SITE.basePath) : '') + '/sitemap.xml')}
`;
}

/* ── تغذية RSS  /  RSS feed ─────────────────────────────────────────── */
function feed(lang) {
  const items = ARTICLES[lang].slice(0, 20);
  const self = absolute(SITE.url, href('feed.xml', lang));
  const body = items
    .map((a) => {
      const url = absolute(SITE.url, href(`articles/${a.slug}/`, lang));
      return `    <item>
      <title>${esc(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${a.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${esc(a.description)}</description>
${a.category ? `      <category>${esc(a.category)}</category>\n` : ''}    </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(L(SITE.profile.name, lang))}</title>
    <link>${absolute(SITE.url, href('articles/', lang))}</link>
    <description>${esc(L(SITE.seo.description, lang))}</description>
    <language>${lang}</language>
    <atom:link href="${self}" rel="self" type="application/rss+xml"/>
${body}
  </channel>
</rss>
`;
}

function manifest() {
  const name = L(SITE.profile.name, 'ar');
  return JSON.stringify(
    {
      name,
      short_name: name,
      description: L(SITE.seo.description, 'ar'),
      start_url: href('', 'ar'),
      display: 'standalone',
      background_color: '#0b0d12',
      theme_color: '#0b0d12',
      lang: 'ar',
      dir: 'rtl',
      icons: [
        { src: asset('img/favicon.svg'), sizes: 'any', type: 'image/svg+xml' },
        { src: asset('img/apple-touch-icon.png'), sizes: '180x180', type: 'image/png' },
      ],
    },
    null,
    2
  );
}

function faviconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#2f6feb"/><stop offset="1" stop-color="#7c5cf0"/>
  </linearGradient></defs>
  <rect width="64" height="64" rx="14" fill="#0b0d12"/>
  <path d="M32 14l4.6 9.9L46.5 28l-9.9 4.1L32 42l-4.6-9.9L17.5 28l9.9-4.1z" fill="url(#g)"/>
  <circle cx="46" cy="46" r="4.5" fill="url(#g)"/>
</svg>
`;
}

/* ── التقرير ── */
function printReport(report) {
  console.log('\n──────────────────────────────────────────────────────────');
  console.log('  تقرير العناصر النائبة  /  Placeholder report');
  console.log('──────────────────────────────────────────────────────────');
  if (!report.length) {
    console.log('  ✅  لا توجد عناصر نائبة — الموقع جاهز للنشر.');
  } else {
    const groups = new Map();
    for (const item of report) {
      const key = item.where.split('.')[0] + (item.where.match(/^[a-z-]+\[\d+\]/i)?.[0] ? '' : '');
      const root = item.where.split(/[.[]/)[0];
      groups.set(root, (groups.get(root) || 0) + 1);
    }
    for (const [group, n] of groups) {
      console.log(`  ⚠️  ${String(group).padEnd(16)} ${n} عنصر يحتاج استبدالاً`);
    }
    console.log('\n  راجع ملفات content/ واستبدل كل قيمة بين [ ] بمحتواك الحقيقي.');
  }
  console.log('──────────────────────────────────────────────────────────');
}

build();
