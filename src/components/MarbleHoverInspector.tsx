import React, { useEffect, useRef } from 'react';
import { MarblePower } from '../types/game';
import { getPowerDisplayName, getRarityTextColor, getRarityTextClass } from '../data/powersData';
import { drawMarbleSkin } from '../utils/marbleSkinRenderer';
import { Crown, Zap, Shield, Sparkles, Flame, Eye, Compass, Trophy } from 'lucide-react';

interface MarbleHoverInspectorProps {
  power: MarblePower;
  screenX: number;
  screenY: number;
  currentLang?: string;
  isUnlocked?: boolean;
  masteryLevel?: number;
}

export const MarbleHoverInspector: React.FC<MarbleHoverInspectorProps> = ({
  power,
  screenX,
  screenY,
  currentLang = 'es',
  isUnlocked = true,
  masteryLevel = 1
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Dynamic animated particle and elemental FX rendering for the specific marble
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let startTime = performance.now();

    const loop = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = 34;

      // Draw custom elemental background particles according to power ID
      drawElementalParticles(ctx, power.id, power.element, cx, cy, radius, elapsed);

      // Draw marble with skin
      drawMarbleSkin(ctx, {
        x: cx,
        y: cy,
        radius,
        color: power.colorHex,
        element: power.element,
        powerId: power.id,
        expression: 'battle',
        crown: power.rarity === 'Legendary',
        shieldActive: power.id === 'mag-mirrorshield',
        time: elapsed
      });

      // Draw foreground overlay effects (like fire embers, frost glaze, lightning arcs, etc.)
      drawElementalForegroundOverlay(ctx, power.id, cx, cy, radius, elapsed);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [power]);

  const rarityColorHex = getRarityTextColor(power.rarity);
  const rarityTextClass = getRarityTextClass(power.rarity);

  return (
    <div
      className="fixed z-50 pointer-events-none w-80 sm:w-88 p-4 rounded-3xl bg-slate-950/95 border-2 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150"
      style={{
        left: Math.min(window.innerWidth - 365, Math.max(16, screenX + 18)),
        top: Math.min(window.innerHeight - 340, Math.max(16, screenY - 40)),
        borderColor: rarityColorHex,
        boxShadow: `0 0 35px ${power.colorHex}40, 0 20px 45px rgba(0,0,0,0.9)`
      }}
    >
      {/* Top Header: Canvas with Elemental FX + Name with Rarity Color */}
      <div className="flex items-center gap-3.5 pb-3 border-b border-slate-800/90">
        {/* Animated Elemental Canvas Thumbnail */}
        <div className="relative w-22 h-22 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shrink-0 shadow-inner flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={140}
            height={140}
            className="w-full h-full"
          />
        </div>

        <div className="min-w-0 flex-1">
          {/* Name with rarity color: común gris, raro azul, épico morado, legendario dorado */}
          <h3 className={`text-base font-black truncate tracking-tight ${rarityTextClass}`}>
            {getPowerDisplayName(power, currentLang)}
          </h3>

          <div className="flex items-center gap-2 pt-1">
            <span
              className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full border shadow-xs"
              style={{
                backgroundColor: `${rarityColorHex}20`,
                borderColor: `${rarityColorHex}60`,
                color: rarityColorHex
              }}
            >
              {power.rarity === 'Legendary' ? '👑 Legendario' : power.rarity === 'Epic' ? '⚡ Épico' : power.rarity === 'Rare' ? '💎 Raro' : '🛡️ Común'}
            </span>
            <span className="text-[11px] font-mono text-slate-400 font-bold">
              {power.element}
            </span>
          </div>

          <div className="pt-1 text-[10px] font-mono text-slate-500">
            {isUnlocked ? (
              <span className="text-emerald-400 font-bold">✓ Desbloqueada · Nivel {masteryLevel}</span>
            ) : (
              <span className="text-amber-400/90">🔒 Bloqueada (Obtenible en Incubadora)</span>
            )}
          </div>
        </div>
      </div>

      {/* Force Points & Combat Attributes Grid */}
      <div className="py-2.5 space-y-2">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block font-mono">
          Puntos de Fuerza & Atributos
        </span>

        <div className="grid grid-cols-3 gap-1.5 text-center font-mono">
          <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[9px] text-slate-400 block font-bold">💥 Fuerza Daño</span>
            <span className="font-black text-amber-400 text-xs sm:text-sm">{power.damageValue} PTS</span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[9px] text-slate-400 block font-bold">⚡ Empuje</span>
            <span className="font-black text-cyan-400 text-xs sm:text-sm">x{power.knockbackMultiplier}</span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-[9px] text-slate-400 block font-bold">⏱️ Recarga</span>
            <span className="font-black text-purple-400 text-xs sm:text-sm">{power.cooldownSeconds}s</span>
          </div>
        </div>

        {/* Ability Description */}
        <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold text-amber-400">
            <span className="uppercase tracking-wider">Habilidad: {power.name}</span>
            {power.dropRatePercent && (
              <span className="font-mono text-slate-400">Drop: {power.dropRatePercent.toFixed(2)}%</span>
            )}
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
            {power.combatImpact}
          </p>
          <div className="text-[10px] text-slate-400 font-mono pt-0.5">
            <span className="text-slate-500">Activación:</span> {power.triggerCondition}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Draws animated background elemental particles and special visual effects
 * specifically tailored for each of the 20 marble powers!
 */
function drawElementalParticles(
  ctx: CanvasRenderingContext2D,
  powerId: string,
  element: string,
  cx: number,
  cy: number,
  radius: number,
  time: number
) {
  ctx.save();

  switch (powerId) {
    // 1. FUEGO: Llamas ardientes oscilantes, chispas rojas/naranjas y resplandor
    case 'elem-fire': {
      // Background thermal heat halo
      const grad = ctx.createRadialGradient(cx, cy, radius * 0.7, cx, cy, radius + 22);
      grad.addColorStop(0, 'rgba(239, 68, 68, 0.4)');
      grad.addColorStop(0.6, 'rgba(249, 115, 22, 0.25)');
      grad.addColorStop(1, 'rgba(239, 68, 68, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 22, 0, Math.PI * 2);
      ctx.fill();

      // Dancing flame tongues and embers
      const flameCount = 14;
      for (let i = 0; i < flameCount; i++) {
        const angle = (i / flameCount) * Math.PI * 2 + time * 2.0;
        const dist = radius + 8 + Math.sin(time * 7 + i * 2) * 8;
        const fx = cx + Math.cos(angle) * dist;
        const fy = cy + Math.sin(angle) * dist - 10;
        const fSize = 4 + Math.sin(time * 9 + i) * 2.5;

        ctx.fillStyle = i % 2 === 0 ? 'rgba(239, 68, 68, 0.85)' : 'rgba(249, 115, 22, 0.9)';
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(fx, fy, fSize, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    // 2. HIELO: Copos de nieve y cristales de hielo brotando, vaho helado
    case 'elem-ice': {
      // Frost mist aura
      const grad = ctx.createRadialGradient(cx, cy, radius * 0.8, cx, cy, radius + 20);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
      grad.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 20, 0, Math.PI * 2);
      ctx.fill();

      // Crystalline snowflakes orbiting
      const crystalCount = 8;
      for (let i = 0; i < crystalCount; i++) {
        const angle = (i / crystalCount) * Math.PI * 2 + time * 1.2;
        const dist = radius + 9 + Math.cos(time * 4 + i) * 5;
        const cxp = cx + Math.cos(angle) * dist;
        const cyp = cy + Math.sin(angle) * dist;

        ctx.strokeStyle = 'rgba(224, 242, 254, 0.9)';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.lineWidth = 2;

        // 6-branch snowflake
        for (let b = 0; b < 3; b++) {
          const bAngle = (b / 3) * Math.PI;
          ctx.beginPath();
          ctx.moveTo(cxp - Math.cos(bAngle) * 5, cyp - Math.sin(bAngle) * 5);
          ctx.lineTo(cxp + Math.cos(bAngle) * 5, cyp + Math.sin(bAngle) * 5);
          ctx.stroke();
        }
      }
      break;
    }

    // 3. RAYO: Rayos violetas y chispas tesla crepitantes
    case 'elem-lightning': {
      ctx.strokeStyle = '#c084fc';
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 16;
      ctx.lineWidth = 2.2;

      for (let b = 0; b < 5; b++) {
        const bAngle = (b / 5) * Math.PI * 2 + time * 4;
        const x1 = cx + Math.cos(bAngle) * (radius - 2);
        const y1 = cy + Math.sin(bAngle) * (radius - 2);
        const midA = bAngle + (Math.sin(time * 15 + b) * 0.45);
        const x2 = cx + Math.cos(midA) * (radius + 18);
        const y2 = cy + Math.sin(midA) * (radius + 18);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo((x1 + x2) / 2 + (Math.sin(time * 20 + b) * 8), (y1 + y2) / 2 + (Math.cos(time * 20 + b) * 8));
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      break;
    }

    // 4. TIERRA: Fragmentos de roca rodando, polvo sísmico y fisuras ámbar
    case 'elem-earth': {
      for (let r = 0; r < 7; r++) {
        const rAngle = (r / 7) * Math.PI * 2 + time * 1.5;
        const rDist = radius + 10 + Math.sin(time * 4 + r) * 5;
        const rx = cx + Math.cos(rAngle) * rDist;
        const ry = cy + Math.sin(rAngle) * rDist;

        ctx.fillStyle = '#b45309';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#d97706';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.rect(rx - 3.5, ry - 3.5, 7, 7);
        ctx.fill();
        ctx.stroke();
      }
      break;
    }

    // 5. VIENTO: Torbellino ciclónico verde esmeralda giratorio
    case 'elem-wind': {
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.85)';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 14;
      ctx.lineWidth = 2.8;

      for (let w = 0; w < 5; w++) {
        const wAngle = (w / 5) * Math.PI * 2 + time * 7;
        ctx.beginPath();
        ctx.arc(cx, cy, radius + 4 + w * 3.5, wAngle, wAngle + Math.PI * 0.5);
        ctx.stroke();
      }
      break;
    }

    // 6. VENENO: Burbujas de ácido verde tóxico y calaveritas
    case 'elem-poison': {
      for (let p = 0; p < 8; p++) {
        const pAngle = (p / 8) * Math.PI * 2 + time * 2.2;
        const pDist = radius + 8 + Math.sin(time * 5 + p) * 7;
        const px = cx + Math.cos(pAngle) * pDist;
        const py = cy + Math.sin(pAngle) * pDist - 6;
        const pSize = 3.5 + Math.sin(time * 7 + p) * 2;

        ctx.fillStyle = 'rgba(163, 230, 53, 0.9)';
        ctx.shadowColor = '#84cc16';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(px, py, pSize, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    // 7. AGUJERO NEGRO: Vórtice gravitatorio púrpura succionando polvo cósmico
    case 'cosm-blackhole': {
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.85)';
      ctx.shadowColor = '#7e22ce';
      ctx.shadowBlur = 18;
      ctx.lineWidth = 3;

      for (let s = 0; s < 4; s++) {
        const spin = time * 4.5 + s * 1.5;
        ctx.beginPath();
        ctx.ellipse(cx, cy, radius + 16 - s * 3.5, (radius + 16 - s * 3.5) * 0.45, spin, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    }

    // 8. SALTO CUÁNTICO: Glitch holográfico con destellos cromáticos
    case 'mag-warp': {
      for (let g = 0; g < 6; g++) {
        const gx = cx + (Math.sin(time * 15 + g) * (radius + 12));
        const gy = cy + (Math.cos(time * 12 + g) * (radius + 12));

        ctx.fillStyle = g % 2 === 0 ? 'rgba(236, 72, 153, 0.85)' : 'rgba(56, 189, 248, 0.85)';
        ctx.shadowColor = '#ec4899';
        ctx.shadowBlur = 10;
        ctx.fillRect(gx - 4, gy - 2, 8, 4);
      }
      break;
    }

    // 9. INVERSIÓN DE GRAVEDAD: Flechas cyan de vector ascendente
    case 'cosm-gravityflip': {
      ctx.strokeStyle = '#38bdf8';
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 12;
      ctx.lineWidth = 2.5;
      for (let v = 0; v < 5; v++) {
        const vx = cx - 22 + v * 11;
        const vy = cy + radius - ((time * 45 + v * 14) % (radius * 2));
        ctx.beginPath();
        ctx.moveTo(vx, vy);
        ctx.lineTo(vx, vy - 9);
        ctx.lineTo(vx - 3, vy - 6);
        ctx.moveTo(vx, vy - 9);
        ctx.lineTo(vx + 3, vy - 6);
        ctx.stroke();
      }
      break;
    }

    // 10. ESCUDO PRISMÁTICO: Hexágonos irisados reflectantes
    case 'mag-mirrorshield': {
      ctx.strokeStyle = 'rgba(244, 114, 182, 0.85)';
      ctx.shadowColor = '#ec4899';
      ctx.shadowBlur = 14;
      ctx.lineWidth = 2.8;

      ctx.beginPath();
      for (let h = 0; h < 6; h++) {
        const ha = (h / 6) * Math.PI * 2 + time * 1.8;
        const hx = cx + Math.cos(ha) * (radius + 12);
        const hy = cy + Math.sin(ha) * (radius + 12);
        if (h === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.stroke();
      break;
    }

    // 11. PULSO EMP: Anillos de choque electromagnético expansivos
    case 'tech-emp': {
      const empR = (time * 38) % (radius + 22);
      const alpha = Math.max(0, 1 - empR / (radius + 22));
      ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 14;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, empR + radius * 0.4, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    // 12. BOMBA NUCLEAR: Hongo atómico y resplandor klaxon rojo
    case 'tech-nuke': {
      const nukePulse = Math.sin(time * 8) * 0.25 + 0.75;
      ctx.fillStyle = `rgba(249, 115, 22, ${0.3 * nukePulse})`;
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 18, 0, Math.PI * 2);
      ctx.fill();

      // Radiation symbol arcs
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      for (let a = 0; a < 3; a++) {
        const arcAngle = (a / 3) * Math.PI * 2 + time * 2;
        ctx.beginPath();
        ctx.arc(cx, cy, radius + 10, arcAngle, arcAngle + Math.PI * 0.35);
        ctx.stroke();
      }
      break;
    }

    // 13. LANZA LÁSER: Mira telescópica y haz láser carmesí
    case 'tech-laser': {
      ctx.strokeStyle = '#ef4444';
      ctx.shadowColor = '#e11d48';
      ctx.shadowBlur = 14;
      ctx.lineWidth = 2.2;

      // Reticle ring
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 10, 0, Math.PI * 2);
      ctx.stroke();

      const la = time * 3.5;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(la) * (radius + 16), cy + Math.sin(la) * (radius + 16));
      ctx.lineTo(cx - Math.cos(la) * (radius + 16), cy - Math.sin(la) * (radius + 16));
      ctx.stroke();
      break;
    }

    // 14. MINAS DE PROXIMIDAD: 3 minas orbitando con luces LED
    case 'tech-landmines': {
      for (let m = 0; m < 3; m++) {
        const ma = (m / 3) * Math.PI * 2 + time * 2.2;
        const mx = cx + Math.cos(ma) * (radius + 13);
        const my = cy + Math.sin(ma) * (radius + 13);

        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = Math.sin(time * 12 + m) > 0 ? '#ef4444' : '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(mx, my, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      break;
    }

    // 15. TITÁN CHONK: Squash & stretch con estrellas de choque
    case 'chaos-growth': {
      const chonkScale = 1 + Math.sin(time * 5) * 0.16;
      ctx.strokeStyle = 'rgba(20, 184, 166, 0.75)';
      ctx.shadowColor = '#14b8a6';
      ctx.shadowBlur = 12;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * chonkScale + 4, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    // 16. CAOS DE CLONES: Siluetas de clones transparentes
    case 'meme-dupe': {
      for (let c = 0; c < 2; c++) {
        const ca = (c / 2) * Math.PI * 2 + time * 1.8;
        const cdx = cx + Math.cos(ca) * (radius + 9);
        const cdy = cy + Math.sin(ca) * (radius + 9);

        ctx.strokeStyle = 'rgba(168, 85, 247, 0.65)';
        ctx.setLineDash([3, 3]);
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(cdx, cdy, 9, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      break;
    }

    // 17. IMÁN DE MONEDAS: Monedas doradas flotando hacia el centro
    case 'chaos-magnet': {
      for (let c = 0; c < 5; c++) {
        const ca = (c / 5) * Math.PI * 2 + time * 2.2;
        const cd = radius + 17 - ((time * 22 + c * 10) % 17);
        const mx = cx + Math.cos(ca) * cd;
        const my = cy + Math.sin(ca) * cd;

        ctx.fillStyle = '#facc15';
        ctx.strokeStyle = '#ca8a04';
        ctx.shadowColor = '#eab308';
        ctx.shadowBlur = 8;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(mx, my, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      break;
    }

    // 18. TURBO HIPERSÓNICO: Estela de mach cone arcoíris
    case 'meme-speed': {
      const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'];
      for (let k = 0; k < 4; k++) {
        ctx.strokeStyle = colors[k];
        ctx.shadowColor = colors[k];
        ctx.shadowBlur = 8;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(cx - (k + 1) * 6, cy, radius + 2 + k * 2.5, -Math.PI * 0.45, Math.PI * 0.45);
        ctx.stroke();
      }
      break;
    }

    // 19. YUNQUE 100T: Sombra descendente y chispas de impacto
    case 'meme-anvil': {
      const dropY = cy - radius - 12 + Math.sin(time * 4) * 9;
      ctx.fillStyle = '#334155';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.rect(cx - 12, dropY, 24, 11);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 8px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('100T', cx, dropY + 8);
      break;
    }

    // 20. PINBALL TWISTER: Luces estroboscópicas multicolores
    case 'chaos-tornado': {
      const pColors = ['#f43f5e', '#a855f7', '#38bdf8', '#facc15'];
      for (let p = 0; p < 7; p++) {
        const pa = (p / 7) * Math.PI * 2 + time * 3.5;
        const px = cx + Math.cos(pa) * (radius + 10);
        const py = cy + Math.sin(pa) * (radius + 10);

        ctx.fillStyle = pColors[p % pColors.length];
        ctx.shadowColor = pColors[p % pColors.length];
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    default:
      break;
  }

  ctx.restore();
}

/**
 * Foreground details over the marble
 */
function drawElementalForegroundOverlay(
  ctx: CanvasRenderingContext2D,
  powerId: string,
  cx: number,
  cy: number,
  radius: number,
  time: number
) {
  if (powerId === 'elem-ice') {
    // Frost glaze border
    ctx.save();
    ctx.strokeStyle = 'rgba(224, 242, 254, 0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, radius - 1, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  } else if (powerId === 'elem-fire') {
    // Scorching amber rim
    ctx.save();
    ctx.strokeStyle = 'rgba(254, 215, 170, 0.6)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, radius - 1, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

