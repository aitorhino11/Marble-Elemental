import { drawMarbleSkin } from './marbleSkinRenderer';

interface AnimationOptions {
  ctx: CanvasRenderingContext2D;
  cx: number;
  baseCy: number;
  radius: number;
  color: string;
  element: string;
  powerId: string;
  elapsed: number;
}

/**
 * Unique Victory Celebration Animation for each of the 20 Marbles
 */
export function drawSpecificVictoryAnimation(opts: AnimationOptions) {
  const { ctx, cx, baseCy, radius, color, element, powerId, elapsed } = opts;

  switch (powerId) {
    case 'elem-fire': {
      // 1. Fuego: Pilar de llamas ascendente con chispas volcánicas y salto ardiente
      const jump = Math.abs(Math.sin(elapsed * 5)) * 32;
      const cy = baseCy - jump;

      // Flame pillar
      const numFlames = 8;
      for (let f = 0; f < numFlames; f++) {
        const fa = (f / numFlames) * Math.PI * 2 + elapsed * 3;
        const fr = radius * 1.3 + Math.sin(elapsed * 8 + f) * 14;
        const fx = cx + Math.cos(fa) * fr;
        const fy = baseCy + 10 - ((elapsed * 90 + f * 25) % 90);
        ctx.fillStyle = f % 2 === 0 ? 'rgba(239, 68, 68, 0.7)' : 'rgba(245, 158, 11, 0.8)';
        ctx.beginPath();
        ctx.arc(fx, fy, 4 + Math.sin(elapsed * 10 + f) * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      drawMarbleSkin(ctx, { x: cx, y: cy, radius, color, element, powerId, expression: 'happy', crown: true, time: elapsed });
      break;
    }

    case 'elem-ice': {
      // 2. Hielo: Copo de nieve geométrico glacial giratorio y aurora boreal
      const cy = baseCy - 12 + Math.sin(elapsed * 3) * 6;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(elapsed * 0.8);
      // Draw 6 crystal branches
      for (let i = 0; i < 6; i++) {
        ctx.save();
        ctx.rotate((i * Math.PI) / 3);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, radius + 32);
        ctx.moveTo(0, radius + 14);
        ctx.lineTo(12, radius + 22);
        ctx.moveTo(0, radius + 14);
        ctx.lineTo(-12, radius + 22);
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();

      drawMarbleSkin(ctx, { x: cx, y: cy, radius, color, element, powerId, expression: 'happy', crown: true, time: elapsed });
      break;
    }

    case 'elem-lightning': {
      // 3. Rayo: Rayos violeta cayendo del cielo con saltitos eléctricos hiper-rápidos
      const jitter = (Math.random() - 0.5) * 4;
      const jump = Math.abs(Math.sin(elapsed * 7)) * 22;
      const cy = baseCy - jump;

      // Electric lightning bolt from above
      if (Math.random() < 0.6) {
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx + (Math.random() - 0.5) * 60, 0);
        ctx.lineTo(cx + (Math.random() - 0.5) * 30, cy * 0.5);
        ctx.lineTo(cx + jitter, cy - radius);
        ctx.stroke();
      }

      drawMarbleSkin(ctx, { x: cx + jitter, y: cy, radius, color, element, powerId, expression: 'happy', crown: true, time: elapsed });
      break;
    }

    case 'elem-earth': {
      // 4. Tierra: Pilares tectónicos rocosos y peñascos en órbita
      const cy = baseCy - 18;

      // Stone podium
      ctx.fillStyle = '#78350f';
      ctx.fillRect(cx - radius * 1.2, baseCy + radius * 0.6, radius * 2.4, 25);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(cx - radius * 1.3, baseCy + radius * 0.5, radius * 2.6, 6);

      // Orbiting mini rocks
      for (let r = 0; r < 4; r++) {
        const ra = (r / 4) * Math.PI * 2 + elapsed * 2;
        const rx = cx + Math.cos(ra) * (radius * 1.5);
        const ry = cy + Math.sin(ra) * (radius * 0.6);
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.arc(rx, ry, 7, 0, Math.PI * 2);
        ctx.fill();
      }

      drawMarbleSkin(ctx, { x: cx, y: cy, radius, color, element, powerId, expression: 'happy', crown: true, time: elapsed });
      break;
    }

    case 'elem-wind': {
      // 5. Viento: Ciclón espiral que eleva la canica en vuelo aéreo
      const cy = baseCy - 30 + Math.sin(elapsed * 4) * 16;
      const hoverX = cx + Math.cos(elapsed * 3) * 18;

      // Tornado spiral lines
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
      ctx.lineWidth = 2;
      for (let w = 0; w < 5; w++) {
        const wy = baseCy + 20 - w * 14;
        const ww = (5 - w) * 12;
        ctx.beginPath();
        ctx.ellipse(cx, wy, ww, 6, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      drawMarbleSkin(ctx, { x: hoverX, y: cy, radius, color, element, powerId, expression: 'happy', crown: true, time: elapsed });
      break;
    }

    case 'elem-poison': {
      // 6. Veneno: Géiser de ácido verde burbujeante con calaveras tóxicas
      const cy = baseCy - Math.abs(Math.sin(elapsed * 4)) * 20;

      // Sludge fountain
      for (let b = 0; b < 10; b++) {
        const bx = cx + (Math.sin(elapsed * 3 + b) * radius * 1.2);
        const by = baseCy + 10 - ((elapsed * 100 + b * 20) % 95);
        ctx.fillStyle = b % 2 === 0 ? 'rgba(132, 204, 22, 0.8)' : 'rgba(163, 230, 53, 0.7)';
        ctx.beginPath();
        ctx.arc(bx, by, 3 + (b % 4), 0, Math.PI * 2);
        ctx.fill();
      }

      drawMarbleSkin(ctx, { x: cx, y: cy, radius, color, element, powerId, expression: 'happy', crown: true, time: elapsed });
      break;
    }

    case 'cosm-blackhole': {
      // 7. Agujero Negro: Disco de acreción gravitatorio cósmico violeta
      const cy = baseCy - 10;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-elapsed * 1.5);
      const grad = ctx.createRadialGradient(0, 0, radius * 0.8, 0, 0, radius * 2.2);
      grad.addColorStop(0, 'rgba(76, 29, 149, 0.8)');
      grad.addColorStop(0.6, 'rgba(139, 92, 246, 0.4)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 2.2, radius * 0.9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      drawMarbleSkin(ctx, { x: cx, y: cy, radius, color, element, powerId, expression: 'happy', crown: true, time: elapsed });
      break;
    }

    case 'mag-warp': {
      // 8. Salto Cuántico: 4 réplicas holográficas parpadeantes y destellos estelares
      const cy = baseCy - 14;

      // Holographic clone echoes
      for (let h = 0; h < 3; h++) {
        const ha = (h / 3) * Math.PI * 2 + elapsed * 2.5;
        const hx = cx + Math.cos(ha) * (radius * 1.25);
        const hy = cy + Math.sin(ha) * (radius * 0.7);
        ctx.save();
        ctx.globalAlpha = 0.35;
        drawMarbleSkin(ctx, { x: hx, y: hy, radius: radius * 0.7, color: '#ec4899', element, powerId, expression: 'battle', crown: false, time: elapsed });
        ctx.restore();
      }

      drawMarbleSkin(ctx, { x: cx, y: cy, radius, color, element, powerId, expression: 'happy', crown: true, time: elapsed });
      break;
    }

    case 'cosm-gravityflip': {
      // 9. Inversión Gravitatoria: Flotando boca abajo desafiando la gravedad con flechas hacia arriba
      const cy = baseCy - 35 + Math.sin(elapsed * 2.5) * 12;

      // Cyan up-arrows
      ctx.fillStyle = 'rgba(14, 165, 233, 0.7)';
      for (let a = 0; a < 4; a++) {
        const ax = cx + (a - 1.5) * 45;
        const ay = baseCy + 20 - ((elapsed * 70 + a * 30) % 110);
        ctx.beginPath();
        ctx.moveTo(ax, ay - 8);
        ctx.lineTo(ax - 6, ay + 4);
        ctx.lineTo(ax + 6, ay + 4);
        ctx.fill();
      }

      drawMarbleSkin(ctx, { x: cx, y: cy, radius, color, element, powerId, expression: 'happy', crown: true, time: elapsed });
      break;
    }

    case 'mag-mirrorshield': {
      // 10. Escudo Prismático: Escudo hexagonal giratorio de cristal facetado
      const cy = baseCy - 10;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(elapsed * 1.2);
      ctx.strokeStyle = 'rgba(244, 114, 182, 0.8)';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      for (let h = 0; h < 6; h++) {
        const ha = (h / 6) * Math.PI * 2;
        const hr = radius * 1.45;
        const hx = Math.cos(ha) * hr;
        const hy = Math.sin(ha) * hr;
        if (h === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      drawMarbleSkin(ctx, { x: cx, y: cy, radius, color, element, powerId, expression: 'happy', crown: true, time: elapsed });
      break;
    }

    case 'tech-emp': {
      // 11. Pulso EMP: Red holográfica digital en el suelo y matriz binaria 10101
      const cy = baseCy - 15;

      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
      for (let bin = 0; bin < 5; bin++) {
        const bx = cx - 80 + bin * 40;
        const by = baseCy - 50 + ((elapsed * 60 + bin * 25) % 100);
        ctx.fillText(bin % 2 === 0 ? '101' : '010', bx, by);
      }

      drawMarbleSkin(ctx, { x: cx, y: cy, radius, color, element, powerId, expression: 'happy', crown: true, time: elapsed });
      break;
    }

    case 'tech-nuke': {
      // 12. Bomba Nuclear: Pequeño hongo atómico de fuegos artificiales celebratorio
      const jump = Math.abs(Math.sin(elapsed * 4)) * 26;
      const cy = baseCy - jump;

      // Celebratory fallout sparks
      for (let n = 0; n < 8; n++) {
        const na = (n / 8) * Math.PI * 2 + elapsed * 2;
        const nr = radius * 1.4 + Math.sin(elapsed * 5 + n) * 15;
        ctx.fillStyle = n % 2 === 0 ? '#f97316' : '#facc15';
        ctx.beginPath();
        ctx.arc(cx + Math.cos(na) * nr, cy + Math.sin(na) * (nr * 0.7), 4, 0, Math.PI * 2);
        ctx.fill();
      }

      drawMarbleSkin(ctx, { x: cx, y: cy, radius, color, element, powerId, expression: 'happy', crown: true, time: elapsed });
      break;
    }

    case 'tech-laser': {
      // 13. Láser Orbital: Rayos láser carmesí cruzados en show de luces
      const cy = baseCy - 15;

      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 2.5;
      const lAngle = Math.sin(elapsed * 3) * 0.4;
      ctx.beginPath();
      ctx.moveTo(cx - 100, baseCy + 20);
      ctx.lineTo(cx + Math.cos(lAngle) * 90, 0);
      ctx.moveTo(cx + 100, baseCy + 20);
      ctx.lineTo(cx - Math.cos(lAngle) * 90, 0);
      ctx.stroke();

      drawMarbleSkin(ctx, { x: cx, y: cy, radius, color, element, powerId, expression: 'happy', crown: true, time: elapsed });
      break;
    }

    case 'tech-landmines': {
      // 14. Minas: Castillo de fuegos artificiales con chispas de colores
      const cy = baseCy - Math.abs(Math.sin(elapsed * 5)) * 20;

      for (let m = 0; m < 6; m++) {
        const ma = (m / 6) * Math.PI * 2 + elapsed * 3;
        const mr = radius * 1.35;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(cx + Math.cos(ma) * mr, baseCy - 10 + Math.sin(ma) * 20, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      drawMarbleSkin(ctx, { x: cx, y: cy, radius, color, element, powerId, expression: 'happy', crown: true, time: elapsed });
      break;
    }

    case 'chaos-growth': {
      // 15. Titán Chonk: Agrandamiento colosal con aura de fuerza titánica
      const swell = 1.0 + Math.abs(Math.sin(elapsed * 3)) * 0.35;
      const dynRadius = radius * swell;
      const cy = baseCy - (dynRadius - radius);

      // Tremor waves on floor
      ctx.strokeStyle = '#14b8a6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(cx, baseCy + radius * 0.8, dynRadius * 1.3, 10, 0, 0, Math.PI * 2);
      ctx.stroke();

      drawMarbleSkin(ctx, { x: cx, y: cy, radius: dynRadius, color, element, powerId, expression: 'happy', crown: true, time: elapsed });
      break;
    }

    case 'meme-dupe': {
      // 16. Caos de Clones: Clones en fila celebrando y saltando en coreografía
      const cy = baseCy - 10;

      // 2 Mini clones cheering beside
      [-radius * 1.5, radius * 1.5].forEach((offset, idx) => {
        const cloneJump = Math.abs(Math.sin(elapsed * 5 + idx * Math.PI)) * 18;
        drawMarbleSkin(ctx, {
          x: cx + offset,
          y: baseCy - cloneJump,
          radius: radius * 0.55,
          color,
          element,
          powerId,
          expression: 'happy',
          crown: false,
          time: elapsed
        });
      });

      drawMarbleSkin(ctx, { x: cx, y: cy, radius, color, element, powerId, expression: 'happy', crown: true, time: elapsed });
      break;
    }

    case 'chaos-magnet': {
      // 17. Imán Voraz: Lluvia de monedas doradas y diamantes atraídos en vórtice
      const cy = baseCy - 10;

      for (let c = 0; c < 8; c++) {
        const ca = (c / 8) * Math.PI * 2 + elapsed * 2.5;
        const cr = radius * 1.35;
        const cxCoin = cx + Math.cos(ca) * cr;
        const cyCoin = cy + Math.sin(ca) * (cr * 0.6);
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.arc(cxCoin, cyCoin, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fef08a';
        ctx.stroke();
      }

      drawMarbleSkin(ctx, { x: cx, y: cy, radius, color, element, powerId, expression: 'happy', crown: true, time: elapsed });
      break;
    }

    case 'meme-speed': {
      // 18. Turbo Hipersónico: Estela supersónica de colores en símbolo de infinito
      const infX = cx + Math.sin(elapsed * 6) * 35;
      const infY = baseCy - 15 + Math.sin(elapsed * 12) * 12;

      // Rainbow supersonic trail
      ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'].forEach((tColor, ti) => {
        ctx.fillStyle = tColor;
        ctx.beginPath();
        ctx.arc(infX - (ti + 1) * 6, infY, radius * 0.45 - ti * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      drawMarbleSkin(ctx, { x: infX, y: infY, radius, color, element, powerId, expression: 'happy', crown: true, time: elapsed });
      break;
    }

    case 'meme-anvil': {
      // 19. Yunque de 100T: Podio de yunque de oro macizo con fuegos artificiales
      const cy = baseCy - 28;

      // Anvil base
      ctx.fillStyle = '#475569';
      ctx.fillRect(cx - 35, baseCy + radius * 0.4, 70, 22);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(cx - 45, baseCy + radius * 0.35, 90, 8);

      drawMarbleSkin(ctx, { x: cx, y: cy, radius, color, element, powerId, expression: 'happy', crown: true, time: elapsed });
      break;
    }

    case 'chaos-tornado': {
      // 20. Pinball Twister: Luces de jackpot de recreativa pinball con "+999999"
      const cy = baseCy - Math.abs(Math.sin(elapsed * 6)) * 24;

      ctx.font = 'black 14px monospace';
      ctx.fillStyle = '#f43f5e';
      ctx.textAlign = 'center';
      ctx.fillText('🎰 JACKPOT +999999 🎰', cx, baseCy - 55);

      drawMarbleSkin(ctx, { x: cx, y: cy, radius, color, element, powerId, expression: 'happy', crown: true, time: elapsed });
      break;
    }

    case 'legend-fisherman': {
      // 21. Pescador Legendario: Pesca triunfal con pez dorado gigante saltando del agua
      const cy = baseCy - Math.abs(Math.sin(elapsed * 4)) * 22;

      // Golden Trophy Fish jumping on line
      const fishA = elapsed * 3;
      const fishX = cx + Math.cos(fishA) * 65;
      const fishY = baseCy - 20 - Math.abs(Math.sin(fishA)) * 40;

      // Fishing line to fish
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(fishX, fishY);
      ctx.stroke();

      // Golden Big Fish
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.ellipse(fishX, fishY, 14, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(fishX + 12, fishY);
      ctx.lineTo(fishX + 22, fishY - 7);
      ctx.lineTo(fishX + 22, fishY + 7);
      ctx.closePath();
      ctx.fill();

      // Water splash particles
      for (let s = 0; s < 6; s++) {
        const sa = (s / 6) * Math.PI * 2 + elapsed * 5;
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(cx + Math.cos(sa) * 35, baseCy + radius * 0.4 + Math.sin(sa) * 8, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      drawMarbleSkin(ctx, { x: cx, y: cy, radius, color, element, powerId, expression: 'happy', crown: true, time: elapsed });
      break;
    }

    default: {
      const bounce = Math.abs(Math.sin(elapsed * 4.5)) * 26;
      const cy = baseCy - bounce;
      drawMarbleSkin(ctx, { x: cx, y: cy, radius, color, element, powerId, expression: 'happy', crown: true, time: elapsed });
    }
  }
}

/**
 * Unique Defeat Animation for each of the 20 Marbles
 */
export function drawSpecificDefeatAnimation(opts: AnimationOptions) {
  const { ctx, cx, baseCy, radius, color, element, powerId, elapsed } = opts;
  const wobble = Math.sin(elapsed * 10) * 1.5;
  const tearProg = (elapsed * 1.5) % 1.0;

  switch (powerId) {
    case 'elem-fire': {
      // 1. Fuego: Carbón apagado, volutas de humo gris y chispa parpadeante agonizante
      const cy = baseCy;
      // Smoke wisps
      for (let s = 0; s < 4; s++) {
        const sy = baseCy - radius - ((elapsed * 40 + s * 25) % 60);
        const sx = cx + Math.sin(elapsed * 3 + s) * 12;
        ctx.fillStyle = `rgba(148, 163, 184, ${0.4 - (baseCy - sy) / 120})`;
        ctx.beginPath();
        ctx.arc(sx, sy, 5 + s * 2, 0, Math.PI * 2);
        ctx.fill();
      }
      drawMarbleSkin(ctx, { x: cx + wobble, y: cy, radius, color: '#475569', element, powerId, expression: 'crying', crown: false, tearProgress: tearProg, time: elapsed });
      break;
    }

    case 'elem-ice': {
      // 2. Hielo: Bloque de hielo resquebrajado goteando agua fría
      const cy = baseCy;
      // Cracked cube outline
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.7)';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(cx - radius * 1.1, cy - radius * 1.1, radius * 2.2, radius * 2.2);
      // Fracture crack
      ctx.beginPath();
      ctx.moveTo(cx - radius * 0.8, cy - radius * 0.9);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx + radius * 0.8, cy + radius * 0.7);
      ctx.stroke();

      drawMarbleSkin(ctx, { x: cx + wobble, y: cy, radius, color, element, powerId, expression: 'crying', crown: false, tearProgress: tearProg, time: elapsed });
      break;
    }

    case 'elem-lightning': {
      // 3. Rayo: Cortocircuito con icono de batería baja y chispas débiles
      const cy = baseCy;
      if (Math.sin(elapsed * 15) > 0) {
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('⚡ LOW POWER ⚡', cx, cy - radius - 15);
      }
      drawMarbleSkin(ctx, { x: cx + wobble, y: cy, radius, color, element, powerId, expression: 'stunned', crown: false, tearProgress: tearProg, time: elapsed });
      break;
    }

    case 'elem-earth': {
      // 4. Tierra: Hundida en una grieta agrietada con piedritas cayendo
      const cy = baseCy + 10;
      // Floor crack
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx - 50, baseCy + radius * 0.7);
      ctx.lineTo(cx, baseCy + radius * 0.5);
      ctx.lineTo(cx + 50, baseCy + radius * 0.7);
      ctx.stroke();

      drawMarbleSkin(ctx, { x: cx + wobble, y: cy, radius, color, element, powerId, expression: 'crying', crown: false, tearProgress: tearProg, time: elapsed });
      break;
    }

    case 'elem-wind': {
      // 5. Viento: Mareada girando como peonza desinflada
      const cy = baseCy;
      drawMarbleSkin(ctx, { x: cx + wobble, y: cy, radius, color, element, powerId, expression: 'stunned', crown: false, tearProgress: tearProg, time: elapsed });
      break;
    }

    case 'elem-poison': {
      // 6. Veneno: Disolviéndose en un charco verde inofensivo con suspiro
      const cy = baseCy + 6;
      ctx.fillStyle = 'rgba(132, 204, 22, 0.45)';
      ctx.beginPath();
      ctx.ellipse(cx, baseCy + radius * 0.8, radius * 1.3, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      drawMarbleSkin(ctx, { x: cx + wobble, y: cy, radius, color, element, powerId, expression: 'crying', crown: false, tearProgress: tearProg, time: elapsed });
      break;
    }

    case 'cosm-blackhole': {
      // 7. Agujero Negro: Colapsando hacia su propio centro, encogiéndose débilmente
      const cy = baseCy;
      const shrivel = Math.max(0.6, 0.9 - Math.sin(elapsed * 2) * 0.15);
      drawMarbleSkin(ctx, { x: cx + wobble, y: cy, radius: radius * shrivel, color, element, powerId, expression: 'crying', crown: false, tearProgress: tearProg, time: elapsed });
      break;
    }

    case 'mag-warp': {
      // 8. Salto Cuántico: Glitch cromático desfasado
      const cy = baseCy;
      ctx.save();
      ctx.globalAlpha = 0.5;
      drawMarbleSkin(ctx, { x: cx + 4, y: cy, radius, color: '#06b6d4', element, powerId, expression: 'stunned', crown: false, time: elapsed });
      ctx.restore();
      drawMarbleSkin(ctx, { x: cx - 4, y: cy, radius, color, element, powerId, expression: 'crying', crown: false, tearProgress: tearProg, time: elapsed });
      break;
    }

    case 'cosm-gravityflip': {
      // 9. Inversión Gravitatoria: Chocando torpemente contra el techo y suelo
      const bounce = Math.sin(elapsed * 6) * 14;
      drawMarbleSkin(ctx, { x: cx, y: baseCy + bounce, radius, color, element, powerId, expression: 'stunned', crown: false, tearProgress: tearProg, time: elapsed });
      break;
    }

    case 'mag-mirrorshield': {
      // 10. Escudo Prismático: Cristal roto en fragmentos dispersos
      const cy = baseCy;
      ctx.strokeStyle = 'rgba(244, 114, 182, 0.7)';
      for (let s = 0; s < 4; s++) {
        const sx = cx + (s - 1.5) * 35;
        const sy = baseCy + radius * 0.7;
        ctx.strokeRect(sx, sy, 8, 8);
      }
      drawMarbleSkin(ctx, { x: cx + wobble, y: cy, radius, color, element, powerId, expression: 'crying', crown: false, tearProgress: tearProg, time: elapsed });
      break;
    }

    case 'tech-emp': {
      // 11. Pulso EMP: "SYSTEM ERROR 404" con reinicio parpadeante
      const cy = baseCy;
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('CRITICAL ERROR: EMP REBOOT', cx, cy - radius - 12);
      drawMarbleSkin(ctx, { x: cx + wobble, y: cy, radius, color, element, powerId, expression: 'stunned', crown: false, tearProgress: tearProg, time: elapsed });
      break;
    }

    case 'tech-nuke': {
      // 12. Bomba Nuclear: Cohete fallido humeante sin detonar
      const cy = baseCy;
      ctx.strokeStyle = '#f97316';
      ctx.strokeRect(cx - 20, baseCy + radius * 0.6, 40, 6);
      drawMarbleSkin(ctx, { x: cx + wobble, y: cy, radius, color, element, powerId, expression: 'crying', crown: false, tearProgress: tearProg, time: elapsed });
      break;
    }

    case 'tech-laser': {
      // 13. Láser: Puntero láser rojo sin batería parpadeando débilmente
      const cy = baseCy;
      if (Math.sin(elapsed * 12) > 0) {
        ctx.fillStyle = '#e11d48';
        ctx.beginPath();
        ctx.arc(cx, cy + radius * 0.8, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      drawMarbleSkin(ctx, { x: cx + wobble, y: cy, radius, color, element, powerId, expression: 'crying', crown: false, tearProgress: tearProg, time: elapsed });
      break;
    }

    case 'tech-landmines': {
      // 14. Minas: Canica cubierta de hollín negro por pisar su propia mina
      const cy = baseCy;
      drawMarbleSkin(ctx, { x: cx + wobble, y: cy, radius, color: '#334155', element, powerId, expression: 'crying', crown: false, tearProgress: tearProg, time: elapsed });
      break;
    }

    case 'chaos-growth': {
      // 15. Titán Chonk: Desinflada como un globo pinchado
      const cy = baseCy + 10;
      ctx.save();
      ctx.scale(1.3, 0.7);
      drawMarbleSkin(ctx, { x: (cx + wobble) / 1.3, y: cy / 0.7, radius, color, element, powerId, expression: 'crying', crown: false, tearProgress: tearProg, time: elapsed });
      ctx.restore();
      break;
    }

    case 'meme-dupe': {
      // 16. Clones: Clones esfumados en humo, canica sola llorando
      const cy = baseCy;
      drawMarbleSkin(ctx, { x: cx + wobble, y: cy, radius, color, element, powerId, expression: 'crying', crown: false, tearProgress: tearProg, time: elapsed });
      break;
    }

    case 'chaos-magnet': {
      // 17. Imán Voraz: Atrajo una bota vieja y una lata que le cayeron encima
      const cy = baseCy;
      ctx.fillStyle = '#64748b';
      ctx.fillRect(cx - 15, cy - radius - 15, 30, 14);
      drawMarbleSkin(ctx, { x: cx + wobble, y: cy, radius, color, element, powerId, expression: 'crying', crown: false, tearProgress: tearProg, time: elapsed });
      break;
    }

    case 'meme-speed': {
      // 18. Turbo: Derrape con rueda pinchada y estrellas dando vueltas
      const cy = baseCy;
      for (let s = 0; s < 3; s++) {
        const sa = (s / 3) * Math.PI * 2 + elapsed * 4;
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(cx + Math.cos(sa) * 25, cy - radius - 5 + Math.sin(sa) * 8, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      drawMarbleSkin(ctx, { x: cx + wobble, y: cy, radius, color, element, powerId, expression: 'stunned', crown: false, tearProgress: tearProg, time: elapsed });
      break;
    }

    case 'meme-anvil': {
      // 19. Yunque de 100T: Un yunque le cayó encima aplastándola en acordeón
      const cy = baseCy + 8;
      ctx.fillStyle = '#334155';
      ctx.fillRect(cx - 30, cy - radius - 18, 60, 20);
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('100 TONS', cx, cy - radius - 5);
      drawMarbleSkin(ctx, { x: cx, y: cy, radius, color, element, powerId, expression: 'crying', crown: false, tearProgress: tearProg, time: elapsed });
      break;
    }

    case 'chaos-tornado': {
      // 20. Pinball: Rótulo de "TILT" rojo parpadeante
      const cy = baseCy;
      if (Math.sin(elapsed * 10) > 0) {
        ctx.fillStyle = '#ef4444';
        ctx.font = 'black 14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('⚠️ TILT! GAME OVER ⚠️', cx, cy - radius - 14);
      }
      drawMarbleSkin(ctx, { x: cx + wobble, y: cy, radius, color, element, powerId, expression: 'crying', crown: false, tearProgress: tearProg, time: elapsed });
      break;
    }

    case 'legend-fisherman': {
      // 21. Pescador: Sedal roto, caña doblada y un pez travieso dándole un coletazo
      const cy = baseCy;
      // Broken line
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx + 10, cy - radius * 0.8);
      ctx.lineTo(cx + 25, cy - radius * 1.2);
      ctx.stroke();

      // Taunting little fish splashing
      const fishHop = Math.abs(Math.sin(elapsed * 6)) * 18;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.ellipse(cx + radius + 15, baseCy - fishHop, 9, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      drawMarbleSkin(ctx, { x: cx + wobble, y: cy, radius, color, element, powerId, expression: 'crying', crown: false, tearProgress: tearProg, time: elapsed });
      break;
    }

    default: {
      drawMarbleSkin(ctx, { x: cx + wobble, y: baseCy, radius, color, element, powerId, expression: 'crying', crown: false, tearProgress: tearProg, time: elapsed });
    }
  }
}
