let controllerWindowId = null;
let playerWindowId = null;
let playerTabId = null;

chrome.action.onClicked.addListener(async () => {
  // If controller already open, focus it; else create it
  if (controllerWindowId) {
    try {
      await chrome.windows.update(controllerWindowId, { focused: true });
      return;
    } catch (e) {
      controllerWindowId = null;
    }
  }
  const win = await chrome.windows.create({
    url: chrome.runtime.getURL("controller.html"),
    type: "popup",
    width: 260,
    height: 260,
    focused: true
  });
  controllerWindowId = win.id;
});

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (!msg || !msg.cmd) return;

  if (msg.cmd === "open-generator") {
    const url = msg.url;
    if (!url) return;

    // Reuse existing player window/tab if possible
    if (playerTabId) {
      try {
        await chrome.tabs.update(playerTabId, { url, active: true });
        await chrome.windows.update(playerWindowId, { focused: true });
        sendResponse({ ok: true });
        return true;
      } catch (e) {
        playerTabId = null;
        playerWindowId = null;
      }
    }

    const win = await chrome.windows.create({
      url,
      type: "popup",
      width: 420,
      height: 400,
      focused: true
    });

    playerWindowId = win.id;
    // Grab the tab ID from the created window
    if (win.tabs && win.tabs.length) {
      playerTabId = win.tabs[0].id;
    }
    sendResponse({ ok: true });
    return true;
  }

  if (msg.cmd === "focus-player") {
    if (playerWindowId) {
      try {
        await chrome.windows.update(playerWindowId, { focused: true });
        sendResponse({ ok: true });
        return true;
      } catch (e) {
        playerWindowId = null;
        playerTabId = null;
      }
    }
    sendResponse({ ok: false });
    return true;
  }
});

// Cleanup if windows are closed
chrome.windows.onRemoved.addListener((winId) => {
  if (winId === controllerWindowId) controllerWindowId = null;
  if (winId === playerWindowId) {
    playerWindowId = null;
    playerTabId = null;
  }
});
