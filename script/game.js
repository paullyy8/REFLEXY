const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
let score = 0;
let gameActive = true;
let gameOver = false;
let timerRunning = true;
let timeLimit = 3; // 3-second time limit
let timeRemaining = timeLimit;
let lastTimeCheck = Date.now(); // Track the last time the clock was checked

// Circle properties
const circleRadius = 30;
let circlePos = { x: canvas.width / 2, y: canvas.height / 2 };  // Start at the center
let circleSpeed = 1.5; // Initial speed of the circle, lower than before

// Get the buttons from HTML
const restartButton = document.getElementById("restart-game");
const exitButton = document.getElementById("exit-game");

// Hide the end buttons initially
const endButtons = document.getElementById("end-buttons");
endButtons.classList.add("hidden");

// Mouse position for clicking
let lastMouseX = 0, lastMouseY = 0;
canvas.addEventListener('mousemove', (e) => {
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
});

canvas.addEventListener('click', (e) => {
  if (gameActive) {
    if (checkCircleCollision(lastMouseX, lastMouseY)) {
      score++;

      // New target position after a successful click
      circlePos = {
        x: Math.random() * (canvas.width - circleRadius * 2) + circleRadius,
        y: Math.random() * (canvas.height - circleRadius * 2) + circleRadius
      };

      // Reset the timer on each click
      timeRemaining = timeLimit;
      if (!timerRunning) {
        lastTimeCheck = Date.now();
        timerRunning = true;
      }

      // Increase the circle's speed gradually based on the score
      circleSpeed = 1.5 + Math.floor(score / 20) * 0.2; // Increase speed after every 20 points
    }
  } else if (gameOver) {
    if (checkButtonClick(e.clientX, e.clientY, restartButton)) {
      // Restart the game
      score = 0;
      timeRemaining = timeLimit;
      circlePos = { x: canvas.width / 2, y: canvas.height / 2 };  // Ball starts at center
      circleSpeed = 1.5; // Reset initial speed
      gameActive = true;
      gameOver = false;
      timerRunning = true;
      lastTimeCheck = Date.now();
      endButtons.classList.add("hidden"); // Hide buttons again
    } else if (checkButtonClick(e.clientX, e.clientY, exitButton)) {
      window.location.href = "index.html"; // Navigate to the index page instead of closing the window
    }
  }
});

function checkCircleCollision(mouseX, mouseY) {
  const dx = mouseX - circlePos.x;
  const dy = mouseY - circlePos.y;
  return Math.sqrt(dx * dx + dy * dy) <= circleRadius;
}

function checkButtonClick(x, y, button) {
  return x > button.offsetLeft && x < button.offsetLeft + button.offsetWidth &&
         y > button.offsetTop && y < button.offsetTop + button.offsetHeight;
}

// Draw game elements
function drawCircle() {
  ctx.beginPath();
  ctx.arc(circlePos.x, circlePos.y, circleRadius, 0, Math.PI * 2);
  ctx.fillStyle = "black"; // Circle color
  ctx.fill();
  ctx.closePath();
}

function updateTimer() {
  if (timerRunning) {
    const currentTime = Date.now();
    const elapsedTime = (currentTime - lastTimeCheck) / 1000; // Convert to seconds
    timeRemaining -= elapsedTime;
    lastTimeCheck = currentTime;

    if (timeRemaining <= 0) {
      gameActive = false;
      gameOver = true;
      endButtons.classList.remove("hidden"); // Show the buttons
    }
  }
}

// Draw UI (buttons, score, etc.)
function drawEndScreen() {
  // Draw game over text and score
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(`GAME OVER`, canvas.width / 2, canvas.height / 2 - 50);
  ctx.fillText(`Your Score: ${score}`, canvas.width / 2, canvas.height / 2);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameActive) {
    // Update timer
    updateTimer();

    // Draw the circle at its current position
    drawCircle();

    // Draw score and timer
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText(`Score: ${score}`, 50, 50);
    ctx.fillText(`Time: ${Math.max(0, Math.floor(timeRemaining))}`, 50, 90);

  } else if (gameOver) {
    drawEndScreen();
  }

  requestAnimationFrame(gameLoop);
}

// Start the game loop immediately
gameLoop();

// Add button click event listeners
restartButton.addEventListener('click', () => {
  location.reload(); // Reload the page to restart the game
});

exitButton.addEventListener('click', () => {
  window.location.href = "index.html"; // Navigate to the index page instead of closing the window
});