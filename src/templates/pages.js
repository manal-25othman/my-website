/**
 * بُناة الصفحات  /  Page builders
 * كل دالة تُرجع { title, description, path, content, schema, ... }
 * ثم يمرّرها build.js إلى القالب العام.
 */

import { esc, attr, L, href, asset, absolute, DASH, orDash, isPlaceholderText, readingLabel } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import {
  sectionHead,
  placeholderBadge,
  button,
  rating,
  portrait,
  chip,
  articleCard,
  toolCard,
  projectCard,
  shareRow,
  authorCard,
  emptyNote,
  ph,
} from './components.js';
import { breadcrumbs, socialLinks, tiktokButton } from './layout.js';
import * as S from './sections.js';
import * as Schema from '../lib/seo.js';

/* ── ترويسة صفحة داخلية  /  Inner page header ─────────────────────── */
function pageHero({ eyebrow, title, lead, crumbs, ui, lang, extra = '' }) {
  return `
  <section class="phero">
    <div class="wrap">
      ${breadcrumbs(crumbs, ui, lang)}
      <p class="eyebrow"><span class="eyebrow__dot" aria-hidden="true"></span>${esc(eyebrow)}</p>
      <h1 class="phero__title">${esc(title)}</h1>
      ${lead ? `<p class="phero__lead">${esc(lead)}</p>` : ''}
      ${extra}
    </div>
  </section>`;
}

function crumb(d, trail = []) {
  const { ui, lang } = d;
  return [{ label: L(ui.nav.home, lang), url: href('', lang) }, ...trail];
}

/* ═════════════════════════════════════════════════════════════════════
 *  الصفحة الرئيسية  /  Home
 * ═══════════════════════════════════════════════════════════════════ */
export function homePage(d) {
  const { site, ui, lang, expertise } = d;
  const p = site.profile;
  const name = L(p.name, lang);
  const title =
    L(site.seo.homeTitle, lang) ||
    `${name} | ${lang === 'ar' ? 'الذكاء الاصطناعي والتقنية' : 'AI & Technology'}`;

  return {
    path: '',
    activeNav: 'home',
    title,
    description: L(site.seo.description, lang),
    bodyClass: 'page-home',
    schema: [
      Schema.personSchema(site, lang, { expertise }),
      Schema.websiteSchema(site, lang),
      Schema.bookSchema(site, lang, d.book),
    ],
    content: [
      S.hero(d),
      S.trustStrip(d),
      S.aboutSection(d),
      S.expertiseSection(d),
      S.featuredSection(d),
      S.articlesSection(d, { limit: 3 }),
      S.toolsSection(d, { limit: 3 }),
      S.bookSection(d),
      S.projectsSection(d, { limit: 2 }),
      S.tiktokSection(d),
      S.presenceSection(d),
      S.mediaKitTeaser(d),
      S.contactSection(d),
    ].join('\n'),
  };
}

/* ═════════════════════════════════════════════════════════════════════
 *  من أنا  /  About
 * ═══════════════════════════════════════════════════════════════════ */
export function aboutPage(d) {
  const { site, ui, lang } = d;
  const crumbs = crumb(d, [{ label: L(ui.nav.about, lang), url: href('about/', lang) }]);
  return {
    path: 'about/',
    activeNav: 'about',
    title: `${L(ui.about.title, lang)} — ${L(site.profile.name, lang)}`,
    description: L(site.profile.shortBio, lang),
    schema: [Schema.profilePageSchema(site, lang), Schema.breadcrumbSchema(site, lang, crumbs)],
    content: [
      pageHero({
        eyebrow: L(ui.about.eyebrow, lang),
        title: L(ui.about.title, lang),
        lead: L(ui.about.lead, lang),
        crumbs,
        ui,
        lang,
      }),
      S.aboutSection(d, { full: true }),
      S.journeySection(d),
      S.credentialsSection(d),
      S.expertiseSection(d),
      S.presenceSection(d),
    ].join('\n'),
  };
}

/* ═════════════════════════════════════════════════════════════════════
 *  الخبرة  /  Experience
 * ═══════════════════════════════════════════════════════════════════ */
export function experiencePage(d) {
  const { site, ui, lang } = d;
  const crumbs = crumb(d, [{ label: L(ui.nav.experience, lang), url: href('experience/', lang) }]);
  return {
    path: 'experience/',
    activeNav: 'experience',
    title: `${L(ui.experience.title, lang)} — ${L(site.profile.name, lang)}`,
    description: L(ui.experience.lead, lang),
    schema: [Schema.breadcrumbSchema(site, lang, crumbs)],
    content: [
      pageHero({
        eyebrow: L(ui.experience.eyebrow, lang),
        title: L(ui.experience.title, lang),
        lead: L(ui.experience.lead, lang),
        crumbs,
        ui,
        lang,
      }),
      S.experienceSection(d, { showHead: false }),
      S.credentialsSection(d),
      S.mediaKitTeaser(d),
    ].join('\n'),
  };
}

