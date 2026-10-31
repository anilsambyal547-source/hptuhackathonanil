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
      <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-white border border-[#e2e6dc] rounded-3xl shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-amber-50 text-amber-800 rounded-2xl border border-amber-200 shadow-2xs">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider font-mono text-amber-800 font-bold">
              Scenario Completed • Checkpoint Pass
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#181a15]">{scenario.title}</h2>
          </div>
        </div>

        <div className="p-5 bg-[#f8faf6] rounded-2xl border border-[#dce3d5] space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#636c5c] font-medium">Cumulative Accuracy</span>
            <span className="font-bold text-amber-900 text-sm sm:text-base font-mono">{currentScore}%</span>
          </div>
          <div className="w-full bg-[#e6ebdf] h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${currentScore}%` }}
            />
          </div>
          <p className="text-xs text-[#636c5c] pt-1">
            Questions Answered: <span className="font-mono text-[#181a15] font-semibold">{correctAnswersCount} / {totalQuestionsAsked}</span> correct
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#181a15]">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>Key Educational Takeaway</span>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 leading-relaxed font-sans">
            {question.educationalTip}
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-[#edf1e8]">
          <button
            onClick={onExit}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#636c5c] hover:text-[#181a15] hover:bg-[#f4f7f1] transition-colors"
          >
            Exit to Hub
          </button>
          <button
            onClick={handleBridgeContinue}
            className="px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-[#162704] bg-[#bef264] hover:bg-[#aee750] border border-[#a8df4a]/70 transition-all flex items-center gap-2 shadow-2xs"
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
      <div className="flex items-center justify-between pb-4 border-b border-[#edf1e8]">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-amber-900 uppercase tracking-wider">
            Scenario Quiz • Case {scenarioIdx + 1} of {QUIZ_SCENARIOS.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEngineModalOpen(true)}
            className="px-3.5 py-1.5 rounded-2xl bg-[#eef4e8] border border-[#d5e0cb] text-[#2c401c] text-xs font-semibold hover:bg-[#e2edd8] transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Activity className="w-3.5 h-3.5 text-[#3d5926]" />
            <span className="hidden sm:inline">Inspect with</span>
            <span>SafeGuard AI</span>
          </button>
          <span className="text-xs font-mono text-[#636c5c]">
            Q {questionIdx + 1} / {scenario.questions.length}
          </span>
        </div>
      </div>

      {/* Grid: Left = Smartphone/Artifact Mockup, Right = Educational Question Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Authentic Interactive Mockup (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono text-[#636c5c] uppercase tracking-wider">
              Simulated Threat Artifact
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-amber-50 text-amber-800 border border-amber-200 font-medium">
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
          <div className="p-6 bg-white border border-[#e2e6dc] rounded-3xl space-y-5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
            {/* Prompt */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#f4f7f1] text-[#181a15] font-semibold border border-[#dce3d5]">
                  Vector: {question.attackVector}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#181a15] leading-snug">
                {question.prompt}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                let btnStyle = "bg-[#fcfdfa] border-[#dce3d5] hover:border-[#b0c897] text-[#181a15]";

                if (isAnswered) {
                  if (opt.isCorrect) {
                    btnStyle = "bg-[#eef5e6] border-[#8ec251] text-[#2c401c] ring-1 ring-[#8ec251]";
                  } else if (isSelected && !opt.isCorrect) {
                    btnStyle = "bg-rose-50 border-rose-300 text-rose-800 ring-1 ring-rose-200";
                  } else {
                    btnStyle = "bg-[#f9faf7] border-[#e2e7dc] text-[#9ca394] opacity-70";
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-3 shadow-2xs ${btnStyle}`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {isAnswered && opt.isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                      {isAnswered && isSelected && !opt.isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-600" />
                      )}
                      {(!isAnswered || (!opt.isCorrect && !isSelected)) && (
                        <div className="w-4 h-4 rounded-full border border-[#ccd4c4] flex items-center justify-center text-[10px] text-[#8c9682] font-mono">
                          •
                        </div>
                      )}
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <span className="font-sans leading-relaxed text-[#181a15]">{opt.text}</span>
                      {isAnswered && (isSelected || opt.isCorrect) && (
                        <p className="text-xs font-normal text-[#525a4c] leading-relaxed pt-2 border-t border-[#dce3d5]">
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
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-[#edf1e8] animate-in fade-in duration-200">
                <div className="text-xs text-[#525a4c] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#3d5926] shrink-0" />
                  <span>
                    {question.options.find((o) => o.id === selectedOptionId)?.isCorrect
                      ? "Correct! +12.5 IQ Points awarded."
                      : "Review the attack vector analysis above."}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEngineModalOpen(true)}
                    className="px-3.5 py-2 rounded-2xl text-xs font-semibold bg-[#f4f7f1] hover:bg-[#edf2e7] text-[#181a15] border border-[#dce3d5] transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <Activity className="w-3.5 h-3.5 text-[#3d5926]" />
                    <span>SafeGuard AI Verdict</span>
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-5 py-2 rounded-2xl text-xs sm:text-sm font-bold text-[#162704] bg-[#bef264] hover:bg-[#aee750] border border-[#a8df4a]/70 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
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
