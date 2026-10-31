"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Shield,
  PhoneCall,
  RotateCcw,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { ScamCategoryType } from "@/lib/types/recovery";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  chips?: { label: string; actionId: string }[];
  actionBridge?: {
    type: "call_1930" | "open_recovery" | "open_scanner" | "copy_text";
    label: string;
    targetTab?: "scanner" | "recovery" | "inbox" | "scam-iq";
    category?: ScamCategoryType;
    payloadText?: string;
  };
}

interface KavachBotProps {
  onNavigateTab: (
    tab: "scanner" | "inbox" | "recovery" | "scam-iq",
    category?: ScamCategoryType,
    prefilledText?: string
  ) => void;
}

export const KavachBot: React.FC<KavachBotProps> = ({ onNavigateTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isHi = language === "hi";

  // Initial welcome message with Flipkart-style decision chips
  const INITIAL_MESSAGES: Message[] = [
    {
      id: "welcome-1",
      sender: "bot",
      text: isHi
        ? "नमस्ते! मैं DIGIkavach का सुरक्षा सहायक (KavachBot) हूँ। किसी भी साइबर फ्रॉड या संदिग्ध स्थिति में मैं आपकी तुरंत मदद कर सकता हूँ। बताएं, आपके साथ क्या स्थिति हुई है?"
        : "Hello! I am KavachBot, your 24x7 cyber fraud emergency triage assistant. I can help guide you through any scam or unauthorized transaction right now. What happened?",
      timestamp: "Just now",
      chips: isHi
        ? [
            { label: "💳 बैंक/UPI से पैसे कट गए", actionId: "upi_debit" },
            { label: "🚨 डिजिटल अरेस्ट / CBI पुलिस धमकी", actionId: "digital_arrest" },
            { label: "📱 OTP बता दिया / लिंक पर क्लिक किया", actionId: "shared_otp" },
            { label: "⚡ बिजली बिल / कूरियर पार्सल फ्रॉड", actionId: "utility_scam" },
            { label: "💼 पार्ट-टाइम जॉब / टेलीग्राम फ्रॉड", actionId: "job_scam" },
            { label: "🔍 कोई संदिग्ध मैसेज चेक करना है", actionId: "check_message" },
          ]
        : [
            { label: "💳 Money debited via UPI / Card", actionId: "upi_debit" },
            { label: "🚨 Digital Arrest / Police Video Threat", actionId: "digital_arrest" },
            { label: "📱 Shared OTP / Clicked Phishing Link", actionId: "shared_otp" },
            { label: "⚡ Electricity Cut / Courier Delivery Trap", actionId: "utility_scam" },
            { label: "💼 Part-time Job / Telegram Task Bait", actionId: "job_scam" },
            { label: "🔍 Verify a suspicious message", actionId: "check_message" },
          ],
    },
  ];

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Update initial message language if user toggles language at the start
  useEffect(() => {
    if (messages.length === 1) {
      setMessages(INITIAL_MESSAGES);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const addBotResponse = (
    text: string,
    chips?: { label: string; actionId: string }[],
    actionBridge?: Message["actionBridge"]
  ) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          chips,
          actionBridge,
        },
      ]);
      setIsTyping(false);
    }, 450);
  };

  // Flipkart-style structured decision trees
  const handleChipClick = (actionId: string, label: string) => {
    // Append user selection
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text: label,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);

    switch (actionId) {
      case "upi_debit":
        addBotResponse(
          isHi
            ? "⚠️ यह एक आपातकालीन स्थिति है! क्या यह लेनदेन पिछले 2 घंटों (Golden Hour) के अंदर हुआ है?"
            : "⚠️ Emergency Golden Hour! Did this unauthorized debit happen within the last 2 hours?",
          isHi
            ? [
                { label: "⏱️ हाँ, अभी 2 घंटे से कम में हुआ", actionId: "upi_golden_yes" },
                { label: "📅 नहीं, 2 घंटे से अधिक या कल हुआ", actionId: "upi_golden_no" },
              ]
            : [
                { label: "⏱️ Yes, happened < 2 hours ago", actionId: "upi_golden_yes" },
                { label: "📅 No, happened > 2 hours ago", actionId: "upi_golden_no" },
              ]
        );
        break;

      case "upi_golden_yes":
        addBotResponse(
          isHi
            ? "🚨 तुरंत राष्ट्रीय साइबर हेल्पलाइन 1930 पर कॉल करें! पहले 2-3 घंटों में कॉल करने पर बैंक आपके पैसे को धोखेबाज़ के खाते में तुरंत फ्रीज (Lien) कर देता है। इसके बाद अपने बैंक ऐप में जाकर यूपीआई आईडी तुरंत ब्लॉक करें।"
            : "🚨 CALL 1930 IMMEDIATELY! Within the first 2-3 hours (Golden Hour), the National Cyber Crime Portal can freeze the disputed transaction before the scammer withdraws it. Also block your UPI ID inside your banking app right now.",
          isHi
            ? [
                { label: "📞 1930 पर तुरंत कॉल लगाएं", actionId: "trigger_1930" },
                { label: "🛡️ सहायता केंद्र में शिकायत दर्ज करें", actionId: "trigger_recovery_upi" },
              ]
            : [
                { label: "📞 Dial 1930 Helpline Now", actionId: "trigger_1930" },
                { label: "🛡️ Launch Prefilled Recovery Portal", actionId: "trigger_recovery_upi" },
              ],
          {
            type: "call_1930",
            label: isHi ? "📞 1930 पर डायल करें (टोल फ्री)" : "📞 Dial 1930 Cyber Helpline",
          }
        );
        break;

      case "upi_golden_no":
        addBotResponse(
          isHi
            ? "चिंता न करें, अभी भी समाधान संभव है। RBI नियमों के अनुसार अनधिकृत लेनदेन पर zero/limited liability का लाभ मिलता है। तुरंत अपने बैंक में लिखित शिकायत दर्ज करें और साइबर पोर्टल cybercrime.gov.in पर FIR दर्ज कराएं।"
            : "Don't panic, statutory recovery is still active under RBI Circular (Zero/Limited Customer Liability). File an official complaint with your bank's Nodal Officer and register an acknowledgment on cybercrime.gov.in.",
          isHi
            ? [{ label: "🛡️ रिकवरी चेकलिस्ट खोलें", actionId: "trigger_recovery_upi" }]
            : [{ label: "🛡️ Open Recovery Checklist", actionId: "trigger_recovery_upi" }],
          {
            type: "open_recovery",
            label: isHi ? "🛡️ रिकवरी गाइड खोलें" : "🛡️ Open Recovery Assistant",
            targetTab: "recovery",
            category: "banking_upi",
          }
        );
        break;

      case "digital_arrest":
        addBotResponse(
          isHi
            ? "🛑 सावधान! कानून में 'डिजिटल अरेस्ट' नाम की कोई चीज़ नहीं होती! न तो CBI, न ही पुलिस, और न ही सुप्रीम कोर्ट स्काइप या व्हाट्सएप वीडियो कॉल पर गिरफ़्तारी या बयान लेते हैं। तुरंत वीडियो कॉल काट दें, कोई पैसे न भेजें।"
            : "🛑 STOP! 'Digital Arrest' is 100% ILLEGAL & FAKE! Indian law enforcement, CBI, Police, and Customs NEVER conduct arrests or court hearings over Skype or WhatsApp video calls. Hang up immediately, block the caller, and DO NOT transfer any money.",
          isHi
            ? [
                { label: "🚨 1930 पर इसकी रिपोर्ट करें", actionId: "trigger_1930" },
                { label: "🛡️ डिजिटल अरेस्ट से बचाव गाइड", actionId: "trigger_recovery_coercion" },
              ]
            : [
                { label: "🚨 Report this to 1930", actionId: "trigger_1930" },
                { label: "🛡️ Digital Arrest Defense Plan", actionId: "trigger_recovery_coercion" },
              ],
          {
            type: "open_recovery",
            label: isHi ? "🛡️ डिजिटल अरेस्ट सहायता गाइड" : "🛡️ Coercion Defense Guide",
            targetTab: "recovery",
            category: "digital_arrest",
          }
        );
        break;

      case "shared_otp":
        addBotResponse(
          isHi
            ? "⚠️ यदि आपने ओटीपी बता दिया है या अनजाने में कोई ऐप (AnyDesk / TeamViewer) डाउनलोड किया है: \n1. फोन का इंटरनेट (WiFi/Mobile data) तुरंत बंद करें।\n2. बैंक को कॉल करके नेटबैंकिंग फ्रीज कराएं।\n3. संदिग्ध ऐप को अनइंस्टॉल करें।"
            : "⚠️ CRITICAL CONTAINMENT: If you disclosed an OTP or installed a remote tool (AnyDesk, TeamViewer, QuickSupport):\n1. Turn off your phone's Wi-Fi and Mobile Data immediately.\n2. Call your bank hotline to freeze debit privileges.\n3. Uninstall the remote viewer app immediately.",
          isHi
            ? [{ label: "🛡️ आधिकारिक रिकवरी पोर्टल खोलें", actionId: "trigger_recovery_upi" }]
            : [{ label: "🛡️ Open Containment Assistant", actionId: "trigger_recovery_upi" }],
          {
            type: "open_recovery",
            label: isHi ? "🛡️ बैंक फ्रीज गाइड खोलें" : "🛡️ Launch Account Containment",
            targetTab: "recovery",
            category: "banking_upi",
          }
        );
        break;

      case "utility_scam":
        addBotResponse(
          isHi
            ? "⚠️ यह एक सामान्य 'बिजली बिल कट' या 'कूरियर एड्रेस अपडेट' फ्रॉड है। आधिकारिक बिजली बोर्ड या इंडिया पोस्ट कभी भी किसी 10-अंकों के निजी मोबाइल नंबर से कॉल या धमकी नहीं भेजते। किसी भी लिंक पर क्लिक न करें।"
            : "⚠️ Classic Utility Bait: Electricity Boards and India Post NEVER send disconnection threats from personal 10-digit mobile numbers or demand Rs 5-10 update fees. Do NOT click the link.",
          isHi
            ? [{ label: "🔍 मैसेज को स्कैनर में जांचें", actionId: "trigger_scanner" }]
            : [{ label: "🔍 Scan Message in Engine", actionId: "trigger_scanner" }],
          {
            type: "open_scanner",
            label: isHi ? "🔍 स्कैनर में मैसेज जांचें" : "🔍 Inspect Link in Safe Sandbox",
            targetTab: "scanner",
          }
        );
        break;

      case "job_scam":
        addBotResponse(
          isHi
            ? "⚠️ यह टेलीग्राम 'पार्ट-टाइम यूट्यूब लाइक / होटल रिव्यू' फ्रॉड है। शुरुआत में 200-500 रुपये का लालच देकर बाद में लाखों रुपये 'क्रिप्टो रिचार्ज' या 'टास्क फ्रीज' के नाम पर हड़प लिए जाते हैं। और पैसे बिल्कुल न दें!"
            : "⚠️ Telegram Review/Like Task Scam: Scammers lure victims with Rs 200-500 early profits, then freeze funds demanding lakhs for 'crypto prepaid tasks'. NEVER send more money to unlock prior deposits.",
          isHi
            ? [{ label: "🛡️ जॉब फ्रॉड रिपोर्टिंग गाइड", actionId: "trigger_recovery_job" }]
            : [{ label: "🛡️ Job Scam Recovery Plan", actionId: "trigger_recovery_job" }],
          {
            type: "open_recovery",
            label: isHi ? "🛡️ जॉब फ्रॉड रिपोर्ट दर्ज करें" : "🛡️ Open Job Scam Recovery",
            targetTab: "recovery",
            category: "job_recruitment",
          }
        );
        break;

      case "check_message":
        addBotResponse(
          isHi
            ? "संदिग्ध मैसेज या लिंक को नीचे टाइप करें, या हमारे मल्टी-इंजन स्कैनर में पेस्ट करें। हम उसका URL सैंडबॉक्स, हेडर और साइकोलॉजिकल दबाव बिना लिंक खोले जांच लेंगे।"
            : "You can paste the suspicious SMS, WhatsApp message, or link right here in chat, or load it into our Multi-Engine Scanner for passive sandbox inspection.",
          isHi
            ? [{ label: "🔍 स्कैनर खोलें", actionId: "trigger_scanner" }]
            : [{ label: "🔍 Open Scanner", actionId: "trigger_scanner" }],
          {
            type: "open_scanner",
            label: isHi ? "🔍 DIGIkavach स्कैनर खोलें" : "🔍 Launch DIGIkavach Scanner",
            targetTab: "scanner",
          }
        );
        break;

      case "trigger_1930":
        if (typeof window !== "undefined") {
          window.location.href = "tel:1930";
        }
        break;

      case "trigger_recovery_upi":
        onNavigateTab("recovery", "banking_upi");
        setIsOpen(false);
        break;

      case "trigger_recovery_coercion":
        onNavigateTab("recovery", "digital_arrest");
        setIsOpen(false);
        break;

      case "trigger_recovery_job":
        onNavigateTab("recovery", "job_recruitment");
        setIsOpen(false);
        break;

      case "trigger_scanner":
        onNavigateTab("scanner");
        setIsOpen(false);
        break;

      default:
        addBotResponse(
          isHi
            ? "कृपया बताएं कि आपको और क्या जानकारी चाहिए, या मुख्य मेनू में वापस जाएं।"
            : "How else can I assist with your cyber security or recovery?",
          INITIAL_MESSAGES[0].chips
        );
    }
  };

  // Free-form user input handling (Hinglish / English / Natural questions)
  const handleSendText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = inputText.trim();
    if (!query) return;

    // Append user message
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text: query,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setInputText("");

    const lower = query.toLowerCase();

    // Smart Hinglish / Keyword Intent Classifier
    if (
      lower.includes("paise") ||
      lower.includes("cut") ||
      lower.includes("debit") ||
      lower.includes("kat gaya") ||
      lower.includes("rupay") ||
      lower.includes("upi") ||
      lower.includes("account")
    ) {
      addBotResponse(
        isHi
          ? "🚨 अनधिकृत बैंक डेबिट का पता चला है! तुरंत इन 3 कदमों का पालन करें:\n1. 1930 हेल्पलाइन पर कॉल कर 'Lien Freeze' का अनुरोध करें।\n2. अपने बैंक के टोल-फ्री नंबर पर कॉल कर यूपीआई व कार्ड ब्लॉक कराएं।\n3. लेनदेन का UTR नंबर और स्क्रीनशॉट सुरक्षित रखें।"
          : "🚨 Unauthorized Financial Debit Detected! Follow these immediate containment steps:\n1. Call 1930 immediately to freeze the transfer before it is withdrawn.\n2. Call your bank's emergency line to block your netbanking and debit card.\n3. Note down the 12-digit UTR/UPI reference number.",
        isHi
          ? [
              { label: "📞 1930 डायल करें", actionId: "trigger_1930" },
              { label: "🛡️ सहायता केंद्र खोलें", actionId: "trigger_recovery_upi" },
            ]
          : [
              { label: "📞 Dial 1930 Helpline", actionId: "trigger_1930" },
              { label: "🛡️ Open Recovery Assistant", actionId: "trigger_recovery_upi" },
            ],
        {
          type: "call_1930",
          label: isHi ? "📞 1930 पर कॉल करें" : "📞 Call 1930 Cyber Helpline",
        }
      );
    } else if (
      lower.includes("cbi") ||
      lower.includes("police") ||
      lower.includes("arrest") ||
      lower.includes("custom") ||
      lower.includes("skype") ||
      lower.includes("warrant")
    ) {
      addBotResponse(
        isHi
          ? "🛑 यह 100% 'डिजिटल अरेस्ट' का फ्रॉड है! कोई भी पुलिस या CBI वीडियो कॉल पर पूछताछ या गिरफ़्तारी नहीं करती। तुरंत कॉल काटें और 1930 पर शिकायत करें। डरने की बिल्कुल जरूरत नहीं है।"
          : "🛑 This is a verified 'Digital Arrest' Coercion Scam! Legitimate law enforcement NEVER conducts arrests or judicial interrogations over Skype/WhatsApp video. Disconnect the call immediately and fear nothing.",
        isHi
          ? [{ label: "🛡️ डिजिटल अरेस्ट बचाव गाइड", actionId: "trigger_recovery_coercion" }]
          : [{ label: "🛡️ Digital Arrest Defense Plan", actionId: "trigger_recovery_coercion" }],
        {
          type: "open_recovery",
          label: isHi ? "🛡️ सुरक्षा गाइड खोलें" : "🛡️ Open Legal Safeguard Plan",
          targetTab: "recovery",
          category: "digital_arrest",
        }
      );
    } else if (
      lower.includes("http") ||
      lower.includes(".com") ||
      lower.includes(".top") ||
      lower.includes(".site") ||
      lower.includes(".xyz") ||
      lower.includes("link")
    ) {
      addBotResponse(
        isHi
          ? "आपने एक लिंक साझा किया है। इसे बिना खोले सीधे DIGIkavach के मल्टी-इंजन सैंडबॉक्स में जांचें ताकि कोई मालवेयर आपके डिवाइस में न पहुंचे।"
          : "Detected a link in your message. You can safely inspect its redirect chain, domain age, and credential harvesting forms in our Passive URL Sandbox.",
        isHi
          ? [{ label: "🔍 स्कैनर में लिंक जांचें", actionId: "trigger_scanner" }]
          : [{ label: "🔍 Open Passive Sandbox", actionId: "trigger_scanner" }],
        {
          type: "open_scanner",
          label: isHi ? "🔍 स्कैनर खोलें" : "🔍 Inspect Link in Sandbox",
          targetTab: "scanner",
          payloadText: query,
        }
      );
    } else {
      addBotResponse(
        isHi
          ? `मैंने आपकी समस्या समझी: "${query}"। क्या आप इस संदेश की प्रामाणिकता जांचना चाहते हैं, या किसी वित्तीय नुकसान की शिकायत दर्ज करना चाहते हैं?`
          : `Understood regarding: "${query}". Would you like to scan this suspicious payload in our detection engine, or initiate official recovery triage?`,
        isHi
          ? [
              { label: "🔍 संदिग्ध मैसेज स्कैन करें", actionId: "trigger_scanner" },
              { label: "🛡️ 1930 रिकवरी सहायता खोलें", actionId: "trigger_recovery_upi" },
              { label: "🔄 मुख्य मेनू पर लौटें", actionId: "reset_menu" },
            ]
          : [
              { label: "🔍 Scan suspicious message", actionId: "trigger_scanner" },
              { label: "🛡️ Open 1930 Recovery", actionId: "trigger_recovery_upi" },
              { label: "🔄 Return to Main Menu", actionId: "reset_menu" },
            ]
      );
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Trigger Bubble */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 px-4 py-3.5 rounded-full bg-[#181a15] text-white shadow-[0_12px_36px_rgba(0,0,0,0.25)] hover:shadow-[0_16px_44px_rgba(190,242,100,0.3)] hover:scale-[1.03] transition-all border border-white/10"
        >
          {/* Animated Status Dot */}
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#bef264] text-[#162704] font-bold">
            <Shield className="w-4 h-4 text-[#162704]" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          <div className="text-left pr-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold tracking-tight text-white">KavachBot</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-[#bef264] text-[#162704]">
                24x7
              </span>
            </div>
            <p className="text-[10px] text-white/70">Scam Advisor & Triage</p>
          </div>
        </button>
      )}

      {/* Expanded macOS Glassmorphism Assistant Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[410px] h-[580px] max-h-[85vh] bg-white/95 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* macOS Window Chrome Header */}
          <div className="p-4 bg-[#f8faf6]/90 border-b border-[#e2e6dc] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {/* Traffic lights */}
              <div className="flex items-center gap-1.5 shrink-0 pl-1">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-3 h-3 rounded-full bg-rose-400 hover:bg-rose-500 border border-rose-500/30 transition-colors"
                  title="Close Assistant"
                />
                <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500/30" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-500/30" />
              </div>

              <div className="pl-1">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-sm text-[#181a15]">KavachBot</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#eef4e8] text-[#3d5926] border border-[#d5e0cb]">
                    AI Advisor
                  </span>
                </div>
                <p className="text-[10px] text-[#636c5c]">Official Statutory Guidance</p>
              </div>
            </div>

            {/* Language Switcher & Controls */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center bg-[#eef3ea] p-0.5 rounded-xl border border-[#d8e0d0] text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-2 py-0.5 rounded-lg transition-all ${
                    language === "en" ? "bg-[#181a15] text-white shadow-2xs" : "text-[#586150]"
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("hi")}
                  className={`px-2 py-0.5 rounded-lg transition-all ${
                    language === "hi" ? "bg-[#181a15] text-white shadow-2xs" : "text-[#586150]"
                  }`}
                >
                  हिंदी
                </button>
              </div>

              <button
                type="button"
                onClick={() => setMessages(INITIAL_MESSAGES)}
                className="p-1.5 rounded-xl hover:bg-[#edf2e7] text-[#636c5c] hover:text-[#181a15] transition-colors"
                title="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-[#edf2e7] text-[#636c5c] hover:text-[#181a15] transition-colors"
                title="Minimize"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                {/* Bubble */}
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                    msg.sender === "user"
                      ? "bg-[#181a15] text-white rounded-br-xs shadow-xs"
                      : "bg-[#f4f7f1] text-[#181a15] border border-[#e2e8dc] rounded-bl-xs shadow-2xs"
                  }`}
                >
                  {msg.text}
                </div>

                <span className="text-[10px] text-[#788270] mt-1 px-1">{msg.timestamp}</span>

                {/* 1-Click Action Bridge Button */}
                {msg.actionBridge && (
                  <div className="mt-2 w-full max-w-[85%]">
                    {msg.actionBridge.type === "call_1930" ? (
                      <a
                        href="tel:1930"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>{msg.actionBridge.label}</span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (msg.actionBridge?.targetTab) {
                            onNavigateTab(
                              msg.actionBridge.targetTab,
                              msg.actionBridge.category,
                              msg.actionBridge.payloadText
                            );
                            setIsOpen(false);
                          }
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#bef264] hover:bg-[#aee750] text-[#162704] font-bold text-xs border border-[#a8df4a]/70 flex items-center justify-center gap-2 shadow-xs transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{msg.actionBridge.label}</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Flipkart-Style Guided Decision Chips */}
                {msg.chips && msg.chips.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[95%]">
                    {msg.chips.map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleChipClick(chip.actionId, chip.label)}
                        className="text-[11px] px-3 py-1.5 rounded-full bg-white hover:bg-[#eef5e6] text-[#2c401c] border border-[#d0d8c8] hover:border-[#8ec251] font-medium transition-all shadow-2xs flex items-center gap-1.5 text-left"
                      >
                        <span>{chip.label}</span>
                        <ChevronRight className="w-3 h-3 text-[#557e33] shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#f4f7f1] border border-[#e2e8dc] w-24 text-[11px] text-[#636c5c]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#586150] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#586150] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#586150] animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer (Hybrid: Guided Chips + Free Typing) */}
          <form
            onSubmit={handleSendText}
            className="p-3 bg-[#f8faf6] border-t border-[#e2e6dc] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isHi
                  ? "अपनी समस्या यहाँ लिखें (उदा. पैसे कट गए, CBI कॉल)..."
                  : "Describe your situation in English or Hinglish..."
              }
              className="flex-1 bg-white border border-[#d8e0d0] rounded-2xl px-3.5 py-2 text-xs text-[#181a15] placeholder-[#8e9886] focus:outline-none focus:border-[#8ec251] shadow-2xs"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-2xl bg-[#181a15] hover:bg-black text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs shrink-0"
              title="Send Message"
            >
              <Send className="w-3.5 h-3.5 text-[#bef264]" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
