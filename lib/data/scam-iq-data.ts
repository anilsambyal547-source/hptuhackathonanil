import { QuizScenario, DrillItem, RedFlagArtifact } from "../types/scam-iq";

export const QUIZ_SCENARIOS: QuizScenario[] = [
  {
    id: "quiz-01",
    title: "The VIP Crypto 'Guaranteed Returns' Group",
    category: "crypto_fraud",
    badge: "Pig Butchering / Investment",
    sender: "Alex Trading Pro (Telegram VIP Channel)",
    timestamp: "Today at 2:15 PM",
    artifactType: "chat",
    artifactContent: `🔥 PRIVATE SIGNAL ALERT 🔥\nOur AI quantitative algorithm just closed another 340% win on BTC/USDT!\n\n👑 VIP Tier Membership is open for the next 15 minutes only.\nDeposit 500 USDT to our smart contract wallet: 0x71C...a89F\nGuaranteed minimum daily return: 18.5% passive compounding.\n\n"I made $14,000 in 3 days!" - Testimonial from @sarah_crypto\nDM @AlexAdmin to activate your spot before seats close.`,
    warningSignals: [
      "Guaranteed double-digit returns on volatile assets",
      "Artificial scarcity ('open for next 15 minutes only')",
      "Payment requested exclusively via non-reversible crypto wallet"
    ],
    questions: [
      {
        id: "q1-1",
        prompt: "What is the primary psychological manipulation tactic utilized in this message?",
        options: [
          {
            id: "opt-1",
            text: "Fear of Missing Out (FOMO) combined with manufactured financial greed",
            isCorrect: true,
            explanation: "Scammers artificially compress decision time (15 minutes only) and promise impossible 'guaranteed' 18.5% daily compounding to bypass logical skepticism."
          },
          {
            id: "opt-2",
            text: "Legal intimidation and threat of government penalty",
            isCorrect: false,
            explanation: "There is no threat of legal consequences here; this is an investment lure targeting financial greed."
          },
          {
            id: "opt-3",
            text: "Social proof using verified regulatory bodies",
            isCorrect: false,
            explanation: "The testimonial (@sarah_crypto) is an unverified fake account, not an authorized regulatory audit."
          }
        ],
        attackVector: "Manufactured Urgency & Greed Exploitation",
        educationalTip: "Legitimate registered financial advisors never guarantee fixed high returns on crypto or equities."
      },
      {
        id: "q1-2",
        prompt: "Why do scammers insist on direct USDT/crypto transfers to private wallet addresses?",
        options: [
          {
            id: "opt-4",
            text: "Blockchain transactions are cheaper than standard bank transfers",
            isCorrect: false,
            explanation: "Transaction fees are irrelevant to the scammer's core motive."
          },
          {
            id: "opt-5",
            text: "Crypto transactions are irreversible, pseudo-anonymous, and lack consumer chargeback protections",
            isCorrect: true,
            explanation: "Unlike banking payments where fraud can trigger an account freeze or chargeback, crypto wallet transfers cannot be refunded by any central bank once confirmed on-chain."
          },
          {
            id: "opt-6",
            text: "It proves the investor is technologically qualified",
            isCorrect: false,
            explanation: "Scammers frequently target novice investors who do not understand self-custody risks."
          }
        ],
        attackVector: "Non-Reversible Fund Extraction",
        educationalTip: "Never send cryptocurrency to an individual or channel claiming to invest or trade on your behalf."
      }
    ]
  },
  {
    id: "quiz-02",
    title: "India Post Urgent Parcel Detention Notice",
    category: "courier_phishing",
    badge: "Smishing & Card Harvesting",
    sender: "AD-INDPOST (Spoofed Sender ID)",
    timestamp: "Today at 10:42 AM",
    artifactType: "sms",
    artifactContent: `[India Post Alert] Your package #IN99482103 cannot be delivered due to an incomplete street address. Please update your address and pay redelivery dispatch fee (₹24.50) within 12 hours at: https://indiapost-update.top/tracking. If unpaid, package will be returned to sender or destroyed.`,
    artifactUrl: "https://indiapost-update.top/tracking",
    warningSignals: [
      "High-risk unofficial top-level domain (.top instead of official .gov.in)",
      "Nominal fee lure (₹24.50) designed to extract CVV and credit card numbers",
      "Short timeline threat ('package will be destroyed')"
    ],
    questions: [
      {
        id: "q2-1",
        prompt: "What is the critical red flag in the provided URL: 'https://indiapost-update.top/tracking'?",
        options: [
          {
            id: "opt-7",
            text: "The URL begins with HTTPS rather than HTTP",
            isCorrect: false,
            explanation: "Scam sites routinely use free SSL certificates (HTTPS) to simulate legitimacy."
          },
          {
            id: "opt-8",
            text: "It uses a cheap high-risk TLD (.top) instead of the official government domain (.gov.in)",
            isCorrect: true,
            explanation: "All genuine Government of India departments and public post systems operate exclusively under the .gov.in or .nic.in domain hierarchy. India Post never uses .top, .xyz, or .site."
          },
          {
            id: "opt-9",
            text: "The tracking number contains too few digits",
            isCorrect: false,
            explanation: "Scammers generate realistic-looking tracking IDs; the domain name is the definitive technical giveaway."
          }
        ],
        attackVector: "Domain Impersonation & Malicious TLD",
        educationalTip: "Always inspect the root domain before entering any information. Official Indian government entities only use .gov.in."
      },
      {
        id: "q2-2",
        prompt: "Why do courier phishers ask for a tiny payment like ₹24.50 rather than a large sum?",
        options: [
          {
            id: "opt-10",
            text: "The low price lowers psychological barriers so victims willingly enter their card number, expiry, and CVV",
            isCorrect: true,
            explanation: "Victims think 'it's only ₹25, no big deal', but the phishing page silently captures full debit/credit card credentials and subsequently drains thousands via OTP hijacking."
          },
          {
            id: "opt-11",
            text: "India Post regulations cap re-dispatch fees at ₹25",
            isCorrect: false,
            explanation: "India Post does not charge online re-dispatch fees via SMS links for postal delivery."
          },
          {
            id: "opt-12",
            text: "Banks don't monitor micro-transactions",
            isCorrect: false,
            explanation: "The actual unauthorized charge that follows is rarely for ₹25; it is for whatever funds the card limit allows."
          }
        ],
        attackVector: "Low-Friction Credential Harvesting Trap",
        educationalTip: "Never pay delivery or custom fees on third-party links received through SMS."
      }
    ]
  },
  {
    id: "quiz-03",
    title: "Digital Arrest & CBI Video Interrogation Threat",
    category: "digital_arrest",
    badge: "Police Impersonation & Extortion",
    sender: "Cyber Crime Cell - New Delhi (WhatsApp Call & Letter)",
    timestamp: "Today at 4:30 PM",
    artifactType: "notice",
    artifactContent: `CENTRAL BUREAU OF INVESTIGATION - CYBER CELL\nNOTICE UNDER SECTION 91 CrPC / PMLA 2002\n\nSubject: Immediate Digital Arrest Warrant issued against your Aadhaar card for laundering ₹3.8 Crore via Mumbai Canara Bank.\n\nYou are placed under DIGITAL ARREST. Remain on this WhatsApp video call in a closed room with camera active.\nTo prove non-involvement, transfer statutory security deposit to Supreme Court Verification Escrow Account within 60 minutes.\nFailure to comply will result in SWAT deployment at your residence.`,
    warningSignals: [
      "There is legally NO concept of 'Digital Arrest' under Indian Law",
      "Law enforcement never interrogates citizens over WhatsApp video calls",
      "Government bodies never demand funds transferred to private bank accounts"
    ],
    questions: [
      {
        id: "q3-1",
        prompt: "What is the official legal status of 'Digital Arrest' according to the Ministry of Home Affairs (MHA) & CBI?",
        options: [
          {
            id: "opt-13",
            text: "Digital arrest does not exist under Indian law; no police or agency is empowered to arrest anyone via video call",
            isCorrect: true,
            explanation: "The Indian Cyber Crime Coordination Centre (I4C) and Supreme Court have repeatedly confirmed that 'Digital Arrest' is a complete fabrication used by international organized crime syndicates."
          },
          {
            id: "opt-14",
            text: "It is an emergency procedure enacted during cyber investigations",
            isCorrect: false,
            explanation: "No such statutory provision exists in the Bharatiya Nagarik Suraksha Sanhita (BNSS) or CrPC."
          },
          {
            id: "opt-15",
            text: "It only applies to cases involving international narcotics and money laundering",
            isCorrect: false,
            explanation: "Physical summons or physical custody following constitutional protocols are mandatory for all criminal arrests."
          }
        ],
        attackVector: "State Authority Coercion & Panic Induction",
        educationalTip: "If anyone threatens you with 'Digital Arrest' over Skype or WhatsApp, immediately disconnect and dial 1930."
      },
      {
        id: "q3-2",
        prompt: "If you receive this video call and document, what is the safest immediate action?",
        options: [
          {
            id: "opt-16",
            text: "Transfer a partial deposit to demonstrate cooperation while hiring a lawyer",
            isCorrect: false,
            explanation: "Sending any money funds the criminal enterprise and marks you as an easy target for escalating extortion."
          },
          {
            id: "opt-17",
            text: "Immediately disconnect the call, block the sender, and report the number at cybercrime.gov.in or helpline 1930",
            isCorrect: true,
            explanation: "Cutting off communication stops the psychological pressure cycle. Reporting immediately enables authorities to freeze victim funds and blacklist the offending bank accounts."
          },
          {
            id: "opt-18",
            text: "Stay on the call to record evidence for the local police station",
            isCorrect: false,
            explanation: "Extended engagement allows skilled extortionists to manipulate and isolate victims from family."
          }
        ],
        attackVector: "Actionable Threat Neutralization",
        educationalTip: "Report all extortion threats to the National Cybercrime Portal (cybercrime.gov.in) or call 1930."
      }
    ]
  },
  {
    id: "quiz-04",
    title: "Urgent Electricity Disconnection Threat",
    category: "utility_urgency",
    badge: "Utility Fraud & APK Malware",
    sender: "State Power Distribution Corp (Unsaved Mobile Number)",
    timestamp: "Today at 7:45 PM",
    artifactType: "sms",
    artifactContent: `Dear Consumer, Your electricity power supply will be DISCONNECTED tonight at 9:30 PM from the power sub-station because your previous month bill was not updated. Immediately contact our electricity officer Mr. Sharma at 98110-XXXXX to avoid power disconnection. Update via our Suvidha App APK link: http://bit.ly/power-bill-fix`,
    artifactUrl: "http://bit.ly/power-bill-fix",
    warningSignals: [
      "Extreme manufactured deadline ('tonight at 9:30 PM')",
      "Contacting an individual personal mobile number instead of an official helpline",
      "Directing the victim to install a third-party .apk file from a bit.ly link"
    ],
    questions: [
      {
        id: "q4-1",
        prompt: "Why do electricity bill scammers tell victims to download an .APK file from a shortened URL?",
        options: [
          {
            id: "opt-19",
            text: "The .APK file is a remote-access trojan (RAT) that reads incoming SMS messages and intercepts 2FA banking OTPs",
            isCorrect: true,
            explanation: "Malicious APKs abuse Android accessibility and notification permissions to forward OTPs directly to scammers while masking the victim's screen."
          },
          {
            id: "opt-20",
            text: "Power distribution companies avoid Google Play Store fees by hosting APKs",
            isCorrect: false,
            explanation: "All legitimate municipal and state utilities publish verified apps exclusively on official app stores."
          },
          {
            id: "opt-21",
            text: "The APK enables direct Bluetooth connection to smart meters",
            isCorrect: false,
            explanation: "Electricity billing is handled server-side through utility consumer numbers, never peer-to-peer phone APKs."
          }
        ],
        attackVector: "SMS-Stealing Mobile Malware (.APK)",
        educationalTip: "Never sideload .APK files from SMS or WhatsApp links; they are weaponized spyware designed to steal OTPs."
      },
      {
        id: "q4-2",
        prompt: "How should you verify an unexpected electricity bill disconnection alert?",
        options: [
          {
            id: "opt-22",
            text: "Log in directly to your official electricity board portal or authorized UPI bill-pay app using your Consumer ID",
            isCorrect: true,
            explanation: "Checking your bill status on your authorized utility app (e.g. BSES, TNEB, MSEDCL, Tata Power) reveals your true payment history without exposing your device to malicious links."
          },
          {
            id: "opt-23",
            text: "Call the phone number provided in the SMS message to request a 24-hour extension",
            isCorrect: false,
            explanation: "Calling the number connects you directly to the scam operator pretending to be the utility officer."
          },
          {
            id: "opt-24",
            text: "Forward the SMS to friends in your neighborhood to see if their power is also being disconnected",
            isCorrect: false,
            explanation: "This spreads panic and disinformation without verifying your personal account status."
          }
        ],
        attackVector: "Independent Channel Verification",
        educationalTip: "Always verify bill disputes directly on the utility provider's verified website, never through numbers sent via SMS."
      }
    ]
  }
];

