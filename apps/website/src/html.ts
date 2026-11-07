import { posix } from 'node:path';

/** Text for HTML content and attributes. */
export function escape(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/**
 * Text with the inline marks of the content files: `code`, **strong**, [text](url) and line
 * breaks. Everything else is escaped, so a text can never inject markup.
 */
export function inline(text: string): string {
  return escape(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label: string, href: string) => {
      const external = /^https?:/.test(href.replace(/&amp;/g, '&'));
      return `<a href="${href}"${external ? ' rel="noopener"' : ''}>${label}</a>`;
    })
    .replace(/\n/g, '<br>');
}

/** Fills {name} placeholders; the values are inserted as they are, so escape them first if needed. */
export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (whole, key: string) => values[key] ?? whole);
}

/**
 * A not-found page: one per language, at the root of its pages (/404.html, /de/404.html …). The
 * server answers every unknown address under a language with that language's.
 */
export const isNotFound = (path: string) => path.endsWith('/404.html');

/**
 * A link from one page to another path of the site, relative, so the pages work from any folder:
 * a preview on disk, a test server, a sub-path. Page paths end in "/", files do not. The not-found
 * pages are the exception: shown at /de/no/such/page/, a relative link would miss, so their links
 * start at the root.
 */
export function relative(from: string, to: string): string {
  if (to.startsWith('#')) return to;
  if (isNotFound(from)) return to;
  const [path = '', hash] = to.split('#');
  const fromDirectory = from.endsWith('/') ? from : `${posix.dirname(from)}/`;
  let link = posix.relative(fromDirectory, path);
  if (link === '') link = './';
  else if (path.endsWith('/')) link += '/';
  return hash === undefined ? link : `${link}#${hash}`;
}

/** A SHA-256 in four groups of sixteen, with break points between them for narrow screens. */
export function groupedChecksum(sha256: string): string {
  return (sha256.match(/.{1,16}/g) ?? [sha256]).join('<wbr>');
}

/** Megabytes the way people read them: "121 MB", "8.4 MB". */
export function formatSize(bytes: number, locale: string): string {
  const megabytes = bytes / 1_000_000;
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: megabytes < 100 ? 1 : 0 }).format(megabytes)} MB`;
}

export function formatDate(iso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(iso));
}
