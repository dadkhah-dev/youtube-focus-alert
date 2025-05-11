let timerStarted = false;

function startFocusTimer() {
  chrome.storage.sync.get("maxMinutes", ({ maxMinutes }) => {
    chrome.runtime.sendMessage({ action: "startTimer", delay: maxMinutes });
    timerStarted = true;
  });
}

function clearFocusTimer() {
  chrome.runtime.sendMessage({ action: "clearTimer" });
  timerStarted = false;
}

const observer = new MutationObserver(() => {
  if (window.location.href.includes("watch")) {
    if (!timerStarted) startFocusTimer();
  } else {
    if (timerStarted) clearFocusTimer();
  }
});

observer.observe(document.body, { childList: true, subtree: true });