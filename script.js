// 🔒 Prevent double-tap zoom on mobile
let lastTouchEnd = 0;
document.addEventListener('touchend', function (e) {
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

let spacePressedAt = null;
let lastSpaceTapTime = 0;
let spaceTapTimeout = null;
let spaceDidLongPress = false;

function saveCounts() {
  localStorage.setItem("followUps", singleInput.value);
  localStorage.setItem("outbound", doubleInput.value);
  localStorage.setItem("positiveReplies", longInput.value);
}

function showStatus(text) {
  status.textContent = text;
  status.style.opacity = 1;
}

// ✅ Load saved values
window.addEventListener("DOMContentLoaded", () => {
  singleInput.value = localStorage.getItem("followUps") || 0;
  doubleInput.value = localStorage.getItem("outbound") || 0;
  longInput.value = localStorage.getItem("positiveReplies") || 0;
});

// ✅ Input formatting
[singleInput, doubleInput, longInput].forEach(input => {
  input.addEventListener("input", saveCounts);

  input.addEventListener("keydown", (e) => {
    const val = input.value;

    if (e.key === "Backspace" && val.length === 1) {
      e.preventDefault();
      input.value = 0;
      saveCounts();
    }

    if (
      val === "0" &&
      e.key.length === 1 &&
      /^[0-9]$/.test(e.key) &&
      e.key !== "0"
    ) {
      e.preventDefault();
      setTimeout(() => {
        input.value = e.key;
        input.setSelectionRange(1, 1);
        saveCounts();
      }, 0);
    }
  });
});

//
// 📱 Mobile Touch Tap Logic
//

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

//
// 🖱 Desktop Mouse Support (No touchpad)
//

tapArea.addEventListener("pointerdown", (e) => {
  if (e.pointerType !== "mouse") return;

  if (e.detail === 1) {
    tapTimeout = setTimeout(() => {
      singleInput.value = parseInt(singleInput.value) + 1;
      showStatus("Follow ups");
      saveCounts();
    }, 300);
  }
});

tapArea.addEventListener("dblclick", (e) => {
  if (e.pointerType !== "mouse") return;
  clearTimeout(tapTimeout);
  doubleInput.value = parseInt(doubleInput.value) + 1;
  showStatus("Outbound");
  saveCounts();
});

//
// ⌨ Spacebar Input (Desktop)
//

document.addEventListener("keydown", (e) => {
  if (e.code !== "Space" || e.repeat) return;
  e.preventDefault();

  spacePressedAt = Date.now();
  spaceDidLongPress = false;

  // 🔒 Long press triggers after 500ms
  longPressTimeout = setTimeout(() => {
    spaceDidLongPress = true;
    longInput.value = parseInt(longInput.value) + 1;
    showStatus("Positive rep");
    saveCounts();
  }, 500);
});

document.addEventListener("keyup", (e) => {
  if (e.code !== "Space") return;
  e.preventDefault();

  clearTimeout(longPressTimeout);

  if (spaceDidLongPress) return; // ✅ long press already handled

  const now = Date.now();
  const timeSinceLastTap = now - lastSpaceTapTime;

  if (timeSinceLastTap < 300) {
    clearTimeout(spaceTapTimeout);
    doubleInput.value = parseInt(doubleInput.value) + 1;
    showStatus("Outbound");
    saveCounts();
    lastSpaceTapTime = 0;
  } else {
    lastSpaceTapTime = now;
    spaceTapTimeout = setTimeout(() => {
      if (!spaceDidLongPress) {
        singleInput.value = parseInt(singleInput.value) + 1;
        showStatus("Follow ups");
        saveCounts();
      }
    }, 300);
  }
});
