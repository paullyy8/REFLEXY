// Start Game button functionality
document.getElementById("start-game").addEventListener("click", () => {
  window.location.href = '/game.html'; // Redirect to the game page
});

// Exit Game button functionality
document.getElementById("exit-game").addEventListener("click", () => {
  const confirmExit = confirm("");
  if (confirmExit) {
    window.close();
  }
});