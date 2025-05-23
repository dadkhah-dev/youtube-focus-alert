document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("minutes");
  const button = document.getElementById("save");
  const reset = document.getElementById("reset");
  const message = document.getElementById("message");

  chrome.storage.sync.get("maxMinutes", ({ maxMinutes }) => {
    input.value = maxMinutes;
  });

  button.addEventListener("click", () => {
    const newValue = parseInt(input.value, 10);
    chrome.storage.sync.set({ maxMinutes: newValue }, () => {
      // Show success message
      message.innerHTML = 'Saved successfully!';
      message.style.display = "block";
      setTimeout(() => {
        message.style.display = "none";
      }, 2000);  
    });
  });

  reset.addEventListener("click", () => {
    chrome.storage.sync.set({ timeSpent: 0 });
    message.innerHTML = 'Resetting time to Zero.';
      message.style.display = "block";
      setTimeout(() => {
        message.style.display = "none";
      }, 2000);  
  });

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60); 
    return `${mins} Minutes`;
  }
  
  function updateTimeSpent() {
    chrome.storage.sync.get("timeSpent", ({ timeSpent }) => {
      document.getElementById("timeSpent").textContent = formatTime(timeSpent || 0);
    });
  }
   
  updateTimeSpent();
  setInterval(updateTimeSpent, 1000);
});
