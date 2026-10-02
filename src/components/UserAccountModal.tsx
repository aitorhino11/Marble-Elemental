import React, { useState } from 'react';
import { competitiveManager } from '../utils/competitiveManager';
import { soundManager } from '../utils/audioSystem';
import { 
  UserCheck, 
  UserPlus, 
  LogIn, 
  LogOut, 
  ShieldCheck, 
  Smartphone, 
  KeyRound, 
  User, 
  X, 
  Check, 
  AlertCircle,
  RefreshCw,
  Trophy,
  Sparkles
} from 'lucide-react';

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserAccountModal: React.FC<UserAccountModalProps> = ({ isOpen, onClose }) => {
  const profile = competitiveManager.getProfile();
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playMarbleClick(0.6);
    setStatusMessage(null);

    if (username.trim().length < 3) {
      setStatusMessage({ type: 'error', text: 'El nombre de usuario debe tener mínimo 3 caracteres.' });
      return;
    }
    if (password.length < 4) {
      setStatusMessage({ type: 'error', text: 'La contraseña debe tener mínimo 4 caracteres.' });
      return;
    }
    if (password !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'Las contraseñas no coinciden. Por favor, revísalas.' });
      return;
    }

    setIsSubmitting(true);
    const result = competitiveManager.registerAccount(username, password);
    setIsSubmitting(false);

    if (result.success) {
      soundManager.playEggHatchFanfare('Epic');
      setStatusMessage({ type: 'success', text: result.message });
      setTimeout(() => {
        onClose();
        setUsername('');
        setPassword('');
        setConfirmPassword('');
      }, 1600);
    } else {
      soundManager.playKnockoutHit();
      setStatusMessage({ type: 'error', text: result.message });
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playMarbleClick(0.6);
    setStatusMessage(null);

    if (!username.trim() || !password) {
      setStatusMessage({ type: 'error', text: 'Por favor, introduce tu usuario y contraseña.' });
      return;
    }

    setIsSubmitting(true);
    const result = competitiveManager.loginAccount(username, password);
    setIsSubmitting(false);

    if (result.success) {
      soundManager.playEggHatchFanfare('Rare');
      setStatusMessage({ type: 'success', text: result.message });
      setTimeout(() => {
        onClose();
        setUsername('');
        setPassword('');
      }, 1400);
    } else {
      soundManager.playKnockoutHit();
      setStatusMessage({ type: 'error', text: result.message });
    }
  };

  const handleLogout = () => {
    soundManager.playMarbleClick(0.5);
    competitiveManager.logoutAccount();
    setStatusMessage({ type: 'success', text: 'Has cerrado sesión. Puedes volver a iniciar sesión cuando quieras.' });
  };

  const handleManualSync = () => {
    soundManager.playMarbleClick(0.6);
    const res = competitiveManager.syncCurrentAccount();
    if (res.success) {
      soundManager.playPowerTrigger('ice');
      setStatusMessage({ type: 'success', text: res.message });
    } else {
      setStatusMessage({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-7 space-y-5 overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <ShieldCheck className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">
                {profile.username ? 'Mi Cuenta Guardada' : 'Guardar y Recuperar Cuenta'}
              </h2>
              <span className="text-xs text-slate-400">
                Sincronización en la nube local
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playMarbleClick(0.4);
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Logged in view */}
        {profile.username ? (
          <div className="space-y-5 relative z-10">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-bold text-white font-mono">
                    @{profile.username}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30">
                  Conectada & Segura
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>ELO: <b className="text-white font-mono">{profile.elo}</b></span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Canicas: <b className="text-white font-mono">{profile.unlockedMarbleIds.length}/20</b></span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-start gap-2.5 text-xs text-slate-300">
              <Smartphone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p>
                Tu cuenta está guardada con contraseña. Si cambias de navegador o borras datos, podrás recuperar tu progreso iniciando sesión con <b className="text-emerald-300">@{profile.username}</b>.
              </p>
            </div>

            {statusMessage && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                statusMessage.type === 'success' 
                  ? 'bg-emerald-950/80 border border-emerald-600 text-emerald-200' 
                  : 'bg-rose-950/80 border border-rose-600 text-rose-200'
              }`}>
                {statusMessage.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{statusMessage.text}</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={handleManualSync}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-600 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sincronizar Progreso</span>
              </button>
              <button
                onClick={handleLogout}
                className="py-2.5 px-4 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-700 text-rose-300 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        ) : (
          /* Non-logged in tabs: Register / Login */
          <div className="space-y-4 relative z-10">
            {/* Tabs */}
            <div className="flex p-1 rounded-2xl bg-slate-950 border border-slate-800">
              <button
                onClick={() => {
                  soundManager.playMarbleClick(0.4);
                  setActiveTab('register');
                  setStatusMessage(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'register'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Crear Cuenta</span>
              </button>
              <button
                onClick={() => {
                  soundManager.playMarbleClick(0.4);
                  setActiveTab('login');
                  setStatusMessage(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Iniciar Sesión</span>
              </button>
            </div>

            {/* Explanatory benefit badge */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <Smartphone className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                {activeTab === 'register'
                  ? 'Crea tu cuenta con usuario y contraseña para no perder tu progreso. Si pierdes el móvil o cambias de dispositivo, podrás recuperarla.'
                  : '¿Ya tenías una cuenta creada? Introduce tu usuario y contraseña para recuperar todo tu ELO y canicas.'}
              </span>
            </div>

            {statusMessage && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                statusMessage.type === 'success' 
                  ? 'bg-emerald-950/80 border border-emerald-600 text-emerald-200' 
                  : 'bg-rose-950/80 border border-rose-600 text-rose-200'
              }`}>
                {statusMessage.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{statusMessage.text}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={activeTab === 'register' ? handleRegister : handleLogin} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3 h-3 text-amber-400" />
                  <span>Nombre de Usuario</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ej. MarbleKing99"
                  required
                  maxLength={20}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound className="w-3 h-3 text-amber-400" />
                  <span>Contraseña</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 4 caracteres"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              {activeTab === 'register' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <KeyRound className="w-3 h-3 text-amber-400" />
                    <span>Confirmar Contraseña</span>
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite tu contraseña"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                {activeTab === 'register' ? (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Crear Mi Cuenta Ahora</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Iniciar Sesión y Recuperar</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