/* ═════════════════════════════════════════════════════════════════════
 *  التخصصات  /  Expertise
 * ═══════════════════════════════════════════════════════════════════ */
export function expertisePage(d) {
  const { site, ui, lang } = d;
  const crumbs = crumb(d, [{ label: L(ui.nav.expertise, lang), url: href('expertise/', lang) }]);
  return {
    path: 'expertise/',
    activeNav: 'expertise',
    title: `${L(ui.expertise.title, lang)} — ${L(site.profile.name, lang)}`,
    description: L(ui.expertise.lead, lang),
    schema: [Schema.breadcrumbSchema(site, lang, crumbs)],
    content: [
      pageHero({
        eyebrow: L(ui.expertise.eyebrow, lang),
        title: L(ui.expertise.title, lang),
        lead: L(ui.expertise.lead, lang),
        crumbs,
        ui,
        lang,
      }),
      S.expertiseSection(d),
      S.toolsSection(d, { limit: 3 }),
      S.articlesSection(d, { limit: 3 }),
    ].join('\n'),
  };
}

/* ═════════════════════════════════════════════════════════════════════
 *  المقالات — الفهرس  /  Articles index
 * ═══════════════════════════════════════════════════════════════════ */
export function articlesPage(d) {
  const { site, ui, lang, articles } = d;
  const crumbs = crumb(d, [{ label: L(ui.nav.articles, lang), url: href('articles/', lang) }]);
  const cats = [...new Set(articles.map((a) => a.category))];
  const featured = articles.filter((a) => a.featured);
  const rest = articles.filter((a) => !a.featured);

  const filters = `
    <div class="filters" data-filters>
      <div class="filters__search">
        ${icon('search', { size: 18 })}
        <input type="search" data-search-input placeholder="${attr(L(ui.articles.search, lang))}"
          aria-label="${attr(L(ui.articles.search, lang))}">
      </div>
      <div class="filters__chips" role="group" aria-label="${attr(L(ui.tools.category, lang))}">
        <button class="fchip is-active" type="button" data-filter="all">${esc(L(ui.common.viewAll, lang))}</button>
        ${cats.map((c) => `<button class="fchip" type="button" data-filter="${attr(c)}">${esc(c)}</button>`).join('')}
      </div>
    </div>`;

  const body = articles.length
    ? `
    ${featured.length ? `<h2 class="sec__h">${esc(L(ui.articles.featured, lang))}</h2>
      <div class="agrid agrid--feature reveal">${featured.map((a) => articleCard(a, ui, lang, { featured: true })).join('')}</div>` : ''}
    <h2 class="sec__h">${esc(L(ui.articles.all, lang))}</h2>
    ${filters}
    <div class="agrid reveal" data-filter-list>
      ${articles
        .map(
          (a) => `<div data-item data-category="${attr(a.category)}"
            data-search="${attr([a.title, a.description, a.category, (a.tags || []).join(' ')].join(' ').toLowerCase())}">
            ${articleCard(a, ui, lang)}</div>`
        )
        .join('')}
    </div>
    <p class="empty" data-empty hidden>${esc(L(ui.common.noResults, lang))}</p>`
    : emptyNote(L(ui.articles.empty, lang));

  return {
    path: 'articles/',
    activeNav: 'articles',
    title: `${L(ui.articles.title, lang)} — ${L(site.profile.name, lang)}`,
    description: L(ui.articles.lead, lang),
    schema: [
      Schema.breadcrumbSchema(site, lang, crumbs),
      Schema.collectionSchema(site, lang, {
        name: L(ui.articles.title, lang),
        description: L(ui.articles.lead, lang),
        url: href('articles/', lang),
        items: articles.map((a) => ({ name: a.title, url: href(`articles/${a.slug}/`, lang) })),
      }),
    ],
    content: [
      pageHero({
        eyebrow: L(ui.articles.eyebrow, lang),
        title: L(ui.articles.title, lang),
        lead: L(ui.articles.lead, lang),
        crumbs,
        ui,
        lang,
      }),
      `<section class="sec"><div class="wrap">${body}</div></section>`,
    ].join('\n'),
  };
}

/* ═════════════════════════════════════════════════════════════════════
 *  صفحة مقال  /  Article page
 * ═══════════════════════════════════════════════════════════════════ */
