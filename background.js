function sendMessageToTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "toggle_search" })
        .catch(err => console.log("Waiting for page refresh..."));
    }
  });
}

// Fire on Command+B
chrome.commands.onCommand.addListener((command) => {
  if (command === "open-search") {
    sendMessageToTab();
  }
});

// Fire on Extension Icon Click (as a backup)
chrome.action.onClicked.addListener(() => {
  sendMessageToTab();
});