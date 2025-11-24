import { gameState, dom, MAX_TIME, DIFFICULTIES } from './state.js';
import { playGameWonSfx } from './audio.js';

export function calculateScore() {
    const totalMoves = gameState.rightMoves + gameState.wrongMoves;
    const accuracy = totalMoves === 0 ? 0 : (gameState.rightMoves / totalMoves) * 100;
    
    let timeFactor = 100;
    if (gameState.currentDifficulty !== 'chill') {
        timeFactor = (gameState.timeLeft / MAX_TIME) * 100;
    }
    
    // Weighted Score: 60% Accuracy, 40% Time
    let baseScore = (accuracy * 0.6) + (timeFactor * 0.4);
    
    // Apply Difficulty Multiplier
    let final = Math.round(baseScore * DIFFICULTIES[gameState.currentDifficulty].multiplier);
    
    return final;
}

export function showWinMessage() {
    playGameWonSfx();
    const totalMoves = gameState.rightMoves + gameState.wrongMoves;
    const accuracy = totalMoves === 0 ? 0 : (gameState.rightMoves / totalMoves) * 100;
    
    let timeFactor = 100;
    if (gameState.currentDifficulty !== 'chill') {
        timeFactor = (gameState.timeLeft / MAX_TIME) * 100;
    }
    
    const score = calculateScore();
    dom.finalScore.textContent = score;
    
    dom.finalRight.textContent = gameState.rightMoves;
    dom.finalWrong.textContent = gameState.wrongMoves;
    dom.finalTime.textContent = gameState.currentDifficulty === 'chill' ? '∞' : gameState.timeLeft;
    dom.finalMultiplier.textContent = `${DIFFICULTIES[gameState.currentDifficulty].multiplier}x`;
    
    const formulaText = `
        Accuracy: (${gameState.rightMoves}/${totalMoves}) × 100 × 0.6 = ${Math.round(accuracy * 0.6)}
        Time: (${gameState.currentDifficulty === 'chill' ? '∞' : gameState.timeLeft}/${MAX_TIME}) × 100 × 0.4 = ${Math.round(timeFactor * 0.4)}
        Total: (${Math.round(accuracy * 0.6)} + ${Math.round(timeFactor * 0.4)}) × ${DIFFICULTIES[gameState.currentDifficulty].multiplier}x = ${score}
    `;
    dom.scoreFormula.innerText = formulaText;
    
    dom.winMessage.classList.remove('hidden');
}
