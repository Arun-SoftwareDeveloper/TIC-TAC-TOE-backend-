const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Game state
let board = Array(9).fill(null);
let Xvalue = true;
let scores = { xScore: 0, oScore: 0 };
let gameOver = false;

// Winning combinations
const win = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Function to check the winner
function checkWinner(board) {
  for (let i = 0; i < win.length; i++) {
    const [A, B, C] = win[i];
    if (board[A] && board[A] === board[B] && board[B] === board[C]) {
      return board[A];
    }
  }
  return null;
}

// Reset the game
function resetGame() {
  board = Array(9).fill(null);
  Xvalue = true;
  gameOver = false;
}

// API endpoint for making a move
app.post("/move", (req, res) => {
  if (gameOver) {
    res.status(400).json({ error: "The game is over. Please reset." });
    return;
  }

  const { boxId } = req.body;

  if (board[boxId] === null) {
    board[boxId] = Xvalue ? "X" : "O";
    Xvalue = !Xvalue;

    const winner = checkWinner(board);
    if (winner) {
      if (winner === "X") {
        scores.xScore += 1;
      } else {
        scores.oScore += 1;
      }
      gameOver = true;
    }

    res.json({ board, scores, Xvalue, gameOver });
  } else {
    res
      .status(400)
      .json({ error: "Invalid move. The box is already occupied." });
  }
});

// API endpoint for resetting the game
app.post("/reset", (req, res) => {
  resetGame();
  res.json({ board, scores, Xvalue, gameOver });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
