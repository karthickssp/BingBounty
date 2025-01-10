import { mobileTopics } from "./MobileTopics.js";
import { desktopTopics } from "./DesktopTopics.js";
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
    if(automationState.isPaused){
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
      for (let elapsed = 0; elapsed < getRandomTimer(15000, 32000); elapsed += 500) {
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
        `Search performed for: ${query} at ${new Date().toLocaleTimeString()} and total searches Remaining: ${automationState.searchesRemaining}`
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
            `Search performed for: ${query} at ${new Date().toLocaleTimeString()} and total searches Remaining: ${automationState.searchesRemaining}`
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
