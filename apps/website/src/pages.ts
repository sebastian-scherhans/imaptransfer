import { githubUrl, SITE } from './config.ts';
import { CONTENT, LANGS, NAMES, TAG, type Content, type Lang } from './content.ts';
import { escape, fill, formatDate, formatSize, groupedChecksum, inline, relative } from './html.ts';
import { LEGAL, type LegalKind } from './legal.ts';
import { defaultPath, langsOf, liabilityPath, notFoundPath, PATHS, type PageKind } from './paths.ts';
import { SLOTS, type Download, type Platform, type Release, type Slot } from './release.ts';

/** Pixel size of each screenshot, by "lang/name"; the build reads it from the files. */
export type ImageSizes = Map<string, { width: number; height: number }>;

export interface RenderContext {
  release: Release | null;
  images: ImageSizes;
}

const SHIELD = 'M12 3 4.5 6v5.5c0 4.6 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.9 7.5-9.5V6zM9 12l2 2 4-4';
const ARROW_DOWN = 'M12 4v11m-4.5-4.5L12 15l4.5-4.5M5 19.5h14';
/** The flag beside the name of a language. The word says it; the flag helps find it. */
const FLAG: Record<Lang, string> = { en: 'gb', de: 'de', fr: 'fr', es: 'es', it: 'it', nl: 'nl', pt: 'pt' };

function icon(path: string): string {
  return `<svg class="symbol" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${path}"/></svg>`;
}

/**
 * A screenshot of the app in its language. The files are taken at twice the size they are shown,
 * so they stay sharp on every screen; a phone gets its own cut of the window, large enough to read.
 */
function screenshot(context: RenderContext, lang: Lang, from: string, name: string, alt: string, narrow?: string): string {
  const file = (image: string) => {
    const size = context.images.get(`${lang}/${image}`);
    if (!size) throw new Error(`Screenshot assets/img/${lang}/${image}.png is missing`);
    return { src: relative(from, `/assets/img/${lang}/${image}.png`), width: Math.round(size.width / 2), height: Math.round(size.height / 2) };
  };
  const main = file(name);
  const img = `<img src="${main.src}" width="${main.width}" height="${main.height}" alt="${escape(alt)}" decoding="async">`;
  if (!narrow) return img;
  const cut = file(narrow);
  return `<picture><source media="(max-width: 640px)" srcset="${cut.src}" width="${cut.width}" height="${cut.height}">${img}</picture>`;
}

function head(c: Content, kind: PageKind | 'notFound', path: string, title: string, description: string, context: RenderContext): string {
  const alternates =
    kind === 'notFound'
      ? ''
      : [
          ...langsOf(kind).map((lang) => `<link rel="alternate" hreflang="${lang}" href="${SITE.url}${PATHS[kind][lang]}">`),
          `<link rel="alternate" hreflang="x-default" href="${SITE.url}${defaultPath(kind)}">`,
        ].join('\n  ');
  const image = `${SITE.url}/assets/img/${c.lang}/app.png`;
  return `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(title)}</title>
  <meta name="description" content="${escape(description)}">
  ${context.release?.example || kind === 'notFound' ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${SITE.url}${path}">`}
  ${alternates}
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escape(title)}">
  <meta property="og:description" content="${escape(description)}">
  <meta property="og:url" content="${SITE.url}${path}">
  <meta property="og:image" content="${image}">
  <meta property="og:locale" content="${c.locale.replace('-', '_')}">
  <meta name="theme-color" content="#f7f6f3">
  <link rel="icon" href="${relative(path, '/favicon.ico')}" sizes="32x32">
  <link rel="icon" href="${relative(path, '/assets/favicon.svg')}" type="image/svg+xml">
  <link rel="apple-touch-icon" href="${relative(path, '/apple-touch-icon.png')}">
  <link rel="preload" href="${relative(path, '/assets/fonts/newsreader-500.woff2')}" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="${relative(path, '/assets/fonts/hanken-grotesk-400.woff2')}" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${relative(path, '/assets/site.css')}">
  ${kind === 'home' ? `<script src="${relative(path, '/assets/site.js')}" defer></script>` : ''}
