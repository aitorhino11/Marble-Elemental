import React, { useRef, useEffect, useState, useCallback } from 'react';
import { BattleMatchConfig, MarbleEntity, DamagePopup, Particle, PowerProjectile, ArenaShape, BattleGameMode } from '../types/game';
import { MAP_THEMES, MapTheme } from '../data/mapsData';
import { ELEMENTAL_MATCHUPS, getPowerDisplayName, getRarityTextClass } from '../data/powersData';
import { soundManager } from '../utils/audioSystem';
import { SupportedLanguage, TRANSLATIONS } from '../i18n/translations';
import { drawUniqueMapDecorations } from '../utils/mapRenderer';
import { drawMarbleSkin } from '../utils/marbleSkinRenderer';
import { 
  Zap, 
  RotateCcw, 
  ArrowLeft, 
  Flame, 
  Shield, 
  Sparkles, 
  Trophy, 
  Heart, 
  Clock, 
  Timer, 
  Swords, 
  Circle, 
  Square, 
  Hexagon, 
  Octagon,
  AlertTriangle,
  Users
} from 'lucide-react';

interface BattleArenaCanvasProps {
  config: BattleMatchConfig;
  onVictory: (winner: MarbleEntity) => void;
  onBackToMenu: () => void;
  currentLang: SupportedLanguage;
  isCompetitive?: boolean;
  onRequestSurrender?: () => void;
}

