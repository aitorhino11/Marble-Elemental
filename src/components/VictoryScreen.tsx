import React, { useState, useEffect, useRef } from 'react';
import { MarbleEntity, MarblePower } from '../types/game';
import { soundManager } from '../utils/audioSystem';
import { SupportedLanguage, TRANSLATIONS } from '../i18n/translations';
import { getPowerDisplayName } from '../data/powersData';
import { IncubatorEggSlot } from '../types/competitive';
import { competitiveManager } from '../utils/competitiveManager';
import { drawMarbleSkin } from '../utils/marbleSkinRenderer';
import { drawSpecificVictoryAnimation, drawSpecificDefeatAnimation } from '../utils/victoryAnimations';
import { 
  Trophy, 
  RotateCcw, 
  Home, 
  Sparkles, 
  Crown,
  Egg,
  ShieldAlert,
  Swords,
  ArrowLeft,
  Volume2,
  Tv
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VictoryScreenProps {
  winner: MarbleEntity;
  playerMarblePower?: MarblePower | null;
  onRematch: () => void;
  onBackToMenu: () => void;
  onBackToCompetitive?: () => void;
  currentLang: SupportedLanguage;
  isCompetitive?: boolean;
  competitiveResult?: {
    isVictory: boolean;
    eloDiff: number;
    tokens: number;
    egg: IncubatorEggSlot | null;
  } | null;
  onGoToIncubator?: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  winner,
  playerMarblePower,
  onRematch,
  onBackToMenu,
  onBackToCompetitive,
  currentLang,
  isCompetitive = false,
  competitiveResult = null,
  onGoToIncubator
}) => {
  const t = TRANSLATIONS[currentLang];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasClaimedAd, setHasClaimedAd] = useState<boolean>(false);

  const handleWatchAdForFragments = () => {
    if (hasClaimedAd) return;
    try {
      window.open('https://araplhn.org/4/05bd2d5bed83d63f594834da827fc1cb', '_blank');
    } catch (e) {
      console.error('Error opening smartlink ad:', e);
    }
    competitiveManager.addEggTokens(45);
    setHasClaimedAd(true);
    soundManager.playEggHatchFanfare('Rare');
  };

  // Determine if the player won or lost
  const isPlayerWin = isCompetitive 
    ? Boolean(competitiveResult && competitiveResult.isVictory)
    : true;

  // The marble shown in the animation: in competitive, show player's marble with crown if won, or crying if lost!
  const showcasePower = isCompetitive && playerMarblePower ? playerMarblePower : winner.power;
  const showcaseColor = isCompetitive && playerMarblePower ? playerMarblePower.colorHex : winner.color;

  // Sound and confetti celebration effects
  useEffect(() => {
    if (isPlayerWin) {
      soundManager.playEggHatchFanfare('Mythic');

      // Continuous celebratory confetti cannons
      const end = Date.now() + 3.2 * 1000;
      const colors = [showcaseColor, '#f59e0b', '#38bdf8', '#10b981', '#ffffff'];

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.7 },
          colors
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.7 },
          colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    } else {
      // Defeat heavy impact and sad audio cue
      soundManager.playHeavyImpact(0.85);
    }
  }, [isPlayerWin, showcaseColor]);

  // 60FPS Animation Loop for the Animated Marble (Crown + Jumps for Victory, Streaming Tears for Defeat)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let startTime = performance.now();

    const loop = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const baseCy = canvas.height / 2 + 10;
      const radius = 55;

      if (isPlayerWin) {
        // UNIQUE WINNER ANIMATION FOR EACH INDIVIDUAL MARBLE
        drawSpecificVictoryAnimation({
          ctx,
          cx,
          baseCy,
          radius,
          color: showcaseColor,
          element: showcasePower.element,
          powerId: showcasePower.id,
          elapsed
        });
      } else {
        // UNIQUE DEFEAT ANIMATION FOR EACH INDIVIDUAL MARBLE
        drawSpecificDefeatAnimation({
          ctx,
          cx,
          baseCy,
          radius,
          color: showcaseColor,
          element: showcasePower.element,
          powerId: showcasePower.id,
          elapsed
        });
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlayerWin, showcaseColor, showcasePower]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/92 backdrop-blur-xl animate-in zoom-in-95 duration-200">
      <div className={`relative w-full max-w-xl bg-slate-900/95 border-2 ${
        isPlayerWin ? 'border-amber-500/60 shadow-[0_0_90px_rgba(245,158,11,0.3)]' : 'border-rose-500/60 shadow-[0_0_90px_rgba(244,63,94,0.25)]'
      } rounded-3xl p-5 sm:p-8 text-center space-y-4 overflow-hidden`}>
        
        {/* Animated Background Atmosphere */}
        <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full blur-3xl pointer-events-none ${
          isPlayerWin 
            ? 'bg-gradient-to-tr from-amber-500/25 via-yellow-400/15 to-transparent animate-spin duration-1000' 
            : 'bg-gradient-to-tr from-rose-600/20 via-blue-900/20 to-transparent'
        }`} />

        {/* Top Header Badge */}
        <div className="relative z-10 flex items-center justify-center gap-2">
          {isCompetitive ? (
            isPlayerWin ? (
              <div className="px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-mono text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg animate-bounce">
                <Crown className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>¡VICTORIA CLASIFICATORIA! (+{competitiveResult?.eloDiff ?? 45} ELO)</span>
              </div>
            ) : (
              <div className="px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-400 text-rose-300 font-mono text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>DERROTA EN RANKED ({competitiveResult?.eloDiff ?? -15} ELO)</span>
              </div>
            )
          ) : winner.team && winner.team !== 'none' ? (
            <div className={`px-4 py-1.5 rounded-full border text-xs sm:text-sm font-black flex items-center gap-2 shadow-md ${
              winner.team === 'red' ? 'bg-rose-500/20 border-rose-400 text-rose-300' : 'bg-sky-500/20 border-sky-400 text-sky-300'
            }`}>
              <Crown className="w-4 h-4" />
              <span>¡VICTORIA DEL EQUIPO {winner.team === 'red' ? 'ROJO' : 'AZUL'}!</span>
            </div>
          ) : (
            <div className="px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-mono text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md">
              <Crown className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{t.victory} - ¡CAMPEÓN DE ARENA!</span>
            </div>
          )}
        </div>

        {/* ANIMATED CANVAS SHOWCASE: Crown for Win, Crying Tears for Loss */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="relative">
            <canvas 
              ref={canvasRef} 
              width={260} 
              height={190} 
              className="drop-shadow-2xl mx-auto"
            />
          </div>

          <div className="space-y-1 -mt-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
              {isPlayerWin ? (
                <>
                  <Crown className="w-6 h-6 text-amber-400 fill-amber-400 inline" />
                  <span>
                    {winner.team && winner.team !== 'none'
                      ? `¡EQUIPO ${winner.team === 'red' ? 'ROJO' : 'AZUL'} CAMPEÓN!`
                      : `¡${getPowerDisplayName(showcasePower, currentLang)} GANA!`}
                  </span>
                </>
              ) : (
                <span className="text-rose-200">¡Tu bola {getPowerDisplayName(showcasePower, currentLang)} ha caído!</span>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              {isPlayerWin 
                ? (winner.team && winner.team !== 'none' ? '¡Gran trabajo en equipo para dominar la arena!' : '¡Dominio elemental absoluto en la arena!')
                : 'No te rindas, vuelve al combate y recupera tu ELO.'}
            </p>
          </div>
        </div>

        {/* Competitive Mode Rewards Banner */}
        {isCompetitive && competitiveResult && (
          <div className="relative z-10 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-mono uppercase font-bold">Cambio ELO</span>
                <span className={`text-xl sm:text-2xl font-black font-mono ${
                  competitiveResult.eloDiff >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {competitiveResult.eloDiff >= 0 ? `+${competitiveResult.eloDiff}` : competitiveResult.eloDiff} ELO
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-purple-400 block font-mono uppercase font-bold flex items-center justify-center gap-1">
                  <Egg className="w-3.5 h-3.5" />
                  Fragmentos Huevo
                </span>
                <span className="text-xl sm:text-2xl font-black text-purple-300 font-mono">
                  +{competitiveResult.tokens}
                </span>
              </div>
            </div>

            {/* Dropped Egg Banner */}
            {competitiveResult.egg && (
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-purple-950/90 to-amber-950/90 border border-purple-500/60 flex items-center justify-between text-xs text-amber-200">
                <div className="flex items-center gap-2">
                  <Egg className="w-4 h-4 text-purple-400" />
                  <span className="font-bold">¡Huevo conseguido: {competitiveResult.egg.name}!</span>
                </div>
                {onGoToIncubator && (
                  <button
                    onClick={onGoToIncubator}
                    className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
                  >
                    Abrir en Incubadora
                  </button>
                )}
              </div>
            )}

            {/* Smartlink Adsterra: "ver para 45 fragmentos" */}
            <div className="pt-0.5">
              {!hasClaimedAd ? (
                <button
                  onClick={handleWatchAdForFragments}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-purple-950/90 via-indigo-900/60 to-purple-950/90 hover:from-purple-900 hover:via-indigo-800 hover:to-purple-900 border border-purple-500/50 hover:border-amber-400/80 text-purple-200 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-between transition-all shadow-md shadow-purple-950/50 cursor-pointer group active:scale-98"
                  title="Ver anuncio para conseguir 45 fragmentos"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-lg bg-purple-500/20 text-purple-300 group-hover:text-amber-300 transition-colors">
                      <Tv className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-extrabold tracking-wide">ver para 45 fragmentos</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-400/40 text-purple-300 font-mono text-xs font-black flex items-center gap-1 group-hover:bg-amber-500/20 group-hover:border-amber-400/60 group-hover:text-amber-300 transition-colors">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    +45 🥚
                  </span>
                </button>
              ) : (
                <div className="w-full py-2 px-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 shadow-inner">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>¡Reclamado con éxito! +45 fragmentos añadidos</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Battle Stats Cards */}
        <div className="relative z-10 grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-center font-mono text-xs">
          <div className="p-1">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">{t.knockouts}</span>
            <span className="text-sm sm:text-base font-black text-amber-400">{winner.kills} K.O.</span>
          </div>
          <div className="p-1 border-x border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">{t.damageDealt}</span>
            <span className="text-sm sm:text-base font-black text-rose-400">{winner.damageDealt} HP</span>
          </div>
          <div className="p-1">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">{t.topSpeed}</span>
            <span className="text-sm sm:text-base font-black text-sky-400">{winner.topSpeed} px/s</span>
          </div>
        </div>

        {/* ACTION BUTTONS: Highly prominent "Volver a Competitivo", "Revancha", and "Menú" */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
          {/* Primary Action in Competitive: VOLVER A COMPETITIVO */}
          {isCompetitive && onBackToCompetitive ? (
            <button
              onClick={() => {
                soundManager.playMarbleClick(0.7);
                onBackToCompetitive();
              }}
              className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl font-black text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.02] active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 stroke-[3]" />
              <span>Volver a Competitivo</span>
            </button>
          ) : null}

          {/* Instant Rematch / Siguiente Combate */}
          <button
            onClick={() => {
              soundManager.playHeavyImpact(1.0);
              onRematch();
            }}
            className={`w-full ${isCompetitive ? 'sm:flex-1' : 'sm:flex-1'} py-3.5 px-5 rounded-2xl font-black text-sm ${
              !isCompetitive
                ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 shadow-xl shadow-amber-500/30'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-100 border border-slate-700'
            } transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-[1.02] active:scale-95`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isCompetitive ? 'Siguiente Batalla' : t.rematch}</span>
          </button>

          {/* Main Menu Button */}
          <button
            onClick={() => {
              soundManager.playMarbleClick(0.6);
              onBackToMenu();
            }}
            className="w-full sm:w-auto py-3.5 px-5 rounded-2xl font-bold text-sm bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>{t.mainMenu}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