export function articlePage(d, article) {
  const { site, ui, lang, articles } = d;
  const crumbs = crumb(d, [
    { label: L(ui.nav.articles, lang), url: href('articles/', lang) },
    { label: article.title, url: href(`articles/${article.slug}/`, lang) },
  ]);
  const url = absolute(site.url, href(`articles/${article.slug}/`, lang));

  const related = articles
    .filter((a) => a.slug !== article.slug)
    .map((a) => ({
      a,
      score:
        (a.category === article.category ? 2 : 0) +
        (a.tags || []).filter((t) => (article.tags || []).includes(t)).length,
    }))
    .sort((x, y) => y.score - x.score)
    .slice(0, 3)
    .map((x) => x.a);

  const toc = article.toc.length
    ? `<nav class="toc" aria-labelledby="toc-h">
        <p class="toc__h" id="toc-h">${esc(L(ui.articles.toc, lang))}</p>
        <ol>${article.toc
          .map((t) => `<li class="toc__l${t.level}"><a href="#${attr(t.id)}">${esc(t.text)}</a></li>`)
          .join('')}</ol>
      </nav>`
    : '';

  return {
    path: `articles/${article.slug}/`,
    activeNav: 'articles',
    title: `${article.title} — ${L(site.profile.name, lang)}`,
    description: article.description,
    ogType: 'article',
    ogImage: article.cover || undefined,
    noindex: article.placeholder,
    bodyClass: 'page-article',
    schema: [Schema.articleSchema(site, lang, article), Schema.breadcrumbSchema(site, lang, crumbs)],
    content: `
    <article class="post">
      <header class="post__head">
        <div class="wrap wrap--narrow">
          ${breadcrumbs(crumbs, ui, lang)}
          <p class="post__cat">${esc(article.category)}</p>
          <h1 class="post__title">${esc(article.title)}</h1>
          <p class="post__desc">${esc(article.description)}</p>
          ${article.placeholder ? placeholderBadge(ui, lang) : ''}
          ${
            article.fallbackLang
              ? `<p class="notice">${icon('globe', { size: 15 })}${esc(L(ui.articles.translationNotice, lang))}</p>`
              : ''
          }
          <div class="post__byline">
            ${portrait(site, lang, { size: 'xs' })}
            <div class="post__bymeta">
              <span class="post__author">${esc(L(site.profile.name, lang))}</span>
              <span class="post__sub">
                <time datetime="${attr(article.date)}">${esc(article.dateLabel)}</time>
                <span class="dot" aria-hidden="true"></span>
                ${esc(readingLabel(article.readingTime, lang))}
              </span>
            </div>
            ${shareRow(ui, lang, { url, title: article.title })}
          </div>
        </div>
      </header>

      ${
        article.cover
          ? `<div class="wrap"><figure class="post__cover"><img src="${asset(article.cover)}" alt="" width="1200" height="630" loading="eager" decoding="async"></figure></div>`
          : ''
      }

      <div class="wrap post__layout">
        <aside class="post__aside">${toc}</aside>
        <div class="post__body prose prose--article"
          data-track="article_view" data-track-label="${attr(article.slug)}"
          ${article.fallbackLang ? `lang="${attr(article.fallbackLang)}" dir="rtl"` : ''}>
          ${article.html}
          ${
            (article.tags || []).length
              ? `<div class="post__tags">${article.tags.map((t) => chip(t, { small: true })).join('')}</div>`
              : ''
          }
          ${S.followCta(d)}
        </div>
      </div>

      <div class="wrap wrap--narrow">${authorCard(site, ui, lang)}</div>

      ${
        related.length
          ? `<section class="sec sec--muted">
              <div class="wrap">
                <h2 class="sec__h">${esc(L(ui.articles.related, lang))}</h2>
                <div class="agrid">${related.map((a) => articleCard(a, ui, lang)).join('')}</div>
              </div>
            </section>`
          : ''
      }
    </article>`,
  };
}

/* ═════════════════════════════════════════════════════════════════════
 *  الكتاب  /  Book page
 * ═══════════════════════════════════════════════════════════════════ */
export function bookPage(d) {
  const { site, ui, lang, book } = d;
  const crumbs = crumb(d, [{ label: L(ui.nav.book, lang), url: href('book/', lang) }]);
  return {
    path: 'book/',
    activeNav: 'book',
    title: `${L(ui.book.title, lang)} — ${L(site.profile.name, lang)}`,
    description: isPlaceholderText(L(book.tagline, lang))
      ? L(ui.book.title, lang) + ' — ' + L(site.profile.name, lang)
      : L(book.tagline, lang),
    schema: [Schema.bookSchema(site, lang, book), Schema.breadcrumbSchema(site, lang, crumbs)],
    content: [
      pageHero({
        eyebrow: L(ui.book.eyebrow, lang),
        title: L(ui.book.title, lang),
        lead: L(book.tagline, lang),
        crumbs,
        ui,
        lang,
      }),
      S.bookSection(d, { full: true }),
      S.articlesSection(d, { limit: 3 }),
    ].join('\n'),
  };
}