export const BattleArenaCanvas: React.FC<BattleArenaCanvasProps> = ({
  config,
  onVictory,
  onBackToMenu,
  currentLang,
  isCompetitive = false,
  onRequestSurrender
}) => {
  const t = TRANSLATIONS[currentLang];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const selectedMap = MAP_THEMES.find(m => m.id === config.mapThemeId) || MAP_THEMES[0];
  const isComp = Boolean(isCompetitive);
  const gameMode: BattleGameMode = config.gameMode || 'ffa';
  const isTeamMode = gameMode === '2v2' || gameMode === '3v3';

  // Active Arena Shape (circle, square, hexagon, octagon)
  const [arenaShape, setArenaShape] = useState<ArenaShape>(
    config.arenaShape || selectedMap.defaultShape || 'octagon'
  );

  // REAL SCALING: Map Size and Marble Size based on configuration!
  // In competitive mode: 100% standard map size, and 200% marble size (2x chunky radius) as requested!
  const mapScale = isComp ? 1.0 : ((config.mapSizePercent || 100) / 100);
  const arenaWidth = Math.round(Math.max(480, Math.min(1000, 660 * Math.min(1.5, Math.max(0.7, mapScale)))));
  const arenaHeight = Math.round(Math.max(380, Math.min(800, 520 * Math.min(1.5, Math.max(0.7, mapScale)))));

  // Marble Size: 200% (2.0x base radius = 40px) in competitive, or directly scaled by marbleSizePercent in sandbox
  const marbleScale = isComp ? 2.0 : ((config.marbleSizePercent || 100) / 100);
  const baseRadius = Math.max(12, Math.min(65, Math.round(20 * marbleScale)));

  // Refs for real-time physics and entities
  const marblesRef = useRef<MarbleEntity[]>([]);
  const projectilesRef = useRef<PowerProjectile[]>([]);
  const popupsRef = useRef<DamagePopup[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const traumaRef = useRef<number>(0);
  const matchFinishedRef = useRef<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const battleDurationRef = useRef<number>(0);

  // HUD sync state
  const [hudMarbles, setHudMarbles] = useState<MarbleEntity[]>([]);
  const [displaySeconds, setDisplaySeconds] = useState<number>(0);
  const [isSuddenDeath, setIsSuddenDeath] = useState<boolean>(false);

  // Hover Tooltip state: shows abilities, force points, stats on hover (both canvas and HUD cards)
  const [hoveredInfo, setHoveredInfo] = useState<{
    marble: MarbleEntity;
    screenX: number;
    screenY: number;
    isRival: boolean;
  } | null>(null);

  // Cycle Arena Shape
  const handleCycleShape = () => {
    soundManager.playMarbleClick(0.6);
    const shapes: ArenaShape[] = ['circle', 'square', 'hexagon', 'octagon'];
    const nextIdx = (shapes.indexOf(arenaShape) + 1) % shapes.length;
    setArenaShape(shapes[nextIdx]);
  };

  // Initialize Battle
  const initBattle = useCallback(() => {
    matchFinishedRef.current = false;
    battleDurationRef.current = 0;
    setDisplaySeconds(0);
    setIsSuddenDeath(false);
    projectilesRef.current = [];
    popupsRef.current = [];
    particlesRef.current = [];
    traumaRef.current = 0;

    const fighters = config.fighters;
    const count = fighters.length;
    const cx = arenaWidth / 2;
    const cy = arenaHeight / 2;
    const spawnRadius = Math.min(arenaWidth, arenaHeight) * 0.32;

    const entities: MarbleEntity[] = fighters.map((p, idx) => {
      const angle = (idx / count) * Math.PI * 2;
      const initialSpeed = 270 + Math.random() * 40;
      const moveAngle = angle + Math.PI + (Math.random() - 0.5) * 0.5;

      // Assign team in 2v2 or 3v3 mode (first half Red, second half Blue)
      let team: 'red' | 'blue' | 'none' = 'none';
      if (isTeamMode) {
        team = idx < count / 2 ? 'red' : 'blue';
      }

      return {
        id: `marble-${idx}-${p.id}`,
        name: getPowerDisplayName(p, currentLang),
        x: cx + Math.cos(angle) * spawnRadius,
        y: cy + Math.sin(angle) * spawnRadius,
        vx: Math.cos(moveAngle) * initialSpeed,
        vy: Math.sin(moveAngle) * initialSpeed,
        radius: p.id === 'chaos-growth' ? Math.round(baseRadius * 1.25) : baseRadius,
        originalRadius: p.id === 'chaos-growth' ? Math.round(baseRadius * 1.25) : baseRadius,
        mass: p.id === 'chaos-growth' ? 1.5 : 1.0,
        originalMass: p.id === 'chaos-growth' ? 1.5 : 1.0,
        hp: 450, // Starting healthy pool of 450 HP for balanced 15s - 60s matches
        maxHp: 450,
        energy: 0,
        maxEnergy: 100,
        cooldown: Math.random() * 2.0 + 1.2,
        maxCooldown: p.id === 'legend-fisherman' ? 8.0 : p.id === 'elem-poison' ? 7.0 : Math.max(3.6, p.cooldownSeconds * 0.85),
        color: p.colorHex,
        power: p,
        isAlive: true,
        team,
        trail: [],
        kills: 0,
        damageDealt: 0,
        topSpeed: 270
      };
    });

    marblesRef.current = entities;
    setHudMarbles([...entities]);
  }, [config, arenaWidth, arenaHeight, baseRadius, currentLang, isTeamMode]);

  useEffect(() => {
    initBattle();
  }, [initBattle]);

  // Main Simulation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;
    lastTimeRef.current = performance.now();

    const cx = arenaWidth / 2;
    const cy = arenaHeight / 2;
    const arenaRadius = Math.min(arenaWidth, arenaHeight) * 0.44;

    const gameLoop = (currentTime: number) => {
      if (!running) return;

      const rawDt = Math.min((currentTime - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = currentTime;

      const dt = rawDt * (config.gameSpeed || 1.0);
      battleDurationRef.current += dt;

      const totalTime = battleDurationRef.current;
      const curSecs = Math.floor(totalTime);
      if (curSecs !== displaySeconds) {
        setDisplaySeconds(curSecs);
      }

      // Check Sudden Death at 45 seconds (Red warning, accelerated cooldowns, decisive clash)
      const suddenDeathActive = totalTime >= 45.0;
      if (suddenDeathActive !== isSuddenDeath) {
        setIsSuddenDeath(suddenDeathActive);
      }

      // 60.0 Seconds Maximum Timeout Rule
      if (totalTime >= 60.0 && !matchFinishedRef.current) {
        matchFinishedRef.current = true;
        const living = marblesRef.current.filter(m => m.isAlive && !m.isClone);
        living.sort((a, b) => b.hp !== a.hp ? b.hp - a.hp : b.damageDealt - a.damageDealt);
        const champion = living[0] || marblesRef.current[0];
        soundManager.playEggHatchFanfare('Legendary');
        setTimeout(() => {
          onVictory(champion);
        }, 500);
        return;
      }

      // Screen Shake Trauma Decay
      if (traumaRef.current > 0) {
        traumaRef.current = Math.max(0, traumaRef.current - dt * 2.2);
      }
      const shakeIntensity = Math.pow(traumaRef.current, 2) * 12;
      const shakeX = (Math.random() - 0.5) * shakeIntensity;
      const shakeY = (Math.random() - 0.5) * shakeIntensity;

      ctx.save();
      ctx.translate(shakeX, shakeY);

      // 1. Draw Map Background
      const floorGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, arenaRadius * 1.2);
      floorGrad.addColorStop(0, selectedMap.bgGradient[0]);
      floorGrad.addColorStop(0.7, selectedMap.bgGradient[1]);
      floorGrad.addColorStop(1, selectedMap.bgGradient[2]);
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, 0, arenaWidth, arenaHeight);

      // Draw Themed Scenery Decals (No obstacles!)
      drawUniqueMapDecorations(ctx, selectedMap.id, arenaWidth, arenaHeight, totalTime);

      // 2. Draw Arena Boundaries & Geometry (Circle, Square, Hexagon, Octagon)
      ctx.save();
      const borderColor = suddenDeathActive ? '#f43f5e' : selectedMap.borderColor;
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = suddenDeathActive ? 8 : 6;
      ctx.shadowColor = borderColor;
      ctx.shadowBlur = suddenDeathActive ? 25 : 15;

      ctx.beginPath();
      drawArenaShapePath(ctx, arenaShape, cx, cy, arenaRadius);
      ctx.stroke();

      // Inner faint grid
      ctx.strokeStyle = selectedMap.gridColor;
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 0;
      ctx.stroke();
      ctx.restore();

      // Ambient Floating Theme Particles
      if (Math.random() < 0.25) {
        particlesRef.current.push({
          x: cx + (Math.random() - 0.5) * arenaRadius * 1.5,
          y: cy + (Math.random() - 0.5) * arenaRadius * 1.5,
          vx: (Math.random() - 0.5) * 15,
          vy: (Math.random() - 0.5) * 15 - 10,
          color: selectedMap.particleColor,
          size: 2 + Math.random() * 2.5,
          life: 0,
          maxLife: 1.8
        });
      }

      const marbles = marblesRef.current;

      // 3. Update Marbles
      for (let i = marbles.length - 1; i >= 0; i--) {
        const m = marbles[i];
        if (!m.isAlive) continue;

        // If clone marble: decrease clone life
        if (m.isClone && m.cloneLife !== undefined) {
          m.cloneLife -= dt;
          if (m.cloneLife <= 0) {
            m.isAlive = false;
            for (let p = 0; p < 8; p++) {
              particlesRef.current.push({
                x: m.x,
                y: m.y,
                vx: (Math.random() - 0.5) * 60,
                vy: (Math.random() - 0.5) * 60,
                color: '#c084fc',
                size: 4,
                life: 0,
                maxLife: 0.8
              });
            }
            continue;
          }
        }

        // Titan Chonk timer
        if (m.titanTimer && m.titanTimer > 0) {
          m.titanTimer -= dt;
          if (m.titanTimer <= 0) {
            m.radius = m.originalRadius || baseRadius;
            m.mass = m.originalMass || 1.0;
            m.titanTimer = undefined;
          }
        }

        // Status effect countdown & Poison DoT ticks
        if (m.statusEffect) {
          m.statusEffect.duration -= dt;

          // POISON TICKS: Deals 1 damage per tick as requested
          if (m.statusEffect.type === 'poisoned') {
            if (Math.random() < 0.25) {
              const poisonDmg = 1;
              m.hp = Math.max(0, m.hp - poisonDmg);
              popupsRef.current.push({
                id: Math.random().toString(),
                x: m.x + (Math.random() - 0.5) * 15,
                y: m.y - 18,
                text: `☠️ -1`,
                color: '#84cc16',
                lifetime: 0,
                scale: 1.1,
                isCrit: false
              });
              // Toxic bubble particle
              particlesRef.current.push({
                x: m.x + (Math.random() - 0.5) * m.radius,
                y: m.y - m.radius,
                vx: (Math.random() - 0.5) * 20,
                vy: -30 - Math.random() * 20,
                color: '#a3e635',
                size: 3.5,
                life: 0,
                maxLife: 0.8
              });
            }
          }

          if (m.statusEffect.duration <= 0) {
            m.statusEffect = undefined;
          }
        }

        // Pescador Passive: Cada 3 segundos saca pescados saltarines que le curan 15 de vida al comerlos!
        if (m.power.id === 'legend-fisherman' && m.isAlive) {
          m.fishTimer = (m.fishTimer || 0) + dt;
          if (m.fishTimer >= 3.0) {
            m.fishTimer = 0;
            const spawnA = Math.random() * Math.PI * 2;
            const spawnDist = m.radius + 25 + Math.random() * 45;
            const fx = Math.min(cx + arenaRadius * 0.82, Math.max(cx - arenaRadius * 0.82, m.x + Math.cos(spawnA) * spawnDist));
            const fy = Math.min(cy + arenaRadius * 0.82, Math.max(cy - arenaRadius * 0.82, m.y + Math.sin(spawnA) * spawnDist));

            projectilesRef.current.push({
              id: `fish-${Date.now()}-${Math.random()}`,
              type: 'fish_food',
              ownerId: m.id,
              x: fx,
              y: fy,
              vx: (Math.random() - 0.5) * 40,
              vy: (Math.random() - 0.5) * 40,
              radius: 13,
              damage: 0,
              life: 0,
              maxLife: 15.0,
              color: '#0284c7',
              extra: { flopPhase: Math.random() * Math.PI * 2 }
            });

            // Splash ripples
            for (let sp = 0; sp < 5; sp++) {
              particlesRef.current.push({
                x: fx,
                y: fy,
                vx: (Math.random() - 0.5) * 60,
                vy: (Math.random() - 0.5) * 60,
                color: '#38bdf8',
                size: 3,
                life: 0,
                maxLife: 0.6
              });
            }
          }
        }

        const isFrozen = m.statusEffect?.type === 'frozen';
        const isStunned = m.statusEffect?.type === 'emp';

        // Cooldown timer: ticks down only if not frozen/stunned
        if (!isFrozen && !isStunned && !m.isClone) {
          const cdRate = suddenDeathActive ? dt * 1.6 : dt;
          m.cooldown = Math.max(0, m.cooldown - cdRate);

          // REAL DISTINCT POWER ACTIVATION FOR ALL 20 POWERS!
          if (m.cooldown <= 0) {
            m.cooldown = m.maxCooldown;
            soundManager.playPowerTrigger(m.power.element);
            traumaRef.current = Math.min(1.0, traumaRef.current + 0.25);

            // Floating Power Banner
            popupsRef.current.push({
              id: Math.random().toString(),
              x: m.x,
              y: m.y - 28,
              text: `★ ${getPowerDisplayName(m.power, currentLang)}!`,
              color: m.color,
              lifetime: 0,
              scale: 1.4,
              isCrit: true
            });

            // Find nearest valid ENEMY marble (respects Team Mode!)
            let targetMarble: MarbleEntity | null = null;
            let minDist = Infinity;
            marbles.forEach(other => {
              if (other.id !== m.id && other.isAlive && (!m.isClone || other.id !== m.masterId)) {
                // Team check: in team mode, do NOT target teammates!
                if (isTeamMode && m.team && other.team && m.team === other.team) {
                  return;
                }
                const d = Math.hypot(other.x - m.x, other.y - m.y);
                if (d < minDist) {
                  minDist = d;
                  targetMarble = other;
                }
              }
            });

            const targetPos = targetMarble 
              ? { x: (targetMarble as MarbleEntity).x, y: (targetMarble as MarbleEntity).y } 
              : { x: cx, y: cy };
            const targetId = targetMarble ? (targetMarble as MarbleEntity).id : undefined;

            // ========================================================
            // COMPLETE IMPLEMENTATION OF ALL 20 DISTINCT ELEMENTAL POWERS:
            // ========================================================
            switch (m.power.id) {
              case 'elem-fire': {
                // 1. FUEGO: Lanza una bola de fuego teledirigida con estela de llamas
                const fAngle = Math.atan2(targetPos.y - m.y, targetPos.x - m.x);
                projectilesRef.current.push({
                  id: Math.random().toString(),
                  type: 'fireball',
                  ownerId: m.id,
                  x: m.x + Math.cos(fAngle) * (m.radius + 6),
                  y: m.y + Math.sin(fAngle) * (m.radius + 6),
                  vx: Math.cos(fAngle) * 360,
                  vy: Math.sin(fAngle) * 360,
                  radius: 12,
                  damage: 35,
                  life: 0,
                  maxLife: 2.2,
                  color: '#f97316',
                  targetId
                });
                break;
              }

              case 'elem-ice': {
                // 2. HIELO: Dispara lanza de hielo que CONGELA al rival en un bloque
                const iAngle = Math.atan2(targetPos.y - m.y, targetPos.x - m.x);
                projectilesRef.current.push({
                  id: Math.random().toString(),
                  type: 'frost_spear',
                  ownerId: m.id,
                  x: m.x + Math.cos(iAngle) * (m.radius + 6),
                  y: m.y + Math.sin(iAngle) * (m.radius + 6),
                  vx: Math.cos(iAngle) * 400,
                  vy: Math.sin(iAngle) * 400,
                  radius: 10,
                  damage: 26,
                  life: 0,
                  maxLife: 2.0,
                  color: '#38bdf8',
                  targetId
                });
                break;
              }

              case 'elem-lightning': {
                // 3. RAYO: Rayo en cadena directo que electrocuta y causa parálisis EMP
                if (targetMarble) {
                  const target = targetMarble as MarbleEntity;
                  target.hp = Math.max(0, target.hp - 32);
                  target.statusEffect = { type: 'emp', duration: 1.8 };
                  m.damageDealt += 32;
                  soundManager.playHeavyImpact(0.8);
                  traumaRef.current = 0.5;

                  popupsRef.current.push({
                    id: Math.random().toString(),
                    x: target.x,
                    y: target.y - 15,
                    text: '⚡ ¡ELECTROCUTADO!',
                    color: '#c084fc',
                    lifetime: 0,
                    scale: 1.3,
                    isCrit: true
                  });
                }
                break;
              }

              case 'elem-earth': {
                // 4. TIERRA: Lanza un meteorito/roca gigante rodante que arrasa
                const eAngle = Math.atan2(targetPos.y - m.y, targetPos.x - m.x);
                projectilesRef.current.push({
                  id: Math.random().toString(),
                  type: 'boulder',
                  ownerId: m.id,
                  x: m.x + Math.cos(eAngle) * (m.radius + 12),
                  y: m.y + Math.sin(eAngle) * (m.radius + 12),
                  vx: Math.cos(eAngle) * 310,
                  vy: Math.sin(eAngle) * 310,
                  radius: 18,
                  damage: 38,
                  life: 0,
                  maxLife: 2.8,
                  color: '#d97706',
                  targetId
                });
                break;
              }

              case 'elem-wind': {
                // 5. VIENTO: Genera un tornado ciclónico que succiona y hace girar a los rivales
                projectilesRef.current.push({
                  id: Math.random().toString(),
                  type: 'tornado',
                  ownerId: m.id,
                  x: targetPos.x,
                  y: targetPos.y,
                  vx: (Math.random() - 0.5) * 40,
                  vy: (Math.random() - 0.5) * 40,
                  radius: 50,
                  damage: 15,
                  life: 0,
                  maxLife: 4.0,
                  color: '#10b981'
                });
                break;
              }

              case 'elem-poison': {
                // 6. VENENO: Escupe charco de ácido tóxico e infecta (-10% velocidad y 1 de daño durante 3s con 7s cooldown)
                m.cooldown = 7.0;
                m.maxCooldown = 7.0;
                projectilesRef.current.push({
                  id: Math.random().toString(),
                  type: 'poison_pool',
                  ownerId: m.id,
                  x: m.x,
                  y: m.y,
                  vx: 0,
                  vy: 0,
                  radius: 45,
                  damage: 1,
                  life: 0,
                  maxLife: 3.0,
                  color: '#84cc16'
                });
                if (targetMarble) {
                  (targetMarble as MarbleEntity).statusEffect = { type: 'poisoned', duration: 3.0 };
                }
                break;
              }

              case 'cosm-blackhole': {
                // 7. AGUJERO NEGRO CÓSMICO: Absorbe a todos los rivales hacia el vórtice!
                projectilesRef.current.push({
                  id: Math.random().toString(),
                  type: 'blackhole',
                  ownerId: m.id,
                  x: cx,
                  y: cy,
                  vx: 0,
                  vy: 0,
                  radius: 65,
                  damage: 25,
                  life: 0,
                  maxLife: 4.0,
                  color: '#4c1d95'
                });
                break;
              }

              case 'mag-warp': {
                // 8. SALTO CUÁNTICO: Se teletransporta detrás del rival y le asesta un golpe crítico
                if (targetMarble) {
                  const target = targetMarble as MarbleEntity;
                  const targetAngle = Math.atan2(target.vy, target.vx);
                  m.x = target.x - Math.cos(targetAngle) * (target.radius + m.radius + 10);
                  m.y = target.y - Math.sin(targetAngle) * (target.radius + m.radius + 10);
                  m.vx = Math.cos(targetAngle) * 480;
                  m.vy = Math.sin(targetAngle) * 480;
                  soundManager.playPowerTrigger('magic');
                  popupsRef.current.push({
                    id: Math.random().toString(),
                    x: m.x,
                    y: m.y - 20,
                    text: '✨ ¡TELETRANSPORTE!',
                    color: '#ec4899',
                    lifetime: 0,
                    scale: 1.4,
                    isCrit: true
                  });
                }
                break;
              }

              case 'cosm-gravityflip': {
                // 9. INVERSIÓN DE GRAVEDAD: Invierte los vectores de los rivales lanzándolos contra las paredes
                marbles.forEach(other => {
                  if (other.id !== m.id && other.isAlive && (!isTeamMode || other.team !== m.team)) {
                    other.vx = -other.vx * 1.6;
                    other.vy = -other.vy * 1.6;
                    other.hp = Math.max(0, other.hp - 20);
                  }
                });
                traumaRef.current = 0.6;
                popupsRef.current.push({
                  id: Math.random().toString(),
                  x: cx,
                  y: cy - 30,
                  text: '🌌 ¡GRAVEDAD INVERTIDA!',
                  color: '#0ea5e9',
                  lifetime: 0,
                  scale: 1.5,
                  isCrit: true
                });
                break;
              }

              case 'mag-mirrorshield': {
                // 10. ESCUDO PRISMÁTICO: Barrera que absorbe daño al 100%
                m.statusEffect = { type: 'shielded', duration: 4.0 };
                break;
              }

              case 'tech-emp': {
                // 11. PULSO EMP: Resetea el cooldown de los rivales y los paraliza
                marbles.forEach(other => {
                  if (other.id !== m.id && other.isAlive && (!isTeamMode || other.team !== m.team)) {
                    other.cooldown = other.maxCooldown;
                    other.statusEffect = { type: 'emp', duration: 2.2 };
                  }
                });
                traumaRef.current = 0.6;
                popupsRef.current.push({
                  id: Math.random().toString(),
                  x: m.x,
                  y: m.y - 20,
                  text: '⚡ ¡EMP TOTAL!',
                  color: '#38bdf8',
                  lifetime: 0,
                  scale: 1.4,
                  isCrit: true
                });
                break;
              }

              case 'tech-nuke': {
                // 12. BOMBA NUCLEAR: Detona en una colosal explosión atómica
                projectilesRef.current.push({
                  id: Math.random().toString(),
                  type: 'nuke',
                  ownerId: m.id,
                  x: targetPos.x,
                  y: targetPos.y,
                  vx: 0,
                  vy: 0,
                  radius: 75,
                  damage: 55,
                  life: 0,
                  maxLife: 2.5,
                  color: '#f97316'
                });
                break;
              }

              case 'tech-laser': {
                // 13. LANZA LÁSER ORBITAL: Haz continuo escaneando y quemando al rival
                projectilesRef.current.push({
                  id: Math.random().toString(),
                  type: 'laser',
                  ownerId: m.id,
                  x: m.x,
                  y: m.y,
                  vx: 0,
                  vy: 0,
                  radius: 10,
                  damage: 32,
                  life: 0,
                  maxLife: 1.4,
                  color: '#e11d48',
                  targetId
                });
                break;
              }

              case 'tech-landmines': {
                // 14. MINAS DE PROXIMIDAD: Suelta 3 minas parpadeantes en el suelo
                for (let lm = 0; lm < 3; lm++) {
                  const ma = (lm / 3) * Math.PI * 2;
                  projectilesRef.current.push({
                    id: Math.random().toString(),
                    type: 'landmine',
                    ownerId: m.id,
                    x: m.x + Math.cos(ma) * 35,
                    y: m.y + Math.sin(ma) * 35,
                    vx: 0,
                    vy: 0,
                    radius: 14,
                    damage: 36,
                    life: 0,
                    maxLife: 6.0,
                    color: '#f59e0b'
                  });
                }
                break;
              }

              case 'chaos-growth': {
                // 15. TITÁN CHONK GIGANTE: Crece 2.3x y multiplica su masa arrollando
                m.radius = Math.round(baseRadius * 2.3);
                m.mass = 5.0;
                m.titanTimer = 4.5;
                soundManager.playHeavyImpact(1.2);
                popupsRef.current.push({
                  id: Math.random().toString(),
                  x: m.x,
                  y: m.y - 30,
                  text: '🗿 ¡TITÁN GIGANTE!',
                  color: '#14b8a6',
                  lifetime: 0,
                  scale: 1.6,
                  isCrit: true
                });
                break;
              }

              case 'meme-dupe': {
                // 16. CAOS DE CLONES: Spawns 2 mini-clones of the marble!
                for (let c = 0; c < 2; c++) {
                  const cAngle = Math.random() * Math.PI * 2;
                  marblesRef.current.push({
                    id: `clone-${m.id}-${Date.now()}-${c}`,
                    name: `Clon de ${m.name}`,
                    x: m.x + Math.cos(cAngle) * (m.radius * 2),
                    y: m.y + Math.sin(cAngle) * (m.radius * 2),
                    vx: -m.vx * 0.9 + (Math.random() - 0.5) * 50,
                    vy: -m.vy * 0.9 + (Math.random() - 0.5) * 50,
                    radius: Math.round(m.radius * 0.75),
                    mass: 0.7,
                    hp: Math.round(m.hp * 0.45),
                    maxHp: Math.round(m.hp * 0.45),
                    energy: 0,
                    maxEnergy: 50,
                    cooldown: 999,
                    maxCooldown: 999,
                    color: m.color,
                    power: m.power,
                    isAlive: true,
                    team: m.team,
                    isClone: true,
                    masterId: m.id,
                    cloneLife: 8.0,
                    trail: [],
                    kills: 0,
                    damageDealt: 0,
                    topSpeed: 280
                  });
                }
                break;
              }

              case 'chaos-magnet': {
                // 17. IMÁN VORAZ: Succiona a los rivales magnéticamente
                marbles.forEach(other => {
                  if (other.id !== m.id && other.isAlive && (!isTeamMode || other.team !== m.team)) {
                    const pullA = Math.atan2(m.y - other.y, m.x - other.x);
                    other.vx += Math.cos(pullA) * 260;
                    other.vy += Math.sin(pullA) * 260;
                    other.hp = Math.max(0, other.hp - 18);
                  }
                });
                break;
              }

              case 'meme-speed': {
                // 18. TURBO HIPERSÓNICO: Acelera al 320% con estela arcoíris e invulnerabilidad
                m.vx *= 3.2;
                m.vy *= 3.2;
                m.statusEffect = { type: 'blitz', duration: 1.5 };
                soundManager.playHeavyImpact(1.0);
                break;
              }

              case 'meme-anvil': {
                // 19. YUNQUE DE 100 TONELADAS: Cae un yunque de dibujos animados encima del rival
                projectilesRef.current.push({
                  id: Math.random().toString(),
                  type: 'anvil',
                  ownerId: m.id,
                  x: targetPos.x,
                  y: targetPos.y - 120, // starts in the air
                  vx: 0,
                  vy: 420, // falls fast
                  radius: 20,
                  damage: 45,
                  life: 0,
                  maxLife: 1.5,
                  color: '#64748b',
                  targetId,
                  extra: { groundY: targetPos.y }
                });
                break;
              }

              case 'chaos-tornado': {
                // 20. TORBELLINO PINBALL: Se convierte en un torbellino sin fricción rebotando alocadamente
                m.vx *= 2.2;
                m.vy *= 2.2;
                m.statusEffect = { type: 'blitz', duration: 3.5 };
                soundManager.playPowerTrigger('chaos');
                break;
              }

              case 'legend-fisherman': {
                // 21. PESCADOR (Legendaria): Lanza la caña con anzuelo tenso y estampa al rival contra la pared causándole 30 de daño (8s cooldown)!
                m.cooldown = 8.0;
                m.maxCooldown = 8.0;
                if (targetMarble) {
                  const target = targetMarble as MarbleEntity;

                  // Proyectil visual del sedal y anzuelo curvado con tensión
                  projectilesRef.current.push({
                    id: Math.random().toString(),
                    type: 'fishing_hook',
                    ownerId: m.id,
                    x: m.x,
                    y: m.y,
                    vx: 0,
                    vy: 0,
                    radius: 20,
                    damage: 30,
                    life: 0,
                    maxLife: 1.1,
                    color: '#0284c7',
                    targetId: target.id,
                    extra: {
                      hookedX: target.x,
                      hookedY: target.y
                    }
                  });

                  soundManager.playPowerTrigger('fisherman');
                  soundManager.playMarbleHitSound('legend-fisherman', 1.5);

                  // Vector hacia el muro más cercano
                  const angleFromCenter = Math.atan2(target.y - cy, target.x - cx);

                  // Estampa al rival fuertísimo contra la pared
                  target.vx = Math.cos(angleFromCenter) * 880;
                  target.vy = Math.sin(angleFromCenter) * 880;

                  // Quita 30 de daño por el golpe contra el muro
                  target.hp = Math.max(0, target.hp - 30);
                  m.damageDealt += 30;

                  traumaRef.current = 0.7;

                  popupsRef.current.push({
                    id: Math.random().toString(),
                    x: target.x,
                    y: target.y - 25,
                    text: '🎣 ¡ENGANCHADO Y ESTAMPADO! -30',
                    color: '#38bdf8',
                    lifetime: 0,
                    scale: 1.6,
                    isCrit: true
                  });

                  // Partículas acuáticas de impacto
                  for (let p = 0; p < 14; p++) {
                    const pa = Math.random() * Math.PI * 2;
                    particlesRef.current.push({
                      x: target.x,
                      y: target.y,
                      vx: Math.cos(pa) * (140 + Math.random() * 160),
                      vy: Math.sin(pa) * (140 + Math.random() * 160),
                      color: Math.random() < 0.6 ? '#38bdf8' : '#e0f2fe',
                      size: 4,
                      life: 0,
                      maxLife: 0.8
                    });
                  }
                }
                break;
              }

              default: {
                // Generic fallback
                if (targetMarble) {
                  const target = targetMarble as MarbleEntity;
                  target.hp = Math.max(0, target.hp - 25);
                }
                break;
              }
            }
          }
        }

        // Kinetic Movement (Freeze stops completely!)
        if (isFrozen) {
          m.vx = 0;
          m.vy = 0;
        } else {
          // If poisoned: slow down by 10% as requested!
          const poisonSlow = m.statusEffect?.type === 'poisoned' ? 0.90 : 1.0;
          const minSpeed = 240 * poisonSlow;
          const curSpeed = Math.hypot(m.vx, m.vy);
          if (curSpeed < minSpeed) {
            const boostA = curSpeed > 10 ? Math.atan2(m.vy, m.vx) : Math.random() * Math.PI * 2;
            m.vx = Math.cos(boostA) * (minSpeed + 30);
            m.vy = Math.sin(boostA) * (minSpeed + 30);
          }

          if (curSpeed > m.topSpeed) {
            m.topSpeed = Math.round(curSpeed);
          }

          m.vx *= selectedMap.frictionMultiplier;
          m.vy *= selectedMap.frictionMultiplier;

          m.x += m.vx * poisonSlow * dt;
          m.y += m.vy * poisonSlow * dt;

          if (curSpeed > 80 && Math.random() < 0.7) {
            m.trail.push({ x: m.x, y: m.y, alpha: 0.6 });
            if (m.trail.length > 8) m.trail.shift();
          }
        }

        // BOUNDARY COLLISION HANDLING FOR THE SHAPE (Circle, Square, Hexagon, Octagon)
        handleArenaBoundaryCollision(m, arenaShape, cx, cy, arenaRadius, selectedMap.reboundMultiplier);

        // Draw Marble Trail
        ctx.save();
        m.trail.forEach((pt, ti) => {
          const tRadius = m.radius * (ti / m.trail.length) * 0.7;
          ctx.fillStyle = m.color;
          ctx.globalAlpha = (ti / m.trail.length) * 0.3;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, tRadius, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();

        // 4. DRAW MARBLE WITH UNIQUE GRAPHICAL SKIN & EXPRESSIVE FACE!
        const moveAngle = Math.atan2(m.vy, m.vx);
        const expression = isFrozen ? 'frozen' : isStunned ? 'stunned' : 'battle';

        // Draw Team Halo Ring if in Team Mode
        if (isTeamMode && m.team) {
          ctx.save();
          ctx.strokeStyle = m.team === 'red' ? '#ef4444' : '#0ea5e9';
          ctx.lineWidth = 3.5;
          ctx.shadowColor = m.team === 'red' ? '#ef4444' : '#0ea5e9';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.radius + 6, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // Draw marble with authentic unique power skin
        drawMarbleSkin(ctx, {
          x: m.x,
          y: m.y,
          radius: m.radius,
          color: m.color,
          element: m.power.element,
          powerId: m.power.id,
          angle: moveAngle,
          expression,
          shieldActive: m.statusEffect?.type === 'shielded',
          isClone: Boolean(m.isClone),
          isShrouded: false,
          time: totalTime
        });

        // Floating HP bar above marble
        drawMarbleMiniHpBar(ctx, m);
      }

      // 5. UPDATE & DRAW ACTIVE PROJECTILES (Fireballs, Black Holes, Tornados, Boulders, Anvils, Mines)
      projectilesRef.current = projectilesRef.current.filter(proj => {
        proj.life += dt;
        if (proj.life >= proj.maxLife) return false;

        // BLACK HOLE BEHAVIOR: Sucks all enemy marbles inward!
        if (proj.type === 'blackhole') {
          drawActiveProjectile(ctx, proj, totalTime);
          marbles.forEach(enemy => {
            if (enemy.id !== proj.ownerId && enemy.isAlive && (!isTeamMode || enemy.team !== marbles.find(m => m.id === proj.ownerId)?.team)) {
              const dx = proj.x - enemy.x;
              const dy = proj.y - enemy.y;
              const d = Math.max(20, Math.hypot(dx, dy));
              const pullForce = 260 / d;
              enemy.vx += (dx / d) * pullForce * 18;
              enemy.vy += (dy / d) * pullForce * 18;

              // Core crushing damage
              if (d < proj.radius * 0.7) {
                enemy.hp = Math.max(0, enemy.hp - 18 * dt);
              }
            }
          });
          return true;
        }

        // TORNADO BEHAVIOR: Rotates and flings enemy marbles
        if (proj.type === 'tornado') {
          drawActiveProjectile(ctx, proj, totalTime);
          proj.x += proj.vx * dt;
          proj.y += proj.vy * dt;
          marbles.forEach(enemy => {
            if (enemy.id !== proj.ownerId && enemy.isAlive && (!isTeamMode || enemy.team !== marbles.find(m => m.id === proj.ownerId)?.team)) {
              const dx = proj.x - enemy.x;
              const dy = proj.y - enemy.y;
              const d = Math.max(10, Math.hypot(dx, dy));
              if (d < proj.radius * 1.5) {
                // Angular spin
                const spinA = Math.atan2(dy, dx) + Math.PI / 2;
                enemy.vx += Math.cos(spinA) * 220 * dt;
                enemy.vy += Math.sin(spinA) * 220 * dt;
                enemy.hp = Math.max(0, enemy.hp - 10 * dt);
              }
            }
          });
          return true;
        }

        // POISON POOL BEHAVIOR
        if (proj.type === 'poison_pool') {
          drawActiveProjectile(ctx, proj, totalTime);
          marbles.forEach(enemy => {
            if (enemy.id !== proj.ownerId && enemy.isAlive && (!isTeamMode || enemy.team !== marbles.find(m => m.id === proj.ownerId)?.team)) {
              const dist = Math.hypot(enemy.x - proj.x, enemy.y - proj.y);
              if (dist < proj.radius + enemy.radius) {
                enemy.statusEffect = { type: 'poisoned', duration: 3.0 };
              }
            }
          });
          return true;
        }

        // FISH FOOD BEHAVIOR (Pescador saca pescados cada 3s y recupera 15 HP al comerlos)
        if (proj.type === 'fish_food') {
          proj.x += proj.vx * dt;
          proj.y += proj.vy * dt;
          proj.vx *= 0.94;
          proj.vy *= 0.94;

          drawActiveProjectile(ctx, proj, totalTime);

          // Pescador come su pescado para curarse 15 HP
          const owner = marbles.find(m => m.id === proj.ownerId && m.isAlive);
          if (owner) {
            const dist = Math.hypot(owner.x - proj.x, owner.y - proj.y);
            if (dist < owner.radius + proj.radius + 8) {
              owner.hp = Math.min(owner.maxHp, owner.hp + 15);
              soundManager.playMarbleClick(1.6);

              popupsRef.current.push({
                id: Math.random().toString(),
                x: owner.x,
                y: owner.y - 22,
                text: '🐟 +15 HP (¡Pescado Fresco!)',
                color: '#10b981',
                lifetime: 0,
                scale: 1.4,
                isCrit: true
              });

              // Chispas de curación acuática y verde
              for (let hp = 0; hp < 8; hp++) {
                particlesRef.current.push({
                  x: owner.x + (Math.random() - 0.5) * owner.radius,
                  y: owner.y + (Math.random() - 0.5) * owner.radius,
                  vx: (Math.random() - 0.5) * 50,
                  vy: -40 - Math.random() * 30,
                  color: hp % 2 === 0 ? '#10b981' : '#38bdf8',
                  size: 3.5,
                  life: 0,
                  maxLife: 0.7
                });
              }

              return false; // Pez consumido!
            }
          }
          return true;
        }

        // FISHING HOOK BEHAVIOR (Dibuja la caña, sedal tenso vibrante y anzuelo sobre la víctima)
        if (proj.type === 'fishing_hook') {
          const owner = marbles.find(m => m.id === proj.ownerId);
          const target = marbles.find(m => m.id === proj.targetId);

          if (owner && target) {
            ctx.save();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.lineWidth = 2.4;
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 8;

            const pullProgress = proj.life / proj.maxLife;
            const midX = (owner.x + target.x) / 2 + Math.sin(pullProgress * Math.PI * 6) * 14;
            const midY = (owner.y + target.y) / 2 - 25;

            ctx.beginPath();
            ctx.moveTo(owner.x, owner.y);
            ctx.quadraticCurveTo(midX, midY, target.x, target.y);
            ctx.stroke();

            // Anzuelo brillante sobre el objetivo
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(target.x, target.y, 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
          }
          return true;
        }

        // LANDMINE BEHAVIOR
        if (proj.type === 'landmine') {
          drawActiveProjectile(ctx, proj, totalTime);
          for (let m of marbles) {
            if (m.id !== proj.ownerId && m.isAlive && (!isTeamMode || m.team !== marbles.find(o => o.id === proj.ownerId)?.team)) {
              const d = Math.hypot(m.x - proj.x, m.y - proj.y);
              if (d < proj.radius + m.radius) {
                // Detonate mine!
                m.hp = Math.max(0, m.hp - proj.damage);
                soundManager.playHeavyImpact(1.0);
                traumaRef.current = 0.6;
                popupsRef.current.push({
                  id: Math.random().toString(),
                  x: proj.x,
                  y: proj.y - 15,
                  text: '💥 ¡MINA!',
                  color: '#f59e0b',
                  lifetime: 0,
                  scale: 1.4,
                  isCrit: true
                });
                return false;
              }
            }
          }
          return true;
        }

        // LASER BEAM BEHAVIOR
        if (proj.type === 'laser') {
          const owner = marbles.find(m => m.id === proj.ownerId);
          const target = marbles.find(m => m.id === proj.targetId);
          if (owner && target && target.isAlive) {
            // Draw continuous piercing beam
            ctx.save();
            ctx.strokeStyle = '#f43f5e';
            ctx.lineWidth = 6;
            ctx.shadowColor = '#e11d48';
            ctx.shadowBlur = 18;
            ctx.beginPath();
            ctx.moveTo(owner.x, owner.y);
            ctx.lineTo(target.x, target.y);
            ctx.stroke();

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();

            target.hp = Math.max(0, target.hp - 28 * dt);
            owner.damageDealt += 28 * dt;
          }
          return true;
        }

        // ANVIL FALL BEHAVIOR
        if (proj.type === 'anvil') {
          proj.y += proj.vy * dt;
          drawActiveProjectile(ctx, proj, totalTime);
          const groundY = proj.extra?.groundY || cy;
          if (proj.y >= groundY) {
            // Anvil lands with loud CLANG!
            soundManager.playHeavyImpact(1.2);
            traumaRef.current = 0.8;
            const target = marbles.find(m => m.id === proj.targetId);
            if (target && target.isAlive) {
              target.hp = Math.max(0, target.hp - proj.damage);
              target.statusEffect = { type: 'emp', duration: 2.0 }; // Stunned
              popupsRef.current.push({
                id: Math.random().toString(),
                x: target.x,
                y: target.y - 20,
                text: '🔨 ¡APLASTADO!',
                color: '#94a3b8',
                lifetime: 0,
                scale: 1.5,
                isCrit: true
              });
            }
            return false;
          }
          return true;
        }

        // Standard Moving Projectiles (Fireball, Frost Spear, Boulder)
        proj.x += proj.vx * dt;
        proj.y += proj.vy * dt;
        drawActiveProjectile(ctx, proj, totalTime);

        // Check Hit against Enemy Marbles
        for (let m of marbles) {
          if (m.id !== proj.ownerId && m.isAlive) {
            // Team check in team mode
            if (isTeamMode && m.team && marbles.find(o => o.id === proj.ownerId)?.team === m.team) {
              continue;
            }

            const hitDist = Math.hypot(m.x - proj.x, m.y - proj.y);
            if (hitDist < proj.radius + m.radius) {
              if (m.statusEffect?.type !== 'shielded') {
                const finalDmg = proj.damage;
                m.hp = Math.max(0, m.hp - finalDmg);

                const owner = marbles.find(o => o.id === proj.ownerId);
                if (owner) owner.damageDealt += finalDmg;

                if (proj.type === 'frost_spear') {
                  m.statusEffect = { type: 'frozen', duration: 2.8 };
                  soundManager.playMarbleClick(1.2);
                  popupsRef.current.push({
                    id: Math.random().toString(),
                    x: m.x,
                    y: m.y - 20,
                    text: '❄️ ¡CONGELADO!',
                    color: '#38bdf8',
                    lifetime: 0,
                    scale: 1.4,
                    isCrit: true
                  });
                } else if (proj.type === 'fireball') {
                  soundManager.playHeavyImpact(0.85);
                  popupsRef.current.push({
                    id: Math.random().toString(),
                    x: m.x,
                    y: m.y - 20,
                    text: `-${finalDmg} FUEGO`,
                    color: '#f97316',
                    lifetime: 0,
                    scale: 1.3,
                    isCrit: true
                  });
                } else {
                  soundManager.playHeavyImpact(0.9);
                }
              } else {
                // Deflected by shield
                soundManager.playMarbleClick(1.5);
                popupsRef.current.push({
                  id: Math.random().toString(),
                  x: m.x,
                  y: m.y - 20,
                  text: '🛡️ ¡ESCUDO!',
                  color: '#38bdf8',
                  lifetime: 0,
                  scale: 1.2,
                  isCrit: false
                });
              }

              return false; // Remove projectile on hit
            }
          }
        }

        return true;
      });

      // 6. MARBLE-TO-MARBLE COLLISIONS (Elastic Rigid Body + Shatter Mechanics + Team Friendly Fire Disabled)
      for (let i = 0; i < marbles.length; i++) {
        for (let j = i + 1; j < marbles.length; j++) {
          const m1 = marbles[i];
          const m2 = marbles[j];
          if (!m1.isAlive || !m2.isAlive) continue;

          const dx = m2.x - m1.x;
          const dy = m2.y - m1.y;
          const dist = Math.hypot(dx, dy);

          if (dist < m1.radius + m2.radius) {
            // Separation
            const overlap = (m1.radius + m2.radius) - dist;
            const nx = dx / dist;
            const ny = dy / dist;

            m1.x -= nx * overlap * 0.5;
            m1.y -= ny * overlap * 0.5;
            m2.x += nx * overlap * 0.5;
            m2.y += ny * overlap * 0.5;

            // Momentum transfer
            const kx = m1.vx - m2.vx;
            const ky = m1.vy - m2.vy;
            const p = 2 * (nx * kx + ny * ky) / (m1.mass + m2.mass);

            m1.vx -= p * m2.mass * nx;
            m1.vy -= p * m2.mass * ny;
            m2.vx += p * m1.mass * nx;
            m2.vy += p * m1.mass * ny;

            const impactSpeed = Math.hypot(kx, ky);
            // Play distinct sound effect corresponding to the striking marble's power!
            const strikingMarble = Math.hypot(m1.vx, m1.vy) >= Math.hypot(m2.vx, m2.vy) ? m1 : m2;
            soundManager.playMarbleHitSound(strikingMarble.power.id, Math.min(1.5, impactSpeed / 220));
            traumaRef.current = Math.min(1.0, traumaRef.current + 0.15);

            // TEAM FRIENDLY FIRE: Teammates bounce without dealing damage!
            const isFriendlyFire = isTeamMode && m1.team && m2.team && m1.team === m2.team;

            // CLONE FRIENDLY FIRE: Los clones de la canica de clonación no se hacen daño entre sí ni a su maestro!
            const isCloneKin = Boolean(
              (m1.isClone && m1.masterId === m2.id) ||
              (m2.isClone && m2.masterId === m1.id) ||
              (m1.isClone && m2.isClone && m1.masterId === m2.masterId)
            );

            if (isFriendlyFire || isCloneKin) {
              continue;
            }

            // Shatter bonus if hitting a frozen marble!
            let shatterBonusM1 = 1.0;
            let shatterBonusM2 = 1.0;
            if (m1.statusEffect?.type === 'frozen') {
              m1.statusEffect = undefined;
              shatterBonusM1 = 1.6;
              soundManager.playHeavyImpact(1.0);
              popupsRef.current.push({
                id: Math.random().toString(),
                x: m1.x,
                y: m1.y - 25,
                text: '💥 ¡ROTO!',
                color: '#38bdf8',
                lifetime: 0,
                scale: 1.5,
                isCrit: true
              });
            }
            if (m2.statusEffect?.type === 'frozen') {
              m2.statusEffect = undefined;
              shatterBonusM2 = 1.6;
              soundManager.playHeavyImpact(1.0);
              popupsRef.current.push({
                id: Math.random().toString(),
                x: m2.x,
                y: m2.y - 25,
                text: '💥 ¡ROTO!',
                color: '#38bdf8',
                lifetime: 0,
                scale: 1.5,
                isCrit: true
              });
            }

            // Collision Damage
            const baseDamage = Math.max(6, Math.round(7 + (impactSpeed / 75) * m1.mass));
            
            // Pescador quita 30 de daño al chocar contra otra bola!
            const rawDmgToM2 = m1.power.id === 'legend-fisherman' ? 30 : Math.round(baseDamage * shatterBonusM2);
            const rawDmgToM1 = m2.power.id === 'legend-fisherman' ? 30 : Math.round(baseDamage * shatterBonusM1);

            const dmgToM2 = m2.statusEffect?.type === 'shielded' ? 0 : rawDmgToM2;
            const dmgToM1 = m1.statusEffect?.type === 'shielded' ? 0 : rawDmgToM1;

            m1.hp = Math.max(0, m1.hp - dmgToM1);
            m2.hp = Math.max(0, m2.hp - dmgToM2);

            m1.damageDealt += dmgToM2;
            m2.damageDealt += dmgToM1;

            // Damage popup
            if (m1.power.id === 'legend-fisherman' && dmgToM2 > 0) {
              popupsRef.current.push({
                id: Math.random().toString(),
                x: m2.x,
                y: m2.y - 22,
                text: '💥 -30 (GOLPE PESCADOR)',
                color: '#38bdf8',
                lifetime: 0,
                scale: 1.5,
                isCrit: true
              });
            } else if (m2.power.id === 'legend-fisherman' && dmgToM1 > 0) {
              popupsRef.current.push({
                id: Math.random().toString(),
                x: m1.x,
                y: m1.y - 22,
                text: '💥 -30 (GOLPE PESCADOR)',
                color: '#38bdf8',
                lifetime: 0,
                scale: 1.5,
                isCrit: true
              });
            } else {
              popupsRef.current.push({
                id: Math.random().toString(),
                x: (m1.x + m2.x) / 2,
                y: (m1.y + m2.y) / 2 - 10,
                text: `-${dmgToM2}`,
                color: '#ffffff',
                lifetime: 0,
                scale: 1.0,
                isCrit: false
              });
            }

            // Knockout check: instant elimination as soon as HP reaches 0 (no 15s delay!)
            if (m1.hp <= 0 && m1.isAlive) {
              m1.isAlive = false;
              m2.kills += 1;
              soundManager.playKnockoutHit();
              traumaRef.current = 0.8;
            }
            if (m2.hp <= 0 && m2.isAlive) {
              m2.isAlive = false;
              m1.kills += 1;
              soundManager.playKnockoutHit();
              traumaRef.current = 0.8;
            }
          }
        }
      }

      // 7. VICTORY CONDITION CHECK (Respects Team Mode & immediate knockout)
      const livingRealMarbles = marbles.filter(m => m.isAlive && !m.isClone);

      if (!matchFinishedRef.current) {
        if (isTeamMode) {
          // Team victory check
          const redSurvivors = livingRealMarbles.filter(m => m.team === 'red');
          const blueSurvivors = livingRealMarbles.filter(m => m.team === 'blue');

          if (redSurvivors.length === 0 && blueSurvivors.length > 0) {
            matchFinishedRef.current = true;
            soundManager.playEggHatchFanfare('Legendary');
            setTimeout(() => {
              onVictory(blueSurvivors[0]);
            }, 500);
          } else if (blueSurvivors.length === 0 && redSurvivors.length > 0) {
            matchFinishedRef.current = true;
            soundManager.playEggHatchFanfare('Legendary');
            setTimeout(() => {
              onVictory(redSurvivors[0]);
            }, 500);
          } else if (redSurvivors.length === 0 && blueSurvivors.length === 0) {
            // Draw / Simultaneous tiebreaker
            matchFinishedRef.current = true;
            const champion = [...marbles.filter(m => !m.isClone)].sort((a, b) => b.damageDealt - a.damageDealt)[0] || marbles[0];
            soundManager.playEggHatchFanfare('Legendary');
            setTimeout(() => {
              onVictory(champion);
            }, 500);
          }
        } else {
          // FFA Victory check
          if (livingRealMarbles.length === 1) {
            matchFinishedRef.current = true;
            const champion = livingRealMarbles[0];
            soundManager.playEggHatchFanfare('Legendary');
            setTimeout(() => {
              onVictory(champion);
            }, 500);
          } else if (livingRealMarbles.length === 0) {
            matchFinishedRef.current = true;
            const champion = [...marbles.filter(m => !m.isClone)].sort((a, b) => b.damageDealt - a.damageDealt)[0] || marbles[0];
            soundManager.playEggHatchFanfare('Legendary');
            setTimeout(() => {
              onVictory(champion);
            }, 500);
          }
        }
      }

      // 8. UPDATE POPUPS
      popupsRef.current = popupsRef.current.filter(p => {
        p.lifetime += rawDt;
        p.y -= 35 * rawDt;
        if (p.lifetime > 0.85) return false;

        ctx.save();
        ctx.font = `${p.isCrit ? 'bold 15px' : '600 13px'} "Outfit", sans-serif`;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.textAlign = 'center';
        ctx.globalAlpha = 1.0 - (p.lifetime / 0.85);
        ctx.fillText(p.text, p.x, p.y);
        ctx.restore();
        return true;
      });

      // 9. UPDATE PARTICLES
      particlesRef.current = particlesRef.current.filter(part => {
        part.life += rawDt;
        part.x += part.vx * rawDt;
        part.y += part.vy * rawDt;
        if (part.life >= part.maxLife) return false;

        ctx.save();
        ctx.fillStyle = part.color;
        ctx.globalAlpha = 1 - (part.life / part.maxLife);
        ctx.beginPath();
        ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return true;
      });

      ctx.restore(); // Undo screen shake

      // Sync HUD telemetry
      setHudMarbles([...marbles.filter(m => !m.isClone)]);

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      running = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [config, arenaWidth, arenaHeight, arenaShape, selectedMap, onVictory, currentLang, isTeamMode]);

  // Handle Mouse Move over Canvas to detect hovered marble and show stats tooltip
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    const found = marblesRef.current.find(m => {
      if (!m.isAlive) return false;
      return Math.hypot(m.x - mx, m.y - my) <= m.radius + 14;
    });

    if (found) {
      setHoveredInfo({
        marble: found,
        screenX: e.clientX,
        screenY: e.clientY,
        isRival: false
      });
    } else {
      setHoveredInfo(null);
    }
  };

  const handleCanvasMouseLeave = () => {
    setHoveredInfo(null);
  };

  return (
    <div className="space-y-3 max-w-7xl mx-auto w-full animate-in fade-in duration-200">
      {/* TOP BATTLE BAR: Telemetry HUD, Timer (00:00 / 01:00), Shape Selector, and Exit */}
      <div className="p-3 sm:p-4 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          {/* Back / Surrender Button */}
          <div className="flex items-center gap-2">
            {isComp ? (
              <button
                onClick={() => {
                  if (onRequestSurrender) onRequestSurrender();
                  else onBackToMenu();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/80 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-600 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Rendirse (-30 ELO)</span>
              </button>
            ) : (
              <button
                onClick={onBackToMenu}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t.mainMenu}</span>
              </button>
            )}

            {/* Shape Selector Toggle (Circle, Square, Hexagon, Octagon) */}
            <button
              onClick={handleCycleShape}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Cambiar forma de la arena (Círculo, Cuadrado, Hexágono, Octógono)"
            >
              {arenaShape === 'circle' && <Circle className="w-3.5 h-3.5" />}
              {arenaShape === 'square' && <Square className="w-3.5 h-3.5" />}
              {arenaShape === 'hexagon' && <Hexagon className="w-3.5 h-3.5" />}
              {arenaShape === 'octagon' && <Octagon className="w-3.5 h-3.5" />}
              <span className="capitalize">{arenaShape}</span>
            </button>

            {/* Mode Badge if Team mode */}
            {isTeamMode && (
              <div className="px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-600 text-purple-200 text-xs font-bold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span>Modo {gameMode.toUpperCase()}</span>
              </div>
            )}
          </div>

          {/* CHRONOMETER TIMER (15s minimum, 60s maximum!) */}
          <div className="flex items-center gap-2">
            {isSuddenDeath && (
              <div className="px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500 text-rose-300 text-xs font-black animate-pulse flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>¡MUERTE SÚBITA!</span>
              </div>
            )}

            <div className={`px-3 py-1.5 rounded-2xl border font-mono text-xs font-black flex items-center gap-1.5 ${
              isSuddenDeath 
                ? 'bg-rose-950/80 border-rose-600 text-rose-200' 
                : 'bg-slate-950/80 border-slate-800 text-slate-200'
            }`}>
              <Timer className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {Math.floor(displaySeconds / 60).toString().padStart(2, '0')}:{(displaySeconds % 60).toString().padStart(2, '0')} / 01:00
              </span>
            </div>
          </div>
        </div>

        {/* MARBLES HEALTH HUD */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-1">
          {hudMarbles.map((m) => {
            const hpPercent = Math.max(0, Math.min(100, (m.hp / m.maxHp) * 100));
            const isFrozen = m.statusEffect?.type === 'frozen';
            const isPoisoned = m.statusEffect?.type === 'poisoned';

            return (
              <div
                key={m.id}
                onMouseEnter={(e) => {
                  setHoveredInfo({
                    marble: m,
                    screenX: e.clientX,
                    screenY: e.clientY,
                    isRival: false
                  });
                }}
                onMouseLeave={() => setHoveredInfo(null)}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${
                  !m.isAlive
                    ? 'opacity-40 bg-slate-950/60 border-slate-900 grayscale'
                    : isFrozen
                      ? 'bg-sky-950/40 border-sky-500 shadow-md shadow-sky-500/10'
                      : isPoisoned
                        ? 'bg-lime-950/40 border-lime-500 shadow-md shadow-lime-500/10'
                        : m.team === 'red'
                          ? 'bg-rose-950/30 border-rose-600/70'
                          : m.team === 'blue'
                            ? 'bg-sky-950/30 border-sky-600/70'
                            : 'bg-slate-950/80 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className="w-6 h-6 rounded-full flex-shrink-0 border-2 shadow-md relative flex items-center justify-center overflow-hidden"
                    style={{
                      background: m.color,
                      borderColor: (m.team === 'red' ? '#ef4444' : m.team === 'blue' ? '#0ea5e9' : '#ffffff')
                    }}
                  >
                    {isFrozen && <span className="absolute -top-1 -right-1 text-[10px]">❄️</span>}
                    {isPoisoned && <span className="absolute -top-1 -right-1 text-[10px]">☠️</span>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-white truncate block">
                      {m.name}
                    </span>
                    <span className="text-[10px] font-mono block" style={{ color: (m.team === 'red' ? '#f87171' : m.team === 'blue' ? '#38bdf8' : '#94a3b8') }}>
                      {m.team ? (m.team === 'red' ? '🔴 ROJO' : '🔵 AZUL') : m.power.element}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-black text-amber-400">
                    {Math.round(m.hp)} HP
                  </span>
                </div>

                {/* HP Progress Bar */}
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-150 ${
                      hpPercent > 50
                        ? (m.team === 'red' ? 'bg-rose-500' : m.team === 'blue' ? 'bg-sky-500' : 'bg-emerald-500')
                        : hpPercent > 20
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                    }`}
                    style={{ width: `${hpPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ARENA CANVAS: Clean, open, unobstructed battlefield with cursor hover detection */}
      <div className="relative flex justify-center items-center overflow-hidden rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl p-2 sm:p-4">
        <canvas
          ref={canvasRef}
          width={arenaWidth}
          height={arenaHeight}
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={handleCanvasMouseLeave}
          className="rounded-2xl shadow-inner max-w-full h-auto cursor-crosshair touch-none"
        />

        {/* Hover Tooltip Overlay for Marbles in Canvas or HUD */}
        {hoveredInfo && (
          <div
            className="fixed z-50 pointer-events-none w-72 sm:w-80 p-4 rounded-2xl bg-slate-900/95 border-2 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
            style={{
              left: Math.min(window.innerWidth - 330, Math.max(16, hoveredInfo.screenX + 16)),
              top: Math.min(window.innerHeight - 290, Math.max(16, hoveredInfo.screenY + 16)),
              borderColor: hoveredInfo.marble.color
            }}
          >
            {/* Tooltip Header */}
            <div className="flex items-center gap-3 pb-2.5 border-b border-slate-800">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-black shadow-md border-2 shrink-0"
                style={{
                  background: hoveredInfo.marble.color,
                  borderColor: '#ffffff'
                }}
              >
                <span className="text-white text-xs">{hoveredInfo.marble.power.element.slice(0, 2).toUpperCase()}</span>
              </div>

              <div className="min-w-0 flex-1">
                <h4 className={`text-sm font-black truncate ${getRarityTextClass(hoveredInfo.marble.power.rarity)}`}>
                  {hoveredInfo.marble.name}
                </h4>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    hoveredInfo.marble.power.rarity === 'Legendary'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : hoveredInfo.marble.power.rarity === 'Epic'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                      : hoveredInfo.marble.power.rarity === 'Rare'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {hoveredInfo.marble.power.rarity === 'Legendary' ? '👑 Legendario' : hoveredInfo.marble.power.rarity === 'Epic' ? '⚡ Épico' : hoveredInfo.marble.power.rarity === 'Rare' ? '💎 Raro' : '🛡️ Común'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {hoveredInfo.marble.power.element}
                  </span>
                </div>
              </div>
            </div>

            {/* Tooltip Body: Force Points & Combat Attributes */}
            <div className="py-2.5 space-y-2 text-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Puntos de Fuerza & Atributos
              </div>
              <div className="grid grid-cols-2 gap-2 font-mono">
                <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">💥 Fuerza de Daño:</span>
                  <span className="font-bold text-amber-400 text-xs">
                    {hoveredInfo.marble.power.damageValue} PTS
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">⚡ Empuje (Knockback):</span>
                  <span className="font-bold text-cyan-400 text-xs">
                    x{hoveredInfo.marble.power.knockbackMultiplier}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">❤️ Salud (HP):</span>
                  <span className="font-bold text-emerald-400 text-xs">
                    {Math.round(hoveredInfo.marble.hp)} / {hoveredInfo.marble.maxHp}
                  </span>
                </div>

                <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">⏱️ Recarga Poder:</span>
                  <span className="font-bold text-purple-400 text-xs">
                    {hoveredInfo.marble.power.cooldownSeconds}s
                  </span>
                </div>
              </div>

              {/* Ability Impact Description */}
              <div className="pt-1 border-t border-slate-800/80">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  Habilidad: {hoveredInfo.marble.power.name}
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {hoveredInfo.marble.power.combatImpact}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Draws the outline path of the selected Arena Shape (Circle, Square, Hexagon, Octagon)
 */
function drawArenaShapePath(
  ctx: CanvasRenderingContext2D,
  shape: ArenaShape,
  cx: number,
  cy: number,
  r: number
) {
  if (shape === 'circle') {
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
  } else if (shape === 'square') {
    const s = r * 0.92;
    ctx.rect(cx - s, cy - s, s * 2, s * 2);
  } else if (shape === 'hexagon') {
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  } else {
    // Octagon
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }
}

/**
 * Handles precision collision and velocity reflection with the arena boundaries
 */
function handleArenaBoundaryCollision(
  m: MarbleEntity,
  shape: ArenaShape,
  cx: number,
  cy: number,
  r: number,
  rebound: number = 1.05
) {
  if (shape === 'circle') {
    const dist = Math.hypot(m.x - cx, m.y - cy);
    if (dist + m.radius > r) {
      const nx = (m.x - cx) / dist;
      const ny = (m.y - cy) / dist;
      m.x = cx + nx * (r - m.radius);
      m.y = cy + ny * (r - m.radius);

      const dot = m.vx * nx + m.vy * ny;
      if (dot > 0) {
        m.vx -= (1 + rebound) * dot * nx;
        m.vy -= (1 + rebound) * dot * ny;
        soundManager.playMarbleClick(0.5);
      }
    }
  } else if (shape === 'square') {
    const s = r * 0.92;
    const minX = cx - s + m.radius;
    const maxX = cx + s - m.radius;
    const minY = cy - s + m.radius;
    const maxY = cy + s - m.radius;

    if (m.x < minX) {
      m.x = minX;
      m.vx = Math.abs(m.vx) * rebound;
      soundManager.playMarbleClick(0.5);
    } else if (m.x > maxX) {
      m.x = maxX;
      m.vx = -Math.abs(m.vx) * rebound;
      soundManager.playMarbleClick(0.5);
    }

    if (m.y < minY) {
      m.y = minY;
      m.vy = Math.abs(m.vy) * rebound;
      soundManager.playMarbleClick(0.5);
    } else if (m.y > maxY) {
      m.y = maxY;
      m.vy = -Math.abs(m.vy) * rebound;
      soundManager.playMarbleClick(0.5);
    }
  } else if (shape === 'hexagon') {
    const sideDist = r * Math.cos(Math.PI / 6);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const nx = Math.cos(a);
      const ny = Math.sin(a);
      const distAlongNormal = (m.x - cx) * nx + (m.y - cy) * ny;

      if (distAlongNormal + m.radius > sideDist) {
        const push = (distAlongNormal + m.radius) - sideDist;
        m.x -= nx * push;
        m.y -= ny * push;

        const dot = m.vx * nx + m.vy * ny;
        if (dot > 0) {
          m.vx -= (1 + rebound) * dot * nx;
          m.vy -= (1 + rebound) * dot * ny;
          soundManager.playMarbleClick(0.5);
        }
      }
    }
  } else {
    // Octagon
    const sideDist = r * Math.cos(Math.PI / 8);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
      const nx = Math.cos(a);
      const ny = Math.sin(a);
      const distAlongNormal = (m.x - cx) * nx + (m.y - cy) * ny;

      if (distAlongNormal + m.radius > sideDist) {
        const push = (distAlongNormal + m.radius) - sideDist;
        m.x -= nx * push;
        m.y -= ny * push;

        const dot = m.vx * nx + m.vy * ny;
        if (dot > 0) {
          m.vx -= (1 + rebound) * dot * nx;
          m.vy -= (1 + rebound) * dot * ny;
          soundManager.playMarbleClick(0.5);
        }
      }
    }
  }
}

/**
 * Draws floating miniature HP bar and status icon over each marble in arena
 */
function drawMarbleMiniHpBar(ctx: CanvasRenderingContext2D, m: MarbleEntity) {
  ctx.save();
  const barW = m.radius * 1.6;
  const barH = 3.5;
  const barX = m.x - barW / 2;
  const barY = m.y - m.radius - 12;

  const hpFrac = Math.max(0, Math.min(1, m.hp / m.maxHp));

  // Background
  ctx.fillStyle = 'rgba(2, 6, 23, 0.75)';
  ctx.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);

  // Health fill
  ctx.fillStyle = hpFrac > 0.5 ? '#10b981' : hpFrac > 0.25 ? '#f59e0b' : '#ef4444';
  ctx.fillRect(barX, barY, barW * hpFrac, barH);

  // Status icon if frozen, poisoned, or shielded
  if (m.statusEffect?.type === 'frozen') {
    ctx.fillStyle = '#38bdf8';
    ctx.font = '10px sans-serif';
    ctx.fillText('❄️', m.x - 5, barY - 3);
  } else if (m.statusEffect?.type === 'poisoned') {
    ctx.fillStyle = '#84cc16';
    ctx.font = '10px sans-serif';
    ctx.fillText('☠️', m.x - 5, barY - 3);
  } else if (m.statusEffect?.type === 'shielded') {
    ctx.fillStyle = '#38bdf8';
    ctx.font = '10px sans-serif';
    ctx.fillText('🛡️', m.x - 5, barY - 3);
  }

  ctx.restore();
}

/**
 * Draws moving elemental projectiles & arena objects (Fireballs, Black Holes, Tornados, Boulders, Anvils, Mines)
 */
function drawActiveProjectile(
  ctx: CanvasRenderingContext2D,
  proj: PowerProjectile,
  time: number
) {
  ctx.save();
  ctx.translate(proj.x, proj.y);

  if (proj.type === 'fireball') {
    ctx.shadowColor = '#f97316';
    ctx.shadowBlur = 18;

    const fireGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, proj.radius);
    fireGrad.addColorStop(0, '#ffffff');
    fireGrad.addColorStop(0.3, '#facc15');
    fireGrad.addColorStop(0.7, '#ea580c');
    fireGrad.addColorStop(1, 'rgba(220, 38, 38, 0)');

    ctx.fillStyle = fireGrad;
    ctx.beginPath();
    ctx.arc(0, 0, proj.radius, 0, Math.PI * 2);
    ctx.fill();

  } else if (proj.type === 'frost_spear') {
    const angle = Math.atan2(proj.vy, proj.vx);
    ctx.rotate(angle);
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 14;

    ctx.fillStyle = '#e0f2fe';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(proj.radius * 1.5, 0);
    ctx.lineTo(-proj.radius * 0.8, -proj.radius * 0.5);
    ctx.lineTo(-proj.radius * 0.5, 0);
    ctx.lineTo(-proj.radius * 0.8, proj.radius * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

  } else if (proj.type === 'boulder') {
    ctx.shadowColor = '#78350f';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(0, 0, proj.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-proj.radius * 0.5, -proj.radius * 0.3);
    ctx.lineTo(proj.radius * 0.3, proj.radius * 0.4);
    ctx.stroke();

  } else if (proj.type === 'blackhole') {
    // Swirling Black Hole with accretion disk
    const spin = time * 4;
    ctx.shadowColor = '#a855f7';
    ctx.shadowBlur = 24;

    // Accretion disk
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.7)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.ellipse(0, 0, proj.radius, proj.radius * 0.35, spin, 0, Math.PI * 2);
    ctx.stroke();

    // Event horizon core
    ctx.fillStyle = '#090014';
    ctx.beginPath();
    ctx.arc(0, 0, proj.radius * 0.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 2;
    ctx.stroke();

  } else if (proj.type === 'tornado') {
    // Whirling emerald green cyclone blades
    const spin = time * 8;
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 16;
    for (let w = 0; w < 4; w++) {
      const wa = (w / 4) * Math.PI * 2 + spin;
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.8)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, proj.radius * (0.4 + w * 0.15), wa, wa + Math.PI * 0.6);
      ctx.stroke();
    }

  } else if (proj.type === 'poison_pool') {
    // Bubbling toxic acid pool
    const pAlpha = Math.max(0, 1 - proj.life / proj.maxLife);
    ctx.fillStyle = `rgba(132, 204, 22, ${0.45 * pAlpha})`;
    ctx.strokeStyle = `rgba(163, 230, 53, ${0.85 * pAlpha})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, proj.radius, proj.radius * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

  } else if (proj.type === 'landmine') {
    // Blinking proximity mine
    const blink = Math.sin(time * 12) > 0;
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = blink ? '#ef4444' : '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = blink ? 12 : 4;
    ctx.beginPath();
    ctx.arc(0, 0, proj.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = blink ? '#ef4444' : '#334155';
    ctx.beginPath();
    ctx.arc(0, 0, proj.radius * 0.4, 0, Math.PI * 2);
    ctx.fill();

  } else if (proj.type === 'anvil') {
    // 100-TON Cartoon Anvil stamped
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 10;

    // Anvil shape
    ctx.beginPath();
    ctx.moveTo(-proj.radius, -proj.radius * 0.6);
    ctx.lineTo(proj.radius * 1.2, -proj.radius * 0.6);
    ctx.lineTo(proj.radius * 0.6, 0);
    ctx.lineTo(proj.radius * 0.8, proj.radius * 0.6);
    ctx.lineTo(-proj.radius * 0.8, proj.radius * 0.6);
    ctx.lineTo(-proj.radius * 0.5, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 8px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('100T', 0, 2);

  } else if (proj.type === 'nuke') {
    // Megaton blast mushroom cloud
    const nProg = proj.life / proj.maxLife;
    const nRadius = proj.radius * (0.4 + nProg * 0.8);
    const nAlpha = Math.max(0, 1 - nProg);

    ctx.shadowColor = '#f97316';
    ctx.shadowBlur = 30;

    ctx.fillStyle = `rgba(239, 68, 68, ${0.5 * nAlpha})`;
    ctx.beginPath();
    ctx.arc(0, 0, nRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `rgba(254, 240, 138, ${0.8 * nAlpha})`;
    ctx.beginPath();
    ctx.arc(0, 0, nRadius * 0.5, 0, Math.PI * 2);
    ctx.fill();

  } else if (proj.type === 'fish_food') {
    // Pez saltarín con escamas, cola aleteante, aleta dorsal y brillo curativo
    const flop = Math.sin(time * 10 + (proj.extra?.flopPhase || 0));
    ctx.rotate(flop * 0.22);
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 10;

    // Cuerpo con gradiente marino
    const fishGrad = ctx.createLinearGradient(-proj.radius, 0, proj.radius, 0);
    fishGrad.addColorStop(0, '#0284c7');
    fishGrad.addColorStop(0.5, '#38bdf8');
    fishGrad.addColorStop(1, '#f97316');
    ctx.fillStyle = fishGrad;

    ctx.beginPath();
    ctx.ellipse(0, 0, proj.radius * 1.15, proj.radius * 0.65, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Cola aleteante
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(proj.radius * 0.9, 0);
    ctx.lineTo(proj.radius * 1.5, -proj.radius * 0.55 + flop * 3);
    ctx.lineTo(proj.radius * 1.5, proj.radius * 0.55 + flop * 3);
    ctx.closePath();
    ctx.fill();

    // Ojo del pez
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-proj.radius * 0.55, -proj.radius * 0.18, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-proj.radius * 0.55, -proj.radius * 0.18, 1.4, 0, Math.PI * 2);
    ctx.fill();

    // Aleta dorsal
    ctx.fillStyle = '#0ea5e9';
    ctx.beginPath();
    ctx.moveTo(-proj.radius * 0.2, -proj.radius * 0.6);
    ctx.lineTo(proj.radius * 0.2, -proj.radius * 0.95);
    ctx.lineTo(proj.radius * 0.4, -proj.radius * 0.5);
    ctx.closePath();
    ctx.fill();

    // Texto de curación +15 HP
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('+15 HP', 0, -proj.radius * 1.15);

  } else {
    ctx.fillStyle = proj.color;
    ctx.shadowColor = proj.color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(0, 0, proj.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
