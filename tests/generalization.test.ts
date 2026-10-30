/**
 * SafeGuard AI - Generalization Test Suite
 * 12 unseen messages (never in dev or holdout benchmark) across:
 * Banks, Couriers, Law Enforcement, Discom Utilities, Recruitment, and Email spoofing.
 *
 * Verifies accuracy >= 90% purely through generalized detection heuristics,
 * passive URL inspection, and fusion logic WITHOUT hardcoded IDs or lookup tables.
 */

import assert from "node:assert";
import { runScamDetectionPipeline } from "../lib/engine/pipeline";
import { OverallRisk } from "../lib/types";

interface GeneralizationSample {
  id: string;
  name: string;
  text: string;
  expectedRisk: OverallRisk;
}

const GENERALIZATION_DATASET: GeneralizationSample[] = [
  {
    id: "gen-scam-01",
    name: "Bank NetBanking suspension phishing with deceptive link",
    text: "Dear Customer, Your PNB NetBanking will be suspended today due to pending Aadhaar linking. Update immediately at http://pnb-aadhaar-verify.xyz to avoid penalty.",
    expectedRisk: "high",
  },
  {
    id: "gen-legit-01",
    name: "Legitimate bank debit transaction notification with protective context",
    text: "Dear Customer, INR 3,500.00 debited from A/C XX4921 via UPI to Swiggy on 30-Oct. Available Bal: INR 28,450.00. If not done by you, SMS BLOCK to 567676. Do not share OTP with anyone.",
    expectedRisk: "low",
  },
  {
    id: "gen-scam-02",
    name: "Digital arrest law enforcement coercion threat",
    text: "NOTICE FROM CBI & CYBER CELL: An FIR #49281 has been registered against your Aadhaar card for money laundering. You are placed under digital arrest. Connect to Skype video interrogation within 15 minutes.",
    expectedRisk: "high",
  },
  {
    id: "gen-scam-03",
    name: "Electricity utility disconnection threat with personal mobile",
    text: "Urgent Notice from State Electricity Board: Your power supply connection will be disconnected tonight at 9:30 PM due to unpaid electricity bill. Contact our discom executive immediately at 9812345678.",
    expectedRisk: "high",
  },
  {
    id: "gen-scam-04",
    name: "Work-from-home YouTube review task recruitment scam",
    text: "Hello! We offer part-time remote work from home. Just like YouTube videos and write Google reviews. Earn 3000 to 5000 daily commission. Send message to HR on Telegram @remote_career_desk.",
    expectedRisk: "high",
  },
  {
    id: "gen-legit-02",
    name: "Legitimate India Post speed post consignment tracking",
    text: "Speed Post consignment EA987654321IN has been booked from Delhi GPO on 28-Oct. Track status at official portal https://www.indiapost.gov.in.",
    expectedRisk: "low",
  },
  {
    id: "gen-scam-05",
    name: "Customs contraband courier seizure fee scam",
    text: "Your DHL Express parcel #DH99281 contains restricted narcotics and contraband seized by customs. Pay clearance penalty fee of Rs 4,999 to release parcel or face arrest: http://dhl-customs-clearance.top",
    expectedRisk: "high",
  },
  {
    id: "gen-legit-03",
    name: "Legitimate power discom utility bill notice with official portal",
    text: "Dear Consumer, your Tata Power bill for consumer no 10293848 of Rs 1,420 is due on 05-Nov. Pay online securely at https://www.tatapower.com. Ignore if already paid.",
    expectedRisk: "low",
  },
  {
    id: "gen-legit-04",
    name: "Legitimate corporate IT security password hygiene advice",
    text: "IT Security Notice: Mandatory password rotation every 90 days. Please change your internal workstation password via Windows Ctrl+Alt+Del menu. Never share your credentials with IT staff.",
    expectedRisk: "low",
  },
  {
    id: "gen-susp-01",
    name: "Ambiguous festival lucky draw notice without links or payment demands",
    text: "Congratulations! Your phone number was selected in the annual festival lucky draw for 2nd prize. Reply with CONFIRM to receive further instructions.",
    expectedRisk: "suspicious",
  },
  {
    id: "gen-susp-02",
    name: "Ambiguous cold recruiter outreach without fees or untrusted channels",
    text: "Dear candidate, we reviewed your resume for Senior Executive opening. If interested in exploring, reply YES or send updated CV.",
    expectedRisk: "suspicious",
  },
  {
    id: "gen-scam-06",
    name: "RFC-822 Spoofed email with SPF/DKIM fail and anchor-text mismatch",
    text: `From: "HDFC Bank Security" <no-reply@hdfc-alert-desk.top>
Reply-To: hdfc.helpline.claim@gmail.com
Subject: Action Required: Confirm NetBanking Login
Authentication-Results: spf=fail; dkim=fail

Dear Valued Customer, please confirm your login:
<a href="http://hdfc-verify-portal.top/login">https://www.hdfcbank.com/netbanking</a>`,
    expectedRisk: "high",
  },
];

async function runGeneralizationSuite() {
  console.log("===============================================================");
  console.log("  SafeGuard AI - Generalization Test Suite (12 Unseen Samples)");
  console.log("===============================================================\n");

  let correct = 0;
  const misclassified: Array<{ id: string; name: string; expected: string; got: string; score: number }> = [];

  for (const sample of GENERALIZATION_DATASET) {
    const result = await runScamDetectionPipeline({
      inputText: sample.text,
      inputType: "text",
      skipAi: true, // Deterministic offline test
    });
    const isCorrect = result.overallRisk === sample.expectedRisk;

    if (isCorrect) {
      correct++;
      console.log(`✓ [PASS] ${sample.id} (${sample.expectedRisk.toUpperCase()} -> ${result.overallRisk.toUpperCase()} [${result.riskScore}%]): ${sample.name}`);
    } else {
      misclassified.push({
        id: sample.id,
        name: sample.name,
        expected: sample.expectedRisk,
        got: result.overallRisk,
        score: result.riskScore,
      });
      console.log(`✗ [FAIL] ${sample.id} (Expected: ${sample.expectedRisk.toUpperCase()}, Got: ${result.overallRisk.toUpperCase()} [${result.riskScore}%]): ${sample.name}`);
    }
  }

  const accuracy = (correct / GENERALIZATION_DATASET.length) * 100;
  console.log("\n---------------------------------------------------------------");
  console.log(`Result: ${correct}/${GENERALIZATION_DATASET.length} (${accuracy.toFixed(1)}%) Passed`);
  console.log("---------------------------------------------------------------");

  if (misclassified.length > 0) {
    console.log("\nMisclassified Generalization Samples:");
    for (const m of misclassified) {
      console.log(` - ${m.id} (${m.name}): Expected ${m.expected.toUpperCase()}, got ${m.got.toUpperCase()} (${m.score}%)`);
    }
  }

  assert.ok(
    accuracy >= 90,
    `Generalization accuracy (${accuracy.toFixed(1)}%) is below the required 90% threshold`
  );

  console.log("\n✓ Generalization Suite PASSED (>= 90% accuracy on unseen test data)!\n");
}

runGeneralizationSuite().catch((err) => {
  console.error("Generalization suite execution failed:", err);
  process.exit(1);
});
