/**
 * أقسام الصفحات  /  Page sections
 * كل قسم دالة مستقلة، تُركّب في الصفحة الرئيسية وتُعاد في الصفحات المخصصة.
 */

import { esc, attr, L, href, asset, DASH, orDash } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import {
  sectionHead,
  button,
  portrait,
  statCard,
  chip,
  projectCard,
  emptyNote,
  ph,
} from './components.js';
import { socialLinks, tiktokButton, cvButton } from './layout.js';

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
          ${esc(name)} · ${esc(L(p.professionalTitle, lang))}
        </p>

        <h1 class="hero__title reveal${ph(L(p.headline, lang))}">${esc(L(p.headline, lang))}</h1>
        <p class="hero__support reveal">${esc(L(p.supporting, lang))}</p>

        ${
          p.keywordsLine
            ? `<p class="hero__keywords reveal">${esc(L(p.keywordsLine, lang))}</p>`
            : ''
        }

        <div class="hero__cta reveal">
          ${button({ label: L(ui.hero.ctaPrimary, lang), url: href('projects/', lang), variant: 'solid', iconName: 'arrow' })}
          ${button({ label: L(ui.hero.ctaSecondary, lang), url: href('contact/', lang), variant: 'outline' })}
        </div>

        <div class="hero__social reveal">
          ${socialLinks(site, ui, lang, { size: 18 })}
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
 *  2 · شريط الإثبات  /  Proof strip
 * ═══════════════════════════════════════════════════════════════════ */
