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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Top Action Bar */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Recipient Name:</span>
            {isEditing ? (
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                onBlur={() => setIsEditing(false)}
                onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
                autoFocus
                className="px-2.5 py-1 text-xs rounded bg-slate-800 border border-slate-700 text-white font-medium focus:outline-none focus:border-cyan-400"
              />
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs font-semibold text-cyan-300 hover:underline flex items-center gap-1.5"
              >
                <span>{recipientName}</span>
                <span className="text-[10px] text-slate-400">(Click to edit)</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas */}
        <div className="p-6 sm:p-10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col items-center text-center space-y-6 relative border-8 border-slate-800/80 m-4 rounded-2xl">
          {/* Ornate Corner Accents */}
          <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-cyan-400/60" />
          <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-cyan-400/60" />
          <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-cyan-400/60" />
          <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-cyan-400/60" />

          {/* Crest */}
          <div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-cyan-400/40 text-cyan-300 shadow-xl shadow-cyan-500/10">
            <Shield className="w-10 h-10" />
          </div>

          {/* Titles */}
          <div className="space-y-1">
            <span className="text-[11px] font-mono tracking-widest uppercase text-cyan-400 font-bold">
              SafeGuard AI • ScamAdviser Fraud Defense Initiative
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-wide text-white uppercase">
              Certificate of Fraud Defense Acumen
            </h1>
            <p className="text-xs text-slate-400 font-serif italic">
              This credential is officially conferred to verify digital threat awareness & fraud resilience
            </p>
          </div>

          {/* Recipient */}
          <div className="py-2 border-b-2 border-cyan-400/40 w-full max-w-md">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
              {recipientName}
            </span>
          </div>

          {/* Achievement Description */}
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed font-sans">
            for successfully completing the rigorous 3-stage Scam IQ Assessment with an accredited score of{" "}
            <span className="font-bold text-white">{scoreCard.totalScore} / 300</span> points, demonstrating the rank of{" "}
            <span className="font-bold text-cyan-300 underline decoration-cyan-500/60 underline-offset-4">
              {scoreCard.tier}
            </span>{" "}
            in detecting psychological coercion, homoglyph lookalikes, and non-reversible financial extraction.
          </p>

          {/* Module Scores Grid */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-md pt-2">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Scenario Quiz</span>
              <div className="text-base font-bold text-amber-400 font-mono">
                {scoreCard.quizScore}/100
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Instinct Drill</span>
              <div className="text-base font-bold text-rose-400 font-mono">
                {scoreCard.drillScore}/100
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Red Flag Spotter</span>
              <div className="text-base font-bold text-purple-400 font-mono">
                {scoreCard.redFlagScore}/100
              </div>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="w-full max-w-xl pt-6 flex items-end justify-between text-left text-xs border-t border-slate-800/80">
            <div>
              <div className="font-mono text-[10px] text-slate-400">CERTIFICATE SERIAL ID</div>
              <div className="font-mono text-xs font-bold text-cyan-400">{certId}</div>
              <div className="text-[10px] text-slate-500 font-mono">ISSUED: {todayStr}</div>
            </div>

            {/* Simulated Gold Seal */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full border-2 border-amber-400/60 bg-amber-500/10 flex items-center justify-center text-amber-300 shadow-lg shadow-amber-500/10">
                <Award className="w-7 h-7" />
              </div>
              <span className="text-[9px] uppercase font-mono text-amber-400/80 pt-1">
                VERIFIED EVALUATION
              </span>
            </div>

            <div className="text-right">
              <div className="font-serif italic text-slate-300 text-sm">SafeGuard Engine</div>
              <div className="text-[10px] text-slate-500 font-mono">Algorithmic Evaluator</div>
              <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 justify-end">
                <CheckCircle2 className="w-3 h-3" />
                <span>Deterministic Proof</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
