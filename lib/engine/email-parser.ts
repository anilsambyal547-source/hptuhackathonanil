import { EmailHeaderForensics, EmailAuthResult } from "../types";
import { TRUSTED_ENTITIES } from "../data/trusted-entities";

/**
 * Checks whether the incoming text contains typical RFC-822 email headers
 */
export function isRawEmail(text: string): boolean {
  if (!text || typeof text !== "string") return false;
  const headerPatterns = [
    /^(?:From|To|Subject|Date|Message-ID|Return-Path|Reply-To|Received|Authentication-Results):\s+/im,
    /^(?:MIME-Version|Content-Type|Content-Transfer-Encoding):\s+/im,
  ];

  let matches = 0;
  for (const pat of headerPatterns) {
    if (pat.test(text)) matches++;
  }

  // Also check for multiple header lines in succession
  const hasMultipleHeaders = /(?:^|\r?\n)(?:From|To|Subject|Date):\s+[^\r\n]+(?:\r?\n)(?:From|To|Subject|Date):\s+/i.test(text);
  return matches >= 2 || hasMultipleHeaders || /^(?:From|Return-Path):\s+[^\r\n]+/im.test(text);
}

/**
 * Parses address line like:
 * "State Bank of India" <alert@sbi-fraud-alert.top>
 * or <support@hdfcbank.com>
 * or support@hdfcbank.com
 */
