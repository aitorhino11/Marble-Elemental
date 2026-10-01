import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Settings, 
  BookOpen, 
  Sparkles, 
  Flame, 
  ShieldAlert, 
  Zap, 
  Trophy, 
  Compass,
  Award,
  Swords,
  Egg
} from 'lucide-react';
import { SupportedLanguage, TRANSLATIONS } from '../i18n/translations';
import { soundManager } from '../utils/audioSystem';
import { competitiveManager, getRankForElo } from '../utils/competitiveManager';

interface MainMenuProps {
  onPlayClick: () => void;
  onCompetitiveClick: () => void;
  onSettingsClick: () => void;
  onGddClick: () => void;
  currentLang: SupportedLanguage;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onPlayClick,
  onCompetitiveClick,
  onSettingsClick,
  onGddClick,
  currentLang
}) => {
  const t = TRANSLATIONS[currentLang];
  const [profile, setProfile] = useState(() => competitiveManager.getProfile());

  useEffect(() => {
    return competitiveManager.subscribe(() => {
      setProfile(competitiveManager.getProfile());
    });
  }, []);

  const rank = getRankForElo(profile.elo);

  return (
    <div className="relative min-h-[82vh] flex flex-col items-center justify-center text-center p-6 overflow-hidden">
      {/* Dynamic Ambient Elemental Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none animate-pulse delay-700" />
      <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Badge */}
      <div className="relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/40 text-xs font-bold text-amber-300 shadow-xl mb-6">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
        <span>VIRAL MARBLE PHYSICS COMBAT</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
      </div>

      {/* Main Title */}
      <div className="relative z-10 space-y-2 max-w-3xl">
        <h1 className="text-5xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 tracking-tight leading-none drop-shadow-2xl">
          {t.gameTitle}
        </h1>
        <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-cyan-400 tracking-wider">
          {t.gameSubtitle}
        </div>
        <p className="text-sm sm:text-base text-slate-300/90 max-w-lg mx-auto pt-2 leading-relaxed font-medium">
          {t.tagline}
        </p>
      </div>

      {/* Central Action Buttons Cluster */}
      <div className="relative z-10 flex flex-col items-center gap-3.5 mt-8 w-full max-w-sm">
        {/* NEW: Giant MODO COMPETITIVO RANKED Button */}
        <button
          onClick={() => {
            soundManager.playHeavyImpact(1.1);
            soundManager.playPowerTrigger('lightning');
            onCompetitiveClick();
          }}
          className="group relative w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600 hover:from-rose-500 hover:to-amber-400 text-slate-950 font-black text-lg tracking-wider shadow-2xl shadow-rose-500/40 transform hover:scale-105 active:scale-95 transition-all duration-150 flex items-center justify-between border-2 border-amber-300/90 cursor-pointer"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="w-11 h-11 rounded-xl bg-slate-950/25 flex items-center justify-center shadow-inner">
              <Trophy className="w-6 h-6 text-slate-950 fill-amber-300" />
            </div>
            <div>
              <span className="block text-base sm:text-lg leading-tight text-slate-950">MODO COMPETITIVO</span>
              <span className="text-[11px] font-mono text-slate-900/80 font-bold">
                {profile.elo} ELO · {rank.tier} ({profile.unlockedMarbleIds.length}/20 Canicas)
              </span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-slate-950 text-amber-300 text-[10px] font-mono font-black shadow-md uppercase">
            RANKED
          </span>
        </button>

        {/* BATALLA LIBRE / PLAY Button */}
        <button
          onClick={() => {
            soundManager.playHeavyImpact(1.0);
            soundManager.playMarbleClick(1.5);
            onPlayClick();
          }}
          className="group relative w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-base tracking-wider shadow-xl shadow-amber-500/25 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-3 border border-amber-300/60 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
          <span>{t.play} (Batalla Libre Sandbox)</span>
        </button>

        {/* SETTINGS Button (Directly below) */}
        <button
          onClick={() => {
            soundManager.playMarbleClick(0.7);
            onSettingsClick();
          }}
          className="w-full py-2.5 px-6 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs tracking-wide border border-slate-700/80 hover:border-slate-600 shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Settings className="w-4 h-4 text-amber-400" />
          <span>{t.settings}</span>
        </button>

        {/* GDD Document Button */}
        <button
          onClick={() => {
            soundManager.playMarbleClick(0.6);
            onGddClick();
          }}
          className="w-full py-2 px-4 rounded-xl bg-slate-950/60 hover:bg-slate-900 text-slate-400 hover:text-slate-300 font-medium text-xs border border-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-purple-400" />
          <span>{t.gddView}</span>
        </button>
      </div>

      {/* Feature Badges Row */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-12 w-full max-w-3xl">
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-left space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
            <Flame className="w-4 h-4" />
            <span>20 Canicas</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Fuego, Hielo, Rayo, Nuke, Titán Chonk y 100 Toneladas.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-left space-y-1">
          <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold">
            <Compass className="w-4 h-4" />
            <span>6 Paisajes</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Magma, Cyber Grid, Glaciar, Galaxia, Coliseo y Pantano.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-left space-y-1">
          <div className="flex items-center gap-1.5 text-purple-400 text-xs font-bold">
            <Zap className="w-4 h-4" />
            <span>350 HP & Cooldown</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Física sin pausa, rebotes perpetuos y counters elementales.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 text-left space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
            <Trophy className="w-4 h-4" />
            <span>Trofeo Legendario</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Animación currada de victoria en podio y revancha instantánea.
          </p>
        </div>
      </div>
    </div>
  );
};
