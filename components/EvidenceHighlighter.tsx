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
          bg: "bg-rose-100 text-rose-800 border-b-2 border-rose-500 hover:bg-rose-200",
          badge: "bg-rose-50 text-rose-700 border border-rose-200",
          label: "Credential Harvesting",
        };
      case "urgency":
        return {
          bg: "bg-amber-100 text-amber-900 border-b-2 border-amber-500 hover:bg-amber-200",
          badge: "bg-amber-50 text-amber-800 border border-amber-200",
          label: "Manufactured Urgency",
        };
      case "fear_coercion":
      case "fear_intimidation":
        return {
          bg: "bg-purple-100 text-purple-900 border-b-2 border-purple-500 hover:bg-purple-200",
          badge: "bg-purple-50 text-purple-800 border border-purple-200",
          label: "Fear & Intimidation",
        };
      case "impersonation":
        return {
          bg: "bg-indigo-100 text-indigo-900 border-b-2 border-indigo-500 hover:bg-indigo-200",
          badge: "bg-indigo-50 text-indigo-800 border border-indigo-200",
          label: "Entity Impersonation",
        };
      case "suspicious_link":
      case "suspicious_url":
      case "homoglyph_attack":
      case "typosquatting":
      case "shortener":
        return {
          bg: "bg-teal-100 text-teal-900 border-b-2 border-teal-500 hover:bg-teal-200",
          badge: "bg-teal-50 text-teal-800 border border-teal-200",
          label: "Deceptive Link",
        };
      case "financial_solicitation":
      default:
        return {
          bg: "bg-[#e2edd8] text-[#2c401c] border-b-2 border-[#7db432] hover:bg-[#d5e6c7]",
          badge: "bg-[#eef4e8] text-[#3d5926] border border-[#d5e0cb]",
          label: "Financial Solicitation",
        };
    }
  };

  // Helper to check if an index cuts into the middle of a continuous word
  const isMidWord = (str: string, index: number) => {
    if (index <= 0 || index >= str.length) return false;
    return /[\w\d]/.test(str[index - 1]) && /[\w\d]/.test(str[index]);
  };

  // Consolidate and resolve spans strictly on token boundaries without word-slicing
  const resolvedSpans = React.useMemo(() => {
    if (!spans || spans.length === 0) return [];

    // Sort primarily by start ascending, then by length descending
    const sorted = [...spans].sort((a, b) => {
      if (a.start !== b.start) return a.start - b.start;
      return (b.end - b.start) - (a.end - a.start);
    });

    const result: EvidentiarySpan[] = [];
    let occupiedUntil = 0;

    for (const span of sorted) {
      let start = Math.max(occupiedUntil, span.start);
      let end = Math.min(text.length, span.end);

      // If start lands mid-word, advance to the next token boundary
      if (isMidWord(text, start)) {
        while (start < end && /[\w\d]/.test(text[start])) {
          start++;
        }
        while (start < end && /\s/.test(text[start])) {
          start++;
        }
      }

      // If end lands mid-word, expand to the end of the word token
      if (isMidWord(text, end)) {
        while (end < text.length && /[\w\d]/.test(text[end])) {
          end++;
        }
      }

      if (end - start >= 2) {
        result.push({
          ...span,
          start,
          end,
          text: text.substring(start, end),
        });
        occupiedUntil = end;
      }
    }

    return result;
  }, [spans, text]);

  // Render text segments
  const renderHighlightedText = () => {
    if (resolvedSpans.length === 0) {
      return <span>{text}</span>;
    }

    const elements: React.ReactNode[] = [];
    let currentIndex = 0;

    for (const span of resolvedSpans) {
      if (span.start > currentIndex) {
        elements.push(
          <span key={`plain-${currentIndex}`}>
            {text.substring(currentIndex, span.start)}
          </span>
        );
      }

      const styles = getCategoryStyles(span.category);
      const isSelected = selectedSpan?.id === span.id;

      elements.push(
        <mark
          key={span.id}
          tabIndex={0}
          role="button"
          aria-label={`${styles.label}: ${text.substring(span.start, span.end)}. Press Enter to view evidence breakdown.`}
          onClick={() => setSelectedSpan(span)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setSelectedSpan(span);
            }
          }}
          className={`cursor-pointer px-1.5 py-0.5 rounded transition-all font-semibold outline-none focus:ring-2 focus:ring-cyan-400 ${
            styles.bg
          } ${isSelected ? "ring-2 ring-white/70 underline underline-offset-4 decoration-2" : ""}`}
          title={`${span.title || span.category.replace(/_/g, " ")}: Click or press Enter to view evidence breakdown`}
        >
          {text.substring(span.start, span.end)}
        </mark>
      );
      currentIndex = span.end;
    }

    if (currentIndex < text.length) {
      elements.push(
        <span key={`plain-tail`}>{text.substring(currentIndex)}</span>
      );
    }

    return elements;
  };

  return (
    <div className="bg-white border border-[#e2e6dc] rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between border-b border-[#edf1e8] pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-[#3d5926]" />
          <h3 className="text-base font-serif font-bold text-[#181a15] tracking-tight">
            Interactive Evidentiary Highlight Spans
          </h3>
        </div>
        <span className="text-xs text-[#636c5c] font-medium">
          {spans.length} trigger{spans.length === 1 ? "" : "s"} identified
        </span>
      </div>

      {/* Rendered Text with Highlights */}
      <div className="p-4 bg-[#fcfdfa] rounded-2xl border border-[#d8e0d0] text-sm sm:text-base leading-relaxed font-mono whitespace-pre-wrap break-words text-[#181a15]">
        {renderHighlightedText()}
      </div>

      {/* Selected Evidence Detail Box */}
      {selectedSpan ? (
        <div className="mt-4 p-4 rounded-2xl bg-[#f8faf6] border border-[#dce3d5] shadow-2xs">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  getCategoryStyles(selectedSpan.category).badge
                }`}
              >
                {getCategoryStyles(selectedSpan.category).label}
              </span>
              <span className="text-xs font-semibold text-[#181a15]">
                {selectedSpan.title || selectedSpan.category.replace(/_/g, " ")}
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-rose-700 px-2 py-0.5 bg-rose-50 rounded-full border border-rose-200">
              {selectedSpan.severity} Severity
            </span>
          </div>

          <p className="text-xs text-[#525a4c] leading-relaxed">
            {selectedSpan.description || selectedSpan.explanation || selectedSpan.text}
          </p>

          <div className="mt-2.5 text-[11px] text-[#636c5c] flex items-center gap-1.5">
            <span className="text-[#717a69] font-mono">Matched snippet:</span>
            <code className="text-[#2c401c] font-mono bg-white px-2 py-0.5 rounded-md border border-[#dce3d5]">
              &ldquo;{selectedSpan.text}&rdquo;
            </code>
          </div>
        </div>
      ) : spans.length === 0 ? (
        <div className="mt-4 text-xs text-[#636c5c] italic text-center py-2">
          No suspicious spans identified in this message text.
        </div>
      ) : null}
    </div>
  );
};
