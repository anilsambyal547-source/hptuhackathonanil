import { EvidentiarySpan, HeuristicHit, EvidenceCategory, SeverityLevel } from "../types";

interface RuleDefinition {
  id: string;
  category: EvidenceCategory;
  severity: SeverityLevel;
  weight: number;
  title: string;
  explanation: string;
  regex: RegExp;
}

const HEURISTIC_RULES: RuleDefinition[] = [
  // --- CREDENTIAL HARVESTING RULES ---
  {
    id: "cred-otp-solicitation",
    category: "credential_harvesting",
    severity: "critical",
    weight: 35,
    title: "OTP / Passcode Solicitation",
    explanation: "Requests sharing or inputting a one-time verification passcode. Legitimate banks and services never solicit OTPs via SMS or external links.",
    regex: /\b(share|send|enter|verify|provide|submit|forward)\s+(your\s+)?(otp|one[-\s]?time[-\s]?password|verification\s+code|passcode|6[-\s]?digit\s+code)\b/i,
  },
  {
    id: "cred-pin-cvv",
    category: "credential_harvesting",
    severity: "critical",
    weight: 40,
    title: "ATM PIN / Card CVV Request",
    explanation: "Soliciting debit/credit card CVV or ATM PIN. This is a severe credential theft indicator.",
    regex: /\b(atm\s+pin|upi\s+pin|mpin|cvv|cvv2|card\s+expiry|security\s+pin)\b/i,
  },
  {
    id: "cred-netbanking-credentials",
    category: "credential_harvesting",
    severity: "critical",
    weight: 35,
    title: "Banking Login / Password Request",
    explanation: "Prompts for NetBanking user ID or login password. Official banks never request credentials through SMS links.",
    regex: /\b(netbanking\s+password|login\s+credentials|internet\s+banking\s+id|profile\s+password|transaction\s+password)\b/i,
  },
  {
    id: "cred-pan-aadhaar-kyc",
    category: "credential_harvesting",
    severity: "high",
    weight: 35,
    title: "Urgent KYC / PAN / Aadhaar Update",
    explanation: "Coerces the user to update or verify PAN/Aadhaar/KYC under threat of account deactivation or toll penalty.",
    regex: /\b((?:pending|expired|mandatory|update|verify|complete)\s+kyc|kyc\s+(?:suspended|expired|pending|verification|update|incomplete)|(?:update|link|verify)\s+(?:your\s+)?(?:pan|aadhaar)|(?:pan|aadhaar)\s*(?:card)?\s*(?:update|linked|blocked|pending|verification)|re-?activate\s+(?:kyc|online\s+banking))\b/i,
  },
  {
    id: "cred-remote-access-tools",
    category: "credential_harvesting",
    severity: "critical",
    weight: 40,
    title: "Remote Access Screen-Sharing App",
    explanation: "Instructs installation of remote desk tools (AnyDesk, TeamViewer, RustDesk, QuickSupport) used to hijack banking apps.",
    regex: /\b(anydesk|teamviewer|quicksupport|rustdesk|screen\s+share\s+app|airmirror)\b/i,
  },
  {
    id: "cred-apk-download",
    category: "credential_harvesting",
    severity: "critical",
    weight: 45,
    title: "Malicious APK File Direct Download",
    explanation: "Urges downloading an Android APK file outside the official Google Play Store. Often disguised as WhatsApp Gold, bank updates, or rewards.",
    regex: /\b(whatsapp\s+gold|download\s+confidential\s+apk|install\s+apk|download\s+app\s+from\s+link|\.apk(\b|\/)|sbi\.apk|update\.apk)\b/i,
  },

  // --- PSYCHOLOGICAL URGENCY & TIMEOUTS ---
  {
    id: "urg-immediate-deadline",
    category: "urgency",
    severity: "high",
    weight: 25,
    title: "Manufactured Time Pressure",
    explanation: "Creates artificial panic with a strict countdown (e.g. 'within 2 hours', 'today by 9:30 PM') so victims act before thinking.",
    regex: /\b(within\s+\d+\s*(hours?|hrs?|minutes?|mins?)|today\s+by\s+\d+|immediately|act\s+now|last\s+chance|within\s+24\s*hours?|urgent\s+action\s+required|dial\s+9\s+immediately)\b/i,
  },
  {
    id: "urg-account-suspension",
    category: "urgency",
    severity: "high",
    weight: 30,
    title: "Account Suspension / Block Threat",
    explanation: "Falsely threatens immediate blocking of bank accounts, debit cards, or SIM cards to incite frantic compliance.",
    regex: /\b(account\s+(will\s+be\s+)?(blocked|suspended|deactivated|closed|frozen)|debit\s+card\s+blocked|sim\s+(card\s+)?(deactivated|blocked|will\s+be\s+deactivated)|fastag\s+.*blacklisted)\b/i,
  },
  {
    id: "urg-electricity-cut",
    category: "urgency",
    severity: "high",
    weight: 35,
    title: "Power / Electricity Disconnection Scam",
    explanation: "Classic utility extortion scam claiming household electricity will be disconnected tonight unless an unauthorized number is contacted.",
    regex: /\b(electricity\s+power\s+will\s+be\s+disconnected|power\s+cut\s+tonight|previous\s+month\s+bill\s+was\s+not\s+updated|contact\s+electricity\s+officer|bijli\s+connection\s+turant\s+kaat|bijli\s+cut|bill\s+update\s+nahi\s+hua)\b/i,
  },
  {
    id: "urg-sim-trai-notice",
    category: "urgency",
    severity: "high",
    weight: 35,
    title: "Telecom / SIM Card Deactivation Threat",
    explanation: "Falsely claims SIM card deactivation due to illegal broadcasting complaints or unverified KYC.",
    regex: /\b(trai\s+notice|illegal\s+broadcasting\s+complaints|telecom\s+desk\s+officer|sim\s+card\s+will\s+be\s+deactivated|dial\s+9\s+immediately)\b/i,
  },

  // --- FEAR, COERCION & "DIGITAL ARREST" ---
  {
    id: "fear-digital-arrest-law-enforcement",
    category: "fear_coercion",
    severity: "critical",
    weight: 45,
    title: "Digital Arrest / Law Enforcement Intimidation",
    explanation: "Impersonates police, Supreme Court, CBI, ED, or narcotics department threatening imminent arrest or online video call interrogation.",
    regex: /\b(digital\s+arrest|cbi\s+(investigation|officer|notice|court)|ed\s+(notice|arrest)|mumbai\s+police|delhi\s+police\s+(special\s+cell|crime)?|narcotics\s+control\s+bureau|ncb\s+seizure|fir\s+#?[a-z0-9-]+|non[-\s]?bailable\s+(arrest\s+)?warrant|contempt\s+of\s+court|avoid\s+(immediate\s+)?physical\s+arrest|supreme\s+court\s+of\s+india\s+e-notice)\b/i,
  },
  {
    id: "fear-video-call-interrogation",
    category: "fear_coercion",
    severity: "critical",
    weight: 45,
    title: "Online Video Call Interrogation / Bail Lure",
    explanation: "Demands connecting via Skype, WhatsApp video call, or Google Meet for simulated police interrogation or online bail proceedings.",
    regex: /\b(online\s+bail\s+hearing|whatsapp\s+video\s+call|skype\s+interrogation|join\s+skype|interrogation\s+on\s+google\s+meet|urgent\s+interrogation)\b/i,
  },
  {
    id: "fear-illegal-parcel-contraband",
    category: "fear_coercion",
    severity: "critical",
    weight: 40,
    title: "Illegal Parcel / Narcotics Seizure Extortion",
    explanation: "Claims an unauthorized package containing MDMA, drugs, or contraband was seized at customs to extort settlement fees.",
    regex: /\b(parcel\s+(contains|seized|intercepted|detained)|customs\s+(clearance|detention|drugs|contraband|duty)|contraband\s+(parcel|mdma)|narcotics\s+department|delhi\s+airport\s+customs)\b/i,
  },
  {
    id: "fear-fastag-toll-penalty",
    category: "fear_coercion",
    severity: "high",
    weight: 30,
    title: "Fastag Toll Penalty & RTO License Suspension",
    explanation: "Intimidates motorists with blacklisting of Fastag or suspension of driving license under threat of FIR or toll penalties.",
    regex: /\b(fastag\s+vehicle\s+registration\s+is\s+blacklisted|penalty\s+will\s+apply\s+at\s+toll|driving\s+licen[cs]e\s+is\s+suspended|sarathi\s+parivahan|avoid\s+fir.*challan)\b/i,
  },

  // --- FINANCIAL SOLICITATION & ADVANCE FEE ---
  {
    id: "fin-upi-id-solicitation",
    category: "financial_solicitation",
    severity: "high",
    weight: 30,
    title: "Direct UPI Payment Handle in Message",
    explanation: "Embeds an individual UPI payment address (e.g. user@okhdfcbank, name@paytm) instead of an official merchant payment gateway.",
    regex: /[a-zA-Z0-9.\-_]{2,256}@(okhdfcbank|okaxis|okicici|oksbi|paytm|ybl|ibl|axl|upi|apl|sbi|postbank)/i,
  },
  {
    id: "fin-task-job-scam",
    category: "financial_solicitation",
    severity: "high",
    weight: 35,
    title: "Part-Time Task / Telegram Job Scam",
    explanation: "Promises high daily income (Rs 3000-8000/day) for liking YouTube videos or reviewing hotels on Google Maps, funneling to Telegram.",
    regex: /\b(work\s+from\s+home\s+job|earn\s+daily\s+(rs|inr|\$)\s*[\d,]+|daily\s+(rs|inr|\$)\s*[\d,]+|part[-\s]?time\s+job|review\s+(\d+\s+)?hotels|google\s+maps\s+reviews|like\s+(youtube\s+)?videos|youtube\s+video\s+liking|deposit\s+every\s+\d+\s+minutes|contact\s+hr\s+on\s+(whatsapp|telegram)|message\s+hr\s+on\s+(whatsapp|telegram)|telegram:\s*@)\b/i,
  },
  {
    id: "fin-job-advance-deposit",
    category: "financial_solicitation",
    severity: "high",
    weight: 40,
    title: "Fake Job Offer with Upfront Deposit / Laptop Fee",
    explanation: "Offers employment while demanding a refundable security deposit, laptop delivery fee, or training charge.",
    regex: /\b((refundable\s+)?security\s+deposit|training\s+fee|laptop\s+delivery\s+fee|pay\s+registration\s+fee\s+for\s+job)\b/i,
  },
  {
    id: "fin-crypto-doubling-ponzi",
    category: "financial_solicitation",
    severity: "critical",
    weight: 40,
    title: "Crypto Doubling / VIP Guaranteed ROI Scheme",
    explanation: "Promises impossible guaranteed returns (e.g. send 0.1 BTC to receive 0.2 BTC back, or 500% ROI in 24 hours).",
    regex: /\b(binance\s+(giveaway|vip|doubler)|send\s+[\d.]+\s*(btc|eth|usdt)\s+to\s+receive|doubling\s+scheme|smart\s+contract\s+promo|withdraw\s+\$[\d,]+\s+within\s+24\s+hours\s+guaranteed|zero\s+risk\s+automated\s+trading|trc20\s+wallet)\b/i,
  },
  {
    id: "fin-loan-processing-fee",
    category: "financial_solicitation",
    severity: "high",
    weight: 35,
    title: "Pre-Approved Loan Stamp / Disbursal Fee Trap",
    explanation: "Promises a pre-approved loan transfer but demands upfront payment for processing, insurance, or stamp charges.",
    regex: /\b(pre-approved\s+personal\s+loan|loan\s+processing\s+stamp\s+fee|stamp\s+fee\s+rs\s*[\d,]+|pay\s+loan\s+processing)\b/i,
  },
  {
    id: "fin-lottery-prize-fee",
    category: "financial_solicitation",
    severity: "critical",
    weight: 40,
    title: "Advance Fee / KBC Lottery Jackpot Trap",
    explanation: "Falsely announces lottery winnings and demands an upfront registration/tax/handling fee.",
    regex: /\b(won\s+(a\s+)?(lottery|lucky\s+draw|kbc\s+jackpot|\$|rs\.?|inr|crore|lakh)|claim\s+(your\s+)?cash\s+prize|pay\s+(registration|tax|processing)\s+fee\s+to\s+claim|badhai\s+ho.*kbc|inam\s+paane\s+ke\s+liye.*fee)\b/i,
  },
  {
    id: "fin-qr-code-refund-bait",
    category: "financial_solicitation",
    severity: "critical",
    weight: 40,
    title: "Quishing: Deceptive QR Code / UPI PIN to Receive Money",
    explanation: "Claims scanning a QR code or entering a UPI PIN will credit or refund money. Under NPCI UPI protocols, scanning a QR code or entering a PIN can ONLY DEBIT funds, never receive money.",
    regex: /\b((?:scan\s+(?:this\s+)?qr(?:\s*code)?|qr\s*code\s+scan)\s+to\s+(?:receive|get|claim|accept|credit)\s+(?:money|refund|cashback|prize|amount)|(?:receive|accept|credit)\s+(?:money|cashback|refund)\s+by\s+scanning\s+qr|enter\s+(?:upi\s+)?pin\s+to\s+(?:receive|credit|accept))\b/i,
  },
  {
    id: "trai-dlt-sender-channel-mismatch",
    category: "impersonation",
    severity: "high",
    weight: 35,
    title: "TRAI DLT Channel Mismatch (Personal Mobile for Official Alert)",
    explanation: "Under Indian Telecom Regulatory Authority (TRAI) DLT mandates, official banks, utilities, and courts must communicate exclusively via registered commercial shortcodes (e.g. VK-SBIIN, BP-PSPCL), never from 10-digit personal mobile numbers.",
    regex: /\b(?:contact|call|reach|whatsapp|dial)\s+(?:electricity\s+officer|bank\s+officer|officer|manager|desk|executive|helpdesk|customer\s+care)?\s*(?:at|on|:)?\s*(?:(?:\+91[\s-]?)?[6-9]\d{9})\b/i,
  },
  {
    id: "fin-tax-refund-claim",
    category: "financial_solicitation",
    severity: "high",
    weight: 30,
    title: "Fake Income Tax / GST Refund",
    explanation: "Falsely announces an approved tax refund and asks user to verify account details to receive credit.",
    regex: /\b(income\s+tax\s+refund\s+of\s+(rs|inr)|refund\s+amount\s+approved|claim\s+your\s+refund\s+within|itr\s+refund\s+credit)\b/i,
  },
  {
    id: "fin-suspicious-channel-redirect",
    category: "financial_solicitation",
    severity: "medium",
    weight: 20,
    title: "Redirect to Unmonitored Messaging Channel",
    explanation: "Instructs conversation migration to WhatsApp or Telegram to bypass platform security filters.",
    regex: /\b(contact\s+us\s+on\s+(whatsapp|telegram)|join\s+telegram\s+channel|click\s+to\s+chat\s+wa\.me|message\s+on\s+whatsapp\s+number)\b/i,
  },

  // --- DELIVERY / PARCEL FAKE FAILED ATTEMPTS ---
  {
    id: "courier-failed-address-update",
    category: "impersonation",
    severity: "high",
    weight: 35,
    title: "Courier Incomplete Address / Redelivery Fee",
    explanation: "Claims delivery failed due to missing street number or demands a redelivery fee to harvest payment cards.",
    regex: /\b(package\s+cannot\s+be\s+delivered|missing\s+house\s+number|address\s+incomplete|update\s+delivery\s+address|parcel\s+held\s+at\s+terminal|reschedule\s+delivery\s+link|redirection\s+fee\s+of\s+rs)\b/i,
  },

  // --- HINGLISH / REGIONAL SMISHING PATTERNS ---
  {
    id: "hinglish-power-cut",
    category: "urgency",
    severity: "high",
    weight: 35,
    title: "Hinglish Electricity Disconnection Threat",
    explanation: "Hindi/Hinglish power cut extortion: 'aaj raat bijli cut ho jayegi / pichla bill jama na hone'.",
    regex: /\b(aaj\s+raat\s+bijli\s+cut|bijli\s+(connection\s+turant\s+)?kaat\s+(di\s+)?jayegi|bill\s+update\s+nahi\s+hua|pichla\s+bill\s+jama\s+na\s+hone|officer\s+se\s+(turant\s+)?sampark\s+karein|bijli\s+vibhag\s+soochana)\b/i,
  },
  {
    id: "hinglish-kyc-suspend",
    category: "credential_harvesting",
    severity: "critical",
    weight: 40,
    title: "Hinglish Bank Account / KYC Suspension",
    explanation: "Hindi/Hinglish banking threat: 'apka khata band ho jayega / turant kyc update karein'.",
    regex: /\b(apka\s+khata\s+(band|block)\s+(ho\s+gaya|kar\s+diya)|apka\s+.*bank\s+khata.*band|turant\s+(kyc|pan|aadhaar)\s+update\s+karein|warna\s+(account|khata)\s+band\s+hoga|paisa\s+ruk\s+jayega)\b/i,
  },
  {
    id: "hinglish-digital-arrest",
    category: "fear_coercion",
    severity: "critical",
    weight: 45,
    title: "Hinglish Digital Arrest / Police Intimidation",
    explanation: "Hindi/Hinglish police extortion: 'police station aana hoga / arrest warrant jaari'.",
    regex: /\b(police\s+station\s+aana\s+hoga|arrest\s+warrant\s+jaari|giraftari\s+hogi|skype\s+par\s+hazir\s+hon|crime\s+branch\s+ki\s+notice)\b/i,
  },
  {
    id: "hinglish-job-scam",
    category: "financial_solicitation",
    severity: "high",
    weight: 35,
    title: "Hinglish Work-From-Home / Task Scam",
    explanation: "Hindi/Hinglish fake job bait: 'ghar baithe kamayein roz 3000 rupaye'.",
    regex: /\b(ghar\s+baithe\s+(paise\s+)?kamayein|roz\s+\d+\s+se\s+\d+\s+(kamayein|inr|rs)|video\s+like\s+karke\s+kamayein|daily\s+income\s+kamayein)\b/i,
  },

  // --- AMBIGUOUS / SUSPICIOUS ANOMALIES (Ground Truth: Suspicious 35-64) ---
  {
    id: "susp-unverified-shipment-tracking",
    category: "suspicious_link",
    severity: "medium",
    weight: 25,
    title: "Generic Unverified Shipment Tracking",
    explanation: "Generic package tracking message without recognized carrier branding, linking to an unverified tracking portal.",
    regex: /\b(your\s+shipment|your\s+order|your\s+package)\s+(#?[a-z0-9-]+\s+)?(has\s+arrived|is\s+on\s+hold|arrived\s+at\s+local|in\s+transit).*(check\s+delivery|view\s+delivery|delivery\s+schedule|view\s+tracking|view\s+delivery\s+window)\b/i,
  },
  {
    id: "susp-flash-deal-urgency",
    category: "urgency",
    severity: "medium",
    weight: 25,
    title: "Unsolicited Promotional Deal with Expiry Panic",
    explanation: "Promotional marketing message using urgency (e.g. 'before midnight') without transparent brand identity.",
    regex: /\b(flash\s+sale\s+alert|exclusive\s+\d+%\s+discount|complimentary\s+.*before\s+midnight|unlocked\s+for\s+your\s+mobile\s+number)\b/i,
  },
  {
    id: "susp-survey-reward-voucher",
    category: "financial_solicitation",
    severity: "medium",
    weight: 25,
    title: "Unsolicited Survey Gift / Recharge Voucher",
    explanation: "Promises monetary or recharge vouchers in return for completing external surveys, frequently used for demographic harvesting.",
    regex: /\b(consumer\s+survey|complete\s+our\s+.*survey|survey\s+to\s+receive).*(recharge\s+voucher|gift\s+card|free\s+coupon)\b/i,
  },
  {
    id: "susp-vague-legal-call-back",
    category: "fear_coercion",
    severity: "medium",
    weight: 25,
    title: "Vague Document / Urgent Call-Back Request",
    explanation: "Creates mild urgency citing an unspecified reference document or legal notice with an unverified phone number.",
    regex: /\b(important\s+legal\s+notice|please\s+call\s+back\s+immediately\s+on\s+\d+|regarding\s+reference\s+(file|document)\s*#?[a-z0-9-]+)\b/i,
  },
  {
    id: "susp-shortlink-profile-update",
    category: "suspicious_link",
    severity: "medium",
    weight: 25,
    title: "Generic Security Shortlink Prompt",
    explanation: "Prompts profile or security review via an obfuscated URL shortener without clear corporate origin.",
    regex: /\b(security\s+(notice|update)|review\s+recent\s+sign-in|account\s+recovery\s+settings).*(https?:\/\/(bit\.ly|tinyurl|t\.co|cutt\.ly|is\.gd|rb\.gy))/i,
  },
  {
    id: "susp-unsolicited-lucky-draw-bait",
    category: "financial_solicitation",
    severity: "medium",
    weight: 25,
    title: "Unverified Lucky Draw / Prize Notification",
    explanation: "Announces unexpected contest/lottery winnings or prize selection; common initial hook before fee demands.",
    regex: /\b(selected\s+(in|for)\s+(the\s+)?(lucky\s+draw|lottery|annual\s+draw|raffle)|won\s+(a\s+)?prize|lucky\s+winner|congratulations.*(lucky\s+draw|prize|selected))\b/i,
  },
  {
    id: "susp-unsolicited-recruiter-outreach",
    category: "fear_coercion",
    severity: "medium",
    weight: 25,
    title: "Unsolicited Cold Recruiter Outreach",
    explanation: "Unverified employment outreach asking to engage or reply via unauthenticated messaging channels.",
    regex: /\b(reviewed\s+your\s+resume|profile\s+shortlisted|opening\s+for.*reply\s+(yes|with\s+cv)|interested\s+in\s+exploring.*send\s+(updated\s+)?(cv|resume))\b/i,
  },
];

// Negative context / protective advisory detector
// Detects when security keywords appear inside protective educational warnings or legitimate transactions
const PROTECTIVE_ADVISORY_REGEX = /\b(never\s+(share|disclose|give|tell|ask|call)|do\s+not\s+(share|disclose|give|tell|forward)|don't\s+(share|disclose|give|tell|forward)|not\s+share|kisi\s+ko\s+(bhi\s+)?(na|mat)\s+(de|batao|bataein)|beware\s+of|security\s+(tip|advisory|alert)|bank\s+never\s+(calls?|asks?)|never\s+calls?\s+for|share\s+.*only\s+(upon|after)\s+receiving)\b/i;

// Standard OTP validity and legitimate delivery windows
const LEGIT_EXPIRY_OR_DELIVERY_REGEX = /\b(valid\s+for\s+\d+\s*(mins?|minutes?|secs?|seconds?|hours?|hrs?)|arriving\s+today\s+by\s+\d+|if\s+(not\s+authorized|not\s+you|fraudulent).*(call|sms|block).*immediately|call\s+\d+\s+immediately\s+to\s+block)\b/i;

export function runHeuristics(text: string): {
  hits: HeuristicHit[];
  spans: EvidentiarySpan[];
  score: number;
} {
  const hits: HeuristicHit[] = [];
  const spans: EvidentiarySpan[] = [];
  let cumulativeWeight = 0;

  const isProtectiveAdvisoryOverall = PROTECTIVE_ADVISORY_REGEX.test(text);

  for (const rule of HEURISTIC_RULES) {
    const match = rule.regex.exec(text);
    if (match) {
      const matchedString = match[0];
      const start = match.index;
      const end = start + matchedString.length;

      // Check surrounding context window (+/- 50 characters)
      const windowStart = Math.max(0, start - 50);
      const windowEnd = Math.min(text.length, end + 50);
      const surroundingContext = text.substring(windowStart, windowEnd);

      // 1. Protective Context Suppression for Credentials
      if (rule.category === "credential_harvesting") {
        const isProtectiveContext = PROTECTIVE_ADVISORY_REGEX.test(surroundingContext) || isProtectiveAdvisoryOverall;
        // If protective advisory and no malicious URL or threat
        if (isProtectiveContext && !/\b(http|www\.|\.xyz|\.top|\.apk|blocked|suspended|immediately\s+at)\b/i.test(text)) {
          continue;
        }
      }

      // 2. Legitimate Expiry / Delivery Window Suppression for Urgency
      if (rule.category === "urgency" && rule.id === "urg-immediate-deadline") {
        if (LEGIT_EXPIRY_OR_DELIVERY_REGEX.test(surroundingContext) || LEGIT_EXPIRY_OR_DELIVERY_REGEX.test(text)) {
          // If the text is an authentic transactional alert without coercive threats
          if (!/\b(disconnected|arrest|warrant|narcotics|fir|suspend|deactivat)\b/i.test(text)) {
            continue;
          }
        }
      }

      hits.push({
        id: rule.id,
        category: rule.category,
        matchedText: matchedString,
        severity: rule.severity,
        weight: rule.weight,
        title: rule.title,
        explanation: rule.explanation,
        startIndex: start,
        endIndex: end,
      });

      spans.push({
        id: `span-${rule.id}-${start}`,
        start,
        end,
        text: matchedString,
        category: rule.category,
        severity: rule.severity,
        title: rule.title,
        explanation: rule.explanation,
      });

      cumulativeWeight += rule.weight;
    }
  }

  // Linguistic Pressure Analysis (ALL-CAPS screaming)
  const words = text.split(/\s+/).filter((w) => w.length >= 3);
  const upperWords = words.filter((w) => /^[A-Z]{3,}$/.test(w) && !/^(SMS|OTP|SBI|HDFC|ICICI|PNB|UPI|INR|PIN|CVV|URL|APK|TCS|NHAI|IRCTC|CBI|FIR|RTO)$/.test(w));
  if (words.length >= 4 && upperWords.length / words.length >= 0.35) {
    hits.push({
      id: "ling-caps-screaming",
      category: "urgency",
      matchedText: upperWords.join(" "),
      severity: "medium",
      weight: 15,
      title: "Linguistic Pressure: ALL-CAPS Screaming",
      explanation: "Uses excessive uppercase phrasing to induce panic and force compliance through artificial visual volume.",
    });
    cumulativeWeight += 15;
  }

  // Punctuation panic (e.g. '!!!!', '???')
  const punctMatch = /([!?]{2,})/.exec(text);
  if (punctMatch) {
    spans.push({
      id: `span-punct-${punctMatch.index}`,
      start: punctMatch.index,
      end: punctMatch.index + punctMatch[0].length,
      text: punctMatch[0],
      category: "urgency",
      severity: "low",
      title: "Punctuation Pressure Tactics",
      explanation: "Repeated exclamation or question marks used to manufacture panic.",
    });
    cumulativeWeight += 10;
  }

  // Scaling: 40 weight points represents high risk
  const normalizedScore = Math.min(100, Math.round((cumulativeWeight / 45) * 100));

  return {
    hits,
    spans,
    score: normalizedScore,
  };
}
