const tapArea = document.getElementById("tapArea");
const singleInput = document.getElementById("singleCount");
const doubleInput = document.getElementById("doubleCount");
const longInput = document.getElementById("longCount");

let lastTapTime = 0;
let tapTimeout = null;
let longPressTimeout = null;
let isLongPress = false;

tapArea.addEventListener("touchstart", () => {
  isLongPress = false;

  longPressTimeout = setTimeout(() => {
    isLongPress = true;
    longInput.value = parseInt(longInput.value) + 1;
  }, 500); // 500ms = long press
});

tapArea.addEventListener("touchend", () => {
  const currentTime = Date.now();
  const timeSinceLastTap = currentTime - lastTapTime;

  clearTimeout(longPressTimeout);

  if (isLongPress) {
    return; // already counted as long tap
  }

  if (timeSinceLastTap < 300) {
    clearTimeout(tapTimeout); // cancel single tap
    doubleInput.value = parseInt(doubleInput.value) + 1;
    lastTapTime = 0;
  } else {
    lastTapTime = currentTime;
    tapTimeout = setTimeout(() => {
      singleInput.value = parseInt(singleInput.value) + 1;
    }, 300);
  }
});
