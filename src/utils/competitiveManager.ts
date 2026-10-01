import { CompetitivePlayerProfile, RankInfo, RankTier, BotOpponent, IncubatorEggSlot } from '../types/competitive';
import { MARBLE_POWERS } from '../data/powersData';
import { MarblePower, RarityTier } from '../types/game';

const STORAGE_KEY = 'marble_clash_competitive_profile_v1';

export const RANK_TIERS: RankInfo[] = [
  { tier: 'Bronce', minElo: 0, maxElo: 499, colorHex: '#cd7f32', badgeIcon: 'Shield', division: 'I - III' },
  { tier: 'Plata', minElo: 500, maxElo: 999, colorHex: '#94a3b8', badgeIcon: 'ShieldAlert', division: 'I - III' },
  { tier: 'Oro', minElo: 1000, maxElo: 1499, colorHex: '#eab308', badgeIcon: 'Award', division: 'I - III' },
  { tier: 'Platino', minElo: 1500, maxElo: 1999, colorHex: '#06b6d4', badgeIcon: 'Zap', division: 'I - III' },
  { tier: 'Diamante', minElo: 2000, maxElo: 2499, colorHex: '#38bdf8', badgeIcon: 'Sparkles', division: 'I - III' },
  { tier: 'Maestro', minElo: 2500, maxElo: 2999, colorHex: '#a855f7', badgeIcon: 'Flame', division: 'Élite' },
  { tier: 'Gran Maestro', minElo: 3000, maxElo: 9999, colorHex: '#f43f5e', badgeIcon: 'Trophy', division: 'Leyenda' }
];

export function getRankForElo(elo: number): RankInfo {
  for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
    if (elo >= RANK_TIERS[i].minElo) {
      return RANK_TIERS[i];
    }
  }
  return RANK_TIERS[0];
}

const DEFAULT_PROFILE: CompetitivePlayerProfile = {
  elo: 120, // Initial ELO in Bronze
  unlockedMarbleIds: ['elem-fire'], // Starts with ONLY 1 marble!
  selectedMarbleId: 'elem-fire',
  eggTokens: 40, // starter egg tokens
  victories: 0,
  losses: 0,
  winStreak: 0,
  bestElo: 120,
  marbleLevels: { 'elem-fire': 1 },
  marbleDuplicates: {},
  redeemedCodes: [],
  incubatorEggs: [
    {
      id: 'egg-starter-1',
      rarity: 'Common',
      name: 'Huevo Elemental Común',
      costTokens: 80,
      unlockedAt: Date.now(),
      isHatched: false
    }
  ]
};

export class CompetitiveManager {
  private static instance: CompetitiveManager;
  private profile: CompetitivePlayerProfile;
  private listeners: (() => void)[] = [];

  private constructor() {
    this.profile = this.loadProfile();
  }

  public static getInstance(): CompetitiveManager {
    if (!CompetitiveManager.instance) {
      CompetitiveManager.instance = new CompetitiveManager();
    }
    return CompetitiveManager.instance;
  }

