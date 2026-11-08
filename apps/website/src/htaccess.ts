import { SITE } from './config.ts';
import { LANGS } from './content.ts';
import { MOVED, notFoundPath, PATHS } from './paths.ts';

const host = new URL(SITE.url).hostname;
/** The same domain without www, which the site's own address leaves out. */
const bare = host.replace(/^www\./, '');

/** A path of the site as mod_rewrite sees it in .htaccess: without the leading slash, dots escaped. */
const pattern = (path: string) => path.slice(1).replaceAll('.', '\\.');

/** The address without www sends every path on to the same path at the site's address. */
const toOwnAddress =
  bare === host
    ? ''
    : `
  RewriteCond %{HTTP_HOST} ^${bare.replaceAll('.', '\\.')}$ [NC]
  RewriteCond %{REQUEST_URI} !^/\\.well-known/
  RewriteRule ^ ${SITE.url}%{REQUEST_URI} [R=301,L]
`;

/** The old English addresses, with or without the slash at the end. */
const moved = Object.entries(MOVED)
  .map(([from, to]) => `  RewriteRule ^${pattern(from)}?$ ${to} [R=301,L]`)
  .join('\n');

/** The root, by the first language the browser asks for; English for any other. Mirrors `languageOf`. */
const root = [
  ...LANGS.filter((lang) => lang !== 'en').map(
    (lang) => `  RewriteCond %{HTTP:Accept-Language} ^${lang}\\b [NC]
  RewriteRule ^$ ${PATHS.home[lang]} [R=302,L]`,
  ),
  `  RewriteRule ^$ ${PATHS.home.en} [R=302,L]`,
].join('\n');

/** An unknown address under a language gets that language's not-found page; any other the English one. */
const notFound = [
  `ErrorDocument 404 ${notFoundPath('en')}`,
  ...LANGS.filter((lang) => lang !== 'en').map(
    (lang) => `<If "%{REQUEST_URI} =~ m#^${PATHS.home[lang]}#">
  ErrorDocument 404 ${notFoundPath(lang)}
</If>`,
  ),
].join('\n');

/**
 * For Apache, which serves the site at mittwald. First the address without www: every path goes on
 * to the same path at the site's address, for good (301), so old links and app versions that still
 * name it land on the page they meant; only .well-known/ stays, for the certificate of that address.
 * Then the English pages' old addresses, for good, and the root, which has no page and sends each
 * visitor on to their language (302, since it depends on the browser; the Vary header tells caches
 * so). Then the not-found pages, and no caching for the files that name the current version, so the
 * app's updater and the checksums never lag behind. Each module block only applies where its module
 * is there; elsewhere the file is ignored.
 */
export const HTACCESS = `<IfModule mod_rewrite.c>
  RewriteEngine On
${toOwnAddress}
${moved}

${root}
</IfModule>

${notFound}

<IfModule mod_headers.c>
  <If "%{REQUEST_URI} == '/'">
    Header always set Vary "Accept-Language"
  </If>
  <FilesMatch "^(latest.*\\.yml|SHA256SUMS)$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
</IfModule>
`;
