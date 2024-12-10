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
let circlePos = { x: canvas.width / 2, y: canvas.height / 2 };  // Start at the center
let circleSpeed = 1.2; // Initial speed of the circle (slower)
let circleVelocity = { x: 1, y: 1 }; // Initial velocity direction

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
      circlePos = { x: canvas.width / 2, y: canvas.height / 2 };  // Ball starts at center
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
  // Randomization for larger movement distances, making it much harder to catch
  const angle = Math.random() * Math.PI * 2; // Random angle for direction
  const distance = Math.random() * 400 + 300; // Increased distance for movement
  const speedFactor = Math.random() * 2 + 0.5; // Introduce variability in speed
  circlePos.x += Math.cos(angle) * distance * speedFactor;
  circlePos.y += Math.sin(angle) * distance * speedFactor;

  // Keep the circle within canvas bounds
  circlePos.x = Math.max(circleRadius, Math.min(canvas.width - circleRadius, circlePos.x));
  circlePos.y = Math.max(circleRadius, Math.min(canvas.height - circleRadius, circlePos.y));
}

// Update circle's speed and size based on score
function updateCircleSpeed() {
  // Aggressive exponential growth for speed, making it harder to track
  circleSpeed = 1.2 + Math.pow(Math.floor(score / 3), 2) * 0.6; // Faster speed increase

  // Shrink the circle size faster with higher score
  circleRadius = 30 - Math.floor(score / 2) * 3 + Math.random() * 4; // Shrink circle faster
  if (circleRadius < 5) circleRadius = 5; // Min circle size
}

// Ball disappearance logic
function handleBallDisappearance() {
  if (score >= disappearThreshold) {
    const currentTime = Date.now();
    
    // If the ball has been visible long enough, make it disappear
    if (currentTime - lastDisappearTime > disappearDuration) {
      isBallVisible = true;  // Make it visible again
      // Restart the timer when the ball reappears
      timeRemaining = timeLimit;
    } else {
      isBallVisible = false;  // Make it disappear
    }

    // Randomly decide to make the ball disappear (only after reaching a certain score)
    if (Math.random() < (0.02 + score * 0.005) && score >= disappearThreshold) {
      lastDisappearTime = currentTime;  // Track time of disappearance
      isBallVisible = false;
      // Pause the timer when the ball disappears
      timerRunning = false;
    }
  }
}

// Draw game elements
function drawCircle() {
  if (isBallVisible) {
    ctx.beginPath();
    ctx.arc(circlePos.x, circlePos.y, circleRadius, 0, Math.PI * 2);
    ctx.fillStyle = "black"; // Circle color
    ctx.fill();
    ctx.closePath();
  }
}

function updateTimer() {
  if (timerRunning) {
    const currentTime = Date.now();
    const elapsedTime = (currentTime - lastTimeCheck) / 1000; // Convert to seconds
    timeRemaining -= elapsedTime;
    lastTimeCheck = currentTime;

    // Gradually reduce time limit based on score
    timeLimit = Math.max(0.5, 2 - Math.floor(score / 5) * 0.1); // Reduce time limit slowly

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
    // Handle ball disappearance logic
    handleBallDisappearance();

    // Update timer only if the timer is running (not paused when the ball disappears)
    if (timerRunning) {
      updateTimer();
    }

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