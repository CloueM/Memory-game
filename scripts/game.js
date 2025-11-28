import { gameState, dom, cardSymbols, DIFFICULTIES, MAX_TIME } from './state.js';
import { shuffleArray } from './utils.js';
import { playCardHoverSfx, playCardFlipSfx, playMatchSfx, playNotMatchSfx, playGameOverSfx, stopTickingSfx } from './audio.js';
import { updateTimerDisplay, triggerGlow } from './timer.js';
import { showWinMessage } from './scoring.js';

// Game over logic
export function gameOver() {
    gameState.isProcessing = true;
    playGameOverSfx();
    dom.gameOverMessage.classList.remove('hidden');
}

// Check if flipped cards match
export function checkMatch() {
    var card1 = gameState.flippedCards[0];
    var card2 = gameState.flippedCards[1];
    
    var symbol1 = card1.dataset.symbol;
    var symbol2 = card2.dataset.symbol;
    
    if (symbol1 === symbol2) {
        // Match found
        playMatchSfx();
        card1.classList.add('matched');
        card2.classList.add('matched');
        
        gameState.matchedPairs = gameState.matchedPairs + 1;
        gameState.rightMoves = gameState.rightMoves + 1;
        dom.rightCount.textContent = gameState.rightMoves;
        
        // Add bonus time if not in chill mode
        if (gameState.currentDifficulty !== 'chill') {
            var bonusTime = DIFFICULTIES[gameState.currentDifficulty].modifier;
            gameState.timeLeft = gameState.timeLeft + bonusTime;
            
            if (gameState.timeLeft > MAX_TIME) {
                gameState.timeLeft = MAX_TIME;
            }
            
            updateTimerDisplay();
            triggerGlow('green');
        }

        gameState.flippedCards = [];
        gameState.isProcessing = false;
        
        // Check win condition
        if (gameState.matchedPairs === cardSymbols.length) {
            clearInterval(gameState.timerInterval);
            stopTickingSfx();
            
            setTimeout(function() {
                showWinMessage();
            }, 500);
        }
    } else {
        // No match
        playNotMatchSfx();
        gameState.wrongMoves = gameState.wrongMoves + 1;
        dom.wrongCount.textContent = gameState.wrongMoves;

        // Penalty time if not in chill mode
        if (gameState.currentDifficulty !== 'chill') {
            var penaltyTime = DIFFICULTIES[gameState.currentDifficulty].modifier;
            gameState.timeLeft = gameState.timeLeft - penaltyTime;
            
            updateTimerDisplay();
            triggerGlow('red');
            
            if (gameState.timeLeft <= 0) {
                clearInterval(gameState.timerInterval);
                stopTickingSfx();
                gameOver();
                return;
            }
        }

        // Flip back after delay
        setTimeout(function() {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            gameState.flippedCards = [];
            gameState.isProcessing = false;
        }, 500);
    }
}

// Handle card clicks
export function handleCardClick(event) {
    if (gameState.isProcessing === true) {
        return;
    }
    
    var card = event.currentTarget;
    
    if (card.classList.contains('flipped')) {
        return;
    }
    
    if (card.classList.contains('matched')) {
        return;
    }
    
    card.classList.add('flipped');
    playCardFlipSfx();
    gameState.flippedCards.push(card);
    
    // Check match when 2 cards are flipped
    if (gameState.flippedCards.length === 2) {
        gameState.isProcessing = true;
        gameState.moves = gameState.moves + 1;
        dom.moveCount.textContent = gameState.moves;
        checkMatch();
    }
}

// Generate cards on the board
export function createCards() {
    dom.gameBoard.innerHTML = '';
    
    for (var i = 0; i < gameState.cards.length; i++) {
        var symbol = gameState.cards[i];
        var card = document.createElement('div');
        
        card.classList.add('card');
        card.dataset.symbol = symbol;
        
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">?</div>
                <div class="card-back">${symbol}</div>
            </div>
        `;
        
        card.addEventListener('click', handleCardClick);
        card.addEventListener('mouseenter', playCardHoverSfx);
        dom.gameBoard.appendChild(card);
    }
}

// Initialize game state
export function initGame(difficulty) {
    gameState.currentDifficulty = difficulty;
    
    // Reset variables
    gameState.cards = [];
    gameState.flippedCards = [];
    gameState.matchedPairs = 0;
    gameState.moves = 0;
    gameState.rightMoves = 0;
    gameState.wrongMoves = 0;
    gameState.isProcessing = true;
    
    // Reset UI
    dom.moveCount.textContent = gameState.moves;
    dom.rightCount.textContent = 0;
    dom.wrongCount.textContent = 0;
    dom.winMessage.classList.add('hidden');
    dom.gameOverMessage.classList.add('hidden');
    
    // Setup cards
    var cardPairs = cardSymbols.concat(cardSymbols);
    gameState.cards = shuffleArray(cardPairs);
    createCards();

    // Reset timer
    clearInterval(gameState.timerInterval);
    
    if (DIFFICULTIES[difficulty].startTime !== null) {
        gameState.timeLeft = DIFFICULTIES[difficulty].startTime;
        updateTimerDisplay();
    } else {
        dom.timerBar.style.width = '100%';
        dom.timerBar.style.backgroundColor = '#48bb78';
    }
}