export const DRILL_ITEMS: DrillItem[] = [
  {
    id: "drill-01",
    type: "scam",
    title: "SBI NetBanking Urgent KYC Freeze",
    sender: "VM-SBIBANK",
    content: "Dear SBI User, your NetBanking access is disabled today. Click http://sbi-kyc-reactivate.xyz to submit Aadhaar & Pan to avoid permanent closure.",
    url: "http://sbi-kyc-reactivate.xyz",
    category: "Banking Smishing",
    explanation: "SBI never uses .xyz domains. High urgency threats to block accounts unless credentials are entered are signature phishing lures.",
    keyIndicators: [".xyz lookalike domain", "Threat of permanent closure", "Unsolicited KYC credential request"]
  },
  {
    id: "drill-02",
    type: "legit",
    title: "Official HDFC Bank OTP Alert",
    sender: "HDFCBK",
    content: "389201 is your OTP for purchase of Rs 1,450.00 at Swiggy on HDFC Bank Card ending 4410. Do not share OTP with anyone, including bank staff.",
    category: "Legitimate Transaction",
    explanation: "Standard transactional OTP message containing precise merchant name, exact amount, and explicit warning never to share the code.",
    keyIndicators: ["No external URLs", "Official 6-character bank sender ID", "Explicit non-sharing advisory"]
  },
  {
    id: "drill-03",
    type: "scam",
    title: "YouTube Video Like Daily Income",
    sender: "+1 (849) 203-1192",
    content: "Hello! We are hiring part-time review assistants. Like 3 YouTube videos and get Rs 150 instantly. Earn Rs 3000 to Rs 8000 daily from home. Join Telegram: t.me/VIP_Work_Official",
    url: "t.me/VIP_Work_Official",
    category: "Task / Job Scam",
    explanation: "Classic task scam. They pay ₹150 for the first few tasks to gain trust, then trick you into 'prepaid investment tasks' where thousands are stolen.",
    keyIndicators: ["Absurd pay for trivial task", "Foreign country code WhatsApp", "Telegram diversion"]
  },
  {
    id: "drill-04",
    type: "legit",
    title: "Amazon Package Out for Delivery",
    sender: "AMAZON",
    content: "Your Amazon package with order #402-9918231-10291 is out for delivery today with delivery associate Ramesh (PIN 42). Track on the Amazon App.",
    category: "Legitimate Delivery",
    explanation: "Directs customer to check status in their installed official mobile app without providing suspicious shortened external links or fee demands.",
    keyIndicators: ["No links requesting card details", "Directs to official app", "Matches Amazon order ID format"]
  },
  {
    id: "drill-05",
    type: "scam",
    title: "TRAI Telecom SIM Deactivation Notice",
    sender: "Dept-Telecom",
    content: "TRAI Notice: Your mobile SIM number will be disconnected within 2 hours due to illegal bulk SMS activities. Press 9 or call 91820-XXXXX for biometric KYC verification.",
    category: "Impersonation Extortion",
    explanation: "TRAI does not communicate individual disconnection notices to consumers or mandate telephone verification calls. This is a phone-takeover trap.",
    keyIndicators: ["TRAI impersonation", "2-hour disconnection ultimatum", "Pressure to call scammer"]
  },
  {
    id: "drill-06",
    type: "legit",
    title: "Microsoft Security Alert for Recognized Sign-in",
    sender: "account-security-noreply@accountprotection.microsoft.com",
    content: "Microsoft account unusual sign-in activity: We detected a successful sign-in to your Microsoft account from Chrome on Windows in New Delhi, India. If this was you, you can safely ignore this email.",
    category: "Authentic Security Notice",
    explanation: "Originated from the authentic domain accountprotection.microsoft.com. It informs the user and allows them to ignore if valid, without panic threats.",
    keyIndicators: ["Authentic domain", "No coercive threats", "Transparent location and device logging"]
  },
  {
    id: "drill-07",
    type: "scam",
    title: "Income Tax Department Refund Pending",
    sender: "IT-REFUND",
    content: "Income Tax Dept has approved your tax refund of ₹18,490 for FY 2024-25. Please confirm your bank account number and Debit Card CVV to disburse: https://incometax-refunds.online",
    url: "https://incometax-refunds.online",
    category: "Tax Phishing",
    explanation: "The Income Tax Department never asks for Card CVVs or passwords to disburse refunds. Refunds are credited directly via bank account validation on incometax.gov.in.",
    keyIndicators: ["Solicitation of Debit Card CVV", "Fake .online domain", "Promise of unexpected government cash"]
  },
  {
    id: "drill-08",
    type: "legit",
    title: "Authentic Electricity Bill E-Receipt",
    sender: "billing@bsesdelhi.com",
    content: "Dear Consumer (CA: 10029381), Thank you for your payment of ₹2,180.00 against bill month Oct-2026. Transaction ref: BSES2026103099281. View history on bsesdelhi.com.",
    category: "Authentic Utility Receipt",
    explanation: "A standard confirmation receipt containing verifiable consumer account number, exact paid amount, and reference to the official utility domain.",
    keyIndicators: ["Legitimate enterprise domain", "Receipt for completed transaction", "Specific consumer CA number"]
  },
  {
    id: "drill-09",
    type: "scam",
    title: "Customs Parcel Gold Jewellery Detention",
    sender: "FedEx-Intl-Customs",
    content: "Your parcel contains undeclared 250g Gold Jewellery. Mumbai Customs has flagged illegal contraband. Pay statutory clearance penalty ₹4,500 via GooglePay UPI ID: customs-clearance@okaxis.",
    category: "Courier Extortion",
    explanation: "Customs duties and tax penalties are NEVER paid to personal UPI handles (@okaxis). Official duty is deposited into government treasury accounts with an ICEGATE challan.",
    keyIndicators: ["Personal UPI handle for government duty", "Contraband fear tactic", "Impersonating FedEx/Customs"]
  },
  {
    id: "drill-10",
    type: "legit",
    title: "Blue Dart OTP for Doorstep Package Verification",
    sender: "BLUEDART",
    content: "Your Blue Dart shipment 88192031 is being delivered today. Share OTP 7712 only with your delivery associate when you physically receive the parcel.",
    category: "Legitimate Courier Delivery",
    explanation: "Clear instructions to share the delivery confirmation PIN only upon physical receipt of goods at doorstep. No payment requested.",
    keyIndicators: ["Doorstep handover verification only", "Official courier sender ID", "Zero payment demands"]
  }
];

