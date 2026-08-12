/**
 * بُناة الصفحات  /  Page builders
 * كل دالة تُرجع { title, description, path, content, schema, ... }
 * ثم يمرّرها build.js إلى القالب العام.
 */

import { esc, attr, L, href, asset, absolute, DASH, orDash } from '../lib/html.js';
import { icon } from '../lib/icons.js';
import { sectionHead, button, portrait, chip, shareRow, emptyNote, projectCard } from './components.js';
import { breadcrumbs, socialLinks, tiktokButton, cvButton } from './layout.js';
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
 *  الصفحة الرئيسية  —  ترتيب موجَّه لمسؤول التوظيف
 *  الدليل قبل السيرة: الهيرو ← الإثبات ← المشروع الأبرز ← المشاريع
 * ═══════════════════════════════════════════════════════════════════ */
export function homePage(d) {
  const { site, ui, lang, expertise } = d;
  const p = site.profile;
  const title = L(site.seo.homeTitle, lang) || `${L(p.name, lang)} | ${L(p.professionalTitle, lang)}`;

  return {
    path: '',
    activeNav: 'home',
    title,
    description: L(site.seo.description, lang),
    bodyClass: 'page-home',
    schema: [
      Schema.personSchema(site, lang, { expertise }),
      Schema.websiteSchema(site, lang),
    ],
    content: [
      S.hero(d),
      S.trustStrip(d),
      S.featuredProject(d),
      S.projectsSection(d, { limit: 4 }),
      S.whatIDoSection(d),
      S.expertiseSection(d),
      S.whyMeSection(d),
      S.aboutSection(d),
      S.contentSection(d),
      S.publicationsSection(d),
      S.credentialsSection(d, { muted: false }),
      S.careerSection(d),
      S.contactSection(d),
    ].join('\n'),
  };
}

/* ═════════════════════════════════════════════════════════════════════
 *  المشاريع  /  Projects
 * ═══════════════════════════════════════════════════════════════════ */
export function projectsPage(d) {
  const { site, ui, lang, projects } = d;
  const crumbs = crumb(d, [{ label: L(ui.projects.title, lang), url: href('projects/', lang) }]);
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
      S.featuredProject(d),
      projects.filter((p) => !p.featured).length
        ? S.projectsSection(d, { showHead: false })
        : `<section class="sec"><div class="wrap">${emptyNote(L(ui.projects.empty, lang))}</div></section>`,
      S.contactSection(d),
    ].join('\n'),
  };
}

