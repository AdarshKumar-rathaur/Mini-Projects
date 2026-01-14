const start = document.getElementById("start");
const scoreBoard = document.getElementById("score");
const chancesLeft = document.getElementById("chances-left");
const holes = document.querySelectorAll(".c");
let score = 0;
let chances = 3;
let gameRunning = false;
let hasClicked = false;
let activeTimeout = null;
let nextSpawnTimeout = null;

function getRandomIndex() {
  return Math.floor(Math.random() * holes.length);
}

start.addEventListener("click", () => {
  if (gameRunning) return;
  score = 0;
  chances = 3;
  scoreBoard.textContent = score;
  chancesLeft.textContent = chances;
  gameRunning = true;
  start.disabled = true;
  spawnMole();
});

function clearActive() {
  holes.forEach((h) => h.classList.remove("active"));
}

function spawnMole() {
  if (!gameRunning) return;
  clearActive();
  // clear any pending timers to avoid overlaps
  if (activeTimeout) {
    clearTimeout(activeTimeout);
    activeTimeout = null;
  }
  if (nextSpawnTimeout) {
    clearTimeout(nextSpawnTimeout);
    nextSpawnTimeout = null;
  }
  hasClicked = false;
  const idx = getRandomIndex();
  const hole = holes[idx];
  const speed = Math.max(400, 2000 - score * 40);
  hole.classList.add("active");
  activeTimeout = setTimeout(() => {
    activeTimeout = null;
    if (!hasClicked) {
      hole.classList.remove("active");
      down();
      nextSpawnTimeout = setTimeout(spawnMole, 300);
    }
  }, speed);
}

function down() {
  if (--chances <= 0) {
    gameRunning = false;
    clearActive();
    alert(`Game Over! Your final score is ${score}.`);
  }
  chancesLeft.textContent = chances;
}

// Single set of listeners: click only counts when hole is active
holes.forEach((hole) => {
  hole.addEventListener("pointerdown", () => {
    if (!gameRunning) return;
    if (hole.classList.contains("active")) {
      hasClicked = true;
      // cancel the active disappear timer
      if (activeTimeout) {
        clearTimeout(activeTimeout);
        activeTimeout = null;
      }
      score++;
      scoreBoard.textContent = score;
      hole.classList.remove("active");
      nextSpawnTimeout = setTimeout(spawnMole, 300);
    } else {
      down();
    }
  });
});