</head>`;
}

/** The same page in another language, or that language's start page where the page has none in it. */
function inLanguage(kind: PageKind | 'notFound', lang: Lang): string {
  return kind !== 'notFound' && langsOf(kind).includes(lang) ? PATHS[kind][lang] : PATHS.home[lang];
}

/**
 * The way to the start page. The English not-found page also answers addresses outside every
 * language, so it leads to the root, which picks the visitor's language.
 */
function startPage(kind: PageKind | 'notFound', lang: Lang): string {
  return kind === 'notFound' && lang === 'en' ? '/' : PATHS.home[lang];
}

function flag(path: string, lang: Lang): string {
  return `<img class="flagge" src="${relative(path, `/assets/flags/${FLAG[lang]}.svg`)}" alt="" width="21" height="14">`;
}

/** Every language by its own name; the current one is marked, not linked. */
function languageItems(c: Content, kind: PageKind | 'notFound', path: string): string {
  return LANGS.map((lang) =>
    lang === c.lang
      ? `<li><span aria-current="true">${flag(path, lang)}${NAMES[lang]}</span></li>`
      : `<li><a href="${relative(path, inLanguage(kind, lang))}" hreflang="${lang}" lang="${TAG[lang]}">${flag(path, lang)}${NAMES[lang]}</a></li>`,
  ).join('');
}

/** In the header: the current language, opening the list of all of them. Works without script. */
function languageMenu(c: Content, kind: PageKind | 'notFound', path: string): string {
  return `<details class="sprache">
      <summary aria-label="${escape(c.nav.language)}: ${NAMES[c.lang]}">${flag(path, c.lang)}${NAMES[c.lang]}</summary>
      <ul class="sprachen">${languageItems(c, kind, path)}</ul>
    </details>`;
}

function header(c: Content, kind: PageKind | 'notFound', path: string): string {
  return `<header class="kopf">
  <a class="marke" href="${relative(path, startPage(kind, c.lang))}"><img src="${relative(path, '/assets/icon.svg')}" alt="" width="36" height="36"><span>IMAP Transfer</span></a>
  <div class="kopf-rechts">
    ${languageMenu(c, kind, path)}
    <a class="knopf knopf-klein" href="${relative(path, `${PATHS.home[c.lang]}#download`)}">${escape(c.nav.download)}</a>
  </div>
</header>`;
}

function footer(c: Content, kind: PageKind | 'notFound', path: string): string {
  const links = [
    `<a href="${githubUrl()}" rel="noopener">${c.footer.source}</a>`,
    `<a href="${githubUrl('/blob/main/LICENSE')}" rel="noopener">${c.footer.license}</a>`,
    `<a href="${relative(path, PATHS.imprint[c.lang])}">${c.footer.imprint}</a>`,
    `<a href="${relative(path, PATHS.privacy[c.lang])}">${c.footer.privacy}</a>`,
    `<a href="${relative(path, liabilityPath(c.lang))}">${c.footer.liability}</a>`,
  ];
  const closing =
    kind === 'home'
      ? `<h2 class="schluss">${escape(c.footer.title)}</h2>
  <p class="vorspann schluss-text">${escape(c.footer.text)}</p>`
      : '';
  return `<footer class="fuss${closing ? ' fuss-schluss' : ''}">
  <div class="fuss-innen">
  ${closing}
  <ul class="fuss-links">${links.map((link) => `<li>${link}</li>`).join('')}</ul>
  <ul class="fuss-sprachen" aria-label="${escape(c.nav.language)}">${languageItems(c, kind, path)}</ul>
  </div>
</footer>`;
}

function frame(c: Content, kind: PageKind | 'notFound', path: string, title: string, description: string, main: string, context: RenderContext): string {
  const banner = context.release?.example ? `<p class="vorschau" role="note">${escape(c.preview)}</p>` : '';
  return `<!doctype html>
