"use client";

import React, { useState, useEffect, useRef } from "react";
import { RED_FLAG_ARTIFACTS } from "@/lib/data/scam-iq-data";
import { Flag, CheckCircle2, AlertCircle, Sparkles, ArrowRight, Timer } from "lucide-react";

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
    setSelectedElementIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    // Calculate score for this artifact
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

    const maxPointsForArtifact = Math.round(100 / RED_FLAG_ARTIFACTS.length); // ~33 pts each
    const accuracyRatio = Math.max(
      0,
      (truePositives - falsePositives * 0.5) / artifact.totalRedFlags
    );
    const score = Math.min(maxPointsForArtifact, Math.round(accuracyRatio * maxPointsForArtifact));

    setArtifactScores((prev) => [...prev, score]);
    setPhase("results");
  };

  const handleNextArtifact = () => {
    if (artifactIdx < RED_FLAG_ARTIFACTS.length - 1) {
      setArtifactIdx((i) => i + 1);
      setSelectedElementIds(new Set());
      setSecondsElapsed(0);
      setPhase("play");
    } else {
      // Completed all artifacts
      const finalScore = Math.min(100, artifactScores.reduce((a, b) => a + b, 0));
      onComplete(finalScore);
    }
  };

  if (phase === "intro") {
    return (
      <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-slate-900/90 border border-purple-500/30 rounded-2xl shadow-xl backdrop-blur-md space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center space-y-3">
          <div className="inline-flex p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Flag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Red Flag Mode</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Find every suspicious detail. Miss nothing. Tap each element that represents a fraudulent tell.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-start gap-3 p-4 bg-slate-950/80 border border-slate-800 rounded-xl">
            <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-white mb-0.5">Tap everything suspicious</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Read the simulated message or notice carefully. Click every part you believe is deceptive. Some items may look formal but are benign—only flag genuine threats!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-slate-950/80 border border-purple-500/20 rounded-xl bg-purple-950/10">
            <Timer className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-purple-300 mb-0.5">The timer stops when you hit Submit</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Take the time you need to examine URLs, phone numbers, and urgency tactics. When you have selected all flags, click Submit to view your precision breakdown.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-slate-800">
          <button
            onClick={onExit}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Back to Modes
          </button>
          <button
            onClick={() => setPhase("play")}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all flex items-center gap-2 shadow-lg shadow-purple-500/25"
          >
            <span>Start Investigation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Flag className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-mono font-semibold text-purple-300 uppercase tracking-wider">
            Red Flag Spotter • {artifactIdx + 1} of {RED_FLAG_ARTIFACTS.length}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-slate-400">Selected: {selectedElementIds.size}</span>
          <span className="px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-purple-300 font-bold">
            ⏱️ {secondsElapsed}s
          </span>
        </div>
      </div>

      {/* Artifact Instruction */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
        <h3 className="text-sm font-bold text-white">{artifact.title}</h3>
        <p className="text-xs text-slate-400">{artifact.subtitle}</p>
      </div>

      {/* Interactive Artifact Box */}
      <div className="p-5 sm:p-6 bg-slate-950 border border-purple-500/30 rounded-2xl shadow-xl space-y-3 font-mono">
        <div className="text-[11px] text-purple-400 uppercase tracking-widest pb-1 border-b border-slate-800 flex items-center justify-between">
          <span>Interactive Investigation Console</span>
          <span className="text-[10px] text-slate-500">Tap elements below to flag</span>
        </div>

        {/* Clickable Elements */}
        <div className="space-y-2 pt-2">
          {artifact.elements.map((el) => {
            const isSelected = selectedElementIds.has(el.id);

            let borderAndBg =
              "bg-slate-900/60 border-slate-800 hover:border-purple-500/50 text-slate-300";

            if (phase === "play") {
              if (isSelected) {
                borderAndBg =
                  "bg-purple-950/50 border-purple-500 text-purple-200 ring-1 ring-purple-500/40 shadow-sm shadow-purple-500/20";
              }
            } else if (phase === "results") {
              if (el.isRedFlag && isSelected) {
                // Correctly caught
                borderAndBg = "bg-emerald-950/40 border-emerald-500/80 text-emerald-200";
              } else if (el.isRedFlag && !isSelected) {
                // Missed
                borderAndBg = "bg-amber-950/40 border-amber-500/80 text-amber-200";
              } else if (!el.isRedFlag && isSelected) {
                // False positive
                borderAndBg = "bg-rose-950/40 border-rose-500/80 text-rose-200";
              } else {
                // Benign not selected
                borderAndBg = "bg-slate-950/40 border-slate-800/80 text-slate-500";
              }
            }

            return (
              <div
                key={el.id}
                onClick={() => toggleElement(el.id)}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${borderAndBg}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-black/40 text-slate-400 font-mono">
                        {el.section}
                      </span>
                      <span className="font-semibold text-slate-100">{el.label}</span>
                    </div>
                    <div className="text-[12px] text-slate-300 whitespace-pre-wrap font-sans pt-0.5">
                      {el.displayText}
                    </div>
                  </div>

                  <div className="shrink-0 mt-0.5">
                    {phase === "play" && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase transition-colors ${
                          isSelected
                            ? "bg-purple-500 text-slate-950 border-purple-400"
                            : "bg-slate-900 text-slate-500 border-slate-800"
                        }`}
                      >
                        {isSelected ? "🚩 Flagged" : "Tap"}
                      </span>
                    )}

                    {phase === "results" && (
                      <div className="text-[10px] font-bold">
                        {el.isRedFlag && isSelected && (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Caught!</span>
                          </span>
                        )}
                        {el.isRedFlag && !isSelected && (
                          <span className="text-amber-400 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Missed</span>
                          </span>
                        )}
                        {!el.isRedFlag && isSelected && (
                          <span className="text-rose-400 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>False Alarm</span>
                          </span>
                        )}
                        {!el.isRedFlag && !isSelected && (
                          <span className="text-slate-500">Safe</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Show detailed rationale when in results phase */}
                {phase === "results" && (
                  <div className="mt-2.5 pt-2 border-t border-white/10 text-[11px] font-sans text-slate-300 leading-relaxed">
                    <span className="font-semibold text-white">
                      {el.isRedFlag ? "🔴 Threat Vector: " : "🟢 Analysis: "}
                    </span>
                    {el.threatType && <span className="font-bold text-purple-300">{el.threatType} — </span>}
                    {el.rationale}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Bar */}
      {phase === "play" && (
        <div className="flex justify-between items-center pt-2">
          <p className="text-xs text-slate-400">
            Selected <span className="font-bold text-purple-300">{selectedElementIds.size}</span> elements
          </p>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/25 transition-all flex items-center gap-2"
          >
            <span>Submit Investigation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {phase === "results" && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center">
          <div className="text-xs text-slate-300">
            Investigation complete in <span className="font-bold text-purple-300">{secondsElapsed}s</span>.
          </div>
          <button
            onClick={handleNextArtifact}
            className="px-6 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-purple-400 to-indigo-400 hover:from-purple-300 hover:to-indigo-300 shadow-md transition-all flex items-center gap-2"
          >
            <span>{artifactIdx < RED_FLAG_ARTIFACTS.length - 1 ? "Next Investigation" : "Finish Red Flag Mode"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
