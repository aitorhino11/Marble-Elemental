import React, { useState, useEffect, useRef } from 'react';
import { MARBLE_POWERS, getPowerDisplayName, getRarityTextColor, getRarityTextClass } from '../data/powersData';
import { MarblePower } from '../types/game';
import { competitiveManager } from '../utils/competitiveManager';
import { soundManager } from '../utils/audioSystem';
import { drawMarbleSkin } from '../utils/marbleSkinRenderer';
import { SupportedLanguage } from '../i18n/translations';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Layers, 
  ArrowRight, 
  Flame, 
  Shield, 
  Zap, 
  CheckCircle, 
  AlertCircle,
  Egg,
  Crown,
  Heart,
  Swords,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

interface FusionMenuViewProps {
  onGoToIncubator?: () => void;
  currentLang?: SupportedLanguage;
}

export const FusionMenuView: React.FC<FusionMenuViewProps> = ({
  onGoToIncubator,
  currentLang = 'es'
}) => {
  const [profile, setProfile] = useState(() => competitiveManager.getProfile());
  const [filterMode, setFilterMode] = useState<'all' | 'ready'>('all');

  // Cinematic Modal State
  const [fusingPower, setFusingPower] = useState<MarblePower | null>(null);
  const [fusionStage, setFusionStage] = useState<'charging' | 'colliding' | 'ascending' | null>(null);
  const [newLevelResult, setNewLevelResult] = useState<number>(1);
  const cinematicCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    return competitiveManager.subscribe(() => {
      setProfile(competitiveManager.getProfile());
    });
  }, []);

  const unlockedPowers = MARBLE_POWERS.filter(p => profile.unlockedMarbleIds.includes(p.id));
  const readyToFusePowers = unlockedPowers.filter(p => (profile.marbleDuplicates[p.id] || 0) >= 1);

  const displayedPowers = filterMode === 'ready' ? readyToFusePowers : unlockedPowers;

  // Trigger Fusion Evolution Sequence
  const handleStartFusion = (power: MarblePower) => {
    const availableCopies = profile.marbleDuplicates[power.id] || 0;
    if (availableCopies < 1) return;

    const result = competitiveManager.fuseMarble(power.id);
    if (!result.success) return;

    setFusingPower(power);
    setNewLevelResult(result.newLevel);
    setFusionStage('charging');
    soundManager.playPowerTrigger(power.element);

    // Timeline for cinematic evolution
    // Stage 1: Charging (0 - 1500ms)
    setTimeout(() => {
      setFusionStage('colliding');
      soundManager.playMarbleHitSound(power.id, 1.8);
      soundManager.playHeavyImpact(1.4);
    }, 1500);

    // Stage 2: Ascending (2200ms)
    setTimeout(() => {
      setFusionStage('ascending');
      soundManager.playFusionAscension();

      // Confetti celebration
      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.5 },
        colors: [power.colorHex, '#facc15', '#a855f7', '#38bdf8', '#ffffff']
      });
    }, 2200);
  };

  // Cinematic Canvas 60FPS loop
  useEffect(() => {
    if (!fusingPower || !fusionStage) return;
    const canvas = cinematicCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const startTime = performance.now();

    const loop = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = 48;

      if (fusionStage === 'charging') {
        // Charging phase: Two duplicate orbs approach from opposite sides with smooth easing
        const progress = Math.min(1.0, elapsed / 1.5);
        const ease = progress * progress;
        const dist = 140 * (1 - ease) + 30;

        // Energy beam connecting them
        ctx.strokeStyle = fusingPower.colorHex;
        ctx.lineWidth = 4 + Math.sin(elapsed * 12) * 2;
        ctx.shadowColor = fusingPower.colorHex;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.moveTo(cx - dist, cy);
        ctx.lineTo(cx + dist, cy);
        ctx.stroke();

        // Left orb
        drawMarbleSkin(ctx, {
          x: cx - dist,
          y: cy,
          radius,
          color: fusingPower.colorHex,
          element: fusingPower.element,
          powerId: fusingPower.id,
          expression: 'battle',
          crown: false,
          time: elapsed
        });

        // Right orb (duplicate)
        drawMarbleSkin(ctx, {
          x: cx + dist,
          y: cy,
          radius,
          color: fusingPower.colorHex,
          element: fusingPower.element,
          powerId: fusingPower.id,
          expression: 'battle',
          crown: false,
          time: elapsed
        });

        // Swirling vortex energy particles
        for (let p = 0; p < 16; p++) {
          const pa = (p / 16) * Math.PI * 2 + elapsed * 5;
          const pr = (32 + Math.sin(elapsed * 6 + p) * 22) * (1 - progress * 0.4);
          ctx.fillStyle = p % 2 === 0 ? '#facc15' : fusingPower.colorHex;
          ctx.beginPath();
          ctx.arc(cx + Math.cos(pa) * pr, cy + Math.sin(pa) * (pr * 0.5), 3, 0, Math.PI * 2);
          ctx.fill();
        }

      } else if (fusionStage === 'colliding') {
        // Intense collision flash and expanding shockwave ring
        const colElapsed = Math.max(0, elapsed - 1.5);
        const flashAlpha = Math.max(0, 1 - colElapsed * 2.5);
        ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha * 0.95})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Multiple expanding shockwave rings
        const ringRadius = colElapsed * 260;
        ctx.strokeStyle = fusingPower.colorHex;
        ctx.lineWidth = Math.max(1, 8 - colElapsed * 8);
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Secondary gold shockwave
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx, cy, ringRadius * 0.7, 0, Math.PI * 2);
        ctx.stroke();

        // Shimmering explosion sparks
        for (let s = 0; s < 14; s++) {
          const sa = (s / 14) * Math.PI * 2;
          const spDist = ringRadius * 0.85;
          ctx.fillStyle = s % 2 === 0 ? '#ffffff' : '#fde047';
          ctx.beginPath();
          ctx.arc(cx + Math.cos(sa) * spDist, cy + Math.sin(sa) * spDist, 4, 0, Math.PI * 2);
          ctx.fill();
        }

      } else if (fusionStage === 'ascending') {
        // Ascended evolved marble floating smoothly in golden radiance
        const ascElapsed = Math.max(0, elapsed - 2.2);
        const bob = Math.sin(ascElapsed * 3) * 6;

        // Soft celestial background radial glow
        const glowGrad = ctx.createRadialGradient(cx, cy + bob, 10, cx, cy + bob, 120);
        glowGrad.addColorStop(0, 'rgba(250, 204, 21, 0.45)');
        glowGrad.addColorStop(0.5, `${fusingPower.colorHex}25`);
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(cx, cy + bob, 120, 0, Math.PI * 2);
        ctx.fill();

        // Rotating golden light rays with soft edges
        ctx.save();
        ctx.translate(cx, cy + bob);
        ctx.rotate(ascElapsed * 0.6);
        for (let r = 0; r < 8; r++) {
          const ra = (r / 8) * Math.PI * 2;
          ctx.fillStyle = 'rgba(251, 191, 36, 0.14)';
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.arc(0, 0, 140, ra - 0.12, ra + 0.12);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();

        // Floating sparkles rising like celestial embers
        for (let e = 0; e < 12; e++) {
          const ey = cy + 40 - ((ascElapsed * 45 + e * 18) % 90);
          const ex = cx + Math.sin(e * 1.7 + ascElapsed * 2) * (radius * 1.1);
          const sparkAlpha = Math.sin(((cy + 40 - ey) / 90) * Math.PI);
          ctx.fillStyle = `rgba(253, 224, 71, ${Math.max(0, sparkAlpha)})`;
          ctx.beginPath();
          ctx.arc(ex, ey, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Ascended Marble with Crown and Sparkles
        drawMarbleSkin(ctx, {
          x: cx,
          y: cy + bob,
          radius: radius * 1.15,
          color: fusingPower.colorHex,
          element: fusingPower.element,
          powerId: fusingPower.id,
          expression: 'happy',
          crown: true,
          time: ascElapsed
        });
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [fusingPower, fusionStage]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>ALTAR DE FUSIÓN & EVOLUCIÓN</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Fusión de Canicas
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            Las canicas repetidas que obtengas al incubar huevos no se pierden: ¡fusiónalas con su gemela para aumentar su Nivel de Maestría, ganar más vida máxima y multiplicar su poder de combate!
          </p>
        </div>

        {/* Action / Counter */}
        <div className="flex items-center flex-wrap gap-3 relative z-10">
          <div className="px-4 py-2.5 rounded-2xl bg-slate-950/80 border border-slate-700/80 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Listas para Fusión</span>
              <span className="text-base font-black text-amber-400 font-mono">
                {readyToFusePowers.length} Canicas
              </span>
            </div>
          </div>

          {onGoToIncubator && (
            <button
              onClick={onGoToIncubator}
              className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Egg className="w-4 h-4" />
              <span>Conseguir Huevos</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => {
            soundManager.playMarbleClick(0.5);
            setFilterMode('all');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filterMode === 'all'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <span>Todas Desbloqueadas ({unlockedPowers.length})</span>
        </button>

        <button
          onClick={() => {
            soundManager.playMarbleClick(0.5);
            setFilterMode('ready');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filterMode === 'ready'
              ? 'bg-gradient-to-r from-purple-500 to-rose-500 text-white shadow-md shadow-purple-500/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Disponibles para Fusionar ({readyToFusePowers.length})</span>
        </button>
      </div>

      {/* Marbles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayedPowers.map((power) => {
          const currentLevel = profile.marbleLevels[power.id] || 1;
          const copies = profile.marbleDuplicates[power.id] || 0;
          const canFuse = copies >= 1;
          const nextLevel = currentLevel + 1;

          return (
            <div
              key={power.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between relative overflow-hidden ${
                canFuse
                  ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-purple-500/60 shadow-xl shadow-purple-500/10 hover:border-amber-400'
                  : 'bg-slate-900/60 border-slate-800/80 opacity-90'
              }`}
            >
              {canFuse && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/20 via-purple-500/10 to-transparent rounded-full blur-xl pointer-events-none" />
              )}

              <div className="space-y-3">
                {/* Header: Level & Rarity */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[11px] font-mono font-bold uppercase ${getRarityTextColor(power.rarity)}`}>
                    {power.rarity} · {power.element}
                  </span>
                  <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-xs font-black">
                    <Crown className="w-3 h-3 text-amber-400" />
                    <span>NIVEL {currentLevel}</span>
                  </div>
                </div>

                {/* Marble Visual Avatar */}
                <div className="w-24 h-24 mx-auto relative flex items-center justify-center">
                  <div
                    className="w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110"
                    style={{
                      background: `radial-gradient(circle at 35% 35%, #ffffff 0%, ${power.colorHex} 65%, #000000 100%)`,
                      boxShadow: `0 0 25px ${power.colorHex}60`
                    }}
                  >
                    <span className="text-xl">✨</span>
                  </div>
                </div>

                {/* Marble Name */}
                <div className="text-center">
                  <h3 className="text-base font-black text-white tracking-tight">
                    {getPowerDisplayName(power, currentLang)}
                  </h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                    {power.combatImpact}
                  </p>
                </div>

                {/* Copies Counter Bar */}
                <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Copias repetidas:</span>
                    <span className={`font-black ${canFuse ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {copies} / 1 requerida
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        canFuse ? 'bg-gradient-to-r from-emerald-500 to-amber-400 w-full' : 'w-0'
                      }`}
                    />
                  </div>
                </div>

                {/* Level Up Stats Preview */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Vida Extra</span>
                    <span className="font-bold text-emerald-400">
                      +{Math.min(25, (currentLevel - 1) * 5)}% HP
                    </span>
                    <span className="text-[9px] text-slate-400 block">+5% por nivel</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Ataque Extra</span>
                    <span className="font-bold text-amber-400">
                      +{Math.min(25, (currentLevel - 1) * 5)}% Daño
                    </span>
                    <span className="text-[9px] text-slate-400 block">+5% por nivel</span>
                  </div>
                </div>
              </div>

              {/* Fusion Button */}
              <div className="pt-4">
                {canFuse ? (
                  <button
                    onClick={() => handleStartFusion(power)}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-purple-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 fill-slate-950" />
                    <span>¡FUSIONAR A NIVEL {nextLevel}!</span>
                  </button>
                ) : (
                  <div className="w-full py-2.5 px-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-600 font-bold text-xs text-center font-mono">
                    Necesitas otra canica repetida
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {displayedPowers.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 max-w-md mx-auto space-y-3">
          <Layers className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No hay canicas listas para fusionar</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Consigue huevos en combates competitivos o en la tienda para eclosionar canicas repetidas y fusionarlas aquí.
          </p>
          {onGoToIncubator && (
            <button
              onClick={onGoToIncubator}
              className="mt-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Ir a la Incubadora
            </button>
          )}
        </div>
      )}

      {/* Spectacular Fullscreen Cinematic Fusion Modal */}
      {fusingPower && fusionStage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg p-6 sm:p-8 bg-slate-900 border-2 border-amber-400/80 rounded-3xl shadow-2xl shadow-amber-500/20 text-center space-y-6 flex flex-col items-center">
            {/* Stage Title */}
            <div className="space-y-1">
              <span className="text-xs font-mono font-black text-amber-400 uppercase tracking-widest block">
                {fusionStage === 'charging' && '⚡ CANALIZANDO ESENCIA DUPLICADA... ⚡'}
                {fusionStage === 'colliding' && '💥 ¡COLISIÓN ELEMENTAL! 💥'}
                {fusionStage === 'ascending' && '✨ ¡ASCENSIÓN ELEMENTAL COMPLETADA! ✨'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {getPowerDisplayName(fusingPower, currentLang)}
              </h2>
            </div>

            {/* 60FPS Cinematic Canvas Stage */}
            <div className="relative w-full flex items-center justify-center">
              <canvas
                ref={cinematicCanvasRef}
                width={360}
                height={220}
                className="drop-shadow-[0_0_50px_rgba(245,158,11,0.4)]"
              />
            </div>

            {/* Evolved Stats Showcase (Visible upon ascension) */}
            {fusionStage === 'ascending' && (
              <div className="w-full space-y-4 animate-in zoom-in duration-300">
                <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-400/40 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-amber-300 font-mono font-black text-sm">
                    <Crown className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>¡MAESTRÍA NIVEL {newLevelResult} / 6 ALCANZADA!</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-1">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Vida Mejorada</span>
                      <span className="font-black text-emerald-400 text-sm">
                        +{Math.min(25, (newLevelResult - 1) * 5)}% HP
                      </span>
                      <span className="text-[9px] text-slate-400 block">+5% por nivel (Máx 6)</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Ataque Mejorado</span>
                      <span className="font-black text-amber-400 text-sm">
                        +{Math.min(25, (newLevelResult - 1) * 5)}% Daño
                      </span>
                      <span className="text-[9px] text-slate-400 block">+5% por nivel (Máx 6)</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundManager.playMarbleClick(0.6);
                    setFusingPower(null);
                    setFusionStage(null);
                  }}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/25 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  ¡CONTINUAR!
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