<html lang="${TAG[c.lang]}">
${head(c, kind, path, title, description, context)}
<body>
<a class="springen" href="#inhalt">${c.nav.skip}</a>
${banner}
${header(c, kind, path)}
<main id="inhalt">
${main}
</main>
${footer(c, kind, path)}
</body>
</html>
`;
}

// ── The landing page ──────────────────────────────────────────────────────────────────────────

function hero(c: Content, path: string, context: RenderContext): string {
  const release = context.release;
  const note = release
    ? `${escape(fill(c.hero.version, { version: release.version }))} <a href="#download">${escape(c.hero.all)}</a>`
    : escape(c.hero.soon);
  return `<section class="buehne" aria-labelledby="titel">
  <h1 id="titel" class="anzeige">${escape(c.hero.title[0])}<br>${escape(c.hero.title[1])}</h1>
  <div class="buehne-zeile">
    <p class="vorspann">${inline(c.hero.lead)}</p>
    <div class="buehne-aktion">
      <a class="knopf laden" href="#download">${escape(c.hero.button)}</a>
      <p class="klein leise">${note}</p>
    </div>
  </div>
  <figure class="fenster">
    ${screenshot(context, c.lang, path, 'app', c.hero.image, 'app-narrow')}
  </figure>
</section>`;
}

function backup(c: Content): string {
  return `<section class="abschnitt sicherung" id="backup" aria-labelledby="backup-titel">
  <div class="sicherung-text">
    <h2 id="backup-titel">${escape(c.backup.title)}</h2>
    <p>${inline(c.backup.text)}</p>
    <ul class="fakten">${c.backup.facts.map((fact) => `<li>${inline(fact)}</li>`).join('')}</ul>
  </div>
  <figure class="baum">
    <pre tabindex="0"><code>${escape(c.backup.tree)}</code></pre>
    <figcaption class="klein leise">${inline(c.backup.caption)}</figcaption>
  </figure>
</section>`;
}

function migrate(c: Content, path: string, context: RenderContext): string {
  return `<section class="abschnitt umzug" id="migrate" aria-labelledby="umzug-titel">
  <figure class="ausschnitt umzug-bild">
    ${screenshot(context, c.lang, path, 'migrate', c.migrate.image)}
  </figure>
  <div class="umzug-text">
    <h2 id="umzug-titel">${escape(c.migrate.title)}</h2>
    <p>${inline(c.migrate.text)}</p>
    <p class="bleibt">${icon(SHIELD)}<span>${escape(c.migrate.kept)}</span></p>
    <p>${inline(c.migrate.sync)}</p>
  </div>
</section>`;
}

/** What people ask before they trust a tool with their mail, each answered in two sentences. */
function questions(c: Content): string {
  const answer = (key: 'stop' | 'clean' | 'providers' | 'gmail') => `<div class="antwort">
      <h3>${escape(c.questions[key].title)}</h3>
      <p>${inline(c.questions[key].text)}</p>
    </div>`;
  return `<section class="abschnitt fragen" aria-labelledby="fragen-titel">
  <h2 id="fragen-titel">${escape(c.questions.title)}</h2>
  <div class="antworten">
    ${answer('stop')}
    ${answer('clean')}
    ${answer('providers')}
    ${answer('gmail')}
  </div>
</section>`;
}

function commandLine(c: Content): string {
  const code = c.cli.code
    .split('\n')
    .map((line) => (line.startsWith('#') ? `<span class="kommentar">${escape(line)}</span>` : escape(line)))
    .join('\n');
  return `<section class="feld-dunkel" id="cli" aria-labelledby="cli-titel">
  <div class="abschnitt kommandozeile">
    <div class="kommandozeile-text">
      <h2 id="cli-titel">${escape(c.cli.title)}</h2>
      <p>${inline(c.cli.text)}</p>
      <p class="klein">${inline(c.cli.exit)}</p>
    </div>
    <pre class="code" tabindex="0"><code>${code}</code></pre>
  </div>
