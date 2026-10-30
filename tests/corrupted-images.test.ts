/**
 * Unit Tests for Corrupted, Truncated, Zero-Byte, Wrong-Type, Oversized, and Blank Images
 * Asserts each condition ends in a clear descriptive error message without crashing.
 */

import assert from "node:assert";
import { validateImageIntegrity } from "../lib/ocr/image-quality";

function runTests() {
  console.log("Running Corrupted & Malformed Image Integrity Tests...\n");

  // Test 1: Zero-byte image
  {
    const res = validateImageIntegrity({
      base64Data: "",
      mimeType: "image/png",
      fileSizeBytes: 0,
    });
    assert.strictEqual(res.isValid, false);
    assert.strictEqual(res.isReadable, false);
    assert.strictEqual(res.qualityScore, 0);
    assert.ok(res.error?.includes("Zero-byte image payload"));
    console.log("✓ Test 1 Passed: Zero-Byte Image Handled Gracefully ->", res.error);
  }

  // Test 2: Corrupted Base64 sequence
  {
    const res = validateImageIntegrity({
      base64Data: "NOT_VALID_BASE64!@#$%^&*()_+",
      mimeType: "image/png",
      fileSizeBytes: 1024,
    });
    assert.strictEqual(res.isValid, false);
    assert.strictEqual(res.isReadable, false);
    assert.ok(res.error?.includes("Corrupted or truncated image data"));
    console.log("✓ Test 2 Passed: Corrupted Base64 Data Handled Gracefully ->", res.error);
  }

  // Test 3: Truncated header (premature end of stream)
  {
    // "iVBORw==" is just 4 bytes, too short for full png header
    const res = validateImageIntegrity({
      base64Data: "AAAA",
      mimeType: "image/png",
      fileSizeBytes: 10,
    });
    assert.strictEqual(res.isValid, false);
    assert.strictEqual(res.isReadable, false);
    assert.ok(res.error?.toLowerCase().includes("magic") || res.error?.toLowerCase().includes("truncated"));
    console.log("✓ Test 3 Passed: Truncated Header Handled Gracefully ->", res.error);
  }

  // Test 4: Wrong file type (PDF or plain text masquerading as screenshot)
  {
    const res = validateImageIntegrity({
      base64Data: Buffer.from("%PDF-1.4").toString("base64"),
      mimeType: "application/pdf",
      fileSizeBytes: 5000,
    });
    assert.strictEqual(res.isValid, false);
    assert.strictEqual(res.isReadable, false);
    assert.ok(res.error?.includes("Unsupported file format"));
    console.log("✓ Test 4 Passed: Wrong-Type Document Handled Gracefully ->", res.error);
  }

  // Test 5: Oversized image (> 10MB limit)
  {
    const res = validateImageIntegrity({
      // Valid PNG header base64 padded
      base64Data: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      mimeType: "image/png",
      fileSizeBytes: 15 * 1024 * 1024, // 15MB
    });
    assert.strictEqual(res.isValid, false);
    assert.strictEqual(res.isReadable, false);
    assert.ok(res.error?.includes("Oversized image"));
    console.log("✓ Test 5 Passed: Oversized File Handled Gracefully ->", res.error);
  }

  // Test 6: Oversized pixel dimensions (> 8000px)
  {
    const res = validateImageIntegrity({
      base64Data: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      mimeType: "image/png",
      width: 12000,
      height: 9000,
      fileSizeBytes: 50000,
    });
    assert.strictEqual(res.isValid, false);
    assert.strictEqual(res.isReadable, false);
    assert.ok(res.error?.includes("Oversized dimensions"));
    console.log("✓ Test 6 Passed: Oversized Pixel Dimensions Handled Gracefully ->", res.error);
  }

  // Test 7: Blank / Monochromatic screenshot
  {
    const res = validateImageIntegrity({
      base64Data: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      mimeType: "image/png",
      isBlank: true,
      fileSizeBytes: 1000,
    });
    assert.strictEqual(res.isValid, false);
    assert.strictEqual(res.isReadable, false);
    assert.ok(res.error?.includes("Blank screenshot"));
    console.log("✓ Test 7 Passed: Blank Screenshot Handled Gracefully ->", res.error);
  }

  // Test 8: Valid screenshot passes successfully
  {
    const res = validateImageIntegrity({
      base64Data: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      mimeType: "image/png",
      width: 1080,
      height: 1920,
      fileSizeBytes: 250000,
    });
    assert.strictEqual(res.isValid, true);
    assert.strictEqual(res.isReadable, true);
    assert.strictEqual(res.error, undefined);
    console.log("✓ Test 8 Passed: Valid 1080x1920 PNG Passes with score", res.qualityScore);
  }

  console.log("\nAll 8 Malformed & Corrupted Image Tests Passed Successfully!\n");
}

runTests();
