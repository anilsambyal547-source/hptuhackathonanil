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
        color: "text-[#3d5926]",
        bg: "bg-[#eef5e6]",
        border: "border-[#d5e0cb]",
        desc: "Elite fraud defense instincts. You systematically deconstruct social engineering traps, suspicious domains, and coercive threats.",
      };
    } else if (score >= 200) {
      return {
        name: "Vigilant Defender",
        color: "text-blue-800",
        bg: "bg-blue-50",
        border: "border-blue-200",
        desc: "Strong digital security awareness. You catch high-profile phishing vectors with occasional hesitation on subtle lookalike links.",
      };
    } else if (score >= 140) {
      return {
        name: "Cautious Explorer",
        color: "text-amber-800",
        bg: "bg-amber-50",
        border: "border-amber-200",
        desc: "Moderate risk level. High-pressure authority coercion or urgent courier fees may occasionally trick your intuition.",
      };
    } else {
      return {
        name: "At-Risk Target",
        color: "text-rose-800",
        bg: "bg-rose-50",
        border: "border-rose-200",
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
      <div className="p-8 sm:p-10 bg-white border border-[#e2e6dc] rounded-3xl text-center space-y-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f7f9f5] border border-[#e2e6dc] text-xs font-mono text-[#636c5c]">
          <Sparkles className="w-3.5 h-3.5 text-[#5c8a27]" />
          <span>Accredited SafeGuard AI × ScamAdviser Evaluation</span>
        </div>

        <div>
          <div className="font-serif text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-[#181a15] flex items-center justify-center gap-2">
            <span>{scoreCard.totalScore}</span>
            <span className="text-2xl sm:text-3xl font-light text-[#717a69] font-mono">/300</span>
          </div>
          <p className="text-xs uppercase tracking-widest font-mono text-[#717a69] pt-1">
            Total Composite Scam IQ
          </p>
        </div>

        {/* Tier Badge */}
        <div className={`p-5 rounded-2xl border ${tier.bg} ${tier.border} space-y-1.5 max-w-lg mx-auto shadow-xs`}>
          <div className="flex items-center justify-center gap-2">
            <Award className={`w-6 h-6 ${tier.color}`} />
            <h3 className={`font-serif text-lg font-bold ${tier.color}`}>{tier.name}</h3>
          </div>
          <p className="text-xs text-[#383d33] leading-relaxed font-sans">{tier.desc}</p>
        </div>

        {/* Action Buttons: Certificate & Share */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              soundEffects.playClick();
              setIsCertModalOpen(true);
            }}
            className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-[#bef264] hover:bg-[#aee750] text-[#162704] border border-[#a8df4a]/70 transition-all flex items-center gap-2 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Generate Official Certificate</span>
          </button>

          <button
            onClick={handleShare}
            className="px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold bg-[#181a15] hover:bg-[#2b2d26] text-white transition-colors flex items-center gap-2 shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#bef264]" />
                <span className="text-[#bef264]">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-[#bef264]" />
                <span>Share Results</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              onRetake();
            }}
            className="px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold text-[#636c5c] hover:text-[#181a15] bg-[#f7f9f5] hover:bg-[#eef2e7] border border-[#e2e6dc] transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Assessment</span>
          </button>
        </div>
      </div>

      {/* Grid: Left = 3 Sub-Scores, Right = 4 Defense Domain Meters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module Sub-Scores */}
        <div className="p-6 bg-white border border-[#e2e6dc] rounded-3xl space-y-4 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between pb-2 border-b border-[#e2e6dc]">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#181a15]">
              Module Performance Breakdown
            </span>
            <span className="text-[11px] font-mono text-[#717a69]">Max 100 pts each</span>
          </div>

          <div className="space-y-3">
            {/* Scenario Quiz */}
            <div
              onClick={() => onPlayMode("quiz")}
              className="p-4 bg-[#f7f9f5] border border-[#e2e6dc] hover:border-amber-400 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all hover:bg-amber-50/50 group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#181a15] group-hover:text-amber-800 transition-colors">
                    Scenario Knowledge Quiz
                  </h4>
                  <p className="text-[11px] text-[#636c5c]">Deep social engineering cases</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold font-mono text-amber-800">
                  {scoreCard.quizScore} <span className="text-[10px] text-[#717a69] font-normal">/ 100</span>
                </span>
                <ChevronRight className="w-4 h-4 text-[#717a69] group-hover:text-amber-800 transition-colors" />
              </div>
            </div>

            {/* Simulator Drill */}
            <div
              onClick={() => onPlayMode("drill")}
              className="p-4 bg-[#f7f9f5] border border-[#e2e6dc] hover:border-rose-400 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all hover:bg-rose-50/50 group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#181a15] group-hover:text-rose-800 transition-colors">
                    Simulator Instinct Drill
                  </h4>
                  <p className="text-[11px] text-[#636c5c]">20s rapid-fire Real vs Scam</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold font-mono text-rose-700">
                  {scoreCard.drillScore} <span className="text-[10px] text-[#717a69] font-normal">/ 100</span>
                </span>
                <ChevronRight className="w-4 h-4 text-[#717a69] group-hover:text-rose-800 transition-colors" />
              </div>
            </div>

            {/* Red Flag Spotter */}
            <div
              onClick={() => onPlayMode("redflag")}
              className="p-4 bg-[#f7f9f5] border border-[#e2e6dc] hover:border-purple-400 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all hover:bg-purple-50/50 group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
                  <Flag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#181a15] group-hover:text-purple-800 transition-colors">
                    Red Flag Forensic Spotter
                  </h4>
                  <p className="text-[11px] text-[#636c5c]">Fine-grained tell identification</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold font-mono text-purple-700">
                  {scoreCard.redFlagScore} <span className="text-[10px] text-[#717a69] font-normal">/ 100</span>
                </span>
                <ChevronRight className="w-4 h-4 text-[#717a69] group-hover:text-purple-800 transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {/* 4 Cyber Defense Skill Domains */}
        <div className="p-6 bg-white border border-[#e2e6dc] rounded-3xl space-y-4 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between pb-2 border-b border-[#e2e6dc]">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#181a15] flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#3d5926]" />
              <span>Cyber Defense Domain Metrics</span>
            </span>
            <span className="text-[11px] font-mono text-[#717a69]">Skill Proficiency</span>
          </div>

          <div className="space-y-3.5 pt-1">
            {/* Domain 1 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#383d33] font-medium">Psychological Pressure & Urgency Resistance</span>
                <span className="font-mono font-bold text-rose-700">{urgencyDefense}%</span>
              </div>
              <div className="w-full bg-[#e6ebdf] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full transition-all duration-500"
                  style={{ width: `${urgencyDefense}%` }}
                />
              </div>
            </div>

            {/* Domain 2 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#383d33] font-medium">Deceptive URL & Typosquat Detection</span>
                <span className="font-mono font-bold text-blue-700">{linkAcumen}%</span>
              </div>
              <div className="w-full bg-[#e6ebdf] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full transition-all duration-500"
                  style={{ width: `${linkAcumen}%` }}
                />
              </div>
            </div>

            {/* Domain 3 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#383d33] font-medium">Brand & Authority Impersonation Defense</span>
                <span className="font-mono font-bold text-amber-700">{impersonationDefense}%</span>
              </div>
              <div className="w-full bg-[#e6ebdf] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full transition-all duration-500"
                  style={{ width: `${impersonationDefense}%` }}
                />
              </div>
            </div>

            {/* Domain 4 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#383d33] font-medium">Financial & Non-Reversible Trap Avoidance</span>
                <span className="font-mono font-bold text-purple-700">{financialCaution}%</span>
              </div>
              <div className="w-full bg-[#e6ebdf] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-600 h-full transition-all duration-500"
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
