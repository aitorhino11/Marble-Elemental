import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { soundManager } from '../utils/audioSystem';

interface FullscreenButtonProps {
  labelFullscreen?: string;
  labelExit?: string;
}

export const FullscreenButton: React.FC<FullscreenButtonProps> = ({
  labelFullscreen = 'Pantalla Completa',
  labelExit = 'Salir de Pantalla Completa'
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    soundManager.playMarbleClick(0.6);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <button
      onClick={toggleFullscreen}
      className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 backdrop-blur-md shadow-lg transition-all flex items-center gap-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-amber-500/50"
      title={isFullscreen ? labelExit : labelFullscreen}
      aria-label={isFullscreen ? labelExit : labelFullscreen}
    >
      {isFullscreen ? (
        <>
          <Minimize2 className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">{labelExit}</span>
        </>
      ) : (
        <>
          <Maximize2 className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">{labelFullscreen}</span>
        </>
      )}
    </button>
  );
};
