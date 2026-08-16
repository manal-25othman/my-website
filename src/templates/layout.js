/**
 * القالب العام  /  Base layout — <head>, header, footer, analytics
 */

import { esc, attr, attrs, L, href, asset, absolute, jsonScript, classNames, truncate } from '../lib/html.js';
import { icon } from '../lib/icons.js';

/* ── عناصر التنقل  /  Navigation model ────────────────────────────── */
export const NAV = [
  { key: 'about', path: 'about/', desktop: true },
  { key: 'experience', path: 'experience/', desktop: true },
  { key: 'expertise', path: 'expertise/', desktop: true },
  { key: 'articles', path: 'articles/', desktop: true, needsArticles: true },
  { key: 'content', path: 'content/', desktop: true },
  { key: 'projects', path: 'projects/', desktop: true },
  { key: 'mediaKit', path: 'media-kit/', desktop: false },
];

/* ── روابط التواصل  /  Social links ───────────────────────────────── */
export function socialLinks(site, ui, lang, { size = 20, className = 'social', labelled = false } = {}) {
  const items = site.profile.social.map((s) => {
    const label = typeof s.label === 'string' ? s.label : L(s.label, lang);

    /* لا رابط بعد → يظهر العنصر معطّلاً بدل أن يختفي الصف بالكامل،
       حتى تبقى بنية الهوية ظاهرة أثناء التجهيز. */
    if (!s.url) {
      return `<span class="social__link is-placeholder" title="${attr(label)} — ${attr(s.handle)}"
        aria-label="${attr(label)}">${icon(s.id, { size })}${labelled ? `<span>${esc(label)}</span>` : ''}</span>`;
    }

    return `<a class="social__link" href="${attr(s.url)}"${
      s.id === 'email' ? '' : ' target="_blank" rel="noopener noreferrer"'
    } data-track="social_click" data-track-label="${attr(s.id)}" aria-label="${attr(label)}" title="${attr(label)}">
      ${icon(s.id, { size })}${labelled ? `<span>${esc(label)}</span>` : ''}
    </a>`;
  });
  return `<div class="${className}">${items.join('')}</div>`;
}

/** الحساب الأساسي (TikTok) — يُستخدم في أزرار الدعوة للمتابعة */
export function primarySocial(site) {
  return site.profile.social.find((s) => s.primary && s.url) || null;
}

/** زر TikTok — يظهر معطّلاً بوضوح إن لم يُضَف الرابط بعد */
export function tiktokButton(site, ui, lang, { variant = 'ghost', block = false, label } = {}) {
  const tt = site.profile.social.find((s) => s.id === 'tiktok');
  const text = label || L(ui.content.follow, lang);
  const cls = `btn btn--${variant}${block ? ' btn--block' : ''}`;

  if (!tt || !tt.url) {
    return `<span class="${cls} is-disabled" role="link" aria-disabled="true">
      ${icon('tiktok')}<span>${esc(text)}</span></span>`;
  }
  return `<a class="${cls}" href="${attr(tt.url)}" target="_blank" rel="noopener noreferrer"
      data-track="tiktok_click">${icon('tiktok')}<span>${esc(text)}</span></a>`;
}

/** زر تحميل السيرة الذاتية — معطّل حتى يُرفع الملف */
export function cvButton(site, ui, lang, { variant = 'ghost' } = {}) {
  const label = L(ui.common.downloadCv, lang);
  const url = site.profile.cvUrl;
  if (!url) {
    return `<span class="btn btn--${variant} is-disabled" role="link" aria-disabled="true">
      ${icon('download')}<span>${esc(label)}</span></span>`;
  }
  return `<a class="btn btn--${variant}" href="${attr(url)}" target="_blank" rel="noopener noreferrer"
      download>${icon('download')}<span>${esc(label)}</span></a>`;
}

/* ── مسار التنقل  /  Breadcrumbs ──────────────────────────────────── */
export function breadcrumbs(items, ui, lang) {
  if (!items || items.length < 2) return '';
  const li = items
    .map((it, idx) => {
      const last = idx === items.length - 1;
      const inner = last
        ? `<span aria-current="page">${esc(it.label)}</span>`
        : `<a href="${attr(it.url)}">${esc(it.label)}</a>`;
      return `<li>${inner}</li>`;
    })
    .join('');
  return `<nav class="crumbs" aria-label="${attr(L(ui.common.breadcrumb, lang))}"><ol>${li}</ol></nav>`;
}

