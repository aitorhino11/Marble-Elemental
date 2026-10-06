import React, { useState, useEffect } from 'react';
import { MainMenu } from './components/MainMenu';
import { MarbleSelectionMenu } from './components/MarbleSelectionMenu';
import { CompetitiveSelectionMenu } from './components/CompetitiveSelectionMenu';
import { BattleArenaCanvas } from './components/BattleArenaCanvas';
import { VictoryScreen } from './components/VictoryScreen';
import { SettingsModal } from './components/SettingsModal';
import { FullscreenButton } from './components/FullscreenButton';
import { GddDocumentView } from './components/GddDocumentView';
import { PowersMatrixView } from './components/PowersMatrixView';
import { GachaHatchingToy } from './components/GachaHatchingToy';
import { ProgressionCalculator } from './components/ProgressionCalculator';
import { ArenaEditorPreview } from './components/ArenaEditorPreview';
import { FusionMenuView } from './components/FusionMenuView';
import { CreatorCodeModal } from './components/CreatorCodeModal';
import { TikTokClipperModal } from './components/TikTokClipperModal';
import { SurrenderConfirmModal } from './components/SurrenderConfirmModal';
import { CompetitiveVsScreen } from './components/CompetitiveVsScreen';
import { ShopComingSoonView } from './components/ShopComingSoonView';
import { UserAccountModal } from './components/UserAccountModal';
import { SupportedLanguage, TRANSLATIONS } from './i18n/translations';
import { BattleMatchConfig, MarbleEntity, MarblePower } from './types/game';
import { BotOpponent, IncubatorEggSlot } from './types/competitive';
import { competitiveManager, getRankForElo } from './utils/competitiveManager';
import { MARBLE_POWERS } from './data/powersData';
import { soundManager } from './utils/audioSystem';
import { 
  Home, 
  Settings, 
  BookOpen, 
  Flame, 
  Sparkles, 
  Gauge, 
  Compass, 
  Smartphone,
  Zap,
  Volume2,
  VolumeX,
  Trophy,
  Swords,
  Egg,
  Lock,
  AlertTriangle,
  ArrowLeft,
  Layers,
  Gift,
  ShoppingBag,
  UserPlus
} from 'lucide-react';

type GameScreen = 'menu' | 'selection' | 'competitive' | 'battle' | 'gdd' | 'powers' | 'gacha' | 'fusion' | 'progression' | 'editor' | 'shop';