</section>`;
}

const TERMINAL: Record<Platform, (name: string) => string> = {
  mac: (name) => `shasum -a 256 ~/Downloads/${name}`,
  windows: (name) => `Get-FileHash $HOME\\Downloads\\${name}`,
  linux: (name) => `sha256sum ~/Downloads/${name}`,
};

const PLATFORMS: Platform[] = ['mac', 'windows', 'linux'];

/** One installer on one line: its button, size, checksum and copy button; or a placeholder while its file is missing. */
function variant(c: Content, path: string, slot: Slot, download: Download | undefined): string {
  const label = `${icon(ARROW_DOWN)}<span>${escape(c.download.variants[slot.key] ?? slot.key)}</span>`;
  const data = `data-platform="${slot.platform}" data-arch="${slot.arch}" data-kind="${slot.kind}"`;
  if (!download) {
    return `<li class="variante fehlt" ${data}>
        <span class="knopf knopf-aus" aria-disabled="true">${label}</span>
        <span class="klein leise fehlt-text">${escape(c.download.missing)}</span>
      </li>`;
  }
  return `<li class="variante" ${data}>
        <a class="knopf knopf-zweit" href="${escape(relative(path, download.url))}" download="${escape(download.name)}">${label}</a>
        <span class="klein leise groesse">${formatSize(download.size, c.locale)}</span>
        <p class="pruefsumme"><span class="unsichtbar">SHA-256 </span><code>${groupedChecksum(download.sha256)}</code></p>
        <button type="button" class="kopieren" data-summe="${download.sha256}" hidden>${escape(c.download.copy)}</button>
      </li>`;
}

function downloads(c: Content, path: string, release: Release | null): string {
  const available = release?.downloads ?? [];
  const systems = PLATFORMS.map((platform) => {
    const system = c.download.systems[platform];
    const variants = SLOTS.filter((slot) => slot.platform === platform)
      .map((slot) => variant(c, path, slot, available.find((download) => download.key === slot.key)))
      .join('\n      ');
    return `<div class="system" data-platform="${platform}">
    <div class="system-kopf">
      <h3>${escape(system.name)}<span class="deins" hidden>${escape(c.download.yours)}</span></h3>
      <p>${escape(system.hint)}</p>
    </div>
    <ul class="varianten">
      ${variants}
    </ul>
  </div>`;
  }).join('\n  ');
  const intro = release
    ? escape(fill(c.download.released, { version: release.version, date: formatDate(release.publishedAt, c.locale) }))
    : escape(c.download.none);
  return `<section class="abschnitt herunterladen" id="download" aria-labelledby="download-titel">
  <div class="herunterladen-kopf">
    <h2 id="download-titel">${escape(c.download.title)}</h2>
    <div class="herunterladen-vorspann">
      <p>${intro}</p>
      <p class="klein leise">${escape(c.download.liability)} <a href="${relative(path, liabilityPath(c.lang))}">${escape(c.download.liabilityLink)}</a></p>
    </div>
  </div>
  <div class="systeme">
  ${systems}
  </div>
  ${release && available.length > 0 ? checker(c, path, release) : ''}
