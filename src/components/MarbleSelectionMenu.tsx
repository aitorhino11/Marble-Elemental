import React, { useState, useEffect, useRef } from 'react';
import { MARBLE_POWERS, ELEMENTAL_MATCHUPS, getPowerDisplayName, getRarityTextClass, getRarityTextColor } from '../data/powersData';
import { MAP_THEMES, MapTheme } from '../data/mapsData';
import { drawUniqueMapDecorations } from '../utils/mapRenderer';
import { MarbleHoverInspector } from './MarbleHoverInspector';
import { 
  MarblePower, 
  MapSizeType, 
  MarbleSizeType, 
  BattleMatchConfig 
} from '../types/game';
import { SupportedLanguage, TRANSLATIONS } from '../i18n/translations';
import { soundManager } from '../utils/audioSystem';
import { 
  Play, 
  Dices, 
  Sparkles, 
  Check, 
  ShieldAlert, 
  Zap, 
  Layers, 
  Maximize, 
  Minimize, 
  Flame, 
  Snowflake, 
  Cpu, 
  Compass, 
  Trophy, 
  ArrowLeft,
  Info
} from 'lucide-react';

interface MarbleSelectionMenuProps {
  onStartBattle: (config: BattleMatchConfig) => void;
  onBackToMenu: () => void;
  currentLang: SupportedLanguage;
  initialSpeed: number;
}

