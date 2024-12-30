let searchLimit = 0;
let searchCount = 0;
let isPaused = false;
let activeAutomation = null;
let username = "Store the email id...";
const today = new Date().getDate();
const headerName = document.getElementById("header-span");
const focusTabsCheckbox = document.getElementById("focusTabs");
const searchCountDropdown = document.getElementById("searchCount");
const customTimerInput = document.getElementById("customTimerInput");
const timerDropdown = document.getElementById("timerDropdown");
const saveButton = document.getElementById("save-btn");
const restButton = document.getElementById("reset-btn");
const startBtnCustomTimer = document.getElementById("start-btn-1");
const startBtnPredefinedTimer = document.getElementById("start-btn-2");
const startBtnNoTimer = document.getElementById("start-btn-3");
const taskBtn = document.getElementById("task-btn");
const taskStatus = document.getElementById("task-status");
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
chrome.storage.sync.get(
  {
    username: "Store the email id...",
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
    console.log("Username: ", data.username);
    console.log("Searched Query count: ", searchCount);
    console.log("Search limit: ", searchLimit);
    console.log("Focus tabs: ", data.focusTabs);
    console.log("Custom timer: ", data.customTimer);
    console.log("Last date: ", data.lastDate);
    headerName.textContent = data.username;
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
  if(username === "Store the email id..."){
    username = prompt("Please enter your email id to proceed.");
    if(username && username.includes("@") && username.includes(".")){
      chrome.storage.sync.set(
        {
          username: username,
          focusTabs: focusTabsCheckbox.checked,
          searchCount: newSearchLimit,
          customTimer: customTimer,
          lastDate: today,
          lastSearchCount: searchCount,
        },
        () => {
          headerName.textContent = username;
          updateUI(0, newSearchLimit);
          console.log("Searched Query count: ", searchCount);
          console.log("Search limit: ", newSearchLimit);
          console.log("Custom timer: ", customTimer);
          console.log("Last date: ", today);
          console.log("Focus tabs: ", focusTabs.checked);
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
        focusTabs: focusTabsCheckbox.checked,
        searchCount: newSearchLimit,
        customTimer: customTimer,
        lastDate: today,
        lastSearchCount: searchCount,
      },
      () => {
        updateUI(searchCount, newSearchLimit);
        console.log("Searched Query count: ", searchCount);
        console.log("Search limit: ", newSearchLimit);
        console.log("Custom timer: ", customTimer);
        console.log("Last date: ", today);
        console.log("Focus tabs: ", focusTabs.checked);
        alert("Settings Saved!!! Please refresh the page.");
      }
    );
  }
});
// Reset all automation tasks
restButton.addEventListener("click", () => {
  console.log("Stop/ Reset is triggered.");
  chrome.runtime.sendMessage({ action: "stopResetAutomation" });
  chrome.storage.sync.set(
    {
      username: "Store the email id...",
      focusTabs: false,
      searchCount: 0,
      customTimer: 0,
      lastDate: today,
      lastSearchCount: 0,
    },
    () => {
      updateUI(0, 0);
      alert("Reset Successfully!!! Please refresh the page.");
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
  searchCount = 0; // search count starts from beginning
  searchLimit = newSearchLimit;
  activeAutomation = "customTimer";
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
  searchCount = 0; // search count starts from beginning
  searchLimit = newSearchLimit;
  activeAutomation = "predefinedTimer";
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
  searchCount = 0; // search count starts from beginning
  searchLimit = newSearchLimit;
  activeAutomation = "noTimer";
  updateUI(searchCount, searchLimit);
  console.log("No-timer automation is triggered.");
  chrome.runtime.sendMessage({
    action: "startNoTimer",
    searchCount: searchLimit,
  });
});
// Pause and resume the automation task
taskBtn.addEventListener("click", () => {
  isPaused = !isPaused;
  if (isPaused) {
    taskBtn.textContent = "Resume Automation";
    taskStatus.textContent = "Resume the task:";
    console.log("Pause is triggered.");
    chrome.runtime.sendMessage({
      action: "pauseAutomation",
      type: activeAutomation,
    });
  } else {
    taskBtn.textContent = "Pause Automation";
    taskStatus.textContent = "Pause the task:";
    console.log("Resume is triggered.");
    chrome.runtime.sendMessage({
      action: "resumeAutomation",
      type: activeAutomation,
    });
  }
});
// Close all other opened tabs
closeBtn.addEventListener("click", () => {
  console.log("Close Automation is triggered.");
  chrome.runtime.sendMessage({ action: "closeTabs" });
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
