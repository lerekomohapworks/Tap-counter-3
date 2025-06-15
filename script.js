// 🔒 Prevent double-tap zoom on mobile
let lastTouchEnd = 0;
document.addEventListener('touchend', function(e) {
  const now = Date.now();
  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }
  lastTouchEnd = now;
}, { passive: false });

const tapArea = document.getElementById("tapArea");
const status = document.getElementById("statusMessage");

const singleInput = document.getElementById("singleCount");
const doubleInput = document.getElementById("doubleCount");
const longInput = document.getElementById("longCount");

let lastTapTime = 0;
let tapTimeout = null;
let longPressTimeout = null;
let isLongPress = false;

function saveCounts() {
  localStorage.setItem("followUps", singleInput.value);
  localStorage.setItem("outbound", doubleInput.value);
  localStorage.setItem("positiveReplies", longInput.value);
}

function showStatus(text) {
  status.textContent = text;
  status.style.opacity = 1;
}

window.addEventListener("DOMContentLoaded", () => {
  singleInput.value = localStorage.getItem("followUps") || 0;
  doubleInput.value = localStorage.getItem("outbound") || 0;
  longInput.value = localStorage.getItem("positiveReplies") || 0;
});

[singleInput, doubleInput, longInput].forEach(input => {
  // Save on input change
  input.addEventListener("input", saveCounts);

  // 🧠 Backspace turns single digit into 0
  input.addEventListener("keydown", (e) => {
    const val = input.value;

    // If Backspace on a single digit → set to 0
    if (e.key === "Backspace" && val.length === 1) {
      e.preventDefault();
      input.value = 0;
      saveCounts();
    }

    // If value is "0" and user types a digit (not Backspace) → replace it
    if (
      val === "0" &&
      e.key.length === 1 &&
      /^[0-9]$/.test(e.key) &&
      e.key !== "0"
    ) {
      e.preventDefault(); // stop default "03"
      input.value = e.key; // set to just "3"
      saveCounts();
    }
  });
});

// Tap Detection
tapArea.addEventListener("touchstart", (e) => {
  e.preventDefault();
  isLongPress = false;

  longPressTimeout = setTimeout(() => {
    isLongPress = true;
    longInput.value = parseInt(longInput.value) + 1;
    showStatus("Positive rep");
    saveCounts();
  }, 500);
});

tapArea.addEventListener("touchend", (e) => {
  e.preventDefault();
  const now = Date.now();
  const delta = now - lastTapTime;

  clearTimeout(longPressTimeout);

  if (isLongPress) return;

  if (delta < 300) {
    clearTimeout(tapTimeout);
    doubleInput.value = parseInt(doubleInput.value) + 1;
    showStatus("Outbound");
    saveCounts();
    lastTapTime = 0;
  } else {
    lastTapTime = now;
    tapTimeout = setTimeout(() => {
      singleInput.value = parseInt(singleInput.value) + 1;
      showStatus("Follow ups");
      saveCounts();
    }, 300);
  }
});
