"use client";

import React, { useState, useEffect, useRef } from "react";
import { RED_FLAG_ARTIFACTS } from "@/lib/data/scam-iq-data";
import { EngineInspectionModal } from "./EngineInspectionModal";
import { soundEffects } from "@/lib/utils/sound-effects";
import {
  Flag,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Timer,
  Activity,
  XCircle,
  Eye,
} from "lucide-react";

interface RedFlagModeProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

export const RedFlagMode: React.FC<RedFlagModeProps> = ({ onComplete, onExit }) => {
  const [phase, setPhase] = useState<"intro" | "play" | "results">("intro");
  const [artifactIdx, setArtifactIdx] = useState(0);
  const [selectedElementIds, setSelectedElementIds] = useState<Set<string>>(new Set());
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [artifactScores, setArtifactScores] = useState<number[]>([]);
  const [isEngineModalOpen, setIsEngineModalOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const artifact = RED_FLAG_ARTIFACTS[artifactIdx];

  // Stopwatch timer
  useEffect(() => {
    if (phase !== "play") return;

    timerRef.current = setInterval(() => {
      setSecondsElapsed((s) => s + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, artifactIdx]);

  const toggleElement = (id: string) => {
    if (phase !== "play") return;
    soundEffects.playClick();
    setSelectedElementIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    let truePositives = 0;
    let falsePositives = 0;

    artifact.elements.forEach((el) => {
      const isSelected = selectedElementIds.has(el.id);
      if (isSelected && el.isRedFlag) {
        truePositives += 1;
      } else if (isSelected && !el.isRedFlag) {
        falsePositives += 1;
      }
    });

    const maxPointsForArtifact = Math.round(100 / RED_FLAG_ARTIFACTS.length);
    const accuracyRatio = Math.max(
      0,
      (truePositives - falsePositives * 0.5) / artifact.totalRedFlags
    );
    const score = Math.min(maxPointsForArtifact, Math.round(accuracyRatio * maxPointsForArtifact));

    if (score >= maxPointsForArtifact * 0.8) {
      soundEffects.playStreak();
    } else {
      soundEffects.playSuccess();
    }

    setArtifactScores((prev) => [...prev, score]);
    setPhase("results");
  };

  const handleNextArtifact = () => {
    soundEffects.playClick();
    if (artifactIdx < RED_FLAG_ARTIFACTS.length - 1) {
      setArtifactIdx((i) => i + 1);
      setSelectedElementIds(new Set());
      setSecondsElapsed(0);
      setPhase("play");
    } else {
      const finalScore = Math.min(100, artifactScores.reduce((a, b) => a + b, 0));
      onComplete(finalScore);
    }
  };

  if (phase === "intro") {
    return (
      <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-white border border-[#e2e6dc] rounded-3xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center space-y-3">
          <div className="inline-flex p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-700 shadow-sm">
            <Flag className="w-10 h-10" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181a15]">Red Flag Spotter Mode</h2>
          <p className="text-xs sm:text-sm text-[#636c5c] max-w-md mx-auto leading-relaxed">
            Find every suspicious tell in real-world scam communications. Miss nothing. Tap each element that betrays fraudulent intent.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-start gap-3 p-4 bg-[#f7f9f5] border border-[#e2e6dc] rounded-2xl">
            <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-[#181a15] mb-0.5">Interactive Forensic Inspection</h4>
              <p className="text-[11px] text-[#636c5c] leading-relaxed">
                Click headers, links, payment calls, and phrasing you identify as fraudulent. Beware: benign security notices also appear! Only flag true threats.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-purple-50/50 border border-purple-200 rounded-2xl">
            <Timer className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-purple-900 mb-0.5">Time & Precision Score</h4>
              <p className="text-[11px] text-purple-800 leading-relaxed">
                Take your time to scrutinize subdomains and psychological pressure. When all red flags are flagged, submit for forensic score evaluation.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-[#e2e6dc]">
          <button
            onClick={onExit}
            className="px-4 py-2 text-xs font-semibold text-[#636c5c] hover:text-[#181a15] transition-colors"
          >
            Back to Hub
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              setPhase("play");
            }}
            className="px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-[#162704] bg-[#bef264] hover:bg-[#aee750] border border-[#a8df4a]/70 transition-all flex items-center gap-2 shadow-sm"
          >
            <span>Start Forensic Scan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Aggregate message payload text for SafeGuard engine scan
  const fullArtifactText = artifact.elements.map((e) => e.displayText).join("\n");

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#e2e6dc]">
        <div className="flex items-center gap-2.5">
          <Flag className="w-4 h-4 text-purple-600" />
          <span className="text-xs font-mono font-bold text-purple-800 uppercase tracking-wider">
            Red Flag Spotter • Case {artifactIdx + 1} of {RED_FLAG_ARTIFACTS.length}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <button
            onClick={() => setIsEngineModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-[#f7f9f5] border border-[#e2e6dc] text-[#181a15] text-xs font-medium hover:bg-[#eef2e7] transition-colors flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5 text-[#3d5926]" />
            <span className="hidden sm:inline">Inspect with</span>
            <span>SafeGuard AI</span>
          </button>
          <span className="text-[#636c5c]">Flagged: <strong className="text-purple-700">{selectedElementIds.size}</strong></span>
          <span className="px-2.5 py-0.5 rounded-lg bg-[#f7f9f5] border border-[#e2e6dc] text-[#181a15] font-bold">
            ⏱️ {secondsElapsed}s
          </span>
        </div>
      </div>

      {/* Artifact Instruction & Metadata */}
      <div className="p-4 sm:p-5 bg-white border border-[#e2e6dc] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] bg-purple-50 text-purple-700 border border-purple-200 font-mono font-semibold">
              {artifact.category}
            </span>
            <h3 className="font-serif text-base font-bold text-[#181a15]">{artifact.title}</h3>
          </div>
          <p className="text-xs text-[#636c5c]">{artifact.subtitle}</p>
        </div>

        {phase === "play" && (
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-[#162704] bg-[#bef264] hover:bg-[#aee750] border border-[#a8df4a]/70 transition-all shadow-sm shrink-0 flex items-center justify-center gap-1.5"
          >
            <span>Submit Inspection ({selectedElementIds.size} Flagged)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Forensic Inspection Board */}
      <div className="p-6 bg-white border border-[#e2e6dc] rounded-3xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#e2e6dc] text-[11px] font-mono">
          <span className="text-purple-700 uppercase tracking-widest flex items-center gap-1.5 font-bold">
            <Eye className="w-3.5 h-3.5" />
            <span>Interactive Forensic Examination Canvas</span>
          </span>
          <span className="text-[#717a69] text-[10px]">
            {phase === "play"
              ? "Click any element below to attach a Red Flag 🚩"
              : "Forensic Analysis Breakdown"}
          </span>
        </div>

        {/* Elements Layout */}
        <div className="space-y-2.5 pt-1">
          {artifact.elements.map((el) => {
            const isSelected = selectedElementIds.has(el.id);

            let borderAndBg =
              "bg-[#f7f9f5] border-[#e2e6dc] hover:border-[#8ec251] text-[#181a15]";

            if (phase === "play") {
              if (isSelected) {
                borderAndBg =
                  "bg-[#eff6e6] border-[#8ec251] text-[#181a15] ring-2 ring-[#8ec251]/40 shadow-xs";
              }
            } else if (phase === "results") {
              if (el.isRedFlag && isSelected) {
                borderAndBg =
                  "bg-[#eef5e6] border-[#8ec251] text-[#2c401c] ring-1 ring-[#8ec251]/30";
              } else if (el.isRedFlag && !isSelected) {
                borderAndBg =
                  "bg-amber-50 border-amber-300 text-amber-900 ring-1 ring-amber-400/30";
              } else if (!el.isRedFlag && isSelected) {
                borderAndBg =
                  "bg-rose-50 border-rose-300 text-rose-900 ring-1 ring-rose-400/30";
              } else {
                borderAndBg = "bg-[#fafbfa] border-[#e2e6dc]/60 text-slate-500 opacity-60";
              }
            }

            return (
              <div
                key={el.id}
                onClick={() => toggleElement(el.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${borderAndBg}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-white border border-[#e2e6dc] text-purple-700 font-semibold">
                        {el.section}
                      </span>
                      <span className="text-xs font-bold text-[#181a15]">{el.label}</span>
                      {el.threatType && phase === "results" && el.isRedFlag && (
                        <span className="text-[10px] font-mono text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                          {el.threatType}
                        </span>
                      )}
                    </div>
                    <div className="text-xs sm:text-[13px] text-[#2c3127] whitespace-pre-wrap font-sans leading-relaxed pt-0.5">
                      {el.displayText}
                    </div>

                    {/* Educational Rationale in Results Phase */}
                    {phase === "results" && (
                      <p className="text-xs text-[#383d33] pt-2 border-t border-[#e2e6dc] leading-relaxed font-sans">
                        <strong className="text-[#181a15]">Analysis:</strong> {el.rationale}
                      </p>
                    )}
                  </div>

                  {/* Status Indicator */}
                  <div className="shrink-0 mt-0.5">
                    {phase === "play" && (
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border uppercase transition-all flex items-center gap-1 ${
                          isSelected
                            ? "bg-[#bef264] text-[#162704] border-[#a8df4a] shadow-xs"
                            : "bg-white text-[#636c5c] border-[#e2e6dc] hover:text-[#181a15]"
                        }`}
                      >
                        {isSelected ? "🚩 Flagged" : "Flag"}
                      </span>
                    )}

                    {phase === "results" && (
                      <div className="text-[11px] font-bold">
                        {el.isRedFlag && isSelected && (
                          <span className="px-2 py-1 rounded-lg bg-[#eef5e6] text-[#3d5926] border border-[#d5e0cb] flex items-center gap-1 font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#5c8a27]" />
                            <span>Caught! (+pts)</span>
                          </span>
                        )}
                        {el.isRedFlag && !isSelected && (
                          <span className="px-2 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1 font-mono">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Missed Tell</span>
                          </span>
                        )}
                        {!el.isRedFlag && isSelected && (
                          <span className="px-2 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1 font-mono">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            <span>False Alarm</span>
                          </span>
                        )}
                        {!el.isRedFlag && !isSelected && (
                          <span className="text-[10px] text-slate-400 font-mono">Benign (OK)</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Results Phase Footer Action */}
      {phase === "results" && (
        <div className="p-5 bg-white border border-[#e2e6dc] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs text-[#383d33]">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>
              Case Score: <strong className="text-purple-700 font-mono text-sm">{artifactScores[artifactScores.length - 1] || 0}</strong> points awarded.
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => setIsEngineModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2 rounded-2xl text-xs font-semibold bg-[#f7f9f5] hover:bg-[#eef2e7] text-[#181a15] border border-[#e2e6dc] transition-colors flex items-center justify-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 text-[#3d5926]" />
              <span>SafeGuard AI Verdict</span>
            </button>
            <button
              onClick={handleNextArtifact}
              className="w-full sm:w-auto px-6 py-2 rounded-2xl text-xs sm:text-sm font-bold text-[#162704] bg-[#bef264] hover:bg-[#aee750] border border-[#a8df4a]/70 transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>{artifactIdx < RED_FLAG_ARTIFACTS.length - 1 ? "Next Forensic Case" : "Complete Red Flag Mode"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SafeGuard AI Engine Diagnostic Modal */}
      <EngineInspectionModal
        isOpen={isEngineModalOpen}
        onClose={() => setIsEngineModalOpen(false)}
        messageText={fullArtifactText}
        sourceTitle={artifact.title}
      />
    </div>
  );
};
