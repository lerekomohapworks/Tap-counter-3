// 1️⃣ Prevent double-tap zoom on mobile browsers
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

let lastTapTime = 0, tapTimeout = null, longPressTimeout = null, isLongPress = false;

tapArea.addEventListener("touchstart", (e) => {
  e.preventDefault(); // block native gestures
  isLongPress = false;
  longPressTimeout = setTimeout(() => {
    isLongPress = true;
    longInput.value = parseInt(longInput.value) + 1;
  }, 500);
});

tapArea.addEventListener("touchend", (e) => {
  e.preventDefault(); // block native gestures
  const now = Date.now(), delta = now - lastTapTime;
  clearTimeout(longPressTimeout);
  if (isLongPress) return;
  if (delta < 300) {
    clearTimeout(tapTimeout);
    doubleInput.value = parseInt(doubleInput.value) + 1;
    lastTapTime = 0;
  } else {
    lastTapTime = now;
    tapTimeout = setTimeout(() => {
      singleInput.value = parseInt(singleInput.value) + 1;
    }, 300);
  }
});
