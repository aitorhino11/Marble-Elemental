import React, { useState, useMemo } from 'react';
import { GDD_SECTIONS, GDD_METADATA, GddSection } from '../data/gddContent';
import { 
  FileText, 
  Copy, 
  Check, 
  Search, 
  Flame, 
  ShieldAlert, 
  Sparkles, 
  Smartphone, 
  Volume2, 
  Layers, 
  Zap,
  Target,
  Trophy
} from 'lucide-react';
import { soundManager } from '../utils/audioSystem';

interface GddDocumentViewProps {
  onSwitchToSandbox?: () => void;
  onSwitchToGacha?: () => void;
  onSwitchToPowers?: () => void;
}

export const GddDocumentView: React.FC<GddDocumentViewProps> = ({
  onSwitchToSandbox,
  onSwitchToGacha,
  onSwitchToPowers
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string>(GDD_SECTIONS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  // Kinetic Damage Calculator Tool state inside GDD
  const [calcVelocity, setCalcVelocity] = useState<number>(650);
  const [calcMass, setCalcMass] = useState<number>(1.2);
  const [calcBasePower, setCalcBasePower] = useState<number>(40);
  const [calcMultiplier, setCalcMultiplier] = useState<number>(1.35);

  const calculatedDamage = useMemo(() => {
    // Damage = Base + alpha * (0.5 * m * v^2 / 1000) * multiplier
    const kineticPart = 0.5 * calcMass * Math.pow(calcVelocity / 100, 2);
    const total = (calcBasePower + kineticPart * 1.8) * calcMultiplier;
    return Math.round(total);
  }, [calcVelocity, calcMass, calcBasePower, calcMultiplier]);

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return GDD_SECTIONS;
    const q = searchQuery.toLowerCase();
    return GDD_SECTIONS.filter(s => 
      s.title.toLowerCase().includes(q) ||
      s.summary.toLowerCase().includes(q) ||
      s.content.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const activeSection = useMemo(() => {
    return GDD_SECTIONS.find(s => s.id === activeSectionId) || GDD_SECTIONS[0];
  }, [activeSectionId]);

  const handleCopyFullGdd = () => {
    soundManager.playMarbleClick(0.8);
    const fullMarkdown = `# ${GDD_METADATA.title}\n${GDD_METADATA.subtitle}\n\n` +
      `Target Audience: ${GDD_METADATA.targetAudience}\n` +
      `Platform: ${GDD_METADATA.platform}\n` +
      `Monetization: ${GDD_METADATA.monetization}\n\n---\n\n` +
      GDD_SECTIONS.map(s => s.content).join('\n\n---\n\n');

    navigator.clipboard.writeText(fullMarkdown).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const getSectionIcon = (id: string) => {
    switch (id) {
      case 'executive-summary': return <Target className="w-4 h-4 text-amber-400" />;
      case 'gameplay-loop': return <Zap className="w-4 h-4 text-emerald-400" />;
      case 'twenty-powers': return <Flame className="w-4 h-4 text-rose-400" />;
      case 'juiciness-audio': return <Volume2 className="w-4 h-4 text-cyan-400" />;
      case 'progression-gacha': return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'monetization-viral': return <Smartphone className="w-4 h-4 text-amber-400" />;
      default: return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto w-full">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-80 shrink-0 space-y-4">
        {/* Document Header Card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                <Layers className="w-3.5 h-3.5" />
                <span>Executive GDD · v1.0</span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1 leading-snug">
                Marble Clash
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Elemental Arena Design Spec
              </p>
            </div>
            <button
              onClick={handleCopyFullGdd}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700/50"
              title="Copy complete document as Markdown"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy MD</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Target Demographic:</span>
              <span className="text-slate-200 font-medium">Ages 8-14</span>
            </div>
            <div className="flex justify-between">
              <span>Format:</span>
              <span className="text-slate-200 font-medium">Hyper-Casual / Shorts</span>
            </div>
            <div className="flex justify-between">
              <span>Match Length:</span>
              <span className="text-slate-200 font-medium">30–75 Seconds</span>
            </div>
          </div>
        </div>

        {/* Section Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search mechanics, powers, formulas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500/60 transition-colors"
          />
        </div>

        {/* Section List */}
        <nav className="space-y-1.5" aria-label="GDD Chapters">
          {filteredSections.map((sec) => {
            const isActive = sec.id === activeSectionId;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  soundManager.playMarbleClick(0.5);
                  setActiveSectionId(sec.id);
                }}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 border ${
                  isActive
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                  isActive ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {getSectionIcon(sec.id)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-amber-400/80">
                      §{sec.number}
                    </span>
                    <span className="text-xs font-semibold text-slate-100 truncate">
                      {sec.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {sec.summary}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Quick Prototype Shortcuts */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/20 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Interactive Prototypes</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Test the live physics engine, gacha hatching egg, and 20 powers right in this studio!
          </p>
          <div className="grid grid-cols-1 gap-1.5 pt-1">
            {onSwitchToSandbox && (
              <button
                onClick={() => {
                  soundManager.playMarbleClick(0.9);
                  onSwitchToSandbox();
                }}
                className="w-full text-left px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-between"
              >
                <span>Launch Physics Sandbox</span>
                <Zap className="w-3.5 h-3.5" />
              </button>
            )}
            {onSwitchToPowers && (
              <button
                onClick={() => {
                  soundManager.playMarbleClick(0.7);
                  onSwitchToPowers();
                }}
                className="w-full text-left px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors flex items-center justify-between"
              >
                <span>20 Powers Interactive Matrix</span>
                <Flame className="w-3.5 h-3.5 text-rose-400" />
              </button>
            )}
            {onSwitchToGacha && (
              <button
                onClick={() => {
                  soundManager.playMarbleClick(0.7);
                  onSwitchToGacha();
                }}
                className="w-full text-left px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors flex items-center justify-between"
              >
                <span>3-Step Egg Hatching Gacha</span>
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              </button>
            )}
          </div>
        </div>

        {/* Kinetic Damage Balance Calculator Widget */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Kinetic Damage Calculator
            </span>
            <span className="text-[10px] font-mono text-slate-500">Live Equation</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Impact Velocity (px/s):</span>
                <span className="font-mono text-slate-200 font-semibold">{calcVelocity}</span>
              </div>
              <input
                type="range"
                min="200"
                max="1400"
                step="50"
                value={calcVelocity}
                onChange={(e) => setCalcVelocity(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Marble Mass Multiplier:</span>
                <span className="font-mono text-slate-200 font-semibold">{calcMass}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={calcMass}
                onChange={(e) => setCalcMass(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Elemental Advantage:</span>
                <span className="font-mono text-slate-200 font-semibold">{calcMultiplier}x</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="1.6"
                step="0.05"
                value={calcMultiplier}
                onChange={(e) => setCalcMultiplier(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Total Combat Damage:</span>
            <span className="text-lg font-bold font-mono text-amber-400">
              {calculatedDamage} HP
            </span>
          </div>
        </div>
      </aside>

      {/* Main Document Content View */}
      <main className="flex-1 min-w-0 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-6">
        {/* Active Chapter Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                CHAPTER {activeSection.number}
              </span>
              <span className="text-xs text-slate-400">
                Marble Clash: Elemental Arena GDD
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {activeSection.title}
            </h1>
          </div>
          <button
            onClick={() => {
              soundManager.playMarbleClick(0.7);
              navigator.clipboard.writeText(activeSection.content);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Section Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Section</span>
              </>
            )}
          </button>
        </div>

        {/* Render Formatted Markdown Content */}
        <article className="prose prose-invert max-w-none prose-headings:text-slate-100 prose-headings:font-bold prose-p:text-slate-300 prose-p:leading-relaxed prose-li:text-slate-300 prose-table:border-collapse prose-table:w-full prose-th:bg-slate-800/80 prose-th:text-amber-300 prose-th:p-3 prose-th:text-xs prose-td:p-3 prose-td:border-b prose-td:border-slate-800 prose-td:text-xs prose-code:text-amber-300 prose-code:bg-slate-950 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800">
          <div 
            dangerouslySetInnerHTML={{ 
              __html: renderMarkdownToHtml(activeSection.content) 
            }} 
          />
        </article>

        {/* Section Navigation Footer */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
          {(() => {
            const currentIndex = GDD_SECTIONS.findIndex(s => s.id === activeSectionId);
            const prevSection = currentIndex > 0 ? GDD_SECTIONS[currentIndex - 1] : null;
            const nextSection = currentIndex < GDD_SECTIONS.length - 1 ? GDD_SECTIONS[currentIndex + 1] : null;

            return (
              <>
                {prevSection ? (
                  <button
                    onClick={() => {
                      soundManager.playMarbleClick(0.6);
                      setActiveSectionId(prevSection.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg bg-slate-800/70 hover:bg-slate-800 transition-colors"
                  >
                    <span>← Previous: §{prevSection.number}</span>
                  </button>
                ) : <div />}

                {nextSection && (
                  <button
                    onClick={() => {
                      soundManager.playMarbleClick(0.6);
                      setActiveSectionId(nextSection.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex items-center gap-2 text-xs font-semibold text-amber-300 hover:text-amber-200 px-4 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors"
                  >
                    <span>Next: §{nextSection.number} {nextSection.title.split('&')[0]} →</span>
                  </button>
                )}
              </>
            );
          })()}
        </div>
      </main>
    </div>
  );
};

// Clean Lightweight Markdown Formatter
function renderMarkdownToHtml(md: string): string {
  let html = md;

  // Code blocks
  html = html.replace(/```([\s\S]*?)```/g, '<pre class="overflow-x-auto p-4 rounded-xl bg-slate-950 font-mono text-xs text-amber-200/90 border border-slate-800"><code>$1</code></pre>');

  // Markdown Tables
  html = html.replace(/\n\|(.+)\|\n\|[-:| ]+\|\n((?:\|.+\|\n?)+)/g, (match, header, rows) => {
    const headers = header.split('|').filter((h: string) => h.trim().length > 0);
    const headerHtml = `<thead><tr>${headers.map((h: string) => `<th class="p-3 text-left font-semibold text-amber-400 bg-slate-800/90 border-b border-slate-700 text-xs">${h.trim()}</th>`).join('')}</tr></thead>`;
    
    const rowLines = rows.trim().split('\n');
    const bodyHtml = `<tbody>${rowLines.map((r: string) => {
      const cells = r.split('|').filter((c: string) => c.trim().length > 0);
      return `<tr class="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">${cells.map((c: string) => `<td class="p-3 text-xs text-slate-300 align-top">${c.trim()}</td>`).join('')}</tr>`;
    }).join('')}</tbody>`;

    return `<div class="overflow-x-auto my-6 rounded-xl border border-slate-800 shadow-sm"><table class="w-full text-left border-collapse">${headerHtml}${bodyHtml}</table></div>`;
  });

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-slate-100 mt-6 mb-3 flex items-center gap-2">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-amber-300 mt-8 mb-4 border-b border-slate-800 pb-2">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-black text-white mt-4 mb-4 tracking-tight">$1</h1>');

  // Bold & Italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-100">$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em class="italic text-slate-300">$1</em>');

  // Lists
  html = html.replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc text-slate-300 my-1">$1</li>');

  // Horizontal Rules
  html = html.replace(/---/g, '<hr class="border-slate-800 my-6" />');

  // Paragraphs
  html = html.replace(/\n\n/g, '<p class="my-3 text-slate-300 leading-relaxed text-sm"></p>');

  return html;
}