/* ═════════════════════════════════════════════════════════════════════
 *  أدوات الذكاء الاصطناعي — الفهرس  /  AI tools index
 * ═══════════════════════════════════════════════════════════════════ */
export function toolsPage(d) {
  const { site, ui, lang, tools, toolCategories } = d;
  const crumbs = crumb(d, [{ label: L(ui.nav.tools, lang), url: href('ai-tools/', lang) }]);
  const used = new Set(tools.map((t) => t.category));
  const cats = toolCategories.filter((c) => c.id === 'all' || used.has(c.id));

  const body = tools.length
    ? `
    <h2 class="sec__h">${esc(L(ui.tools.all, lang))}</h2>
    <div class="filters" data-filters>
      <div class="filters__search">
        ${icon('search', { size: 18 })}
        <input type="search" data-search-input placeholder="${attr(L(ui.tools.search, lang))}"
          aria-label="${attr(L(ui.tools.search, lang))}">
      </div>
      <div class="filters__chips" role="group" aria-label="${attr(L(ui.tools.category, lang))}">
        ${cats
          .map(
            (c) =>
              `<button class="fchip${c.id === 'all' ? ' is-active' : ''}" type="button" data-filter="${attr(c.id === 'all' ? 'all' : c.id)}">${esc(L(c.label, lang))}</button>`
          )
          .join('')}
      </div>
      <p class="filters__count"><span data-count-out>${tools.length}</span> ${esc(L(ui.tools.resultsCount, lang))}</p>
    </div>
    <div class="tgrid reveal" data-filter-list>
      ${tools
        .map(
          (t) => `<div data-item data-category="${attr(t.category)}"
            data-search="${attr([L(t.name, lang), L(t.summary, lang), L(t.bestFor, lang), t.categoryLabel].join(' ').toLowerCase())}">
            ${toolCard(t, ui, lang)}</div>`
        )
        .join('')}
    </div>
    <p class="empty" data-empty hidden>${esc(L(ui.common.noResults, lang))}</p>`
    : emptyNote(L(ui.tools.empty, lang));

  return {
    path: 'ai-tools/',
    activeNav: 'tools',
    title: `${L(ui.tools.title, lang)} — ${L(site.profile.name, lang)}`,
    description: L(ui.tools.lead, lang),
    schema: [
      Schema.breadcrumbSchema(site, lang, crumbs),
      Schema.collectionSchema(site, lang, {
        name: L(ui.tools.title, lang),
        description: L(ui.tools.lead, lang),
        url: href('ai-tools/', lang),
        items: tools.map((t) => ({ name: L(t.name, lang), url: href(`ai-tools/${t.slug}/`, lang) })),
      }),
    ],
    content: [
      pageHero({
        eyebrow: L(ui.tools.eyebrow, lang),
        title: L(ui.tools.title, lang),
        lead: L(ui.tools.lead, lang),
        crumbs,
        ui,
        lang,
      }),
      `<section class="sec"><div class="wrap">${body}</div></section>`,
    ].join('\n'),
  };
}

/* ═════════════════════════════════════════════════════════════════════
 *  صفحة أداة  /  AI tool detail
 * ═══════════════════════════════════════════════════════════════════ */
