const cells = document.querySelectorAll("[data-cell]");
const message = document.getElementById("message");
const restartButton = document.getElementById("restartButton");

// Use your uploaded image file paths
const player1Image = "bear.png";     // Replace with your bear filename
const player2Image = "Kitten.png";   // Replace with your kitten filename

let isPlayer1Turn = true;

const WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

startGame();

restartButton.addEventListener("click", startGame);

function startGame() {
  isPlayer1Turn = true;
  message.innerText = "";
  cells.forEach(cell => {
    cell.innerHTML = "";
    cell.dataset.player = "";
    cell.addEventListener("click", handleClick, { once: true });
  });
}

function handleClick(e) {
  const cell = e.target;
  const currentPlayer = isPlayer1Turn ? "1" : "2";
  const currentImage = isPlayer1Turn ? player1Image : player2Image;

  const img = document.createElement("img");
  img.src = currentImage;
  img.alt = "Player " + currentPlayer;
  cell.appendChild(img);
  cell.dataset.player = currentPlayer;

  if (checkWin(currentPlayer)) {
    message.innerText = `Player ${currentPlayer} wins!`;
    endGame();
  } else if (isDraw()) {
    message.innerText = "It's a draw!";
    endGame();
  } else {
    isPlayer1Turn = !isPlayer1Turn;
  }
}

function endGame() {
  cells.forEach(cell => cell.removeEventListener("click", handleClick));
}

function checkWin(player) {
  return WINNING_COMBOS.some(combination => {
    return combination.every(index => {
      return cells[index].dataset.player === player;
    });
  });
}

function isDraw() {
  return [...cells].every(cell => cell.dataset.player);
}
