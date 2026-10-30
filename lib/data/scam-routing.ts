import { ScamCategoryDetail, ScamCategoryType } from "../types/recovery";
import { ScamAnalysisResult } from "../types";

export const SCAM_CATEGORIES: ScamCategoryDetail[] = [
  {
    id: "banking_upi",
    title: "Banking, UPI & Credit Card Fraud",
    titleHi: "बैंक, यूपीआई एवं क्रेडिट कार्ड धोखाधड़ी",
    iconName: "Landmark",
    badge: "Financial Cybercrime",
    badgeHi: "वित्तीय साइबर अपराध",
    shortDescription:
      "Unauthorized bank debits, fake KYC verification links, deceptive UPI collect requests, OTP theft, and cloned ATM/Credit cards.",
    shortDescriptionHi:
      "अनाधिकृत बैंक ट्रांसफर, फर्जी केवाईसी लिंक, फर्जी यूपीआई पेमेंट रिक्वेस्ट, ओटीपी चोरी और क्रेडिट कार्ड क्लोनिंग।",
    legalReality:
      "Under RBI Circular on Customer Liability (DBR.No.Leg.BC.78/09.07.005/2017-18), zero liability applies if unauthorized transactions occur due to bank negligence or third-party breaches reported to the bank within 3 working days.",
    legalRealityHi:
      "आरबीआई के नियमों के अनुसार यदि आप अनधिकृत कटौती की सूचना 3 कार्य दिवसों के भीतर अपने बैंक को देते हैं, तो ग्राहक की देयता शून्य अथवा सीमित होती है।",
    urgentGoldenHourNote:
      "CRITICAL GOLDEN HOUR: Dial 1930 within the first 2-3 hours of an unauthorized debit. CFCFRMS can place an immediate interbank lien/hold on the recipient scammer account before money is laundered across mule accounts.",
    urgentGoldenHourNoteHi:
      "गोल्डन ऑवर चेतावनी: पैसे कटने के 2-3 घंटे के भीतर 1930 पर कॉल करें। अंतर-बैंक प्रणाली से जालसाज के खाते में पैसे तुरंत होल्ड किए जा सकते हैं।",
    primaryAuthorityIds: ["cybercrime_gov"],
    secondaryAuthorityIds: ["rbi_cms"],
    immediateSteps: [
      {
        id: "step-bank-block",
        title: "Block Cards & Freeze NetBanking Instantly",
        titleHi: "अपने कार्ड और नेटबैंकिंग को तुरंत ब्लॉक करें",
        detail:
          "Open your official mobile banking app or call your bank's 24/7 emergency toll-free number. Immediately block compromised debit/credit cards and temporarily disable UPI access on that account.",
        detailHi:
          "अपने बैंक के आपातकालीन नंबर पर कॉल करके अथवा मोबाइल ऐप से अपने एटीएम कार्ड, क्रेडिट कार्ड और यूपीआई सेवाओं को तुरंत बंद करें।",
        critical: true,
      },
      {
        id: "step-dial-1930",
        title: "Dial 1930 (National Cyber Financial Fraud Helpline)",
        titleHi: "1930 पर तुरंत कॉल करें (राष्ट्रीय साइबर हेल्पलाइन)",
        detail:
          "Dial 1930 immediately. Tell the officer your bank account number, debit timestamp, exact amount, and the UTR/Reference ID from the debit SMS. Keep your phone on to receive the complaint SMS ticket.",
        detailHi:
          "1930 पर कॉल करें। अधिकारी को अपना खाता नंबर, पैसे कटने का समय, राशि और बैंक एसएमएस में आया UTR नंबर बताएं।",
        critical: true,
      },
      {
        id: "step-file-portal",
        title: "File Formal Complaint on cybercrime.gov.in",
        titleHi: "cybercrime.gov.in पर औपचारिक रिपोर्ट दर्ज करें",
        detail:
          "Visit https://cybercrime.gov.in within 24 hours. Submit bank statements, SMS screenshots, and scammer details. Note down the NCRP Acknowledgement Number.",
        detailHi:
          "24 घंटे में cybercrime.gov.in पर जाकर बैंक स्टेटमेंट और एसएमएस के स्क्रीनशॉट अपलोड कर औपचारिक शिकायत पूरी करें।",
        critical: true,
      },
      {
        id: "step-bank-written",
        title: "Submit Written Dispute Letter to Home Branch",
        titleHi: "बैंक शाखा में लिखित शिकायत और पावती जमा करें",
        detail:
          "Visit your home bank branch with a copy of the Cybercrime Acknowledgement. Submit a formal written dispute letter claiming zero/limited liability under RBI rules. Demand a stamped acknowledgement receipt.",
        detailHi:
          "साइबर क्राइम पावती के साथ बैंक शाखा में जाएं और लिखित में शिकायत दर्ज करवाकर बैंक से मोहर लगी रिसीविंग कॉपी अवश्य लें।",
        critical: false,
      },
      {
        id: "step-rbi-escalate",
        title: "Escalate to RBI CMS if Unresolved in 30 Days",
        titleHi: "30 दिन में समाधान न मिलने पर RBI CMS पर शिकायत करें",
        detail:
          "If the bank rejects your dispute or fails to provide a resolution within 30 days, file an online appeal with the RBI Banking Ombudsman on https://cms.rbi.org.in referencing your bank complaint number.",
        detailHi:
          "यदि बैंक 30 दिनों में उचित समाधान नहीं देता है, तो cms.rbi.org.in पर आरबीआई बैंकिंग लोकपाल के समक्ष अपील दर्ज करें।",
        critical: false,
      },
    ],
    evidenceChecklist: [
      { id: "ev-utr", label: "Transaction ID / UTR number from bank SMS", labelHi: "बैंक एसएमएस से मिला UTR / ट्रांजैक्शन नंबर", required: true },
      { id: "ev-stmt", label: "Bank Account Statement showing unauthorized debit", labelHi: "बैंक स्टेटमेंट (कटौती दर्शाने वाला)", required: true },
      { id: "ev-sms", label: "Screenshot of fake KYC or debit SMS with sender header", labelHi: "संदिग्ध एसएमएस या लिंक का स्क्रीनशॉट", required: true },
      { id: "ev-upi", label: "Scammer UPI handle or beneficiary account number", labelHi: "जालसाज की यूपीआई आईडी या खाता नंबर", required: false },
      { id: "ev-id", label: "Aadhaar / PAN card for identity verification", labelHi: "शिकायतकर्ता का आधार / पैन कार्ड", required: true },
    ],
  },
  {
    id: "digital_arrest",
    title: "Digital Arrest & Police / CBI Impersonation",
    titleHi: "डिजिटल अरेस्ट एवं पुलिस / सीबीआई का फर्जी डर",
    iconName: "ShieldAlert",
    badge: "Extortion / Impersonation",
    badgeHi: "जबरन वसूली / धमकी",
    shortDescription:
      "Scammers posing as Police, CBI, ED, Narcotics Control Bureau, Customs, or Supreme Court judges on Skype/WhatsApp video calls claiming you are under 'Digital Arrest'.",
    shortDescriptionHi:
      "सीबीआई, नारकोटिक्स, पुलिस या कस्टम्स अधिकारी बनकर वीडियो कॉल पर 'डिजिटल अरेस्ट' का डर दिखाकर पैसे ऐंठने का गिरोह।",
    legalReality:
      "LEGAL TRUTH: 'Digital Arrest' DOES NOT EXIST in Indian criminal law (CrPC / Bharatiya Nagarik Suraksha Sanhita). No law enforcement agency or court in India conducts interrogations or arrests over Skype, WhatsApp, or Google Meet. Demanding money for 'clearance' or 'RBI verification' is 100% extortion.",
    legalRealityHi:
      "कानूनी सच्चाई: भारतीय कानून में 'डिजिटल अरेस्ट' नाम की कोई प्रक्रिया नहीं है। कोई भी पुलिस, सीबीआई या अदालत व्हाट्सएप/स्काइप पर गिरफ्तारी या पूछताछ नहीं करती। पैसे मांगना पूरी तरह गैरकानूनी ब्लैकमेलिंग है।",
    urgentGoldenHourNote:
      "DO NOT TRANSFER ANY MONEY. If you already transferred funds under coercion, dial 1930 IMMEDIATELY to trigger bank account freeze on the mule accounts.",
    urgentGoldenHourNoteHi:
      "किसी भी खाते में पैसे ट्रांसफर न करें। यदि डर के कारण पैसे ट्रांसफर कर दिए हैं, तो तुरंत 1930 पर कॉल करें।",
    primaryAuthorityIds: ["cybercrime_gov", "sanchar_saathi"],
    secondaryAuthorityIds: [],
    immediateSteps: [
      {
        id: "step-hang-up",
        title: "Disrupt the Call Immediately (Disconnect & Block)",
        titleHi: "कॉल तुरंत काटें और नंबर ब्लॉक करें",
        detail:
          "Hang up the Skype/WhatsApp call right away. DO NOT stay on video. Scammers use psychological isolation to prevent you from speaking to family or actual lawyers. You are in NO real physical danger.",
        detailHi:
          "वीडियो कॉल तुरंत काट दें। धोखेबाज आपको अकेला रखने की कोशिश करते हैं ताकि आप किसी से बात न कर सकें। शांत रहें, कोई खतरा नहीं है।",
        critical: true,
      },
      {
        id: "step-no-money",
        title: "NEVER Transfer Funds into 'Secret RBI Verification Accounts'",
        titleHi: "तथाकथित 'आरबीआई वेरिफिकेशन' खातों में कभी पैसे न भेजें",
        detail:
          "Law enforcement NEVER demands payments into 'safe government custody accounts'. Any request to RTGS/NEFT money to avoid jail is a criminal scam.",
        detailHi:
          "कानून प्रवर्तन एजेंसियां कभी भी सत्यापन के नाम पर बैंक ट्रांसफर नहीं मांगतीं। यह पूरी तरह जालसाजी है।",
        critical: true,
      },
      {
        id: "step-call-1930",
        title: "Dial 1930 Immediately if Money Was Sent",
        titleHi: "पैसे भेज दिए हों तो तुरंत 1930 पर कॉल करें",
        detail:
          "If you were intimidated into sending money, dial 1930 at once with transaction UTR numbers to hold funds before scammers withdraw.",
        detailHi:
          "पैसे ट्रांसफर होते ही तुरंत 1930 पर कॉल कर UTR नंबर नोट कराएं ताकि फंड्स फ्रीज हो सकें।",
        critical: true,
      },
      {
        id: "step-report-police",
        title: "Visit Nearest Police Station or Local Cyber Cell",
        titleHi: "नजदीकी पुलिस थाने या साइबर सेल में संपर्क करें",
        detail:
          "Walk into your local police station or district cyber crime police station. Bring all screenshots of fake warrants, officer badges, and call logs. Police will verify the fraud and provide immediate security assurance.",
        detailHi:
          "अपने नजदीकी पुलिस स्टेशन या जिला साइबर सेल में जाएं। फर्जी वारंट और कॉल लॉग के स्क्रीनशॉट दिखाकर लिखित शिकायत दें।",
        critical: false,
      },
      {
        id: "step-chakshu-report",
        title: "Report Numbers to DoT Chakshu (sancharsaathi.gov.in)",
        titleHi: "दूरसंचार विभाग के चक्षु पोर्टल पर नंबर रिपोर्ट करें",
        detail:
          "Submit the scammer's calling phone numbers and Skype/WhatsApp details on DoT Chakshu to have their SIM cards disconnected and phones blacklisted nationwide.",
        detailHi:
          "sancharsaathi.gov.in पर जाकर चक्षु सुविधा में जालसाज के नंबर रिपोर्ट करें ताकि उनके सिम ब्लॉक किए जा सकें।",
        critical: false,
      },
    ],
    evidenceChecklist: [
      { id: "ev-da-ss", label: "Screenshots of fake arrest warrants, CBI letters, or police badges", labelHi: "फर्जी अरेस्ट वारंट, सीबीआई लेटर या पुलिस आईडी का स्क्रीनशॉट", required: true },
      { id: "ev-da-nums", label: "Caller phone numbers, Skype IDs, or WhatsApp handles", labelHi: "जालसाज का फोन नंबर, स्काइप आईडी या व्हाट्सएप नंबर", required: true },
      { id: "ev-da-bank", label: "Bank account details provided by the scammers for funds transfer", labelHi: "जालसाज द्वारा पैसे ट्रांसफर हेतु दिया गया बैंक खाता", required: false },
      { id: "ev-da-trans", label: "UTR number and transfer receipts if money was transferred", labelHi: "पैसे ट्रांसफर होने का UTR नंबर और रसीद (यदि ट्रांसफर हुआ हो)", required: false },
    ],
  },
  {
    id: "investment_trading",
    title: "Investment, Trading & Ponzi Schemes",
    titleHi: "फर्जी शेयर बाजार, ट्रेडिंग एवं पोंजी स्कीम घोटाला",
    iconName: "TrendingUp",
    badge: "Securities Fraud",
    badgeHi: "प्रतिभूति धोखाधड़ी",
    shortDescription:
      "Fake WhatsApp VIP investment groups, rigged trading APK apps, guaranteed 500% profit schemes, and unauthorized forex/crypto deposit traps.",
    shortDescriptionHi:
      "व्हाट्सएप/टेलीग्राम ट्रेडिंग ग्रुप, फर्जी शेयर मार्केट ऐप (APK), भारी रिटर्न का लालच और विदेशी मुद्रा/क्रिप्टो निवेश जाल।",
    legalReality:
      "Criminal vs Regulatory: Over 90% of WhatsApp/Telegram trading apps are operated by unlicensed syndicates. They fabricate fake balance dashboards. If the entity is completely unlicensed, it is a criminal cyber fraud (report to 1930). If it is a registered stockbroker committing malpractice, report to SEBI SCORES.",
    legalRealityHi:
      "अपराधिक बनाम नियामक: 90% से अधिक व्हाट्सएप ट्रेडिंग ऐप पूरी तरह अवैध होते हैं जो फर्जी मुनाफा दिखाते हैं। अवैध ऐप्स की रिपोर्ट 1930 पर करें, जबकि पंजीकृत ब्रोकर्स की शिकायत SEBI SCORES पर दर्ज होती है।",
    urgentGoldenHourNote:
      "NEVER pay 'withdrawal taxes' or 'processing fees' to release your profits. This is the secondary extraction trap; you will never get funds back by paying extra.",
    urgentGoldenHourNoteHi:
      "सावधानी: मुनाफा निकालने के नाम पर 'टैक्स' या 'फीस' के बहाने और पैसे कभी न भेजें। यह पैसे ऐंठने का अगला पैंतरा है।",
    primaryAuthorityIds: ["cybercrime_gov"],
    secondaryAuthorityIds: ["sebi_scores"],
    immediateSteps: [
      {
        id: "step-stop-deposit",
        title: "Stop All Further Deposits Immediately",
        titleHi: "तुरंत और पैसे जमा करना बंद करें",
        detail:
          "Do NOT send another rupee under any pretext (e.g., '20% capital gains tax', 'VIP unlocking fee', or 'SEBI clearance fee'). These are secondary extortion traps.",
        detailHi:
          "विड्रॉल फीस या टैक्स के नाम पर एक भी रुपया और न भेजें। यह पूरी तरह जालसाजी है।",
        critical: true,
      },
      {
        id: "step-report-1930",
        title: "Dial 1930 & File Cyber Crime Complaint",
        titleHi: "1930 पर कॉल करें और साइबर क्राइम पोर्टल पर दर्ज करें",
        detail:
          "Lodge a complaint on https://cybercrime.gov.in and dial 1930. Provide all beneficiary bank accounts / UPI IDs where you deposited money.",
        detailHi:
          "1930 पर कॉल करें और cybercrime.gov.in पर उन सभी बैंक खातों और यूपीआई आईडी की सूची दें जहां आपने पैसे भेजे थे।",
        critical: true,
      },
      {
        id: "step-check-sebi",
        title: "Check SEBI Intermediary Registry",
        titleHi: "सेबी की वेबसाइट पर ब्रोकर का पंजीकरण जांचें",
        detail:
          "Visit https://www.sebi.gov.in to verify if the entity is registered. If they falsely used the name of a genuine institution (e.g. Goldman Sachs, Morgan Stanley, Kotak Securities), report to SEBI Investor Vigilance.",
        detailHi:
          "जांचें कि क्या संस्था सेबी पंजीकृत है। यदि किसी नामी संस्था का नाम चुराकर फर्जी ऐप चलाया गया, तो सेबी को भी सतर्क करें।",
        critical: false,
      },
      {
        id: "step-sebi-scores",
        title: "File on SEBI SCORES if Registered Intermediary",
        titleHi: "पंजीकृत ब्रोकर होने की स्थिति में SEBI SCORES पर शिकायत करें",
        detail:
          "If the fraud involved a genuine registered stockbroker, Depository Participant, or Research Analyst violating rules, file a formal dispute on https://scores.sebi.gov.in.",
        detailHi:
          "यदि वास्तविक सेबी पंजीकृत ब्रोकर ने अनियमितता की है, तो scores.sebi.gov.in पर औपचारिक केस दर्ज करें।",
        critical: false,
      },
    ],
    evidenceChecklist: [
      { id: "ev-inv-ledger", label: "Bank transfer statements / UPI UTRs for all deposited amounts", labelHi: "पैसे जमा कराने वाले सभी बैंक स्टेटमेंट और UTR नंबर", required: true },
      { id: "ev-inv-chat", label: "Full chat export of WhatsApp / Telegram trading group conversations", labelHi: "व्हाट्सएप या टेलीग्राम ग्रुप चैट का पूरा एक्सपोर्ट या स्क्रीनशॉट", required: true },
      { id: "ev-inv-apk", label: "Screenshots of fake trading dashboard showing balance and withdrawal denials", labelHi: "फर्जी ट्रेडिंग ऐप के डैशबोर्ड और विड्रॉल एरर का स्क्रीनशॉट", required: true },
      { id: "ev-inv-admin", label: "Phone numbers and usernames of group admins and 'mentors'", labelHi: "ग्रुप एडमिन और तथाकथित 'प्रोफेसर / मेंटर' के फोन नंबर", required: true },
    ],
  },
  {
    id: "shopping_courier",
    title: "Online Shopping, Courier & Delivery Scams",
    titleHi: "ऑनलाइन शॉपिंग, कूरियर एवं डिलीवरी फ्रॉड",
    iconName: "Package",
    badge: "Consumer & Courier Fraud",
    badgeHi: "उपभोक्ता एवं कूरियर धोखा",
    shortDescription:
      "Fake parcel non-delivery SMS (India Post, BlueDart, FedEx), ₹5 address update fee leading to bank drain, and fraudulent e-commerce storefronts.",
    shortDescriptionHi:
      "पार्सल डिलीवरी फेल होने का फर्जी एसएमएस (इंडिया पोस्ट/ब्लू डार्ट), ₹5 री-शेड्यूल फीस के नाम पर फोन हैक करना और फर्जी शॉपिंग वेबसाइट्स।",
    legalReality:
      "Two distinct tracks: (1) Defective product / genuine merchant dispute goes to National Consumer Helpline (NCH 1915). (2) Fake courier APK / phishing link that drains your bank is criminal cyber fraud (1930).",
    legalRealityHi:
      "दो अलग-अलग कानूनी रास्ते: (1) असली कंपनी से सामान न मिलने या खराब आने पर उपभोक्ता हेल्पलाइन (1915) पर जाएं। (2) कूरियर के नाम पर फर्जी लिंक से बैंक खाली होने पर साइबर पुलिस (1930) पर जाएं।",
    urgentGoldenHourNote:
      "If you installed an APK file sent via WhatsApp for parcel tracking, your phone is compromised with remote malware. Turn off Wi-Fi/Mobile Data immediately and uninstall the app.",
    urgentGoldenHourNoteHi:
      "यदि आपने कूरियर के नाम पर कोई APK फाइल डाउनलोड की है, तो तुरंत फोन का इंटरनेट बंद करें और बैंक ऐप अनइंस्टॉल करें।",
    primaryAuthorityIds: ["cybercrime_gov"],
    secondaryAuthorityIds: ["consumer_helpline"],
    immediateSteps: [
      {
        id: "step-disconnect-net",
        title: "Disconnect Phone Data if APK Was Installed",
        titleHi: "यदि कोई संदिग्ध ऐप डाउनलोड किया तो फोन का डेटा तुरंत बंद करें",
        detail:
          "Turn on Airplane Mode immediately. Fraudulent courier links frequently install SMS-forwarding or screen-sharing trojans to steal bank OTPs in the background.",
        detailHi:
          "फोन को तुरंत एयरप्लेन मोड में डालें। फर्जी कूरियर लिंक फोन में मैलवेयर डालकर एसएमएस ओटीपी चुरा लेते हैं।",
        critical: true,
      },
      {
        id: "step-block-bank",
        title: "Freeze Bank Accounts & Dial 1930 if Money Deducted",
        titleHi: "बैंक खाता ब्लॉक करें और 1930 पर कॉल करें",
        detail:
          "If paying a nominal ₹5 address fee led to unauthorized debits of thousands, dial 1930 immediately and block your netbanking.",
        detailHi:
          "यदि ₹5 फीस के बहाने खाते से बड़ी रकम कट गई, तो तुरंत 1930 पर कॉल करें और बैंक को सूचित करें।",
        critical: true,
      },
      {
        id: "step-nch-complaint",
        title: "File on National Consumer Helpline (NCH) for Merchant Disputes",
        titleHi: "असली कंपनी के विवाद हेतु राष्ट्रीय उपभोक्ता हेल्पलाइन पर जाएं",
        detail:
          "If the issue is an authentic registered shopping company refusing to deliver or refund, dial 1915 or register on https://consumerhelpline.gov.in.",
        detailHi:
          "यदि मामला किसी रजिस्टर्ड शॉपिंग कंपनी द्वारा सामान न देने या रिफंड रोकने का है, तो 1915 पर कॉल करें।",
        critical: false,
      },
    ],
    evidenceChecklist: [
      { id: "ev-shop-sms", label: "SMS text with tracking link and sender header (e.g. AX-INDPOST)", labelHi: "ट्रैकिंग लिंक और सेंडर आईडी वाला एसएमएस", required: true },
      { id: "ev-shop-url", label: "Phishing website URL (do NOT click again)", labelHi: "फर्जी वेबसाइट का यूआरएल (दोबारा न खोलें)", required: true },
      { id: "ev-shop-utr", label: "Bank debit statement and UTR number", labelHi: "बैंक कटौती विवरण और UTR नंबर", required: false },
      { id: "ev-shop-invoice", label: "Invoice / Order confirmation if genuine merchant dispute", labelHi: "खरीद इनवॉइस / ऑर्डर रसीद (उपभोक्ता विवाद हेतु)", required: false },
    ],
  },
  {
    id: "social_identity",
    title: "Social Media Hacking & Identity Theft",
    titleHi: "सोशल मीडिया हैकिंग एवं पहचान की चोरी",
    iconName: "UserX",
    badge: "Identity Theft & Account Takeover",
    badgeHi: "पहचान चोरी एवं प्रोफाइल हैकिंग",
    shortDescription:
      "Hacked Instagram, WhatsApp, or Facebook profiles; impersonation accounts asking your friends for emergency money; and compromised Google accounts.",
    shortDescriptionHi:
      "इंस्टाग्राम, व्हाट्सएप या फेसबुक अकाउंट हैक होना, आपके नाम से दोस्तों से पैसे मांगना और ईमेल आईडी पर अनधिकृत कब्जा।",
    legalReality:
      "Platform recovery is handled by Meta/Google automated security workflows. However, if the hacker is using your identity to solicit money or extort contacts, this constitutes criminal identity theft under Section 66C and 66D of the IT Act 2000.",
    legalRealityHi:
      "अकाउंट की रिकवरी सोशल मीडिया प्लेटफॉर्म द्वारा होती है। लेकिन यदि हैकर आपके नाम से पैसे मांग रहा है, तो यह आईटी एक्ट की धारा 66C और 66D के तहत गंभीर अपराध है जिसकी पुलिस शिकायत आवश्यक है।",
    urgentGoldenHourNote:
      "Alert your family and friends via phone/status immediately that your profile is compromised and NOT to send any money to requests originating from your handle.",
    urgentGoldenHourNoteHi:
      "तुरंत अपने परिवार और दोस्तों को कॉल करके या अन्य माध्यम से सूचित करें कि आपका अकाउंट हैक हो गया है और कोई भी पैसे न भेजे।",
    primaryAuthorityIds: ["meta_recovery", "google_recovery"],
    secondaryAuthorityIds: ["cybercrime_gov"],
    immediateSteps: [
      {
        id: "step-alert-contacts",
        title: "Broadcast Public Alert to Close Contacts",
        titleHi: "अपने दोस्तों और परिवार को तुरंत सतर्क करें",
        detail:
          "Post on other platforms or message key contacts: 'My Instagram/WhatsApp has been compromised. Do NOT transfer money or share codes to anyone pretending to be me.'",
        detailHi:
          "सभी परिचितों को बताएं कि आपका अकाउंट हैक हो गया है और उनके पास कोई पैसे मांगने का मैसेज आए तो इग्नोर करें।",
        critical: true,
      },
      {
        id: "step-official-recovery",
        title: "Initiate Platform Identity Verification",
        titleHi: "प्लेटफॉर्म की आधिकारिक रिकवरी प्रक्रिया शुरू करें",
        detail:
          "For Instagram visit https://www.instagram.com/hacked; for Facebook visit https://www.facebook.com/hacked. Complete video selfie verification.",
        detailHi:
          "instagram.com/hacked या facebook.com/hacked पर जाएं और वीडियो सेल्फी सत्यापन के जरिए अपना अकाउंट वापस पाएं।",
        critical: true,
      },
      {
        id: "step-secure-email",
        title: "Secure Linked Primary Email & Password",
        titleHi: "अपने ईमेल का पासवर्ड बदलें और 2FA ऑन करें",
        detail:
          "Change your Google/email password. Terminate active sessions in Google Account -> Security -> Your Devices. Enable App-based Authenticator.",
        detailHi:
          "अपने जीमेल का पासवर्ड बदलें और गूगल सिक्योरिटी में जाकर सभी अनजान डिवाइसेज से तुरंत लॉगआउट करें।",
        critical: true,
      },
      {
        id: "step-file-identity-ncrp",
        title: "File Identity Theft on cybercrime.gov.in",
        titleHi: "cybercrime.gov.in पर पहचान चोरी की रिपोर्ट दर्ज करें",
        detail:
          "If the hacker is extorting you or defrauded your friends, file a complaint under 'Cyber Crime Against Women/Children' or 'Financial Fraud / Identity Theft' on the national portal.",
        detailHi:
          "यदि हैकर ब्लैकमेल कर रहा है या दोस्तों से पैसे ऐंठ चुका है, तो cybercrime.gov.in पर पहचान चोरी का मामला दर्ज करें।",
        critical: false,
      },
    ],
    evidenceChecklist: [
      { id: "ev-soc-handle", label: "Compromised account URL / username and profile screenshots", labelHi: "हैक हुए अकाउंट का यूआरएल और प्रोफाइल स्क्रीनशॉट", required: true },
      { id: "ev-soc-chat", label: "Screenshots of hacker demanding ransom or soliciting money from friends", labelHi: "हैकर द्वारा दोस्तों से पैसे मांगने वाले चैट्स के स्क्रीनशॉट", required: true },
      { id: "ev-soc-mail", label: "Security alert emails ('Your email/phone was changed') from Meta/Google", labelHi: "मेटा या गूगल से आए सुरक्षा ईमेल ('ईमेल बदल दिया गया है')", required: true },
      { id: "ev-soc-upi", label: "Payment UPI IDs / QR codes sent by hacker to friends", labelHi: "हैकर द्वारा दोस्तों को भेजे गए यूपीआई आईडी या बैंक खाते", required: false },
    ],
  },
  {
    id: "job_recruitment",
    title: "Job, Employment & Task Scam Fraud",
    titleHi: "नौकरी, टास्क फ्रॉड एवं वर्क-फ्रॉम-होम घोटाला",
    iconName: "Briefcase",
    badge: "Recruitment Fraud",
    badgeHi: "नौकरी घोटाला",
    shortDescription:
      "Telegram 'YouTube like/subscribe' task scams, fake overseas job offers, advance registration fees, and forged appointment letters from reputed MNCs.",
    shortDescriptionHi:
      "टेलीग्राम पर यूट्यूब वीडियो लाइक करके पैसे कमाने का टास्क फ्रॉड, फर्जी वर्क-फ्रॉम-होम और नौकरी के नाम पर रजिस्ट्रेशन फीस वसूली।",
    legalReality:
      "Legitimate companies and top HR consultancies NEVER charge registration fees, laptop security deposits, or background verification charges from candidates. Task scams start by paying ₹200-₹500 to win your trust, then demand ₹50,000+ for 'pre-paid VIP tasks'.",
    legalRealityHi:
      "कानूनी सच्चाई: कोई भी प्रतिष्ठित कंपनी या रिक्रूटर उम्मीदवार से कभी कोई फीस या लैपटॉप सिक्योरिटी नहीं मांगता। टास्क फ्रॉड में पहले ₹200-₹500 देकर भरोसा जीतते हैं, फिर लाखों रुपये ऐंठ लेते हैं।",
    urgentGoldenHourNote:
      "Do NOT pay any 'deposit unlock' to retrieve your frozen earnings. The balance shown on the website is fake numbers generated by the scammers.",
    urgentGoldenHourNoteHi:
      "फर्जी वेबसाइट पर दिख रही कमाई को निकालने के लिए अतिरिक्त पैसे कभी न भरें। वह बैलेंस केवल एक फर्जी स्क्रीन है।",
    primaryAuthorityIds: ["cybercrime_gov"],
    secondaryAuthorityIds: [],
    immediateSteps: [
      {
        id: "step-stop-tasks",
        title: "Cease All Task Transfers & Exit Telegram Group",
        titleHi: "सभी टास्क ट्रांसफर तुरंत रोकें और ग्रुप से बाहर आएं",
        detail:
          "Stop transferring any more money for 'VIP level upgrades' or 'merchant order prepayments'. Block the scam recruiter on Telegram/WhatsApp.",
        detailHi:
          "अगले टास्क या लेवल अपग्रेड के नाम पर पैसे देना तुरंत बंद करें। टेलीग्राम पर रिक्रूटर को ब्लॉक करें।",
        critical: true,
      },
      {
        id: "step-dial-1930-job",
        title: "Dial 1930 & Lodge NCRP Report",
        titleHi: "तुरंत 1930 पर कॉल करें और साइबर पोर्टल पर शिकायत करें",
        detail:
          "Dial 1930 immediately. Provide all beneficiary bank accounts / UPI IDs where task payments were made to initiate banking freeze.",
        detailHi:
          "1930 पर तुरंत कॉल करें। जिन-जिन बैंक खातों में आपने टास्क के पैसे जमा किए, उनकी सूची नोट कराएं।",
        critical: true,
      },
      {
        id: "step-save-job-ads",
        title: "Export All Job Ads & Recruiter Credentials",
        titleHi: "नौकरी के विज्ञापन और चैट का पूरा रिकॉर्ड सुरक्षित करें",
        detail:
          "Export full WhatsApp/Telegram chats, fake offer letters, payment receipts, and recruiter profiles before they delete the group.",
        detailHi:
          "ग्रुप डिलीट होने से पहले ऑफर लेटर, रिक्रूटर के प्रोफाइल और सभी पेमेंट ट्रांजैक्शन रसीदें सेव कर लें।",
        critical: false,
      },
      {
        id: "step-emigrate",
        title: "Check MEA eMigrate for Overseas Job Offers",
        titleHi: "विदेश में नौकरी के लिए विदेश मंत्रालय (eMigrate) पर जांचें",
        detail:
          "For overseas jobs, check if the recruiting agent is registered on the Ministry of External Affairs portal https://emigrate.gov.in. Unregistered agents are illegal.",
        detailHi:
          "विदेश में नौकरी के लिए emigrate.gov.in पर जांचें कि एजेंट रजिस्टर्ड है या नहीं। अवैध एजेंटों की शिकायत पुलिस को दें।",
        critical: false,
      },
    ],
    evidenceChecklist: [
      { id: "ev-job-chat", label: "Telegram / WhatsApp chat history with the fake recruiter", labelHi: "टेलीग्राम या व्हाट्सएप पर हुई पूरी बातचीत", required: true },
      { id: "ev-job-letter", label: "Forged job appointment letter or task guidelines document", labelHi: "फर्जी नियुक्ति पत्र या टास्क नियम पत्र", required: false },
      { id: "ev-job-utr", label: "Bank statements showing all deposits made for 'prepaid tasks'", labelHi: "टास्क के नाम पर जमा किए गए सभी बैंक ट्रांसफर UTR", required: true },
      { id: "ev-job-site", label: "Website URL of the fake task portal / merchant dashboard", labelHi: "फर्जी टास्क पोर्टल का वेबसाइट लिंक", required: true },
    ],
  },
  {
    id: "other",
    title: "Lottery, Matrimonial & Other Cyber Frauds",
    titleHi: "लॉटरी, वैवाहिक एवं अन्य ऑनलाइन धोखाधड़ी",
    iconName: "HelpCircle",
    badge: "General Cybercrime",
    badgeHi: "सामान्य साइबर अपराध",
    shortDescription:
      "KBC lottery fraud, matrimonial / romance scams, fake electricity bill disconnect notices, and extortion.",
    shortDescriptionHi:
      "केबीसी लॉटरी, वैवाहिक धोखाधड़ी, बिजली बिल काटने की धमकी और जबरन वसूली।",
    legalReality:
      "Any demand for money accompanied by threats of utility disconnections, fake prize processing fees, or relationship manipulation should be reported immediately to cybercrime authorities.",
    legalRealityHi:
      "किसी भी प्रकार की धमकी, लॉटरी का लालच या बिजली कनेक्शन काटने की चेतावनी के तहत पैसे मांगना गैरकानूनी है।",
    urgentGoldenHourNote:
      "If you transferred funds, dial 1930 immediately to protect your money.",
    urgentGoldenHourNoteHi:
      "यदि पैसे ट्रांसफर किए हैं, तो तुरंत 1930 पर कॉल करें।",
    primaryAuthorityIds: ["cybercrime_gov"],
    secondaryAuthorityIds: [],
    immediateSteps: [
      {
        id: "step-stop-other",
        title: "Do Not Send Any Fees or Customs Charges",
        titleHi: "कोई भी प्रोसेसिंग फीस या कस्टम्स चार्ज न दें",
        detail:
          "Do not pay 'customs clearance', 'prize processing charges', or 'gift taxes'. Government and utility providers never demand UPI transfers to personal numbers.",
        detailHi:
          "किसी भी इनाम या पार्सल के नाम पर पैसे न दें। सरकारी विभाग कभी व्यक्तिगत यूपीआई पर पैसे नहीं मांगते।",
        critical: true,
      },
      {
        id: "step-1930-other",
        title: "Dial 1930 & File on cybercrime.gov.in",
        titleHi: "1930 पर कॉल करें और cybercrime.gov.in पर रिपोर्ट करें",
        detail:
          "File a comprehensive complaint on the National Cyber Crime Reporting Portal with all scammer details and communication records.",
        detailHi:
          "राष्ट्रीय साइबर अपराध पोर्टल पर सभी सबूतों के साथ औपचारिक शिकायत दर्ज करें।",
        critical: true,
      },
    ],
    evidenceChecklist: [
      { id: "ev-oth-msg", label: "Screenshots of fake lottery letters, disconnect SMS, or matrimonial chats", labelHi: "फर्जी लॉटरी पत्र, बिजली एसएमएस या चैट के स्क्रीनशॉट", required: true },
      { id: "ev-oth-contact", label: "Phone numbers, emails, and bank accounts of scammers", labelHi: "जालसाज का फोन, ईमेल और बैंक विवरण", required: true },
      { id: "ev-oth-utr", label: "UTR number and bank transaction receipts if money was debited", labelHi: "पैसे कटने का UTR नंबर और बैंक रसीद", required: false },
    ],
  },
];

