import React, { useState, useMemo } from 'react';
import { MARBLE_POWERS, ELEMENTAL_MATCHUPS, getPowerDisplayName } from '../data/powersData';
import { MarblePower, PowerCategory, ElementType } from '../types/game';
import { SupportedLanguage } from '../i18n/translations';
import { 
  Flame, 
  Snowflake, 
  Zap, 
  Mountain, 
  Wind, 
  Biohazard, 
  Radio, 
  Sparkles, 
  Compass, 
  Shield, 
  Cpu, 
  AlertTriangle, 
  Crosshair, 
  Bomb, 
  Maximize2, 
  Copy, 
  Magnet, 
  FastForward, 
  Anchor, 
  Dices,
  Volume2,
  Search,
  CheckCircle,
  HelpCircle,
  Swords
} from 'lucide-react';
import { soundManager } from '../utils/audioSystem';

interface PowersMatrixViewProps {
  onSelectForArena?: (power: MarblePower) => void;
  currentLang?: SupportedLanguage;
}

export const PowersMatrixView: React.FC<PowersMatrixViewProps> = ({ 
  onSelectForArena,
  currentLang = 'es'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedElement, setSelectedElement] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePowerId, setActivePowerId] = useState<string>(MARBLE_POWERS[0].id);
  const [testedSoundId, setTestedSoundId] = useState<string | null>(null);

  const categories: { label: string; count: number }[] = [
    { label: 'All', count: MARBLE_POWERS.length },
    { label: 'Elemental', count: MARBLE_POWERS.filter(p => p.category === 'Elemental').length },
    { label: 'Cosmic & Magic', count: MARBLE_POWERS.filter(p => p.category === 'Cosmic & Magic').length },
    { label: 'Mechanical & Tech', count: MARBLE_POWERS.filter(p => p.category === 'Mechanical & Tech').length },
    { label: 'Chaos & Meme/Fun', count: MARBLE_POWERS.filter(p => p.category === 'Chaos & Meme/Fun').length },
  ];

  const filteredPowers = useMemo(() => {
    return MARBLE_POWERS.filter(p => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchElem = selectedElement === 'All' || p.element === selectedElement;
      const matchSearch = !searchQuery.trim() || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.combatImpact.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.triggerCondition.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchElem && matchSearch;
    });
  }, [selectedCategory, selectedElement, searchQuery]);

  const activePower = useMemo(() => {
    return MARBLE_POWERS.find(p => p.id === activePowerId) || filteredPowers[0] || MARBLE_POWERS[0];
  }, [activePowerId, filteredPowers]);

  const getPowerIcon = (iconName: string, className: string = "w-5 h-5") => {
    switch (iconName) {
      case 'Flame': return <Flame className={className} />;
      case 'Snowflake': return <Snowflake className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Mountain': return <Mountain className={className} />;
      case 'Wind': return <Wind className={className} />;
      case 'Biohazard': return <Biohazard className={className} />;
      case 'Radio': return <Radio className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Compass': return <Compass className={className} />;
      case 'Shield': return <Shield className={className} />;
      case 'Cpu': return <Cpu className={className} />;
      case 'AlertTriangle': return <AlertTriangle className={className} />;
      case 'Crosshair': return <Crosshair className={className} />;
      case 'Bomb': return <Bomb className={className} />;
      case 'Maximize2': return <Maximize2 className={className} />;
      case 'Copy': return <Copy className={className} />;
      case 'Magnet': return <Magnet className={className} />;
      case 'FastForward': return <FastForward className={className} />;
      case 'Anchor': return <Anchor className={className} />;
      case 'Dices': return <Dices className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  const playAudioCue = (power: MarblePower) => {
    soundManager.playPowerTrigger(power.element);
    setTestedSoundId(power.id);
    setTimeout(() => setTestedSoundId(null), 1200);
  };

  const getRarityBadge = (rarity: string) => {
    const colors: Record<string, string> = {
      Common: 'text-slate-400 bg-slate-800/80 border-slate-700',
      Rare: 'text-sky-400 bg-sky-950/60 border-sky-800/60',
      Epic: 'text-purple-400 bg-purple-950/60 border-purple-800/60',
      Legendary: 'text-amber-400 bg-amber-950/60 border-amber-800/60',
      Mythic: 'text-rose-400 bg-rose-950/60 border-rose-800/60'
    };
    return colors[rarity] || colors.Common;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Banner & Filter Controls */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <Swords className="w-4 h-4" />
            <span>Complete 20-Power Battle Roster</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Marble Powers & Abilities Catalog
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Explore 20 meticulously balanced abilities across Elemental, Cosmic, Tech, and Meme categories. Every power is tuned for kinetic combat, tactile ASMR feedback, and viral video clip potential.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by power name or impact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/60 transition-colors"
          />
        </div>
      </div>

      {/* Category Segmented Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.label;
          return (
            <button
              key={cat.label}
              onClick={() => {
                soundManager.playMarbleClick(0.5);
                setSelectedCategory(cat.label);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/10'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isSelected ? 'bg-slate-950/20 text-slate-950 font-mono font-bold' : 'bg-slate-800 text-slate-400'
              }`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Split Grid: Cards List (Left) + Detailed Inspector (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Powers List (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Showing {filteredPowers.length} of 20 Powers</span>
            <span>Click any card to inspect full telemetry</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[720px] overflow-y-auto pr-1">
            {filteredPowers.map((power) => {
              const isSelected = power.id === activePower.id;
              return (
                <div
                  key={power.id}
                  onClick={() => {
                    soundManager.playMarbleClick(0.6);
                    setActivePowerId(power.id);
                  }}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all relative group ${
                    isSelected
                      ? 'bg-slate-800/90 border-amber-500/80 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/30'
                      : 'bg-slate-900/80 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
                        style={{ 
                          backgroundColor: `${power.colorHex}20`,
                          borderColor: `${power.colorHex}50`,
                          color: power.colorHex
                        }}
                      >
                        {getPowerIcon(power.iconName, 'w-4 h-4')}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-amber-200 transition-colors">
                          {getPowerDisplayName(power, currentLang)}
                        </h3>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                          <span style={{ color: power.colorHex }} className="font-semibold">
                            {power.element}
                          </span>
                          <span>·</span>
                          <span>{power.category.split('&')[0]}</span>
                        </div>
                      </div>
                    </div>

                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getRarityBadge(power.rarity)}`}>
                      {power.rarity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mt-3 leading-relaxed">
                    {power.combatImpact}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/80 text-[11px]">
                    <div className="flex items-center gap-2 text-slate-400 font-mono">
                      <span>DMG: <strong className="text-slate-200">{power.damageValue}</strong></span>
                      <span>·</span>
                      <span>KB: <strong className="text-slate-200">{power.knockbackMultiplier}x</strong></span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playAudioCue(power);
                      }}
                      className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 transition-colors"
                      title="Test ASMR Audio Cue"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Power Detailed Inspector & Elemental Wheel (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 sticky top-20">
            {/* Header info */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center border shadow-inner"
                  style={{ 
                    backgroundColor: `${activePower.colorHex}25`,
                    borderColor: `${activePower.colorHex}60`,
                    color: activePower.colorHex
                  }}
                >
                  {getPowerIcon(activePower.iconName, 'w-6 h-6')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getRarityBadge(activePower.rarity)}`}>
                      {activePower.rarity}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {activePower.category}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1">
                    {getPowerDisplayName(activePower, currentLang)}
                  </h2>
                </div>
              </div>

              <button
                onClick={() => playAudioCue(activePower)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  testedSoundId === activePower.id
                    ? 'bg-amber-500 text-slate-950 border-amber-400 scale-105'
                    : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{testedSoundId === activePower.id ? 'Playing...' : 'ASMR Audio'}</span>
              </button>
            </div>

            {/* Combat Specs Grid */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-center font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Base Damage</span>
                <span className="text-base font-bold text-amber-400">{activePower.damageValue} HP</span>
              </div>
              <div className="border-x border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Knockback</span>
                <span className="text-base font-bold text-sky-400">{activePower.knockbackMultiplier}x</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Cooldown</span>
                <span className="text-base font-bold text-purple-400">{activePower.cooldownSeconds}s</span>
              </div>
            </div>

            {/* Trigger Condition */}
            <div className="space-y-1 text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Trigger Condition:
              </span>
              <p className="text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60 leading-relaxed">
                {activePower.triggerCondition}
              </p>
            </div>

            {/* Visual & Tactile Effects */}
            <div className="space-y-1 text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Visual & Tactile Juiciness:
              </span>
              <p className="text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60 leading-relaxed">
                {activePower.visualEffect}
              </p>
              <p className="text-xs text-amber-400/90 italic pt-1">
                <strong>Haptic & Screen Shake:</strong> {activePower.tactileFeedback}
              </p>
            </div>

            {/* Combat Impact */}
            <div className="space-y-1 text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                In-Match Kinetic Impact:
              </span>
              <p className="text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60 leading-relaxed">
                {activePower.combatImpact}
              </p>
            </div>

            {/* Viral TikTok Potential */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-slate-900 border border-rose-500/20 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-rose-400 font-bold text-[11px]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Viral TikTok / Shorts Appeal:</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                {activePower.viralAppealNote}
              </p>
            </div>

            {/* Elemental Counter Affinity */}
            {ELEMENTAL_MATCHUPS[activePower.element] && (
              <div className="pt-2 border-t border-slate-800 text-xs space-y-1.5">
                <span className="text-slate-400 font-semibold block">Elemental Multiplier:</span>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-400">
                    +35% vs {ELEMENTAL_MATCHUPS[activePower.element].strongAgainst.join(', ')}
                  </span>
                  <span className="text-rose-400">
                    -25% vs {ELEMENTAL_MATCHUPS[activePower.element].weakAgainst.join(', ')}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
