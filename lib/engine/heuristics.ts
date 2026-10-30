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
    title: "OTP / Security Code Solicitation",
    explanation: "Requests sharing or inputting an OTP or one-time verification passcode. Legitimate banks and entities NEVER ask for OTPs via SMS or unverified links.",
    regex: /\b(share|send|enter|verify|provide|submit|forward)\s+(your\s+)?(otp|one[-\s]?time[-\s]?password|verification\s+code|passcode|6[-\s]?digit\s+code)\b/i,
  },
  {
    id: "cred-pin-cvv",
    category: "credential_harvesting",
    severity: "critical",
    weight: 40,
    title: "ATM PIN / Card CVV Request",
    explanation: "Soliciting debit/credit card CVV or ATM PIN. This is a severe credential theft indicator.",
    regex: /\b(atm\s+pin|upi\s+pin|mpin|cvv|cvv2|card\s+expiry|card\s+number|security\s+pin)\b/i,
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
    weight: 30,
    title: "Urgent KYC / PAN / Aadhaar Update",
    explanation: "Coerces the user to update or verify PAN/Aadhaar/KYC under threat of account deactivation.",
    regex: /\b(kyc\s+(suspended|expired|pending|verification|update)|pan\s+card\s+(update|linked|blocked)|aadhaar\s+(link|update|mandatory))\b/i,
  },
  {
    id: "cred-remote-access-tools",
    category: "credential_harvesting",
    severity: "critical",
    weight: 35,
    title: "Remote Access Screen-Sharing App",
    explanation: "Instructs installation of remote desk tools (AnyDesk, TeamViewer, RustDesk, QuickSupport) used to hijack banking apps.",
    regex: /\b(anydesk|teamviewer|quicksupport|rustdesk|screen\s+share\s+app|airmirror)\b/i,
  },
  {
    id: "cred-apk-download",
    category: "credential_harvesting",
    severity: "critical",
    weight: 35,
    title: "Malicious APK File Direct Download",
    explanation: "Urges downloading an Android APK file outside the official Google Play Store. Often disguised as bank updates or electricity apps.",
    regex: /\b(\.apk|install\s+apk|download\s+app\s+from\s+link|sbi\.apk|update\.apk|rewards\.apk)\b/i,
  },

  // --- PSYCHOLOGICAL URGENCY & TIMEOUTS ---
  {
    id: "urg-immediate-deadline",
    category: "urgency",
    severity: "high",
    weight: 25,
    title: "Manufactured Time Pressure",
    explanation: "Creates artificial panic with a strict countdown (e.g. 'within 2 hours', 'today by 9:30 PM') so victims act before thinking.",
    regex: /\b(within\s+\d+\s*(hours?|hrs?|minutes?|mins?)|today\s+by\s+\d+|immediately|act\s+now|last\s+chance|within\s+24\s*hours?|urgent\s+action\s+required)\b/i,
  },
  {
    id: "urg-account-suspension",
    category: "urgency",
    severity: "high",
    weight: 25,
    title: "Account Suspension / Block Threat",
    explanation: "Falsely threatens immediate blocking of bank accounts, debit cards, or SIM cards to incite frantic compliance.",
    regex: /\b(account\s+(will\s+be\s+)?(blocked|suspended|deactivated|closed|frozen)|debit\s+card\s+blocked|sim\s+(deactivated|blocked))\b/i,
  },
  {
    id: "urg-electricity-cut",
    category: "urgency",
    severity: "high",
    weight: 30,
    title: "Power / Electricity Disconnection Scam",
    explanation: "Classic utility extortion scam claiming household electricity will be disconnected tonight unless an unauthorized number is contacted.",
    regex: /\b(electricity\s+power\s+will\s+be\s+disconnected|power\s+cut\s+tonight|previous\s+month\s+bill\s+was\s+not\s+updated|contact\s+electricity\s+officer)\b/i,
  },

  // --- FEAR, COERCION & "DIGITAL ARREST" ---
  {
    id: "fear-digital-arrest-law-enforcement",
    category: "fear_coercion",
    severity: "critical",
    weight: 45,
    title: "Digital Arrest / Law Enforcement Intimidation",
    explanation: "Impersonates police, CBI, ED, or court officials threatening imminent arrest or interrogation over Skype/video call. 'Digital arrest' is purely fraudulent.",
    regex: /\b(digital\s+arrest|cbi\s+(arrest|officer|investigation)|ed\s+(notice|arrest)|mumbai\s+police\s+cyber|delhi\s+police\s+crime|narcotics\s+control\s+bureau|ncb\s+seizure|fir\s+registered|arrest\s+warrant)\b/i,
  },
  {
    id: "fear-illegal-parcel-contraband",
    category: "fear_coercion",
    severity: "critical",
    weight: 40,
    title: "Illegal Parcel / Contraband Interception Scam",
    explanation: "Claims an unauthorized package containing passports, drugs, or illegal SIM cards was seized in the recipient's name to extort bribe payments.",
    regex: /\b(parcel\s+(contains|seized|intercepted)|customs\s+(clearance|detention|drugs|contraband)|taiwan\s+parcel|fedex\s+contraband|illegal\s+items\s+found)\b/i,
  },
  {
    id: "fear-legal-court-summons",
    category: "fear_coercion",
    severity: "high",
    weight: 30,
    title: "Fabricated Legal Action / Non-Bailable Warrant",
    explanation: "Fabricates court proceedings or threatening legal notices designed to intimidate victims into paying bogus settlement sums.",
    regex: /\b(non[-\s]?bailable\s+warrant|court\s+summons|legal\s+action\s+under\s+section|prosecution\s+initiated|contempt\s+of\s+court)\b/i,
  },

  // --- FINANCIAL SOLICITATION & ADVANCE FEE ---
  {
    id: "fin-upi-id-solicitation",
    category: "financial_solicitation",
    severity: "high",
    weight: 25,
    title: "Direct UPI Handle in Message",
    explanation: "Embeds an individual UPI payment address (e.g. user@okhdfcbank, name@paytm) instead of an official payment gateway.",
    regex: /[a-zA-Z0-9.\-_]{2,256}@(okhdfcbank|okaxis|okicici|oksbi|paytm|ybl|ibl|axl|upi|apl|sbi|postbank)/i,
  },
  {
    id: "fin-lottery-prize-fee",
    category: "financial_solicitation",
    severity: "critical",
    weight: 35,
    title: "Advance Fee / Bogus Prize Winner",
    explanation: "Promises huge lottery winnings, gift cards, or crypto payouts but demands an upfront registration/tax/handling fee.",
    regex: /\b(won\s+(a\s+)?(lottery|lucky\s+draw|kbc\s+jackpot|\$|rs\.?|inr|crore|lakh)|claim\s+(your\s+)?cash\s+prize|pay\s+(registration|tax|processing)\s+fee\s+to\s+claim)\b/i,
  },
  {
    id: "fin-telegram-task-job",
    category: "financial_solicitation",
    severity: "high",
    weight: 30,
    title: "Part-Time Task / Telegram Job Scam",
    explanation: "Promises high daily income (Rs 3000-8000/day) for liking YouTube videos or Google reviews, leading to fake prepaid investment traps.",
    regex: /\b(work\s+from\s+home|earn\s+.*(rs|inr|\$)\s*[\d,]+.*daily|daily\s+(rs|inr|\$)\s*[\d,]+|part[-\s]?time\s+job|youtube\s+video\s+liking|like\s+youtube\s+videos|video\s+liking\s+job|review\s+rating\s+job|contact\s+.*telegram|telegram\s*:\s*@)\b/i,
  },
  {
    id: "fin-tax-refund-claim",
    category: "financial_solicitation",
    severity: "high",
    weight: 30,
    title: "Fake Income Tax / GST Refund",
    explanation: "Falsely announces an approved tax refund and asks user to verify account details or enter OTP to receive the money.",
    regex: /\b(income\s+tax\s+refund\s+of\s+(rs|inr)|refund\s+amount\s+approved|claim\s+your\s+refund\s+within|itr\s+refund\s+credit)\b/i,
  },
  {
    id: "fin-suspicious-channel-redirect",
    category: "financial_solicitation",
    severity: "medium",
    weight: 20,
    title: "Redirect to Unmonitored Messaging Channel",
    explanation: "Instructs conversation migration to WhatsApp or Telegram to bypass platform security filters and spam shields.",
    regex: /\b(contact\s+us\s+on\s+(whatsapp|telegram)|join\s+telegram\s+channel|click\s+to\s+chat\s+wa\.me|message\s+on\s+whatsapp\s+number)\b/i,
  },

  // --- DELIVERY / PARCEL FAKE FAILED ATTEMPTS ---
  {
    id: "courier-failed-address-update",
    category: "impersonation",
    severity: "high",
    weight: 30,
    title: "Courier Incomplete Address / Reschedule Fee",
    explanation: "Claims an India Post or FedEx delivery failed due to missing street number or demands a Rs 5 - 25 redelivery fee to harvest card details.",
    regex: /\b(package\s+cannot\s+be\s+delivered|missing\s+house\s+number|address\s+incomplete|update\s+delivery\s+address|parcel\s+held\s+at\s+terminal|reschedule\s+delivery\s+link)\b/i,
  },

  // --- HINGLISH / REGIONAL SMISHING PATTERNS (ScamIntelli & I4C India Vectors) ---
  {
    id: "hinglish-power-cut",
    category: "urgency",
    severity: "high",
    weight: 35,
    title: "Hinglish Electricity Disconnection Threat",
    explanation: "Hindi/Hinglish power cut extortion: 'aaj raat bijli cut ho jayegi / officer se sampark karein'. Preys on panic in regional language.",
    regex: /\b(aaj\s+raat\s+bijli\s+cut|bijli\s+kat\s+(jayegi|di\s+jayegi)|bill\s+update\s+nahi\s+hua|officer\s+se\s+(turant\s+)?sampark\s+karein|light\s+kat\s+jayegi)\b/i,
  },
  {
    id: "hinglish-kyc-suspend",
    category: "credential_harvesting",
    severity: "critical",
    weight: 40,
    title: "Hinglish Bank Account / KYC Suspension",
    explanation: "Hindi/Hinglish banking threat: 'apka khata band ho jayega / turant kyc update karein'. Direct credential theft vector.",
    regex: /\b(apka\s+khata\s+(band|block)\s+(ho\s+gaya|kar\s+diya)|turant\s+(kyc|pan|aadhaar)\s+update\s+karein|warna\s+(account|khata)\s+band\s+hoga|paisa\s+ruk\s+jayega)\b/i,
  },
  {
    id: "hinglish-digital-arrest",
    category: "fear_coercion",
    severity: "critical",
    weight: 45,
    title: "Hinglish Digital Arrest / Police Intimidation",
    explanation: "Hindi/Hinglish police extortion: 'police station aana hoga / arrest warrant jaari / video call par hazir hon'. Pure fraud extortion.",
    regex: /\b(police\s+station\s+aana\s+hoga|arrest\s+warrant\s+jaari|giraftari\s+hogi|skype\s+par\s+hazir\s+hon|crime\s+branch\s+ki\s+notice)\b/i,
  },
  {
    id: "hinglish-job-scam",
    category: "financial_solicitation",
    severity: "high",
    weight: 30,
    title: "Hinglish Work-From-Home / Task Scam",
    explanation: "Hindi/Hinglish fake job bait: 'ghar baithe kamayein roz 3000 rupaye / video like karke kamayein'. Advance fee pyramid trap.",
    regex: /\b(ghar\s+baithe\s+(paise\s+)?kamayein|roz\s+\d+\s+se\s+\d+\s+(kamayein|inr|rs)|video\s+like\s+karke\s+kamayein|daily\s+income\s+kamayein)\b/i,
  },

  // --- DECEPTIVE QR CODE PAYMENT BAIT ---
  {
    id: "fin-qr-code-refund-bait",
    category: "financial_solicitation",
    severity: "critical",
    weight: 40,
    title: "Deceptive QR Code / PIN to Receive Money",
    explanation: "Claims scanning a QR code or entering a UPI PIN will credit money or refund. In reality, scanning a QR code or entering a UPI PIN can ONLY DEBIT money.",
    regex: /\b(scan\s+(this\s+)?qr\s+code\s+to\s+(receive|get|claim)\s+(money|refund|cashback|prize)|enter\s+pin\s+to\s+(receive|credit))\b/i,
  },
];

