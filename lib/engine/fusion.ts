import {
  RiskLevel,
  UncertaintyReport,
  SafeActionStep,
  HeuristicHit,
  UrlInspectionReport,
  ImpersonationMatch,
  AiAnalysisResult,
  OcrQualityReport,
  EvidentiarySpan,
} from "../types";

export function fuseAnalysisResults({
  heuristics,
  urlReports,
  impersonation,
  aiAnalysis,
  ocrQuality,
  inputText,
}: {
  heuristics: { hits: HeuristicHit[]; spans: EvidentiarySpan[]; score: number };
  urlReports: { reports: UrlInspectionReport[]; spans: EvidentiarySpan[]; highestUrlRiskScore: number };
  impersonation: { match: ImpersonationMatch | null; span: EvidentiarySpan | null; impersonationRiskScore: number };
  aiAnalysis: AiAnalysisResult | null;
  ocrQuality?: OcrQualityReport;
  inputText: string;
}): {
  overallRisk: RiskLevel;
  riskScore: number;
  uncertainty: UncertaintyReport;
  plainLanguageSummary: string;
  evidenceSpans: EvidentiarySpan[];
  actionSteps: SafeActionStep[];
  metricsBreakdown: {
    heuristicScore: number;
    urlScore: number;
    impersonationScore: number;
    aiScore: number;
  };
} {
  const hScore = heuristics.score;
  const uScore = urlReports.highestUrlRiskScore;
  const iScore = impersonation.impersonationRiskScore;
  const aiScore = aiAnalysis ? aiAnalysis.riskScore : hScore;

  // Weighted composite risk calculation
  // Strong weight given to deterministic red flags
  let compositeScore = 0;

  const hasCriticalHeuristic = heuristics.hits.some((h) => h.severity === "critical");
  const hasMaliciousUrl = uScore >= 65;
  const hasSevereImpersonation = impersonation.match?.isImpersonated === true;
  const hasUrgentThreat = heuristics.hits.some(
    (h) => h.severity === "high" && (h.id.includes("urg-") || h.id.includes("fear-") || h.id.includes("courier-") || h.id.includes("cred-"))
  );

  if (
    hasCriticalHeuristic ||
    hasMaliciousUrl ||
    (hasSevereImpersonation && (uScore >= 25 || hScore >= 20)) ||
    (hasUrgentThreat && (uScore >= 20 || hScore >= 40))
  ) {
    // Critical safety override: severe indicators guarantee high risk rating
    compositeScore = Math.max(78, Math.round(0.35 * hScore + 0.35 * uScore + 0.15 * iScore + 0.15 * aiScore));
  } else if (heuristics.hits.length > 0 || uScore >= 20 || hasSevereImpersonation) {
    // Suspicious / moderate risk range
    compositeScore = Math.max(40, Math.round(0.35 * hScore + 0.35 * uScore + 0.15 * iScore + 0.15 * aiScore));
  } else {
    compositeScore = Math.round(0.35 * hScore + 0.35 * uScore + 0.15 * iScore + 0.15 * aiScore);
  }

  compositeScore = Math.min(100, Math.max(0, compositeScore));

  const overallRisk: RiskLevel =
    compositeScore >= 70 ? "high" : compositeScore >= 30 ? "suspicious" : "low";

  // --- UNCERTAINTY QUANTIFICATION ---
  const signals = [hScore, uScore, iScore, aiScore];
  const mean = signals.reduce((a, b) => a + b, 0) / signals.length;
  const variance = signals.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / signals.length;
  const stdDev = Math.sqrt(variance);

  const uncertaintyReasons: string[] = [];
  let baseConfidence = 92;

  // Signal divergence penalty
  if (stdDev > 35) {
    baseConfidence -= 25;
    uncertaintyReasons.push("Detection subsystems produced divergent risk scores (heuristics vs semantic AI).");
  } else if (stdDev > 20) {
    baseConfidence -= 12;
    uncertaintyReasons.push("Moderate variance between rule heuristics and URL signals.");
  }

  // Short/ambiguous text penalty
  const trimmed = inputText.trim();
  if (trimmed.length < 25 && urlReports.reports.length === 0) {
    baseConfidence -= 30;
    uncertaintyReasons.push("Message text is very brief, lacking contextual cues or sender metadata.");
  }

  // OCR quality degradation penalty
  if (ocrQuality) {
    if (!ocrQuality.isReadable || ocrQuality.confidence < 60) {
      baseConfidence -= 35;
      uncertaintyReasons.push("Screenshot text quality is degraded or low-contrast, increasing likelihood of missed characters.");
    } else if (ocrQuality.confidence < 75) {
      baseConfidence -= 15;
      uncertaintyReasons.push("Minor OCR noise detected in screenshot rendering.");
    }
  }

  const finalConfidence = Math.max(25, Math.min(99, baseConfidence));
  const isAmbiguous = finalConfidence < 65 || (compositeScore >= 25 && compositeScore <= 45);

  const uncertaintyLevel: "low" | "moderate" | "high" =
    finalConfidence >= 80 ? "low" : finalConfidence >= 60 ? "moderate" : "high";

  const uncertaintyReport: UncertaintyReport = {
    uncertaintyLevel,
    confidencePercent: finalConfidence,
    reasons: uncertaintyReasons.length > 0 ? uncertaintyReasons : ["Consistent signal alignment across all analysis engines."],
    isAmbiguous,
    recommendation: isAmbiguous
      ? "Signals are ambiguous or confidence is reduced. Do NOT open links or reply; independently verify via official direct channels."
      : "High evaluation confidence based on consensus across detection methods.",
  };

  // --- PLAIN LANGUAGE EXPLANATION ---
  let plainLanguageSummary = "";
  if (overallRisk === "high") {
    if (impersonation.match?.isImpersonated) {
      plainLanguageSummary = `High-Risk Scam Alert: This message impersonates ${impersonation.match.claimedEntity} while using unauthorized channels or deceptive links. It employs manufactured urgency and requests sensitive action.`;
    } else if (hasMaliciousUrl) {
      plainLanguageSummary = `Dangerous Link Detected: The message contains a link exhibiting signs of typosquatting, deceptive subdomains, or high-risk domain patterns. Do not tap or open this link.`;
    } else if (hasCriticalHeuristic) {
      plainLanguageSummary = `Credential Theft / Coercion Detected: This message solicits confidential credentials (OTPs, PINs, banking logins) or uses intimidation tactics like 'digital arrest'. Legitimate organizations never request these.`;
    } else {
      plainLanguageSummary = `High Scam Probability: Multiple suspicious patterns and social engineering pressure tactics were identified. Treat this communication as fraudulent.`;
    }
  } else if (overallRisk === "suspicious") {
    plainLanguageSummary = `Caution Warranted: This message contains urgent phrasing, unverified links, or unfamiliar requests. While not conclusively proven as a scam, it deviates from standard official notifications.`;
  } else {
    plainLanguageSummary = `Low Risk Detected: No significant phishing patterns, credential harvesting triggers, or suspicious link structures were found. Always practice standard caution with unverified senders.`;
  }

  // Combine and deduplicate evidentiary spans
  const allSpans: EvidentiarySpan[] = [
    ...heuristics.spans,
    ...urlReports.spans,
    ...(impersonation.span ? [impersonation.span] : []),
  ];

  // --- ACTIONABLE SAFE NEXT STEPS ---
  const actionSteps: SafeActionStep[] = [];

  if (overallRisk === "high" || overallRisk === "suspicious") {
    actionSteps.push({
      id: "step-no-click",
      title: "Do Not Click Any Links",
      instruction: "Never tap, click, or copy-paste links from unverified messages. They can lead to credential theft or malicious downloads.",
      why: "Phishing pages often clone real login portals to steal credentials instantly.",
      priority: "immediate",
    });

    actionSteps.push({
      id: "step-no-otp",
      title: "Never Disclose Security Credentials",
      instruction: "Never share OTPs, UPI PINs, NetBanking passwords, or card CVVs over message or call.",
      why: "Banks and legitimate services NEVER ask for your PIN or OTP to credit money or cancel an order.",
      priority: "immediate",
    });

    if (impersonation.match) {
      actionSteps.push({
        id: "step-official-channel",
        title: `Verify Directly with ${impersonation.match.claimedEntity}`,
        instruction: `Open your official ${impersonation.match.claimedEntity} mobile app or visit their official website (${impersonation.match.verifiedDomains[0] ?? impersonation.match.officialPortal}) directly.`,
        why: "Direct channels guarantee authentic status updates without risk of interception.",
        priority: "recommended",
        officialPortalUrl: impersonation.match.officialPortal,
        phoneHelpline: impersonation.match.officialHelpline,
      });
    }

    actionSteps.push({
      id: "step-report-portal",
      title: "Report to National Cyber Crime Portal",
      instruction: "Forward the fraud message or call details to the National Cybercrime Reporting Portal or dial helpline 1930.",
      why: "Helps authorities block fraud accounts, seize malicious domains, and freeze fraudulent payment gateways.",
      priority: "recommended",
      officialPortalUrl: "https://cybercrime.gov.in",
      phoneHelpline: "1930",
    });
  } else {
    actionSteps.push({
      id: "step-general-safety",
      title: "Standard Verification",
      instruction: "If this notification concerns an account or order, verify it inside the official app rather than clicking links in SMS.",
      why: "Routine safety habit to ensure links have not been manipulated.",
      priority: "general",
    });
  }

  return {
    overallRisk,
    riskScore: compositeScore,
    uncertainty: uncertaintyReport,
    plainLanguageSummary,
    evidenceSpans: allSpans,
    actionSteps,
    metricsBreakdown: {
      heuristicScore: hScore,
      urlScore: uScore,
      impersonationScore: iScore,
      aiScore,
    },
  };
}