export default function App() {
  // Screen state
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('menu');

  // Account modal state
  const [isAccountModalOpen, setIsAccountModalOpen] = useState<boolean>(false);

  // Competitive Mode State
  const [isCompetitiveMatch, setIsCompetitiveMatch] = useState<boolean>(false);
  const [playerFighterId, setPlayerFighterId] = useState<string | null>(null);
  const [competitiveResult, setCompetitiveResult] = useState<{
    isVictory: boolean;
    eloDiff: number;
    tokens: number;
    egg: IncubatorEggSlot | null;
  } | null>(null);

  // Settings state
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('es');
  const [volume, setVolume] = useState<number>(0.8);
  const [gameSpeed, setGameSpeed] = useState<number>(1.0);

  // Profile telemetry
  const [profile, setProfile] = useState(() => competitiveManager.getProfile());

  useEffect(() => {
    return competitiveManager.subscribe(() => {
      setProfile(competitiveManager.getProfile());
    });
  }, []);

  const rank = getRankForElo(profile.elo);

  // Battle configuration & Victory state
  const [battleConfig, setBattleConfig] = useState<BattleMatchConfig>({
    fighters: [MARBLE_POWERS[0], MARBLE_POWERS[1], MARBLE_POWERS[2], MARBLE_POWERS[6]],
    mapThemeId: 'magma',
    mapSizePercent: 200,
    marbleSizePercent: 200,
    gameSpeed: 1.0
  });

  const [winnerMarble, setWinnerMarble] = useState<MarbleEntity | null>(null);

  // TikTok Clipper state
  const [isClipperOpen, setIsClipperOpen] = useState<boolean>(false);

  // Creator Code state
  const [isCreatorCodeOpen, setIsCreatorCodeOpen] = useState<boolean>(false);

  // 5-second cinematic VS intro screen for competitive matches
  const [competitiveVsData, setCompetitiveVsData] = useState<{
    playerPower: MarblePower;
    botOpponent: BotOpponent;
  } | null>(null);

  const readyToFuseCount = profile.unlockedMarbleIds.filter(
    (id) => (profile.marbleDuplicates?.[id] || 0) >= 1
  ).length;

  const t = TRANSLATIONS[currentLang];

  // Start free custom sandbox match
  const handleStartBattle = (config: BattleMatchConfig) => {
    setIsCompetitiveMatch(false);
    setPlayerFighterId(null);
    setCompetitiveResult(null);
    setCompetitiveVsData(null);
    setBattleConfig({
      ...config,
      gameSpeed
    });
    setWinnerMarble(null);
    setCurrentScreen('battle');
  };

  // Start Ranked Competitive Match (Player vs Bots)
  const handleStartCompetitiveBattle = (playerPower: MarblePower, botOpponents: BotOpponent[]) => {
    setIsCompetitiveMatch(true);
    setPlayerFighterId(playerPower.id);
    setCompetitiveResult(null);

    const botPowers = botOpponents.map(b => MARBLE_POWERS.find(p => p.id === b.powerId) || MARBLE_POWERS[1]);
    const fighters = [playerPower, ...botPowers];

    const randomMaps = ['magma', 'cyber', 'frozen', 'cosmic', 'golden', 'toxic'];
    const randomMap = randomMaps[Math.floor(Math.random() * randomMaps.length)];

    setBattleConfig({
      fighters,
      mapThemeId: randomMap,
      mapSizePercent: 100, // 100% de tamaño de mapa
      marbleSizePercent: 170, // 170% en competitivo (15% más pequeñas que 200%)
      gameSpeed
    });
    setWinnerMarble(null);
    setCompetitiveVsData({ playerPower, botOpponent: botOpponents[0] });
    setCurrentScreen('battle');
  };

  const handleVictory = (winner: MarbleEntity) => {
    if (isCompetitiveMatch && playerFighterId) {
      const isPlayerWin = winner.id.includes(playerFighterId);
      if (isPlayerWin) {
        // Victoria: 30 a 60 ELO
        const { eloGained, tokensGained, droppedEgg } = competitiveManager.recordVictory();
        setCompetitiveResult({
          isVictory: true,
          eloDiff: eloGained,
          tokens: tokensGained,
          egg: droppedEgg
        });
      } else {
        // Derrota: -10 a -15 ELO
        const { eloLost, tokensGained } = competitiveManager.recordDefeat();
        setCompetitiveResult({
          isVictory: false,
          eloDiff: -eloLost,
          tokens: tokensGained,
          egg: null
        });
      }
    }
    setWinnerMarble(winner);
  };

  const handleRematch = () => {
    setWinnerMarble(null);
    setCompetitiveResult(null);
    if (isCompetitiveMatch) {
      // Launch another competitive ranked round with fresh bot rival!
      const playerPower = MARBLE_POWERS.find(p => p.id === (playerFighterId || profile.selectedMarbleId)) || MARBLE_POWERS[0];
      const bot = competitiveManager.generateBotOpponent();
      handleStartCompetitiveBattle(playerPower, [bot]);
    } else {
      setCurrentScreen('battle');
    }
  };

  const handleBackToCompetitive = () => {
    soundManager.playMarbleClick(0.6);
    setWinnerMarble(null);
    setCompetitiveResult(null);
    setIsCompetitiveMatch(false);
    setCurrentScreen('competitive');
  };

  // Surrender / Exit confirmation state for competitive battles
  const [isSurrenderModalOpen, setIsSurrenderModalOpen] = useState<boolean>(false);
  const [pendingExitTarget, setPendingExitTarget] = useState<GameScreen | null>(null);
  const [surrenderNoticeToast, setSurrenderNoticeToast] = useState<string | null>(null);

  const handleRequestSurrender = (targetScreen: GameScreen = 'competitive') => {
    soundManager.playMarbleClick(0.6);
    setPendingExitTarget(targetScreen);
    setIsSurrenderModalOpen(true);
  };

  const handleConfirmSurrender = () => {
    const { eloLost } = competitiveManager.recordSurrender(30);
    soundManager.playKnockoutHit();
    setIsSurrenderModalOpen(false);
    setIsCompetitiveMatch(false);
    setWinnerMarble(null);
    setCompetitiveResult(null);

    setSurrenderNoticeToast(`Te has retirado de la partida: -${eloLost} ELO`);
    setTimeout(() => setSurrenderNoticeToast(null), 3500);

    setCurrentScreen(pendingExitTarget || 'competitive');
    setPendingExitTarget(null);
  };

  const handleCancelSurrender = () => {
    soundManager.playMarbleClick(0.5);
    setIsSurrenderModalOpen(false);
    setPendingExitTarget(null);
  };

  // Warn on browser close or refresh during competitive battle
  useEffect(() => {
    if (isCompetitiveMatch && currentScreen === 'battle' && !winnerMarble) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '¿Seguro que quieres salir? Perderás 30 de ELO.';
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [isCompetitiveMatch, currentScreen, winnerMarble]);

  const handleBackToMenu = () => {
    if (currentScreen === 'battle' && isCompetitiveMatch && !winnerMarble) {
      handleRequestSurrender('menu');
      return;
    }
    setWinnerMarble(null);
    setCurrentScreen('menu');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-200 relative overflow-x-hidden">
      {/* Toast Notice */}
      {surrenderNoticeToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-rose-950 border border-rose-600 text-rose-200 text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>{surrenderNoticeToast}</span>
        </div>
      )}

      {/* Top Header Bar with Navigation, Language, Fullscreen & Settings */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Brand Wordmark (Zone 1) */}
          <button
            onClick={() => {
              if (currentScreen === 'battle' && isCompetitiveMatch && !winnerMarble) {
                handleRequestSurrender('menu');
                return;
              }
              soundManager.playMarbleClick(0.5);
              handleBackToMenu();
            }}
            className="flex items-center gap-2 text-left group focus:outline-none cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-md shadow-amber-500/20">
              <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
            </div>
            <div>
              <span className="text-sm sm:text-base font-black tracking-tight text-white group-hover:text-amber-300 transition-colors">
                {t.gameTitle}
              </span>
              <span className="hidden sm:inline-block text-[11px] font-mono text-amber-400/80 ml-2">
                {t.gameSubtitle}
              </span>
            </div>
          </button>

          {/* Quick Nav Links (Zone 2) - When in competitive battle, shows quick surrender button */}
          {currentScreen === 'battle' && isCompetitiveMatch && !winnerMarble ? (
            <button
              onClick={() => handleRequestSurrender('competitive')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-rose-950/80 hover:bg-rose-900 border border-rose-700 text-rose-300 text-xs font-mono font-bold shadow-md transition-all hover:scale-105 cursor-pointer"
              title="Abandonar partida competitiva (-30 ELO)"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>Rendirse (-30 ELO)</span>
            </button>
          ) : (
            <nav className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <button
                onClick={() => {
                  soundManager.playMarbleClick(0.5);
                  setCurrentScreen('menu');
                }}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  currentScreen === 'menu' ? 'bg-amber-500/10 text-amber-300 font-bold' : 'hover:text-white'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Inicio</span>
              </button>

              {/* NEW: Ranked Competitive Tab */}
              <button
                onClick={() => {
                  soundManager.playMarbleClick(0.5);
                  setCurrentScreen('competitive');
                }}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  currentScreen === 'competitive' ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30' : 'hover:text-white'
                }`}
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Ranked ({profile.elo})</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playMarbleClick(0.5);
                  setCurrentScreen('selection');
                }}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  currentScreen === 'selection' || (currentScreen === 'battle' && !isCompetitiveMatch) ? 'bg-amber-500/10 text-amber-300 font-bold' : 'hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Sandbox</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playMarbleClick(0.5);
                  setCurrentScreen('powers');
                }}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  currentScreen === 'powers' ? 'bg-amber-500/10 text-amber-300 font-bold' : 'hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>20 Poderes</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playMarbleClick(0.5);
                  setCurrentScreen('gacha');
                }}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  currentScreen === 'gacha' ? 'bg-amber-500/10 text-amber-300 font-bold' : 'hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Gacha</span>
              </button>

              {/* Fusión Evolution Tab */}
              <button
                onClick={() => {
                  soundManager.playMarbleClick(0.5);
                  setCurrentScreen('fusion');
                }}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 relative ${
                  currentScreen === 'fusion'
                    ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40'
                    : 'hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>Fusión</span>
                {readyToFuseCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>

              {/* Tienda (Accesorios Próximamente) */}
              <button
                onClick={() => {
                  soundManager.playMarbleClick(0.5);
                  setCurrentScreen('shop');
                }}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  currentScreen === 'shop'
                    ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/40'
                    : 'hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-rose-400" />
                <span>Tienda</span>
                <span className="text-[9px] px-1 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                  Próx.
                </span>
              </button>

              <button
                onClick={() => {
                  soundManager.playMarbleClick(0.5);
                  setCurrentScreen('gdd');
                }}
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                  currentScreen === 'gdd' ? 'bg-amber-500/10 text-amber-300 font-bold' : 'hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>GDD</span>
              </button>
            </nav>
          )}

          {/* Action Zone: Fullscreen, Settings & Audio (Zone 3) */}
          <div className="flex items-center gap-2">
            {/* Fullscreen Button */}
            <FullscreenButton
              labelFullscreen={t.fullscreen}
              labelExit={t.exitFullscreen}
            />

            {/* Settings Button */}
            <button
              onClick={() => {
                soundManager.playMarbleClick(0.6);
                setIsSettingsOpen(true);
              }}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 shadow-lg transition-all flex items-center gap-1.5 text-xs font-semibold focus:outline-none"
              title={t.settings}
            >
              <Settings className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">{t.settings}</span>
            </button>

            {/* Quick Play CTA when on other screens */}
            {currentScreen !== 'selection' && currentScreen !== 'battle' && currentScreen !== 'competitive' && (
              <button
                onClick={() => {
                  soundManager.playHeavyImpact(0.8);
                  setCurrentScreen('selection');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>{t.play}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Game Screen Routing */}
      <main className="flex-1 p-3 sm:p-6 lg:p-8 flex flex-col justify-center">
        {currentScreen === 'menu' && (
          <MainMenu
            onPlayClick={() => setCurrentScreen('selection')}
            onCompetitiveClick={() => setCurrentScreen('competitive')}
            onSettingsClick={() => setIsSettingsOpen(true)}
            onGddClick={() => setCurrentScreen('gdd')}
            currentLang={currentLang}
          />
        )}

        {currentScreen === 'competitive' && (
          <CompetitiveSelectionMenu
            onStartCompetitiveBattle={handleStartCompetitiveBattle}
            onGoToIncubator={() => setCurrentScreen('gacha')}
            onBackToMenu={handleBackToMenu}
            currentLang={currentLang}
          />
        )}

        {currentScreen === 'selection' && (
          <MarbleSelectionMenu
            onStartBattle={handleStartBattle}
            onBackToMenu={handleBackToMenu}
            currentLang={currentLang}
            initialSpeed={gameSpeed}
          />
        )}

        {currentScreen === 'battle' && (
          <>
            <BattleArenaCanvas
              config={battleConfig}
              onVictory={handleVictory}
              onBackToMenu={handleBackToMenu}
              onRequestSurrender={() => handleRequestSurrender('competitive')}
              currentLang={currentLang}
              isCompetitive={isCompetitiveMatch}
              playerFighterId={playerFighterId}
              isPresentationActive={Boolean(competitiveVsData)}
            />
            {competitiveVsData && (
              <CompetitiveVsScreen
                playerPower={competitiveVsData.playerPower}
                botOpponent={competitiveVsData.botOpponent}
                onComplete={() => {
                  soundManager.playBattleStartTrumpetFanfare();
                  setCompetitiveVsData(null);
                }}
              />
            )}
          </>
        )}

        {currentScreen === 'shop' && (
          <ShopComingSoonView
            onGoToBattle={() => setCurrentScreen('selection')}
            onGoToGacha={() => setCurrentScreen('gacha')}
            currentLang={currentLang}
          />
        )}

        {currentScreen === 'gdd' && (
          <GddDocumentView
            onSwitchToSandbox={() => setCurrentScreen('selection')}
            onSwitchToGacha={() => setCurrentScreen('gacha')}
            onSwitchToPowers={() => setCurrentScreen('powers')}
          />
        )}

        {currentScreen === 'powers' && (
          <PowersMatrixView
            onSelectForArena={() => setCurrentScreen('selection')}
            currentLang={currentLang}
          />
        )}

        {currentScreen === 'gacha' && (
          <GachaHatchingToy 
            onGoToCompetitive={() => setCurrentScreen('competitive')}
            onGoToFusion={() => setCurrentScreen('fusion')}
            currentLang={currentLang}
          />
        )}

        {currentScreen === 'fusion' && (
          <FusionMenuView
            onGoToIncubator={() => setCurrentScreen('gacha')}
            currentLang={currentLang}
          />
        )}

        {currentScreen === 'progression' && <ProgressionCalculator />}

        {currentScreen === 'editor' && <ArenaEditorPreview />}
      </main>

      {/* Creator Code Button in bottom-left corner */}
      <div className="fixed bottom-4 left-4 z-40">
        <button
          onClick={() => {
            soundManager.playMarbleClick(0.6);
            setIsCreatorCodeOpen(true);
          }}
          className="px-3.5 py-2 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-amber-500/50 hover:border-amber-400 text-amber-300 font-bold text-xs shadow-xl shadow-amber-500/10 flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
          title="Canjear Código de Creador"
        >
          <Gift className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="hidden sm:inline">Código de Creador</span>
          <span className="sm:hidden">Código</span>
        </button>
      </div>

      {/* Bottom Right Floating Account Trigger ("Crear cuenta o iniciar sesión") */}
      {currentScreen !== 'battle' && (
        <div className="fixed bottom-4 right-4 z-40">
          <button
            onClick={() => {
              soundManager.playMarbleClick(0.5);
              setIsAccountModalOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/95 hover:bg-slate-800 text-white border border-amber-500/40 shadow-2xl shadow-slate-950/90 hover:border-amber-400 hover:scale-105 transition-all text-xs font-bold cursor-pointer group backdrop-blur-md"
            title="Crear cuenta o iniciar sesión para guardar y recuperar tu progreso"
          >
            {profile.username ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-amber-300 font-mono">@{profile.username}</span>
                <span className="text-[10px] text-slate-400 hidden sm:inline font-mono">(Guardada)</span>
              </>
            ) : (
              <>
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                  <UserPlus className="w-3.5 h-3.5" />
                </div>
                <span>Crear cuenta o iniciar sesión</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* User Account Modal */}
      <UserAccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />

      {/* Creator Code Modal */}
      <CreatorCodeModal
        isOpen={isCreatorCodeOpen}
        onClose={() => setIsCreatorCodeOpen(false)}
      />

      {/* Victory Screen Modal (Appears when only 1 marble survives!) */}
      {winnerMarble && (
        <VictoryScreen
          winner={winnerMarble}
          playerMarblePower={MARBLE_POWERS.find(p => p.id === playerFighterId) || null}
          onRematch={handleRematch}
          onBackToMenu={handleBackToMenu}
          onBackToCompetitive={handleBackToCompetitive}
          currentLang={currentLang}
          isCompetitive={isCompetitiveMatch}
          competitiveResult={competitiveResult}
          onGoToIncubator={() => {
            setWinnerMarble(null);
            setCurrentScreen('gacha');
          }}
        />
      )}

      {/* Surrender Warning Modal (Warns player they will lose 30 ELO if they exit) */}
      <SurrenderConfirmModal
        isOpen={isSurrenderModalOpen}
        currentElo={profile.elo}
        penaltyElo={30}
        onCancel={handleCancelSurrender}
        onConfirmSurrender={handleConfirmSurrender}
      />

      {/* Settings Modal (10 Languages, Volume, Combat Speed, How to Play) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentLang={currentLang}
        onSelectLang={(lang) => setCurrentLang(lang)}
        volume={volume}
        onVolumeChange={(vol) => setVolume(vol)}
        gameSpeed={gameSpeed}
        onSpeedChange={(speed) => setGameSpeed(speed)}
      />

      {/* TikTok Clipper Modal */}
      <TikTokClipperModal
        isOpen={isClipperOpen}
        onClose={() => setIsClipperOpen(false)}
        winnerName={winnerMarble ? winnerMarble.name : 'Player Marble'}
        powerName={winnerMarble ? winnerMarble.power.name : 'Inferno Supernova'}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 px-4 py-3 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Marble Clash: Elemental Arena</span>
            <span aria-hidden="true">·</span>
            <span>10 Idiomas Disponibles</span>
            <span aria-hidden="true">·</span>
            <span>350 HP & Cooldown</span>
          </div>
          <div>
            <span>Rebotes Perpetuos 60-120 FPS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