function parseAddressField(raw: string): { displayName: string; address: string; domain: string } {
  if (!raw) return { displayName: "", address: "", domain: "" };

  const match = raw.match(/^(?:["']?([^"']*)["']?\s*)?<([^>]+)>/);
  if (match) {
    const displayName = (match[1] || "").trim();
    const address = (match[2] || "").trim().toLowerCase();
    const domain = address.includes("@") ? address.split("@")[1].trim() : "";
    return { displayName, address, domain };
  }

  // Plain email without angle brackets
  const plainEmailMatch = raw.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (plainEmailMatch) {
    const address = plainEmailMatch[1].toLowerCase();
    const domain = address.split("@")[1];
    const displayName = raw.replace(plainEmailMatch[1], "").replace(/[<>"']/g, "").trim();
    return { displayName, address, domain };
  }

  return { displayName: raw.trim(), address: "", domain: "" };
}

/**
 * Extracts header value accounting for multiline folding
 */
function extractHeaderValue(headersText: string, headerName: string): string | undefined {
  const regex = new RegExp(`^${headerName}:\\s*([^\\r\\n]+(?:\\r?\\n[ \\t]+[^\\r\\n]+)*)`, "im");
  const match = headersText.match(regex);
  if (!match) return undefined;
  return match[1].replace(/\r?\n[ \t]+/g, " ").trim();
}

/**
 * Passively parses SPF / DKIM / DMARC from Authentication-Results / Received-SPF
 */
function parseAuthResults(headersText: string): EmailAuthResult {
  const details: string[] = [];
  let spf: EmailAuthResult["spf"] = "none";
  let dkim: EmailAuthResult["dkim"] = "none";
  let dmarc: EmailAuthResult["dmarc"] = "none";

  // Check Received-SPF
  const receivedSpf = extractHeaderValue(headersText, "Received-SPF");
  if (receivedSpf) {
    details.push(`Received-SPF: ${receivedSpf}`);
    const spfLower = receivedSpf.toLowerCase();
    if (spfLower.startsWith("pass")) spf = "pass";
    else if (spfLower.startsWith("fail") || spfLower.includes("spf=fail")) spf = "fail";
    else if (spfLower.startsWith("softfail") || spfLower.includes("spf=softfail")) spf = "softfail";
    else if (spfLower.startsWith("neutral")) spf = "neutral";
  }

  // Check Authentication-Results & ARC-Authentication-Results
  const authResults = extractHeaderValue(headersText, "Authentication-Results");
  if (authResults) {
    details.push(`Authentication-Results: ${authResults}`);
    const arLower = authResults.toLowerCase();

    if (spf === "none") {
      if (/spf=pass\b/.test(arLower)) spf = "pass";
      else if (/spf=fail\b/.test(arLower)) spf = "fail";
      else if (/spf=softfail\b/.test(arLower)) spf = "softfail";
      else if (/spf=neutral\b/.test(arLower)) spf = "neutral";
    }

    if (/dkim=pass\b/.test(arLower)) dkim = "pass";
    else if (/dkim=fail\b/.test(arLower)) dkim = "fail";

    if (/dmarc=pass\b/.test(arLower)) dmarc = "pass";
    else if (/dmarc=fail\b/.test(arLower)) dmarc = "fail";
  }

  return { spf, dkim, dmarc, details };
}

/**
 * Parses HTML anchor tags to find deceptive link text mismatches
 * Example: <a href="http://evil.top">https://sbi.co.in</a>
 */
export function findAnchorTextMismatches(htmlOrText: string): {
  visibleText: string;
  href: string;
  isDeceptive: boolean;
}[] {
  const mismatches: { visibleText: string; href: string; isDeceptive: boolean }[] = [];
  const anchorRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gis;

  let match;
  while ((match = anchorRegex.exec(htmlOrText)) !== null) {
    const href = match[1].trim();
    const rawVisible = match[2].replace(/<[^>]+>/g, "").trim();

    if (!href || !rawVisible) continue;

    // Check if the visible text looks like a URL or domain
    const visibleUrlMatch = rawVisible.match(/(?:https?:\/\/)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
    let hrefDomain = "";
    try {
      const parsedHref = new URL(href.startsWith("http") ? href : `http://${href}`);
      hrefDomain = parsedHref.hostname.toLowerCase().replace(/^www\./, "");
    } catch {
      // Invalid URL in href
      hrefDomain = href.toLowerCase();
    }

    if (visibleUrlMatch) {
      const visibleDomain = visibleUrlMatch[1].toLowerCase().replace(/^www\./, "");
      // If visible domain differs from href domain
      if (visibleDomain && hrefDomain && visibleDomain !== hrefDomain) {
        // Check if one is a subdomain of another or if they are totally different
        const isSafeSubdomain = hrefDomain.endsWith(`.${visibleDomain}`) || visibleDomain.endsWith(`.${hrefDomain}`);
        if (!isSafeSubdomain) {
          mismatches.push({
            visibleText: rawVisible,
            href,
            isDeceptive: true,
          });
        }
      }
    }
  }

  return mismatches;
}

/**
 * Extracts plain text from email body, handling HTML stripping
 */
export function extractEmailBodyText(raw: string): string {
  // If it has header / body separation (\r?\n\r?\n)
  const headerBodySplit = raw.split(/\r?\n\r?\n/);
  let body = raw;

  if (headerBodySplit.length > 1) {
    // Body is everything after the first double newline
    body = headerBodySplit.slice(1).join("\n\n");
  }

  // Strip MIME boundaries like --Apple-Mail=_... or --boundary_...
  body = body.replace(/--[a-zA-Z0-9_\-=.+]+(?:--)?/g, " ");

  // Strip HTML tags while preserving text
  const cleanBody = body
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s+\n/g, "\n\n")
    .trim();

  return cleanBody || raw.trim();
}

/**
 * Full Email Forensics analysis
 */
export function parseEmailForensics(raw: string): EmailHeaderForensics {
  const isEmail = isRawEmail(raw);
  const riskFactors: string[] = [];

  const fromRaw = extractHeaderValue(raw, "From");
  const replyToRaw = extractHeaderValue(raw, "Reply-To");
  const returnPathRaw = extractHeaderValue(raw, "Return-Path");
  const subject = extractHeaderValue(raw, "Subject");

  const from = fromRaw ? { raw: fromRaw, ...parseAddressField(fromRaw) } : undefined;
  const replyTo = replyToRaw ? { raw: replyToRaw, ...parseAddressField(replyToRaw) } : undefined;
  const returnPath = returnPathRaw ? parseAddressField(returnPathRaw).address : undefined;

  const authResults = parseAuthResults(raw);

  let isDisplayNameSpoofed = false;
  let isReplyToDivergent = false;

  // 1. Check Display Name vs Domain Spoofing
  if (from && from.displayName && from.domain) {
    const dispNameLower = from.displayName.toLowerCase();
    for (const entity of TRUSTED_ENTITIES) {
      const matchesAlias = entity.aliases.some((a) => dispNameLower.includes(a.toLowerCase())) ||
        dispNameLower.includes(entity.name.toLowerCase());

      if (matchesAlias) {
        const isOfficialDomain = entity.officialDomains.some(
          (od) => from.domain === od || from.domain.endsWith(`.${od}`)
        );
        if (!isOfficialDomain) {
          isDisplayNameSpoofed = true;
          riskFactors.push(
            `Display Name Spoofing: Sender displays "${from.displayName}" (associated with ${entity.name}) but sends from unauthorized domain "${from.domain}".`
          );
          break;
        }
      }
    }
  }

  // 2. Check Reply-To / Return-Path divergence
  if (from && replyTo && replyTo.domain) {
    if (from.domain && replyTo.domain !== from.domain) {
      isReplyToDivergent = true;
      riskFactors.push(
        `Reply-To Divergence: Replies are redirected to "${replyTo.address}" (${replyTo.domain}), differing from sender domain "${from.domain}".`
      );
    }
  }

  // 3. SPF / DKIM / DMARC failures
  if (authResults.spf === "fail") {
    riskFactors.push("SPF Verification Failed: Sending mail server is not authorized to deliver on behalf of the claimed domain.");
  } else if (authResults.spf === "softfail") {
    riskFactors.push("SPF Softfail: Sending IP is not designated in domain SPF records.");
  }

  if (authResults.dkim === "fail") {
    riskFactors.push("DKIM Signature Failed: Cryptographic email signature is invalid or altered in transit.");
  }

  if (authResults.dmarc === "fail") {
    riskFactors.push("DMARC Policy Failed: Alignment between SPF/DKIM and From domain rejected.");
  }

  // 4. HTML Anchor vs Href Mismatches
  const anchorTextMismatches = findAnchorTextMismatches(raw);
  for (const m of anchorTextMismatches) {
    if (m.isDeceptive) {
      riskFactors.push(
        `Deceptive Anchor Mismatch: Visible link text displays "${m.visibleText}", but actual destination points to untrusted URL "${m.href}".`
      );
    }
  }

  return {
    isEmail,
    from,
    replyTo,
    returnPath,
    subject,
    authResults,
    isDisplayNameSpoofed,
    isReplyToDivergent,
    anchorTextMismatches,
    riskFactors,
  };
}

