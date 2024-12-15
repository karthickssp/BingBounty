import { topics } from "./Topics.js";
const restPeriod = 900000; // 15 minutes
const maxSearchesPerCycle = 3;
let searchesThisCycle = 0;
let currentIndex = 0;
let automationState = {
  isPaused: false,
  activeAutomation: null,
  searchInterval: null,
  searchesRemaining: 0,
};

const today = new Date().getDate();
const start = Math.max((today - 1) * 30, 0);
const end = Math.min(start + 30, topics.length);
const dayTopics = topics.slice(start, end);
console.log(`topics length: ${topics.length}`);
// Chrome message listener
chrome.runtime.onMessage.addListener((message) => {
  switch (message.action) {
    case "startCustomTimer":
      automationState.isPaused = false;
      automationState.activeAutomation = "customTimer";
      startCustomAutomation(message.searchCount, message.customTimer);
      break;
    case "startPredefinedTimer":
      automationState.isPaused = false;
      automationState.activeAutomation = "predefinedTimer";
      startPreDefinedAutomation(message.searchCount);
      break;
    case "startNoTimer":
      automationState.isPaused = false;
      automationState.activeAutomation = "noTimer";
      startNoTimerAutomation(message.searchCount);
      break;
    case "pauseAutomation":
      automationState.isPaused = true;
      console.log(`Paused ${message.type} automation.`);
      break;
    case "resumeAutomation":
      automationState.isPaused = false;
      console.log(`Resumed ${message.type} automation.`);
      break;
    case "stopResetAutomation":
      stopAutomation();
      break;
    case "closeTabs":
      closeAutomation();
      break;
    default:
      console.log("Invalid action.", message.action);
      break;
  }
});

// Start automation with a custom timer
function startCustomAutomation(searchCount, timer) {
  stopAutomation();
  automationState.searchesRemaining = searchCount;
  automationState.searchInterval = setInterval(() => {
    if (automationState.isPaused) return;
    if (automationState.searchesRemaining <= 0) {
      console.log(
        "Search automation with custom timer is completed successfully."
      );
      stopAutomation();
    } else {
      automationState.searchesRemaining--;
      performSearchOnTab();
      console.log(`Searches remaining: ${automationState.searchesRemaining}`);
    }
  }, timer);
}

// Start automation with a predefined timer with async & await (find proper implementation)
// async function startPreDefinedAutomation(searchCount) {
//     searchesRemaining = searchCount;
//     await initiateSearchCycle();
// }

// async function initiateSearchCycle() {
//     while (searchesRemaining > 0) {
//         for (let i = 0; i < Math.min(maxSearchesPerCycle, searchesRemaining); i++) {
//             performDesktopSearch();
//             searchesRemaining--;
//             await new Promise(resolve => setTimeout(resolve, 15000)); // 15s
//         }
//         await new Promise(resolve => setTimeout(resolve, restPeriod)); // 15m
//     }
// }

// Start automation with a predefined timer
function startPreDefinedAutomation(searchCount) {
  stopAutomation();
  automationState.searchesRemaining = searchCount;
  searchesThisCycle = 0;
  initiateSearchCycle();
}

// Initiates a cycle of 3 searches with a 15-second interval
function initiateSearchCycle() {
  if (automationState.searchesRemaining <= 0) {
    console.log(
      "Search automation with predefined time is completed successfully."
    );
    stopAutomation();
    return;
  }
  for (
    let i = 0;
    i < Math.min(maxSearchesPerCycle, automationState.searchesRemaining);
    i++
  ) {
    setTimeout(() => {
      if (automationState.isPaused) return;
      performSearchOnTab();
      automationState.searchesRemaining--;
      searchesThisCycle++;
      console.log(`Searches remaining: ${automationState.searchesRemaining}`);
    }, i * 15000); // 15 seconds
    console.log(`Search cycle: ${searchesThisCycle}`);
  }
  setTimeout(() => {
    if (!automationState.isPaused && automationState.searchesRemaining > 0) {
      console.log("Search cycle completed. Starting the next cycle.");
      initiateSearchCycle();
    }
  }, restPeriod);
}

// Start automation with no timer (open all tabs at once)
function startNoTimerAutomation(searchCount) {
  if (automationState.isPaused) return;
  for (let i = 0; i < searchCount; i++) {
    performSearch();
  }
  console.log("One-time search automation completed successfully.");
}

// Perform a Bing search
function performSearch() {
  if (automationState.isPaused) return;
  const query = generateSearchQuery();
  chrome.storage.sync.get("focusTabs", (data) => {
    const focusTabs = data.focusTabs || false;
    chrome.tabs.create({ active: focusTabs }, (newTab) => {
      chrome.search.query({ text: query, tabId: newTab.id }, () => {
        console.log(
          `Search performed for: ${query} at ${new Date().toLocaleTimeString()}`
        );
      });
    });
  });
  chrome.runtime.sendMessage({ action: "incrementsearchCount" });
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
  searchesThisCycle = 0;
  console.log("All running tasks are stopped successfully.");
}

// Close all other opened tabs
function closeAutomation() {
  chrome.tabs.query({}, (tabs) => {
    const currentTab = tabs.find((tab) => tab.active);
    if (currentTab) {
      tabs.forEach((tab) => {
        if (tab.id !== currentTab.id) {
          chrome.tabs.remove(tab.id);
        }
      });
    }
  });
}

let searchTabId = null;
function performSearchOnTab() {
  const query = generateSearchQuery();
  if (searchTabId !== null) {
    chrome.search.query({ text: query, tabId: searchTabId }, () => {
      console.log(
        `Search performed for: ${query} at ${new Date().toLocaleTimeString()}`
      );
    });
  } else {
    chrome.storage.sync.get("focusTabs", (data) => {
      const focusTabs = data.focusTabs || false;
      chrome.tabs.create({ active: focusTabs }, (newTab) => {
        searchTabId = newTab.id; // Store the new tab's ID
        chrome.search.query({ text: query, tabId: newTab.id }, () => {
          console.log(
            `Search performed for: ${query} at ${new Date().toLocaleTimeString()}`
          );
        });
      });
    });
  }
  chrome.runtime.sendMessage({ action: "incrementsearchCount" });
}

chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabId === searchTabId) {
    searchTabId = null;
  }
});