  private loadProfile(): CompetitivePlayerProfile {
    if (typeof window === 'undefined') return { ...DEFAULT_PROFILE };
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        // Ensure at least 1 marble is unlocked
        if (!parsed.unlockedMarbleIds || parsed.unlockedMarbleIds.length === 0) {
          parsed.unlockedMarbleIds = ['elem-fire'];
        }
        if (!parsed.marbleDuplicates) {
          parsed.marbleDuplicates = {};
        }
        if (!parsed.marbleLevels) {
          parsed.marbleLevels = { 'elem-fire': 1 };
        }
        if (!parsed.redeemedCodes) {
          parsed.redeemedCodes = [];
        }
        return { ...DEFAULT_PROFILE, ...parsed };
      }
    } catch (e) {
      console.error('Failed to load competitive profile from localStorage', e);
    }
    return { ...DEFAULT_PROFILE };
  }

  public saveProfile() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profile));
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to save competitive profile', e);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(cb => cb());
  }

  public getProfile(): CompetitivePlayerProfile {
    return { ...this.profile };
  }

  public setSelectedMarble(powerId: string) {
    if (this.profile.unlockedMarbleIds.includes(powerId)) {
      this.profile.selectedMarbleId = powerId;
      this.saveProfile();
    }
  }

  /**
   * Process Competitive Victory:
   * Rewards between 30 and 60 ELO (plus streak bonus),
   * Egg tokens to unlock eggs, and chance of dropping an egg into incubator.
   */
  public recordVictory(): { eloGained: number; tokensGained: number; droppedEgg: IncubatorEggSlot | null } {
    // 30 to 60 ELO gain per victory as requested!
    const baseElo = Math.floor(30 + Math.random() * 31); // 30..60
    const streakBonus = this.profile.winStreak >= 2 ? Math.min(15, this.profile.winStreak * 3) : 0;
    const eloGained = baseElo + streakBonus;

    // Tokens gained
    const tokensGained = Math.floor(40 + Math.random() * 25); // 40..64 tokens

    this.profile.elo += eloGained;
    if (this.profile.elo > this.profile.bestElo) {
      this.profile.bestElo = this.profile.elo;
    }
    this.profile.victories += 1;
    this.profile.winStreak += 1;
    this.profile.eggTokens += tokensGained;

    // Chance to drop an Incubator Egg if slots < 4
    let droppedEgg: IncubatorEggSlot | null = null;
    if (this.profile.incubatorEggs.filter(e => !e.isHatched).length < 4) {
      const rank = getRankForElo(this.profile.elo);
      const rand = Math.random() * 100;
      let rarity: RarityTier = 'Common';
      let cost = 80;

      if (rank.tier === 'Maestro' || rank.tier === 'Gran Maestro') {
        if (rand < 25) { rarity = 'Legendary'; cost = 400; }
        else if (rand < 60) { rarity = 'Epic'; cost = 250; }
        else { rarity = 'Rare'; cost = 150; }
      } else if (rank.tier === 'Oro' || rank.tier === 'Platino' || rank.tier === 'Diamante') {
        if (rand < 12) { rarity = 'Legendary'; cost = 400; }
        else if (rand < 45) { rarity = 'Epic'; cost = 250; }
        else if (rand < 80) { rarity = 'Rare'; cost = 150; }
        else { rarity = 'Common'; cost = 80; }
      } else {
        if (rand < 5) { rarity = 'Epic'; cost = 250; }
        else if (rand < 30) { rarity = 'Rare'; cost = 150; }
        else { rarity = 'Common'; cost = 80; }
      }

      droppedEgg = {
        id: `egg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        rarity,
        name: `Huevo ${rarity === 'Legendary' ? 'Legendario Astral' : rarity === 'Epic' ? 'Épico Elemental' : rarity === 'Rare' ? 'Raro de Batalla' : 'Común de Arena'}`,
        costTokens: cost,
        unlockedAt: Date.now(),
        isHatched: false
      };
      this.profile.incubatorEggs.push(droppedEgg);
    }

    this.saveProfile();
    return { eloGained, tokensGained, droppedEgg };
  }

  /**
   * Process Competitive Defeat:
   * Loses 10 to 18 ELO (protected above 0 and cushioned in low ranks),
   * resets streak, still gives 12 pity tokens.
   */
  public recordDefeat(): { eloLost: number; tokensGained: number } {
    let eloLost = Math.floor(10 + Math.random() * 9); // 10..18
    if (this.profile.elo < 200) {
      eloLost = Math.min(5, Math.floor(this.profile.elo * 0.05)); // low rank shield
    }
    this.profile.elo = Math.max(0, this.profile.elo - eloLost);
    this.profile.losses += 1;
    this.profile.winStreak = 0;

    const tokensGained = 12; // Pity tokens so player stays motivated
    this.profile.eggTokens += tokensGained;

    this.saveProfile();
    return { eloLost, tokensGained };
  }

  /**
   * Process Competitive Surrender / Exit:
   * Deducts exactly 30 ELO as requested when player abandons a ranked battle.
   */
  public recordSurrender(penalty: number = 30): { eloLost: number } {
    const eloLost = Math.min(this.profile.elo, penalty);
    this.profile.elo = Math.max(0, this.profile.elo - penalty);
    this.profile.losses += 1;
    this.profile.winStreak = 0;
    this.saveProfile();
    return { eloLost: penalty };
  }

  /**
   * Hatch an egg from the Incubator:
   * Spends the egg tokens and unlocks a marble from the locked roster!
   * Respects exact drop rates and boosts chances based on egg rarity.
   */
  public hatchEgg(eggId: string): { 
    power: MarblePower; 
    isNewUnlock: boolean; 
    isDuplicate: boolean; 
    currentDuplicates: number; 
    newLevel: number; 
    eggRarity: RarityTier 
  } | null {
    const eggIndex = this.profile.incubatorEggs.findIndex(e => e.id === eggId && !e.isHatched);
    if (eggIndex === -1) return null;

    const egg = this.profile.incubatorEggs[eggIndex];
    if (this.profile.eggTokens < egg.costTokens) return null;

    // Deduct cost tokens
    this.profile.eggTokens -= egg.costTokens;
    this.profile.incubatorEggs.splice(eggIndex, 1);

    // Candidates include all 20 powers, allowing duplicates for the Fusion evolution system!
    const candidatePool = MARBLE_POWERS;

    // Multiplier per rarity based on egg tier
    const getEggRarityMultiplier = (pRarity: RarityTier, eggRarity: RarityTier): number => {
      if (eggRarity === 'Legendary') {
        if (pRarity === 'Legendary') return 40.0;
        if (pRarity === 'Epic') return 12.0;
        if (pRarity === 'Rare') return 3.0;
        return 1.0;
      }
      if (eggRarity === 'Epic') {
        if (pRarity === 'Legendary') return 4.0;
        if (pRarity === 'Epic') return 20.0;
        if (pRarity === 'Rare') return 4.0;
        return 1.0;
      }
      if (eggRarity === 'Rare') {
        if (pRarity === 'Legendary') return 2.0;
        if (pRarity === 'Epic') return 4.0;
        if (pRarity === 'Rare') return 12.0;
        return 2.0;
      }
      // Common egg: default baseline rates
      return 1.0;
    };

    // Weighted Probability Drop Roll based on each power's dropRatePercent * egg multiplier
    const weights = candidatePool.map(p => {
      const baseDrop = p.dropRatePercent || 5.0;
      const mult = getEggRarityMultiplier(p.rarity, egg.rarity);
      return baseDrop * mult;
    });

    const totalWeight = weights.reduce((acc, w) => acc + w, 0);
    let randWeight = Math.random() * totalWeight;
    let chosenPower: MarblePower = candidatePool[0];

    for (let i = 0; i < candidatePool.length; i++) {
      randWeight -= weights[i];
      if (randWeight <= 0) {
        chosenPower = candidatePool[i];
        break;
      }
    }

    let isNewUnlock = false;
    let isDuplicate = false;

    if (!this.profile.unlockedMarbleIds.includes(chosenPower.id)) {
      // First time unlocking this marble
      this.profile.unlockedMarbleIds.push(chosenPower.id);
      this.profile.marbleLevels[chosenPower.id] = 1;
      this.profile.marbleDuplicates[chosenPower.id] = 0;
      isNewUnlock = true;
      isDuplicate = false;
    } else {
      // Duplicate marble obtained! Added as a fusion copy to level it up in the Fusion tab
      this.profile.marbleDuplicates[chosenPower.id] = (this.profile.marbleDuplicates[chosenPower.id] || 0) + 1;
      isNewUnlock = false;
      isDuplicate = true;
    }

    const currentLevel = this.profile.marbleLevels[chosenPower.id] || 1;
    const currentDuplicates = this.profile.marbleDuplicates[chosenPower.id] || 0;
    this.saveProfile();
    return { 
      power: chosenPower, 
      isNewUnlock, 
      isDuplicate, 
      currentDuplicates,
      newLevel: currentLevel, 
      eggRarity: egg.rarity 
    };
  }

  /**
   * Fuse a marble with a duplicate copy to elevate its level by 1!
   */
  public fuseMarble(powerId: string): { success: boolean; newLevel: number; error?: string } {
    const availableCopies = this.profile.marbleDuplicates[powerId] || 0;
    if (availableCopies < 1) {
      return { 
        success: false, 
        newLevel: this.profile.marbleLevels[powerId] || 1, 
        error: 'No tienes copias repetidas de esta canica para fusionar.' 
      };
    }

    // Deduct 1 duplicate copy
    this.profile.marbleDuplicates[powerId] = availableCopies - 1;

    // Increment level by 1
    const currentLvl = this.profile.marbleLevels[powerId] || 1;
    const newLvl = currentLvl + 1;
    this.profile.marbleLevels[powerId] = newLvl;

    this.saveProfile();
    return { success: true, newLevel: newLvl };
  }

  /**
   * Creator Code Redemption:
   * Supports "aitorhino" (+160 Fragmentos / Tokens)
   */
  public redeemCreatorCode(rawCode: string): { success: boolean; rewardTokens: number; message: string } {
    const cleanCode = rawCode.trim().toLowerCase();
    if (!cleanCode) {
      return { success: false, rewardTokens: 0, message: 'Introduce un código de creador válido.' };
    }

    if (!this.profile.redeemedCodes) {
      this.profile.redeemedCodes = [];
    }

    if (this.profile.redeemedCodes.includes(cleanCode)) {
      return { 
        success: false, 
        rewardTokens: 0, 
        message: '¡Este código de creador ya ha sido canjeado anteriormente!' 
      };
    }

    if (cleanCode === 'aitorhino') {
      const rewardTokens = 160;
      this.profile.eggTokens += rewardTokens;
      this.profile.redeemedCodes.push(cleanCode);
      this.saveProfile();
      return { 
        success: true, 
        rewardTokens, 
        message: '¡Código AITORHINO canjeado con éxito! Has recibido +160 Fragmentos.' 
      };
    }

    return { 
      success: false, 
      rewardTokens: 0, 
      message: 'Código de creador desconocido. ¡Prueba a introducir "aitorhino"!' 
    };
  }

  /**
   * Generate balanced Bot Opponent for Competitive Match
   */
  public generateBotOpponent(): BotOpponent {
    const playerElo = this.profile.elo;
    const eloOffset = Math.floor((Math.random() - 0.45) * 60); // -27 to +33
    const botElo = Math.max(50, playerElo + eloOffset);

    const botNames = [
      'Cyber-Gladiator',
      'Vortex-Striker',
      'Titan-Crusher',
      'Plasma-Phantom',
      'Nova-Rival',
      'Shadow-Drifter',
      'Blaze-Master',
      'Apex-Champion',
      'Mecha-Slayer',
      'Quantum-Bot'
    ];

    const randomName = `${botNames[Math.floor(Math.random() * botNames.length)]} #${Math.floor(100 + Math.random() * 899)}`;
    // Bot can use any of the 20 powers suited to the tier
    const randomPower = MARBLE_POWERS[Math.floor(Math.random() * MARBLE_POWERS.length)];

    return {
      id: `bot-${Date.now()}`,
      name: randomName,
      powerId: randomPower.id,
      botElo,
      difficultyLabel: botElo > 2000 ? 'Élite' : botElo > 1200 ? 'Avanzado' : 'Desafiante',
      avatarColor: randomPower.colorHex
    };
  }

  /**
   * Reset competitive data for testing or fresh start
   */
  public resetToDefault() {
    this.profile = { ...DEFAULT_PROFILE, unlockedMarbleIds: ['elem-fire'], selectedMarbleId: 'elem-fire' };
    this.saveProfile();
  }
}

export const competitiveManager = CompetitiveManager.getInstance();
