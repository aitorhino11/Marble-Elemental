import { MarblePower } from '../types/game';

export const MARBLE_POWERS: MarblePower[] = [
  // 1-6: ELEMENTAL (6)
  {
    id: 'elem-fire',
    name: 'Inferno Supernova',
    nameEs: 'Supernova Ígnea',
    category: 'Elemental',
    element: 'Fire',
    rarity: 'Rare',
    dropRatePercent: 5.0,
    triggerCondition: 'High-velocity collision (speed > 750 px/s)',
    visualEffect: 'Expanding fiery shockwave rings, thermal heat distortion haze, molten scorch decals left on the arena floor.',
    combatImpact: 'Lanza una bola de fuego teledirigida que persigue y quema al rival infligiendo 120 de daño.',
    tactileFeedback: 'Medium trapezoidal screen trauma (0.6 intensity) + rapid dual-pulse haptic burst.',
    soundCue: 'Low sub-bass combustion whoosh paired with crackling ember snap.',
    cooldownSeconds: 4.5,
    damageValue: 120,
    knockbackMultiplier: 2.2,
    viralAppealNote: 'Creates high-contrast screen flashes and screen-clearing multi-bounces perfect for dramatic TikTok slow-mo edits.',
    colorHex: '#EF4444',
    iconName: 'Flame'
  },
  {
    id: 'elem-ice',
    name: 'Frostbite Glaciation',
    nameEs: 'Glaciación Polar',
    category: 'Elemental',
    element: 'Ice',
    rarity: 'Common',
    dropRatePercent: 10.0,
    triggerCondition: 'Direct head-on collision',
    visualEffect: 'Sharp ice crystals burst outward from point of impact, target encased in a glowing translucent azure ice cube.',
    combatImpact: 'Dispara una lanza de escarcha que congela al rival en un bloque de hielo por 2.8s (+50% daño de rotura).',
    tactileFeedback: 'Sharp stutter vibration (3 quick ticks) with momentary frame freeze (2 frames).',
    soundCue: 'High-pitched crystalline shatter chime followed by a crisp frost glaze hum.',
    cooldownSeconds: 5.0,
    damageValue: 65,
    knockbackMultiplier: 1.1,
    viralAppealNote: 'Freezing an opponent right on the ledge of a ring-out hazard produces supreme comedy & rage-bait clip moments.',
    colorHex: '#06B6D4',
    iconName: 'Snowflake'
  },
  {
    id: 'elem-lightning',
    name: 'Arc Voltage Chain',
    nameEs: 'Rayo Encadenado',
    category: 'Elemental',
    element: 'Lightning',
    rarity: 'Epic',
    dropRatePercent: 3.0,
    triggerCondition: '3 consecutive wall or marble bounces within 1.8 seconds',
    visualEffect: 'Prismatic violet-blue electric lightning arcs branching through the air, illuminating the arena geometry.',
    combatImpact: 'Descarga un arco de rayos voltaicos directos que electrocutan y causan parálisis EMP (1.8s).',
    tactileFeedback: 'Continuous buzzing high-frequency haptic tick for 250ms.',
    soundCue: 'Snappy electric tesla crackle with ascending harmonic fizz.',
    cooldownSeconds: 3.8,
    damageValue: 70,
    knockbackMultiplier: 1.4,
    viralAppealNote: 'Chain lightning visually links multiple marbles across the screen, satisfying viewers with ASMR electric sound design.',
    colorHex: '#8B5CF6',
    iconName: 'Zap'
  },
  {
    id: 'elem-earth',
    name: 'Tectonic Quake',
    nameEs: 'Terremoto Tectónico',
    category: 'Elemental',
    element: 'Earth',
    rarity: 'Rare',
    dropRatePercent: 5.0,
    triggerCondition: 'Reaching 100% Clash Energy gauge',
    visualEffect: 'Marble turns into a boulder with glowing amber magma seams; ground fractures with deep radial fissure decals.',
    combatImpact: 'Invoca y lanza un meteorito de roca pesada rodante que arrolla con 95 de daño y gran empuje.',
    tactileFeedback: 'Heavy low-frequency rumble lasting 400ms.',
    soundCue: 'Sub-woofer gravel rumble and heavy grinding granite impact.',
    cooldownSeconds: 6.0,
    damageValue: 95,
    knockbackMultiplier: 2.8,
    viralAppealNote: 'The massive size-to-mass visual contrast makes David-vs-Goliath moments where light marbles get swatted across the screen.',
    colorHex: '#D97706',
    iconName: 'Mountain'
  },
  {
    id: 'elem-wind',
    name: 'Cyclone Vortex',
    nameEs: 'Vórtice Ciclón',
    category: 'Elemental',
    element: 'Wind',
    rarity: 'Common',
    dropRatePercent: 10.0,
    triggerCondition: 'Ricochet off any arena bumper or outer wall',
    visualEffect: 'Whirling jade-green spiral tornado wraps the marble, whipping speed lines and vortex wind blades outward.',
    combatImpact: 'Spawnea un tornado ciclónico que succiona a los rivales al ojo del torbellino y los lanza lejos.',
    tactileFeedback: 'Smooth oscillating vibration building to a crisp release punch.',
    soundCue: 'Air rush howling gust with whistle pitch bend.',
    cooldownSeconds: 3.2,
    damageValue: 45,
    knockbackMultiplier: 2.5,
    viralAppealNote: 'Acts like an unstoppable buzzsaw that ping-pongs violently between tightly clustered packs of marbles.',
    colorHex: '#10B981',
    iconName: 'Wind'
  },
  {
    id: 'elem-poison',
    name: 'Venom Miasma',
    nameEs: 'Miasma Venenoso',
    category: 'Elemental',
    element: 'Poison',
    rarity: 'Common',
    dropRatePercent: 10.0,
    triggerCondition: 'Continuous contact (> 0.2s graze time) or direct clash',
    visualEffect: 'Neon toxic lime-green bubbling sludge pool laid behind marble trail; infected marbles turn sickly neon green with skull icons.',
    combatImpact: 'Escupe un charco de ácido e infecta con veneno continuo (-10% velocidad y 1 de daño durante 3 segundos).',
    tactileFeedback: 'Light rhythmic pulse every 500ms matching DoT damage ticks.',
    soundCue: 'Bubbling acid sizzle and caustic liquid hiss.',
    cooldownSeconds: 7.0,
    damageValue: 1,
    knockbackMultiplier: 0.9,
    viralAppealNote: 'Watching an enemy marble slowly bleed out to 1 HP right before the finish line creates nail-biting suspense.',
    colorHex: '#84CC16',
    iconName: 'Biohazard'
  },

  // 7-10: COSMIC & MAGIC (4)
  {
    id: 'cosm-blackhole',
    name: 'Singularity Core',
    nameEs: 'Agujero Negro Cósmico',
    category: 'Cosmic & Magic',
    element: 'Cosmic',
    rarity: 'Legendary', // OP!
    dropRatePercent: 1.25,
    triggerCondition: '100% Ultimate Energy activation or lethal ring boundary proximity',
    visualEffect: 'Dark violet gravitational vortex with glowing neon accretion ring; arena lighting dims by 60% as spacetime warps.',
    combatImpact: '¡MUY OP! Abre una singularidad gravitatoria que absorbe y succiona a todos los rivales al centro aplastándolos.',
    tactileFeedback: 'Inward crescendo rumble followed by a sharp sudden drop to silence and heavy kick.',
    soundCue: 'Sub-bass reverse suction sweep followed by a deep cosmic implosion click.',
    cooldownSeconds: 8.0,
    damageValue: 160,
    knockbackMultiplier: 3.2,
    viralAppealNote: 'The ultimate climax move: pulling 6 marbles into one spot and popping them simultaneously guarantees millions of views.',
    colorHex: '#4C1D95',
    iconName: 'Radio'
  },
  {
    id: 'mag-warp',
    name: 'Quantum Blink',
    nameEs: 'Salto Cuántico',
    category: 'Cosmic & Magic',
    element: 'Magic',
    rarity: 'Legendary', // OP!
    dropRatePercent: 1.25,
    triggerCondition: 'HP falls below 35% or incoming lethal hit predicted within 100ms',
    visualEffect: 'Holographic chromatic aberration glitch; marble vanishes into pixel dust and re-materializes behind the attacker.',
    combatImpact: '¡MUY OP! Se teletransporta instantáneamente a la espalda del rival y le propina un golpe crítico sorpresa.',
    tactileFeedback: 'Dual micro-clicks with zero screen shake (feels surgical and precise).',
    soundCue: 'Sci-fi phase-shift beam blip with tape-stop vinyl scratch.',
    cooldownSeconds: 5.5,
    damageValue: 115,
    knockbackMultiplier: 2.2,
    viralAppealNote: 'Classic anime "Omae Wa Mou Shindeiru" teleportation behind enemy generates instant meme sound effect synchronization.',
    colorHex: '#EC4899',
    iconName: 'Sparkles'
  },
  {
    id: 'cosm-gravityflip',
    name: 'Vector Inversion',
    nameEs: 'Inversión de Gravedad',
    category: 'Cosmic & Magic',
    element: 'Cosmic',
    rarity: 'Epic',
    dropRatePercent: 3.0,
    triggerCondition: 'Striking the center arena orbital beacon',
    visualEffect: 'Cyan vector arrows pulse in reverse across the entire arena floor grid; anti-gravity particle motes float upward.',
    combatImpact: 'Invierte los vectores de movimiento de todos los rivales lanzándolos contra las paredes.',
    tactileFeedback: 'Prolonged floating vibration with reverse frequency glissando.',
    soundCue: 'Inverted pitch riser with metallic shimmer.',
    cooldownSeconds: 7.5,
    damageValue: 50,
    knockbackMultiplier: 2.6,
    viralAppealNote: 'Upends expectations and turns losing matches completely upside down in a fraction of a second.',
    colorHex: '#0EA5E9',
    iconName: 'Compass'
  },
  {
    id: 'mag-mirrorshield',
    name: 'Prismatic Aegis',
    nameEs: 'Escudo Prismático',
    category: 'Cosmic & Magic',
    element: 'Magic',
    rarity: 'Rare',
    dropRatePercent: 5.0,
    triggerCondition: 'Receiving any collision impact exceeding 80 damage',
    visualEffect: 'Hexagonal crystalline energy barrier flares around marble, reflecting neon pink and iridescent cyan light facets.',
    combatImpact: 'Activa una barrera hexagonal brillante que absorbe el 100% del daño y desvía proyectiles.',
    tactileFeedback: 'Crisp ping followed by reverse recoil kick.',
    soundCue: 'High-clarity glass bell chime followed by metallic gong reflection.',
    cooldownSeconds: 4.2,
    damageValue: 100,
    knockbackMultiplier: 2.2,
    viralAppealNote: 'Turns aggressive high-speed chargers into their own worst enemy, creating hilarious instant self-knockout karma.',
    colorHex: '#F472B6',
    iconName: 'Shield'
  },

  // 11-14: MECHANICAL & TECH (4)
  {
    id: 'tech-emp',
    name: 'Cybernetic Jammer',
    nameEs: 'Pulso EMP Cibernético',
    category: 'Mechanical & Tech',
    element: 'Tech',
    rarity: 'Rare',
    dropRatePercent: 5.0,
    triggerCondition: 'Activating Ultimate or colliding with electric field hazard',
    visualEffect: 'Broad blue-white electromagnetic pulse ring sweeps rapidly across the full arena; affected marbles glitch with static UI.',
    combatImpact: 'Dispara una onda EMP por toda la arena que resetea los enfriamientos rivales y los paraliza.',
    tactileFeedback: 'Sharp electric jolt that abruptly cuts off all background vibrations.',
    soundCue: 'Digital system reboot chirp and high-frequency capacitor discharge whine.',
    cooldownSeconds: 6.5,
    damageValue: 40,
    knockbackMultiplier: 1.2,
    viralAppealNote: 'Denies clutch enemy abilities at the exact moment of activation, sparking funny rage reactions and streamer clips.',
    colorHex: '#38BDF8',
    iconName: 'Cpu'
  },
  {
    id: 'tech-nuke',
    name: 'Megaton Blast',
    nameEs: 'Bomba Nuclear Megatón',
    category: 'Mechanical & Tech',
    element: 'Tech',
    rarity: 'Legendary', // OP!
    dropRatePercent: 1.25,
    triggerCondition: 'Direct head-on collision at combined relative speed > 1,100 px/s',
    visualEffect: 'Red warning klaxon flash, micro-nuclear mushroom cloud with radioactive lime-yellow fallout ring; shatters outer arena rails.',
    combatImpact: '¡MUY OP! Detona una colosal bomba nuclear con hongo atómico que arrasa el campo de batalla con 200 de daño.',
    tactileFeedback: 'Maximum screen shake (1.0 trauma score) + heavy double haptic detonation.',
    soundCue: 'Stuttering air raid siren blare transitioning into earth-shattering atomic blast.',
    cooldownSeconds: 9.0,
    damageValue: 200,
    knockbackMultiplier: 3.5,
    viralAppealNote: 'The holy grail of TikTok clips: wiping out the entire 8-marble lobby in one colossal cinematic explosion.',
    colorHex: '#F97316',
    iconName: 'AlertTriangle'
  },
  {
    id: 'tech-laser',
    name: 'Orbital Ion Lance',
    nameEs: 'Lanza Láser Orbital',
    category: 'Mechanical & Tech',
    element: 'Tech',
    rarity: 'Epic',
    dropRatePercent: 3.0,
    triggerCondition: 'Holding continuous straight trajectory line for 0.75s',
    visualEffect: 'Focusing red targeting reticle locks onto furthest target, followed by a searing crimson ion beam piercing across the arena.',
    combatImpact: 'Bloquea la mira en el rival y dispara un haz láser carmesí continuo que perfora y calcina.',
    tactileFeedback: 'Crisp linear rumble that tracks beam duration.',
    soundCue: 'High-energy laser charge chirp followed by searing plasma crackle.',
    cooldownSeconds: 5.0,
    damageValue: 95,
    knockbackMultiplier: 1.8,
    viralAppealNote: 'Collateral triple-knockout snipes across the length of the arena look intensely skilled and cinematic.',
    colorHex: '#E11D48',
    iconName: 'Crosshair'
  },
  {
    id: 'tech-landmines',
    name: 'Proximity Cluster',
    nameEs: 'Minas de Proximidad',
    category: 'Mechanical & Tech',
    element: 'Tech',
    rarity: 'Common',
    dropRatePercent: 10.0,
    triggerCondition: 'Every 2nd bounce off an arena barrier',
    visualEffect: 'Marble drops 3 blinking crimson micro-mines that attach to the arena floor with pulsing hazard radii.',
    combatImpact: 'Siembra 3 minas parpadeantes en el suelo que detonan cuando un rival pasa cerca.',
    tactileFeedback: 'Triple rapid pop vibration.',
    soundCue: 'High-frequency digital beep (3x) followed by explosive pop.',
    cooldownSeconds: 4.0,
    damageValue: 75,
    knockbackMultiplier: 2.1,
    viralAppealNote: 'Creates chaotic chain reaction minefields where marbles bounce from one explosion directly into another like pinball.',
    colorHex: '#F59E0B',
    iconName: 'Bomb'
  },

  // 15-20: CHAOS & MEME/FUN (6)
  {
    id: 'chaos-growth',
    name: 'Mega Chonk Titan',
    nameEs: 'Titán Chonk Gigante',
    category: 'Chaos & Meme/Fun',
    element: 'Chaos',
    rarity: 'Epic',
    dropRatePercent: 3.0,
    triggerCondition: 'HP reaches 50% threshold or manual power tap',
    visualEffect: 'Cartoon squash-and-stretch animation; marble swells to 3.2x normal diameter with bouncy rubber physics and goofy wide eyes.',
    combatImpact: 'Crece a tamaño gigante (2.3x) y multiplica su masa x5, arrollando y aplastando a las demás canicas.',
    tactileFeedback: 'Bouncy, spring-like alternating soft and heavy thuds.',
    soundCue: 'Rubber boing sound effect followed by cartoon bowling ball roll.',
    cooldownSeconds: 6.0,
    damageValue: 85,
    knockbackMultiplier: 3.0,
    viralAppealNote: 'Instantly recognizable meme silhouette; oversized marble bowling over tiny opponents is pure algorithmic gold for YouTube Shorts.',
    colorHex: '#14B8A6',
    iconName: 'Maximize2'
  },
  {
    id: 'meme-dupe',
    name: 'Cloned Mayhem',
    nameEs: 'Caos de Clones',
    category: 'Chaos & Meme/Fun',
    element: 'Meme',
    rarity: 'Epic',
    dropRatePercent: 3.0,
    triggerCondition: 'Taking any single collision hit exceeding 60 damage',
    visualEffect: 'Poof of cartoon smoke splits the marble into 3 identical miniature marbles with tiny animated spin trails.',
    combatImpact: 'Invoca 2 mini-clones idénticos que combaten a tu lado, golpean a los enemigos y absorben daño.',
    tactileFeedback: 'Light popcorn-like flutter of micro-vibrations.',
    soundCue: 'Whimsical cartoon "pop-pop-pop" party noisemaker chime.',
    cooldownSeconds: 5.5,
    damageValue: 50,
    knockbackMultiplier: 1.3,
    viralAppealNote: 'Fills the screen with frantic motion; viewers love watching the horde of mini marbles overwhelm single opponents.',
    colorHex: '#A855F7',
    iconName: 'Copy'
  },
  {
    id: 'chaos-magnet',
    name: 'Greed Vortex',
    nameEs: 'Imán Voraz de Monedas',
    category: 'Chaos & Meme/Fun',
    element: 'Chaos',
    rarity: 'Common',
    dropRatePercent: 10.0,
    triggerCondition: 'Approaching within 120px of gold coins, power orbs, or enemy marbles',
    visualEffect: 'Glowing golden magnetic flux rings pulse outward; coins and gems fly toward the marble like iron shavings to a magnet.',
    combatImpact: 'Genera un potente campo magnético que atrae a todos los rivales directamente hacia sí causando daño por choque.',
    tactileFeedback: 'Smooth hum with rising frequency as loot orbs connect.',
    soundCue: 'Crisp coin chime cascade ("ding-ding-ding!") with metallic magnet click.',
    cooldownSeconds: 3.5,
    damageValue: 35,
    knockbackMultiplier: 1.0,
    viralAppealNote: 'The cascade of coin collection sounds triggers immediate ASMR dopamine hits in younger audiences.',
    colorHex: '#EAB308',
    iconName: 'Magnet'
  },
  {
    id: 'meme-speed',
    name: 'Hypersonic Dash',
    nameEs: 'Turbo Hipersónico',
    category: 'Chaos & Meme/Fun',
    element: 'Meme',
    rarity: 'Rare',
    dropRatePercent: 5.0,
    triggerCondition: 'Perfect slingshot release or manual nitro boost tap',
    visualEffect: 'Mach cone sonic shockwave, rainbow neon speed blur trail, screen edges stretch with radial motion blur.',
    combatImpact: 'Acelera al 320% con invulnerabilidad temporal y estela arcoíris, embistiendo con brutal retroceso.',
    tactileFeedback: 'Accelerating engine rev vibration followed by a sharp sonic boom snap.',
    soundCue: 'Sonic boom thunder crack followed by high-speed wind slicing whistle.',
    cooldownSeconds: 4.5,
    damageValue: 110,
    knockbackMultiplier: 2.7,
    viralAppealNote: 'Extreme speed blurs and ricochets create breathless, high-tempo highlight moments ideal for TikTok audio drops.',
    colorHex: '#3B82F6',
    iconName: 'FastForward'
  },
  {
    id: 'meme-anvil',
    name: '100-Ton Cartoon Drop',
    nameEs: 'Yunque de 100 Toneladas',
    category: 'Chaos & Meme/Fun',
    element: 'Meme',
    rarity: 'Legendary', // OP!
    dropRatePercent: 1.25,
    triggerCondition: 'Launched into air via jump pad or bounce bumper',
    visualEffect: 'Marble transforms mid-air into a giant matte-black cartoon anvil stamped "100 TONS", complete with comic drop shadow below.',
    combatImpact: '¡MUY OP! Deja caer un yunque gigante de 100T desde el cielo sobre la cabeza del rival aplastándolo y aturdiéndolo.',
    tactileFeedback: 'Brief silence during descent followed by heavy bottomed-out haptic smash.',
    soundCue: 'Descending cartoon slide whistle followed by loud metallic anvil CLANG!',
    cooldownSeconds: 7.0,
    damageValue: 150,
    knockbackMultiplier: 3.1,
    viralAppealNote: 'The classic Acme-style cartoon timing guarantees laughs and high shareability among 8-14 year old players.',
    colorHex: '#64748B',
    iconName: 'Anchor'
  },
  {
    id: 'chaos-tornado',
    name: 'Chaos Pinball Twister',
    nameEs: 'Torbellino Pinball',
    category: 'Chaos & Meme/Fun',
    element: 'Chaos',
    rarity: 'Rare',
    dropRatePercent: 5.0,
    triggerCondition: 'Simultaneous collision with 2 or more marbles',
    visualEffect: 'Multicolor neon pinball lights flare; whirlwind vortex envelopes the marble while bumpers flash wildly.',
    combatImpact: 'Se convierte en una bola de pinball sin fricción rebotando con elasticidad infinita y sonidos de recreativa.',
    tactileFeedback: 'Continuous machine-gun pinball thumps on every wall strike.',
    soundCue: 'Arcade pinball bell chime flurry and whirling siren.',
    cooldownSeconds: 5.0,
    damageValue: 80,
    knockbackMultiplier: 2.4,
    viralAppealNote: 'Unpredictable ricochets and arcade pinball bells tap into pure unadulterated chaotic fun and satisfying sensory overload.',
    colorHex: '#F43F5E',
    iconName: 'Dices'
  },
  {
    id: 'legend-fisherman',
    name: 'Master Angler',
    nameEs: 'Pescador',
    category: 'Chaos & Meme/Fun',
    element: 'Meme',
    rarity: 'Legendary',
    dropRatePercent: 1.25,
    triggerCondition: 'Lanzamiento de caña activo cada 8s y pesca pasiva de peces cada 3s',
    visualEffect: 'Sedal curvado tenso con anzuelo brillante que engancha al rival y lo estampa fuertísimo contra la pared; peces saltarines curativos que aparecen en la arena.',
    combatImpact: '¡MUY OP! Lanza la caña y estampa al rival contra la pared causándole 30 de daño. En colisión inflige 30 de daño y cada 3s pesca peces que le curan 15 de vida al comerlos.',
    tactileFeedback: 'Tirón elástico del sedal con haptic tenso y golpe seco contra el muro.',
    soundCue: 'Silbido del carrete lanzando el sedal, chapoteo de agua y fuerte impacto contra la pared.',
    cooldownSeconds: 8.0,
    damageValue: 30,
    knockbackMultiplier: 3.2,
    viralAppealNote: 'Pescar a un rival desprevenido al otro lado del mapa y reventarlo contra el muro garantiza risas y clips virales.',
    colorHex: '#0284C7',
    iconName: 'Fish'
  }
];

