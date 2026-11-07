import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { SITE } from '../src/config.ts';
import { HTACCESS } from '../src/htaccess.ts';

describe('.htaccess', () => {
  it('sends the address without www to the same path at www, for good', () => {
    assert.equal(SITE.url, 'https://www.imaptransfer.com');
    assert.match(HTACCESS, /RewriteCond %\{HTTP_HOST\} \^imaptransfer\\\.com\$ \[NC\]\n/);
    assert.match(HTACCESS, /RewriteRule \^ https:\/\/www\.imaptransfer\.com%\{REQUEST_URI\} \[R=301,L\]\n/);
  });

  it('leaves .well-known/ alone, so the certificate without www can still be renewed', () => {
    assert.match(HTACCESS, /RewriteCond %\{REQUEST_URI\} !\^\/\\\.well-known\/\n/);
  });

  it('keeps the not-found page and the uncached version files', () => {
    assert.match(HTACCESS, /^ErrorDocument 404 \/404\.html$/m);
    assert.match(HTACCESS, /Header set Cache-Control "no-cache"/);
  });
});
