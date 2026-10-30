"use client";

import React, { useState, useEffect, useRef } from "react";
import { DRILL_ITEMS } from "@/lib/data/scam-iq-data";
import { PhoneMockup } from "./PhoneMockup";
import { EngineInspectionModal } from "./EngineInspectionModal";
import { soundEffects } from "@/lib/utils/sound-effects";
import {
  Timer,
  Zap,
  Flame,
  ShieldAlert,
  ShieldCheck,
  ArrowRight,
  Activity,
  Award,
} from "lucide-react";

interface DrillModeProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

const QUESTION_TIME_LIMIT = 20;

export const DrillMode: React.FC<DrillModeProps> = ({ onComplete, onExit }) => {
  const [phase, setPhase] = useState<"intro" | "playing" | "answered">("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [lastAnswer, setLastAnswer] = useState<"scam" | "legit" | "timeout" | null>(null);
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [earnedPoints, setEarnedPoints] = useState<number[]>([]);
  const [isEngineModalOpen, setIsEngineModalOpen] = useState(false);
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
        if (prev <= 6) {
          soundEffects.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, currentIndex]);

  const handleTimeout = () => {
    soundEffects.playError();
    setLastAnswer("timeout");
    setStreak(0);
    setEarnedPoints((prev) => [...prev, 0]);
    setPhase("answered");
  };

  const handleAnswer = (choice: "scam" | "legit") => {
    if (phase !== "playing") return;
    if (timerRef.current) clearInterval(timerRef.current);

    const isCorrect = choice === currentItem.type;
    setLastAnswer(choice);

    if (isCorrect) {
      let points = 10;
      if (timeLeft >= 15) points = 10;
      else if (timeLeft >= 8) points = 8;
      else points = 6;

      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > highestStreak) setHighestStreak(newStreak);

      if (newStreak >= 3) {
        soundEffects.playStreak();
      } else {
        soundEffects.playSuccess();
      }

      setEarnedPoints((prev) => [...prev, points]);
    } else {
      soundEffects.playError();
      setStreak(0);
      setEarnedPoints((prev) => [...prev, 0]);
    }

    setPhase("answered");
  };

  const handleNextItem = () => {
    soundEffects.playClick();
    if (currentIndex < DRILL_ITEMS.length - 1) {
      setCurrentIndex((i) => i + 1);
      setTimeLeft(QUESTION_TIME_LIMIT);
      setPhase("playing");
      setLastAnswer(null);
    } else {
      const totalPoints = earnedPoints.reduce((a, b) => a + b, 0);
      const normalizedScore = Math.min(100, Math.round(totalPoints));
      onComplete(normalizedScore);
    }
  };

  const startDrill = () => {
    soundEffects.playClick();
    setCurrentIndex(0);
    setTimeLeft(QUESTION_TIME_LIMIT);
    setStreak(0);
    setHighestStreak(0);
    setEarnedPoints([]);
    setPhase("playing");
  };

  if (phase === "intro") {
    return (
      <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-slate-900/90 border border-rose-500/30 rounded-3xl shadow-2xl backdrop-blur-md space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center space-y-3">
          <div className="inline-flex p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 shadow-xl shadow-rose-500/10">
            <Zap className="w-10 h-10" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Simulator Drill Mode</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Real or Scam? Make the call, message after message. Trust your gut instincts under rapid 20-second active pressure.
          </p>
        </div>

        {/* 4 Rules Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs">
              <Timer className="w-4 h-4" />
              <span>20s Rapid Clock</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Scammers manipulate urgency—we simulate it. Answer before the clock runs out to keep points.
            </p>
          </div>

          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
              <Flame className="w-4 h-4" />
              <span>Streak Multiplier</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Consecutive correct calls ignite fire streaks. Fast decisions under 5 seconds earn max points.
            </p>
          </div>

          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
              <Activity className="w-4 h-4" />
              <span>SafeGuard AI Verification</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Verify any drill item instantly using our integrated 4-layer heuristic and passive URL engine.
            </p>
          </div>

          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
              <Award className="w-4 h-4" />
              <span>10 Fast-Paced Rounds</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Curated mix of sophisticated Indian financial phishing vs legitimate transactional SMS.
            </p>
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
            onClick={startDrill}
            className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 transition-all flex items-center gap-2 shadow-lg shadow-rose-500/25"
          >
            <span>Start Drill</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Calculate Timer Percentage & Color
  const timerPercent = (timeLeft / QUESTION_TIME_LIMIT) * 100;
  const isUrgent = timeLeft <= 5;
  const isWarning = timeLeft <= 10 && !isUrgent;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Bar with Timer Ring & Streak Indicator */}
      <div className="flex items-center justify-between p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
            Drill Round {currentIndex + 1} / {DRILL_ITEMS.length}
          </span>
          {streak >= 2 && (
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold animate-pulse">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{streak}x STREAK!</span>
            </div>
          )}
        </div>

        {/* Circular Countdown Timer */}
        <div className="flex items-center gap-2">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg className="w-10 h-10 transform -rotate-90">
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="currentColor"
                strokeWidth="3"
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx="20"
                cy="20"
                r="16"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray="100"
                strokeDashoffset={100 - timerPercent}
                strokeLinecap="round"
                className={`transition-all duration-1000 ${
                  isUrgent
                    ? "text-rose-500 animate-pulse"
                    : isWarning
                    ? "text-amber-400"
                    : "text-emerald-400"
                }`}
                fill="transparent"
              />
            </svg>
            <span
              className={`absolute text-xs font-mono font-black ${
                isUrgent ? "text-rose-400" : isWarning ? "text-amber-400" : "text-white"
              }`}
            >
              {timeLeft}
            </span>
          </div>
          <span className="text-[10px] uppercase font-mono text-slate-500 hidden sm:inline">
            Seconds
          </span>
        </div>
      </div>

      {/* Main Dual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Authentic Mockup (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              {currentItem.title}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
              {currentItem.category}
            </span>
          </div>

          <PhoneMockup
            type="sms"
            sender={currentItem.sender}
            timestamp="Just now"
            content={currentItem.content}
            url={currentItem.url}
          />
        </div>

        {/* Right Column: High-Stakes Action Panel (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {phase === "playing" ? (
            <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-6 shadow-xl text-center">
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-rose-400 font-semibold">
                  Split-Second Instinct Verdict
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Is this message Real or a Scam?
                </h3>
                <p className="text-xs text-slate-400">
                  Quick decisions score bonus points. Trust your gut.
                </p>
              </div>

              {/* Massive Rapid Decision Buttons */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <button
                  onClick={() => handleAnswer("legit")}
                  className="group p-5 sm:p-6 rounded-2xl bg-slate-950 border-2 border-emerald-500/40 hover:border-emerald-500 hover:bg-emerald-950/30 text-emerald-300 transition-all flex flex-col items-center justify-center gap-2 hover:scale-[1.02] shadow-lg shadow-emerald-950/20"
                >
                  <ShieldCheck className="w-8 h-8 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-base sm:text-lg font-black uppercase tracking-wider text-white">
                    Legitimate
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Authentic notice</span>
                </button>

                <button
                  onClick={() => handleAnswer("scam")}
                  className="group p-5 sm:p-6 rounded-2xl bg-slate-950 border-2 border-rose-500/40 hover:border-rose-500 hover:bg-rose-950/30 text-rose-300 transition-all flex flex-col items-center justify-center gap-2 hover:scale-[1.02] shadow-lg shadow-rose-950/20"
                >
                  <ShieldAlert className="w-8 h-8 text-rose-400 group-hover:scale-110 transition-transform" />
                  <span className="text-base sm:text-lg font-black uppercase tracking-wider text-white">
                    Scam Trap
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Deceptive threat</span>
                </button>
              </div>
            </div>
          ) : (
            /* Answered Verdict Screen */
            <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-5 shadow-xl animate-in zoom-in-95 duration-200">
              {/* Verdict Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  {lastAnswer === currentItem.type ? (
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                      {lastAnswer === "timeout" ? "Out of Time" : "Your Decision"}
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      {lastAnswer === currentItem.type
                        ? `Spot On! It is ${currentItem.type === "scam" ? "a SCAM" : "LEGIT"}.`
                        : `Missed. It was actually ${currentItem.type === "scam" ? "a SCAM" : "LEGIT"}.`}
                    </h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    +{earnedPoints[earnedPoints.length - 1] || 0} pts
                  </span>
                </div>
              </div>

              {/* Rationale & Indicators */}
              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {currentItem.explanation}
                </p>

                {currentItem.keyIndicators.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                      Key Observational Indicators:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentItem.keyIndicators.map((ind, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] bg-slate-950 border border-slate-800 text-cyan-300 font-mono"
                        >
                          • {ind}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                <button
                  onClick={() => setIsEngineModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Inspect with SafeGuard AI</span>
                </button>

                <button
                  onClick={handleNextItem}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 transition-all flex items-center gap-1.5 shadow-lg shadow-rose-500/25"
                >
                  <span>{currentIndex < DRILL_ITEMS.length - 1 ? "Next Drill Item" : "Complete Drill"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SafeGuard AI Engine Diagnostic Modal */}
      <EngineInspectionModal
        isOpen={isEngineModalOpen}
        onClose={() => setIsEngineModalOpen(false)}
        messageText={
          currentItem.url
            ? `${currentItem.content}\n\n${currentItem.url}`
            : currentItem.content
        }
        sourceTitle={currentItem.title}
      />
    </div>
  );
};
