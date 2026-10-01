import React, { useState, useMemo } from 'react';
import { MARBLE_POWERS } from '../data/powersData';
import { 
  Sparkles, 
  Shield, 
  Zap, 
  Coins, 
  ChevronRight, 
  Layers, 
  Flame, 
  Heart, 
  Gauge, 
  Weight,
  Clock
} from 'lucide-react';
import { soundManager } from '../utils/audioSystem';

export const ProgressionCalculator: React.FC = () => {
  const [level, setLevel] = useState<number>(7);
  const [selectedMassTier, setSelectedMassTier] = useState<'Light' | 'Balanced' | 'Heavy'>('Balanced');
  const [selectedPet, setSelectedPet] = useState<string>('Sparky');

  const baseHp = selectedMassTier === 'Light' ? 160 : selectedMassTier === 'Balanced' ? 200 : 260;
  const baseMass = selectedMassTier === 'Light' ? 0.75 : selectedMassTier === 'Balanced' ? 1.0 : 1.75;
  const baseSpeed = selectedMassTier === 'Light' ? 1.3 : selectedMassTier === 'Balanced' ? 1.0 : 0.75;

  // Stat Scaling calculations
  const scaledHp = Math.round(baseHp + (level - 1) * 24);
  const scaledDamageMultiplier = (1.0 + (level - 1) * 0.09).toFixed(2);
  const scaledCooldown = Math.max(2.5, (5.0 - (level - 1) * 0.15)).toFixed(1);
  const upgradeCost = Math.round(150 * Math.pow(1.35, level - 1));

  // Time to Kill (TTK) against 200 HP baseline
  const estimatedTtkSeconds = useMemo(() => {
    const hitsNeeded = Math.ceil(scaledHp / (45 * Number(scaledDamageMultiplier)));
    return (hitsNeeded * 0.9).toFixed(1);
  }, [scaledHp, scaledDamageMultiplier]);

  const pets = [
    {
      name: 'Sparky the Voltwisp',
      rarity: 'Rare',
      perk: '+18% Energy recharge rate on all bounces',
      color: '#eab308'
    },
    {
      name: 'Glacier Cub Golem',
      rarity: 'Epic',
      perk: '+25% Knockback resistance vs Heavy marbles',
      color: '#06b6d4'
    },
    {
      name: 'Chrono-Pixie',
      rarity: 'Legendary',
      perk: 'Slows enemy projectiles & traps by 50%',
      color: '#a855f7'
    },
    {
      name: 'Loot-Goblin Orb',
      rarity: 'Mythic',
      perk: 'Vacuums gems 2x further & grants +20% coins',
      color: '#f43f5e'
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Gauge className="w-4 h-4" />
            <span>GDD §05 · Systems & RPG Design</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Marble Progression & Economy Calculator
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Model real-time stat curves (Levels 1–15), mass tier knockback advantages, soft currency sink curves, and companion pet buffs.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
          <span className="text-slate-400">Upgrade Cost to Lv.{level + 1}: </span>
          <strong className="text-amber-400">{upgradeCost} Coins</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Configuration Sliders (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          {/* Level Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                Marble Upgrade Level
              </span>
              <span className="font-mono text-sm font-bold text-amber-400">
                Level {level} / 15
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              value={level}
              onChange={(e) => {
                soundManager.playMarbleClick(0.4);
                setLevel(Number(e.target.value));
              }}
              className="w-full accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Lv.1 (Starter)</span>
              <span>Lv.7 (Mid-Tier)</span>
              <span>Lv.15 (Max Mastery)</span>
            </div>
          </div>

          {/* Mass Tier Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Marble Weight & Mass Archetype:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { tier: 'Light', desc: '0.75x Mass · High Agility', icon: Gauge },
                { tier: 'Balanced', desc: '1.0x Mass · Striker', icon: Flame },
                { tier: 'Heavy', desc: '1.75x Mass · Juggernaut', icon: Weight }
              ].map((item) => {
                const isSelected = selectedMassTier === item.tier;
                const Icon = item.icon;
                return (
                  <button
                    key={item.tier}
                    onClick={() => {
                      soundManager.playMarbleClick(0.5);
                      setSelectedMassTier(item.tier as 'Light' | 'Balanced' | 'Heavy');
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/60 text-white font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                    <div className="text-xs font-bold text-slate-200">{item.tier}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Companion Pet Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Equipped Companion Pet Sphere:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {pets.map((p) => {
                const isSelected = selectedPet === p.name;
                return (
                  <button
                    key={p.name}
                    onClick={() => {
                      soundManager.playMarbleClick(0.6);
                      setSelectedPet(p.name);
                    }}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      isSelected
                        ? 'bg-purple-500/10 border-purple-500/60 text-white font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{p.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded border border-purple-800/40 text-purple-300">
                        {p.rarity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {p.perk}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Real-Time Calculated Metrics (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
              ★ Combat Performance Telemetry
            </h3>

            <div className="space-y-3 font-mono">
              {/* HP Meter */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    Max Durability (HP):
                  </span>
                  <span className="text-white font-bold text-sm">{scaledHp} HP</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full"
                    style={{ width: `${(scaledHp / 550) * 100}%` }}
                  />
                </div>
              </div>

              {/* Damage Multiplier */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    Momentum Damage Multiplier:
                  </span>
                  <span className="text-white font-bold text-sm">{scaledDamageMultiplier}x</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${(Number(scaledDamageMultiplier) / 2.5) * 100}%` }}
                  />
                </div>
              </div>

              {/* Ability Cooldown */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    Signature Cooldown:
                  </span>
                  <span className="text-white font-bold text-sm">{scaledCooldown}s</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${(Number(scaledCooldown) / 5.0) * 100}%` }}
                  />
                </div>
              </div>

              {/* TTK Simulation */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Estimated Match TTK:</span>
                <span className="text-emerald-400 font-bold text-sm">~{estimatedTtkSeconds}s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
