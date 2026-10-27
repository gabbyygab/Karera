import { motion } from 'framer-motion';
import { Cog, Flame, Gamepad2, History, Users, Smartphone, Zap, Palette } from 'lucide-react';
import { SectionTitle } from './ui';

const features = [
  { icon: Cog, title: 'Five drivetrains', desc: 'Manual gearboxes with a real clutch, a horse that answers to five whip levels, a pedicab with one gear and a stand-up sprint, a scooter belt that shifts itself, and a hub motor with regen.' },
  { icon: Flame, title: 'Drift mini-turbo', desc: 'Hold a slide to charge three tiers of boost. Cobbles break traction in small steps — Vigan charges drifts 18% faster.' },
  { icon: Zap, title: 'Turbo gauge', desc: 'Every booster pad fills one of three cells. Fire when you choose and the whole gauge burns at once, and a full gauge burns harder.' },
  { icon: History, title: 'Auto-rewind', desc: 'Overturned or off the tarmac for four seconds? The game rewinds you three seconds, back on the road and square to it.' },
  { icon: Users, title: '2–8 player online', desc: 'Host on one device, join by address over Wi-Fi or the internet. Vote the vehicle, vote the road, everyone drives the winner — and throw kamote at each other.' },
  { icon: Smartphone, title: 'Per-vehicle touch controls', desc: 'Reins and a whip for the kalesa, a three-spoke wheel for the jeepney, a twist grip for the scooters — or pair your phone as a tilt-to-steer wheel.' },
  { icon: Palette, title: 'Skins', desc: 'A pandesal bakery cart that sheds bread rolls, a three-up habal-habal, a Mio carrying three, four horses for the kalesa. A look, never a tune.' },
  { icon: Gamepad2, title: 'Honest AI', desc: 'Rivals drive through the same throttle, brake and clutch you do. Difficulty changes what they ask for, never the physics.' },
];

export function Features() {
  return (
    <section id="features" className="relative py-16 md:py-24 px-4 md:px-6 max-w-7xl mx-auto z-10">
      <SectionTitle kicker="What's under the bodywork" color="text-hot-pink">
        Race Mechanics
      </SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30, rotate: i % 2 ? 2 : -2 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 4) * 0.08, type: 'spring', stiffness: 200, damping: 20 }}
            whileHover={{ y: -6 }}
            className="bg-asphalt-light p-5 md:p-6 border-2 border-transparent hover:border-neon-yellow transition-colors group relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 font-display italic text-7xl text-white/[0.04]">{String(i + 1).padStart(2, '0')}</div>
            <f.icon className="w-10 h-10 md:w-12 md:h-12 text-electric-blue mb-4 group-hover:text-neon-yellow transition-colors" />
            <h3 className="font-display italic uppercase text-lg md:text-xl mb-2">{f.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const keys: { keys: string[]; verb: string; note?: string }[] = [
  { keys: ['W', '↑'], verb: 'Throttle', note: 'or urge the horse' },
  { keys: ['S', '↓'], verb: 'Brake' },
  { keys: ['A', 'D'], verb: 'Steer' },
  { keys: ['Space'], verb: 'Drift' },
  { keys: ['F'], verb: 'Fire turbo' },
  { keys: ['G'], verb: 'Throw kamote', note: 'Quick Race and online' },
  { keys: ['Shift'], verb: 'Clutch', note: 'or STAND on the padyak' },
  { keys: ['E', 'Q'], verb: 'Shift up / down' },
  { keys: ['C'], verb: 'Camera', note: 'chase · driver · vehicle' },
  { keys: ['Ctrl'], verb: 'Look back' },
  { keys: ['H'], verb: 'Horn' },
  { keys: ['R'], verb: 'Reset', note: 'hold' },
];

export function Controls() {
  return (
    <section id="how-to-play" className="relative py-16 md:py-24 px-4 md:px-6 bg-electric-blue text-black z-10 overflow-hidden">
      <div className="absolute -right-20 -bottom-24 font-display italic text-[16rem] leading-none text-black/5 select-none">GO</div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start relative">
        <div>
          <div className="font-hud text-xs tracking-[0.35em] uppercase mb-2 flex items-center gap-3">
            <span className="w-8 h-[3px] bg-black" /> How to drive
          </div>
          <h2 className="font-display text-4xl md:text-6xl italic uppercase leading-none mb-6">Clutch In, Then Shift</h2>
          <div className="space-y-5">
            {[
              ['01', 'The manuals', 'Traysikel, jeepney and habal-habal: hold the clutch, then shift. The jeepney is the only one with reverse — shift down out of neutral.'],
              ['02', 'The kalesa', 'There is no throttle. Each whip latches the horse up a gait; whip it too often and it tires.'],
              ['03', 'The padyak', "One gear: keep the cadence in its band, and STAND for a three-second sprint past the gear's ceiling. Then wait for the meter to reload."],
              ['04', 'The Mio and the KESO', "Automatics: just the throttle. The Mio's belt holds the engine on one note as you climb; the KESO launches hardest, and lifting off regens the pack."],
            ].map(([n, h, p]) => (
              <div key={n} className="flex gap-4 items-start">
                <div className="bg-black text-white px-3 py-2 font-display text-xl">{n}</div>
                <div>
                  <h4 className="font-display italic uppercase text-xl md:text-2xl">{h}</h4>
                  <p className="font-semibold text-black/75 text-sm md:text-base">{p}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm font-semibold text-black/70">On Android you drive with on-screen touch controls — every vehicle draws its own. On Windows, or with a keyboard or gamepad plugged in, use the keys above.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 md:gap-3">
          {keys.map((k, i) => (
            <motion.div
              key={k.verb}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="bg-black text-white p-3 flex items-center gap-3"
            >
              <div className="flex gap-1">
                {k.keys.map((key) => (
                  <kbd key={key} className="min-w-9 h-9 px-2 flex items-center justify-center bg-white text-black font-hud font-bold text-sm border-b-4 border-gray-400 rounded-sm">
                    {key}
                  </kbd>
                ))}
              </div>
              <div>
                <div className="font-hud font-bold uppercase text-sm">{k.verb}</div>
                {k.note && <div className="text-[10px] text-gray-400">{k.note}</div>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
