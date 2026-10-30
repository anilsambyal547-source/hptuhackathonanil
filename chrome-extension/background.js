// SafeGuard AI Chrome Extension - Background Service Worker

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "safeguard-scan-selection",
    title: "🛡️ Inspect Selected Text with SafeGuard AI",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "safeguard-scan-link",
    title: "🛡️ Passively Inspect Link with SafeGuard AI",
    contexts: ["link"],
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  const payload = info.selectionText || info.linkUrl || "";
  if (!payload) return;

  const appUrl = `http://localhost:3000/?text=${encodeURIComponent(payload)}`;
  chrome.tabs.create({ url: appUrl });
});

