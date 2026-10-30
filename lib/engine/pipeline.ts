import { ScamAnalysisResult, OcrQualityReport } from "../types";
import { runHeuristics } from "./heuristics";
import { inspectUrlsPassively } from "./passive-url";
import { detectImpersonation } from "./impersonation";
import { analyzeWithGemini } from "./ai-analyzer";
import { fuseAnalysisResults } from "./fusion";

export async function runScamDetectionPipeline({
  inputText,
  inputType = "text",
  ocrQuality,
  skipAi = false,
}: {
  inputText: string;
  inputType?: "text" | "ocr_screenshot";
  ocrQuality?: OcrQualityReport;
  skipAi?: boolean;
}): Promise<ScamAnalysisResult> {
  const sanitizedText = inputText.trim();
  const id = `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const timestamp = new Date().toISOString();

  // 1. Rule-based heuristic pattern matching
  const heuristics = runHeuristics(sanitizedText);

  // 2. Safe passive URL inspection (zero network queries)
  const urlReports = inspectUrlsPassively(sanitizedText);
  const detectedDomains = urlReports.reports
    .map((r) => r.domain || r.normalizedDomain)
    .filter((d): d is string => Boolean(d));

  // 3. Impersonation detection
  const impersonation = detectImpersonation(sanitizedText, detectedDomains);

  // 4. Contextual AI semantic analysis
  let aiAnalysis = null;
  if (!skipAi) {
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

  // 5. Multi-method fusion and uncertainty estimation (heuristic confidence estimate with hand-set weights)
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
    actionSteps: fused.actionSteps,
    heuristicsHits: heuristics.hits,
    urlReports: urlReports.reports,
    impersonationMatch: impersonation.match,
    aiAnalysis,
    disclaimer:
      "No automated system can detect 100% of scams or guarantee safety. Exercise independent judgment and independently verify via official direct channels.",
    metricsBreakdown: fused.metricsBreakdown,
  };
}

export const analyzeScamMessage = ({
  text,
  inputType = "text",
  ocrQuality,
  skipAi = false,
}: {
  text: string;
  inputType?: "text" | "ocr_screenshot";
  ocrQuality?: OcrQualityReport;
  skipAi?: boolean;
}) => runScamDetectionPipeline({ inputText: text, inputType, ocrQuality, skipAi });
