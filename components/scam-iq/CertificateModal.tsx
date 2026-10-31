"use client";

import React, { useState } from "react";
import { X, Award, Shield, Printer, CheckCircle2 } from "lucide-react";
import { ScamIqScoreCard } from "@/lib/types/scam-iq";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  scoreCard: ScamIqScoreCard;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  scoreCard,
}) => {
  const [recipientName, setRecipientName] = useState("Cybersecurity Analyst");
  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const certId = `SG-IQ-${Math.abs(scoreCard.timestamp % 1000000)
    .toString()
    .padStart(6, "0")}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181a15]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl flex flex-col bg-white border border-[#e2e6dc] rounded-3xl shadow-2xl overflow-hidden text-[#181a15]">
        {/* Top Action Bar */}
        <div className="p-4 bg-[#f7f9f5] border-b border-[#e2e6dc] flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#636c5c]">Recipient Name:</span>
            {isEditing ? (
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                onBlur={() => setIsEditing(false)}
                onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
                autoFocus
                className="px-2.5 py-1 text-xs rounded-xl bg-white border border-[#e2e6dc] text-[#181a15] font-medium focus:outline-none focus:border-[#8ec251]"
              />
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs font-semibold text-[#181a15] hover:underline flex items-center gap-1.5"
              >
                <span>{recipientName}</span>
                <span className="text-[10px] text-[#717a69]">(Click to edit)</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-2xl text-xs font-bold bg-[#bef264] hover:bg-[#aee750] text-[#162704] border border-[#a8df4a]/70 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#717a69] hover:text-[#181a15] hover:bg-[#eef2e7] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas */}
        <div className="p-6 sm:p-10 bg-[#fafaf7] text-[#181a15] flex flex-col items-center text-center space-y-6 relative border-8 border-[#3d5926]/20 m-4 rounded-2xl">
          {/* Ornate Corner Accents */}
          <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-[#3d5926]" />
          <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-[#3d5926]" />
          <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-[#3d5926]" />
          <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-[#3d5926]" />

          {/* Crest */}
          <div className="inline-flex p-3.5 rounded-2xl bg-[#eef5e6] border border-[#d5e0cb] text-[#3d5926] shadow-sm">
            <Shield className="w-10 h-10" />
          </div>

          {/* Titles */}
          <div className="space-y-1">
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#3d5926] font-bold">
              SafeGuard AI • ScamAdviser Fraud Defense Initiative
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-wide text-[#181a15] uppercase">
              Certificate of Fraud Defense Acumen
            </h1>
            <p className="text-xs text-[#636c5c] font-serif italic">
              This credential is officially conferred to verify digital threat awareness & fraud resilience
            </p>
          </div>

          {/* Recipient */}
          <div className="py-2 border-b-2 border-[#3d5926]/40 w-full max-w-md">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-[#181a15] tracking-tight">
              {recipientName}
            </span>
          </div>

          {/* Achievement Description */}
          <p className="text-xs sm:text-sm text-[#383d33] max-w-lg leading-relaxed font-sans">
            for successfully completing the rigorous 3-stage Scam IQ Assessment with an accredited score of{" "}
            <span className="font-bold text-[#181a15]">{scoreCard.totalScore} / 300</span> points, demonstrating the rank of{" "}
            <span className="font-bold text-[#3d5926] underline decoration-[#8ec251] underline-offset-4">
              {scoreCard.tier}
            </span>{" "}
            in detecting psychological coercion, homoglyph lookalikes, and non-reversible financial extraction.
          </p>

          {/* Module Scores Grid */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-md pt-2">
            <div className="p-2.5 rounded-xl bg-white border border-[#e2e6dc] text-center shadow-2xs">
              <span className="text-[10px] text-[#717a69] uppercase font-mono">Scenario Quiz</span>
              <div className="text-base font-bold text-amber-700 font-mono">
                {scoreCard.quizScore}/100
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-[#e2e6dc] text-center shadow-2xs">
              <span className="text-[10px] text-[#717a69] uppercase font-mono">Instinct Drill</span>
              <div className="text-base font-bold text-rose-700 font-mono">
                {scoreCard.drillScore}/100
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-[#e2e6dc] text-center shadow-2xs">
              <span className="text-[10px] text-[#717a69] uppercase font-mono">Red Flag Spotter</span>
              <div className="text-base font-bold text-purple-700 font-mono">
                {scoreCard.redFlagScore}/100
              </div>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="w-full max-w-xl pt-6 flex items-end justify-between text-left text-xs border-t border-[#e2e6dc]">
            <div>
              <div className="font-mono text-[10px] text-[#717a69]">CERTIFICATE SERIAL ID</div>
              <div className="font-mono text-xs font-bold text-[#3d5926]">{certId}</div>
              <div className="text-[10px] text-[#717a69] font-mono">ISSUED: {todayStr}</div>
            </div>

            {/* Simulated Gold Seal */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full border-2 border-amber-400 bg-amber-50 flex items-center justify-center text-amber-700 shadow-sm">
                <Award className="w-7 h-7" />
              </div>
              <span className="text-[9px] uppercase font-mono text-amber-800 pt-1 font-bold">
                VERIFIED EVALUATION
              </span>
            </div>

            <div className="text-right">
              <div className="font-serif italic text-[#181a15] text-sm">SafeGuard Engine</div>
              <div className="text-[10px] text-[#717a69] font-mono">Algorithmic Evaluator</div>
              <div className="text-[10px] text-[#3d5926] font-mono flex items-center gap-1 justify-end font-semibold">
                <CheckCircle2 className="w-3 h-3 text-[#5c8a27]" />
                <span>Deterministic Proof</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
