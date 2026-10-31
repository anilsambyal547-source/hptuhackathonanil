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
    <div className="bg-white border border-[#e2e6dc] rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] space-y-5">
      {/* Header and Progress Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#edf1e8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-[#3d5926]" />
            <h3 className="text-base sm:text-lg font-serif font-bold text-[#181a15]">
              {isHi ? "2. चरणबद्ध रिकवरी कार्ययोजना" : "2. Step-by-Step Personalized Action Plan"}
            </h3>
          </div>
          <p className="text-xs text-[#636c5c] mt-1">
            {isHi
              ? "इन कदमों को वरीयता क्रम में पूरा करें। महत्वपूर्ण (Critical) कार्यों को पहले करें।"
              : "Execute these recovery actions in strict priority order. Mark each as you finish."}
          </p>
        </div>

        <div className="w-full sm:w-48 bg-[#f8faf6] p-3 rounded-2xl border border-[#dce3d5]">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-[#636c5c]">{isHi ? "प्रगति" : "Progress"}</span>
            <span className="text-[#2c401c] font-mono">
              {completedCount} / {steps.length} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#e6ebdf] overflow-hidden">
            <div
              className="h-full bg-[#7db432] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Critical financial loss warning if toggled */}
      {hasLostMoney && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-800 shadow-2xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-rose-900">
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
              className={`cursor-pointer p-4 rounded-2xl border transition-all flex items-start gap-3.5 shadow-2xs ${
                isDone
                  ? "bg-[#f4f7f1] border-[#dce3d5] opacity-75"
                  : step.critical
                  ? "bg-rose-50/70 border-rose-200 hover:border-rose-300"
                  : "bg-[#f8faf6] border-[#e2e7dc] hover:border-[#b0c897]"
              }`}
            >
              <button
                type="button"
                aria-label="Toggle step"
                className="mt-0.5 shrink-0 text-[#636c5c] hover:text-[#181a15]"
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Circle className="w-5 h-5 text-[#ccd4c4]" />
                )}
              </button>

              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={`text-sm font-semibold ${
                      isDone ? "text-[#717a69] line-through" : "text-[#181a15]"
                    }`}
                  >
                    <span className="text-[#3d5926] font-mono mr-2">{index + 1}.</span>
                    {isHi ? step.titleHi : step.title}
                  </h4>

                  {step.critical && !isDone && (
                    <span className="shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-rose-600" />
                      {isHi ? "अति आवश्यक" : "Immediate Priority"}
                    </span>
                  )}
                </div>

                <p
                  className={`text-xs leading-relaxed ${
                    isDone ? "text-[#717a69]" : "text-[#525a4c]"
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

