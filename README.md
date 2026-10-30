# SafeGuard AI 🛡️
### Multimodal Scam Detection, Safe Passive URL Inspection & Transparent Risk Assessment

> **Hackathon Submission — Question 02: Cybersecurity | AI | Web Development**  
> *Combines deterministic rule heuristics, safe passive URL decomposition, official entity brand registry, and contextual semantic AI to deliver explainable scam verdicts with calibrated uncertainty.*

---

## 🌟 Key Capabilities & Requirements Compliance

| Requirement | Implementation in SafeGuard AI |
| :--- | :--- |
| **Multimodal Input & OCR** | Accepts raw text paste, screenshot image uploads (drag-and-drop), or clipboard paste (`Ctrl+V`). Includes automated image quality scoring (resolution, contrast, degradation warnings) and multimodal OCR text extraction. |
| **Multi-Method Detection Engine** | 4-layer fused detection pipeline: **80+ Deterministic Heuristics** + **Safe Passive URL Analysis** + **Entity Impersonation Matcher** + **Contextual Semantic AI** (Gemini structured schema). |
| **Safe Passive URL Analysis** | Strict architectural constraint: **Zero outbound network requests**. Links are never visited. Analyzes Damerau-Levenshtein typosquatting, Cyrillic/Greek homoglyphs (\u0430 lookalikes), IP hosts, URL shorteners, and high-risk TLDs. Links in the UI are inert text blocks. |
| **Risk Level & Plain Evidence** | Classifies risk into **Low**, **Suspicious**, or **High**. Features an interactive **Evidentiary Span Highlighter** where suspicious tokens/phrases are color-coded with click-to-explain rule cards. |
| **Uncertainty Transparency** | Explicitly quantifies confidence using cross-engine variance ($\sigma = \text{StdDev}(S_h, S_u, S_i, S_{ai})$), input brevity, and OCR quality. Displays a dedicated Uncertainty Banner when evidence is inconclusive. |
| **Dataset Benchmarking** | Built-in `/benchmark` evaluation lab with 40+ curated ground-truth test cases across banking smishing, digital arrest coercion, courier fraud, and legitimate transactions. Computes live Accuracy, Precision, Recall, F1-Score, and a 3x3 Confusion Matrix. |

---

## 🏗️ System Architecture

```
                    ┌──────────────────────────────────────────────┐
                    │  Multimodal Input (Text / Screenshot OCR)    │
                    └──────────────────────┬───────────────────────┘
                                           │
          ┌────────────────────────────────┼───────────────────────────────┐
          │                                │                               │
┌─────────▼──────────────┐  ┌──────────────▼────────────┐  ┌───────────────▼───────────┐
│  Deterministic Rules   │  │  Safe Passive URL Engine  │  │  Entity Impersonation     │
│  • Manufactured panic  │  │  • Damerau-Levenshtein    │  │  • Top 100+ Banks/Couriers│
│  • Coercion & Arrest   │  │  • Cyrillic Homoglyphs    │  │  • Domain-brand alignment │
│  • OTP/CVV/PIN steals  │  │  • High-risk TLDs (.xyz)  │  │  • Official helplines     │
│  • UPI handle regex    │  │  • Zero-network fetch     │  │                           │
└─────────┬──────────────┘  └──────────────┬────────────┘  └───────────────┬───────────┘
          │                                │                               │
          └────────────────────────────────┼───────────────────────────────┘
                                           │
                                ┌──────────▼──────────┐
                                │ Contextual AI Model │
                                │ (Gemini JSON Schema)│
                                └──────────┬──────────┘
                                           │
                 ┌─────────────────────────▼──────────────────────────┐
                 │ Bayesian / Weighted Fusion & Uncertainty Estimator │
                 └─────────────────────────┬──────────────────────────┘
                                           │
      ┌────────────────────────────────────┼────────────────────────────────────┐
      │                                    │                                    │
┌─────▼───────────────┐          ┌─────────▼──────────┐              ┌──────────▼─────────────┐
│ Visual Risk Gauge   │          │ Evidentiary Span   │              │ Actionable Safe Steps  │
│ (Low/Suspicious/High│          │ Highlighter (Spans)│              │ (1930 / Direct Helplines│
└─────────────────────┘          └────────────────────┘              └────────────────────────┘
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
# If omitted, the engine automatically uses resilient local semantic heuristics!
echo "GEMINI_API_KEY=your_key_here" > .env.local

# Run production build
npm run build

# Start server
npm run start
```

Visit `http://localhost:3000` in your browser.

---

## 🛡️ Security & Privacy Guarantees

1. **Zero-Fetch URL Sandbox**: Under no circumstances does the server or client issue HTTP `GET`, `HEAD`, or `POST` requests to inspected links.
2. **Zero Credential Ingestion**: No passwords, OTPs, or PII are logged or stored. Processing is entirely in-memory and ephemeral.
3. **No Overconfident Guarantees**: SafeGuard transparently reports its confidence and encourages verification through official portals and helplines (National Cybercrime Portal **1930**).

---

## 👥 Hackathon Team Division
- **Architecture & Decision Fusion**: Core pipeline, Bayesian uncertainty quantification, and engine orchestration.
- **Passive URL Sandbox & Heuristics**: Homoglyph mapping, Damerau-Levenshtein typosquatting, 80+ regex rule catalog.
- **Frontend & Visual Evidence UX**: Next.js 14 App Router, Tailwind CSS, Framer Motion risk meter, interactive span highlighter.
- **Multimodal OCR & Benchmark Lab**: Screenshot preprocessor, image quality scoring, 40+ sample benchmark suite with Recharts.
