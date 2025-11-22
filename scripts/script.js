const cardSymbols = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎸'];

// Game state
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let isProcessing = false;

const gameBoard = document.getElementById('game-board');
const moveCount = document.getElementById('move-count');
const restartBtn = document.getElementById('restart-btn');
const winMessage = document.getElementById('win-message');
const finalMoves = document.getElementById('final-moves');

// Shuffle cards
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Create card elements
function createCards() {
    // Loop through every emoji in our shuffled list
    for (let symbol of cards) {
        console.log(symbol);
        // 1. Create the main card box
        const card = document.createElement('div');
        card.classList.add('card');
        
        // 2. Store the secret emoji on the element (so we can check matches later)
        card.dataset.symbol = symbol;
        
        // 3. Create the HTML for the flip effect (Front is '?', Back is the emoji)
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">?</div>
                <div class="card-back">${symbol}</div>
            </div>
        `;
        
        // 4. Make it clickable
        card.addEventListener('click', handleCardClick);
        
        // 5. Add it to the game board
        gameBoard.appendChild(card);
    }
}

// Handle card click
function handleCardClick(event) {
    // Prevent clicking during processing or on already flipped/matched cards
    if (isProcessing) return;
    
    const card = event.currentTarget;
    
    // Don't flip if already flipped or matched
    if (card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
    
    // Flip the card
    card.classList.add('flipped');
    flippedCards.push(card);
    
    // Check if two cards are flipped
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
        
        flippedCards = [];
        isProcessing = false;
        
        // Check if all pairs are matched
        if (matchedPairs === cardSymbols.length) {
            setTimeout(showWinMessage, 500);
        }
    } else {
        // When the card flipped is not matching, flip cards back after delay
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            isProcessing = false;
        }, 1000);
    }
}

// Initialize game
function initGame() {
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    isProcessing = false;
    
    // Update UI
    moveCount.textContent = moves;
    winMessage.classList.add('hidden');
    gameBoard.innerHTML = '';
    
    // Create pairs of cards
    const cardPairs = [...cardSymbols, ...cardSymbols];
    
    cards = shuffleArray(cardPairs);
    createCards();
}

// Show win message
function showWinMessage() {
    finalMoves.textContent = moves;
    winMessage.classList.remove('hidden');
}

restartBtn.addEventListener('click', initGame);

// Start the game when page loads
// Start Game Logic
const welcomeScreen = document.getElementById('welcome-screen');
const startBtn = document.getElementById('start-btn');
const gameContainer = document.getElementById('game-container');

function startGame() {
    welcomeScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    initGame();
}

startBtn.addEventListener('click', startGame);

// Remove auto-init
// initGame();
