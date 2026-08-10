/**
 * أقسام الصفحات  /  Page sections
 * كل قسم دالة مستقلة، تُركّب في الصفحة الرئيسية وتُعاد في الصفحات المخصصة.
 */

import { esc, attr, L, href, asset, DASH, orDash } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import {
  sectionHead,
  placeholderBadge,
  button,
  rating,
  portrait,
  statCard,
  chip,
  articleCard,
  toolCard,
  projectCard,
  emptyNote,
  ph,
} from './components.js';
import { socialLinks, tiktokButton } from './layout.js';

/* ═════════════════════════════════════════════════════════════════════
 *  1 · الهيرو  /  Hero
 * ═══════════════════════════════════════════════════════════════════ */
export function hero(d) {
  const { site, ui, lang } = d;
  const p = site.profile;
  const name = L(p.name, lang);

  return `
  <section class="hero">
    <div class="hero__bg" aria-hidden="true"><span class="hero__grid"></span><span class="hero__glow"></span></div>
    <div class="wrap hero__inner">
      <div class="hero__text">
        <p class="hero__eyebrow reveal">
          <span class="eyebrow__dot" aria-hidden="true"></span>
          ${esc(L(p.professionalTitle, lang))}
        </p>
        <h1 class="hero__name reveal${ph(name)}">${esc(name)}</h1>
        <p class="hero__headline reveal">${esc(L(p.headline, lang))}</p>
        <p class="hero__support reveal">${esc(L(p.supporting, lang))}</p>

        <div class="hero__cta reveal">
          ${button({ label: L(ui.hero.ctaPrimary, lang), url: href('articles/', lang), variant: 'solid', iconName: 'arrow' })}
          ${tiktokButton(site, ui, lang, { variant: 'outline' })}
          ${button({ label: L(ui.hero.ctaTertiary, lang), url: href('about/', lang), variant: 'ghost' })}
        </div>

        <div class="hero__social reveal">
          ${socialLinks(site, ui, lang, { size: 18 })}
          ${
            p.secondaryTitle
              ? `<span class="hero__second">${esc(L(p.secondaryTitle, lang))}</span>`
              : ''
          }
        </div>
      </div>

      <div class="hero__media reveal">
        ${portrait(site, lang, { size: 'lg' })}
        <div class="hero__badge">
          <span class="hero__badge-dot" aria-hidden="true"></span>
          <span>${esc(L(ui.hero.availableFor, lang))}</span>
        </div>
      </div>
    </div>
  </section>`;
}

/* ═════════════════════════════════════════════════════════════════════
 *  2 · شريط المصداقية  /  Trust strip
 * ═══════════════════════════════════════════════════════════════════ */
export function trustStrip(d) {
  const { ui, lang, about, computed } = d;
  return `
  <section class="trust">
    <div class="wrap">
      <p class="trust__eyebrow">${esc(L(ui.trust.eyebrow, lang))}</p>
      <div class="trust__grid reveal">
        ${about.stats.map((s) => statCard(s, lang, computed)).join('')}
      </div>
    </div>
  </section>`;
}

/* ═════════════════════════════════════════════════════════════════════
 *  3 · من أنا  /  About
 * ═══════════════════════════════════════════════════════════════════ */