export const MarbleSelectionMenu: React.FC<MarbleSelectionMenuProps> = ({
  onStartBattle,
  onBackToMenu,
  currentLang,
  initialSpeed
}) => {
  const t = TRANSLATIONS[currentLang];

  // Game Mode: 'ffa' | '2v2' | '3v3'
  const [gameMode, setGameMode] = useState<'ffa' | '2v2' | '3v3'>('ffa');

  // Selected Canicas for FFA (minimum 2, maximum 6)
  const [selectedPowers, setSelectedPowers] = useState<MarblePower[]>([
    MARBLE_POWERS[0], // Fire
    MARBLE_POWERS[1], // Ice
    MARBLE_POWERS[2], // Lightning
    MARBLE_POWERS[6], // Black Hole
  ]);

  // Selected Canicas for Team Red and Team Blue
  const [teamRedPowers, setTeamRedPowers] = useState<MarblePower[]>([
    MARBLE_POWERS[0], // Fire
    MARBLE_POWERS[2], // Lightning
    MARBLE_POWERS[4], // Wind
  ]);
  const [teamBluePowers, setTeamBluePowers] = useState<MarblePower[]>([
    MARBLE_POWERS[1], // Ice
    MARBLE_POWERS[3], // Earth
    MARBLE_POWERS[5], // Poison
  ]);

  // Target team to add to when clicking in team mode
  const [activeTeamTarget, setActiveTeamTarget] = useState<'red' | 'blue'>('red');

  const [activeInspectedPower, setActiveInspectedPower] = useState<MarblePower>(MARBLE_POWERS[0]);
  const [selectedMapId, setSelectedMapId] = useState<string>('magma');
  const [mapSizePercent, setMapSizePercent] = useState<number>(200); // 1% to 500%, 200% normal, 350% large
  const [marbleSizePercent, setMarbleSizePercent] = useState<number>(200); // 1% to 500%, 200% normal, 350% giant

  // Hover Tooltip & Elemental FX state
  const [hoveredInfo, setHoveredInfo] = useState<{
    power: MarblePower;
    screenX: number;
    screenY: number;
  } | null>(null);

  // Preview Canvas Reference
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const selectedMap = MAP_THEMES.find(m => m.id === selectedMapId) || MAP_THEMES[0];

  // Toggle marble selection
  const handleToggleMarble = (power: MarblePower) => {
    soundManager.playMarbleClick(0.6);
    setActiveInspectedPower(power);

    if (gameMode === 'ffa') {
      if (selectedPowers.some(p => p.id === power.id)) {
        if (selectedPowers.length > 2) {
          setSelectedPowers(prev => prev.filter(p => p.id !== power.id));
        }
      } else {
        if (selectedPowers.length < 6) {
          setSelectedPowers(prev => [...prev, power]);
        }
      }
    } else {
      // In team mode, toggle or replace in active team
      const maxPerTeam = gameMode === '2v2' ? 2 : 3;
      if (activeTeamTarget === 'red') {
        setTeamRedPowers(prev => {
          if (prev.some(p => p.id === power.id)) return prev;
          if (prev.length >= maxPerTeam) {
            return [...prev.slice(1), power];
          }
          return [...prev, power];
        });
      } else {
        setTeamBluePowers(prev => {
          if (prev.some(p => p.id === power.id)) return prev;
          if (prev.length >= maxPerTeam) {
            return [...prev.slice(1), power];
          }
          return [...prev, power];
        });
      }
    }
  };

  // RANDOM Button: chooses random fighters, map, and sizes!
  const handleRandomizeMatch = () => {
    soundManager.playPowerTrigger('lightning');
    soundManager.playHeavyImpact(0.8);

    const shuffled = [...MARBLE_POWERS].sort(() => Math.random() - 0.5);

    if (gameMode === 'ffa') {
      const count = Math.floor(2 + Math.random() * 3); // 2, 3, or 4
      const chosenPowers = shuffled.slice(0, count);
      setSelectedPowers(chosenPowers);
      setActiveInspectedPower(chosenPowers[0]);
    } else {
      const count = gameMode === '2v2' ? 2 : 3;
      const red = shuffled.slice(0, count);
      const blue = shuffled.slice(count, count * 2);
      setTeamRedPowers(red);
      setTeamBluePowers(blue);
      setActiveInspectedPower(red[0]);
    }

    // Pick random map
    const randomMap = MAP_THEMES[Math.floor(Math.random() * MAP_THEMES.length)];
    setSelectedMapId(randomMap.id);

    // Pick random sizes in percentage
    const randMapPct = Math.round(150 + Math.random() * 200); // 150% - 350%
    const randMarblePct = Math.round(140 + Math.random() * 180); // 140% - 320%
    setMapSizePercent(randMapPct);
    setMarbleSizePercent(randMarblePct);
  };

  // Live Preview Canvas Loop
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;
    let animId: number;

    const baseRadius = Math.max(4, Math.round(14 * (marbleSizePercent / 200)));

    // Simulation nodes for the preview
    const previewMarbles = selectedPowers.map((p, idx) => ({
      x: 50 + (idx * 55) % 220,
      y: 50 + Math.floor((idx * 55) / 220) * 45,
      vx: (Math.random() - 0.5) * 120,
      vy: (Math.random() - 0.5) * 120,
      radius: baseRadius,
      color: p.colorHex,
      name: p.name
    }));

    let lastT = performance.now();

    const loop = (now: number) => {
      if (!running) return;
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;

      const w = canvas.width;
      const h = canvas.height;

      // Draw map background
      const grad = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, w / 1.5);
      grad.addColorStop(0, selectedMap.bgGradient[0]);
      grad.addColorStop(0.6, selectedMap.bgGradient[1]);
      grad.addColorStop(1, selectedMap.bgGradient[2]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = selectedMap.gridColor;
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Unique Rich Map Themed Architecture & Scenery
      drawUniqueMapDecorations(ctx, selectedMap.id, w, h, now / 1000);

      // Border glow
      ctx.strokeStyle = selectedMap.borderColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(6, 6, w - 12, h - 12);

      // Preview Marbles movement
      previewMarbles.forEach(m => {
        m.x += m.vx * dt;
        m.y += m.vy * dt;

        // Bounce walls
        if (m.x - m.radius < 8) {
          m.x = 8 + m.radius;
          m.vx = -m.vx;
        } else if (m.x + m.radius > w - 8) {
          m.x = w - 8 - m.radius;
          m.vx = -m.vx;
        }
        if (m.y - m.radius < 8) {
          m.y = 8 + m.radius;
          m.vy = -m.vy;
        } else if (m.y + m.radius > h - 8) {
          m.y = h - 8 - m.radius;
          m.vy = -m.vy;
        }

        // Draw marble body with 3D gradient
        ctx.save();
        const mGrad = ctx.createRadialGradient(
          m.x - m.radius * 0.3,
          m.y - m.radius * 0.3,
          m.radius * 0.1,
          m.x,
          m.y,
          m.radius
        );
        mGrad.addColorStop(0, '#ffffff');
        mGrad.addColorStop(0.35, m.color);
        mGrad.addColorStop(1, '#020617');

        ctx.fillStyle = mGrad;
        ctx.shadowColor = m.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(animId);
    };
  }, [selectedPowers, selectedMap, marbleSizePercent, mapSizePercent]);

  const handleStart = () => {
    soundManager.playHeavyImpact(1.2);
    let fighters = selectedPowers;
    let teamFighters: { red: MarblePower[]; blue: MarblePower[] } | undefined = undefined;

    if (gameMode === '2v2') {
      const red = [teamRedPowers[0] || MARBLE_POWERS[0], teamRedPowers[1] || MARBLE_POWERS[2]];
      const blue = [teamBluePowers[0] || MARBLE_POWERS[1], teamBluePowers[1] || MARBLE_POWERS[3]];
      fighters = [...red, ...blue];
      teamFighters = { red, blue };
    } else if (gameMode === '3v3') {
      const red = [
        teamRedPowers[0] || MARBLE_POWERS[0],
        teamRedPowers[1] || MARBLE_POWERS[2],
        teamRedPowers[2] || MARBLE_POWERS[4]
      ];
      const blue = [
        teamBluePowers[0] || MARBLE_POWERS[1],
        teamBluePowers[1] || MARBLE_POWERS[3],
        teamBluePowers[2] || MARBLE_POWERS[5]
      ];
      fighters = [...red, ...blue];
      teamFighters = { red, blue };
    }

    onStartBattle({
      fighters,
      mapThemeId: selectedMapId,
      mapSizePercent,
      marbleSizePercent,
      gameSpeed: initialSpeed,
      gameMode,
      teamFighters
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full animate-in fade-in duration-200">
      {/* Top Header & Fast Actions */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playMarbleClick(0.6);
              onBackToMenu();
            }}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Volver"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.selectMarbles}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {gameMode === 'ffa' ? `${t.chooseFighters} (${selectedPowers.length}/6)` : `Modo ${gameMode.toUpperCase()} por Equipos`}
            </h1>
          </div>
        </div>

        {/* Action Buttons: RANDOM & START BATTLE */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {/* Random Match Button */}
          <button
            onClick={handleRandomizeMatch}
            className="flex-1 md:flex-initial px-4 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Dices className="w-4 h-4" />
            <span>{t.randomMatch}</span>
          </button>

          {/* Start Battle Button */}
          <button
            onClick={handleStart}
            disabled={gameMode === 'ffa' ? selectedPowers.length < 2 : (gameMode === '2v2' ? (teamRedPowers.length < 2 || teamBluePowers.length < 2) : (teamRedPowers.length < 3 || teamBluePowers.length < 3))}
            className={`flex-1 md:flex-initial px-6 py-3 rounded-2xl font-black text-sm tracking-wider shadow-2xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              (gameMode === 'ffa' && selectedPowers.length >= 2) || (gameMode !== 'ffa')
                ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-amber-500/30 transform hover:scale-105 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
            <span>{t.startBattle}</span>
          </button>
        </div>
      </div>

      {/* GAME MODE SELECTOR TABS: FFA vs 2vs2 vs 3vs3 */}
      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>Modo de Combate:</span>
        </div>

        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800 flex-wrap">
          <button
            onClick={() => {
              soundManager.playMarbleClick(0.5);
              setGameMode('ffa');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              gameMode === 'ffa'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚔️ Todos vs Todos (FFA)
          </button>

          <button
            onClick={() => {
              soundManager.playMarbleClick(0.5);
              setGameMode('2v2');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              gameMode === '2v2'
                ? 'bg-gradient-to-r from-rose-500 to-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🔴 2 vs 2 en Equipo 🔵
          </button>

          <button
            onClick={() => {
              soundManager.playMarbleClick(0.5);
              setGameMode('3v3');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              gameMode === '3v3'
                ? 'bg-gradient-to-r from-rose-500 to-sky-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🔴 3 vs 3 en Equipo 🔵
          </button>
        </div>
      </div>

      {/* TEAM DISPLAY (When in 2v2 or 3v3 mode) */}
      {gameMode !== 'ffa' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Team Red Box */}
          <div 
            onClick={() => setActiveTeamTarget('red')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
              activeTeamTarget === 'red'
                ? 'bg-rose-950/40 border-rose-500 shadow-lg shadow-rose-500/20'
                : 'bg-slate-900 border-rose-900/60 opacity-80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-black text-rose-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                EQUIPO ROJO ({teamRedPowers.slice(0, gameMode === '2v2' ? 2 : 3).length}/{gameMode === '2v2' ? 2 : 3})
              </span>
              {activeTeamTarget === 'red' && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40">
                  Seleccionando aquí
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {teamRedPowers.slice(0, gameMode === '2v2' ? 2 : 3).map((p, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-rose-500/40 text-xs font-bold">
                  <div className="w-4 h-4 rounded-full" style={{ background: p.colorHex }} />
                  <span className={getRarityTextClass(p.rarity)}>{getPowerDisplayName(p, currentLang)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Team Blue Box */}
          <div 
            onClick={() => setActiveTeamTarget('blue')}
            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
              activeTeamTarget === 'blue'
                ? 'bg-sky-950/40 border-sky-500 shadow-lg shadow-sky-500/20'
                : 'bg-slate-900 border-sky-900/60 opacity-80'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-black text-sky-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                EQUIPO AZUL ({teamBluePowers.slice(0, gameMode === '2v2' ? 2 : 3).length}/{gameMode === '2v2' ? 2 : 3})
              </span>
              {activeTeamTarget === 'blue' && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold border border-sky-500/40">
                  Seleccionando aquí
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {teamBluePowers.slice(0, gameMode === '2v2' ? 2 : 3).map((p, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-sky-500/40 text-xs font-bold">
                  <div className="w-4 h-4 rounded-full" style={{ background: p.colorHex }} />
                  <span className={getRarityTextClass(p.rarity)}>{getPowerDisplayName(p, currentLang)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 20 Marble Roster Grid (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Toca para seleccionar/deseleccionar (Mínimo 2, Máximo 6)</span>
            <span className="font-mono text-amber-400 font-bold">{selectedPowers.length} Seleccionadas</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[580px] overflow-y-auto pr-1">
            {MARBLE_POWERS.map((power) => {
              const isSelected = selectedPowers.some(p => p.id === power.id);
              const isInspected = activeInspectedPower.id === power.id;

              return (
                <div
                  key={power.id}
                  onClick={() => handleToggleMarble(power)}
                  onMouseEnter={(e) => {
                    setActiveInspectedPower(power);
                    setHoveredInfo({
                      power,
                      screenX: e.clientX,
                      screenY: e.clientY
                    });
                  }}
                  onMouseMove={(e) => {
                    setHoveredInfo({
                      power,
                      screenX: e.clientX,
                      screenY: e.clientY
                    });
                  }}
                  onMouseLeave={() => setHoveredInfo(null)}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-800 border-amber-400 shadow-lg shadow-amber-500/10 ring-2 ring-amber-400/40'
                      : 'bg-slate-900/80 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  {/* Selection Indicator Check */}
                  <div className="flex items-start justify-between">
                    <div
                      className="w-8 h-8 rounded-full shadow-inner flex items-center justify-center font-bold text-xs"
                      style={{
                        background: `radial-gradient(circle at 35% 30%, #ffffff 0%, ${power.colorHex} 60%, #020617 100%)`,
                        boxShadow: `0 0 12px ${power.colorHex}70`
                      }}
                    />

                    {isSelected ? (
                      <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-bold shadow">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-500 flex items-center justify-center text-[10px]">
                        +
                      </span>
                    )}
                  </div>

                  <div className="mt-2.5">
                    {/* Marble name color depends on rarity: comun gris, raro azul, epico morado, legendario dorado */}
                    <h3 className={`text-xs truncate ${getRarityTextClass(power.rarity)}`}>
                      {getPowerDisplayName(power, currentLang)}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                      <span style={{ color: getRarityTextColor(power.rarity) }} className="font-semibold">
                        {power.rarity === 'Legendary' ? 'Legendario' : power.rarity === 'Epic' ? 'Épico' : power.rarity === 'Rare' ? 'Raro' : 'Común'}
                      </span>
                      <span>·</span>
                      <span className="font-mono">{power.damageValue} DMG</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Previsualización en Vivo, Paisajes & Ajustes (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Live Battle Preview Canvas */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {t.preview}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {selectedMap.name} · {mapSizePercent}%
              </span>
            </div>

            <div className="w-full flex items-center justify-center bg-slate-950 rounded-2xl overflow-hidden border border-slate-800/80">
              <canvas
                ref={previewCanvasRef}
                width={320}
                height={200}
                className="w-full h-auto max-w-[340px]"
              />
            </div>
          </div>

          {/* Map Landscapes Selector */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                {t.selectMapTheme}
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">
                {selectedMap.name}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {MAP_THEMES.map((theme) => {
                const isSelected = selectedMapId === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      soundManager.playMarbleClick(0.5);
                      setSelectedMapId(theme.id);
                    }}
                    className={`p-2 rounded-xl border text-left text-xs transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-amber-400 text-white font-bold ring-1 ring-amber-400/50'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.borderColor }} />
                      <span className="text-[11px] truncate">{theme.name.split(' ')[0]}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Map Size & Marble Size Customization (1% to 500% Percentage Sliders) */}
          <div className="space-y-3">
            {/* Map Size Slider (1% to 500%) */}
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-300 block">
                    {t.mapSettings}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Rango: 1% - 500% (Normal: 200% · Grande: 350%)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={mapSizePercent}
                    onChange={(e) => {
                      const val = Math.max(1, Math.min(500, Number(e.target.value) || 1));
                      setMapSizePercent(val);
                    }}
                    className="w-16 px-1.5 py-0.5 rounded-lg bg-slate-950 border border-slate-700 text-amber-400 font-mono font-bold text-right text-xs focus:outline-none focus:border-amber-400"
                  />
                  <span className="font-mono text-xs font-bold text-amber-400">%</span>
                </div>
              </div>

              <input
                type="range"
                min="1"
                max="500"
                step="1"
                value={mapSizePercent}
                onChange={(e) => {
                  setMapSizePercent(Number(e.target.value));
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => setMapSizePercent(50)}
                  className={`px-1.5 py-0.5 rounded border ${mapSizePercent === 50 ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'}`}
                >
                  50%
                </button>
                <button
                  type="button"
                  onClick={() => setMapSizePercent(100)}
                  className={`px-1.5 py-0.5 rounded border ${mapSizePercent === 100 ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'}`}
                >
                  100%
                </button>
                <button
                  type="button"
                  onClick={() => setMapSizePercent(200)}
                  className={`px-2 py-0.5 rounded border ${mapSizePercent === 200 ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' : 'bg-slate-950 border-slate-800 text-amber-400'}`}
                >
                  200% (Normal)
                </button>
                <button
                  type="button"
                  onClick={() => setMapSizePercent(350)}
                  className={`px-2 py-0.5 rounded border ${mapSizePercent === 350 ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' : 'bg-slate-950 border-slate-800 text-amber-400'}`}
                >
                  350% (Grande)
                </button>
                <button
                  type="button"
                  onClick={() => setMapSizePercent(500)}
                  className={`px-1.5 py-0.5 rounded border ${mapSizePercent === 500 ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'}`}
                >
                  500%
                </button>
              </div>
            </div>

            {/* Marble Size Slider (1% to 500%) */}
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-300 block">
                    {t.marbleSettings}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Rango: 1% - 500% (Normal: 200% · Gigante: 350%)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={marbleSizePercent}
                    onChange={(e) => {
                      const val = Math.max(1, Math.min(500, Number(e.target.value) || 1));
                      setMarbleSizePercent(val);
                    }}
                    className="w-16 px-1.5 py-0.5 rounded-lg bg-slate-950 border border-slate-700 text-amber-400 font-mono font-bold text-right text-xs focus:outline-none focus:border-amber-400"
                  />
                  <span className="font-mono text-xs font-bold text-amber-400">%</span>
                </div>
              </div>

              <input
                type="range"
                min="1"
                max="500"
                step="1"
                value={marbleSizePercent}
                onChange={(e) => {
                  setMarbleSizePercent(Number(e.target.value));
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => setMarbleSizePercent(50)}
                  className={`px-1.5 py-0.5 rounded border ${marbleSizePercent === 50 ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'}`}
                >
                  50%
                </button>
                <button
                  type="button"
                  onClick={() => setMarbleSizePercent(100)}
                  className={`px-1.5 py-0.5 rounded border ${marbleSizePercent === 100 ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'}`}
                >
                  100%
                </button>
                <button
                  type="button"
                  onClick={() => setMarbleSizePercent(200)}
                  className={`px-2 py-0.5 rounded border ${marbleSizePercent === 200 ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' : 'bg-slate-950 border-slate-800 text-amber-400'}`}
                >
                  200% (Normal)
                </button>
                <button
                  type="button"
                  onClick={() => setMarbleSizePercent(350)}
                  className={`px-2 py-0.5 rounded border ${marbleSizePercent === 350 ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' : 'bg-slate-950 border-slate-800 text-amber-400'}`}
                >
                  350% (Gigante)
                </button>
                <button
                  type="button"
                  onClick={() => setMarbleSizePercent(500)}
                  className={`px-1.5 py-0.5 rounded border ${marbleSizePercent === 500 ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'}`}
                >
                  500%
                </button>
              </div>
            </div>
          </div>

          {/* Inspected Marble Counter & Stats Info */}
          {activeInspectedPower && (
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className={`font-bold flex items-center gap-1.5 ${getRarityTextClass(activeInspectedPower.rarity)}`}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeInspectedPower.colorHex }} />
                  {getPowerDisplayName(activeInspectedPower, currentLang)}
                </span>
                <span className="font-mono text-amber-400 font-bold">
                  {activeInspectedPower.element}
                </span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {activeInspectedPower.combatImpact}
              </p>

              {/* Counter Advantages */}
              {ELEMENTAL_MATCHUPS[activeInspectedPower.element] && (
                <div className="pt-2 border-t border-slate-800 text-[11px] flex justify-between">
                  <span className="text-emerald-400 font-semibold">
                    ✓ {t.counterOf}: {ELEMENTAL_MATCHUPS[activeInspectedPower.element].strongAgainst.join(', ')} (+35%)
                  </span>
                  <span className="text-rose-400 font-semibold">
                    ✗ {t.weakAgainst}: {ELEMENTAL_MATCHUPS[activeInspectedPower.element].weakAgainst.join(', ')}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Floating Hover Inspector with Elemental Particles & Force Points */}
      {hoveredInfo && (
        <MarbleHoverInspector
          power={hoveredInfo.power}
          screenX={hoveredInfo.screenX}
          screenY={hoveredInfo.screenY}
          currentLang={currentLang}
        />
      )}
    </div>
  );
};
