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
      // 7. LEGENDARY: Agujero Negro Cósmico - Colossal Gravitational Singularity
      const radius = 35 + progress * 240;
      
      // 1. Spacetime Gravitational Distortion Rings (warping space)
      for (let w = 0; w < 3; w++) {
        const wr = radius * (0.6 + w * 0.25);
        ctx.strokeStyle = w % 2 === 0 ? 'rgba(168, 85, 247, 0.4)' : 'rgba(236, 72, 153, 0.3)';
        ctx.lineWidth = (6 - w * 1.5) * alpha;
        ctx.beginPath();
        ctx.arc(vfx.x, vfx.y, wr, progress * (4 - w), progress * (4 - w) + Math.PI * 1.8);
        ctx.stroke();
      }

      // 2. Swirling High-Velocity Accretion Disk (hyper-relativistic neon plasma)
      const gradAccretion = ctx.createRadialGradient(vfx.x, vfx.y, 10, vfx.x, vfx.y, radius);
      gradAccretion.addColorStop(0, 'rgba(126, 34, 206, 0.9)');
      gradAccretion.addColorStop(0.3, 'rgba(168, 85, 247, 0.7)');
      gradAccretion.addColorStop(0.7, 'rgba(236, 72, 153, 0.4)');
      gradAccretion.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradAccretion;
      ctx.beginPath();
      ctx.arc(vfx.x, vfx.y, radius, 0, Math.PI * 2);
      ctx.fill();

      // 3. 12 Spiral Gravitational Inward Suction Arms
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 3.5 * alpha;
      ctx.shadowColor = '#d8b4fe';
      ctx.shadowBlur = 24;
      for (let a = 0; a < 12; a++) {
        const baseA = (a / 12) * Math.PI * 2 + progress * 9;
        ctx.beginPath();
        for (let step = 0; step < 16; step++) {
          const stepFrac = step / 16;
          const curR = radius * (1.0 - stepFrac);
          const curA = baseA + stepFrac * 2.8;
          const px = vfx.x + Math.cos(curA) * curR;
          const py = vfx.y + Math.sin(curA) * curR;
          if (step === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // 4. Inward collapsing star matter particles
      for (let p = 0; p < 16; p++) {
        const pa = (p / 16) * Math.PI * 2 - progress * 10;
        const pr = radius * (1.0 - (progress * 1.2) % 1.0);
        ctx.fillStyle = p % 2 === 0 ? '#fbcfe8' : '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(vfx.x + Math.cos(pa) * pr, vfx.y + Math.sin(pa) * pr, (3 + (p % 3)) * alpha, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Total Darkness Event Horizon Core with Blinding Photon Ring
      const coreR = Math.max(14, (36 - progress * 16) * alpha);
      ctx.fillStyle = '#02010a';
      ctx.beginPath();
      ctx.arc(vfx.x, vfx.y, coreR, 0, Math.PI * 2);
      ctx.fill();

      // Relativistic White Photon Ring
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4 * alpha;
      ctx.shadowColor = '#f3e8ff';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(vfx.x, vfx.y, coreR, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case 'mag-warp':
    case 'cosm-teleport': {
      // 8. LEGENDARY: Salto Cuántico - Quantum Reality-Shattering Dimensional Phase
      const radius = 30 + progress * 180;

      // 1. Shattered Holographic Cyber-Grid Reality Floor
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2 * alpha;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 16;
      for (let g = -3; g <= 3; g++) {
        ctx.beginPath();
        ctx.moveTo(vfx.x - radius, vfx.y + g * (radius / 3));
        ctx.lineTo(vfx.x + radius, vfx.y + g * (radius / 3));
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(vfx.x + g * (radius / 3), vfx.y - radius);
        ctx.lineTo(vfx.x + g * (radius / 3), vfx.y + radius);
        ctx.stroke();
      }

      // 2. Chromatic Aberration Glitch Squares (Cyan & Magenta phase shifts)
      ctx.save();
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.85)';
      ctx.lineWidth = 5 * alpha;
      ctx.shadowColor = '#ec4899';
      ctx.shadowBlur = 22;
      ctx.strokeRect(vfx.x - radius * 0.8 - 4, vfx.y - radius * 0.8 + 3, radius * 1.6, radius * 1.6);

      ctx.strokeStyle = 'rgba(6, 182, 212, 0.85)';
      ctx.lineWidth = 5 * alpha;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 22;
      ctx.strokeRect(vfx.x - radius * 0.8 + 4, vfx.y - radius * 0.8 - 3, radius * 1.6, radius * 1.6);
      ctx.restore();

      // 3. Tachyon Instantaneous Dimensional Slash Lines
      for (let s = 0; s < 8; s++) {
        const sa = (s / 8) * Math.PI * 2 + progress * 6;
        ctx.strokeStyle = s % 2 === 0 ? '#f472b6' : '#38bdf8';
        ctx.lineWidth = 3.5 * alpha;
        ctx.beginPath();
        ctx.moveTo(vfx.x, vfx.y);
        ctx.lineTo(vfx.x + Math.cos(sa) * radius * 1.2, vfx.y + Math.sin(sa) * radius * 1.2);
        ctx.stroke();
      }

      // 4. Central Quantum Portal Implosion
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#e0f2fe';
      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.arc(vfx.x, vfx.y, 18 * (1 - progress), 0, Math.PI * 2);
      ctx.fill();
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
      // 12. LEGENDARY: Bomba Nuclear Megatón - Colossal Thermonuclear Mushroom Cloud & Radioactive Shockwave
      const radius = 45 + progress * 290;

      // 1. Expanding High-Energy Thermonuclear Blast Wave
      const nukeGrad = ctx.createRadialGradient(vfx.x, vfx.y, 10, vfx.x, vfx.y, radius);
      nukeGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      nukeGrad.addColorStop(0.2, 'rgba(250, 204, 21, 0.85)');
      nukeGrad.addColorStop(0.5, 'rgba(239, 68, 68, 0.7)');
      nukeGrad.addColorStop(0.85, 'rgba(168, 85, 247, 0.4)');
      nukeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = nukeGrad;
      ctx.beginPath();
      ctx.arc(vfx.x, vfx.y, radius, 0, Math.PI * 2);
      ctx.fill();

      // 2. Dual Radioactive Ionization Shockwave Rings
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 8 * alpha;
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 35;
      ctx.beginPath();
      ctx.arc(vfx.x, vfx.y, radius * 0.9, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 4 * alpha;
      ctx.beginPath();
      ctx.arc(vfx.x, vfx.y, radius * 0.65, 0, Math.PI * 2);
      ctx.stroke();

      // 3. Colossal Rising Mushroom Fireball Billows
      for (let c = 0; c < 8; c++) {
        const ca = (c / 8) * Math.PI * 2 + progress * 2;
        const cr = radius * 0.45;
        const cx = vfx.x + Math.cos(ca) * cr;
        const cy = vfx.y - (progress * 60) + Math.sin(ca) * (cr * 0.6);
        ctx.fillStyle = c % 2 === 0 ? 'rgba(239, 68, 68, 0.75)' : 'rgba(245, 158, 11, 0.75)';
        ctx.beginPath();
        ctx.arc(cx, cy, (22 + (c % 3) * 6) * alpha, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Radioactive Trefoil Hazard Core
      ctx.save();
      ctx.translate(vfx.x, vfx.y - progress * 40);
      ctx.rotate(progress * 4);
      for (let t = 0; t < 3; t++) {
        const ta = (t / 3) * Math.PI * 2;
        ctx.fillStyle = '#fef08a';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(Math.cos(ta) * 20, Math.sin(ta) * 20, 14 * alpha, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
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
      // 19. LEGENDARY: Yunque de 100 Toneladas - Colossal Hypersonic Cartoon Anvil Slam & Earthquake Shatter
      const dropY = Math.min(vfx.y, vfx.y - 240 + progress * 480);
      
      // 1. Target Bullseye Warning Decal on Ground
      const targetR = 40 + Math.sin(progress * 15) * 8;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3 * alpha;
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(vfx.x, vfx.y, targetR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(vfx.x - targetR - 10, vfx.y);
      ctx.lineTo(vfx.x + targetR + 10, vfx.y);
      ctx.moveTo(vfx.x, vfx.y - targetR - 10);
      ctx.lineTo(vfx.x, vfx.y + targetR + 10);
      ctx.stroke();

      // 2. Heavy Steel Anvil Body dropping with fiery re-entry smoke lines
      ctx.save();
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 18;

      // Fiery re-entry speed lines behind the anvil
      if (dropY < vfx.y) {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 4 * alpha;
        for (let l = -30; l <= 30; l += 15) {
          ctx.beginPath();
          ctx.moveTo(vfx.x + l, dropY - 20);
          ctx.lineTo(vfx.x + l, dropY - 80);
          ctx.stroke();
        }
      }

      // Main Anvil Silhouette
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(vfx.x - 42, dropY - 30);
      ctx.lineTo(vfx.x + 55, dropY - 30);
      ctx.lineTo(vfx.x + 25, dropY);
      ctx.lineTo(vfx.x + 35, dropY + 28);
      ctx.lineTo(vfx.x - 35, dropY + 28);
      ctx.lineTo(vfx.x - 20, dropY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Stamped "100 TONS" Comic Typography
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 13px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('100 TONS', vfx.x - 4, dropY + 4);
      ctx.restore();

      // 3. Colossal Earthquake Impact upon landing (progress > 0.3)
      if (progress > 0.3) {
        const impactProg = (progress - 0.3) / 0.7;
        const impactR = 30 + impactProg * 190;
        
        // Jagged Ground Fracture Cracks
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 5 * (1 - impactProg);
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 20;
        for (let c = 0; c < 8; c++) {
          const ca = (c / 8) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(vfx.x, vfx.y);
          ctx.lineTo(vfx.x + Math.cos(ca) * impactR, vfx.y + Math.sin(ca) * (impactR * 0.6));
          ctx.stroke();
        }

        // Flying Comic Gold Stars & Puffs
        for (let s = 0; s < 6; s++) {
          const sa = (s / 6) * Math.PI * 2 + impactProg * 4;
          const sx = vfx.x + Math.cos(sa) * (impactR * 0.8);
          const sy = vfx.y - 20 + Math.sin(sa) * (impactR * 0.4);
          ctx.fillStyle = '#facc15';
          ctx.font = 'bold 16px sans-serif';
          ctx.fillText('💫', sx - 8, sy);
        }
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
      // 21. LEGENDARY: Pescador - Master Angler Mythic Reel, Tidal Wave & Leaping Trophy Fishes
      const radius = 35 + progress * 240;

      // 1. Massive Ocean Whirlpool Tidal Wave Surge
      const waveGrad = ctx.createRadialGradient(vfx.x, vfx.y, 10, vfx.x, vfx.y, radius);
      waveGrad.addColorStop(0, 'rgba(14, 165, 233, 0.85)');
      waveGrad.addColorStop(0.5, 'rgba(2, 132, 199, 0.55)');
      waveGrad.addColorStop(0.85, 'rgba(56, 189, 248, 0.3)');
      waveGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = waveGrad;
      ctx.beginPath();
      ctx.arc(vfx.x, vfx.y, radius, 0, Math.PI * 2);
      ctx.fill();

      // 2. High-Tension Electric Cyan Fishing Line
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3.5 * alpha;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.moveTo(vfx.x, vfx.y);
      ctx.quadraticCurveTo(vfx.x + 50, vfx.y - 90, vfx.x + radius * 0.95, vfx.y);
      ctx.stroke();

      // 3. Huge Gleaming Golden Treble Hook
      const hookX = vfx.x + radius * 0.95;
      const hookY = vfx.y;
      ctx.fillStyle = '#f59e0b';
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(hookX, hookY, 12 * alpha, 0, Math.PI * 2);
      ctx.fill();

      // 4. Leaping Aquatic Trophy Fishes jumping in dynamic arcs
      for (let f = 0; f < 4; f++) {
        const fa = (f / 4) * Math.PI * 2 + progress * 5;
        const fr = radius * 0.75;
        const fx = vfx.x + Math.cos(fa) * fr;
        const fy = vfx.y + Math.sin(fa) * (fr * 0.55);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🐟', fx, fy);
      }

      // 5. Water Geysers & Foam Splash Rings
      ctx.strokeStyle = '#e0f2fe';
      ctx.lineWidth = 4 * alpha;
      ctx.beginPath();
      ctx.ellipse(vfx.x, vfx.y, radius * 0.85, radius * 0.45, 0, 0, Math.PI * 2);
      ctx.stroke();
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
