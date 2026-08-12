/**
 * مكوّنات واجهة قابلة لإعادة الاستخدام  /  Reusable UI components
 */

import { esc, attr, L, href, asset, DASH, isPlaceholderText, readingLabel } from '../lib/html.js';
import { icon } from '../lib/icons.js';

/** ترويسة قسم: كلمة تمهيدية + عنوان + وصف */
export function sectionHead({ eyebrow, title, lead, align = 'start', id, level = 2 }) {
  return `
  <header class="shead shead--${align}"${id ? ` id="${attr(id)}"` : ''}>
    ${eyebrow ? `<p class="eyebrow"><span class="eyebrow__dot" aria-hidden="true"></span>${esc(eyebrow)}</p>` : ''}
    <h${level} class="shead__title">${esc(title)}</h${level}>
    ${lead ? `<p class="shead__lead">${esc(lead)}</p>` : ''}
  </header>`;
}

/** شارة «نموذج — يُستبدل بمحتواك» */
export function placeholderBadge(ui, lang) {
  return `<span class="pbadge" title="${attr(L(ui.common.placeholderBadge, lang))}">
    ${icon('wand', { size: 13 })}<span>${esc(L(ui.common.placeholderBadge, lang))}</span></span>`;
}

/** زر */
export function button({ label, url, variant = 'solid', size = '', iconName, external = false, track, block = false, attrsExtra = '' }) {
  if (!url) return '';
  const cls = ['btn', `btn--${variant}`, size && `btn--${size}`, block && 'btn--block']
    .filter(Boolean)
    .join(' ');
  const rel = external ? ' target="_blank" rel="noopener noreferrer"' : '';
  return `<a class="${cls}" href="${attr(url)}"${rel}${track ? ` data-track="${attr(track)}"` : ''} ${attrsExtra}>
    ${iconName ? icon(iconName, { size: 18 }) : ''}<span>${esc(label)}</span>
  </a>`;
}

/** الصورة الشخصية — تعرض بديلاً أنيقاً إن لم تُرفع صورة بعد */
export function portrait(site, lang, { size = 'lg', className = '' } = {}) {
  const p = site.profile;
  const name = L(p.name, lang);
  const initial = (name.replace(/[[\]]/g, '').trim()[0] || '·').toUpperCase();
  const pending = p.photoIsPlaceholder ? ' portrait--pending' : '';
  return `<figure class="portrait portrait--${size}${pending} ${className}">
    <img src="${asset(p.photo)}" alt="${attr(L(p.photoAlt, lang))} — ${attr(name)}"
      width="640" height="640" loading="eager" decoding="async"
      onerror="this.closest('.portrait').classList.add('portrait--fallback');this.remove();">
    <span class="portrait__fallback" aria-hidden="true">${esc(initial)}</span>
    ${p.photoIsPlaceholder ? '<span class="portrait__hint" aria-hidden="true">[YOUR PHOTO]</span>' : ''}
  </figure>`;
}

/** بطاقة إحصائية — تقبل رقماً (يُعدّ تصاعدياً) أو نصاً، و«—» عند غياب القيمة */
export function statCard(stat, lang, computed) {
  const auto = stat.auto && computed[stat.auto] ? computed[stat.auto] : null;
  const numeric = auto !== null ? auto : stat.value;
  const text = L(stat.text, lang);

  let inner;
  let countAttr = '';
  if (text) {
    inner = `<span class="stat__text" dir="auto">${esc(text)}</span>`;
  } else if (numeric !== null && numeric !== undefined && numeric !== '') {
    countAttr = ` data-count="${attr(numeric)}"`;
    inner = `<span class="stat__num">${esc(numeric)}</span>${
      stat.suffix ? `<span class="stat__suffix">${esc(stat.suffix)}</span>` : ''
    }`;
  } else {
    inner = DASH;
  }

  return `<div class="stat">
    <span class="stat__value"${countAttr}>${inner}</span>
    <span class="stat__label">${esc(L(stat.label, lang))}</span>
  </div>`;
}

/** وسم صغير */
export function chip(label, { url = null, small = false } = {}) {
  const cls = `chip${small ? ' chip--sm' : ''}`;
  return url
    ? `<a class="${cls}" href="${attr(url)}">${esc(label)}</a>`
    : `<span class="${cls}">${esc(label)}</span>`;
}

/** بطاقة مشروع */
export function projectCard(project, ui, lang) {
  const url = href(`projects/${project.slug}/`, lang);
  const name = L(project.name, lang);
  const cats = project.categories || [];

  return `<article class="pcard">
    <a class="pcard__media" href="${url}" tabindex="-1" aria-hidden="true">
      ${
        project.image
          ? `<img src="${asset('img/projects/' + project.image)}" alt="" loading="lazy" decoding="async" width="800" height="500">`
          : `<span class="pcard__pattern" data-seed="${attr(project.slug)}"></span>`
      }
    </a>
    <div class="pcard__body">
      <div class="pcard__meta">
        ${cats.slice(0, 2).map((c) => `<span class="pcard__cat">${esc(c)}</span>`).join('<span class="dot" aria-hidden="true"></span>')}
      </div>
      <h3 class="pcard__title"><a href="${url}">${esc(name)}</a></h3>
      <p class="pcard__desc">${esc(L(project.tagline, lang) || L(project.summary, lang))}</p>
      <div class="pcard__stack">${(project.stack || []).slice(0, 4).map((s) => chip(L(s, lang), { small: true })).join('')}</div>
      <a class="pcard__more" href="${url}">${esc(L(ui.common.caseStudy, lang))}${icon('chevron', { size: 15 })}</a>
    </div>
  </article>`;
}

/** أزرار المشاركة */
export function shareRow(ui, lang, { url, title }) {
  const enc = encodeURIComponent;
  const x = `https://x.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`;
  const li = `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`;
  return `<div class="share">
    <span class="share__label">${esc(L(ui.common.share, lang))}</span>
    <a class="share__btn" href="${attr(x)}" target="_blank" rel="noopener noreferrer" aria-label="X">${icon('x', { size: 16 })}</a>
    <a class="share__btn" href="${attr(li)}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">${icon('linkedin', { size: 16 })}</a>
    <button class="share__btn" type="button" data-copy="${attr(url)}"
      data-copied="${attr(L(ui.common.copied, lang))}" aria-label="${attr(L(ui.common.copyLink, lang))}">${icon('copy', { size: 16 })}</button>
  </div>`;
}

/** ملاحظة عندما لا يوجد محتوى بعد */
export function emptyNote(text) {
  return `<p class="empty">${esc(text)}</p>`;
}

/** يفحص إن كان النص عنصراً نائباً ليضيف تنسيقاً خافتاً */
export function ph(text) {
  return isPlaceholderText(text) ? ' is-placeholder' : '';
}
