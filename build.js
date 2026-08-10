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

import { setBasePath, href, asset, absolute, L, formatDate, isPlaceholderText } from './src/lib/html.js';
import { parseFrontmatter, renderMarkdown, readingTime, plainExcerpt } from './src/lib/markdown.js';
import { ogCover, appIcon, photoPlaceholder, bookPlaceholder } from './src/lib/png.js';
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
const BOOK = readJson('book.json');
const { categories: TOOL_CATEGORIES, tools: TOOLS } = readJson('ai-tools.json');
const PROJECTS = readJson('projects.json');
const TIKTOK = readJson('tiktok.json');
const LEGAL = readJson('legal.json');
const DIST = path.join(ROOT, 'dist');
const CHECK_ONLY = process.argv.includes('--check-only');

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
BOOK.coverIsPlaceholder = !hasAsset(BOOK.cover);

/* ═══════════════════════════════════════════════════════════════════
 *  تحميل المقالات  /  Load articles
 *  <slug>.md  = العربية   ·   <slug>.en.md = الإنجليزية (اختيارية)
 * ═══════════════════════════════════════════════════════════════════ */
function loadArticles() {
  const dir = path.join(ROOT, 'content', 'articles');
  if (!fs.existsSync(dir)) return {};

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
  const bySlug = new Map();

  for (const file of files) {
    const isEn = file.endsWith('.en.md');
    const slug = file.replace(/\.en\.md$/, '').replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    const { data, body } = parseFrontmatter(raw);
    const { html, toc, words } = renderMarkdown(body);

    const entry = {
      slug,
      title: data.title || slug,
      description: data.description || plainExcerpt(body),
      date: data.date ? String(data.date) : null,
      category: data.category || '—',
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      cover: data.cover || null,
      featured: Boolean(data.featured),
      placeholder: Boolean(data.placeholder),
      updated: data.updated ? String(data.updated) : null,
      html,
      toc,
      words,
      readingTime: readingTime(words),
    };

    if (!bySlug.has(slug)) bySlug.set(slug, {});
    bySlug.get(slug)[isEn ? 'en' : 'ar'] = entry;
  }

  /* لكل لغة: استخدم النسخة الخاصة بها، وإلا ارجع للعربية مع تنبيه */
  const out = {};
  for (const lang of LANGS) {
    out[lang] = [...bySlug.values()]
      .map((variants) => {
        const own = variants[lang];
        const base = own || variants.ar || variants.en;
        if (!base) return null;
        const article = { ...base, fallbackLang: own ? null : (variants.ar ? 'ar' : 'en') };
        article.dateLabel = formatDate(article.date, lang);
        return article;
      })
      .filter(Boolean)
      .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  }
  return out;
}

/* ═══════════════════════════════════════════════════════════════════
 *  تجهيز البيانات لكل لغة  /  Per-language data bundle
 * ═══════════════════════════════════════════════════════════════════ */
function tiktokVideoId(url) {
  const m = /\/video\/(\d{6,})/.exec(String(url || ''));
  return m ? m[1] : null;
}

function buildData(lang, articlesByLang) {
  const catLabel = (id) => {
    const c = TOOL_CATEGORIES.find((x) => x.id === id);
    return c ? L(c.label, lang) : id;
  };

  const tools = TOOLS.map((t) => ({ ...t, categoryLabel: catLabel(t.category) }));
  const articles = articlesByLang[lang] || [];

  /* أرقام تُحسب من المحتوى الحقيقي فقط (نتجاهل النماذج) */
  const real = (arr) => arr.filter((x) => !x.placeholder).length;
  const computed = {
    articles: real(articles) || null,
    tools: real(tools) || null,
    projects: real(PROJECTS) || null,
  };

  const tiktok = {
    ...TIKTOK,
    videos: (TIKTOK.videos || []).map((v) => ({ ...v, videoId: tiktokVideoId(v.url) })),
  };

  return {
    site: SITE,
    ui: UI,
    lang,
    about: ABOUT,
    experience: EXPERIENCE,
    expertise: EXPERTISE,
    book: BOOK,
    tools,
    toolCategories: TOOL_CATEGORIES,
    projects: PROJECTS,
    tiktok,
    articles,
    legal: LEGAL,
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
    P.aboutPage(d),
    P.experiencePage(d),
    P.expertisePage(d),
    P.articlesPage(d),
    P.toolsPage(d),
    P.projectsPage(d),
    P.tiktokPage(d),
    P.mediaKitPage(d),
    P.contactPage(d),
    P.legalPage(d, LEGAL.privacy, 'privacy/', 'privacy'),
    P.legalPage(d, LEGAL.terms, 'terms/', 'terms'),
    P.notFoundPage(d),
  ];

  if (d.book && d.book.enabled) list.push(P.bookPage(d));
  for (const a of d.articles) list.push(P.articlePage(d, a));
  for (const t of d.tools) list.push(P.toolPage(d, t));
  for (const pr of d.projects) list.push(P.projectPage(d, pr));

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
  walk(ABOUT.stats, 'about.stats');
  walk(ABOUT.education, 'about.education');
  walk(ABOUT.certifications, 'about.certifications');
  walk(ABOUT.journey, 'about.journey');
  walk(EXPERIENCE, 'experience');
  walk(BOOK, 'book');
  walk(TOOLS, 'ai-tools');
  walk(PROJECTS, 'projects');
  walk(TIKTOK, 'tiktok');
  return found;
}

