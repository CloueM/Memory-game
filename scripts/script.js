const cardSymbols = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎸'];

// Game state
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let rightMoves = 0;
let wrongMoves = 0;
let isProcessing = false;
let timerInterval;
let timeLeft;
let currentDifficulty;

const MAX_TIME = 60;

const DIFFICULTIES = {
    chill: { startTime: null, modifier: 0, multiplier: 1 },
    easy: { startTime: 60, modifier: 2, multiplier: 1.2 },
    medium: { startTime: 45, modifier: 3, multiplier: 1.5 },
    hard: { startTime: 30, modifier: 4, multiplier: 2 },
    wth: { startTime: 15, modifier: 5, multiplier: 3 }
};

const gameBoard = document.getElementById('game-board');
const moveCount = document.getElementById('move-count');
const rightCount = document.getElementById('right-count');
const wrongCount = document.getElementById('wrong-count');
const restartBtn = document.getElementById('restart-btn');
const winMessage = document.getElementById('win-message');
const gameOverMessage = document.getElementById('game-over-message');
const finalMoves = document.getElementById('final-moves');
const finalScore = document.getElementById('final-score');
const welcomeScreen = document.getElementById('welcome-screen');
const gameContainer = document.getElementById('game-container');

const countdownOverlay = document.getElementById('countdown-overlay');
const countdownNumber = document.querySelector('.countdown-number');

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
        rightMoves++;
        rightCount.textContent = rightMoves;
        
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
        wrongMoves++;
        wrongCount.textContent = wrongMoves;

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
    rightMoves = 0;
    wrongMoves = 0;
    isProcessing = true; // Disable clicks initially (until countdown finishes)
    
    moveCount.textContent = moves;
    rightCount.textContent = 0;
    wrongCount.textContent = 0;
    winMessage.classList.add('hidden');
    gameOverMessage.classList.add('hidden');
    
    const cardPairs = [...cardSymbols, ...cardSymbols];
    cards = shuffleArray(cardPairs);
    createCards();

    // Reset timer display but don't start it yet
    clearInterval(timerInterval);
    if (DIFFICULTIES[difficulty].startTime) {
        timeLeft = DIFFICULTIES[difficulty].startTime;
        updateTimerDisplay();
    } else {
        document.getElementById('timer-bar').style.width = '100%';
        document.getElementById('timer-bar').style.backgroundColor = '#48bb78';
    }
}

function startCountdown(onComplete) {
    countdownOverlay.classList.remove('hidden');
    countdownOverlay.style.opacity = '1'; // Ensure opacity is 1
    let count = 3;
    countdownNumber.textContent = count;
    
    // Reset animation
    countdownNumber.style.animation = 'none';
    countdownNumber.offsetHeight; /* trigger reflow */
    countdownNumber.style.animation = 'popIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';

    const interval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownNumber.textContent = count;
            // Reset animation
            countdownNumber.style.animation = 'none';
            countdownNumber.offsetHeight; /* trigger reflow */
            countdownNumber.style.animation = 'popIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
        } else if (count === 0) {
            countdownNumber.textContent = 'Start!';
            // Reset animation
            countdownNumber.style.animation = 'none';
            countdownNumber.offsetHeight; /* trigger reflow */
            countdownNumber.style.animation = 'popIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
        } else {
            clearInterval(interval);
            
            // Fade out
            countdownOverlay.style.opacity = '0';
            
            // Wait for transition to finish before hiding and starting game
            setTimeout(() => {
                countdownOverlay.classList.add('hidden');
                isProcessing = false; // Enable clicks
                if (onComplete) onComplete();
            }, 500); // 500ms matches CSS transition duration
        }
    }, 1000);
}

function calculateScore() {
    const totalMoves = rightMoves + wrongMoves;
    const accuracy = totalMoves === 0 ? 0 : (rightMoves / totalMoves) * 100;
    
    let timeFactor = 100;
    if (currentDifficulty !== 'chill') {
        timeFactor = (timeLeft / MAX_TIME) * 100;
    }
    
    // Weighted Score: 60% Accuracy, 40% Time
    let baseScore = (accuracy * 0.6) + (timeFactor * 0.4);
    
    // Apply Difficulty Multiplier
    let final = Math.round(baseScore * DIFFICULTIES[currentDifficulty].multiplier);
    
    return final;
}

// Show win message
function showWinMessage() {
    const totalMoves = rightMoves + wrongMoves;
    const accuracy = totalMoves === 0 ? 0 : (rightMoves / totalMoves) * 100;
    
    let timeFactor = 100;
    if (currentDifficulty !== 'chill') {
        timeFactor = (timeLeft / MAX_TIME) * 100;
    }
    
    const score = calculateScore();
    finalScore.textContent = score;
    
    document.getElementById('final-right').textContent = rightMoves;
    document.getElementById('final-wrong').textContent = wrongMoves;
    document.getElementById('final-time').textContent = currentDifficulty === 'chill' ? '∞' : timeLeft;
    document.getElementById('final-multiplier').textContent = `${DIFFICULTIES[currentDifficulty].multiplier}x`;
    
    const formulaText = `
        Accuracy: (${rightMoves}/${totalMoves}) × 100 × 0.6 = ${Math.round(accuracy * 0.6)}
        Time: (${currentDifficulty === 'chill' ? '∞' : timeLeft}/${MAX_TIME}) × 100 × 0.4 = ${Math.round(timeFactor * 0.4)}
        Total: (${Math.round(accuracy * 0.6)} + ${Math.round(timeFactor * 0.4)}) × ${DIFFICULTIES[currentDifficulty].multiplier}x = ${score}
    `;
    document.getElementById('score-formula').innerText = formulaText; // Use innerText for newlines
    
    winMessage.classList.remove('hidden');
}

document.getElementById('score-explain-btn').addEventListener('click', () => {
    const explanation = document.getElementById('score-explanation');
    const btn = document.getElementById('score-explain-btn');
    
    explanation.classList.toggle('hidden');
    if (explanation.classList.contains('hidden')) {
        btn.textContent = 'How is this calculated? ▼';
    } else {
        btn.textContent = 'Hide explanation ▲';
    }
});

// Event Listeners
document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const level = btn.dataset.level;
        welcomeScreen.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        initGame(level);
        startCountdown(() => {
            if (DIFFICULTIES[level].startTime) {
                startTimer(DIFFICULTIES[level].startTime);
            }
        });
    });
});

document.querySelectorAll('.play-again-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        winMessage.classList.add('hidden');
        gameOverMessage.classList.add('hidden');
        initGame(currentDifficulty);
        startCountdown(() => {
            if (DIFFICULTIES[currentDifficulty].startTime) {
                startTimer(DIFFICULTIES[currentDifficulty].startTime);
            }
        });
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
    startCountdown(() => {
        if (DIFFICULTIES[currentDifficulty].startTime) {
            startTimer(DIFFICULTIES[currentDifficulty].startTime);
        }
    });
});

document.getElementById('main-menu-game-btn').addEventListener('click', () => {
    clearInterval(timerInterval);
    gameContainer.classList.add('hidden');
    welcomeScreen.classList.remove('hidden');
});
