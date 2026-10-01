/**
 * Web Audio API ASMR & Arcade Sound Synthesizer
 * Provides tactile glass clicks, heavy collision thuds, elemental whooshes,
 * egg crack rattles, and victory fanfares without external audio asset dependencies.
 */

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  public volume: number = 0.8;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Satisfying ASMR Glass Marble Click (high-frequency resonant impact)
  playMarbleClick(intensity: number = 1.0) {
    if (!this.enabled || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // High crystalline fundamental
    const baseFreq = 1800 + Math.random() * 400;
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(baseFreq, now);
    osc1.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, now + 0.08);

    // Overtone chime
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(baseFreq * 2.15, now);
    osc2.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.05);

    const volume = Math.min(1.0, Math.max(0.1, intensity * 0.45 * this.volume));
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.1);
    osc2.stop(now + 0.1);
  }

  // Deep Sub-Bass Impact Thud (heavy momentum smash)
  playHeavyImpact(intensity: number = 1.0) {
    if (!this.enabled || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(38, now + 0.25);

    const volume = Math.min(1.0, Math.max(0.2, intensity * 0.6 * this.volume));
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.28);
  }

  // Slingshot Pullback & Release
  playSlingshotPull(tension: number) {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    const freq = 120 + tension * 350;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  playLaunchRelease() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  // Elemental Power Activation Sounds
  playPowerTrigger(element: string) {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    switch (element.toLowerCase()) {
      case 'fire': {
        // Boom + sizzle
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.35);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
      }
      case 'ice': {
        // High sparkle chime
        [2400, 3100, 3800].forEach((freq, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.04);
          gain.gain.setValueAtTime(0.2, now + idx * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.15);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.04);
          osc.stop(now + idx * 0.04 + 0.15);
        });
        break;
      }
      case 'lightning': {
        // Electric zap
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(750, now);
        osc.frequency.setValueAtTime(1400, now + 0.03);
        osc.frequency.setValueAtTime(450, now + 0.07);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }
      case 'cosmic':
      case 'black hole': {
        // Low gravitational pulse
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.3);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.6);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.65);
        break;
      }
      case 'fisherman': {
        // Silbido del látigo de caña con carrete lanzador y agua
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(280, now + 0.22);
        gain.gain.setValueAtTime(0.38, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.26);
        break;
      }
      default: {
        // Generic swelling power chord
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.25);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      }
    }
  }

  // Egg Hatching 3-Step Sound Effects
  playEggTap() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(550, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.08);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  playEggCrack() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Crackle cluster
    [700, 950, 1300, 1800].forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + i * 0.03);
      gain.gain.setValueAtTime(0.25, now + i * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.03 + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.03);
      osc.stop(now + i * 0.03 + 0.06);
    });
  }

  playEggHatchFanfare(rarity: string = 'Epic') {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const chords: Record<string, number[]> = {
      Common: [440, 554, 659],
      Rare: [523, 659, 784, 1046],
      Epic: [587, 740, 880, 1174],
      Legendary: [523, 659, 784, 1046, 1318],
      Mythic: [659, 830, 987, 1318, 1661, 1975]
    };

    const notes = chords[rarity] || chords.Epic;
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0.25, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.5);
    });
  }

  // Knockout Slow-Mo Hit
  playKnockoutHit() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Sub-bass sweep
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.45);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);

    // Gilded glass shatter
    setTimeout(() => {
      this.playMarbleClick(1.5);
    }, 40);
  }

  // Celebratory Fusion Evolution Ascension
  playFusionAscension() {
    if (!this.enabled || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Harmonic arpeggio riser followed by grand chord
    const arpNotes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    arpNotes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0.2 * this.volume, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.4);
    });

    // Climax burst chord
    const chordTime = now + arpNotes.length * 0.08;
    [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, chordTime);
      gain.gain.setValueAtTime(0.25 * this.volume, chordTime);
      gain.gain.exponentialRampToValueAtTime(0.001, chordTime + 1.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(chordTime);
      osc.stop(chordTime + 1.2);
    });
  }

  // DISTINCT HIT SOUNDS FOR ALL 20 INDIVIDUAL MARBLES
  playMarbleHitSound(powerId: string, intensity: number = 1.0) {
    if (!this.enabled || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const vol = Math.min(1.0, Math.max(0.15, intensity * 0.6 * this.volume));

    switch (powerId) {
      case 'elem-fire': {
        // 1. Fuego: combustión ígnea agresiva, crepitar y deflagración
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.22);
        gain.gain.setValueAtTime(vol * 0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.24);
        break;
      }

      case 'elem-ice': {
        // 2. Hielo: cristal polar resquebrajándose, chime afilado gélido
        [3200, 2400, 4100].forEach((freq, i) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.025);
          osc.frequency.exponentialRampToValueAtTime(freq * 0.6, now + i * 0.025 + 0.12);
          gain.gain.setValueAtTime(vol * 0.45, now + i * 0.025);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.025 + 0.14);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + i * 0.025);
          osc.stop(now + i * 0.025 + 0.14);
        });
        break;
      }

      case 'elem-lightning': {
        // 3. Rayo: descarga tesla de alto voltaje, chisporroteo rápido
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(1100, now);
        osc.frequency.setValueAtTime(2400, now + 0.02);
        osc.frequency.setValueAtTime(600, now + 0.05);
        gain.gain.setValueAtTime(vol * 0.7, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
        break;
      }

      case 'elem-earth': {
        // 4. Tierra: impacto tectónico de peñasco pesado, grava y retumbe sordo
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(95, now);
        osc.frequency.exponentialRampToValueAtTime(32, now + 0.28);
        gain.gain.setValueAtTime(vol * 1.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      }

      case 'elem-wind': {
        // 5. Viento: ráfaga cortante aerodinámica y silbido huracanado
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(650, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.18);
        gain.gain.setValueAtTime(vol * 0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }

      case 'elem-poison': {
        // 6. Veneno: salpicadura ácida viscosa, burbujeo corrosivo y siseo cáustico
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(360, now + 0.15);
        gain.gain.setValueAtTime(vol * 0.65, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
        break;
      }

      case 'cosm-blackhole': {
        // 7. Agujero Negro: implosión gravitatoria sub-grave y resonancia espacial
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(70, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(25, now + 0.35);
        gain.gain.setValueAtTime(vol * 0.9, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.38);
        break;
      }

      case 'mag-warp': {
        // 8. Salto Cuántico: glitch dimensional y micro-blip holográfico
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1800, now);
        osc.frequency.setValueAtTime(450, now + 0.04);
        osc.frequency.setValueAtTime(2200, now + 0.08);
        gain.gain.setValueAtTime(vol * 0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.14);
        break;
      }

      case 'cosm-gravityflip': {
        // 9. Inversión Gravitatoria: barrido armónico ascendente y shimmer espacial
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(780, now + 0.22);
        gain.gain.setValueAtTime(vol * 0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
        break;
      }

      case 'mag-mirrorshield': {
        // 10. Escudo Prismático: repique claro de campana de cristal templado y reflejo metálico
        [1400, 2800].forEach((freq, i) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.015);
          gain.gain.setValueAtTime(vol * 0.5, now + i * 0.015);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.015 + 0.22);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + i * 0.015);
          osc.stop(now + i * 0.015 + 0.22);
        });
        break;
      }

      case 'tech-emp': {
        // 11. Pulso EMP: zumbido digital, reinicio y desestabilización biónica
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(900, now);
        osc.frequency.setValueAtTime(300, now + 0.04);
        osc.frequency.setValueAtTime(1200, now + 0.08);
        gain.gain.setValueAtTime(vol * 0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
        break;
      }

      case 'tech-nuke': {
        // 12. Bomba Nuclear: colosal impacto atómico, retumbo profundo y onda expansiva
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(25, now + 0.4);
        gain.gain.setValueAtTime(vol * 1.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
        break;
      }

      case 'tech-laser': {
        // 13. Láser Orbital: chispa de plasma focalizado, chasquido de alta energía
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(1800, now);
        osc.frequency.exponentialRampToValueAtTime(240, now + 0.12);
        gain.gain.setValueAtTime(vol * 0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.14);
        break;
      }

      case 'tech-landmines': {
        // 14. Minas de Proximidad: clic de espoleta seguido de pop explosivo metálico
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.14);
        gain.gain.setValueAtTime(vol * 0.75, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
        break;
      }

      case 'chaos-growth': {
        // 15. Titán Chonk: boing elástico de goma caricaturesca pesada
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(420, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.24);
        gain.gain.setValueAtTime(vol * 0.85, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.26);
        break;
      }

      case 'meme-dupe': {
        // 16. Caos de Clones: triple pop de fiesta caricaturesco festivo
        [750, 950, 1200].forEach((freq, i) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.035);
          osc.frequency.exponentialRampToValueAtTime(300, now + i * 0.035 + 0.05);
          gain.gain.setValueAtTime(vol * 0.45, now + i * 0.035);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.035 + 0.06);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + i * 0.035);
          osc.stop(now + i * 0.035 + 0.06);
        });
        break;
      }

      case 'chaos-magnet': {
        // 17. Imán Voraz: tintineo de monedas metálicas y zumbido magnético
        [1600, 2100, 2600].forEach((freq, i) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.03);
          gain.gain.setValueAtTime(vol * 0.4, now + i * 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.03 + 0.12);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + i * 0.03);
          osc.stop(now + i * 0.03 + 0.12);
        });
        break;
      }

      case 'meme-speed': {
        // 18. Turbo Hipersónico: estruendo sónico mach y silbido agudo de reactor
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(950, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.16);
        gain.gain.setValueAtTime(vol * 0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
        break;
      }

      case 'meme-anvil': {
        // 19. YUNQUE DE 100T: ¡CLANG! ensordecedor y resonancia metálica de hierro forjado
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Fundamental de hierro macizo
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(520, now);
        osc1.frequency.exponentialRampToValueAtTime(190, now + 0.35);

        // Armónico metálico penetrante
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(1650, now);
        osc2.frequency.exponentialRampToValueAtTime(800, now + 0.18);

        gain.gain.setValueAtTime(vol * 1.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.38);
        osc2.stop(now + 0.38);
        break;
      }

      case 'chaos-tornado': {
        // 20. Torbellino Pinball: campanas arcade vintage y rebote de bumper eléctrico
        [1050, 1400].forEach((freq, i) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.04);
          gain.gain.setValueAtTime(vol * 0.55, now + i * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.15);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + i * 0.04);
          osc.stop(now + i * 0.04 + 0.15);
        });
        break;
      }

      case 'legend-fisherman': {
        // 21. Pescador: Silbido tenso de caña, carrete zumbante y latigazo de sedal con chapoteo
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(1400, now);
        osc1.frequency.exponentialRampToValueAtTime(260, now + 0.18);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(120, now + 0.08);
        osc2.frequency.exponentialRampToValueAtTime(45, now + 0.28);

        gain.gain.setValueAtTime(vol * 1.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now + 0.08);
        osc1.stop(now + 0.32);
        osc2.stop(now + 0.32);
        break;
      }

      default: {
        this.playMarbleClick(intensity);
      }
    }
  }
}

export const soundManager = new SoundSynthesizer();