export function toolPage(d, tool) {
  const { site, ui, lang, tools, articles } = d;
  const name = L(tool.name, lang);
  const crumbs = crumb(d, [
    { label: L(ui.nav.tools, lang), url: href('ai-tools/', lang) },
    { label: name, url: href(`ai-tools/${tool.slug}/`, lang) },
  ]);
  const url = absolute(site.url, href(`ai-tools/${tool.slug}/`, lang));
  const related = tools.filter((t) => t.slug !== tool.slug && t.category === tool.category).slice(0, 3);
  const linkedArticles = (tool.articleSlugs || [])
    .map((s) => articles.find((a) => a.slug === s))
    .filter(Boolean);

  const pros = L(tool.pros, lang) || [];
  const cons = L(tool.cons, lang) || [];
  const initial = (String(name).replace(/[[\]]/g, '').trim()[0] || '·').toUpperCase();

  return {
    path: `ai-tools/${tool.slug}/`,
    activeNav: 'tools',
    title: `${name} — ${L(ui.tools.title, lang)} — ${L(site.profile.name, lang)}`,
    description: L(tool.summary, lang),
    noindex: tool.placeholder,
    schema: [Schema.toolSchema(site, lang, tool), Schema.breadcrumbSchema(site, lang, crumbs)],
    content: `
    <section class="phero phero--tool">
      <div class="wrap">
        ${breadcrumbs(crumbs, ui, lang)}
        <div class="toolhead">
          <span class="toolhead__logo">${
            tool.logo
              ? `<img src="${asset('img/tools/' + tool.logo)}" alt="" width="64" height="64" loading="eager" decoding="async">`
              : esc(initial)
          }</span>
          <div class="toolhead__id">
            <p class="eyebrow"><span class="eyebrow__dot" aria-hidden="true"></span>${esc(tool.categoryLabel)}</p>
            <h1 class="phero__title">${esc(name)}</h1>
            <p class="phero__lead">${esc(L(tool.summary, lang))}</p>
            ${tool.placeholder ? placeholderBadge(ui, lang) : ''}
          </div>
          <div class="toolhead__side">
            ${rating(tool.rating, ui, lang)}
            ${
              tool.url
                ? button({
                    label: L(ui.tools.official, lang),
                    url: tool.url,
                    variant: 'solid',
                    external: true,
                    iconName: 'external',
                    track: 'tool_click',
                  })
                : ''
            }
            ${
              tool.tiktokUrl
                ? button({
                    label: L(ui.tools.watchOnTiktok, lang),
                    url: tool.tiktokUrl,
                    variant: 'outline',
                    external: true,
                    iconName: 'tiktok',
                    track: 'tiktok_click',
                  })
                : ''
            }
          </div>
        </div>
      </div>
    </section>

    <section class="sec">
      <div class="wrap tool__layout">
        <div class="tool__main prose">
          <h2>${esc(L(ui.tools.whatItDoes, lang))}</h2>
          <p>${esc(L(tool.whatItDoes, lang))}</p>

          <h2>${esc(L(ui.tools.review, lang))}</h2>
          <p>${esc(L(tool.review, lang))}</p>

          ${
            pros.length || cons.length
              ? `<div class="proscons">
                  ${pros.length ? `<div class="proscons__col"><h3>${esc(L(ui.tools.pros, lang))}</h3><ul class="ticks ticks--accent">${pros.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}
                  ${cons.length ? `<div class="proscons__col"><h3>${esc(L(ui.tools.cons, lang))}</h3><ul class="ticks ticks--muted">${cons.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}
                </div>`
              : ''
          }

          <h2>${esc(L(ui.tools.whoFor, lang))}</h2>
          <p>${esc(L(tool.whoFor, lang))}</p>
          ${S.followCta(d)}
        </div>

        <aside class="tool__side">
          <div class="factbox">
            <dl class="deflist">
              <div><dt>${esc(L(ui.tools.category, lang))}</dt><dd>${esc(tool.categoryLabel)}</dd></div>
              <div><dt>${esc(L(ui.tools.pricing, lang))}</dt><dd>${esc(orDash(L(tool.pricing, lang)))}</dd></div>
              <div><dt>${esc(L(ui.tools.bestFor, lang))}</dt><dd>${esc(orDash(L(tool.bestFor, lang)))}</dd></div>
              <div><dt>${esc(L(ui.tools.rating, lang))}</dt><dd>${rating(tool.rating, ui, lang)}</dd></div>
            </dl>
            ${shareRow(ui, lang, { url, title: name })}
          </div>

          ${
            linkedArticles.length
              ? `<div class="factbox">
                  <h3 class="factbox__h">${esc(L(ui.tools.relatedArticles, lang))}</h3>
                  <ul class="linklist">${linkedArticles
                    .map((a) => `<li><a href="${href(`articles/${a.slug}/`, lang)}">${esc(a.title)}</a></li>`)
                    .join('')}</ul>
                </div>`
              : ''
          }
        </aside>
      </div>
    </section>

    ${
      related.length
        ? `<section class="sec sec--muted">
            <div class="wrap">
              <h2 class="sec__h">${esc(L(ui.tools.relatedTools, lang))}</h2>
              <div class="tgrid">${related.map((t) => toolCard(t, ui, lang)).join('')}</div>
            </div>
          </section>`
        : ''
    }`,
  };
}

/* ═════════════════════════════════════════════════════════════════════
 *  المشاريع  /  Projects
 * ═══════════════════════════════════════════════════════════════════ */
export function projectsPage(d) {
  const { site, ui, lang, projects } = d;
  const crumbs = crumb(d, [{ label: L(ui.nav.projects, lang), url: href('projects/', lang) }]);
  return {
    path: 'projects/',
    activeNav: 'projects',
    title: `${L(ui.projects.title, lang)} — ${L(site.profile.name, lang)}`,
    description: L(ui.projects.lead, lang),
    schema: [
      Schema.breadcrumbSchema(site, lang, crumbs),
      Schema.collectionSchema(site, lang, {
        name: L(ui.projects.title, lang),
        description: L(ui.projects.lead, lang),
        url: href('projects/', lang),
        items: projects.map((p) => ({ name: L(p.name, lang), url: href(`projects/${p.slug}/`, lang) })),
      }),
    ],
    content: [
      pageHero({
        eyebrow: L(ui.projects.eyebrow, lang),
        title: L(ui.projects.title, lang),
        lead: L(ui.projects.lead, lang),
        crumbs,
        ui,
        lang,
      }),
      `<section class="sec"><div class="wrap">
        ${projects.length ? `<h2 class="sec__h">${esc(L(ui.projects.all, lang))}</h2>
        <div class="pgrid reveal">${projects.map((p) => projectCard(p, ui, lang)).join('')}</div>` : emptyNote(L(ui.projects.empty, lang))}
      </div></section>`,
    ].join('\n'),
  };
}

export function projectPage(d, project) {
  const { site, ui, lang, projects } = d;
  const name = L(project.name, lang);
  const crumbs = crumb(d, [
    { label: L(ui.nav.projects, lang), url: href('projects/', lang) },
    { label: name, url: href(`projects/${project.slug}/`, lang) },
  ]);
  const results = L(project.results, lang) || [];
  const others = projects.filter((p) => p.slug !== project.slug).slice(0, 2);

  return {
    path: `projects/${project.slug}/`,
    activeNav: 'projects',
    title: `${name} — ${L(ui.projects.title, lang)} — ${L(site.profile.name, lang)}`,
    description: L(project.summary, lang),
    noindex: project.placeholder,
    schema: [Schema.breadcrumbSchema(site, lang, crumbs)],
    content: `
    ${pageHero({
      eyebrow: `${L(ui.projects.eyebrow, lang)} · ${L(project.year, lang)}`,
      title: name,
      lead: L(project.summary, lang),
      crumbs,
      ui,
      lang,
      extra: project.placeholder ? placeholderBadge(ui, lang) : '',
    })}
    <section class="sec">
      <div class="wrap case">
        ${
          project.image
            ? `<figure class="case__media"><img src="${asset('img/projects/' + project.image)}" alt="" width="1200" height="700" loading="lazy" decoding="async"></figure>`
            : ''
        }
        <div class="case__grid">
          <div class="case__main prose">
            <h2>${esc(L(ui.projects.problem, lang))}</h2>
            <p>${esc(L(project.problem, lang))}</p>
            <h2>${esc(L(ui.projects.solution, lang))}</h2>
            <p>${esc(L(project.solution, lang))}</p>
            ${
              results.length
                ? `<h2>${esc(L(ui.projects.results, lang))}</h2><ul class="ticks ticks--accent">${results.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>`
                : ''
            }
          </div>
          <aside class="case__side">
            <div class="factbox">
              <dl class="deflist">
                <div><dt>${esc(L(ui.projects.role, lang))}</dt><dd>${esc(L(project.role, lang))}</dd></div>
                <div><dt>${esc(L(ui.book.year, lang))}</dt><dd>${esc(L(project.year, lang))}</dd></div>
              </dl>
              <h3 class="factbox__h">${esc(L(ui.projects.stack, lang))}</h3>
              <div class="chips">${(project.stack || []).map((s) => chip(L(s, lang), { small: true })).join('')}</div>
              ${project.url ? button({ label: L(ui.projects.viewProject, lang), url: project.url, variant: 'outline', external: true, iconName: 'external' }) : ''}
            </div>
          </aside>
        </div>
      </div>
    </section>
    ${
      others.length
        ? `<section class="sec sec--muted"><div class="wrap">
            <h2 class="sec__h">${esc(L(ui.projects.title, lang))}</h2>
            <div class="pgrid">${others.map((p) => projectCard(p, ui, lang)).join('')}</div>
          </div></section>`
        : ''
    }`,
  };
}

/* ═════════════════════════════════════════════════════════════════════
 *  TikTok
 * ═══════════════════════════════════════════════════════════════════ */
export function tiktokPage(d) {
  const { site, ui, lang } = d;
  const crumbs = crumb(d, [{ label: L(ui.nav.tiktok, lang), url: href('tiktok/', lang) }]);
  return {
    path: 'tiktok/',
    activeNav: 'tiktok',
    title: `${L(ui.tiktok.title, lang)} — ${L(site.profile.name, lang)}`,
    description: L(ui.tiktok.lead, lang),
    schema: [Schema.breadcrumbSchema(site, lang, crumbs)],
    content: [
      pageHero({
        eyebrow: L(ui.tiktok.eyebrow, lang),
        title: L(ui.tiktok.title, lang),
        lead: L(ui.tiktok.lead, lang),
        crumbs,
        ui,
        lang,
      }),
      S.tiktokSection(d, { full: true }),
      S.presenceSection(d),
    ].join('\n'),
  };
}

/* ═════════════════════════════════════════════════════════════════════
 *  الملف التعريفي  /  Media kit
 * ═══════════════════════════════════════════════════════════════════ */
export function mediaKitPage(d) {
  const { site, ui, lang, expertise, articles, book, projects } = d;
  const p = site.profile;
  const crumbs = crumb(d, [{ label: L(ui.nav.mediaKit, lang), url: href('media-kit/', lang) }]);
  const topics = expertise.flatMap((g) => g.items.map((i) => L(i, lang))).slice(0, 14);

  const row = (k, v, ltr) =>
    `<div><dt>${esc(k)}</dt><dd${ltr ? ' class="handle"' : ''}>${esc(orDash(v))}</dd></div>`;

  return {
    path: 'media-kit/',
    activeNav: 'mediaKit',
    title: `${L(ui.mediaKit.title, lang)} — ${L(p.name, lang)}`,
    description: L(ui.mediaKit.lead, lang),
    bodyClass: 'page-mediakit',
    printable: true,
    schema: [Schema.breadcrumbSchema(site, lang, crumbs)],
    content: `
    ${pageHero({
      eyebrow: L(ui.mediaKit.eyebrow, lang),
      title: L(ui.mediaKit.title, lang),
      lead: L(ui.mediaKit.lead, lang),
      crumbs,
      ui,
      lang,
      extra: `<div class="phero__cta">
        <button class="btn btn--solid" type="button" data-print>${icon('download', { size: 18 })}<span>${esc(L(ui.mediaKit.download, lang))}</span></button>
        <span class="phero__hint">${esc(L(ui.mediaKit.downloadHint, lang))}</span>
      </div>`,
    })}

    <section class="sec kit">
      <div class="wrap">
        <div class="kit__id">
          <div class="kit__photo">
            ${portrait(site, lang, { size: 'md' })}
            <p class="kit__photonote">${esc(L(ui.mediaKit.photoNote, lang))}</p>
          </div>
          <div class="kit__facts">
            <h2 class="kit__h">${esc(L(ui.mediaKit.identity, lang))}</h2>
            <dl class="deflist deflist--wide">
              ${row(L(ui.contact.name, lang), L(p.name, lang))}
              ${row('Name (EN)', L(p.name, 'en'), true)}
              ${row(L(ui.nav.about, lang), L(p.professionalTitle, lang))}
              ${row(L(ui.contact.email, lang), p.email, true)}
              ${row(L(ui.mediaKit.eyebrow, lang), L(p.location, lang))}
              ${row('Website', site.url.replace(/^https?:\/\//, ''), true)}
            </dl>
            <div class="kit__social">${socialLinks(site, ui, lang, { className: 'social social--lg', labelled: true })}</div>
          </div>
        </div>

        <div class="kit__grid">
          <section class="kit__block">
            <h2 class="kit__h">${esc(L(ui.mediaKit.shortBio, lang))}</h2>
            <p class="kit__text">${esc(L(p.shortBio, lang))}</p>
          </section>
          <section class="kit__block">
            <h2 class="kit__h">${esc(L(ui.mediaKit.longBio, lang))}</h2>
            ${(L(p.longBio, lang) || []).map((t) => `<p class="kit__text">${esc(t)}</p>`).join('')}
          </section>
        </div>

        <section class="kit__block">
          <h2 class="kit__h">${esc(L(ui.mediaKit.topicsTitle, lang))}</h2>
          <div class="chips">${topics.map((t) => chip(t)).join('')}</div>
        </section>

        <section class="kit__block">
          <h2 class="kit__h">${esc(L(ui.mediaKit.expertiseTitle, lang))}</h2>
          <div class="kit__cols">
            ${expertise
              .map(
                (g) => `<div><h3 class="kit__h3">${esc(L(g.title, lang))}</h3>
                  <ul class="ticks">${g.items.slice(0, 5).map((i) => `<li>${esc(L(i, lang))}</li>`).join('')}</ul></div>`
              )
              .join('')}
          </div>
        </section>

        <div class="kit__grid">
          <section class="kit__block">
            <h2 class="kit__h">${esc(L(ui.nav.articles, lang))}</h2>
            <ul class="linklist">
              ${articles.slice(0, 6).map((a) => `<li><a href="${href(`articles/${a.slug}/`, lang)}">${esc(a.title)}</a></li>`).join('') || `<li>${DASH}</li>`}
            </ul>
          </section>
          <section class="kit__block">
            <h2 class="kit__h">${esc(L(ui.nav.projects, lang))}</h2>
            <ul class="linklist">
              ${projects.slice(0, 6).map((x) => `<li><a href="${href(`projects/${x.slug}/`, lang)}">${esc(L(x.name, lang))}</a></li>`).join('') || `<li>${DASH}</li>`}
            </ul>
          </section>
        </div>

        ${
          book && book.enabled
            ? `<section class="kit__block">
                <h2 class="kit__h">${esc(L(ui.book.title, lang))}</h2>
                <p class="kit__text">${esc(L(book.title, lang))}${book.published ? '' : ` — ${esc(L(ui.common.comingSoon, lang))}`}</p>
                <p class="kit__text">${esc(L(book.tagline, lang))}</p>
              </section>`
            : ''
        }
      </div>
    </section>`,
  };
}

/* ═════════════════════════════════════════════════════════════════════
 *  التواصل  /  Contact
 * ═══════════════════════════════════════════════════════════════════ */
export function contactPage(d) {
  const { site, ui, lang } = d;
  const crumbs = crumb(d, [{ label: L(ui.nav.contact, lang), url: href('contact/', lang) }]);
  return {
    path: 'contact/',
    activeNav: 'contact',
    title: `${L(ui.contact.title, lang)} — ${L(site.profile.name, lang)}`,
    description: L(ui.contact.lead, lang),
    schema: [Schema.contactSchema(site, lang), Schema.breadcrumbSchema(site, lang, crumbs)],
    content: [
      pageHero({
        eyebrow: L(ui.contact.eyebrow, lang),
        title: L(ui.contact.title, lang),
        lead: L(ui.contact.lead, lang),
        crumbs,
        ui,
        lang,
      }),
      S.contactSection(d),
      S.presenceSection(d),
    ].join('\n'),
  };
}

/* ═════════════════════════════════════════════════════════════════════
 *  الصفحات القانونية  /  Legal pages
 * ═══════════════════════════════════════════════════════════════════ */
export function legalPage(d, doc, pathKey, navKey) {
  const { site, ui, lang, legal } = d;
  const title = L(doc.title, lang);
  const crumbs = crumb(d, [{ label: title, url: href(pathKey, lang) }]);
  return {
    path: pathKey,
    activeNav: navKey,
    title: `${title} — ${L(site.profile.name, lang)}`,
    description: L(doc.intro, lang),
    schema: [Schema.breadcrumbSchema(site, lang, crumbs)],
    content: `
    ${pageHero({ eyebrow: L(ui.footer.legal, lang), title, lead: L(doc.intro, lang), crumbs, ui, lang })}
    <section class="sec">
      <div class="wrap wrap--narrow prose">
        <p class="legal__updated">${esc(L(ui.articles.updatedOn, lang))}: ${esc(d.formatDate(legal.lastUpdated, lang))}</p>
        ${doc.sections
          .map(
            (s) => `<h2>${esc(L(s.heading, lang))}</h2>${(L(s.body, lang) || []).map((t) => `<p>${esc(t)}</p>`).join('')}`
          )
          .join('')}
      </div>
    </section>`,
  };
}

/* ═════════════════════════════════════════════════════════════════════
 *  404
 * ═══════════════════════════════════════════════════════════════════ */
export function notFoundPage(d) {
  const { site, ui, lang } = d;
  return {
    path: '404.html',
    isFile: true,
    activeNav: '',
    noindex: true,
    title: `404 — ${L(site.profile.name, lang)}`,
    description: L(ui.common.notFoundBody, lang),
    content: `
    <section class="sec sec--center">
      <div class="wrap wrap--narrow">
        <p class="eyebrow"><span class="eyebrow__dot" aria-hidden="true"></span>404</p>
        <h1 class="phero__title">${esc(L(ui.common.notFound, lang))}</h1>
        <p class="phero__lead">${esc(L(ui.common.notFoundBody, lang))}</p>
        <div class="phero__cta">
          ${button({ label: L(ui.common.backHome, lang), url: href('', lang), variant: 'solid', iconName: 'arrow' })}
          ${button({ label: L(ui.nav.articles, lang), url: href('articles/', lang), variant: 'ghost' })}
        </div>
      </div>
    </section>`,
  };
}
