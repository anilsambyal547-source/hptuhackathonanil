export type RiskLevel = "low" | "suspicious" | "high";

export type EvidenceCategory =
  | "urgency"
  | "fear_intimidation"
  | "fear_coercion"
  | "credential_harvesting"
  | "financial_solicitation"
  | "impersonation"
  | "suspicious_url"
  | "suspicious_link"
  | "homoglyph_attack"
  | "typosquatting"
  | "shortener";

export type SeverityLevel = "low" | "medium" | "high" | "critical";

export interface EvidentiarySpan {
  id: string;
  start: number;
  end: number;
  text: string;
  category: EvidenceCategory;
  severity: "low" | "medium" | "high" | "critical";
  description?: string;
  explanation?: string;
  title?: string;
}

export interface HeuristicHit {
  id: string;
  category: string;
  title: string;
  matchedText: string;
  severity: "low" | "medium" | "high" | "critical";
  riskWeight?: number;
  weight?: number;
  explanation: string;
  startIndex?: number;
  endIndex?: number;
}

export interface UrlInspectionReport {
  rawUrl?: string;
  originalUrl?: string;
  domain?: string;
  normalizedDomain?: string;
  protocol: string;
  isShortener: boolean;
  shortenerProvider?: string;
  isOpenRedirect?: boolean;
  openRedirectRisk?: boolean;
  isBareIp?: boolean;
  isIpAddress?: boolean;
  hasSuspiciousTld?: boolean;
  suspiciousTld?: boolean;
  tld: string;
  homoglyphDetected?: boolean;
  hasHomoglyphs?: boolean;
  homoglyphDetails?: (
    | {
        originalChar: string;
        confusableWith: string;
        script: string;
      }
    | string
  )[];
  typosquattingDetected?: boolean;
  targetBrand?: string;
  typosquattingTarget?: string;
  levenshteinDistance?: number;
  typosquattingDistance?: number;
  passiveRiskScore?: number;
  riskScore: number;
  riskReasons?: string[];
  reasons?: string[];
  subdomainCount: number;
  subdomains?: string[];
  isSafe?: boolean;
}

export interface ImpersonationMatch {
  claimedEntity: string;
  isImpersonated: boolean;
  officialDomains: string[];
  verifiedDomains?: string[];
  mismatchedDomain?: string;
  mismatchReason?: string;
  officialHelpline?: string;
  officialPortal?: string;
  category?: "bank" | "courier" | "government" | "telecom" | "utility" | "police_legal" | "tech" | "job_portal";
  entityCategory?: "bank" | "courier" | "government" | "telecom" | "utility" | "police_legal" | "tech" | "job_portal";
  confidence?: number;
}

export interface AiAnalysisResult {
  riskScore: number;
  riskLevel: RiskLevel;
  reasoning: string;
  manipulationTactics: string[];
  plainLanguageExplanation: string;
  confidenceScore: number;
  safeNextSteps: string[];
}

export interface UncertaintyReport {
  uncertaintyLevel: "low" | "moderate" | "high";
  confidencePercent: number; // 0 - 100
  reasons: string[];
  isAmbiguous: boolean;
  recommendation: string;
}

export interface SafeActionStep {
  id?: string;
  priority: "immediate" | "recommended" | "optional";
  action: string;
  explanation: string;
  title?: string;
  instruction?: string;
  why?: string;
  phoneHelpline?: string;
  officialPortalUrl?: string;
}

export interface OcrQualityReport {
  isReadable: boolean;
  confidence: number; // 0 - 100
  charCount: number;
  warnings: string[];
}

export interface ScamAnalysisResult {
  id: string;
  timestamp: string;
  inputText: string;
  inputType: "text" | "ocr_screenshot";
  ocrQuality?: OcrQualityReport;
  overallRisk: RiskLevel;
  riskScore: number; // 0 - 100
  uncertainty: UncertaintyReport;
  plainLanguageSummary: string;
  evidenceSpans: EvidentiarySpan[];
  actionSteps: SafeActionStep[];
  heuristicsHits: HeuristicHit[];
  urlReports: UrlInspectionReport[];
  impersonationMatch: ImpersonationMatch | null;
  aiAnalysis: AiAnalysisResult | null;
  disclaimer: string;
  metricsBreakdown: {
    heuristicScore: number;
    urlScore: number;
    impersonationScore: number;
    aiScore: number | null;
    aiAvailable: boolean;
  };
}

export interface BenchmarkSample {
  id: string;
  title: string;
  category: string;
  groundTruth: RiskLevel;
  text: string;
  notes: string;
  split: "dev" | "holdout";
  isSynthetic: boolean;
  sourceOrigin: "real_advisory_case" | "synthetic";
}

export interface BenchmarkResultItem {
  id: string;
  title: string;
  category: string;
  groundTruth: RiskLevel;
  predictedRisk: RiskLevel;
  riskScore: number;
  confidencePercent: number;
  isCorrect: boolean;
  latencyMs: number;
  triggerCount: number;
  split: "dev" | "holdout";
  rulesFired: string[];
}

export interface BenchmarkMisclassifiedItem {
  id: string;
  title: string;
  text: string;
  groundTruth: RiskLevel;
  predictedRisk: RiskLevel;
  riskScore: number;
  rulesFired: string[];
  split: "dev" | "holdout";
}

export interface SplitMetrics {
  totalSamples: number;
  correctPredictions: number;
  accuracy: number;
  precision: {
    low: number;
    suspicious: number;
    high: number;
    macroAvg: number;
  };
  recall: {
    low: number;
    suspicious: number;
    high: number;
    macroAvg: number;
  };
  f1Score: {
    low: number;
    suspicious: number;
    high: number;
    macroAvg: number;
  };
}

export interface BenchmarkSummaryMetrics {
  totalSamples: number;
  scamSamples: number;
  legitimateSamples: number;
  correctPredictions: number;
  accuracy: number;
  precision: {
    low: number;
    suspicious: number;
    high: number;
    macroAvg: number;
  };
  recall: {
    low: number;
    suspicious: number;
    high: number;
    macroAvg: number;
  };
  f1Score: {
    low: number;
    suspicious: number;
    high: number;
    macroAvg: number;
  };
  confusionMatrix: {
    actualHigh_predHigh: number;
    actualHigh_predSuspicious: number;
    actualHigh_predLow: number;
    actualSuspicious_predHigh: number;
    actualSuspicious_predSuspicious: number;
    actualSuspicious_predLow: number;
    actualLow_predHigh: number;
    actualLow_predSuspicious: number;
    actualLow_predLow: number;
  };
  averageLatencyMs: number;
  devMetrics: SplitMetrics;
  holdoutMetrics: SplitMetrics;
  misclassifiedSamples: BenchmarkMisclassifiedItem[];
  sampleSizeNote: string;
}
