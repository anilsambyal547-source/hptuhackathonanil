"use client";

import React, { useState } from "react";
import { CheckCircle2, Circle, AlertCircle, Clock, CheckSquare } from "lucide-react";
import { ScamCategoryType, Language } from "@/lib/types/recovery";
import { SCAM_CATEGORIES } from "@/lib/data/scam-routing";

interface RecoveryChecklistProps {
  selectedCategory: ScamCategoryType;
  language: Language;
  hasLostMoney: boolean;
}

export const RecoveryChecklist: React.FC<RecoveryChecklistProps> = ({
  selectedCategory,
  language,
  hasLostMoney,
}) => {
  const isHi = language === "hi";
  const categoryDetail =
    SCAM_CATEGORIES.find((c) => c.id === selectedCategory) || SCAM_CATEGORIES[0];

  // Track completed steps locally
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const steps = categoryDetail.immediateSteps;
  const completedCount = steps.filter((s) => completedSteps[s.id]).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
      {/* Header and Progress Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white">
              {isHi ? "2. चरणबद्ध रिकवरी कार्ययोजना" : "2. Step-by-Step Personalized Action Plan"}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isHi
              ? "इन कदमों को वरीयता क्रम में पूरा करें। महत्वपूर्ण (Critical) कार्यों को पहले करें।"
              : "Execute these recovery actions in strict priority order. Mark each as you finish."}
          </p>
        </div>

        <div className="w-full sm:w-48 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-slate-400">{isHi ? "प्रगति" : "Progress"}</span>
            <span className="text-cyan-400 font-mono">
              {completedCount} / {steps.length} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Critical financial loss warning if toggled */}
      {hasLostMoney && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 flex items-start gap-3 text-xs text-rose-200">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-rose-300">
              {isHi ? "वित्तीय आपातकाल सक्रिय: " : "Financial Loss Triage Active: "}
            </span>
            {isHi
              ? "चूंकि धनराशि कट चुकी है, सबसे पहले अपने कार्ड/नेटबैंकिंग को ब्लॉक करें और तुरंत 1930 पर कॉल करके बैंक नोडल सिस्टम को सक्रिय करें।"
              : "Because money was debited, your #1 priority is immediate interbank hold via 1930 and calling your bank's 24x7 card blocking desk."}
          </div>
        </div>
      )}

      {/* Action Steps List */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isDone = !!completedSteps[step.id];
          return (
            <div
              key={step.id}
              onClick={() => toggleStep(step.id)}
              className={`cursor-pointer p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                isDone
                  ? "bg-slate-950/60 border-slate-800/60 opacity-75"
                  : step.critical
                  ? "bg-slate-950/90 border-rose-500/30 hover:border-rose-500/50"
                  : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
              }`}
            >
              <button
                type="button"
                aria-label="Toggle step"
                className="mt-0.5 shrink-0 text-slate-400 hover:text-white"
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-600" />
                )}
              </button>

              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={`text-sm font-semibold ${
                      isDone ? "text-slate-400 line-through" : "text-white"
                    }`}
                  >
                    <span className="text-cyan-400 font-mono mr-2">{index + 1}.</span>
                    {isHi ? step.titleHi : step.title}
                  </h4>

                  {step.critical && !isDone && (
                    <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {isHi ? "अति आवश्यक" : "Immediate Priority"}
                    </span>
                  )}
                </div>

                <p
                  className={`text-xs leading-relaxed ${
                    isDone ? "text-slate-500" : "text-slate-300"
                  }`}
                >
                  {isHi ? step.detailHi : step.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

