import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  MessageCircle, 
  Share2, 
  Music, 
  Play, 
  Pause, 
  Download, 
  Sparkles, 
  Check, 
  Copy,
  Smartphone
} from 'lucide-react';
import { soundManager } from '../utils/audioSystem';

interface TikTokClipperModalProps {
  isOpen: boolean;
  onClose: () => void;
  winnerName: string;
  powerName: string;
}

export const TikTokClipperModal: React.FC<TikTokClipperModalProps> = ({
  isOpen,
  onClose,
  winnerName,
  powerName
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [selectedSound, setSelectedSound] = useState<string>('Phonk Bass Drop (Slowed)');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(142800);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  if (!isOpen) return null;

  const audioOptions = [
    'Phonk Bass Drop (Slowed)',
    'Cartoon Acme Anvil Bonk',
    'Epic Cinematic Choir Swell',
    'Satisfying ASMR Glass Shatter'
  ];

  const handleShare = () => {
    soundManager.playMarbleClick(0.7);
    navigator.clipboard.writeText(`Check out my INSANE knockout in Marble Clash! Arena Code: #CLASH-882 https://marbleclash.game/replay/882`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const handleToggleLike = () => {
    soundManager.playMarbleClick(0.8);
    setIsLiked(!isLiked);
    setLikeCount(prev => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row gap-6 items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 9:16 Vertical Video Frame (Simulated TikTok / Shorts Preview) */}
        <div className="w-[280px] sm:w-[320px] aspect-[9/16] bg-slate-950 rounded-2xl border-4 border-slate-800 relative overflow-hidden shadow-2xl shrink-0 flex flex-col justify-between p-4">
          {/* Top TikTok Header */}
          <div className="flex items-center justify-between text-xs text-white/80 z-10">
            <span className="font-semibold tracking-wider">Following | <strong className="text-white">For You</strong></span>
            <span className="px-2 py-0.5 rounded bg-rose-600 font-bold text-[10px] text-white">LIVE REPLAY</span>
          </div>

          {/* Animated Replay Graphics Canvas Placeholder */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {/* Pulsing Target Rings */}
            <div className="w-40 h-40 rounded-full border-2 border-rose-500/40 animate-ping absolute" />
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 opacity-80 blur-xs shadow-2xl shadow-rose-500" />
            
            {/* Big Knockout Text */}
            <div className="text-center z-10 transform rotate-[-4deg] animate-pulse">
              <span className="text-3xl font-black text-amber-300 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                KNOCKOUT!
              </span>
              <p className="text-xs font-mono font-bold text-white uppercase tracking-widest mt-1 bg-black/60 px-2 py-0.5 rounded">
                SLOW-MO 0.2X HIT
              </p>
            </div>
          </div>

          {/* Right Floating TikTok Action Sidebar */}
          <div className="self-end flex flex-col items-center gap-4 z-10">
            {/* Creator Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 p-0.5">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-white">
                MC
              </div>
            </div>

            {/* Like Button */}
            <button onClick={handleToggleLike} className="flex flex-col items-center gap-1 group">
              <div className={`p-2 rounded-full ${isLiked ? 'bg-rose-500 text-white' : 'bg-black/40 text-white'}`}>
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`} />
              </div>
              <span className="text-[10px] font-bold text-white">{(likeCount / 1000).toFixed(1)}k</span>
            </button>

            {/* Comments */}
            <div className="flex flex-col items-center gap-1">
              <div className="p-2 rounded-full bg-black/40 text-white">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-white">2.3k</span>
            </div>

            {/* Share */}
            <button onClick={handleShare} className="flex flex-col items-center gap-1">
              <div className="p-2 rounded-full bg-black/40 text-white">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-white">Share</span>
            </button>

            {/* Spinning Music Disc */}
            <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center animate-spin">
              <Music className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Bottom Video Metadata */}
          <div className="space-y-1.5 z-10 text-left">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>@MarbleClashPro</span>
              <span className="text-[9px] bg-sky-500 text-white px-1 rounded-full">✓</span>
            </h4>
            <p className="text-[11px] text-white/90 leading-tight">
              INSANE clutch finish with {winnerName} using {powerName}! That ricochet was personal 🤯🎯 #MarbleClash #Gaming #ASMR
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-amber-300 font-medium">
              <Music className="w-3 h-3" />
              <span className="truncate">{selectedSound}</span>
            </div>
          </div>
        </div>

        {/* Right Configuration & Export Panel */}
        <div className="flex-1 space-y-5 text-left">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
              <Sparkles className="w-4 h-4" />
              <span>GDD §06 · Viral Growth Engine</span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-1">
              Built-In 5-Second Highlight Clipper
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Every match automatically records a 5-second circular physics buffer. High-momentum knockouts automatically queue for instant export to TikTok, YouTube Shorts, and Reels with synced meme sounds.
            </p>
          </div>

          {/* Sound Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Trending Background Audio Track:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {audioOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    soundManager.playMarbleClick(0.6);
                    setSelectedSound(opt);
                  }}
                  className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                    selectedSound === opt
                      ? 'bg-rose-500/10 border-rose-500/60 text-white font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Music className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="truncate">{opt}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Shareable Arena Code */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-400 block">
              Embedded Match Replay & Arena Code:
            </span>
            <div className="flex items-center justify-between font-mono text-sm font-bold text-amber-400">
              <span>#CLASH-882</span>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleShare}
              className="flex-1 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4 fill-slate-950" />
              <span>EXPORT TO TIKTOK / SHORTS</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-3 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
