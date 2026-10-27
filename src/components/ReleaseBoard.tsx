import { formatDate, formatSize, type Release } from '../data/release';

const fmt = new Intl.NumberFormat('en-PH');

/**
 * The latest build, drawn as the timing board the countdown used to be: lit cells for
 * downloads, version, size and release date. Downloads show a dash until GitHub answers.
 */
export function ReleaseBoard({ release }: { release: Release }) {
  const cells: [string, string][] = [
    [release.downloads === null ? '—' : fmt.format(release.downloads), 'Downloads'],
    [`v${release.version}`, release.prerelease ? 'Beta' : 'Version'],
    [formatSize(release.bytes).replace(' MB', ''), 'MB'],
    [formatDate(release.published).replace(/, \d{4}$/, ''), 'Released'],
  ];

  return (
    <div className="grid grid-cols-2 md:flex items-stretch gap-3 md:gap-4" aria-label="Latest release">
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

/** One-line strip under the hero's signs: what's out and how many have it. */
export function ReleaseStrip({ release }: { release: Release }) {
  return (
    <div className="flex items-center gap-3 bg-black/60 border-2 border-white/15 px-4 py-2 skew-x-[-8deg]">
      <span className="font-hud text-[10px] md:text-xs tracking-[0.3em] uppercase text-gray-400 skew-x-[8deg]">{release.prerelease ? 'Beta out now' : 'Out now'}</span>
      <span className="font-hud font-bold tabular-nums text-lg md:text-2xl text-neon-yellow skew-x-[8deg]">
        v{release.version}
        {release.downloads !== null && <span className="text-white/70"> · {fmt.format(release.downloads)} downloads</span>}
      </span>
    </div>
  );
}