export function aboutSection(d, { full = false } = {}) {
  const { site, ui, lang, about } = d;
  const paras = L(about.aboutParagraphs, lang) || [];
  const [first, ...rest] = paras;

  return `
  <section class="sec sec--about" id="about">
    <div class="wrap about__grid">
      <div class="about__main">
        ${sectionHead({ eyebrow: L(ui.about.eyebrow, lang), title: L(ui.about.title, lang), lead: L(ui.about.lead, lang) })}
        <div class="prose reveal">
          <p class="about__lead">${esc(first || '')}</p>
          ${
            rest.length
              ? full
                ? rest.map((t) => `<p>${esc(t)}</p>`).join('')
                : `<div class="about__more" data-expandable hidden>${rest.map((t) => `<p>${esc(t)}</p>`).join('')}</div>
                   <button class="linkbtn" type="button" data-expand
                     data-more="${attr(L(ui.common.readMore, lang))}"
                     data-less="${attr(L(ui.common.readLess, lang))}"
                     aria-expanded="false">${esc(L(ui.common.readMore, lang))}${icon('chevronDown', { size: 16 })}</button>`
              : ''
          }
        </div>

        <blockquote class="mission reveal">
          ${icon('quote', { size: 18, className: 'mission__icon' })}
          <p>${esc(L(about.mission, lang))}</p>
          <cite>${esc(L(ui.about.mission, lang))}</cite>
        </blockquote>
      </div>

      <div class="about__side">
        <h3 class="about__sideh">${esc(L(ui.about.interests, lang))}</h3>
        <ul class="ilist reveal">
          ${about.interests
            .map(
              (it) => `<li class="ilist__item">
                <span class="ilist__icon">${icon(it.icon, { size: 18 })}</span>
                <span class="ilist__text">
                  <span class="ilist__label">${esc(L(it.label, lang))}</span>
                  <span class="ilist__note">${esc(L(it.note, lang))}</span>
                </span>
              </li>`
            )
            .join('')}
        </ul>
        ${
          full
            ? ''
            : `<a class="linkbtn linkbtn--arrow" href="${href('about/', lang)}">${esc(L(ui.common.readMore, lang))}${icon('chevron', { size: 16 })}</a>`
        }
      </div>
    </div>
  </section>`;
}

/* ── التعليم والشهادات  /  Education & certifications ─────────────── */
export function credentialsSection(d) {
  const { ui, lang, about } = d;
  const edu = about.education || [];
  const certs = about.certifications || [];
  if (!edu.length && !certs.length) return '';

  const eduList = edu
    .map(
      (e) => `<li class="cred${e.placeholder ? ' is-placeholder' : ''}">
        <span class="cred__icon">${icon('cap', { size: 18 })}</span>
        <div class="cred__body">
          <p class="cred__title">${esc(L(e.degree, lang))}</p>
          <p class="cred__meta">${esc(L(e.institution, lang))} · ${esc(L(e.period, lang) || DASH)}</p>
          ${L(e.note, lang) ? `<p class="cred__note">${esc(L(e.note, lang))}</p>` : ''}
        </div>
      </li>`
    )
    .join('');

  const certList = certs
    .map(
      (c) => `<li class="cred${c.placeholder ? ' is-placeholder' : ''}">
        <span class="cred__icon">${icon('award', { size: 18 })}</span>
        <div class="cred__body">
          <p class="cred__title">${esc(L(c.name, lang))}</p>
          <p class="cred__meta">${esc(L(c.issuer, lang))} · ${esc(L(c.year, lang) || DASH)}</p>
          ${
            c.credentialUrl
              ? `<a class="cred__link" href="${attr(c.credentialUrl)}" target="_blank" rel="noopener noreferrer">${esc(L(ui.about.verifyCredential, lang))}${icon('external', { size: 13 })}</a>`
              : ''
          }
        </div>
      </li>`
    )
    .join('');

  return `
  <section class="sec sec--muted">
    <div class="wrap creds__grid">
      ${edu.length ? `<div><h2 class="creds__h">${esc(L(ui.about.education, lang))}</h2><ul class="creds reveal">${eduList}</ul></div>` : ''}
      ${certs.length ? `<div><h2 class="creds__h">${esc(L(ui.about.certifications, lang))}</h2><ul class="creds reveal">${certList}</ul></div>` : ''}
    </div>
  </section>`;
}

/* ── المسار المهني  /  Journey timeline ───────────────────────────── */
export function journeySection(d) {
  const { ui, lang, about } = d;
  const items = about.journey || [];
  if (!items.length) return '';
  const iconFor = { work: 'briefcase', education: 'cap', milestone: 'milestone', content: 'share' };

  return `
  <section class="sec">
    <div class="wrap">
      ${sectionHead({ eyebrow: L(ui.about.eyebrow, lang), title: L(ui.about.journey, lang) })}
      <ol class="tline tline--compact reveal">
        ${items
          .map(
            (it) => `<li class="tline__item${it.placeholder ? ' is-placeholder' : ''}">
              <span class="tline__marker">${icon(iconFor[it.type] || 'milestone', { size: 14 })}</span>
              <div class="tline__body">
                <span class="tline__year">${esc(L(it.year, lang))}</span>
                <h3 class="tline__title">${esc(L(it.title, lang))}</h3>
                <p class="tline__desc">${esc(L(it.description, lang))}</p>
              </div>
            </li>`
          )
          .join('')}
      </ol>
    </div>
  </section>`;
}

