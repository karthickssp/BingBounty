let searchLimit = 0;
let searchCount = 0;
let isPaused = false;
let activeAutomation = null;
let isAutomationRunning = false;
let username = "Store the email id...";
const today = new Date().getDate();
const headerName = document.getElementById("header-span");
const searchDeviceDropdown = document.getElementById("searchDevice");
const searchCountDropdown = document.getElementById("searchCount");
const timerDropdown = document.getElementById("timerDropdown");
const customTimerInput = document.getElementById("customTimerInput");
const focusTabsCheckbox = document.getElementById("focusTabs");
const builtinTimerCheckbox = document.getElementById("builtinTimer");
const saveButton = document.getElementById("save-btn");
const restButton = document.getElementById("reset-btn");
const progressBarFill = document.querySelector(".progress-bar-fill");
const limitInfo = document.getElementById("limitInfo");
const startProcess = document.getElementById("task-btn");
const stopProcess = document.getElementById("stop-btn");

// Custom timer Input visibility
timerDropdown.addEventListener("change", () => {
  const showCustom = timerDropdown.value === "custom";
  customTimerInput.style.display = showCustom ? "block" : "none";
  if (showCustom) customTimerInput.focus();
});

// Get timer in seconds
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

// Update progress Bar based on values
function updateUI(searchCount, searchLimit) {
  chrome.storage.sync.set({ lastSearchCount: searchCount });
  const remainingCount = Math.max(searchLimit - searchCount, 0);
  document.getElementById("count").textContent = searchCount;
  document.getElementById("remainingCount").textContent = remainingCount;
  if (progressBarFill) {
    const progressPercent =
      searchLimit > 0 ? (searchCount / searchLimit) * 100 : 0;
    progressBarFill.style.width = Math.min(progressPercent, 100) + "%";
  }
  console.log(
    `Updated UI: SearchCount = ${searchCount}, RemainingCount = ${remainingCount}`
  );
}

// Get values from local storage
chrome.storage.sync.get(
  {
    username: "Store the email id...",
    searchDevice: null,
    searchCount: 0,
    customTimer: 0,
    focusTabs: false,
    builtinTimer: false,
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
    searchDeviceDropdown.value = data.searchDevice;
    searchCountDropdown.value = data.searchCount || 0;
    timerDropdown.value = data.customTimer > 0 ? data.customTimer / 1000 : 0;
    customTimerInput.value = data.customTimer / 1000 || "";
    searchLimit = parseInt(data.searchCount, 10) || 0;
    focusTabsCheckbox.checked = data.focusTabs;
    builtinTimerCheckbox.checked = data.builtinTimer;
    username = data.username;
    console.log("Username: ", data.username);
    console.log("Search Device: ", data.searchDevice);
    console.log("Search limit: ", searchLimit);
    console.log("Custom timer: ", data.customTimer);
    console.log("Searched Query count: ", data.searchCount);
    console.log("Focus tabs: ", data.focusTabs);
    console.log("Builtin Timer: ", data.builtinTimer);
    console.log("Last date: ", data.lastDate);
    headerName.textContent = data.username;
    limitInfo.style.display = searchLimit > 0 ? "none" : "block";
    if (searchLimit === 0) {
      limitInfo.textContent =
        "Please set all the values to start the automation.";
    }
    updateUI(searchCount, searchLimit);
  }
);

// Save all the values to local storage
saveButton.addEventListener("click", () => {
  const newSearchLimit = parseInt(searchCountDropdown.value, 10);
  const customTimer = getTimerValue();
  const searchDevice = searchDeviceDropdown.value;
  if (isNaN(newSearchLimit) || newSearchLimit <= 0) {
    alert("Please enter a valid search count.");
    return;
  }
  if (searchDevice === "null" || !searchDevice) {
    alert("Please select the device.");
    return;
  }
  if (username === "Store the email id...") {
    username = prompt("Please enter your email id to proceed.");
    if (username && username.includes("@") && username.includes(".")) {
      chrome.storage.sync.set(
        {
          username: username,
          searchDevice: searchDevice,
          searchCount: newSearchLimit,
          customTimer: customTimer,
          focusTabs: focusTabsCheckbox.checked,
          builtinTimer: builtinTimerCheckbox.checked,
          lastDate: today,
          lastSearchCount: searchCount,
        },
        () => {
          headerName.textContent = username;
          updateUI(0, newSearchLimit);
          console.log("Search device: ", searchDevice);
          console.log("Search limit: ", newSearchLimit);
          console.log("Custom timer: ", customTimer);
          console.log("Searched Query count: ", searchCount);
          console.log("Focus tabs: ", focusTabs.checked);
          console.log("Builtin Timer: ", builtinTimer.checked);
          console.log("Last date: ", today);
          alert("Settings Saved!!! Please refresh the page.");
        }
      );
    } else {
      username = "Store the email id...";
      return;
    }
  } else {
    chrome.storage.sync.set(
      {
        username: username,
        searchDevice: searchDevice,
        searchCount: newSearchLimit,
        customTimer: customTimer,
        focusTabs: focusTabsCheckbox.checked,
        builtinTimer: builtinTimerCheckbox.checked,
        lastDate: today,
        lastSearchCount: searchCount,
      },
      () => {
        updateUI(searchCount, newSearchLimit);
        console.log("Search device: ", searchDevice);
        console.log("Search limit: ", newSearchLimit);
        console.log("Custom timer: ", customTimer);
        console.log("Searched Query count: ", searchCount);
        console.log("Focus tabs: ", focusTabs.checked);
        console.log("Builtin Timer: ", builtinTimer.checked);
        console.log("Last date: ", today);
        alert("Settings Saved!!! Please refresh the page.");
      }
    );
  }
});

