import { UrlInspectionReport, EvidentiarySpan } from "../types";
import { SUSPICIOUS_TLDS, HIGH_RISK_KEYWORDS_IN_DOMAIN, URL_SHORTENERS, ABUSED_FREE_HOSTS } from "../data/suspicious-tlds";
import { TRUSTED_ENTITIES } from "../data/trusted-entities";

// Common Cyrillic / Greek homoglyphs mapped to their visual Latin equivalents
const HOMOGLYPH_MAP: Record<string, string> = {
  "\u0430": "a", // Cyrillic Small Letter A
  "\u0441": "c", // Cyrillic Small Letter Es
  "\u0435": "e", // Cyrillic Small Letter Ie
  "\u043e": "o", // Cyrillic Small Letter O
  "\u0440": "p", // Cyrillic Small Letter Er
  "\u0455": "s", // Cyrillic Small Letter Dze
  "\u0445": "x", // Cyrillic Small Letter Ha
  "\u0443": "y", // Cyrillic Small Letter U
  "\u0456": "i", // Cyrillic Small Letter Byelorussian-Ukrainian I
  "\u0458": "j", // Cyrillic Small Letter Je
  "\u03bf": "o", // Greek Small Letter Omicron
  "\u03bd": "v", // Greek Small Letter Nu
  "0": "o",      // Digit 0 as letter o in brand names
  "1": "l",      // Digit 1 as letter l
};

// Damerau-Levenshtein distance calculation (handles transpositions, insertions, deletions, substitutions)
export function damerauLevenshtein(a: string, b: string): number {
  const al = a.length;
  const bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;

  const matrix: number[][] = [];
  for (let i = 0; i <= al; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= bl; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,       // deletion
        matrix[i][j - 1] + 1,       // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );

      // Transposition
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        matrix[i][j] = Math.min(matrix[i][j], matrix[i - 2][j - 2] + cost);
      }
    }
  }

  return matrix[al][bl];
}

