import React, { useState, useEffect } from 'react';
import { MARBLE_POWERS, getPowerDisplayName, getRarityTextClass, getRarityTextColor } from '../data/powersData';
import { MarblePower, BattleMatchConfig } from '../types/game';
import { CompetitivePlayerProfile, BotOpponent } from '../types/competitive';
import { competitiveManager, getRankForElo, RANK_TIERS } from '../utils/competitiveManager';
import { soundManager } from '../utils/audioSystem';
import { SupportedLanguage, TRANSLATIONS } from '../i18n/translations';
import { MarbleHoverInspector } from './MarbleHoverInspector';
import { 
  Trophy, 
  Swords, 
  Sparkles, 
  Lock, 
  Check, 
  Flame, 
  Zap, 
  ArrowLeft, 
  Globe, 
  Layers, 
  Shield, 
  Coins, 
  Clock, 
  Dices,
  ChevronRight,
  Egg,
  Info,
  AlertTriangle
} from 'lucide-react';

interface CompetitiveSelectionMenuProps {
  onStartCompetitiveBattle: (playerPower: MarblePower, botOpponents: BotOpponent[]) => void;
  onGoToIncubator: () => void;
  onBackToMenu: () => void;
  currentLang: SupportedLanguage;
}

export const CompetitiveSelectionMenu: React.FC<CompetitiveSelectionMenuProps> = ({
  onStartCompetitiveBattle,
  onGoToIncubator,
  onBackToMenu,
  currentLang
}) => {
  const [profile, setProfile] = useState<CompetitivePlayerProfile>(competitiveManager.getProfile());
  const [activeTab, setActiveTab] = useState<'ranked_bots' | 'online_coming_soon'>('ranked_bots');
  const [selectedPowerId, setSelectedPowerId] = useState<string>(profile.selectedMarbleId || 'elem-fire');
  const [botOpponent, setBotOpponent] = useState<BotOpponent>(() => competitiveManager.generateBotOpponent());

  // Hover Tooltip & Elemental FX state
  const [hoveredInfo, setHoveredInfo] = useState<{
    power: MarblePower;
    screenX: number;
    screenY: number;
    isUnlocked: boolean;
    masteryLevel: number;
  } | null>(null);

  const t = TRANSLATIONS[currentLang];
  const rank = getRankForElo(profile.elo);

  useEffect(() => {
    const unsubscribe = competitiveManager.subscribe(() => {
      setProfile(competitiveManager.getProfile());
    });
    return unsubscribe;
  }, []);

  const selectedPower = MARBLE_POWERS.find(p => p.id === selectedPowerId) || MARBLE_POWERS[0];
  const botPower = MARBLE_POWERS.find(p => p.id === botOpponent.powerId) || MARBLE_POWERS[1];

  // Calculate ELO progress within current rank
  const nextRank = RANK_TIERS.find(r => r.minElo > profile.elo);
  const currentRankMin = rank.minElo;
  const currentRankMax = nextRank ? nextRank.minElo : rank.maxElo;
  const eloRange = Math.max(1, currentRankMax - currentRankMin);
  const eloProgress = Math.min(100, Math.max(0, ((profile.elo - currentRankMin) / eloRange) * 100));

  // Count available incubator eggs ready to hatch
  const readyEggCount = profile.incubatorEggs.filter(e => !e.isHatched && profile.eggTokens >= e.costTokens).length;

  const handleSelectMarble = (power: MarblePower) => {
    if (!profile.unlockedMarbleIds.includes(power.id)) {
      soundManager.playMarbleClick(0.3);
      return;
    }
    soundManager.playMarbleClick(0.7);
    setSelectedPowerId(power.id);
    competitiveManager.setSelectedMarble(power.id);
  };

  const handleRerollOpponent = () => {
    soundManager.playMarbleClick(0.6);
    setBotOpponent(competitiveManager.generateBotOpponent());
  };

  const handleStartMatch = () => {
    soundManager.playHeavyImpact(1.2);
    soundManager.playPowerTrigger(selectedPower.element);
    onStartCompetitiveBattle(selectedPower, [botOpponent]);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full animate-in fade-in duration-200">
      {/* Top Header: Navigation & Player ELO / League Banner */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playMarbleClick(0.6);
              onBackToMenu();
            }}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            title="Volver"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Trophy className="w-3.5 h-3.5" />
              <span>MODO COMPETITIVO RANKED</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Arena Clasificatoria ELO
            </h1>
          </div>
        </div>

        {/* ELO & Incubator Egg Tokens Counters */}
        <div className="flex items-center flex-wrap gap-2.5 w-full md:w-auto">
          {/* ELO Badges */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: rank.colorHex, boxShadow: `0 0 10px ${rank.colorHex}` }}
            />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {rank.tier}
            </span>
            <span className="text-xs font-black text-amber-400 font-mono">
              {profile.elo} ELO
            </span>
          </div>

          {/* Win Streak */}
          {profile.winStreak > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Racha x{profile.winStreak}</span>
            </div>
          )}

          {/* Egg Tokens / Incubator Currency */}
          <button
            onClick={() => {
              soundManager.playMarbleClick(0.7);
              onGoToIncubator();
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-purple-950/60 border border-purple-800 hover:border-purple-600 text-purple-200 transition-all cursor-pointer relative"
          >
            <Egg className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold font-mono text-purple-300">
              {profile.eggTokens} Fragmentos
            </span>
            {readyEggCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-black text-[9px] animate-bounce">
                ¡{readyEggCount} LISTO!
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mode Selector Tab Bar with "ONLINE (COMING SOON)" prominently displayed */}
      <div className="flex items-center gap-3 border-b border-slate-800/80 pb-1">
        <button
          onClick={() => {
            soundManager.playMarbleClick(0.5);
            setActiveTab('ranked_bots');
          }}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
            activeTab === 'ranked_bots'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Swords className="w-4 h-4" />
          <span>Partida Competitiva (vs Bots)</span>
        </button>

        {/* REQUIRED: ONLINE (COMING SOON) right beside it */}
        <div className="relative group">
          <button
            disabled
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm bg-slate-900/40 text-slate-500 border border-slate-800/60 cursor-not-allowed opacity-80"
          >
            <Globe className="w-4 h-4 text-cyan-500/50" />
            <span>Modo En Línea (Online)</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800/60 text-cyan-400 text-[10px] font-mono tracking-wider uppercase">
              Coming Soon
            </span>
          </button>
          <div className="absolute top-full left-0 mt-2 hidden group-hover:block z-30 w-64 p-2.5 rounded-xl bg-slate-950 border border-cyan-900/60 text-[11px] text-slate-300 shadow-2xl">
            ⚡ Los servidores multijugador online PvP en tiempo real se habilitarán en la próxima temporada clasificatoria.
          </div>
        </div>
      </div>

      {/* Main Grid: Marble Selection & Matchmaking Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Unlocked Marbles Grid */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Elige tu Canica para el Competitivo
              </span>
              <span className="font-mono text-xs text-amber-400 font-bold">
                {profile.unlockedMarbleIds.length} / {MARBLE_POWERS.length} Desbloqueadas ({Math.round((profile.unlockedMarbleIds.length / MARBLE_POWERS.length) * 100)}%)
              </span>
            </div>

            {/* Collection Progress Bar */}
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-300"
                style={{ width: `${(profile.unlockedMarbleIds.length / MARBLE_POWERS.length) * 100}%` }}
              />
            </div>

            {/* 20 Marbles Grid (Locked ones clearly shaded with locks) */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 pt-1">
              {MARBLE_POWERS.map((power) => {
                const isUnlocked = profile.unlockedMarbleIds.includes(power.id);
                const isSelected = selectedPowerId === power.id;
                const masteryLevel = profile.marbleLevels[power.id] || 1;

                return (
                  <button
                    key={power.id}
                    onClick={() => handleSelectMarble(power)}
                    onMouseEnter={(e) => {
                      setHoveredInfo({
                        power,
                        screenX: e.clientX,
                        screenY: e.clientY,
                        isUnlocked,
                        masteryLevel
                      });
                    }}
                    onMouseMove={(e) => {
                      setHoveredInfo({
                        power,
                        screenX: e.clientX,
                        screenY: e.clientY,
                        isUnlocked,
                        masteryLevel
                      });
                    }}
                    onMouseLeave={() => setHoveredInfo(null)}
                    className={`relative p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      isUnlocked
                        ? isSelected
                          ? 'bg-slate-800 border-amber-400 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/50 cursor-pointer'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300 cursor-pointer'
                        : 'bg-slate-950/40 border-slate-900 opacity-60 cursor-pointer hover:border-slate-800'
                    }`}
                  >
                    {/* Marble Avatar Sphere */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shadow-md relative"
                      style={{
                        background: isUnlocked
                          ? `radial-gradient(circle at 35% 30%, #ffffff 0%, ${power.colorHex} 60%, #020617 100%)`
                          : '#1e293b',
                        boxShadow: isUnlocked ? `0 0 10px ${power.colorHex}60` : 'none'
                      }}
                    >
                      {!isUnlocked && (
                        <div className="absolute inset-0 bg-slate-950/70 rounded-full flex items-center justify-center">
                          <Lock className="w-4 h-4 text-slate-400" />
                        </div>
                      )}
                    </div>

                    {/* Marble name color depends on rarity: comun gris, raro azul, epico morado, legendario dorado */}
                    <span className={`text-[11px] truncate max-w-full font-bold ${getRarityTextClass(power.rarity)}`}>
                      {getPowerDisplayName(power, currentLang).split(' ')[0]}
                    </span>

                    {/* Mastery Level or Locked Tag */}
                    {isUnlocked ? (
                      <span className="text-[9px] font-mono text-amber-400 font-bold bg-amber-500/10 px-1 rounded border border-amber-500/20">
                        Nvl. {masteryLevel}
                      </span>
                    ) : (
                      <span className="text-[8px] font-mono text-slate-500 flex items-center gap-0.5">
                        <Lock className="w-2 h-2" />
                        Huevos
                      </span>
                    )}

                    {isSelected && (
                      <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-sm">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Note on how to unlock more marbles */}
            <div className="p-3 rounded-2xl bg-purple-950/20 border border-purple-900/40 flex items-center justify-between text-xs text-purple-300">
              <span className="flex items-center gap-2">
                <Egg className="w-4 h-4 text-purple-400" />
                <span>Consigue más canicas incubando huevos con victorias competitivas.</span>
              </span>
              <button
                onClick={onGoToIncubator}
                className="px-2.5 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] transition-colors cursor-pointer"
              >
                Abrir Incubadora
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Matchmaking vs Bot Card & Start Action */}
        <div className="lg:col-span-5 space-y-4">
          {/* Matchup Card (Player vs Bot) */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Swords className="w-4 h-4 text-rose-500" />
                Enfrentamiento Clasificatorio
              </span>
              <button
                onClick={handleRerollOpponent}
                className="text-slate-400 hover:text-amber-400 flex items-center gap-1 text-[11px] font-mono transition-colors cursor-pointer"
                title="Buscar otro rival"
              >
                <Dices className="w-3.5 h-3.5" />
                <span>Cambiar Rival</span>
              </button>
            </div>

            {/* Player vs Bot Banner */}
            <div className="grid grid-cols-2 gap-3 items-center p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
              {/* Player Side */}
              <div className="text-center space-y-2 border-r border-slate-800 pr-2">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                  TÚ ({rank.tier})
                </span>
                <div
                  className="w-14 h-14 rounded-full mx-auto shadow-lg flex items-center justify-center"
                  style={{
                    background: `radial-gradient(circle at 35% 30%, #ffffff 0%, ${selectedPower.colorHex} 60%, #020617 100%)`,
                    boxShadow: `0 0 16px ${selectedPower.colorHex}70`
                  }}
                />
                <div>
                  <h4 className={`text-xs font-bold truncate ${getRarityTextClass(selectedPower.rarity)}`}>
                    {getPowerDisplayName(selectedPower, currentLang)}
                  </h4>
                  <span className="text-[10px] text-amber-400 font-mono font-bold block">
                    {selectedPower.rarity} · {profile.elo} ELO
                  </span>
                </div>
              </div>

              {/* Bot Side: MYSTERY RIVAL (Canica Oculta) */}
              <div className="text-center space-y-2 pl-2">
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">
                  RIVAL ({botOpponent.difficultyLabel})
                </span>
                <div
                  className="w-14 h-14 rounded-full mx-auto shadow-xl flex items-center justify-center border-2 border-purple-500/40 relative overflow-hidden"
                  style={{
                    background: `radial-gradient(circle at 35% 30%, #475569 0%, #1e293b 50%, #050814 100%)`,
                    boxShadow: `0 0 20px rgba(168, 85, 247, 0.4)`
                  }}
                >
                  <span className="text-2xl font-black text-purple-300 animate-pulse drop-shadow-md">?</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-950/30 to-transparent pointer-events-none" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white truncate">
                    {botOpponent.name}
                  </h4>
                  <span className="text-[10px] text-purple-300/80 font-mono font-bold block">
                    ??? Canica Oculta · {botOpponent.botElo} ELO
                  </span>
                </div>
              </div>
            </div>

            {/* Selected Marble Force Points & Skill */}
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Puntos de Fuerza de tu Canica
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-center font-mono">
                <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[9px] text-slate-400 block">💥 Fuerza</span>
                  <span className="text-xs font-black text-amber-400">{selectedPower.damageValue} PTS</span>
                </div>
                <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[9px] text-slate-400 block">⚡ Empuje</span>
                  <span className="text-xs font-black text-cyan-400">x{selectedPower.knockbackMultiplier}</span>
                </div>
                <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[9px] text-slate-400 block">⏱️ Recarga</span>
                  <span className="text-xs font-black text-purple-400">{selectedPower.cooldownSeconds}s</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-300 line-clamp-2 leading-relaxed">
                <strong className={getRarityTextClass(selectedPower.rarity)}>{selectedPower.name}:</strong> {selectedPower.combatImpact}
              </p>
            </div>

            {/* Victory Stakes & Rewards */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  Victoria ELO:
                </span>
                <span className="font-bold text-emerald-400">
                  +30 a +60 ELO
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Egg className="w-3.5 h-3.5 text-purple-400" />
                  Fragmentos de Huevo:
                </span>
                <span className="font-bold text-purple-300">
                  +40 a +65 Fragmentos
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-rose-400" />
                  Derrota:
                </span>
                <span className="font-bold text-rose-400">
                  -10 a -15 ELO (+12 Frag. Piedad)
                </span>
              </div>
            </div>

            {/* Special Rules Banner: Campo 100%, Canicas 200%, Salida con -30 ELO */}
            <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-900/60 text-[11px] text-rose-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-rose-400">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>REGLAS DEL COMBATE COMPETITIVO</span>
              </div>
              <ul className="list-disc list-inside text-[10px] text-slate-300 space-y-0.5 leading-relaxed font-mono">
                <li><strong className="text-amber-300">Retirada con penalización:</strong> Si abandonas la batalla pierdes <strong className="text-rose-400">-30 ELO</strong>.</li>
                <li><strong className="text-amber-300">Canicas 200% gigantes:</strong> El doble de tamaño para choques masivos y máxima visibilidad.</li>
                <li><strong className="text-amber-300">Mapa al 100%:</strong> Escala ideal para combates vertiginosos de 15s a 60s con muerte súbita.</li>
                <li><strong className="text-amber-300">Rival incógnito en selección:</strong> La canica del oponente se descubre al comenzar la batalla.</li>
              </ul>
            </div>

            {/* Giant Action Button: ¡BUSCAR COMBATE COMPETITIVO! */}
            <button
              onClick={handleStartMatch}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-lg tracking-wider shadow-xl shadow-amber-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 border-2 border-amber-300/80 cursor-pointer"
            >
              <Swords className="w-5 h-5 fill-slate-950" />
              <span>¡LUCHAR EN RANKED!</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Hover Inspector with Elemental Particles & Force Points */}
      {hoveredInfo && (
        <MarbleHoverInspector
          power={hoveredInfo.power}
          screenX={hoveredInfo.screenX}
          screenY={hoveredInfo.screenY}
          currentLang={currentLang}
          isUnlocked={hoveredInfo.isUnlocked}
          masteryLevel={hoveredInfo.masteryLevel}
        />
      )}
    </div>
  );
};
