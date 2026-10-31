"use client";

import React from "react";
import { Cpu, Globe, Zap, Landmark, Brain, Sliders, CheckCircle2 } from "lucide-react";

export const ArchitectureDiagram: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white border border-[#e2e6dc] rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2 mb-2">
          <Cpu className="w-5 h-5 text-[#3d5926]" />
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#181a15] tracking-tight">
            SafeGuard Multi-Method Detection Architecture
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#5c6454] leading-relaxed max-w-3xl">
          Unlike naive single-prompt AI wrappers, SafeGuard fuses four independent verification engines: deterministic regex heuristics, algorithmic passive URL analysis, official brand impersonation registry, and contextual semantic LLM evaluation.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1 */}
        <div className="bg-white border border-[#e2e6dc] rounded-3xl p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] space-y-3">
          <div className="flex items-center gap-2 text-amber-700">
            <Zap className="w-5 h-5" />
            <h3 className="text-base font-serif font-bold text-[#181a15]">1. Heuristic Engine</h3>
          </div>
          <p className="text-xs text-[#525a4c] leading-relaxed">
            Deterministic token matching across 80+ patterns: manufactured urgency (&ldquo;within 2 hours&rdquo;), fear/coercion (&ldquo;digital arrest&rdquo;, CBI summons), and credential solicitation (OTP, CVV, ATM PIN, UPI ID).
          </p>
          <div className="text-[11px] text-amber-900 font-mono bg-[#fef9f0] p-2.5 rounded-xl border border-amber-200">
            Latency: ~15ms • Sub-word Regex
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="bg-white border border-[#e2e6dc] rounded-3xl p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] space-y-3">
          <div className="flex items-center gap-2 text-teal-700">
            <Globe className="w-5 h-5" />
            <h3 className="text-base font-serif font-bold text-[#181a15]">2. Passive URL Sandbox</h3>
          </div>
          <p className="text-xs text-[#525a4c] leading-relaxed">
            Pure string decomposition without outbound network requests. Inspects Damerau-Levenshtein typosquatting, Cyrillic/Greek homoglyphs (\u0430 lookalikes), IP hosts, shorteners, and high-risk TLDs.
          </p>
          <div className="text-[11px] text-teal-900 font-mono bg-[#f0fbf8] p-2.5 rounded-xl border border-teal-200">
            Zero Outbound Fetch • IDN / Punycode
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="bg-white border border-[#e2e6dc] rounded-3xl p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] space-y-3">
          <div className="flex items-center gap-2 text-purple-700">
            <Landmark className="w-5 h-5" />
            <h3 className="text-base font-serif font-bold text-[#181a15]">3. Impersonation Guard</h3>
          </div>
          <p className="text-xs text-[#525a4c] leading-relaxed">
            Cross-checks claimed entities (SBI, HDFC, India Post, FedEx, Mumbai Police, Income Tax) against verified domain registries. Flags instant critical mismatch when links point to unauthorized domains.
          </p>
          <div className="text-[11px] text-purple-900 font-mono bg-purple-50 p-2.5 rounded-xl border border-purple-200">
            Domain-Entity Alignment Verification
          </div>
        </div>

        {/* Pillar 4 */}
        <div className="bg-white border border-[#e2e6dc] rounded-3xl p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] space-y-3">
          <div className="flex items-center gap-2 text-blue-700">
            <Brain className="w-5 h-5" />
            <h3 className="text-base font-serif font-bold text-[#181a15]">4. Contextual Semantic AI</h3>
          </div>
          <p className="text-xs text-[#525a4c] leading-relaxed">
            Structured schema evaluation via Gemini API or resilient local semantic parser. Evaluates subtle emotional coercion, conversational manipulation, and tone nuance that pure regex cannot capture.
          </p>
          <div className="text-[11px] text-[#2c401c] font-mono bg-[#eef5e6] p-2.5 rounded-xl border border-[#cbe0b8]">
            Strict JSON Schema • Offline Resilient
          </div>
        </div>
      </div>

      {/* Uncertainty & Constraints Compliance Card */}
      <div className="bg-white border border-[#e2e6dc] rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
        <h3 className="text-base font-serif font-bold text-[#181a15] tracking-tight mb-3 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#3d5926]" />
          <span>Uncertainty Formulation & Architectural Constraints</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#181a15]">
          <div className="bg-[#f8faf6] p-4 rounded-2xl border border-[#dce3d5] space-y-2">
            <div className="font-semibold text-[#181a15]">Uncertainty Scoring (Formula)</div>
            <p className="leading-relaxed text-[#525a4c]">
              Confidence is calculated from cross-signal variance <code className="text-[#181a15] bg-white px-1.5 py-0.5 rounded border border-[#dce3d5]">σ = StdDev(Sh, Su, Si, Sai)</code>, message length brevity, and OCR image quality degradation. If signals diverge or context is insufficient, confidence drops and the system transparently advises caution rather than making overconfident assertions.
            </p>
          </div>

          <div className="bg-[#f8faf6] p-4 rounded-2xl border border-[#dce3d5] space-y-2">
            <div className="font-semibold text-[#2c401c]">Hackathon Constraint Adherence</div>
            <ul className="space-y-1 text-[#525a4c]">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3d5926] shrink-0" />
                <span>Zero link navigation: strict passive string analysis</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3d5926] shrink-0" />
                <span>Zero credential storage or session persistence</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3d5926] shrink-0" />
                <span>Transparent plain-language actionable protection steps</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3d5926] shrink-0" />
                <span>Original clean-room code written during hackathon</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

