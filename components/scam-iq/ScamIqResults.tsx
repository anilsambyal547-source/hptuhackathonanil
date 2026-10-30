"use client";

import React, { useState, useEffect } from "react";
import {
  Award,
  Share2,
  RotateCcw,
  Check,
  Sparkles,
  Zap,
  Flag,
  BookOpen,
  Printer,
  ChevronRight,
  Compass,
} from "lucide-react";
import { ScamIqScoreCard } from "@/lib/types/scam-iq";
import { CertificateModal } from "./CertificateModal";
import { soundEffects } from "@/lib/utils/sound-effects";

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
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  useEffect(() => {
    soundEffects.playStreak();
  }, []);

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
    soundEffects.playClick();
    const text = `My Official Scam IQ: ${scoreCard.totalScore}/300 pts\n• Scenario Knowledge: ${scoreCard.quizScore}/100\n• Instinct Drill: ${scoreCard.drillScore}/100\n• Red Flag Spotter: ${scoreCard.redFlagScore}/100\nRank: ${tier.name} 🛡️\nTest your digital scam defense on SafeGuard AI!`;
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

  // Skill domain estimates derived from modes
  const urgencyDefense = Math.round(scoreCard.drillScore * 0.9 + scoreCard.quizScore * 0.1);
  const linkAcumen = Math.round(scoreCard.redFlagScore * 0.6 + scoreCard.quizScore * 0.4);
  const impersonationDefense = Math.round(scoreCard.quizScore * 0.6 + scoreCard.drillScore * 0.4);
  const financialCaution = Math.round((scoreCard.quizScore + scoreCard.drillScore + scoreCard.redFlagScore) / 3);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-400">
      {/* Hero IQ Score Card */}
      <div className="p-8 sm:p-10 bg-slate-900/90 border border-slate-800 rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-gradient-to-b from-cyan-500/15 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Accredited SafeGuard AI × ScamAdviser Evaluation</span>
        </div>

        <div>
          <div className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>{scoreCard.totalScore}</span>
            <span className="text-2xl sm:text-3xl font-light text-slate-500 font-mono">/300</span>
          </div>
          <p className="text-xs uppercase tracking-widest font-mono text-slate-400 pt-1">
            Total Composite Scam IQ
          </p>
        </div>

        {/* Tier Badge */}
        <div className={`p-5 rounded-2xl border ${tier.bg} ${tier.border} space-y-1.5 max-w-lg mx-auto shadow-lg`}>
          <div className="flex items-center justify-center gap-2">
            <Award className={`w-6 h-6 ${tier.color}`} />
            <h3 className={`text-lg font-bold ${tier.color}`}>{tier.name}</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">{tier.desc}</p>
        </div>

        {/* Action Buttons: Certificate & Share */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              soundEffects.playClick();
              setIsCertModalOpen(true);
            }}
            className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/25"
          >
            <Printer className="w-4 h-4" />
            <span>Generate Official Certificate</span>
          </button>

          <button
            onClick={handleShare}
            className="px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-cyan-400" />
                <span>Share Results</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              onRetake();
            }}
            className="px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Assessment</span>
          </button>
        </div>
      </div>

      {/* Grid: Left = 3 Sub-Scores, Right = 4 Defense Domain Meters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module Sub-Scores */}
        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Module Performance Breakdown
            </span>
            <span className="text-[11px] font-mono text-slate-500">Max 100 pts each</span>
          </div>

          <div className="space-y-3">
            {/* Scenario Quiz */}
            <div
              onClick={() => onPlayMode("quiz")}
              className="p-4 bg-slate-950 border border-amber-500/30 hover:border-amber-500 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all hover:bg-amber-950/10 group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                    Scenario Knowledge Quiz
                  </h4>
                  <p className="text-[11px] text-slate-400">Deep social engineering cases</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black font-mono text-amber-400">
                  {scoreCard.quizScore} <span className="text-[10px] text-slate-500 font-normal">/ 100</span>
                </span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-300 transition-colors" />
              </div>
            </div>

            {/* Simulator Drill */}
            <div
              onClick={() => onPlayMode("drill")}
              className="p-4 bg-slate-950 border border-rose-500/30 hover:border-rose-500 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all hover:bg-rose-950/10 group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors">
                    Simulator Instinct Drill
                  </h4>
                  <p className="text-[11px] text-slate-400">20s rapid-fire Real vs Scam</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black font-mono text-rose-400">
                  {scoreCard.drillScore} <span className="text-[10px] text-slate-500 font-normal">/ 100</span>
                </span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-rose-300 transition-colors" />
              </div>
            </div>

            {/* Red Flag Spotter */}
            <div
              onClick={() => onPlayMode("redflag")}
              className="p-4 bg-slate-950 border border-purple-500/30 hover:border-purple-500 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all hover:bg-purple-950/10 group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Flag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                    Red Flag Forensic Spotter
                  </h4>
                  <p className="text-[11px] text-slate-400">Fine-grained tell identification</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black font-mono text-purple-400">
                  {scoreCard.redFlagScore} <span className="text-[10px] text-slate-500 font-normal">/ 100</span>
                </span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-300 transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {/* 4 Cyber Defense Skill Domains */}
        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Cyber Defense Domain Metrics</span>
            </span>
            <span className="text-[11px] font-mono text-slate-500">Skill Proficiency</span>
          </div>

          <div className="space-y-3.5 pt-1">
            {/* Domain 1 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Psychological Pressure & Urgency Resistance</span>
                <span className="font-mono font-bold text-rose-400">{urgencyDefense}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-rose-500 to-red-400 h-full transition-all duration-500"
                  style={{ width: `${urgencyDefense}%` }}
                />
              </div>
            </div>

            {/* Domain 2 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Deceptive URL & Typosquat Detection</span>
                <span className="font-mono font-bold text-cyan-400">{linkAcumen}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-blue-400 h-full transition-all duration-500"
                  style={{ width: `${linkAcumen}%` }}
                />
              </div>
            </div>

            {/* Domain 3 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Brand & Authority Impersonation Defense</span>
                <span className="font-mono font-bold text-amber-400">{impersonationDefense}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all duration-500"
                  style={{ width: `${impersonationDefense}%` }}
                />
              </div>
            </div>

            {/* Domain 4 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Financial & Non-Reversible Trap Avoidance</span>
                <span className="font-mono font-bold text-purple-400">{financialCaution}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-purple-500 to-indigo-400 h-full transition-all duration-500"
                  style={{ width: `${financialCaution}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official Certificate Modal */}
      <CertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        scoreCard={scoreCard}
      />
    </div>
  );
};
