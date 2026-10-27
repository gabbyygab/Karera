import { Download } from 'lucide-react';
import { AndroidIcon, RouteSign, WindowsIcon } from './ui';
import { formatDate, formatSize, headlineVersion, type Build, type Releases } from '../data/release';

const fmt = new Intl.NumberFormat('en-PH');
const count = (n: number | null) => (n === null ? '—' : fmt.format(n));

/**
 * The builds, drawn as the timing board the countdown used to be: lit cells for total
 * downloads, each platform's downloads, and the latest release date. Counts show a dash
 * until GitHub answers.
 */
export function ReleaseBoard({ releases }: { releases: Releases }) {
  const { android, windows } = releases.builds;
  const latest = android.published > windows.published ? android.published : windows.published;
  const cells: [string, string][] = [
    [count(releases.totalDownloads), 'Downloads'],
    [count(android.downloads), 'Android'],
    [count(windows.downloads), 'Windows'],
    [formatDate(latest).replace(/, \d{4}$/, ''), 'Updated'],
  ];

  return (
    <div className="grid grid-cols-2 md:flex items-stretch gap-3 md:gap-4" aria-label="Download stats">
      {cells.map(([value, label]) => (
        <div
          key={label}
          className="flex flex-col items-center justify-center bg-black/70 border-2 border-neon-yellow/60 min-w-[8rem] md:min-w-[9.5rem] px-3 md:px-5 py-2 md:py-3 skew-x-[-8deg] shadow-[0_0_24px_rgba(204,255,0,0.18)]"
        >
          <span className="font-display italic tabular-nums text-3xl md:text-5xl leading-none text-white skew-x-[8deg] whitespace-nowrap">{value}</span>
          <span className="font-hud text-[10px] md:text-xs tracking-[0.35em] uppercase text-neon-yellow mt-1 skew-x-[8deg]">{label}</span>
        </div>
      ))}
    </div>
  );
}

const platforms = {
  android: {
    label: 'Android',
    Icon: AndroidIcon,
    colour: 'text-[#3ddc84]',
    tone: 'sun',
    kind: 'APK',
    note: 'Phones and tablets. Not on the Play Store yet: open the APK after it downloads and allow installs from this source when Android asks.',
  },
  windows: {
    label: 'Windows',
    Icon: WindowsIcon,
    colour: 'text-electric-blue',
    tone: 'cream',
    kind: '64-bit ZIP',
    note: 'Unzip the whole folder, then run Karera.exe. If SmartScreen stops it, choose More info → Run anyway.',
  },
} as const;

function PlatformDownload({ build }: { build: Build }) {
  const p = platforms[build.platform];
  return (
    <div className="flex flex-col items-center text-center bg-black/55 border-t-4 border-white/15 px-5 py-6 md:px-6 md:py-7">
      <div className={`flex items-center gap-2 font-hud text-xs md:text-sm uppercase tracking-[0.25em] mb-4 ${p.colour}`}>
        <p.Icon className="w-5 h-5" />
        {p.label}
        {build.version && <span className="text-white/50">· v{build.version}</span>}
        {build.prerelease && <span className="text-white/50">· Beta</span>}
      </div>
      <RouteSign
        size="md"
        tone={p.tone}
        href={build.url}
        label="Download"
        via={`${p.kind} · ${formatSize(build.bytes)}`}
        icon={<Download className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2.5} />}
        aria-label={`Download Karera for ${p.label}, ${build.fileName}, ${formatSize(build.bytes)}`}
      />
      <p className="mt-4 max-w-xs text-xs md:text-sm text-gray-400">{p.note}</p>
    </div>
  );
}

/** One card per platform, side by side on a wide screen. */
export function PlatformDownloads({ releases }: { releases: Releases }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-3xl">
      <PlatformDownload build={releases.builds.android} />
      <PlatformDownload build={releases.builds.windows} />
    </div>
  );
}

/** One-line strip under the hero's signs: what's out and how many have it. */
export function ReleaseStrip({ releases }: { releases: Releases }) {
  const version = headlineVersion(releases);
  return (
    <div className="flex items-center gap-3 bg-black/60 border-2 border-white/15 px-4 py-2 skew-x-[-8deg]">
      <span className="font-hud text-[10px] md:text-xs tracking-[0.3em] uppercase text-gray-400 skew-x-[8deg]">Beta out now</span>
      <span className="font-hud font-bold tabular-nums text-lg md:text-2xl text-neon-yellow skew-x-[8deg]">
        {version ? `v${version}` : 'Android + PC'}
        {releases.totalDownloads !== null && <span className="text-white/70"> · {fmt.format(releases.totalDownloads)} downloads</span>}
      </span>
    </div>
  );
}
