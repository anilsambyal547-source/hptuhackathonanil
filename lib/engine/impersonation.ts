import { ImpersonationMatch, EvidentiarySpan } from "../types";
import { TRUSTED_ENTITIES, TrustedEntity } from "../data/trusted-entities";

export function detectImpersonation(
  text: string,
  detectedDomains: string[]
): {
  match: ImpersonationMatch | null;
  span: EvidentiarySpan | null;
  impersonationRiskScore: number;
} {
  const lowerText = text.toLowerCase();
  let matchedEntity: TrustedEntity | null = null;
  let matchedAlias = "";

  // 1. Identify if any trusted entity alias is referenced in the message
  for (const entity of TRUSTED_ENTITIES) {
    for (const alias of entity.aliases) {
      // Word boundary match to prevent partial subword matches
      const regex = new RegExp(`\\b${alias.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}\\b`, "i");
      const match = regex.exec(lowerText);
      if (match) {
        matchedEntity = entity;
        matchedAlias = match[0];
        break;
      }
    }
    if (matchedEntity) break;
  }

  if (!matchedEntity) {
    return {
      match: null,
      span: null,
      impersonationRiskScore: 0,
    };
  }

  // 2. Check if the message contains URLs and whether they match official domains
  const hasUrls = detectedDomains.length > 0;
  let isLegitDomainFound = false;

  if (hasUrls) {
    isLegitDomainFound = detectedDomains.some((domain) =>
      matchedEntity!.officialDomains.some((official) => domain === official || domain.endsWith(`.${official}`))
    );
  }

  // 3. Determine if impersonated
  const isEnforcementOrArrest = matchedEntity.category === "police_legal";
  const isUnauthorizedDomain = hasUrls && !isLegitDomainFound;

  // Unofficial personal contact detection for official brands (banks/couriers/gov never use random 10-digit mobile or personal UPI)
  const hasPersonalPhone = /(?:\+91[-.\s]?)?[6-9]\d{9}\b/.test(text);
  const hasUpiId = /[a-zA-Z0-9.\-_]{2,256}@(okhdfcbank|okaxis|okicici|oksbi|paytm|ybl|ibl|axl|upi|apl|sbi|postbank)/i.test(text);
  const hasSevereThreatOrAction = /\b(kyc|pan|aadhaar|blocked?|suspended?|disconnect(ed)?|power\s+cut|deactivat(ed)?|arrest|warrant|fir|bail|seized?|fine|security\s+deposit|processing\s+fee|stamp\s+fee|lottery|inam|reward)\b/i.test(text);

  let isImpersonated = false;
  let mismatchReason: string | undefined;
  let riskScore = 0;

  if (isEnforcementOrArrest) {
    isImpersonated = true;
    riskScore = 85;
    mismatchReason = `Fabricated judicial or law enforcement authority. Indian judicial and police agencies NEVER issue arrest warrants, FIR notices, or conduct interrogation sessions over WhatsApp/Skype/SMS.`;
  } else if (isUnauthorizedDomain) {
    isImpersonated = true;
    riskScore = 80;
    mismatchReason = `Message claims to be from ${matchedEntity.name}, but links to unauthorized domain '${detectedDomains[0]}' instead of official domains (${matchedEntity.officialDomains.join(", ")}).`;
  } else if (!hasUrls && (hasUpiId || (hasPersonalPhone && hasSevereThreatOrAction))) {
    isImpersonated = true;
    riskScore = 75;
    mismatchReason = `Message claims to be from ${matchedEntity.name}, but directs user to unverified personal channels (${hasUpiId ? "individual UPI handle" : "unauthorized personal mobile number"}) under administrative threat or fee demand.`;
  } else if (!hasUrls && hasSevereThreatOrAction) {
    riskScore = 40;
    mismatchReason = `Message invokes ${matchedEntity.name} in an urgent administrative demand or threat.`;
  } else if (isLegitDomainFound) {
    riskScore = 0;
    isImpersonated = false;
  }

  const match: ImpersonationMatch = {
    claimedEntity: matchedEntity.name,
    category: matchedEntity.category,
    entityCategory: matchedEntity.category,
    officialDomains: matchedEntity.officialDomains,
    verifiedDomains: matchedEntity.officialDomains,
    isImpersonated,
    mismatchReason,
    officialHelpline: matchedEntity.officialHelpline,
    officialPortal: matchedEntity.officialPortal,
  };

  let span: EvidentiarySpan | null = null;
  if (isImpersonated) {
    const aliasIndex = lowerText.indexOf(matchedAlias.toLowerCase());
    span = {
      id: `span-imp-${matchedEntity.id}`,
      start: aliasIndex >= 0 ? aliasIndex : 0,
      end: aliasIndex >= 0 ? aliasIndex + matchedAlias.length : matchedAlias.length,
      text: matchedAlias,
      category: "impersonation",
      severity: "critical",
      title: `Brand Impersonation: ${matchedEntity.name}`,
      explanation: mismatchReason ?? `Suspected spoofing of ${matchedEntity.name}.`,
    };
  }

  return {
    match,
    span,
    impersonationRiskScore: riskScore,
  };
}
