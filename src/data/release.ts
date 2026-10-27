import { useEffect, useState } from 'react';

// The game ships as an APK attached to a GitHub release. The site reads the newest release
// (prereleases included, so betas show) straight from the public API; the values below are
// what it shows if that call fails or is rate-limited.
const REPO = 'gabbyygab/Karera';
export const RELEASES_URL = `https://github.com/${REPO}/releases`;

export type Release = {
  tag: string;
  version: string;
  name: string;
  prerelease: boolean;
  published: Date;
  pageUrl: string;
  apkName: string;
  apkUrl: string;
  bytes: number;
  /** Downloads of this release's APK. Null until the API has answered. */
  downloads: number | null;
  /** Downloads of every APK across all releases. Null until the API has answered. */
  totalDownloads: number | null;
  releaseCount: number;
};

const fallback: Release = {
  tag: 'beta-0.2.0',
  version: '0.2.0',
  name: 'BETA RELEASE',
  prerelease: true,
  published: new Date('2026-10-27T16:40:02Z'),
  pageUrl: `${RELEASES_URL}/tag/beta-0.2.0`,
  apkName: 'Karera.v0.2.0.apk',
  apkUrl: `${RELEASES_URL}/download/beta-0.2.0/Karera.v0.2.0.apk`,
  bytes: 143620923,
  downloads: null,
  totalDownloads: null,
  releaseCount: 1,
};

type GhAsset = { name: string; size: number; download_count: number; browser_download_url: string };
type GhRelease = { tag_name: string; name: string | null; draft: boolean; prerelease: boolean; published_at: string; html_url: string; assets: GhAsset[] };

const isApk = (a: GhAsset) => a.name.toLowerCase().endsWith('.apk');
const versionOf = (tag: string) => tag.match(/\d+(\.\d+)+/)?.[0] ?? tag;

// Shared by every component that asks, so the page makes one API call (the unauthenticated
// limit is 60 an hour per visitor).
let request: Promise<Release | null> | undefined;

function fetchRelease() {
  request ??= fetch(`https://api.github.com/repos/${REPO}/releases?per_page=100`, { headers: { Accept: 'application/vnd.github+json' } })
    .then((r) => (r.ok ? (r.json() as Promise<GhRelease[]>) : Promise.reject(r.status)))
    .then((all) => {
      const shipped = all.filter((r) => !r.draft && r.assets.some(isApk));
      const latest = shipped[0];
      if (!latest) return null;
      const apk = latest.assets.find(isApk)!;
      return {
        tag: latest.tag_name,
        version: versionOf(latest.tag_name),
        name: latest.name || latest.tag_name,
        prerelease: latest.prerelease,
        published: new Date(latest.published_at),
        pageUrl: latest.html_url,
        apkName: apk.name,
        apkUrl: apk.browser_download_url,
        bytes: apk.size,
        downloads: apk.download_count,
        totalDownloads: shipped.reduce((n, r) => n + r.assets.filter(isApk).reduce((m, a) => m + a.download_count, 0), 0),
        releaseCount: shipped.length,
      };
    })
    .catch(() => null);
  return request;
}

/** The newest release with an APK on it, plus download totals; the fallback until GitHub answers. */
export function useRelease() {
  const [release, setRelease] = useState(fallback);
  useEffect(() => {
    let alive = true;
    fetchRelease().then((r) => alive && r && setRelease(r));
    return () => {
      alive = false;
    };
  }, []);
  return release;
}

export const formatSize = (bytes: number) => `${Math.round(bytes / 1024 / 1024)} MB`;
export const formatDate = (d: Date) => d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'Asia/Manila' });