export function getPowerDisplayName(power: MarblePower, lang: string = 'es'): string {
  if (lang === 'es' && power.nameEs) {
    return power.nameEs;
  }
  return power.name;
}

export const ELEMENTAL_MATCHUPS: Record<string, { strongAgainst: string[]; weakAgainst: string[]; multiplier: number }> = {
  Fire: { strongAgainst: ['Ice', 'Wind'], weakAgainst: ['Earth', 'Cosmic'], multiplier: 1.35 },
  Ice: { strongAgainst: ['Earth', 'Poison'], weakAgainst: ['Fire', 'Tech'], multiplier: 1.35 },
  Lightning: { strongAgainst: ['Tech', 'Ice'], weakAgainst: ['Earth', 'Chaos'], multiplier: 1.35 },
  Earth: { strongAgainst: ['Lightning', 'Fire'], weakAgainst: ['Wind', 'Ice'], multiplier: 1.35 },
  Wind: { strongAgainst: ['Poison', 'Earth'], weakAgainst: ['Fire', 'Lightning'], multiplier: 1.35 },
  Poison: { strongAgainst: ['Chaos', 'Earth'], weakAgainst: ['Wind', 'Ice'], multiplier: 1.35 },
  Cosmic: { strongAgainst: ['Fire', 'Tech'], weakAgainst: ['Magic', 'Chaos'], multiplier: 1.4 },
  Magic: { strongAgainst: ['Cosmic', 'Tech'], weakAgainst: ['Meme', 'Elemental'], multiplier: 1.4 },
  Tech: { strongAgainst: ['Magic', 'Chaos'], weakAgainst: ['Lightning', 'Cosmic'], multiplier: 1.35 },
  Chaos: { strongAgainst: ['Cosmic', 'Earth'], weakAgainst: ['Tech', 'Poison'], multiplier: 1.35 },
  Meme: { strongAgainst: ['Magic', 'All'], weakAgainst: ['Chaos'], multiplier: 1.25 }
};

/**
 * Returns color hex corresponding to marble rarity:
 * Common: gris (#94a3b8)
 * Rare: azul (#38bdf8)
 * Epic: morado (#c084fc)
 * Legendary: dorado (#facc15)
 */
export function getRarityTextColor(rarity: string): string {
  switch (rarity) {
    case 'Legendary':
      return '#facc15'; // dorado
    case 'Epic':
      return '#c084fc'; // morado
    case 'Rare':
      return '#38bdf8'; // azul
    case 'Common':
    default:
      return '#94a3b8'; // gris
  }
}

/**
 * Returns Tailwind text classes for rarity-coded marble names
 */
export function getRarityTextClass(rarity: string): string {
  switch (rarity) {
    case 'Legendary':
      return 'text-amber-400 font-black drop-shadow-[0_1px_3px_rgba(245,158,11,0.5)]'; // dorado
    case 'Epic':
      return 'text-purple-400 font-bold drop-shadow-[0_1px_3px_rgba(168,85,247,0.4)]'; // morado
    case 'Rare':
      return 'text-sky-400 font-bold drop-shadow-[0_1px_2px_rgba(56,189,248,0.3)]'; // azul
    case 'Common':
    default:
      return 'text-slate-400 font-medium'; // gris
  }
}

