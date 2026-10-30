"use client";

import React from "react";
import { Cpu, Globe, Zap, Landmark, Brain, Sliders, CheckCircle2 } from "lucide-react";

export const ArchitectureDiagram: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-white tracking-wide">
            SafeGuard Multi-Method Detection Architecture
          </h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          Unlike naive single-prompt AI wrappers, SafeGuard fuses four independent verification engines: deterministic regex heuristics, algorithmic passive URL analysis, official brand impersonation registry, and contextual semantic LLM evaluation.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1 */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-sm space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <Zap className="w-5 h-5" />
            <h3 className="text-sm font-semibold text-white">1. Heuristic Engine</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Deterministic token matching across 80+ patterns: manufactured urgency (&ldquo;within 2 hours&rdquo;), fear/coercion (&ldquo;digital arrest&rdquo;, CBI summons), and credential solicitation (OTP, CVV, ATM PIN, UPI ID).
          </p>
          <div className="text-[11px] text-amber-400/90 font-mono bg-slate-950 p-2 rounded border border-slate-800">
            Latency: ~15ms • Sub-word Regex
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-sm space-y-3">
          <div className="flex items-center gap-2 text-cyan-400">
            <Globe className="w-5 h-5" />
            <h3 className="text-sm font-semibold text-white">2. Passive URL Sandbox</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Pure string decomposition without outbound network requests. Inspects Damerau-Levenshtein typosquatting, Cyrillic/Greek homoglyphs (\u0430 lookalikes), IP hosts, shorteners, and high-risk TLDs.
          </p>
          <div className="text-[11px] text-cyan-400/90 font-mono bg-slate-950 p-2 rounded border border-slate-800">
            Zero Outbound Fetch • IDN / Punycode
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-sm space-y-3">
          <div className="flex items-center gap-2 text-purple-400">
            <Landmark className="w-5 h-5" />
            <h3 className="text-sm font-semibold text-white">3. Impersonation Guard</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Cross-checks claimed entities (SBI, HDFC, India Post, FedEx, Mumbai Police, Income Tax) against verified domain registries. Flags instant critical mismatch when links point to unauthorized domains.
          </p>
          <div className="text-[11px] text-purple-400/90 font-mono bg-slate-950 p-2 rounded border border-slate-800">
            Domain-Entity Alignment Verification
          </div>
        </div>

        {/* Pillar 4 */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg backdrop-blur-sm space-y-3">
          <div className="flex items-center gap-2 text-blue-400">
            <Brain className="w-5 h-5" />
            <h3 className="text-sm font-semibold text-white">4. Contextual Semantic AI</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Structured schema evaluation via Gemini API or resilient local semantic parser. Evaluates subtle emotional coercion, conversational manipulation, and tone nuance that pure regex cannot capture.
          </p>
          <div className="text-[11px] text-blue-400/90 font-mono bg-slate-950 p-2 rounded border border-slate-800">
            Strict JSON Schema • Offline Resilient
          </div>
        </div>
      </div>

      {/* Uncertainty & Constraints Compliance Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-white tracking-wide mb-3 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>Calibrated Uncertainty Formulation & Compliance Guarantees</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div className="font-semibold text-cyan-300">Uncertainty Calibration (Formula)</div>
            <p className="leading-relaxed text-slate-400">
              Confidence is mathematically calibrated against cross-signal variance <code className="text-slate-200">σ = StdDev(Sh, Su, Si, Sai)</code>, message length brevity, and OCR image quality degradation. If signals diverge or context is insufficient, confidence drops and the system transparently advises caution rather than making overconfident assertions.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <div className="font-semibold text-emerald-300">Hackathon Constraint Adherence</div>
            <ul className="space-y-1 text-slate-400">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero link navigation: strict passive string analysis</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero credential storage or session persistence</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Transparent plain-language actionable protection steps</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Original clean-room code written during hackathon</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