/* ═════════════════════════════════════════════════════════════════════
 *  4 · الخبرة المهنية  /  Experience timeline
 * ═══════════════════════════════════════════════════════════════════ */
export function experienceSection(d, { limit = null, showHead = true } = {}) {
  const { ui, lang, experience } = d;
  const items = limit ? experience.slice(0, limit) : experience;
  if (!items.length) return '';

  const list = items
    .map((job, idx) => {
      const resp = L(job.responsibilities, lang) || [];
      const ach = L(job.achievements, lang) || [];
      const stack = job.stack || [];
      const hasDetail = resp.length || ach.length || stack.length;
      const period = L(job.period, lang);

      return `<li class="exp${job.placeholder ? ' is-placeholder' : ''}">
        <div class="exp__rail" aria-hidden="true"><span class="exp__dot${job.current ? ' is-current' : ''}"></span></div>
        <article class="exp__card">
          <div class="exp__head">
            <div>
              <h3 class="exp__role">${esc(L(job.role, lang))}</h3>
              <p class="exp__org">${esc(L(job.organization, lang))}</p>
            </div>
            <div class="exp__when">
              ${job.current ? `<span class="tagpill tagpill--live">${esc(L(ui.experience.current, lang))}</span>` : ''}
              <span class="exp__period">${esc(period)}</span>
              <span class="exp__loc">${icon('location', { size: 13 })}${esc(L(job.location, lang))}</span>
            </div>
          </div>
          <p class="exp__summary">${esc(L(job.summary, lang))}</p>
          ${
            hasDetail
              ? `<button class="linkbtn" type="button" data-expand
                   data-more="${attr(L(ui.experience.expand, lang))}"
                   data-less="${attr(L(ui.experience.collapse, lang))}"
                   aria-expanded="false" aria-controls="exp-${idx}">
                   ${esc(L(ui.experience.expand, lang))}${icon('chevronDown', { size: 16 })}</button>
                 <div class="exp__detail" id="exp-${idx}" data-expandable hidden>
                   ${
                     resp.length
                       ? `<div class="exp__block"><h4>${esc(L(ui.experience.responsibilities, lang))}</h4><ul class="ticks">${resp
                           .map((r) => `<li>${esc(r)}</li>`)
                           .join('')}</ul></div>`
                       : ''
                   }
                   ${
                     ach.length
                       ? `<div class="exp__block"><h4>${esc(L(ui.experience.achievements, lang))}</h4><ul class="ticks ticks--accent">${ach
                           .map((a) => `<li>${esc(a)}</li>`)
                           .join('')}</ul></div>`
                       : ''
                   }
                   ${
                     stack.length
                       ? `<div class="exp__block"><h4>${esc(L(ui.experience.stack, lang))}</h4><div class="chips">${stack
                           .map((s) => chip(L(s, lang), { small: true }))
                           .join('')}</div></div>`
                       : ''
                   }
                 </div>`
              : ''
          }
        </article>
      </li>`;
    })
    .join('');

  return `
  <section class="sec" id="experience">
    <div class="wrap">
      ${
        showHead
          ? sectionHead({
              eyebrow: L(ui.experience.eyebrow, lang),
              title: L(ui.experience.title, lang),
              lead: L(ui.experience.lead, lang),
            })
          : `<h2 class="sr-only">${esc(L(ui.experience.roles, lang))}</h2>`
      }
      <ol class="exps reveal">${list}</ol>
    </div>
  </section>`;
}

/* ═════════════════════════════════════════════════════════════════════
 *  5 · التخصصات  /  Expertise
 * ═══════════════════════════════════════════════════════════════════ */
export function expertiseSection(d) {
  const { ui, lang, expertise } = d;
  return `
  <section class="sec sec--dark" id="expertise">
    <div class="wrap">
      ${sectionHead({
        eyebrow: L(ui.expertise.eyebrow, lang),
        title: L(ui.expertise.title, lang),
        lead: L(ui.expertise.lead, lang),
      })}
      <div class="xgrid reveal">
        ${expertise
          .map(
            (g) => `<article class="xcard${g.feature ? ' xcard--feature' : ''}">
              <span class="xcard__icon">${icon(g.icon, { size: 22 })}</span>
              <h3 class="xcard__title">${esc(L(g.title, lang))}</h3>
              <p class="xcard__intro">${esc(L(g.intro, lang))}</p>
              <ul class="xcard__items">
                ${g.items.map((i) => `<li>${esc(L(i, lang))}</li>`).join('')}
              </ul>
            </article>`
          )
          .join('')}
      </div>
    </div>
  </section>`;
}

