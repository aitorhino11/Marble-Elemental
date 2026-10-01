import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Play, 
  Share2, 
  Check, 
  Copy, 
  Sparkles, 
  RotateCcw,
  Compass,
  Zap,
  Bomb
} from 'lucide-react';
import { soundManager } from '../utils/audioSystem';

interface ArenaElement {
  id: string;
  type: 'bumper' | 'speed_strip' | 'vortex' | 'mine';
  x: number;
  y: number;
}

export const ArenaEditorPreview: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<'bumper' | 'speed_strip' | 'vortex' | 'mine'>('bumper');
  const [arenaCode, setArenaCode] = useState<string>('#CLASH-789');
  const [copied, setCopied] = useState<boolean>(false);
  const [elements, setElements] = useState<ArenaElement[]>([
    { id: '1', type: 'vortex', x: 250, y: 175 },
    { id: '2', type: 'bumper', x: 120, y: 120 },
    { id: '3', type: 'bumper', x: 380, y: 120 },
    { id: '4', type: 'speed_strip', x: 250, y: 300 }
  ]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    soundManager.playMarbleClick(0.6);
    const newElem: ArenaElement = {
      id: Math.random().toString(),
      type: selectedTool,
      x,
      y
    };
    setElements(prev => [...prev, newElem]);
  };

  const handleClear = () => {
    soundManager.playMarbleClick(0.5);
    setElements([]);
  };

  const handleGenerateCode = () => {
    soundManager.playMarbleClick(0.8);
    const randomCode = `#CLASH-${Math.floor(100 + Math.random() * 900)}`;
    setArenaCode(randomCode);
    navigator.clipboard.writeText(randomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full">
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
            <Compass className="w-4 h-4" />
            <span>GDD §06 · Community Arena Creator</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            UGC Arena & Hazard Editor
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Empower TikTok creators to design custom pinball obstacle courses, share 6-digit challenge codes, and engage their communities with impossible trick-shot maps.
          </p>
        </div>

        {/* Shareable Code Badge */}
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm font-bold text-amber-400">
            {arenaCode}
          </div>
          <button
            onClick={handleGenerateCode}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Publish Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Editor Grid Canvas (8 Cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Click inside arena to place {selectedTool.replace('_', ' ')}</span>
            <span>{elements.length} Objects Placed</span>
          </div>

          <div
            onClick={handleCanvasClick}
            className="relative w-full h-[380px] rounded-xl bg-slate-950 border-2 border-dashed border-slate-800 cursor-crosshair overflow-hidden"
          >
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:30px_30px] opacity-40 pointer-events-none" />

            {/* Placed Elements */}
            {elements.map((elem) => (
              <div
                key={elem.id}
                style={{ left: `${elem.x}px`, top: `${elem.y}px` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation();
                  soundManager.playMarbleClick(0.4);
                  setElements(prev => prev.filter(el => el.id !== elem.id));
                }}
                title="Click to remove object"
              >
                {elem.type === 'bumper' && (
                  <div className="w-10 h-10 rounded-full bg-amber-500 border-2 border-white shadow-lg shadow-amber-500/40 flex items-center justify-center text-slate-950 font-bold text-xs">
                    ✦
                  </div>
                )}
                {elem.type === 'speed_strip' && (
                  <div className="w-16 h-6 rounded-md bg-cyan-500 border border-cyan-300 shadow-md flex items-center justify-center text-[10px] font-bold text-slate-950">
                    »» SPEED
                  </div>
                )}
                {elem.type === 'vortex' && (
                  <div className="w-14 h-14 rounded-full bg-purple-600/60 border-2 border-purple-400 shadow-lg flex items-center justify-center text-white text-xs animate-spin">
                    🌀
                  </div>
                )}
                {elem.type === 'mine' && (
                  <div className="w-8 h-8 rounded-full bg-rose-600 border border-white shadow-lg flex items-center justify-center text-white text-xs">
                    💣
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-500">
              Tip: Click any placed element to remove it from the arena.
            </span>
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Objects</span>
            </button>
          </div>
        </div>

        {/* Hazard Palette (4 Cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
            ★ Hazard Object Palette
          </h3>

          <div className="space-y-2">
            {[
              { type: 'bumper', label: 'Pinball Bumper', desc: '450 px/s kinetic rebound with sub-bass audio', color: 'amber' },
              { type: 'speed_strip', label: 'Turbo Speed Strip', desc: 'Doubles crossing velocity in directional vector', color: 'cyan' },
              { type: 'vortex', label: 'Gravitational Vortex', desc: 'Pulls surrounding marbles into center orbit', color: 'purple' },
              { type: 'mine', label: 'Proximity Mine', desc: 'Explodes for 75 damage & ring-out knockback', color: 'rose' }
            ].map((tool) => {
              const isSelected = selectedTool === tool.type;
              return (
                <button
                  key={tool.type}
                  onClick={() => {
                    soundManager.playMarbleClick(0.5);
                    setSelectedTool(tool.type as any);
                  }}
                  className={`w-full p-3 rounded-xl border text-left text-xs transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-amber-500/80 text-white font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold text-slate-200">{tool.label}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{tool.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
