const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
let score = 0;
let gameActive = true; // Start the game immediately
let gameOver = false;
let timerRunning = true;
let timeLimit = 3; // 3-second time limit
let timeRemaining = timeLimit;
let lastTimeCheck = Date.now(); // Track the last time the clock was checked

// Circle properties
const circleRadius = 30;
let circlePos = { x: canvas.width / 2, y: canvas.height / 2 };

// Button properties (in canvas coordinates)
const restartButton = { x: canvas.width / 2 - 75, y: canvas.height / 2 + 30, width: 150, height: 40 };
const endExitButton = { x: canvas.width / 2 - 75, y: canvas.height / 2 + 80, width: 150, height: 40 };

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
      // Move the circle to a new random position
      circlePos = {
        x: Math.random() * (canvas.width - circleRadius * 2) + circleRadius,
        y: Math.random() * (canvas.height - circleRadius * 2) + circleRadius
      };
      timeRemaining = timeLimit; // Reset the timer
      if (!timerRunning) {
        lastTimeCheck = Date.now();
        timerRunning = true;
      }
    }
  } else if (gameOver) {
    if (checkButtonClick(e.clientX, e.clientY, restartButton)) {
      // Restart the game
      score = 0;
      timeRemaining = timeLimit;
      circlePos = { x: canvas.width / 2, y: canvas.height / 2 };
      gameActive = true;
      gameOver = false;
      timerRunning = true;
      lastTimeCheck = Date.now();
    } else if (checkButtonClick(e.clientX, e.clientY, endExitButton)) {
      window.close(); // Exit the game
    }
  }
});

function checkCircleCollision(mouseX, mouseY) {
  const dx = mouseX - circlePos.x;
  const dy = mouseY - circlePos.y;
  return Math.sqrt(dx * dx + dy * dy) <= circleRadius;
}

function checkButtonClick(x, y, button) {
  return x > button.x && x < button.x + button.width && y > button.y && y < button.y + button.height;
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
    }
  }
}

// Draw UI (buttons, score, etc.)
function drawEndScreen() {
  // Draw Restart button
  ctx.fillStyle = "#28a745"; // Green button
  ctx.fillRect(restartButton.x, restartButton.y, restartButton.width, restartButton.height);
  ctx.fillStyle = "white";
  ctx.font = "1.5rem Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Restart", restartButton.x + restartButton.width / 2, restartButton.y + restartButton.height / 2);

  // Draw Exit button
  ctx.fillStyle = "#dc3545"; // Red button
  ctx.fillRect(endExitButton.x, endExitButton.y, endExitButton.width, endExitButton.height);
  ctx.fillStyle = "white";
  ctx.fillText("Exit", endExitButton.x + endExitButton.width / 2, endExitButton.y + endExitButton.height / 2);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameActive) {
    // Update timer
    updateTimer();

    // Draw game elements
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