/* ═════════════════════════════════════════════════════════════════════
 *  6 · أبرز المحتوى  /  Featured content
 * ═══════════════════════════════════════════════════════════════════ */
export function featuredSection(d) {
  const { ui, lang, articles, tools, tiktok } = d;
  const article = articles.find((a) => a.featured) || articles[0];
  const tool = tools.find((t) => t.featured) || tools[0];
  const video = (tiktok.videos || []).find((v) => v.url);
  if (!article && !tool && !video) return '';

  const cards = [];

  if (article) {
    cards.push(`<article class="fcard">
      <span class="fcard__type">${icon('book', { size: 14 })}${esc(L(ui.featured.typeArticle, lang))}</span>
      <h3 class="fcard__title"><a href="${href(`articles/${article.slug}/`, lang)}">${esc(article.title)}</a></h3>
      <p class="fcard__meta">${esc(article.category)} · ${esc(article.dateLabel)}</p>
      <p class="fcard__desc">${esc(article.description)}</p>
      <a class="linkbtn linkbtn--arrow" href="${href(`articles/${article.slug}/`, lang)}">${esc(L(ui.common.read, lang))}${icon('chevron', { size: 15 })}</a>
      ${article.placeholder ? placeholderBadge(ui, lang) : ''}
    </article>`);
  }

  if (tool) {
    cards.push(`<article class="fcard">
      <span class="fcard__type">${icon('spark', { size: 14 })}${esc(L(ui.featured.typeTool, lang))}</span>
      <h3 class="fcard__title"><a href="${href(`ai-tools/${tool.slug}/`, lang)}">${esc(L(tool.name, lang))}</a></h3>
      <p class="fcard__meta">${esc(tool.categoryLabel)}</p>
      <p class="fcard__desc">${esc(L(tool.summary, lang))}</p>
      <div class="fcard__rating">${rating(tool.rating, ui, lang)}</div>
      <a class="linkbtn linkbtn--arrow" href="${href(`ai-tools/${tool.slug}/`, lang)}">${esc(L(ui.common.details, lang))}${icon('chevron', { size: 15 })}</a>
      ${tool.placeholder ? placeholderBadge(ui, lang) : ''}
    </article>`);
  }

  cards.push(`<article class="fcard fcard--tiktok">
    <span class="fcard__type">${icon('tiktok', { size: 14 })}${esc(L(ui.featured.typeVideo, lang))}</span>
    <h3 class="fcard__title">${esc(L(ui.tiktok.title, lang))}</h3>
    <p class="fcard__desc">${esc(L(ui.tiktok.lead, lang))}</p>
    <div class="fcard__chips">${(d.tiktok.topics || [])
      .slice(0, 4)
      .map((t) => chip(L(t, lang), { small: true }))
      .join('')}</div>
    <a class="linkbtn linkbtn--arrow" href="${href('tiktok/', lang)}">${esc(L(ui.common.watch, lang))}${icon('chevron', { size: 15 })}</a>
  </article>`);

  return `
  <section class="sec">
    <div class="wrap">
      ${sectionHead({
        eyebrow: L(ui.featured.eyebrow, lang),
        title: L(ui.featured.title, lang),
        lead: L(ui.featured.lead, lang),
      })}
      <div class="fgrid reveal">${cards.join('')}</div>
    </div>
  </section>`;
}

/* ═════════════════════════════════════════════════════════════════════
 *  7 · المقالات  /  Articles
 * ═══════════════════════════════════════════════════════════════════ */
export function articlesSection(d, { limit = 3 } = {}) {
  const { ui, lang, articles } = d;
  if (!articles.length) return '';
  const list = articles.slice(0, limit);

  return `
  <section class="sec sec--muted" id="articles">
    <div class="wrap">
      <div class="sec__bar">
        ${sectionHead({
          eyebrow: L(ui.articles.eyebrow, lang),
          title: L(ui.articles.title, lang),
          lead: L(ui.articles.lead, lang),
        })}
        <a class="linkbtn linkbtn--arrow" href="${href('articles/', lang)}">${esc(L(ui.common.viewAll, lang))}${icon('chevron', { size: 16 })}</a>
      </div>
      <div class="agrid reveal">${list.map((a) => articleCard(a, ui, lang)).join('')}</div>
    </div>
  </section>`;
}