// Negative lookbehind or negative phrase filter to avoid false positives on security advice
// e.g. "SBI never asks for your OTP, CVV, or PIN"
const ADVISORY_NEGATION_REGEX = /(never\s+asks?\s+for|do\s+not\s+share|will\s+never\s+ask|beware\s+of|scammers?\s+ask|security\s+tip)/i;

export function runHeuristics(text: string): {
  hits: HeuristicHit[];
  spans: EvidentiarySpan[];
  score: number;
} {
  const hits: HeuristicHit[] = [];
  const spans: EvidentiarySpan[] = [];
  let cumulativeWeight = 0;

  for (const rule of HEURISTIC_RULES) {
    const match = rule.regex.exec(text);
    if (match) {
      const matchedString = match[0];
      const start = match.index;
      const end = start + matchedString.length;

      // Check if this match is inside an educational/advisory warning (e.g. "never ask for OTP")
      const windowStart = Math.max(0, start - 40);
      const windowEnd = Math.min(text.length, end + 30);
      const surroundingContext = text.substring(windowStart, windowEnd);

      if (rule.category === "credential_harvesting" && ADVISORY_NEGATION_REGEX.test(surroundingContext)) {
        // This is safe advisory advice, not a credential harvest!
        continue;
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

  // Linguistic Pressure Analysis (Inspired by ScamIntelli)
  // 1. ALL-CAPS screaming detection
  const words = text.split(/\s+/).filter((w) => w.length >= 3);
  const upperWords = words.filter((w) => /^[A-Z]{3,}$/.test(w) && !/^(SMS|OTP|SBI|HDFC|ICICI|PNB|UPI|INR|PIN|CVV|URL|APK)$/.test(w));
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

  // 2. Punctuation panic (e.g. '!!!!', '???')
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

  // Normalized score bounded between 0 and 100
  // Scaling: 40 weight points represents high risk
  const normalizedScore = Math.min(100, Math.round((cumulativeWeight / 50) * 100));

  return {
    hits,
    spans,
    score: normalizedScore,
  };
}
