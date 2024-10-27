// popup.js
document.getElementById("start-btn").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "start" });
});

document.getElementById("stop-btn").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "stop" });
});

// Listen for start and stop messages
document.getElementById('start-btn').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: "start" }, (response) => {
        if (chrome.runtime.lastError) {
            console.error("Connection error:", chrome.runtime.lastError);
        } else {
            console.log(response.status);
        }
    });
});

