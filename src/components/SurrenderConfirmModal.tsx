import React from 'react';
import { AlertTriangle, Trophy, ShieldAlert, ArrowLeft, Swords } from 'lucide-react';
import { soundManager } from '../utils/audioSystem';

interface SurrenderConfirmModalProps {
  isOpen: boolean;
  currentElo: number;
  penaltyElo?: number;
  onCancel: () => void;
  onConfirmSurrender: () => void;
}

export const SurrenderConfirmModal: React.FC<SurrenderConfirmModalProps> = ({
  isOpen,
  currentElo,
  penaltyElo = 30,
  onCancel,
  onConfirmSurrender
}) => {
  if (!isOpen) return null;

  const newElo = Math.max(0, currentElo - penaltyElo);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-rose-600/80 rounded-3xl p-6 sm:p-7 shadow-[0_0_50px_rgba(244,63,94,0.3)] space-y-5 text-center">
        {/* Animated Warning Icon */}
        <div className="w-16 h-16 rounded-2xl mx-auto bg-rose-500/15 border border-rose-500/40 flex items-center justify-center shadow-lg text-rose-400">
          <AlertTriangle className="w-9 h-9 animate-pulse" />
        </div>

        {/* Modal Titles */}
        <div className="space-y-1.5">
          <h3 className="text-xl font-black text-white tracking-tight uppercase flex items-center justify-center gap-2">
            <span>¿Abandonar Batalla?</span>
          </h3>
          <p className="text-xs text-rose-300 font-medium">
            Aviso de penalización competitiva
          </p>
        </div>

        {/* Warning Explanation Card */}
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-900/60 text-xs text-slate-300 space-y-3 text-left">
          <p className="leading-relaxed">
            Si sales de esta batalla ahora, se considerará una <strong className="text-white">retirada por rendición</strong> y se te restarán:
          </p>

          {/* ELO Penalty Calculation Box */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-rose-800/60 font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block">ELO ACTUAL</span>
              <span className="text-base font-bold text-white flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                {currentElo}
              </span>
            </div>

            <div className="text-center px-2 py-1 rounded bg-rose-500/20 border border-rose-500/40">
              <span className="text-xs font-black text-rose-400 tracking-wider">
                -{penaltyElo} ELO
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">NUEVO ELO</span>
              <span className="text-base font-bold text-rose-300">
                {newElo}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          {/* Button 1: Cancel / Stay in Fight (Primary action) */}
          <button
            onClick={() => {
              soundManager.playMarbleClick(0.7);
              onCancel();
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Swords className="w-4 h-4 fill-slate-950" />
            <span>SEGUIR LUCHANDO (NO SALIR)</span>
          </button>

          {/* Button 2: Confirm Surrender (-30 ELO) */}
          <button
            onClick={() => {
              soundManager.playMarbleClick(0.5);
              onConfirmSurrender();
            }}
            className="w-full py-2.5 px-4 rounded-2xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800 hover:border-rose-600 text-rose-300 hover:text-rose-100 font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Sí, Abandonar y perder 30 de ELO</span>
          </button>
        </div>
      </div>
    </div>
  );
};
