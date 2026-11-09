import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { dirname, join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';
import { formatSize, inline, relative } from '../src/html.ts';
import { CONTENT, LANGS, TAG, type Content, type Lang } from '../src/content.ts';
import { homePage, legalPage, notFoundPage, sitemap, type ImageSizes, type RenderContext } from '../src/pages.ts';
import { IMPRINT_LANGS, liabilityPath, notFoundPath, PATHS } from '../src/paths.ts';
import { exampleRelease, releaseOf, SLOTS } from '../src/release.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const FONTS = ['newsreader-500.woff2', 'newsreader-600.woff2', 'newsreader-OFL.txt', 'hanken-grotesk-400.woff2', 'hanken-grotesk-600.woff2', 'hanken-grotesk-OFL.txt'];
const images: ImageSizes = new Map(
  LANGS.flatMap((lang) => ['app', 'app-narrow', 'migrate', 'migrate-narrow'].map((name) => [`${lang}/${name}`, { width: 2000, height: 1000 }] as const)),
);

function pages(context: RenderContext): Map<string, string> {
  const result = new Map<string, string>();
  for (const lang of LANGS) {
    result.set(PATHS.home[lang], homePage(lang, context));
    result.set(PATHS.privacy[lang], legalPage(lang, 'privacy', context));
  }
  for (const lang of IMPRINT_LANGS) result.set(PATHS.imprint[lang], legalPage(lang, 'imprint', context));
  for (const lang of LANGS) result.set(notFoundPath(lang), notFoundPage(lang, context));
  return result;
}

const release = exampleRelease('0.2.0', new Map(), '2026-10-29T00:00:00Z');
/** A release as the build makes it, with three of the eight installers built so far. */
const real = releaseOf(
  '0.2.0',
  ['mac-arm64.dmg', 'windows-x64.exe', 'linux-x64.AppImage', 'mac-arm64.zip'].map((end, index) => ({
    name: `imaptransfer-0.2.0-${end}`,
    size: 120_000_000,
    sha256: String(index).repeat(64),
  })),
  '2026-10-29T08:30:00Z',
);
const withRelease = pages({ release: real, images });
/** The language of a page by its path: every one under its code, English too. */
const langOf = (path: string): Lang => LANGS.find((lang) => path.startsWith(`/${lang}/`)) ?? assert.fail(`${path} is outside every language`);
const withoutRelease = pages({ release: null, images });

describe('pages', () => {
  it('say their language, link the other one and every page carries the legal links', () => {
    for (const [path, html] of withRelease) {
      const lang = langOf(path);
      assert.match(html, new RegExp(`<html lang="${TAG[lang]}">`), path);
      const imprint = relative(path, PATHS.imprint[lang]);
      const privacy = relative(path, PATHS.privacy[lang]);
      assert.ok(html.includes(`href="${imprint}"`), `${path}: no link to the legal notice`);
      assert.ok(html.includes(`href="${privacy}"`), `${path}: no link to the privacy policy`);
      assert.ok(html.includes(`href="${relative(path, liabilityPath(lang))}"`), `${path}: no link to the liability section`);
      if (!path.endsWith('/404.html')) assert.match(html, /hreflang="de" href="https:\/\/www\.imaptransfer\.com\/de\//, path);
    }
  });

  it('link only to pages and files that exist', () => {
    const files = new Set([
      '/assets/site.css',
      '/assets/site.js',
      '/assets/icon.svg',
      ...['gb', 'de', 'fr', 'es', 'it', 'nl', 'pt'].map((flag) => `/assets/flags/${flag}.svg`),
      '/assets/favicon.svg',
      '/favicon.ico',
      '/apple-touch-icon.png',
      ...FONTS.map((font) => `/assets/fonts/${font}`),
      ...real.downloads.map((download) => download.url),
    ]);
    for (const [path, html] of withRelease) {
      const directory = path.endsWith('/') ? path : `${posix.dirname(path)}/`;
      const links = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1] ?? '');
      const sources = [...html.matchAll(/srcset="([^"]+)"/g)].flatMap((match) => (match[1] ?? '').split(',').map((entry) => entry.trim().split(' ')[0] ?? ''));
      for (const link of [...links, ...sources]) {
        if (!link || /^(?:https?:|mailto:|tel:|#)/.test(link)) continue;
        const target = posix.join(link.startsWith('/') ? '/' : directory, link.split('#')[0] ?? '');
        const isPage = withRelease.has(target.endsWith('/') ? target : `${target}/`) || withRelease.has(target);
        const isAsset = /^\/assets\/(?:img\/[a-z]{2}\/[a-z-]+\.png|flags\/[a-z]+\.svg)$/.test(target) && existsSync(join(root, target));
        // The root has no page; the server sends it on to a language.
        const isRoot = target === '/';
        assert.ok(isPage || isRoot || files.has(target) || isAsset, `${path} links to ${link}, which does not exist`);
      }
    }
  });

  it('name the icons browsers and phones look for, and the files exist', () => {
    const home = withRelease.get('/en/') ?? '';
    assert.match(home, /<link rel="icon" href="\.\.\/favicon\.ico" sizes="32x32">/);
    assert.match(home, /<link rel="icon" href="\.\.\/assets\/favicon\.svg" type="image\/svg\+xml">/);
    assert.match(home, /<link rel="apple-touch-icon" href="\.\.\/apple-touch-icon\.png">/);
    for (const file of ['public/favicon.ico', 'public/apple-touch-icon.png', 'assets/favicon.svg']) {
      assert.ok(existsSync(join(root, file)), file);
    }
  });

  it('load nothing from other servers: fonts, styles and scripts are the site’s own', () => {
    for (const [path, html] of withRelease) {
      for (const [, tag] of html.matchAll(/<(?:link|script|img)\b[^>]*>/g)) {
        if (/rel="(?:canonical|alternate)"/.test(tag ?? '') || /property=/.test(tag ?? '')) continue;
        assert.doesNotMatch(tag ?? '', /(?:src|href)="https?:/, `${path}: ${tag}`);
      }
    }
  });

  it('offer every built installer from this site with its checksum, and keep a place for the others', () => {
    const page = withRelease.get('/de/') ?? '';
    for (const download of real.downloads) {
      assert.ok(page.includes(`href="../downloads/${download.name}" download="${download.name}"`), download.name);
      assert.ok(page.includes(`data-summe="${download.sha256}"`), download.name);
    }
    assert.equal(page.match(/class="variante fehlt"/g)?.length, SLOTS.length - real.downloads.length);
    assert.match(page, /Noch nicht verfügbar/);
    assert.doesNotMatch(page, /zip"/);
  });

  it('show every button before the first version, as places only, and nothing to check', () => {
    const page = withoutRelease.get('/en/') ?? '';
    assert.equal(page.match(/class="variante fehlt"/g)?.length, SLOTS.length);
    assert.match(page, /The first version is not out yet/);
    assert.match(withoutRelease.get('/de/') ?? '', /Die erste Version ist noch nicht erschienen/);
    assert.doesNotMatch(page, /id="daten"/);
  });

  it('are one page: the stage downloads for the visitor\'s system or leads to the downloads below, and every header leads there', () => {
    const home = withRelease.get('/de/') ?? '';
    assert.ok(home.includes('<a class="knopf laden" href="#download">Herunterladen</a>'), 'stage');
    assert.match(home, /<section class="abschnitt herunterladen" id="download"/);
    assert.match(home, /<section class="feld-dunkel" id="cli"/);
    assert.match(home, /id="daten"/);
    assert.doesNotMatch(home, /<nav\b/);
    for (const [path, html] of withRelease) {
      const lang = langOf(path);
      assert.ok(html.includes(`<a class="knopf knopf-klein" href="${relative(path, `${PATHS.home[lang]}#download`)}">`), `${path}: no way to the downloads`);
    }
  });

  it('list every language in the header and the footer, with its flag, the current one marked', () => {
    for (const [path, html] of withRelease) {
      const menu = html.match(/<details class="sprache">[\s\S]*?<\/summary>\s*(<ul class="sprachen">[\s\S]*?<\/ul>)/)?.[1] ?? '';
      const footer = html.match(/<ul class="fuss-sprachen"[\s\S]*?<\/ul>/)?.[0] ?? '';
      for (const list of [menu, footer]) {
        assert.equal(list.match(/<li>/g)?.length, LANGS.length, `${path}: not every language`);
        assert.equal(list.match(/aria-current="true"/g)?.length, 1, `${path}: no current language`);
        assert.equal(list.match(/class="flagge"/g)?.length, LANGS.length, `${path}: a flag is missing`);
      }
    }
    const french = withRelease.get('/fr/') ?? '';
    assert.match(french, /<summary aria-label="Langue: Français"><img class="flagge" src="\.\.\/assets\/flags\/fr\.svg"[^>]*>Français<\/summary>/);
    assert.ok(french.includes('<a href="../pt/" hreflang="pt" lang="pt-PT">'), 'Portuguese, of Portugal');
  });

  it('switch to the same page in the other language, or to its start page where there is none', () => {
    assert.ok(withRelease.get('/fr/confidentialite/')?.includes('<a href="../../de/datenschutz/" hreflang="de" lang="de">'));
    assert.ok(withRelease.get('/de/impressum/')?.includes('<a href="../../en/legal-notice/" hreflang="en" lang="en">'));
    assert.ok(withRelease.get('/en/legal-notice/')?.includes('<a href="../../nl/" hreflang="nl" lang="nl">'));
    assert.ok(withRelease.get('/fr/')?.includes('<a href="../en/" hreflang="en" lang="en">'));
  });

  it('name as alternates only the languages a page is written in', () => {
    const alternates = (html: string) => [...html.matchAll(/<link rel="alternate" hreflang="([a-z-]+)"/g)].map((match) => match[1]);
    assert.deepEqual(alternates(withRelease.get('/es/') ?? ''), [...LANGS, 'x-default']);
    assert.deepEqual(alternates(withRelease.get('/it/privacy/') ?? ''), [...LANGS, 'x-default']);
    assert.deepEqual(alternates(withRelease.get('/en/legal-notice/') ?? ''), ['en', 'de', 'x-default']);
    // Whose language is not known: the start page through the root, which picks theirs; the others in English.
    assert.ok(withRelease.get('/es/')?.includes('<link rel="alternate" hreflang="x-default" href="https://www.imaptransfer.com/">'));
    assert.ok(withRelease.get('/es/privacidad/')?.includes('<link rel="alternate" hreflang="x-default" href="https://www.imaptransfer.com/en/privacy/">'));
    const map = sitemap();
    assert.equal(map.match(/<loc>/g)?.length, 2 * LANGS.length + IMPRINT_LANGS.length);
    assert.ok(map.includes('<loc>https://www.imaptransfer.com/pt/privacidade/</loc>'));
    assert.doesNotMatch(map, /<loc>[^<]*\/fr\/[^<]*impressum|legal-notice\/<\/loc>[\s\S]*<loc>https:\/\/www\.imaptransfer\.com\/en\/legal-notice\//);
    assert.doesNotMatch(map, /<loc>https:\/\/www\.imaptransfer\.com\/<\/loc>/, 'the root is no page');
    assert.ok(map.includes('<xhtml:link rel="alternate" hreflang="x-default" href="https://www.imaptransfer.com/"/>'));
  });

  it('lead the new languages to the English legal notice and to a privacy policy in their own words, the German one binding', () => {
    for (const lang of LANGS.filter((lang) => !IMPRINT_LANGS.includes(lang as never))) {
      const home = withRelease.get(PATHS.home[lang]) ?? '';
      assert.ok(home.includes(`<a href="../en/legal-notice/">${CONTENT[lang].footer.imprint}</a>`), `${lang}: legal notice`);
      assert.ok(home.includes(`<a href="${PATHS.privacy[lang].slice(4)}">${CONTENT[lang].footer.privacy}</a>`), `${lang}: privacy`);
      assert.ok(home.includes('href="../en/legal-notice/#liability"'), `${lang}: liability`);
      const privacy = withRelease.get(PATHS.privacy[lang]) ?? '';
      assert.match(privacy, /<\/h1>\s*<p>[^<]*<a href="\.\.\/\.\.\/de\/datenschutz\/">/, `${lang}: the binding German version first`);
    }
  });

  it('keep placeholders and commands in every translation', () => {
    const strings = (value: unknown, at = ''): [string, string][] =>
      typeof value === 'string' ? [[at, value]] : value && typeof value === 'object' ? Object.entries(value).flatMap(([key, inner]) => strings(inner, `${at}.${key}`)) : [];
    const english = new Map(strings(CONTENT.en));
    const marks = (text: string) => [...text.matchAll(/\{[a-z]+\}|`[^`]+`/g)].map((match) => match[0]).filter((mark) => !mark.startsWith('`') || /^`[0-9.]+`$|^`\.eml`$|^`imaptransfer`$/.test(mark));
    for (const lang of LANGS) {
      const own = new Map(strings(CONTENT[lang] as Content));
      assert.deepEqual([...own.keys()], [...english.keys()], `${lang}: other fields than English`);
      for (const [at, text] of english) {
        if (at.startsWith('.lang') || at.startsWith('.locale') || at === '.cli.code' || at === '.backup.tree') continue;
        assert.deepEqual(marks(own.get(at) ?? '').sort(), marks(text).sort(), `${lang}${at}`);
      }
      // The commands are the English ones; only the example person is the one of the language's backup.
      const person = (content: Content) => content.backup.tree.split('\n')[0]?.replace(/@.*/, '') ?? '';
      const commands = (content: Content) =>
        content.cli.code.split('\n').filter((line) => line && !line.startsWith('#')).map((line) => line.replaceAll(person(content), person(CONTENT.en)));
      assert.deepEqual(commands(CONTENT[lang] as Content), commands(CONTENT.en), `${lang}: commands`);
    }
  });

  it('answer an unknown path in its own language, with links from the root, and keep it out of search engines', () => {
    for (const lang of LANGS) {
      const page = withRelease.get(notFoundPath(lang)) ?? '';
      assert.match(page, new RegExp(`<html lang="${TAG[lang]}">`), lang);
      assert.ok(page.includes(`<h1 id="titel">${CONTENT[lang].notFound.title}</h1>`), lang);
      // The English one also answers addresses outside every language: its way home is the root, which picks the visitor's.
      const home = lang === 'en' ? '/' : PATHS.home[lang];
      assert.ok(page.includes(`<a href="${home}">${CONTENT[lang].notFound.link}</a>`), lang);
      assert.ok(page.includes(`<a class="marke" href="${home}">`), lang);
      assert.ok(page.includes('<link rel="stylesheet" href="/assets/site.css">'), `${lang}: links from the root`);
      assert.match(page, /<meta name="robots" content="noindex">/, lang);
    }
    assert.equal(notFoundPath('en'), '/en/404.html');
    assert.equal(notFoundPath('pt'), '/pt/404.html');
  });

  it('point from the downloads to the liability section of the legal notice, before and after the first version', () => {
    for (const result of [withRelease, withoutRelease]) {
      assert.ok(result.get('/de/')?.includes('<a href="impressum/#haftung">Mehr zur Haftung</a>'));
      assert.ok(result.get('/en/')?.includes('<a href="legal-notice/#liability">About liability</a>'));
    }
    assert.match(withRelease.get('/de/impressum/') ?? '', /<h2 id="haftung">Haftung für die App<\/h2><p>[^<]*§ 521 BGB/);
    assert.match(withRelease.get('/en/legal-notice/') ?? '', /<h2 id="liability">Liability for the app<\/h2><p>[^<]*Section 521 BGB/);
    assert.ok(withRelease.get('/de/datenschutz/')?.includes('<a href="../impressum/#haftung">Haftung für die App</a>'));
    assert.ok(withRelease.get('/en/privacy/')?.includes('<a href="../legal-notice/#liability">Liability for the app</a>'));
  });

  it('keep the preview out of search engines and mark it', () => {
    const preview = pages({ release, images }).get('/de/') ?? '';
    assert.match(preview, /<meta name="robots" content="noindex">/);
    assert.match(preview, /Vorschau mit Beispieldaten/);
    assert.doesNotMatch(withRelease.get('/de/') ?? '', /noindex/);
  });

});

describe('html helpers', () => {
  it('escape text and allow only the inline marks', () => {
    assert.equal(inline('<b>`x` **y** [z](https://a.example/?q=1&r=2)'), '&lt;b&gt;<code>x</code> <strong>y</strong> <a href="https://a.example/?q=1&amp;r=2" rel="noopener">z</a>');
    assert.equal(inline('a\nb'), 'a<br>b');
  });

  it('link relatively between the pages and the assets', () => {
    assert.equal(relative('/', '/de/'), 'de/');
    assert.equal(relative('/de/', '/'), '../');
    assert.equal(relative('/de/impressum/', '/assets/site.css'), '../../assets/site.css');
    assert.equal(relative('/', '/#download'), './#download');
    assert.equal(relative('/404.html', '/de/'), '/de/');
    assert.equal(relative('/404.html', '/assets/site.css'), '/assets/site.css');
    assert.equal(relative('/fr/404.html', '/fr/'), '/fr/');
    assert.equal(relative('/de/', '#download'), '#download');
  });

  it('write sizes the way people read them', () => {
    assert.equal(formatSize(121_456_789, 'en-GB'), '121 MB');
    assert.equal(formatSize(8_400_000, 'de-DE'), '8,4 MB');
  });
});
