import React, { useRef, useEffect, useState, useCallback } from 'react';
import { MARBLE_POWERS } from '../data/powersData';
import { MarbleEntity, MarblePower, HazardObstacle, DamagePopup, Particle } from '../types/game';
import { soundManager } from '../utils/audioSystem';
import { 
  Play, 
  RotateCcw, 
  Zap, 
  Volume2, 
  VolumeX, 
  Smartphone, 
  Monitor, 
  Flame, 
  Sparkles, 
  Trophy, 
  Crosshair,
  Shield,
  Layers,
  FastForward
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PlayableArenaSandboxProps {
  onOpenHighlightClipper?: (winnerName: string, powerName: string) => void;
}

export const PlayableArenaSandbox: React.FC<PlayableArenaSandboxProps> = ({
  onOpenHighlightClipper
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Viewport mode: 16:9 arena or 9:16 vertical TikTok mobile screen
  const [isVerticalView, setIsVerticalView] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [matchState, setMatchState] = useState<'IDLE' | 'PLAYING' | 'SLOWMO' | 'VICTORY'>('IDLE');
  const [winner, setWinner] = useState<MarbleEntity | null>(null);
  const [selectedPlayerPower, setSelectedPlayerPower] = useState<MarblePower>(MARBLE_POWERS[0]); // Fire
  const [activeMarblesCount, setActiveMarblesCount] = useState<number>(4);

  // Slingshot aiming drag state
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragCurrentRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Camera Shake & Slow Mo Trauma State
  const traumaRef = useRef<number>(0);
  const slowMoFactorRef = useRef<number>(1.0);
  const slowMoTargetRef = useRef<number>(1.0);
  const slowMoTimerRef = useRef<number>(0);

  // Physics Simulation Refs
  const marblesRef = useRef<MarbleEntity[]>([]);
  const hazardsRef = useRef<HazardObstacle[]>([]);
  const popupsRef = useRef<DamagePopup[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Setup arena entities
  const initArena = useCallback(() => {
    const width = isVerticalView ? 380 : 800;
    const height = isVerticalView ? 620 : 500;

    // Player Marble (Starts at bottom slingshot pad)
    const player: MarbleEntity = {
      id: 'player-marble',
      name: 'Player Marble',
      x: width / 2,
      y: height - 90,
      vx: 0,
      vy: 0,
      radius: 18,
      mass: 1.0,
      hp: 350,
      maxHp: 350,
      energy: 50,
      maxEnergy: 100,
      cooldown: 0,
      maxCooldown: selectedPlayerPower.cooldownSeconds,
      color: selectedPlayerPower.colorHex,
      power: selectedPlayerPower,
      isAlive: true,
      trail: [],
      kills: 0,
      damageDealt: 0,
      topSpeed: 300
    };

    // AI Rivals
    const rivalPowers = [
      MARBLE_POWERS.find(p => p.id === 'elem-ice') || MARBLE_POWERS[1],
      MARBLE_POWERS.find(p => p.id === 'cosm-blackhole') || MARBLE_POWERS[6],
      MARBLE_POWERS.find(p => p.id === 'chaos-growth') || MARBLE_POWERS[14],
      MARBLE_POWERS.find(p => p.id === 'tech-nuke') || MARBLE_POWERS[11]
    ];

    const rivals: MarbleEntity[] = [];
    const count = Math.min(activeMarblesCount - 1, rivalPowers.length);

    for (let i = 0; i < count; i++) {
      const p = rivalPowers[i];
      const spacing = width / (count + 1);
      rivals.push({
        id: `rival-${i}`,
        name: `${p.element} Rival`,
        x: spacing * (i + 1) + (Math.random() * 40 - 20),
        y: 110 + Math.random() * 60,
        vx: (Math.random() - 0.5) * 160,
        vy: 120 + Math.random() * 80,
        radius: 18,
        mass: p.id === 'chaos-growth' ? 1.5 : 1.0,
        hp: 350,
        maxHp: 350,
        energy: 40,
        maxEnergy: 100,
        cooldown: Math.random() * 2,
        maxCooldown: p.cooldownSeconds,
        color: p.colorHex,
        power: p,
        isAlive: true,
        trail: [],
        kills: 0,
        damageDealt: 0,
        topSpeed: 250
      });
    }

    marblesRef.current = [player, ...rivals];

    // Arena Hazards: Pinball Bumpers, Speed Strips, Center Vortex
    hazardsRef.current = [
      {
        id: 'hazard-center-vortex',
        type: 'vortex',
        x: width / 2,
        y: height / 2 - 20,
        radius: 36,
        active: true
      },
      {
        id: 'hazard-bumper-left',
        type: 'bumper',
        x: width * 0.25,
        y: height * 0.45,
        radius: 24,
        active: true
      },
      {
        id: 'hazard-bumper-right',
        type: 'bumper',
        x: width * 0.75,
        y: height * 0.45,
        radius: 24,
        active: true
      }
    ];

    popupsRef.current = [];
    particlesRef.current = [];
    traumaRef.current = 0;
    slowMoFactorRef.current = 1.0;
    slowMoTargetRef.current = 1.0;
    setWinner(null);
    setMatchState('IDLE');
  }, [isVerticalView, selectedPlayerPower, activeMarblesCount]);

  useEffect(() => {
    initArena();
  }, [initArena]);

  // Trigger Power Execution in Real-Time
  const triggerMarblePower = useCallback((marble: MarbleEntity, target?: MarbleEntity) => {
    soundManager.playPowerTrigger(marble.power.element);

    // Screen Shake Trauma
    traumaRef.current = Math.min(1.0, traumaRef.current + (marble.power.knockbackMultiplier > 2.5 ? 0.7 : 0.4));

    // Spawn Particles
    for (let i = 0; i < 28; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 80 + Math.random() * 220;
      particlesRef.current.push({
        x: marble.x,
        y: marble.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: marble.power.colorHex,
        size: 3 + Math.random() * 5,
        life: 0,
        maxLife: 0.6 + Math.random() * 0.4
      });
    }

    // Specific Ability Implementations
    switch (marble.power.id) {
      case 'elem-fire': { // Inferno Supernova: AOE Explosion
        marblesRef.current.forEach(other => {
          if (other.id !== marble.id && other.isAlive) {
            const dx = other.x - marble.x;
            const dy = other.y - marble.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 160) {
              const force = (160 - dist) * 6;
              const angle = Math.atan2(dy, dx);
              other.vx += Math.cos(angle) * force;
              other.vy += Math.sin(angle) * force;
              other.hp = Math.max(0, other.hp - marble.power.damageValue);
              popupsRef.current.push({
                id: Math.random().toString(),
                x: other.x,
                y: other.y - 20,
                text: `-${marble.power.damageValue} FIRE!`,
                color: '#EF4444',
                lifetime: 0,
                scale: 1.4,
                isCrit: true
              });
            }
          }
        });
        break;
      }
      case 'elem-ice': { // Frostbite: Freeze target
        if (target) {
          target.statusEffect = { type: 'frozen', duration: 2.2 };
          target.vx = 0;
          target.vy = 0;
          popupsRef.current.push({
            id: Math.random().toString(),
            x: target.x,
            y: target.y - 20,
            text: `FROZEN!`,
            color: '#06B6D4',
            lifetime: 0,
            scale: 1.3,
            isCrit: false
          });
        }
        break;
      }
      case 'cosm-blackhole': { // Singularity: Gravitational Pull
        marblesRef.current.forEach(other => {
          if (other.id !== marble.id && other.isAlive) {
            const dx = marble.x - other.x;
            const dy = marble.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 260) {
              other.vx += (dx / dist) * 320;
              other.vy += (dy / dist) * 320;
            }
          }
        });
        break;
      }
      case 'chaos-growth': { // Mega Chonk Titan
        marble.radius = 34;
        marble.mass = 4.5;
        marble.statusEffect = { type: 'giant', duration: 4.0 };
        popupsRef.current.push({
          id: Math.random().toString(),
          x: marble.x,
          y: marble.y - 25,
          text: `CHONK TITAN!`,
          color: '#14B8A6',
          lifetime: 0,
          scale: 1.5,
          isCrit: true
        });
        break;
      }
      case 'tech-nuke': { // Megaton Blast
        traumaRef.current = 1.0;
        marblesRef.current.forEach(other => {
          if (other.id !== marble.id && other.isAlive) {
            other.hp = Math.max(0, other.hp - 120);
            const dx = other.x - marble.x;
            const dy = other.y - marble.y;
            const angle = Math.atan2(dy, dx);
            other.vx += Math.cos(angle) * 700;
            other.vy += Math.sin(angle) * 700;
          }
        });
        break;
      }
      case 'meme-anvil': { // 100 Ton Anvil Drop
        if (target) {
          target.hp = Math.max(0, target.hp - 150);
          traumaRef.current = 0.8;
          popupsRef.current.push({
            id: Math.random().toString(),
            x: target.x,
            y: target.y - 30,
            text: `100 TONS!`,
            color: '#CBD5E1',
            lifetime: 0,
            scale: 1.6,
            isCrit: true
          });
        }
        break;
      }
      default: {
        if (target) {
          target.hp = Math.max(0, target.hp - marble.power.damageValue);
        }
      }
    }

    marble.energy = 0;
  }, []);

  // Main Physics Simulation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    const gameLoop = (currentTime: number) => {
      if (!running) return;

      const rawDt = Math.min((currentTime - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = currentTime;

      // Slow-Mo Interpolation
      if (slowMoTimerRef.current > 0) {
        slowMoTimerRef.current -= rawDt;
        if (slowMoTimerRef.current <= 0) {
          slowMoTargetRef.current = 1.0;
        }
      }
      slowMoFactorRef.current += (slowMoTargetRef.current - slowMoFactorRef.current) * 0.15;
      const dt = rawDt * slowMoFactorRef.current;

      const width = canvas.width;
      const height = canvas.height;

      // Update Screen Shake Trauma
      if (traumaRef.current > 0) {
        traumaRef.current = Math.max(0, traumaRef.current - dt * 1.5);
      }

      const shakeIntensity = Math.pow(traumaRef.current, 2) * 16;
      const shakeX = (Math.random() - 0.5) * shakeIntensity;
      const shakeY = (Math.random() - 0.5) * shakeIntensity;

      // Clear & Draw Arena Canvas
      ctx.save();
      ctx.translate(shakeX, shakeY);

      // Arena Floor Gradient
      const floorGrad = ctx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, width);
      floorGrad.addColorStop(0, '#0f172a');
      floorGrad.addColorStop(1, '#020617');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, 0, width, height);

      // Arena Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Outer Hazard Glow Boundary
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 4;
      ctx.strokeRect(12, 12, width - 24, height - 24);

      // Draw Hazards
      hazardsRef.current.forEach(haz => {
        if (haz.type === 'vortex') {
          // Animated Gravitational Singularity
          const timeSec = currentTime / 800;
          ctx.save();
          ctx.translate(haz.x, haz.y);
          ctx.rotate(timeSec);
          ctx.strokeStyle = 'rgba(147, 51, 234, 0.6)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, haz.radius || 36, 0, Math.PI * 1.5);
          ctx.stroke();

          ctx.fillStyle = 'rgba(88, 28, 135, 0.3)';
          ctx.beginPath();
          ctx.arc(0, 0, (haz.radius || 36) * 0.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (haz.type === 'bumper') {
          // Bouncy Pinball Bumper
          ctx.save();
          ctx.fillStyle = '#f59e0b';
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(haz.x, haz.y, haz.radius || 24, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.stroke();
          ctx.restore();
        }
      });

      // Update & Draw Marbles
      const marbles = marblesRef.current;

      marbles.forEach((m) => {
        if (!m.isAlive) return;

        // Status Effects
        if (m.statusEffect) {
          m.statusEffect.duration -= dt;
          if (m.statusEffect.duration <= 0) {
            if (m.statusEffect.type === 'giant') {
              m.radius = 18;
              m.mass = 1.0;
            }
            m.statusEffect = undefined;
          }
        }

        const isFrozen = m.statusEffect?.type === 'frozen';

        // Gravitational Attraction from Center Vortex
        const centerHaz = hazardsRef.current.find(h => h.type === 'vortex');
        if (centerHaz && !isFrozen) {
          const dx = centerHaz.x - m.x;
          const dy = centerHaz.y - m.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 10 && dist < 220) {
            const pull = 8000 / (dist * dist);
            m.vx += (dx / dist) * pull * dt * 60;
            m.vy += (dy / dist) * pull * dt * 60;
          }
        }

        // Apply Friction & Movement
        if (!isFrozen) {
          m.vx *= 0.988;
          m.vy *= 0.988;
          m.x += m.vx * dt;
          m.y += m.vy * dt;
        }

        // Arena Wall Collisions (Bounce)
        const minX = 14 + m.radius;
        const maxX = width - 14 - m.radius;
        const minY = 14 + m.radius;
        const maxY = height - 14 - m.radius;

        if (m.x < minX) {
          m.x = minX;
          m.vx = -m.vx * 0.85;
          soundManager.playMarbleClick(0.5);
          m.energy = Math.min(m.maxEnergy, m.energy + 8);
        } else if (m.x > maxX) {
          m.x = maxX;
          m.vx = -m.vx * 0.85;
          soundManager.playMarbleClick(0.5);
          m.energy = Math.min(m.maxEnergy, m.energy + 8);
        }

        if (m.y < minY) {
          m.y = minY;
          m.vy = -m.vy * 0.85;
          soundManager.playMarbleClick(0.5);
          m.energy = Math.min(m.maxEnergy, m.energy + 8);
        } else if (m.y > maxY) {
          m.y = maxY;
          m.vy = -m.vy * 0.85;
          soundManager.playMarbleClick(0.5);
          m.energy = Math.min(m.maxEnergy, m.energy + 8);
        }

        // Bumper Collisions
        hazardsRef.current.forEach(haz => {
          if (haz.type === 'bumper' && haz.radius) {
            const bdx = m.x - haz.x;
            const bdy = m.y - haz.y;
            const bdist = Math.sqrt(bdx * bdx + bdy * bdy);
            if (bdist < m.radius + haz.radius) {
              const nx = bdx / bdist;
              const ny = bdy / bdist;
              m.vx = nx * 450;
              m.vy = ny * 450;
              soundManager.playHeavyImpact(1.0);
              traumaRef.current = Math.min(1.0, traumaRef.current + 0.35);
              m.energy = Math.min(m.maxEnergy, m.energy + 20);
            }
          }
        });

        // Marble Trail
        if (Math.abs(m.vx) > 30 || Math.abs(m.vy) > 30) {
          m.trail.push({ x: m.x, y: m.y, alpha: 0.6 });
        }
        if (m.trail.length > 8) {
          m.trail.shift();
        }

        // Draw Trail
        ctx.save();
        m.trail.forEach((point, i) => {
          const trailRadius = m.radius * (i / m.trail.length) * 0.7;
          ctx.fillStyle = m.color;
          ctx.globalAlpha = (i / m.trail.length) * 0.3;
          ctx.beginPath();
          ctx.arc(point.x, point.y, trailRadius, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();

        // Draw Marble Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(m.x, m.y + m.radius * 0.7, m.radius * 0.9, m.radius * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw Marble Body with Glossy 3D Finish
        ctx.save();
        const marbleGrad = ctx.createRadialGradient(
          m.x - m.radius * 0.35,
          m.y - m.radius * 0.35,
          m.radius * 0.1,
          m.x,
          m.y,
          m.radius
        );
        marbleGrad.addColorStop(0, '#ffffff');
        marbleGrad.addColorStop(0.3, m.color);
        marbleGrad.addColorStop(1, '#020617');

        ctx.fillStyle = marbleGrad;
        ctx.shadowColor = m.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fill();

        // Frozen Ice Overlay
        if (isFrozen) {
          ctx.fillStyle = 'rgba(165, 243, 252, 0.65)';
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.strokeRect(m.x - m.radius * 1.2, m.y - m.radius * 1.2, m.radius * 2.4, m.radius * 2.4);
          ctx.fillRect(m.x - m.radius * 1.2, m.y - m.radius * 1.2, m.radius * 2.4, m.radius * 2.4);
        }

        // Mini HP & Energy Bar above marble
        const barWidth = 32;
        const barHeight = 4;
        const barY = m.y - m.radius - 12;

        // HP Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(m.x - barWidth / 2, barY, barWidth, barHeight);

        // HP Foreground
        const hpPercent = Math.max(0, m.hp / m.maxHp);
        ctx.fillStyle = hpPercent > 0.5 ? '#10b981' : hpPercent > 0.25 ? '#f59e0b' : '#ef4444';
        ctx.fillRect(m.x - barWidth / 2, barY, barWidth * hpPercent, barHeight);

        // Energy Bar (below HP)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(m.x - barWidth / 2, barY + barHeight + 1, barWidth, 2);
        const energyPercent = m.energy / m.maxEnergy;
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(m.x - barWidth / 2, barY + barHeight + 1, barWidth * energyPercent, 2);

        // Check if Energy is 100% -> Auto-Trigger Power!
        if (m.energy >= m.maxEnergy) {
          triggerMarblePower(m);
        }

        ctx.restore();
      });

      // Marble-to-Marble Elastic Rigid Body Collisions
      for (let i = 0; i < marbles.length; i++) {
        for (let j = i + 1; j < marbles.length; j++) {
          const m1 = marbles[i];
          const m2 = marbles[j];
          if (!m1.isAlive || !m2.isAlive) continue;

          const dx = m2.x - m1.x;
          const dy = m2.y - m1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < m1.radius + m2.radius) {
            // Overlap Separation
            const overlap = (m1.radius + m2.radius) - dist;
            const nx = dx / dist;
            const ny = dy / dist;

            m1.x -= nx * overlap * 0.5;
            m1.y -= ny * overlap * 0.5;
            m2.x += nx * overlap * 0.5;
            m2.y += ny * overlap * 0.5;

            // Relative Velocity
            const kx = m1.vx - m2.vx;
            const ky = m1.vy - m2.vy;
            const p = 2 * (nx * kx + ny * ky) / (m1.mass + m2.mass);

            // Elastic Impulse
            m1.vx -= p * m2.mass * nx;
            m1.vy -= p * m2.mass * ny;
            m2.vx += p * m1.mass * nx;
            m2.vy += p * m1.mass * ny;

            // Collision Sound
            const impactSpeed = Math.sqrt(kx * kx + ky * ky);
            soundManager.playMarbleClick(Math.min(1.2, impactSpeed / 400));

            // Kinetic Damage Calculation
            const baseDamage = Math.round(15 + (impactSpeed / 20) * (m1.mass));
            m1.hp = Math.max(0, m1.hp - baseDamage);
            m2.hp = Math.max(0, m2.hp - baseDamage);

            // Clash Energy Gain
            m1.energy = Math.min(m1.maxEnergy, m1.energy + 15);
            m2.energy = Math.min(m2.maxEnergy, m2.energy + 15);

            // Screen Trauma & Damage Popup
            traumaRef.current = Math.min(1.0, traumaRef.current + (impactSpeed > 500 ? 0.4 : 0.15));

            popupsRef.current.push({
              id: Math.random().toString(),
              x: (m1.x + m2.x) / 2,
              y: (m1.y + m2.y) / 2 - 15,
              text: `${baseDamage}`,
              color: impactSpeed > 600 ? '#f59e0b' : '#ffffff',
              lifetime: 0,
              scale: impactSpeed > 600 ? 1.4 : 1.0,
              isCrit: impactSpeed > 600
            });

            // Lethal Blow Check -> Trigger Dynamic Slow-Mo!
            if (m1.hp <= 0 || m2.hp <= 0) {
              soundManager.playKnockoutHit();
              slowMoTargetRef.current = 0.2; // 0.2x speed
              slowMoTimerRef.current = 0.7; // for 700ms
              traumaRef.current = 0.9;

              if (m1.hp <= 0) {
                m1.isAlive = false;
                m2.kills += 1;
              }
              if (m2.hp <= 0) {
                m2.isAlive = false;
                m1.kills += 1;
              }
            }
          }
        }
      }

      // Check Victory Condition (Last Marble Standing)
      const survivors = marbles.filter(m => m.isAlive);
      if (survivors.length === 1 && matchState === 'PLAYING') {
        const champ = survivors[0];
        setWinner(champ);
        setMatchState('VICTORY');
        soundManager.playEggHatchFanfare('Legendary');
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      // Update & Draw Floating Damage Popups
      popupsRef.current = popupsRef.current.filter(p => {
        p.lifetime += rawDt;
        p.y -= 35 * rawDt;
        if (p.lifetime > 0.8) return false;

        ctx.save();
        ctx.font = `${p.isCrit ? 'bold 16px' : '600 13px'} "Outfit", sans-serif`;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.textAlign = 'center';
        ctx.globalAlpha = 1.0 - (p.lifetime / 0.8);
        ctx.fillText(p.text, p.x, p.y);
        ctx.restore();
        return true;
      });

      // Update & Draw Particles
      particlesRef.current = particlesRef.current.filter(part => {
        part.life += rawDt;
        part.x += part.vx * rawDt;
        part.y += part.vy * rawDt;
        if (part.life >= part.maxLife) return false;

        ctx.save();
        ctx.fillStyle = part.color;
        ctx.globalAlpha = 1 - (part.life / part.maxLife);
        ctx.beginPath();
        ctx.arc(part.x, part.y, part.size * (1 - part.life / part.maxLife), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return true;
      });

      // Draw Slingshot Aim Line if dragging
      if (isDraggingRef.current) {
        const start = dragStartRef.current;
        const curr = dragCurrentRef.current;
        const dx = start.x - curr.x;
        const dy = start.y - curr.y;
        const pullDist = Math.min(160, Math.sqrt(dx * dx + dy * dy));
        const angle = Math.atan2(dy, dx);

        ctx.save();
        // Dotted trajectory preview
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        const aimLength = pullDist * 2.8;
        ctx.lineTo(start.x + Math.cos(angle) * aimLength, start.y + Math.sin(angle) * aimLength);
        ctx.stroke();

        // Rubber pull band
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(curr.x, curr.y);
        ctx.stroke();

        // Reticle
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(curr.x, curr.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      running = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [matchState, triggerMarblePower]);

  // Slingshot Pointer Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const player = marblesRef.current[0];
    if (!player || !player.isAlive) return;

    // Check proximity to player marble
    const dist = Math.hypot(x - player.x, y - player.y);
    if (dist < player.radius * 2.5) {
      isDraggingRef.current = true;
      dragStartRef.current = { x: player.x, y: player.y };
      dragCurrentRef.current = { x, y };
      soundManager.playSlingshotPull(0.3);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    dragCurrentRef.current = { x, y };
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    const player = marblesRef.current[0];
    if (!player) return;

    const dx = dragStartRef.current.x - dragCurrentRef.current.x;
    const dy = dragStartRef.current.y - dragCurrentRef.current.y;
    const dist = Math.min(160, Math.hypot(dx, dy));

    if (dist > 15) {
      const angle = Math.atan2(dy, dx);
      const impulse = dist * 7.5; // pixel per second
      player.vx = Math.cos(angle) * impulse;
      player.vy = Math.sin(angle) * impulse;

      soundManager.playLaunchRelease();
      setMatchState('PLAYING');
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto w-full">
      {/* Sandbox Header Controls */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span>Interactive Battle Arena</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                LIVE RIGIDBODY 2D
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Drag player marble to launch · Experience ASMR clicks, knockback physics & powers!
            </p>
          </div>
        </div>

        {/* Viewport & Audio Toggles */}
        <div className="flex items-center gap-2">
          {/* Audio toggle */}
          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              soundManager.enabled = next;
            }}
            className={`p-2 rounded-xl text-xs border transition-colors ${
              soundEnabled
                ? 'bg-slate-800 text-amber-300 border-slate-700'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title={soundEnabled ? 'ASMR Sound Enabled' : 'Muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* 9:16 TikTok Vertical vs 16:9 Landscape toggle */}
          <button
            onClick={() => {
              soundManager.playMarbleClick(0.6);
              setIsVerticalView(!isVerticalView);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            {isVerticalView ? (
              <>
                <Smartphone className="w-4 h-4 text-rose-400" />
                <span>9:16 TikTok Mode</span>
              </>
            ) : (
              <>
                <Monitor className="w-4 h-4 text-sky-400" />
                <span>16:9 Arena Mode</span>
              </>
            )}
          </button>

          {/* Reset / Rapid Replay */}
          <button
            onClick={() => {
              soundManager.playMarbleClick(0.8);
              initArena();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Arena</span>
          </button>
        </div>
      </div>

      {/* Main Canvas & Player Power Selector Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Canvas Display */}
        <div className={`lg:col-span-8 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden min-h-[520px]`}>
          <canvas
            ref={canvasRef}
            width={isVerticalView ? 380 : 800}
            height={isVerticalView ? 620 : 500}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="rounded-xl shadow-2xl border border-slate-800/80 cursor-crosshair touch-none max-w-full"
            style={{ width: isVerticalView ? '380px' : '100%', height: 'auto' }}
          />

          {/* Victory Overlay Modal */}
          {matchState === 'VICTORY' && winner && (
            <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-200 z-20">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3 shadow-lg shadow-amber-500/20">
                <Trophy className="w-8 h-8" />
              </div>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                LAST MARBLE STANDING
              </span>
              <h2 className="text-3xl font-black text-white mt-1">
                {winner.name} WINS!
              </h2>
              <p className="text-xs text-slate-300 mt-2 max-w-xs">
                Dominated the clash with {winner.kills} knockouts using signature power <strong>{winner.power.name}</strong>!
              </p>

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => {
                    soundManager.playMarbleClick(0.9);
                    initArena();
                  }}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>BATTLE AGAIN (RAPID REPLAY)</span>
                </button>

                {onOpenHighlightClipper && (
                  <button
                    onClick={() => {
                      soundManager.playMarbleClick(0.8);
                      onOpenHighlightClipper(winner.name, winner.power.name);
                    }}
                    className="px-4 py-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-2"
                  >
                    <Smartphone className="w-4 h-4 text-rose-400" />
                    <span>Watch Highlight Clip</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Quick Slingshot Hint */}
          {matchState === 'IDLE' && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-xs text-slate-300 font-medium pointer-events-none flex items-center gap-2 shadow-lg">
              <Crosshair className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Touch & drag bottom marble backward to aim slingshot!</span>
            </div>
          )}
        </div>

        {/* Right Side: Player Power Selector & Live Match HUD */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Player Power Selection */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              Select Player Power
            </span>
            <p className="text-[11px] text-slate-400">
              Equip an elemental ability to launch with. Fills energy on every collision!
            </p>

            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {MARBLE_POWERS.slice(0, 10).map((power) => {
                const isSelected = selectedPlayerPower.id === power.id;
                return (
                  <button
                    key={power.id}
                    onClick={() => {
                      soundManager.playPowerTrigger(power.element);
                      setSelectedPlayerPower(power);
                      const player = marblesRef.current[0];
                      if (player) {
                        player.power = power;
                        player.color = power.colorHex;
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/60 text-white font-semibold ring-1 ring-amber-500/30'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: power.colorHex }} />
                      <span className="truncate">{power.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-1 font-mono">
                      {power.element} · {power.damageValue} DMG
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Manual Ultimate Trigger */}
            <button
              onClick={() => {
                const player = marblesRef.current[0];
                if (player && player.isAlive) {
                  triggerMarblePower(player);
                }
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>TEST ULTIMATE DETONATION!</span>
            </button>
          </div>

          {/* Live Marbles Health & Status */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              Combatants Live Telemetry
            </span>

            <div className="space-y-2 text-xs">
              {marblesRef.current.map((m) => {
                const hpPercent = Math.max(0, m.hp / m.maxHp) * 100;
                return (
                  <div key={m.id} className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                        <span className={`font-semibold ${m.isAlive ? 'text-slate-200' : 'text-slate-500 line-through'}`}>
                          {m.name}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-400">
                        {m.isAlive ? `${m.hp}/${m.maxHp} HP` : 'K.O.'}
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-150"
                        style={{
                          width: `${hpPercent}%`,
                          backgroundColor: hpPercent > 50 ? '#10b981' : hpPercent > 20 ? '#f59e0b' : '#ef4444'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
