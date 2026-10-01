import { RarityTier } from './game';

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
  incubatorEggs: IncubatorEggSlot[];
}

export interface BotOpponent {
  id: string;
  name: string;
  powerId: string;
  botElo: number;
  difficultyLabel: string;
  avatarColor: string;
}
