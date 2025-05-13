chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ grayscaleEnabled: false });

    chrome.tabs.onCreated.addListener((tab) => {
      applyGrayscale(tab.id);
    });

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status === 'loading') {
        applyGrayscale(tabId);
      }
    });


    chrome.tabs.onActivated.addListener((activeInfo) => {
      applyGrayscale(activeInfo.tabId);
    });


    chrome.action.onClicked.addListener((tab) => {
      chrome.storage.local.get('grayscaleEnabled', (data) => {
        const newState = !data.grayscaleEnabled;
        chrome.storage.local.set({ grayscaleEnabled: newState });
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: toggleGrayscaleContentScript,
          args: [newState]
        });
      });
    });
});


function applyGrayscale(tabId) {
  chrome.storage.local.get('grayscaleEnabled', (data) => {
    const isGrayscaleEnabled = data.grayscaleEnabled;
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: toggleGrayscaleContentScript,
      args: [isGrayscaleEnabled]  
    });
  });
}

function toggleGrayscaleContentScript(isEnabled) {
  const existing = document.getElementById("grayscale-extension-style");

  if (isEnabled && !existing) {
    const style = document.createElement("style");
    style.id = "grayscale-extension-style";
    style.innerText = `
      html {
        filter: grayscale(100%) !important;
        transition: none !important;
      }
    `;
    document.head.appendChild(style);
  } else if (!isEnabled && existing) {
    existing.remove();
  }
}