/* ═══════════════════════════════════════════════════════════════════
 *  البناء  /  Build
 * ═══════════════════════════════════════════════════════════════════ */
function build() {
  const started = Date.now();
  const articlesByLang = loadArticles();

  const report = placeholderReport();

  if (CHECK_ONLY) {
    printReport(report, articlesByLang);
    return;
  }

  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  const urls = [];
  let count = 0;

  for (const lang of LANGS) {
    const d = buildData(lang, articlesByLang);
    for (const page of pagesFor(d)) {
      const html = layout({ ...d, ...page });
      /* مسار الملف داخل dist مستقل عن basePath — الأخير يؤثر على الروابط فقط */
      const langDir = lang === LANGS[0] ? '' : lang;
      const outPath = page.isFile
        ? path.join(langDir, page.path)
        : path.join(langDir, page.path, 'index.html');

      write(outPath, html);
      count++;

      if (!page.noindex && !page.isFile) {
        urls.push({
          loc: absolute(SITE.url, href(page.path, lang)),
          alternates: LANGS.map((l) => ({ lang: l, loc: absolute(SITE.url, href(page.path, l)) })),
          priority: page.path === '' ? '1.0' : page.path.includes('/') ? '0.6' : '0.8',
        });
      }
    }
  }

  /* ── الأصول  /  Assets ── */
  copyDir(path.join(ROOT, 'src', 'assets'), path.join(DIST, 'assets'));

  /* ── صور افتراضية تُولَّد إن لم تُرفع صور حقيقية ── */
  const imgDir = path.join(DIST, 'assets', 'img');
  fs.mkdirSync(imgDir, { recursive: true });
  if (!fs.existsSync(path.join(imgDir, 'og-cover.png'))) {
    fs.writeFileSync(path.join(imgDir, 'og-cover.png'), ogCover());
  }
  if (!fs.existsSync(path.join(imgDir, 'apple-touch-icon.png'))) {
    fs.writeFileSync(path.join(imgDir, 'apple-touch-icon.png'), appIcon());
  }
  if (!fs.existsSync(path.join(imgDir, 'favicon.svg'))) {
    fs.writeFileSync(path.join(imgDir, 'favicon.svg'), faviconSvg());
  }
  if (!fs.existsSync(path.join(imgDir, 'profile.png'))) {
    fs.writeFileSync(path.join(imgDir, 'profile.png'), photoPlaceholder());
  }
  if (!fs.existsSync(path.join(imgDir, 'book-cover.png'))) {
    fs.writeFileSync(path.join(imgDir, 'book-cover.png'), bookPlaceholder());
  }

  /* ── sitemap · robots · manifest ── */
  write('sitemap.xml', sitemap(urls));
  write('robots.txt', robots());
  write('assets/site.webmanifest', manifest());
  write('.nojekyll', ''); // يمنع GitHub Pages من تجاهل الملفات التي تبدأ بـ _

  printReport(report, articlesByLang);
  console.log(`\n✅  ${count} ${'صفحة'} — ${((Date.now() - started) / 1000).toFixed(2)}s → dist/`);
  console.log(`    ${SITE.url}${SITE.basePath || ''}`);
}


/* ── sitemap ── */
function sitemap(urls) {
  const today = new Date().toISOString().slice(0, 10);
  const body = urls
    .map(
      (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <priority>${u.priority}</priority>
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
  return `User-agent: *
Allow: /

Sitemap: ${absolute(SITE.url, (SITE.basePath ? '/' + trimSlashes(SITE.basePath) : '') + '/sitemap.xml')}
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
function printReport(report, articlesByLang) {
  const placeholderArticles = (articlesByLang.ar || []).filter((a) => a.placeholder).length;
  console.log('\n──────────────────────────────────────────────────────────');
  console.log('  تقرير العناصر النائبة  /  Placeholder report');
  console.log('──────────────────────────────────────────────────────────');
  if (!report.length && !placeholderArticles) {
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
    if (placeholderArticles) {
      console.log(`  ⚠️  ${'articles'.padEnd(16)} ${placeholderArticles} مقال نموذجي (placeholder: true)`);
    }
    console.log('\n  الصفحات النموذجية لا تُفهرَس في محركات البحث ولا تدخل في sitemap.');
    console.log('  راجع ملفات content/ واستبدل كل قيمة بين [ ] بمحتواك الحقيقي.');
  }
  console.log('──────────────────────────────────────────────────────────');
}

build();
