import { RarityTier, MarblePower } from './game';

export type RankTier = 
  | 'Bronce' 
  | 'Plata' 
  | 'Oro' 
  | 'Platino' 
  | 'Diamante' 
  | 'Maestro' 
  | 'Gran Maestro';

export interface RankInfo {
  tier: RankTier;
  minElo: number;
  maxElo: number;
  colorHex: string;
  badgeIcon: string;
  division: string;
}

export interface IncubatorEggSlot {
  id: string;
  rarity: RarityTier;
  name: string;
  costTokens: number;
  unlockedAt: number; // timestamp
  isHatched: boolean;
}

export interface CompetitivePlayerProfile {
  elo: number; // e.g. starts at 100
  unlockedMarbleIds: string[]; // starts with ['elem-fire']
  selectedMarbleId: string;
  eggTokens: number; // currency to hatch eggs
  victories: number;
  losses: number;
  winStreak: number;
  bestElo: number;
  marbleLevels: Record<string, number>; // level 1-10 for upgrades from duplicates
  marbleDuplicates: Record<string, number>; // extra copies stored for fusion upgrades
  redeemedCodes?: string[]; // creator codes already redeemed
  incubatorEggs: IncubatorEggSlot[];
  username?: string; // Registered user account name
  accountCreatedAt?: number;
}

export interface BotOpponent {
  id: string;
  name: string;
  powerId: string;
  power?: MarblePower;
  botElo: number;
  elo?: number;
  difficultyLabel: string;
  avatarColor: string;
}
