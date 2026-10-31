export interface MailMessage {
  id: string;
  threadId?: string;
  senderName: string;
  senderEmail: string;
  replyTo?: string;
  recipientEmail: string;
  subject: string;
  date: string;
  timestamp: string;
  snippet: string;
  bodyText: string;
  bodyHtml?: string;
  headers: Record<string, string>;
  authResults?: {
    spf?: "pass" | "fail" | "softfail" | "neutral" | "none";
    dkim?: "pass" | "fail" | "none";
    dmarc?: "pass" | "fail" | "none";
  };
  hasAttachments?: boolean;
  expectedRisk?: "high" | "medium" | "low";
}

export interface SecurityError {
  layer: "header_auth" | "deceptive_link" | "social_engineering" | "credential_theft";
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  evidence: string;
  recommendation: string;
}

export interface EmailErrorAuditResult {
  messageId: string;
  overallHealthScore: number; // 0-100 (100 is completely safe, 0 is dangerous)
  verdict: "MALICIOUS_SPOOF" | "SUSPICIOUS_PHISH" | "AUTHENTIC_SAFE";
  errorsFound: SecurityError[];
  headerAnalysis: {
    spfValid: boolean;
    dkimValid: boolean;
    dmarcValid: boolean;
    replyToDivergence: boolean;
    returnPathMismatch: boolean;
  };
  linkAnalysis: {
    totalLinks: number;
    suspiciousLinks: number;
    mismatches: Array<{ display: string; target: string }>;
  };
  psychologicalTriggers: string[];
  safeActionGuidance: string[];
}

