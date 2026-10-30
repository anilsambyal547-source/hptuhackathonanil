# Project Handoff Report: SafeGuard AI

**Project**: SafeGuard AI — Multimodal Scam Detection, Multi-Method Analysis, Safe Passive URL Inspection & Transparent Risk Assessment  
**Task**: Question 02 | Cybersecurity, AI, Web Development  
**Timestamp**: 2026-10-30T21:45:00+05:30  
**Repository**: [https://github.com/anilsambyal547-source/hptuhackathonanil.git](https://github.com/anilsambyal547-source/hptuhackathonanil.git)  
**Document**: `/docs/HANDOFF_REPORT.md`

---

## 1. What Changed Since the Original Plan

### 1.1 File Ledger (Created, Modified, Deleted)

| File Path | Action | Description & Purpose |
| :--- | :--- | :--- |
| `package.json` | Created / Modified | Added project dependencies: `@google/genai` (v2.32.0), `framer-motion` (v11), `recharts` (v2), `lucide-react`, `clsx`, `tailwind-merge`. |
| `package-lock.json` | Created | Complete lockfile capturing deterministic dependency tree for 458 installed packages. |
| `tsconfig.json` | Modified | Enabled strict mode, path alias `@/*` -> `./*`, and added `"target": "es2022"` for modern ECMAScript compilation. |
| `tailwind.config.ts` | Created / Modified | Configured Tailwind CSS utility scanning across `app/` and `components/`. |
| `postcss.config.mjs` | Created | Configured PostCSS with Tailwind CSS and Autoprefixer. |
| `.eslintrc.json` | Created | Next.js core Web Vitals ESLint rules. |
| `.gitignore` | Created | Standard exclusion for `/node_modules`, `/.next/`, `.env*.local`, and OS metadata. |
| `README.md` | Created / Modified | Production documentation covering architecture, quickstart, security guarantees, and team division. |
| `app/layout.tsx` | Created / Modified | Root layout with dark cybersecurity theme and hackathon metadata. |
| `app/globals.css` | Created / Modified | Dark aesthetic styles, glow utilities, and custom scrollbars. |
| `app/page.tsx` | Created | Main application controller coordinating Scanner, Benchmark Lab, and Architecture views. |
| `app/api/analyze/route.ts` | Created | Server-side `POST` endpoint executing multi-engine scam analysis (`force-dynamic`). |
| `app/api/benchmark/route.ts` | Created | Server-side `GET` endpoint executing 60-sample benchmark evaluation (`force-dynamic`). |
| `app/api/ocr/route.ts` | Created | Server-side `POST` endpoint assessing image quality and running OCR (`force-dynamic`). |
| `components/Navbar.tsx` | Created | Header navigation with live security badge and tab switcher. |
| `components/ScannerInput.tsx` | Created | Input interface for text paste, screenshot upload, clipboard paste (`Ctrl+V`), and 8 attack presets. |
| `components/RiskMeter.tsx` | Created | Animated risk score gauge with Framer Motion and 4-factor subsystem attribution bars. |
| `components/UncertaintyBanner.tsx` | Created | Transparent confidence indicator displaying cross-engine calibration variance and ambiguity warnings. |
| `components/EvidenceHighlighter.tsx` | Created | In-situ text highlighter with color-coded category spans and click-to-explain tooltips. |
| `components/SafeUrlInspectorCard.tsx` | Created | Inert passive link breakdown card displaying homoglyph, typosquat, TLD, and shortener risks. |
| `components/ActionStepsCard.tsx` | Created | Plain-language advisory and prioritized safe next steps with 1930 Cybercrime helpline. |
| `components/BenchmarkDashboard.tsx` | Created | Live benchmark runner UI featuring KPI cards, 3x3 Confusion Matrix, and Recharts graphs. |
| `components/ArchitectureDiagram.tsx` | Created | Visual documentation detailing the 4-pillar detection pipeline and math formulations. |
| `lib/types/index.ts` | Created | Core TypeScript schemas (`ScamAnalysisResult`, `EvidentiarySpan`, `UrlInspectionReport`, etc.). |
| `lib/utils.ts` | Created | Standard `cn` helper combining `clsx` and `tailwind-merge`. |
| `lib/data/suspicious-tlds.ts` | Created | Sets of high-risk TLDs (38 TLDs), deceptive domain keywords (24 terms), and shorteners (19 domains). |
| `lib/data/trusted-entities.ts` | Created | Registry of 25+ trusted banks, couriers, government agencies, telecom, utilities, and job portals. |
| `lib/data/benchmark-dataset.ts` | Created | Curated 60-sample benchmark dataset (35 scam/suspicious variations + 25 authentic notifications). |
| `lib/engine/heuristics.ts` | Created | 80+ deterministic regex patterns, linguistic pressure analysis, and Hinglish smishing vectors. |
| `lib/engine/passive-url.ts` | Created | Zero-fetch passive URL inspector with Damerau-Levenshtein typosquatting and Cyrillic homoglyphs. |
| `lib/engine/impersonation.ts` | Created | Entity brand mismatch detector verifying official domain alignment. |
| `lib/engine/ai-analyzer.ts` | Created | Contextual semantic evaluator via Gemini API with offline structured fallback. |
| `lib/engine/fusion.ts` | Created | Decision fusion engine with hard confidence floors and mathematical variance uncertainty estimation. |
| `lib/engine/pipeline.ts` | Created | Unified orchestrator integrating heuristics, passive URL inspection, impersonation, and AI. |
| `lib/engine/benchmark-runner.ts` | Created | Batch execution harness computing Accuracy, Precision, Recall, Macro-F1, and Confusion Matrix. |
| `lib/ocr/image-quality.ts` | Created | Preprocessor evaluating image resolution, compression artifacts, and contrast. |
| `lib/ocr/canvas-ocr.ts` | Created | Client-side canvas image metrics evaluating blur, Laplacian sharpness variance, and contrast. |
| `docs/research/gap-analysis.md` | Created | Competitive prior art research matrix and gap analysis against problem requirements. |
| `docs/ATTRIBUTION.md` | Created | Open-source licensing record and IP attribution documentation. |
| `docs/HANDOFF_REPORT.md` | Created | Current comprehensive factual handoff document. |

### 1.2 Git Status & Commit History Output

Command: `git status`
```
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

Command: `git log -2 --stat`
```
commit c139159c4c958fe334f3052e1d6e0060fff0f76a
Author: Anil Sambyal <anilsambyal547@gmail.com>
Date:   Fri Oct 30 21:27:53 2026 +0530

    feat: prior art gap fixes, Hinglish vectors, hard confidence floors, 60-sample benchmark, and research docs

 components/ScannerInput.tsx   |  16 ++++-
 docs/ATTRIBUTION.md           |  39 ++++++++++
 docs/research/gap-analysis.md |  51 +++++++++++++
 lib/data/benchmark-dataset.ts | 163 +++++++++++++++++++++++++++++++++++++++++-
 lib/data/trusted-entities.ts  |  28 +++++++-
 lib/engine/fusion.ts          |  21 +++---
 lib/engine/heuristics.ts      |  83 ++++++++++++++++++++-
 lib/ocr/canvas-ocr.ts         |  76 ++++++++++++++++++++
 lib/types/index.ts            |   2 +-
 9 files changed, 464 insertions(+), 15 deletions(-)

commit 422e69b59d3f8f53d8196fe73de72673586e7eeb
Author: Anil Sambyal <anilsambyal547@gmail.com>
Date:   Fri Oct 30 20:49:17 2026 +0530

    feat: complete multimodal scam detection platform with safe passive URL inspection and benchmark suite

 40 files changed, 11400 insertions(+)
```

### 1.3 External Prior Art Adaptation Ledger

| Source Repo / URL | License | Concept / Code Element | Destination File | Classification |
| :--- | :--- | :--- | :--- | :--- |
| `elceef/dnstwist`<br>https://github.com/elceef/dnstwist | Apache-2.0 | Damerau-Levenshtein distance calculation, homoglyph character substitutions (Cyrillic \u0430, \u0441, \u043e, etc.), and brand embedding. | `lib/engine/passive-url.ts` | **Reimplemented idea** (Clean-room TypeScript implementation without external dependencies) |
| `SilentDemonSD/ScamIntelli`<br>https://github.com/SilentDemonSD/ScamIntelli | Apache-2.0 | Hard confidence floor mechanism (enforcing minimum 82% risk on severe indicators), ALL-CAPS screaming ratio, and romanized Hindi / Hinglish smishing patterns (*bijli cut*, *khata block*, *digital arrest*). | `lib/engine/heuristics.ts`<br>`lib/engine/fusion.ts` | **Reimplemented idea** (TypeScript regex rules and weighted floor scoring) |
| `bhaianu264/omniguard-ai`<br>https://dev.to/bhaianu264/omniguard-ai-2520 | MIT | Stateless zero-DB architecture (screenshots processed ephemerally in memory and discarded) and visual evidence overlay tags. | `app/api/ocr/route.ts`<br>`components/EvidenceHighlighter.tsx` | **Reimplemented idea** (Stateless API route & React highlight spans) |
| `TelecomsXChangeAPi/OpenTextShield`<br>https://github.com/TelecomsXChangeAPi/OpenTextShield | Apache-2.0 | Telecom smishing category taxonomies (banking, courier, utilities, legitimate 2FA OTPs). | `lib/data/benchmark-dataset.ts`<br>`lib/types/index.ts` | **Adapted idea** (Expanded category definitions in TypeScript) |

### 1.4 Considered and Rejected Ideas from Prior Art

1. **Python / FastAPI / Docker Backends** (from `ScamIntelli`, `OpenTextShield`, `PhishGuard`):
   - *Reason for rejection*: Introducing a secondary Python server violates the project's pure Next.js 14 App Router architecture, adds ~1.2GB Docker container overhead, introduces cross-origin CORS latency, and creates setup friction during hackathon evaluation. Everything runs sub-2ms in native TypeScript.
2. **Outbound Third-Party Reputation Lookups** (from `ScamGuard` / VirusTotal / PhishTank APIs):
   - *Reason for rejection*: Violates the strict Problem Statement Constraint: *"Never open or navigate to submitted links under any circumstance."* Querying third-party lookup APIs leaks user URLs, queries external servers, and introduces external network dependencies. Safe passive string decomposition is 100% self-contained.
3. **Conversational Honeypot Bot** (from `ScamIntelli`):
   - *Reason for rejection*: Out of scope for Question 02. Engaging scammers in automated conversation creates legal/compliance liability and violates the core requirement to provide plain-language safety steps to the victim.

---

## 2. Problem Statement Compliance Matrix

| Requirement / Constraint | Status | File(s) Implementing It | Verification Method & Evidence |
| :--- | :--- | :--- | :--- |
| **Pasted Raw Text Input** | **MET** | `components/ScannerInput.tsx` lines 40-140 | Verified via browser and `/api/analyze` POST test with raw text string. |
| **Screenshot Input** | **MET** | `components/ScannerInput.tsx` lines 70-110, 200-265 | Verified via file drag-and-drop and clipboard paste listener (`window.addEventListener("paste")`). |
| **OCR Text Extraction** | **MET** | `app/api/ocr/route.ts` lines 20-55 | Verified via Gemini Vision multimodal extraction with fallback text extraction. |
| **Blurry / Low-Res / Corrupted Image Handling** | **MET** | `lib/ocr/image-quality.ts` lines 15-70<br>`lib/ocr/canvas-ocr.ts` lines 10-65 | Verified by passing sub-320px image payloads; returns quality warnings (`isReadable: false`, degradation flags). |
| **Rule-Based Heuristics Engine** | **MET** | `lib/engine/heuristics.ts` lines 15-220 | Verified via benchmark test; 80+ regex rules trigger exact categories and weights. |
| **Safe Passive URL Analysis** | **MET** | `lib/engine/passive-url.ts` lines 1-260 | Code audit confirms zero `fetch()`, `http.get()`, or `dns.resolve()` calls. Evaluated strictly via string parsing. |
| **AI Contextual Semantic Analysis** | **MET** | `lib/engine/ai-analyzer.ts` lines 10-120 | Verified via `/api/analyze` live test; returns Gemini structured JSON schema with local semantic fallback. |
| **Psychological Pressure, Urgency & Fear Detection** | **MET** | `lib/engine/heuristics.ts` lines 65-125 | Tested against `"immediately"`, `"account will be blocked"`, `"digital arrest"`, `"aaj raat bijli cut"`. |
| **Credential / OTP / Payment Solicitation Detection** | **MET** | `lib/engine/heuristics.ts` lines 15-60, 130-170 | Tested against OTP, CVV, ATM PIN, UPI handles (`@okhdfcbank`), and QR code refund bait. |
| **Impersonation of Banks, Couriers, Government, Employers, Officials** | **MET** | `lib/data/trusted-entities.ts` lines 1-280<br>`lib/engine/impersonation.ts` lines 1-100 | Tested against SBI, HDFC, ICICI, India Post, BlueDart, FedEx, CBI, Police, Parivahan, LinkedIn. |
| **Typosquatting, Look-Alike & Homoglyph Attacks** | **MET** | `lib/engine/passive-url.ts` lines 10-65, 175-225 | Tested against Cyrillic `pаypal.com` (U+0430) and `sbi-kyc-verify.top` (Damerau-Levenshtein distance). |
| **URL Shortener Identification** | **MET** | `lib/data/suspicious-tlds.ts` lines 40-70<br>`lib/engine/passive-url.ts` lines 155-165 | Tested against `bit.ly`, `tinyurl.com`, `is.gd`. Returns shortener provider tag. |
| **Open Redirect Detection** | **MET** | `lib/engine/passive-url.ts` lines 168-174 | Tested against `https://google.com/url?q=https://phishing.xyz`. Flags open redirect risk. |
| **Optional Reputation Data (Passive Indicators)** | **MET** | `lib/data/suspicious-tlds.ts` lines 1-35<br>`lib/engine/passive-url.ts` lines 125-140 | Evaluates 38 high-risk TLDs (`.xyz`, `.top`, `.icu`, `.buzz`, etc.) and bare IP hosts without external queries. |
| **Low, Suspicious, High Risk Tiers** | **MET** | `lib/types/index.ts` line 1<br>`lib/engine/fusion.ts` lines 70-76 | Verified in output JSON; maps strictly to `"low" \| "suspicious" \| "high"`. |
| **Exact Evidence Display** | **MET** | `components/EvidenceHighlighter.tsx` lines 1-170 | Verified in UI: highlighted text spans with category badges and click-to-view rationale cards. |
| **Plain-Language Explanation** | **MET** | `lib/engine/fusion.ts` lines 130-150<br>`components/ActionStepsCard.tsx` lines 15-30 | Verified in output summary (e.g. *"High-Risk Scam Alert: This message impersonates..."*). |
| **Safe Actionable Next Steps** | **MET** | `lib/engine/fusion.ts` lines 155-210<br>`components/ActionStepsCard.tsx` lines 30-100 | Verified: prioritized action cards including official helpline 1930 and `cybercrime.gov.in`. |
| **Uncertainty Transparency** | **MET** | `lib/engine/fusion.ts` lines 80-130<br>`components/UncertaintyBanner.tsx` lines 1-80 | Mathematically calibrated via $\sigma = \text{StdDev}(S_h, S_u, S_i, S_{ai})$; penalizes short text and OCR noise. |
| **Dataset Benchmarking** | **MET** | `lib/data/benchmark-dataset.ts` lines 1-360<br>`app/api/benchmark/route.ts`<br>`components/BenchmarkDashboard.tsx` | 60 curated samples evaluated live; computes Accuracy, Precision, Recall, Macro-F1, and Confusion Matrix. |
| **Never Open or Navigate to Submitted Links** | **MET** | `lib/engine/passive-url.ts`<br>`components/SafeUrlInspectorCard.tsx` lines 50-70 | Links rendered exclusively as inert `<code className="select-all">` elements. Zero anchor navigation tags. |
| **Never Prompt, Collect, or Store Credentials** | **MET** | Entire application codebase | Zero input forms asking for credentials; zero database tables; zero credential caching. |
| **Minimal Stored Data & User Privacy** | **MET** | Entire application codebase | 100% ephemeral in-memory processing. Zero database, zero file storage of user messages. |
| **No Claims of 100% Guarantee or Catch-All** | **MET** | `lib/engine/pipeline.ts` lines 65-72<br>`app/page.tsx` lines 110-120 | Prominent disclaimer on every screen: *"No automated tool can guarantee 100% safety. Exercise independent judgment."* |

---

## 3. Real Verification Terminal Outputs

### 3.1 Next.js Production Build Output

Command executed: `npm run build`
```
> hptuhackathn@0.1.0 build
> next build

  ▲ Next.js 14.2.35

   Creating an optimized production build ...
 ✓ Compiled successfully
   Linting and checking validity of types ...
   Collecting page data ...
   Generating static pages (0/5) ...
   Generating static pages (1/5) 
   Generating static pages (2/5) 
   Generating static pages (3/5) 
 ✓ Generating static pages (5/5)
   Finalizing page optimization ...
   Collecting build traces ...

Route (app)                              Size     First Load JS
┌ ○ /                                    146 kB          234 kB
├ ○ /_not-found                          873 B          88.2 kB
├ ƒ /api/analyze                         0 B                0 B
├ ƒ /api/benchmark                       0 B                0 B
└ ƒ /api/ocr                             0 B                0 B
+ First Load JS shared by all            87.4 kB
  ├ chunks/117-c86a41b869f6b521.js       31.7 kB
  ├ chunks/fd9d1056-6922f449a204c2cc.js  53.6 kB
  └ other shared chunks (total)          2 kB


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand

Command exited with code 0.
```

### 3.2 Dataset Benchmark Run Output

Command executed: `Invoke-RestMethod -Uri "http://localhost:3000/api/benchmark" -Method Get`

```json
{
  "totalSamples": 60,
  "scamSamples": 35,
  "legitimateSamples": 25,
  "correctPredictions": 54,
  "accuracy": 90.0,
  "precision": {
    "high": 87.9,
    "suspicious": 50.0,
    "low": 96.0,
    "macroAvg": 78.0
  },
  "recall": {
    "high": 93.5,
    "suspicious": 25.0,
    "low": 96.0,
    "macroAvg": 71.5
  },
  "f1Score": {
    "high": 90.6,
    "suspicious": 33.3,
    "low": 96.0,
    "macroAvg": 73.3
  },
  "confusionMatrix": {
    "actualHigh_predHigh": 29,
    "actualHigh_predSuspicious": 1,
    "actualHigh_predLow": 1,
    "actualSuspicious_predHigh": 3,
    "actualSuspicious_predSuspicious": 1,
    "actualSuspicious_predLow": 0,
    "actualLow_predHigh": 1,
    "actualLow_predSuspicious": 0,
    "actualLow_predLow": 24
  },
  "averageLatencyMs": 0
}
```

### 3.3 Live Attack Analysis Verification

Command executed:
```powershell
$body = @{ text = "Dear SBI user, your NetBanking account has been suspended due to pending KYC. Update PAN immediately at https://sbi-kyc-verify.top or account will be blocked." } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/analyze" -Method Post -Body $body -ContentType "application/json"
```

Result:
- **`overallRisk`**: `"high"` (Risk Score: 86 / 100)
- **`confidencePercent`**: `92%` (Uncertainty: Low)
- **`evidenceSpans`**:
  - `span-urg-immediate-deadline` ("immediately" — Manufactured Time Pressure)
  - `span-urg-account-suspension` ("account will be blocked" — Account Suspension Threat)
  - `span-url-sbi-kyc-verify.top` ("https://sbi-kyc-verify.top" — Suspicious Passive URL, High-Risk .top TLD)
  - `span-imp-sbi` ("sbi" — Brand Impersonation: State Bank of India, links to unauthorized domain)
- **`safeNextSteps`**:
  1. Priority: Immediate — "Do Not Click Any Links"
  2. Priority: Immediate — "Never Disclose Security Credentials"
  3. Priority: Recommended — "Verify Directly with State Bank of India (Official Portal: onlinesbi.sbi, Helpline: 1800 1234)"
  4. Priority: Recommended — "Report to National Cyber Crime Portal (cybercrime.gov.in, Helpline: 1930)"

---

## 4. Unverified Areas & Residual Risks

1. **Client-Side Tesseract.js Binary Bundle**:
   - Status: **NOT VERIFIED**. The application uses Gemini Vision for server-side multimodal OCR with canvas image degradation metrics (`lib/ocr/canvas-ocr.ts`). Loading client-side WASM Tesseract workers was omitted to avoid adding 15MB of client-side binary bundle size.
2. **Third-Party Reputation API Lookups**:
   - Status: **INTENTIONALLY EXCLUDED**. As noted above, querying live DNS or commercial reputation APIs (e.g. VirusTotal) is intentionally omitted to uphold the zero-link-navigation and zero-telemetry-leakage constraints.
