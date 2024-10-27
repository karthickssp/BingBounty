// background.js
let dailySearches = 0;
const maxDailySearches = 30;
const uniqueTerms = new Set();  // Ensure unique terms for each day

// Generate random search term
function generateRandomSearchTerm() {
  const terms = ["example1", "example2", "example3", "example4"]; // Add more unique terms
  let term;
  do {
    term = terms[Math.floor(Math.random() * terms.length)];
  } while (uniqueTerms.has(term));
  uniqueTerms.add(term);
  return term;
}

// Perform a Bing search
function performSearch() {
  if (dailySearches < maxDailySearches) {
    const searchTerm = generateRandomSearchTerm();
    chrome.tabs.create({
      url: `https://www.bing.com/search?q=${encodeURIComponent(searchTerm)}`,
      active: false
    });
    dailySearches++;
  }
}

// Control the search frequency
function startSearchAutomation() {
  const searchInterval = setInterval(() => {
    if (dailySearches >= maxDailySearches) {
      clearInterval(searchInterval);
    } else {
      performSearch();
    }
  }, 5 * 60 * 1000); // 5 minutes interval
}

// Reset searches each day
chrome.alarms.create("resetDailySearches", { when: Date.now(), periodInMinutes: 1440 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "resetDailySearches") {
    dailySearches = 0;
    uniqueTerms.clear();
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "start") {
        startSearchAutomation();
        sendResponse({status: "Started"});
    } else if (message.action === "stop") {
        clearInterval(searchInterval);
        sendResponse({status: "Stopped"});
    }
});
