import { SITE } from './config.ts';
import { LANGS } from './content.ts';
import { notFoundPath, PATHS } from './paths.ts';

const host = new URL(SITE.url).hostname;
/** The same domain without www, which the site's own address leaves out. */
const bare = host.replace(/^www\./, '');

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
 * For Apache, which serves the site at mittwald: the address without www sends every path on to the
 * same path at the site's address, for good (301), so old links and app versions that still name it
 * land on the page they meant; only .well-known/ stays, for the certificate of that address. Then
 * the not-found pages, and no caching for the files that name the current version, so the app's
 * updater and the checksums never lag behind. Each module block only applies where its module is
 * there; elsewhere the file is ignored.
 */
export const HTACCESS = `${
  bare === host
    ? ''
    : `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTP_HOST} ^${bare.replaceAll('.', '\\.')}$ [NC]
  RewriteCond %{REQUEST_URI} !^/\\.well-known/
  RewriteRule ^ ${SITE.url}%{REQUEST_URI} [R=301,L]
</IfModule>

`
}${notFound}

<IfModule mod_headers.c>
  <FilesMatch "^(latest.*\\.yml|SHA256SUMS)$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
</IfModule>
`;
