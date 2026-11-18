// DIGIkavach Chrome Extension - Background Service Worker

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "digikavach-scan-selection",
    title: "🛡️ Inspect Selected Text with DIGIkavach",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "digikavach-scan-link",
    title: "🛡️ Passively Inspect Link with DIGIkavach",
    contexts: ["link"],
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  const payload = info.selectionText || info.linkUrl || "";
  if (!payload) return;

  const appUrl = `/?text=${encodeURIComponent(payload)}`;
  chrome.tabs.create({ url: appUrl });
});

