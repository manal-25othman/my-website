/**
 * بيانات Schema.org المنظمة  /  Structured data builders
 * ⚠️ لا يُدرَج أي حقل لا تتوفر له قيمة حقيقية — لا نرسل إشارات غير دقيقة.
 */

import { L, href, asset, absolute, isPlaceholderText } from './html.js';

/** يحذف الحقول الفارغة أو التي ما زالت عناصر نائبة */
function clean(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined || v === '') continue;
    if (Array.isArray(v)) {
      const arr = v.filter((x) => x !== null && x !== undefined && x !== '' && !isPlaceholderText(x));
      if (arr.length) out[k] = arr;
      continue;
    }
    if (typeof v === 'string' && isPlaceholderText(v)) continue;
    out[k] = v;
  }
  return out;
}

/** روابط الحسابات الرسمية — الأساس الذي يربط الموقع بالحسابات */
export function sameAs(site) {
  return site.profile.social.filter((s) => s.url && s.id !== 'email').map((s) => s.url);
}

export function personSchema(site, lang, { expertise = [] } = {}) {
  const p = site.profile;
  const id = absolute(site.url, href('', lang)) + '#person';
  return clean({
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': id,
    name: L(p.name, lang),
    alternateName: lang === 'ar' ? L(p.name, 'en') : L(p.name, 'ar'),
    jobTitle: L(p.professionalTitle, lang),
    description: L(p.shortBio, lang),
    url: absolute(site.url, href('', lang)),
    image: absolute(site.url, asset(p.photo)),
    email: p.email && !isPlaceholderText(p.email) ? `mailto:${p.email}` : null,
    knowsAbout: expertise.flatMap((g) => g.items.map((i) => L(i, lang))),
    sameAs: sameAs(site),
    mainEntityOfPage: absolute(site.url, href('', lang)),
  });
}

export function websiteSchema(site, lang) {
  const p = site.profile;
  return clean({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absolute(site.url, href('', lang)) + '#website',
    name: L(p.name, lang),
    alternateName: L(p.professionalTitle, lang),
    url: absolute(site.url, href('', lang)),
    inLanguage: lang,
    description: L(site.seo.description, lang),
    publisher: { '@id': absolute(site.url, href('', lang)) + '#person' },
  });
}

export function profilePageSchema(site, lang) {
  return clean({
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: absolute(site.url, href('about/', lang)),
    inLanguage: lang,
    mainEntity: { '@id': absolute(site.url, href('', lang)) + '#person' },
  });
}

export function articleSchema(site, lang, article) {
  const p = site.profile;
  const url = absolute(site.url, href(`articles/${article.slug}/`, lang));
  return clean({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    inLanguage: lang,
    datePublished: article.date,
    dateModified: article.updated || article.date,
    articleSection: article.category,
    keywords: article.tags,
    wordCount: article.words,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: article.cover
      ? absolute(site.url, asset(article.cover))
      : absolute(site.url, asset(p.ogImage)),
    author: { '@id': absolute(site.url, href('', lang)) + '#person' },
    publisher: { '@id': absolute(site.url, href('', lang)) + '#person' },
  });
}

/** ⚠️ لا يُنتَج إلا للكتاب المنشور فعلاً */
export function bookSchema(site, lang, book) {
  if (!book || !book.enabled || !book.published) return null;
  const title = L(book.title, lang);
  if (isPlaceholderText(title)) return null;
  const pub = book.publication || {};
  const buy = (book.links || []).find((l) => l.url && l.primary);
  return clean({
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: title,
    alternativeHeadline: L(book.subtitle, lang),
    description: (L(book.description, lang) || [])[0] || null,
    inLanguage: L(pub.language, lang),
    author: { '@id': absolute(site.url, href('', lang)) + '#person' },
    publisher: pub.publisher ? { '@type': 'Organization', name: L(pub.publisher, lang) } : null,
    datePublished: pub.year ? String(pub.year) : null,
    numberOfPages: pub.pages || null,
    isbn: pub.isbn || null,
    image: absolute(site.url, asset(book.cover)),
    url: absolute(site.url, href('book/', lang)),
    offers: buy ? { '@type': 'Offer', url: buy.url } : null,
  });
}

export function breadcrumbSchema(site, lang, items) {
  if (!items || items.length < 2) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.label,
      item: absolute(site.url, it.url),
    })),
  };
}

export function collectionSchema(site, lang, { name, description, url, items }) {
  return clean({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: absolute(site.url, url),
    inLanguage: lang,
    isPartOf: { '@id': absolute(site.url, href('', lang)) + '#website' },
    mainEntity: items?.length
      ? {
          '@type': 'ItemList',
          itemListElement: items.map((it, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: it.name,
            url: absolute(site.url, it.url),
          })),
        }
      : null,
  });
}

/** صفحة أداة — SoftwareApplication، وبدون تقييم ما لم يوجد تقييم حقيقي */
export function toolSchema(site, lang, tool) {
  const name = L(tool.name, lang);
  if (isPlaceholderText(name)) return null;
  return clean({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    applicationCategory: tool.categoryLabel,
    description: L(tool.summary, lang),
    url: tool.url || null,
    review: isPlaceholderText(L(tool.review, lang))
      ? null
      : {
          '@type': 'Review',
          author: { '@id': absolute(site.url, href('', lang)) + '#person' },
          reviewBody: L(tool.review, lang),
          reviewRating:
            tool.rating != null
              ? { '@type': 'Rating', ratingValue: tool.rating, bestRating: 5, worstRating: 1 }
              : null,
        },
  });
}

export function contactSchema(site, lang) {
  return clean({
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    url: absolute(site.url, href('contact/', lang)),
    inLanguage: lang,
    mainEntity: { '@id': absolute(site.url, href('', lang)) + '#person' },
  });
}
