export type RiskLevel = "low" | "suspicious" | "high";

export type EvidenceCategory =
  | "urgency"
  | "fear_coercion"
  | "credential_harvesting"
  | "financial_solicitation"
  | "impersonation"
  | "suspicious_link";

export type SeverityLevel = "info" | "low" | "medium" | "high" | "critical";

export interface EvidentiarySpan {
  id: string;
  start: number;
  end: number;
  text: string;
  category: EvidenceCategory;
  severity: SeverityLevel;
  title: string;
  explanation: string;
}

export interface UrlInspectionReport {
  originalUrl: string;
  normalizedDomain: string;
  protocol: string;
  isIpAddress: boolean;
  subdomainCount: number;
  subdomains: string[];
  isShortener: boolean;
  shortenerProvider?: string;
  suspiciousTld: boolean;
  tld: string;
  hasHomoglyphs: boolean;
  homoglyphDetails?: string[];
  typosquattingTarget?: string;
  typosquattingDistance?: number;
  openRedirectRisk: boolean;
  riskScore: number; // 0 - 100
  reasons: string[];
  isSafe: boolean;
}

export interface HeuristicHit {
  id: string;
  category: EvidenceCategory;
  matchedText: string;
  severity: SeverityLevel;
  weight: number;
  title: string;
  explanation: string;
  startIndex?: number;
  endIndex?: number;
}

export interface ImpersonationMatch {
  claimedEntity: string;
  entityCategory: "bank" | "courier" | "government" | "telecom" | "utility" | "police_legal" | "tech";
  verifiedDomains: string[];
  isImpersonated: boolean;
  mismatchReason?: string;
  officialHelpline?: string;
  officialPortal?: string;
}

export interface AiAnalysisResult {
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  reasoning: string;
  manipulationTactics: string[];
  plainLanguageExplanation: string;
  confidenceScore: number; // 0 - 1
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
  id: string;
  title: string;
  instruction: string;
  why: string;
  priority: "immediate" | "recommended" | "general";
  officialPortalUrl?: string;
  phoneHelpline?: string;
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
  heuristicHits: HeuristicHit[];
  urlReports: UrlInspectionReport[];
  impersonation: ImpersonationMatch | null;
  aiAnalysis: AiAnalysisResult | null;
  actionSteps: SafeActionStep[];
  disclaimer: string;
  metricsBreakdown: {
    heuristicScore: number;
    urlScore: number;
    impersonationScore: number;
    aiScore: number;
  };
}

export interface BenchmarkSample {
  id: string;
  title: string;
  category:
    | "bank_phishing"
    | "courier_scam"
    | "digital_arrest"
    | "fear_coercion"
    | "financial_solicitation"
    | "job_scam"
    | "lottery_fraud"
    | "electricity_cut"
    | "crypto_investment"
    | "legitimate_bank"
    | "legitimate_courier"
    | "legitimate_otp"
    | "legitimate_work"
    | "legitimate_bill";
  groundTruth: RiskLevel;
  text: string;
  notes: string;
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
}

export interface BenchmarkSummaryMetrics {
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
}
