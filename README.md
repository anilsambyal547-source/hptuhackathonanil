# SafeGuard AI 🛡️
### Multimodal Scam Detection, Safe Passive URL Inspection, Multi-Channel Ingestion & Transparent Risk Assessment

> **Hackathon Submission — Question 02: Cybersecurity | AI | Web Development**  
> *Combines deterministic rule heuristics, safe passive URL decomposition, official entity brand registry, RFC-822 email forensics, and contextual semantic AI to deliver explainable scam verdicts with transparent uncertainty reporting.*

---

## 🌟 Key Capabilities & Requirements Compliance

| Requirement | Implementation in SafeGuard AI |
| :--- | :--- |
| **Multi-Channel Ingestion Hub** | **4 Frictionless Ways to Scan**: (1) 1-Click "Paste & Auto-Scan" button; (2) Drag-and-drop raw `.eml`, `.html`, and screenshot files; (3) Interactive **Live Mail & SMS Inbox Simulator** with inline security banners; (4) **Chrome Extension** context menu right-click and **Mobile PWA Web Share Target** from WhatsApp/SMS. |
| **Client-Side Credential Masking** | Runs client-side regex redaction in browser memory before any analysis or API call, masking 6-digit OTPs, 16-digit card numbers, CVVs, ATM PINs, passwords, and bank accounts. |
| **Multimodal Input & OCR** | Local in-browser OCR via `tesseract.js` (English + Hindi) running offline without transmitting screenshots, plus image integrity checking (zero-byte, corruption, truncation, resolution, and blank screen warnings). Optional cloud toggle available. |
| **Passive RFC-822 Email Forensics** | Zero-network email header inspection analyzing SPF/DKIM/DMARC failure (`Authentication-Results:`), display name brand spoofing, Reply-To divergence to free webmail, and deceptive HTML `<a href="...">` anchor-text mismatches. |
| **Multi-Method Detection Engine** | 4-layer fused detection pipeline: **80+ Deterministic Heuristics** + **Safe Passive URL Analysis** + **Entity Impersonation Matcher** + **Contextual Semantic AI** (Gemini structured schema). |
| **7 Security Repos Features** | Integrates fuzzer technique classification from `dnstwist`, Shannon entropy and lexical telemetry from `SIH_URL_Phishing`, Indian TRAI DLT header verification from `SMS-Phishing-Detection`, 5-axis psychological radar from `ScamGuard` & `TrustScan`, forensic report export & Chakshu reporting from `CitizenSafetyApp`, and reverse QR payment trap protection from `PhishGuard`. |
| **Safe Passive URL Analysis** | Strict architectural constraint: **Zero outbound network requests**. Links are never visited. Analyzes Damerau-Levenshtein typosquatting, Cyrillic/Greek homoglyphs (\u0430 lookalikes), IP hosts, URL shorteners, and high-risk TLDs. Links in the UI are inert text blocks. |
| **Risk Level & Plain Evidence** | Classifies risk into **Low (0-34)**, **Suspicious (35-64)**, or **High (65-100)**. Features an interactive **Evidentiary Span Highlighter** where suspicious tokens/phrases are color-coded with click-to-explain rule cards. |
| **Uncertainty Transparency** | Explicitly quantifies confidence using cross-engine variance ($\sigma = \text{StdDev}(S_h, S_u, S_i, S_{ai})$) among active analyzers. Base offline confidence is capped at <= 78% with clear reasoning. |
| **Dataset Benchmarking & Generalization** | Built-in `/benchmark` lab with 75 curated ground-truth test cases across banking smishing, digital arrest coercion, courier fraud, and legitimate transactions with a 40 Dev (100%) and 35 Holdout (100%) split. Includes a separate 12-sample **Generalization Test Suite** achieving 100% accuracy on unseen messages. |

---

## 🏗️ System Architecture

