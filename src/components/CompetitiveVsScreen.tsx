import React, { useState, useEffect } from 'react';
import { MarblePower } from '../types/game';
import { BotOpponent } from '../types/competitive';
import { getPowerDisplayName, getRarityTextColor, getRarityTextClass, ELEMENTAL_MATCHUPS, MARBLE_POWERS } from '../data/powersData';
import { MarbleSkinThumbnail } from './MarbleSkinThumbnail';
import { competitiveManager, getRankForElo } from '../utils/competitiveManager';
import { soundManager } from '../utils/audioSystem';
import { 
  Swords, 
  ShieldAlert, 
  Zap, 
  Trophy, 
  ArrowRight, 
  Flame, 
  Sparkles,
  Play,
  Clock
} from 'lucide-react';

interface CompetitiveVsScreenProps {
  playerPower: MarblePower;
  botOpponent: BotOpponent;
  onComplete: () => void;
}

export const CompetitiveVsScreen: React.FC<CompetitiveVsScreenProps> = ({
  playerPower,
  botOpponent,
  onComplete
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const profile = competitiveManager.getProfile();
  const playerRank = getRankForElo(profile.elo);

  const botElo = botOpponent.botElo ?? (botOpponent as any).elo ?? 1200;
  const botRank = getRankForElo(botElo);

  const playerMatchup = ELEMENTAL_MATCHUPS[playerPower.element] || { strongAgainst: [], weakAgainst: [] };
  const botPower: MarblePower = (botOpponent as any).power || MARBLE_POWERS.find(p => p.id === botOpponent.powerId) || MARBLE_POWERS[1];
  const botMatchup = ELEMENTAL_MATCHUPS[botPower.element] || { strongAgainst: [], weakAgainst: [] };

  const playerLevel = profile.marbleLevels[playerPower.id] || 1;

  useEffect(() => {
    soundManager.playHeavyImpact(1.3);
    soundManager.playPowerTrigger('lightning');

    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          soundManager.playBattleStartTrumpetFanfare();
          onComplete();
          return 0;
        }
        soundManager.playMarbleClick(1.0);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete]);

  const handleSkip = () => {
    soundManager.playBattleStartTrumpetFanfare();
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-300 overflow-y-auto">
      {/* Dynamic Background FX */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-30 animate-pulse"
          style={{ backgroundColor: playerPower.colorHex }}
        />
        <div 
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-30 animate-pulse"
          style={{ backgroundColor: botPower.colorHex }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative w-full max-w-5xl mx-auto space-y-6 z-10 py-6">
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold uppercase tracking-widest shadow-lg shadow-amber-500/10">
            <Swords className="w-3.5 h-3.5" />
            <span>Presentación de Combate Competitivo</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            ¡Duelo por el <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400">Rango ELO</span>!
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Analiza los puntos débiles y habilidades de tu rival antes de que comience el enfrentamiento decisivo.
          </p>
        </div>

        {/* VS Fighter Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
          {/* LEFT: Player Fighter Card (5 Cols) */}
          <div className="lg:col-span-5 p-5 sm:p-6 rounded-3xl bg-slate-900/90 border-2 border-slate-700/80 shadow-2xl relative overflow-hidden space-y-4 transform hover:scale-[1.01] transition-all">
            <div 
              className="absolute top-0 left-0 right-0 h-1.5"
              style={{ backgroundColor: playerPower.colorHex }}
            />
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-black uppercase text-amber-400 tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                TÚ (JUGADOR)
              </span>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-800 border border-slate-700 text-slate-300">
                  Nivel {playerLevel}
                </span>
                <span 
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider shadow"
                  style={{ 
                    backgroundColor: `${getRarityTextColor(playerPower.rarity)}25`,
                    color: getRarityTextColor(playerPower.rarity),
                    borderColor: `${getRarityTextColor(playerPower.rarity)}60`,
                    borderWidth: '1px'
                  }}
                >
                  {playerPower.rarity}
                </span>
              </div>
            </div>

            {/* Avatar & Main Info */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <MarbleSkinThumbnail power={playerPower} size={84} expression="battle" />
                <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-md bg-slate-950 border border-slate-700 text-[10px] font-mono text-emerald-400 font-black">
                  +{(playerLevel - 1) * 5}%
                </div>
              </div>

              <div className="space-y-1 min-w-0 flex-1">
                <h3 className={`text-xl sm:text-2xl font-black truncate ${getRarityTextClass(playerPower.rarity)}`}>
                  {getPowerDisplayName(playerPower, 'es')}
                </h3>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-bold text-white">{profile.elo} ELO</span>
                  <span className="text-slate-500">·</span>
                  <span style={{ color: playerRank.colorHex }} className="font-bold">
                    {playerRank.tier} {playerRank.division}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium line-clamp-1">
                  Elemento: <span className="text-white font-bold">{playerPower.element}</span>
                </div>
              </div>
            </div>

            {/* Combat Power & Impact */}
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-300 font-bold">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Zap className="w-3.5 h-3.5" />
                  Habilidad Activa ({playerPower.cooldownSeconds}s)
                </span>
                <span className="font-mono text-emerald-400">+{((playerLevel - 1) * 5)}% Stats</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {playerPower.combatImpact}
              </p>
            </div>

            {/* Weaknesses and Strengths */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <span className="text-rose-400 font-bold block mb-0.5 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> Puntos Débiles:
                </span>
                <span className="text-slate-300 font-semibold">
                  {playerMatchup.weakAgainst.length > 0 ? playerMatchup.weakAgainst.join(', ') : 'Ninguno'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-emerald-400 font-bold block mb-0.5 flex items-center gap-1">
                  <Flame className="w-3 h-3" /> Fuerte Contra:
                </span>
                <span className="text-slate-300 font-semibold">
                  {playerMatchup.strongAgainst.length > 0 ? playerMatchup.strongAgainst.join(', ') : 'Todos'}
                </span>
              </div>
            </div>
          </div>

          {/* CENTER: VS & Countdown (1 Col on Desktop) */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center gap-3 py-2">
            <div className="relative flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-slate-950 font-black text-2xl tracking-tighter shadow-2xl shadow-rose-500/40 animate-bounce">
                VS
              </div>
              <div className="absolute -inset-2 rounded-full border-2 border-dashed border-amber-400/60 animate-spin" style={{ animationDuration: '8s' }} />
            </div>

            {/* Countdown Badge */}
            <div className="px-3.5 py-1.5 rounded-full bg-slate-900 border border-amber-400/50 flex items-center gap-2 shadow-lg">
              <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span className="text-base font-black font-mono text-amber-300">{secondsRemaining}s</span>
            </div>
          </div>

          {/* RIGHT: Bot Opponent Fighter Card (5 Cols) */}
          <div className="lg:col-span-5 p-5 sm:p-6 rounded-3xl bg-slate-900/90 border-2 border-slate-700/80 shadow-2xl relative overflow-hidden space-y-4 transform hover:scale-[1.01] transition-all">
            <div 
              className="absolute top-0 left-0 right-0 h-1.5"
              style={{ backgroundColor: botPower.colorHex }}
            />

            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-black uppercase text-rose-400 tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                RIVAL: {botOpponent.name}
              </span>
              <span 
                className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider shadow"
                style={{ 
                  backgroundColor: `${getRarityTextColor(botPower.rarity)}25`,
                  color: getRarityTextColor(botPower.rarity),
                  borderColor: `${getRarityTextColor(botPower.rarity)}60`,
                  borderWidth: '1px'
                }}
              >
                {botPower.rarity}
              </span>
            </div>

            {/* Avatar & Main Info */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <MarbleSkinThumbnail power={botPower} size={84} expression="battle" />
                <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-md bg-slate-950 border border-slate-700 text-[10px] font-mono text-rose-400 font-black">
                  {botOpponent.difficultyLabel}
                </div>
              </div>

              <div className="space-y-1 min-w-0 flex-1">
                <h3 className={`text-xl sm:text-2xl font-black truncate ${getRarityTextClass(botPower.rarity)}`}>
                  {getPowerDisplayName(botPower, 'es')}
                </h3>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-bold text-white">{botElo} ELO</span>
                  <span className="text-slate-500">·</span>
                  <span style={{ color: botRank.colorHex }} className="font-bold">
                    {botRank.tier} {botRank.division}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium line-clamp-1">
                  Elemento: <span className="text-white font-bold">{botPower.element}</span>
                </div>
              </div>
            </div>

            {/* Combat Power & Impact */}
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-300 font-bold">
                <span className="flex items-center gap-1.5 text-rose-400">
                  <Zap className="w-3.5 h-3.5" />
                  Habilidad Rival ({botPower.cooldownSeconds}s)
                </span>
                <span className="font-mono text-slate-400">IA {botOpponent.difficultyLabel}</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {botPower.combatImpact}
              </p>
            </div>

            {/* Weaknesses and Strengths */}
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <span className="text-rose-400 font-bold block mb-0.5 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> Puntos Débiles:
                </span>
                <span className="text-slate-300 font-semibold">
                  {botMatchup.weakAgainst.length > 0 ? botMatchup.weakAgainst.join(', ') : 'Ninguno'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-emerald-400 font-bold block mb-0.5 flex items-center gap-1">
                  <Flame className="w-3 h-3" /> Fuerte Contra:
                </span>
                <span className="text-slate-300 font-semibold">
                  {botMatchup.strongAgainst.length > 0 ? botMatchup.strongAgainst.join(', ') : 'Todos'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Skip / Start Now Button */}
        <div className="flex justify-center pt-2">
          <button
            onClick={handleSkip}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-slate-950 font-black text-sm tracking-wider shadow-xl shadow-purple-500/25 flex items-center gap-2 transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>¡SALTAR PRESENTACIÓN & LUCHAR YA! ({secondsRemaining}s)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
