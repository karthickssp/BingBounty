import { mobileTopics, desktopTopics } from "./data.js";

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
const closeBtn = document.getElementById("close-btn");
const restPeriod = 850000;
const maxSearchesPerCycle = 4;

let isMobile = false;
let searchLimit = 0;
let searchCount = 0;
let isAutomationRunning = false;
let username = "Store the email id...";
let searchesCycle = 0;
let currentIndex = 0;
let minTimer = 0;
let maxTimer = 0;
let automationState = {
  isPaused: false,
  activeAutomation: null,
  searchInterval: null,
  searchesRemaining: 0,
};

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
    username = data.username;
    headerName.textContent = data.username;
    searchDeviceDropdown.value = data.searchDevice;
    searchCountDropdown.value = data.searchCount || 0;
    timerDropdown.value = data.customTimer > 0 ? data.customTimer / 1000 : 0;
    customTimerInput.value = data.customTimer / 1000 || "";
    searchLimit = parseInt(data.searchCount, 10) || 0;
    focusTabsCheckbox.checked = data.focusTabs;
    builtinTimerCheckbox.checked = data.builtinTimer;
    limitInfo.style.display = searchLimit > 0 ? "none" : "block";
    if (searchLimit === 0) {
      limitInfo.textContent =
        "Please set all the values to start the automation.";
    }
    isMobile = data.searchDevice == "mobile";
    logInfo(data);
    updateUI(searchCount, searchLimit);
  }
);

const todayLast = new Date().getDate() + 1;
const topics = isMobile ? mobileTopics : desktopTopics;
const start = isMobile
  ? Math.max((todayLast - 1) * 20, 0)
  : Math.max((todayLast - 1) * 30, 0);
const end = isMobile
  ? Math.min(start + 20, topics.length)
  : Math.min(start + 30, topics.length);
const dayTopics = topics.slice(start, end);

// Save all the values to local storage
saveButton.addEventListener("click", () => {
  const newSearchLimit = parseInt(searchCountDropdown.value, 10);
  const customTimer = getTimerValue();
  const searchDevice = searchDeviceDropdown.value;
  searchCount = 0;
  if (isNaN(newSearchLimit) || newSearchLimit <= 0) {
    return alert("Please enter a valid search count.");
  }
  if (!searchDevice || searchDevice === "null") {
    return alert("Please select the device.");
  }
  if (username === "Store the email id...") {
    username = prompt("Please enter your email id to proceed.");
    if (!username || !username.includes("@") || !username.includes(".")) {
      username = "Store the email id...";
      return;
    }
  }

  const settings = {
    username,
    searchDevice,
    searchCount: newSearchLimit,
    customTimer,
    focusTabs: focusTabsCheckbox.checked,
    builtinTimer: builtinTimerCheckbox.checked,
    lastDate: today,
    lastSearchCount: searchCount,
  };

  chrome.storage.sync.set(settings, () => {
    headerName.textContent = username;
    updateUI(searchCount, newSearchLimit);
    logInfo(settings);
    alert("Settings Saved!!! Please refresh the page.");
  });
});

// Utility function to log debug information
function logInfo(data) {
  console.log(`
==================== System Info ====================
  Username           : ${data.username}
  Search Device      : ${data.searchDevice}
  Search Limit       : ${data.searchCount}
  Last Search count  : ${data.lastSearchCount}
  Custom Timer       : ${data.customTimer}
  Focus Tabs         : ${data.focusTabs}
  Builtin Timer      : ${data.builtinTimer}
  Last Date          : ${data.lastDate}
====================================================
  `);
}

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
  const searchDevice = searchDeviceDropdown.value;
  const newSearchLimit = parseInt(searchCountDropdown.value, 10);
  const customTimer = getTimerValue();
  const builtinTimer = builtinTimerCheckbox.checked;
  if (searchDevice === "null" || !searchDevice) {
    alert("Please select the device.");
    return;
  }
  if (!isAutomationRunning) {
    if (builtinTimer) {
      if (isNaN(newSearchLimit) || newSearchLimit <= 0) {
        alert("Please enter a valid search count.");
        return;
      }
      searchCount = 0;
      searchLimit = newSearchLimit;
      updateUI(searchCount, searchLimit);
      console.log("Start Builtin Timer Automation is triggered.");
      automationState.isPaused = false;
      automationState.activeAutomation = "builtinTimer";
      startPreDefinedAutomation(searchLimit);
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
      searchCount = 0;
      searchLimit = newSearchLimit;
      updateUI(searchCount, searchLimit);
      console.log("Start Custom automation process is triggered.");
      automationState.isPaused = false;
      automationState.activeAutomation = "customTimer";
      startCustomAutomation(searchLimit, customTimer);
    }
    isAutomationRunning = true;
    startProcess.textContent = "Pause Automation";
  } else if (automationState.isPaused) {
    automationState.isPaused = false;
    startProcess.textContent = "Pause Automation";
    automationState.isPaused = false;
    console.log(`Resumed ${automationState.activeAutomation} automation.`);
  } else {
    automationState.isPaused = true;
    startProcess.textContent = "Resume Automation";
    automationState.isPaused = true;
    console.log(`Paused ${automationState.activeAutomation} automation.`);
  }
});

// Stop all the process
stopProcess.addEventListener("click", () => {
  console.log("Stop Automation is triggered.");
  automationState.isPaused = false;
  isAutomationRunning = false;
  startProcess.textContent = "Start Automation";
  stopAutomation();
});

