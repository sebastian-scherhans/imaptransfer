import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { SITE } from '../src/config.ts';
import { HTACCESS } from '../src/htaccess.ts';
import { languageOf, languageOfPath, MOVED } from '../src/paths.ts';

describe('.htaccess', () => {
  it('sends the address without www to the same path at www, for good', () => {
    assert.equal(SITE.url, 'https://www.imaptransfer.com');
    assert.match(HTACCESS, /RewriteCond %\{HTTP_HOST\} \^imaptransfer\\\.com\$ \[NC\]\n/);
    assert.match(HTACCESS, /RewriteRule \^ https:\/\/www\.imaptransfer\.com%\{REQUEST_URI\} \[R=301,L\]\n/);
    assert.ok(HTACCESS.indexOf('www.imaptransfer.com%{REQUEST_URI}') < HTACCESS.indexOf('RewriteRule ^$'), 'first to www, then to the language');
  });

  it('leaves .well-known/ alone, so the certificate without www can still be renewed', () => {
    assert.match(HTACCESS, /RewriteCond %\{REQUEST_URI\} !\^\/\\\.well-known\/\n/);
  });

  it('sends the root on to the first language of the browser, English for any other, and tells caches it depends on that', () => {
    for (const lang of ['de', 'fr', 'es', 'it', 'nl', 'pt']) {
      assert.ok(HTACCESS.includes(`  RewriteCond %{HTTP:Accept-Language} ^${lang}\\b [NC]\n  RewriteRule ^$ /${lang}/ [R=302,L]\n`), lang);
    }
    assert.match(HTACCESS, /RewriteRule \^\$ \/de\/ \[R=302,L\][\s\S]*  RewriteRule \^\$ \/en\/ \[R=302,L\]\n<\/IfModule>/, 'English last, without condition');
    assert.ok(HTACCESS.includes(`<If "%{REQUEST_URI} == '/'">\n    Header always set Vary "Accept-Language"\n  </If>`));
  });

  it('sends the old English addresses, which released app versions link, to their new place for good', () => {
    assert.deepEqual(MOVED, { '/privacy/': '/en/privacy/', '/legal-notice/': '/en/legal-notice/' });
    assert.ok(HTACCESS.includes('  RewriteRule ^privacy/?$ /en/privacy/ [R=301,L]\n'));
    assert.ok(HTACCESS.includes('  RewriteRule ^legal-notice/?$ /en/legal-notice/ [R=301,L]\n'));
  });

  it('keeps a not-found page per language and the uncached version files', () => {
    assert.match(HTACCESS, /^ErrorDocument 404 \/en\/404\.html$/m);
    for (const lang of ['de', 'fr', 'es', 'it', 'nl', 'pt']) {
      assert.ok(HTACCESS.includes(`<If "%{REQUEST_URI} =~ m#^/${lang}/#">\n  ErrorDocument 404 /${lang}/404.html\n</If>`), lang);
    }
    assert.match(HTACCESS, /Header set Cache-Control "no-cache"/);
  });
});

describe('languages of the root and of addresses', () => {
  it('pick the first language the browser asks for, if the site speaks it, else English', () => {
    assert.equal(languageOf('de-DE,de;q=0.9,en;q=0.8'), 'de');
    assert.equal(languageOf('pt-BR,pt;q=0.9'), 'pt');
    assert.equal(languageOf('FR'), 'fr');
    assert.equal(languageOf('en-US,de;q=0.5'), 'en');
    assert.equal(languageOf('ja,fr;q=0.8'), 'en', 'only the first, as the server reads it');
    assert.equal(languageOf('dex'), 'en');
    assert.equal(languageOf(''), 'en');
    assert.equal(languageOf(undefined), 'en');
  });

  it('read the language of an address from its first folder, English outside every language', () => {
    assert.equal(languageOfPath('/fr/confidentialite/x'), 'fr');
    assert.equal(languageOfPath('/en/nothing'), 'en');
    assert.equal(languageOfPath('/download'), 'en');
    assert.equal(languageOfPath('/nlx'), 'en');
  });
});
