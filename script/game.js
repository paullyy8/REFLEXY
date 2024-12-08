const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const trailLength = 20;
const trailColor = "0,128,128"; // Dark Cyan (Teal)
const trail = [];

// Ball properties
const ballRadius = 20;
const ballColor = "black"; // Black color for the ball
const ballX = canvas.width / 2; // Center X of the canvas
const ballY = canvas.height / 2; // Center Y of the canvas

// Smaller trail radius (e.g., 5 instead of 10)
const trailDotRadius = 5;

function draw() {
  // Draw the trail first
  ctx.fillStyle = "rgba(240, 248, 255, 0.2)"; // Light blue background with some transparency
  ctx.fillRect(0, 0, canvas.width, canvas.height); // Background
  
  for (let i = 0; i < trail.length; i++) {
    const alpha = 1;
    ctx.save();
    ctx.beginPath();
    ctx.arc(trail[i].x, trail[i].y, trailDotRadius, 0, Math.PI * 2); // Use trailDotRadius here
    ctx.fillStyle = `rgba(${trailColor},${alpha})`; // Draw the trail in Dark Cyan
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Now, draw the ball in the center
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = ballColor; // Black color for the ball
  ctx.fill();
  ctx.closePath();

  // Keep the animation running
  window.requestAnimationFrame(draw);
}

function addTrailPoint(x, y) {
  trail.push({ x, y });
  if (trail.length > trailLength) {
    trail.shift(); // Remove the first element when we exceed trail length
  }
}

let mouseX = 0, mouseY = 0;

const startDrawing = (e) => {
  const newX = e.clientX;
  const newY = e.clientY;
  addTrailPoint(newX, newY);
  mouseX = newX;
  mouseY = newY;
};

canvas.addEventListener("mousemove", startDrawing);

window.onload = () => {
  window.requestAnimationFrame(draw);
};