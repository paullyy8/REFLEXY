// Start Game button functionality
document.getElementById("start-game").addEventListener("click", () => {
  location.href = "/game.html"; // Redirect to the game page
});

// Exit Game button functionality
document.getElementById("exit-game").addEventListener("click", () => {
  window.close(); // Closes the current browser tab (might not work on all browsers)
});