</section>`;
}

/** Checking a downloaded file: in the browser, or with the terminal commands. */
function checker(c: Content, path: string, release: Release): string {
  const first = (platform: Platform) => release.downloads.find((download) => download.platform === platform);
  const commands = PLATFORMS.map((platform) => {
    const download = first(platform);
    return download ? `<li><span class="klein leise">${escape(c.download.commands[platform])}</span><code>${escape(TERMINAL[platform](download.name))}</code></li>` : '';
  }).join('');
  return `<div class="pruefen">
    <div class="pruefen-text">
      <h3>${escape(c.download.checkTitle)}</h3>
      <p>${escape(c.download.checkText)}</p>
    </div>
    <div class="ablage" hidden>
      <label class="knopf knopf-zweit" for="datei">${escape(c.download.choose)}</label>
      <input class="unsichtbar" type="file" id="datei">
      <span class="leise">${escape(c.download.drop)}</span>
      <p class="ergebnis" role="status" aria-live="polite"></p>
    </div>
    <div class="terminal">
      <p class="klein leise">${escape(c.download.terminal)}</p>
      <ul>${commands}</ul>
    </div>
  </div>`;
}

/** What the page's script needs: the files of the version, for the visitor's system and for checking one. */
function downloadData(c: Content, path: string, release: Release | null): string {
  if (!release || release.downloads.length === 0) return '';
  const data = {
    version: release.version,
    downloads: release.downloads.map(({ platform, arch, kind, name, url, sha256 }) => ({ platform, arch, kind, name, url: relative(path, url), sha256 })),
    texts: {
      buttonFor: c.hero.buttonFor,
      copy: c.download.copy,
      copied: c.download.copied,
      checking: c.download.checking,
      match: c.download.match,
      mismatch: c.download.mismatch,
      unreadable: c.download.unreadable,
    },
  };
  return `<script type="application/json" id="daten">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

export function homePage(lang: Lang, context: RenderContext): string {
  const c = CONTENT[lang];
  const path = PATHS.home[lang];
  const main = [
    hero(c, path, context),
    backup(c),
    migrate(c, path, context),
    questions(c),
    commandLine(c),
    downloads(c, path, context.release),
    downloadData(c, path, context.release),
  ].join('\n');
  return frame(c, 'home', path, c.meta.title, c.meta.description, main, context);
}

/** Links of a text to a path of this site ("/assets/…"), made relative to the page. */
function ownLinks(html: string, path: string): string {
  return html.replace(/href="(\/[^"]*)"/g, (_, to: string) => `href="${relative(path, to)}"`);
}

export function legalPage(lang: Lang, kind: LegalKind, context: RenderContext): string {
  const c = CONTENT[lang];
  const doc = LEGAL[lang][kind];
  if (!doc) throw new Error(`No ${kind} in ${lang}`);
  const path = PATHS[kind][lang];
  const sections = doc.sections
    .map((section) => `${section.heading ? `<h2${section.id ? ` id="${section.id}"` : ''}>${escape(section.heading)}</h2>` : ''}${section.paragraphs.map((text) => `<p>${ownLinks(inline(text), path)}</p>`).join('')}`)
    .join('\n  ');
  const main = `<article class="rechtliches" aria-labelledby="titel">
  <h1 id="titel">${escape(doc.title)}</h1>
  ${sections}
  <p class="klein leise stand">${escape(doc.updated)}</p>
</article>`;
  return frame(c, kind, path, `${doc.title}: IMAP Transfer`, doc.description, main, context);
}

/** The page the server answers unknown addresses under a language with, in that language. */
export function notFoundPage(lang: Lang, context: RenderContext): string {
  const c = CONTENT[lang];
  const path = notFoundPath(lang);
  const main = `<article class="rechtliches nicht-gefunden" aria-labelledby="titel">
  <h1 id="titel">${escape(c.notFound.title)}</h1>
  <p><a href="${relative(path, startPage('notFound', lang))}">${escape(c.notFound.link)}</a></p>
</article>`;
  return frame(c, 'notFound', path, `${c.notFound.title}: IMAP Transfer`, c.notFound.title, main, context);
}

export function sitemap(): string {
  const urls = (Object.keys(PATHS) as PageKind[])
    .flatMap((kind) =>
      langsOf(kind).map(
        (lang) => `  <url>
    <loc>${SITE.url}${PATHS[kind][lang]}</loc>
${langsOf(kind).map((alternate) => `    <xhtml:link rel="alternate" hreflang="${alternate}" href="${SITE.url}${PATHS[kind][alternate]}"/>`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE.url}${defaultPath(kind)}"/>
  </url>`,
      ),
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
}
