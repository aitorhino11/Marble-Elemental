export type PowerCategory = 'Elemental' | 'Cosmic & Magic' | 'Mechanical & Tech' | 'Chaos & Meme/Fun';

export type ElementType = 
  | 'Fire' 
  | 'Ice' 
  | 'Lightning' 
  | 'Earth' 
  | 'Wind' 
  | 'Poison' 
  | 'Cosmic' 
  | 'Magic' 
  | 'Tech' 
  | 'Chaos' 
  | 'Meme';

export type RarityTier = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';

export interface MarblePower {
  id: string;
  name: string;
  nameEs?: string;
  category: PowerCategory;
  element: ElementType;
  rarity: RarityTier;
  triggerCondition: string;
  visualEffect: string;
  combatImpact: string;
  tactileFeedback: string;
  soundCue: string;
  cooldownSeconds: number;
  damageValue: number;
  knockbackMultiplier: number;
  viralAppealNote: string;
  colorHex: string;
  iconName: string;
  dropRatePercent?: number;
}

export type MapSizeType = 'small' | 'medium' | 'large';
export type MarbleSizeType = 'mini' | 'normal' | 'giant';

export type ArenaShape = 'circle' | 'square' | 'hexagon' | 'octagon';
export type BattleGameMode = 'ffa' | '2v2' | '3v3';

export interface BattleMatchConfig {
  fighters: MarblePower[];
  mapThemeId: string;
  mapSizePercent: number; // 1% to 500%, 200% is normal, 350% is large
  marbleSizePercent: number; // 1% to 500%, 200% is normal, 350% is giant
  gameSpeed: number; // 0.75, 1.0, 1.5, 2.0
  arenaShape?: ArenaShape;
  gameMode?: BattleGameMode;
  teamFighters?: {
    red: MarblePower[];
    blue: MarblePower[];
  };
}

export interface MarbleEntity {
  id: string;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  cooldown: number; // in seconds, counts down to 0
  maxCooldown: number;
  color: string;
  power: MarblePower;
  isAlive: boolean;
  team?: 'red' | 'blue' | 'none';
  isClone?: boolean;
  masterId?: string;
  cloneLife?: number;
  titanTimer?: number;
  fishTimer?: number;
  originalRadius?: number;
  originalMass?: number;
  statusEffect?: {
    type: 'frozen' | 'poisoned' | 'emp' | 'giant' | 'shielded' | 'blitz' | 'burned' | 'tornado';
    duration: number;
  };
  trail: { x: number; y: number; alpha: number }[];
  kills: number;
  damageDealt: number;
  topSpeed: number;
}

export interface PowerProjectile {
  id: string;
  type: 'fireball' | 'boulder' | 'frost_spear' | 'lightning_arc' | 'poison_pool' | 'vortex' | 'laser' | 'blackhole' | 'landmine' | 'nuke' | 'anvil' | 'tornado' | 'fishing_hook' | 'fish_food';
  ownerId: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  life: number;
  maxLife: number;
  color: string;
  targetId?: string;
  extra?: any;
}

export interface HazardObstacle {
  id: string;
  type: 'bumper' | 'speed_strip' | 'vortex' | 'mine' | 'spikes';
  x: number;
  y: number;
  radius?: number;
  width?: number;
  height?: number;
  direction?: number;
  active: boolean;
}

export interface DamagePopup {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  lifetime: number;
  scale: number;
  isCrit: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}
