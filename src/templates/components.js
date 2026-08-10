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

/** تقييم بالنجوم — يعرض «لم تُقيَّم بعد» بدل اختراع رقم */
export function rating(value, ui, lang) {
  if (value === null || value === undefined) {
    return `<span class="rating rating--none">${esc(L(ui.tools.notRated, lang))}</span>`;
  }
  const v = Math.max(0, Math.min(5, Number(value)));
  const full = Math.floor(v);
  const half = v - full >= 0.5;
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i < full) return `<span class="star is-on">${icon('star', { size: 15 })}</span>`;
    if (i === full && half) return `<span class="star is-half">${icon('star', { size: 15 })}</span>`;
    return `<span class="star">${icon('starOutline', { size: 15 })}</span>`;
  }).join('');
  return `<span class="rating" role="img" aria-label="${attr(v)} / 5">
    <span class="rating__stars" aria-hidden="true">${stars}</span>
    <span class="rating__value">${esc(v.toFixed(1))}</span></span>`;
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

/** بطاقة إحصائية — «—» عندما لا يوجد رقم حقيقي */
export function statCard(stat, lang, computed) {
  const value = stat.auto && computed[stat.auto] ? computed[stat.auto] : stat.value;
  const hasValue = value !== null && value !== undefined && value !== '';
  return `<div class="stat">
    <span class="stat__value"${hasValue ? ` data-count="${attr(value)}"` : ''}>
      ${hasValue ? `<span class="stat__num">${esc(value)}</span>${stat.suffix ? `<span class="stat__suffix">${esc(stat.suffix)}</span>` : ''}` : DASH}
    </span>
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

/** بطاقة مقال */
export function articleCard(article, ui, lang, { featured = false } = {}) {
  const url = href(`articles/${article.slug}/`, lang);
  return `<article class="acard${featured ? ' acard--feature' : ''}">
    <a class="acard__media" href="${url}" tabindex="-1" aria-hidden="true">
      ${
        article.cover
          ? `<img src="${asset(article.cover)}" alt="" loading="lazy" decoding="async" width="800" height="450">`
          : `<span class="acard__pattern" data-seed="${attr(article.slug)}"></span>`
      }
    </a>
    <div class="acard__body">
      <div class="acard__meta">
        <span class="acard__cat">${esc(article.category)}</span>
        <span class="dot" aria-hidden="true"></span>
        <time datetime="${attr(article.date)}">${esc(article.dateLabel)}</time>
        <span class="dot" aria-hidden="true"></span>
        <span>${esc(readingLabel(article.readingTime, lang))}</span>
      </div>
      <h3 class="acard__title"><a href="${url}">${esc(article.title)}</a></h3>
      <p class="acard__desc">${esc(article.description)}</p>
      ${article.placeholder ? placeholderBadge(ui, lang) : ''}
    </div>
  </article>`;
}

/** بطاقة أداة ذكاء اصطناعي */
export function toolCard(tool, ui, lang) {
  const url = href(`ai-tools/${tool.slug}/`, lang);
  const name = L(tool.name, lang);
  const initial = (String(name).replace(/[[\]]/g, '').trim()[0] || '·').toUpperCase();
  return `<article class="tcard" data-category="${attr(tool.category)}"
      data-search="${attr([name, L(tool.summary, lang), L(tool.bestFor, lang), tool.categoryLabel].join(' ').toLowerCase())}">
    <div class="tcard__top">
      <span class="tcard__logo">${
        tool.logo
          ? `<img src="${asset('img/tools/' + tool.logo)}" alt="" loading="lazy" decoding="async" width="44" height="44">`
          : esc(initial)
      }</span>
      <div class="tcard__id">
        <h3 class="tcard__name"><a href="${url}">${esc(name)}</a></h3>
        <span class="tcard__cat">${esc(tool.categoryLabel)}</span>
      </div>
    </div>
    <p class="tcard__desc">${esc(L(tool.summary, lang))}</p>
    <dl class="tcard__facts">
      <div><dt>${esc(L(ui.tools.bestFor, lang))}</dt><dd>${esc(L(tool.bestFor, lang))}</dd></div>
      <div><dt>${esc(L(ui.tools.pricing, lang))}</dt><dd>${esc(L(tool.pricing, lang) || DASH)}</dd></div>
    </dl>
    <div class="tcard__foot">
      ${rating(tool.rating, ui, lang)}
      <a class="tcard__more" href="${url}">${esc(L(ui.common.details, lang))}${icon('chevron', { size: 15 })}</a>
    </div>
    ${tool.placeholder ? placeholderBadge(ui, lang) : ''}
  </article>`;
}

/** بطاقة مشروع */
export function projectCard(project, ui, lang) {
  const url = href(`projects/${project.slug}/`, lang);
  const name = L(project.name, lang);
  return `<article class="pcard">
    <a class="pcard__media" href="${url}" tabindex="-1" aria-hidden="true">
      ${
        project.image
          ? `<img src="${asset('img/projects/' + project.image)}" alt="" loading="lazy" decoding="async" width="800" height="500">`
          : `<span class="pcard__pattern" data-seed="${attr(project.slug)}"></span>`
      }
    </a>
    <div class="pcard__body">
      <div class="pcard__meta"><span>${esc(project.year)}</span><span class="dot" aria-hidden="true"></span><span>${esc(L(project.role, lang))}</span></div>
      <h3 class="pcard__title"><a href="${url}">${esc(name)}</a></h3>
      <p class="pcard__desc">${esc(L(project.summary, lang))}</p>
      <div class="pcard__stack">${(project.stack || []).slice(0, 4).map((s) => chip(L(s, lang), { small: true })).join('')}</div>
      ${project.placeholder ? placeholderBadge(ui, lang) : ''}
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

/** بطاقة الكاتب أسفل المقال */
export function authorCard(site, ui, lang) {
  const p = site.profile;
  return `<aside class="author">
    ${portrait(site, lang, { size: 'sm', className: 'author__photo' })}
    <div class="author__body">
      <p class="author__eyebrow">${esc(L(ui.articles.author, lang))}</p>
      <p class="author__name">${esc(L(p.name, lang))}</p>
      <p class="author__role">${esc(L(p.professionalTitle, lang))}</p>
      <p class="author__bio">${esc(L(p.shortBio, lang))}</p>
      <a class="author__link" href="${href('about/', lang)}">${esc(L(ui.about.title, lang))}${icon('chevron', { size: 14 })}</a>
    </div>
  </aside>`;
}

/** ملاحظة عندما لا يوجد محتوى بعد */
export function emptyNote(text) {
  return `<p class="empty">${esc(text)}</p>`;
}

/** يفحص إن كان النص عنصراً نائباً ليضيف تنسيقاً خافتاً */
export function ph(text) {
  return isPlaceholderText(text) ? ' is-placeholder' : '';
}
