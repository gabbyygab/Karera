import { useEffect, useState } from 'react';

// The game ships as files attached to GitHub releases: an APK for Android, a zip for Windows,
// each on whichever release carries it. The site reads them straight from the public API and
// picks the newest build per platform (prereleases included, so betas show); the values below
// are what it shows if that call fails or is rate-limited.
const REPO = 'gabbyygab/Karera';
export const RELEASES_URL = `https://github.com/${REPO}/releases`;

export type Platform = 'android' | 'windows';

export type Build = {
  platform: Platform;
  tag: string;
  /** e.g. "0.2.0", read from the tag or file name; null when neither carries one. */
  version: string | null;
  prerelease: boolean;
  published: Date;
  pageUrl: string;
  fileName: string;
  url: string;
  bytes: number;
  /** Downloads of this file. Null until the API has answered. */
  downloads: number | null;
};

export type Releases = {
  builds: Record<Platform, Build>;
  /** Downloads of every game file across all releases. Null until the API has answered. */
  totalDownloads: number | null;
};

const fallback: Releases = {
  builds: {
    android: {
      platform: 'android',
      tag: 'beta-0.2.0',
      version: '0.2.0',
      prerelease: true,
      published: new Date('2026-10-27T16:40:02Z'),
      pageUrl: `${RELEASES_URL}/tag/beta-0.2.0`,
      fileName: 'Karera.v0.2.0.apk',
      url: `${RELEASES_URL}/download/beta-0.2.0/Karera.v0.2.0.apk`,
      bytes: 143620923,
      downloads: null,
    },
    windows: {
      platform: 'windows',
      tag: 'Beta-Desktop',
      version: null,
      prerelease: true,
      published: new Date('2026-10-27T17:06:02Z'),
      pageUrl: `${RELEASES_URL}/tag/Beta-Desktop`,
      fileName: 'Karera-Windows-x64.zip',
      url: `${RELEASES_URL}/download/Beta-Desktop/Karera-Windows-x64.zip`,
      bytes: 120250479,
      downloads: null,
    },
  },
  totalDownloads: null,
};

type GhAsset = { name: string; size: number; download_count: number; browser_download_url: string };
type GhRelease = { tag_name: string; draft: boolean; prerelease: boolean; published_at: string; html_url: string; assets: GhAsset[] };

const matches: Record<Platform, (a: GhAsset) => boolean> = {
  android: (a) => /\.apk$/i.test(a.name),
  windows: (a) => /\.(zip|exe)$/i.test(a.name),
};
const isGame = (a: GhAsset) => matches.android(a) || matches.windows(a);
const versionIn = (s: string) => s.match(/\d+(\.\d+)+/)?.[0] ?? null;

// Shared by every component that asks, so the page makes one API call (the unauthenticated
// limit is 60 an hour per visitor).
let request: Promise<Releases | null> | undefined;

function fetchReleases() {
  request ??= fetch(`https://api.github.com/repos/${REPO}/releases?per_page=100`, { headers: { Accept: 'application/vnd.github+json' } })
    .then((r) => (r.ok ? (r.json() as Promise<GhRelease[]>) : Promise.reject(r.status)))
    .then((all) => {
      const shipped = all.filter((r) => !r.draft).sort((a, b) => b.published_at.localeCompare(a.published_at));
      const builds = { ...fallback.builds };
      for (const platform of Object.keys(matches) as Platform[]) {
        const release = shipped.find((r) => r.assets.some(matches[platform]));
        if (!release) continue;
        const asset = release.assets.find(matches[platform])!;
        builds[platform] = {
          platform,
          tag: release.tag_name,
          version: versionIn(release.tag_name) ?? versionIn(asset.name),
          prerelease: release.prerelease,
          published: new Date(release.published_at),
          pageUrl: release.html_url,
          fileName: asset.name,
          url: asset.browser_download_url,
          bytes: asset.size,
          downloads: asset.download_count,
        };
      }
      const totalDownloads = shipped.reduce((n, r) => n + r.assets.filter(isGame).reduce((m, a) => m + a.download_count, 0), 0);
      return { builds, totalDownloads };
    })
    .catch(() => null);
  return request;
}

/** The newest build for each platform, plus download totals; the fallback until GitHub answers. */
export function useReleases() {
  const [releases, setReleases] = useState(fallback);
  useEffect(() => {
    let alive = true;
    fetchReleases().then((r) => alive && r && setReleases(r));
    return () => {
      alive = false;
    };
  }, []);
  return releases;
}

/** The version to headline: the newest build's that has one. */
export const headlineVersion = ({ builds }: Releases) =>
  Object.values(builds)
    .filter((b) => b.version)
    .sort((a, b) => b.published.getTime() - a.published.getTime())[0]?.version ?? null;

export const formatSize = (bytes: number) => `${Math.round(bytes / 1024 / 1024)} MB`;
export const formatDate = (d: Date) => d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'Asia/Manila' });
