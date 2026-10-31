import { NextRequest, NextResponse } from "next/server";
import { DEMO_MAILBOX_MESSAGES, MailMessage } from "@/lib/mail/gmail-client";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const query = searchParams.get("q") || "";

    // If a real Google OAuth access token is provided, attempt to fetch from Google Gmail API
    if (token) {
      try {
        const gmailListRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=15${
            query ? `&q=${encodeURIComponent(query)}` : ""
          }`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (gmailListRes.ok) {
          const listData = await gmailListRes.json();
          const messagesSummary = listData.messages || [];

          // Fetch individual message details
          const fetchedMessages: MailMessage[] = await Promise.all(
            messagesSummary.slice(0, 10).map(async (item: { id: string }) => {
              const detailRes = await fetch(
                `https://gmail.googleapis.com/gmail/v1/users/me/messages/${item.id}?format=full`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              if (!detailRes.ok) return null;
              const msgData = await detailRes.json();

              const headersArr: Array<{ name: string; value: string }> = msgData.payload?.headers || [];
              const headersMap: Record<string, string> = {};
              headersArr.forEach((h) => {
                headersMap[h.name] = h.value;
              });

              const from = headersMap["From"] || "Unknown Sender";
              const subject = headersMap["Subject"] || "No Subject";
              const date = headersMap["Date"] || "Recent";
              const replyTo = headersMap["Reply-To"];
              const authResults = headersMap["Authentication-Results"] || "";

              let bodyText = msgData.snippet || "";
              if (msgData.payload?.parts) {
                const textPart = msgData.payload.parts.find((p: { mimeType: string }) => p.mimeType === "text/plain");
                if (textPart?.body?.data) {
                  bodyText = Buffer.from(textPart.body.data, "base64url").toString("utf-8");
                }
              }

              const isSpfPass = authResults.toLowerCase().includes("spf=pass");
              const isDkimPass = authResults.toLowerCase().includes("dkim=pass");
              const isDmarcPass = authResults.toLowerCase().includes("dmarc=pass");

              return {
                id: msgData.id,
                threadId: msgData.threadId,
                senderName: from.split("<")[0].replace(/"/g, "").trim(),
                senderEmail: from.match(/<([^>]+)>/)?.[1] || from,
                replyTo,
                recipientEmail: headersMap["To"] || "me",
                subject,
                date,
                timestamp: date.slice(0, 16),
                snippet: msgData.snippet || "",
                bodyText,
                headers: headersMap,
                authResults: {
                  spf: isSpfPass ? "pass" : authResults ? "fail" : "none",
                  dkim: isDkimPass ? "pass" : authResults ? "fail" : "none",
                  dmarc: isDmarcPass ? "pass" : authResults ? "fail" : "none",
                },
              };
            })
          );

          const validMessages = fetchedMessages.filter(Boolean) as MailMessage[];
          return NextResponse.json({
            mode: "google_oauth",
            total: validMessages.length,
            messages: validMessages,
          });
        }
      } catch (oauthErr) {
        console.warn("Real Gmail API fetch failed, falling back to Sandbox Mailbox:", oauthErr);
      }
    }

    // Default Sandbox / Demo Mailbox
    let filtered = DEMO_MAILBOX_MESSAGES;
    if (query) {
      const qLower = query.toLowerCase();
      filtered = DEMO_MAILBOX_MESSAGES.filter(
        (m) =>
          m.subject.toLowerCase().includes(qLower) ||
          m.senderName.toLowerCase().includes(qLower) ||
          m.senderEmail.toLowerCase().includes(qLower) ||
          m.bodyText.toLowerCase().includes(qLower)
      );
    }

    return NextResponse.json({
      mode: "demo_sandbox",
      total: filtered.length,
      messages: filtered,
    });
  } catch (error) {
    console.error("Inbox API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch inbox messages" },
      { status: 500 }
    );
  }
}