export function trustStrip(d) {
  const { ui, lang, about, computed } = d;
  if (!about.stats || !about.stats.length) return '';
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
 *  3 · المشروع الأبرز  /  Featured case study
 * ═══════════════════════════════════════════════════════════════════ */
export function featuredProject(d) {
  const { ui, lang, projects } = d;
  const p = projects.find((x) => x.featured);
  if (!p) return '';

  const name = L(p.name, lang);
  const highlights = L(p.highlights, lang) || [];
  const results = L(p.results, lang) || [];

  return `
  <section class="sec sec--dark sec--case" id="featured">
    <div class="wrap">
      <div class="case__head">
        <p class="eyebrow"><span class="eyebrow__dot" aria-hidden="true"></span>${esc(L(ui.featured.eyebrow, lang))}</p>
        <h2 class="case__name">${esc(name)}</h2>
        <p class="case__tagline">${esc(L(p.tagline, lang))}</p>
        <div class="chips case__cats">${(p.categories || []).map((c) => chip(c, { small: true })).join('')}</div>
      </div>

      ${
        (p.metrics || []).length
          ? `<div class="metrics reveal">
              ${p.metrics
                .map(
                  (m) => `<div class="metric">
                    <span class="metric__value" dir="auto">${esc(m.value)}</span>
                    <span class="metric__label">${esc(L(m.label, lang))}</span>
                  </div>`
                )
                .join('')}
            </div>`
          : ''
      }

      <div class="case__grid reveal">
        <div class="case__block">
          <h3 class="case__h">${esc(L(ui.featured.problem, lang))}</h3>
          <p>${esc(L(p.problem, lang))}</p>
        </div>
        <div class="case__block">
          <h3 class="case__h">${esc(L(ui.featured.solution, lang))}</h3>
          <p>${esc(L(p.solution, lang))}</p>
        </div>
        <div class="case__block">
          <h3 class="case__h">${esc(L(ui.featured.role, lang))}</h3>
          <p>${esc(L(p.role, lang))}</p>
        </div>
      </div>

      ${
        highlights.length
          ? `<div class="case__tech reveal">
              <h3 class="case__h">${esc(L(ui.featured.highlights, lang))}</h3>
              <ul class="ticks ticks--accent case__list">${highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>
            </div>`
          : ''
      }

      <div class="case__foot reveal">
        <div>
          <h3 class="case__h">${esc(L(ui.featured.stack, lang))}</h3>
          <div class="chips">${(p.stack || []).map((s) => chip(L(s, lang), { small: true })).join('')}</div>
        </div>
        ${button({ label: L(ui.common.caseStudy, lang), url: href(`projects/${p.slug}/`, lang), variant: 'solid', iconName: 'arrow' })}
      </div>

      ${
        results.length
          ? `<p class="case__outcome reveal"><b>${esc(L(ui.featured.outcome, lang))}:</b> ${esc(results[0])}</p>`
          : ''
      }
    </div>
  </section>`;
}

/* ═════════════════════════════════════════════════════════════════════
 *  4 · المشاريع  /  Selected projects
 * ═══════════════════════════════════════════════════════════════════ */
export function projectsSection(d, { limit = null, excludeFeatured = true, showHead = true } = {}) {
  const { ui, lang } = d;
  let list = d.projects;
  if (excludeFeatured) list = list.filter((p) => !p.featured);
  if (limit) list = list.slice(0, limit);
  if (!list.length) return '';

  return `
  <section class="sec" id="projects">
    <div class="wrap">
      ${
        showHead
          ? `<div class="sec__bar">
              ${sectionHead({
                eyebrow: L(ui.projects.eyebrow, lang),
                title: L(ui.projects.title, lang),
                lead: L(ui.projects.lead, lang),
              })}
              <a class="linkbtn linkbtn--arrow" href="${href('projects/', lang)}">${esc(L(ui.common.viewAll, lang))}${icon('chevron', { size: 16 })}</a>
            </div>`
          : `<h2 class="sr-only">${esc(L(ui.projects.title, lang))}</h2>`
      }
      <div class="pgrid reveal">${list.map((p) => projectCard(p, ui, lang)).join('')}</div>
    </div>
  </section>`;
}

/* ═════════════════════════════════════════════════════════════════════
 *  5 · ماذا أفعل  /  What I Do
 * ═══════════════════════════════════════════════════════════════════ */
export function whatIDoSection(d) {
  const { ui, lang, about } = d;
  const items = about.whatIDo || [];
  if (!items.length) return '';

  return `
  <section class="sec sec--muted" id="what-i-do">
    <div class="wrap">
      ${sectionHead({
        eyebrow: L(ui.whatIDo.eyebrow, lang),
        title: L(ui.whatIDo.title, lang),
        lead: L(ui.whatIDo.lead, lang),
      })}
      <div class="dgrid reveal">
        ${items
          .map(
            (it, i) => `<article class="dcard">
              <span class="dcard__num">${String(i + 1).padStart(2, '0')}</span>
              <span class="dcard__icon">${icon(it.icon, { size: 20 })}</span>
              <h3 class="dcard__title">${esc(L(it.label, lang))}</h3>
              <p class="dcard__note">${esc(L(it.note, lang))}</p>
            </article>`
          )
          .join('')}
      </div>
    </div>
  </section>`;
}

/* ═════════════════════════════════════════════════════════════════════
 *  6 · المهارات  /  Skills
 * ═══════════════════════════════════════════════════════════════════ */
export function expertiseSection(d, { dark = true } = {}) {
  const { ui, lang, expertise } = d;
  if (!expertise.length) return '';
  return `
  <section class="sec ${dark ? 'sec--dark' : ''}" id="expertise">
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
 *  7 · لماذا منال  /  Why me
 * ═══════════════════════════════════════════════════════════════════ */
export function whyMeSection(d) {
  const { ui, lang, about } = d;
  const w = about.whyMe;
  if (!w) return '';
  const lead = L(w.lead, lang) || [];

  return `
  <section class="sec" id="why">
    <div class="wrap why__grid">
      <div class="why__intro">
        ${sectionHead({ eyebrow: L(ui.whyMe.eyebrow, lang), title: L(ui.whyMe.title, lang) })}
        <div class="prose">${lead.map((t, i) => `<p${i === 0 ? ' class="why__lead"' : ''}>${esc(t)}</p>`).join('')}</div>
      </div>
      <div class="wgrid reveal">
        ${(w.cards || [])
          .map(
            (c) => `<article class="wcard">
              <span class="wcard__icon">${icon(c.icon, { size: 18 })}</span>
              <h3 class="wcard__title">${esc(L(c.title, lang))}</h3>
              <p class="wcard__note">${esc(L(c.note, lang))}</p>
            </article>`
          )
          .join('')}
      </div>
    </div>
  </section>`;
}

/* ═════════════════════════════════════════════════════════════════════
 *  8 · من أنا  /  About
 * ═══════════════════════════════════════════════════════════════════ */
export function aboutSection(d, { full = false } = {}) {
  const { site, ui, lang, about } = d;
  const paras = L(about.aboutParagraphs, lang) || [];
  const [first, ...rest] = paras;

  return `
  <section class="sec sec--muted sec--about" id="about">
    <div class="wrap about__grid">
      <div class="about__media reveal">
        ${portrait(site, lang, { size: 'md' })}
      </div>
      <div class="about__main">
        ${sectionHead({ eyebrow: L(ui.about.eyebrow, lang), title: L(ui.about.title, lang) })}
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
        ${
          about.mission
            ? `<blockquote class="mission reveal">
                ${icon('quote', { size: 18, className: 'mission__icon' })}
                <p>${esc(L(about.mission, lang))}</p>
              </blockquote>`
            : ''
        }
      </div>
    </div>
  </section>`;
}

/* ═════════════════════════════════════════════════════════════════════
 *  9 · الخبرة  /  Experience
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

      return `<li class="exp">
        <div class="exp__rail" aria-hidden="true"><span class="exp__dot${job.current ? ' is-current' : ''}"></span></div>
        <article class="exp__card">
          <div class="exp__head">
            <div>
              <h3 class="exp__role">${esc(L(job.role, lang))}</h3>
              <p class="exp__org">${esc(L(job.organization, lang))}</p>
            </div>
            <div class="exp__when">
              ${job.current ? `<span class="tagpill tagpill--live">${esc(L(ui.experience.current, lang))}</span>` : ''}
              <span class="exp__period">${esc(L(job.period, lang))}</span>
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
 * 10 · المحتوى التقني  /  Technical content
 * ═══════════════════════════════════════════════════════════════════ */
export function contentSection(d) {
  const { site, ui, lang, tiktok } = d;
  if (!tiktok.enabled) return '';
  const hasLink = Boolean(tiktok.profileUrl);

  return `
  <section class="sec sec--muted" id="content">
    <div class="wrap creator">
      <div class="creator__body">
        ${sectionHead({ eyebrow: L(ui.content.eyebrow, lang), title: L(ui.content.title, lang) })}
        <p class="creator__text">${esc(L(tiktok.bio, lang))}</p>

        <div class="creator__topics">
          <p class="creator__th">${esc(L(ui.content.topics, lang))}</p>
          <div class="chips">${(tiktok.topics || []).map((t) => chip(L(t, lang), { small: true })).join('')}</div>
        </div>

        <div class="creator__cta">
          ${tiktokButton(site, ui, lang, { variant: 'solid', label: L(ui.content.follow, lang) })}
          ${hasLink ? '' : `<span class="todo">${esc(L(ui.content.linkTodo, lang))}</span>`}
        </div>
      </div>

      <aside class="creator__stat reveal">
        <span class="creator__num" dir="auto">${esc(L(tiktok.audience, lang) || DASH)}</span>
        <span class="creator__label">${esc(L(tiktok.audienceLabel, lang))}</span>
        ${icon('tiktok', { size: 26, className: 'creator__brand' })}
      </aside>
    </div>
  </section>`;
}

/* ═════════════════════════════════════════════════════════════════════
 * 11 · المنشورات  /  Publications
 * ═══════════════════════════════════════════════════════════════════ */
export function publicationsSection(d) {
  const { ui, lang, publications } = d;
  const items = publications?.items || [];
  if (!items.length) return '';

  return `
  <section class="sec" id="publications">
    <div class="wrap">
      ${sectionHead({
        eyebrow: L(ui.publications.eyebrow, lang),
        title: L(publications.title, lang),
        lead: L(publications.lead, lang),
      })}
      <div class="pubgrid reveal">
        ${items
          .map(
            (it) => `<article class="pub">
              <span class="pub__icon">${icon(it.icon || 'quote', { size: 20 })}</span>
              <p class="pub__type">${esc(L(it.type, lang))}</p>
              <h3 class="pub__title">${esc(L(it.title, lang))}</h3>
              <p class="pub__venue">${esc(L(it.venue, lang))}</p>
              <p class="pub__desc">${esc(L(it.description, lang))}</p>
              ${
                it.url
                  ? `<a class="linkbtn linkbtn--arrow" href="${attr(it.url)}" target="_blank" rel="noopener noreferrer">${esc(L(it.cta, lang))}${icon('external', { size: 15 })}</a>`
                  : `<span class="todo">${esc(L(ui.publications.linkTodo, lang))}</span>`
              }
            </article>`
          )
          .join('')}
      </div>
    </div>
  </section>`;
}

/* ═════════════════════════════════════════════════════════════════════
 * 12 · التعليم والشهادات  /  Education & certifications
 * ═══════════════════════════════════════════════════════════════════ */
export function credentialsSection(d, { muted = true } = {}) {
  const { ui, lang, about } = d;
  const edu = about.education || [];
  const certs = about.certifications || [];
  if (!edu.length && !certs.length) return '';

  const eduList = edu
    .map(
      (e) => `<li class="cred">
        <span class="cred__icon">${icon('cap', { size: 18 })}</span>
        <div class="cred__body">
          <p class="cred__title">${esc(L(e.degree, lang))}</p>
          <p class="cred__meta">${esc(L(e.institution, lang))}${L(e.period, lang) && L(e.period, lang) !== '—' ? ` · ${esc(L(e.period, lang))}` : ''}</p>
          ${L(e.note, lang) ? `<p class="cred__note">${esc(L(e.note, lang))}</p>` : ''}
        </div>
      </li>`
    )
    .join('');

  const certList = certs
    .map(
      (c) => `<li class="cred">
        <span class="cred__icon">${icon('award', { size: 18 })}</span>
        <div class="cred__body">
          <p class="cred__title">${esc(L(c.name, lang))}</p>
          ${L(c.issuer, lang) && L(c.issuer, lang) !== '—' ? `<p class="cred__meta">${esc(L(c.issuer, lang))}</p>` : ''}
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
  <section class="sec ${muted ? 'sec--muted' : ''}" id="education">
    <div class="wrap creds__grid">
      ${edu.length ? `<div><h2 class="creds__h">${esc(L(ui.about.education, lang))}</h2><ul class="creds reveal">${eduList}</ul></div>` : ''}
      ${certs.length ? `<div><h2 class="creds__h">${esc(L(ui.about.certifications, lang))}</h2><ul class="creds reveal">${certList}</ul></div>` : ''}
    </div>
  </section>`;
}

/* ── محاضرات ومشاركات  /  Talks & contributions ───────────────────── */
export function contributionsSection(d) {
  const { ui, lang, about } = d;
  const c = about.contributions;
  if (!c || !(c.items || []).length) return '';

  return `
  <section class="sec">
    <div class="wrap">
      ${sectionHead({
        eyebrow: L(ui.contributions.eyebrow, lang),
        title: L(c.title, lang),
        lead: L(c.lead, lang),
      })}
      <ul class="talks reveal">
        ${c.items
          .map(
            (t) => `<li class="talk">
              <span class="talk__icon">${icon('mic', { size: 16 })}</span>
              <div>
                <p class="talk__title">${esc(L(t.title, lang))}</p>
                <p class="talk__org">${esc(L(t.org, lang))}</p>
                ${
                  t.url
                    ? `<a class="talk__link" href="${attr(t.url)}" target="_blank" rel="noopener noreferrer">${esc(L(ui.contributions.coverage, lang))}${icon('external', { size: 13 })}</a>`
                    : ''
                }
              </div>
            </li>`
          )
          .join('')}
      </ul>
    </div>
  </section>`;
}

/* ═════════════════════════════════════════════════════════════════════
 * 13 · إلى أين أتجه  /  Where I'm heading
 * ═══════════════════════════════════════════════════════════════════ */
export function careerSection(d) {
  const { ui, lang, about } = d;
  const c = about.career;
  if (!c) return '';
  return `
  <section class="sec sec--dark sec--career">
    <div class="wrap wrap--narrow career">
      <p class="eyebrow"><span class="eyebrow__dot" aria-hidden="true"></span>${esc(L(ui.career.eyebrow, lang))}</p>
      <h2 class="career__title">${esc(L(c.title, lang))}</h2>
      <p class="career__body">${esc(L(c.body, lang))}</p>
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
          <li>${icon('email', { size: 17 })}<a class="handle" href="mailto:${attr(p.email)}">${esc(p.email)}</a></li>
          <li>${icon('location', { size: 17 })}<span>${esc(L(p.location, lang))}</span></li>
          <li>${icon('check', { size: 17 })}<span>${esc(L(p.availability, lang))}</span></li>
        </ul>
        <div class="contact__actions">
          ${button({ label: L(ui.contact.emailMe, lang), url: `mailto:${p.email}`, variant: 'outline', iconName: 'email' })}
          ${cvButton(site, ui, lang)}
        </div>
        ${socialLinks(site, ui, lang, { className: 'social social--lg' })}
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

/* ── تمهيد الملف التعريفي  /  Media kit teaser ────────────────────── */
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
