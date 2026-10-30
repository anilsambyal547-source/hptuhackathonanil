document.addEventListener("DOMContentLoaded", async () => {
  const scanInput = document.getElementById("scan-text");
  const scanBtn = document.getElementById("scan-btn");

  // If there's an active tab, check if user has selected text or get the tab URL as placeholder
  try {
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (activeTab && activeTab.url && !activeTab.url.startsWith("chrome://")) {
      scanInput.placeholder = `E.g., scan current tab URL:\n${activeTab.url}`;
    }
  } catch (e) {
    // ignore
  }

  scanBtn.addEventListener("click", async () => {
    let text = scanInput.value.trim();
    if (!text) {
      // fallback to active tab URL
      try {
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (activeTab && activeTab.url && !activeTab.url.startsWith("chrome://")) {
          text = activeTab.url;
        }
      } catch (e) {}
    }

    if (!text) return;

    const appUrl = `http://localhost:3000/?text=${encodeURIComponent(text)}`;
    chrome.tabs.create({ url: appUrl });
  });
});

