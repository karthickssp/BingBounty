let searchInterval;
let searchesRemaining = 0;

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((message) => {
  switch (message.action) {
    case "startCustomTimer":
      startAutomation(message.searchCount, message.customTimer);
      break;
    case "startPredefinedTimer":
      const predefinedTimer = 5000; // Set a predefined interval, e.g., 5 seconds
      startAutomation(message.searchCount, predefinedTimer);
      break;
    case "startNoTimer":
      startNoTimerAutomation(message.searchCount);
      break;
    case "stopAutomation":
      stopAutomation();
      break;
    default:
      console.log("Unknown action:", message.action);
  }
});

// Start automation with a given timer
function startAutomation(searchCount, timer) {
  clearInterval(searchInterval); // Clear any existing interval
  searchesRemaining = searchCount;

  searchInterval = setInterval(() => {
    if (searchesRemaining <= 0) {
      stopAutomation();
      alert("Search automation completed.");
    } else {
      performSearch();
      searchesRemaining--;
    }
  }, timer);
}

// Start automation with no timer (all searches at once)
function startNoTimerAutomation(searchCount) {
  for (let i = 0; i < searchCount; i++) {
    performSearch();
  }
  alert("One-time search automation completed.");
}

// Perform a Bing search
function performSearch() {
  const query = generateRandomSearchQuery();
  const url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;

  chrome.storage.sync.get("focusTabs", (data) => {
    chrome.tabs.create({ url, active: data.focusTabs || false });
  });
}

// Generate a random search query for Bing
function generateRandomSearchQuery() {
  const topics = ["technology", "science", "space", "movies", "health", "sports"];
  return topics[Math.floor(Math.random() * topics.length)] + " " + Date.now();
}

// Stop all automation tasks
function stopAutomation() {
  clearInterval(searchInterval);
  searchesRemaining = 0;
}
