document.addEventListener("DOMContentLoaded", () => {
  const timerDropdown = document.getElementById("timerDropdown");
  const customTimerInput = document.getElementById("customTimerInput");
  const focusTabsCheckbox = document.getElementById("focusTabs");
  const searchCountDropdown = document.getElementById("searchCount");
  const mobileSearch = document.getElementById("mobileSearch");
  const saveButton = document.getElementById("save-btn");
  const startBtnCustomTimer = document.getElementById("start-btn-1");
  const startBtnPredefinedTimer = document.getElementById("start-btn-2");
  const startBtnNoTimer = document.getElementById("start-btn-3");
  const stopBtn = document.getElementById("stop-btn");
  const closeBtn = document.getElementById("close-btn");
  const limitInfo = document.getElementById("limitInfo");
  const today = new Date().toISOString().split("T")[0];
  const progressBarFill = document.querySelector(".progress-bar-fill");

  let searchCount = 0;
  let searchLimit = 0;

  // Dropdown change logic
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
      return customValue * 1000; // Convert seconds to milliseconds
    }
    return parseInt(timerDropdown.value, 10) * 1000;
  }

  function updateUI() {
    const remainingCount = Math.max(searchLimit - searchCount, 0);
    document.getElementById("count").textContent = searchCount;
    document.getElementById("remainingCount").textContent = remainingCount;
  
    if (progressBarFill) {
      const progressPercent = searchLimit > 0 ? (searchCount / searchLimit) * 100 : 0;
      console.log("Progress bar update:", { searchCount, searchLimit, progressPercent });
      progressBarFill.style.width = Math.min(progressPercent, 100) + "%";
    } else {
      console.error("Progress bar element not found.");
    }
  }
  // Load settings from Chrome storage
  chrome.storage.sync.get(
    {
      focusTabs: false,
      searchCount: 0,
      customTimer: 0,
      mobileSearch: false,
      lastDate: today,
      lastSearchCount: 0,
    },
    (data) => {
      if (data.lastDate !== today) {
        searchCount = 0;
        chrome.storage.sync.set({ lastDate: today, lastSearchCount: 0 }, () => {
          console.log("Daily count reset for a new day.");
        });
      } else {
        searchCount = data.lastSearchCount || 0;
      }
  
      focusTabsCheckbox.checked = data.focusTabs;
      searchCountDropdown.value = data.searchCount || 0;
      timerDropdown.value = (data.customTimer) / 1000 || 3;
      customTimerInput.value = (data.customTimer) / 1000 || "";
      mobileSearch.checked = data.mobileSearch || false;
      searchLimit = parseInt(data.searchCount, 10) || 0;
  
      if (!searchLimit) {
        limitInfo.style.display = "block";
        limitInfo.textContent = "Please set the search count to start the automation.";
      } else {
        limitInfo.style.display = "none";
        limitInfo.textContent = `Search count is set to ${searchLimit}.`;
      }
  
      updateUI();
    }
  );

  function startAutomation(type) {
    const customTimer = getTimerValue();
    const newSearchLimit = parseInt(searchCountDropdown.value, 10);

    if (isNaN(customTimer) || customTimer <= 0 || isNaN(newSearchLimit) || newSearchLimit <= 0) {
      alert("Please enter valid values for timer and search count.");
      return;
    }

    searchLimit = newSearchLimit;
    searchCount = 0;
    updateUI();

    chrome.runtime.sendMessage({
      action: type,
      customTimer,
      searchCount: searchLimit,
    });
  }

  saveButton.addEventListener("click", () => {
    const newSearchLimit = parseInt(searchCountDropdown.value, 10);
    const customTimer = getTimerValue();

    if (isNaN(newSearchLimit) || newSearchLimit <= 0) {
      alert("Please enter a valid search count.");
      return;
    }

    searchLimit = newSearchLimit;
    chrome.storage.sync.set(
      {
        focusTabs: focusTabsCheckbox.checked,
        mobileSearch: mobileSearch.checked,
        searchCount: searchLimit,
        customTimer,
      },
      () => {
        alert("Settings saved!");
        console.log("Settings saved!");
        searchCount = 0; // Reset progress
        updateUI();
      }
    );
  });

  startBtnCustomTimer.addEventListener("click", () =>
    startAutomation(mobileSearch.checked ? "startCustomTimer-Mobile" : "startCustomTimer-Desktop")
  );

  startBtnPredefinedTimer.addEventListener("click", () =>
    startAutomation(mobileSearch.checked ? "startPredefinedTimer-Mobile" : "startPredefinedTimer-Desktop")
  );

  startBtnNoTimer.addEventListener("click", () =>
    startAutomation(mobileSearch.checked ? "startNoTimer-Mobile" : "startNoTimer-Desktop")
  );

  stopBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "stopAutomation" });
    updateUI();
  });

  closeBtn.addEventListener("click", () =>
    chrome.runtime.sendMessage({ action: "closeTabs" })
  );
});