// Regex to extract all URLs safely from raw text without navigating
const URL_REGEX = /(?:https?:\/\/|www\.)[^\s<>"'{}|\\^`\[\]]+|[a-zA-Z0-9.-]+\.(?:com|org|net|in|gov|edu|xyz|top|io|co|live|buzz|sbs|app|link|site|online|icu|store|info|cc|work|click)(?:\/[^\s<>"'{}|\\^`\[\]]*)?/gi;

// IP Address hostname regex
const IP_HOST_REGEX = /^(?:https?:\/\/)?((?:\d{1,3}\.){3}\d{1,3})(?::\d+)?(?:\/.*)?$/i;

// Open redirect parameter pattern
const OPEN_REDIRECT_REGEX = /[?&](redirect|url|next|goto|return|dest|target|rdir|link|returnUrl)=https?:/i;

export function inspectUrlsPassively(text: string): {
  reports: UrlInspectionReport[];
  spans: EvidentiarySpan[];
  highestUrlRiskScore: number;
} {
  const reports: UrlInspectionReport[] = [];
  const spans: EvidentiarySpan[] = [];
  let highestRisk = 0;

  const urlRegex = new RegExp(URL_REGEX.source, "gi");
  let match: RegExpExecArray | null;

  while ((match = urlRegex.exec(text)) !== null) {
    let rawUrl = match[0];
    const rawStartIndex = match.index;

    // Clean URL Tokenization: Strip trailing sentence punctuation
    const stripped = rawUrl.replace(/[.,!?;:)'"]+$/, "");
    rawUrl = stripped;
    const startIndex = rawStartIndex;
    const endIndex = startIndex + rawUrl.length;

    // Normalize URL string for structural parsing (NEVER navigate/fetch)
    let urlString = rawUrl;
    if (!urlString.startsWith("http://") && !urlString.startsWith("https://")) {
      urlString = `https://${urlString}`;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(urlString);
    } catch {
      continue;
    }

    const hostname = parsedUrl.hostname.toLowerCase();
    const protocol = parsedUrl.protocol;
    const reasons: string[] = [];
    let riskScore = 0;

    // 1. IP Address check
    const isIpAddress = IP_HOST_REGEX.test(rawUrl) || /^(?:\d{1,3}\.){3}\d{1,3}$/.test(hostname);
    if (isIpAddress) {
      riskScore += 50;
      reasons.push("Host is a bare IP address rather than a registered domain name (common in phishing hosts).");
    }

    // 2. Credential Delimiter / '@' host spoofing
    if (parsedUrl.username || parsedUrl.password || rawUrl.includes("@")) {
      riskScore += 45;
      reasons.push("URL uses '@' userinfo credential syntax to visually camouflage the true destination host.");
    }

    // 3. Dangerous file extension check (.apk, .exe, .scr, etc.)
    const dangerousExt = /\.(apk|exe|scr|bat|msi|vbs|cmd)($|\?)/i.test(parsedUrl.pathname + parsedUrl.search);
    if (dangerousExt) {
      riskScore += 55;
      reasons.push("URL points directly to an executable binary or application package (.apk/.exe) payload.");
    }

    // 4. Homoglyph / Punycode (IDN) check
    let hasHomoglyphs = false;
    const homoglyphDetails: string[] = [];
    if (hostname.startsWith("xn--") || hostname.includes(".xn--")) {
      hasHomoglyphs = true;
      riskScore += 45;
      reasons.push("Uses Internationalized Domain Name (Punycode 'xn--') which frequently conceals lookalike spoofed characters.");
      homoglyphDetails.push("Punycode encoded domain");
    }

    for (let i = 0; i < hostname.length; i++) {
      const char = hostname[i];
      if (HOMOGLYPH_MAP[char] && char.charCodeAt(0) > 127) {
        hasHomoglyphs = true;
        homoglyphDetails.push(`Unicode homoglyph '${char}' (U+${char.charCodeAt(0).toString(16).toUpperCase()}) imitating Latin '${HOMOGLYPH_MAP[char]}'`);
      }
    }
    if (homoglyphDetails.length > 0) {
      riskScore += 50;
      reasons.push(`Detected visually deceptive homoglyphs: ${homoglyphDetails.join(", ")}`);
    }

    // 5. Domain decomposition
    const parts = hostname.split(".");
    const tld = parts.length > 1 ? parts[parts.length - 1] : "";
    const isSuspiciousTld = SUSPICIOUS_TLDS.has(tld);
    if (isSuspiciousTld) {
      riskScore += 35;
      reasons.push(`Uses high-risk, low-reputation top-level domain (TLD) '.${tld}' commonly abused in smishing.`);
    }

    // 6. Excessive subdomains
    const subdomainCount = Math.max(0, parts.length - 2);
    const subdomains = parts.slice(0, parts.length - 2);
    if (subdomainCount >= 3) {
      riskScore += 25;
      reasons.push(`Excessive subdomain nesting (${subdomainCount} levels) used to visually obscure the apex domain.`);
    }

    // Check for deceptive security keywords in subdomain
    const deceptiveKeywordsFound = HIGH_RISK_KEYWORDS_IN_DOMAIN.filter(
      (kw) => subdomains.some((sub) => sub.includes(kw))
    );
    if (deceptiveKeywordsFound.length > 0) {
      riskScore += 30;
      reasons.push(`Subdomains contain deceptive security keywords: [${deceptiveKeywordsFound.join(", ")}]`);
    }

    // 7. Check if domain is verified official domain for trusted brands or government
    const isGovNic = hostname.endsWith(".gov.in") || hostname.endsWith(".nic.in");
    const isLegitOfficialDomain = isGovNic || TRUSTED_ENTITIES.some((entity) =>
      entity.officialDomains.some((d) => hostname === d || hostname.endsWith(`.${d}`))
    );

    // 8. Shortener check (only when not a verified official domain like amzn.to)
    const isShortener = !isLegitOfficialDomain && (URL_SHORTENERS.has(hostname) || URL_SHORTENERS.has(parts.slice(-2).join(".")));
    let shortenerProvider: string | undefined;
    if (isShortener) {
      riskScore += 25;
      shortenerProvider = hostname;
      reasons.push(`URL uses shortening service '${hostname}', hiding the actual destination.`);
    }

    // 9. Free Hosting / Tunnels / Dynamic DNS
    const isAbusedFreeHost = !isLegitOfficialDomain && (
      ABUSED_FREE_HOSTS.has(hostname) ||
      Array.from(ABUSED_FREE_HOSTS).some((h) => hostname.endsWith(`.${h}`))
    );
    if (isAbusedFreeHost) {
      riskScore += 45;
      reasons.push(`URL uses free hosting, tunnel, or dynamic DNS service '${hostname}' frequently abused in smishing.`);
    }

    // 10. Open redirect risk
    const openRedirectRisk = OPEN_REDIRECT_REGEX.test(parsedUrl.search);
    if (openRedirectRisk) {
      riskScore += 35;
      reasons.push("URL contains an open redirect parameter pointing to an external destination.");
    }

    // 11. Subdomain Brand-Stuffing & Typosquatting / Lookalike check
    let typosquattingTarget: string | undefined;
    let closestDistance = 999;
    const brandPortion = parts.length >= 2 ? parts[parts.length - 2] : parts[0];

    if (!isLegitOfficialDomain && !isShortener) {
      for (const entity of TRUSTED_ENTITIES) {
        for (const alias of entity.aliases) {
          const cleanAlias = alias.toLowerCase().replace(/\s+/g, "");
          if (cleanAlias.length >= 3) {
            // Check in subdomain, hostname, or pathname
            if (hostname.includes(cleanAlias) || parsedUrl.pathname.toLowerCase().includes(cleanAlias)) {
              typosquattingTarget = `${entity.name} (brand name embedded in deceptive domain/path)`;
              closestDistance = 1;
              break;
            }
          }
        }

        if (typosquattingTarget) break;

        for (const officialDomain of entity.officialDomains) {
          const officialParts = officialDomain.split(".");
          const officialBrand = officialParts[0] === "www" ? officialParts[1] : officialParts[0];

          // Damerau-Levenshtein distance between brand portions
          const dist = damerauLevenshtein(brandPortion, officialBrand);
          if (dist > 0 && dist <= 2 && dist < closestDistance) {
            closestDistance = dist;
            typosquattingTarget = entity.name;
          }
        }
      }
    }

    if (typosquattingTarget && closestDistance <= 2) {
      riskScore += 50;
      reasons.push(`Suspected typosquatting / brand spoofing attack: URL structure strongly resembles legitimate entity '${typosquattingTarget}'.`);
    }

    // If completely legitimate official domain with no red flags
    if (isLegitOfficialDomain && riskScore === 0) {
      const legitEntity = TRUSTED_ENTITIES.find((e) =>
        e.officialDomains.some((d) => hostname === d || hostname.endsWith(`.${d}`))
      );
      reasons.push(`Verified official domain for ${legitEntity?.name || "trusted service"}.`);
    }

    // Baseline suspicious score for unverified unknown domains with generic tracking or deals
    if (!isLegitOfficialDomain && riskScore === 0 && (isSuspiciousTld || /(track|order|deals|claim|survey|status|dispatch)/i.test(hostname + parsedUrl.pathname))) {
      riskScore = 38;
      reasons.push(`Unverified domain '${hostname}' with generic transactional path.`);
    }

    const finalUrlRisk = isLegitOfficialDomain && riskScore < 20 ? 0 : Math.min(100, riskScore);
    if (finalUrlRisk > highestRisk) {
      highestRisk = finalUrlRisk;
    }

    const isSafe = isLegitOfficialDomain && finalUrlRisk === 0;

    reports.push({
      originalUrl: rawUrl,
      normalizedDomain: hostname,
      protocol: protocol.replace(":", ""),
      isIpAddress,
      subdomainCount,
      subdomains,
      isShortener,
      shortenerProvider,
      suspiciousTld: isSuspiciousTld,
      tld,
      hasHomoglyphs,
      homoglyphDetails: homoglyphDetails.length > 0 ? homoglyphDetails : undefined,
      typosquattingTarget,
      typosquattingDistance: closestDistance < 999 ? closestDistance : undefined,
      openRedirectRisk,
      riskScore: finalUrlRisk,
      reasons,
      isSafe,
    });

    if (finalUrlRisk >= 30) {
      spans.push({
        id: `span-url-${startIndex}`,
        start: startIndex,
        end: endIndex,
        text: rawUrl,
        category: "suspicious_link",
        severity: finalUrlRisk >= 65 ? "critical" : "high",
        title: "Suspicious Passive URL Indicator",
        explanation: reasons.join(" "),
      });
    }
  }

  return {
    reports,
    spans,
    highestUrlRiskScore: highestRisk,
  };
}
