const cardSymbols = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎸'];

// Game state
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let isProcessing = false;
let timerInterval;
let timeLeft;
let currentDifficulty;

const MAX_TIME = 60;

const DIFFICULTIES = {
    chill: null,
    easy: { startTime: 60, modifier: 2 },
    medium: { startTime: 45, modifier: 3 },
    hard: { startTime: 30, modifier: 4 },
    wth: { startTime: 15, modifier: 5 }
};

const gameBoard = document.getElementById('game-board');
const moveCount = document.getElementById('move-count');
const restartBtn = document.getElementById('restart-btn');
const winMessage = document.getElementById('win-message');
const gameOverMessage = document.getElementById('game-over-message');
const finalMoves = document.getElementById('final-moves');
const welcomeScreen = document.getElementById('welcome-screen');
const gameContainer = document.getElementById('game-container');

// Shuffle cards
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Create card elements
function createCards() {
    gameBoard.innerHTML = '';
    for (let symbol of cards) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.symbol = symbol;
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">?</div>
                <div class="card-back">${symbol}</div>
            </div>
        `;
        card.addEventListener('click', handleCardClick);
        gameBoard.appendChild(card);
    }
}

// Handle card click
function handleCardClick(event) {
    if (isProcessing) return;
    
    const card = event.currentTarget;
    
    if (card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
    
    card.classList.add('flipped');
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
        isProcessing = true;
        moves++;
        moveCount.textContent = moves;
        checkMatch();
    }
}

// Check if flipped cards match
function checkMatch() {
    const [card1, card2] = flippedCards;
    const symbol1 = card1.dataset.symbol;
    const symbol2 = card2.dataset.symbol;
    
    if (symbol1 === symbol2) {
        // Match found
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        
        // Add time bonus
        if (currentDifficulty !== 'chill') {
            timeLeft = Math.min(timeLeft + DIFFICULTIES[currentDifficulty].modifier, MAX_TIME);
            updateTimerDisplay();
            triggerGlow('green');
        }

        flippedCards = [];
        isProcessing = false;
        
        if (matchedPairs === cardSymbols.length) {
            clearInterval(timerInterval);
            setTimeout(showWinMessage, 500);
        }
    } else {
        // No match
        if (currentDifficulty !== 'chill') {
            timeLeft -= DIFFICULTIES[currentDifficulty].modifier;
            updateTimerDisplay();
            triggerGlow('red');
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                gameOver();
                return; // Stop processing
            }
        }

        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            isProcessing = false;
        }, 1000);
    }
}

// Timer Logic
function startTimer(seconds) {
    timeLeft = seconds;
    updateTimerDisplay();
    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            gameOver();
        }
    }, 1000);
}

function triggerGlow(type) {
    const timerContainer = document.querySelector('.timer-container');
    timerContainer.classList.remove('glow-green', 'glow-red');
    
    // Force reflow to restart animation if needed
    void timerContainer.offsetWidth;
    
    timerContainer.classList.add(`glow-${type}`);
    
    setTimeout(() => {
        timerContainer.classList.remove(`glow-${type}`);
    }, 500);
}

function updateTimerDisplay() {
    const timerBar = document.getElementById('timer-bar');
    if (currentDifficulty === 'chill') {
        timerBar.style.width = '100%';
        timerBar.style.backgroundColor = '#48bb78';
        return;
    }

    const percentage = (timeLeft / MAX_TIME) * 100;
    
    timerBar.style.width = `${percentage}%`;
    
    // Calculate Hue: 120 (Green) -> 0 (Red)
    const hue = (percentage / 100) * 120;
    timerBar.style.backgroundColor = `hsl(${hue}, 70%, 50%)`;
}

function gameOver() {
    isProcessing = true; // Disable clicks
    gameOverMessage.classList.remove('hidden');
}

// Initialize game
function initGame(difficulty) {
    currentDifficulty = difficulty;
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    isProcessing = false;
    
    moveCount.textContent = moves;
    winMessage.classList.add('hidden');
    gameOverMessage.classList.add('hidden');
    
    const cardPairs = [...cardSymbols, ...cardSymbols];
    cards = shuffleArray(cardPairs);
    createCards();

    if (DIFFICULTIES[difficulty]) {
        startTimer(DIFFICULTIES[difficulty].startTime);
    } else {
        clearInterval(timerInterval);
        document.getElementById('timer-bar').style.width = '100%';
        document.getElementById('timer-bar').style.backgroundColor = '#48bb78';
    }
}

// Show win message
function showWinMessage() {
    finalMoves.textContent = moves;
    winMessage.classList.remove('hidden');
}

// Event Listeners
document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const level = btn.dataset.level;
        welcomeScreen.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        initGame(level);
    });
});

document.querySelectorAll('.play-again-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        winMessage.classList.add('hidden');
        gameOverMessage.classList.add('hidden');
        initGame(currentDifficulty);
    });
});

document.querySelectorAll('.main-menu-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        winMessage.classList.add('hidden');
        gameOverMessage.classList.add('hidden');
        gameContainer.classList.add('hidden');
        welcomeScreen.classList.remove('hidden');
    });
});

restartBtn.addEventListener('click', () => {
    initGame(currentDifficulty);
});