export const DEMO_MAILBOX_MESSAGES: MailMessage[] = [
  {
    id: "gmail-sbi-spoof",
    senderName: "State Bank of India Security",
    senderEmail: "no-reply@sbi-fraud-alert.top",
    replyTo: "sbi.kyc.desk.claim@gmail.com",
    recipientEmail: "user@gmail.com",
    subject: "URGENT ACTION REQUIRED: NetBanking account restricted pending KYC update",
    date: "Today, 10:24 AM",
    timestamp: "10:24 AM",
    snippet: "Dear SBI Customer, your NetBanking access is disabled due to pending PAN linking. Update immediately...",
    bodyText: `Dear Valued Customer,

Your State Bank of India NetBanking privilege has been temporarily restricted due to non-compliance with statutory PAN linking guidelines.

Please verify your credentials immediately within 24 hours to prevent permanent account suspension:
https://www.onlinesbi.sbi/update

Failure to complete mandatory verification will result in immediate debit block.

Regards,
SBI Security Division
State Bank Bhavan, Nariman Point, Mumbai`,
    headers: {
      "From": '"State Bank of India Security" <no-reply@sbi-fraud-alert.top>',
      "Reply-To": "sbi.kyc.desk.claim@gmail.com",
      "Return-Path": "<bounces@sbi-fraud-alert.top>",
      "Authentication-Results": "spf=fail (sender IP not authorized); dkim=fail (signature verification failed); dmarc=fail (p=reject)",
      "Received-SPF": "fail (google.com: domain of bounces@sbi-fraud-alert.top does not designate 185.220.101.4 as permitted sender)",
      "X-Mailer": "PHPMailer 6.2.0 (https://github.com/PHPMailer/PHPMailer)",
    },
    authResults: {
      spf: "fail",
      dkim: "fail",
      dmarc: "fail",
    },
    expectedRisk: "high",
  },
  {
    id: "gmail-netflix-phish",
    senderName: "Netflix Billing Support",
    senderEmail: "membership@netflix-secure-billing.top",
    replyTo: "billing.renewal.desk@gmail.com",
    recipientEmail: "user@gmail.com",
    subject: "Account Notice: Your subscription payment could not be processed",
    date: "Yesterday, 3:45 PM",
    timestamp: "Yesterday",
    snippet: "We could not process your recurring membership fee. Your streaming access will terminate tonight at 11:59 PM...",
    bodyText: `Hello Subscriber,

We were unable to process your recurring subscription fee with the payment method on file.

Your streaming access will be permanently terminated tonight at 11:59 PM unless billing information is re-authorized.

Update your card details now:
https://www.netflix.com/youraccount

We are here to help if you need assistance.

The Netflix Team`,
    headers: {
      "From": '"Netflix Billing Support" <membership@netflix-secure-billing.top>',
      "Reply-To": "billing.renewal.desk@gmail.com",
      "Return-Path": "<bounce@netflix-secure-billing.top>",
      "Authentication-Results": "spf=softfail; dkim=none; dmarc=fail",
      "X-Originating-IP": "[194.26.29.112]",
    },
    authResults: {
      spf: "softfail",
      dkim: "none",
      dmarc: "fail",
    },
    expectedRisk: "high",
  },
  {
    id: "gmail-amazon-order-legit",
    senderName: "Amazon.in Order Updates",
    senderEmail: "auto-confirm@amazon.in",
    recipientEmail: "user@gmail.com",
    subject: "Ordered: boAt Bassheads 242 in-Ear Wired Earphones (#402-9981240-192841)",
    date: "29 Oct, 6:15 PM",
    timestamp: "29 Oct",
    snippet: "Thank you for your order with Amazon.in. We will notify you once your package is dispatched...",
    bodyText: `Hello Customer,

Thank you for your order with Amazon.in.

Order details:
Order #402-9981240-192841
1 of boAt Bassheads 242 in Ear Wired Earphones with Mic (Neon Green)
Total Amount: Rs 499.00 (Cash on Delivery)

Track your package anytime at:
https://www.amazon.in/your-orders

Never share your Amazon password or OTP with anyone.

Amazon Customer Service`,
    headers: {
      "From": '"Amazon.in Order Updates" <auto-confirm@amazon.in>',
      "Reply-To": "no-reply@amazon.in",
      "Return-Path": "<20261029124500-bounces@bounces.amazon.in>",
      "Authentication-Results": "spf=pass (google.com: domain of bounces@bounces.amazon.in designates 54.240.14.81 as permitted sender); dkim=pass (header.i=@amazon.in); dmarc=pass (p=reject)",
      "Received-SPF": "pass (google.com: domain of auto-confirm@amazon.in designates 54.240.14.81 as permitted sender)",
    },
    authResults: {
      spf: "pass",
      dkim: "pass",
      dmarc: "pass",
    },
    expectedRisk: "low",
  },
  {
    id: "gmail-dhl-customs",
    senderName: "DHL Express India Clearance",
    senderEmail: "tracking-support@dhl-clearance-desk.top",
    replyTo: "dhl.duty.desk@gmail.com",
    recipientEmail: "user@gmail.com",
    subject: "Action Required: Consignment #DHL-98124 detained at Customs Cargo Terminal",
    date: "28 Oct, 11:10 AM",
    timestamp: "28 Oct",
    snippet: "Your inbound international package is held at border customs due to unpaid duty of Rs 1,490...",
    bodyText: `Dear Consignee,

Your inbound international parcel (Tracking: DHL-9812401-IN) has been detained at Mumbai Air Cargo Customs due to unpaid tariff duty of Rs 1,490.

Clear duty payment immediately within 12 hours to prevent parcel seizure:
https://www.dhl.com/in-en/home/tracking-clearance

Unclaimed parcels are scheduled for confiscation under customs rules.

DHL Express Customs Handling Desk`,
    headers: {
      "From": '"DHL Express India Clearance" <tracking-support@dhl-clearance-desk.top>',
      "Reply-To": "dhl.duty.desk@gmail.com",
      "Return-Path": "<no-reply@dhl-clearance-desk.top>",
      "Authentication-Results": "spf=fail; dkim=none; dmarc=fail",
    },
    authResults: {
      spf: "fail",
      dkim: "none",
      dmarc: "fail",
    },
    expectedRisk: "high",
  },
  {
    id: "gmail-msft-job-bait",
    senderName: "Microsoft Talent Operations",
    senderEmail: "careers@recruitment-microsoft-portal.site",
    replyTo: "hr.onboarding.desk@gmail.com",
    recipientEmail: "user@gmail.com",
    subject: "Offer Letter: Remote Cloud Operations Specialist (INR 18,50,000 CTC)",
    date: "27 Oct, 4:20 PM",
    timestamp: "27 Oct",
    snippet: "Congratulations! Following executive review, Microsoft India has selected your profile for immediate joining...",
    bodyText: `Dear Candidate,

Congratulations! Based on your credentials, we are pleased to offer you the Remote Cloud Operations Specialist role with Microsoft India Development Center.

Package: INR 18,50,000 CTC + Home Office Equipment Allowance.

To activate your corporate login and confirm equipment dispatch, submit your PAN, Aadhaar, and bank account details here:
https://careers.microsoft.com/onboarding/portal

Verification window closes in 24 hours.

Regards,
Microsoft India Executive Hiring`,
    headers: {
      "From": '"Microsoft Talent Operations" <careers@recruitment-microsoft-portal.site>',
      "Reply-To": "hr.onboarding.desk@gmail.com",
      "Authentication-Results": "spf=fail; dkim=fail; dmarc=fail",
    },
    authResults: {
      spf: "fail",
      dkim: "fail",
      dmarc: "fail",
    },
    expectedRisk: "high",
  },
  {
    id: "gmail-icici-alert-legit",
    senderName: "ICICI Bank Alerts",
    senderEmail: "alerts@icicibank.com",
    recipientEmail: "user@gmail.com",
    subject: "Transaction Alert for your ICICI Bank Account XX8912",
    date: "26 Oct, 9:02 AM",
    timestamp: "26 Oct",
    snippet: "Your Account XX8912 has been credited with Rs 45,000.00 on 26-Oct-26 via NEFT...",
    bodyText: `Dear Customer,

Your ICICI Bank Account XX8912 has been credited with INR 45,000.00 on 26-Oct-26 via NEFT from TATA CONSULTANCY SERVICES.
Available Balance: INR 68,410.20.

If not done by you, report to 1800 1080 immediately or SMS BLOCK to 5676766. Never share your OTP, UPI PIN, or Internet Banking password with anyone.

Sincerely,
ICICI Bank Team`,
    headers: {
      "From": '"ICICI Bank Alerts" <alerts@icicibank.com>',
      "Reply-To": "no-reply@icicibank.com",
      "Return-Path": "<alerts@icicibank.com>",
      "Authentication-Results": "spf=pass (google.com: domain of alerts@icicibank.com designates 115.112.241.10 as permitted sender); dkim=pass (header.i=@icicibank.com); dmarc=pass (p=reject)",
    },
    authResults: {
      spf: "pass",
      dkim: "pass",
      dmarc: "pass",
    },
    expectedRisk: "low",
  },
];

