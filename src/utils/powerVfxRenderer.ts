/**
 * Spectacular, Highly Visible 20-Power Visual Effects System for Marble Clash
 * Every power has a unique, punchy, dopaminergic animation that is impossible to miss!
 */

export interface ActivePowerVfx {
  id: string;
  sourceMarbleId: string;
  powerId: string;
  element: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
  name: string;
  radius: number;
}

export function drawSpectacularPowerAnimation(
  ctx: CanvasRenderingContext2D,
  vfx: ActivePowerVfx,
  w: number,
  h: number
) {
  ctx.save();
  const progress = Math.min(1.0, vfx.life / vfx.maxLife); // 0.0 to 1.0
  const alpha = Math.max(0, 1.0 - progress);

  switch (vfx.powerId) {
    case 'elem-fire': {
      // 1. Inferno Supernova: Multi-ring fiery shockwave explosion with rotating flame tongues
      const radius = 25 + progress * 200;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 8 * alpha;
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 24;

      // Primary shockwave
      ctx.beginPath();
      ctx.arc(vfx.x, vfx.y, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Secondary yellow blast wave
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 4 * alpha;
      ctx.beginPath();
      ctx.arc(vfx.x, vfx.y, radius * 0.7, 0, Math.PI * 2);
      ctx.stroke();

      // Rotating flame tongues & fireballs
      for (let r = 0; r < 10; r++) {
        const a = (r / 10) * Math.PI * 2 + progress * 3;
        const dist = radius * 0.85;
        ctx.fillStyle = r % 2 === 0 ? '#f97316' : '#facc15';
        ctx.beginPath();
        ctx.arc(vfx.x + Math.cos(a) * dist, vfx.y + Math.sin(a) * dist, 10 * alpha, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'elem-ice': {
      // 2. Frostbite Glacier: 12 sharp 360° crystalline ice spikes erupting + freezing frost ring
      const radius = 20 + progress * 160;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 5 * alpha;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 20;

      // Freezing ice ring
      ctx.beginPath();
      ctx.arc(vfx.x, vfx.y, radius, 0, Math.PI * 2);
      ctx.stroke();

      // 12 ice crystal lances
      for (let s = 0; s < 12; s++) {
        const a = (s / 12) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(vfx.x, vfx.y);
        ctx.lineTo(vfx.x + Math.cos(a) * radius, vfx.y + Math.sin(a) * radius);
        ctx.stroke();

        // Shimmering ice diamond tips
        ctx.fillStyle = '#e0f2fe';
        ctx.beginPath();
        ctx.arc(vfx.x + Math.cos(a) * radius, vfx.y + Math.sin(a) * radius, 7 * alpha, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'elem-lightning': {
      // 3. Arc Voltage Chain: Electric storm field with 6 jagged branching lightning bolts
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 5 * alpha;
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 25;

      for (let l = 0; l < 6; l++) {
        const a = (l / 6) * Math.PI * 2;
        let lx = vfx.x;
        let ly = vfx.y;
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        for (let seg = 0; seg < 5; seg++) {
          lx += Math.cos(a) * 35 + (Math.random() - 0.5) * 35;
          ly += Math.sin(a) * 35 + (Math.random() - 0.5) * 35;
          ctx.lineTo(lx, ly);
        }
        ctx.stroke();
      }

      // Central blinding plasma core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(vfx.x, vfx.y, 16 * alpha, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'elem-earth': {
      // 4. Tectonic Quake: 8 deep ground fissures and 6 flying orbiting boulders
      const radius = 25 + progress * 170;
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 6 * alpha;
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 18;

      // Radial fissure cracks
      for (let f = 0; f < 8; f++) {
        const fa = (f / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(vfx.x, vfx.y);
        ctx.lineTo(vfx.x + Math.cos(fa) * radius, vfx.y + Math.sin(fa) * radius);
        ctx.stroke();
      }

      // Flying rock boulders
      for (let b = 0; b < 6; b++) {
        const ba = (b / 6) * Math.PI * 2 + progress * 2;
        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.arc(vfx.x + Math.cos(ba) * (radius * 0.75), vfx.y + Math.sin(ba) * (radius * 0.75), 11 * alpha, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'elem-wind': {
      // 5. Cyclone Vortex: Swirling emerald hurricane spiral with wind sickle blades
      const radius = 25 + progress * 150;
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 5 * alpha;
      ctx.shadowColor = '#34d399';
      ctx.shadowBlur = 20;

      // Double spiral
      ctx.beginPath();
      ctx.arc(vfx.x, vfx.y, radius, progress * 10, progress * 10 + Math.PI * 1.6);
      ctx.stroke();

      ctx.strokeStyle = '#6ee7b7';
      ctx.beginPath();
      ctx.arc(vfx.x, vfx.y, radius * 0.6, -progress * 10, -progress * 10 + Math.PI * 1.6);
      ctx.stroke();
      break;
    }

    case 'elem-poison': {
      // 6. Venom Miasma: Boiling toxic sludge puddle with bursting acid bubbles
      const radius = 30 + progress * 140;
      ctx.fillStyle = 'rgba(132, 204, 22, 0.45)';
      ctx.beginPath();
      ctx.arc(vfx.x, vfx.y, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#a3e635';
      ctx.lineWidth = 4 * alpha;
      ctx.stroke();

      // 6 toxic bubbles popping
      for (let b = 0; b < 6; b++) {
        const a = (b / 6) * Math.PI * 2 + progress * 3;
        ctx.fillStyle = '#bef264';
        ctx.beginPath();
        ctx.arc(vfx.x + Math.cos(a) * (radius * 0.65), vfx.y + Math.sin(a) * (radius * 0.65), 8 * alpha, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'cosm-blackhole': {
      // 7. Singularity Core: Dark matter vortex with violet relativistic accretion ring
      const radius = 30 + progress * 180;
      // Event horizon core
      ctx.fillStyle = '#05010a';
      ctx.beginPath();
      ctx.arc(vfx.x, vfx.y, 32 * alpha, 0, Math.PI * 2);
      ctx.fill();

      // Swirling violet accretion disk
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 7 * alpha;
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 26;

      ctx.beginPath();
      ctx.arc(vfx.x, vfx.y, radius, progress * 8, progress * 8 + Math.PI * 1.8);
      ctx.stroke();

      // Inward pulling matter particles
      for (let p = 0; p < 8; p++) {
        const pa = (p / 8) * Math.PI * 2 - progress * 6;
        const pr = radius * (1.0 - progress * 0.7);
        ctx.fillStyle = '#f3e8ff';
        ctx.beginPath();
        ctx.arc(vfx.x + Math.cos(pa) * pr, vfx.y + Math.sin(pa) * pr, 4 * alpha, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'cosm-teleport': {
      // 8. Quantum Warp: Dimensional cyber glitch rings & particle implosion
      const radius = 25 + progress * 140;
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 4 * alpha;
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 20;

      // Multiple square glitch rings
      ctx.strokeRect(vfx.x - radius, vfx.y - radius, radius * 2, radius * 2);
      ctx.strokeStyle = '#a855f7';
      ctx.strokeRect(vfx.x - radius * 0.6, vfx.y - radius * 0.6, radius * 1.2, radius * 1.2);
      break;
    }

    case 'cosm-gravity': {
      // 9. Gravitational Inversion: Astral purple energy beams rising upward
      const radius = 25 + progress * 150;
      ctx.strokeStyle = '#9333ea';
      ctx.lineWidth = 5 * alpha;
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 22;

      ctx.beginPath();
      ctx.arc(vfx.x, vfx.y, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Vertical energy beams
      for (let b = -3; b <= 3; b++) {
        const bx = vfx.x + b * 20;
        ctx.strokeStyle = 'rgba(216, 180, 254, 0.7)';
        ctx.beginPath();
        ctx.moveTo(bx, vfx.y + 40);
        ctx.lineTo(bx, vfx.y - 80 - progress * 60);
        ctx.stroke();
      }
      break;
    }

    case 'cosm-shield': {
      // 10. Prismatic Aegis: Hexagonal crystal shield dome with iridescent prisms
      const shieldR = vfx.radius + 15 + Math.sin(progress * Math.PI) * 10;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 5 * alpha;
      ctx.shadowColor = '#e0f2fe';
      ctx.shadowBlur = 20;

      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + progress * 4;
        const sx = vfx.x + Math.cos(a) * shieldR;
        const sy = vfx.y + Math.sin(a) * shieldR;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.closePath();
      ctx.stroke();

      ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.fill();
      break;
    }

    case 'tech-emp': {
      // 11. Electromagnetic Pulse: Expanding cyan digital shockwave with binary code
      const radius = 30 + progress * 220;
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 6 * alpha;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 25;

      ctx.beginPath();
      ctx.arc(vfx.x, vfx.y, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Floating digital binary bits
      ctx.fillStyle = '#e0f2fe';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      for (let bit = 0; bit < 6; bit++) {
        const a = (bit / 6) * Math.PI * 2;
        const text = bit % 2 === 0 ? '1' : '0';
        ctx.fillText(text, vfx.x + Math.cos(a) * (radius * 0.8), vfx.y + Math.sin(a) * (radius * 0.8));
      }
      break;
    }

    case 'tech-nuke': {
      // 12. Megaton Fallout: Blinding nuclear blast + mushroom cloud fireball
      const radius = 35 + progress * 240;
      ctx.fillStyle = 'rgba(239, 68, 68, 0.45)';
      ctx.beginPath();
      ctx.arc(vfx.x, vfx.y, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 8 * alpha;
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 30;

      ctx.beginPath();
      ctx.arc(vfx.x, vfx.y, radius * 0.75, 0, Math.PI * 2);
      ctx.stroke();

      // Radioactive trefoil hazard flash
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(vfx.x, vfx.y, 22 * alpha, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'tech-laser': {
      // 13. Orbital Ion Lance: Piercing full arena straight laser beam
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 18 * alpha;
      ctx.shadowColor = '#e11d48';
      ctx.shadowBlur = 28;

      ctx.beginPath();
      ctx.moveTo(0, vfx.y);
      ctx.lineTo(w, vfx.y);
      ctx.stroke();

      // Bright white laser core
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 6 * alpha;
      ctx.beginPath();
      ctx.moveTo(0, vfx.y);
      ctx.lineTo(w, vfx.y);
      ctx.stroke();
      break;
    }

    case 'tech-landmines':
    case 'tech-mines': {
      // 14. Futuristic Laser Tripwire Minefield: Hexagonal holographic field with laser crosshairs
      const radius = 30 + progress * 150;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 4 * alpha;
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 18;

      // Hexagonal laser tripwire grid
      ctx.beginPath();
      for (let h = 0; h < 6; h++) {
        const ha = (h / 6) * Math.PI * 2 + progress * 2;
        const hx = vfx.x + Math.cos(ha) * radius;
        const hy = vfx.y + Math.sin(ha) * radius;
        if (h === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.stroke();

      // Pulsing laser tripwires to 3 sub-mines
      for (let m = 0; m < 3; m++) {
        const ma = (m / 3) * Math.PI * 2 - progress * 3;
        const mx = vfx.x + Math.cos(ma) * (radius * 0.7);
        const my = vfx.y + Math.sin(ma) * (radius * 0.7);

        // Core mine LED
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(mx, my, 8, 0, Math.PI * 2);
        ctx.fill();

        // Laser ping
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2 * alpha;
        ctx.beginPath();
        ctx.moveTo(vfx.x, vfx.y);
        ctx.lineTo(mx, my);
        ctx.stroke();
      }
      break;
    }

    case 'chaos-growth': {
      // 15. Titan Metamorphosis (+15% Daño Titán): Gigantic emerald-gold shockwave & earthquake rings
      const radius = 35 + progress * 200;
      ctx.strokeStyle = '#14b8a6';
      ctx.lineWidth = 8 * alpha;
      ctx.shadowColor = '#2dd4bf';
      ctx.shadowBlur = 28;

      ctx.beginPath();
      ctx.arc(vfx.x, vfx.y, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Secondary golden aura
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 4 * alpha;
      ctx.beginPath();
      ctx.arc(vfx.x, vfx.y, radius * 0.65, 0, Math.PI * 2);
      ctx.stroke();

      // Earth fissures
      for (let r = 0; r < 8; r++) {
        const a = (r / 8) * Math.PI * 2;
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 3 * alpha;
        ctx.beginPath();
        ctx.moveTo(vfx.x, vfx.y);
        ctx.lineTo(vfx.x + Math.cos(a) * (radius * 1.15), vfx.y + Math.sin(a) * (radius * 1.15));
        ctx.stroke();
      }
      break;
    }

    case 'meme-dupe':
    case 'chaos-clones': {
      // 16. Shadow Clone Mitosis: Comic smoke puff & splitting illusion clones
      const radius = 25 + progress * 140;
      ctx.fillStyle = 'rgba(168, 85, 247, 0.4)';
      ctx.beginPath();
      ctx.arc(vfx.x, vfx.y, radius, 0, Math.PI * 2);
      ctx.fill();

      // 2 Phantom ghost clones
      [-40, 40].forEach(offset => {
        ctx.fillStyle = 'rgba(192, 132, 252, 0.6)';
        ctx.beginPath();
        ctx.arc(vfx.x + offset, vfx.y, vfx.radius * 0.9, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }

    case 'chaos-magnet': {
      // 17. Imán Voraz de Monedas: Erupción de monedas giratorias de cobre, plata y oro con destellos!
      const radius = 30 + progress * 160;
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 5 * alpha;
      ctx.shadowColor = '#fde047';
      ctx.shadowBlur = 24;

      ctx.beginPath();
      ctx.ellipse(vfx.x, vfx.y, radius, radius * 0.55, progress * 4, 0, Math.PI * 2);
      ctx.stroke();

      // Flying coins (Copper, Silver, Gold)
      const coinTypes = [
        { color: '#d97706', size: 5, border: '#b45309' }, // Cobre
        { color: '#cbd5e1', size: 7, border: '#94a3b8' }, // Plata
        { color: '#facc15', size: 9, border: '#ca8a04' }  // Oro
      ];

      for (let c = 0; c < 9; c++) {
        const ca = (c / 9) * Math.PI * 2 + progress * 6;
        const cr = radius * (0.3 + (c % 3) * 0.35);
        const coin = coinTypes[c % 3];
        const cx = vfx.x + Math.cos(ca) * cr;
        const cy = vfx.y + Math.sin(ca) * (cr * 0.6);

        ctx.save();
        ctx.fillStyle = coin.color;
        ctx.strokeStyle = coin.border;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, coin.size * alpha, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
      break;
    }

    case 'meme-speed':
    case 'chaos-blitz': {
      // 18. Sonic Mach Dash: Hyperdrive supersonic speed streaks & conical boom
      const radius = 25 + progress * 160;
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 5 * alpha;
      ctx.shadowColor = '#fef08a';
      ctx.shadowBlur = 22;

      ctx.beginPath();
      ctx.arc(vfx.x, vfx.y, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Sonic Mach Cones
      for (let i = -2; i <= 2; i++) {
        const offset = i * 25;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3 * alpha;
        ctx.beginPath();
        ctx.moveTo(vfx.x + offset, vfx.y - 40);
        ctx.lineTo(vfx.x + offset * 1.5, vfx.y + 40);
        ctx.stroke();
      }
      break;
    }

    case 'meme-anvil': {
      // 19. 100-Ton Cartoon Drop: Massive anvil falling & slamming with CLANG!
      const dropY = Math.min(vfx.y, vfx.y - 180 + progress * 320);
      ctx.fillStyle = '#475569';
      ctx.fillRect(vfx.x - 32, dropY - 26, 64, 30);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(vfx.x - 45, dropY + 4, 90, 20);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('100 TONS', vfx.x, dropY - 4);

      // Impact starburst when landing
      if (progress > 0.4) {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4 * alpha;
        ctx.strokeRect(vfx.x - 55, vfx.y - 10, 110, 30);
      }
      break;
    }

    case 'chaos-tornado':
    case 'meme-tornado': {
      // 20. Chaos Whirlwind: Cartoon colorful dust devil with flying stars
      const radius = 25 + progress * 160;
      const colors = ['#f43f5e', '#a855f7', '#3b82f6', '#10b981', '#f59e0b'];
      ctx.lineWidth = 4 * alpha;

      colors.forEach((col, idx) => {
        ctx.strokeStyle = col;
        ctx.beginPath();
        ctx.arc(vfx.x, vfx.y, radius * (0.4 + idx * 0.15), progress * 8 + idx, progress * 8 + idx + Math.PI * 1.2);
        ctx.stroke();
      });
      break;
    }

    case 'legend-fisherman': {
      // 21. Master Angler: Whipping curved fishing line, water ripple waves & golden hook
      const radius = 25 + progress * 180;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 5 * alpha;
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 24;

      // Aquatic wave rings
      ctx.beginPath();
      ctx.ellipse(vfx.x, vfx.y, radius, radius * 0.5, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Whipping line
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5 * alpha;
      ctx.beginPath();
      ctx.moveTo(vfx.x, vfx.y);
      ctx.quadraticCurveTo(vfx.x + 40, vfx.y - 60, vfx.x + radius * 0.9, vfx.y);
      ctx.stroke();

      // Hook spark
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(vfx.x + radius * 0.9, vfx.y, 8 * alpha, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    default: {
      // Fallback: Vibrant Expanding Energy Burst in marble's color
      const radius = 25 + progress * 160;
      ctx.strokeStyle = vfx.color;
      ctx.lineWidth = 6 * alpha;
      ctx.shadowColor = vfx.color;
      ctx.shadowBlur = 22;

      ctx.beginPath();
      ctx.arc(vfx.x, vfx.y, radius, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
  }

  // ========================================================
  // PROMINENT FLOATING COMIC ABILITY BANNER
  // Renders directly above the casting marble so players
  // INSTANTLY see which ability was fired!
  // ========================================================
  const bannerY = vfx.y - vfx.radius - 28 - progress * 20;
  const bannerWidth = Math.max(120, vfx.name.length * 9 + 40);

  // Banner background capsule
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = 'rgba(2, 6, 23, 0.88)';
  ctx.strokeStyle = vfx.color;
  ctx.lineWidth = 2;
  ctx.shadowColor = vfx.color;
  ctx.shadowBlur = 12;

  const bx = vfx.x - bannerWidth / 2;
  const by = bannerY - 14;
  ctx.beginPath();
  ctx.roundRect(bx, by, bannerWidth, 24, 12);
  ctx.fill();
  ctx.stroke();

  // Banner glowing text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px "Outfit", sans-serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = vfx.color;
  ctx.shadowBlur = 6;
  ctx.fillText(`★ ${vfx.name.toUpperCase()}!`, vfx.x, bannerY + 2);
  ctx.restore();

  ctx.restore();
}
