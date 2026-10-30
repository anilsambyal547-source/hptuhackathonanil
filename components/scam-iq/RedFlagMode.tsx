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
      <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-slate-900/90 border border-purple-500/30 rounded-3xl shadow-2xl backdrop-blur-md space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center space-y-3">
          <div className="inline-flex p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 shadow-xl shadow-purple-500/10">
            <Flag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Red Flag Spotter Mode</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Find every suspicious tell in real-world scam communications. Miss nothing. Tap each element that betrays fraudulent intent.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-start gap-3 p-4 bg-slate-950/80 border border-slate-800 rounded-2xl">
            <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white mb-0.5">Interactive Forensic Inspection</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Click headers, links, payment calls, and phrasing you identify as fraudulent. Beware: benign security notices also appear! Only flag true threats.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-slate-950/80 border border-purple-500/20 rounded-2xl bg-purple-950/10">
            <Timer className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-purple-300 mb-0.5">Time & Precision Score</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Take your time to scrutinize subdomains and psychological pressure. When all red flags are flagged, submit for forensic score evaluation.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-800">
          <button
            onClick={onExit}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Back to Hub
          </button>
          <button
            onClick={() => {
              soundEffects.playClick();
              setPhase("play");
            }}
            className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all flex items-center gap-2 shadow-lg shadow-purple-500/25"
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
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <Flag className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider">
            Red Flag Spotter • Case {artifactIdx + 1} of {RED_FLAG_ARTIFACTS.length}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <button
            onClick={() => setIsEngineModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-medium hover:bg-cyan-900/60 transition-colors flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Inspect with</span>
            <span>SafeGuard AI</span>
          </button>
          <span className="text-slate-400">Flagged: <strong className="text-purple-300">{selectedElementIds.size}</strong></span>
          <span className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-purple-300 font-bold">
            ⏱️ {secondsElapsed}s
          </span>
        </div>
      </div>

      {/* Artifact Instruction & Metadata */}
      <div className="p-4 sm:p-5 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono font-semibold">
              {artifact.category}
            </span>
            <h3 className="text-base font-bold text-white">{artifact.title}</h3>
          </div>
          <p className="text-xs text-slate-400">{artifact.subtitle}</p>
        </div>

        {phase === "play" && (
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-purple-400 to-indigo-300 hover:from-purple-300 hover:to-indigo-200 transition-all shadow-md shadow-purple-500/20 shrink-0 flex items-center justify-center gap-1.5"
          >
            <span>Submit Inspection ({selectedElementIds.size} Flagged)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Forensic Inspection Board */}
      <div className="p-6 bg-slate-950 border-2 border-purple-500/30 rounded-3xl shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-[11px] font-mono">
          <span className="text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span>Interactive Forensic Examination Canvas</span>
          </span>
          <span className="text-slate-500 text-[10px]">
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
              "bg-slate-900/60 border-slate-800 hover:border-purple-500/60 text-slate-200";

            if (phase === "play") {
              if (isSelected) {
                borderAndBg =
                  "bg-purple-950/60 border-purple-500 text-purple-100 ring-2 ring-purple-500/40 shadow-lg shadow-purple-950/40";
              }
            } else if (phase === "results") {
              if (el.isRedFlag && isSelected) {
                borderAndBg =
                  "bg-emerald-950/50 border-emerald-500/90 text-emerald-100 ring-1 ring-emerald-500/30";
              } else if (el.isRedFlag && !isSelected) {
                borderAndBg =
                  "bg-amber-950/50 border-amber-500/90 text-amber-100 ring-1 ring-amber-500/30";
              } else if (!el.isRedFlag && isSelected) {
                borderAndBg =
                  "bg-rose-950/50 border-rose-500/90 text-rose-100 ring-1 ring-rose-500/30";
              } else {
                borderAndBg = "bg-slate-950/40 border-slate-800/80 text-slate-500 opacity-60";
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
                      <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-purple-300 font-semibold">
                        {el.section}
                      </span>
                      <span className="text-xs font-bold text-white">{el.label}</span>
                      {el.threatType && phase === "results" && el.isRedFlag && (
                        <span className="text-[10px] font-mono text-rose-400 bg-rose-950/60 px-1.5 py-0.2 rounded border border-rose-800/40">
                          {el.threatType}
                        </span>
                      )}
                    </div>
                    <div className="text-xs sm:text-[13px] text-slate-200 whitespace-pre-wrap font-sans leading-relaxed pt-0.5">
                      {el.displayText}
                    </div>

                    {/* Educational Rationale in Results Phase */}
                    {phase === "results" && (
                      <p className="text-xs text-slate-300 pt-2 border-t border-slate-800/80 leading-relaxed font-sans">
                        <strong className="text-white">Analysis:</strong> {el.rationale}
                      </p>
                    )}
                  </div>

                  {/* Status Indicator */}
                  <div className="shrink-0 mt-0.5">
                    {phase === "play" && (
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border uppercase transition-all flex items-center gap-1 ${
                          isSelected
                            ? "bg-purple-500 text-slate-950 border-purple-400 shadow-md shadow-purple-500/20"
                            : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
                        }`}
                      >
                        {isSelected ? "🚩 Flagged" : "Flag"}
                      </span>
                    )}

                    {phase === "results" && (
                      <div className="text-[11px] font-bold">
                        {el.isRedFlag && isSelected && (
                          <span className="px-2 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800/40 flex items-center gap-1 font-mono">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Caught! (+pts)</span>
                          </span>
                        )}
                        {el.isRedFlag && !isSelected && (
                          <span className="px-2 py-1 rounded-lg bg-amber-950 text-amber-300 border border-amber-800/40 flex items-center gap-1 font-mono">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                            <span>Missed Tell</span>
                          </span>
                        )}
                        {!el.isRedFlag && isSelected && (
                          <span className="px-2 py-1 rounded-lg bg-rose-950 text-rose-300 border border-rose-800/40 flex items-center gap-1 font-mono">
                            <XCircle className="w-3.5 h-3.5 text-rose-400" />
                            <span>False Alarm</span>
                          </span>
                        )}
                        {!el.isRedFlag && !isSelected && (
                          <span className="text-[10px] text-slate-500 font-mono">Benign (OK)</span>
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
        <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>
              Case Score: <strong className="text-purple-300 font-mono text-sm">{artifactScores[artifactScores.length - 1] || 0}</strong> points awarded.
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => setIsEngineModalOpen(true)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>SafeGuard AI Verdict</span>
            </button>
            <button
              onClick={handleNextArtifact}
              className="w-full sm:w-auto px-6 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/25"
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
