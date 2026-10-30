/**
 * Unit Tests for Client-Side Credential Masking Engine
 */

import assert from "node:assert";
import { maskCredentials } from "../lib/security/credential-masker.ts";

function runTests() {
  console.log("Running Credential Masker Tests...\n");

  // Test 1: 6-Digit OTP in SMS context
  {
    const input = "Your SBI NetBanking verification OTP is 849201. Never share this code with anyone.";
    const res = maskCredentials(input);
    assert.strictEqual(res.hasMaskedItems, true);
    assert.ok(res.maskedText.includes("[MASKED_OTP_6DIGIT]"));
    assert.ok(!res.maskedText.includes("849201"));
    assert.strictEqual(res.maskedEntities[0].type, "otp");
    console.log("✓ Test 1 Passed: 6-Digit OTP Redaction");
  }

  // Test 2: Credit Card Number formatting (16 digits with spaces)
  {
    const input = "Please verify charge on card 4532 8901 2345 6789 expiring 12/28";
    const res = maskCredentials(input);
    assert.strictEqual(res.hasMaskedItems, true);
    assert.ok(res.maskedText.includes("4532-****-****-6789"));
    assert.ok(!res.maskedText.includes("8901 2345"));
    assert.strictEqual(res.maskedEntities[0].type, "card_number");
    console.log("✓ Test 2 Passed: 16-Digit Card Redaction");
  }

  // Test 3: CVV / CVC Redaction
  {
    const input = "Send card photo with CVV: 739 and expiry date";
    const res = maskCredentials(input);
    assert.strictEqual(res.hasMaskedItems, true);
    assert.ok(res.maskedText.includes("[MASKED_CVV]"));
    assert.ok(!res.maskedText.includes("739"));
    assert.strictEqual(res.maskedEntities[0].type, "cvv");
    console.log("✓ Test 3 Passed: 3-Digit CVV Redaction");
  }

  // Test 4: ATM PIN / UPI PIN Redaction
  {
    const input = "Urgent: Enter your ATM PIN 4912 to unlock your blocked debit card";
    const res = maskCredentials(input);
    assert.strictEqual(res.hasMaskedItems, true);
    assert.ok(res.maskedText.includes("[MASKED_PIN]"));
    assert.ok(!res.maskedText.includes("4912"));
    assert.strictEqual(res.maskedEntities[0].type, "pin");
    console.log("✓ Test 4 Passed: ATM PIN Redaction");
  }

  // Test 5: Plaintext Password Redaction
  {
    const input = "Your temporary password is SecretPass99! Use it to login";
    const res = maskCredentials(input);
    assert.strictEqual(res.hasMaskedItems, true);
    assert.ok(res.maskedText.includes("[MASKED_PASSWORD]"));
    assert.ok(!res.maskedText.includes("SecretPass99!"));
    assert.strictEqual(res.maskedEntities[0].type, "password");
    console.log("✓ Test 5 Passed: Plaintext Password Redaction");
  }

  // Test 6: Bank Account Number
  {
    const input = "Funds credited to Account Number 987654321098 via IMPS";
    const res = maskCredentials(input);
    assert.strictEqual(res.hasMaskedItems, true);
    assert.ok(res.maskedText.includes("[MASKED_ACCOUNT_XX1098]"));
    assert.ok(!res.maskedText.includes("987654321098"));
    console.log("✓ Test 6 Passed: Bank Account Number Redaction");
  }

  // Test 7: Non-sensitive numbers should NOT be masked
  {
    const input = "Your electricity bill for Rs 1450 is due on 30-Oct-2026. Helpline 1930";
    const res = maskCredentials(input);
    assert.strictEqual(res.hasMaskedItems, false);
    assert.strictEqual(res.maskedText, input);
    console.log("✓ Test 7 Passed: Non-Sensitive Text Preserved Unaltered");
  }

  console.log("\nAll 7 Credential Masking Tests Passed Successfully!\n");
}

runTests();
