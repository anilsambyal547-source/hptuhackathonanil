"use client";

import React, { useState, useEffect } from "react";
import { QuizMode } from "./QuizMode";
import { DrillMode } from "./DrillMode";
import { RedFlagMode } from "./RedFlagMode";
import { ScamIqResults } from "./ScamIqResults";
import { ScamIqMode, ScamIqScoreCard } from "@/lib/types/scam-iq";
import { Flag, Zap, BookOpen, Sparkles, Award, ArrowRight } from "lucide-react";

export const ScamIqSuite: React.FC = () => {
  const [activeMode, setActiveMode] = useState<ScamIqMode>("home");
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

  // Load persisted scores from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("scamiq_score_state");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.scores) setScores(parsed.scores);
        if (parsed.hasAttempted) setHasAttempted(parsed.hasAttempted);
      }
    } catch {
      // LocalStorage error fallback
    }
  }, []);

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

    // If all three done, jump to results
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
            setScores({ quiz: 0, drill: 0, redflag: 0 });
            setHasAttempted({ quiz: false, drill: false, redflag: false });
            setActiveMode("home");
          }}
          onPlayMode={(m) => setActiveMode(m)}
        />
      )}

      {/* Home / Mode Selection Hub */}
      {activeMode === "home" && (
        <div className="space-y-8">
          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/40 text-purple-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ScamAdviser Lab • Scam IQ Test Suite</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Can You Spot a Scam? Test Your Scam IQ.
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Master the three authentic training modes from ScamAdviser: test your scenario knowledge, challenge your split-second instincts, and spot subtle red flags.
            </p>
          </div>

          {/* Current Composite Progress Banner */}
          <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-mono tracking-widest text-slate-400">
                    Current Scam IQ:
                  </span>
                  <span className="text-xl font-black text-white font-mono">
                    {totalScore} <span className="text-xs text-slate-500 font-light">/ 300 pts</span>
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {hasAttempted.quiz && hasAttempted.drill && hasAttempted.redflag
                    ? "All 3 features completed! Click to view full report card."
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
                  onClick={() => setActiveMode("results")}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                >
                  View Report Card
                </button>
              )}
            </div>
          </div>

          {/* Three Mode Cards Grid matching ScamAdviser specifications */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: Red Flag Mode */}
            <div
              onClick={() => setActiveMode("redflag")}
              className="group relative p-6 bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 rounded-2xl flex flex-col justify-between space-y-6 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 backdrop-blur-md"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 group-hover:scale-105 transition-transform">
                    <Flag className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    Feature 1 • Spot Tells
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-black text-white group-hover:text-purple-300 transition-colors">
                    Red Flag
                  </h3>
                  <p className="text-xs font-semibold text-purple-400">Find the tells</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Tap every suspicious element in a real scam message. Examine deceptive links, fake headers, and APK attachments. Miss nothing.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-purple-300">
                  {hasAttempted.redflag ? `Score: ${scores.redflag}/100` : "100 Points"}
                </span>
                <span className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-purple-500/20 text-purple-300 group-hover:bg-purple-500 group-hover:text-slate-950 transition-all flex items-center gap-1.5">
                  <span>{hasAttempted.redflag ? "Retake" : "Spot Tells"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Feature 2: Simulator / Drill Mode */}
            <div
              onClick={() => setActiveMode("drill")}
              className="group relative p-6 bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 rounded-2xl flex flex-col justify-between space-y-6 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-500/10 backdrop-blur-md"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 group-hover:scale-105 transition-transform">
                    <Zap className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/15 text-rose-300 border border-rose-500/30">
                    Feature 2 • Instinct
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-black text-white group-hover:text-rose-300 transition-colors">
                    Simulator Drill
                  </h3>
                  <p className="text-xs font-semibold text-rose-400">Trust your gut</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Real or Scam? Make the call, message after message. 20-second active timer per question. Faster decisions score more IQ points.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-rose-300">
                  {hasAttempted.drill ? `Score: ${scores.drill}/100` : "100 Points"}
                </span>
                <span className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-300 group-hover:bg-rose-500 group-hover:text-white transition-all flex items-center gap-1.5">
                  <span>{hasAttempted.drill ? "Retake" : "Start Drill"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Feature 3: Quiz Mode */}
            <div
              onClick={() => setActiveMode("quiz")}
              className="group relative p-6 bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl flex flex-col justify-between space-y-6 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 backdrop-blur-md"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Feature 3 • Knowledge
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                    Scenario Quiz
                  </h3>
                  <p className="text-xs font-semibold text-amber-400">Test your knowledge</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Read in-depth scam scenarios covering crypto pig butchering, courier fees, and digital arrest. Dissect deception strategies and build your Scam IQ.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-amber-300">
                  {hasAttempted.quiz ? `Score: ${scores.quiz}/100` : "100 Points"}
                </span>
                <span className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all flex items-center gap-1.5">
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
