// Rock Paper Scissors Game Logic

const choices = ['rock', 'paper', 'scissors'];
const emojis = {
    rock: '🪨',
    paper: '📄',
    scissors: '✂️'
};

let playerScore = 0;
let computerScore = 0;

const playerScoreEl = document.getElementById('player-score');
const computerScoreEl = document.getElementById('computer-score');
const resultText = document.getElementById('result-text');
const playerChoiceEl = document.getElementById('player-choice');
const computerChoiceEl = document.getElementById('computer-choice');
const choiceButtons = document.querySelectorAll('.choice');
const resetBtn = document.getElementById('reset-btn');

// Get computer's choice
function getComputerChoice() {
    return choices[Math.floor(Math.random() * choices.length)];
}

// Determine winner
function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return 'draw';
    }

    const winConditions = {
        rock: 'scissors',
        paper: 'rock',
        scissors: 'paper'
    };

    return winConditions[playerChoice] === computerChoice ? 'win' : 'lose';
}

// Update result display
function updateResult(result, playerChoice, computerChoice) {
    const messages = {
        win: 'You Win!',
        lose: 'Computer Wins!',
        draw: "It's a Draw!"
    };

    resultText.textContent = messages[result];
    resultText.className = result;

    playerChoiceEl.textContent = emojis[playerChoice];
    computerChoiceEl.textContent = emojis[computerChoice];
}

// Update score
function updateScore(result) {
    if (result === 'win') {
        playerScore++;
        playerScoreEl.textContent = playerScore;
    } else if (result === 'lose') {
        computerScore++;
        computerScoreEl.textContent = computerScore;
    }
}

// Play round
function playRound(playerChoice) {
    const computerChoice = getComputerChoice();
    const result = determineWinner(playerChoice, computerChoice);

    updateResult(result, playerChoice, computerChoice);
    updateScore(result);
}

// Handle player choice
choiceButtons.forEach(button => {
    button.addEventListener('click', () => {
        const playerChoice = button.dataset.choice;
        playRound(playerChoice);
    });
});

// Reset score
resetBtn.addEventListener('click', () => {
    playerScore = 0;
    computerScore = 0;
    playerScoreEl.textContent = '0';
    computerScoreEl.textContent = '0';
    resultText.textContent = 'Choose your move!';
    resultText.className = '';
    playerChoiceEl.textContent = '?';
    computerChoiceEl.textContent = '?';
});