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
  EmailHeaderForensics,
  TacticsBreakdown,
} from "../types";

export function fuseAnalysisResults({
  heuristics,
  urlReports,
  impersonation,
  aiAnalysis,
  ocrQuality,
  inputText,
  emailForensics,
}: {
  heuristics: { hits: HeuristicHit[]; spans: EvidentiarySpan[]; score: number };
  urlReports: { reports: UrlInspectionReport[]; spans: EvidentiarySpan[]; highestUrlRiskScore: number };
  impersonation: { match: ImpersonationMatch | null; span: EvidentiarySpan | null; impersonationRiskScore: number };
  aiAnalysis: AiAnalysisResult | null;
  ocrQuality?: OcrQualityReport;
  inputText: string;
  emailForensics?: EmailHeaderForensics | null;
}): {
  overallRisk: RiskLevel;
  riskScore: number;
  uncertainty: UncertaintyReport;
  plainLanguageSummary: string;
  evidenceSpans: EvidentiarySpan[];
  actionSteps: SafeActionStep[];
  tacticsBreakdown: TacticsBreakdown;
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

  // 1. Dynamic Term Weighting: Reweight ONLY across applicable analyzers to prevent score dilution
  interface ActiveTerm {
    name: string;
    score: number;
    baseWeight: number;
  }

  const terms: ActiveTerm[] = [
    { name: "heuristics", score: hScore, baseWeight: 0.40 },
  ];

  if (urlReports.reports.length > 0) {
    terms.push({ name: "url", score: uScore, baseWeight: 0.35 });
  }

  if (impersonation.impersonationRiskScore > 0 || impersonation.match !== null) {
    terms.push({ name: "impersonation", score: iScore, baseWeight: 0.25 });
  }

  if (aiAvailable && aiScore !== null) {
    terms.push({ name: "ai", score: aiScore, baseWeight: 0.20 });
  }

  // Normalize active weights so they sum to 1.0
  const totalBaseWeight = terms.reduce((acc, t) => acc + t.baseWeight, 0);
  let rawCompositeScore = 0;
  for (const term of terms) {
    const normalizedWeight = term.baseWeight / totalBaseWeight;
    rawCompositeScore += normalizedWeight * term.score;
  }
  let compositeScore = Math.round(rawCompositeScore);

  // 2. High-Severity & Critical Threat Hard Floors (prevents text-only or multi-vector scams being diluted)
  const hasCriticalHeuristic = heuristics.hits.some((h) => h.severity === "critical");
  const hasHighSevereHeuristic = heuristics.hits.some(
    (h) =>
      h.severity === "high" &&
      (h.category === "fear_coercion" ||
        h.category === "financial_solicitation" ||
        h.category === "credential_harvesting" ||
        h.id === "urg-electricity-cut" ||
        h.id === "urg-sim-trai-notice" ||
        h.id === "fin-task-job-scam" ||
        h.id === "fin-job-advance-deposit" ||
        h.id === "fin-loan-processing-fee" ||
        h.id === "fin-lottery-prize-fee" ||
        h.id === "courier-failed-address-update" ||
        h.id.startsWith("hinglish-"))
  );
  const hasSeverePhishingUrl = uScore >= 65;
  const hasConfirmedImpersonationAttack = impersonation.match?.isImpersonated === true && (uScore >= 35 || hScore >= 35);

  const isHardScamIndicator =
    hasCriticalHeuristic ||
    hasSeverePhishingUrl ||
    hasConfirmedImpersonationAttack ||
    Boolean(
      emailForensics &&
        (emailForensics.isDisplayNameSpoofed ||
          emailForensics.isReplyToDivergent ||
          emailForensics.anchorTextMismatches.some((m: { isDeceptive: boolean }) => m.isDeceptive) ||
          emailForensics.authResults.spf === "fail" ||
          emailForensics.authResults.dkim === "fail")
    ) ||
    (hasHighSevereHeuristic && (hScore >= 40 || iScore >= 40));

  if (isHardScamIndicator) {
    compositeScore = Math.max(70, compositeScore);
  } else if (heuristics.hits.some((h) => h.id.startsWith("susp-")) || (uScore >= 35 && uScore < 65)) {
    // Elevate genuinely ambiguous items into the Suspicious range (35–64)
    compositeScore = Math.max(38, Math.min(60, compositeScore));
  }

  // Bound composite score between 0 and 100
  compositeScore = Math.min(100, Math.max(0, compositeScore));

  // Risk Tiers:
  // Low: 0 - 34
  // Suspicious: 35 - 64
  // High: 65 - 100
  const overallRisk: RiskLevel =
    compositeScore >= 65 ? "high" : compositeScore >= 35 ? "suspicious" : "low";

  // 3. True Uncertainty Quantification: Compute disagreement only among active applicable analyzers
  const applicableSignals: { name: string; score: number }[] = [
    { name: "heuristics", score: hScore },
  ];
  if (urlReports.reports.length > 0) {
    applicableSignals.push({ name: "url", score: uScore });
  }
  if (impersonation.impersonationRiskScore > 0 || impersonation.match !== null) {
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
  // When AI is unavailable, cap base confidence at 78% (moderate uncertainty by default)
  let baseConfidence = aiAvailable ? 90 : 76;

  if (!aiAvailable) {
    uncertaintyReasons.push("Semantic AI model offline; analysis relies on deterministic heuristic and passive structural rules.");
  }

  // Signal divergence penalty
  if (stdDev > 25) {
    baseConfidence -= 25;
    uncertaintyReasons.push("Subsystems produced divergent risk scores across active analyzers.");
  } else if (stdDev > 15) {
    baseConfidence -= 10;
    uncertaintyReasons.push("Moderate variance between active detection signals.");
  }

  // Very brief text check (< 8 words)
  const trimmed = inputText.trim();
  const wordCount = trimmed.length > 0 ? trimmed.split(/\s+/).length : 0;
  if (wordCount < 8 && urlReports.reports.length === 0) {
    baseConfidence = Math.min(baseConfidence, 50); // forces high uncertainty
    uncertaintyReasons.push("Input text is very brief (< 8 words), lacking sufficient sender context or headers.");
  }

  // Ambiguous / Suspicious tier penalty
  if (overallRisk === "suspicious") {
    baseConfidence = Math.min(baseConfidence, 52); // forces high uncertainty (< 55%)
    uncertaintyReasons.push("Message indicators are ambiguous or borderline, requiring cautious human verification.");
  }

  // OCR quality degradation penalty
  if (ocrQuality) {
    if (!ocrQuality.isReadable || ocrQuality.confidence < 60) {
      baseConfidence = Math.min(baseConfidence, 48); // forces high uncertainty (< 55%)
      uncertaintyReasons.push("Screenshot text quality is severely degraded or low-contrast, increasing likelihood of missed characters.");
    } else if (ocrQuality.confidence < 75) {
      baseConfidence -= 15;
      uncertaintyReasons.push("Minor OCR noise detected in screenshot rendering.");
    }
  }

  const finalConfidence = Math.max(25, Math.min(aiAvailable ? 98 : 78, baseConfidence));
  const isAmbiguous = overallRisk === "suspicious" || finalConfidence < 55;

  const uncertaintyLevel: "low" | "moderate" | "high" =
    finalConfidence >= 80 ? "low" : finalConfidence >= 55 ? "moderate" : "high";

  const uncertaintyReport: UncertaintyReport = {
    uncertaintyLevel,
    confidencePercent: finalConfidence,
    reasons: uncertaintyReasons.length > 0 ? uncertaintyReasons : ["Consistent signal alignment across active detection methods."],
    isAmbiguous,
    recommendation: isAmbiguous
      ? "Signals are ambiguous or confidence is reduced. Do NOT open links or reply; independently verify via official direct channels."
      : "Evaluation confidence based on consensus across active detection methods.",
  };

  // 4. Evidence-Specific Plain-Language Explanation
  const firedRuleTitles = heuristics.hits.map((h) => h.title);
  const claimedEntity = impersonation.match?.claimedEntity;
  const mismatchedDomain = urlReports.reports.find((r) => r.riskScore >= 40)?.originalUrl;

  let plainLanguageSummary = "";
  if (overallRisk === "high") {
    if (impersonation.match?.isImpersonated) {
      plainLanguageSummary = `High-Risk Scam Alert: This message impersonates ${claimedEntity || "a trusted organization"}${
        mismatchedDomain ? ` while linking to deceptive destination '${mismatchedDomain}'` : " through unauthorized contact channels"
      }. Primary threat indicators: ${firedRuleTitles.slice(0, 2).join("; ") || "administrative coercion"}.`;
    } else if (hasSeverePhishingUrl) {
      plainLanguageSummary = `Dangerous Link Detected: Link '${mismatchedDomain || urlReports.reports[0]?.originalUrl}' exhibits strong signs of typosquatting, deceptive subdomains, or unverified hosting. Do NOT tap or open this link.`;
    } else if (hasCriticalHeuristic) {
      plainLanguageSummary = `Severe Coercion / Credential Theft: The message attempts credential extraction or legal coercion (${firedRuleTitles.slice(0, 2).join("; ")}). Official institutions never demand these via SMS.`;
    } else {
      plainLanguageSummary = `High Scam Likelihood: Multiple high-risk indicators detected (${firedRuleTitles.slice(0, 2).join(", ")}). Treat this message as fraudulent.`;
    }
  } else if (overallRisk === "suspicious") {
    plainLanguageSummary = `Suspicious Message (${firedRuleTitles[0] || "Unverified Link"}): Contains anomalous indicators without confirmed credential harvesting. Do not call back or click links until verified through official channels.`;
  } else {
    plainLanguageSummary = `Low Scam Indicators: Message appears consistent with routine or legitimate communications${
      claimedEntity ? ` from verified ${claimedEntity}` : ""
    }. No credential solicitation or deceptive links were identified.`;
  }

  // 5. Actionable Safe Next Steps
  const actionSteps: SafeActionStep[] = [];

  if (overallRisk === "high") {
    if (urlReports.reports.length > 0) {
      actionSteps.push({
        priority: "immediate",
        action: "Do Not Click Any Links",
        explanation: "Links in this message are suspected phishing traps designed to steal credentials or compromise your device.",
      });
    }

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
        explanation: `Use official verified channels: Official Portal (${(impersonation.match.officialDomains || impersonation.match.verifiedDomains || []).join(", ")})${
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
      explanation: "Mark the sender number as spam and block it on your device/messaging app to prevent follow-up attempts.",
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

  // 5-Axis Psychological Manipulation Radar (ScamGuard / TrustScan)
  const urgencyHits = heuristics.hits.filter((h) => h.category === "urgency");
  const fearHits = heuristics.hits.filter(
    (h) => h.category === "fear_coercion" || h.category === "fear_intimidation"
  );
  const authorityHits = heuristics.hits.filter(
    (h) => h.category === "impersonation" || h.id.includes("trai")
  );
  const financialHits = heuristics.hits.filter(
    (h) => h.category === "financial_solicitation"
  );
  const credentialHits = heuristics.hits.filter(
    (h) => h.category === "credential_harvesting"
  );

  const calcAxis = (hits: HeuristicHit[], extraScore: number = 0) => {
    const raw = hits.reduce((sum, h) => sum + (h.weight || 25), 0) + extraScore;
    return Math.min(100, Math.round(raw));
  };

  const urgency = calcAxis(urgencyHits);
  const fearCoercion = calcAxis(fearHits);
  const authoritySpoofing = calcAxis(
    authorityHits,
    impersonation.impersonationRiskScore > 0 || emailForensics?.isDisplayNameSpoofed ? 45 : 0
  );
  const financialLure = calcAxis(financialHits);
  const credentialHarvest = calcAxis(
    credentialHits,
    urlReports.highestUrlRiskScore >= 50 || (emailForensics?.anchorTextMismatches.length ?? 0) > 0 ? 35 : 0
  );

  const tacticsMap = [
    { name: "Manufactured Time Pressure", val: urgency },
    { name: "Law Enforcement & Fear Coercion", val: fearCoercion },
    { name: "Brand & Authority Impersonation", val: authoritySpoofing },
    { name: "Advance Fee & Financial Bait", val: financialLure },
    { name: "Credential & Data Harvesting", val: credentialHarvest },
  ].sort((a, b) => b.val - a.val);

  const dominantTactic = tacticsMap[0].val > 0 ? tacticsMap[0].name : undefined;

  const tacticsBreakdown: TacticsBreakdown = {
    urgency,
    fearCoercion,
    authoritySpoofing,
    financialLure,
    credentialHarvest,
    dominantTactic,
  };

  // Email Header Evidentiary Spans
  const emailSpans: EvidentiarySpan[] = [];
  if (emailForensics) {
    if (emailForensics.isDisplayNameSpoofed && emailForensics.from) {
      const dispName = emailForensics.from.displayName;
      const addr = emailForensics.from.address;

      // Token 1: Claimed Display Name (Exact Word Boundary)
      if (dispName) {
        const dispIdx = inputText.indexOf(dispName);
        if (dispIdx >= 0) {
          emailSpans.push({
            id: `span-email-disp-${dispIdx}`,
            start: dispIdx,
            end: dispIdx + dispName.length,
            text: dispName,
            category: "impersonation",
            severity: "critical",
            title: "Email Display Name Spoofing",
            explanation: `Displays "${dispName}" (associated with trusted brand) but sends from unauthorized domain "${emailForensics.from.domain}".`,
          });
        }
      }

      // Token 2: Unauthorized Sender Address
      if (addr) {
        const addrIdx = inputText.indexOf(addr);
        if (addrIdx >= 0) {
          emailSpans.push({
            id: `span-email-sender-addr-${addrIdx}`,
            start: addrIdx,
            end: addrIdx + addr.length,
            text: addr,
            category: "suspicious_link",
            severity: "high",
            title: "Unauthorized Sender Domain",
            explanation: `Sender address "${addr}" (${emailForensics.from.domain}) is not an authorized domain.`,
          });
        }
      }
    }

    if (emailForensics.isReplyToDivergent && emailForensics.replyTo) {
      const replyAddr = emailForensics.replyTo.address || emailForensics.replyTo.raw;
      const idx = inputText.indexOf(replyAddr);
      if (idx >= 0) {
        emailSpans.push({
          id: `span-email-replyto-${idx}`,
          start: idx,
          end: idx + replyAddr.length,
          text: replyAddr,
          category: "suspicious_link",
          severity: "high",
          title: "Reply-To Address Divergence",
          explanation: `Replies route to "${emailForensics.replyTo.address}" instead of sender domain.`,
        });
      }
    }

    if (
      emailForensics.authResults.spf === "fail" ||
      emailForensics.authResults.dkim === "fail" ||
      emailForensics.authResults.dmarc === "fail"
    ) {
      // Find exact position of Authentication-Results or Received-SPF line
      const authRegex = /^(?:Authentication-Results|Received-SPF):\s*[^\r\n]+/im;
      const authMatch = inputText.match(authRegex);
      if (authMatch && authMatch.index !== undefined) {
        emailSpans.push({
          id: `span-email-auth-fail-${authMatch.index}`,
          start: authMatch.index,
          end: authMatch.index + authMatch[0].length,
          text: authMatch[0],
          category: "suspicious_url",
          severity: "high",
          title: "Email SPF/DKIM Authentication Failure",
          explanation: "Cryptographic sender validation failed. The sending mail server is not authorized to deliver for the claimed domain.",
        });
      }
    }

    for (const m of emailForensics.anchorTextMismatches) {
      if (m.isDeceptive) {
        const idx = inputText.indexOf(m.visibleText);
        if (idx >= 0) {
          emailSpans.push({
            id: `span-anchor-mismatch-${idx}`,
            start: idx,
            end: idx + m.visibleText.length,
            text: m.visibleText,
            category: "typosquatting",
            severity: "critical",
            title: "Deceptive Anchor Text Mismatch",
            explanation: `Visible text displays "${m.visibleText}", but actual link target routes to deceptive destination "${m.href}".`,
          });
        }
      }
    }
  }

  // 6. Aggregate Evidentiary Spans
  const allSpans: EvidentiarySpan[] = [
    ...heuristics.spans,
    ...urlReports.spans,
    ...(impersonation.span ? [impersonation.span] : []),
    ...emailSpans,
  ];

  // Deduplicate overlapping spans: prioritize higher severity and longer spans for exact token boundaries
  const severityWeight: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
  const sortedSpans = [...allSpans].sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    const wA = severityWeight[a.severity] || 1;
    const wB = severityWeight[b.severity] || 1;
    if (wA !== wB) return wB - wA;
    return (b.end - b.start) - (a.end - a.start);
  });

  const uniqueSpans: EvidentiarySpan[] = [];
  for (const span of sortedSpans) {
    if (uniqueSpans.length === 0) {
      uniqueSpans.push(span);
      continue;
    }
    const prev = uniqueSpans[uniqueSpans.length - 1];
    if (span.start >= prev.start && span.end <= prev.end) {
      continue;
    }
    if (span.start === prev.start) {
      continue;
    }
    uniqueSpans.push(span);
  }

  return {
    overallRisk,
    riskScore: compositeScore,
    uncertainty: uncertaintyReport,
    plainLanguageSummary,
    evidenceSpans: uniqueSpans,
    actionSteps,
    tacticsBreakdown,
    metricsBreakdown: {
      heuristicScore: hScore,
      urlScore: uScore,
      impersonationScore: iScore,
      aiScore,
      aiAvailable,
    },
  };
}
