// background.js

// When the extension is installed, set default values for maxMinutes and timeSpent
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ maxMinutes: 10, timeSpent: 0 });

  // Create an alarm that runs every minute
  chrome.alarms.create("trackTime", { periodInMinutes: 1 });
});

chrome.runtime.onStartup.addListener(() => {
  // Reset timeSpent when Chrome restarts
  chrome.storage.sync.set({ timeSpent: 0 });

  // If Chrome is restarted, re-set the alarm
  chrome.alarms.create("trackTime", { periodInMinutes: 1 });
});

// On each alarm (every minute), add 1 minute to the timeSpent
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name !== "trackTime") return;

  // Query the active tab to check if it's a YouTube video page
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs.length) return;

    const tab = tabs[0];
    if (tab.url && tab.url.includes("youtube.com/watch")) {
      // Retrieve current timeSpent and maxMinutes from storage
      chrome.storage.sync.get(["timeSpent", "maxMinutes"], (data) => {
        const newTime = (data.timeSpent || 0) + 60; // Add 60 seconds (1 minute) to the timeSpent
        chrome.storage.sync.set({ timeSpent: newTime });

        const notifyInterval = (data.maxMinutes || 10) * 60; // Set notification interval in seconds

        // If the timeSpent reaches the notifyInterval, show a notification
        if (newTime % notifyInterval === 0) {
          const minutes = newTime / 60;
          chrome.notifications.create({
            type: "basic",
            iconUrl: chrome.runtime.getURL("icons/icon128.png"),
            title: "Focus Alert",
            message: `🎉 You stayed focused for ${minutes} minutes! Keep it up!`,
            priority: 2
          });
        }
      });
    }
  });
});
