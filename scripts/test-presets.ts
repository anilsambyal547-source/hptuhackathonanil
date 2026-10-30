import { analyzeScamMessage } from "../lib/engine/pipeline";

const presets = [
  {
    id: "preset-1",
    label: "SBI KYC Smishing",
    text: "Dear SBI user, your NetBanking account has been suspended due to pending KYC. Please update your PAN immediately within 24 hours at https://sbi-kyc-verify.top/login or your account will be blocked.",
  },
  {
    id: "preset-2",
    label: "India Post Delivery",
    text: "India Post: Your package cannot be delivered due to missing house number. Please update delivery address within 12 hours at https://indiapost-parcel-update.xyz or package will be returned to sender.",
  },
  {
    id: "preset-3",
    label: "Digital Arrest CBI",
    text: "CBI Investigation Notice: A non-bailable arrest warrant has been issued against your Aadhaar for international money laundering and illegal parcel seized at customs. Digital arrest initiated. Join Skype interrogation immediately.",
  },
  {
    id: "preset-4",
    label: "Electricity Cut",
    text: "Dear consumer, your electricity power will be disconnected tonight at 9:30 PM because previous month bill was not updated. Immediately contact electricity officer at 9876543210 to avoid power cut.",
  },
];

async function run() {
  for (const p of presets) {
    const res = await analyzeScamMessage({ text: p.text, skipAi: true });
    console.log(`\n=== ${p.label} ===`);
    console.log("Overall Risk:", res.overallRisk, "Score:", res.riskScore);
    console.log("Heuristics:", res.heuristicsHits.map(h => h.id));
    console.log("Evidence Spans Count:", res.evidenceSpans.length);
    res.evidenceSpans.forEach(s => console.log(`  - [${s.category}] (${s.start}-${s.end}): "${s.text}" -> ${s.title}`));
  }
}

run();
