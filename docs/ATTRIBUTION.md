# Open Source Attribution & Intellectual Property Record

**Project**: SafeGuard AI  
**Hackathon Track**: Question 02 — Cybersecurity | AI | Web Development  
**Document**: `/docs/ATTRIBUTION.md`

All code in this repository was authored directly during the hackathon. Conceptual patterns, heuristic ideas, and algorithms borrowed or adapted from open-source references are attributed below in compliance with their respective permissive licenses (MIT, Apache-2.0, BSD).

---

## Permissively Licensed Conceptual References

### 1. `elceef/dnstwist`
- **Source**: [https://github.com/elceef/dnstwist](https://github.com/elceef/dnstwist)
- **License**: Apache License 2.0
- **Concepts Adapted**: Damerau-Levenshtein distance calculation, brand substitution, and Unicode homoglyph confusable matching. Re-implemented natively from scratch in TypeScript (`lib/engine/passive-url.ts`).

### 2. `SilentDemonSD/ScamIntelli`
- **Source**: [https://github.com/SilentDemonSD/ScamIntelli](https://github.com/SilentDemonSD/ScamIntelli)
- **License**: Apache License 2.0
- **Concepts Adapted**: Multi-layer heuristic scoring principles, hard indicator confidence floors (instant critical override on high-severity triggers), linguistic pressure detection (ALL-CAPS, exclamation spam), and romanized Hindi/Hinglish scam keyword matrices. Re-implemented natively in TypeScript (`lib/engine/heuristics.ts`).

### 3. `bhaianu264/omniguard-ai` (OmniGuard AI)
- **Source**: [https://dev.to/bhaianu264/omniguard-ai-2520](https://dev.to/bhaianu264/omniguard-ai-2520)
- **License**: MIT License
- **Concepts Adapted**: Stateless zero-DB architecture (in-memory processing of screenshots without persistent storage), transparent visual evidence overlays, and image quality pre-filtering.

### 4. `TelecomsXChangeAPi/OpenTextShield`
- **Source**: [https://github.com/TelecomsXChangeAPi/OpenTextShield](https://github.com/TelecomsXChangeAPi/OpenTextShield)
- **License**: Apache License 2.0
- **Concepts Adapted**: Telecom smishing category taxonomies (bank phishing, delivery scams, utility extortion, legitimate 2FA notifications).

---

## Originality & Clean-Room Statement
- **Zero Closed-Source Code**: No code was copied from unverified, proprietary, or non-permissively licensed repositories.
- **Zero Network Fetch**: Safe passive URL parsing is implemented exclusively via local regular expressions, punycode tables, and algorithmic Levenshtein matrices. No external threat-intelligence lookups or HTTP calls are made to user-submitted links.
- **100% Original TypeScript Implementation**: All heuristics, decision fusion mathematics, React components, and benchmark evaluation suites were written specifically for this project.