// Map a scan result from the detection engine to a recommended victim category
export function mapAnalysisResultToCategory(result: ScamAnalysisResult): ScamCategoryType {
  const textLower = result.inputText.toLowerCase();

  // Check for Digital Arrest
  if (
    textLower.includes("digital arrest") ||
    textLower.includes("cbi") ||
    textLower.includes("police warrant") ||
    textLower.includes("narcotics") ||
    textLower.includes("customs seizure") ||
    result.heuristicHits.some((h) => h.id.includes("fear-digital-arrest") || h.id.includes("cbi"))
  ) {
    return "digital_arrest";
  }

  // Check for Banking / UPI / KYC
  if (
    result.impersonation?.entityCategory === "bank" ||
    textLower.includes("kyc") ||
    textLower.includes("sbi") ||
    textLower.includes("hdfc") ||
    textLower.includes("icici") ||
    textLower.includes("netbanking") ||
    textLower.includes("pan update") ||
    textLower.includes("account block") ||
    result.heuristicHits.some((h) => h.id.includes("cred-") || h.id.includes("upi-"))
  ) {
    return "banking_upi";
  }

  // Check for Investment / Trading
  if (
    textLower.includes("trading") ||
    textLower.includes("investment") ||
    textLower.includes("vip group") ||
    textLower.includes("stock tips") ||
    textLower.includes("crypto") ||
    textLower.includes("profit daily") ||
    textLower.includes("ipo allotment")
  ) {
    return "investment_trading";
  }

  // Check for Shopping / Courier
  if (
    result.impersonation?.entityCategory === "courier" ||
    textLower.includes("courier") ||
    textLower.includes("parcel") ||
    textLower.includes("india post") ||
    textLower.includes("bluedart") ||
    textLower.includes("delhivery") ||
    textLower.includes("address update")
  ) {
    return "shopping_courier";
  }

  // Check for Job / Recruitment
  if (
    textLower.includes("job") ||
    textLower.includes("recruitment") ||
    textLower.includes("part time") ||
    textLower.includes("youtube like") ||
    textLower.includes("daily salary") ||
    textLower.includes("telegram task") ||
    textLower.includes("work from home")
  ) {
    return "job_recruitment";
  }

  // Check for Social Media / Hacking
  if (
    textLower.includes("instagram") ||
    textLower.includes("facebook") ||
    textLower.includes("whatsapp code") ||
    textLower.includes("hacked") ||
    textLower.includes("vote for me")
  ) {
    return "social_identity";
  }

  return "banking_upi";
}

