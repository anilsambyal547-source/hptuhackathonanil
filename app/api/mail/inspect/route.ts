import { NextRequest, NextResponse } from "next/server";
import {
  auditEmailSecurityErrors,
  DEMO_MAILBOX_MESSAGES,
  MailMessage,
} from "@/lib/mail/gmail-client";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let emailToAudit: MailMessage | undefined = body.email;

    if (!emailToAudit && body.messageId) {
      emailToAudit = DEMO_MAILBOX_MESSAGES.find((m) => m.id === body.messageId);
    }

    if (!emailToAudit && body.rawPayload) {
      // Parse raw payload on the fly if provided
      const rawText: string = body.rawPayload;
      const fromMatch = rawText.match(/From:\s*(.+)/i);
      const subjectMatch = rawText.match(/Subject:\s*(.+)/i);
      const replyToMatch = rawText.match(/Reply-To:\s*(.+)/i);
      const authMatch = rawText.match(/Authentication-Results:\s*(.+)/i);

      emailToAudit = {
        id: `raw-${Date.now()}`,
        senderName: fromMatch ? fromMatch[1].split("<")[0].replace(/"/g, "").trim() : "Unknown Sender",
        senderEmail: fromMatch ? fromMatch[1].match(/<([^>]+)>/)?.[1] || fromMatch[1].trim() : "unknown@sender",
        replyTo: replyToMatch ? replyToMatch[1].trim() : undefined,
        recipientEmail: "user@gmail.com",
        subject: subjectMatch ? subjectMatch[1].trim() : "Custom Payload",
        date: "Just now",
        timestamp: "Just now",
        snippet: rawText.slice(0, 100) + "...",
        bodyText: rawText,
        headers: {
          From: fromMatch ? fromMatch[1].trim() : "",
          Subject: subjectMatch ? subjectMatch[1].trim() : "",
          "Reply-To": replyToMatch ? replyToMatch[1].trim() : "",
          "Authentication-Results": authMatch ? authMatch[1].trim() : "",
        },
      };
    }

    if (!emailToAudit) {
      return NextResponse.json(
        { error: "No email payload or valid messageId provided for security inspection" },
        { status: 400 }
      );
    }

    const auditResult = auditEmailSecurityErrors(emailToAudit);

    return NextResponse.json({
      success: true,
      audit: auditResult,
      email: emailToAudit,
    });
  } catch (error) {
    console.error("Inspect API error:", error);
    return NextResponse.json(
      { error: "Failed to perform security error audit on email" },
      { status: 500 }
    );
  }
}
