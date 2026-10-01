import React, { useState } from 'react';
import { competitiveManager } from '../utils/competitiveManager';
import { soundManager } from '../utils/audioSystem';
import confetti from 'canvas-confetti';
import { Gift, X, CheckCircle, AlertTriangle, Sparkles, Trophy } from 'lucide-react';

interface CreatorCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreatorCodeModal: React.FC<CreatorCodeModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [code, setCode] = useState<string>('');
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
    tokens?: number;
  } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const result = competitiveManager.redeemCreatorCode(code);
    if (result.success) {
      soundManager.playEggHatchFanfare('Epic');
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ec4899', '#38bdf8', '#10b981', '#ffffff']
      });
      setFeedback({
        type: 'success',
        message: result.message,
        tokens: result.rewardTokens
      });
      setCode('');
      if (onSuccess) onSuccess();
    } else {
      soundManager.playHeavyImpact(0.8);
      setFeedback({
        type: 'error',
        message: result.message
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl shadow-amber-500/10 space-y-5 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playMarbleClick(0.5);
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
            <Gift className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Código de Creador</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Apoya a tu creador favorito y recibe recompensas
            </p>
          </div>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div
            className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2.5 ${
              feedback.type === 'success'
                ? 'bg-emerald-950/80 border border-emerald-600/70 text-emerald-200 shadow-md'
                : 'bg-rose-950/80 border border-rose-600/70 text-rose-200 shadow-md'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <div>
              <p>{feedback.message}</p>
              {feedback.tokens && (
                <span className="font-mono text-amber-300 block mt-0.5">
                  +{feedback.tokens} Fragmentos en tu balance.
                </span>
              )}
            </div>
          </div>
        )}

        {/* Code Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold text-slate-300">
              Introduce el código:
            </label>
            <div className="relative">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ej: aitorhino"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all uppercase tracking-wider"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-2xl font-black text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-lg shadow-amber-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            <Gift className="w-4 h-4" />
            <span>CANJEAR CÓDIGO</span>
          </button>
        </form>

        {/* Official Creator Hint */}
        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Código Oficial de Creador:</span>
          <button
            onClick={() => setCode('aitorhino')}
            className="font-mono font-black text-amber-400 hover:text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30 cursor-pointer transition-colors"
          >
            aitorhino (+160 Frag.)
          </button>
        </div>
      </div>
    </div>
  );
};
