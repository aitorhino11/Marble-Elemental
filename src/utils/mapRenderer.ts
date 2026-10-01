/**
 * Production Unique Map Architecture & Detailed Canvas Environment Renderer
 * Renders deeply detailed, animated, themed sceneries for each map (NOT just color changes).
 */

export function drawUniqueMapDecorations(
  ctx: CanvasRenderingContext2D,
  mapId: string,
  w: number,
  h: number,
  t: number
) {
  ctx.save();

  switch (mapId) {
    case 'magma': {
      // ========================================================
      // 1. MAGMA CALDERA
      // Scorched obsidian basalt rock, glowing volcanic cracks,
      // 4 boiling magma pools with bubbles, central lava geyser
      // ========================================================

      // Basalt stone tectonic floor tiles
      ctx.strokeStyle = 'rgba(80, 20, 10, 0.4)';
      ctx.lineWidth = 2;
      for (let x = 60; x < w; x += 120) {
        ctx.beginPath();
        ctx.moveTo(x + Math.sin(x) * 15, 0);
        ctx.lineTo(x - Math.cos(x) * 15, h);
        ctx.stroke();
      }

      // Branching Glowing Magma Fissures
      const pulse = 0.85 + Math.sin(t * 3.5) * 0.15;
      ctx.strokeStyle = `rgba(249, 115, 22, ${0.7 * pulse})`;
      ctx.lineWidth = 5;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 18;

      // Central lava river
      ctx.beginPath();
      ctx.moveTo(w * 0.12, h * 0.48);
      ctx.lineTo(w * 0.28, h * 0.38);
      ctx.lineTo(w * 0.42, h * 0.52);
      ctx.lineTo(w * 0.58, h * 0.46);
      ctx.lineTo(w * 0.74, h * 0.58);
      ctx.lineTo(w * 0.88, h * 0.5);
      ctx.stroke();

      // Branching veins
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = `rgba(251, 191, 36, ${0.9 * pulse})`;
      ctx.beginPath();
      ctx.moveTo(w * 0.42, h * 0.52);
      ctx.lineTo(w * 0.48, h * 0.75);
      ctx.lineTo(w * 0.62, h * 0.82);
      ctx.moveTo(w * 0.58, h * 0.46);
      ctx.lineTo(w * 0.52, h * 0.22);
      ctx.lineTo(w * 0.38, h * 0.15);
      ctx.stroke();

      // Central Molten Caldera Geyser Crater
      const cx = w / 2;
      const cy = h / 2;
      const geyserGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 70);
      geyserGrad.addColorStop(0, 'rgba(254, 240, 138, 0.7)');
      geyserGrad.addColorStop(0.3, 'rgba(249, 115, 22, 0.5)');
      geyserGrad.addColorStop(0.7, 'rgba(185, 28, 28, 0.25)');
      geyserGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = geyserGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 70, 0, Math.PI * 2);
      ctx.fill();

      // Ancient Fiery Rune Sigil in center
      ctx.strokeStyle = `rgba(252, 211, 77, ${0.6 * pulse})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 42, 0, Math.PI * 2);
      ctx.stroke();

      // 4 Volcanic Corner Magma Pools with bubbling lava
      const ventCorners = [
        { x: 55, y: 55 },
        { x: w - 55, y: 55 },
        { x: 55, y: h - 55 },
        { x: w - 55, y: h - 55 }
      ];

      ventCorners.forEach((vent, i) => {
        const ventPulse = 1 + Math.sin(t * 4 + i * 1.5) * 0.15;
        // Outer dark rock rim
        ctx.fillStyle = '#450a0a';
        ctx.beginPath();
        ctx.arc(vent.x, vent.y, 32 * ventPulse, 0, Math.PI * 2);
        ctx.fill();

        // Molten lava pool
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(vent.x, vent.y, 22 * ventPulse, 0, Math.PI * 2);
        ctx.fill();

        // Popping white-hot bubble
        const bubbleR = 5 + Math.abs(Math.sin(t * 5 + i * 2)) * 6;
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(vent.x + Math.sin(t + i) * 6, vent.y + Math.cos(t + i) * 6, bubbleR, 0, Math.PI * 2);
        ctx.fill();
      });

      // Molten Perimeter Scorch Trim
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 3;
      ctx.setLineDash([16, 8]);
      ctx.strokeRect(18, 18, w - 36, h - 36);
      ctx.setLineDash([]);
      break;
    }

    case 'cyber': {
      // ========================================================
      // 2. CYBER NEON GRID
      // Hexagonal central CPU core with rotating data rings,
      // moving glowing data packets along circuit traces,
      // synthwave perspective lines and equalizer bars
      // ========================================================
      const cx = w / 2;
      const cy = h / 2;

      // Neon Synthwave floor grid with glow
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.16)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Central Quantum CPU Holographic Reactor
      ctx.save();
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 16;
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2.5;

      // Outer rotating hexagon
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + (t * 0.4);
        const hx = cx + Math.cos(a) * 78;
        const hy = cy + Math.sin(a) * 78;
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.stroke();

      // Inner counter-rotating hexagon
      ctx.strokeStyle = '#a855f7';
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 - (t * 0.5);
        const hx = cx + Math.cos(a) * 52;
        const hy = cy + Math.sin(a) * 52;
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.stroke();

      // Glowing CPU microchip in center
      ctx.fillStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.fillRect(cx - 24, cy - 24, 48, 48);
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - 24, cy - 24, 48, 48);

      // CPU Text
      ctx.fillStyle = '#e0f2fe';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('CORE AI', cx, cy + 4);
      ctx.restore();

      // PCB Circuit Traces connecting to corners
      const traces = [
        [40, 45, w * 0.22, 45, w * 0.32, cy - 45],
        [w - 40, 45, w * 0.78, 45, w * 0.68, cy - 45],
        [40, h - 45, w * 0.22, h - 45, w * 0.32, cy + 45],
        [w - 40, h - 45, w * 0.78, h - 45, w * 0.68, cy + 45]
      ];

      ctx.strokeStyle = 'rgba(6, 182, 212, 0.45)';
      ctx.lineWidth = 2;
      traces.forEach(pts => {
        ctx.beginPath();
        ctx.moveTo(pts[0], pts[1]);
        ctx.lineTo(pts[2], pts[3]);
        ctx.lineTo(pts[4], pts[5]);
        ctx.stroke();

        // Terminal solder points
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(pts[0], pts[1], 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Animated glowing data packets traveling along the traces
      const packetPhase = (t * 2) % 1.0;
      traces.forEach(pts => {
        const px = pts[0] + (pts[2] - pts[0]) * packetPhase;
        const py = pts[1] + (pts[3] - pts[1]) * packetPhase;
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Audio Equalizer Spectrum Bars on top & bottom walls
      const eqCount = 20;
      for (let b = 0; b < eqCount; b++) {
        const bx = w * 0.18 + (b * (w * 0.64 / eqCount));
        const bh = 5 + Math.abs(Math.sin(t * 4 + b * 0.6)) * 18;
        ctx.fillStyle = b % 2 === 0 ? '#06b6d4' : '#a855f7';
        ctx.fillRect(bx, 15, 5, bh);
        ctx.fillRect(bx, h - 15 - bh, 5, bh);
      }
      break;
    }

    case 'frozen': {
      // ========================================================
      // 3. FROZEN ABYSS (GLACIAR ÁRTICO)
      // Crystalline translucent ice fractures, frosted runic compass,
      // 4 corner 3D ice spires, drifting snow, aurora borealis wave
      // ========================================================
      const cx = w / 2;
      const cy = h / 2;

      // Aurora Borealis wave band across top backdrop
      const auroraGrad = ctx.createLinearGradient(0, 0, w, 140);
      auroraGrad.addColorStop(0, 'rgba(16, 185, 129, 0)');
      auroraGrad.addColorStop(0.3, `rgba(56, 189, 248, ${0.18 + Math.sin(t * 1.5) * 0.08})`);
      auroraGrad.addColorStop(0.7, `rgba(168, 85, 247, ${0.16 + Math.cos(t * 1.2) * 0.06})`);
      auroraGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = auroraGrad;
      ctx.fillRect(0, 0, w, 150);

      // Deep glacial ice fracture lines
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.35)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w * 0.1, h * 0.2);
      ctx.lineTo(w * 0.32, h * 0.38);
      ctx.lineTo(w * 0.45, h * 0.28);
      ctx.lineTo(w * 0.72, h * 0.42);
      ctx.lineTo(w * 0.9, h * 0.25);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(w * 0.2, h * 0.75);
      ctx.lineTo(w * 0.38, h * 0.62);
      ctx.lineTo(w * 0.65, h * 0.72);
      ctx.lineTo(w * 0.85, h * 0.68);
      ctx.stroke();

      // Ancient Frozen Runic Snowflake Compass at center
      ctx.save();
      ctx.strokeStyle = '#bae6fd';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 14;

      // Snowflake rays
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + (t * 0.05);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        const ex = cx + Math.cos(a) * 85;
        const ey = cy + Math.sin(a) * 85;
        ctx.lineTo(ex, ey);

        // Sub-branches
        const mx = cx + Math.cos(a) * 50;
        const my = cy + Math.sin(a) * 50;
        ctx.moveTo(mx, my);
        ctx.lineTo(mx + Math.cos(a + 0.6) * 22, my + Math.sin(a + 0.6) * 22);
        ctx.moveTo(mx, my);
        ctx.lineTo(mx + Math.cos(a - 0.6) * 22, my + Math.sin(a - 0.6) * 22);
        ctx.stroke();

        // Shimmering ice star tip
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // 4 Corner 3D Ice Crystal Stalagmites with depth
      const iceCorners = [
        { x: 45, y: 45, dx: 1, dy: 1 },
        { x: w - 45, y: 45, dx: -1, dy: 1 },
        { x: 45, y: h - 45, dx: 1, dy: -1 },
        { x: w - 45, y: h - 45, dx: -1, dy: -1 }
      ];

      iceCorners.forEach(c => {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.strokeStyle = '#e0f2fe';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(c.x + c.dx * 55, c.y);
        ctx.lineTo(c.x + c.dx * 28, c.y + c.dy * 55);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Shading facet
        ctx.fillStyle = 'rgba(186, 230, 253, 0.55)';
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(c.x, c.y + c.dy * 55);
        ctx.lineTo(c.x + c.dx * 28, c.y + c.dy * 55);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });
      break;
    }

    case 'cosmic': {
      // ========================================================
      // 4. COSMIC SINGULARITY (VÓRTICE CÓSMICO)
      // Swirling multi-armed galactic spiral, twinkling starfield,
      // gravitational warping rings, astrological constellation lines
      // ========================================================
      const cx = w / 2;
      const cy = h / 2;

      // Deep space starfield (fixed algorithmic seed)
      ctx.fillStyle = '#ffffff';
      for (let s = 0; s < 36; s++) {
        const sx = ((s * 137.5) % w);
        const sy = ((s * 93.3) % h);
        const twinkle = 0.4 + Math.sin(t * 3 + s) * 0.4;
        ctx.globalAlpha = twinkle;
        ctx.beginPath();
        ctx.arc(sx, sy, (s % 3 === 0 ? 2.5 : 1.5), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      // Swirling Galactic Spiral Arms
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * 0.12);

      for (let arm = 0; arm < 3; arm++) {
        const armAngle = (arm / 3) * Math.PI * 2;
        ctx.beginPath();
        for (let r = 15; r < 140; r += 8) {
          const theta = armAngle + (r * 0.04);
          const gx = Math.cos(theta) * r;
          const gy = Math.sin(theta) * r;
          if (r === 15) ctx.moveTo(gx, gy);
          else ctx.lineTo(gx, gy);
        }
        ctx.strokeStyle = 'rgba(192, 132, 252, 0.4)';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#c084fc';
        ctx.shadowBlur = 12;
        ctx.stroke();
      }
      ctx.restore();

      // Gravitational Singularity Core (Black Hole with Event Horizon)
      const coreGrad = ctx.createRadialGradient(cx, cy, 4, cx, cy, 38);
      coreGrad.addColorStop(0, '#05010a');
      coreGrad.addColorStop(0.5, '#1e082b');
      coreGrad.addColorStop(0.85, '#9333ea');
      coreGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 38, 0, Math.PI * 2);
      ctx.fill();

      // Elliptical Orbiting Gravity Rings
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 180, 85, t * 0.08, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(cx, cy, 260, 125, -t * 0.06, 0, Math.PI * 2);
      ctx.stroke();

      // Constellation Star Lines
      const constel = [
        [w * 0.15, h * 0.2],
        [w * 0.24, h * 0.14],
        [w * 0.32, h * 0.26],
        [w * 0.22, h * 0.38]
      ];
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      constel.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt[0], pt[1]);
        else ctx.lineTo(pt[0], pt[1]);
      });
      ctx.closePath();
      ctx.stroke();

      constel.forEach(pt => {
        ctx.fillStyle = '#f3e8ff';
        ctx.beginPath();
        ctx.arc(pt[0], pt[1], 3, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }

    case 'golden': {
      // ========================================================
      // 5. GOLDEN COLISEUM (COLISEO IMPERIAL)
      // Polished Roman marble arena tiles, Imperial Golden Eagle & Laurel
      // medallion, 4 monumental Corinthian pillars with animated fire braziers
      // ========================================================
      const cx = w / 2;
      const cy = h / 2;

      // Paved Classical Roman Marble Floor Tiles
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.15)';
      ctx.lineWidth = 1.5;
      for (let x = 0; x < w; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Center Imperial Roman Laurel Wreath Medallion
      ctx.save();
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#ca8a04';
      ctx.shadowBlur = 14;

      ctx.beginPath();
      ctx.arc(cx, cy, 95, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 75, 0, Math.PI * 2);
      ctx.stroke();

      // Laurel leaves around circle
      for (let l = 0; l < 20; l++) {
        const la = (l / 20) * Math.PI * 2;
        const lx = cx + Math.cos(la) * 85;
        const ly = cy + Math.sin(la) * 85;
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.ellipse(lx, ly, 8, 4, la + 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Imperial Golden Eagle Emblem in Center
      ctx.fillStyle = '#eab308';
      ctx.font = 'bold 22px serif';
      ctx.textAlign = 'center';
      ctx.fillText('SPQR', cx, cy + 8);
      ctx.restore();

      // 4 Monumental Roman Columns with Flaming Braziers
      const colX = [60, w - 60];
      const colY = [60, h - 60];

      colX.forEach((px, i) => {
        colY.forEach((py, j) => {
          // Column shaft
          ctx.fillStyle = '#854d0e';
          ctx.fillRect(px - 16, py - 20, 32, 40);

          // Capital & Pedestal
          ctx.fillStyle = '#eab308';
          ctx.fillRect(px - 22, py - 24, 44, 7);
          ctx.fillRect(px - 22, py + 18, 44, 7);

          // Fluted vertical grooves
          ctx.strokeStyle = '#ca8a04';
          ctx.lineWidth = 1.5;
          for (let f = -10; f <= 10; f += 5) {
            ctx.beginPath();
            ctx.moveTo(px + f, py - 18);
            ctx.lineTo(px + f, py + 18);
            ctx.stroke();
          }

          // Animated Brazier Fire on Top
          const firePulse = Math.sin(t * 8 + i * 2 + j * 3) * 3;
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.arc(px, py - 30 + firePulse, 9, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(px, py - 32 + firePulse, 5, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      // Roman Numerals along border
      ctx.fillStyle = 'rgba(234, 179, 8, 0.45)';
      ctx.font = 'bold 12px serif';
      ctx.textAlign = 'center';
      ctx.fillText('· I · IV · VII · X · CLASH ·', cx, 24);
      ctx.fillText('· ARENA IMPERIALIS ·', cx, h - 16);
      break;
    }

    case 'toxic': {
      // ========================================================
      // 6. TOXIC MIRE (PANTANO RADIACTIVO)
      // Industrial corrugated steel floor with metal rivets,
      // glowing acid pools with bubbles, massive center biohazard insignia,
      // drainage pipes with dripping acid, yellow/black hazard chevrons
      // ========================================================
      const cx = w / 2;
      const cy = h / 2;

      // Industrial Hazard Chevrons (Yellow and Black diagonal caution stripes)
      const stripeW = 22;
      for (let s = 10; s < w - 10; s += stripeW * 2) {
        ctx.fillStyle = '#eab308';
        ctx.fillRect(s, 10, stripeW, 9);
        ctx.fillRect(s, h - 19, stripeW, 9);
      }

      // Corrugated steel grid plates with rivets
      ctx.strokeStyle = 'rgba(132, 204, 22, 0.15)';
      ctx.lineWidth = 1.5;
      for (let x = 30; x < w; x += 70) {
        ctx.beginPath();
        ctx.moveTo(x, 20);
        ctx.lineTo(x, h - 20);
        ctx.stroke();

        // Rivets
        ctx.fillStyle = '#475569';
        for (let y = 30; y < h; y += 70) {
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Massive Center Biohazard Symbol with glowing toxic halo
      ctx.save();
      ctx.strokeStyle = '#84cc16';
      ctx.lineWidth = 4.5;
      ctx.shadowColor = '#a3e635';
      ctx.shadowBlur = 16;

      for (let b = 0; b < 3; b++) {
        const ba = (b / 3) * Math.PI * 2 + (t * 0.15);
        const bx = cx + Math.cos(ba) * 36;
        const by = cy + Math.sin(ba) * 36;
        ctx.beginPath();
        ctx.arc(bx, by, 32, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = '#84cc16';
      ctx.beginPath();
      ctx.arc(cx, cy, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 4 Bubbling Toxic Sludge Pools in corners
      const sludgePools = [
        { x: 90, y: 80, rx: 42, ry: 25 },
        { x: w - 90, y: 80, rx: 42, ry: 25 },
        { x: 90, y: h - 80, rx: 42, ry: 25 },
        { x: w - 90, y: h - 80, rx: 42, ry: 25 }
      ];

      sludgePools.forEach((pool, i) => {
        ctx.fillStyle = 'rgba(132, 204, 22, 0.35)';
        ctx.beginPath();
        ctx.ellipse(pool.x, pool.y, pool.rx, pool.ry, 0, 0, Math.PI * 2);
        ctx.fill();

        // Popping toxic bubble
        const bubble = Math.abs(Math.sin(t * 4 + i * 2)) * 8;
        ctx.fillStyle = '#bef264';
        ctx.beginPath();
        ctx.arc(pool.x + Math.sin(t * 2 + i) * 12, pool.y + Math.cos(t * 2 + i) * 6, bubble, 0, Math.PI * 2);
        ctx.fill();
      });

      // Drainage Pipes on Walls dripping neon acid
      ctx.fillStyle = '#3f3f46';
      ctx.fillRect(10, h * 0.28, 26, 20);
      ctx.fillRect(10, h * 0.72, 26, 20);
      ctx.fillRect(w - 36, h * 0.28, 26, 20);
      ctx.fillRect(w - 36, h * 0.72, 26, 20);

      // Acid drops dripping
      const dropY = (t * 60) % 35;
      ctx.fillStyle = '#a3e635';
      ctx.beginPath();
      ctx.arc(36, h * 0.28 + 10 + dropY, 3.5, 0, Math.PI * 2);
      ctx.arc(w - 36, h * 0.72 + 10 + dropY, 3.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
  }

  ctx.restore();
}
