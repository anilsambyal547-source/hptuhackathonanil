"use client";

import React from "react";
import { PhoneCall, AlertOctagon, ExternalLink, ShieldCheck, Clock } from "lucide-react";
import { Language } from "@/lib/types/recovery";

interface EmergencyBannerProps {
  language: Language;
  hasLostMoney: boolean;
  onToggleLostMoney: (lost: boolean) => void;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({
  language,
  hasLostMoney,
  onToggleLostMoney,
}) => {
  const isHi = language === "hi";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-rose-200 bg-rose-50/70 p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
              {isHi ? "आपातकालीन वित्तीय साइबर हेल्पलाइन" : "Immediate Financial Cybercrime Emergency"}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-900 bg-amber-100 border border-amber-200 px-3 py-0.5 rounded-full">
              <Clock className="w-3 h-3 text-amber-700" />
              {isHi ? "गोल्डन ऑवर (प्रथम 2-3 घंटे)" : "Golden Hour Protocol (2-3 Hours)"}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#181a15] tracking-tight">
            {isHi
              ? "पैसे कट गए हैं? तुरंत 1930 पर कॉल करें और बैंक को सूचित करें"
              : "Lost Money to a Scam? Dial 1930 Immediately & Freeze Accounts"}
          </h2>

          <p className="text-xs sm:text-sm text-[#4a5542] leading-relaxed">
            {isHi
              ? "भारत सरकार का CFCFRMS सिस्टम बैंक नोडल अधिकारियों से सीधे जुड़ा है। घटना के 2-3 घंटे में 1930 पर कॉल करने से पैसे जालसाज के खाते में फ्रीज होने की संभावना सबसे ज्यादा होती है।"
              : "India's National Cybercrime Portal (I4C) coordinates directly with all banks and payment aggregators. Calling 1930 immediately can freeze funds before fraudsters cash out at ATMs."}
          </p>
        </div>

        {/* Action Buttons & Lost Money Toggle */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 w-full lg:w-auto shrink-0">
          <a
            href="tel:1930"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm sm:text-base shadow-sm transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <PhoneCall className="w-5 h-5 animate-bounce" />
            <span>{isHi ? "1930 पर तुरंत कॉल करें" : "Dial 1930 (Toll-Free)"}</span>
          </a>

          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-[#edf1e8] text-[#181a15] font-semibold text-xs border border-[#d5ded0] transition-colors shadow-2xs"
          >
            <span>{isHi ? "cybercrime.gov.in खोलें" : "cybercrime.gov.in"}</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#3d5926]" />
          </a>
        </div>
      </div>

      {/* Triage Prompt: Did you lose money? */}
      <div className="mt-5 pt-4 border-t border-rose-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#4a5542]">
          <ShieldCheck className="w-4 h-4 text-[#3d5926] shrink-0" />
          <span className="font-medium">
            {isHi
              ? "क्या आपके बैंक/क्रेडिट कार्ड से पैसे कट चुके हैं?"
              : "Have funds already been deducted from your bank or wallet?"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleLostMoney(true)}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
              hasLostMoney
                ? "bg-rose-600 text-white shadow-2xs"
                : "bg-white text-[#525a4c] border border-[#dce3d5] hover:bg-[#f7f8f4]"
            }`}
          >
            {isHi ? "हाँ, पैसे कट गए हैं (आपातकालीन)" : "Yes, Money Was Lost (Urgent)"}
          </button>
          <button
            onClick={() => onToggleLostMoney(false)}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
              !hasLostMoney
                ? "bg-emerald-600 text-white shadow-2xs"
                : "bg-white text-[#525a4c] border border-[#dce3d5] hover:bg-[#f7f8f4]"
            }`}
          >
            {isHi ? "नहीं, केवल संदिग्ध प्रयास / धमकी है" : "No, Only Attempt / Threat"}
          </button>
        </div>
      </div>
    </div>
  );
};

