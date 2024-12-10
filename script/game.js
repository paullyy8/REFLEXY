const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
let score = 0;
let gameActive = true;
let gameOver = false;
let timerRunning = true;
let timeLimit = 2; // Initial time limit (2 seconds per click)
let timeRemaining = timeLimit;
let lastTimeCheck = Date.now(); // Track the last time the clock was checked

// Circle properties
let circleRadius = 30;
let circlePos = { x: canvas.width / 2, y: canvas.height / 2 }; // Start at the center
let circleSpeed = 1.2; // Initial speed of the circle (slower)
let circleVelocity = { x: 1, y: 1 }; // Initial velocity direction
let circleColor = '#6200ea'; // Default purple color for the circle

// Ball disappearance properties
let isBallVisible = true; // Flag to track visibility
let disappearDuration = 700; // 700ms for the ball to disappear
let lastDisappearTime = 0; // Time when the ball was last made to disappear
let disappearThreshold = 20; // Threshold score for starting to disappear

// Get the buttons from HTML
const restartButton = document.getElementById("restart-game");
const exitButton = document.getElementById("exit-game");

// Hide the end buttons initially
const endButtons = document.getElementById("end-buttons");
endButtons.classList.add("hidden");

// Score and Timer display element
const scoreTimerDisplay = document.getElementById('score-timer');
const scoreDisplay = scoreTimerDisplay.querySelector('.score');
const timerDisplay = scoreTimerDisplay.querySelector('.timer');

// Mouse position for clicking
let lastMouseX = 0, lastMouseY = 0;
canvas.addEventListener('mousemove', (e) => {
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
});

canvas.addEventListener('click', (e) => {
  if (gameActive) {
    if (checkCircleCollision(lastMouseX, lastMouseY) && isBallVisible) {
      score++;

      // Update score display
      scoreDisplay.textContent = `Score: ${score}`;

      // New target position after a successful click
      updateCirclePosition();

      // Reset the timer on each click
      timeRemaining = timeLimit;
      if (!timerRunning) {
        lastTimeCheck = Date.now();
        timerRunning = true;
      }

      // Increase the circle's speed based on the score
      updateCircleSpeed();
    }
  } else if (gameOver) {
    if (checkButtonClick(e.clientX, e.clientY, restartButton)) {
      // Restart the game
      score = 0;
      timeRemaining = timeLimit;
      circlePos = { x: canvas.width / 2, y: canvas.height / 2 }; // Ball starts at center
      circleSpeed = 1.2; // Reset initial speed
      circleRadius = 30; // Reset initial radius
      circleVelocity = { x: 1, y: 1 }; // Reset initial velocity
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

// Check collision between mouse click and circle
function checkCircleCollision(mouseX, mouseY) {
  const dx = mouseX - circlePos.x;
  const dy = mouseY - circlePos.y;
  return Math.sqrt(dx * dx + dy * dy) <= circleRadius;
}

function checkButtonClick(x, y, button) {
  return x > button.offsetLeft && x < button.offsetLeft + button.offsetWidth &&
         y > button.offsetTop && y < button.offsetTop + button.offsetHeight;
}

// Update circle position with a smooth motion pattern
function updateCirclePosition() {
  const minX = 100;
  const maxX = canvas.width - 100;
  const minY = 100;
  const maxY = canvas.height - 100;

  circlePos.x = Math.random() * (maxX - minX) + minX;
  circlePos.y = Math.random() * (maxY - minY) + minY;

  // Randomize the ball color every 10 clicks
  if (score % 10 === 0) {
    circleColor = getRandomColor();
  }
}

// Update circle speed based on score
function updateCircleSpeed() {
  if (score % 5 === 0) {
    circleSpeed += 0.1;
    circleRadius = Math.max(20, circleRadius - 2); // Ball size shrinks a little with every 5 points
  }
}

function getRandomColor() {
  const colors = ['#6200ea', '#ff5722', '#4caf50', '#00bcd4', '#f44336', '#9c27b0'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Game loop to keep track of the ball's state and the timer
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameActive) {
    // Timer Logic
    const now = Date.now();
    if (timerRunning) {
      timeRemaining -= (now - lastTimeCheck) / 1000;
      lastTimeCheck = now;
    }

    // Handle timer
    if (timeRemaining <= 0) {
      gameActive = false;
      gameOver = true;
      timerRunning = false;
      endButtons.classList.remove("hidden"); // Show end screen buttons
    }

    // Draw the circle at its current position
    drawCircle();

    // Update the timer display
    timerDisplay.textContent = `Time: ${Math.max(0, Math.floor(timeRemaining))}`;
  } else if (gameOver) {
    drawEndScreen();
  }

  requestAnimationFrame(gameLoop);
}

// Draw the circle at its current position
function drawCircle() {
  if (isBallVisible) {
    ctx.beginPath();
    ctx.arc(circlePos.x, circlePos.y, circleRadius, 0, Math.PI * 2);
    ctx.fillStyle = circleColor;
    ctx.fill();
    ctx.closePath();
  }
}

// Draw the Game Over screen
function drawEndScreen() {
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`GAME OVER`, canvas.width / 2, canvas.height / 2 - 50);
  ctx.fillText(`Your Score: ${score}`, canvas.width / 2, canvas.height / 2);
}

// Add a method to draw rounded rectangles
CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
  this.beginPath();
  this.moveTo(x + radius, y);
  this.arcTo(x + width, y, x + width, y + height, radius);
  this.arcTo(x + width, y + height, x, y + height, radius);
  this.arcTo(x, y + height, x, y, radius);
  this.arcTo(x, y, x + width, y, radius);
  this.closePath();
  return this;
};

gameLoop(); // Start the game loop

// Add button click event listeners
restartButton.addEventListener('click', () => {
  location.reload(); // Reload the page to restart the game
});

exitButton.addEventListener('click', () => {
  window.location.href = "index.html"; // Navigate to the index page instead of closing the window
});