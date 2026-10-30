"use client";

import React, { useState, useEffect, useRef } from "react";
import { DRILL_ITEMS } from "@/lib/data/scam-iq-data";
import { Timer, Zap, Flame, ShieldAlert, ShieldCheck, ArrowRight } from "lucide-react";

interface DrillModeProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

const QUESTION_TIME_LIMIT = 20; // 20 seconds per question like ScamAdviser

export const DrillMode: React.FC<DrillModeProps> = ({ onComplete, onExit }) => {
  const [phase, setPhase] = useState<"intro" | "playing" | "answered">("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [lastAnswer, setLastAnswer] = useState<"scam" | "safe" | "timeout" | null>(null);
  const [streak, setStreak] = useState(0);
  const [earnedPoints, setEarnedPoints] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentItem = DRILL_ITEMS[currentIndex];

  // Timer loop
  useEffect(() => {
    if (phase !== "playing") return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, currentIndex]);

  const handleTimeout = () => {
    setLastAnswer("timeout");
    setStreak(0);
    setEarnedPoints((prev) => [...prev, 0]);
    setPhase("answered");
  };

  const handleAnswer = (choice: "scam" | "legit") => {
    if (phase !== "playing") return;
    if (timerRef.current) clearInterval(timerRef.current);

    const isCorrect = choice === currentItem.type;
    setLastAnswer(choice === "scam" ? "scam" : "safe");

    if (isCorrect) {
      // Speed multiplier
      let points = 10;
      if (timeLeft >= 15) points = 10;      // Answered under 5s
      else if (timeLeft >= 8) points = 8;   // Answered under 12s
      else points = 6;                       // Answered late

      setStreak((s) => s + 1);
      setEarnedPoints((prev) => [...prev, points]);
    } else {
      setStreak(0);
      setEarnedPoints((prev) => [...prev, 0]);
    }

    setPhase("answered");
  };

  const handleNextItem = () => {
    if (currentIndex < DRILL_ITEMS.length - 1) {
      setCurrentIndex((i) => i + 1);
      setTimeLeft(QUESTION_TIME_LIMIT);
      setPhase("playing");
      setLastAnswer(null);
    } else {
      // Completed all items
      const totalPoints = earnedPoints.reduce((a, b) => a + b, 0);
      const normalizedScore = Math.min(100, Math.round(totalPoints));
      onComplete(normalizedScore);
    }
  };

  const startDrill = () => {
    setCurrentIndex(0);
    setTimeLeft(QUESTION_TIME_LIMIT);
    setStreak(0);
    setEarnedPoints([]);
    setPhase("playing");
  };

  if (phase === "intro") {
    return (
      <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-slate-900/90 border border-rose-500/30 rounded-2xl shadow-xl backdrop-blur-md space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center space-y-3">
          <div className="inline-flex p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500">
            <Zap className="w-10 h-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Simulator Drill Mode</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Real or Scam? Make the call, message after message. Trust your gut instincts under time pressure.
          </p>
        </div>

        {/* 4 Rules Cards matching ScamAdviser */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs">
              <Timer className="w-4 h-4" />
              <span>20s per question</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Scammers rely on urgency - so do we. The clock never stops ticking.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
              <Flame className="w-4 h-4" />
              <span>Speed is everything</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Spot it fast, score high. Answering in the first 5 seconds earns maximum IQ points.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs">
              <ShieldAlert className="w-4 h-4" />
              <span>Timeout = 0 pts</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Hesitation in the real world causes loss. No answer means zero points.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>SCAM or SAFE</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Two choices only. Analyze signals, make the split-second decision.
            </p>
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
            onClick={startDrill}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 transition-all flex items-center gap-2 shadow-lg shadow-rose-500/25"
          >
            <span>Start Drill (10 Scenarios)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const isCorrect =
    phase === "answered" &&
    ((lastAnswer === "scam" && currentItem.type === "scam") ||
      (lastAnswer === "safe" && currentItem.type === "legit"));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Status & Live Countdown Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-rose-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-rose-500" />
            <span>Drill Scenario {currentIndex + 1} / {DRILL_ITEMS.length}</span>
          </span>
          <div className="flex items-center gap-4">
            {streak > 1 && (
              <span className="text-amber-400 font-bold flex items-center gap-1 animate-bounce">
                <Flame className="w-3.5 h-3.5" />
                <span>{streak} Streak!</span>
              </span>
            )}
            <span
              className={`font-bold text-sm px-2.5 py-0.5 rounded-md border ${timeLeft <= 5
                  ? "bg-rose-950/80 text-rose-400 border-rose-600 animate-pulse"
                  : "bg-slate-900 text-slate-300 border-slate-800"
                }`}
            >
              ⏱️ {timeLeft}s
            </span>
          </div>
        </div>

        {/* Shrinking Timer Progress Bar */}
        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-1000 ${timeLeft <= 5
                ? "bg-rose-500 shadow-sm shadow-rose-500"
                : timeLeft <= 10
                  ? "bg-amber-500"
                  : "bg-cyan-500"
              }`}
            style={{ width: `${(timeLeft / QUESTION_TIME_LIMIT) * 100}%` }}
          />
        </div>
      </div>

      {/* Scenario Card */}
      <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
            {currentItem.category}
          </span>
          <span className="text-xs font-mono text-slate-500">ID: {currentItem.sender}</span>
        </div>

        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs sm:text-sm text-slate-100 leading-relaxed space-y-2">
          <div>{currentItem.content}</div>
          {currentItem.url && (
            <div className="text-[11px] text-rose-400 break-all select-all pt-1 font-semibold">
              Link: {currentItem.url}
            </div>
          )}
        </div>

        {/* Action Buttons: SCAM vs SAFE */}
        {phase === "playing" && (
          <div className="grid grid-cols-2 gap-4 pt-2">
            <button
              onClick={() => handleAnswer("scam")}
              className="py-4 px-6 rounded-xl font-black text-sm sm:text-base tracking-wider uppercase text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 border border-red-500/50 shadow-lg shadow-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-5 h-5" />
              <span>SCAM</span>
            </button>

            <button
              onClick={() => handleAnswer("legit")}
              className="py-4 px-6 rounded-xl font-black text-sm sm:text-base tracking-wider uppercase text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 border border-emerald-500/50 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>SAFE</span>
            </button>
          </div>
        )}

        {/* Answer Feedback Card */}
        {phase === "answered" && (
          <div className="space-y-4 pt-2 animate-in fade-in duration-200">
            <div
              className={`p-4 rounded-xl border ${lastAnswer === "timeout"
                  ? "bg-slate-950 border-amber-600/60 text-amber-300"
                  : isCorrect
                    ? "bg-emerald-950/40 border-emerald-500/60 text-emerald-200"
                    : "bg-rose-950/40 border-rose-500/60 text-rose-200"
                }`}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                <span className="font-bold text-sm sm:text-base flex items-center gap-2">
                  {lastAnswer === "timeout" ? (
                    <>⏱️ Time Expired (0 pts)</>
                  ) : isCorrect ? (
                    <>✅ Correct! Spot on.</>
                  ) : (
                    <>❌ Wrong call.</>
                  )}
                </span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-black/40">
                  Actual: {currentItem.type.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentItem.explanation}
              </p>

              {currentItem.keyIndicators.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {currentItem.keyIndicators.map((ind, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-700 text-slate-300 font-mono"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextItem}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-950 bg-gradient-to-r from-rose-400 to-red-400 hover:from-rose-300 hover:to-red-300 transition-all flex items-center gap-2 shadow-md shadow-rose-500/20"
              >
                <span>{currentIndex < DRILL_ITEMS.length - 1 ? "Next Scenario" : "Complete Drill"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
