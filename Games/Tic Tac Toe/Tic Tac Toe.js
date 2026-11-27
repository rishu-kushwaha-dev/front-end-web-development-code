let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let playerMark = 'X';
let aiMark = 'O';
let gameActive = false;
let scores = { player: 0, ai: 0, draw: 0 };

const cells = document.querySelectorAll('.cell');
const messageElement = document.getElementById('message');
const turnIndicator = document.getElementById('turnIndicator');
const playerScoreEl = document.getElementById('playerScore');
const aiScoreEl = document.getElementById('aiScore');
const drawScoreEl = document.getElementById('drawScore');
const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const startBtn = document.getElementById('startBtn');
const markXBtn = document.getElementById('markX');
const markOBtn = document.getElementById('markO');

function chooseMark(mark) {
  playerMark = mark;
  aiMark = mark === 'X' ? 'O' : 'X';
  currentPlayer = 'X';
  markXBtn.classList.toggle('selected', mark === 'X');
  markOBtn.classList.toggle('selected', mark === 'O');
  startBtn.disabled = false;
  startBtn.style.opacity = '1';
  startBtn.style.pointerEvents = 'auto';
}

function startGame() {
  startScreen.style.display = 'none';
  gameScreen.style.display = 'block';
  resetGame();
  if (playerMark === 'O') {
    setTimeout(makeAIMove, 400);
  }
}

function goHome() {
  gameScreen.style.display = 'none';
  startScreen.style.display = 'block';
  gameActive = false;
  resetGame();
}

function checkWin() {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], combo };
    }
  }
  return null;
}

function checkDraw() {
  return board.every(cell => cell !== '');
}

function handleCellClick(event) {
  const cell = event.target;
  const index = parseInt(cell.dataset.index);

  if (board[index] === '' && gameActive && currentPlayer === playerMark) {
    makeMove(index, playerMark, cell);

    const result = checkWin();
    if (result) {
      endGame(result.winner, result.combo);
      return;
    }

    if (checkDraw()) {
      endGame('draw');
      return;
    }

    currentPlayer = aiMark;
    updateTurnIndicator();
    disableBoard();
    setTimeout(makeAIMove, 400);
  }
}

function makeMove(index, mark, cell) {
  board[index] = mark;
  cell.textContent = mark;
  cell.classList.add(mark, 'taken');
}

function makeAIMove() {
  if (!gameActive) return;

  let bestMove = -1;
  let bestScore = -Infinity;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === '') {
      board[i] = aiMark;
      let score = minimax(board, 0, false);
      board[i] = '';
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  if (bestMove !== -1) {
    const cell = cells[bestMove];
    makeMove(bestMove, aiMark, cell);

    const result = checkWin();
    if (result) {
      endGame(result.winner, result.combo);
      return;
    }

    if (checkDraw()) {
      endGame('draw');
      return;
    }

    currentPlayer = playerMark;
    updateTurnIndicator();
    enableBoard();
  }
}

function minimax(board, depth, isMaximizing) {
  const result = checkWin();
  if (result) {
    return result.winner === aiMark ? 10 - depth : depth - 10;
  }
  if (board.every(cell => cell !== '')) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = aiMark;
        bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
        board[i] = '';
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = playerMark;
        bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
        board[i] = '';
      }
    }
    return bestScore;
  }
}

function endGame(result, winCombo) {
  gameActive = false;
  disableBoard();

  if (result === 'draw') {
    scores.draw++;
    drawScoreEl.textContent = scores.draw;
    messageElement.textContent = "It's a draw!";
    messageElement.className = 'message draw';
    turnIndicator.textContent = "It's a draw!";
    turnIndicator.className = 'turn-indicator draw';
  } else if (result === playerMark) {
    scores.player++;
    playerScoreEl.textContent = scores.player;
    messageElement.textContent = 'You win!';
    messageElement.className = 'message win';
    turnIndicator.textContent = 'You win!';
    turnIndicator.className = 'turn-indicator win';
    if (winCombo) highlightWin(winCombo);
    spawnConfetti();
  } else {
    scores.ai++;
    aiScoreEl.textContent = scores.ai;
    messageElement.textContent = 'AI wins!';
    messageElement.className = 'message lose';
    turnIndicator.textContent = 'AI wins!';
    turnIndicator.className = 'turn-indicator lose';
    if (winCombo) highlightWin(winCombo);
  }
}

function highlightWin(combo) {
  combo.forEach(index => {
    cells[index].classList.add('winning');
  });
}

function updateTurnIndicator() {
  if (currentPlayer === playerMark) {
    turnIndicator.textContent = 'Your turn — ' + playerMark;
    turnIndicator.className = 'turn-indicator you';
  } else {
    turnIndicator.textContent = "AI's turn — " + aiMark;
    turnIndicator.className = 'turn-indicator ai';
  }
}

function disableBoard() {
  cells.forEach(cell => cell.onclick = null);
}

function enableBoard() {
  cells.forEach(cell => cell.onclick = handleCellClick);
}

function playAgain() {
  resetGame();
}

function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = true;
  messageElement.textContent = '';
  messageElement.className = 'message';
  turnIndicator.textContent = 'Your turn — ' + playerMark;
  turnIndicator.className = 'turn-indicator you';
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('X', 'O', 'taken', 'winning');
  });
  enableBoard();
}

function spawnConfetti() {
  const colors = ['#6c63ff', '#f472b6', '#34d399', '#fbbf24', '#3b82f6', '#ec4899'];
  const container = document.createElement('div');
  container.className = 'confetti';
  document.body.appendChild(container);

  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.top = '-10px';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
    piece.style.animationDelay = (Math.random() * 0.5) + 's';
    piece.style.width = (Math.random() * 8 + 6) + 'px';
    piece.style.height = (Math.random() * 8 + 6) + 'px';
    container.appendChild(piece);
  }

  setTimeout(() => container.remove(), 4000);
}