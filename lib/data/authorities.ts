import { AuthorityInfo } from "../types/recovery";

export const OFFICIAL_AUTHORITIES: AuthorityInfo[] = [
  {
    id: "cybercrime_gov",
    name: "National Cyber Crime Reporting Portal (NCRP & 1930)",
    nameHi: "राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल (1930)",
    category: "cybercrime",
    description:
      "India's nodal portal under the Ministry of Home Affairs (I4C) for reporting all cybercrimes, especially online financial frauds.",
    descriptionHi:
      "गृह मंत्रालय (I4C) के तहत ऑनलाइन वित्तीय धोखाधड़ी और सभी साइबर अपराधों की रिपोर्ट दर्ज करने का आधिकारिक राष्ट्रीय पोर्टल।",
    whyContact:
      "Primary authority for filing an official cyber fraud police complaint and activating the Citizen Financial Cyber Fraud Reporting and Management System (CFCFRMS) to freeze stolen money in transit across banks.",
    whyContactHi:
      "आधिकारिक साइबर अपराध शिकायत दर्ज करने और बैंक खातों में धोखेबाजों द्वारा चुराए गए पैसों को तुरंत फ्रीज कराने का मुख्य सरकारी माध्यम।",
    officialWebsite: "https://cybercrime.gov.in",
    phoneHelpline: "1930",
    operatingHours: "24x7 Toll-Free National Emergency Line",
    operatingHoursHi: "24x7 राष्ट्रीय आपातकालीन हेल्पलाइन",
    requiredDocuments: [
      "Bank Account statement / UTR transaction receipts",
      "Exact Date & Time of unauthorized debits",
      "Scammer's phone numbers, UPI IDs, or account numbers",
      "Screenshots of SMS, WhatsApp chats, or phishing URLs",
      "Government Photo ID proof (Aadhaar / PAN / Voter ID) for verification",
    ],
    requiredDocumentsHi: [
      "बैंक स्टेटमेंट / UTR ट्रांजैक्शन रसीद",
      "पैसे कटने की सही तारीख और समय",
      "धोखेबाज का मोबाइल नंबर, UPI ID या बैंक खाता नंबर",
      "संदिग्ध SMS, व्हाट्सएप चैट या फिशिंग लिंक के स्क्रीनशॉट",
      "शिकायतकर्ता का सरकारी पहचान पत्र (आधार / पैन)",
    ],
    stepByStepGuide: [
      "Dial 1930 IMMEDIATELY if money was debited within the last few hours (Golden Hour).",
      "Provide caller with victim account number, transaction ID (UTR), debit time, and scammer UPI/account.",
      "A ticket SMS with an Acknowledgement Number will be dispatched to your registered phone.",
      "Visit https://cybercrime.gov.in within 24 hours to complete and sign the comprehensive formal complaint with evidence attachments.",
      "Download the PDF acknowledgement for police and bank record.",
    ],
    stepByStepGuideHi: [
      "पैसे कटते ही सबसे पहले 1930 पर तुरंत कॉल करें (गोल्डन ऑवर में पैसे फ्रीज होने की संभावना सबसे ज्यादा होती है)।",
      "अधिकारी को अपना बैंक खाता, UTR नंबर, कटौती का समय और जालसाज का खाता विवरण दें।",
      "आपके फोन पर एक शिकायत पावती संख्या (Acknowledgement Number) का SMS आएगा।",
      "24 घंटे के भीतर cybercrime.gov.in पर जाकर सभी स्क्रीनशॉट और सबूत अपलोड करके शिकायत पूरी करें।",
      "भविष्य के लिए शिकायत की पावती PDF डाउनलोड करके सुरक्षित रखें।",
    ],
    importantNotice:
      "CRITICAL: 1930 operates CFCFRMS which communicates directly with bank nodal officers. Calling within the first 2-3 hours (Golden Hour) dramatically improves chances of freezing funds before scammers withdraw at ATMs.",
    importantNoticeHi:
      "जरूरी: घटना के 2-3 घंटे के भीतर 1930 पर कॉल करने से बैंक नोडल अधिकारी जालसाज के खाते में पैसे तुरंत होल्ड/फ्रीज कर सकते हैं।",
    isGovernment: true,
  },
  {
    id: "rbi_cms",
    name: "RBI Complaint Management System (CMS)",
    nameHi: "भारतीय रिज़र्व बैंक शिकायत प्रबंधन प्रणाली (RBI CMS)",
    category: "banking_regulator",
    description:
      "Statutory grievance portal of the Reserve Bank of India for deficient service or unaddressed complaints against RBI-regulated entities (Banks, NBFCs, Payment Wallets).",
    descriptionHi:
      "आरबीआई द्वारा विनियमित बैंकों, एनबीएफसी या यूपीआई प्रदाताओं द्वारा सेवा में कमी या अनसुलझी शिकायतों के लिए केंद्रीय निवारण पोर्टल।",
    whyContact:
      "Use if your bank refuses to cooperate, fails to reverse unauthorized electronic transactions under RBI Circular on Limited Liability of Customers, or does not resolve your formal grievance within 30 days.",
    whyContactHi:
      "यदि आपका बैंक अनधिकृत कटौती पर सहयोग नहीं करता है, शून्य देयता नियमों का पालन नहीं करता है, या 30 दिनों में शिकायत हल नहीं करता है।",
    officialWebsite: "https://cms.rbi.org.in",
    phoneHelpline: "14448",
    operatingHours: "9:30 AM to 5:15 PM (Working Days)",
    operatingHoursHi: "सुबह 9:30 से शाम 5:15 (कार्य दिवस)",
    requiredDocuments: [
      "Copy of original written complaint submitted to your bank",
      "Bank's acknowledgement receipt with date and reference number",
      "Bank's written reply or proof that 30 days have elapsed without resolution",
      "Bank statement showing the unauthorized debit",
      "Copy of Cybercrime police complaint (NCRP 1930 acknowledgement)",
    ],
    requiredDocumentsHi: [
      "अपने बैंक को दी गई मूल शिकायत की प्रति",
      "बैंक की पावती रसीद (दिनांक और संदर्भ संख्या सहित)",
      "बैंक का उत्तर अथवा 30 दिन बीत जाने का प्रमाण",
      "अनधिकृत कटौती दर्शाने वाला बैंक खाता विवरण",
      "साइबर अपराध पुलिस शिकायत (1930 पावती) की प्रति",
    ],
    stepByStepGuide: [
      "Step 1: You MUST first lodge a formal complaint with your bank's branch or grievance redressal officer.",
      "Step 2: Obtain an official Ticket / Reference Number from your bank.",
      "Step 3: Wait 30 days. If the bank rejects your claim or fails to respond satisfactorily, you become eligible for RBI CMS.",
      "Step 4: Visit https://cms.rbi.org.in and select 'File a Complaint'.",
      "Step 5: Select your bank, enter your account details, upload previous correspondence, and submit to the RBI Banking Ombudsman.",
    ],
    stepByStepGuideHi: [
      "चरण 1: आपको सबसे पहले अपने बैंक में औपचारिक लिखित शिकायत दर्ज करनी होगी।",
      "चरण 2: बैंक से अपनी शिकायत का टिकट या संदर्भ नंबर अवश्य प्राप्त करें।",
      "चरण 3: 30 दिन तक बैंक के जवाब की प्रतीक्षा करें। संतोषजनक हल न मिलने पर ही आप RBI में जा सकते हैं।",
      "चरण 4: cms.rbi.org.in पर जाएं और 'File a Complaint' पर क्लिक करें।",
      "चरण 5: बैंक का नाम चुनें, खाता विवरण और बैंक के साथ हुए पत्राचार को अपलोड करके लोकपाल को भेजें।",
    ],
    importantNotice:
      "LEGAL DISTINCTION: RBI CMS is NOT a crime reporting portal to catch scammers. It is a regulatory ombudsman to resolve disputes between you and your bank when the bank fails in its regulatory duties or cybersecurity standards.",
    importantNoticeHi:
      "कानूनी स्पष्टता: RBI CMS जालसाजों को पकड़ने का पुलिस पोर्टल नहीं है। यह बैंक की सेवा में लापरवाही के खिलाफ उपभोक्ता संरक्षण का मंच है।",
    isGovernment: true,
  },
  {
    id: "sebi_scores",
    name: "SEBI SCORES 2.0 (Securities & Investment Grievances)",
    nameHi: "सेबी स्कोर्स 2.0 (प्रतिभूति एवं निवेश शिकायत पोर्टल)",
    category: "securities",
    description:
      "Securities and Exchange Board of India web-based centralized grievance redressal system.",
    descriptionHi:
      "भारतीय प्रतिभूति और विनिमय बोर्ड (SEBI) का आधिकारिक निवेश शिकायत निवारण मंच।",
    whyContact:
      "Use if you were defrauded by registered stockbrokers, investment advisers, research analysts, mutual funds, or unauthorized trading schemes masquerading as SEBI-regulated entities.",
    whyContactHi:
      "यदि सेबी-पंजीकृत ब्रोकर, फर्जी निवेश सलाहकार, शेयर मार्केट टिप्स या अनधिकृत ट्रेडिंग ऐप के माध्यम से धोखाधड़ी हुई हो।",
    officialWebsite: "https://scores.sebi.gov.in",
    phoneHelpline: "1800 266 7575 / 1800 22 7575",
    operatingHours: "9:00 AM to 6:00 PM (Monday to Friday, Multi-language)",
    operatingHoursHi: "सुबह 9:00 से शाम 6:00 (सोमवार से शुक्रवार)",
    requiredDocuments: [
      "Demat / Trading account details (Client ID, Depository)",
      "Contract notes, payment ledger, or bank transfer receipts to broker",
      "Copies of WhatsApp/Telegram trading advice chats or fake trading dashboard screenshots",
      "PAN Card copy",
      "Copy of initial complaint lodged with the concerned intermediary or stock exchange",
    ],
    requiredDocumentsHi: [
      "डीमैट / ट्रेडिंग खाता विवरण (Client ID)",
      "कॉन्ट्रैक्ट नोट या बैंक ट्रांसफर रसीद",
      "व्हाट्सएप/टेलीग्राम ट्रेडिंग टिप्स या फर्जी ट्रेडिंग ऐप के स्क्रीनशॉट",
      "पैन कार्ड की प्रति",
      "संबंधित ब्रोकर या एक्सचेंज को दी गई पूर्व शिकायत की प्रति",
    ],
    stepByStepGuide: [
      "Check SEBI Intermediary Database to verify if the entity claimed to be registered.",
      "If it is a pure criminal fake trading app (e.g., Telegram VIP group or APK deposit trap), file immediately at https://cybercrime.gov.in and dial 1930.",
      "If the entity is a SEBI-registered broker or advisor who engaged in fraudulent execution or illegal portfolio management, register on https://scores.sebi.gov.in.",
      "Submit grievance with client ID, transaction proofs, and communications.",
      "SEBI forwards the complaint to the entity with a mandatory 21-day timeline to respond.",
    ],
    stepByStepGuideHi: [
      "जांचें कि क्या संस्था वास्तव में सेबी द्वारा पंजीकृत है या केवल फर्जी दावा कर रही थी।",
      "यदि यह टेलीग्राम वीआईपी ग्रुप या फर्जी एपीके ट्रेडिंग ऐप है, तो तुरंत cybercrime.gov.in पर पुलिस शिकायत दर्ज करें।",
      "यदि ब्रोकर या सलाहकार सेबी-पंजीकृत है और उसने धोखाधड़ी की है, तो scores.sebi.gov.in पर जाएं।",
      "क्लाइंट आईडी, बैंक भुगतान सबूत और संदेशों के स्क्रीनशॉट अपलोड करें।",
      "सेबी संबंधित मध्यस्थ को 21 दिनों में जवाब देने का वैधानिक निर्देश देता है।",
    ],
    importantNotice:
      "WARNING: Over 95% of 'institutional trading app' and 'IPO allotment guarantee' scams run via WhatsApp/Telegram are operated by international cyber syndicates with NO SEBI registration. These must be reported directly to 1930 as criminal cyber frauds.",
    importantNoticeHi:
      "सावधानी: व्हाट्सएप/टेलीग्राम पर 100% गारंटी वाले आईपीओ या संस्थागत ट्रेडिंग घोटाले विशुद्ध रूप से आपराधिक हैं। इन्हें सीधे 1930 पर दर्ज करें।",
    isGovernment: true,
  },
  {
    id: "consumer_helpline",
    name: "National Consumer Helpline (NCH / 1915)",
    nameHi: "राष्ट्रीय उपभोक्ता हेल्पलाइन (1915)",
    category: "consumer",
    description:
      "Department of Consumer Affairs portal for resolving consumer disputes, non-delivery of purchased goods, e-commerce fraud, and deficient corporate services.",
    descriptionHi:
      "उपभोक्ता मामले विभाग का मंच, जो ऑनलाइन शॉपिंग धोखाधड़ी, पार्सल न मिलने और कंपनियों द्वारा रिफंड न देने की समस्याओं को सुलझाता है।",
    whyContact:
      "Contact if an e-commerce platform, courier company, or vendor delivered a counterfeit item, refused refund for non-delivery, or engaged in unfair trade practices.",
    whyContactHi:
      "यदि ई-कॉमर्स साइट या कूरियर कंपनी ने नकली सामान भेजा, डिलीवरी न होने पर भी रिफंड देने से मना किया या उपभोक्ता नियमों का उल्लंघन किया।",
    officialWebsite: "https://consumerhelpline.gov.in",
    phoneHelpline: "1915 (or SMS to 8800001915)",
    operatingHours: "8:00 AM to 8:00 PM (All days except National Holidays)",
    operatingHoursHi: "सुबह 8:00 से रात 8:00 (सभी दिन)",
    requiredDocuments: [
      "Order ID / Invoice / Cash receipt from e-commerce vendor",
      "Tracking Number / Waybill ID from courier company",
      "Photographs/videos of damaged or counterfeit product unboxing",
      "Email correspondence with vendor customer support",
      "Payment transaction proof (credit card slip, UPI UTR)",
    ],
    requiredDocumentsHi: [
      "ऑर्डर आईडी / इनवॉइस / खरीद रसीद",
      "कूरियर ट्रैकिंग नंबर / वे-बिल (Waybill ID)",
      "पार्सल अनबॉक्सिंग की तस्वीरें या वीडियो",
      "कंपनी कस्टमर केयर के साथ हुए ईमेल या चैट",
      "पेमेंट रसीद या बैंक स्टेटमेंट",
    ],
    stepByStepGuide: [
      "Dial 1915 or register on https://consumerhelpline.gov.in (or download the NCH App).",
      "Enter vendor details, order number, product description, and amount paid.",
      "Upload invoice and photographic proof of defect/non-delivery.",
      "NCH attempts direct pre-litigation mediation with the registered corporate partner.",
      "If the vendor is an outright impersonator or fake APK courier scam, escalate immediately to Cybercrime Portal (1930).",
    ],
    stepByStepGuideHi: [
      "1915 पर कॉल करें या consumerhelpline.gov.in पोर्टल पर लॉग इन करें।",
      "विक्रेता का नाम, ऑर्डर आईडी, उत्पाद का विवरण और भुगतान राशि दर्ज करें।",
      "इनवॉइस और पार्सल की तस्वीरें अपलोड करें।",
      "NCH उपभोक्ता विभाग पंजीकृत कंपनी के साथ सीधे समाधान की मध्यस्थता करता है।",
      "यदि कूरियर कंपनी के नाम पर फर्जी एपीके डाउनलोड करवाकर बैंक खाली किया गया हो, तो 1930 पर रिपोर्ट करें।",
    ],
    importantNotice:
      "NOTE: If the courier fraud involved downloading an APK file (e.g., 'India Post Update .apk' or 'BlueDart verification ₹5 fee') that drained your bank account, this is CRIMINAL CYBER FRAUD—report directly to 1930, not NCH.",
    importantNoticeHi:
      "ध्यान दें: यदि पार्सल री-डिलीवरी के नाम पर ₹5 के बहाने फोन में कोई ऐप डाउनलोड करवाकर बैंक खाली किया गया, तो यह साइबर अपराध है, तुरंत 1930 पर जाएं।",
    isGovernment: true,
  },
  {
    id: "sanchar_saathi",
    name: "DoT Sanchar Saathi & Chakshu Facility",
    nameHi: "संचार साथी एवं चक्षु सुविधा (दूरसंचार विभाग)",
    category: "telecom",
    description:
      "Citizen-centric initiative by the Department of Telecommunications (DoT) to report suspected fraud communications and block stolen/lost mobile handsets.",
    descriptionHi:
      "धोखेबाज कॉल, फर्जी व्हाट्सएप नंबरों और संदिग्ध एसएमएस की शिकायत दर्ज कर उन्हें स्थायी रूप से ब्लॉक कराने की आधिकारिक सरकारी सुविधा।",
    whyContact:
      "Report phone numbers, international spoofed calls, and fake WhatsApp accounts used for digital arrest coercion, lottery scams, or KYC suspension threats to disconnect their telecom facilities.",
    whyContactHi:
      "धमकी भरे कॉल, डिजिटल अरेस्ट के लिए उपयोग किए जा रहे फोन नंबरों और फर्जी सिम कार्डों को ब्लॉक कराने हेतु।",
    officialWebsite: "https://sancharsaathi.gov.in",
    phoneHelpline: "1800 11 0420",
    operatingHours: "24x7 Online Reporting",
    operatingHoursHi: "24x7 ऑनलाइन सुविधा",
    requiredDocuments: [
      "Exact scammer mobile number (including country code)",
      "Screenshot of suspicious SMS / WhatsApp message",
      "Call log showing timestamp and duration of call",
      "Audio recording of fraudulent call (if recorded)",
    ],
    requiredDocumentsHi: [
      "जालसाज का सटीक फोन नंबर (कंट्री कोड सहित)",
      "संदिग्ध एसएमएस या व्हाट्सएप संदेश का स्क्रीनशॉट",
      "कॉल का समय और अवधि दर्शाने वाला कॉल लॉग",
      "कॉल की ऑडियो रिकॉर्डिंग (यदि उपलब्ध हो)",
    ],
    stepByStepGuide: [
      "Visit https://sancharsaathi.gov.in and click on 'Chakshu - Report Suspected Fraud Communication'.",
      "Select the category (Digital Arrest, KYC, Impersonation, Fake Lottery, etc.).",
      "Enter the scammer's phone number, medium (Call, SMS, WhatsApp), and date/time.",
      "Upload screenshot evidence and provide a brief narrative.",
      "Authenticate with OTP to submit; DoT triggers automated carrier verification and SIM disconnection.",
    ],
    stepByStepGuideHi: [
      "sancharsaathi.gov.in पर जाएं और 'Chakshu' सुविधा पर क्लिक करें।",
      "धोखाधड़ी का प्रकार चुनें (डिजिटल अरेस्ट, केवाईसी, फर्जी सरकारी अधिकारी आदि)।",
      "जालसाज का नंबर, संपर्क का माध्यम (कॉल/व्हाट्सएप) और समय दर्ज करें।",
      "स्क्रीनशॉट अपलोड करें और संक्षिप्त विवरण लिखें।",
      "ओटीपी दर्ज करके सबमिट करें; दूरसंचार विभाग संदिग्ध नंबर की जांच करके उसे बंद करता है।",
    ],
    importantNotice:
      "Chakshu disables scammer phone numbers and blocks their IMEI nationwide, protecting other citizens. However, to recover stolen money, you must also report to 1930.",
    importantNoticeHi:
      "चक्षु जालसाज के नंबर और फोन को ब्लॉक करता है, लेकिन कटे हुए पैसों की वापसी के लिए 1930 पर भी तुरंत शिकायत आवश्यक है।",
    isGovernment: true,
  },
  {
    id: "meta_recovery",
    name: "Meta Hacked Account Security Centers",
    nameHi: "मेटा हैक अकाउंट रिकवरी केंद्र (Facebook & Instagram)",
    category: "social_platform",
    description:
      "Official account recovery and identity verification workflows for compromised Facebook, Instagram, and WhatsApp profiles.",
    descriptionHi:
      "फेसबुक, इंस्टाग्राम और व्हाट्सएप अकाउंट हैक होने या पहचान चोरी होने पर पुनः नियंत्रण पाने का आधिकारिक केंद्र।",
    whyContact:
      "Regain control of compromised social profiles, terminate malicious active login sessions, and revoke unauthorized 2-Factor Authentication keys set up by hackers.",
    whyContactHi:
      "हैक किए गए फेसबुक/इंस्टाग्राम अकाउंट को दोबारा रिकवर करने और जालसाज के लॉगिन सेशंस को बंद करने के लिए।",
    officialWebsite: "https://www.facebook.com/hacked",
    phoneHelpline: "Report via in-app security verification",
    operatingHours: "Automated Self-Service Workflows",
    operatingHoursHi: "स्वचालित सुरक्षा प्रणाली",
    requiredDocuments: [
      "Original registered email address and mobile phone number",
      "Government photo ID (Passport / Driving License) for video selfie verification",
      "Previous known passwords",
      "Screenshots of altered account profiles or impersonation handles",
    ],
    requiredDocumentsHi: [
      "अकाउंट से जुड़ा मूल ईमेल और मोबाइल नंबर",
      "पहचान सत्यापन हेतु सरकारी आईडी या सेल्फी वीडियो",
      "पुराना पासवर्ड",
      "बदले गए प्रोफाइल या फर्जी अकाउंट के स्क्रीनशॉट",
    ],
    stepByStepGuide: [
      "For Instagram: Open https://www.instagram.com/hacked in your browser.",
      "For Facebook: Open https://www.facebook.com/hacked in your browser.",
      "Select 'My account was hacked' or 'Someone created an account pretending to be me'.",
      "Enter your original username or linked mobile number.",
      "Complete the video selfie verification to prove biometric identity matches previous profile photos.",
      "Once re-authenticated, go to Settings -> Security -> 'Where You're Logged In' and click 'Log Out Of All Sessions'.",
      "Immediately enable App-based Two-Factor Authentication (e.g. Google Authenticator), NOT SMS.",
    ],
    stepByStepGuideHi: [
      "इंस्टाग्राम के लिए: instagram.com/hacked पर जाएं।",
      "फेसबुक के लिए: facebook.com/hacked पर जाएं।",
      "'My account was hacked' विकल्प चुनें।",
      "अपना मूल यूजरनेम या मोबाइल नंबर डालें।",
      "सेल्फी वीडियो सत्यापन पूरा करें ताकि पहचान की पुष्टि हो सके।",
      "अकाउंट खुलते ही सभी अज्ञात डिवाइसेज से 'Log Out Of All Sessions' करें।",
      "तुरंत टू-फैक्टर ऑथेंटिकेशन (Google Authenticator) ऑन करें।",
    ],
    importantNotice:
      "If the scammer is extorting money or sending fake emergency messages to your contacts, immediately file an Impersonation / Identity Theft complaint on https://cybercrime.gov.in.",
    importantNoticeHi:
      "यदि हैकर आपकी आईडी से आपके दोस्तों से पैसे मांग रहा है, तो तुरंत 1930 और cybercrime.gov.in पर पहचान चोरी की पुलिस रिपोर्ट दर्ज करें।",
    isGovernment: false,
  },
  {
    id: "google_recovery",
    name: "Google Account Recovery",
    nameHi: "गूगल अकाउंट रिकवरी पोर्टल",
    category: "social_platform",
    description:
      "Official account recovery pipeline for compromised Gmail, Google Drive, and Google Pay accounts.",
    descriptionHi:
      "हैक हुए जीमेल, गूगल ड्राइव और गूगल पे खातों को सुरक्षित रूप से रिकवर करने का आधिकारिक पोर्टल।",
    whyContact:
      "Regain access to your primary Gmail account, revoke OAuth tokens granted to malicious APKs or apps, and secure your synced passwords and contacts.",
    whyContactHi:
      "जीमेल पासवर्ड बदलने, अनधिकृत ऐप्स के एक्सेस टोकन हटाने और अपने डेटा को सुरक्षित करने के लिए।",
    officialWebsite: "https://accounts.google.com/signin/recovery",
    phoneHelpline: "support.google.com/accounts",
    operatingHours: "24x7 Automated Workflow",
    operatingHoursHi: "24x7 स्वचालित सेवा",
    requiredDocuments: [
      "Last password remembered",
      "Access to recovery email address or recovery phone number",
      "Previously recognized device or Wi-Fi network",
    ],
    requiredDocumentsHi: [
      "अंतिम याद रहा पासवर्ड",
      "रिकवरी ईमेल या फोन नंबर",
      "पहले इस्तेमाल किया गया कंप्यूटर या मोबाइल",
    ],
    stepByStepGuide: [
      "Open https://accounts.google.com/signin/recovery in an incognito window.",
      "Answer security verification questions using a familiar Wi-Fi network and device.",
      "Reset your Google password immediately.",
      "Visit myaccount.google.com/device-activity and sign out of all unrecognized computers or phones.",
      "Visit myaccount.google.com/permissions and revoke access to all unknown third-party applications.",
    ],
    stepByStepGuideHi: [
      "accounts.google.com/signin/recovery पर जाएं।",
      "सुरक्षा प्रश्नों के उत्तर दें और पासवर्ड रीसेट करें।",
      "device-activity पेज पर जाकर सभी अनजान फोन/कंप्यूटर से लॉगआउट करें।",
      "permissions पेज पर जाकर सभी संदिग्ध ऐप्स के अधिकार वापस लें।",
    ],
    isGovernment: false,
  },
];

