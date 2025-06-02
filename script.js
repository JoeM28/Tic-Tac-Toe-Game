// Final version of script.js without duplicated AI UI injection
const cells = document.querySelectorAll("[data-cell]");
const message = document.getElementById("message");
const restartButton = document.getElementById("restartButton");

const player1Image = "bear.png";
const player2Image = "Kitten.png";

let isPlayer1Turn = true;
let vsAI = false;
let aiLevel = "easy";

const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

startGame();

restartButton.addEventListener("click", startGame);
document.getElementById("aiModeToggle").addEventListener("change", e => {
  vsAI = e.target.checked;
});
document.getElementById("aiDifficulty").addEventListener("change", e => {
  aiLevel = e.target.value;
});

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
  if (!isPlayer1Turn && vsAI) return;

  const currentPlayer = isPlayer1Turn ? "1" : "2";
  const currentImage = isPlayer1Turn ? player1Image : player2Image;
  playMove(cell, currentPlayer, currentImage);

  if (checkGameEnd(currentPlayer)) return;

  if (vsAI && isPlayer1Turn === false) {
    setTimeout(() => {
      const aiCell = aiLevel === "easy" ? pickRandomMove() : pickBestMove("2");
      if (aiCell) playMove(aiCell, "2", player2Image);
      checkGameEnd("2");
    }, 300);
  }
}

function playMove(cell, player, imageSrc) {
  const img = document.createElement("img");
  img.src = imageSrc;
  img.alt = "Player " + player;
  cell.appendChild(img);
  cell.dataset.player = player;
  cell.removeEventListener("click", handleClick);
  isPlayer1Turn = !isPlayer1Turn;
}

function checkGameEnd(player) {
  if (checkWin(player)) {
    message.innerText = `Player ${player} wins!`;
    endGame();
    return true;
  } else if (isDraw()) {
    message.innerText = "It's a draw!";
    endGame();
    return true;
  }
  return false;
}

function endGame() {
  cells.forEach(cell => cell.removeEventListener("click", handleClick));
}

function checkWin(player) {
  return WINNING_COMBOS.some(combo => combo.every(i => cells[i].dataset.player === player));
}

function isDraw() {
  return [...cells].every(cell => cell.dataset.player);
}

function pickRandomMove() {
  const available = [...cells].filter(c => !c.dataset.player);
  return available.length ? available[Math.floor(Math.random() * available.length)] : null;
}

function pickBestMove(player) {
  const opponent = player === "1" ? "2" : "1";
  let bestScore = -Infinity;
  let bestCell = null;

  [...cells].forEach((cell, i) => {
    if (!cell.dataset.player) {
      cell.dataset.player = player;
      const score = minimax(cells, 0, false, player, opponent);
      cell.dataset.player = "";
      if (score > bestScore) {
        bestScore = score;
        bestCell = cell;
      }
    }
  });

  return bestCell;
}

function minimax(cells, depth, isMaximizing, player, opponent) {
  if (checkWin(player)) return 10 - depth;
  if (checkWin(opponent)) return depth - 10;
  if (isDraw()) return 0;

  let bestScore = isMaximizing ? -Infinity : Infinity;
  const current = isMaximizing ? player : opponent;

  [...cells].forEach(cell => {
    if (!cell.dataset.player) {
      cell.dataset.player = current;
      const score = minimax(cells, depth + 1, !isMaximizing, player, opponent);
      cell.dataset.player = "";
      bestScore = isMaximizing ? Math.max(score, bestScore) : Math.min(score, bestScore);
    }
  });

  return bestScore;
}
