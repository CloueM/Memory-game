import { gameState, dom, cardSymbols, DIFFICULTIES, MAX_TIME } from './state.js';
import { shuffleArray } from './utils.js';
import { playCardHoverSfx, playCardFlipSfx, playMatchSfx, playNotMatchSfx, playGameOverSfx, stopTickingSfx } from './audio.js';
import { updateTimerDisplay, triggerGlow } from './timer.js';
import { showWinMessage } from './scoring.js';

export function gameOver() {
    gameState.isProcessing = true; // Disable clicks
    playGameOverSfx();
    dom.gameOverMessage.classList.remove('hidden');
}

export function checkMatch() {
    const [card1, card2] = gameState.flippedCards;
    const symbol1 = card1.dataset.symbol;
    const symbol2 = card2.dataset.symbol;
    
    if (symbol1 === symbol2) {
        // Match found
        playMatchSfx();
        card1.classList.add('matched');
        card2.classList.add('matched');
        gameState.matchedPairs++;
        gameState.rightMoves++;
        dom.rightCount.textContent = gameState.rightMoves;
        
        // Add time bonus
        if (gameState.currentDifficulty !== 'chill') {
            gameState.timeLeft = Math.min(gameState.timeLeft + DIFFICULTIES[gameState.currentDifficulty].modifier, MAX_TIME);
            updateTimerDisplay();
            triggerGlow('green');
        }

        gameState.flippedCards = [];
        gameState.isProcessing = false;
        
        if (gameState.matchedPairs === cardSymbols.length) {
            clearInterval(gameState.timerInterval);
            stopTickingSfx();
            setTimeout(showWinMessage, 500);
        }
    } else {
        // No match
        playNotMatchSfx();
        gameState.wrongMoves++;
        dom.wrongCount.textContent = gameState.wrongMoves;

        if (gameState.currentDifficulty !== 'chill') {
            gameState.timeLeft -= DIFFICULTIES[gameState.currentDifficulty].modifier;
            updateTimerDisplay();
            triggerGlow('red');
            if (gameState.timeLeft <= 0) {
                clearInterval(gameState.timerInterval);
                stopTickingSfx();
                gameOver();
                return; // Stop processing
            }
        }

        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            gameState.flippedCards = [];
            gameState.isProcessing = false;
        }, 1000);
    }
}

export function handleCardClick(event) {
    if (gameState.isProcessing) return;
    
    const card = event.currentTarget;
    
    if (card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
    
    card.classList.add('flipped');
    playCardFlipSfx();
    gameState.flippedCards.push(card);
    
    if (gameState.flippedCards.length === 2) {
        gameState.isProcessing = true;
        gameState.moves++;
        dom.moveCount.textContent = gameState.moves;
        checkMatch();
    }
}

export function createCards() {
    dom.gameBoard.innerHTML = '';
    for (let symbol of gameState.cards) {
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
        card.addEventListener('mouseenter', playCardHoverSfx);
        dom.gameBoard.appendChild(card);
    }
}

export function initGame(difficulty) {
    gameState.currentDifficulty = difficulty;
    gameState.cards = [];
    gameState.flippedCards = [];
    gameState.matchedPairs = 0;
    gameState.moves = 0;
    gameState.rightMoves = 0;
    gameState.wrongMoves = 0;
    gameState.isProcessing = true; // Disable clicks initially (until countdown finishes)
    
    dom.moveCount.textContent = gameState.moves;
    dom.rightCount.textContent = 0;
    dom.wrongCount.textContent = 0;
    dom.winMessage.classList.add('hidden');
    dom.gameOverMessage.classList.add('hidden');
    
    const cardPairs = [...cardSymbols, ...cardSymbols];
    gameState.cards = shuffleArray(cardPairs);
    createCards();

    // Reset timer display but don't start it yet
    clearInterval(gameState.timerInterval);
    if (DIFFICULTIES[difficulty].startTime) {
        gameState.timeLeft = DIFFICULTIES[difficulty].startTime;
        updateTimerDisplay();
    } else {
        dom.timerBar.style.width = '100%';
        dom.timerBar.style.backgroundColor = '#48bb78';
    }
}