/**
 * 4-Layer Forensic Security Error Auditor
 * Analyzes the email across Protocol/Header, Link/URL, Psychology, and Credential theft vectors.
 */
export function auditEmailSecurityErrors(email: MailMessage): EmailErrorAuditResult {
  const errors: SecurityError[] = [];
  const fromHeader = email.headers["From"] || email.senderEmail || "";
  const replyTo = email.replyTo || email.headers["Reply-To"] || "";
  const returnPath = email.headers["Return-Path"] || "";
  const authResults = email.headers["Authentication-Results"] || "";

  // ----------------------------------------------------
  // LAYER 1: Protocol & Header Authentication Errors
  // ----------------------------------------------------
  const spfFail =
    email.authResults?.spf === "fail" ||
    email.authResults?.spf === "softfail" ||
    authResults.toLowerCase().includes("spf=fail") ||
    authResults.toLowerCase().includes("spf=softfail");

  const dkimFail =
    email.authResults?.dkim === "fail" ||
    email.authResults?.dkim === "none" ||
    authResults.toLowerCase().includes("dkim=fail") ||
    authResults.toLowerCase().includes("dkim=none");

  const dmarcFail =
    email.authResults?.dmarc === "fail" ||
    authResults.toLowerCase().includes("dmarc=fail");

  if (spfFail) {
    errors.push({
      layer: "header_auth",
      severity: "critical",
      title: "SPF Verification Failure (Sender IP Spoofed)",
      description: "The originating mail server IP address is not authorized in the domain's public DNS SPF records.",
      evidence: `Authentication-Results: spf=${email.authResults?.spf || "fail"}`,
      recommendation: "Reject email. The sender is attempting to impersonate an authentic domain from an unauthorized server.",
    });
  }

  if (dkimFail) {
    errors.push({
      layer: "header_auth",
      severity: "critical",
      title: "DKIM Cryptographic Signature Missing or Corrupted",
      description: "Email lacks a valid cryptographic DKIM key matching the sender domain, indicating possible header tampering in transit.",
      evidence: `Authentication-Results: dkim=${email.authResults?.dkim || "fail/none"}`,
      recommendation: "Treat as untrusted. Sender authenticity could not be mathematically proven.",
    });
  }

  if (dmarcFail) {
    errors.push({
      layer: "header_auth",
      severity: "critical",
      title: "DMARC Alignment Policy Failure",
      description: "The message fails DMARC alignment, violating the sender domain's statutory anti-impersonation policy.",
      evidence: "DMARC status: fail (policy: reject/quarantine)",
      recommendation: "Flag as confirmed spoofing. Enterprise security policies mandate discarding this payload.",
    });
  }

  // Reply-To Divergence Check
  const fromDomainMatch = fromHeader.match(/@([a-zA-Z0-9.-]+)/);
  const replyToDomainMatch = replyTo.match(/@([a-zA-Z0-9.-]+)/);
  const fromDomain = fromDomainMatch ? fromDomainMatch[1].toLowerCase() : "";
  const replyToDomain = replyToDomainMatch ? replyToDomainMatch[1].toLowerCase() : "";

  let replyToDivergence = false;
  if (replyTo && fromDomain && replyToDomain && fromDomain !== replyToDomain) {
    replyToDivergence = true;
    errors.push({
      layer: "header_auth",
      severity: "critical",
      title: "Deceptive Reply-To Divergence (Trap Vector)",
      description: `The visible sender claims to be '${fromDomain}', but clicking 'Reply' diverts your confidential message to an unrelated external address '${replyTo}'.`,
      evidence: `From: ${fromHeader}  ➔  Reply-To: ${replyTo}`,
      recommendation: "Do not reply. Any communication sent back will go directly to the attacker's inbox.",
    });
  }

  // ----------------------------------------------------
  // LAYER 2: Deceptive Link & Host Errors
  // ----------------------------------------------------
  const suspiciousTlds = [".top", ".xyz", ".site", ".live", ".guru", ".buzz", ".work", ".cfd", ".click"];
  const urlMatches = email.bodyText.match(/https?:\/\/[^\s<>'"]+/gi) || [];
  const linkMismatches: Array<{ display: string; target: string }> = [];
  let suspiciousLinksCount = 0;

  urlMatches.forEach((url) => {
    const isSuspiciousTld = suspiciousTlds.some((tld) => url.toLowerCase().includes(tld));
    if (isSuspiciousTld) {
      suspiciousLinksCount++;
      errors.push({
        layer: "deceptive_link",
        severity: "critical",
        title: "Untrusted High-Risk Top-Level Domain (TLD)",
        description: "The destination URL resolves to a disposable, newly registered, high-abuse TLD frequently used in credential harvesting campaigns.",
        evidence: url,
        recommendation: "Never open this URL. It is hosted on infrastructure associated with malicious redirection.",
      });
    }

    // Check if the domain pretends to be a reputable brand
    if (
      (url.includes("sbi") && !url.includes("onlinesbi.sbi") && !url.includes("sbi.co.in")) ||
      (url.includes("netflix") && !url.includes("netflix.com")) ||
      (url.includes("dhl") && !url.includes("dhl.com")) ||
      (url.includes("amazon") && !url.includes("amazon.in") && !url.includes("amazon.com")) ||
      (url.includes("microsoft") && !url.includes("microsoft.com"))
    ) {
      suspiciousLinksCount++;
      errors.push({
        layer: "deceptive_link",
        severity: "critical",
        title: "Lookalike Typosquatting / Brand Spoofing URL",
        description: "The hyperlink incorporates a trusted organization's brand name within an unofficial third-party domain.",
        evidence: url,
        recommendation: "Do not authenticate. Official organizations exclusively host logins on their canonical primary domains.",
      });
    }
  });

  // ----------------------------------------------------
  // LAYER 3: Social Engineering & Coercion Errors
  // ----------------------------------------------------
  const text = (email.subject + " " + email.bodyText).toLowerCase();
  const triggers: string[] = [];

  if (text.includes("urgent") || text.includes("immediately") || text.includes("within 24 hours") || text.includes("within 12 hours")) {
    triggers.push("Artificial Urgency / Time-Pressure Clamp (12-24 hours)");
    errors.push({
      layer: "social_engineering",
      severity: "warning",
      title: "Artificial Time-Pressure Constraint",
      description: "Imposes a false countdown deadline to provoke hasty emotional reactions before the recipient can verify with their bank.",
      evidence: "Phrases detected: 'immediately', 'urgent action', 'within 24 hours'",
      recommendation: "Legitimate statutory procedures provide grace periods and formal postal or banking app notifications.",
    });
  }

  if (text.includes("suspended") || text.includes("restricted") || text.includes("blocked") || text.includes("detained") || text.includes("confiscation")) {
    triggers.push("Punitive Consequence Threat (Account Block / Parcel Seizure)");
    errors.push({
      layer: "social_engineering",
      severity: "warning",
      title: "Coercive Negative Consequence Trigger",
      description: "Threatens punitive disruption (debit freeze, account suspension, parcel seizure) to induce panic.",
      evidence: "Threat terms: 'restricted', 'suspended', 'confiscation', 'debit block'",
      recommendation: "Independent verification via official bank customer care hotline is mandatory before clicking any action links.",
    });
  }

  if (text.includes("ctc") || text.includes("package") || text.includes("18,50,000") || text.includes("joining bonus")) {
    triggers.push("Unsolicited High-Value Financial Bait");
  }

  // ----------------------------------------------------
  // LAYER 4: Credential Theft Traps
  // ----------------------------------------------------
  if (text.includes("pan") || text.includes("aadhaar") || text.includes("password") || text.includes("otp") || text.includes("pin") || text.includes("card details")) {
    errors.push({
      layer: "credential_theft",
      severity: "critical",
      title: "PII & Credential Harvesting Intent",
      description: "Demands submission of high-sensitivity identity credentials (PAN, Aadhaar, Bank Details, Card Number) over web links.",
      evidence: "Requested PII: PAN linking, Aadhaar verification, Card details",
      recommendation: "Never provide KYC or debit credentials via email links. RBI mandates in-person or official banking app verification only.",
    });
  }

  // Calculate Health Score
  let score = 100;
  errors.forEach((err) => {
    if (err.severity === "critical") score -= 25;
    else if (err.severity === "warning") score -= 12;
    else score -= 5;
  });
  score = Math.max(0, Math.min(100, score));

  const verdict: EmailErrorAuditResult["verdict"] =
    score < 40 ? "MALICIOUS_SPOOF" : score < 75 ? "SUSPICIOUS_PHISH" : "AUTHENTIC_SAFE";

  const safeActionGuidance: string[] = [];
  if (verdict === "MALICIOUS_SPOOF") {
    safeActionGuidance.push("🚨 Do NOT click any links or download attachments in this email.");
    safeActionGuidance.push("🛑 Move message to Spam and report as Phishing inside Gmail.");
    safeActionGuidance.push("📞 If credentials were entered, call National Cybercrime Helpline 1930 immediately.");
  } else if (verdict === "SUSPICIOUS_PHISH") {
    safeActionGuidance.push("⚠️ Exercise caution: Sender verification failed standard cryptographic checks.");
    safeActionGuidance.push("🔍 Verify directly by logging into the provider's official portal in a new browser tab.");
  } else {
    safeActionGuidance.push("✅ All cryptographic checks (SPF, DKIM, DMARC) passed with official domain alignment.");
    safeActionGuidance.push("🔒 Standard transaction communication matching official corporate sender records.");
  }

  return {
    messageId: email.id,
    overallHealthScore: score,
    verdict,
    errorsFound: errors,
    headerAnalysis: {
      spfValid: !spfFail,
      dkimValid: !dkimFail,
      dmarcValid: !dmarcFail,
      replyToDivergence,
      returnPathMismatch: returnPath ? !returnPath.includes(fromDomain) : false,
    },
    linkAnalysis: {
      totalLinks: urlMatches.length,
      suspiciousLinks: suspiciousLinksCount,
      mismatches: linkMismatches,
    },
    psychologicalTriggers: triggers,
    safeActionGuidance,
  };
}
