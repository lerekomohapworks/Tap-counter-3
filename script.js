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
const singleInput = document.getElementById("singleCount");
const doubleInput = document.getElementById("doubleCount");
const longInput = document.getElementById("longCount");

let lastTapTime = 0;
let tapTimeout = null;
let longPressTimeout = null;
let isLongPress = false;

// ✅ Load saved values on startup
window.addEventListener("DOMContentLoaded", () => {
  singleInput.value = localStorage.getItem("followUps") || 0;
  doubleInput.value = localStorage.getItem("outbound") || 0;
  longInput.value = localStorage.getItem("positiveReplies") || 0;
});

// ✅ Save to localStorage when value changes (manual edit)
[singleInput, doubleInput, longInput].forEach((input, index) => {
  input.addEventListener("input", () => {
    saveCounts();
  });
});

function saveCounts() {
  localStorage.setItem("followUps", singleInput.value);
  localStorage.setItem("outbound", doubleInput.value);
  localStorage.setItem("positiveReplies", longInput.value);
}

tapArea.addEventListener("touchstart", (e) => {
  e.preventDefault();
  isLongPress = false;

  longPressTimeout = setTimeout(() => {
    isLongPress = true;
    longInput.value = parseInt(longInput.value) + 1;
    saveCounts();
  }, 500);
});

tapArea.addEventListener("touchend", (e) => {
  e.preventDefault();
  const currentTime = Date.now();
  const timeSinceLastTap = currentTime - lastTapTime;

  clearTimeout(longPressTimeout);

  if (isLongPress) return;

  if (timeSinceLastTap < 300) {
    clearTimeout(tapTimeout);
    doubleInput.value = parseInt(doubleInput.value) + 1;
    saveCounts();
    lastTapTime = 0;
  } else {
    lastTapTime = currentTime;
    tapTimeout = setTimeout(() => {
      singleInput.value = parseInt(singleInput.value) + 1;
      saveCounts();
    }, 300);
  }
});