// Reset all automation tasks
restButton.addEventListener("click", () => {
  console.log("Reset is triggered.");
  chrome.storage.sync.set(
    {
      username: "Store the email id...",
      searchDevice: null,
      searchCount: 0,
      customTimer: 0,
      focusTabs: false,
      builtinTimer: false,
      lastDate: today,
      lastSearchCount: 0,
    },
    () => {
      updateUI(0, 0);
      alert("Reset Successfully!!! Please refresh the page.");
    }
  );
});

// Start/Pause/Resume automation task
startProcess.addEventListener("click", () => {
  const newSearchLimit = parseInt(searchCountDropdown.value, 10);
  const customTimer = getTimerValue();
  const builtinTimer = builtinTimerCheckbox.checked;

  if (!isAutomationRunning) {
    if (builtinTimer) {
      if (isNaN(newSearchLimit) || newSearchLimit <= 0) {
        alert("Please enter a valid search count.");
        return;
      }
      searchCount = 0; // search count starts from the beginning
      searchLimit = newSearchLimit;
      activeAutomation = "builtinTimer";
      updateUI(searchCount, searchLimit);
      console.log("Start Builtin Timer Automation is triggered.");
      chrome.runtime.sendMessage({
        action: "startBuiltinTimer",
        searchCount: searchLimit,
      });
    } else {
      if (
        isNaN(customTimer) ||
        isNaN(newSearchLimit) ||
        customTimer <= 0 ||
        newSearchLimit <= 0
      ) {
        alert("Please enter a valid timer and search count.");
        return;
      }
      searchCount = 0; // search count starts from the beginning
      searchLimit = newSearchLimit;
      activeAutomation = "customTimer";
      updateUI(searchCount, searchLimit);
      console.log("Start Custom automation process is triggered.");
      chrome.runtime.sendMessage({
        action: "startCustomTimer",
        searchCount: searchLimit,
        customTimer: customTimer,
      });
    }
    isAutomationRunning = true;
    startProcess.textContent = "Pause Automation";
  } else if (isPaused) {
    // Resume Automation
    isPaused = false;
    console.log("Resume Automation is triggered.");
    startProcess.textContent = "Pause Automation";
    chrome.runtime.sendMessage({
      action: "resumeAutomation",
      type: activeAutomation,
    });
  } else {
    // Pause Automation
    isPaused = true;
    console.log("Pause Automation is triggered.");
    startProcess.textContent = "Resume Automation";
    chrome.runtime.sendMessage({
      action: "pauseAutomation",
      type: activeAutomation,
    });
  }
});

// Stop all the process
stopProcess.addEventListener("click", () => {
  console.log("Stop Automation is triggered.");
  isPaused = false;
  isAutomationRunning = false;
  startProcess.textContent = "Start Automation";
  chrome.runtime.sendMessage({ action: "stopAutomation" });
});

// Listener for background messages to update progress
chrome.runtime.onMessage.addListener((message) => {
  if (message.action == "incrementsearchCount") {
    chrome.storage.sync.get(
      {
        searchCount: 0,
        lastSearchCount: 0,
      },
      (data) => {
        searchCount = data.lastSearchCount || 0;
        searchLimit = data.searchCount || 0;
        chrome.storage.sync.set({ lastSearchCount: searchCount + 1 }, () => {
          if (searchCount + 1 == searchLimit) {
            isAutomationRunning = false;
            isPaused = false;
            startProcess.textContent = "Start Automation";
          }
          updateUI(searchCount + 1, searchLimit);
          console.log(
            `Search count updated to ${
              searchCount + 1
            } of total limit ${searchLimit}`
          );
        });
      }
    );
  }
});
