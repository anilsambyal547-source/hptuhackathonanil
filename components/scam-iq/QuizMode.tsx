"use client";

import React, { useState } from "react";
import { QUIZ_SCENARIOS } from "@/lib/data/scam-iq-data";
import { CheckCircle2, XCircle, ArrowRight, MessageSquare, Sparkles, Award } from "lucide-react";

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

  const scenario = QUIZ_SCENARIOS[scenarioIdx];
  const question = scenario?.questions[questionIdx];
  const totalQuestions = QUIZ_SCENARIOS.reduce((sum, s) => sum + s.questions.length, 0);

  const handleSelectOption = (optionId: string) => {
    if (isAnswered) return;
    setSelectedOptionId(optionId);
    setIsAnswered(true);

    const chosen = question.options.find((o) => o.id === optionId);
    if (chosen?.isCorrect) {
      setCorrectAnswersCount((prev) => prev + 1);
    }
    setTotalQuestionsAsked((prev) => prev + 1);
  };

  const handleNext = () => {
    if (questionIdx < scenario.questions.length - 1) {
      // Next question in current scenario
      setQuestionIdx((prev) => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
    } else {
      // Scenario finished, show bridge checkpoint
      setShowBridge(true);
    }
  };

  const handleBridgeContinue = () => {
    setShowBridge(false);
    if (scenarioIdx < QUIZ_SCENARIOS.length - 1) {
      setScenarioIdx((prev) => prev + 1);
      setQuestionIdx(0);
      setSelectedOptionId(null);
      setIsAnswered(false);
    } else {
      // Quiz complete
      const finalScore = Math.round((correctAnswersCount / totalQuestions) * 100);
      onComplete(finalScore);
    }
  };

  if (showBridge) {
    const currentScore = Math.round((correctAnswersCount / totalQuestionsAsked) * 100);
    return (
      <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-slate-900/90 border border-amber-500/30 rounded-2xl shadow-xl backdrop-blur-md space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-mono text-amber-400">Checkpoint Completed</span>
            <h2 className="text-2xl font-bold text-white">{scenario.title}</h2>
          </div>
        </div>

        <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Scenario Accuracy</span>
            <span className="font-bold text-amber-400 text-base">{currentScore}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all duration-500"
              style={{ width: `${currentScore}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 pt-1">
            Total correct so far: {correctAnswersCount} / {totalQuestionsAsked} questions answered.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Key Takeaway</h3>
          <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-lg text-xs text-amber-200/90 leading-relaxed">
            {question.educationalTip}
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <button
            onClick={onExit}
            className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Exit to Modes
          </button>
          <button
            onClick={handleBridgeContinue}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <span>{scenarioIdx < QUIZ_SCENARIOS.length - 1 ? "Next Scenario" : "View Final IQ"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header / Progress */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-mono font-medium text-amber-400 uppercase tracking-wider">
            Quiz Mode • Scenario {scenarioIdx + 1} of {QUIZ_SCENARIOS.length}
          </span>
        </div>
        <div className="text-xs font-mono text-slate-400">
          Question {questionIdx + 1} / {scenario.questions.length}
        </div>
      </div>

      {/* Scenario Artifact Box */}
      <div className="p-5 sm:p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {scenario.badge}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white">{scenario.title}</h2>
          </div>
          <span className="text-xs font-mono text-slate-500">{scenario.timestamp}</span>
        </div>

        {/* Realistic Mockup Simulation */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-slate-400 text-[11px] pb-2 border-b border-slate-800/60">
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-300 font-semibold">{scenario.sender}</span>
          </div>
          <div className="whitespace-pre-line leading-relaxed text-slate-200">
            {scenario.artifactContent}
          </div>
          {scenario.artifactUrl && (
            <div className="pt-2 text-[11px] text-cyan-400 break-all select-all flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-[10px] text-slate-400">URL</span>
              <span>{scenario.artifactUrl}</span>
            </div>
          )}
        </div>
      </div>

      {/* Question Card */}
      <div className="p-5 sm:p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-5">
        <div className="space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400/90 font-semibold">
            Attack Vector: {question.attackVector}
          </span>
          <h3 className="text-sm sm:text-base font-semibold text-white leading-snug">
            {question.prompt}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {question.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            let btnStyle = "bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300";

            if (isAnswered) {
              if (opt.isCorrect) {
                btnStyle = "bg-emerald-950/40 border-emerald-500/60 text-emerald-200 shadow-sm shadow-emerald-500/10";
              } else if (isSelected && !opt.isCorrect) {
                btnStyle = "bg-rose-950/40 border-rose-500/60 text-rose-200";
              } else {
                btnStyle = "bg-slate-950/40 border-slate-900 text-slate-600 opacity-60";
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                disabled={isAnswered}
                className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-3 ${btnStyle}`}
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
                  <span>{opt.text}</span>
                  {isAnswered && (isSelected || opt.isCorrect) && (
                    <p className="text-xs font-normal text-slate-400 leading-relaxed pt-1 border-t border-slate-800/80">
                      {opt.explanation}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Actions */}
        {isAnswered && (
          <div className="pt-3 flex justify-between items-center border-t border-slate-800/80 animate-in fade-in duration-200">
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {question.options.find((o) => o.id === selectedOptionId)?.isCorrect
                  ? "Correct! +12.5 IQ Points"
                  : "Incorrect. Read rationale above."}
              </span>
            </div>
            <button
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all flex items-center gap-2 shadow-md shadow-amber-500/20"
            >
              <span>{questionIdx < scenario.questions.length - 1 ? "Next Question" : "Continue"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
