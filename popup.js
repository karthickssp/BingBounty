// Get references to the DOM elements
const focusTabsCheckbox = document.getElementById("focusTabs");
const searchCountInput = document.getElementById("time");
const customTimerInput = document.getElementById("time");
const saveButton = document.getElementById("save-btn");
const startBtnCustomTimer = document.getElementById("start-btn-1");
const startBtnPredefinedTimer = document.getElementById("start-btn-2");
const startBtnNoTimer = document.getElementById("start-btn-3");
const stopBtn = document.getElementById("stop-btn");

// Load saved settings from storage
chrome.storage.sync.get(["focusTabs", "searchCount", "customTimer"], (data) => {
  focusTabsCheckbox.checked = data.focusTabs || false;
  searchCountInput.value = data.searchCount || 1;
  customTimerInput.value = data.customTimer || 10;
});

// Save settings to Chrome storage
saveButton.addEventListener("click", () => {
  chrome.storage.sync.set({
    focusTabs: focusTabsCheckbox.checked,
    searchCount: searchCountInput.value,
    customTimer: customTimerInput.value,
  }, () => {
    alert("Settings saved!");
  });
});

// Start automation with custom timer
startBtnCustomTimer.addEventListener("click", () => {
  const customTimer = parseInt(customTimerInput.value, 10) * 1000;
  const searchCount = parseInt(searchCountInput.value, 10);

  if (isNaN(customTimer) || isNaN(searchCount) || customTimer <= 0) {
    alert("Please enter a valid custom timer and search count.");
    return;
  }

  chrome.runtime.sendMessage({ action: "startCustomTimer", customTimer, searchCount });
  alert("Custom-timer automation started.");
});

// Start automation with predefined timer
startBtnPredefinedTimer.addEventListener("click", () => {
  const searchCount = parseInt(searchCountInput.value, 10);

  chrome.runtime.sendMessage({ action: "startPredefinedTimer", searchCount });
  alert("Predefined-timer automation started.");
});

// Start automation without timer
startBtnNoTimer.addEventListener("click", () => {
  const searchCount = parseInt(searchCountInput.value, 10);

  chrome.runtime.sendMessage({ action: "startNoTimer", searchCount });
  alert("No-timer automation started.");
});

// Stop all automation tasks
stopBtn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "stopAutomation" });
  alert("All automation tasks stopped.");
});
