import React, { useState } from 'react';
import { 
  X, 
  Globe, 
  Volume2, 
  VolumeX, 
  Zap, 
  HelpCircle, 
  ShieldCheck, 
  Smartphone,
  Check,
  Flame,
  Award
} from 'lucide-react';
import { 
  SupportedLanguage, 
  SUPPORTED_LANGUAGES, 
  TRANSLATIONS 
} from '../i18n/translations';
import { soundManager } from '../utils/audioSystem';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: SupportedLanguage;
  onSelectLang: (lang: SupportedLanguage) => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  gameSpeed: number;
  onSpeedChange: (speed: number) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  onSelectLang,
  volume,
  onVolumeChange,
  gameSpeed,
  onSpeedChange
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'tutorial'>('general');
  const t = TRANSLATIONS[currentLang];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {t.settings}
              </h2>
              <p className="text-xs text-slate-400">
                Marble Clash: Elemental Arena
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playMarbleClick(0.6);
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            aria-label={t.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: General vs Tutorial */}
        <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              soundManager.playMarbleClick(0.5);
              setActiveTab('general');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'general'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>{t.settings}</span>
          </button>
          <button
            onClick={() => {
              soundManager.playMarbleClick(0.5);
              setActiveTab('tutorial');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'tutorial'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>{t.howToPlay}</span>
          </button>
        </div>

        {activeTab === 'general' ? (
          <div className="space-y-6">
            {/* 10 Languages Grid */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-sky-400" />
                  {t.language} (Top 10 Worldwide)
                </span>
                <span className="text-[11px] font-mono text-amber-400">
                  {SUPPORTED_LANGUAGES.find(l => l.code === currentLang)?.nativeName}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isSelected = currentLang === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => {
                        soundManager.playMarbleClick(0.7);
                        onSelectLang(lang.code);
                      }}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-400 text-white font-bold shadow-md shadow-amber-500/10'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base">{lang.flag}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                      <div className="mt-1.5">
                        <div className="text-[11px] font-bold text-slate-200 truncate">
                          {lang.nativeName}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {lang.name}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Volume Control */}
            <div className="space-y-2.5 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  {volume > 0 ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
                  {t.volume}
                </span>
                <span className="font-mono text-amber-400 font-bold">
                  {Math.round(volume * 100)}%
                </span>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => {
                    const newVol = parseFloat(e.target.value);
                    onVolumeChange(newVol);
                    soundManager.volume = newVol;
                    soundManager.playMarbleClick(0.8);
                  }}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Battle Speed Control */}
            <div className="space-y-2.5 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  {t.gameSpeed}
                </span>
                <span className="font-mono text-amber-400 font-bold">
                  {gameSpeed}x
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { speed: 0.75, label: '0.75x Lenta' },
                  { speed: 1.0, label: '1.0x Normal' },
                  { speed: 1.5, label: '1.5x Rápida' },
                  { speed: 2.0, label: '2.0x Caos' }
                ].map((item) => {
                  const isSelected = gameSpeed === item.speed;
                  return (
                    <button
                      key={item.speed}
                      onClick={() => {
                        soundManager.playMarbleClick(0.6);
                        onSpeedChange(item.speed);
                      }}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* How to Play / Tutorial Tab */
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" />
                {t.howToPlay1Title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.howToPlay1Desc}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {t.howToPlay2Title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.howToPlay2Desc}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <h3 className="text-sm font-bold text-sky-400 flex items-center gap-2">
                <Zap className="w-4 h-4 text-sky-400" />
                {t.howToPlay3Title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.howToPlay3Desc}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <h3 className="text-sm font-bold text-purple-400 flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                {t.howToPlay4Title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.howToPlay4Desc}
              </p>
            </div>
          </div>
        )}

        {/* Footer CTA */}
        <div className="pt-2">
          <button
            onClick={() => {
              soundManager.playMarbleClick(0.6);
              onClose();
            }}
            className="w-full py-3 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
