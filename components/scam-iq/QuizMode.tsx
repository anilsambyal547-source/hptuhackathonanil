"use client";

import React, { useState } from "react";
import { QUIZ_SCENARIOS } from "@/lib/data/scam-iq-data";
import { PhoneMockup } from "./PhoneMockup";
import { EngineInspectionModal } from "./EngineInspectionModal";
import { soundEffects } from "@/lib/utils/sound-effects";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Award,
  Activity,
  Lightbulb,
} from "lucide-react";

interface QuizModeProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

export const QuizMode: React.FC<QuizModeProps> = ({ onComplete, onExit }) => {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [totalQuestionsAsked, setTotalQuestionsAsked] = useState(0);
  const [showBridge, setShowBridge] = useState(false);
  const [isEngineModalOpen, setIsEngineModalOpen] = useState(false);

  const scenario = QUIZ_SCENARIOS[scenarioIdx];
  const question = scenario?.questions[questionIdx];
  const totalQuestions = QUIZ_SCENARIOS.reduce((sum, s) => sum + s.questions.length, 0);

  const handleSelectOption = (optionId: string) => {
    if (isAnswered) return;
    setSelectedOptionId(optionId);
    setIsAnswered(true);

    const chosen = question.options.find((o) => o.id === optionId);
    if (chosen?.isCorrect) {
      soundEffects.playSuccess();
      setCorrectAnswersCount((prev) => prev + 1);
    } else {
      soundEffects.playError();
    }
    setTotalQuestionsAsked((prev) => prev + 1);
  };

  const handleNext = () => {
    soundEffects.playClick();
    if (questionIdx < scenario.questions.length - 1) {
      setQuestionIdx((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
    } else {
      soundEffects.playStreak();
      setShowBridge(true);
    }
  };

  const handleBridgeContinue = () => {
    soundEffects.playClick();
    setShowBridge(false);
    if (scenarioIdx < QUIZ_SCENARIOS.length - 1) {
      setScenarioIdx((prev) => prev + 1);
      setQuestionIdx(0);
      setSelectedOptionId(null);
      setIsAnswered(false);
    } else {
      const finalScore = Math.round((correctAnswersCount / totalQuestions) * 100);
      onComplete(finalScore);
    }
  };

  if (showBridge) {
    const currentScore = Math.round((correctAnswersCount / totalQuestionsAsked) * 100);
    return (
      <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-slate-900/90 border border-amber-500/30 rounded-3xl shadow-2xl backdrop-blur-md space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30 shadow-lg shadow-amber-500/10">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider font-mono text-amber-400 font-bold">
              Scenario Completed • Checkpoint Pass
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">{scenario.title}</h2>
          </div>
        </div>

        <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Cumulative Accuracy</span>
            <span className="font-bold text-amber-400 text-sm sm:text-base font-mono">{currentScore}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all duration-500"
              style={{ width: `${currentScore}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 pt-1">
            Questions Answered: <span className="font-mono text-white font-semibold">{correctAnswersCount} / {totalQuestionsAsked}</span> correct
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Key Educational Takeaway</span>
          </div>
          <div className="p-4 bg-amber-950/30 border border-amber-800/40 rounded-xl text-xs text-amber-200/90 leading-relaxed font-sans">
            {question.educationalTip}
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-slate-800">
          <button
            onClick={onExit}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Exit to Hub
          </button>
          <button
            onClick={handleBridgeContinue}
            className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <span>{scenarioIdx < QUIZ_SCENARIOS.length - 1 ? "Next Scenario" : "View Final Report"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Progress */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
            Scenario Quiz • Case {scenarioIdx + 1} of {QUIZ_SCENARIOS.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEngineModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs font-medium hover:bg-cyan-900/60 transition-colors flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Inspect with</span>
            <span>SafeGuard AI</span>
          </button>
          <span className="text-xs font-mono text-slate-400">
            Q {questionIdx + 1} / {scenario.questions.length}
          </span>
        </div>
      </div>

      {/* Grid: Left = Smartphone/Artifact Mockup, Right = Educational Question Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Authentic Interactive Mockup (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Simulated Threat Artifact
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
              {scenario.badge}
            </span>
          </div>

          <PhoneMockup
            type={scenario.artifactType}
            sender={scenario.sender}
            timestamp={scenario.timestamp}
            content={scenario.artifactContent}
            url={scenario.artifactUrl}
            badge={scenario.badge}
          />
        </div>

        {/* Right Column: Question Card & Explanations (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-5 sm:p-6 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-5 shadow-xl">
            {/* Prompt */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-semibold border border-slate-700">
                  Vector: {question.attackVector}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                {question.prompt}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                let btnStyle = "bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-200";

                if (isAnswered) {
                  if (opt.isCorrect) {
                    btnStyle = "bg-emerald-950/50 border-emerald-500/80 text-emerald-200 ring-1 ring-emerald-500/30";
                  } else if (isSelected && !opt.isCorrect) {
                    btnStyle = "bg-rose-950/50 border-rose-500/80 text-rose-200 ring-1 ring-rose-500/30";
                  } else {
                    btnStyle = "bg-slate-950/40 border-slate-900 text-slate-500 opacity-60";
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-3 ${btnStyle}`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {isAnswered && opt.isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                      {isAnswered && isSelected && !opt.isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-400" />
                      )}
                      {(!isAnswered || (!opt.isCorrect && !isSelected)) && (
                        <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-500 font-mono">
                          •
                        </div>
                      )}
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <span className="font-sans leading-relaxed">{opt.text}</span>
                      {isAnswered && (isSelected || opt.isCorrect) && (
                        <p className="text-xs font-normal text-slate-300 leading-relaxed pt-2 border-t border-slate-800/80">
                          {opt.explanation}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions after Answering */}
            {isAnswered && (
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-800/80 animate-in fade-in duration-200">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    {question.options.find((o) => o.id === selectedOptionId)?.isCorrect
                      ? "Correct! +12.5 IQ Points awarded."
                      : "Review the attack vector analysis above."}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEngineModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    <span>SafeGuard AI Verdict</span>
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
                  >
                    <span>{questionIdx < scenario.questions.length - 1 ? "Next Question" : "Continue"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SafeGuard AI Engine Diagnostic Modal */}
      <EngineInspectionModal
        isOpen={isEngineModalOpen}
        onClose={() => setIsEngineModalOpen(false)}
        messageText={
          scenario.artifactUrl
            ? `${scenario.artifactContent}\n\n${scenario.artifactUrl}`
            : scenario.artifactContent
        }
        sourceTitle={scenario.title}
      />
    </div>
  );
};
