"use client";

import React, { useState } from "react";
import { EvidentiarySpan, EvidenceCategory } from "@/lib/types";
import { Tag } from "lucide-react";

interface EvidenceHighlighterProps {
  text: string;
  spans: EvidentiarySpan[];
}

export const EvidenceHighlighter: React.FC<EvidenceHighlighterProps> = ({ text, spans }) => {
  const [selectedSpan, setSelectedSpan] = useState<EvidentiarySpan | null>(
    spans.length > 0 ? spans[0] : null
  );

  const getCategoryStyles = (category: EvidenceCategory) => {
    switch (category) {
      case "credential_harvesting":
        return {
          bg: "bg-rose-500/20 text-rose-300 border-b-2 border-rose-500 hover:bg-rose-500/30",
          badge: "bg-rose-500/20 text-rose-400 border border-rose-500/30",
          label: "Credential Harvesting",
        };
      case "urgency":
        return {
          bg: "bg-amber-500/20 text-amber-300 border-b-2 border-amber-500 hover:bg-amber-500/30",
          badge: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
          label: "Manufactured Urgency",
        };
      case "fear_coercion":
        return {
          bg: "bg-red-600/25 text-red-300 border-b-2 border-red-500 hover:bg-red-600/35",
          badge: "bg-red-600/20 text-red-400 border border-red-600/30",
          label: "Fear & Intimidation",
        };
      case "impersonation":
        return {
          bg: "bg-purple-500/20 text-purple-300 border-b-2 border-purple-500 hover:bg-purple-500/30",
          badge: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
          label: "Entity Impersonation",
        };
      case "suspicious_link":
        return {
          bg: "bg-cyan-500/20 text-cyan-300 border-b-2 border-cyan-500 hover:bg-cyan-500/30",
          badge: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
          label: "Deceptive Link",
        };
      case "financial_solicitation":
      default:
        return {
          bg: "bg-emerald-500/20 text-emerald-300 border-b-2 border-emerald-500 hover:bg-emerald-500/30",
          badge: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
          label: "Financial Solicitation",
        };
    }
  };

  // Sort and deduplicate overlapping spans
  const sortedSpans = [...spans].sort((a, b) => a.start - b.start);

  // Render text segments
  const renderHighlightedText = () => {
    if (sortedSpans.length === 0) {
      return <span>{text}</span>;
    }

    const elements: React.ReactNode[] = [];
    let currentIndex = 0;

    for (let i = 0; i < sortedSpans.length; i++) {
      const span = sortedSpans[i];
      const start = Math.max(currentIndex, span.start);
      const end = Math.min(text.length, span.end);

      if (start > currentIndex) {
        elements.push(
          <span key={`plain-${currentIndex}`}>
            {text.substring(currentIndex, start)}
          </span>
        );
      }

      if (end > start) {
        const styles = getCategoryStyles(span.category);
        const isSelected = selectedSpan?.id === span.id;

        elements.push(
          <mark
            key={span.id}
            onClick={() => setSelectedSpan(span)}
            className={`cursor-pointer px-1 py-0.5 rounded transition-all font-semibold ${
              styles.bg
            } ${isSelected ? "ring-2 ring-white/50" : ""}`}
            title={`${span.title}: Click to view evidence breakdown`}
          >
            {text.substring(start, end)}
          </mark>
        );
        currentIndex = end;
      }
    }

    if (currentIndex < text.length) {
      elements.push(
        <span key={`plain-tail`}>{text.substring(currentIndex)}</span>
      );
    }

    return elements;
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white tracking-wide">
            Interactive Evidentiary Highlight Spans
          </h3>
        </div>
        <span className="text-xs text-slate-400">
          {spans.length} trigger{spans.length === 1 ? "" : "s"} identified
        </span>
      </div>

      {/* Rendered Text with Highlights */}
      <div className="p-4 bg-slate-950/90 rounded-xl border border-slate-800/80 text-sm sm:text-base leading-relaxed font-mono whitespace-pre-wrap break-words text-slate-200">
        {renderHighlightedText()}
      </div>

      {/* Selected Evidence Detail Box */}
      {selectedSpan ? (
        <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-cyan-900/40 shadow-inner">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  getCategoryStyles(selectedSpan.category).badge
                }`}
              >
                {getCategoryStyles(selectedSpan.category).label}
              </span>
              <span className="text-xs font-semibold text-slate-200">
                {selectedSpan.title}
              </span>
            </div>
            <span className="text-[11px] uppercase tracking-wider font-bold text-rose-400 px-1.5 py-0.5 bg-rose-950/50 rounded border border-rose-800/40">
              {selectedSpan.severity} Severity
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedSpan.explanation}
          </p>

          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="text-slate-500 font-mono">Matched snippet:</span>
            <code className="text-cyan-300 font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
              &ldquo;{selectedSpan.text}&rdquo;
            </code>
          </div>
        </div>
      ) : spans.length === 0 ? (
        <div className="mt-4 text-xs text-slate-400 italic text-center py-2">
          No explicit scam phrases or suspicious links extracted from this input.
        </div>
      ) : null}
    </div>
  );
};

