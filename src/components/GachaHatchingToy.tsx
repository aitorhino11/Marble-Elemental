import React, { useState, useEffect, useRef } from 'react';
import { MARBLE_POWERS, getPowerDisplayName } from '../data/powersData';
import { MarblePower, RarityTier } from '../types/game';
import { soundManager } from '../utils/audioSystem';
import { competitiveManager } from '../utils/competitiveManager';
import { CompetitivePlayerProfile, IncubatorEggSlot } from '../types/competitive';
import { SupportedLanguage, TRANSLATIONS } from '../i18n/translations';
import { drawMarbleSkin } from '../utils/marbleSkinRenderer';
import { 
  Sparkles, 
  RotateCcw, 
  Trophy, 
  ShieldCheck, 
  Coins, 
  Flame, 
  Lock, 
  Layers, 
  ArrowRight,
  Egg,
  Swords,
  Plus,
  CheckCircle2,
  Check,
  Crown,
  Percent,
  Zap,
  Info,
  Star
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GachaHatchingToyProps {
  onGoToCompetitive?: () => void;
  onGoToFusion?: () => void;
  currentLang?: SupportedLanguage;
}

export const GachaHatchingToy: React.FC<GachaHatchingToyProps> = ({
  onGoToCompetitive,
  onGoToFusion,
  currentLang = 'es'
}) => {
  const [profile, setProfile] = useState<CompetitivePlayerProfile>(competitiveManager.getProfile());
  const [selectedEggId, setSelectedEggId] = useState<string | null>(null);

  // Tab: 'incubator' | 'probabilities'
  const [activeTab, setActiveTab] = useState<'incubator' | 'probabilities'>('incubator');

  // Step 0: Ready, Step 1: Cracked / Wobble, Step 2: Rattle / Light Beams, Step 3: Revealed
  const [hatchStep, setHatchStep] = useState<number>(0);
  const [revealedPower, setRevealedPower] = useState<MarblePower | null>(null);
  const [isNewUnlock, setIsNewUnlock] = useState<boolean>(false);
  const [revealedLevel, setRevealedLevel] = useState<number>(1);
  const [hatchError, setHatchError] = useState<string | null>(null);

  // Epic/Legendary celebration canvas ref
  const celebrationCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const unsubscribe = competitiveManager.subscribe(() => {
      setProfile(competitiveManager.getProfile());
    });
    return unsubscribe;
  }, []);

  // Animation loop for Epic/Legendary celebration canvas
  useEffect(() => {
    if (!revealedPower || hatchStep !== 3) return;
    const canvas = celebrationCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let startTime = performance.now();
    const isHighTier = revealedPower.rarity === 'Legendary' || revealedPower.rarity === 'Epic';

    const loop = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + 10;
      const radius = 50;

      // 1. Radiant Rotating Sunburst Rays for Epic & Legendary!
      if (isHighTier) {
        ctx.save();
        ctx.translate(cx, cy);

        // 16 Rotating Light Beams
        const numRays = 16;
        const rayAngle = (Math.PI * 2) / numRays;
        for (let r = 0; r < numRays; r++) {
          const a = r * rayAngle + elapsed * (revealedPower.rarity === 'Legendary' ? 0.9 : 0.6);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.arc(0, 0, 150, a, a + rayAngle * 0.45);
          ctx.closePath();

          ctx.fillStyle = revealedPower.rarity === 'Legendary'
            ? `rgba(245, 158, 11, ${0.12 + Math.sin(elapsed * 4 + r) * 0.05})`
            : `rgba(168, 85, 247, ${0.14 + Math.sin(elapsed * 4 + r) * 0.05})`;
          ctx.fill();
        }

        // Concentric Expanding Energy Rings
        const ringProg1 = ((elapsed * 50) % 130);
        const ringAlpha1 = Math.max(0, 1 - ringProg1 / 130);
        ctx.strokeStyle = revealedPower.rarity === 'Legendary'
          ? `rgba(251, 191, 36, ${ringAlpha1 * 0.7})`
          : `rgba(192, 132, 252, ${ringAlpha1 * 0.7})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, ringProg1, 0, Math.PI * 2);
        ctx.stroke();

        const ringProg2 = (((elapsed * 50) + 65) % 130);
        const ringAlpha2 = Math.max(0, 1 - ringProg2 / 130);
        ctx.strokeStyle = revealedPower.rarity === 'Legendary'
          ? `rgba(245, 158, 11, ${ringAlpha2 * 0.5})`
          : `rgba(216, 180, 254, ${ringAlpha2 * 0.5})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, ringProg2, 0, Math.PI * 2);
        ctx.stroke();

        // Starlight Sparkles orbiting the marble
        for (let s = 0; s < 8; s++) {
          const sAngle = (s / 8) * Math.PI * 2 + elapsed * 1.5;
          const sDist = radius + 22 + Math.sin(elapsed * 3 + s) * 10;
          const sx = Math.cos(sAngle) * sDist;
          const sy = Math.sin(sAngle) * sDist;
          const sSize = 2.5 + Math.sin(elapsed * 6 + s) * 1.5;

          ctx.fillStyle = revealedPower.rarity === 'Legendary' ? '#fef08a' : '#f3e8ff';
          ctx.shadowColor = revealedPower.rarity === 'Legendary' ? '#facc15' : '#c084fc';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(sx, sy, sSize, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // 2. Joyous Bouncing Marble with Golden Crown
      const bounce = Math.abs(Math.sin(elapsed * 4.5)) * 18;

      drawMarbleSkin(ctx, {
        x: cx,
        y: cy - bounce,
        radius,
        color: revealedPower.colorHex,
        element: revealedPower.element,
        powerId: revealedPower.id,
        expression: 'happy',
        crown: isHighTier, // Crown on both Legendary & Epic unlocks!
        time: elapsed
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [revealedPower, hatchStep]);

  // Default to first unhatched egg if available
  const unhatchedEggs = profile.incubatorEggs.filter(e => !e.isHatched);
  const activeEgg = unhatchedEggs.find(e => e.id === selectedEggId) || unhatchedEggs[0] || null;

  const handleEggInteraction = () => {
    if (!activeEgg) {
      setHatchError('No tienes ningún huevo en la incubadora. ¡Gana batallas clasificatorias para conseguir uno!');
      return;
    }

    if (profile.eggTokens < activeEgg.costTokens && hatchStep === 0) {
      setHatchError(`Necesitas ${activeEgg.costTokens} Fragmentos de Huevo. Tienes ${profile.eggTokens}. ¡Gana partidas en el Modo Competitivo para conseguir más!`);
      soundManager.playMarbleClick(0.3);
      return;
    }

    setHatchError(null);

    if (hatchStep === 0) {
      soundManager.playEggTap();
      setHatchStep(1);
    } else if (hatchStep === 1) {
      soundManager.playEggCrack();
      setHatchStep(2);
    } else if (hatchStep === 2) {
      const result = competitiveManager.hatchEgg(activeEgg.id);
      if (!result) {
        setHatchStep(0);
        return;
      }

      setRevealedPower(result.power);
      setIsNewUnlock(result.isNewUnlock);
      setRevealedLevel(result.newLevel);
      setHatchStep(3);

      soundManager.playEggHatchFanfare(result.power.rarity);

      // Dopamine confetti blast: extra explosive for Epic & Legendary!
      const isHighTier = result.power.rarity === 'Legendary' || result.power.rarity === 'Epic';
      confetti({
        particleCount: isHighTier ? 160 : 80,
        spread: isHighTier ? 110 : 70,
        origin: { y: 0.5 },
        colors: [result.power.colorHex, '#f59e0b', '#c084fc', '#38bdf8', '#ffffff']
      });
    }
  };

  const handleResetEgg = () => {
    soundManager.playMarbleClick(0.6);
    setHatchStep(0);
    setRevealedPower(null);
    setSelectedEggId(null);
  };

  const handleBuyEggSlot = (rarity: RarityTier, cost: number) => {
    if (profile.eggTokens < cost) {
      setHatchError(`Necesitas ${cost} Fragmentos. ¡Gana más combates competitivos!`);
      return;
    }
    soundManager.playPowerTrigger('lightning');
    const newEgg: IncubatorEggSlot = {
      id: `egg-bought-${Date.now()}`,
      rarity,
      name: `Huevo ${rarity === 'Legendary' ? 'Legendario' : rarity === 'Epic' ? 'Épico' : rarity === 'Rare' ? 'Raro' : 'Común'} de Tienda`,
      costTokens: cost,
      unlockedAt: Date.now(),
      isHatched: false
    };
    const prof = competitiveManager.getProfile();
    prof.incubatorEggs.push(newEgg);
    competitiveManager.saveProfile();
    setSelectedEggId(newEgg.id);
    setHatchStep(0);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
            <Egg className="w-4 h-4" />
            <span>INCUBADORA DE HUEVOS & PROBABILIDADES GACHA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Incubadora Elemental
          </h1>
        </div>

        {/* Fragment Counter & Tab Toggle */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-950/80 border border-purple-600/70 shadow-inner">
            <Egg className="w-4 h-4 text-purple-300" />
            <span className="text-xs font-bold text-slate-300 uppercase">Fragmentos:</span>
            <span className="text-sm font-black text-purple-200 font-mono">
              {profile.eggTokens}
            </span>
          </div>

          {/* Toggle between Incubator & Probabilities */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-950 border border-slate-800">
            <button
              onClick={() => {
                soundManager.playMarbleClick(0.5);
                setActiveTab('incubator');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'incubator'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🥚 Incubadora
            </button>

            <button
              onClick={() => {
                soundManager.playMarbleClick(0.5);
                setActiveTab('probabilities');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'probabilities'
                  ? 'bg-purple-600 text-white shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Percent className="w-3.5 h-3.5" />
              <span>Probabilidades (Drop Rates)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error / Alert Toast */}
      {hatchError && (
        <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/80 text-rose-200 text-xs font-medium flex items-center justify-between animate-in fade-in">
          <span>{hatchError}</span>
          <button onClick={() => setHatchError(null)} className="text-rose-400 hover:text-white font-bold ml-2">✕</button>
        </div>
      )}

      {/* TAB 1: INCUBATOR INTERACTIVE TOY */}
      {activeTab === 'incubator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (7 Cols): The Incubator Chamber */}
          <div className="lg:col-span-7 p-6 sm:p-10 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[500px] text-center">
            {/* Ambient Background Aura */}
            <div className="absolute inset-0 bg-radial from-purple-500/10 via-transparent to-transparent pointer-events-none" />

            {hatchStep < 3 ? (
              activeEgg ? (
                <div className="space-y-6 flex flex-col items-center relative z-10 w-full max-w-sm">
                  {/* Egg Interactive Silhouette */}
                  <div
                    onClick={handleEggInteraction}
                    className={`relative w-48 h-64 rounded-full cursor-pointer select-none transition-all transform duration-200 ${
                      hatchStep === 0
                        ? 'hover:scale-105 active:scale-95 shadow-2xl shadow-purple-500/20'
                        : hatchStep === 1
                        ? 'animate-bounce shadow-2xl shadow-amber-500/30'
                        : 'animate-pulse scale-110 shadow-2xl shadow-rose-500/40'
                    }`}
                    style={{
                      background: activeEgg.rarity === 'Legendary'
                        ? 'radial-gradient(circle at 35% 30%, #fef08a 0%, #eab308 40%, #ca8a04 70%, #713f12 100%)'
                        : activeEgg.rarity === 'Epic'
                        ? 'radial-gradient(circle at 35% 30%, #f3e8ff 0%, #c084fc 40%, #9333ea 70%, #3b0764 100%)'
                        : activeEgg.rarity === 'Rare'
                        ? 'radial-gradient(circle at 35% 30%, #e0f2fe 0%, #38bdf8 40%, #0284c7 70%, #082f49 100%)'
                        : 'radial-gradient(circle at 35% 30%, #f1f5f9 0%, #94a3b8 40%, #475569 70%, #0f172a 100%)',
                      boxShadow: hatchStep === 2 ? '0 0 50px rgba(245, 158, 11, 0.7)' : undefined
                    }}
                  >
                    {/* Hairline Crack Decals */}
                    {hatchStep >= 1 && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <svg className="w-36 h-36 text-amber-300 drop-shadow-md" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M50 15 L52 35 L45 48 L58 65 L48 85" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M52 35 L68 42" strokeLinecap="round" />
                        </svg>
                      </div>
                    )}

                    {/* Glowing Radiant Beams */}
                    {hatchStep === 2 && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-spin">
                        <div className="w-full h-full bg-gradient-to-r from-transparent via-amber-300/40 to-transparent blur-md" />
                      </div>
                    )}

                    {/* Highlight sheen */}
                    <div className="absolute top-6 left-8 w-12 h-16 rounded-full bg-white/40 blur-xs" />
                  </div>

                  {/* Egg Name & Cost */}
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
                      PASO {hatchStep + 1} DE 3 · {activeEgg.name}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      {hatchStep === 0 && 'Toca para Agrietar la Cáscara'}
                      {hatchStep === 1 && '¡Toca de Nuevo para Cargar de Energía!'}
                      {hatchStep === 2 && '¡TOQUE FINAL: EXPLOSIÓN Y REVELACIÓN!'}
                    </h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      {hatchStep === 0 && `Coste de eclosión: ${activeEgg.costTokens} Fragmentos (Tienes ${profile.eggTokens})`}
                      {hatchStep === 1 && 'Los haces de luz elemental comienzan a filtrarse por las grietas.'}
                      {hatchStep === 2 && '¡Libera la canica y añade su poder a tu equipo competitivo!'}
                    </p>
                  </div>

                  {/* Interaction Button */}
                  <button
                    onClick={handleEggInteraction}
                    className="px-8 py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 shadow-lg shadow-amber-500/25 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    {hatchStep === 0 && `Eclosionar Huevo (${activeEgg.costTokens} Frag.)`}
                    {hatchStep === 1 && 'Hacer Temblar el Huevo (Paso 2)'}
                    {hatchStep === 2 && '¡DESBLOQUEAR CANICA! (Paso 3)'}
                  </button>
                </div>
              ) : (
                /* No Eggs */
                <div className="space-y-4 max-w-sm mx-auto">
                  <div className="w-20 h-20 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto text-slate-600">
                    <Egg className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Incubadora Vacía</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    No tienes ningún huevo en este momento. Juega en el Modo Competitivo para ganar batallas clasificatorias y conseguir nuevos huevos y fragmentos.
                  </p>
                  {onGoToCompetitive && (
                    <button
                      onClick={onGoToCompetitive}
                      className="px-6 py-3 rounded-2xl font-bold text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                    >
                      Luchar en Ranked
                    </button>
                  )}
                </div>
              )
            ) : (
              /* Step 3: Spectacular Reveal Animation for Unlocked Marble */
              revealedPower && (
                <div className="space-y-4 flex flex-col items-center animate-in zoom-in duration-300 w-full max-w-lg relative z-10">
                  {/* High Tier Celebration Aura (Legendary / Epic) */}
                  {(revealedPower.rarity === 'Legendary' || revealedPower.rarity === 'Epic') && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-tr from-amber-500/30 via-purple-500/25 to-transparent rounded-full blur-3xl animate-spin pointer-events-none" />
                  )}

                  {/* Rarity Header Badge */}
                  <div className="relative z-10 flex items-center justify-center gap-1.5 w-full">
                    {revealedPower.rarity === 'Legendary' ? (
                      <div className="text-center space-y-1">
                        <span className="text-xs sm:text-sm font-black font-mono text-amber-300 uppercase tracking-widest bg-gradient-to-r from-amber-500/40 via-yellow-400/30 to-amber-500/40 px-5 py-2 rounded-full border-2 border-amber-400 shadow-2xl shadow-amber-500/40 flex items-center justify-center gap-2 animate-bounce">
                          <Crown className="w-5 h-5 fill-amber-400 text-amber-400" />
                          <span>👑 ¡¡¡CANICA LEGENDARIA DESBLOQUEADA!!! 👑</span>
                        </span>
                        <span className="text-[11px] font-mono text-amber-300 font-bold block">
                          1.25% Drop Rate · ¡Una de las más OP de todo el juego!
                        </span>
                      </div>
                    ) : revealedPower.rarity === 'Epic' ? (
                      <div className="text-center space-y-1">
                        <span className="text-xs sm:text-sm font-black font-mono text-purple-300 uppercase tracking-widest bg-gradient-to-r from-purple-500/40 via-fuchsia-400/30 to-purple-500/40 px-5 py-2 rounded-full border-2 border-purple-400 shadow-2xl shadow-purple-500/40 flex items-center justify-center gap-2 animate-pulse">
                          <Zap className="w-5 h-5 text-purple-300 fill-purple-300" />
                          <span>⚡ ¡¡¡CANICA ÉPICA DESBLOQUEADA!!! ⚡</span>
                        </span>
                        <span className="text-[11px] font-mono text-purple-300 font-bold block">
                          3.00% Drop Rate · ¡Poder y Habilidad Superior!
                        </span>
                      </div>
                    ) : revealedPower.rarity === 'Rare' ? (
                      <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest bg-cyan-500/20 px-4 py-1.5 rounded-full border border-cyan-400 shadow-md">
                        💎 ¡CANICA RARA DESBLOQUEADA! (5.00% Drop Rate)
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest bg-slate-800 px-4 py-1.5 rounded-full border border-slate-700">
                        {isNewUnlock ? '★ ¡NUEVA CANICA DESBLOQUEADA! ★' : '🔄 ¡COPIA REPETIDA PARA FUSIÓN! 🔄'}
                      </span>
                    )}
                  </div>

                  {!isNewUnlock && (
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-950/90 via-slate-900 to-purple-950/90 border border-purple-500/70 text-purple-200 text-xs font-bold flex flex-col sm:flex-row items-center justify-between gap-3 w-full shadow-lg">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-400 shrink-0 animate-spin duration-3000" />
                        <div>
                          <span>¡Copia repetida lista para evolucionar!</span>
                          <span className="font-mono text-[11px] text-purple-300 font-normal block">
                            Tienes {profile.marbleDuplicates[revealedPower.id] || 1} copia(s) disponibles para subirla a Nivel {(profile.marbleLevels[revealedPower.id] || 1) + 1}.
                          </span>
                        </div>
                      </div>
                      {onGoToFusion && (
                        <button
                          onClick={onGoToFusion}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-slate-950 font-black text-xs shrink-0 cursor-pointer shadow-md transition-all hover:scale-105"
                        >
                          Ir a Fusión
                        </button>
                      )}
                    </div>
                  )}

                  {/* Animated Marble Canvas Showcase */}
                  <div className="relative">
                    <canvas
                      ref={celebrationCanvasRef}
                      width={280}
                      height={200}
                      className="mx-auto drop-shadow-2xl"
                    />
                  </div>

                  {/* Details Card & Stats */}
                  <div className="space-y-3 relative z-10 w-full bg-slate-950/70 p-4 rounded-3xl border border-slate-800">
                    <div className="text-center space-y-0.5">
                      <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        {getPowerDisplayName(revealedPower, currentLang)}
                      </h2>
                      <span className="text-xs font-mono font-bold text-amber-400 block">
                        Elemento: {revealedPower.element} · Rareza: {revealedPower.rarity} · Maestría Nivel {revealedLevel}
                      </span>
                    </div>

                    {/* Force Points & Combat Attributes Breakdown */}
                    <div className="grid grid-cols-3 gap-2 text-center font-mono">
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">💥 Fuerza Daño</span>
                        <span className="font-black text-amber-400 text-xs sm:text-sm">{revealedPower.damageValue} PTS</span>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">⚡ Empuje</span>
                        <span className="font-black text-cyan-400 text-xs sm:text-sm">x{revealedPower.knockbackMultiplier}</span>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">⏱️ Recarga</span>
                        <span className="font-black text-purple-400 text-xs sm:text-sm">{revealedPower.cooldownSeconds}s</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-left">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                        Habilidad: {revealedPower.name}
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {revealedPower.combatImpact}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 relative z-10 w-full">
                    <button
                      onClick={handleResetEgg}
                      className="w-full sm:w-auto px-5 py-3 rounded-2xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                    >
                      Incubar Otro Huevo
                    </button>
                    {onGoToCompetitive && (
                      <button
                        onClick={() => {
                          soundManager.playHeavyImpact(1.2);
                          competitiveManager.setSelectedMarble(revealedPower.id);
                          onGoToCompetitive();
                        }}
                        className="w-full sm:w-auto px-7 py-3 rounded-2xl font-black text-xs bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-xl shadow-amber-500/30 transition-all cursor-pointer transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Swords className="w-4 h-4" />
                        <span>¡EQUIPAR Y LUCHAR EN COMPETITIVO!</span>
                      </button>
                    )}
                  </div>
                </div>
              )
            )}
          </div>

          {/* Right Column (5 Cols): Egg Queue & Fragment Exchange */}
          <div className="lg:col-span-5 space-y-4">
            {/* Egg Slots Queue */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Egg className="w-4 h-4 text-purple-400" />
                  Huevos en Cola ({unhatchedEggs.length}/4)
                </span>
                <span className="text-[10px] text-purple-400 font-mono font-bold">
                  {profile.eggTokens} Frag. disponibles
                </span>
              </div>

              <div className="space-y-2">
                {unhatchedEggs.length > 0 ? (
                  unhatchedEggs.map((egg) => {
                    const isSelected = activeEgg && activeEgg.id === egg.id;
                    const canAfford = profile.eggTokens >= egg.costTokens;

                    return (
                      <div
                        key={egg.id}
                        onClick={() => {
                          soundManager.playMarbleClick(0.5);
                          setSelectedEggId(egg.id);
                          setHatchStep(0);
                        }}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-slate-800 border-amber-400 shadow-md ring-1 ring-amber-400/40'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm"
                            style={{
                              background: egg.rarity === 'Legendary'
                                ? '#eab308'
                                : egg.rarity === 'Epic'
                                ? '#a855f7'
                                : egg.rarity === 'Rare'
                                ? '#0284c7'
                                : '#64748b'
                            }}
                          >
                            <Egg className="w-5 h-5 text-slate-950" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white">{egg.name}</h4>
                            <span className="text-[10px] font-mono text-slate-400">
                              Rareza: {egg.rarity}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`text-xs font-mono font-bold block ${canAfford ? 'text-emerald-400' : 'text-slate-500'}`}>
                            {egg.costTokens} Frag.
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">
                            {canAfford ? '¡Listo para abrir!' : 'Faltan fragmentos'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400">
                    No hay huevos en cola. Gana combates en Modo Competitivo para recibir más.
                  </div>
                )}
              </div>
            </div>

            {/* Quick Token Exchange Store */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-300 block flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                Comprar Huevo con Fragmentos de Victoria
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => handleBuyEggSlot('Common', 80)}
                  disabled={profile.eggTokens < 80 || unhatchedEggs.length >= 4}
                  className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 disabled:opacity-40 text-left transition-all cursor-pointer"
                >
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>Huevo Común</span>
                    <span className="text-amber-400 font-mono">80 Frag.</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block pt-0.5">Glaciación, Vórtice, Veneno...</span>
                </button>

                <button
                  onClick={() => handleBuyEggSlot('Rare', 150)}
                  disabled={profile.eggTokens < 150 || unhatchedEggs.length >= 4}
                  className="p-3 rounded-2xl bg-slate-950 border border-cyan-900/50 hover:border-cyan-700 disabled:opacity-40 text-left transition-all cursor-pointer"
                >
                  <div className="font-bold text-cyan-300 flex items-center justify-between">
                    <span>Huevo Raro</span>
                    <span className="text-cyan-400 font-mono">150 Frag.</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block pt-0.5">Supernova, Terremoto, Escudo...</span>
                </button>

                <button
                  onClick={() => handleBuyEggSlot('Epic', 250)}
                  disabled={profile.eggTokens < 250 || unhatchedEggs.length >= 4}
                  className="p-3 rounded-2xl bg-slate-950 border border-purple-900/50 hover:border-purple-700 disabled:opacity-40 text-left transition-all cursor-pointer"
                >
                  <div className="font-bold text-purple-300 flex items-center justify-between">
                    <span>Huevo Épico</span>
                    <span className="text-purple-400 font-mono">250 Frag.</span>
                  </div>
                  <span className="text-[10px] text-purple-300 block pt-0.5">Rayo, Titán Chonk, Clones...</span>
                </button>

                <button
                  onClick={() => handleBuyEggSlot('Legendary', 400)}
                  disabled={profile.eggTokens < 400 || unhatchedEggs.length >= 4}
                  className="p-3 rounded-2xl bg-slate-950 border border-amber-900/50 hover:border-amber-700 disabled:opacity-40 text-left transition-all cursor-pointer"
                >
                  <div className="font-bold text-amber-300 flex items-center justify-between">
                    <span>Huevo Legendario</span>
                    <span className="text-amber-400 font-mono">400 Frag.</span>
                  </div>
                  <span className="text-[10px] text-amber-300 block pt-0.5">¡Agujero Negro, Nuke, Anvil! (OP)</span>
                </button>
              </div>
            </div>
          </div>

          {/* INLINE PROBABILITY TABLE & DROP RATES IN INCUBATOR */}
          <div className="lg:col-span-12 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <Percent className="w-5 h-5 text-purple-400" />
                  <span>Probabilidades de Canicas en la Incubadora (Drop Rates)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Las canicas más OP son las más difíciles de conseguir. Desbloquéalas en la incubadora para usarlas en el Modo Competitivo Ranked.
                </p>
              </div>

              {/* Rarity Overview Badges */}
              <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono font-bold">
                <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  👑 Legendario: 5% (1.25% c/u · OP)
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  ⚡ Épico: 15% (3.0% c/u)
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  💎 Raro: 30% (5.0% c/u)
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
                  🛡️ Común: 50% (10.0% c/u)
                </span>
              </div>
            </div>

            {/* Compact 4-column Roster View */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* 1. Legendarias (Las más OP!) */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-amber-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Crown className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>Legendarias (OP)</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded">
                    1.25% c/u
                  </span>
                </div>
                <div className="space-y-1.5">
                  {MARBLE_POWERS.filter(p => p.rarity === 'Legendary').map(p => {
                    const isUnlocked = profile.unlockedMarbleIds.includes(p.id);
                    return (
                      <div key={p.id} className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs" style={{ background: p.colorHex }} />
                          <span className="font-bold text-white truncate text-[11px]">{getPowerDisplayName(p, currentLang)}</span>
                        </div>
                        <span className={`text-[10px] font-mono shrink-0 ml-1 ${isUnlocked ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                          {isUnlocked ? '✓ Obtenida' : '1.25%'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Épicas */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-purple-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span>Épicas</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-500/10 px-1.5 py-0.5 rounded">
                    3.00% c/u
                  </span>
                </div>
                <div className="space-y-1.5">
                  {MARBLE_POWERS.filter(p => p.rarity === 'Epic').map(p => {
                    const isUnlocked = profile.unlockedMarbleIds.includes(p.id);
                    return (
                      <div key={p.id} className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs" style={{ background: p.colorHex }} />
                          <span className="font-bold text-white truncate text-[11px]">{getPowerDisplayName(p, currentLang)}</span>
                        </div>
                        <span className={`text-[10px] font-mono shrink-0 ml-1 ${isUnlocked ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                          {isUnlocked ? '✓ Obtenida' : '3.00%'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Raras */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-cyan-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span>Raras</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded">
                    5.00% c/u
                  </span>
                </div>
                <div className="space-y-1.5">
                  {MARBLE_POWERS.filter(p => p.rarity === 'Rare').map(p => {
                    const isUnlocked = profile.unlockedMarbleIds.includes(p.id);
                    return (
                      <div key={p.id} className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs" style={{ background: p.colorHex }} />
                          <span className="font-bold text-white truncate text-[11px]">{getPowerDisplayName(p, currentLang)}</span>
                        </div>
                        <span className={`text-[10px] font-mono shrink-0 ml-1 ${isUnlocked ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                          {isUnlocked ? '✓ Obtenida' : '5.00%'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Comunes */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-700/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-slate-400" />
                    <span>Comunes</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">
                    10.00% c/u
                  </span>
                </div>
                <div className="space-y-1.5">
                  {MARBLE_POWERS.filter(p => p.rarity === 'Common').map(p => {
                    const isUnlocked = profile.unlockedMarbleIds.includes(p.id);
                    return (
                      <div key={p.id} className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs" style={{ background: p.colorHex }} />
                          <span className="font-bold text-white truncate text-[11px]">{getPowerDisplayName(p, currentLang)}</span>
                        </div>
                        <span className={`text-[10px] font-mono shrink-0 ml-1 ${isUnlocked ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                          {isUnlocked ? '✓ Obtenida' : '10.0%'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROBABILITY & DROP RATES TABLE */}
      {activeTab === 'probabilities' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Percent className="w-5 h-5 text-purple-400" />
                <span>Probabilidades de Obtención en la Incubadora</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Todas las 20 canicas tienen su probabilidad exacta asignada según su rareza y nivel de impacto en combate competitivo.
              </p>
            </div>

            {/* Rarity Summary Badges */}
            <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono font-bold">
              <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
                👑 Legendario: 5.0%
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
                ⚡ Épico: 15.0%
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                💎 Raro: 30.0%
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
                🛡️ Común: 50.0%
              </span>
            </div>
          </div>

          {/* Roster Grid by Rarity */}
          <div className="space-y-6">
            {/* 1. LEGENDARY TIER (Las más OP!) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Crown className="w-4 h-4 fill-amber-400" />
                  <span>TIER LEGENDARIO · LAS MÁS OP (5.00% TOTAL · 1.25% CADA UNA)</span>
                </h3>
                <span className="text-[10px] font-mono text-amber-300 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                  Dificultad Máxima
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {MARBLE_POWERS.filter(p => p.rarity === 'Legendary').map(power => {
                  const isUnlocked = profile.unlockedMarbleIds.includes(power.id);
                  return (
                    <div
                      key={power.id}
                      className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/40 shadow-lg shadow-amber-500/5 flex items-center justify-between gap-3 relative overflow-hidden"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center font-bold text-xs shadow-md border-2 border-amber-400"
                          style={{
                            background: `radial-gradient(circle at 35% 30%, #ffffff 0%, ${power.colorHex} 60%, #020617 100%)`,
                            boxShadow: `0 0 16px ${power.colorHex}80`
                          }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-white">{getPowerDisplayName(power, currentLang)}</h4>
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              OP
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 block line-clamp-1">
                            {power.combatImpact}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-black font-mono text-amber-400 block">
                          {power.dropRatePercent?.toFixed(2)}%
                        </span>
                        <span className={`text-[10px] font-mono font-bold ${isUnlocked ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {isUnlocked ? '✓ Desbloqueada' : '🔒 Bloqueada'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. EPIC TIER */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-purple-400 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span>TIER ÉPICO (15.00% TOTAL · 3.00% CADA UNA)</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {MARBLE_POWERS.filter(p => p.rarity === 'Epic').map(power => {
                  const isUnlocked = profile.unlockedMarbleIds.includes(power.id);
                  return (
                    <div
                      key={power.id}
                      className="p-3 rounded-2xl bg-slate-950 border border-purple-500/30 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center font-bold text-xs shadow-sm border border-purple-400"
                          style={{
                            background: `radial-gradient(circle at 35% 30%, #ffffff 0%, ${power.colorHex} 60%, #020617 100%)`
                          }}
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{getPowerDisplayName(power, currentLang)}</h4>
                          <span className="text-[10px] text-purple-400 font-mono">{power.element}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-black font-mono text-purple-300 block">
                          {power.dropRatePercent?.toFixed(2)}%
                        </span>
                        <span className={`text-[9px] font-mono ${isUnlocked ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {isUnlocked ? '✓ Obtenida' : '🔒 Bloqueada'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. RARE TIER */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>TIER RARO (30.00% TOTAL · 5.00% CADA UNA)</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {MARBLE_POWERS.filter(p => p.rarity === 'Rare').map(power => {
                  const isUnlocked = profile.unlockedMarbleIds.includes(power.id);
                  return (
                    <div
                      key={power.id}
                      className="p-3 rounded-2xl bg-slate-950 border border-cyan-500/30 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center font-bold text-xs shadow-sm border border-cyan-400"
                          style={{
                            background: `radial-gradient(circle at 35% 30%, #ffffff 0%, ${power.colorHex} 60%, #020617 100%)`
                          }}
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{getPowerDisplayName(power, currentLang)}</h4>
                          <span className="text-[10px] text-cyan-400 font-mono">{power.element}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-black font-mono text-cyan-300 block">
                          {power.dropRatePercent?.toFixed(2)}%
                        </span>
                        <span className={`text-[9px] font-mono ${isUnlocked ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {isUnlocked ? '✓ Obtenida' : '🔒 Bloqueada'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. COMMON TIER */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Star className="w-4 h-4 text-slate-400" />
                  <span>TIER COMÚN (50.00% TOTAL · 10.00% CADA UNA)</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {MARBLE_POWERS.filter(p => p.rarity === 'Common').map(power => {
                  const isUnlocked = profile.unlockedMarbleIds.includes(power.id);
                  return (
                    <div
                      key={power.id}
                      className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center font-bold text-xs shadow-sm"
                          style={{
                            background: `radial-gradient(circle at 35% 30%, #ffffff 0%, ${power.colorHex} 60%, #020617 100%)`
                          }}
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{getPowerDisplayName(power, currentLang)}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">{power.element}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-black font-mono text-slate-300 block">
                          {power.dropRatePercent?.toFixed(2)}%
                        </span>
                        <span className={`text-[9px] font-mono ${isUnlocked ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {isUnlocked ? '✓ Obtenida' : '🔒 Bloqueada'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
