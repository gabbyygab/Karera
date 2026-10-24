# Re-exporting game assets for the website

These scripts run inside the open Karera Unity editor through the Unity CLI
(`unity command eval_file --file <path> --timeout 600`). Copy them into
`E:\GamedevProjects\Karera\Temp\web\` first — paths inside are relative to the Unity project.
Nothing here edits or saves a project asset or scene.

| Script | Writes | Notes |
| --- | --- | --- |
| `dump.cs` | `Temp/web/karera-data.json` | Vehicle stats, skins, map catalogue and track centrelines. `src/data/karera.ts` was generated from it. |
| `glb.cs` | `public/models/*.glb` | Every vehicle prefab (plus the THREE-UP skin) as binary glTF. Unity → glTF: x mirrored, winding reversed. Material names are kept so skins can recolour by name. |
| `cap.cs` | `public/maps/<map>/*.jpg`, `Temp/web/frames/<map>/` | Reads `Temp/web/cap-args.txt`: `<mapIndex> stills` or `<mapIndex> frames <count> <lapFraction>`. Opens the map scene, places vehicles on the baked line, renders, reopens the scene clean. |
| `studio.cs` | `public/vehicles/*-side.png`, `*-hero.png` | Transparent cut-outs. Side views are orthographic at 250 px per metre so the roster compares at true scale. |
| `port.cs` | `public/cast/*.png`, `Temp/web/cast.json` | The campaign cast's portraits from `CharacterPortraitFactory`. |
| `reopen.cs` | — | Reopens Map04_Bustos clean after a studio render. |

Afterwards, convert to WebP and rebuild the video with ffmpeg (see the commands in the session that made them):
stills `-vf scale=1600:-1 -c:v libwebp -quality 80`, cut-outs `-c:v libwebp -pix_fmt yuva420p -quality 90`,
clips `-framerate 30 -i f%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 23`, and `montage.mp4` is the seven clips
joined with 0.5 s `xfade=slideleft` transitions at 5 s offsets (35.5 s). `maps/montage-collage.webp` is a 4x2
`xstack` of each map's `action-1` plus the National Road `aerial` (718x404 tiles, 8 px gaps).

Maps 6 and 7 (Manila, National Road) were added 2026-10-05: `cap.cs` knows seven slugs, and pulls the
first aerial in for the National Road's long, thin lap. Their `src/data/karera.ts` entries were generated
from `dump.cs` with the same plan rule as the others: start at the finish line, every `ceil(count/250)`th
sample, scaled to 100 across the longer axis, north up, heights from the lowest point.

Re-exported 2026-10-24 for the roster after the motorela was removed (2026-10-16): `glb.cs` and
`studio.cs` now write `mio`, plus the prefab skins `mio-nightshift` (NIGHT SHIFT, asset id still
`mio-schoolrun`) and `traysikel-pandesal` (ROLLING PANDESAL). `glb.cs` writes alpha-clipped materials
(`_AlphaClip`) as glTF `MASK` so decals cut out. `dump.cs` knows `CvtDrive` and also writes the
campaign's chapters; `cast.json` from `port.cs` is pasted in as `cast`. `cap.cs` fields now swap the
motorela for the Mio and lead with each map's current chapter vehicle (San Isidro: padyak, Cagayan de
Oro: Mio). Stills, all seven clips (`<map> frames 165 0.18`), the montage, its poster (San Isidro frame 0)
and the collage were re-shot the same day. The editor must be out of Play mode; the CLI may report
"Main thread operation timed out" while a frame run still completes, so check `Temp/web/frames/<map>`.
