// Get references to the DOM elements
const focusTabsCheckbox = document.getElementById("focusTabs");
const searchCountDropdown = document.getElementById("searchCount");
const customTimerInput = document.getElementById("timer");
const saveButton = document.getElementById("save-btn");
const startBtnCustomTimer = document.getElementById("start-btn-1");
const startBtnPredefinedTimer = document.getElementById("start-btn-2");
const startBtnNoTimer = document.getElementById("start-btn-3");
const stopBtn = document.getElementById("stop-btn");
const closeBtn = document.getElementById("close-btn");

// Load saved settings from Chrome storage
chrome.storage.sync.get(["focusTabs", "searchCount", "customTimer"], (data) => {
  focusTabsCheckbox.checked = data.focusTabs || false;
  searchCountDropdown.value = data.searchCount || 0;
  customTimerInput.value = data.customTimer || 0;
  console.log("focusTabs: ", focusTabsCheckbox.checked);
  console.log("searchCount: ", searchCountDropdown.value);
  console.log("customTimer: ", customTimerInput.value);
});

// Save settings to Chrome storage
saveButton.addEventListener("click", () => {
  chrome.storage.sync.set({
    focusTabs: focusTabsCheckbox.checked,
    searchCount: searchCountDropdown.value,
    customTimer: customTimerInput.value,
  }, () => {
    console.log("focusTabs: ", focusTabsCheckbox.checked);
    console.log("searchCount: ", searchCountDropdown.value);
    console.log("customTimer: ", customTimerInput.value);
    console.log("Settings saved!");
  });
});

// Start automation with custom timer
startBtnCustomTimer.addEventListener("click", () => {
  const customTimer = parseInt(customTimerInput.value, 10) * 1000;
  const searchCount = parseInt(searchCountDropdown.value, 10);

  if (isNaN(customTimer) || isNaN(searchCount) || customTimer <= 0 || searchCount <= 0) {
    alert("Please enter a valid timer and search count.");
    return;
  }
  console.log("Custom-timer automation is triggered.");
  chrome.runtime.sendMessage({ action: "startCustomTimer", customTimer, searchCount });
  console.log("Custom Timer: ", customTimer);
  console.log("Search Count: ", searchCount);
});

// Start automation with predefined timer
startBtnPredefinedTimer.addEventListener("click", () => {
  const searchCount = parseInt(searchCountDropdown.value, 10);
  if (isNaN(searchCount) || searchCount <= 0) {
    alert("Please enter a valid search count.");
    return;
  }
  console.log("Predefined-timer automation is triggered.");
  chrome.runtime.sendMessage({ action: "startPredefinedTimer", searchCount });
});

// Start automation without timer
startBtnNoTimer.addEventListener("click", () => {
  const searchCount = parseInt(searchCountDropdown.value, 10);
  if (isNaN(searchCount) || searchCount <= 0) {
    alert("Please enter a valid search count.");
    return;
  }
  console.log("No-timer automation is triggered.");
  chrome.runtime.sendMessage({ action: "startNoTimer", searchCount });
});

// Stop all automation tasks
stopBtn.addEventListener("click", () => {
  console.log("Stop Automation is triggered.");
  chrome.runtime.sendMessage({ action: "stopAutomation" });
});

// Close all other opened tabs
closeBtn.addEventListener("click", () => {
  console.log("Close Automation is triggered.");
  chrome.runtime.sendMessage({ action: "closeTabs" });
});