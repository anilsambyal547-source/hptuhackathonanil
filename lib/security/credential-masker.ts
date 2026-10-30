/**
 * SafeGuard AI - Client-Side Credential Masking Engine
 * Redacts sensitive credentials (OTPs, PINs, CVVs, card numbers, passwords, bank account numbers)
 * in the user's browser BEFORE any analysis, API dispatch, or AI model processing.
 */

export interface MaskedEntity {
  type: "otp" | "pin" | "cvv" | "card_number" | "password" | "bank_account";
  label: string;
  originalRedacted: string;
}

export interface MaskResult {
  maskedText: string;
  hasMaskedItems: boolean;
  maskedEntities: MaskedEntity[];
  summary: string;
}

export function maskCredentials(text: string): MaskResult {
  if (!text || typeof text !== "string") {
    return {
      maskedText: "",
      hasMaskedItems: false,
      maskedEntities: [],
      summary: "",
    };
  }

  let result = text;
  const entities: MaskedEntity[] = [];

  // 1. Credit / Debit Card Numbers (13-19 digits, formatted with spaces or dashes, or contiguous)
  const cardRegex = /\b(?:\d{4}[ -]?){3}\d{4}\b|\b(?:\d{4}[ -]?){2}\d{5}[ -]?\d{3}\b/g;
  result = result.replace(cardRegex, (match) => {
    const digitsOnly = match.replace(/\D/g, "");
    if (digitsOnly.length >= 13 && digitsOnly.length <= 19) {
      const masked = `${digitsOnly.slice(0, 4)}-****-****-${digitsOnly.slice(-4)}`;
      entities.push({
        type: "card_number",
        label: "Credit/Debit Card Number",
        originalRedacted: masked,
      });
      return masked;
    }
    return match;
  });

  // 2. CVV / CVC (3-4 digits preceded by CVV/CVC context)
  const cvvRegex = /\b(cvv|cvc|cvv2|security code)[\s:=#-]+(?:is\s+)?(\d{3,4})\b/gi;
  result = result.replace(cvvRegex, (_match, prefix) => {
    entities.push({
      type: "cvv",
      label: "Card CVV/CVC",
      originalRedacted: `${prefix}: [MASKED_CVV]`,
    });
    return `${prefix}: [MASKED_CVV]`;
  });

  // 3. OTP / One-Time Passcodes (4-8 digits in OTP context)
  const otpContextRegex = /\b(otp|one[- ]time[- ]password|verification code|auth code|login code|secret code|code)[\s:=#-]+(?:is\s+)?(\d{4,8})\b/gi;
  result = result.replace(otpContextRegex, (_match, prefix, digits) => {
    const maskedOtp = digits.length > 4 ? `**${digits.slice(-2)}` : "****";
    entities.push({
      type: "otp",
      label: "One-Time Password (OTP)",
      originalRedacted: `[OTP: ${maskedOtp}]`,
    });
    return `${prefix}: [MASKED_OTP_${digits.length}DIGIT]`;
  });

  // 4. ATM PIN / UPI PIN / MPIN (4-6 digits in PIN context)
  const pinRegex = /\b(atm pin|upi pin|mpin|secret pin|enter pin|your pin|pin)[\s:=#-]+(?:is\s+)?(\d{4,6})\b/gi;
  result = result.replace(pinRegex, (_match, prefix) => {
    entities.push({
      type: "pin",
      label: "Security PIN / MPIN",
      originalRedacted: `${prefix}: [MASKED_PIN]`,
    });
    return `${prefix}: [MASKED_PIN]`;
  });

  // 5. Plaintext Passwords (password is ..., pwd=...)
  const pwdRegex = /\b(password|passwd|pwd)[\s:=#-]+(?:is\s+)?([^\s,;]{4,30})\b/gi;
  result = result.replace(pwdRegex, (_match, prefix) => {
    entities.push({
      type: "password",
      label: "Plaintext Password",
      originalRedacted: `${prefix}: [MASKED_PASSWORD]`,
    });
    return `${prefix}: [MASKED_PASSWORD]`;
  });

  // 6. Bank Account Numbers (9-18 digits in account context)
  const accRegex = /\b(a\/c|account no\.?|account number|khata sankhya|khata no\.?)[\s:=#-]+(?:is\s+)?(\d{9,18})\b/gi;
  result = result.replace(accRegex, (_match, prefix, accNum) => {
    const maskedAcc = `XX${accNum.slice(-4)}`;
    entities.push({
      type: "bank_account",
      label: "Bank Account Number",
      originalRedacted: `${prefix} ${maskedAcc}`,
    });
    return `${prefix} [MASKED_ACCOUNT_${maskedAcc}]`;
  });

  const hasMaskedItems = entities.length > 0;
  const summary = hasMaskedItems
    ? `Redacted ${entities.length} sensitive credential${entities.length > 1 ? "s" : ""} (${entities.map((e) => e.label).join(", ")}) before transmission.`
    : "";

  return {
    maskedText: result,
    hasMaskedItems,
    maskedEntities: entities,
    summary,
  };
}