/* ── القالب  /  Layout ────────────────────────────────────────────── */

export function layout(ctx) {
  const {
    site,
    ui,
    lang,
    title,
    description,
    path, // مسار الصفحة بدون بادئة اللغة، مثال: 'articles/'
    content,
    schema = [],
    ogType = 'website',
    ogImage,
    noindex = false,
    bodyClass = '',
    activeNav = '',
    printable = false,
    articles = [],
    articleCounts = {},
    /* اللغات التي توجد فيها هذه الصفحة فعلاً. صفحات المقالات قد توجد
       بلغة واحدة فقط، وإعلان بديل غير موجود خطأ يوقف إشارات اللغة كلها. */
    availableLangs,
    /* بيانات إضافية لصفحات المقالات فقط */
    articleMeta = null,
  } = ctx;

  const hasArticles = articles.length > 0;

  /* وصف الميتا يُقتطع عند حد يعرضه محرك البحث كاملاً (~160 حرفاً) */
  const metaDescription = truncate(description, 158);

  const langCfg = site.languages.find((l) => l.code === lang);
  const dir = langCfg.dir;
  const profile = site.profile;
  const name = L(profile.name, lang);

  const pagePath = href(path, lang);
  const canonical = absolute(site.url, pagePath);
  const ogImg = absolute(site.url, asset(ogImage || profile.ogImage));

  /* بدائل اللغة  /  hreflang alternates
     شرط الصحة: كل زوج متبادل، وكل رابط يرجع 200. لذلك نرشّح باللغات
     المتاحة فعلاً، ولا نضيف x-default إلا إن كانت العربية موجودة. */
  const langCodes = availableLangs && availableLangs.length ? availableLangs : site.languages.map((l) => l.code);

  const alternates = site.languages
    .filter((l) => langCodes.includes(l.code))
    .map(
      (l) =>
        `<link rel="alternate" hreflang="${l.code}" href="${attr(absolute(site.url, href(path, l.code)))}">`
    )
    .join('\n    ');

  /* ── التنقل ── */
  const navLink = (item, mobile = false) => {
    const label = L(item.short && !mobile ? ui.nav.toolsShort : ui.nav[item.key], lang);
    const active = activeNav === item.key;
    return `<a class="${mobile ? 'drawer__link' : 'nav__link'}${active ? ' is-active' : ''}"
      href="${href(item.path, lang)}"${active ? ' aria-current="page"' : ''}>${esc(label)}</a>`;
  };

  /* رابط المقالات لا يظهر قبل نشر أول مقال — لا نعرض قسماً فارغاً */
  const navItems = NAV.filter((n) => !n.needsArticles || hasArticles);
  const desktopNav = navItems.filter((n) => n.desktop).map((n) => navLink(n)).join('');
  const mobileNav = navItems.map((n) => navLink(n, true)).join('');

  /* مبدّل اللغة — حين لا تكون هذه الصفحة مترجمة نعود إلى فهرس المقالات
     في اللغة الأخرى، وإن لم يكن فيها مقالات أصلاً فإلى الرئيسية.
     المهم ألا يقود الزر إلى 404 في أي حال. */
  const otherLang = site.languages.find((l) => l.code !== lang);
  const otherExists = langCodes.includes(otherLang.code);
  const otherHref = otherExists
    ? href(path, otherLang.code)
    : articleCounts[otherLang.code]
      ? href('articles/', otherLang.code)
      : href('', otherLang.code);
  const langSwitch = `<a class="langswitch" href="${otherHref}"
      hreflang="${otherLang.code}" lang="${otherLang.code}"
      aria-label="${attr(L(ui.common.language, lang))}: ${attr(otherLang.label)}">
      ${icon('globe', { size: 16 })}<span>${esc(otherLang.label)}</span></a>`;

  const themeToggle = `<button class="iconbtn" type="button" data-theme-toggle
      aria-label="${attr(L(ui.common.theme, lang))}" title="${attr(L(ui.common.theme, lang))}">
      <span class="iconbtn__sun">${icon('sun', { size: 18 })}</span>
      <span class="iconbtn__moon">${icon('moon', { size: 18 })}</span></button>`;

  /* ── الفوتر ── */
  const footerCol = (heading, links) => `
    <div class="foot__col">
      <h2 class="foot__h">${esc(heading)}</h2>
      <ul>${links.map((l) => `<li><a href="${l.url}">${esc(l.label)}</a></li>`).join('')}</ul>
    </div>`;

  const year = new Date().getFullYear();
  const yearLabel =
    year > site.copyrightStartYear ? `${site.copyrightStartYear}–${year}` : `${site.copyrightStartYear}`;

  const footer = `
  <footer class="foot">
    <div class="wrap foot__grid">
      <div class="foot__brand">
        <a class="foot__name" href="${href('', lang)}">${esc(name)}</a>
        <p class="foot__title">${esc(L(profile.professionalTitle, lang))}</p>
        <p class="foot__tag">${esc(L(ui.footer.tagline, lang))}</p>
        ${socialLinks(site, ui, lang, { className: 'social social--foot' })}
      </div>
      ${footerCol(L(ui.footer.explore, lang), [
        { url: href('projects/', lang), label: L(ui.projects.title, lang) },
        { url: href('about/', lang), label: L(ui.nav.about, lang) },
        { url: href('experience/', lang), label: L(ui.nav.experience, lang) },
        { url: href('expertise/', lang), label: L(ui.nav.expertise, lang) },
      ])}
      ${footerCol(L(ui.footer.content, lang), [
        ...(hasArticles ? [{ url: href('articles/', lang), label: L(ui.articles.title, lang) }] : []),
        { url: href('content/', lang), label: L(ui.content.eyebrow, lang) },
        { url: href('media-kit/', lang), label: L(ui.nav.mediaKit, lang) },
        { url: href('contact/', lang), label: L(ui.nav.contact, lang) },
      ])}
      ${footerCol(L(ui.footer.legal, lang), [
        { url: href('privacy/', lang), label: L(ui.nav.privacy, lang) },
        { url: href('terms/', lang), label: L(ui.nav.terms, lang) },
      ])}
    </div>
    <div class="wrap foot__base">
      <p>© ${yearLabel} ${esc(name)}. ${esc(L(ui.footer.rights, lang))}</p>
      <p class="foot__official">${esc(L(ui.footer.builtNote, lang))} · ${esc(site.url.replace(/^https?:\/\//, ''))}</p>
    </div>
  </footer>`;

  /* ── التحليلات — لا تُحمَّل إلا عند ضبط المعرّفات ── */
  const analytics = [];
  if (site.analytics.googleAnalyticsId) {
    analytics.push(`<script async src="https://www.googletagmanager.com/gtag/js?id=${attr(
      site.analytics.googleAnalyticsId
    )}"></script>`);
  }
  const analyticsConfig = jsonScript({
    ga: site.analytics.googleAnalyticsId || null,
    tiktokPixel: site.analytics.tiktokPixelId || null,
    respectDnt: Boolean(site.analytics.respectDoNotTrack),
  });

  const schemaBlocks = schema
    .filter(Boolean)
    .map((s) => `<script type="application/ld+json">${jsonScript(s)}</script>`)
    .join('\n    ');

  const keywords = (L(site.seo.keywords, lang) || []).join(', ');

  return `<!doctype html>
<html lang="${lang}" dir="${dir}" data-lang="${lang}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <title>${esc(title)}</title>
    <meta name="description" content="${attr(metaDescription)}">
    ${keywords ? `<meta name="keywords" content="${attr(keywords)}">` : ''}
    <meta name="author" content="${attr(name)}">
    ${noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
    <link rel="canonical" href="${attr(canonical)}">
    ${alternates}
    ${langCodes.includes('ar') ? `<link rel="alternate" hreflang="x-default" href="${attr(absolute(site.url, href(path, 'ar')))}">` : ''}
    ${hasArticles ? `<link rel="alternate" type="application/rss+xml" title="${attr(name)}" href="${href('feed.xml', lang)}">` : ''}
    ${site.seo.googleSiteVerification ? `<meta name="google-site-verification" content="${attr(site.seo.googleSiteVerification)}">` : ''}

    <meta property="og:type" content="${attr(ogType)}">
    <meta property="og:site_name" content="${attr(name)}">
    <meta property="og:locale" content="${attr(langCfg.locale)}">
    <meta property="og:title" content="${attr(title)}">
    <meta property="og:description" content="${attr(metaDescription)}">
    <meta property="og:url" content="${attr(canonical)}">
    <meta property="og:image" content="${attr(ogImg)}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    ${
      articleMeta
        ? `<meta property="article:published_time" content="${attr(articleMeta.published)}">
    ${articleMeta.modified ? `<meta property="article:modified_time" content="${attr(articleMeta.modified)}">` : ''}
    ${articleMeta.section ? `<meta property="article:section" content="${attr(articleMeta.section)}">` : ''}
    ${(articleMeta.tags || []).map((t) => `<meta property="article:tag" content="${attr(t)}">`).join('\n    ')}
    <meta property="article:author" content="${attr(name)}">`
        : ''
    }
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${attr(title)}">
    <meta name="twitter:description" content="${attr(metaDescription)}">
    <meta name="twitter:image" content="${attr(ogImg)}">
    ${articleMeta && articleMeta.preloadImage ? `<link rel="preload" as="image" href="${attr(articleMeta.preloadImage)}" fetchpriority="high">` : ''}

    <meta name="theme-color" content="#0b0d12" media="(prefers-color-scheme: dark)">
    <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
    <link rel="icon" href="${asset('img/favicon.svg')}" type="image/svg+xml">
    <link rel="apple-touch-icon" href="${asset('img/apple-touch-icon.png')}">
    <link rel="manifest" href="${asset('site.webmanifest')}">

    <link rel="preload" as="font" type="font/woff2" href="${asset('fonts/tajawal-400-arabic.woff2')}" crossorigin>
    <link rel="preload" as="font" type="font/woff2" href="${asset('fonts/tajawal-700-arabic.woff2')}" crossorigin>
    <link rel="stylesheet" href="${asset('css/fonts.css')}">
    <link rel="stylesheet" href="${asset('css/styles.css')}">
    <noscript><style>.reveal{opacity:1!important;transform:none!important}[data-expandable]{display:block!important}</style></noscript>

    <script>
      /* يمنع وميض المظهر قبل تحميل الصفحة */
      (function () {
        try {
          var s = localStorage.getItem('theme');
          var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
          document.documentElement.dataset.theme = s || (d ? 'dark' : 'light');
        } catch (e) { document.documentElement.dataset.theme = 'light'; }
      })();
    </script>
    ${schemaBlocks}
    ${analytics.join('\n    ')}
    <script id="analytics-config" type="application/json">${analyticsConfig}</script>
  </head>
  <body class="${classNames(bodyClass, printable && 'is-printable')}">
    <a class="skiplink" href="#main">${esc(L(ui.nav.skip, lang))}</a>

    <header class="head" data-header>
      <div class="wrap head__inner">
        <a class="brand" href="${href('', lang)}" aria-label="${attr(name)}">
          <span class="brand__mark" aria-hidden="true"></span>
          <span class="brand__text">
            <span class="brand__name">${esc(name)}</span>
            <span class="brand__role">${esc(L(profile.professionalTitle, lang))}</span>
          </span>
        </a>

        <nav class="nav" aria-label="${attr(L(ui.nav.menu, lang))}">${desktopNav}</nav>

        <div class="head__actions">
          ${langSwitch}
          ${themeToggle}
          <a class="btn btn--sm btn--solid head__cta" href="${href('contact/', lang)}">${esc(L(ui.nav.contact, lang))}</a>
          <button class="iconbtn nav__burger" type="button" data-drawer-open
            aria-label="${attr(L(ui.nav.menu, lang))}" aria-expanded="false" aria-controls="drawer">
            ${icon('menu', { size: 22 })}
          </button>
        </div>
      </div>
    </header>

    <div class="drawer" id="drawer" hidden>
      <div class="drawer__panel" role="dialog" aria-modal="true" aria-label="${attr(L(ui.nav.menu, lang))}">
        <div class="drawer__top">
          <span class="drawer__title">${esc(L(ui.nav.menu, lang))}</span>
          <button class="iconbtn" type="button" data-drawer-close aria-label="${attr(L(ui.nav.close, lang))}">
            ${icon('close', { size: 22 })}
          </button>
        </div>
        <nav class="drawer__nav">
          <a class="drawer__link${activeNav === 'home' ? ' is-active' : ''}" href="${href('', lang)}">${esc(L(ui.nav.home, lang))}</a>
          ${mobileNav}
          <a class="drawer__link" href="${href('contact/', lang)}">${esc(L(ui.nav.contact, lang))}</a>
        </nav>
        <div class="drawer__foot">
          ${socialLinks(site, ui, lang, { className: 'social social--drawer' })}
        </div>
      </div>
    </div>

    <main id="main">${content}</main>

    ${footer}

    <script src="${asset('js/main.js')}" defer></script>
  </body>
</html>`;
}
