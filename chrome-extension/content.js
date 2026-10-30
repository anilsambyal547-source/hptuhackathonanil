// SafeGuard AI Content Script for Gmail & WhatsApp Web

(function () {
  // Inject floating scan button
  function injectFloatingShield() {
    if (document.getElementById("safeguard-floating-btn")) return;

    const btn = document.createElement("button");
    btn.id = "safeguard-floating-btn";
    btn.innerHTML = `🛡️ Scan with SafeGuard AI`;
    btn.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999999;
      background: #0f172a;
      color: #38bdf8;
      border: 1px solid #0284c7;
      padding: 10px 18px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 700;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      cursor: pointer;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5), 0 0 15px rgba(56, 189, 248, 0.3);
      transition: all 0.2s ease;
    `;

    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "translateY(-2px) scale(1.03)";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translateY(0) scale(1)";
    });

    btn.addEventListener("click", scanCurrentView);
    document.body.appendChild(btn);
  }

  async function scanCurrentView() {
    let extractedText = "";

    // 1. Gmail open email body
    const gmailBody = document.querySelector(".a3s.aiL") || document.querySelector(".ii.gt");
    if (gmailBody) {
      extractedText = gmailBody.innerText || "";
    }

    // 2. WhatsApp Web active conversation message
    if (!extractedText && window.location.hostname.includes("whatsapp")) {
      const messages = document.querySelectorAll(".copyable-text");
      if (messages.length > 0) {
        const lastMsg = messages[messages.length - 1];
        extractedText = lastMsg.innerText || "";
      }
    }

    // Fallback: Selected text or prompt
    if (!extractedText) {
      extractedText = window.getSelection()?.toString() || "";
    }

    if (!extractedText.trim()) {
      alert("SafeGuard AI: Please select text or open an email/chat to scan.");
      return;
    }

    // Call SafeGuard AI local engine endpoint
    const btn = document.getElementById("safeguard-floating-btn");
    if (btn) btn.innerHTML = `⏳ Analyzing...`;

    try {
      const res = await fetch("http://localhost:3000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: extractedText,
          inputType: "text",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        renderResultOverlay(data);
      } else {
        window.open(`http://localhost:3000/?text=${encodeURIComponent(extractedText)}`, "_blank");
      }
    } catch {
      window.open(`http://localhost:3000/?text=${encodeURIComponent(extractedText)}`, "_blank");
    } finally {
      if (btn) btn.innerHTML = `🛡️ Scan with SafeGuard AI`;
    }
  }

  function renderResultOverlay(result) {
    const existing = document.getElementById("safeguard-result-overlay");
    if (existing) existing.remove();

    const isHigh = result.overallRisk === "high";
    const isSusp = result.overallRisk === "suspicious";

    const overlay = document.createElement("div");
    overlay.id = "safeguard-result-overlay";
    overlay.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 24px;
      z-index: 999999;
      width: 360px;
      background: #0f172a;
      border: 2px solid ${isHigh ? "#ef4444" : isSusp ? "#f59e0b" : "#10b981"};
      border-radius: 20px;
      padding: 18px;
      color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      box-shadow: 0 20px 35px -5px rgba(0,0,0,0.7);
    `;

    overlay.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <span style="font-size:11px; font-weight:800; font-family:monospace; text-transform:uppercase; color:${
          isHigh ? "#f87171" : isSusp ? "#fbbf24" : "#34d399"
        };">
          SafeGuard AI: ${result.overallRisk.toUpperCase()} RISK (${result.riskScore}/100)
        </span>
        <button id="safeguard-close-overlay" style="background:none; border:none; color:#94a3b8; font-size:16px; cursor:pointer;">✕</button>
      </div>
      <p style="font-size:12px; line-height:1.4; color:#e2e8f0; margin-bottom:12px;">
        ${result.plainLanguageSummary}
      </p>
      <div style="font-size:11px; color:#94a3b8; margin-bottom:12px;">
        ${result.heuristicsHits.length} Heuristics • ${result.urlReports.length} URLs Inspected Passively
      </div>
      <a href="http://localhost:3000/?text=${encodeURIComponent(result.inputText)}" target="_blank" style="display:block; text-align:center; background:#0284c7; color:#0f172a; font-weight:700; padding:8px; border-radius:10px; font-size:12px; text-decoration:none;">
        Open Full Forensic Report →
      </a>
    `;

    document.body.appendChild(overlay);
    document.getElementById("safeguard-close-overlay")?.addEventListener("click", () => overlay.remove());
  }

  // Initialize
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectFloatingShield);
  } else {
    injectFloatingShield();
  }
})();

