// Card symbols (6 pairs = 12 cards)
const cardSymbols = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎸'];

// Game state
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let isProcessing = false;

// DOM elements
const gameBoard = document.getElementById('game-board');
const moveCount = document.getElementById('move-count');
const restartBtn = document.getElementById('restart-btn');
const winMessage = document.getElementById('win-message');
const finalMoves = document.getElementById('final-moves');

// Initialize game
function initGame() {
    // Reset game state
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
    
    // Shuffle cards
    cards = shuffleArray(cardPairs);
    
    // Generate card elements
    createCards();
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Create card elements
function createCards() {
    cards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.cardId = index;
        card.dataset.symbol = symbol;
        
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">?</div>
                <div class="card-back">${symbol}</div>
            </div>
        `;
        
        card.addEventListener('click', handleCardClick);
        gameBoard.appendChild(card);
    });
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
        // No match - flip cards back after delay
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            isProcessing = false;
        }, 1000);
    }
}

// Show win message
function showWinMessage() {
    finalMoves.textContent = moves;
    winMessage.classList.remove('hidden');
}

// Restart game
restartBtn.addEventListener('click', initGame);

// Start the game when page loads
initGame();
