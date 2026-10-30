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
    aiScore: number | null;
    aiAvailable: boolean;
  };
} {
  const hScore = heuristics.score;
  const uScore = urlReports.highestUrlRiskScore;
  const iScore = impersonation.impersonationRiskScore;
  const aiScore = aiAnalysis ? aiAnalysis.riskScore : null;
  const aiAvailable = aiAnalysis !== null;

  // 1. Dynamic Term Weighting: Exclude AI when unavailable and reweight remaining active terms
  // Base weights when all analyzers are applicable:
  // Heuristics: 0.35, URL: 0.35, Impersonation: 0.15, AI: 0.15
  interface ActiveTerm {
    name: string;
    score: number;
    baseWeight: number;
  }

  const terms: ActiveTerm[] = [
    { name: "heuristics", score: hScore, baseWeight: 0.35 },
  ];

  if (urlReports.reports.length > 0) {
    terms.push({ name: "url", score: uScore, baseWeight: 0.35 });
  }

  if (impersonation.match !== null) {
    terms.push({ name: "impersonation", score: iScore, baseWeight: 0.15 });
  }

  if (aiAvailable && aiScore !== null) {
    terms.push({ name: "ai", score: aiScore, baseWeight: 0.15 });
  }

  // Normalize active weights so they sum to 1.0 without double-counting heuristics
  const totalBaseWeight = terms.reduce((acc, t) => acc + t.baseWeight, 0);
  let rawCompositeScore = 0;
  for (const term of terms) {
    const normalizedWeight = term.baseWeight / totalBaseWeight;
    rawCompositeScore += normalizedWeight * term.score;
  }
  let compositeScore = Math.round(rawCompositeScore);

  // 2. Critical Threat Hard Floor (only for confirmed severe indicators)
  const hasCriticalHeuristic = heuristics.hits.some((h) => h.severity === "critical");
  const hasSeverePhishingUrl = uScore >= 75;
  const hasConfirmedImpersonationAttack = impersonation.match?.isImpersonated === true && (uScore >= 45 || hScore >= 45);

  const isHardScamIndicator =
    hasCriticalHeuristic ||
    hasSeverePhishingUrl ||
    hasConfirmedImpersonationAttack;

  if (isHardScamIndicator) {
    // Floor of 75 ensures critical threats remain in High tier without crushing Suspicious
    compositeScore = Math.max(75, compositeScore);
  }

  // Bound composite score between 0 and 100
  compositeScore = Math.min(100, Math.max(0, compositeScore));

  // Risk Tiers:
  // High: >= 70
  // Suspicious: >= 30 and < 70 (reachable for genuinely ambiguous messages)
  // Low: < 30
  const overallRisk: RiskLevel =
    compositeScore >= 70 ? "high" : compositeScore >= 30 ? "suspicious" : "low";

  // 3. Uncertainty Quantification: Compute disagreement ONLY among analyzers that had applicable input
  const applicableSignals: { name: string; score: number }[] = [
    { name: "heuristics", score: hScore },
  ];
  if (urlReports.reports.length > 0) {
    applicableSignals.push({ name: "url", score: uScore });
  }
  if (impersonation.match !== null) {
    applicableSignals.push({ name: "impersonation", score: iScore });
  }
  if (aiAvailable && aiScore !== null) {
    applicableSignals.push({ name: "ai", score: aiScore });
  }

  let stdDev = 0;
  if (applicableSignals.length >= 2) {
    const scores = applicableSignals.map((s) => s.score);
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / scores.length;
    stdDev = Math.sqrt(variance);
  }

  const uncertaintyReasons: string[] = [];
  let baseConfidence = 92;

  // Signal divergence penalty (only when multiple active analyzers disagree)
  if (stdDev > 35) {
    baseConfidence -= 25;
    uncertaintyReasons.push("Active detection subsystems produced divergent risk scores.");
  } else if (stdDev > 20) {
    baseConfidence -= 12;
    uncertaintyReasons.push("Moderate variance between active detection signals.");
  }

  // Missing AI note
  if (!aiAvailable) {
    uncertaintyReasons.push("Semantic AI model unavailable; evaluated via local heuristic and structural rules.");
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
  const isAmbiguous = overallRisk === "suspicious" || finalConfidence < 65;

  const uncertaintyLevel: "low" | "moderate" | "high" =
    finalConfidence >= 80 ? "low" : finalConfidence >= 60 ? "moderate" : "high";

  // Heuristic confidence estimate with hand-set weights
  const uncertaintyReport: UncertaintyReport = {
    uncertaintyLevel,
    confidencePercent: finalConfidence,
    reasons: uncertaintyReasons.length > 0 ? uncertaintyReasons : ["Consistent signal alignment across active analysis engines."],
    isAmbiguous,
    recommendation: isAmbiguous
      ? "Signals are ambiguous or confidence is reduced. Do NOT open links or reply; independently verify via official direct channels."
      : "High evaluation confidence based on consensus across active detection methods.",
  };

  // 4. Plain Language Explanation
  let plainLanguageSummary = "";
  if (overallRisk === "high") {
    if (impersonation.match?.isImpersonated) {
      plainLanguageSummary = `High-Risk Scam Alert: This message impersonates ${impersonation.match.claimedEntity} while using unauthorized channels or deceptive links. It employs manufactured urgency and requests sensitive action.`;
    } else if (hasSeverePhishingUrl) {
      plainLanguageSummary = `Dangerous Link Detected: The message contains a link exhibiting signs of typosquatting, deceptive subdomains, or high-risk domain patterns. Do not tap or open this link.`;
    } else if (hasCriticalHeuristic) {
      plainLanguageSummary = `Credential Theft / Coercion Detected: This message solicits confidential credentials (OTPs, PINs, banking logins) or uses intimidation tactics like 'digital arrest'. Legitimate organizations never request these.`;
    } else {
      plainLanguageSummary = `High Scam Likelihood: Multiple suspicious red flags detected including psychological pressure and financial demands. Exercise extreme caution.`;
    }
  } else if (overallRisk === "suspicious") {
    plainLanguageSummary = `Suspicious Message: This message contains anomalous phrasing, unverified links, or mild urgency. While not an overt scam, treat with caution and verify independently through official contacts before proceeding.`;
  } else {
    plainLanguageSummary = `Low Scam Indicators: No prominent coercion, credential harvesting, or deceptive links were identified. Message appears consistent with routine communications.`;
  }

  // 5. Actionable Safe Next Steps
  const actionSteps: SafeActionStep[] = [];

  if (overallRisk === "high") {
    actionSteps.push({
      priority: "immediate",
      action: "Do Not Click Any Links",
      explanation: "Links in this message are suspected to be phishing traps designed to steal credentials or compromise your device.",
    });

    if (heuristics.hits.some((h) => h.category === "credential_harvesting")) {
      actionSteps.push({
        priority: "immediate",
        action: "Never Disclose Security Credentials",
        explanation: "Banks, couriers, and officials will never ask for your OTP, ATM PIN, UPI MPIN, or passwords over SMS or phone.",
      });
    }

    if (impersonation.match?.isImpersonated) {
      actionSteps.push({
        priority: "recommended",
        action: `Verify Directly with ${impersonation.match.claimedEntity}`,
        explanation: `Use official verified channels: Official Portal (${impersonation.match.officialDomains.join(", ")})${
          impersonation.match.officialHelpline ? ` or Helpline (${impersonation.match.officialHelpline})` : ""
        }.`,
      });
    }

    actionSteps.push({
      priority: "recommended",
      action: "Report to National Cyber Crime Portal",
      explanation: "File a cyber fraud report immediately at cybercrime.gov.in or dial national helpline 1930.",
    });

    actionSteps.push({
      priority: "optional",
      action: "Block and Report Sender",
      explanation: "Mark the sender number as spam and block it on your device/WhatsApp to prevent follow-up attempts.",
    });
  } else if (overallRisk === "suspicious") {
    actionSteps.push({
      priority: "immediate",
      action: "Avoid Direct Interaction",
      explanation: "Do not call back phone numbers or click links included in the text until independently confirmed.",
    });

    if (urlReports.reports.length > 0) {
      actionSteps.push({
        priority: "recommended",
        action: "Navigate Independently",
        explanation: "Open a clean browser window and manually type the known official domain rather than clicking links.",
      });
    }

    actionSteps.push({
      priority: "recommended",
      action: "Check Account via Official App",
      explanation: "Open your bank or service app directly to check for genuine alerts, balance changes, or order tracking.",
    });
  } else {
    actionSteps.push({
      priority: "optional",
      action: "Standard Security Caution",
      explanation: "While no obvious scam signals were found, never share OTPs or passwords with anyone under any circumstances.",
    });
  }

  // 6. Aggregate Evidentiary Spans
  const allSpans: EvidentiarySpan[] = [
    ...heuristics.spans,
    ...urlReports.spans,
    ...(impersonation.span ? [impersonation.span] : []),
  ];

  // Deduplicate overlapping spans
  const uniqueSpans = allSpans.filter(
    (span, index, self) =>
      index === self.findIndex((s) => s.start === span.start && s.end === span.end)
  );

  return {
    overallRisk,
    riskScore: compositeScore,
    uncertainty: uncertaintyReport,
    plainLanguageSummary,
    evidenceSpans: uniqueSpans,
    actionSteps,
    metricsBreakdown: {
      heuristicScore: hScore,
      urlScore: uScore,
      impersonationScore: iScore,
      aiScore,
      aiAvailable,
    },
  };
}
