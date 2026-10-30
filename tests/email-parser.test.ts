/**
 * Unit Tests for RFC-822 Passive Email Header & HTML Anchor-Text Parser
 * Verifies SPF, DKIM, DMARC, Display Name Spoofing, Reply-To Divergence, and Anchor-Text Mismatches.
 */

import assert from "node:assert";
import {
  isRawEmail,
  parseEmailForensics,
  findAnchorTextMismatches,
  extractEmailBodyText,
} from "../lib/engine/email-parser";

function runTests() {
  console.log("Running RFC-822 Passive Email Parser Tests...\n");

  // Test 1: Identify valid raw RFC-822 email format vs plain text
  {
    const plainText = "Your electricity will be disconnected tonight. Call 9876543210.";
    assert.strictEqual(isRawEmail(plainText), false, "Plain SMS text should not be detected as raw email");

    const rawEmail = `From: "Support Desk" <support@company.com>\nSubject: Important Notice\n\nHello World`;
    assert.strictEqual(isRawEmail(rawEmail), true, "Headers with From + Subject should be detected as raw email");
    console.log("✓ Test 1 Passed: Raw email signature detection is accurate");
  }

  // Test 2: Authentication failures (SPF=fail, DKIM=fail, DMARC=fail)
  {
    const spoofedEmail = `From: "State Bank of India Support" <no-reply@sbi-fraud-alert.top>
Reply-To: sbi.kyc.desk.claim@gmail.com
Subject: URGENT: Complete NetBanking KYC
Authentication-Results: mx.google.com; spf=fail smtp.mailfrom=sbi-fraud-alert.top; dkim=fail; dmarc=fail

Dear Customer, please verify immediately.`;

    const forensics = parseEmailForensics(spoofedEmail);
    assert.strictEqual(forensics.authResults.spf, "fail");
    assert.strictEqual(forensics.authResults.dkim, "fail");
    assert.strictEqual(forensics.authResults.dmarc, "fail");
    assert.ok(
      forensics.riskFactors.some((r) => r.includes("SPF Verification Failed")),
      "Should log SPF failure risk factor"
    );
    console.log("✓ Test 2 Passed: SPF/DKIM/DMARC failure detection verified");
  }

  // Test 3: Display Name Spoofing (Claims official brand but domain is unauthorized)
  {
    const spoofedBrand = `From: "Reserve Bank of India" <refund-officer@untrusted-host.xyz>
Subject: Refund Approval Notification

Your refund of INR 45,000 has been sanctioned.`;

    const forensics = parseEmailForensics(spoofedBrand);
    assert.strictEqual(forensics.isDisplayNameSpoofed, true);
    assert.ok(
      forensics.riskFactors.some((r) => r.includes("Display Name Spoofing")),
      "Should log display name spoofing reason"
    );
    console.log("✓ Test 3 Passed: Display name impersonation spoofing caught");
  }

  // Test 4: Reply-To Divergence (Reply-To uses free webmail domain like Gmail/Yahoo)
  {
    const replyToTrap = `From: "HDFC Customer Care" <alerts@hdfc-update-portal.org>
Reply-To: hdfc.helpline.desk2024@gmail.com
Subject: Action Required: Card Blocked

Please reply with your registered details.`;

    const forensics = parseEmailForensics(replyToTrap);
    assert.strictEqual(forensics.isReplyToDivergent, true);
    assert.ok(
      forensics.riskFactors.some((r) => r.includes("Reply-To Divergence")),
      "Should catch reply-to redirection to Gmail"
    );
    console.log("✓ Test 4 Passed: Reply-To divergence to free webmail caught");
  }

  // Test 5: Deceptive HTML Anchor-Text Mismatch (Visible text != href destination)
  {
    const htmlBody = `
<p>Dear customer, click below to review your statement:</p>
<p><a href="http://evil-phish.top/sbi/login">https://retail.onlinesbi.sbi/personal</a></p>
<p>And for our helpdesk: <a href="https://support.google.com">https://support.google.com</a></p>
`;
    const mismatches = findAnchorTextMismatches(htmlBody);
    assert.strictEqual(mismatches.length, 1, "Should catch only the deceptive link mismatch");
    assert.strictEqual(mismatches[0].isDeceptive, true);
    assert.ok(mismatches[0].visibleText.includes("retail.onlinesbi.sbi"));
    assert.ok(mismatches[0].href.includes("evil-phish.top"));
    console.log("✓ Test 5 Passed: HTML deceptive anchor-text mismatch caught accurately");
  }

  // Test 6: Body text extraction from multi-part headers
  {
    const emailWithHeaders = `From: alert@service.com
To: user@example.com
Subject: Account Update
Date: Fri, 31 Oct 2026 09:00:00 +0000

Dear user, your recent request has processed successfully.`;

    const body = extractEmailBodyText(emailWithHeaders);
    assert.ok(body.includes("Dear user, your recent request has processed successfully."));
    assert.ok(!body.includes("From: alert@service.com"));
    console.log("✓ Test 6 Passed: Body text cleanly separated from RFC-822 headers");
  }

  console.log("\nAll RFC-822 Email Parser Tests Passed Successfully! (6/6)");
}

runTests();