```
                    ┌────────────────────────────────────────────────────────┐
                    │ Multi-Channel Ingestion (Text, .EML, OCR, PWA, Chrome) │
                    └───────────────────────────┬────────────────────────────┘
                                                │
                               ┌────────────────▼────────────────┐
                               │ Client-Side Credential Masking  │
                               │ (In-browser memory redaction)   │
                               └────────────────┬────────────────┘
                                                │
           ┌────────────────────────────────────┼────────────────────────────────────┐
           │                                    │                                    │
┌──────────▼──────────────┐         ┌───────────▼────────────┐          ┌────────────▼───────────┐
│  Deterministic Rules    │         │  Safe Passive URL      │          │  Entity Impersonation  │
│  • Urgency & Panic      │         │  • dnstwist Fuzzing    │          │  • 28 Verified Brands  │
│  • Digital Arrest       │         │  • Shannon Entropy     │          │  • TRAI DLT Mismatch   │
│  • Reverse QR traps     │         │  • Cyrillic Homoglyphs │          │  • Official Helplines  │
│  • Protective context   │         │  • Zero-network fetch  │          │  • Domain alignment    │
└──────────┬──────────────┘         └───────────┬────────────┘          └────────────┬───────────┘
           │                                    │                                    │
           └────────────────────────────────────┼────────────────────────────────────┘
                                                │
                                    ┌───────────▼───────────┐
                                    │ RFC-822 Email Parser  │
                                    │ • SPF/DKIM/DMARC auth │
                                    │ • Display spoofing    │
                                    │ • Anchor text mismatch│
                                    └───────────┬───────────┘
                                                │
                                    ┌───────────▼───────────┐
                                    │ Contextual AI Model   │
                                    │ (Gemini JSON Schema)  │
                                    └───────────┬───────────┘
                                                │
                     ┌──────────────────────────▼───────────────────────────┐
                     │ Dynamic Multi-Vector Fusion & Uncertainty Estimator  │
                     └──────────────────────────┬───────────────────────────┘
                                                │
          ┌─────────────────────────────────────┼─────────────────────────────────────┐
          │                                     │                                     │
┌─────────▼──────────────┐            ┌─────────▼──────────┐               ┌──────────▼─────────────┐
│ 5-Axis Tactics Radar   │            │ Evidentiary Span   │               │ Actionable Safe Steps  │
│ (Urgency, Fear, Steal, │            │ Highlighter (Spans)│               │ (1930 / TRAI Chakshu / │
│  Financial, Imperson)  │            │ (Click to explain) │               │  Forensic JSON Export) │
└────────────────────────┘            └────────────────────┘               └────────────────────────┘
```

---

## 🚀 Quickstart & Setup

### Prerequisites
- Node.js 18+ (tested on Node 20 / Node 24)
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/anilsambyal547-source/hptuhackathonanil.git
cd hptuhackathonanil

# Install dependencies
npm install

# (Optional) Provide Gemini API Key for online semantic reasoning
# If omitted, the engine automatically uses resilient deterministic heuristics!
echo "GEMINI_API_KEY=your_key_here" > .env.local

# Run production build
npm run build

# Start server
npm run start
```

Visit `http://localhost:3000` in your browser.

---

## 🧪 Comprehensive Verification & Test Suites

Run all verified test suites locally:

```bash
# 1. Malformed and corrupted screenshot test suite (8 conditions)
npx tsx tests/corrupted-images.test.ts

# 2. Client-side credential redaction test suite (7 conditions)
npx tsx tests/credential-masker.test.ts

# 3. RFC-822 passive email header and anchor-text test suite (6 conditions)
npx tsx tests/email-parser.test.ts

# 4. Generalization test suite on 12 unseen messages (100% accuracy)
npx tsx tests/generalization.test.ts

# 5. Core benchmark dataset evaluation (75 samples: 40 Dev / 35 Holdout)
npx tsx scripts/run-bench.ts

# 6. Attack presets multi-span coverage test
npx tsx scripts/test-presets.ts

# 7. Zero outbound network call grep check
git grep -n "fetch(" lib/

# 8. Full ESLint and production build
npm run lint
npm run build
```

---

## 🛡️ Security & Privacy Architecture Constraints

1. **Zero-Fetch URL Sandbox**: Under no circumstances does the server or client issue HTTP `GET`, `HEAD`, or `POST` requests to inspected links.
2. **Zero Credential Persistence**: No passwords, OTPs, or PII are logged or stored. Processing is entirely in-memory and ephemeral.
3. **No Overconfident Assertions**: SafeGuard transparently reports its confidence and encourages verification through official portals and helplines (National Cybercrime Portal **1930**).

---

## 👥 Hackathon Team Division
- **Architecture & Decision Fusion**: Core pipeline, Bayesian uncertainty quantification, and multi-vector fusion.
- **Passive URL Sandbox & Heuristics**: Homoglyph mapping, Damerau-Levenshtein typosquatting, `dnstwist` classification, and 80+ regex rule catalog.
- **Frontend & Visual Evidence UX**: Next.js 14 App Router, Tailwind CSS, Framer Motion risk meter, interactive span highlighter, and Live Inbox Simulator.
- **Multimodal OCR & Benchmark Lab**: Screenshot preprocessor, image quality scoring, 75 curated benchmark dataset (40 Dev / 35 Holdout), and Generalization test suite.
