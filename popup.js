document.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toLocaleDateString();
  let searchLimit = 0;
  let searchCount = 0;

  const focusTabsCheckbox = document.getElementById("focusTabs");
  const timerDropdown = document.getElementById("timerDropdown");
  const searchCountDropdown = document.getElementById("searchCount");
  const customTimerInput = document.getElementById("customTimerInput");
  const saveButton = document.getElementById("save-btn");
  const startBtnCustomTimer = document.getElementById("start-btn-1");
  const startBtnPredefinedTimer = document.getElementById("start-btn-2");
  const startBtnNoTimer = document.getElementById("start-btn-3");
  const stopBtn = document.getElementById("stop-btn");
  const closeBtn = document.getElementById("close-btn");
  const progressBarFill = document.querySelector(".progress-bar-fill");
  const limitInfo = document.getElementById("limitInfo");

  if (!focusTabsCheckbox || !timerDropdown || !searchCountDropdown) {
    console.error("Required DOM elements are missing.");
    return;
  }

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

  function updateUI() {
    const remainingCount = Math.max(searchLimit - searchCount, 0);
    document.getElementById("count").textContent = searchCount;
    document.getElementById("remainingCount").textContent = remainingCount;
    if (!progressBarFill) return;
    const progressPercent =
      searchLimit > 0 ? (searchCount / searchLimit) * 100 : 0;
    progressBarFill.style.width = Math.min(progressPercent, 100) + "%";
  }

  chrome.storage.sync.get(
    {
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
      timerDropdown.value = data.customTimer > 0 ? data.customTimer / 1000 : 3;
      customTimerInput.value = data.customTimer / 1000 || "";
      searchLimit = parseInt(data.searchCount, 10) || 0;

      console.log("Search count: ", searchCount);
      console.log("Search limit: ", searchLimit);
      console.log("Focus tabs: ", data.focusTabs);
      console.log("Custom timer: ", data.customTimer);
      console.log("Last date: ", data.lastDate);
      console.log("Last search count: ", data.lastSearchCount);
      console.log("Timer dropdown: ", timerDropdown.value);
      console.log("Custom timer input: ", customTimerInput.value);
      console.log("Search count dropdown: ", searchCountDropdown.value);
      console.log("Settings Saved");

      limitInfo.style.display = searchLimit
        ? "none"
        : "block";
      limitInfo.textContent = searchLimit
        ? `Search count is set to ${searchLimit}.`
        : "Please set the search count to start the automation.";

      updateUI();
    }
  );

  //Method to start the Automation
  function startAutomation(type) {
    const customTimer = getTimerValue();
    const newSearchLimit = parseInt(searchCountDropdown.value, 10);

    if (
      isNaN(customTimer) ||
      customTimer <= 0 ||
      isNaN(newSearchLimit) ||
      newSearchLimit <= 0
    ) {
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

    chrome.storage.sync.set(
      {
        focusTabs: focusTabsCheckbox.checked,
        searchCount: newSearchLimit,
        customTimer,
      },
      () => alert("Settings saved!")
    );
  });

  startBtnCustomTimer.addEventListener("click", () => {
    startAutomation("startCustomTimer-Desktop");
    console.log("Custom Timer Automation is triggered");
  }
  );

  startBtnPredefinedTimer.addEventListener("click", () => {
    startAutomation("startPredefinedTimer-Desktop");
    console.log("Pre Defined Timer Automation is triggered");
  }
  );

  startBtnNoTimer.addEventListener("click", () => {
    startAutomation("startNoTimer-Desktop");
    console.log("No Timer Automation is triggered");
  });

  stopBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "stopAutomation" });
    console.log("Stop Automation are triggered");
  });

  closeBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "closeTabs" });
    console.log("Closing tabs are triggered");
  });
});

// Start automation with custom timer
startBtnCustomTimer.addEventListener("click", () => {
  const customTimer = parseInt(customTimerInput.value, 10) * 1000;
  const searchCount = parseInt(searchCountDropdown.value, 10);

  if (isNaN(customTimer) || isNaN(searchCount) || customTimer <= 0 || searchCount <= 0) {
    alert("Please enter a valid timer and search count.");
    return;
  }
  console.log("Custom-timer automation is triggered.");
  chrome.runtime.sendMessage({ action: "startCustomTimer", customTimer, searchCount });
  console.log("Custom Timer: ", customTimer);
  console.log("Search Count: ", searchCount);
});

// Start automation with predefined timer
startBtnPredefinedTimer.addEventListener("click", () => {
  const searchCount = parseInt(searchCountDropdown.value, 10);
  if (isNaN(searchCount) || searchCount <= 0) {
    alert("Please enter a valid search count.");
    return;
  }
  console.log("Predefined-timer automation is triggered.");
  chrome.runtime.sendMessage({ action: "startPredefinedTimer", searchCount });
});

// Start automation without timer
startBtnNoTimer.addEventListener("click", () => {
  const searchCount = parseInt(searchCountDropdown.value, 10);
  if (isNaN(searchCount) || searchCount <= 0) {
    alert("Please enter a valid search count.");
    return;
  }
  console.log("No-timer automation is triggered.");
  chrome.runtime.sendMessage({ action: "startNoTimer", searchCount });
});

// Stop all automation tasks
stopBtn.addEventListener("click", () => {
  console.log("Stop Automation is triggered.");
  chrome.runtime.sendMessage({ action: "stopAutomation" });
});

// Close all other opened tabs
closeBtn.addEventListener("click", () => {
  console.log("Close Automation is triggered.");
  chrome.runtime.sendMessage({ action: "closeTabs" });
});