// Cose all opened tabs
closeBtn.addEventListener("click", () => {
  if (isAutomationRunning) {
    alert(
      "Please stop the running automation process before closing the tabs."
    );
    return;
  }
  closeAutomation();
});

// Function to increment the search Count and update progress
function incrementsearchCount() {
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
          automationState.isPaused = false;
          startProcess.textContent = "Start Automation";
        }
        updateUI(searchCount + 1, searchLimit);
      });
    }
  );
}

// Function to generate a random timer within a range (min, max)
function getRandomTimer(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to start automation with a custom timer
async function startCustomAutomation(searchCount, timerRange) {
  stopAutomation();
  automationState.searchesRemaining = searchCount;
  minTimer = Math.abs(timerRange - 500);
  maxTimer = Math.abs(timerRange + 4128);
  await performCustomSearch();
}

async function performCustomSearch() {
  while (automationState.searchesRemaining > 0) {
    if (automationState.isPaused) {
      await waitUntilResumed();
    }
    performSearch();
    automationState.searchesRemaining--;
    const nextTimer = getRandomTimer(minTimer, maxTimer);
    for (let elapsed = 0; elapsed < nextTimer; elapsed += 500) {
      if (automationState.isPaused) {
        await waitUntilResumed();
      }
      await delay(500);
    }
  }
  if (automationState.searchesRemaining <= 0) {
    console.log(
      "Search automation with custom time is completed successfully."
    );
    stopAutomation();
    return;
  }
}

// Start automation with a predefined timer
async function startPreDefinedAutomation(searchCount) {
  stopAutomation();
  automationState.searchesRemaining = searchCount;
  searchesCycle = 0;
  await initiateSearchCycle();
}

async function initiateSearchCycle() {
  while (automationState.searchesRemaining > 0) {
    if (automationState.isPaused) {
      await waitUntilResumed();
    }
    searchesCycle++;
    for (
      let i = 0;
      i < Math.min(maxSearchesPerCycle, automationState.searchesRemaining);
      i++
    ) {
      performSearch();
      automationState.searchesRemaining--;
      for (
        let elapsed = 0;
        elapsed < getRandomTimer(15000, 32000);
        elapsed += 500
      ) {
        if (automationState.isPaused) {
          await waitUntilResumed();
        }
        await delay(500);
      }
    }
    console.log(`Search cycle: ${searchesCycle}`);
    for (let elapsed = 0; elapsed < restPeriod; elapsed += 500) {
      if (automationState.isPaused) {
        await waitUntilResumed();
      }
      await delay(500);
    }
  }
  if (automationState.searchesRemaining <= 0) {
    console.log(
      "Search automation with predefined time is completed successfully."
    );
    stopAutomation();
    return;
  }
}

// Wait until automation is resumed
async function waitUntilResumed() {
  while (automationState.isPaused) {
    await delay(500);
  }
}

// Delay function
async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Perform search on single Tab
let searchTabId = null;

function performSearch() {
  const query = generateSearchQuery();
  if (searchTabId !== null) {
    chrome.search.query({ text: query, tabId: searchTabId }, () => {
      console.log(
        `Search performed for: ${query} at ${new Date().toLocaleTimeString()} and total searches Remaining: ${
          automationState.searchesRemaining
        }`
      );
    });
  } else {
    chrome.storage.sync.get("focusTabs", (data) => {
      if (automationState.isPaused) return;
      const focusTabs = data.focusTabs || false;
      chrome.tabs.create({ active: focusTabs }, (newTab) => {
        searchTabId = newTab.id; // Store the new tab's ID
        chrome.search.query({ text: query, tabId: newTab.id }, () => {
          console.log(
            `Search performed for: ${query} at ${new Date().toLocaleTimeString()} and total searches Remaining: ${
              automationState.searchesRemaining
            }`
          );
        });
      });
    });
  }
  incrementsearchCount();
}

// Generate a search query based on the current date with 930 unique words
function generateSearchQuery() {
  const query = dayTopics[currentIndex];
  currentIndex = (currentIndex + 1) % dayTopics.length;
  return query;
}

// Stop all automation tasks
function stopAutomation() {
  clearInterval(automationState.searchInterval);
  automationState.searchInterval = null;
  automationState.searchesRemaining = 0;
  searchesCycle = 0;
  console.log("All running tasks are stopped successfully.");
}

// Close all opened tabs
function closeAutomation() {
  chrome.tabs.query({}, (tabs) => {
    if (isMobile) {
      const emptyTab = chrome.tabs.create({ url: "edge://newtab" });
      tabs.forEach((tab) => {
        if (!emptyTab || tab.id !== emptyTab.id) {
          chrome.tabs.remove(tab.id);
        }
      });
    } else {
      let bingTab = tabs.find(
        (tab) => tab.url && tab.url.includes("rewards.bing.com")
      );
      if (!bingTab) {
        bingTab = chrome.tabs.create({ url: "edge://newtab" });
      }
      tabs.forEach((tab) => {
        if (!bingTab || tab.id !== bingTab.id) {
          chrome.tabs.remove(tab.id);
        }
      });
    }
    console.log("All opened tabs are closed successfully.");
  });
}

chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabId === searchTabId) {
    searchTabId = null;
  }
});
