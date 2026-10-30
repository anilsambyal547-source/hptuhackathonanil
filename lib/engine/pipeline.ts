import { ScamAnalysisResult, OcrQualityReport } from "../types";
import { runHeuristics } from "./heuristics";
import { inspectUrlsPassively } from "./passive-url";
import { detectImpersonation } from "./impersonation";
import { analyzeWithGemini, generateLocalSemanticAssessment } from "./ai-analyzer";
import { fuseAnalysisResults } from "./fusion";

export async function analyzeScamMessage({
  text,
  inputType = "text",
  ocrQuality,
  skipAi = false,
}: {
  text: string;
  inputType?: "text" | "ocr_screenshot";
  ocrQuality?: OcrQualityReport;
  skipAi?: boolean;
}): Promise<ScamAnalysisResult> {
  const sanitizedText = text.trim();
  const id = `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const timestamp = new Date().toISOString();

  // 1. Run deterministic heuristics (urgency, fear, credentials, UPI)
  const heuristics = runHeuristics(sanitizedText);

  // 2. Safe passive URL inspection (NO outbound network fetch)
  const urlReports = inspectUrlsPassively(sanitizedText);
  const detectedDomains = urlReports.reports.map((r) => r.normalizedDomain);

  // 3. Impersonation detection
  const impersonation = detectImpersonation(sanitizedText, detectedDomains);

  // 4. Contextual AI semantic analysis (Gemini or local semantic parser)
  let aiAnalysis = null;
  if (skipAi) {
    aiAnalysis = generateLocalSemanticAssessment(sanitizedText);
  } else {
    const heuristicSummary = `
- Heuristic hits count: ${heuristics.hits.length}
- Triggers: ${heuristics.hits.map((h) => h.title).join(", ") || "None"}
- URLs identified: ${urlReports.reports.length}
- Highest URL risk: ${urlReports.highestUrlRiskScore}
- Claimed Entity: ${impersonation.match?.claimedEntity ?? "None"}
- Suspected Impersonation: ${impersonation.match?.isImpersonated ? "YES" : "NO"}
`.trim();
    aiAnalysis = await analyzeWithGemini(sanitizedText, heuristicSummary);
  }

  // 5. Multi-method fusion and calibrated uncertainty calculation
  const fused = fuseAnalysisResults({
    heuristics,
    urlReports,
    impersonation,
    aiAnalysis,
    ocrQuality,
    inputText: sanitizedText,
  });

  return {
    id,
    timestamp,
    inputText: sanitizedText,
    inputType,
    ocrQuality,
    overallRisk: fused.overallRisk,
    riskScore: fused.riskScore,
    uncertainty: fused.uncertainty,
    plainLanguageSummary: fused.plainLanguageSummary,
    evidenceSpans: fused.evidenceSpans,
    heuristicHits: heuristics.hits,
    urlReports: urlReports.reports,
    impersonation: impersonation.match,
    aiAnalysis,
    actionSteps: fused.actionSteps,
    metricsBreakdown: fused.metricsBreakdown,
    disclaimer:
      "SafeGuard analysis combines deterministic rules, passive link inspections, and AI heuristics. No links were visited during this analysis. While highly accurate, no automated tool can guarantee 100% safety. Exercise independent judgment before taking financial or security actions.",
  };
}

