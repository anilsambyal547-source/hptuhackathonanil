"use client";

import React, { useState, useEffect } from "react";
import { QuizMode } from "./QuizMode";
import { DrillMode } from "./DrillMode";
import { RedFlagMode } from "./RedFlagMode";
import { ScamIqResults } from "./ScamIqResults";
import { ScamIqMode, ScamIqScoreCard } from "@/lib/types/scam-iq";
import { soundEffects } from "@/lib/utils/sound-effects";
import {
  Flag,
  Zap,
  BookOpen,
  Sparkles,
  Award,
  ArrowRight,
  Volume2,
  VolumeX,
} from "lucide-react";

export const ScamIqSuite: React.FC = () => {
  const [activeMode, setActiveMode] = useState<ScamIqMode>("home");
  const [isMuted, setIsMuted] = useState(false);
  const [scores, setScores] = useState<{
    quiz: number;
    drill: number;
    redflag: number;
  }>({ quiz: 0, drill: 0, redflag: 0 });

  const [hasAttempted, setHasAttempted] = useState<{
    quiz: boolean;
    drill: boolean;
    redflag: boolean;
  }>({ quiz: false, drill: false, redflag: false });

  // Load persisted scores and sound preference on mount
  useEffect(() => {
    try {
      setIsMuted(soundEffects.getMuted());
      const saved = localStorage.getItem("scamiq_score_state");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.scores) setScores(parsed.scores);
        if (parsed.hasAttempted) setHasAttempted(parsed.hasAttempted);
      }
    } catch {
      // LocalStorage fallback
    }
  }, []);

  const toggleSound = () => {
    const nextMuted = soundEffects.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      soundEffects.playClick();
    }
  };

  const saveScoreState = (newScores: typeof scores, newAttempts: typeof hasAttempted) => {
    try {
      localStorage.setItem(
        "scamiq_score_state",
        JSON.stringify({ scores: newScores, hasAttempted: newAttempts })
      );
    } catch {
      // Ignore
    }
  };

  const handleQuizComplete = (score: number) => {
    const updatedScores = { ...scores, quiz: score };
    const updatedAttempts = { ...hasAttempted, quiz: true };
    setScores(updatedScores);
    setHasAttempted(updatedAttempts);
    saveScoreState(updatedScores, updatedAttempts);

    if (updatedAttempts.drill && updatedAttempts.redflag) {
      setActiveMode("results");
    } else {
      setActiveMode("home");
    }
  };

  const handleDrillComplete = (score: number) => {
    const updatedScores = { ...scores, drill: score };
    const updatedAttempts = { ...hasAttempted, drill: true };
    setScores(updatedScores);
    setHasAttempted(updatedAttempts);
    saveScoreState(updatedScores, updatedAttempts);

    if (updatedAttempts.quiz && updatedAttempts.redflag) {
      setActiveMode("results");
    } else {
      setActiveMode("home");
    }
  };

  const handleRedFlagComplete = (score: number) => {
    const updatedScores = { ...scores, redflag: score };
    const updatedAttempts = { ...hasAttempted, redflag: true };
    setScores(updatedScores);
    setHasAttempted(updatedAttempts);
    saveScoreState(updatedScores, updatedAttempts);

    if (updatedAttempts.quiz && updatedAttempts.drill) {
      setActiveMode("results");
    } else {
      setActiveMode("home");
    }
  };

  const totalScore = scores.quiz + scores.drill + scores.redflag;

  const currentScoreCard: ScamIqScoreCard = {
    quizScore: scores.quiz,
    drillScore: scores.drill,
    redFlagScore: scores.redflag,
    totalScore,
    tier:
      totalScore >= 260
        ? "Grandmaster"
        : totalScore >= 200
        ? "Vigilant"
        : totalScore >= 140
        ? "Cautious"
        : "Vulnerable",
    timestamp: Date.now(),
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Suite Navigation Bar */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#edf1e8]">
        <div className="flex items-center gap-2">
          {activeMode !== "home" && (
            <button
              onClick={() => {
                soundEffects.playClick();
                setActiveMode("home");
              }}
              className="text-xs font-semibold text-[#556149] hover:text-[#181a15] transition-colors flex items-center gap-1 mr-2 px-3 py-1.5 rounded-xl bg-white border border-[#dce3d5] shadow-2xs"
            >
              <span>← All Modes</span>
            </button>
          )}
          <span className="text-xs font-mono font-bold text-[#3d5926] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#3d5926]" />
            <span>SafeGuard Lab • Scam IQ Test Suite</span>
          </span>
        </div>

        {/* Controls: Sound & Quick Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
            className="p-2 rounded-2xl text-xs font-mono bg-white border border-[#dce3d5] text-[#556149] hover:text-[#181a15] hover:bg-[#f4f7f1] transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-rose-600" />
                <span className="hidden sm:inline text-[11px] text-[#636c5c]">Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-[#3d5926]" />
                <span className="hidden sm:inline text-[11px] text-[#636c5c]">Audio ON</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mode Sub-Components */}
      {activeMode === "quiz" && (
        <QuizMode
          onComplete={handleQuizComplete}
          onExit={() => setActiveMode("home")}
        />
      )}

      {activeMode === "drill" && (
        <DrillMode
          onComplete={handleDrillComplete}
          onExit={() => setActiveMode("home")}
        />
      )}

      {activeMode === "redflag" && (
        <RedFlagMode
          onComplete={handleRedFlagComplete}
          onExit={() => setActiveMode("home")}
        />
      )}

      {activeMode === "results" && (
        <ScamIqResults
          scoreCard={currentScoreCard}
          onRetake={() => {
            soundEffects.playClick();
            setScores({ quiz: 0, drill: 0, redflag: 0 });
            setHasAttempted({ quiz: false, drill: false, redflag: false });
            saveScoreState({ quiz: 0, drill: 0, redflag: 0 }, { quiz: false, drill: false, redflag: false });
            setActiveMode("home");
          }}
          onPlayMode={(m) => {
            soundEffects.playClick();
            setActiveMode(m);
          }}
        />
      )}

      {/* Home / Mode Selection Hub */}
      {activeMode === "home" && (
        <div className="space-y-8">
          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#eef4e8] border border-[#d5e0cb] text-[#3d5926] text-xs font-medium shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#3d5926]" />
              <span>Interactive Cybersecurity Academy</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-[#181a15]">
              Can You Spot a Scam? Test Your Scam IQ.
            </h1>
            <p className="text-xs sm:text-base text-[#5c6454] leading-relaxed max-w-2xl mx-auto font-sans">
              Master the three authentic training modes: test your scenario knowledge, challenge your split-second instincts, and spot subtle forensic red flags.
            </p>
          </div>

          {/* Current Composite Progress Banner */}
          <div className="max-w-4xl mx-auto p-5 sm:p-6 bg-white border border-[#e2e6dc] rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-[#bef264] text-[#162704] border border-[#a8df4a]/60 shadow-2xs">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-mono tracking-widest text-[#636c5c]">
                    Current Scam IQ:
                  </span>
                  <span className="text-2xl font-serif font-bold text-[#181a15]">
                    {totalScore} <span className="text-xs text-[#717a69] font-sans font-normal">/ 300 pts</span>
                  </span>
                </div>
                <p className="text-xs text-[#525a4c] pt-0.5">
                  {hasAttempted.quiz && hasAttempted.drill && hasAttempted.redflag
                    ? "✓ All 3 modes completed! Click to view your full accredited report card."
                    : `Completed ${
                        Number(hasAttempted.quiz) +
                        Number(hasAttempted.drill) +
                        Number(hasAttempted.redflag)
                      } of 3 modes. Play all 3 to calibrate your total Scam IQ.`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {(hasAttempted.quiz || hasAttempted.drill || hasAttempted.redflag) && (
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setActiveMode("results");
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-2xl text-xs font-bold bg-[#bef264] hover:bg-[#aee750] text-[#162704] border border-[#a8df4a]/70 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>View Report Card</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Three Mode Cards Grid */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: Red Flag Mode */}
            <div
              onClick={() => {
                soundEffects.playClick();
                setActiveMode("redflag");
              }}
              className="group relative p-6 bg-white border border-[#e2e6dc] hover:border-[#8ec251] rounded-3xl flex flex-col justify-between space-y-6 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-purple-700 group-hover:scale-105 transition-transform">
                    <Flag className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-800 border border-purple-200 font-mono">
                    Feature 1 • Spot Tells
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-serif font-bold text-[#181a15] group-hover:text-purple-900 transition-colors">
                    Red Flag Spotter
                  </h3>
                  <p className="text-xs font-semibold text-purple-700">Forensic Investigation</p>
                  <p className="text-xs text-[#525a4c] leading-relaxed font-sans">
                    Tap every suspicious element in a real scam artifact. Examine deceptive subdomains, fake headers, and APK attachments.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#edf1e8] flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-purple-800">
                  {hasAttempted.redflag ? `Score: ${scores.redflag}/100` : "100 Points"}
                </span>
                <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#f4f7f1] text-[#181a15] group-hover:bg-[#181a15] group-hover:text-white transition-all flex items-center gap-1.5 shadow-2xs">
                  <span>{hasAttempted.redflag ? "Retake" : "Spot Tells"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Feature 2: Simulator / Drill Mode */}
            <div
              onClick={() => {
                soundEffects.playClick();
                setActiveMode("drill");
              }}
              className="group relative p-6 bg-white border border-[#e2e6dc] hover:border-[#8ec251] rounded-3xl flex flex-col justify-between space-y-6 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 group-hover:scale-105 transition-transform">
                    <Zap className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-800 border border-rose-200 font-mono">
                    Feature 2 • Instinct
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-serif font-bold text-[#181a15] group-hover:text-rose-900 transition-colors">
                    Simulator Drill
                  </h3>
                  <p className="text-xs font-semibold text-rose-700">Trust Your Gut</p>
                  <p className="text-xs text-[#525a4c] leading-relaxed font-sans">
                    Real or Scam? Make the call, message after message. 20-second active timer with streak multipliers and instant SafeGuard engine verdicts.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#edf1e8] flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-rose-800">
                  {hasAttempted.drill ? `Score: ${scores.drill}/100` : "100 Points"}
                </span>
                <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#f4f7f1] text-[#181a15] group-hover:bg-[#181a15] group-hover:text-white transition-all flex items-center gap-1.5 shadow-2xs">
                  <span>{hasAttempted.drill ? "Retake" : "Start Drill"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Feature 3: Quiz Mode */}
            <div
              onClick={() => {
                soundEffects.playClick();
                setActiveMode("quiz");
              }}
              className="group relative p-6 bg-white border border-[#e2e6dc] hover:border-[#8ec251] rounded-3xl flex flex-col justify-between space-y-6 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-200 font-mono">
                    Feature 3 • Knowledge
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-serif font-bold text-[#181a15] group-hover:text-amber-900 transition-colors">
                    Scenario Quiz
                  </h3>
                  <p className="text-xs font-semibold text-amber-800">In-Depth Case Studies</p>
                  <p className="text-xs text-[#525a4c] leading-relaxed font-sans">
                    Read simulated phone and email threat scenarios covering crypto pig butchering, customs seizures, and digital arrest extortion.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#edf1e8] flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-amber-900">
                  {hasAttempted.quiz ? `Score: ${scores.quiz}/100` : "100 Points"}
                </span>
                <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#f4f7f1] text-[#181a15] group-hover:bg-[#181a15] group-hover:text-white transition-all flex items-center gap-1.5 shadow-2xs">
                  <span>{hasAttempted.quiz ? "Retake" : "Start Quiz"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
