/**
 * basePath.ts
 * Utility helpers for consistent asset and link resolution across:
 * - Local development: http://localhost:3000
 * - GitHub Pages: https://<user>.github.io/Smartlearn/
 *
 * Use withBasePath for internal Next.js <Link> hrefs (Next handles basePath automatically).
 * Use assetUrl for CSS background images or static assets referenced outside Next <Image>.
 */

/** Returns the configured basePath (empty in dev, /Smartlearn on GitHub Pages). */
export function getBasePath(): string {
  // Next.js automatically injects the configured basePath into its own Link/Image components.
  // For manual usage (CSS backgrounds, fetch calls to static JSON, etc.) we read the env.
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BASE_PATH) {
    return process.env.NEXT_PUBLIC_BASE_PATH;
  }
  return '';
}

/**
 * Prefix a static asset path with the base path so it resolves correctly on GitHub Pages.
 * Do NOT use this for Next.js <Link> href or next/image src — Next handles those automatically.
 *
 * @example
 * // CSS background image in an inline style:
 * style={{ backgroundImage: `url(${assetUrl('/images/hero.jpg')})` }}
 */
export function assetUrl(path: string): string {
  const base = getBasePath();
  if (!base) return path;
  // Avoid double-prefixing
  if (path.startsWith(base)) return path;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Builds a full absolute URL from a relative path, resolving basePath and origin.
 * Useful for sharing links, og:url, canonical tags.
 */
export function absoluteUrl(path: string): string {
  if (typeof window !== 'undefined') {
    const base = getBasePath();
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${window.location.origin}${base}${normalized}`;
  }
  return path;
}

/**
 * Parses the GitHub Pages SPA redirect query param from the URL.
 * GitHub Pages redirects 404 → root index.html with ?p=/encoded/path
 * This helper decodes that redirect path and returns it, or null.
 */
export function getGitHubPagesSpaRedirect(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const redirectPath = searchParams.get('p');
    if (redirectPath) {
      return decodeURIComponent(redirectPath);
    }
  } catch {
    // ignore
  }
  return null;
}
