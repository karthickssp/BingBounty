import { mobileTopics } from "./MobileTopics.js";
import { desktopTopics } from "./DesktopTopics.js";
let searchesCycle = 0;
let currentIndex = 0;
let automationState = {
  isPaused: false,
  activeAutomation: null,
  searchInterval: null,
  searchesRemaining: 0,
};
const restPeriod = 850000;
const maxSearchesPerCycle = 4;
const device = chrome.storage.sync.get("device", (data) => {
  return data.device;
});
const isMobile = device === "mobile";
const today = new Date().getDate() + 1;
const topics = isMobile ? mobileTopics : desktopTopics;
const start = isMobile
  ? Math.max((today - 1) * 20, 0)
  : Math.max((today - 1) * 30, 0);
const end = isMobile
  ? Math.min(start + 20, topics.length)
  : Math.min(start + 30, topics.length);
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
    case "startBuiltinTimer":
      automationState.isPaused = false;
      automationState.activeAutomation = "builtinTimer";
      startPreDefinedAutomation(message.searchCount);
      break;
    case "pauseAutomation":
      automationState.isPaused = true;
      console.log(`Paused ${message.type} automation.`);
      break;
    case "resumeAutomation":
      automationState.isPaused = false;
      console.log(`Resumed ${message.type} automation.`);
      break;
    case "stopAutomation":
      automationState.isPaused = false;
      stopAutomation();
      break;
    default:
      console.log("Invalid action.", message.action);
      break;
  }
});

// Function to generate a random timer within a range (min, max)
function getRandomTimer(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startCustomAutomation(searchCount, timerRange) {
  stopAutomation();
  const minTimer = Math.abs(timerRange - 500);
  const maxTimer = Math.abs(timerRange + 3528);
  automationState.searchesRemaining = searchCount;

  function performCustomSearch() {
    if (automationState.isPaused) return;
    if (automationState.searchesRemaining <= 0) {
      console.log(
        "Search automation with custom timer is completed successfully."
      );
      stopAutomation();
      return;
    }
    performSearch();
    automationState.searchesRemaining--;
    console.log(`Searches remaining: ${automationState.searchesRemaining}`);
    const nextTimer = getRandomTimer(minTimer, maxTimer);
    console.log(`Next search will occur in ${nextTimer} ms.`);
    setTimeout(performCustomSearch, nextTimer);
  }
  performCustomSearch();
}

// Start automation with a predefined timer with async & await (find proper implementation)
async function startPreDefinedAutomation(searchCount) {
  stopAutomation();
  automationState.searchesRemaining = searchCount;
  searchesCycle = 0;
  await initiateSearchCycle();
}

async function initiateSearchCycle() {
  while (automationState.searchesRemaining > 0) {
    searchesCycle++;
    for (
      let i = 0;
      i < Math.min(maxSearchesPerCycle, automationState.searchesRemaining);
      i++
    ) {
      performSearch();
      automationState.searchesRemaining--;
      console.log(`Searches remaining: ${automationState.searchesRemaining}`);
      await new Promise((resolve) =>
        setTimeout(resolve, getRandomTimer(15000, 32000))
      );
    }
    console.log(`Search cycle: ${searchesCycle}`);
    await new Promise((resolve) => setTimeout(resolve, restPeriod));
    console.log("Search cycle completed. Starting the next cycle.");
  }
  if (automationState.searchesRemaining <= 0) {
    console.log(
      "Search automation with predefined time is completed successfully."
    );
    stopAutomation();
    return;
  }
}

// Perform search on single Tab
let searchTabId = null;

function performSearch() {
  const query = generateSearchQuery();
  if (searchTabId !== null) {
    chrome.search.query({ text: query, tabId: searchTabId }, () => {
      console.log(
        `Search performed for: ${query} at ${new Date().toLocaleTimeString()}`
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
            `Search performed for: ${query} at ${new Date().toLocaleTimeString()}`
          );
        });
      });
    });
  }
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
  searchesCycle = 0;
  console.log("All running tasks are stopped successfully.");
}

chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabId === searchTabId) {
    searchTabId = null;
  }
});