/* ── صفحة مشروع (دراسة حالة)  /  Project case study ───────────────── */
export function projectPage(d, project) {
  const { site, ui, lang, projects } = d;
  const name = L(project.name, lang);
  const crumbs = crumb(d, [
    { label: L(ui.projects.title, lang), url: href('projects/', lang) },
    { label: name, url: href(`projects/${project.slug}/`, lang) },
  ]);
  const url = absolute(site.url, href(`projects/${project.slug}/`, lang));
  const highlights = L(project.highlights, lang) || [];
  const results = L(project.results, lang) || [];
  const others = projects.filter((p) => p.slug !== project.slug).slice(0, 3);

  return {
    path: `projects/${project.slug}/`,
    activeNav: 'projects',
    title: `${name} — ${L(ui.projects.title, lang)} — ${L(site.profile.name, lang)}`,
    description: L(project.tagline, lang) || L(project.summary, lang),
    schema: [Schema.breadcrumbSchema(site, lang, crumbs)],
    content: `
    ${pageHero({
      eyebrow: (project.categories || []).join(' · '),
      title: name,
      lead: L(project.tagline, lang),
      crumbs,
      ui,
      lang,
      extra: `<p class="phero__sub">${esc(L(project.summary, lang))}</p>
        ${
          project.url
            ? `<div class="phero__cta">${button({ label: L(ui.projects.viewProject, lang), url: project.url, variant: 'solid', external: true, iconName: 'external' })}</div>`
            : ''
        }`,
    })}

    <section class="sec">
      <div class="wrap case">
        ${
          project.image
            ? `<figure class="case__media"><img src="${asset('img/projects/' + project.image)}" alt="" width="1200" height="700" loading="lazy" decoding="async"></figure>`
            : ''
        }

        ${
          (project.metrics || []).length
            ? `<div class="metrics metrics--light reveal">
                ${project.metrics
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

        <div class="case__grid">
          <div class="case__main prose">
            <h2>${esc(L(ui.projects.problem, lang))}</h2>
            <p>${esc(L(project.problem, lang))}</p>

            <h2>${esc(L(ui.projects.solution, lang))}</h2>
            <p>${esc(L(project.solution, lang))}</p>

            ${
              highlights.length
                ? `<h2>${esc(L(ui.projects.highlights, lang))}</h2>
                   <ul class="ticks ticks--accent">${highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>`
                : ''
            }

            ${
              results.length
                ? `<h2>${esc(L(ui.projects.results, lang))}</h2>
                   <ul class="ticks">${results.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>`
                : ''
            }
          </div>

          <aside class="case__side">
            <div class="factbox">
              <dl class="deflist">
                <div><dt>${esc(L(ui.projects.role, lang))}</dt><dd>${esc(L(project.role, lang))}</dd></div>
                ${project.year ? `<div><dt>${esc(L(ui.experience.eyebrow, lang))}</dt><dd>${esc(L(project.year, lang))}</dd></div>` : ''}
              </dl>
              <h3 class="factbox__h">${esc(L(ui.projects.stack, lang))}</h3>
              <div class="chips">${(project.stack || []).map((s) => chip(L(s, lang), { small: true })).join('')}</div>
              ${project.url ? button({ label: L(ui.projects.viewProject, lang), url: project.url, variant: 'outline', external: true, iconName: 'external' }) : ''}
              ${shareRow(ui, lang, { url, title: name })}
            </div>
          </aside>
        </div>
      </div>
    </section>

    ${
      others.length
        ? `<section class="sec sec--muted"><div class="wrap">
            <h2 class="sec__h">${esc(L(ui.projects.all, lang))}</h2>
            <div class="pgrid">${others.map((p) => projectCard(p, ui, lang)).join('')}</div>
          </div></section>`
        : ''
    }`,
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
      S.whatIDoSection(d),
      S.whyMeSection(d),
      S.credentialsSection(d),
      S.contributionsSection(d),
      S.careerSection(d),
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
        extra: `<div class="phero__cta">${cvButton(d.site, ui, lang, { variant: 'outline' })}</div>`,
      }),
      S.experienceSection(d, { showHead: false }),
      S.credentialsSection(d),
      S.contributionsSection(d),
      S.mediaKitTeaser(d),
    ].join('\n'),
  };
}

/* ═════════════════════════════════════════════════════════════════════
 *  المهارات  /  Skills
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
      S.expertiseSection(d, { dark: false }),
      S.whatIDoSection(d),
      S.projectsSection(d, { limit: 3, excludeFeatured: false }),
    ].join('\n'),
  };
}

/* ═════════════════════════════════════════════════════════════════════
 *  المحتوى التقني  /  Content
 * ═══════════════════════════════════════════════════════════════════ */
export function contentPage(d) {
  const { site, ui, lang } = d;
  const crumbs = crumb(d, [{ label: L(ui.content.eyebrow, lang), url: href('content/', lang) }]);
  return {
    path: 'content/',
    activeNav: 'content',
    title: `${L(ui.content.eyebrow, lang)} — ${L(site.profile.name, lang)}`,
    description: L(d.tiktok.bio, lang),
    schema: [Schema.breadcrumbSchema(site, lang, crumbs)],
    content: [
      pageHero({
        eyebrow: L(ui.content.eyebrow, lang),
        title: L(ui.content.title, lang),
        lead: L(d.tiktok.audienceLabel, lang),
        crumbs,
        ui,
        lang,
      }),
      S.contentSection(d),
      S.publicationsSection(d),
      S.contributionsSection(d),
    ].join('\n'),
  };
}

/* ═════════════════════════════════════════════════════════════════════
 *  الملف التعريفي  /  Media kit
 * ═══════════════════════════════════════════════════════════════════ */
export function mediaKitPage(d) {
  const { site, ui, lang, expertise, projects, publications } = d;
  const p = site.profile;
  const crumbs = crumb(d, [{ label: L(ui.nav.mediaKit, lang), url: href('media-kit/', lang) }]);
  const topics = expertise.flatMap((g) => g.items.map((i) => L(i, lang))).slice(0, 16);

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
        ${cvButton(site, ui, lang, { variant: 'outline' })}
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
                  <ul class="ticks">${g.items.slice(0, 6).map((i) => `<li>${esc(L(i, lang))}</li>`).join('')}</ul></div>`
              )
              .join('')}
          </div>
        </section>

        <div class="kit__grid">
          <section class="kit__block">
            <h2 class="kit__h">${esc(L(ui.projects.title, lang))}</h2>
            <ul class="linklist">
              ${projects.map((x) => `<li><a href="${href(`projects/${x.slug}/`, lang)}">${esc(L(x.name, lang))}</a></li>`).join('')}
            </ul>
          </section>
          <section class="kit__block">
            <h2 class="kit__h">${esc(L(publications.title, lang))}</h2>
            <ul class="linklist">
              ${(publications.items || []).map((x) => `<li>${esc(L(x.title, lang))} — ${esc(L(x.venue, lang))}</li>`).join('') || `<li>${DASH}</li>`}
            </ul>
          </section>
        </div>
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
    title: `${L(ui.nav.contact, lang)} — ${L(site.profile.name, lang)}`,
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
        <p class="legal__updated">${esc(d.formatDate(legal.lastUpdated, lang))}</p>
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
          ${button({ label: L(ui.projects.title, lang), url: href('projects/', lang), variant: 'ghost' })}
        </div>
      </div>
    </section>`,
  };
}
