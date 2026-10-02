/**
 * Marble Skin & Visual Identity Renderer
 * Gives each marble a truly distinct visual design, elemental textures, expressive faces,
 * and spectacular victory/defeat animations (Golden Crown for Win, Weeping Animated Tears for Loss).
 */

export interface MarbleSkinOptions {
  x: number;
  y: number;
  radius: number;
  color: string;
  element?: string;
  powerId?: string;
  angle?: number; // Movement trajectory angle in radians
  expression?: 'battle' | 'happy' | 'crying' | 'frozen' | 'stunned';
  crown?: boolean; // Golden Champion Crown on head
  tearProgress?: number; // 0 to 1 loop for flowing tear drops
  shieldActive?: boolean;
  isClone?: boolean;
  isShrouded?: boolean; // Mystery rival in competitive match: ball identity is kept completely secret!
  time?: number;
}

export function drawMarbleSkin(
  ctx: CanvasRenderingContext2D,
  options: MarbleSkinOptions
) {
  const {
    x,
    y,
    radius,
    color,
    element = 'Fire',
    powerId = '',
    angle = 0,
    expression = 'battle',
    crown = false,
    tearProgress = 0,
    shieldActive = false,
    isClone = false,
    isShrouded = false,
    time = 0
  } = options;

  ctx.save();
  ctx.translate(x, y);

  // 1. Drop Shadow under marble
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(0, radius * 0.9, radius * 0.85, radius * 0.35, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Clone / Phantom Aura
  if (isClone) {
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 3;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(0, 0, radius + 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // 3. Shield Aura if active
  if (shieldActive) {
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#0284c7';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    // Hexagonal shield barrier
    for (let h = 0; h < 6; h++) {
      const ha = (h / 6) * Math.PI * 2 + time * 1.5;
      const hx = Math.cos(ha) * (radius + 8);
      const hy = Math.sin(ha) * (radius + 8);
      if (h === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // IF SHROUDED (MYSTERY RIVAL IN COMPETITIVE):
  // Renders a shadowy dark void with swirling purple mist and glowing '?'
  if (isShrouded) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.clip();

    // Dark void radial sphere
    const voidGrad = ctx.createRadialGradient(
      -radius * 0.35,
      -radius * 0.35,
      radius * 0.1,
      0,
      0,
      radius
    );
    voidGrad.addColorStop(0, '#7e22ce');
    voidGrad.addColorStop(0.3, '#3b0764');
    voidGrad.addColorStop(0.7, '#1e1b4b');
    voidGrad.addColorStop(1, '#020617');

    ctx.fillStyle = voidGrad;
    ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

    // Swirling shadow energy mist
    ctx.strokeStyle = 'rgba(192, 132, 252, 0.4)';
    ctx.lineWidth = 2.5;
    for (let s = 0; s < 3; s++) {
      const sAngle = (s / 3) * Math.PI * 2 + time * 2;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.65, sAngle, sAngle + Math.PI * 0.6);
      ctx.stroke();
    }

    ctx.restore();

    // Mystery glowing violet rim
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#a855f7';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Glowing question mark glyph in center
    const pulse = 1 + Math.sin(time * 5) * 0.1;
    ctx.save();
    ctx.scale(pulse, pulse);
    ctx.fillStyle = '#f3e8ff';
    ctx.shadowColor = '#d8b4fe';
    ctx.shadowBlur = 10;
    ctx.font = `900 ${Math.round(radius * 0.95)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', 0, 1);
    ctx.restore();

    ctx.restore();
    return;
  }

  // 4. Base Spherical Clip & Gradient Body
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.clip();

  // Radial Sphere Shading
  const sphereGrad = ctx.createRadialGradient(
    -radius * 0.35,
    -radius * 0.35,
    radius * 0.1,
    0,
    0,
    radius
  );
  sphereGrad.addColorStop(0, '#ffffff');
  sphereGrad.addColorStop(0.25, color);
  sphereGrad.addColorStop(0.85, darkenColor(color, 0.5));
  sphereGrad.addColorStop(1, '#050814');

  ctx.fillStyle = sphereGrad;
  ctx.fillRect(-radius, -radius, radius * 2, radius * 2);

  // 5. DISTINCT ELEMENTAL SKINS / TEXTURES
  drawElementalTexture(ctx, radius, element, powerId, color, time);

  ctx.restore(); // End clip

  // 6. Marble Outer Glowing Rim
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();

  // 7. Expressive Face & Eyes
  drawExpressiveFace(ctx, radius, expression, angle, time);

  // 8. Crying Animated Tears (for Defeat Screen)
  if (expression === 'crying' || tearProgress > 0) {
    drawAnimatedTears(ctx, radius, tearProgress, time);
  }

  // 9. Frozen Ice Block Encasement
  if (expression === 'frozen') {
    drawFrozenIceCube(ctx, radius, time);
  }

  // 10. Golden Champion Crown (for Victory Screen)
  if (crown) {
    drawGoldenCrown(ctx, radius, time);
  }

  // 11. Custom Unique Gear, Weapons, Hats, Horns, Goggles & Crests for ALL 21 Marbles!
  drawUniqueMarbleGear(ctx, radius, powerId, color, angle, time);

  ctx.restore();
}

/**
 * Draws unique graphical skin textures for each element
 */
function drawElementalTexture(
  ctx: CanvasRenderingContext2D,
  r: number,
  element: string,
  powerId: string,
  baseColor: string,
  time: number
) {
  ctx.save();

  switch (element) {
    case 'Fire': {
      // Magma tectonic fissures & bubbling embers
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 10;

      // Fiery cracks
      ctx.beginPath();
      ctx.moveTo(-r * 0.6, -r * 0.2);
      ctx.lineTo(-r * 0.1, -r * 0.4);
      ctx.lineTo(r * 0.3, -r * 0.1);
      ctx.lineTo(r * 0.6, -r * 0.3);

      ctx.moveTo(-r * 0.3, r * 0.1);
      ctx.lineTo(0, r * 0.4);
      ctx.lineTo(r * 0.5, r * 0.3);
      ctx.stroke();

      // Flame tongues on top
      ctx.fillStyle = 'rgba(251, 146, 60, 0.45)';
      ctx.beginPath();
      ctx.arc(0, -r * 0.6, r * 0.35, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'Ice': {
      // Geometric crystalline snowflake facets
      ctx.strokeStyle = 'rgba(224, 242, 254, 0.7)';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;

      // Hexagonal snowflake branches
      for (let s = 0; s < 6; s++) {
        const sa = (s / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(sa) * r * 0.75, Math.sin(sa) * r * 0.75);
        ctx.stroke();

        // Facet branches
        const bx = Math.cos(sa) * r * 0.45;
        const by = Math.sin(sa) * r * 0.45;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bx + Math.cos(sa + 0.6) * r * 0.25, by + Math.sin(sa + 0.6) * r * 0.25);
        ctx.moveTo(bx, by);
        ctx.lineTo(bx + Math.cos(sa - 0.6) * r * 0.25, by + Math.sin(sa - 0.6) * r * 0.25);
        ctx.stroke();
      }
      break;
    }

    case 'Lightning': {
      // Pulsing neon circuit traces & electric arcs
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 12;

      // Central lightning bolt rune
      ctx.beginPath();
      ctx.moveTo(r * 0.1, -r * 0.7);
      ctx.lineTo(-r * 0.3, -r * 0.1);
      ctx.lineTo(r * 0.1, -r * 0.1);
      ctx.lineTo(-r * 0.1, r * 0.7);
      ctx.lineTo(r * 0.3, r * 0.1);
      ctx.lineTo(-r * 0.1, r * 0.1);
      ctx.closePath();
      ctx.fillStyle = 'rgba(254, 240, 138, 0.7)';
      ctx.fill();
      ctx.stroke();
      break;
    }

    case 'Earth': {
      // Rugged granite stone cracks & amber geode rune
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.moveTo(-r * 0.7, -r * 0.3);
      ctx.lineTo(-r * 0.2, -r * 0.1);
      ctx.lineTo(r * 0.4, -r * 0.5);
      ctx.moveTo(-r * 0.4, r * 0.4);
      ctx.lineTo(r * 0.1, r * 0.2);
      ctx.lineTo(r * 0.6, r * 0.3);
      ctx.stroke();

      // Earth core geode crystal
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.3, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'Wind': {
      // Triple swirling jade vortex blades
      ctx.strokeStyle = 'rgba(167, 243, 208, 0.75)';
      ctx.lineWidth = 2.5;

      const spin = time * 3;
      for (let w = 0; w < 3; w++) {
        const wa = (w / 3) * Math.PI * 2 + spin;
        ctx.beginPath();
        ctx.arc(
          Math.cos(wa) * r * 0.35,
          Math.sin(wa) * r * 0.35,
          r * 0.35,
          wa,
          wa + Math.PI * 0.75
        );
        ctx.stroke();
      }
      break;
    }

    case 'Poison': {
      // Radioactive biohazard spiral & toxic green bubbles
      ctx.strokeStyle = '#a3e635';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#84cc16';
      ctx.shadowBlur = 10;

      // 3 Biohazard lobes
      for (let b = 0; b < 3; b++) {
        const ba = (b / 3) * Math.PI * 2 - Math.PI / 2;
        const bx = Math.cos(ba) * r * 0.38;
        const by = Math.sin(ba) * r * 0.38;
        ctx.beginPath();
        ctx.arc(bx, by, r * 0.26, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.16, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'Cosmic': {
      // Starfield nebula & glowing orbital Saturn ring
      ctx.fillStyle = '#ffffff';
      for (let star = 0; star < 7; star++) {
        const sx = ((star * 37) % (r * 1.5)) - r * 0.75;
        const sy = ((star * 59) % (r * 1.5)) - r * 0.75;
        ctx.beginPath();
        ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Tilted orbital ring
      ctx.strokeStyle = 'rgba(216, 180, 254, 0.7)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.85, r * 0.3, Math.PI / 6, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case 'Tech': {
      // Cybernetic armored plating & glowing cyan ocular lens
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 2;

      // Horizontal visor slot
      ctx.fillStyle = 'rgba(6, 182, 212, 0.85)';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 10;
      ctx.fillRect(-r * 0.6, -r * 0.12, r * 1.2, r * 0.24);

      // Tech grid lines
      ctx.beginPath();
      ctx.moveTo(-r * 0.7, -r * 0.4);
      ctx.lineTo(r * 0.7, -r * 0.4);
      ctx.moveTo(-r * 0.7, r * 0.4);
      ctx.lineTo(r * 0.7, r * 0.4);
      ctx.stroke();
      break;
    }

    default: {
      if (powerId === 'legend-fisherman') {
        // Oceanic ripples & golden koi scales
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
        ctx.lineWidth = 1.8;
        for (let rip = 0; rip < 3; rip++) {
          const ripY = -r * 0.3 + rip * r * 0.3;
          ctx.beginPath();
          ctx.moveTo(-r * 0.6, ripY);
          ctx.quadraticCurveTo(0, ripY - 6, r * 0.6, ripY);
          ctx.stroke();
        }
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.ellipse(0, r * 0.25, 7, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(6, r * 0.25);
        ctx.lineTo(12, r * 0.25 - 4);
        ctx.lineTo(12, r * 0.25 + 4);
        ctx.closePath();
        ctx.fill();
        break;
      }

      if (powerId === 'chaos-magnet') {
        // Gold coins embedded in sphere body
        ctx.fillStyle = '#facc15';
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 1;
        [-1, 1].forEach(s => {
          ctx.beginPath();
          ctx.arc(s * r * 0.45, r * 0.35, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        });
        break;
      }

      if (powerId === 'meme-anvil') {
        // Riveted iron plates
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-r * 0.6, -r * 0.2);
        ctx.lineTo(r * 0.6, -r * 0.2);
        ctx.moveTo(-r * 0.6, r * 0.2);
        ctx.lineTo(r * 0.6, r * 0.2);
        ctx.stroke();
        ctx.fillStyle = '#cbd5e1';
        [-0.4, 0, 0.4].forEach(xPos => {
          ctx.beginPath();
          ctx.arc(xPos * r, -r * 0.2, 1.8, 0, Math.PI * 2);
          ctx.arc(xPos * r, r * 0.2, 1.8, 0, Math.PI * 2);
          ctx.fill();
        });
        break;
      }

      if (powerId === 'meme-speed') {
        // Racing stripes & sonic lightning chevrons
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-r * 0.15, -r * 0.9, r * 0.3, r * 1.8);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(-r * 0.05, -r * 0.9, r * 0.1, r * 1.8);
        break;
      }

      if (powerId === 'chaos-tornado') {
        // Pinball arcade arrows & whirl
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.5, 0, Math.PI * 1.5);
        ctx.stroke();
        break;
      }

      // Magic / Chaos / Meme: Radiant star crest
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(a) * r * 0.7, Math.sin(a) * r * 0.7);
        ctx.stroke();
      }
      break;
    }
  }

  ctx.restore();
}

/**
 * Draws expressive face on the marble (battle pupils, happy victory eyes, or sad defeat face)
 */
function drawExpressiveFace(
  ctx: CanvasRenderingContext2D,
  r: number,
  expression: string,
  angle: number,
  time: number
) {
  ctx.save();

  // Eye positions relative to center
  const eyeOffsetX = r * 0.32;
  const eyeOffsetY = -r * 0.12;

  if (expression === 'happy') {
    // Joyful curved anime eyes: ^ ^
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = Math.max(2.5, r * 0.1);
    ctx.lineCap = 'round';

    // Left Eye
    ctx.beginPath();
    ctx.arc(-eyeOffsetX, eyeOffsetY, r * 0.18, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();

    // Right Eye
    ctx.beginPath();
    ctx.arc(eyeOffsetX, eyeOffsetY, r * 0.18, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();

    // Blushing rosy cheeks
    ctx.fillStyle = 'rgba(244, 63, 94, 0.55)';
    ctx.beginPath();
    ctx.arc(-eyeOffsetX * 1.1, eyeOffsetY + r * 0.25, r * 0.14, 0, Math.PI * 2);
    ctx.arc(eyeOffsetX * 1.1, eyeOffsetY + r * 0.25, r * 0.14, 0, Math.PI * 2);
    ctx.fill();

    // Big happy open smile
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, r * 0.15, r * 0.22, 0, Math.PI);
    ctx.fill();

  } else if (expression === 'crying') {
    // Defeat sad droopy eyes: downturned arcs
    ctx.strokeStyle = '#93c5fd';
    ctx.lineWidth = Math.max(2.5, r * 0.1);
    ctx.lineCap = 'round';

    // Left sad eye
    ctx.beginPath();
    ctx.arc(-eyeOffsetX, eyeOffsetY + r * 0.08, r * 0.2, Math.PI * 0.1, Math.PI * 0.9);
    ctx.stroke();

    // Right sad eye
    ctx.beginPath();
    ctx.arc(eyeOffsetX, eyeOffsetY + r * 0.08, r * 0.2, Math.PI * 0.1, Math.PI * 0.9);
    ctx.stroke();

    // Sad trembling quivering mouth
    const quivering = Math.sin(time * 18) * (r * 0.04);
    ctx.beginPath();
    ctx.arc(0, r * 0.35 + quivering, r * 0.18, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();

  } else if (expression === 'frozen') {
    // Dizzy / shivering spiral eyes
    ctx.strokeStyle = '#bae6fd';
    ctx.lineWidth = 2;
    // Left eye
    ctx.beginPath();
    ctx.arc(-eyeOffsetX, eyeOffsetY, r * 0.16, 0, Math.PI * 2);
    ctx.stroke();
    // Right eye
    ctx.beginPath();
    ctx.arc(eyeOffsetX, eyeOffsetY, r * 0.16, 0, Math.PI * 2);
    ctx.stroke();

    // Shivering teeth
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-r * 0.2, r * 0.2, r * 0.4, r * 0.08);

  } else if (expression === 'stunned') {
    // Electric X_X eyes
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 2.5;
    // Left X
    ctx.beginPath();
    ctx.moveTo(-eyeOffsetX - 5, eyeOffsetY - 5);
    ctx.lineTo(-eyeOffsetX + 5, eyeOffsetY + 5);
    ctx.moveTo(-eyeOffsetX + 5, eyeOffsetY - 5);
    ctx.lineTo(-eyeOffsetX - 5, eyeOffsetY + 5);
    // Right X
    ctx.moveTo(eyeOffsetX - 5, eyeOffsetY - 5);
    ctx.lineTo(eyeOffsetX + 5, eyeOffsetY + 5);
    ctx.moveTo(eyeOffsetX + 5, eyeOffsetY - 5);
    ctx.lineTo(eyeOffsetX - 5, eyeOffsetY + 5);
    ctx.stroke();

  } else {
    // Battle face: sharp determined pupils gazing toward movement trajectory
    const lookDist = r * 0.12;
    const lookX = Math.cos(angle) * lookDist;
    const lookY = Math.sin(angle) * lookDist;

    // Eye Whites
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(-eyeOffsetX + lookX * 0.3, eyeOffsetY + lookY * 0.3, r * 0.18, r * 0.22, 0, 0, Math.PI * 2);
    ctx.ellipse(eyeOffsetX + lookX * 0.3, eyeOffsetY + lookY * 0.3, r * 0.18, r * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Fierce black pupils
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-eyeOffsetX + lookX, eyeOffsetY + lookY, r * 0.11, 0, Math.PI * 2);
    ctx.arc(eyeOffsetX + lookX, eyeOffsetY + lookY, r * 0.11, 0, Math.PI * 2);
    ctx.fill();

    // Cute glint reflection
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-eyeOffsetX + lookX - 2, eyeOffsetY + lookY - 2, r * 0.045, 0, Math.PI * 2);
    ctx.arc(eyeOffsetX + lookX - 2, eyeOffsetY + lookY - 2, r * 0.045, 0, Math.PI * 2);
    ctx.fill();

    // Determined battle eyebrows
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-eyeOffsetX - r * 0.15, eyeOffsetY - r * 0.18);
    ctx.lineTo(-eyeOffsetX + r * 0.12, eyeOffsetY - r * 0.1);
    ctx.moveTo(eyeOffsetX + r * 0.15, eyeOffsetY - r * 0.18);
    ctx.lineTo(eyeOffsetX - r * 0.12, eyeOffsetY - r * 0.1);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Animated streaming tears for defeat animation
 */
function drawAnimatedTears(
  ctx: CanvasRenderingContext2D,
  r: number,
  progress: number,
  time: number
) {
  ctx.save();
  const eyeOffsetX = r * 0.32;
  const eyeOffsetY = -r * 0.05;

  // Stream of tear droplets falling down from both eyes
  const tearOrigins = [-eyeOffsetX, eyeOffsetX];

  tearOrigins.forEach(tx => {
    // 3 progressive droplets per eye
    for (let d = 0; d < 3; d++) {
      const dropProg = ((progress + d * 0.33) % 1.0);
      const dy = eyeOffsetY + dropProg * (r * 1.4);
      const dropRadius = Math.max(2, r * 0.09 * (1.0 - dropProg * 0.3));

      // Tear teardrop path
      ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 8;

      ctx.beginPath();
      ctx.moveTo(tx, dy - dropRadius * 1.5);
      ctx.quadraticCurveTo(tx + dropRadius, dy, tx, dy + dropRadius);
      ctx.quadraticCurveTo(tx - dropRadius, dy, tx, dy - dropRadius * 1.5);
      ctx.fill();

      // Splashing water ripples when droplet hits bottom
      if (dropProg > 0.85) {
        const rippleAlpha = (1.0 - dropProg) / 0.15;
        const rippleR = r * 0.25 * ((dropProg - 0.85) / 0.15);
        ctx.strokeStyle = `rgba(186, 230, 253, ${rippleAlpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(tx, eyeOffsetY + r * 1.35, rippleR, rippleR * 0.4, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  });

  ctx.restore();
}

/**
 * Encases marble in an authentic glowing ice cube
 */
function drawFrozenIceCube(
  ctx: CanvasRenderingContext2D,
  r: number,
  time: number
) {
  ctx.save();
  const cubeSize = r * 1.25;

  // Translucent ice block body
  ctx.fillStyle = 'rgba(186, 230, 253, 0.45)';
  ctx.strokeStyle = '#bae6fd';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 16;

  // Rounded ice cube
  roundRect(ctx, -cubeSize, -cubeSize, cubeSize * 2, cubeSize * 2, 8);
  ctx.fill();
  ctx.stroke();

  // Ice cracks
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-cubeSize * 0.7, -cubeSize * 0.6);
  ctx.lineTo(-cubeSize * 0.2, -cubeSize * 0.1);
  ctx.lineTo(cubeSize * 0.3, -cubeSize * 0.5);
  ctx.stroke();

  ctx.restore();
}

/**
 * Draws a regal golden champion crown on top of the marble
 */
function drawGoldenCrown(
  ctx: CanvasRenderingContext2D,
  r: number,
  time: number
) {
  ctx.save();

  // Crown floats gently above head with animated bobbing
  const bobbing = Math.sin(time * 5) * 3;
  const crownY = -r * 0.95 + bobbing;
  const crownW = r * 0.9;
  const crownH = r * 0.55;

  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 16;

  // Golden Gradient
  const goldGrad = ctx.createLinearGradient(0, crownY - crownH, 0, crownY);
  goldGrad.addColorStop(0, '#fef08a');
  goldGrad.addColorStop(0.4, '#facc15');
  goldGrad.addColorStop(0.8, '#eab308');
  goldGrad.addColorStop(1, '#b45309');

  // Crown Base & 3 Royal Peaks
  ctx.fillStyle = goldGrad;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;

  ctx.beginPath();
  // Start bottom left
  ctx.moveTo(-crownW / 2, crownY);
  // Left peak
  ctx.lineTo(-crownW / 2, crownY - crownH * 0.8);
  // Left inner valley
  ctx.lineTo(-crownW * 0.22, crownY - crownH * 0.4);
  // Center high peak
  ctx.lineTo(0, crownY - crownH);
  // Right inner valley
  ctx.lineTo(crownW * 0.22, crownY - crownH * 0.4);
  // Right peak
  ctx.lineTo(crownW / 2, crownY - crownH * 0.8);
  // Bottom right
  ctx.lineTo(crownW / 2, crownY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Royal Jewels embedded on crown peaks
  // Center Ruby
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(0, crownY - crownH + 4, 3.5, 0, Math.PI * 2);
  ctx.fill();

  // Left Emerald
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(-crownW / 2 + 3, crownY - crownH * 0.8 + 4, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Right Sapphire
  ctx.fillStyle = '#3b82f6';
  ctx.beginPath();
  ctx.arc(crownW / 2 - 3, crownY - crownH * 0.8 + 4, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Star glint sparkle
  const sparklePhase = (Math.sin(time * 8) + 1) / 2;
  ctx.fillStyle = `rgba(255, 255, 255, ${sparklePhase})`;
  ctx.beginPath();
  ctx.arc(crownW * 0.2, crownY - crownH * 0.6, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function darkenColor(hex: string, factor: number = 0.5): string {
  if (!hex.startsWith('#') || hex.length < 7) return '#0f172a';
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const dr = Math.floor(r * factor);
  const dg = Math.floor(g * factor);
  const db = Math.floor(b * factor);
  return `rgb(${dr}, ${dg}, ${db})`;
}

/**
 * Unique Gear, Hats, Horns, Goggles, Spoilers, Weapons & Accessories for ALL 21 Marbles!
 * Makes every marble instantly recognizable and beautifully distinct in menus and battles.
 */
function drawUniqueMarbleGear(
  ctx: CanvasRenderingContext2D,
  r: number,
  powerId: string,
  baseColor: string,
  angle: number,
  time: number
) {
  ctx.save();

  switch (powerId) {
    case 'elem-fire': {
      // 1. Blazing Flame Mohawk Crest
      ctx.save();
      ctx.translate(0, -r * 0.78);
      const flameCount = 5;
      for (let i = 0; i < flameCount; i++) {
        const offX = ((i - 2) / 2) * (r * 0.45);
        const height = r * (0.65 - Math.abs(i - 2) * 0.12) + Math.sin(time * 8 + i) * 4;
        ctx.fillStyle = i === 2 ? '#facc15' : i % 2 === 0 ? '#ea580c' : '#dc2626';
        ctx.beginPath();
        ctx.moveTo(offX - 4, 0);
        ctx.quadraticCurveTo(offX + Math.sin(time * 6 + i) * 4, -height * 0.6, offX, -height);
        ctx.quadraticCurveTo(offX + 4, -height * 0.5, offX + 4, 0);
        ctx.fill();
      }
      ctx.restore();
      break;
    }

    case 'elem-ice': {
      // 2. Glacial Crystalline Ice Tiara / Spikes
      ctx.save();
      ctx.translate(0, -r * 0.82);
      for (let s = -2; s <= 2; s++) {
        const sx = s * (r * 0.24);
        const sh = r * (0.55 - Math.abs(s) * 0.1);
        ctx.fillStyle = 'rgba(224, 242, 254, 0.9)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(sx - 3.5, 0);
        ctx.lineTo(sx, -sh);
        ctx.lineTo(sx + 3.5, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      // Ice crystal diamond glint
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, -r * 0.4, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      break;
    }

    case 'elem-thunder':
    case 'elem-lightning': {
      // 3. Dual High-Voltage Lightning Antenna Horns
      ctx.save();
      ctx.translate(0, -r * 0.85);
      [-1, 1].forEach(side => {
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#fef08a';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(side * (r * 0.28), 0);
        ctx.lineTo(side * (r * 0.38), -r * 0.25);
        ctx.lineTo(side * (r * 0.26), -r * 0.28);
        ctx.lineTo(side * (r * 0.42), -r * 0.55);
        ctx.stroke();
      });
      // Spark discharge between antennae
      if (Math.sin(time * 12) > 0.4) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-r * 0.42, -r * 0.55);
        ctx.lineTo(0, -r * 0.62);
        ctx.lineTo(r * 0.42, -r * 0.55);
        ctx.stroke();
      }
      ctx.restore();
      break;
    }

    case 'elem-earth': {
      // 4. Heavy Mossy Granite Brow & Floating Runic Pebbles
      ctx.save();
      ctx.translate(0, -r * 0.6);
      ctx.fillStyle = '#57534e';
      ctx.strokeStyle = '#292524';
      ctx.lineWidth = 1.5;
      // Stone brow slab
      ctx.beginPath();
      ctx.roundRect(-r * 0.65, -r * 0.15, r * 1.3, r * 0.3, 4);
      ctx.fill();
      ctx.stroke();
      // Green moss patches
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(-r * 0.4, -r * 0.15, r * 0.25, 3);
      ctx.fillRect(r * 0.15, -r * 0.15, r * 0.25, 3);
      // Orbiting runic pebble
      const pa = time * 2.5;
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(Math.cos(pa) * (r * 1.25), Math.sin(pa) * (r * 0.5), 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      break;
    }

    case 'elem-wind': {
      // 5. Steampunk Aviator Flight Goggles & Wings
      ctx.save();
      ctx.translate(0, -r * 0.35);
      // Goggle leather strap
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-r * 0.9, 0);
      ctx.lineTo(r * 0.9, 0);
      ctx.stroke();
      // Brass dual lenses
      [-1, 1].forEach(side => {
        const lx = side * (r * 0.32);
        ctx.fillStyle = '#67e8f9';
        ctx.strokeStyle = '#ca8a04';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(lx, 0, r * 0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Glass sheen
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(lx, 0, r * 0.14, -Math.PI / 4, Math.PI / 4);
        ctx.stroke();
      });
      // Side wind wing feathers
      [-1, 1].forEach(side => {
        const wx = side * (r * 0.95);
        ctx.fillStyle = '#a7f3d0';
        ctx.beginPath();
        ctx.ellipse(wx, -r * 0.1, r * 0.25, r * 0.09, side * 0.4, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
      break;
    }

    case 'elem-poison': {
      // 6. Toxic Gas Mask Respiration Filters & Biohazard Crest
      ctx.save();
      // Side canister filters
      [-1, 1].forEach(side => {
        ctx.fillStyle = '#334155';
        ctx.strokeStyle = '#a3e635';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(side * (r * 0.82) - 5, r * 0.05, 10, 14, 3);
        ctx.fill();
        ctx.stroke();
      });
      // Glowing green biohazard forehead badge
      ctx.fillStyle = '#84cc16';
      ctx.shadowColor = '#a3e635';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(0, -r * 0.65, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      break;
    }

    case 'elem-water': {
      // 7. Golden Sea-King Trident Crest
      ctx.save();
      ctx.translate(0, -r * 0.88);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 8;
      // Trident base & middle prong
      ctx.beginPath();
      ctx.moveTo(0, r * 0.15);
      ctx.lineTo(0, -r * 0.45);
      // Left and right curved prongs
      ctx.moveTo(-r * 0.28, -r * 0.35);
      ctx.quadraticCurveTo(-r * 0.28, -r * 0.05, 0, -r * 0.05);
      ctx.quadraticCurveTo(r * 0.28, -r * 0.05, r * 0.28, -r * 0.35);
      ctx.stroke();
      ctx.restore();
      break;
    }

    case 'cosmic-gravity': {
      // 8. Tilted Saturnian Planetary Accretion Ring System
      ctx.save();
      ctx.rotate(-Math.PI / 8);
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.8)';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.55, r * 0.45, 0, 0, Math.PI * 2);
      ctx.stroke();
      // Orbiting stardust motes
      for (let s = 0; s < 4; s++) {
        const sa = time * 3 + (s / 4) * Math.PI * 2;
        ctx.fillStyle = s % 2 === 0 ? '#38bdf8' : '#ffffff';
        ctx.beginPath();
        ctx.arc(Math.cos(sa) * (r * 1.55), Math.sin(sa) * (r * 0.45), 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      break;
    }

    case 'cosmic-teleport': {
      // 9. Cyber Holographic HUD Visor & Quantum Warp Rings
      ctx.save();
      ctx.translate(0, -r * 0.15);
      // Visor glass
      ctx.fillStyle = 'rgba(6, 182, 212, 0.75)';
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.roundRect(-r * 0.8, -r * 0.15, r * 1.6, r * 0.3, 6);
      ctx.fill();
      ctx.stroke();
      // Digital scanline
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-r * 0.6, -r * 0.03, r * 1.2, 1.5);
      // Dual side quantum portal rings
      [-1, 1].forEach(side => {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(side * (r * 0.95), 0, 5, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.restore();
      break;
    }

    case 'mag-mirrorshield': {
      // 10. Hexagonal Crystalline Prism Aegis Crown
      ctx.save();
      ctx.translate(0, -r * 0.85);
      ctx.fillStyle = 'rgba(244, 114, 182, 0.85)';
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#ec4899';
      ctx.shadowBlur = 14;
      // Hexagonal crystal crest
      ctx.beginPath();
      for (let h = 0; h < 6; h++) {
        const ha = (h / 6) * Math.PI * 2;
        const hx = Math.cos(ha) * (r * 0.32);
        const hy = Math.sin(ha) * (r * 0.32);
        if (h === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Iridescent diamond facet highlight
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      break;
    }

    case 'tech-emp': {
      // 11. Terminator Cybernetic Red Eye Lens & Antenna Dish
      ctx.save();
      // Left cybernetic targeting eye
      ctx.fillStyle = '#ef4444';
      ctx.strokeStyle = '#b91c1c';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(-r * 0.35, -r * 0.12, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Crosshair lines
      ctx.strokeStyle = '#fca5a5';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-r * 0.35 - 9, -r * 0.12);
      ctx.lineTo(-r * 0.35 + 9, -r * 0.12);
      ctx.moveTo(-r * 0.35, -r * 0.12 - 9);
      ctx.lineTo(-r * 0.35, -r * 0.12 + 9);
      ctx.stroke();
      // Antenna mast on top right
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(r * 0.3, -r * 0.85);
      ctx.lineTo(r * 0.45, -r * 1.25);
      ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(r * 0.45, -r * 1.25, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      break;
    }

    case 'tech-railgun': {
      // 12. Armored Steel Combat Plating & Dual Magnetic Accelerator Coils
      ctx.save();
      [-1, 1].forEach(side => {
        // Magnetic accelerator rail barrel
        ctx.fillStyle = '#334155';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.8;
        ctx.shadowColor = '#0284c7';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.roundRect(side * (r * 0.95) - 6, -r * 0.25, 12, r * 0.5, 3);
        ctx.fill();
        ctx.stroke();
        // Barrel muzzle glow
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(side * (r * 0.95), -r * 0.25, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
      // Center targeting laser lens on top
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(0, -r * 0.82, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      break;
    }

    case 'tech-landmines': {
      // 13. Flashing Red Emergency Beacon & Hazard Warning Stripes
      ctx.save();
      // Beacon base
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-r * 0.22, -r * 0.85, r * 0.44, 4);
      // Pulsing siren light
      const isRed = Math.sin(time * 14) > 0;
      ctx.fillStyle = isRed ? '#ef4444' : '#f97316';
      ctx.shadowColor = isRed ? '#ef4444' : '#f97316';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(0, -r * 0.92, 6, 0, Math.PI * 2);
      ctx.fill();
      // Hazard diagonal stripe headband
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-r * 0.8, -r * 0.5);
      ctx.lineTo(r * 0.8, -r * 0.5);
      ctx.stroke();
      ctx.restore();
      break;
    }

    case 'tech-drone': {
      // 14. Dual Aerodynamic Spinning Drone Rotor Blades
      ctx.save();
      ctx.translate(0, -r * 0.9);
      // Hub
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      // Spinning propeller blades
      const propAngle = time * 24;
      ctx.rotate(propAngle);
      ctx.fillStyle = 'rgba(203, 213, 225, 0.9)';
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 0.65, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
      // Navigation lights on tips
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(-r * 0.6, 0, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(r * 0.6, 0, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      break;
    }

    case 'chaos-growth': {
      // 15. Massive Curved Minotaur / Prehistoric Beast Horns
      ctx.save();
      ctx.translate(0, -r * 0.6);
      [-1, 1].forEach(side => {
        ctx.strokeStyle = '#78350f';
        ctx.fillStyle = '#fde68a';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(side * (r * 0.4), 0);
        ctx.quadraticCurveTo(side * (r * 1.1), -r * 0.35, side * (r * 0.85), -r * 0.75);
        ctx.quadraticCurveTo(side * (r * 0.6), -r * 0.4, side * (r * 0.25), -r * 0.1);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });
      // Tribal red warpaint marks
      ctx.fillStyle = '#dc2626';
      [-1, 1].forEach(side => {
        ctx.fillRect(side * (r * 0.55), -r * 0.1, 7, 3);
        ctx.fillRect(side * (r * 0.52), 2, 5, 3);
      });
      ctx.restore();
      break;
    }

    case 'meme-dupe': {
      // 16. Harlequin / Jester Two-Cone Bells Cap
      ctx.save();
      ctx.translate(0, -r * 0.82);
      [-1, 1].forEach((side, idx) => {
        ctx.fillStyle = idx === 0 ? '#a855f7' : '#ec4899';
        ctx.strokeStyle = '#581c87';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(side * (r * 0.6), -r * 0.55, side * (r * 0.75), -r * 0.35);
        ctx.quadraticCurveTo(side * (r * 0.4), -r * 0.2, side * (r * 0.2), 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        // Golden jingling bell on tip
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(side * (r * 0.75), -r * 0.35, 4.5, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
      break;
    }

    case 'chaos-magnet': {
      // 17. Classic Horseshoe Magnet with Silver Poles & Gold Coins
      ctx.save();
      ctx.translate(0, -r * 0.88);
      // Red curved horseshoe arch
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 7;
      ctx.lineCap = 'butt';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.36, Math.PI, 0);
      ctx.stroke();
      // Silver pole tips
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(-r * 0.36, 0);
      ctx.lineTo(-r * 0.36, 6);
      ctx.moveTo(r * 0.36, 0);
      ctx.lineTo(r * 0.36, 6);
      ctx.stroke();
      // Little shiny gold coin stuck to right pole
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(r * 0.44, 4, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      break;
    }

    case 'meme-speed': {
      // 18. Aerodynamic Neon GT Racing Spoiler & Speed Wing
      ctx.save();
      ctx.translate(0, -r * 0.75);
      // Spoiler struts
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-r * 0.45, 0);
      ctx.lineTo(-r * 0.5, -r * 0.32);
      ctx.moveTo(r * 0.45, 0);
      ctx.lineTo(r * 0.5, -r * 0.32);
      ctx.stroke();
      // Spoiler main aerofoil wing
      ctx.fillStyle = '#ef4444';
      ctx.strokeStyle = '#b91c1c';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-r * 0.75, -r * 0.38, r * 1.5, 6, 2);
      ctx.fill();
      ctx.stroke();
      // Checkered flag stripe across front
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-r * 0.2, 0, 5, 5);
      ctx.fillRect(-r * 0.1, 5, 5, 5);
      ctx.fillRect(0, 0, 5, 5);
      ctx.fillRect(r * 0.1, 5, 5, 5);
      ctx.restore();
      break;
    }

    case 'meme-anvil': {
      // 19. Heavy Cartoon Iron Blacksmith Anvil with "100t" Stamp
      ctx.save();
      ctx.translate(0, -r * 0.88);
      ctx.fillStyle = '#334155';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      // Anvil base, waist and horn
      ctx.beginPath();
      ctx.moveTo(-r * 0.35, 0);
      ctx.lineTo(-r * 0.22, -r * 0.15);
      ctx.lineTo(-r * 0.55, -r * 0.35); // conical horn
      ctx.lineTo(r * 0.45, -r * 0.35);  // flat face
      ctx.lineTo(r * 0.22, -r * 0.15);
      ctx.lineTo(r * 0.35, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // "100t" steel text stamp
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 8px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('100t', 0, -r * 0.16);
      ctx.restore();
      break;
    }

    case 'chaos-tornado': {
      // 20. Arcade Pinball Bumper Lights & Cyclone Whirl
      ctx.save();
      ctx.translate(0, -r * 0.82);
      // 3 glowing pinball bumper caps
      const bColors = ['#f43f5e', '#facc15', '#38bdf8'];
      [-1, 0, 1].forEach((pos, idx) => {
        const bx = pos * (r * 0.35);
        ctx.fillStyle = bColors[idx];
        ctx.shadowColor = bColors[idx];
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(bx, 0, 4.5, 0, Math.PI * 2);
        ctx.fill();
      });
      // Whirlwind air current
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, r * 0.2, r * 0.5, time * 5, time * 5 + Math.PI);
      ctx.stroke();
      ctx.restore();
      break;
    }

    case 'legend-fisherman': {
      // 21. Legend Fisherman Bucket Hat, Bamboo Rod, Reel & Hook
      drawFishermanGear(ctx, r, angle, time);
      break;
    }

    default:
      break;
  }

  ctx.restore();
}

/**
 * Draws custom 3D Fishing Rod, Reel, Fishing Line with curved Hook, and Fisherman Hat!
 */
function drawFishermanGear(
  ctx: CanvasRenderingContext2D,
  r: number,
  angle: number,
  time: number
) {
  ctx.save();

  // 1. Fisherman Bucket Hat on top
  ctx.save();
  ctx.translate(0, -r * 0.85);
  // Hat brim
  ctx.fillStyle = '#0f766e'; // teal green fisherman hat
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.88, r * 0.26, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#134e4a';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Hat crown
  ctx.fillStyle = '#14b8a6';
  ctx.beginPath();
  ctx.moveTo(-r * 0.52, 0);
  ctx.lineTo(-r * 0.42, -r * 0.45);
  ctx.lineTo(r * 0.42, -r * 0.45);
  ctx.lineTo(r * 0.52, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Hat lure / feather
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(r * 0.32, -r * 0.25, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. Realistic curved Fishing Rod with Reel & Line
  ctx.save();
  // Rod angle leans dynamically
  const rodAngle = -Math.PI / 4 + Math.sin(time * 3) * 0.1;
  ctx.rotate(rodAngle);

  // Rod pole (flexible carbon/bamboo)
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(r * 0.45, r * 0.2);
  ctx.quadraticCurveTo(r * 0.75, -r * 0.5, r * 1.35, -r * 1.25);
  ctx.stroke();

  const tipX = r * 1.35;
  const tipY = -r * 1.25;

  // Spinning Reel
  ctx.fillStyle = '#64748b';
  ctx.beginPath();
  ctx.arc(r * 0.52, r * 0.12, 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Fishing line (monofilament) dangling from rod tip
  const lineHang = Math.sin(time * 4) * 6;
  const hookX = tipX + 8 + lineHang;
  const hookY = tipY + 36;

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.quadraticCurveTo(tipX + 4, tipY + 18, hookX, hookY);
  ctx.stroke();

  // Shiny Metallic Curved Hook
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(hookX, hookY);
  ctx.lineTo(hookX, hookY + 8);
  ctx.arc(hookX - 4, hookY + 8, 4, 0, Math.PI);
  ctx.lineTo(hookX - 4, hookY + 4);
  ctx.stroke();

  // Little shiny fish lure
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.ellipse(hookX - 4, hookY + 12, 4, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
  ctx.restore();
}
