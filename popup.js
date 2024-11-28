let searchLimit = 0;
let searchCount = 0;
const today = new Date().getDate();
const focusTabsCheckbox = document.getElementById("focusTabs");
const searchCountDropdown = document.getElementById("searchCount");
const customTimerInput = document.getElementById("customTimerInput");
const timerDropdown = document.getElementById("timerDropdown");
const saveButton = document.getElementById("save-btn");
const startBtnCustomTimer = document.getElementById("start-btn-1");
const startBtnPredefinedTimer = document.getElementById("start-btn-2");
const startBtnNoTimer = document.getElementById("start-btn-3");
const stopBtn = document.getElementById("stop-btn");
const closeBtn = document.getElementById("close-btn");
const progressBarFill = document.querySelector(".progress-bar-fill");
const limitInfo = document.getElementById("limitInfo");

timerDropdown.addEventListener("change", () => {
  const showCustom = timerDropdown.value === "custom";
  customTimerInput.style.display = showCustom ? "block" : "none";
  if (showCustom) customTimerInput.focus();
});
function getTimerValue() {
  if (timerDropdown.value === "custom") {
    const customValue = parseInt(customTimerInput.value, 10);
    if (isNaN(customValue) || customValue <= 0) {
      alert("Please enter a valid custom timer value.");
      return null;
    }
    return customValue * 1000;
  }
  return parseInt(timerDropdown.value, 10) * 1000;
}
function updateUI(searchCount, searchLimit) {
  chrome.storage.sync.set({lastSearchCount: searchCount});
  const remainingCount = Math.max(searchLimit - searchCount, 0);
  document.getElementById("count").textContent = searchCount;
  document.getElementById("remainingCount").textContent = remainingCount;
  if (progressBarFill) {
    const progressPercent = searchLimit > 0 ? (searchCount / searchLimit) * 100 : 0;
    progressBarFill.style.width = Math.min(progressPercent, 100) + "%";
  }
  console.log(`Updated UI: SearchCount = ${searchCount}, RemainingCount = ${remainingCount}`);
}
chrome.storage.sync.get(
  {
    focusTabs: false,
    searchCount: 0,
    customTimer: 0,
    lastDate: today,
    lastSearchCount: 0,
  },
  (data) => {
    if (data.lastDate !== today) {
      searchCount = 0;
      chrome.storage.sync.set({ lastDate: today, lastSearchCount: 0 });
    } else {
      searchCount = data.lastSearchCount || 0;
    }
    focusTabsCheckbox.checked = data.focusTabs;
    searchCountDropdown.value = data.searchCount || 0;
    timerDropdown.value = data.customTimer > 0 ? data.customTimer / 1000 : 0;
    customTimerInput.value = data.customTimer / 1000 || "";
    searchLimit = parseInt(data.searchCount, 10) || 0;
    console.log("Search count: ", searchCount);
    console.log("Search limit: ", searchLimit);
    console.log("Focus tabs: ", data.focusTabs);
    console.log("Custom timer: ", data.customTimer);
    console.log("Last date: ", data.lastDate);
    limitInfo.style.display = searchLimit > 0 ? "none" : "block";
    if (searchLimit === 0) {
      limitInfo.textContent =
        "Please set the search count to start the automation.";
    }
    updateUI(searchCount, searchLimit);
  }
);

saveButton.addEventListener("click", () => {
  const newSearchLimit = parseInt(searchCountDropdown.value, 10);
  const customTimer = getTimerValue();
  if (isNaN(newSearchLimit) || newSearchLimit <= 0) {
    alert("Please enter a valid search count.");
    return;
  }
  chrome.storage.sync.set(
    {
      focusTabs: focusTabsCheckbox.checked,
      searchCount: newSearchLimit,
      customTimer: customTimer,
      lastDate: today,
      lastSearchCount: searchCount,
    },
    () => {
      updateUI(0, newSearchLimit);
      console.log("Search limit: ", newSearchLimit);
      console.log("Search count: ", searchCount);
      console.log("Focus tabs: ", focusTabs.checked);
      console.log("Custom timer: ", customTimer);
      console.log("Last date: ", today);
      alert("Settings Saved!!!");
    }
  );
});
// Start automation with custom timer
startBtnCustomTimer.addEventListener("click", () => {
  const newSearchLimit = parseInt(searchCountDropdown.value, 10);
  const customTimer = getTimerValue();
  if (
    isNaN(customTimer) ||
    isNaN(newSearchLimit) ||
    customTimer <= 0 ||
    newSearchLimit <= 0
  ) {
    alert("Please enter a valid timer and search count.");
    return;
  }
  searchCount = 0;  // search count starts from beginning
  searchLimit = newSearchLimit;
  updateUI(searchCount, searchLimit);
  console.log("Custom-timer automation is triggered.");
  chrome.runtime.sendMessage({
    action: "startCustomTimer",
    searchCount: searchLimit,
    customTimer: customTimer,
  });
});
// Start automation with predefined timer
startBtnPredefinedTimer.addEventListener("click", () => {
  const newSearchLimit = parseInt(searchCountDropdown.value, 10);
  if (isNaN(newSearchLimit) || newSearchLimit <= 0) {
    alert("Please enter a valid search count.");
    return;
  }
  searchCount = 0;  // search count starts from beginning
  searchLimit = newSearchLimit;
  updateUI(searchCount, searchLimit);
  console.log("Predefined-timer automation is triggered.");
  chrome.runtime.sendMessage({
    action: "startPredefinedTimer",
    searchCount: searchLimit,
  });
});
// Start automation without timer
startBtnNoTimer.addEventListener("click", () => {
  const newSearchLimit = parseInt(searchCountDropdown.value, 10);
  if (isNaN(newSearchLimit) || newSearchLimit <= 0) {
    alert("Please enter a valid search count.");
    return;
  }
  searchCount = 0;  // search count starts from beginning
  searchLimit = newSearchLimit;
  updateUI(searchCount, searchLimit);
  console.log("No-timer automation is triggered.");
  chrome.runtime.sendMessage({
    action: "startNoTimer",
    searchCount: searchLimit,
  });
});
// Stop all automation tasks
stopBtn.addEventListener("click", () => {
  console.log("Stop Automation is triggered.");
  chrome.runtime.sendMessage({ action: "stopAutomation" });
  searchCount = 0;
  updateUI(searchCount, searchLimit);
});
// Close all other opened tabs
closeBtn.addEventListener("click", () => {
  console.log("Close Automation is triggered.");
  chrome.runtime.sendMessage({ action: "closeTabs" });
});
// Listener for background messages to update progress
chrome.runtime.onMessage.addListener((message) => {
  if (message.action == "incrementsearchCount") {
    chrome.storage.sync.get("lastSearchCount", (data) => {
      searchCount = data.lastSearchCount || 0;
      chrome.storage.sync.set({ lastSearchCount: searchCount + 1 }, () => {
        updateUI(searchCount+1, searchLimit);
        console.log(`Search count updated to ${searchCount + 1}`);
      });
    });
  }
});