export const RED_FLAG_ARTIFACTS: RedFlagArtifact[] = [
  {
    id: "rf-01",
    title: "Urgent Mobile Banking Suspension Alert (SMS)",
    subtitle: "Examine every token of this SMS. Click only what looks like a scam signal.",
    category: "Banking Smishing",
    artifactType: "sms",
    description: "A text message delivered to your mobile pretending to be State Bank of India. Tap each element you suspect is a fraudulent red flag.",
    totalRedFlags: 4,
    elements: [
      {
        id: "rf1-el1",
        label: "Sender ID: 'VK-SBI-SECURE'",
        section: "sender",
        displayText: "FROM: VK-SBI-SECURE",
        isRedFlag: true,
        threatType: "Spoofed / Non-Standard Sender ID",
        rationale: "Official Indian bank transactional SMS headers follow strict 6-character DGT formats like 'AX-SBIINB' or 'VM-HDFCBK'. 'VK-SBI-SECURE' is an unregistered synthetic header designed to trick unsuspecting customers."
      },
      {
        id: "rf1-el2",
        label: "Greeting: 'Dear Valued Customer'",
        section: "greeting",
        displayText: "Dear Valued Customer,",
        isRedFlag: false,
        rationale: "While impersonal greetings are common in spam, standard automated bank notifications often use generic greetings. This alone is not an actionable red flag."
      },
      {
        id: "rf1-el3",
        label: "Urgency Threat: 'Account permanently frozen in 2 hours'",
        section: "body",
        displayText: "Your NetBanking access has been flagged for suspicious overseas activity and will be PERMANENTLY BLOCKED within 2 hours.",
        isRedFlag: true,
        threatType: "Manufactured Panic & Time Compression",
        rationale: "Banks follow regulatory notice periods and do not arbitrarily issue 2-hour permanent account cancellation threats via SMS. This is designed to incite fear and prevent rational thinking."
      },
      {
        id: "rf1-el4",
        label: "Phishing Link: 'https://sbi.net-banking-kyc.xyz/verify'",
        section: "link",
        displayText: "Verify your identity immediately: https://sbi.net-banking-kyc.xyz/verify",
        isRedFlag: true,
        threatType: "Typosquatting & Deceptive .xyz TLD",
        rationale: "The domain 'sbi.net-banking-kyc.xyz' uses 'sbi' as a deceptive subdomain while the true parent domain is 'net-banking-kyc.xyz' registered on a cheap high-risk top-level domain (.xyz). Official SBI NetBanking is strictly hosted at onlinesbi.sbi."
      },
      {
        id: "rf1-el5",
        label: "Personal Manager Contact: '+91-98210-99881'",
        section: "body",
        displayText: "For assistance, call Bank Fraud Manager Mr. Gupta at +91-98210-99881.",
        isRedFlag: true,
        threatType: "Imposter Direct Phone Channel",
        rationale: "Banks direct customers to official 1800 toll-free helplines, never to personal 10-digit mobile numbers belonging to individual 'managers'."
      },
      {
        id: "rf1-el6",
        label: "Regulatory Footer: 'State Bank of India • Central Office Mumbai'",
        section: "footer",
        displayText: "State Bank of India • Central Office Mumbai",
        isRedFlag: false,
        rationale: "Text copying real bank corporate address is boilerplate mimicry used in many messages; it's benign text, not the active deception vehicle."
      }
    ]
  },
  {
    id: "rf1-02",
    title: "Express Customs Detention Notification (Email)",
    subtitle: "Identify the hidden fraud indicators inside this logistics dispatch notice.",
    category: "Courier Phishing & Malware",
    artifactType: "email",
    description: "An email notice alleging your international parcel is detained at Mumbai Customs. Tap every element you consider a scam red flag.",
    totalRedFlags: 4,
    elements: [
      {
        id: "rf2-el1",
        label: "Sender Address: 'customs-service@indiapost-clearance.store'",
        section: "sender",
        displayText: "FROM: customs-service@indiapost-clearance.store",
        isRedFlag: true,
        threatType: "Imposter Commercial TLD (.store)",
        rationale: "India Post and Indian Customs operate exclusively on Government of India (.gov.in / .nic.in) domains. Any .store or .com domain claiming to be government customs is fraudulent."
      },
      {
        id: "rf2-el2",
        label: "Subject: 'Notice: Package #IN-99182 Held Pending Duty'",
        section: "greeting",
        displayText: "SUBJECT: Official Notice - Package #IN-99182 Held at Airport Cargo Pending Duty",
        isRedFlag: false,
        rationale: "Formal subject line formatting is standard for logistics notices and is not an inherent red flag on its own."
      },
      {
        id: "rf2-el3",
        label: "Micro-Payment Lure: 'Pay clearance dispatch fee of ₹42.00'",
        section: "body",
        displayText: "To release the consignment for immediate doorstep courier delivery, pay the pending administrative customs clearance fee of ₹42.00.",
        isRedFlag: true,
        threatType: "Low-Friction Credential Harvesting Lure",
        rationale: "The minuscule ₹42 fee disarms the victim's skepticism. The actual goal is to capture credit card number, CVV, and OTP on the fake payment gateway."
      },
      {
        id: "rf2-el4",
        label: "Malware Attachment: 'Customs_Challan_Invoice.apk'",
        section: "attachment",
        displayText: "ATTACHMENT: Customs_Challan_Invoice.apk (3.4 MB)",
        isRedFlag: true,
        threatType: "Trojanized Android Application (.APK)",
        rationale: "Legitimate invoices are delivered as PDF or HTML documents. Distributing an Android application package (.APK) disguised as an invoice is an attempt to install remote-access malware to intercept 2FA OTPs."
      },
      {
        id: "rf2-el5",
        label: "Trust Seal: '100% Verified SSL Secure India Customs Gateway'",
        section: "body",
        displayText: "🛡️ 100% Verified SSL Secure India Customs Gateway - Certified Safe",
        isRedFlag: true,
        threatType: "Counterfeit Trust Badge",
        rationale: "Scammers frequently place fake security seals and shields in emails to create an illusion of safety. Official departments do not embed generic 'SSL certified' claims in email bodies."
      },
      {
        id: "rf2-el6",
        label: "Official Helpline: 'For national cyber queries visit cybercrime.gov.in'",
        section: "footer",
        displayText: "For cybersecurity concerns, visit official portal at https://cybercrime.gov.in",
        isRedFlag: false,
        rationale: "Referencing genuine cybercrime portals is often included by scammers as a double-bluff or is simply legitimate advice."
      }
    ]
  },
  {
    id: "rf1-03",
    title: "Income Tax Department Refund Portal (Web Notice)",
    subtitle: "Inspect the claims and solicitations in this tax refund notice.",
    category: "Government Impersonation",
    artifactType: "portal",
    description: "A webpage banner notification offering an instant tax refund. Tap each element that represents a fraudulent red flag.",
    totalRedFlags: 4,
    elements: [
      {
        id: "rf3-el1",
        label: "Web Address: 'https://incometax.gov-efiling-portal.net/refund'",
        section: "link",
        displayText: "URL: https://incometax.gov-efiling-portal.net/refund",
        isRedFlag: true,
        threatType: "Typosquatted Lookalike Domain",
        rationale: "The official income tax portal is 'eportal.incometax.gov.in'. The fake domain uses hyphenated keywords with a generic .net TLD to deceive casual observers."
      },
      {
        id: "rf3-el2",
        label: "Banner: 'Approved Refund of ₹31,450 Expiring in 24 Hours'",
        section: "body",
        displayText: "Congratulations! An uncollected income tax refund of ₹31,450 for AY 2025-26 has been approved. Claim within 24 hours to avoid lapse.",
        isRedFlag: true,
        threatType: "Artificial Urgency & Financial Lure",
        rationale: "Income tax refunds do not 'expire in 24 hours'. The department credits verified refunds directly to pre-validated bank accounts without requiring emergency claimant intervention."
      },
      {
        id: "rf3-el3",
        label: "Identification Field: 'Enter PAN Card Number & Date of Birth'",
        section: "body",
        displayText: "Field 1: Enter Permanent Account Number (PAN) & Date of Birth",
        isRedFlag: false,
        rationale: "PAN and DOB are standard identifiers on tax portals. Asking for PAN by itself is routine on tax forms, though on this fake site it is part of identity profiling."
      },
      {
        id: "rf3-el4",
        label: "PIN Solicitation: 'Enter ATM Card PIN & CVV for Direct Bank Credit'",
        section: "action",
        displayText: "Field 2: Enter Debit Card Number, Expiry, CVV & 4-Digit ATM PIN for instant IMPS transfer",
        isRedFlag: true,
        threatType: "Critical Credential Theft (ATM PIN / CVV)",
        rationale: "No legitimate organization, bank, or government department EVER asks for your 4-digit ATM PIN online. Receiving funds requires only an Account Number and IFSC, NEVER card credentials or secret PINs."
      },
      {
        id: "rf3-el5",
        label: "Direct Deposit to UPI handle: 'instant-tax-clearance@paytm'",
        section: "action",
        displayText: "Verification Fee: Send ₹50 refundable test amount to: instant-tax-clearance@paytm",
        isRedFlag: true,
        threatType: "Fraudulent Consumer UPI Address",
        rationale: "Government tax authorities do not collect verification charges through consumer UPI handles (@paytm)."
      },
      {
        id: "rf3-el6",
        label: "Footer: 'Income Tax Department, Ministry of Finance, Government of India'",
        section: "footer",
        displayText: "Income Tax Department, Ministry of Finance, Government of India",
        isRedFlag: false,
        rationale: "Standard footer text copied verbatim from the genuine portal."
      }
    ]
  }
];

