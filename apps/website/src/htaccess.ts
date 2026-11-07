import { SITE } from './config.ts';

const host = new URL(SITE.url).hostname;
/** The same domain without www, which the site's own address leaves out. */
const bare = host.replace(/^www\./, '');

/**
 * For Apache, which serves the site at mittwald: the address without www sends every path on to the
 * same path at the site's address, for good (301), so old links and app versions that still name it
 * land on the page they meant; only .well-known/ stays, for the certificate of that address. Then the not-found page, and no caching for the files that name the
 * current version, so the app's updater and the checksums never lag behind. Each block only applies
 * where its module is there; elsewhere the file is ignored.
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
}ErrorDocument 404 /404.html

<IfModule mod_headers.c>
  <FilesMatch "^(latest.*\\.yml|SHA256SUMS)$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
</IfModule>
`;
