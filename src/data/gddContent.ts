export interface GddSection {
  id: string;
  number: string;
  title: string;
  summary: string;
  content: string;
}

export const GDD_METADATA = {
  title: 'Marble Clash: Elemental Arena',
  subtitle: 'Game Design Document (GDD) v1.0 · Production Ready',
  targetAudience: 'Kids & Pre-Adolescents (Ages 8-14) · Hyper-Casual & TikTok / YouTube Shorts Viewers',
  platform: 'Mobile (Android / iOS) · Designed for 60-120 FPS Physics',
  engineTarget: 'Unity / Godot / Custom 2D Rigidbody Engine',
  monetization: 'Free-to-Play (F2P) Hybrid: Rewarded Video Ads, Battle Pass, Gacha Egg Hatches',
  sessionLength: '30 to 75 seconds per match'
};

export const GDD_SECTIONS: GddSection[] = [
  {
    id: 'executive-summary',
    number: '01',
    title: 'Title, Elevator Pitch & Core Pillars',
    summary: 'High-energy brand positioning, 2-sentence hook, demographic alignment, and core design pillars.',
    content: `
# 1. Title & Elevator Pitch

### Game Title
**MARBLE CLASH: ELEMENTAL ARENA™**  
*(Tagline: "Sling. Smash. Dominate.")*

### Elevator Pitch (2-Sentence Hook)
*Launch customized, elemental-infused marbles into chaotic, physics-driven battle arenas where continuous momentum converts into devastating kinetic knockouts and screen-clearing super moves.*  
*Experience lightning-fast 45-second showdowns packed with tactile ASMR glass clicks, explosive visual juice, and clutch anime-style ultimate reversals designed specifically for the viral TikTok and YouTube Shorts generation.*

---

### Core Target Demographic
* **Primary Demographic:** Kids and pre-adolescents aged **8 to 14 years old**, heavy consumers of YouTube Shorts, TikTok gaming clips, and competitive hyper-casual titles (e.g., *Stumble Guys*, *Brawl Stars*, *Angry Birds*, *Smash Cops*).
* **Psychographic Drivers:**
  * **Immediate Dopamine Gratification:** Zero friction onboarding; playable within 2 seconds of app launch.
  * **Sensory ASMR Delight:** Crisp acoustic glass clinks, heavy bass sub-drops, and satisfying neon particle bursts.
  * **Spectacle & Bragging Rights:** Unbelievable physics chain-reactions and instant slow-mo replays ready to share with friends.
  * **Collection & Customization Obsession:** Rare egg hatching ceremonies, legendary glowing skins, and floating companion pets.

---

### The Four Pillars of Game Design

1. **Momentum Is Power (Physics As Combat):**  
   Combat is not dictated by turn-based numbers, but by raw physical velocity, vector angles, and mass advantage. A high-speed ricochet turns a pebble into an orbital missile.
2. **Tactile ASMR Audio-Visual Juice:**  
   Every single interaction feels physically good in the player's hands. Glass marbles ping with pure acoustic resonance, hits trigger screen-shake trauma, and knockouts freeze time for cinematic slow-motion glory.
3. **Hyper-Compressed Session Loop (Sub-60-Second Matches):**  
   Designed for bus rides, school breaks, and short attention spans. 3-second launch phase, 30-second chaotic combat, and 5-second victory loot drop with instantaneous 1-tap replay.
4. **Algorithmic Virality By Design:**  
   Every match automatically buffers a 5-second slow-motion knockout highlight formatted in 9:16 vertical video with sound-synced trending stickers, turning every player into a viral content creator.
`
  },
  {
    id: 'gameplay-loop',
    number: '02',
    title: 'Core Gameplay Loop & Combat Mechanics',
    summary: 'The 3-phase micro-loop: The Launch, Physics Combat, and Victory & Rewards.',
    content: `
# 2. Core Gameplay Loop

The core match follows an intense, cyclical 3-phase rhythm that maximizes anticipation, chaotic execution, and euphoric celebration:

\`\`\`
   ┌────────────────────────────────────────────────────────┐
   │                  THE 45-SECOND MATCH LOOP              │
   └────────────────────────────────────────────────────────┘
                               │
            ┌──────────────────▼──────────────────┐
            │       PHASE 1: THE SLINGSHOT LAUNCH │
            │  • Pull-back slingshot trajectory   │
            │  • Power-meter timing (Critical +20%)│
            │  • Dynamic entry hazards & gates    │
            └──────────────────┬──────────────────┘
                               │
            ┌──────────────────▼──────────────────┐
            │       PHASE 2: REAL-TIME CLASH      │
            │  • Momentum-based kinetic damage    │
            │  • Knockback & arena ring-outs      │
            │  • Elemental matchups & 20 powers   │
            │  • Ultimate Energy charge meter     │
            └──────────────────┬──────────────────┘
                               │
            ┌──────────────────▼──────────────────┐
            │     PHASE 3: VICTORY & REWARDS      │
            │  • Last Marble Standing / First Out │
            │  • Exploding gem & coin fountains   │
            │  • Auto-generated TikTok clip       │
            │  • 1-Tap Instant Replay (< 2.5s)    │
            └─────────────────────────────────────┘
\`\`\`

---

### Phase 1: The Launch (Anticipation & Agency)
* **Slingshot / Drag-and-Release Mechanic:**
  * Players touch and pull back their marble. A vibrant dotted trajectory line projects forward, bouncing off up to two prospective walls using real-time predictive raycasting.
  * **Power Meter Bonus:** A rhythmic pulsating reticle circles the marble. Releasing when the ring turns gold grants a **"PERFECT LAUNCH!"** with +25% initial impulse velocity and a rainbow speed trail.
* **Launch Tubes & Starting Gates:**
  * 4 to 8 marbles are held in starting funnels or a spinning revolver cylinder.
  * Staggered gate releases or simultaneous high-speed drops initiate instant collision clusters.
* **Entry Hazards:**
  * **Turbo Boost Strips:** Accelerate crossing marbles to 200% top speed.
  * **Spike Bumpers:** Deal 25 flat damage and launch marbles at 90-degree outward angles.
  * **Vortex Funnels:** Swirl marbles around a gravitational center before spitting them out in unpredictable vectors.

---

### Phase 2: Physics Combat (Chaotic Momentum & Combat Impact)
* **Momentum-Based Damage Formula:**
  Damage is computed strictly from real-time collision kinetics:
  $$\\text{Damage} = \\text{BasePower} + \\alpha \\cdot \\left( \\frac{1}{2} m \\cdot (\\vec{v}_{\\text{rel}} \\cdot \\hat{n})^2 \\right) \\times \\text{TypeMultiplier}$$
  * A light scout marble moving at 1,000 px/s deals more damage than a heavy marble at rest, rewarding skilled ricochets and bank shots.
* **Knockback & Ring-Out Conditions:**
  * Each marble has **Health Points (HP, base 200)**. When HP reaches 0, the marble shatters in a glittering glass explosion.
  * Arenas feature **destructible perimeter barriers** and open pits. Pushing an opponent off the edge results in an instant **"RING OUT! (K.O.)"**, bypassing remaining HP!
* **Mass Tiers:**
  * **Light / Scout (Mass: 0.7x):** Ultra-high bounce speed, agile steering, susceptible to heavy knockback.
  * **Medium / Striker (Mass: 1.0x):** Balanced all-around combatant.
  * **Heavy / Juggernaut (Mass: 1.8x):** Slower acceleration, but acts like a wrecking ball, easily shoving lighter marbles off arena ledges.
* **Ultimate Energy Charge System (Clash Meter):**
  * Every collision against walls, obstacles, and enemy marbles charges the **Elemental Gauge (0 to 100%)**.
  * Upon hitting 100%, the marble ignites with an elemental aura and either auto-detonates its signature power or allows the player to tap for an explosive manual trigger!

---

### Phase 3: Victory & Rapid Replay (Dopamine Release)
* **Win Conditions:**
  * **Battle Royale (Last Marble Standing):** Standard survival mode; surviving the collapsing perimeter nets 1st Place.
  * **Obstacle Race (First to Finish):** High-speed gauntlet race through pinball bumpers, laser gates, and speed ramps.
* **Celebratory Loot Cascades:**
  * The winning marble centers on screen with a golden spotlight. A massive fountain of **Clash Coins**, **Gems**, and **Egg Shards** explodes across the screen with ASMR coin chimes.
* **The Rapid Replay Imperative:**
  * A prominent neon **"BATTLE AGAIN!"** button sits front-and-center. Tapping it resets the arena and starts the next countdown in under 2.5 seconds, eliminating menu fatigue and keeping players locked in the flow state.
`
  },
  {
    id: 'twenty-powers',
    number: '03',
    title: 'The 20 Distinct Marble Powers Catalog',
    summary: 'Comprehensive 4-category roster across Elemental, Cosmic & Magic, Mechanical & Tech, and Chaos & Meme.',
    content: `
# 3. Complete List of 20 Distinct Marble Powers

Every marble in *Marble Clash* is defined by a signature ability that creates distinct gameplay tactics, dramatic reversals, and viral video moments. Below is the complete design specification for all 20 powers across 4 core categories:

### Categorized Power Matrix

| # | Power Name | Category / Element | Trigger Condition | Visual & Tactile Effect | Combat & Kinetic Impact |
|:---|:---|:---|:---|:---|:---|
| **01** | **Inferno Supernova** | Elemental · Fire | Speed > 750 px/s impact | Expanding fiery shockwaves & scorched floor decals; heavy trauma shake. | Deals 120 AOE fire damage in 140px radius + 2.2x explosive knockback. |
| **02** | **Frostbite Glaciation** | Elemental · Ice | Direct head-on clash | Target encased in translucent azure ice block; high crystal chime. | Freezes target for 2.2s (zero friction, no steering); frozen target takes +35% shatter damage. |
| **03** | **Arc Voltage Chain** | Elemental · Lightning | 3 rapid bounces in 1.8s | Violet-blue branching electrical arcs; high-frequency buzz haptics. | Chains 70 electric damage to 3 nearby marbles; 0.5s micro-stun interrupts ultimate charge. |
| **04** | **Tectonic Quake** | Elemental · Earth | 100% Clash Energy | Glowing magma fissure decals; deep sub-woofer bass rumble. | Multiplies mass by 4.0x for 3.5s; seismic pulse vacuums lighter marbles into its crushing path. |
| **05** | **Cyclone Vortex** | Elemental · Wind | Ricochet off wall or bumper | Whirling jade tornado funnel with cutting wind blades. | Repels all surrounding marbles with 2.5x kinetic deflection aura for 2.0s. |
| **06** | **Venom Miasma** | Elemental · Poison | Continuous contact > 0.2s | Caustic lime-green bubbling trail; rhythmic health tick pulses. | Inflicts 14 DoT/sec for 4.5s (bypasses 50% armor) and reduces opponent traction/speed by 30%. |
| **07** | **Singularity Core** | Cosmic & Magic · Cosmic | 100% Ultimate or lethal hazard | Dark-violet accretion disk warps spacetime; arena lighting dims 60%. | Sucks all entities within 240px to epicenter for 2.4s, then detonates for 160 crushing damage. |
| **08** | **Quantum Blink** | Cosmic & Magic · Magic | HP drops < 35% | Chromatic aberration glitch flash; marble vanishes into pixel dust. | Teleports 160px behind nearest attacker with guaranteed 2.0x critical momentum counter-charge! |
| **09** | **Vector Inversion** | Cosmic & Magic · Cosmic | Strike center orbital node | Cyan vector arrows invert across floor; floaty reverse pitch sweep. | Reverses arena gravity vectors for 3.0s, hurling rival marbles into ceiling & outer spike fields. |
| **10** | **Prismatic Aegis** | Cosmic & Magic · Magic | Receive hit > 80 damage | Crystalline hexagonal barrier flares with rainbow refraction. | Absorbs 100% incoming damage and reflects 150% attacker momentum back into the assailant. |
| **11** | **Cybernetic Jammer** | Mechanical · Tech | Ultimate Clash trigger | Blue-white EMP wave sweeps full arena; enemy marbles display static glitch UI. | Silences enemy abilities, drains all energy meters to 0%, and disables pets for 4.0 seconds. |
| **12** | **Megaton Blast** | Mechanical · Tech | Head-on collision > 1,100 px/s | Red klaxon flash, mushroom cloud VFX, camera shake level 10. | Massive 200 AOE damage across 220px; demolishes perimeter barriers creating pitfall ring-outs. |
| **13** | **Orbital Ion Lance** | Mechanical · Tech | Hold straight line for 0.75s | Searing crimson ion laser cuts through the entire arena diameter. | Pierces all marbles along path for 95 damage each, leaving a thermal turbo track. |
| **14** | **Proximity Cluster** | Mechanical · Tech | Every 2nd barrier ricochet | Deploys 3 blinking red micro-mines on the floor with hazard radii. | Mines explode upon contact for 75 damage and launch victims 300px into the air or out of bounds. |
| **15** | **Mega Chonk Titan** | Chaos & Meme · Chaos | 50% HP or manual tap | Cartoon squash-and-stretch; swells to 3.2x size with silly googly eyes. | Mass surges by 5.5x with 95% knockback immunity; steamrolls opponents for 85 crush damage. |
| **16** | **Cloned Mayhem** | Chaos & Meme · Meme | Critical hit received > 60 dmg | Poof of cartoon smoke splits marble into 3 autonomous mini clones. | Clones fight for 5.0s, dealing fractional damage, absorbing hits, and confusing enemy target lock. |
| **17** | **Greed Vortex** | Chaos & Meme · Chaos | Proximity to loot or mid-clash | Golden magnetic flux rings; cascade of high-pitch coin chimes. | Magnetically vacuums all coins/gems in 250px and drags lighter marbles into your wake. |
| **18** | **Hypersonic Dash** | Chaos & Meme · Meme | Slingshot release or nitro tap | Mach cone sonic shockwave with rainbow neon speed streak blur. | Velocity spikes to 320% for 1.2s; grants complete invulnerability frames and 110 impact damage. |
| **19** | **100-Ton Cartoon Drop** | Chaos & Meme · Meme | Launched airborne by bumper | Marble morphs mid-air into a giant Acme-style cartoon iron anvil. | Slams down onto floor for 150 damage, creating shockwave that stuns surrounding marbles for 1.4s. |
| **20** | **Chaos Pinball Twister** | Chaos & Meme · Chaos | Simultaneous multi-marble hit | Neon pinball bumper flash; frantic whirlwind and pinball bell frenzy. | Locks marble at 100% velocity with zero friction for 3.5s, ricocheting randomly with +100% bounce. |

---

### Elemental Affinity & Matchup System
To reward tactical marble drafting and team roster composition, marbles obey a circular elemental triangle with +35% damage multipliers:
* **Fire** beats **Ice** and **Wind** (melts frost, superheats gale currents).
* **Ice** beats **Earth** and **Poison** (freezes stone fissures, solidifies liquid venom).
* **Lightning** beats **Tech** and **Ice** (short-circuits microchips, conducts through ice).
* **Earth** beats **Lightning** and **Fire** (grounds high-voltage arcs, smothers flames).
* **Wind** beats **Poison** and **Earth** (disperses toxic gas, erodes heavy stone).
* **Poison** beats **Chaos** and **Earth** (dissolves organic bulk, corrodes mineral mass).
* **Cosmic & Magic** are mutually counteracting wildcards with high burst potential.
`
  },
  {
    id: 'juiciness-audio',
    number: '04',
    title: 'Juiciness & Dopamine Drivers (Visuals & Audio)',
    summary: 'Trauma screen shake, slow-mo knockout camera, particle systems, and ASMR sound design.',
    content: `
# 4. Juiciness & Dopamine Drivers (Visuals & Audio)

In hyper-casual mobile titles targeting 8-14 year olds, **game feel ("juice") is not decoration—it is the core retention engine.** Every millisecond of gameplay must trigger sensory gratification.

---

### Visual Juice Mechanics

1. **Trauma-Based Screen Shake System:**
   * Instead of linear camera offsets, uses a **perlin-noise trapezoidal trauma decay model** ($Trauma \\in [0, 1]$, $Shake = Trauma^2$):
     * *Light Collision:* 0.1 Trauma (subtle 2px micro-vibration).
     * *Elemental Trigger:* 0.4 Trauma (sharp 8px rotational rumble).
     * *Megaton Nuke / Lethal Ring-Out:* 1.0 Trauma (maximum 22px violent screen concussion with momentary chromatic aberration).
2. **Dynamic Slow-Motion Knockout Cam (The "TikTok Climax"):**
   * When a collision calculation determines that a hit will be fatal:
     * Time slows dynamically to **0.2x speed** over 400 milliseconds.
     * Camera zooms in **1.4x** directly centered on the collision impact point.
     * A radial blur vignette darkens the screen edges, focusing 100% of viewer attention on the shattered glass fragments and flying damage typography.
     * Normal time snaps back with a high-velocity screen punch as the eliminated marble ricochets into oblivion.
3. **Vibrant Particle Trails & Physical Debris:**
   * Continuous ribbon trails match the marble's elemental theme (e.g., crackling lightning filaments, glowing ember embers, toxic slime droplets).
   * Wall collisions dislodge real physics sparks, geometric dust chunks, and glass micro-shards that persist on the arena floor for 5 seconds.
4. **Neon Damage Pop-Ups & Crit Multipliers:**
   * Numbers burst upward with spring-elastic easing (\`transform: scale(1.4) -> scale(1.0)\`).
   * Color-coded typography: White for normal hits, Golden Yellow for Elemental Advantage, Searing Neon Pink for **"CRITICAL HIT!"**, and Rainbow Bold for **"KNOCKOUT!"**.

---

### ASMR Sound Design (Sensory Satisfaction)

Sound in *Marble Clash* is engineered specifically to trigger auditory ASMR (Autonomous Sensory Meridian Response), making collisions inherently addictive to hear:

* **The Signature Glass Ping (1,800 Hz - 3,200 Hz Resonance):**  
  Synthesized with crystal-pure overtones. Light taps produce a crisp musical clink; high-speed collisions produce a layered acoustic shatter chime that mimics fine hand-blown glass marbles.
* **The Sub-Bass Impact Thud (40 Hz - 90 Hz):**  
  Every heavy collision layers an acoustic low-end thump that can be felt in headphones, giving marbles a visceral sense of physical weight and momentum.
* **Swelling Power-Up Pitch Risers:**  
  As the Clash Energy meter fills from 80% to 100%, an exponential ascending sine tone builds anticipation, concluding in a sharp cinematic sub-drop when the ability triggers.
* **Victory Celebration Fanfare:**  
  A sparkling arpeggio in the key of C Major combined with a cascading burst of mechanical coin drop chimes ("clink-clink-clink-kaching!"), stimulating instant dopamine release.
`
  },
  {
    id: 'progression-gacha',
    number: '05',
    title: 'Progression, Gacha & Customization Systems',
    summary: 'Companion Pet Spheres, 3-step egg hatching ceremony, rarity tiers, and RPG stat upgrade ladders.',
    content: `
# 5. Progression, Gacha & Customization Systems

To transform short session virality into multi-month player retention, *Marble Clash* features deep collection mechanics and transparent, satisfying gacha ceremonies.

---

### Companion Pet / Booster Spheres
Floating alongside each marble is an animated mini-pet sphere that provides passive buffs and charming personality:
* **Sparky the Voltwisp (Rare):** Boosts Clash Energy generation rate by +18% on all wall bounces.
* **Glacier Cub Golem (Epic):** Grants +25% knockback resistance against Heavy marbles.
* **Chrono-Pixie (Legendary):** Deploys a localized time-dilation field that slows incoming enemy projectiles and landmines by 50%.
* **Loot-Goblin Orb (Mythic):** Automatically vacuums scattered gems from 2x further away and grants a +20% bonus Clash Coin multiplier at match end.

---

### The 3-Step Egg Hatching Ceremony
Opening a mystery marble egg is a high-anticipation, 3-action physical toy ritual:

\`\`\`
   ┌────────────────────────────────────────────────────────┐
   │             THE 3-STEP EGG HATCHING RITUAL             │
   └────────────────────────────────────────────────────────┘
                               │
            ┌──────────────────▼──────────────────┐
            │   STEP 1: THE FIRST TAP (WOBBLE)    │
            │  • Shell wobbles with physics spring│
            │  • First hairline crack appears     │
            │  • Sub-bass acoustic egg tap sound  │
            └──────────────────┬──────────────────┘
                               │
            ┌──────────────────▼──────────────────┐
            │   STEP 2: THE SECOND TAP (RATTLE)   │
            │  • Intense violent shell vibration  │
            │  • Colored light beams leak through │
            │  • Rising pitch anticipation whirr  │
            └──────────────────┬──────────────────┘
                               │
            ┌──────────────────▼──────────────────┐
            │   STEP 3: THE THIRD TAP (BURST)     │
            │  • Egg shell explodes into shards   │
            │  • Full-screen confetti fireworks   │
            │  • Rarity tier fanfare plays        │
            │  • 3D Marble reveals with pedestal  │
            └─────────────────────────────────────┘
\`\`\`

#### Rarity Tiers, Drop Rates & Pity Protection
* **Common (60.0%):** Standard elemental marbles (Base stats).
* **Rare (25.0%):** Enhanced momentum scaling and secondary traits.
* **Epic (10.0%):** Signature elemental effects with animated skins.
* **Legendary (4.0%):** Game-changing cosmic/meme abilities and glowing aura trails.
* **Mythic (1.0%):** Ultra-rare holographic finish, custom entrance animation, and leaderboard prestige.
* **Bad-Luck Protection (Pity System):**
  * Guaranteed **Epic** or higher every 10 hatches.
  * Guaranteed **Legendary** or higher every 50 hatches.
  * Counter displayed transparently on the gacha interface to build trust and anticipation.

---

### Marble RPG Stat Upgrades
Players spend soft currency (**Clash Coins**) and duplicate duplicate shards to upgrade 4 core performance attributes (Level 1 to Level 15):
1. **Health Points (HP):** Increases durability against sustained collision damage (Base 200 -> Max 550 HP).
2. **Attack Power (Kinetic Damage Multiplier):** Scales collision momentum into offensive damage (1.0x -> 2.4x).
3. **Mass (Knockback Resistance & Shove):** Heavier marbles absorb hits without moving and push rivals over ring edges.
4. **Cooldown Reduction / Energy Charge Rate:** Accelerates ability recharges (5.0s -> 2.8s) and Clash Meter filling.
`
  },
  {
    id: 'monetization-viral',
    number: '06',
    title: 'Monetization & Viral TikTok Growth Engine',
    summary: 'Fair rewarded video ads, 5-second automatic Highlight Clipper, and Community Arena Creator.',
    content: `
# 6. Monetization & Viral TikTok Features

*Marble Clash* avoids aggressive, disruptive pay-to-win paywalls in favor of player-friendly rewarded opt-ins and organic, self-sustaining TikTok/Shorts content generation.

---

### Rewarded Video Ad Integration (High-Value Opt-Ins)
* **2x Match Reward Multiplier:**  
  After finishing a match, a golden button offers: *"Watch 15s clip to DOUBLE your Clash Coins and Egg Shards!"* (Achieves 65%+ opt-in rate among casual players).
* **1x Clutch Revive Per Match:**  
  Upon being knocked out or falling into a pit: A 3-second heartbeat countdown allows players to watch a quick ad to slingshot back into the arena with a 3-second golden invulnerability shield.
* **Supercharged Rocket Launch:**  
  Optional pre-match boost providing +50% launch speed and a fiery trail for the initial salvo.

---

### The Built-in "Highlight Clipper" (Viral Growth Engine)
* **How It Works:**
  * The game engine continuously maintains a rolling 5-second physics memory buffer.
  * When a player scores a multi-knockout or dramatic ring-out finish, the engine flags it as an **"EPIC CLASH MOMENT"**.
  * On the victory screen, a pulsing button reads: **"WATCH YOUR HIGHLIGHT & EXPORT TO SHORTS"**.
* **Automatic TikTok / Shorts Video Formatting:**
  * Automatically converted to **9:16 vertical video**.
  * Adds dynamic zoom-in on the final knockout hit with 0.25x slow motion.
  * Embeds an energetic trending sound effect (e.g., cartoon "bonk", dramatic choir, phonk bass drop).
  * Overlays a clean watermark: *"PLAY MARBLE CLASH ON GOOGLE PLAY"*, alongside the player's personalized arena code.
  * Direct 1-tap integration with the native mobile OS share sheet (TikTok, Instagram Reels, YouTube Shorts, WhatsApp).

---

### Level Editor & Community Arena Creator Mode
* **Player-Generated Content (UGC):**
  * Players can open the intuitive **Arena Builder** grid to place:
    * Pinball spring bumpers and boost pads.
    * Spinning laser gates and crumbling floor tiles.
    * Black hole singularities and teleporter wormholes.
* **Shareable 6-Digit Arena Codes:**
  * Every published arena receives a compact code (e.g., \`#CLASH-789\`).
  * Content creators and TikTok streamers can challenge their viewers: *"Can you beat my IMPOSSIBLE Marble Arena? Code: #CLASH-789!"*, creating compounding viral loops.
`
  }
];