/* ═════════════════════════════════════════════════════════════════════
 *  8 · أدوات الذكاء الاصطناعي  /  AI tools preview
 * ═══════════════════════════════════════════════════════════════════ */
export function toolsSection(d, { limit = 3 } = {}) {
  const { ui, lang, tools } = d;
  if (!tools.length) return '';

  return `
  <section class="sec" id="ai-tools">
    <div class="wrap">
      <div class="sec__bar">
        ${sectionHead({
          eyebrow: L(ui.tools.eyebrow, lang),
          title: L(ui.tools.title, lang),
          lead: L(ui.tools.lead, lang),
        })}
        <a class="linkbtn linkbtn--arrow" href="${href('ai-tools/', lang)}">${esc(L(ui.common.viewAll, lang))}${icon('chevron', { size: 16 })}</a>
      </div>
      <div class="tgrid reveal">${tools.slice(0, limit).map((t) => toolCard(t, ui, lang)).join('')}</div>
    </div>
  </section>`;
}

/* ═════════════════════════════════════════════════════════════════════
 *  9 · الكتاب  /  Book
 * ═══════════════════════════════════════════════════════════════════ */
export function bookSection(d, { full = false } = {}) {
  const { ui, lang, book } = d;
  if (!book || !book.enabled) return '';

  const links = (book.links || [])
    .filter((l) => l.url)
    .map((l) =>
      button({
        label: L(l.label, lang),
        url: l.url,
        variant: l.primary ? 'solid' : 'outline',
        external: true,
        iconName: l.primary ? 'arrow' : 'download',
      })
    )
    .join('');

  const pub = book.publication || {};
  const pubRows = [
    [L(ui.book.publisher, lang), L(pub.publisher, lang)],
    [L(ui.book.year, lang), pub.year],
    [L(ui.book.pages, lang), pub.pages],
    [L(ui.book.lang, lang), L(pub.language, lang)],
    [L(ui.book.isbn, lang), pub.isbn],
    [L(ui.book.format, lang), L(pub.format, lang)],
  ];

  const cover = `
    <div class="bookshot reveal">
      <div class="bookshot__book">
        <div class="bookshot__cover${book.coverIsPlaceholder ? ' is-empty' : ''}">
          <img src="${asset(book.cover)}" alt="${attr(L(book.coverAlt, lang))}" width="400" height="600"
            loading="lazy" decoding="async"
            onerror="this.closest('.bookshot__cover').classList.add('is-empty');this.remove();">
          <div class="bookshot__fallback">
            <span class="bookshot__ftitle">${esc(L(book.title, lang))}</span>
            <span class="bookshot__fauthor">${esc(L(d.site.profile.name, lang))}</span>
          </div>
        </div>
        <span class="bookshot__spine" aria-hidden="true"></span>
      </div>
      <span class="bookshot__shadow" aria-hidden="true"></span>
    </div>`;

  return `
  <section class="sec sec--dark sec--book" id="book">
    <div class="wrap book__grid">
      ${cover}
      <div class="book__body">
        ${sectionHead({ eyebrow: L(ui.book.eyebrow, lang), title: L(ui.book.title, lang) })}
        ${!book.published ? `<span class="tagpill tagpill--soon">${esc(L(ui.common.comingSoon, lang))}</span>` : ''}
        <h3 class="book__title${ph(L(book.title, lang))}">${esc(L(book.title, lang))}</h3>
        ${L(book.subtitle, lang) ? `<p class="book__sub">${esc(L(book.subtitle, lang))}</p>` : ''}
        <p class="book__tag">${esc(L(book.tagline, lang))}</p>
        <div class="prose prose--invert">
          ${(L(book.description, lang) || []).slice(0, full ? 99 : 1).map((t) => `<p>${esc(t)}</p>`).join('')}
        </div>

        ${
          full
            ? `
          <div class="book__cols">
            <div>
              <h4 class="book__h">${esc(L(ui.book.why, lang))}</h4>
              ${(L(book.why, lang) || []).map((t) => `<p class="book__p">${esc(t)}</p>`).join('')}
            </div>
            <div>
              <h4 class="book__h">${esc(L(ui.book.topics, lang))}</h4>
              <ul class="ticks ticks--accent">${(L(book.topics, lang) || []).map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
            </div>
            <div>
              <h4 class="book__h">${esc(L(ui.book.audience, lang))}</h4>
              <ul class="ticks">${(L(book.audience, lang) || []).map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
            </div>
          </div>
          <div class="book__pub">
            <h4 class="book__h">${esc(L(ui.book.publication, lang))}</h4>
            <dl class="deflist">
              ${pubRows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(orDash(v))}</dd></div>`).join('')}
            </dl>
          </div>`
            : ''
        }

        <div class="book__cta">
          ${links}
          ${
            full
              ? ''
              : button({ label: L(ui.book.learnMore, lang), url: href('book/', lang), variant: links ? 'ghost' : 'outline', iconName: 'arrow' })
          }
        </div>
        ${book.placeholder ? placeholderBadge(ui, lang) : ''}
      </div>
    </div>
  </section>`;
}

/* ═════════════════════════════════════════════════════════════════════
 * 10 · المشاريع  /  Projects
 * ═══════════════════════════════════════════════════════════════════ */
export function projectsSection(d, { limit = 2 } = {}) {
  const { ui, lang, projects } = d;
  if (!projects.length) return '';
  return `
  <section class="sec sec--muted" id="projects">
    <div class="wrap">
      <div class="sec__bar">
        ${sectionHead({
          eyebrow: L(ui.projects.eyebrow, lang),
          title: L(ui.projects.title, lang),
          lead: L(ui.projects.lead, lang),
        })}
        <a class="linkbtn linkbtn--arrow" href="${href('projects/', lang)}">${esc(L(ui.common.viewAll, lang))}${icon('chevron', { size: 16 })}</a>
      </div>
      <div class="pgrid reveal">${projects.slice(0, limit).map((p) => projectCard(p, ui, lang)).join('')}</div>
    </div>
  </section>`;
}

/* ═════════════════════════════════════════════════════════════════════
 * 11 · TikTok
 * ═══════════════════════════════════════════════════════════════════ */
export function tiktokSection(d, { full = false } = {}) {
  const { site, ui, lang, tiktok } = d;
  if (!tiktok.enabled) return '';
  const p = site.profile;
  const videos = (tiktok.videos || []).filter((v) => v.videoId);

  const embeds = videos.length
    ? `<div class="ttgrid reveal">
        ${videos
          .map(
            (v) => `<div class="ttvid">
              <div class="ttvid__frame" data-tiktok="${attr(v.videoId)}" data-url="${attr(v.url)}">
                <button class="ttvid__load" type="button" data-tiktok-load
                  data-track="tiktok_click" aria-label="${attr(L(ui.tiktok.loadEmbed, lang))}">
                  ${icon('play', { size: 26 })}<span>${esc(L(ui.tiktok.loadEmbed, lang))}</span>
                </button>
              </div>
              <p class="ttvid__title">${esc(L(v.title, lang))}</p>
            </div>`
          )
          .join('')}
      </div>`
    : `<p class="empty reveal">${esc(L(ui.tiktok.noVideos, lang))}</p>`;

  return `
  <section class="sec sec--tiktok" id="tiktok">
    <div class="wrap">
      ${sectionHead({
        eyebrow: L(ui.tiktok.eyebrow, lang),
        title: L(ui.tiktok.title, lang),
        lead: L(ui.tiktok.lead, lang),
      })}

      <div class="ttprofile reveal">
        ${portrait(site, lang, { size: 'md', className: 'ttprofile__photo' })}
        <div class="ttprofile__body">
          <p class="ttprofile__name">${esc(L(p.name, lang))}</p>
          <p class="ttprofile__handle handle${ph(tiktok.handle)}">${esc(tiktok.handle)}</p>
          <p class="ttprofile__bio">${esc(L(tiktok.bio, lang))}</p>
          <div class="ttprofile__stats">
            <span><b>${esc(orDash(tiktok.followers))}</b>${esc(L(ui.tiktok.followers, lang))}</span>
            <span><b>${esc(orDash(tiktok.likes))}</b>${esc(L(ui.tiktok.likes, lang))}</span>
          </div>
          <div class="ttprofile__cta">${tiktokButton(site, ui, lang, { variant: 'solid' })}</div>
        </div>
        <div class="ttprofile__topics">
          <p class="ttprofile__th">${esc(L(ui.tiktok.topics, lang))}</p>
          <div class="chips">${(tiktok.topics || []).map((t) => chip(L(t, lang), { small: true })).join('')}</div>
        </div>
      </div>

      <h3 class="tt__h">${esc(L(ui.tiktok.latest, lang))}</h3>
      ${embeds}
      ${full ? '' : `<div class="sec__more">${button({ label: L(ui.common.viewAll, lang), url: href('tiktok/', lang), variant: 'ghost', iconName: 'arrow' })}</div>`}
    </div>
  </section>`;
}

/* ═════════════════════════════════════════════════════════════════════
 * 12 · الحضور الرقمي الرسمي  /  Official digital presence
 * ═══════════════════════════════════════════════════════════════════ */
export function presenceSection(d) {
  const { site, ui, lang } = d;
  const p = site.profile;
  const accounts = p.social.filter((s) => s.url);

  return `
  <section class="sec sec--presence" id="presence">
    <div class="wrap presence__grid">
      <div>
        ${sectionHead({
          eyebrow: L(ui.presence.eyebrow, lang),
          title: L(ui.presence.title, lang),
          lead: L(ui.presence.lead, lang),
        })}
        <p class="presence__note">${icon('shield', { size: 16 })}${esc(L(ui.presence.note, lang))}</p>
      </div>
      <div class="presence__card reveal">
        <div class="presence__id">
          ${portrait(site, lang, { size: 'sm' })}
          <div>
            <p class="presence__name">${esc(L(p.name, lang))}</p>
            <p class="presence__role">${esc(L(p.professionalTitle, lang))}</p>
          </div>
        </div>
        <ul class="presence__list">
          ${
            accounts.length
              ? accounts
                  .map(
                    (s) => `<li>
                      <a href="${attr(s.url)}"${s.id === 'email' ? '' : ' target="_blank" rel="noopener noreferrer"'}
                        data-track="social_click" data-track-label="${attr(s.id)}">
                        <span class="presence__icon">${icon(s.id, { size: 18 })}</span>
                        <span class="presence__meta">
                          <b>${esc(typeof s.label === 'string' ? s.label : L(s.label, lang))}</b>
                          <span class="handle">${esc(s.handle)}</span>
                        </span>
                        ${icon('external', { size: 15, className: 'presence__ext' })}
                      </a>
                    </li>`
                  )
                  .join('')
              : p.social
                  .map(
                    (s) => `<li class="is-placeholder">
                      <span class="presence__row">
                        <span class="presence__icon">${icon(s.id, { size: 18 })}</span>
                        <span class="presence__meta">
                          <b>${esc(typeof s.label === 'string' ? s.label : L(s.label, lang))}</b>
                          <span class="handle">${esc(s.handle)}</span>
                        </span>
                      </span>
                    </li>`
                  )
                  .join('')
          }
        </ul>
      </div>
    </div>
  </section>`;
}

/* ═════════════════════════════════════════════════════════════════════
 * 13 · الملف التعريفي (تمهيد)  /  Media kit teaser
 * ═══════════════════════════════════════════════════════════════════ */
export function mediaKitTeaser(d) {
  const { ui, lang } = d;
  return `
  <section class="sec sec--muted">
    <div class="wrap teaser">
      <div>
        <p class="eyebrow"><span class="eyebrow__dot" aria-hidden="true"></span>${esc(L(ui.mediaKit.eyebrow, lang))}</p>
        <h2 class="teaser__title">${esc(L(ui.mediaKit.title, lang))}</h2>
        <p class="teaser__lead">${esc(L(ui.mediaKit.lead, lang))}</p>
      </div>
      ${button({ label: L(ui.mediaKit.title, lang), url: href('media-kit/', lang), variant: 'outline', iconName: 'arrow' })}
    </div>
  </section>`;
}

/* ═════════════════════════════════════════════════════════════════════
 * 14 · التواصل  /  Contact
 * ═══════════════════════════════════════════════════════════════════ */
export function contactSection(d) {
  const { site, ui, lang } = d;
  const p = site.profile;
  const mode = site.contactForm.mode;
  const emailReal = p.email && !/^\[/.test(p.email);

  return `
  <section class="sec sec--contact" id="contact">
    <div class="wrap contact__grid">
      <div class="contact__intro">
        ${sectionHead({
          eyebrow: L(ui.contact.eyebrow, lang),
          title: L(ui.contact.title, lang),
          lead: L(ui.contact.lead, lang),
        })}
        <ul class="contact__meta">
          <li>${icon('email', { size: 17 })}
            ${emailReal ? `<a class="handle" href="mailto:${attr(p.email)}">${esc(p.email)}</a>` : `<span class="handle is-placeholder">${esc(p.email)}</span>`}
          </li>
          <li>${icon('location', { size: 17 })}<span class="${ph(L(p.location, lang)).trim()}">${esc(L(p.location, lang))}</span></li>
          <li>${icon('check', { size: 17 })}<span>${esc(L(p.availability, lang))}</span></li>
        </ul>
        ${socialLinks(site, ui, lang, { className: 'social social--lg', labelled: false })}
      </div>

      <form class="cform reveal" data-contact-form
        data-mode="${attr(mode)}"
        data-endpoint="${attr(site.contactForm.endpoint || '')}"
        data-email="${attr(p.email)}"
        ${mode === 'endpoint' && site.contactForm.endpoint ? `action="${attr(site.contactForm.endpoint)}" method="post"` : ''}
        novalidate>
        <div class="cform__row">
          <label class="field">
            <span class="field__label">${esc(L(ui.contact.name, lang))}</span>
            <input class="field__input" type="text" name="name" required autocomplete="name" maxlength="120">
            <span class="field__err" data-err></span>
          </label>
          <label class="field">
            <span class="field__label">${esc(L(ui.contact.email, lang))}</span>
            <input class="field__input" type="email" name="email" required autocomplete="email" maxlength="180" dir="ltr">
            <span class="field__err" data-err></span>
          </label>
        </div>
        <label class="field">
          <span class="field__label">${esc(L(ui.contact.subject, lang))}</span>
          <input class="field__input" type="text" name="subject" required maxlength="160">
          <span class="field__err" data-err></span>
        </label>
        <label class="field">
          <span class="field__label">${esc(L(ui.contact.message, lang))}</span>
          <textarea class="field__input" name="message" rows="5" required maxlength="4000"></textarea>
          <span class="field__err" data-err></span>
        </label>

        <!-- حماية من السبام: حقل خفي + ختم زمني -->
        <div class="hp" aria-hidden="true">
          <label>لا تملأ هذا الحقل<input type="text" name="company" tabindex="-1" autocomplete="off"></label>
        </div>
        <input type="hidden" name="_ts" value="">

        <div class="cform__foot">
          <button class="btn btn--solid" type="submit" data-track="contact_submit">
            ${icon('arrow', { size: 18 })}<span>${esc(L(ui.contact.send, lang))}</span>
          </button>
          <p class="cform__note">${esc(L(ui.contact.privacyNote, lang))}</p>
        </div>
        <p class="cform__status" data-status role="status" aria-live="polite"></p>
        <p class="cform__msgs" hidden
          data-msg-required="${attr(L(ui.contact.required, lang))}"
          data-msg-email="${attr(L(ui.contact.invalidEmail, lang))}"
          data-msg-short="${attr(L(ui.contact.tooShort, lang))}"
          data-msg-success="${attr(L(ui.contact.success, lang))}"
          data-msg-error="${attr(L(ui.contact.error, lang))}"
          data-msg-sending="${attr(L(ui.contact.sending, lang))}"></p>
      </form>
    </div>
  </section>`;
}

/* ═════════════════════════════════════════════════════════════════════
 * 15 · دعوة المتابعة  /  Follow CTA (نهاية المقالات وصفحات الأدوات)
 * ═══════════════════════════════════════════════════════════════════ */
export function followCta(d) {
  const { site, ui, lang } = d;
  return `
  <aside class="followcta">
    <p class="followcta__text">${esc(L(ui.articles.ctaTitle, lang))}</p>
    ${tiktokButton(site, ui, lang, { variant: 'solid' })}
  </aside>`;
}
