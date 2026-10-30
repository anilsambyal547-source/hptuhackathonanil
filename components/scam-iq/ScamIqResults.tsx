"use client";

import React, { useState } from "react";
import { Award, Share2, RotateCcw, Check, Sparkles, Zap, Flag, BookOpen } from "lucide-react";
import { ScamIqScoreCard } from "@/lib/types/scam-iq";

interface ScamIqResultsProps {
  scoreCard: ScamIqScoreCard;
  onRetake: () => void;
  onPlayMode: (mode: "quiz" | "drill" | "redflag") => void;
}

export const ScamIqResults: React.FC<ScamIqResultsProps> = ({
  scoreCard,
  onRetake,
  onPlayMode,
}) => {
  const [copied, setCopied] = useState(false);

  const getTierInfo = (score: number) => {
    if (score >= 260) {
      return {
        name: "Cyber Grandmaster",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/40",
        desc: "Elite fraud defense instincts. You systematically deconstruct social engineering traps, suspicious domains, and coercive threats.",
      };
    } else if (score >= 200) {
      return {
        name: "Vigilant Defender",
        color: "text-cyan-400",
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/40",
        desc: "Strong digital security awareness. You catch high-profile phishing vectors with occasional hesitation on subtle lookalike links.",
      };
    } else if (score >= 140) {
      return {
        name: "Cautious Explorer",
        color: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/40",
        desc: "Moderate risk level. High-pressure authority coercion or urgent courier fees may occasionally trick your intuition.",
      };
    } else {
      return {
        name: "At-Risk Target",
        color: "text-rose-400",
        bg: "bg-rose-500/10",
        border: "border-rose-500/40",
        desc: "High vulnerability to social engineering scams. Regular training and caution before clicking SMS or WhatsApp links is strongly advised.",
      };
    }
  };

  const tier = getTierInfo(scoreCard.totalScore);

  const handleShare = async () => {
    const text = `My Scam IQ: ${scoreCard.totalScore}/300 (Quiz ${scoreCard.quizScore} • Simulator ${scoreCard.drillScore} • Red Flag ${scoreCard.redFlagScore})\nRank: ${tier.name} 🛡️\nTest your scam defense instincts on SafeGuard AI!`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-400">
      {/* Hero IQ Card */}
      <div className="p-8 bg-slate-900/90 border border-slate-800 rounded-3xl text-center space-y-5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-36 bg-gradient-to-b from-cyan-500/10 to-transparent blur-2xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Official ScamAdviser Scam IQ Evaluation</span>
        </div>

        <div>
          <div className="text-6xl sm:text-7xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>{scoreCard.totalScore}</span>
            <span className="text-2xl sm:text-3xl font-light text-slate-500">/300</span>
          </div>
          <p className="text-xs uppercase tracking-widest font-mono text-slate-400 pt-1">
            Total Composite Scam IQ
          </p>
        </div>

        {/* Tier Badge */}
        <div className={`p-4 rounded-2xl border ${tier.bg} ${tier.border} space-y-1 max-w-md mx-auto`}>
          <div className="flex items-center justify-center gap-2">
            <Award className={`w-5 h-5 ${tier.color}`} />
            <h3 className={`text-base font-bold ${tier.color}`}>{tier.name}</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{tier.desc}</p>
        </div>

        {/* 3 Modes Breakdown Grid */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800">
          {/* Quiz */}
          <div
            onClick={() => onPlayMode("quiz")}
            className="p-3 bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 rounded-xl space-y-1.5 cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
              <span className="flex items-center gap-1 text-amber-400">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Quiz</span>
              </span>
              <span className="text-white font-mono">{scoreCard.quizScore}/100</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-400 h-full transition-all duration-500"
                style={{ width: `${scoreCard.quizScore}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 block">Scenario Analysis</span>
          </div>

          {/* Drill */}
          <div
            onClick={() => onPlayMode("drill")}
            className="p-3 bg-slate-950/80 border border-slate-800 hover:border-rose-500/40 rounded-xl space-y-1.5 cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
              <span className="flex items-center gap-1 text-rose-400">
                <Zap className="w-3.5 h-3.5" />
                <span>Simulator</span>
              </span>
              <span className="text-white font-mono">{scoreCard.drillScore}/100</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-rose-500 h-full transition-all duration-500"
                style={{ width: `${scoreCard.drillScore}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 block">Speed & Instinct</span>
          </div>

          {/* Red Flag */}
          <div
            onClick={() => onPlayMode("redflag")}
            className="p-3 bg-slate-950/80 border border-slate-800 hover:border-purple-500/40 rounded-xl space-y-1.5 cursor-pointer transition-all"
          >
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
              <span className="flex items-center gap-1 text-purple-400">
                <Flag className="w-3.5 h-3.5" />
                <span>Red Flag</span>
              </span>
              <span className="text-white font-mono">{scoreCard.redFlagScore}/100</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-purple-400 h-full transition-all duration-500"
                style={{ width: `${scoreCard.redFlagScore}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 block">Tell Spotter</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleShare}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? "Copied to Clipboard!" : "Share Scam IQ Result"}</span>
          </button>

          <button
            onClick={onRetake}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake All 3 Modes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
